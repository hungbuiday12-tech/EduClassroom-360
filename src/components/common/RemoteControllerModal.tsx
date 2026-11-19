import React, { useState } from 'react';
import { Check, Copy, ExternalLink, QrCode, RefreshCw, Smartphone, Wifi, WifiOff, X } from 'lucide-react';
import { useRemoteController } from '../../context/RemoteControllerContext';
import { useLanguage } from '../../context/LanguageContext';

export const RemoteControllerModal: React.FC = () => {
  const {
    roomCode,
    pairUrl,
    qrDataUrl,
    wsConnected,
    controllerCount,
    isModalOpen,
    closeModal,
    regenerateRoom
  } = useRemoteController();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [copied, setCopied] = useState(false);

  if (!isModalOpen) return null;

  const handleCopy = () => {
    if (!pairUrl) return;
    navigator.clipboard?.writeText(pairUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <div
      className="fixed inset-0 z-[240] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'QR 3D & Presentation Remote Control' : 'Điều khiển 3D & Thuyết trình từ xa qua QR'}
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[92dvh] flex flex-col rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-md bg-sky-500/15 border border-sky-500/35 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {isEn ? 'Phone Remote Controller (QR)' : 'Điều khiển 3D & Slide bằng Điện thoại'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isEn ? 'Scan QR to turn any phone into a 3D & laser remote' : 'Quét QR để xoay 3D, tách lớp & chuyển slide từ xa'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="min-w-[36px] min-h-[36px] rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
            aria-label={isEn ? 'Close modal' : 'Đóng'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {/* Status Row */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
              {wsConnected ? (
                <Wifi className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <WifiOff className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>
                {wsConnected
                  ? isEn
                    ? 'Relay Ready'
                    : 'Máy chủ đồng bộ sẵn sàng'
                  : isEn
                  ? 'Connecting...'
                  : 'Đang kết nối máy chủ...'}
              </span>
            </span>
            <span
              className={`font-mono font-bold tabular-nums ${
                controllerCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {controllerCount > 0
                ? `${controllerCount} ${isEn ? 'phone active' : 'điện thoại đang kết nối'}`
                : isEn
                ? '0 paired'
                : 'Chưa ghép nối'}
            </span>
          </div>

          {/* QR Code Frame */}
          <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
            {qrDataUrl ? (
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <img src={qrDataUrl} alt={`QR Room ${roomCode}`} className="w-44 h-44 block" />
              </div>
            ) : (
              <div className="w-44 h-44 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            )}

            <div className="text-center space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isEn ? 'Pairing Room Code' : 'Mã phòng ghép nối'}
              </div>
              <div className="text-xl font-mono font-extrabold tracking-widest text-sky-600 dark:text-sky-400 tabular-nums">
                {roomCode}
              </div>
            </div>

            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 min-h-[38px] px-3 py-1.5 rounded-md bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isEn ? 'Copied Link!' : 'Đã chép liên kết!') : isEn ? 'Copy Link' : 'Chép liên kết'}</span>
              </button>
              <button
                type="button"
                onClick={regenerateRoom}
                className="min-h-[38px] px-3 py-1.5 rounded-md bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                title={isEn ? 'Generate new room code' : 'Đổi mã phòng mới'}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isEn ? 'New Code' : 'Mã mới'}</span>
              </button>
            </div>
          </div>

          {/* Feature Checklist */}
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-sky-500" />
              <span>{isEn ? 'What your phone can control remotely:' : 'Tính năng trên tay cầm điện thoại:'}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] sm:text-xs">
              <li>
                {isEn
                  ? 'Tilt Gyroscope or swipe Touchpad to orbit & zoom any 3D model (Math Oxyz, Physics, Code, Synapse Pre, Spatial 3D).'
                  : 'Nghiêng con quay (Gyro) hoặc vuốt cảm ứng để xoay 360° & thu phóng mọi mô hình 3D.'}
              </li>
              <li>
                {isEn
                  ? 'Drag the Explode slider (0–100%), Play/Pause, Reset view, or switch Labs directly from stage.'
                  : 'Kéo thanh tách lớp 3D (0–100%), Play/Pause, Reset góc nhìn hoặc chuyển nhanh phòng mô phỏng.'}
              </li>
              <li>
                {isEn
                  ? 'Switch slides (Prev/Next), project a live red Laser dot on hover, and drag-then-release on phone to click any button on screen.'
                  : 'Bấm chuyển Slide, di chuột hiện ngay chấm Laser đỏ, hoặc trên điện thoại đè tay rê tới đúng nút cần bấm rồi buông tay để tự động Click.'}
              </li>
            </ul>
          </div>

          {pairUrl && (
            <a
              href={pairUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[38px] px-3 py-2 rounded-md border border-sky-500/35 bg-sky-50/70 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isEn ? 'Open Controller Preview in New Tab' : 'Mở thử giao diện Tay cầm ở Tab mới'}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
