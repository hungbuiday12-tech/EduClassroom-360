import React from 'react';
import { SlidersHorizontal, ArrowRight, Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import {
  useBackgroundTheme,
  PERFORMANCE_MODE_OPTIONS,
  PerformanceMode
} from '../../context/BackgroundContext';
import { useLanguage } from '../../context/LanguageContext';

interface GraphicsTierTriggerButtonProps {
  variant?: 'landing' | 'overview';
}

export const GraphicsTierTriggerButton: React.FC<GraphicsTierTriggerButtonProps> = ({
  variant = 'overview'
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode, hardwareProfile, openGraphicsModal } = useBackgroundTheme();

  const activeOpt =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === perfMode) || PERFORMANCE_MODE_OPTIONS[0];
  const recommendedOpt =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === hardwareProfile.recommendedMode) ||
    PERFORMANCE_MODE_OPTIONS[0];

  const tierNumber = (mode: PerformanceMode) =>
    mode === 'smooth' ? '1' : mode === 'balanced' ? '2' : '3';

  const tierTone =
    perfMode === 'ultra'
      ? 'border-indigo-500/80 dark:border-cyan-400/70 bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-900 text-white shadow-lg shadow-indigo-900/30'
      : perfMode === 'balanced'
      ? 'border-sky-500/80 dark:border-sky-400/65 bg-gradient-to-r from-sky-50 via-white to-cyan-50 dark:from-slate-900 dark:via-sky-950/60 dark:to-slate-900 text-slate-900 dark:text-white shadow-md shadow-sky-500/15'
      : 'border-emerald-600/70 dark:border-emerald-400/60 bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-sm';

  const iconBoxTone =
    perfMode === 'ultra'
      ? 'bg-cyan-400/20 border-cyan-300/40 text-cyan-200'
      : perfMode === 'balanced'
      ? 'bg-sky-600 border-sky-500 text-white'
      : 'bg-emerald-600 border-emerald-500 text-white';

  return (
    <button
      type="button"
      data-ripple="true"
      onClick={openGraphicsModal}
      className={`group sci-frame cs-deck-btn w-full ${
        variant === 'overview' ? 'max-w-3xl mx-auto' : ''
      } rounded-[4px] border-2 px-3.5 sm:px-4 py-2.5 sm:py-3 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${tierTone}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`w-9 h-9 rounded-[4px] border flex items-center justify-center shrink-0 ${iconBoxTone}`}
        >
          {perfMode === 'ultra' ? (
            <Sparkles className="w-4 h-4 icon-anim-star" />
          ) : perfMode === 'balanced' ? (
            <SlidersHorizontal className="w-4 h-4 icon-anim-wand" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-display text-xs sm:text-sm font-bold leading-snug">
              {isEn
                ? 'Graphics & Animation Tier Setup'
                : 'Thiết lập Đồ họa · Thấp / Trung bình / Pro'}
            </span>
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border ${
                perfMode === 'ultra'
                  ? 'bg-cyan-500/20 border-cyan-300/40 text-cyan-200'
                  : perfMode === 'balanced'
                  ? 'bg-sky-100 dark:bg-sky-500/20 border-sky-300 dark:border-sky-400/40 text-sky-800 dark:text-sky-200'
                  : 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-400/40 text-emerald-800 dark:text-emerald-200'
              }`}
            >
              {isEn
                ? `Active: Tier ${tierNumber(perfMode)} · ${activeOpt.shortEn}`
                : `Đang bật: Mức ${tierNumber(perfMode)} · ${activeOpt.shortVi}`}
            </span>
          </div>

          <div
            className={`text-[11px] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 ${
              perfMode === 'ultra' ? 'text-sky-100/85' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3 h-3 shrink-0 opacity-80" />
              <span>
                {isEn
                  ? `Suggested for your PC (${hardwareProfile.cores} threads${
                      hardwareProfile.memoryGb ? `, ${hardwareProfile.memoryGb}GB RAM` : ''
                    }): `
                  : `Gợi ý cho máy bạn (${hardwareProfile.cores} luồng CPU${
                      hardwareProfile.memoryGb ? `, ${hardwareProfile.memoryGb}GB RAM` : ''
                    }): `}
                <strong
                  className={
                    perfMode === 'ultra'
                      ? 'text-cyan-200 font-bold'
                      : 'text-blue-700 dark:text-sky-300 font-bold'
                  }
                >
                  {isEn ? recommendedOpt.shortEn : recommendedOpt.shortVi}
                </strong>
              </span>
            </span>
          </div>
        </div>
      </div>

      <span
        className={`px-2.5 sm:px-3 py-1.5 rounded-[4px] font-mono text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1.5 whitespace-nowrap border ${
          perfMode === 'ultra'
            ? 'bg-white text-slate-950 border-white'
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent'
        }`}
      >
        <span>{isEn ? 'Configure' : 'Chọn mức'}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </button>
  );
};
