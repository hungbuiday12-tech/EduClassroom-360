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
  | 'white_breeze'
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
  | 'stem_mono'
  | 'pixel_determination'
  | 'pixel_pixelify'
  | 'pixel_silkscreen'
  | 'pixel_arcade'
  | 'pixel_dotmatrix'
  | 'pixel_jersey';

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
  gradLightFrom: string;
  gradLightVia: string;
  gradLightTo: string;
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
  },
  {
    id: 'pixel_determination',
    labelVi: 'SVN Determination Sans (Pixel)',
    labelEn: 'SVN Determination Sans (Pixel)',
    sampleText: 'Aa Bb · Pixel 8-bit',
    displayFont: "'SVN Determination Sans', 'Pixelify Sans', 'VT323', monospace",
    sansFont: "'SVN Determination Sans', 'Pixelify Sans', 'Be Vietnam Pro', system-ui, sans-serif"
  },
  {
    id: 'pixel_pixelify',
    labelVi: 'Pixelify Sans (Pixel Việt)',
    labelEn: 'Pixelify Sans (Modern Pixel)',
    sampleText: 'Synapse · Toán Lí',
    displayFont: "'Pixelify Sans', 'SVN Determination Sans', monospace",
    sansFont: "'Pixelify Sans', 'Be Vietnam Pro', system-ui, sans-serif"
  },
  {
    id: 'pixel_silkscreen',
    labelVi: 'Silkscreen (Pixel Kỹ thuật)',
    labelEn: 'Silkscreen (Tech Pixel)',
    sampleText: 'LAB 3D · v2030',
    displayFont: "'Silkscreen', 'Pixelify Sans', monospace",
    sansFont: "'Silkscreen', 'Pixelify Sans', 'Be Vietnam Pro', sans-serif"
  },
  {
    id: 'pixel_arcade',
    labelVi: 'Press Start 2P (Arcade 8-bit)',
    labelEn: 'Press Start 2P (8-bit Arcade)',
    sampleText: 'START 3D!',
    displayFont: "'Press Start 2P', 'Pixelify Sans', monospace",
    sansFont: "'Pixelify Sans', 'Silkscreen', 'Be Vietnam Pro', sans-serif"
  },
  {
    id: 'pixel_dotmatrix',
    labelVi: 'DotGothic16 (Ma trận Sci-Fi)',
    labelEn: 'DotGothic16 (Dot Matrix)',
    sampleText: 'Matrix · 1010',
    displayFont: "'DotGothic16', 'Pixelify Sans', monospace",
    sansFont: "'DotGothic16', 'Be Vietnam Pro', system-ui, sans-serif"
  },
  {
    id: 'pixel_jersey',
    labelVi: 'Jersey 15 (Retro Display)',
    labelEn: 'Jersey 15 (Retro Pixel)',
    sampleText: 'STEM 3D · 9–12',
    displayFont: "'Jersey 15', 'Pixelify Sans', monospace",
    sansFont: "'Pixelify Sans', 'Be Vietnam Pro', system-ui, sans-serif"
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
    gradFrom: '#38bdf8',
    gradVia: '#60a5fa',
    gradTo: '#2dd4bf',
    gradLightFrom: '#1e3a8a',
    gradLightVia: '#0369a1',
    gradLightTo: '#0f766e',
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
    gradFrom: '#34d399',
    gradVia: '#2dd4bf',
    gradTo: '#38bdf8',
    gradLightFrom: '#064e3b',
    gradLightVia: '#047857',
    gradLightTo: '#0e7490',
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
    gradFrom: '#818cf8',
    gradVia: '#c084fc',
    gradTo: '#f472b6',
    gradLightFrom: '#312e81',
    gradLightVia: '#5b21b6',
    gradLightTo: '#be185d',
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
    gradFrom: '#fbbf24',
    gradVia: '#fb923c',
    gradTo: '#fb7185',
    gradLightFrom: '#9a3412',
    gradLightVia: '#b45309',
    gradLightTo: '#be123c',
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
    gradFrom: '#fb7185',
    gradVia: '#f43f5e',
    gradTo: '#fb923c',
    gradLightFrom: '#881337',
    gradLightVia: '#be123c',
    gradLightTo: '#c2410c',
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
    gradFrom: '#cbd5e1',
    gradVia: '#38bdf8',
    gradTo: '#94a3b8',
    gradLightFrom: '#0f172a',
    gradLightVia: '#1d4ed8',
    gradLightTo: '#334155',
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
    id: 'white_breeze',
    labelVi: 'Nền Trắng Động (Giảm Lag)',
    labelEn: 'Crisp White Dynamic (Low-Lag)',
    shortVi: 'Nền trắng',
    shortEn: 'White Light',
    specBadgeVi: 'Siêu nhẹ · Nền trắng mượt 22 FPS tiết kiệm pin',
    specBadgeEn: 'Ultra-Light · Pure White · Zero Lag',
    descVi: 'Nền trắng tinh khiết tối ưu giảm lag GPU/CPU với vòng quỹ đạo tối giản, dải sóng nhẹ và hạt sáng trôi êm.',
    descEn: 'Crisp white background engineered for zero lag with minimalist orbital arcs, a gentle wave ribbon, and soft drifting dust motes.',
    recommendedPerf: 'smooth',
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 62%, #dbeafe 100%)'
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
    labelVi: '1. Đồ họa Thấp (Mặc định · Siêu nhẹ)',
    labelEn: '1. Low Graphics (Default · Ultra-Light)',
    shortVi: 'Đồ họa Thấp',
    shortEn: 'Low Graphics',
    descVi: 'Cấu hình mặc định nhẹ nhất cho mọi thiết bị & máy cấu hình yếu: tắt blur GPU, giảm chuyển động nền để đạt phản hồi tức thì.',
    descEn: 'Default ultra-light configuration for all PCs: disables heavy GPU blur & background animations for instant responsiveness.'
  },
  {
    id: 'balanced',
    labelVi: '2. Đồ họa Trung bình (Animation sống động)',
    labelEn: '2. Medium Graphics (Lively Motion)',
    shortVi: 'Trung bình',
    shortEn: 'Medium',
    descVi: 'Các nút và khung hiển thị có animation cơ bản sống động: hiệu ứng nhấc nổi khi trỏ chuột, viền màu chuyển động dịu & quét sáng mượt.',
    descEn: 'Buttons and frames feature crisp, lively animations: tactile hover lift, gentle color border drift, and smooth sweep highlights.'
  },
  {
    id: 'ultra',
    labelVi: '3. Đồ họa Pro (Siêu hiện đại · Tương lai)',
    labelEn: '3. Pro Graphics (Futuristic · 60 FPS)',
    shortVi: 'Đồ họa Pro',
    shortEn: 'Pro Graphics',
    descVi: 'Animation siêu hiện đại, sống động tương lai cho nút & khung: tia quét hologram, kính mờ sâu, hào quang đa tầng 60 FPS.',
    descEn: 'Futuristic holographic animations across every button and frame: active laser scan beams, deep glass blur, and 60 FPS multi-layer glow.'
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
  'white_breeze',
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

export interface SceneFrameTheme {
  accentA: string;
  accentB: string;
  accentC: string;
  border: string;
  borderHover: string;
  ring: string;
  glow: string;
  glowStrong: string;
  tint: string;
}

export const SCENE_FRAME_THEMES: Record<BackgroundStyle, SceneFrameTheme> = {
  ecosystem: {
    accentA: '#10b981',
    accentB: '#14b8a6',
    accentC: '#84cc16',
    border: 'rgba(16, 185, 129, 0.44)',
    borderHover: 'rgba(16, 185, 129, 0.78)',
    ring: 'rgba(20, 184, 166, 0.24)',
    glow: 'rgba(16, 185, 129, 0.22)',
    glowStrong: 'rgba(16, 185, 129, 0.36)',
    tint: 'rgba(16, 185, 129, 0.14)'
  },
  white_breeze: {
    accentA: '#0284c7',
    accentB: '#38bdf8',
    accentC: '#64748b',
    border: 'rgba(148, 163, 184, 0.55)',
    borderHover: 'rgba(2, 132, 199, 0.65)',
    ring: 'rgba(56, 189, 248, 0.18)',
    glow: 'rgba(15, 23, 42, 0.1)',
    glowStrong: 'rgba(2, 132, 199, 0.2)',
    tint: 'rgba(226, 232, 240, 0.28)'
  },
  molecules: {
    accentA: '#06b6d4',
    accentB: '#3b82f6',
    accentC: '#22d3ee',
    border: 'rgba(6, 182, 212, 0.44)',
    borderHover: 'rgba(34, 211, 238, 0.78)',
    ring: 'rgba(56, 189, 248, 0.25)',
    glow: 'rgba(6, 182, 212, 0.24)',
    glowStrong: 'rgba(34, 211, 238, 0.38)',
    tint: 'rgba(6, 182, 212, 0.14)'
  },
  ocean: {
    accentA: '#0ea5e9',
    accentB: '#2dd4bf',
    accentC: '#0284c7',
    border: 'rgba(45, 212, 191, 0.44)',
    borderHover: 'rgba(45, 212, 191, 0.8)',
    ring: 'rgba(20, 184, 166, 0.25)',
    glow: 'rgba(14, 165, 233, 0.24)',
    glowStrong: 'rgba(45, 212, 191, 0.38)',
    tint: 'rgba(20, 184, 166, 0.15)'
  },
  sky: {
    accentA: '#0ea5e9',
    accentB: '#f59e0b',
    accentC: '#38bdf8',
    border: 'rgba(56, 189, 248, 0.46)',
    borderHover: 'rgba(245, 158, 11, 0.72)',
    ring: 'rgba(56, 189, 248, 0.22)',
    glow: 'rgba(56, 189, 248, 0.22)',
    glowStrong: 'rgba(245, 158, 11, 0.32)',
    tint: 'rgba(56, 189, 248, 0.14)'
  },
  constellations: {
    accentA: '#6366f1',
    accentB: '#a855f7',
    accentC: '#38bdf8',
    border: 'rgba(99, 102, 241, 0.46)',
    borderHover: 'rgba(129, 140, 248, 0.8)',
    ring: 'rgba(99, 102, 241, 0.25)',
    glow: 'rgba(99, 102, 241, 0.26)',
    glowStrong: 'rgba(168, 85, 247, 0.38)',
    tint: 'rgba(99, 102, 241, 0.15)'
  },
  cosmic_galaxy: {
    accentA: '#8b5cf6',
    accentB: '#ec4899',
    accentC: '#22d3ee',
    border: 'rgba(168, 85, 247, 0.48)',
    borderHover: 'rgba(236, 72, 153, 0.78)',
    ring: 'rgba(168, 85, 247, 0.26)',
    glow: 'rgba(168, 85, 247, 0.28)',
    glowStrong: 'rgba(236, 72, 153, 0.4)',
    tint: 'rgba(168, 85, 247, 0.16)'
  },
  blueprint_tech: {
    accentA: '#2563eb',
    accentB: '#06b6d4',
    accentC: '#38bdf8',
    border: 'rgba(37, 99, 235, 0.46)',
    borderHover: 'rgba(56, 189, 248, 0.8)',
    ring: 'rgba(37, 99, 235, 0.24)',
    glow: 'rgba(37, 99, 235, 0.24)',
    glowStrong: 'rgba(56, 189, 248, 0.36)',
    tint: 'rgba(37, 99, 235, 0.14)'
  },
  studio_grid: {
    accentA: '#f59e0b',
    accentB: '#0ea5e9',
    accentC: '#f97316',
    border: 'rgba(245, 158, 11, 0.44)',
    borderHover: 'rgba(245, 158, 11, 0.78)',
    ring: 'rgba(245, 158, 11, 0.22)',
    glow: 'rgba(245, 158, 11, 0.2)',
    glowStrong: 'rgba(245, 158, 11, 0.34)',
    tint: 'rgba(245, 158, 11, 0.13)'
  },
  aurora_clean: {
    accentA: '#14b8a6',
    accentB: '#818cf8',
    accentC: '#34d399',
    border: 'rgba(20, 184, 166, 0.46)',
    borderHover: 'rgba(129, 140, 248, 0.78)',
    ring: 'rgba(20, 184, 166, 0.25)',
    glow: 'rgba(20, 184, 166, 0.24)',
    glowStrong: 'rgba(129, 140, 248, 0.36)',
    tint: 'rgba(20, 184, 166, 0.14)'
  },
  minimal_solid: {
    accentA: '#475569',
    accentB: '#0284c7',
    accentC: '#94a3b8',
    border: 'rgba(100, 116, 139, 0.4)',
    borderHover: 'rgba(2, 132, 199, 0.68)',
    ring: 'rgba(100, 116, 139, 0.18)',
    glow: 'rgba(71, 85, 105, 0.16)',
    glowStrong: 'rgba(2, 132, 199, 0.26)',
    tint: 'rgba(148, 163, 184, 0.14)'
  }
};

const VALID_FONT_PRESETS: FontPresetId[] = [
  'modern_lexend',
  'geometric_outfit',
  'editorial_serif',
  'friendly_nunito',
  'stem_mono',
  'pixel_determination',
  'pixel_pixelify',
  'pixel_silkscreen',
  'pixel_arcade',
  'pixel_dotmatrix',
  'pixel_jersey'
];

const VALID_COLOR_PALETTES: ColorPaletteId[] = [
  'ocean_sky',
  'emerald_jade',
  'violet_nebula',
  'amber_solar',
  'crimson_rose',
  'slate_monochrome'
];

export interface HardwareProfile {
  cores: number;
  memoryGb: number | null;
  reduceMotion: boolean;
  saveData: boolean;
  effectiveType: string | null;
  recommendedMode: PerformanceMode;
  reasonVi: string;
  reasonEn: string;
}

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
  isLowSpecDevice: boolean;
  hardwareProfile: HardwareProfile;
  applyGraphicsTier: (tier: PerformanceMode, syncBackground?: boolean) => void;
  isGraphicsModalOpen: boolean;
  openGraphicsModal: () => void;
  closeGraphicsModal: () => void;
}

