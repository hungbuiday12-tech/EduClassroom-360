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
    labelVi: 'Mượt Tối Đa (Tối ưu 60 FPS)',
    labelEn: 'Max Smooth (60 FPS Boost)',
    shortVi: 'Mượt FPS',
    shortEn: 'Smooth',
    descVi: 'Tối ưu bộ nhớ đệm Canvas, giảm blur GPU nặng, giữ nguyên toàn bộ hiệu ứng & sinh vật.',
    descEn: 'Caches Canvas layers & trims heavy GPU blur while keeping all animations and creatures.'
  },
  {
    id: 'balanced',
    labelVi: 'Cân Bằng (Đẹp & Nhẹ)',
    labelEn: 'Balanced Quality',
    shortVi: 'Cân bằng',
    shortEn: 'Balanced',
    descVi: 'Cân bằng độ nét Retina (1.5x) và mật độ sinh vật nền.',
    descEn: 'Balances 1.5x Retina crispness with smooth animation pacing.'
  },
  {
    id: 'ultra',
    labelVi: 'Chi Tiết Cao (Toàn bộ đàn)',
    labelEn: 'High Detail (Full Swarm)',
    shortVi: 'Chi tiết cao',
    shortEn: 'High Detail',
    descVi: 'Hiển thị tối đa số lượng sinh vật và hiệu ứng kính mờ sâu (phù hợp máy có GPU rời).',
    descEn: 'Full creature swarm density and deep glass blur (best on dedicated GPUs).'
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
    labelVi: 'Cá Koi Thiên Hà (Nâng cấp)',
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

interface BackgroundContextValue {
  creatureTheme: BackgroundCreatureTheme;
  setCreatureTheme: (theme: BackgroundCreatureTheme) => void;
  perfMode: PerformanceMode;
  setPerfMode: (mode: PerformanceMode) => void;
}

const STORAGE_KEY = 'educlassroom_bg_creature';
const PERF_STORAGE_KEY = 'educlassroom_perf_mode_v1';

const BackgroundContext = createContext<BackgroundContextValue>({
  creatureTheme: 'all',
  setCreatureTheme: () => {},
  perfMode: 'smooth',
  setPerfMode: () => {}
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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.perf = perfMode;
    }
  }, [perfMode]);

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

  return (
    <BackgroundContext.Provider value={{ creatureTheme, setCreatureTheme, perfMode, setPerfMode }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundTheme = () => useContext(BackgroundContext);
