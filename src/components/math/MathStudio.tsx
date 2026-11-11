import React, { useState } from 'react';
import { FunctionGrapher } from './FunctionGrapher';
import { GeometryStudio } from './GeometryStudio';
import { MathLectures } from './MathLectures';
import { LineChart, Shapes, BookOpen } from 'lucide-react';

export const MathStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grapher' | 'geometry' | 'lectures'>('grapher');

  return (
    <div className="space-y-6">
      {/* Subject Sub-navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Toán học tương tác (Math Studio)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Khảo sát đồ thị hàm số, phòng thực hành vẽ hình học động và kho bài giảng chuyên đề
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('grapher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'grapher'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 text-indigo-500" />
            Vẽ đồ thị hàm số
          </button>
          <button
            onClick={() => setActiveTab('geometry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'geometry'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Shapes className="w-3.5 h-3.5 text-emerald-500" />
            Vẽ hình học phẳng & 3D
          </button>
          <button
            onClick={() => setActiveTab('lectures')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'lectures'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            Bài giảng & Trắc nghiệm
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'grapher' && <FunctionGrapher />}
      {activeTab === 'geometry' && <GeometryStudio />}
      {activeTab === 'lectures' && <MathLectures />}
    </div>
  );
};
