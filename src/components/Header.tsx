import React, { useState } from 'react';
import { SubjectType } from '../types';
import { Sun, Moon, Award, User, LogOut, LogIn, ChevronDown, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  xp: number;
  onReturnToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSubject,
  onSelectSubject,
  isDark,
  onToggleTheme,
  xp,
  onReturnToLanding,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectSubject('overview')}
          className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          EduClassroom 360
        </button>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => onSelectSubject('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'overview'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.classroom', 'Lớp học', 'Classroom')}
          </button>
          <button
            onClick={() => onSelectSubject('math')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'math'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.math', 'Toán học (Đồ thị & 3D)', 'Math (Graphs & 3D)')}
          </button>
          <button
            onClick={() => onSelectSubject('physics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'physics'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.physics', 'Vật lí (Mô phỏng 2D/3D)', 'Physics (2D/3D Labs)')}
          </button>
          <button
            onClick={() => onSelectSubject('cs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'cs'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.cs', 'Tin học (Online Judge & Tự do)', 'CS (Online Judge & Custom)')}
          </button>
          <button
            onClick={() => onSelectSubject('exams')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentSubject === 'exams'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.exams', 'Đề Thi (60 Đề)', 'Exams (60 Papers)')}
          </button>
        </nav>

        {/* Zone 3: Actions + User Profile & Language/Theme switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher Button (VI | EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={language === 'vi' ? 'Switch interface to English' : 'Chuyển giao diện sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span className={language === 'vi' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'}>
              VI
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className={language === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'}>
              EN
            </span>
          </button>

          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 rounded-lg text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums">{user ? user.xp : xp} XP</span>
          </div>

          {/* Theme button */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isDark ? 'Chuyển sang chế độ Sáng (Light)' : 'Chuyển sang chế độ Tối (Dark)'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Authentication State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User dropdown popup */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">
                      @{user.username}
                    </p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="px-2 py-1">
                    <button
                      onClick={() => {
                        logout();
                        if (onReturnToLanding) onReturnToLanding();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout', 'Đăng xuất', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onReturnToLanding && (
                <button
                  onClick={onReturnToLanding}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs transition-colors"
                  title="Quay lại Trang Cổng Chào Mừng Galaxy"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('nav.landing', 'Trang Chào Mừng', 'Welcome Portal')}</span>
                </button>
              )}
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-xs shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.login', 'Đăng Nhập', 'Sign In')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => onSelectSubject('overview')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'overview' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          {t('nav.classroom', 'Lớp học', 'Classroom')}
        </button>
        <button
          onClick={() => onSelectSubject('math')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'math' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          {t('subject.math', 'Toán học', 'Math')}
        </button>
        <button
          onClick={() => onSelectSubject('physics')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'physics' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          {t('subject.physics', 'Vật lí 2D', 'Physics 2D')}
        </button>
        <button
          onClick={() => onSelectSubject('cs')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'cs' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          {t('subject.cs', 'Tin học', 'CS')}
        </button>
        <button
          onClick={() => onSelectSubject('exams')}
          className={`px-2 py-1 whitespace-nowrap ${currentSubject === 'exams' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          {t('nav.exams', 'Đề Thi', 'Exams')}
        </button>
      </div>
    </header>
  );
};
