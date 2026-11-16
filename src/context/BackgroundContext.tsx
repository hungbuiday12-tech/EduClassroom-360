import React, { createContext, useContext, useEffect, useState } from 'react';

export type BackgroundCreatureTheme =
  | 'koi'
  | 'dragon'
  | 'birds'
  | 'butterflies'
  | 'jellyfish'
  | 'turtles'
  | 'fireflies'
  | 'all'
  | 'galaxy';

export type PerformanceMode = 'smooth' | 'balanced' | 'ultra';

export type BackgroundStyle =
  | 'minimal_solid'
  | 'studio_grid'
  | 'blueprint_tech'
  | 'aurora_clean'
  | 'cosmic_galaxy';

export interface BackgroundStyleOption {
  id: BackgroundStyle;
  labelVi: string;
  labelEn: string;
  specBadgeVi: string;
  specBadgeEn: string;
  descVi: string;
  descEn: string;
  recommendedPerf: PerformanceMode;
  previewGradient: string;
}

export const BACKGROUND_STYLE_OPTIONS: BackgroundStyleOption[] = [
  {
    id: 'minimal_solid',
    labelVi: 'Ánh Sáng Chuyển Động Nhẹ (Siêu Mượt)',
    labelEn: 'Ambient Drift (Ultra Light)',
    specBadgeVi: 'Máy yếu · Văn phòng · Tiết kiệm pin',
    specBadgeEn: 'Low-Spec · Battery Saver',
    descVi: 'Nền chuyển sắc dịu mắt với luồng sáng trôi nhẹ nhàng, giữ 60 FPS tuyệt đối trên máy cấu hình thấp.',
    descEn: 'Ultra-light gently drifting ambient glow optimized for low-spec hardware.',
    recommendedPerf: 'smooth',
    previewGradient: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)'
  },
  {
    id: 'studio_grid',
    labelVi: 'Lưới Sóng Studio Động',
    labelEn: 'Kinetic Studio Dot Wave',
    specBadgeVi: 'Laptop phổ thông · Sóng chấm động',
    specBadgeEn: 'Standard Laptop · Kinetic Grid',
    descVi: 'Mạng lưới chấm kỹ thuật dao động theo sóng giao thoa mượt mà, tăng cảm hứng học tập.',
    descEn: 'Architectural dot-matrix surface animated with smooth harmonic wave interference.',
    recommendedPerf: 'smooth',
    previewGradient: 'radial-gradient(circle at 25% 25%, #bae6fd 0%, #f1f5f9 55%, #e2e8f0 100%)'
  },
  {
    id: 'blueprint_tech',
    labelVi: 'Bản Vẽ Kỹ Thuật STEM Động',
    labelEn: 'Live Engineering Blueprint',
    specBadgeVi: 'Máy tầm trung · Tọa độ & Radar quét',
    specBadgeEn: 'Mid-Spec · Panning STEM Grid',
    descVi: 'Hệ tọa độ Oxy trôi mượt với tia quét hiệu chuẩn và các nút vector phát sáng.',
    descEn: 'Live panning coordinate blueprint grid with calibration sweep and vector nodes.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #0b162c 0%, #0f294a 55%, #091326 100%)'
  },
  {
    id: 'aurora_clean',
    labelVi: 'Tinh Vân Sao Rơi Sống Động',
    labelEn: 'Drifting Starlight Horizon',
    specBadgeVi: 'Laptop i5/Ryzen 5 · Sao băng & Tinh vân',
    specBadgeEn: 'Mid-High Spec · Starlight',
    descVi: 'Bầu trời sao chuyển động mượt cùng sao băng lướt nhẹ, không có sinh vật bơi.',
    descEn: 'Drifting starfield, shooting stars, and soft horizon glow without swimming creatures.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #07142b 0%, #0e3a5c 50%, #082032 100%)'
  },
  {
    id: 'cosmic_galaxy',
    labelVi: 'Vũ Trụ & Hệ Sinh Thái Full Động',
    labelEn: 'Living Galaxy & Creatures',
    specBadgeVi: 'Full hiệu ứng · Tương tác chạm sóng',
    specBadgeEn: 'Full Dynamic · Interactive',
    descVi: 'Bầu trời ngân hà chuyển động toàn phần cùng đàn sinh vật và hiệu ứng gợn sóng khi chạm.',
    descEn: 'Full interactive starfield, nebula, ripples, and responsive background creatures.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #04091a 0%, #1d4ed8 45%, #0d9488 100%)'
  }
];

