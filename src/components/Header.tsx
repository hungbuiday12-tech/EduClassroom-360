import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SubjectType } from '../types';
import {
  Sun,
  Moon,
  Award,
  LogOut,
  LogIn,
  ChevronDown,
  Globe,
  Check,
  ArrowLeft,
  Settings,
  Volume2,
  VolumeX,
  Gauge,
  Menu,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  useBackgroundTheme,
  BACKGROUND_STYLE_OPTIONS,
  CREATURE_THEME_OPTIONS,
  PERFORMANCE_MODE_OPTIONS
} from '../context/BackgroundContext';
import { useNavigation, getLocationLabel } from '../context/NavigationContext';
import { useAudio } from '../context/AudioContext';
import { BrandLogo } from './common/BrandLogo';

interface HeaderProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  xp: number;
  onReturnToLanding?: () => void;
  onOpenSettings: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  xp,
  onReturnToLanding,
  onOpenSettings,
  onOpenMobileMenu
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const isEn = language === 'en';
  const { bgStyle, setBgStyle, creatureTheme, setCreatureTheme, perfMode, setPerfMode } =
    useBackgroundTheme();
  const { location, canGoBack, previousLocation, goBack, goClassroom } = useNavigation();
  const { isBgPlaying, toggleBgPlaying, bgSound } = useAudio();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBgMenuOpen, setIsBgMenuOpen] = useState(false);

  const bgMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const bgPanelRef = useRef<HTMLDivElement | null>(null);
  const userPanelRef = useRef<HTMLDivElement | null>(null);

  const [bgCoords, setBgCoords] = useState<{ top: number; right: number }>({ top: 56, right: 16 });
  const [userCoords, setUserCoords] = useState<{ top: number; right: number }>({ top: 56, right: 16 });

  const syncMenuCoords = useCallback(() => {
    if (bgMenuRef.current) {
      const r = bgMenuRef.current.getBoundingClientRect();
      setBgCoords({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    }
    if (userMenuRef.current) {
      const r = userMenuRef.current.getBoundingClientRect();
      setUserCoords({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    }
  }, []);

  useEffect(() => {
    if (!isBgMenuOpen && !isUserMenuOpen) return;
    syncMenuCoords();
    window.addEventListener('resize', syncMenuCoords);
    window.addEventListener('scroll', syncMenuCoords, true);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isBgMenuOpen &&
        bgMenuRef.current &&
        !bgMenuRef.current.contains(target) &&
        !(bgPanelRef.current && bgPanelRef.current.contains(target))
      ) {
        setIsBgMenuOpen(false);
      }
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        !(userPanelRef.current && userPanelRef.current.contains(target))
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', syncMenuCoords);
      window.removeEventListener('scroll', syncMenuCoords, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBgMenuOpen, isUserMenuOpen, syncMenuCoords]);

  const activeBgOption =
    BACKGROUND_STYLE_OPTIONS.find((opt) => opt.id === bgStyle) || BACKGROUND_STYLE_OPTIONS[1];
  const currentLabel = getLocationLabel(location, language);
  const prevLabel = previousLocation
    ? getLocationLabel(previousLocation, language)
    : t('nav.classroom', 'Lớp học', 'Classroom');

  const activePerf =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === perfMode) || PERFORMANCE_MODE_OPTIONS[0];
  const cyclePerfMode = () => {
    const order: Array<'smooth' | 'balanced' | 'ultra'> = ['smooth', 'balanced', 'ultra'];
    const idx = order.indexOf(perfMode);
    setPerfMode(order[(idx + 1) % order.length]);
  };

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/85 dark:border-slate-800/90">
      <div className="w-full h-full px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 flex-nowrap">
        {/* Left Cluster: Mobile Sidebar Button + Back + Active View Title */}
        <div className="flex items-center gap-2 min-w-0 flex-nowrap">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
            aria-label={isEn ? 'Open navigation sidebar' : 'Mở thanh điều hướng'}
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={goClassroom}
            className="lg:hidden flex items-center gap-2 font-display font-extrabold text-sm text-slate-900 dark:text-white shrink-0 cursor-pointer"
          >
            <BrandLogo sizeClass="w-6 h-6" />
          </button>

          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-800 shrink-0 whitespace-nowrap cursor-pointer transition-colors"
              title={`${isEn ? 'Back to' : 'Quay lại'}: ${prevLabel}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Back' : 'Quay lại'}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 min-w-0 pl-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
              Synapse
            </span>
            <span className="text-slate-300 dark:text-slate-700 shrink-0">/</span>
            <span className="font-display text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {currentLabel}
            </span>
          </div>
        </div>

        {/* Right Cluster: Background Presets, FPS, Lang, XP, Sound, Theme, Settings, Auth */}
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          {/* Quick Background / PC-Spec Theme Selector */}
          <div className="relative shrink-0" ref={bgMenuRef}>
            <button
              type="button"
              onClick={() => {
                syncMenuCoords();
                setIsBgMenuOpen((v) => !v);
                setIsUserMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Background & PC spec preset' : 'Chọn giao diện nền theo cấu hình máy'}
            >
              <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="hidden xl:inline max-w-[130px] truncate">
                {isEn ? activeBgOption.labelEn : activeBgOption.labelVi}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
            </button>

            {isBgMenuOpen &&
              typeof document !== 'undefined' &&
              createPortal(
                <div
                  ref={bgPanelRef}
                  style={{ top: bgCoords.top, right: bgCoords.right }}
                  className="fixed w-72 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-[220] text-xs max-h-[78vh] overflow-y-auto space-y-1"
                >
                  <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    {isEn ? 'Background by PC Spec' : 'Giao diện nền theo cấu hình máy'}
                  </div>
                  {BACKGROUND_STYLE_OPTIONS.map((opt) => {
                    const selected = opt.id === bgStyle;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setBgStyle(opt.id, true);
                          const supportsCreatures = ['ecosystem', 'ocean', 'sky', 'constellations', 'cosmic_galaxy'].includes(
                            opt.id
                          );
                          if (!supportsCreatures) {
                            setIsBgMenuOpen(false);
                          }
                        }}
                        className={`w-full flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="truncate">{isEn ? opt.labelEn : opt.labelVi}</div>
                          <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400 truncate">
                            {isEn ? opt.specBadgeEn : opt.specBadgeVi}
                          </div>
                        </div>
                        {selected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}

                  {['ecosystem', 'ocean', 'sky', 'constellations', 'cosmic_galaxy'].includes(bgStyle) && (
                    <div className="pt-1.5 mt-1 border-t border-slate-200/80 dark:border-slate-800 space-y-1">
                      <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                        {isEn ? 'Interactive Creatures' : 'Sinh vật chuyển động'}
                      </div>
                      {CREATURE_THEME_OPTIONS.map((c) => {
                        const selected = c.id === creatureTheme;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCreatureTheme(c.id);
                              setIsBgMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left cursor-pointer ${
                              selected
                                ? 'bg-slate-900 dark:bg-sky-600 text-white font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{isEn ? c.labelEn : c.labelVi}</span>
                            {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>,
                document.body
              )}
          </div>

          {/* Performance / FPS Cycler */}
          <button
            type="button"
            onClick={cyclePerfMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/60 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title={
              isEn
                ? `Graphics Mode: ${activePerf.labelEn}`
                : `Chế độ đồ họa: ${activePerf.labelVi} (bấm để đổi)`
            }
          >
            <Gauge className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="hidden 2xl:inline">
              {isEn ? activePerf.shortEn : activePerf.shortVi}
            </span>
          </button>

          {/* VI / EN Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 hover:border-sky-500/60 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title={language === 'vi' ? 'Switch interface to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className={language === 'vi' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-400'}>
              VI
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className={language === 'en' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-400'}>
              EN
            </span>
          </button>

          {/* XP Readout */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-lg text-xs font-mono font-bold text-amber-800 dark:text-amber-300 shrink-0 whitespace-nowrap">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="tabular-nums">{user ? user.xp : xp} XP</span>
          </div>

          {/* Background Soundscape Toggle */}
          <button
            type="button"
            onClick={toggleBgPlaying}
            className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
              isBgPlaying && bgSound !== 'off'
                ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isEn ? 'Toggle background sound' : 'Bật/tắt âm thanh nền'}
          >
            {isBgPlaying && bgSound !== 'off' ? (
              <Volume2 className="w-4 h-4 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 shrink-0" />
            )}
          </button>

          {/* Light / Dark Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            title={isDark ? (isEn ? 'Light Mode' : 'Chế độ Sáng') : isEn ? 'Dark Mode' : 'Chế độ Tối'}
            aria-label={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
            title={isEn ? 'Settings' : 'Cài đặt'}
          >
            <Settings className="w-4 h-4 shrink-0" />
          </button>

          {/* User Menu / Sign In */}
          {user ? (
            <div className="relative shrink-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  syncMenuCoords();
                  setIsUserMenuOpen((v) => !v);
                  setIsBgMenuOpen(false);
                }}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer whitespace-nowrap"
              >
                {user.role === 'admin' ? (
                  <BrandLogo sizeClass="w-6 h-6 rounded" />
                ) : user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-6 h-6 rounded object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-100 hidden md:inline max-w-[100px] truncate">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                  <div
                    ref={userPanelRef}
                    style={{ top: userCoords.top, right: userCoords.right }}
                    className="fixed w-64 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-[220] text-xs"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 truncate">@{user.username}</p>
                      <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="px-2 pt-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSettings();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-sky-600" />
                        <span>{isEn ? 'Account & Preferences' : 'Cài đặt tài khoản'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          if (onReturnToLanding) onReturnToLanding();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout', 'Đăng xuất', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              {onReturnToLanding && (
                <button
                  type="button"
                  onClick={onReturnToLanding}
                  className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t('nav.landing', 'Chào mừng', 'Welcome')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-700 dark:hover:bg-sky-100 font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>{t('nav.login', 'Đăng Nhập', 'Sign In')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

