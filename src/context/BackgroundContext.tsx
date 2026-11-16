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
  | 'ecosystem'
  | 'molecules'
  | 'ocean'
  | 'sky'
  | 'constellations'
  | 'cosmic_galaxy'
  | 'blueprint_tech'
  | 'studio_grid'
  | 'aurora_clean'
  | 'minimal_solid';

export type FontPresetId =
  | 'modern_lexend'
  | 'geometric_outfit'
  | 'editorial_serif'
  | 'friendly_nunito'
  | 'stem_mono';

export type ColorPaletteId =
  | 'ocean_sky'
  | 'emerald_jade'
  | 'violet_nebula'
  | 'amber_solar'
  | 'crimson_rose'
  | 'slate_monochrome';

export type DodgeIntensity = 'gentle' | 'lively';

export interface BackgroundStyleOption {
  id: BackgroundStyle;
  labelVi: string;
  labelEn: string;
  shortVi: string;
  shortEn: string;
  specBadgeVi: string;
  specBadgeEn: string;
  descVi: string;
  descEn: string;
  recommendedPerf: PerformanceMode;
  previewGradient: string;
}

export interface FontPresetOption {
  id: FontPresetId;
  labelVi: string;
  labelEn: string;
  sampleText: string;
  displayFont: string;
  sansFont: string;
}

export interface ColorPaletteOption {
  id: ColorPaletteId;
  labelVi: string;
  labelEn: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  gradFrom: string;
  gradVia: string;
  gradTo: string;
  soft: string;
  ring: string;
  contrast: string;
  swatch: string;
  particleRgbDark: [number, number, number];
  particleRgbLight: [number, number, number];
}

export const FONT_PRESET_OPTIONS: FontPresetOption[] = [
  {
    id: 'modern_lexend',
    labelVi: 'Lexend Học thuật',
    labelEn: 'Lexend Academic',
    sampleText: 'Aa Bb · STEM',
    displayFont: "'Lexend', 'Be Vietnam Pro', system-ui, sans-serif",
    sansFont: "'Be Vietnam Pro', system-ui, -apple-system, sans-serif"
  },
  {
    id: 'geometric_outfit',
    labelVi: 'Outfit Hiện đại',
    labelEn: 'Outfit Geometric',
    sampleText: 'Aa Bb · Studio',
    displayFont: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
    sansFont: "'Plus Jakarta Sans', 'Be Vietnam Pro', system-ui, sans-serif"
  },
  {
    id: 'editorial_serif',
    labelVi: 'Playfair Cổ điển',
    labelEn: 'Playfair Editorial',
    sampleText: 'Aa Bb · Classic',
    displayFont: "'Playfair Display', 'Lora', Georgia, serif",
    sansFont: "'Plus Jakarta Sans', 'Be Vietnam Pro', system-ui, sans-serif"
  },
  {
    id: 'friendly_nunito',
    labelVi: 'Nunito Thân thiện',
    labelEn: 'Nunito Soft',
    sampleText: 'Aa Bb · Flow',
    displayFont: "'Quicksand', 'Nunito', system-ui, sans-serif",
    sansFont: "'Nunito', 'Be Vietnam Pro', system-ui, sans-serif"
  },
  {
    id: 'stem_mono',
    labelVi: 'JetBrains Kỹ sư',
    labelEn: 'JetBrains Engineer',
    sampleText: 'f(x) -> O(n)',
    displayFont: "'JetBrains Mono', 'Outfit', monospace",
    sansFont: "'Plus Jakarta Sans', 'Be Vietnam Pro', system-ui, sans-serif"
  }
];

