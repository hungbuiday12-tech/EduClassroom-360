import React from 'react';
import { SubjectType } from '../types';
import { Sun, Moon, Sparkles, Award } from 'lucide-react';

interface HeaderProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  xp: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSubject,
  onSelectSubject,
  isDark,
  onToggleTheme,
  xp
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectSubject('overview')}
          className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          EduClassroom 360
        </button>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectSubject('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'overview'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Lớp học
          </button>
          <button
            onClick={() => onSelectSubject('math')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'math'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Toán học (Đồ thị & Hình)
          </button>
          <button
            onClick={() => onSelectSubject('physics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'physics'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Vật lí (Mô phỏng 2D)
          </button>
          <button
            onClick={() => onSelectSubject('cs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'cs'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tin học (C++/Python Judge)
          </button>
          <button
            onClick={() => onSelectSubject('literature')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'literature'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Ngữ văn (Sơ đồ tư duy)
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 rounded-lg text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums">{xp} XP</span>
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => onSelectSubject('overview')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'overview' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Lớp học
        </button>
        <button
          onClick={() => onSelectSubject('math')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'math' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Toán học
        </button>
        <button
          onClick={() => onSelectSubject('physics')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'physics' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Vật lí 2D
        </button>
        <button
          onClick={() => onSelectSubject('cs')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'cs' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Tin học
        </button>
        <button
          onClick={() => onSelectSubject('literature')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'literature' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          Ngữ văn
        </button>
      </div>
    </header>
  );
};
