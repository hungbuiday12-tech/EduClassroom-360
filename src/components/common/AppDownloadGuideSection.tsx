import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  Laptop,
  PlusSquare,
  Share,
  ShieldCheck,
  Smartphone,
  Tablet,
  WifiOff,
  Compass,
  Zap,
  Code2,
  Orbit,
  Hand,
  Sparkles
} from 'lucide-react';
import { DevicePlatform, usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';

interface AppDownloadGuideSectionProps {
  id: string;
  onOpenInstallApp?: () => void;
  showFeatureMatrix?: boolean;
}

export const AppDownloadGuideSection: React.FC<AppDownloadGuideSectionProps> = ({
  id,
  onOpenInstallApp,
  showFeatureMatrix = true
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    canNativeInstall: canPwaInstall,
    isInstalled: isPwaInstalled,
    platform: detectedDevicePlatform,
    promptInstall: triggerPwaInstall
  } = usePWAInstall();

  const [appDeviceTab, setAppDeviceTab] = useState<DevicePlatform>(detectedDevicePlatform);
  const [appInstalling, setAppInstalling] = useState(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);
  const [appInstallNote, setAppInstallNote] = useState<string | null>(null);

  useEffect(() => {
    setAppDeviceTab(detectedDevicePlatform);
  }, [detectedDevicePlatform]);

  const handleDirectPwaInstall = async () => {
    if (!canPwaInstall) {
      onOpenInstallApp?.();
      return;
    }
    setAppInstalling(true);
    setAppInstallNote(null);
    const outcome = await triggerPwaInstall();
    setAppInstalling(false);
    if (outcome === 'accepted') {
      setAppInstallNote(
        isEn
          ? 'Synapse app installed! Open it straight from your Desktop, Dock, or Home Screen.'
          : 'Cài đặt thành công! Mở ngay Synapse từ Desktop, Taskbar hoặc Màn hình chính.'
      );
    } else if (outcome === 'unavailable') {
      onOpenInstallApp?.();
    }
  };

  const handleCopyLandingUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedAppUrl(true);
      window.setTimeout(() => setCopiedAppUrl(false), 2200);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const fullEcosystemBadges = isEn
    ? [
        { icon: <Compass className="w-3.5 h-3.5 text-sky-300" />, label: 'Math 2D Graphs & 8 Oxyz 3D' },
        { icon: <Zap className="w-3.5 h-3.5 text-amber-300" />, label: 'Physics 5 Domains · 41 2D + 32 3D' },
        { icon: <Code2 className="w-3.5 h-3.5 text-emerald-300" />, label: 'CS 5 Paths · Sublime 4 & Judge' },
        { icon: <Orbit className="w-3.5 h-3.5 text-cyan-300" />, label: 'Synapse v2 · 30 3D Megastructures' },
        { icon: <Hand className="w-3.5 h-3.5 text-teal-300" />, label: 'Spatial 3D · 10-Finger + Free 2D Draw' },
        { icon: <Sparkles className="w-3.5 h-3.5 text-indigo-300" />, label: 'Syn AI ×3 · Exams · Arena · Forum' }
      ]
    : [
        { icon: <Compass className="w-3.5 h-3.5 text-sky-300" />, label: 'Toán: Đồ thị 2D & 8 Oxyz 3D' },
        { icon: <Zap className="w-3.5 h-3.5 text-amber-300" />, label: 'Vật lí: 5 Chuyên đề · 41 Lab 2D + 32 Lab 3D' },
        { icon: <Code2 className="w-3.5 h-3.5 text-emerald-300" />, label: 'Tin học: 5 Lộ trình + Sublime Text 4 Judge' },
        { icon: <Orbit className="w-3.5 h-3.5 text-cyan-300" />, label: 'Lớp ảo Synapse v2 · 30 Đại công trình 3D' },
        { icon: <Hand className="w-3.5 h-3.5 text-teal-300" />, label: 'Học cảm giác 3D · 10 ngón & 2D Tự do tạo' },
        { icon: <Sparkles className="w-3.5 h-3.5 text-indigo-300" />, label: 'Syn AI ×3 · Đề thi · Thi đấu · Diễn đàn' }
      ];

  return (
    <section id={id} className="cv-auto scroll-mt-24">
      <div className="sci-frame relative overflow-hidden rounded-md p-[1.5px] bg-gradient-to-br from-cyan-400/75 via-blue-500/45 to-emerald-400/75 shadow-2xl">
        <div className="relative rounded-md bg-slate-950/95 p-5 sm:p-8 lg:p-9 overflow-hidden">
          {/* Architectural Corner Reticles */}
          <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400/75" />
          <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400/75" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400/75" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400/75" />

          {/* GPU-Composited Horizontal Laser Scanner */}
          <span
            aria-hidden="true"
            className="app-scan-beam pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/12 to-transparent -skew-x-12"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
            {/* Left Column: Detailed Cross-Device Guide, Specs & Controls */}
            <div className="lg:col-span-7 space-y-5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-400/45 text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-200 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{isEn ? 'SYNAPSE NATIVE APP EDITION' : 'HƯỚNG DẪN TẢI APP SYNAPSE ĐA THIẾT BỊ'}</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-400/40 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-200">
                  LAPTOP · ANDROID · IPHONE
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight tracking-tight">
                {isEn
                  ? 'Install Synapse App on Laptop, Android & iPhone'
                  : 'Tải Ứng Dụng Học Tập Synapse Cho Laptop, Android & iPhone'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {isEn
                  ? 'Run the full STEM universe (Math 2D/Oxyz 3D, Physics 2D/3D Labs, CS 5 Paths & Sublime Text 4 IDE, Synapse v2 30 chambers, 10-finger Spatial 3D & Syn AI) as an independent standalone app.'
                  : 'Cài đặt trọn bộ ứng dụng học tập Toán · Vật lí · Tin học, phòng mô phỏng 3D thực tiễn, Lớp ảo Synapse v2, Học cảm giác 10 ngón tay & Syn AI thành app độc lập cực mượt trên mọi thiết bị.'}
              </p>

              {/* Included Capabilities inside the Installed App */}
              {showFeatureMatrix && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {fullEcosystemBadges.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-2 rounded bg-slate-900/90 border border-slate-700/80 text-[11px] font-medium text-slate-200 flex items-center gap-2"
                    >
                      <span className="shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 3 Square Spec Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="rounded-md bg-slate-900/90 border border-slate-700/80 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-300">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'ZERO BLOAT · < 5 MB' : 'SIÊU NHẸ · < 5 MB'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isEn
                      ? 'Runs standalone window cleanly with 60 FPS GPU compositing.'
                      : 'Chạy cửa sổ riêng không thanh địa chỉ, tối ưu GPU 60 FPS trên laptop & ĐT.'}
                  </p>
                </div>
                <div className="rounded-md bg-slate-900/90 border border-slate-700/80 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300">
                    <WifiOff className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'OFFLINE LAB CACHE' : 'LƯU ĐỆM HỌC OFFLINE'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isEn
                      ? 'Pre-caches MediaPipe WASM, lessons & custom 3D viewer engine.'
                      : 'Lưu sẵn lõi WebGL 3D, nhận diện 10 ngón tay & toàn bộ bài giảng 9–12.'}
                  </p>
                </div>
                <div className="rounded-md bg-slate-900/90 border border-slate-700/80 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{isEn ? 'LIVE CLOUD SYNC' : 'ĐỒNG BỘ TỨC THỜI'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isEn
                      ? 'Syncs XP, smart roadmap analytics & 3D custom models everywhere.'
                      : 'Đồng bộ XP, Bản đồ tri thức thông minh & mô hình 3D tự tạo mọi lúc.'}
                  </p>
                </div>
              </div>

              {/* Interactive Square Device Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(
                  [
                    {
                      id: 'desktop',
                      titleVi: 'Laptop / PC',
                      subVi: 'Windows 10/11 · macOS',
                      titleEn: 'Laptop / PC',
                      subEn: 'Windows · macOS · Linux',
                      icon: <Laptop className="w-4 h-4 shrink-0" />,
                      accent: 'border-cyan-400 bg-cyan-500/20 text-white'
                    },
                    {
                      id: 'android',
                      titleVi: 'Android',
                      subVi: 'Chrome · Samsung WebAPK',
                      titleEn: 'Android Phone',
                      subEn: 'Chrome · Samsung WebAPK',
                      icon: <Smartphone className="w-4 h-4 shrink-0" />,
                      accent: 'border-emerald-400 bg-emerald-500/20 text-white'
                    },
                    {
                      id: 'ios',
                      titleVi: 'iPhone / iPad',
                      subVi: 'iOS Safari · Màn hình chính',
                      titleEn: 'iPhone / iPad',
                      subEn: 'iOS Safari Home App',
                      icon: <Tablet className="w-4 h-4 shrink-0" />,
                      accent: 'border-indigo-400 bg-indigo-500/20 text-white'
                    }
                  ] as const
                ).map((dev) => {
                  const active = appDeviceTab === dev.id;
                  return (
                    <button
                      key={dev.id}
                      type="button"
                      data-ripple="true"
                      onClick={() => setAppDeviceTab(dev.id)}
                      className={`text-left px-3.5 py-2.5 rounded-md border transition-all cursor-pointer flex items-center gap-2.5 ${
                        active
                          ? `${dev.accent} shadow-lg`
                          : 'bg-slate-900/75 border-slate-700/80 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                      }`}
                    >
                      {dev.icon}
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">
                          {isEn ? dev.titleEn : dev.titleVi}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {isEn ? dev.subEn : dev.subVi}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Step-by-Step Guide Card for Selected Device */}
              <div className="rounded-md bg-slate-900/95 border border-cyan-500/35 p-4 space-y-2.5 text-xs">
                {appDeviceTab === 'desktop' && (
                  <>
                    <div className="flex items-center justify-between gap-2 text-cyan-300 font-bold">
                      <span className="flex items-center gap-2">
                        <Laptop className="w-4 h-4" />
                        {isEn
                          ? 'Desktop Installation (Windows 10/11 & MacBook)'
                          : 'Cách cài đặt trên Laptop / Máy tính (Windows & MacBook)'}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/35">
                        CHROME / EDGE
                      </span>
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-200 leading-relaxed">
                      <li>
                        {isEn
                          ? 'Click "Install on This Device" below (or click the Monitor+Arrow icon on the right of Chrome/Edge URL bar).'
                          : 'Bấm nút "Tải & Cài Đặt Ngay" bên dưới (hoặc bấm biểu tượng Màn hình có mũi tên xuống ở góc phải thanh địa chỉ Chrome / Edge).'}
                      </li>
                      <li>
                        {isEn
                          ? 'Confirm "Install" — Synapse creates a desktop shortcut & Taskbar/Dock app with dedicated GPU window.'
                          : 'Chọn "Cài đặt" — Synapse tạo icon trên Desktop & Taskbar/Dock, mở ra cửa sổ độc lập siêu mượt như phần mềm gốc.'}
                      </li>
                      <li>
                        {isEn
                          ? 'Tip: Drag and reposition Focus Timer & Syn AI floating buttons anywhere on your workspace.'
                          : 'Mẹo dùng App: Bạn có thể kéo thả tự do 2 nút Góc tập trung và Syn AI tới bất kỳ góc nào trên màn hình.'}
                      </li>
                    </ol>
                  </>
                )}

                {appDeviceTab === 'android' && (
                  <>
                    <div className="flex items-center justify-between gap-2 text-emerald-300 font-bold">
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        {isEn
                          ? 'Android Phone & Tablet Installation (WebAPK)'
                          : 'Cách tải cho Điện thoại & Tablet Android'}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/35">
                        ANDROID 8+
                      </span>
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-200 leading-relaxed">
                      <li>
                        {isEn
                          ? 'Open this Synapse URL in Google Chrome or Samsung Internet on your Android phone (use "Copy Link" below if currently on Laptop).'
                          : 'Mở đường dẫn Synapse bằng trình duyệt Chrome hoặc Samsung Internet trên điện thoại Android (bấm "Chép Link Gửi ĐT" nếu bạn đang xem bằng Laptop).'}
                      </li>
                      <li>
                        {isEn
                          ? 'Tap "Install Now" banner or tap Chrome Menu (⋮) → "Install app" / "Add to Home screen".'
                          : 'Chạm trực tiếp "Cài đặt ứng dụng" khi hiện thông báo, hoặc bấm dấu (⋮) góc trên phải Chrome → chọn "Cài đặt ứng dụng".'}
                      </li>
                      <li>
                        {isEn
                          ? 'Open Synapse from your Android App Drawer with full touch 2D drawing & front-camera 3D tracking.'
                          : 'Mở App Synapse từ khay ứng dụng: vẽ tự do 2D bằng ngón tay & điều khiển mô hình 3D qua camera trước.'}
                      </li>
                    </ol>
                  </>
                )}

                {appDeviceTab === 'ios' && (
                  <>
                    <div className="flex items-center justify-between gap-2 text-indigo-300 font-bold">
                      <span className="flex items-center gap-2">
                        <Tablet className="w-4 h-4" />
                        {isEn
                          ? 'iPhone & iPad Installation (iOS / iPadOS Safari)'
                          : 'Cách tải cho iPhone & iPad (Trình duyệt Safari)'}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-400/35">
                        IOS SAFARI
                      </span>
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-200 leading-relaxed">
                      <li>
                        {isEn
                          ? 'Open Synapse in Safari on your iPhone or iPad (Apple requires Safari for Home Screen Web Apps).'
                          : 'Mở liên kết Synapse bằng trình duyệt Safari trên iPhone / iPad (iOS yêu cầu cài qua Safari).'}
                      </li>
                      <li className="flex flex-wrap items-center gap-1.5">
                        <span>{isEn ? 'Tap the Share icon' : 'Chạm nút Chia sẻ (Share)'}</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-500/25 border border-sky-400/40 text-sky-200 font-bold">
                          <Share className="w-3.5 h-3.5" />
                        </span>
                        <span>{isEn ? 'at the bottom bar of Safari.' : 'ở thanh công cụ dưới cùng.'}</span>
                      </li>
                      <li className="flex flex-wrap items-center gap-1.5">
                        <span>{isEn ? 'Scroll down and tap' : 'Cuộn xuống chọn'}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-white font-bold">
                          <PlusSquare className="w-3.5 h-3.5 text-cyan-400" />
                          {isEn ? 'Add to Home Screen' : 'Thêm vào MH chính'}
                        </span>
                        <span>→ {isEn ? 'Tap "Add".' : 'Chạm "Thêm" góc trên phải.'}</span>
                      </li>
                    </ol>
                  </>
                )}
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {isPwaInstalled ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {isEn ? 'Running in Installed App Mode' : 'Bạn đang dùng phiên bản App đã cài đặt!'}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={handleDirectPwaInstall}
                    disabled={appInstalling}
                    className="cs-deck-btn px-5 py-3 rounded-md bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {appInstalling
                        ? isEn
                          ? 'Installing...'
                          : 'Đang cài đặt...'
                        : canPwaInstall
                        ? isEn
                          ? 'Install Synapse Now (1-Click)'
                          : 'Tải & Cài Đặt Ngay (1 Chạm)'
                        : isEn
                        ? 'Open Quick Install Guide'
                        : 'Mở Trình Hướng Dẫn Cài Đặt'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  data-ripple="true"
                  onClick={handleCopyLandingUrl}
                  className="cs-deck-btn px-4 py-3 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-600 hover:border-cyan-400 text-slate-100 font-semibold text-xs flex items-center gap-2 cursor-pointer"
                >
                  {copiedAppUrl ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyan-400" />
                  )}
                  <span>
                    {copiedAppUrl
                      ? isEn
                        ? 'App Link Copied!'
                        : 'Đã chép link cài đặt!'
                      : isEn
                      ? 'Copy App URL for Phone'
                      : 'Chép Link Tải Cho Điện Thoại'}
                  </span>
                </button>
              </div>

              {appInstallNote && (
                <div className="p-3 rounded-md bg-emerald-500/15 border border-emerald-400/50 text-xs font-semibold text-emerald-200">
                  {appInstallNote}
                </div>
              )}
            </div>

            {/* Right Column: Grand Square-Framed Animated Multi-Device Blueprint Stage */}
            <div className="lg:col-span-5">
              <div className="relative rounded-md border border-cyan-400/40 bg-[#040918] p-5 overflow-hidden min-h-[320px] flex flex-col justify-between shadow-inner">
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                  <span>MULTI-DEVICE SYNC MATRIX</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/40 text-emerald-300">
                    PWA 360° READY
                  </span>
                </div>

                {/* GPU-Composited Animated Hardware Triad SVG */}
                <div className="relative z-10 my-3 flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 320 215"
                    className="w-full max-w-[330px] h-52"
                  >
                    <defs>
                      <linearGradient id={`synScreenGrad-${id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.16" />
                      </linearGradient>
                      <radialGradient id={`synStageAura-${id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <circle cx="160" cy="108" r="88" fill={`url(#synStageAura-${id})`} />
                    <rect
                      x="14"
                      y="14"
                      width="292"
                      height="187"
                      rx="4"
                      fill="none"
                      stroke="#38bdf8"
                      strokeOpacity="0.16"
                      strokeDasharray="4 4"
                    />

                    <path
                      d="M 160 88 L 62 128 M 160 88 L 258 128 M 62 152 L 258 152"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.6"
                      strokeOpacity="0.7"
                      className="app-telemetry-flow"
                    />

                    {/* Center Laptop Blueprint */}
                    <g className="app-device-float-a">
                      <rect
                        x="92"
                        y="26"
                        width="136"
                        height="84"
                        rx="4"
                        fill="#09152b"
                        stroke={appDeviceTab === 'desktop' ? '#22d3ee' : '#38bdf8'}
                        strokeWidth={appDeviceTab === 'desktop' ? '2.2' : '1.4'}
                      />
                      <rect x="98" y="32" width="124" height="72" rx="2" fill={`url(#synScreenGrad-${id})`} />
                      <polygon points="160,44 182,56 182,80 160,92 138,80 138,56" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
                      <line x1="160" y1="44" x2="160" y2="92" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.8" />
                      <line x1="138" y1="56" x2="182" y2="80" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.6" />
                      <line x1="182" y1="56" x2="138" y2="80" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.6" />
                      <path d="M 78 111 L 242 111 L 250 119 L 70 119 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
                      <text x="160" y="132" textAnchor="middle" fill="#7dd3fc" fontSize="8.5" fontWeight="700" fontFamily="monospace">
                        LAPTOP · WIN / MAC
                      </text>
                    </g>

                    {/* Left Android Smartphone */}
                    <g className="app-device-float-b">
                      <rect
                        x="32"
                        y="112"
                        width="58"
                        height="82"
                        rx="5"
                        fill="#07181c"
                        stroke={appDeviceTab === 'android' ? '#34d399' : '#10b981'}
                        strokeWidth={appDeviceTab === 'android' ? '2.2' : '1.4'}
                      />
                      <rect x="37" y="119" width="48" height="65" rx="2" fill="#0d292a" />
                      <rect x="44" y="127" width="34" height="14" rx="1.5" fill="#10b981" fillOpacity="0.32" stroke="#34d399" strokeWidth="0.9" />
                      <circle cx="61" cy="160" r="11" fill="none" stroke="#2dd4bf" strokeWidth="1.3" />
                      <circle cx="61" cy="160" r="4" fill="#34d399" />
                      <text x="61" y="205" textAnchor="middle" fill="#6ee7b7" fontSize="8.2" fontWeight="700" fontFamily="monospace">
                        ANDROID
                      </text>
                    </g>

                    {/* Right iPhone / iPad */}
                    <g className="app-device-float-b" style={{ animationDelay: '0.8s' }}>
                      <rect
                        x="230"
                        y="112"
                        width="58"
                        height="82"
                        rx="6"
                        fill="#0e112b"
                        stroke={appDeviceTab === 'ios' ? '#818cf8' : '#6366f1'}
                        strokeWidth={appDeviceTab === 'ios' ? '2.2' : '1.4'}
                      />
                      <rect x="235" y="119" width="48" height="65" rx="3" fill="#15193d" />
                      <rect x="250" y="121" width="18" height="3" rx="1.5" fill="#312e81" />
                      <polygon points="259,134 273,149 259,164 245,149" fill="#6366f1" fillOpacity="0.28" stroke="#a5b4fc" strokeWidth="1.2" />
                      <rect x="249" y="176" width="20" height="2.5" rx="1" fill="#818cf8" />
                      <text x="259" y="205" textAnchor="middle" fill="#c7d2fe" fontSize="8.2" fontWeight="700" fontFamily="monospace">
                        IPHONE / IPAD
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] text-slate-300 border-t border-white/10 pt-2.5">
                  <span>
                    {isEn
                      ? 'One codebase · Standalone app icon on all 3 platforms'
                      : 'Một bản duy nhất · Cài icon riêng trên cả 3 hệ điều hành'}
                  </span>
                  <span className="font-mono text-cyan-300 font-semibold">PWA v4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
