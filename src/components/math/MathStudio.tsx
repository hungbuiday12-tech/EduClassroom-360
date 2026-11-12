import React, { useState } from 'react';
import { FunctionGrapher } from './FunctionGrapher';
import { GeometryStudio } from './GeometryStudio';
import { MathLectures } from './MathLectures';
import { Math3DView } from './Math3DView';
import { LineChart, Shapes, BookOpen, Box } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MathStudio: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'grapher' | 'geometry' | 'math3d' | 'lectures'>('grapher');

  return (
    <div className="space-y-6">
      {/* Subject Sub-navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t('math.title', 'Toán Học Tương Tác 360°', 'Interactive Mathematics 360°')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'math.desc',
              'Khảo sát đồ thị hàm số 2D, phòng thực hành vẽ hình học phẳng, mô phỏng không gian Oxyz 3D và kho bài giảng chuyên sâu',
              '2D function grapher, dynamic geometry studio, 3D Oxyz spatial geometry simulations, and comprehensive curriculum lectures'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('grapher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'grapher'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('math.tab.grapher', 'Đồ thị hàm số', 'Function Grapher')}</span>
          </button>
          <button
            onClick={() => setActiveTab('geometry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'geometry'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Shapes className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('math.tab.geometry', 'Vẽ hình học', 'Geometry')}</span>
          </button>
          <button
            onClick={() => setActiveTab('math3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'math3d'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('math.tab.3d', 'Không gian Oxyz 3D', '3D Oxyz Spatial')}</span>
          </button>
          <button
            onClick={() => setActiveTab('lectures')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'lectures'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('math.tab.lectures', 'Bài giảng & Trắc nghiệm', 'Lectures & Quiz')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'grapher' && <FunctionGrapher />}
      {activeTab === 'geometry' && <GeometryStudio />}
      {activeTab === 'math3d' && <Math3DView />}
      {activeTab === 'lectures' && <MathLectures onNavigateTab={(tab) => setActiveTab(tab as any)} />}
    </div>
  );
};