export const COLOR_PALETTE_OPTIONS: ColorPaletteOption[] = [
  {
    id: 'ocean_sky',
    labelVi: 'Xanh Đại Dương',
    labelEn: 'Ocean Sky',
    primary: '#0284c7',
    primaryLight: '#38bdf8',
    secondary: '#14b8a6',
    gradFrom: '#0284c7',
    gradVia: '#0ea5e9',
    gradTo: '#2dd4bf',
    soft: 'rgba(14, 165, 233, 0.15)',
    ring: 'rgba(56, 189, 248, 0.4)',
    contrast: '#ffffff',
    swatch: 'linear-gradient(135deg, #0284c7 0%, #14b8a6 100%)',
    particleRgbDark: [56, 189, 248],
    particleRgbLight: [2, 132, 199]
  },
  {
    id: 'emerald_jade',
    labelVi: 'Ngọc Lục Bảo',
    labelEn: 'Emerald Jade',
    primary: '#059669',
    primaryLight: '#34d399',
    secondary: '#0d9488',
    gradFrom: '#059669',
    gradVia: '#10b981',
    gradTo: '#22d3ee',
    soft: 'rgba(16, 185, 129, 0.15)',
    ring: 'rgba(52, 211, 153, 0.42)',
    contrast: '#ffffff',
    swatch: 'linear-gradient(135deg, #059669 0%, #22d3ee 100%)',
    particleRgbDark: [52, 211, 153],
    particleRgbLight: [5, 150, 105]
  },
  {
    id: 'violet_nebula',
    labelVi: 'Tinh Vân Tím Chàm',
    labelEn: 'Indigo Nebula',
    primary: '#4f46e5',
    primaryLight: '#818cf8',
    secondary: '#a855f7',
    gradFrom: '#4f46e5',
    gradVia: '#7c3aed',
    gradTo: '#ec4899',
    soft: 'rgba(99, 102, 241, 0.15)',
    ring: 'rgba(129, 140, 248, 0.42)',
    contrast: '#ffffff',
    swatch: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
    particleRgbDark: [129, 140, 248],
    particleRgbLight: [79, 70, 229]
  },
  {
    id: 'amber_solar',
    labelVi: 'Hổ Phách Nắng',
    labelEn: 'Solar Amber',
    primary: '#d97706',
    primaryLight: '#fbbf24',
    secondary: '#ea580c',
    gradFrom: '#d97706',
    gradVia: '#f59e0b',
    gradTo: '#fb7185',
    soft: 'rgba(245, 158, 11, 0.15)',
    ring: 'rgba(251, 191, 36, 0.44)',
    contrast: '#0f172a',
    swatch: 'linear-gradient(135deg, #d97706 0%, #fb7185 100%)',
    particleRgbDark: [251, 191, 36],
    particleRgbLight: [217, 119, 6]
  },
  {
    id: 'crimson_rose',
    labelVi: 'San Hô Đỏ',
    labelEn: 'Coral Crimson',
    primary: '#e11d48',
    primaryLight: '#fb7185',
    secondary: '#f97316',
    gradFrom: '#e11d48',
    gradVia: '#f43f5e',
    gradTo: '#fb923c',
    soft: 'rgba(244, 63, 94, 0.14)',
    ring: 'rgba(251, 113, 133, 0.4)',
    contrast: '#ffffff',
    swatch: 'linear-gradient(135deg, #e11d48 0%, #fb923c 100%)',
    particleRgbDark: [251, 113, 133],
    particleRgbLight: [225, 29, 72]
  },
  {
    id: 'slate_monochrome',
    labelVi: 'Tối Giản Bạch Kim',
    labelEn: 'Monochrome Slate',
    primary: '#334155',
    primaryLight: '#94a3b8',
    secondary: '#0ea5e9',
    gradFrom: '#475569',
    gradVia: '#0ea5e9',
    gradTo: '#64748b',
    soft: 'rgba(100, 116, 139, 0.14)',
    ring: 'rgba(148, 163, 184, 0.4)',
    contrast: '#ffffff',
    swatch: 'linear-gradient(135deg, #334155 0%, #94a3b8 100%)',
    particleRgbDark: [148, 163, 184],
    particleRgbLight: [71, 85, 105]
  }
];