const STORAGE_KEY = 'educlassroom_bg_creature';
const PERF_STORAGE_KEY = 'educlassroom_perf_mode_v1';
const BG_STYLE_STORAGE_KEY = 'educlassroom_bg_style_v1';
const FONT_STORAGE_KEY = 'educlassroom_font_preset_v1';
const PALETTE_STORAGE_KEY = 'educlassroom_color_palette_v1';
const DODGE_ENABLED_KEY = 'educlassroom_dodge_enabled_v1';
const DODGE_INTENSITY_KEY = 'educlassroom_dodge_intensity_v1';

const OPTIONAL_FONT_URLS: Partial<Record<FontPresetId, string>> = {
  geometric_outfit:
    'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  editorial_serif:
    'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  friendly_nunito:
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap',
  pixel_determination:
    'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=VT323&display=swap',
  pixel_pixelify:
    'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap',
  pixel_silkscreen:
    'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Silkscreen:wght@400;700&display=swap',
  pixel_arcade:
    'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap',
  pixel_dotmatrix:
    'https://fonts.googleapis.com/css2?family=DotGothic16&family=Pixelify+Sans:wght@400;500;600;700&display=swap',
  pixel_jersey:
    'https://fonts.googleapis.com/css2?family=Jersey+15&family=Pixelify+Sans:wght@400;500;600;700&display=swap'
};