export interface PerformanceModeOption {
  id: PerformanceMode;
  labelVi: string;
  labelEn: string;
  shortVi: string;
  shortEn: string;
  descVi: string;
  descEn: string;
}

export const PERFORMANCE_MODE_OPTIONS: PerformanceModeOption[] = [
  {
    id: 'smooth',
    labelVi: 'Mượt Tối Đa (Máy yếu / 60 FPS)',
    labelEn: 'Max Smooth (Low-Spec / 60 FPS)',
    shortVi: 'Mượt FPS',
    shortEn: 'Smooth',
    descVi: 'Tối ưu bộ nhớ đệm Canvas, tắt blur GPU nặng để giữ tốc độ phản hồi nhanh nhất.',
    descEn: 'Caches Canvas layers & trims heavy GPU blur for instant responsiveness.'
  },
  {
    id: 'balanced',
    labelVi: 'Cân Bằng (Laptop phổ thông)',
    labelEn: 'Balanced (Standard Laptop)',
    shortVi: 'Cân bằng',
    shortEn: 'Balanced',
    descVi: 'Cân bằng độ nét Retina và mức tiêu thụ CPU/pin hợp lý.',
    descEn: 'Balances crisp visuals with modest CPU and battery usage.'
  },
  {
    id: 'ultra',
    labelVi: 'Chi Tiết Cao (GPU rời / PC mạnh)',
    labelEn: 'High Detail (Dedicated GPU)',
    shortVi: 'Chi tiết cao',
    shortEn: 'High Detail',
    descVi: 'Hiển thị đầy đủ mật độ hạt, ánh sáng kính mờ sâu và tốc độ quét màn hình gốc.',
    descEn: 'Full particle density, deep glass blur, and native refresh rate.'
  }
];

export interface CreatureThemeOption {
  id: BackgroundCreatureTheme;
  labelVi: string;
  labelEn: string;
  shortVi: string;
  shortEn: string;
}

export const CREATURE_THEME_OPTIONS: CreatureThemeOption[] = [
  {
    id: 'all',
    labelVi: 'Hệ Sinh Thái Tổng Hợp (Nhiều Loài)',
    labelEn: 'Full Ecosystem (All Creatures)',
    shortVi: 'Nhiều loài',
    shortEn: 'All Mix'
  },
  {
    id: 'koi',
    labelVi: 'Cá Koi Thiên Hà',
    labelEn: 'Cosmic Koi Fish',
    shortVi: 'Cá Koi',
    shortEn: 'Koi Fish'
  },
  {
    id: 'jellyfish',
    labelVi: 'Sứa Phát Sáng Biển Sâu',
    labelEn: 'Bioluminescent Jellyfish',
    shortVi: 'Sứa sáng',
    shortEn: 'Jellyfish'
  },
  {
    id: 'turtles',
    labelVi: 'Rùa Biển Tinh Tú',
    labelEn: 'Celestial Sea Turtles',
    shortVi: 'Rùa biển',
    shortEn: 'Sea Turtles'
  },
  {
    id: 'dragon',
    labelVi: 'Rồng Vũ Trụ & Ngọc Sáng',
    labelEn: 'Celestial Dragon',
    shortVi: 'Rồng',
    shortEn: 'Dragon'
  },
  {
    id: 'birds',
    labelVi: 'Đàn Chim Hải Âu & Phượng',
    labelEn: 'Soaring Birds',
    shortVi: 'Chim',
    shortEn: 'Birds'
  },
  {
    id: 'butterflies',
    labelVi: 'Bướm Tinh Tú Lấp Lánh',
    labelEn: 'Starlight Butterflies',
    shortVi: 'Bướm',
    shortEn: 'Butterflies'
  },
  {
    id: 'fireflies',
    labelVi: 'Đom Đóm Rừng Sao',
    labelEn: 'Starlight Fireflies',
    shortVi: 'Đom đóm',
    shortEn: 'Fireflies'
  },
  {
    id: 'galaxy',
    labelVi: 'Dải Ngân Hà Thuần',
    labelEn: 'Pure Galaxy Stars',
    shortVi: 'Ngân Hà',
    shortEn: 'Galaxy'
  }
];

