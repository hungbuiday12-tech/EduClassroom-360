import React, { useState } from 'react';
import { Box, Compass, LineChart, Shapes } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { FunctionGrapher } from '../math/FunctionGrapher';
import { GeometryStudio } from '../math/GeometryStudio';
import { Math3DView } from '../math/Math3DView';

interface MathSandboxSuiteProps {
  isEn?: boolean;
}

export const MathSandboxSuite: React.FC<MathSandboxSuiteProps> = ({ isEn = false }) => {
  const { mathGraphConfig, mathGeoPreset, math3DMode, goBack } = useNavigation();
  const [tab, setTab] = useState<'grapher' | 'geometry' | 'math3d'>('grapher');

  return (
    <div className="sim-math-scope space-y-5">
      <div className="sci-frame rounded-2xl border border-indigo-200 dark:border-indigo-500/35 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1.5 min-w-0">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                {isEn
                  ? 'Interactive Mathematics Sandbox (Grapher · Geometry 2D · Oxyz 3D)'
                  : 'Sandbox Toán Học Tương Tác (Đồ Thị · Hình Phẳng · Oxyz 3D)'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              {isEn
                ? 'Explore custom algebraic functions & calculus integrals, construct live Euclidean compass-ruler theorems, and manipulate 3D Oxyz spatial solids.'
                : 'Tự do nhập hàm số & khảo sát tích phân, dựng hình phẳng Euclid với compa–thước thẳng, và tương tác 11 cảnh hình học không gian Oxyz 3D.'}
            </p>
          </div>

          <div className="sim-seg-box flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 rounded-[6px] shrink-0">
            <button
              type="button"
              onClick={() => setTab('grapher')}
              className={`group sim-btn-math sim-btn-hero min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[4px] border cursor-pointer whitespace-nowrap ${
                tab === 'grapher'
                  ? 'sim-btn-active bg-blue-600 border-sky-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'grapher' && <span className="sim-led-square text-sky-200" />}
              <span className="icon-anim-grid">
                <LineChart className="w-4 h-4 shrink-0" />
              </span>
              <span>{isEn ? '2D Grapher & Calculus' : 'Đồ thị 2D & Tích phân'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('geometry')}
              className={`group sim-btn-math sim-btn-hero min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[4px] border cursor-pointer whitespace-nowrap ${
                tab === 'geometry'
                  ? 'sim-btn-active bg-emerald-600 border-emerald-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'geometry' && <span className="sim-led-square text-emerald-200" />}
              <span className="icon-anim-compass">
                <Shapes className="w-4 h-4 shrink-0" />
              </span>
              <span>{isEn ? '2D Geometry Drawing' : 'Vẽ Hình học 2D'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('math3d')}
              className={`group sim-btn-math sim-btn-hero min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-[4px] border cursor-pointer whitespace-nowrap ${
                tab === 'math3d'
                  ? 'sim-btn-active bg-indigo-600 border-indigo-300/70 text-white shadow-sm'
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'math3d' && <span className="sim-led-square text-indigo-200" />}
              <span className="icon-anim-3d-cube">
                <Box className="w-4 h-4 shrink-0" />
              </span>
              <span>{isEn ? '3D Oxyz Spatial Lab' : 'Không gian Oxyz 3D'}</span>
            </button>
          </div>
        </div>
      </div>

      {tab === 'grapher' && <FunctionGrapher initialConfig={mathGraphConfig} onBack={goBack} />}
      {tab === 'geometry' && <GeometryStudio initialPreset={mathGeoPreset} onBack={goBack} />}
      {tab === 'math3d' && <Math3DView initialMode={math3DMode} onBack={goBack} />}
    </div>
  );
};
