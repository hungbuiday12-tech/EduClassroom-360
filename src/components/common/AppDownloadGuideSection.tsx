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
  FlaskConical,
  Dna
} from 'lucide-react';
import { DevicePlatform, usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';
import { getPhysicsSimCounts } from '../../data/physicsDomainsData';
import { PRE_STUDIOS } from '../../data/preLabsData';

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

  const simCounts = getPhysicsSimCounts();

  const fullEcosystemBadges = isEn
    ? [
        { icon: <Compass className="w-3.5 h-3.5 text-sky-400" />, label: 'Math: 2D Plotter & 11 Oxyz 3D' },
        { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, label: `Physics: ${simCounts.domainCount} Domains · 2D & 3D Labs` },
        { icon: <FlaskConical className="w-3.5 h-3.5 text-teal-400" />, label: 'Chemistry: 2006/2018/Chuyen · 2D & 3D' },
        { icon: <Dna className="w-3.5 h-3.5 text-emerald-400" />, label: 'Biology: Cell, DNA & Genetics 2D/3D' },
        { icon: <Code2 className="w-3.5 h-3.5 text-indigo-400" />, label: 'CS: 5 Paths · Sublime 4 & Judge' },
        { icon: <Orbit className="w-3.5 h-3.5 text-cyan-400" />, label: `Synapse Pre · ${PRE_STUDIOS.length} Labs & 30 Builds` }
      ]
    : [
        { icon: <Compass className="w-3.5 h-3.5 text-sky-400" />, label: 'Toán: Đồ thị 2D & 11 Oxyz 3D' },
        { icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, label: `Vật lí: ${simCounts.domainCount} Chuyên đề 2D & 3D` },
        { icon: <FlaskConical className="w-3.5 h-3.5 text-teal-400" />, label: 'Hóa học: 2006/2018/Chuyên · 2D/3D' },
        { icon: <Dna className="w-3.5 h-3.5 text-emerald-400" />, label: 'Sinh học: Tế bào, ADN & Di truyền 2D/3D' },
        { icon: <Code2 className="w-3.5 h-3.5 text-indigo-400" />, label: 'Tin học: 5 Lộ trình + Sublime 4 Judge' },
        { icon: <Orbit className="w-3.5 h-3.5 text-cyan-400" />, label: `Synapse Pre · ${PRE_STUDIOS.length} Lab & 30 Công trình` }
      ];

  return (
    <section id={id} className="cv-auto scroll-mt-24">
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-5 sm:p-8 lg:p-9 shadow-xl overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          {/* Left Column: Cross-Device Guide, Specs & Controls */}
          <div className="lg:col-span-7 space-y-5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>{isEn ? 'CROSS-DEVICE APP INSTALL' : 'HƯỚNG DẪN TẢI APP SYNAPSE'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                LAPTOP · ANDROID · IPHONE
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-tight tracking-tight">
              {isEn
                ? 'Install Synapse App on Laptop, Android & iPhone'
                : 'Cài Ứng Dụng Synapse Cho Laptop, Android & iPhone'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {isEn
                ? 'Run all 5 STEM subjects (Math, Physics, Chemistry, Biology, CS), subject-separated Sandboxes, Synapse Pre 3D labs, and the Exam Bank in a standalone window.'
                : 'Cài đặt trọn bộ 5 môn học Toán · Vật lí · Hóa học · Sinh học · Tin học, các khu Sandbox & Phòng Lab riêng từng môn và Synapse Pre thành ứng dụng độc lập trên mọi thiết bị.'}
            </p>

            {/* Included Capabilities inside the Installed App */}
            {showFeatureMatrix && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {fullEcosystemBadges.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-200 flex items-center gap-2"
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 3 Clean Spec Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-300">
                  <Cpu className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'COMPACT APP SHELL' : 'CỬA SỔ ĐỘC LẬP'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {isEn
                    ? 'Runs in its own app window without browser tab clutter.'
                    : 'Mở cửa sổ riêng gọn gàng, tối ưu GPU 60 FPS trên laptop và điện thoại.'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300">
                  <WifiOff className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'OFFLINE LAB CACHE' : 'LƯU ĐỆM HỌC OFFLINE'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {isEn
                    ? 'Pre-caches 2D/3D engines, formulas, and lessons locally.'
                    : 'Lưu sẵn lõi WebGL 3D, công thức và toàn bộ bài giảng lớp 9–12.'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'CLOUD SYNC' : 'ĐỒNG BỘ TÀI KHOẢN'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {isEn
                    ? 'Syncs progress, roadmap mastery & saved custom models.'
                    : 'Đồng bộ tiến độ, lộ trình học và các mô hình tự tạo ở mọi nơi.'}
                </p>
              </div>
            </div>

            {/* Interactive Device Selector Tabs */}
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
                    accent: 'border-sky-400 bg-sky-500/15 text-white'
                  },
                  {
                    id: 'android',
                    titleVi: 'Android',
                    subVi: 'Chrome · Samsung WebAPK',
                    titleEn: 'Android Phone',
                    subEn: 'Chrome · Samsung WebAPK',
                    icon: <Smartphone className="w-4 h-4 shrink-0" />,
                    accent: 'border-emerald-400 bg-emerald-500/15 text-white'
                  },
                  {
                    id: 'ios',
                    titleVi: 'iPhone / iPad',
                    subVi: 'iOS Safari · Màn hình chính',
                    titleEn: 'iPhone / iPad',
                    subEn: 'iOS Safari Home App',
                    icon: <Tablet className="w-4 h-4 shrink-0" />,
                    accent: 'border-indigo-400 bg-indigo-500/15 text-white'
                  }
                ] as const
              ).map((dev) => {
                const active = appDeviceTab === dev.id;
                return (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => setAppDeviceTab(dev.id)}
                    className={`text-left px-3.5 py-2.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-2.5 ${
                      active
                        ? dev.accent
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
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
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-2.5 text-xs">
              {appDeviceTab === 'desktop' && (
                <>
                  <div className="flex items-center justify-between gap-2 text-sky-300 font-bold">
                    <span className="flex items-center gap-2">
                      <Laptop className="w-4 h-4" />
                      {isEn
                        ? 'Desktop Installation (Windows 10/11 & MacBook)'
                        : 'Cách cài đặt trên Laptop / Máy tính (Windows & MacBook)'}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700">
                      CHROME / EDGE
                    </span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-200 leading-relaxed">
                    <li>
                      {isEn
                        ? 'Click "Install Synapse Now" below (or click the Install App icon on the right of Chrome/Edge URL bar).'
                        : 'Bấm nút "Tải & Cài Đặt Ngay" bên dưới (hoặc bấm biểu tượng Cài đặt ở góc phải thanh địa chỉ Chrome / Edge).'}
                    </li>
                    <li>
                      {isEn
                        ? 'Confirm "Install" — Synapse creates a desktop shortcut & Taskbar/Dock app window.'
                        : 'Chọn "Cài đặt" — Synapse tạo icon trên Desktop & Taskbar/Dock, mở ra cửa sổ độc lập.'}
                    </li>
                    <li>
                      {isEn
                        ? 'Tip: Drag and reposition Focus Timer & study assistant buttons anywhere on your workspace.'
                        : 'Mẹo dùng App: Bạn có thể kéo thả tự do thanh Focus Timer tới bất kỳ góc nào trên màn hình.'}
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
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700">
                      ANDROID 8+
                    </span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-200 leading-relaxed">
                    <li>
                      {isEn
                        ? 'Open this Synapse URL in Google Chrome or Samsung Internet on your Android phone (use "Copy App URL" below if on Laptop).'
                        : 'Mở đường dẫn Synapse bằng trình duyệt Chrome hoặc Samsung Internet trên Android (bấm "Chép Link Tải" nếu đang xem bằng Laptop).'}
                    </li>
                    <li>
                      {isEn
                        ? 'Tap "Install Now" banner or tap Chrome Menu (⋮) → "Install app" / "Add to Home screen".'
                        : 'Chạm "Cài đặt ứng dụng" khi hiện thông báo, hoặc bấm dấu (⋮) góc trên phải Chrome → "Cài đặt ứng dụng".'}
                    </li>
                    <li>
                      {isEn
                        ? 'Open Synapse from your Android App Drawer with full touch 2D/3D labs and front-camera tracking.'
                        : 'Mở Synapse từ khay ứng dụng để vẽ 2D cảm ứng & thực hành mô hình 3D mọi lúc.'}
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
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700">
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
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-sky-300 font-bold">
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
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn ? 'Running in Installed App Mode' : 'Bạn đang dùng phiên bản App đã cài đặt!'}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDirectPwaInstall}
                  disabled={appInstalling}
                  className="px-5 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
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
                onClick={handleCopyLandingUrl}
                className="px-4 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-100 font-semibold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedAppUrl ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-sky-400" />
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
              <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-400/50 text-xs font-semibold text-emerald-200">
                {appInstallNote}
              </div>
            )}
          </div>

          {/* Right Column: Clean Static-Frame Multi-Device Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 min-h-[320px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>{isEn ? 'CROSS-DEVICE SYNC' : 'ĐỒNG BỘ ĐA THIẾT BỊ'}</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-emerald-300">
                  PWA READY
                </span>
              </div>

              {/* Crisp Static Hardware Schematic */}
              <div className="my-4 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 215"
                  className="w-full max-w-[330px] h-52"
                >
                  <rect
                    x="14"
                    y="14"
                    width="292"
                    height="187"
                    rx="6"
                    fill="#020617"
                    stroke="#1e293b"
                    strokeWidth="1.2"
                  />

                  <path
                    d="M 160 88 L 62 128 M 160 88 L 258 128 M 62 152 L 258 152"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.4"
                    strokeDasharray="4 4"
                  />

                  {/* Center Laptop */}
                  <g>
                    <rect
                      x="92"
                      y="26"
                      width="136"
                      height="84"
                      rx="4"
                      fill="#0f172a"
                      stroke={appDeviceTab === 'desktop' ? '#38bdf8' : '#475569'}
                      strokeWidth={appDeviceTab === 'desktop' ? '2' : '1.3'}
                    />
                    <rect x="98" y="32" width="124" height="72" rx="2" fill="#091120" />
                    <polygon points="160,44 182,56 182,80 160,92 138,80 138,56" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
                    <line x1="160" y1="44" x2="160" y2="92" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.8" />
                    <path d="M 78 111 L 242 111 L 250 119 L 70 119 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
                    <text x="160" y="132" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontWeight="700" fontFamily="monospace">
                      LAPTOP · WIN / MAC
                    </text>
                  </g>

                  {/* Left Android Smartphone */}
                  <g>
                    <rect
                      x="32"
                      y="112"
                      width="58"
                      height="82"
                      rx="5"
                      fill="#0f172a"
                      stroke={appDeviceTab === 'android' ? '#34d399' : '#475569'}
                      strokeWidth={appDeviceTab === 'android' ? '2' : '1.3'}
                    />
                    <rect x="37" y="119" width="48" height="65" rx="2" fill="#091517" />
                    <rect x="44" y="127" width="34" height="14" rx="2" fill="#10b981" fillOpacity="0.22" stroke="#34d399" strokeWidth="0.9" />
                    <circle cx="61" cy="160" r="10" fill="none" stroke="#2dd4bf" strokeWidth="1.3" />
                    <circle cx="61" cy="160" r="3.5" fill="#34d399" />
                    <text x="61" y="205" textAnchor="middle" fill="#94a3b8" fontSize="8.2" fontWeight="700" fontFamily="monospace">
                      ANDROID
                    </text>
                  </g>

                  {/* Right iPhone / iPad */}
                  <g>
                    <rect
                      x="230"
                      y="112"
                      width="58"
                      height="82"
                      rx="6"
                      fill="#0f172a"
                      stroke={appDeviceTab === 'ios' ? '#818cf8' : '#475569'}
                      strokeWidth={appDeviceTab === 'ios' ? '2' : '1.3'}
                    />
                    <rect x="235" y="119" width="48" height="65" rx="3" fill="#0f1229" />
                    <rect x="250" y="121" width="18" height="3" rx="1.5" fill="#312e81" />
                    <polygon points="259,134 273,149 259,164 245,149" fill="#6366f1" fillOpacity="0.2" stroke="#a5b4fc" strokeWidth="1.2" />
                    <rect x="249" y="176" width="20" height="2.5" rx="1" fill="#818cf8" />
                    <text x="259" y="205" textAnchor="middle" fill="#94a3b8" fontSize="8.2" fontWeight="700" fontFamily="monospace">
                      IPHONE / IPAD
                    </text>
                  </g>
                </svg>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-300 border-t border-slate-800 pt-3">
                <span>
                  {isEn
                    ? 'One codebase · Standalone app icon on all 3 platforms'
                    : 'Một phiên bản duy nhất · Cài biểu tượng riêng trên cả 3 hệ điều hành'}
                </span>
                <span className="font-mono text-sky-400 font-semibold">PWA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