const VALID_THEMES: BackgroundCreatureTheme[] = [
  'koi',
  'dragon',
  'birds',
  'butterflies',
  'jellyfish',
  'turtles',
  'fireflies',
  'all',
  'galaxy'
];

const VALID_PERF_MODES: PerformanceMode[] = ['smooth', 'balanced', 'ultra'];

const VALID_BG_STYLES: BackgroundStyle[] = [
  'minimal_solid',
  'studio_grid',
  'blueprint_tech',
  'aurora_clean',
  'cosmic_galaxy'
];

interface BackgroundContextValue {
  creatureTheme: BackgroundCreatureTheme;
  setCreatureTheme: (theme: BackgroundCreatureTheme) => void;
  perfMode: PerformanceMode;
  setPerfMode: (mode: PerformanceMode) => void;
  bgStyle: BackgroundStyle;
  setBgStyle: (style: BackgroundStyle, syncRecommendedPerf?: boolean) => void;
}

const STORAGE_KEY = 'educlassroom_bg_creature';
const PERF_STORAGE_KEY = 'educlassroom_perf_mode_v1';
const BG_STYLE_STORAGE_KEY = 'educlassroom_bg_style_v1';

const BackgroundContext = createContext<BackgroundContextValue>({
  creatureTheme: 'all',
  setCreatureTheme: () => {},
  perfMode: 'smooth',
  setPerfMode: () => {},
  bgStyle: 'cosmic_galaxy',
  setBgStyle: () => {}
});

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [creatureTheme, setCreatureThemeState] = useState<BackgroundCreatureTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as BackgroundCreatureTheme | null;
      if (saved && VALID_THEMES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'all';
  });

  const [perfMode, setPerfModeState] = useState<PerformanceMode>(() => {
    try {
      const saved = localStorage.getItem(PERF_STORAGE_KEY) as PerformanceMode | null;
      if (saved && VALID_PERF_MODES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'smooth';
  });

  const [bgStyle, setBgStyleState] = useState<BackgroundStyle>(() => {
    try {
      const saved = localStorage.getItem(BG_STYLE_STORAGE_KEY) as BackgroundStyle | null;
      if (saved && VALID_BG_STYLES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'cosmic_galaxy';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.perf = perfMode;
    }
  }, [perfMode]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.bgStyle = bgStyle;
    }
  }, [bgStyle]);

  const setCreatureTheme = (theme: BackgroundCreatureTheme) => {
    setCreatureThemeState(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  };

  const setPerfMode = (mode: PerformanceMode) => {
    setPerfModeState(mode);
    try {
      localStorage.setItem(PERF_STORAGE_KEY, mode);
    } catch {}
  };

  const setBgStyle = (style: BackgroundStyle, syncRecommendedPerf = false) => {
    setBgStyleState(style);
    try {
      localStorage.setItem(BG_STYLE_STORAGE_KEY, style);
    } catch {}
    if (syncRecommendedPerf) {
      const opt = BACKGROUND_STYLE_OPTIONS.find((o) => o.id === style);
      if (opt) {
        setPerfMode(opt.recommendedPerf);
      }
    }
  };

  return (
    <BackgroundContext.Provider
      value={{ creatureTheme, setCreatureTheme, perfMode, setPerfMode, bgStyle, setBgStyle }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundTheme = () => useContext(BackgroundContext);