export function detectHardwareProfile(): HardwareProfile {
  const defaultProfile: HardwareProfile = {
    cores: 4,
    memoryGb: null,
    reduceMotion: false,
    saveData: false,
    effectiveType: null,
    recommendedMode: 'smooth',
    reasonVi: 'Thiết bị cơ bản hoặc trình duyệt ẩn thông số — khuyên dùng Đồ họa Thấp để mượt tối đa.',
    reasonEn: 'Entry hardware or restricted telemetry — Low Graphics ensures zero lag.'
  };

  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return defaultProfile;
  }

  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };
    const cores = Math.max(1, nav.hardwareConcurrency || 4);
    const memoryGb = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null;
    const reduceMotion = Boolean(
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
    const saveData = Boolean(nav.connection?.saveData);
    const effectiveType = nav.connection?.effectiveType || null;
    const slowNet = effectiveType === '2g' || effectiveType === 'slow-2g';

    if (reduceMotion) {
      return {
        cores,
        memoryGb,
        reduceMotion,
        saveData,
        effectiveType,
        recommendedMode: 'smooth',
        reasonVi: 'Hệ điều hành đang bật Giảm chuyển động — nên dùng Đồ họa Thấp.',
        reasonEn: 'OS Reduced Motion is active — Low Graphics fits best.'
      };
    }

    if (saveData || slowNet) {
      return {
        cores,
        memoryGb,
        reduceMotion,
        saveData,
        effectiveType,
        recommendedMode: 'smooth',
        reasonVi: 'Đang bật tiết kiệm dữ liệu / mạng chậm — khuyên dùng Đồ họa Thấp.',
        reasonEn: 'Data Saver or slow network detected — Low Graphics recommended.'
      };
    }

    if ((memoryGb !== null && memoryGb <= 4) || cores <= 4) {
      return {
        cores,
        memoryGb,
        reduceMotion,
        saveData,
        effectiveType,
        recommendedMode: 'smooth',
        reasonVi: `Phát hiện ${cores} luồng CPU${memoryGb ? ` · ${memoryGb} GB RAM` : ''} — Đồ họa Thấp giúp tránh giật lag tuyệt đối.`,
        reasonEn: `Detected ${cores} CPU threads${memoryGb ? ` · ${memoryGb} GB RAM` : ''} — Low Graphics keeps frame rates snappy.`
      };
    }

    if (cores >= 8 && (memoryGb === null || memoryGb >= 8)) {
      return {
        cores,
        memoryGb,
        reduceMotion,
        saveData,
        effectiveType,
        recommendedMode: 'ultra',
        reasonVi: `Máy mạnh (${cores} luồng CPU${memoryGb ? ` · ${memoryGb}+ GB RAM` : ''}) — đủ sức chạy mượt Đồ họa Pro 60 FPS & hiệu ứng Hologram.`,
        reasonEn: `High-spec hardware (${cores} CPU threads${memoryGb ? ` · ${memoryGb}+ GB RAM` : ''}) — ready for Pro Graphics 60 FPS.`
      };
    }

    return {
      cores,
      memoryGb,
      reduceMotion,
      saveData,
      effectiveType,
      recommendedMode: 'balanced',
      reasonVi: `Cấu hình tầm trung (${cores} luồng CPU${memoryGb ? ` · ${memoryGb} GB RAM` : ''}) — phù hợp nhất với Đồ họa Trung bình sống động.`,
      reasonEn: `Mid-range hardware (${cores} CPU threads${memoryGb ? ` · ${memoryGb} GB RAM` : ''}) — Medium Graphics gives smooth lively motion.`
    };
  } catch {
    return defaultProfile;
  }
}

