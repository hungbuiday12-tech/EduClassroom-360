import React from 'react';
import { ArrowLeft, BookOpen, Box, Code2, Home, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { CS3DVisualizer } from './CS3DVisualizer';

interface CodeSimulationsPageProps {
  onBack?: () => void;
}

export const CodeSimulationsPage: React.FC<CodeSimulationsPageProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate, goBack, goClassroom } = useNavigation();

  const activeTab: 'viz2d' | 'viz3d' = location.csSimTab === 'viz3d' ? 'viz3d' : 'viz2d';

  const setActiveTab = (tab: 'viz2d' | 'viz3d') => {
    navigate({ subject: 'cs_sims', csSimTab: tab });
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Dedicated Header Command Bar matching MathSimulationsPage */}
      <section className="sci-frame rounded-[4px] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onBack || goBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isEn ? 'Back' : 'Quay lại'}</span>
              </button>
              <button
                type="button"
                onClick={goClassroom}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] text-xs font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isEn ? 'Classroom' : 'Lớp học'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate({
                    subject: 'cs',
                    csViewMode: 'curriculum',
                    csSubView: 'roadmap'
                  })
                }
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[3px] text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isEn ? 'Open CS Lessons & IDE' : 'Mở Kho Bài giảng & IDE Code'}</span>
              </button>
            </div>

            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                {isEn
                  ? 'Code & Algorithm 2D/3D Simulations Studio'
                  : 'Phòng Mô Phỏng Code & Thuật Toán 2D/3D (Tin Học)'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              {isEn
                ? 'Interactive 2D trace canvases (16 algorithms: Oxy, Strings, DP, Binary Search, Graphs) paired with 10 real-time 3D WebGL data structure & pathfinding visualizations.'
                : 'Không gian chuyên biệt gồm 16 mô phỏng thuật toán 2D (Tọa độ Oxy, Xâu, Mảng, DP, Chặt nhị phân, Đồ thị, Cây) kết hợp 10 sân khấu WebGL 3D tương tác trực tiếp từng dòng code.'}
            </p>
          </div>

          {/* 2D / 3D Switcher Tabs */}
          <div className="flex flex-nowrap overflow-x-auto lg:overflow-visible items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-[4px] w-full lg:w-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('viz2d')}
              className={`min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[3px] border whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'viz2d'
                  ? 'bg-emerald-600 border-emerald-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>{isEn ? '2D Algorithm Sims (16)' : 'Mô phỏng Code 2D (16)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('viz3d')}
              className={`min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[3px] border whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'viz3d'
                  ? 'bg-teal-600 border-teal-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              <Box className="w-4 h-4 shrink-0" />
              <span>{isEn ? '3D Data & Code Hologram (10)' : 'Mô phỏng Code 3D (10)'}</span>
            </button>
          </div>
        </div>
      </section>

      {activeTab === 'viz2d' ? (
        <AlgorithmVisualizer onBack={onBack || goBack} />
      ) : (
        <CS3DVisualizer onBack={onBack || goBack} />
      )}
    </div>
  );
};
