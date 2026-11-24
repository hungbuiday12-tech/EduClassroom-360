import React from 'react';
import { MathLectures } from './MathLectures';
import { Math3DMode } from './Math3DView';
import { LineChart, Shapes, Box, ArrowLeft, Home, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { FunctionPlotConfig } from '../../types';

interface MathStudioProps {
  onBack?: () => void;
}

export const MathStudio: React.FC<MathStudioProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const { navigate, goBack, goClassroom, setMathGraphConfig, setMath3DMode, setMathGeoPreset } = useNavigation();

  const handleNavigateFromLecture = (
    tab: 'grapher' | 'geometry' | 'math3d' | 'lectures',
    opts?: { graphConfig?: Partial<FunctionPlotConfig>; mode3d?: Math3DMode; geoPreset?: string }
  ) => {
    if (opts?.graphConfig) {
      setMathGraphConfig({ ...opts.graphConfig });
    }
    if (opts?.mode3d) {
      setMath3DMode(opts.mode3d);
    }
    if (opts?.geoPreset) {
      setMathGeoPreset(opts.geoPreset);
    }
    if (tab === 'lectures') {
      navigate({ subject: 'math', mathTab: 'lectures', mathViewMode: 'catalog' });
    } else {
      navigate({ subject: 'math_sims', mathTab: tab });
    }
  };

  const handleBackAction = onBack || goBack;

  return (
    <div className="space-y-6">
      {/* Subject Header (Lectures & Practice focused; Simulations & Drawing live in dedicated Math Simulations page) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <button
              onClick={handleBackAction}
              className="cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('nav.back_prev', 'Quay lại trang trước', 'Back')}</span>
            </button>
            <button
              onClick={goClassroom}
              className="cs-deck-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('nav.classroom', 'Lớp học', 'Classroom')}</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t('math.title', 'Toán Học — Bài Giảng & Luyện Tập', 'Mathematics — Lectures & Practice')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'math.desc',
              'Hai khu chuyên biệt (Không chuyên GDPT 9–12 & Chuyên Toán CB → NC → HSG) cùng Trắc nghiệm + Tự luận chi tiết. Phần Mô phỏng & Vẽ hình đã được tách thành trang chuyên biệt.',
              'Two tracks (Standard Grades 9–12 & Specialized Math) with MCQ + Essay practice, linked directly to the standalone Math 2D/3D & Drawing Studio.'
            )}
          </p>
        </div>

        {/* Quick Launch Buttons to Standalone Math Simulations & Drawing Page */}
        <div className="sim-math-scope flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate({ subject: 'math_sims', mathTab: 'grapher' })}
            className="group sim-btn-math sim-btn-hero sim-btn-active flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-sky-400/60 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs whitespace-nowrap cursor-pointer"
          >
            <span className="icon-anim-grid">
              <LineChart className="w-3.5 h-3.5" />
            </span>
            <span>{isEn ? '2D Grapher' : 'Đồ thị 2D'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ subject: 'math_sims', mathTab: 'geometry' })}
            className="group sim-btn-math sim-btn-hero sim-btn-active flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-emerald-400/60 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs whitespace-nowrap cursor-pointer"
          >
            <span className="icon-anim-compass">
              <Shapes className="w-3.5 h-3.5" />
            </span>
            <span>{isEn ? '2D Draw' : 'Vẽ Hình 2D'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ subject: 'math_sims', mathTab: 'math3d' })}
            className="group sim-btn-math sim-btn-hero sim-btn-active flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-indigo-300/60 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs whitespace-nowrap cursor-pointer"
          >
            <span className="icon-anim-3d-cube">
              <Box className="w-3.5 h-3.5" />
            </span>
            <span>{isEn ? '3D Oxyz' : 'Mô phỏng 3D'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ subject: 'math_sims', mathTab: 'grapher' })}
            className="group sim-btn-math sim-btn-hero flex items-center gap-1.5 px-3.5 py-2 rounded-[3px] border border-sky-400/50 text-xs font-bold bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 text-white whitespace-nowrap cursor-pointer"
          >
            <span className="sim-led-square text-cyan-300" />
            <Compass className="w-3.5 h-3.5" />
            <span>{isEn ? 'Open Math Studio' : 'Mở Trang Mô phỏng Toán'}</span>
          </button>
        </div>
      </div>

      <MathLectures onNavigateTab={handleNavigateFromLecture} />
    </div>
  );
};
