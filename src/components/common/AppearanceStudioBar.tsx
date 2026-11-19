import React, { useState } from 'react';
import {
  Sparkles,
  Type,
  Palette,
  MousePointer2,
  Wand2,
  ChevronDown,
  ChevronUp,
  Gauge
} from 'lucide-react';
import {
  useBackgroundTheme,
  BACKGROUND_STYLE_OPTIONS,
  CREATURE_THEME_OPTIONS,
  FONT_PRESET_OPTIONS,
  COLOR_PALETTE_OPTIONS,
  PERFORMANCE_MODE_OPTIONS
} from '../../context/BackgroundContext';
import { useLanguage } from '../../context/LanguageContext';

interface AppearanceStudioBarProps {
  compact?: boolean;
}

export const AppearanceStudioBar: React.FC<AppearanceStudioBarProps> = ({ compact = false }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    bgStyle,
    setBgStyle,
    creatureTheme,
    setCreatureTheme,
    perfMode,
    openGraphicsModal,
    fontPreset,
    setFontPreset,
    colorPalette,
    setColorPalette,
    dodgeEnabled,
    setDodgeEnabled,
    dodgeIntensity,
    setDodgeIntensity
  } = useBackgroundTheme();

  const [openDrawer, setOpenDrawer] = useState<'none' | 'bg' | 'font' | 'color'>('none');

  const showCreatureRow =
    bgStyle === 'ecosystem' ||
    bgStyle === 'ocean' ||
    bgStyle === 'sky' ||
    bgStyle === 'cosmic_galaxy' ||
    bgStyle === 'constellations';

  const currentBgLabel =
    BACKGROUND_STYLE_OPTIONS.find((b) => b.id === bgStyle)?.[isEn ? 'shortEn' : 'shortVi'] || '';
  const currentFontLabel =
    FONT_PRESET_OPTIONS.find((f) => f.id === fontPreset)?.[isEn ? 'labelEn' : 'labelVi'] || '';
  const activePerfOpt =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === perfMode) || PERFORMANCE_MODE_OPTIONS[0];

  return (
    <div className="w-full max-w-4xl mx-auto pt-1">
      {/* Minimal frameless interactive square-cut studio strip */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs">
        <button
          type="button"
          onClick={openGraphicsModal}
          className={`px-3 py-1.5 rounded-[4px] border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-semibold ${
            perfMode === 'ultra'
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
              : perfMode === 'balanced'
              ? 'bg-sky-600 border-sky-500 text-white shadow-sm'
              : 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
          }`}
          title={
            isEn
              ? 'Configure Graphics Tier (Low / Medium / Pro) with hardware suggestion'
              : 'Mở bảng Thiết lập Đồ họa 3 cấp (Thấp / Trung bình / Pro)'
          }
        >
          <Gauge className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isEn ? `Graphics: ${activePerfOpt.shortEn}` : `Đồ họa: ${activePerfOpt.shortVi}`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpenDrawer(openDrawer === 'bg' ? 'none' : 'bg')}
          className={`px-3 py-1.5 rounded border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-semibold ${
            openDrawer === 'bg'
              ? 'bg-accent-solid border-transparent shadow-md'
              : 'bg-white/65 dark:bg-slate-900/55 border-slate-300/70 dark:border-white/15 text-slate-800 dark:text-slate-100 hover:border-sky-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isEn ? 'Scene:' : 'Nền:'} {currentBgLabel}
          </span>
          {openDrawer === 'bg' ? (
            <ChevronUp className="w-3.5 h-3.5 opacity-75" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setOpenDrawer(openDrawer === 'font' ? 'none' : 'font')}
          className={`px-3 py-1.5 rounded border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-semibold ${
            openDrawer === 'font'
              ? 'bg-accent-solid border-transparent shadow-md'
              : 'bg-white/65 dark:bg-slate-900/55 border-slate-300/70 dark:border-white/15 text-slate-800 dark:text-slate-100 hover:border-sky-400'
          }`}
        >
          <Type className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isEn ? 'Font:' : 'Phông:'} {currentFontLabel}
          </span>
          {openDrawer === 'font' ? (
            <ChevronUp className="w-3.5 h-3.5 opacity-75" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setOpenDrawer(openDrawer === 'color' ? 'none' : 'color')}
          className={`px-3 py-1.5 rounded border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-semibold ${
            openDrawer === 'color'
              ? 'bg-accent-solid border-transparent shadow-md'
              : 'bg-white/65 dark:bg-slate-900/55 border-slate-300/70 dark:border-white/15 text-slate-800 dark:text-slate-100 hover:border-sky-400'
          }`}
        >
          <Palette className="w-3.5 h-3.5 shrink-0" />
          <span>{isEn ? 'Palette' : 'Đổi màu'}</span>
          {openDrawer === 'color' ? (
            <ChevronUp className="w-3.5 h-3.5 opacity-75" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 opacity-75" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (!dodgeEnabled) {
              setDodgeEnabled(true);
              setDodgeIntensity('lively');
            } else if (dodgeIntensity === 'lively') {
              setDodgeIntensity('gentle');
            } else {
              setDodgeEnabled(false);
            }
          }}
          className={`px-3 py-1.5 rounded border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-semibold ${
            dodgeEnabled
              ? 'bg-white/75 dark:bg-slate-900/65 border-sky-400/60 text-slate-900 dark:text-white'
              : 'bg-white/45 dark:bg-slate-900/40 border-slate-300/60 dark:border-white/10 text-slate-500 dark:text-slate-400'
          }`}
          title={
            isEn
              ? 'Cycle cursor-dodge repulsion intensity'
              : 'Chuyển chế độ né chuột (Mạnh → Nhẹ → Tắt)'
          }
        >
          <MousePointer2 className="w-3.5 h-3.5 shrink-0" />
          <span>
            {isEn
              ? `Dodge: ${!dodgeEnabled ? 'Off' : dodgeIntensity === 'lively' ? 'Lively' : 'Gentle'}`
              : `Né chuột: ${!dodgeEnabled ? 'Tắt' : dodgeIntensity === 'lively' ? 'Mạnh' : 'Nhẹ'}`}
          </span>
        </button>
      </div>

      {/* Quick Inline Color Swatches always 1-click accessible unless ultra compact */}
      {!compact && openDrawer === 'none' && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2.5">
          {BACKGROUND_STYLE_OPTIONS.slice(0, 6).map((bg) => {
            const active = bg.id === bgStyle;
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => setBgStyle(bg.id, bg.id === 'white_breeze')}
                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 border-transparent font-semibold shadow-sm'
                    : 'bg-white/70 dark:bg-slate-950/35 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/95 dark:hover:bg-slate-900/60'
                }`}
              >
                {isEn ? bg.shortEn : bg.shortVi}
              </button>
            );
          })}
        </div>
      )}

      {/* Expandable Transparent Glass Panel */}
      {openDrawer !== 'none' && (
        <div className="mt-3 p-3.5 sm:p-4 rounded border border-slate-300/60 dark:border-white/15 bg-white/80 dark:bg-slate-950/75 backdrop-blur-xl shadow-lg text-left space-y-3">
          {openDrawer === 'bg' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {BACKGROUND_STYLE_OPTIONS.map((opt) => {
                  const selected = opt.id === bgStyle;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setBgStyle(opt.id, opt.id === 'white_breeze')}
                      className={`p-2 rounded border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        selected
                          ? 'bg-accent-solid border-transparent shadow-sm'
                          : 'bg-white/80 dark:bg-slate-900/75 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-sky-400'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="w-5 h-5 rounded shrink-0 border border-slate-300/60 dark:border-white/30"
                        style={{ background: opt.previewGradient }}
                      />
                      <span className="text-[11px] font-semibold truncate">
                        {isEn ? opt.shortEn : opt.shortVi}
                      </span>
                    </button>
                  );
                })}
              </div>

              {showCreatureRow && (
                <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Interactive Creatures:' : 'Sinh vật chuyển động:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CREATURE_THEME_OPTIONS.map((ct) => {
                      const active = ct.id === creatureTheme;
                      return (
                        <button
                          key={ct.id}
                          type="button"
                          onClick={() => setCreatureTheme(ct.id)}
                          className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-accent-solid border-transparent'
                              : 'bg-white/75 dark:bg-slate-900/70 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                          }`}
                        >
                          {isEn ? ct.shortEn : ct.shortVi}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {openDrawer === 'font' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
              {FONT_PRESET_OPTIONS.map((f) => {
                const selected = f.id === fontPreset;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontPreset(f.id)}
                    className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-accent-solid border-transparent shadow-sm'
                        : 'bg-white/80 dark:bg-slate-900/75 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="text-sm font-bold leading-tight" style={{ fontFamily: f.displayFont }}>
                      {f.sampleText}
                    </div>
                    <div
                      className={`text-[11px] mt-1 ${
                        selected ? 'opacity-90' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isEn ? f.labelEn : f.labelVi}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {openDrawer === 'color' && (
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {COLOR_PALETTE_OPTIONS.map((pal) => {
                const selected = pal.id === colorPalette;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setColorPalette(pal.id)}
                    className={`p-2 rounded border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      selected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-sm'
                        : 'bg-white/80 dark:bg-slate-900/75 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <span
                      data-circle="true"
                      className="w-5 h-5 rounded-full shrink-0 border border-white/40 shadow-sm"
                      style={{ background: pal.swatch }}
                    />
                    <span className="text-[11px] font-semibold truncate">
                      {isEn ? pal.labelEn : pal.labelVi}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
