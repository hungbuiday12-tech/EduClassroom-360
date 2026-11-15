import React, { createContext, useContext, useState } from 'react';

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

interface BackgroundContextValue {
  creatureTheme: BackgroundCreatureTheme;
  setCreatureTheme: (theme: BackgroundCreatureTheme) => void;
}

const STORAGE_KEY = 'educlassroom_bg_creature';

const BackgroundContext = createContext<BackgroundContextValue>({
  creatureTheme: 'all',
  setCreatureTheme: () => {}
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

  const setCreatureTheme = (theme: BackgroundCreatureTheme) => {
    setCreatureThemeState(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  };

  return (
    <BackgroundContext.Provider value={{ creatureTheme, setCreatureTheme }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundTheme = () => useContext(BackgroundContext);
