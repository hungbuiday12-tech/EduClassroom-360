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
  Sparkles,
  Download,
  Flame,
  UserCheck,
  Mic,
  SlidersHorizontal,
  QrCode
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
import { useRemoteController } from '../context/RemoteControllerContext';
import { BrandLogo } from './common/BrandLogo';
import { getStreakState, GROWTH_UPDATED_EVENT } from '../lib/learningGrowthStore';

interface HeaderProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  xp: number;
  onReturnToLanding?: () => void;
  onOpenSettings: () => void;
  onOpenMobileMenu: () => void;
  onOpenInstallApp?: () => void;
  onOpenPortfolio?: () => void;
  onOpenVoiceOS?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  xp,
  onReturnToLanding,
  onOpenSettings,
  onOpenMobileMenu,
  onOpenInstallApp,
  onOpenPortfolio,
  onOpenVoiceOS
}) => {
  const { user, firebaseUser, openAuthModal, logout } = useAuth();
  const uid = user?.uid || firebaseUser?.uid;
  const [streakDays, setStreakDays] = useState<number>(() => getStreakState(uid).currentStreak);
  useEffect(() => {
    const sync = () => setStreakDays(getStreakState(uid).currentStreak);
    sync();
    window.addEventListener(GROWTH_UPDATED_EVENT, sync);
    return () => window.removeEventListener(GROWTH_UPDATED_EVENT, sync);
  }, [uid]);
  const { language, toggleLanguage, t } = useLanguage();
  const isEn = language === 'en';
  const { bgStyle, setBgStyle, creatureTheme, setCreatureTheme, perfMode, openGraphicsModal } =
    useBackgroundTheme();
  const { location, canGoBack, previousLocation, goBack, goClassroom } = useNavigation();
  const { isBgPlaying, toggleBgPlaying, bgSound } = useAudio();
  const { openModal: openRemoteModal, controllerCount, roomCode: remoteRoomCode } = useRemoteController();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBgMenuOpen, setIsBgMenuOpen] = useState(false);
  const [isCompactToolsOpen, setIsCompactToolsOpen] = useState(false);

  const bgMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const compactToolsRef = useRef<HTMLDivElement | null>(null);

  const bgPanelRef = useRef<HTMLDivElement | null>(null);
  const userPanelRef = useRef<HTMLDivElement | null>(null);
  const compactToolsPanelRef = useRef<HTMLDivElement | null>(null);

  const [bgCoords, setBgCoords] = useState<{ top: number; right: number }>({ top: 56, right: 16 });
  const [userCoords, setUserCoords] = useState<{ top: number; right: number }>({ top: 56, right: 16 });
  const [toolsCoords, setToolsCoords] = useState<{ top: number; right: number }>({ top: 56, right: 12 });

  const syncMenuCoords = useCallback(() => {
    if (bgMenuRef.current) {
      const r = bgMenuRef.current.getBoundingClientRect();
      setBgCoords({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    }
    if (userMenuRef.current) {
      const r = userMenuRef.current.getBoundingClientRect();
      setUserCoords({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    }
    if (compactToolsRef.current) {
      const r = compactToolsRef.current.getBoundingClientRect();
      setToolsCoords({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    }
  }, []);

  useEffect(() => {
    if (!isBgMenuOpen && !isUserMenuOpen && !isCompactToolsOpen) return;
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
      if (
        isCompactToolsOpen &&
        compactToolsRef.current &&
        !compactToolsRef.current.contains(target) &&
        !(compactToolsPanelRef.current && compactToolsPanelRef.current.contains(target))
      ) {
        setIsCompactToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', syncMenuCoords);
      window.removeEventListener('scroll', syncMenuCoords, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBgMenuOpen, isUserMenuOpen, isCompactToolsOpen, syncMenuCoords]);

  const activeBgOption =
    BACKGROUND_STYLE_OPTIONS.find((opt) => opt.id === bgStyle) || BACKGROUND_STYLE_OPTIONS[1];
  const currentLabel = getLocationLabel(location, language);
  const prevLabel = previousLocation
    ? getLocationLabel(previousLocation, language)
    : t('nav.classroom', 'Lớp học', 'Classroom');

  const activePerf =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === perfMode) || PERFORMANCE_MODE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/85 dark:border-slate-800/90 overflow-x-clip">
      <div className="w-full h-full px-2.5 sm:px-5 lg:px-6 flex items-center justify-between gap-2 flex-nowrap">
        {/* Left Cluster: Mobile Sidebar Button + Logo + Back + Truncated Page Label */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 flex-nowrap overflow-hidden">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
            aria-label={isEn ? 'Open navigation sidebar' : 'Mở thanh điều hướng'}
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={goClassroom}
            className="lg:hidden flex items-center gap-1.5 font-display font-extrabold text-sm text-slate-900 dark:text-white shrink-0 cursor-pointer p-1"
            aria-label="Synapse"
          >
            <BrandLogo sizeClass="w-6 h-6" />
          </button>

          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 min-h-[36px] py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-800 shrink-0 whitespace-nowrap cursor-pointer transition-colors"
              title={`${isEn ? 'Back to' : 'Quay lại'}: ${prevLabel}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Back' : 'Quay lại'}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pl-0.5 sm:pl-1">
            <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
              Synapse
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700 shrink-0">/</span>
            <span className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {currentLabel}
            </span>
          </div>
        </div>

        {/* Right Cluster: Full desktop bar on xl+, clean condensed utilities on Phone & iPad */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap shrink-0">
          {/* Quick Background / PC-Spec Theme Selector (Desktop xl+) */}
          <div className="hidden xl:block relative shrink-0" ref={bgMenuRef}>
            <button
              type="button"
              onClick={() => {
                syncMenuCoords();
                setIsBgMenuOpen((v) => !v);
                setIsUserMenuOpen(false);
                setIsCompactToolsOpen(false);
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

          {/* Graphics Tier Setup Trigger (Desktop xl+) */}
          <button
            type="button"
            onClick={openGraphicsModal}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/60 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title={
              isEn
                ? `Graphics Mode: ${activePerf.labelEn}`
                : `Thiết lập đồ họa: ${activePerf.labelVi} (bấm để mở bảng 3 mức)`
            }
          >
            <Gauge className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="hidden 2xl:inline">
              {isEn ? activePerf.shortEn : activePerf.shortVi}
            </span>
          </button>

          {/* VI / EN Toggle (Desktop xl+) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 hover:border-sky-500/60 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
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

          {/* Voice OS Command Button (iPad Landscape lg/xl+ inline, inside Tools drawer on < md) */}
          {onOpenVoiceOS && (
            <button
              type="button"
              onClick={onOpenVoiceOS}
              title={isEn ? 'Open Synapse Voice OS (Alt+Space)' : 'Mở Synapse Voice OS · Ra lệnh giọng nói (Alt+Space)'}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-cyan-400/60 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/70 text-cyan-800 dark:text-cyan-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300 shrink-0" />
              <span className="hidden xl:inline">Voice OS</span>
            </button>
          )}

          {/* Background Soundscape Toggle (Desktop xl+) */}
          <button
            type="button"
            onClick={toggleBgPlaying}
            className={`hidden xl:flex p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
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

          {/* Compact Utility Drawer Button for Phone & iPad (< xl) */}
          <div className="xl:hidden relative shrink-0" ref={compactToolsRef}>
            <button
              type="button"
              onClick={() => {
                syncMenuCoords();
                setIsCompactToolsOpen((v) => !v);
                setIsUserMenuOpen(false);
                setIsBgMenuOpen(false);
              }}
              className="min-h-[38px] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/60 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              aria-label={isEn ? 'Quick tools & preferences' : 'Công cụ & Tùy chọn nhanh'}
              title={isEn ? 'Quick tools & preferences' : 'Công cụ, XP & Tùy chọn nhanh'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="hidden sm:inline">{isEn ? 'Tools' : 'Tiện ích'}</span>
            </button>

            {isCompactToolsOpen &&
              typeof document !== 'undefined' &&
              createPortal(
                <div
                  ref={compactToolsPanelRef}
                  style={{ top: toolsCoords.top, right: toolsCoords.right }}
                  className="fixed w-[min(320px,calc(100vw-24px))] bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-[220] text-xs max-h-[78dvh] overflow-y-auto space-y-2.5"
                >
                  {/* Portfolio / XP */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompactToolsOpen(false);
                      onOpenPortfolio?.();
                    }}
                    className="w-full min-h-[42px] flex items-center justify-between gap-2 px-3 py-2 bg-amber-50/85 dark:bg-amber-950/45 border border-amber-300/80 dark:border-amber-700/60 rounded text-xs font-mono font-bold text-amber-800 dark:text-amber-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{streakDays}d Streak · {user ? user.xp : xp} XP</span>
                    </span>
                    <UserCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  </button>

                  {/* 2x2 Quick Toggle Grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-500" />
                      <span>{language === 'vi' ? 'VI / EN' : 'EN / VI'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleBgPlaying}
                      className={`min-h-[40px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border font-bold cursor-pointer ${
                        isBgPlaying && bgSound !== 'off'
                          ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isBgPlaying && bgSound !== 'off' ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                      <span>{isEn ? 'Sound' : 'Âm thanh'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCompactToolsOpen(false);
                        openGraphicsModal();
                      }}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Gauge className="w-3.5 h-3.5 text-sky-500" />
                      <span>{isEn ? activePerf.shortEn : activePerf.shortVi}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCompactToolsOpen(false);
                        onOpenSettings();
                      }}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEn ? 'Settings' : 'Cài đặt'}</span>
                    </button>
                  </div>

                  {/* Voice OS + Install App */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCompactToolsOpen(false);
                        openRemoteModal();
                      }}
                      className="w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded border border-indigo-400/55 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 font-bold cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                        <span>{isEn ? 'QR 3D & Slide Remote' : 'Điều khiển 3D & Slide qua QR'}</span>
                      </span>
                      <span className="text-[10px] font-mono tabular-nums opacity-85">
                        {controllerCount > 0 ? `${controllerCount} ON` : remoteRoomCode}
                      </span>
                    </button>

                    {onOpenVoiceOS && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCompactToolsOpen(false);
                          onOpenVoiceOS();
                        }}
                        className="w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded border border-cyan-400/60 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-200 font-bold cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
                          <span>Synapse Voice OS</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-80">VOICE</span>
                      </button>
                    )}

                    {onOpenInstallApp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCompactToolsOpen(false);
                          onOpenInstallApp();
                        }}
                        className="w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded border border-sky-400/55 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span>{isEn ? 'Install App (iOS / Android)' : 'Cài App trên Điện thoại / iPad'}</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-80">PWA</span>
                      </button>
                    )}
                  </div>

                  {/* Background Presets */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      {isEn ? 'Background Theme' : 'Giao diện nền'}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {BACKGROUND_STYLE_OPTIONS.map((opt) => {
                        const selected = opt.id === bgStyle;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setBgStyle(opt.id, true)}
                            className={`min-h-[34px] px-2 py-1 rounded text-left text-[11px] truncate cursor-pointer border ${
                              selected
                                ? 'bg-sky-600 border-sky-400 text-white font-bold'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {isEn ? opt.labelEn : opt.labelVi}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>,
                document.body
              )}
          </div>

          {/* QR 3D & Presentation Phone Controller (All Screen Sizes & Pages) */}
          <button
            type="button"
            onClick={openRemoteModal}
            data-testid="header-qr-remote-btn"
            className={`relative min-w-[38px] min-h-[38px] flex items-center justify-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 text-xs font-bold ${
              controllerCount > 0
                ? 'border-emerald-500/70 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'border-sky-400/55 bg-sky-50/90 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300'
            }`}
            title={
              isEn
                ? 'Scan QR to use Phone as 3D & Presentation Controller'
                : 'Quét QR biến Điện thoại thành tay cầm 3D & Thuyết trình từ xa'
            }
            aria-label={isEn ? 'QR 3D Remote Controller' : 'Điều khiển 3D từ xa qua QR'}
          >
            <QrCode className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">{isEn ? 'QR Remote' : 'QR Điều khiển'}</span>
            {controllerCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-[3px] bg-emerald-600 text-white text-[10px] font-mono font-extrabold tabular-nums">
                {controllerCount}
              </span>
            )}
          </button>

          {/* Light / Dark Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
            title={isDark ? (isEn ? 'Light Mode' : 'Chế độ Sáng') : isEn ? 'Dark Mode' : 'Chế độ Tối'}
            aria-label={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Cross-Device App Install / Download (Desktop xl+) */}
          {onOpenInstallApp && (
            <button
              type="button"
              onClick={onOpenInstallApp}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-400/55 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/70 text-sky-700 dark:text-sky-300 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title={isEn ? 'Install App (Laptop, Android & iPhone)' : 'Tải App cho Laptop, Android & iPhone'}
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Install App' : 'Tải App'}</span>
            </button>
          )}

          {/* Settings (Desktop xl+) */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="hidden xl:flex p-2 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
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
                  setIsCompactToolsOpen(false);
                }}
                className="min-h-[38px] flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer whitespace-nowrap"
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
                  className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t('nav.landing', 'Chào mừng', 'Welcome')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="min-h-[38px] flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-700 dark:hover:bg-sky-100 font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('nav.login', 'Đăng Nhập', 'Sign In')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

