import React, { useState } from 'react';
import { FunctionGrapher } from './FunctionGrapher';
import { GeometryStudio } from './GeometryStudio';
import { MathLectures } from './MathLectures';
import { Math3DView, Math3DMode } from './Math3DView';
import { LineChart, Shapes, BookOpen, Box, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { FunctionPlotConfig } from '../../types';

interface MathStudioProps {
  onBack?: () => void;
}

export const MathStudio: React.FC<MathStudioProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { location, navigate, goBack, goClassroom } = useNavigation();
  const activeTab = location.mathTab;
  const [selectedGraphConfig, setSelectedGraphConfig] = useState<Partial<FunctionPlotConfig> | null>(null);
  const [selected3DMode, setSelected3DMode] = useState<Math3DMode>('oxyz_vector');

  const setActiveTab = (tab: 'grapher' | 'geometry' | 'math3d' | 'lectures') => {
    navigate({ mathTab: tab });
  };

  const handleNavigateFromLecture = (
    tab: 'grapher' | 'geometry' | 'math3d' | 'lectures',
    opts?: { graphConfig?: Partial<FunctionPlotConfig>; mode3d?: Math3DMode }
  ) => {
    if (opts?.graphConfig) {
      setSelectedGraphConfig({ ...opts.graphConfig });
    }
    if (opts?.mode3d) {
      setSelected3DMode(opts.mode3d);
    }
    navigate({ mathTab: tab });
  };

  const handleBackAction = onBack || goBack;

  return (
    <div className="space-y-6">
      {/* Subject Sub-navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <button
              onClick={handleBackAction}
              className="cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('nav.back_prev', 'Quay lại trang trước', 'Back')}</span>
            </button>
            <button
              onClick={goClassroom}
              className="cs-deck-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('nav.classroom', 'Lớp học', 'Classroom')}</span>
            </button>
            {activeTab !== 'lectures' && (
              <button
                onClick={() => navigate({ mathTab: 'lectures', mathViewMode: 'catalog' })}
                className="cs-deck-btn flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-blue-700 dark:text-sky-300 bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('math.goto_lectures', 'Kho Bài giảng', 'Lectures')}</span>
              </button>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t('math.title', 'Toán Học Tương Tác 360°', 'Interactive Mathematics 360°')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'math.desc',
              'Hai khu chuyên biệt (Không chuyên GDPT 9–12 & Chuyên Toán CB → NC → HSG), mô phỏng 2D/3D từng bài và Trắc nghiệm + Tự luận chi tiết',
              'Two tracks (Standard Grades 9–12 & Specialized Math), per-lesson 2D/3D simulations, and MCQ + Essay practice'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-lg">
          <button
            onClick={() => setActiveTab('lectures')}
            className={`group cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'lectures'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500 icon-anim-book" />
            <span>{t('math.tab.lectures', 'Bài giảng & Bài tập', 'Lectures & Practice')}</span>
          </button>
          <button
            onClick={() => setActiveTab('grapher')}
            className={`group cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'grapher'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 icon-anim-wave" />
            <span>{t('math.tab.grapher', 'Mô phỏng 2D · Đồ thị', '2D Grapher')}</span>
          </button>
          <button
            onClick={() => setActiveTab('geometry')}
            className={`group cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'geometry'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Shapes className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 icon-anim-compass" />
            <span>{t('math.tab.geometry', 'Mô phỏng 2D · Hình học', '2D Geometry')}</span>
          </button>
          <button
            onClick={() => setActiveTab('math3d')}
            className={`group sim-btn-3d cs-deck-btn flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'math3d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 icon-anim-3d-cube" />
            <span>{t('math.tab.3d', 'Mô phỏng 3D · Oxyz', '3D Oxyz Spatial')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'lectures' && <MathLectures onNavigateTab={handleNavigateFromLecture} />}
      {activeTab === 'grapher' && <FunctionGrapher initialConfig={selectedGraphConfig} onBack={goBack} />}
      {activeTab === 'geometry' && <GeometryStudio onBack={goBack} />}
      {activeTab === 'math3d' && <Math3DView initialMode={selected3DMode} onBack={goBack} />}
    </div>
  );
};