export const BACKGROUND_STYLE_OPTIONS: BackgroundStyleOption[] = [
  {
    id: 'ecosystem',
    labelVi: 'Hệ Sinh Thái Sống Động',
    labelEn: 'Living Ecosystem',
    shortVi: 'Hệ sinh thái',
    shortEn: 'Ecosystem',
    specBadgeVi: 'Nổi bật · Cá Koi, Chim, Bướm & Đom đóm',
    specBadgeEn: 'Featured · Koi, Birds, Butterflies & Ripples',
    descVi: 'Mặt nước sinh thái với lá trôi, gợn sóng theo chuột và đàn sinh vật nhiều loài tương tác tự do.',
    descEn: 'Living botanical & aquatic ecosystem with drifting petals, water ripples, and multi-species creatures.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #064e3b 0%, #0d9488 55%, #38bdf8 100%)'
  },
  {
    id: 'molecules',
    labelVi: 'Mạng Hạt Phân Tử & Nguyên Tử',
    labelEn: 'Molecular Particle Lattice',
    shortVi: 'Phân tử',
    shortEn: 'Molecules',
    specBadgeVi: 'Vật lí / Hóa · Liên kết & Né chuột từ trường',
    specBadgeEn: 'Physics / Chem · Orbitals & Repulsion Field',
    descVi: 'Các hạt nguyên tử có quỹ đạo electron xoay quanh, nối liên kết cộng hóa trị và bật né khi di chuột.',
    descEn: 'Dynamic atomic network with orbiting electron shells, covalent bonds, and magnetic cursor repulsion.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 52%, #22d3ee 100%)'
  },
  {
    id: 'ocean',
    labelVi: 'Đại Dương & Ánh Sáng Đáy Biển',
    labelEn: 'Deep Ocean & Caustics',
    shortVi: 'Đại dương',
    shortEn: 'Ocean',
    specBadgeVi: 'Biển sâu · Tia sáng mặt nước, Sứa & Rùa biển',
    specBadgeEn: 'Abyss · Light Shafts, Jellyfish & Sea Turtles',
    descVi: 'Dòng hải lưu gợn sóng, tia sáng khúc xạ xuyên nước, bọt khí bay lên cùng sứa phát sáng & rùa biển.',
    descEn: 'Refracting volumetric light shafts, current ribbons, rising bubbles, glowing jellyfish and sea turtles.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #082f49 0%, #0369a1 50%, #2dd4bf 100%)'
  },
  {
    id: 'sky',
    labelVi: 'Bầu Trời & Mây Đàn Chim Bay',
    labelEn: 'Atmospheric Sky & Clouds',
    shortVi: 'Bầu trời',
    shortEn: 'Sky',
    specBadgeVi: 'Thoáng đãng · Mây trôi đa tầng, Chim & Nắng/Cực quang',
    specBadgeEn: 'Airy · Parallax Clouds, Birds & Aurora',
    descVi: 'Bầu trời xanh nắng ấm (Nền sáng) hoặc hoàng hôn cực quang (Nền tối) cùng mây tầng và đàn chim lượn.',
    descEn: 'Sunlit cerulean sky in light mode or twilight aurora in dark mode with drifting cloud layers and soaring birds.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #38bdf8 0%, #bae6fd 52%, #0284c7 100%)'
  },
  {
    id: 'constellations',
    labelVi: 'Các Chòm Sao & Thiên Văn 3D',
    labelEn: 'Astronomical Constellations',
    shortVi: 'Chòm sao',
    shortEn: 'Constellations',
    specBadgeVi: 'Thiên văn · Orion, Cassiopeia, Bắc Đẩu & Sao băng',
    specBadgeEn: 'Observatory · Orion, Cassiopeia, Ursa Major',
    descVi: 'Bản đồ các chòm sao thực tế phát sáng liên kết về phía con trỏ chuột cùng sao băng lướt qua bầu trời.',
    descEn: 'Mapped celestial constellations dynamically linking toward your cursor alongside drifting meteor streaks.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 55%, #0ea5e9 100%)'
  },
  {
    id: 'cosmic_galaxy',
    labelVi: 'Vũ Trụ Ngân Hà & Sinh Vật',
    labelEn: 'Living Galaxy & Creatures',
    shortVi: 'Ngân hà',
    shortEn: 'Galaxy',
    specBadgeVi: 'Full hiệu ứng · Tinh vân & Đàn sinh vật',
    specBadgeEn: 'Full Dynamic · Nebula & Creatures',
    descVi: 'Bầu trời ngân hà chuyển động toàn phần cùng đàn sinh vật và hiệu ứng gợn sóng khi chạm.',
    descEn: 'Full interactive starfield, nebula, ripples, and responsive background creatures.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #04091a 0%, #1d4ed8 45%, #0d9488 100%)'
  },
  {
    id: 'blueprint_tech',
    labelVi: 'Bản Vẽ Kỹ Thuật STEM Động',
    labelEn: 'Live Engineering Blueprint',
    shortVi: 'Bản vẽ STEM',
    shortEn: 'Blueprint',
    specBadgeVi: 'Máy tầm trung · Tọa độ Oxy & Radar quét',
    specBadgeEn: 'Mid-Spec · Panning STEM Grid',
    descVi: 'Hệ tọa độ Oxy trôi mượt với tia quét hiệu chuẩn và các nút vector phát sáng.',
    descEn: 'Live panning coordinate blueprint grid with calibration sweep and vector nodes.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #0b162c 0%, #0f294a 55%, #091326 100%)'
  },
  {
    id: 'studio_grid',
    labelVi: 'Lưới Sóng Studio Động',
    labelEn: 'Kinetic Studio Dot Wave',
    shortVi: 'Lưới sóng',
    shortEn: 'Dot Wave',
    specBadgeVi: 'Laptop phổ thông · Sóng chấm động',
    specBadgeEn: 'Standard Laptop · Kinetic Grid',
    descVi: 'Mạng lưới chấm kỹ thuật dao động theo sóng giao thoa mượt mà, tăng cảm hứng học tập.',
    descEn: 'Architectural dot-matrix surface animated with smooth harmonic wave interference.',
    recommendedPerf: 'smooth',
    previewGradient: 'radial-gradient(circle at 25% 25%, #bae6fd 0%, #f1f5f9 55%, #e2e8f0 100%)'
  },
  {
    id: 'aurora_clean',
    labelVi: 'Tinh Vân Sao Rơi Sống Động',
    labelEn: 'Drifting Starlight Horizon',
    shortVi: 'Tinh vân',
    shortEn: 'Starlight',
    specBadgeVi: 'Laptop i5/Ryzen 5 · Sao băng & Tinh vân',
    specBadgeEn: 'Mid-High Spec · Starlight',
    descVi: 'Bầu trời sao chuyển động mượt cùng sao băng lướt nhẹ, không có sinh vật bơi.',
    descEn: 'Drifting starfield, shooting stars, and soft horizon glow without swimming creatures.',
    recommendedPerf: 'balanced',
    previewGradient: 'linear-gradient(135deg, #07142b 0%, #0e3a5c 50%, #082032 100%)'
  },
  {
    id: 'minimal_solid',
    labelVi: 'Ánh Sáng Chuyển Động Nhẹ (Siêu Mượt)',
    labelEn: 'Ambient Drift (Ultra Light)',
    shortVi: 'Siêu mượt',
    shortEn: 'Ultra Light',
    specBadgeVi: 'Máy yếu · Văn phòng · Tiết kiệm pin',
    specBadgeEn: 'Low-Spec · Battery Saver',
    descVi: 'Nền chuyển sắc dịu mắt với luồng sáng trôi nhẹ nhàng, giữ 60 FPS tuyệt đối trên máy cấu hình thấp.',
    descEn: 'Ultra-light gently drifting ambient glow optimized for low-spec hardware.',
    recommendedPerf: 'smooth',
    previewGradient: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)'
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
  'ecosystem',
  'molecules',
  'ocean',
  'sky',
  'constellations',
  'cosmic_galaxy',
  'blueprint_tech',
  'studio_grid',
  'aurora_clean',
  'minimal_solid'
];

