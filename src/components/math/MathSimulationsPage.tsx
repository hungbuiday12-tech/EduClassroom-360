import React from 'react';
import { FunctionGrapher } from './FunctionGrapher';
import { GeometryStudio } from './GeometryStudio';
import { Math3DView } from './Math3DView';
import {
  ArrowLeft,
  BookOpen,
  Box,
  Compass,
  Home,
  LineChart,
  Shapes
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';

interface MathSimulationsPageProps {
  onBack?: () => void;
}

export const MathSimulationsPage: React.FC<MathSimulationsPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    location,
    navigate,
    goBack,
    goClassroom,
    mathGraphConfig,
    math3DMode,
    mathGeoPreset
  } = useNavigation();

  const activeTab: 'grapher' | 'geometry' | 'math3d' =
    location.mathTab === 'geometry' || location.mathTab === 'math3d'
      ? location.mathTab
      : 'grapher';

  const setActiveTab = (tab: 'grapher' | 'geometry' | 'math3d') => {
    navigate({ subject: 'math_sims', mathTab: tab });
  };

  return (
    <div className="sim-math-scope space-y-5 pb-10">
      {/* Dedicated Header Command Bar */}
      <section className="sci-frame rounded-[4px] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onBack || goBack}
                className="group sim-btn-math flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
              <button
                type="button"
                onClick={goClassroom}
                className="group sim-btn-math flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-xs font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isEn ? 'Classroom' : 'Lớp học'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate({ subject: 'math', mathTab: 'lectures', mathViewMode: 'catalog' })
                }
                className="group sim-btn-math sim-btn-hero flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] text-xs font-bold text-blue-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/70 cursor-pointer whitespace-nowrap"
              >
                <span className="icon-anim-book">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <span>{isEn ? 'Open Math Lectures' : 'Mở Kho Bài giảng Toán'}</span>
              </button>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>
                {isEn
                  ? 'Mathematics 2D/3D Simulations & Drawing Studio'
                  : 'Phòng Mô Phỏng & Vẽ Hình Toán Học 2D/3D'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              {isEn
                ? 'Dedicated interactive workspace for 2D Function Graphing & Integrals, Dynamic Euclidean Geometry Drawing, and 3D Oxyz Spatial Hologram Models.'
                : 'Không gian chuyên biệt tách riêng cho Khảo sát Đồ thị & Tích phân 2D, Xưởng Vẽ Hình học Phẳng & Compa, và Không gian 3D Oxyz.'}
            </p>
          </div>

          {/* 3 Workspace Switcher Tabs */}
          <div className="sim-seg-box flex flex-nowrap overflow-x-auto lg:overflow-visible items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-[4px] w-full lg:w-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('grapher')}
              className={`group sim-btn-math sim-btn-hero min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[3px] border whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'grapher'
                  ? 'sim-btn-active bg-blue-600 border-sky-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              {activeTab === 'grapher' && <span className="sim-led-square text-sky-200" />}
              <span className="icon-anim-grid">
                <LineChart className="w-4 h-4 shrink-0" />
              </span>
              <span>{isEn ? '2D Grapher & Calculus' : 'Đồ thị 2D & Tích phân'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('geometry')}
              className={`group sim-btn-math sim-btn-hero min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[3px] border whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'geometry'
                  ? 'sim-btn-active bg-emerald-600 border-emerald-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              {activeTab === 'geometry' && <span className="sim-led-square text-emerald-200" />}
              <span className="icon-anim-compass">
                <Shapes className="w-4 h-4 shrink-0" />
              </span>
              <span>{isEn ? '2D Geometry Drawing' : 'Vẽ Hình học 2D'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('math3d')}
              className={`group sim-btn-math sim-btn-hero min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[3px] border whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'math3d'
                  ? 'sim-btn-active bg-indigo-600 border-indigo-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              {activeTab === 'math3d' && <span className="sim-led-square text-indigo-200" />}
              <span className="icon-anim-3d-cube">
                <Box className="w-4 h-4 shrink-0" />
              </span>
              <span>{isEn ? '3D Oxyz & Hologram' : 'Mô phỏng 3D · Oxyz'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Active Studio Canvas */}
      {activeTab === 'grapher' && (
        <FunctionGrapher initialConfig={mathGraphConfig} onBack={goBack} />
      )}
      {activeTab === 'geometry' && <GeometryStudio initialPreset={mathGeoPreset} onBack={goBack} />}
      {activeTab === 'math3d' && (
        <Math3DView initialMode={math3DMode} onBack={goBack} />
      )}
    </div>
  );
};
