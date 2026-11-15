import React, { useState, useRef, useEffect } from 'react';
import { SubjectType } from '../types';
import { Sun, Moon, Award, User, LogOut, LogIn, ChevronDown, Sparkles, Globe, Wand2, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useBackgroundTheme, CREATURE_THEME_OPTIONS } from '../context/BackgroundContext';
import { useNavigation, getLocationLabel } from '../context/NavigationContext';

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
  const { creatureTheme, setCreatureTheme } = useBackgroundTheme();
  const { canGoBack, previousLocation, goBack, goClassroom } = useNavigation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreatureMenuOpen, setIsCreatureMenuOpen] = useState(false);
  const creatureMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCreatureMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (creatureMenuRef.current && !creatureMenuRef.current.contains(e.target as Node)) {
        setIsCreatureMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCreatureMenuOpen]);

  const activeCreature =
    CREATURE_THEME_OPTIONS.find((opt) => opt.id === creatureTheme) || CREATURE_THEME_OPTIONS[0];
  const prevLabel = previousLocation ? getLocationLabel(previousLocation, language) : t('nav.classroom', 'Lớp học', 'Classroom');

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 h-14 sm:h-16">
        {/* Zone 1: Back History button + Brand Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {canGoBack && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs shrink-0"
              title={`${language === 'en' ? 'Back to' : 'Quay lại trang trước'}: ${prevLabel}`}
              aria-label={`Quay lại ${prevLabel}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline whitespace-nowrap">{language === 'en' ? 'Back' : 'Quay lại'}</span>
            </button>
          )}
          <button
            onClick={goClassroom}
            className="text-xs sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap truncate max-w-[130px] sm:max-w-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-1 sm:px-1.5 py-1 rounded-lg shrink-0"
          >
            EduClassroom 360
          </button>
        </div>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden xl:flex items-center gap-3.5 text-sm font-medium min-w-0">
          <button
            onClick={() => onSelectSubject('roadmap')}
            className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-lg transition-colors ${
              currentSubject === 'roadmap'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.roadmap', 'Lộ trình học', 'Roadmap')}
          </button>
          <button
            onClick={() => onSelectSubject('math')}
            className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-lg transition-colors ${
              currentSubject === 'math'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('subject.math', 'Toán học', 'Math')}
          </button>
          <button
            onClick={() => onSelectSubject('physics')}
            className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-lg transition-colors ${
              currentSubject === 'physics'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('subject.physics', 'Vật lí', 'Physics')}
          </button>
          <button
            onClick={() => onSelectSubject('cs')}
            className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-lg transition-colors ${
              currentSubject === 'cs'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('subject.cs', 'Tin học', 'CS')}
          </button>
          <button
            onClick={() => onSelectSubject('exams')}
            className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-lg transition-colors ${
              currentSubject === 'exams'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {language === 'en' ? 'Exams' : 'Đề Thi'}
          </button>
          <button
            onClick={() => onSelectSubject('arena')}
            className={`whitespace-nowrap shrink-0 px-2 py-1 rounded-lg transition-colors ${
              currentSubject === 'arena'
                ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/70 dark:bg-amber-950/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('nav.arena', 'Thi Đấu & BXH', 'Weekly Arena')}
          </button>
        </nav>

        {/* Zone 3: Actions + User Profile & Language/Theme switcher */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Language Switcher Button (VI | EN) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={language === 'vi' ? 'Switch interface to English' : 'Chuyển giao diện sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500 hidden xs:block sm:block" />
            <span className={language === 'vi' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'}>
              VI
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className={language === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'}>
              EN
            </span>
          </button>

          {/* XP Pill */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 rounded-lg text-[11px] sm:text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums">{user ? user.xp : xp} XP</span>
          </div>

          {/* Background Creature Theme Selector */}
          <div className="relative" ref={creatureMenuRef}>
            <button
              onClick={() => setIsCreatureMenuOpen(!isCreatureMenuOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-xl border border-indigo-200/70 dark:border-indigo-800/70 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer whitespace-nowrap"
              title={language === 'vi' ? 'Chọn sinh vật nền tương tác' : 'Choose interactive background creature'}
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span className="hidden md:inline">
                {language === 'vi' ? activeCreature.shortVi : activeCreature.shortEn}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {isCreatureMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 text-xs">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                  {language === 'vi' ? 'Nền Tương Tác (Chuột / Nảy)' : 'Interactive Background'}
                </div>
                {CREATURE_THEME_OPTIONS.map((opt) => {
                  const selected = opt.id === creatureTheme;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setCreatureTheme(opt.id);
                        setIsCreatureMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        selected
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{language === 'vi' ? opt.labelVi : opt.labelEn}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
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
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold text-[11px] sm:text-xs shadow-xs transition-colors whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.login', 'Đăng Nhập', 'Sign In')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Compact Laptop Navigation bar */}
      <div className="xl:hidden flex items-center justify-start sm:justify-center px-3 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-x-auto text-xs font-medium gap-2">
        <button
          onClick={() => onSelectSubject('roadmap')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${currentSubject === 'roadmap' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t('nav.roadmap', 'Lộ trình', 'Roadmap')}
        </button>
        <button
          onClick={() => onSelectSubject('math')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${currentSubject === 'math' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t('subject.math', 'Toán học', 'Math')}
        </button>
        <button
          onClick={() => onSelectSubject('physics')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${currentSubject === 'physics' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t('subject.physics', 'Vật lí', 'Physics')}
        </button>
        <button
          onClick={() => onSelectSubject('cs')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${currentSubject === 'cs' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t('subject.cs', 'Tin học', 'CS')}
        </button>
        <button
          onClick={() => onSelectSubject('exams')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${currentSubject === 'exams' ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {language === 'en' ? 'Exams' : 'Đề Thi'}
        </button>
        <button
          onClick={() => onSelectSubject('arena')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0 ${currentSubject === 'arena' ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {t('nav.arena', 'Thi Đấu & BXH', 'Arena')}
        </button>
      </div>
    </header>
  );
};