const VALID_FONT_PRESETS: FontPresetId[] = [
  'modern_lexend',
  'geometric_outfit',
  'editorial_serif',
  'friendly_nunito',
  'stem_mono'
];

const VALID_COLOR_PALETTES: ColorPaletteId[] = [
  'ocean_sky',
  'emerald_jade',
  'violet_nebula',
  'amber_solar',
  'crimson_rose',
  'slate_monochrome'
];

interface BackgroundContextValue {
  creatureTheme: BackgroundCreatureTheme;
  setCreatureTheme: (theme: BackgroundCreatureTheme) => void;
  perfMode: PerformanceMode;
  setPerfMode: (mode: PerformanceMode) => void;
  bgStyle: BackgroundStyle;
  setBgStyle: (style: BackgroundStyle, syncRecommendedPerf?: boolean) => void;
  fontPreset: FontPresetId;
  setFontPreset: (font: FontPresetId) => void;
  colorPalette: ColorPaletteId;
  setColorPalette: (palette: ColorPaletteId) => void;
  activePalette: ColorPaletteOption;
  dodgeEnabled: boolean;
  setDodgeEnabled: (enabled: boolean) => void;
  dodgeIntensity: DodgeIntensity;
  setDodgeIntensity: (intensity: DodgeIntensity) => void;
}

const STORAGE_KEY = 'educlassroom_bg_creature';
const PERF_STORAGE_KEY = 'educlassroom_perf_mode_v1';
const BG_STYLE_STORAGE_KEY = 'educlassroom_bg_style_v1';
const FONT_STORAGE_KEY = 'educlassroom_font_preset_v1';
const PALETTE_STORAGE_KEY = 'educlassroom_color_palette_v1';
const DODGE_ENABLED_KEY = 'educlassroom_dodge_enabled_v1';
const DODGE_INTENSITY_KEY = 'educlassroom_dodge_intensity_v1';

