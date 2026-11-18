import React from 'react';
import { Camera, Eye, Glasses, MousePointer, ScanEye } from 'lucide-react';
import { HologramDisplayMode } from '../../hooks/useHeadTrackedHologram';
import { useLanguage } from '../../context/LanguageContext';

interface HologramModeControlsProps {
  mode: HologramDisplayMode;
  onChangeMode: (m: HologramDisplayMode) => void;
  camStatus?: 'idle' | 'active' | 'denied';
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
    labelVi: string;
    labelEn: string;
    titleVi: string;
    titleEn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'normal',
      labelVi: '3D Chuẩn',
      labelEn: 'Standard',
      titleVi: 'Góc nhìn 3D tiêu chuẩn',
      titleEn: 'Standard 3D Orbit camera',
      icon: <Eye className="w-3 h-3" />
    },
    {
      id: 'head_cam',
      labelVi: camStatus === 'active' ? 'Hologram Cam ON' : 'Hologram Cam',
      labelEn: camStatus === 'active' ? 'Holo Cam ON' : 'Holo Cam',
      titleVi: 'Theo dõi chuyển động đầu qua Webcam tạo cửa sổ Hologram',
      titleEn: 'Webcam head-tracked off-axis Hologram window',
      icon: <Camera className="w-3 h-3" />
    },
    {
      id: 'head_mouse',
      labelVi: 'Hologram Nghiêng',
      labelEn: 'Holo Parallax',
      titleVi: 'Di chuột tạo chiều sâu cửa sổ Hologram không cần camera',
      titleEn: 'Pointer-driven Hologram window parallax',
      icon: <MousePointer className="w-3 h-3" />
    },
    {
      id: 'anaglyph',
      labelVi: 'Kính Đỏ-Xanh',
      labelEn: 'Anaglyph',
      titleVi: 'Chế độ 3D nổi cho kính Đỏ-Lục/Xanh',
      titleEn: 'Red-Cyan Anaglyph 3D Stereo',
      icon: <Glasses className="w-3 h-3" />
    },
    {
      id: 'vr_stereo',
      labelVi: 'VR Stereo',
      labelEn: 'VR Split',
      titleVi: 'Chia đôi 2 mắt cho kính thực tế ảo VR / Cardboard',
      titleEn: 'Side-by-Side VR Stereo Split View',
      icon: <ScanEye className="w-3 h-3" />
    }
  ];

  return (
    <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-900/90 border border-cyan-500/35 text-[11px]">
      {modes.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChangeMode(m.id)}
            title={isEn ? m.titleEn : m.titleVi}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              active
                ? m.id === 'normal'
                  ? 'bg-slate-700 text-white'
                  : 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {m.icon}
            {!compact && <span>{isEn ? m.labelEn : m.labelVi}</span>}
          </button>
        );
      })}
      {mode === 'head_cam' && camStatus === 'denied' && (
        <span className="px-2 py-0.5 text-[10px] font-mono text-amber-300">
          {isEn ? 'No camera · Use Holo Parallax' : 'Chưa cấp Cam · Dùng Holo Nghiêng'}
        </span>
      )}
    </div>
  );
};
