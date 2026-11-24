import React from 'react';
import { Camera, Eye, Glasses, MousePointer, ScanEye } from 'lucide-react';
import { HologramDisplayMode } from '../../hooks/useHeadTrackedHologram';
import { useLanguage } from '../../context/LanguageContext';

interface HologramModeControlsProps {
  mode: HologramDisplayMode;
  onChangeMode: (m: HologramDisplayMode) => void;
  camStatus?: 'idle' | 'requesting' | 'active' | 'denied';
  compact?: boolean;
}

export const HologramModeControls: React.FC<HologramModeControlsProps> = ({
  mode,
  onChangeMode,
  camStatus = 'idle',
  compact = false
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const modes: {
    id: HologramDisplayMode;
    shortVi: string;
    shortEn: string;
    labelVi: string;
    labelEn: string;
    titleVi: string;
    titleEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'normal',
      shortVi: '3D',
      shortEn: '3D',
      labelVi: '3D Chuẩn',
      labelEn: 'Standard',
      titleVi: 'Góc nhìn 3D tiêu chuẩn (Orbit)',
      titleEn: 'Standard 3D Orbit camera',
      icon: <Eye className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'head_cam',
      shortVi: camStatus === 'active' ? 'Cam ON' : camStatus === 'denied' ? 'Cam*' : 'Cam',
      shortEn: camStatus === 'active' ? 'Cam ON' : camStatus === 'denied' ? 'Cam*' : 'Cam',
      labelVi: camStatus === 'active' ? 'Holo Cam ON' : 'Hologram Cam',
      labelEn: camStatus === 'active' ? 'Holo Cam ON' : 'Holo Cam',
      titleVi:
        camStatus === 'denied'
          ? 'Không truy cập được Camera — đang dùng chuột tạo chiều sâu Hologram'
          : 'Theo dõi chuyển động đầu qua Webcam tạo cửa sổ Hologram',
      titleEn:
        camStatus === 'denied'
          ? 'Camera unavailable — using pointer parallax backup'
          : 'Webcam head-tracked off-axis Hologram window',
      icon: <Camera className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'head_mouse',
      shortVi: 'Nghiêng',
      shortEn: 'Parallax',
      labelVi: 'Holo Nghiêng',
      labelEn: 'Holo Parallax',
      titleVi: 'Di chuyển chuột tạo chiều sâu cửa sổ Hologram 3D không cần camera',
      titleEn: 'Pointer-driven Hologram window parallax',
      icon: <MousePointer className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'anaglyph',
      shortVi: 'Đỏ-Xanh',
      shortEn: 'Anaglyph',
      labelVi: 'Kính Đỏ-Xanh',
      labelEn: 'Anaglyph',
      titleVi: 'Chế độ 3D nổi cho kính Đỏ-Lục/Xanh',
      titleEn: 'Red-Cyan Anaglyph 3D Stereo',
      icon: <Glasses className="w-3.5 h-3.5 shrink-0" />
    },
    {
      id: 'vr_stereo',
      shortVi: 'VR',
      shortEn: 'VR',
      labelVi: 'VR Stereo',
      labelEn: 'VR Split',
      titleVi: 'Chia đôi 2 mắt cho kính thực tế ảo VR / Cardboard',
      titleEn: 'Side-by-Side VR Stereo Split View',
      icon: <ScanEye className="w-3.5 h-3.5 shrink-0" />
    }
  ];

  return (
    <div
      className="inline-flex flex-wrap items-center gap-0.5 p-1 rounded-md bg-slate-900/95 border border-cyan-500/35 text-[11px] shadow-lg"
      role="group"
      aria-label={isEn ? 'Hologram Display Modes' : 'Chế độ hiển thị Hologram'}
    >
      {modes.map((m) => {
        const active = mode === m.id;
        const showLabel = !compact || active;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChangeMode(m.id)}
            title={isEn ? m.titleEn : m.titleVi}
            data-testid={`holo-mode-${m.id}`}
            aria-pressed={active}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-[3px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              active
                ? m.id === 'normal'
                  ? 'bg-slate-700 text-white'
                  : 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {m.icon}
            {showLabel && (
              <span>
                {compact ? (isEn ? m.shortEn : m.shortVi) : isEn ? m.labelEn : m.labelVi}
              </span>
            )}
          </button>
        );
      })}
      {mode === 'head_cam' && camStatus === 'denied' && (
        <button
          type="button"
          onClick={() => onChangeMode('head_mouse')}
          className="px-2 py-1 rounded-[3px] bg-amber-500/20 border border-amber-400/50 text-[10px] font-semibold text-amber-200 hover:bg-amber-500/30 transition-colors cursor-pointer whitespace-nowrap"
          title={isEn ? 'Switch to Pointer Hologram Parallax' : 'Chuyển sang Hologram Nghiêng bằng chuột'}
        >
          {isEn ? 'Use Parallax' : 'Dùng Holo Nghiêng'}
        </button>
      )}
    </div>
  );
};
