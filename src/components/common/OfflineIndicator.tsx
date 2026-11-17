import React from 'react';
import { WifiOff } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWAInstall();
  const { language } = useLanguage();
  const isEn = language === 'en';

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2 px-4 py-2 rounded-md bg-amber-950/95 border border-amber-400/70 text-amber-100 text-xs font-bold shadow-2xl"
    >
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        {isEn
          ? 'Offline mode · Saved lessons & 3D labs work normally; AI features need internet.'
          : 'Đang ngoại tuyến · Bài học & mô hình đã tải vẫn dùng bình thường; AI cần kết nối mạng.'}
      </span>
    </div>
  );
};