const BackgroundContext = createContext<BackgroundContextValue>({
  creatureTheme: 'all',
  setCreatureTheme: () => {},
  perfMode: 'balanced',
  setPerfMode: () => {},
  bgStyle: 'constellations',
  setBgStyle: () => {},
  fontPreset: 'modern_lexend',
  setFontPreset: () => {},
  colorPalette: 'ocean_sky',
  setColorPalette: () => {},
  activePalette: COLOR_PALETTE_OPTIONS[0],
  dodgeEnabled: true,
  setDodgeEnabled: () => {},
  dodgeIntensity: 'lively',
  setDodgeIntensity: () => {}
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
    return 'balanced';
  });

  const [bgStyle, setBgStyleState] = useState<BackgroundStyle>(() => {
    try {
      const saved = localStorage.getItem(BG_STYLE_STORAGE_KEY) as BackgroundStyle | null;
      if (saved && VALID_BG_STYLES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'constellations';
  });

  const [fontPreset, setFontPresetState] = useState<FontPresetId>(() => {
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY) as FontPresetId | null;
      if (saved && VALID_FONT_PRESETS.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'modern_lexend';
  });

  const [colorPalette, setColorPaletteState] = useState<ColorPaletteId>(() => {
    try {
      const saved = localStorage.getItem(PALETTE_STORAGE_KEY) as ColorPaletteId | null;
      if (saved && VALID_COLOR_PALETTES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'ocean_sky';
  });

  const [dodgeEnabled, setDodgeEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DODGE_ENABLED_KEY);
      if (saved === 'false') return false;
    } catch {}
    return true;
  });

  const [dodgeIntensity, setDodgeIntensityState] = useState<DodgeIntensity>(() => {
    try {
      const saved = localStorage.getItem(DODGE_INTENSITY_KEY) as DodgeIntensity | null;
      if (saved === 'gentle' || saved === 'lively') return saved;
    } catch {}
    return 'lively';
  });

  const activePalette =
    COLOR_PALETTE_OPTIONS.find((p) => p.id === colorPalette) || COLOR_PALETTE_OPTIONS[0];

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

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const preset = FONT_PRESET_OPTIONS.find((f) => f.id === fontPreset) || FONT_PRESET_OPTIONS[0];
    document.documentElement.style.setProperty('--font-display', preset.displayFont);
    document.documentElement.style.setProperty('--font-sans', preset.sansFont);
    document.documentElement.dataset.fontPreset = fontPreset;
  }, [fontPreset]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const pal = activePalette;
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', pal.primary);
    root.style.setProperty('--accent-primary-light', pal.primaryLight);
    root.style.setProperty('--accent-secondary', pal.secondary);
    root.style.setProperty('--accent-soft', pal.soft);
    root.style.setProperty('--accent-ring', pal.ring);
    root.style.setProperty('--hero-grad-from', pal.gradFrom);
    root.style.setProperty('--hero-grad-via', pal.gradVia);
    root.style.setProperty('--hero-grad-to', pal.gradTo);
    root.style.setProperty('--accent-contrast', pal.contrast);
    root.dataset.palette = colorPalette;
  }, [activePalette, colorPalette]);

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

  const setFontPreset = (font: FontPresetId) => {
    setFontPresetState(font);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, font);
    } catch {}
  };

  const setColorPalette = (palette: ColorPaletteId) => {
    setColorPaletteState(palette);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, palette);
    } catch {}
  };

  const setDodgeEnabled = (enabled: boolean) => {
    setDodgeEnabledState(enabled);
    try {
      localStorage.setItem(DODGE_ENABLED_KEY, String(enabled));
    } catch {}
  };

  const setDodgeIntensity = (next: DodgeIntensity) => {
    setDodgeIntensityState(next);
    try {
      localStorage.setItem(DODGE_INTENSITY_KEY, next);
    } catch {}
  };

  return (
    <BackgroundContext.Provider
      value={{
        creatureTheme,
        setCreatureTheme,
        perfMode,
        setPerfMode,
        bgStyle,
        setBgStyle,
        fontPreset,
        setFontPreset,
        colorPalette,
        setColorPalette,
        activePalette,
        dodgeEnabled,
        setDodgeEnabled,
        dodgeIntensity,
        setDodgeIntensity
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundTheme = () => useContext(BackgroundContext);