export function detectLowSpecDevice(): boolean {
  return detectHardwareProfile().recommendedMode === 'smooth';
}

const DEFAULT_HARDWARE_PROFILE = detectHardwareProfile();

const BackgroundContext = createContext<BackgroundContextValue>({
  creatureTheme: 'galaxy',
  setCreatureTheme: () => {},
  perfMode: 'smooth',
  setPerfMode: () => {},
  bgStyle: 'white_breeze',
  setBgStyle: () => {},
  fontPreset: 'modern_lexend',
  setFontPreset: () => {},
  colorPalette: 'ocean_sky',
  setColorPalette: () => {},
  activePalette: COLOR_PALETTE_OPTIONS[0],
  dodgeEnabled: false,
  setDodgeEnabled: () => {},
  dodgeIntensity: 'gentle',
  setDodgeIntensity: () => {},
  isLowSpecDevice: true,
  hardwareProfile: DEFAULT_HARDWARE_PROFILE,
  applyGraphicsTier: () => {},
  isGraphicsModalOpen: false,
  openGraphicsModal: () => {},
  closeGraphicsModal: () => {}
});

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hardwareProfile] = useState<HardwareProfile>(() => detectHardwareProfile());
  const isLowSpecDevice = hardwareProfile.recommendedMode === 'smooth';
  const [isGraphicsModalOpen, setIsGraphicsModalOpen] = useState<boolean>(false);

  const [creatureTheme, setCreatureThemeState] = useState<BackgroundCreatureTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as BackgroundCreatureTheme | null;
      if (saved && VALID_THEMES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'galaxy';
  });

  // Always start in Low Graphics ('smooth') on first visit regardless of PC specs
  const [perfMode, setPerfModeState] = useState<PerformanceMode>(() => {
    try {
      const saved = localStorage.getItem(PERF_STORAGE_KEY) as PerformanceMode | null;
      if (saved && VALID_PERF_MODES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'smooth';
  });

  // Always start on Crisp White Dynamic ('white_breeze') on first visit for instant boot
  const [bgStyle, setBgStyleState] = useState<BackgroundStyle>(() => {
    try {
      const saved = localStorage.getItem(BG_STYLE_STORAGE_KEY) as BackgroundStyle | null;
      if (saved && VALID_BG_STYLES.includes(saved)) {
        return saved;
      }
    } catch {}
    return 'white_breeze';
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
      if (saved === 'true') return true;
    } catch {}
    return false;
  });

  const [dodgeIntensity, setDodgeIntensityState] = useState<DodgeIntensity>(() => {
    try {
      const saved = localStorage.getItem(DODGE_INTENSITY_KEY) as DodgeIntensity | null;
      if (saved === 'gentle' || saved === 'lively') return saved;
    } catch {}
    return 'gentle';
  });

  const activePalette =
    COLOR_PALETTE_OPTIONS.find((p) => p.id === colorPalette) || COLOR_PALETTE_OPTIONS[0];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.perf = perfMode;
    }
  }, [perfMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.bgStyle = bgStyle;
    const frameTheme = SCENE_FRAME_THEMES[bgStyle] || SCENE_FRAME_THEMES.constellations;
    root.style.setProperty('--scene-frame-a', frameTheme.accentA);
    root.style.setProperty('--scene-frame-b', frameTheme.accentB);
    root.style.setProperty('--scene-frame-c', frameTheme.accentC);
    root.style.setProperty('--scene-frame-border', frameTheme.border);
    root.style.setProperty('--scene-frame-border-hover', frameTheme.borderHover);
    root.style.setProperty('--scene-frame-ring', frameTheme.ring);
    root.style.setProperty('--scene-frame-glow', frameTheme.glow);
    root.style.setProperty('--scene-frame-glow-strong', frameTheme.glowStrong);
    root.style.setProperty('--scene-frame-tint', frameTheme.tint);
  }, [bgStyle]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const preset = FONT_PRESET_OPTIONS.find((f) => f.id === fontPreset) || FONT_PRESET_OPTIONS[0];
    document.documentElement.style.setProperty('--font-display', preset.displayFont);
    document.documentElement.style.setProperty('--font-sans', preset.sansFont);
    document.documentElement.dataset.fontPreset = fontPreset;

    const optionalUrl = OPTIONAL_FONT_URLS[fontPreset];
    if (optionalUrl) {
      const linkId = `synapse-opt-font-${fontPreset}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = optionalUrl;
        document.head.appendChild(link);
      }
    }
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
    root.style.setProperty('--hero-grad-light-from', pal.gradLightFrom);
    root.style.setProperty('--hero-grad-light-via', pal.gradLightVia);
    root.style.setProperty('--hero-grad-light-to', pal.gradLightTo);
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
    if (style === 'white_breeze' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('synapse:sync-light-theme'));
    }
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

  const applyGraphicsTier = (tier: PerformanceMode, syncBackground = true) => {
    setPerfMode(tier);
    if (tier === 'smooth') {
      setDodgeEnabled(false);
      setDodgeIntensity('gentle');
      if (syncBackground) {
        setBgStyle('white_breeze', false);
        setCreatureTheme('galaxy');
      }
      return;
    }

    if (tier === 'balanced') {
      setDodgeEnabled(true);
      setDodgeIntensity('gentle');
      if (syncBackground) {
        if (bgStyle === 'white_breeze' || bgStyle === 'minimal_solid') {
          setBgStyle('studio_grid', false);
        }
      }
      return;
    }

    // tier === 'ultra' (Pro Graphics)
    setDodgeEnabled(true);
    setDodgeIntensity('lively');
    if (syncBackground) {
      if (
        bgStyle === 'white_breeze' ||
        bgStyle === 'minimal_solid' ||
        bgStyle === 'studio_grid'
      ) {
        setBgStyle('constellations', false);
      }
      if (creatureTheme === 'galaxy') {
        setCreatureTheme('all');
      }
    }
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
        setDodgeIntensity,
        isLowSpecDevice,
        hardwareProfile,
        applyGraphicsTier,
        isGraphicsModalOpen,
        openGraphicsModal: () => setIsGraphicsModalOpen(true),
        closeGraphicsModal: () => setIsGraphicsModalOpen(false)
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundTheme = () => useContext(BackgroundContext);
