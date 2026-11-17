import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Laptop,
  PlusSquare,
  Share,
  Smartphone,
  Sparkles,
  Tablet,
  WifiOff,
  X
} from 'lucide-react';
import { DevicePlatform, usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from './BrandLogo';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { canNativeInstall, isInstalled, platform, promptInstall } = usePWAInstall();
  const [selectedPlatform, setSelectedPlatform] = useState<DevicePlatform>(platform);
  const [installing, setInstalling] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    setInstalling(true);
    setFeedback(null);
    const outcome = await promptInstall();
    setInstalling(false);
    if (outcome === 'accepted') {
      setFeedback(
        isEn
          ? 'Synapse app installed! You can now launch it right from your home screen or desktop.'
          : 'Đã cài đặt Synapse thành công! Bạn có thể mở trực tiếp từ Màn hình chính hoặc Desktop.'
      );
    } else if (outcome === 'dismissed') {
      setFeedback(
        isEn
          ? 'Installation canceled. You can install anytime from this menu.'
          : 'Bạn đã tạm hủy cài đặt. Có thể bấm cài lại bất cứ lúc nào.'
      );
    }
  };

  const tabs: Array<{ id: DevicePlatform; labelVi: string; labelEn: string; icon: React.ReactNode }> = [
    {
      id: 'desktop',
      labelVi: 'Laptop / PC (Windows & macOS)',
      labelEn: 'Laptop / PC (Win & Mac)',
      icon: <Laptop className="w-4 h-4" />
    },
    {
      id: 'android',
      labelVi: 'Android (Chrome / Samsung)',
      labelEn: 'Android Devices',
      icon: <Smartphone className="w-4 h-4" />
    },
    {
      id: 'ios',
      labelVi: 'iPhone / iPad (iOS Safari)',
      labelEn: 'iPhone / iPad (iOS)',
      icon: <Tablet className="w-4 h-4" />
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[115] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEn ? 'Install Synapse App' : 'Tải & Cài Đặt Ứng Dụng Synapse'}
        className="sci-frame relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo sizeClass="w-10 h-10 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-sky-600 dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'CROSS-DEVICE PWA APP' : 'ỨNG DỤNG ĐA NỀN TẢNG · OFFLINE READY'}</span>
              </div>
              <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
                {isEn
                  ? 'Download & Install Synapse on Any Device'
                  : 'Tải Ứng Dụng Synapse Cho Laptop, Android & iPhone'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status / One-Click Banner */}
          {isInstalled ? (
            <div className="p-3.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                {isEn
                  ? 'Synapse is already running in standalone installed app mode on this device!'
                  : 'Bạn đang chạy Synapse ở chế độ Ứng dụng độc lập (đã cài đặt trên thiết bị này)!'}
              </span>
            </div>
          ) : canNativeInstall ? (
            <div className="p-4 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-600/50 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {isEn
                    ? 'Ready for 1-Click Direct Installation'
                    : 'Trình duyệt sẵn sàng Cài Đặt Trực Tiếp (1 Chạm)'}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isEn
                    ? 'Installs Synapse as a fast native-style window with offline lesson & 3D model caching.'
                    : 'Mở cửa sổ riêng toàn màn hình siêu mượt như phần mềm thật, không tốn dung lượng Store.'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={installing}
                className="cs-deck-btn flex items-center gap-2 px-4 py-2.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{installing ? (isEn ? 'Installing...' : 'Đang cài...') : isEn ? 'Install Now' : 'Tải & Cài Ngay'}</span>
              </button>
            </div>
          ) : null}

          {feedback && (
            <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
              {feedback}
            </div>
          )}

          {/* Platform Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {tabs.map((tab) => {
              const active = selectedPlatform === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPlatform(tab.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-transparent'
                      : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                  }`}
                >
                  {tab.icon}
                  <span>{isEn ? tab.labelEn : tab.labelVi}</span>
                </button>
              );
            })}
          </div>

          {/* Platform Specific Instructions */}
          {selectedPlatform === 'desktop' && (
            <div className="rounded-md bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 text-xs">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-sky-500" />
                <span>
                  {isEn
                    ? 'Install on Laptop / PC (Windows 10/11, macOS, Linux)'
                    : 'Hướng dẫn tải cho Laptop / Máy tính (Windows & macOS)'}
                </span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                <li>
                  {isEn
                    ? 'Open Synapse in Google Chrome, Microsoft Edge, or Cốc Cốc.'
                    : 'Mở web Synapse bằng trình duyệt Chrome, Microsoft Edge hoặc Cốc Cốc.'}
                </li>
                <li>
                  {canNativeInstall
                    ? isEn
                      ? 'Click the blue "Install Now" button right above!'
                      : 'Bấm trực tiếp nút "Tải & Cài Ngay" màu xanh ở phía trên khung này.'
                    : isEn
                    ? 'Click the Install App icon (monitor with downward arrow) at the right end of the address bar, or open Menu (⋮) → "Save and share" → "Install Synapse...".'
                    : 'Bấm biểu tượng Cài đặt (màn hình có mũi tên xuống) ở góc phải thanh địa chỉ URL, hoặc mở Menu (⋮) → "Lưu và chia sẻ" → "Cài đặt Synapse".'}
                </li>
                <li>
                  {isEn
                    ? 'Pin Synapse to your Taskbar / Dock for instant 1-click launch with full 3D WebGL & Camera support.'
                    : 'Ghim biểu tượng Synapse ra Desktop / Taskbar (Windows) hoặc Dock (MacBook) để mở học 3D/2D & IDE toàn màn hình siêu mượt.'}
                </li>
              </ol>
            </div>
          )}

          {selectedPlatform === 'android' && (
            <div className="rounded-md bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 text-xs">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>
                  {isEn
                    ? 'Install on Android Phone & Tablet'
                    : 'Hướng dẫn tải cho Điện thoại / Máy tính bảng Android'}
                </span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                <li>
                  {isEn
                    ? 'Open Synapse in Google Chrome (recommended) or Samsung Internet.'
                    : 'Mở Synapse bằng trình duyệt Chrome hoặc Samsung Internet trên máy Android.'}
                </li>
                <li>
                  {canNativeInstall
                    ? isEn
                      ? 'Tap "Install Now" above or tap Chrome Menu (⋮) → "Install app".'
                      : 'Bấm "Tải & Cài Ngay" ở trên hoặc chạm biểu tượng Menu (⋮) góc trên phải → chọn "Cài đặt ứng dụng" / "Thêm vào màn hình chính".'
                    : isEn
                    ? 'Tap Chrome Menu (⋮) in the top-right corner → Select "Install app" (or "Add to Home screen").'
                    : 'Chạm nút Menu (⋮) ở góc trên bên phải Chrome → Chọn "Cài đặt ứng dụng" (Install app).'}
                </li>
                <li>
                  {isEn
                    ? 'Confirm "Install" — Chrome creates a full WebAPK icon in your App Drawer with front-camera 3D gesture tracking!'
                    : 'Xác nhận "Cài đặt" — Android sẽ tạo App Synapse chính thức trong danh sách ứng dụng, hỗ trợ camera trước & cảm ứng vẽ 2D/3D.'}
                </li>
              </ol>
            </div>
          )}

          {selectedPlatform === 'ios' && (
            <div className="rounded-md bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 text-xs">
              <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Tablet className="w-4 h-4 text-indigo-500" />
                <span>
                  {isEn
                    ? 'Install on iPhone & iPad (iOS / iPadOS Safari)'
                    : 'Hướng dẫn tải cho iPhone / iPad (Trình duyệt Safari)'}
                </span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                <li>
                  {isEn
                    ? 'Open this page in Safari on your iPhone or iPad (Apple requires Safari for Home Screen installation).'
                    : 'Mở trang Synapse bằng trình duyệt Safari mặc định trên iPhone / iPad (iOS yêu cầu cài qua Safari).'}
                </li>
                <li className="flex flex-wrap items-center gap-1.5">
                  <span>{isEn ? 'Tap the Share button' : 'Chạm vào nút Chia sẻ (Share)'}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold">
                    <Share className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {isEn ? 'in the bottom Safari toolbar.' : 'ở thanh dưới màn hình Safari.'}
                  </span>
                </li>
                <li className="flex flex-wrap items-center gap-1.5">
                  <span>{isEn ? 'Scroll down and tap' : 'Cuộn xuống và chọn'}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
                    <PlusSquare className="w-3.5 h-3.5 text-sky-500" />
                    {isEn ? 'Add to Home Screen' : 'Thêm vào MH chính'}
                  </span>
                  <span>→ {isEn ? 'Tap "Add".' : 'Chạm "Thêm" ở góc trên phải.'}</span>
                </li>
              </ol>
            </div>
          )}

          {/* Offline & Camera Note */}
          <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              {isEn
                ? 'Core UI, lessons & 3D/2D labs stay cached for offline use.'
                : 'Giao diện, bài giảng, phòng lab 2D/3D tự động lưu đệm dùng mượt cả khi mạng yếu.'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-800 text-white font-bold cursor-pointer"
            >
              {isEn ? 'Done' : 'Đã hiểu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
