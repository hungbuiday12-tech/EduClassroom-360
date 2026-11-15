import React, { useState, useRef, useEffect } from 'react';
import { SubjectType } from '../types';
import {
  Sun,
  Moon,
  Award,
  LogOut,
  LogIn,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Globe,
  Wand2,
  Check,
  ArrowLeft,
  Compass,
  Zap,
  Code2,
  Atom,
  Settings,
  GitBranch,
  FileText,
  Trophy,
  Star,
  Volume2,
  VolumeX,
  Gauge,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  useBackgroundTheme,
  CREATURE_THEME_OPTIONS,
  PERFORMANCE_MODE_OPTIONS
} from '../context/BackgroundContext';
import { useNavigation, getLocationLabel } from '../context/NavigationContext';
import { useAudio } from '../context/AudioContext';
import { BrandLogo } from './common/BrandLogo';
import { MATH_LECTURES } from '../data/curriculumData';
import { PHYSICS_LESSONS } from '../data/physicsLessonsData';
import { CS_LESSONS } from '../data/csLessonsData';

interface HeaderProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  xp: number;
  onReturnToLanding?: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSubject,
  onSelectSubject,
  isDark,
  onToggleTheme,
  xp,
  onReturnToLanding,
  onOpenSettings
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const isEn = language === 'en';
  const { creatureTheme, setCreatureTheme, perfMode, setPerfMode } = useBackgroundTheme();
  const { canGoBack, previousLocation, goBack, goClassroom, requestScrollToReviews } = useNavigation();
  const { isBgPlaying, toggleBgPlaying, bgSound } = useAudio();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreatureMenuOpen, setIsCreatureMenuOpen] = useState(false);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);

  const creatureMenuRef = useRef<HTMLDivElement | null>(null);
  const subjectMenuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCreatureMenuOpen && !isSubjectMenuOpen && !isUserMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isCreatureMenuOpen && creatureMenuRef.current && !creatureMenuRef.current.contains(target)) {
        setIsCreatureMenuOpen(false);
      }
      if (isSubjectMenuOpen && subjectMenuRef.current && !subjectMenuRef.current.contains(target)) {
        setIsSubjectMenuOpen(false);
      }
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCreatureMenuOpen, isSubjectMenuOpen, isUserMenuOpen]);

  const activeCreature =
    CREATURE_THEME_OPTIONS.find((opt) => opt.id === creatureTheme) || CREATURE_THEME_OPTIONS[0];
  const prevLabel = previousLocation
    ? getLocationLabel(previousLocation, language)
    : t('nav.classroom', 'Lớp học', 'Classroom');

  const isSubjectActive =
    currentSubject === 'math' || currentSubject === 'physics' || currentSubject === 'cs';

  const subjectItems = [
    {
      id: 'math' as const,
      title: isEn ? 'Mathematics' : 'Toán học',
      subtitle: isEn
        ? `${MATH_LECTURES.length} lectures · Oxy Circles & 8 Oxyz 3D scenes`
        : `${MATH_LECTURES.length} bài giảng · Đường tròn & 8 mô hình 3D`,
      icon: <Compass className="w-5 h-5 text-sky-500 dark:text-sky-400" />,
      iconBox: 'bg-sky-500/15 border-sky-500/30',
      activeRow:
        'bg-sky-500/10 dark:bg-sky-500/15 border-sky-500/50 text-sky-700 dark:text-sky-300'
    },
    {
      id: 'physics' as const,
      title: isEn ? 'Physics' : 'Vật lí',
      subtitle: isEn
        ? `${PHYSICS_LESSONS.length} lessons · 19 2D Labs & 14 3D models`
        : `${PHYSICS_LESSONS.length} bài thí nghiệm 2D & 14 mô phỏng 3D trực quan`,
      icon: <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      iconBox: 'bg-amber-500/15 border-amber-500/30',
      activeRow:
        'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-300'
    },
    {
      id: 'cs' as const,
      title: isEn ? 'Computer Science' : 'Tin học',
      subtitle: isEn
        ? `${CS_LESSONS.length} VNOI modules · Sublime 4 & Algo Graphs`
        : `${CS_LESSONS.length} bài VNOI · Sublime 4 & Đồ thị Thuật toán`,
      icon: <Code2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      iconBox: 'bg-emerald-500/15 border-emerald-500/30',
      activeRow:
        'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
    }
  ];

  const activeSubjectMeta = subjectItems.find((item) => item.id === currentSubject);

  const renderSubjectDropdownPanel = () => (
    <div className="absolute left-0 mt-2.5 w-76 sm:w-84 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/15 rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.28)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)] p-2 z-50">
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {isEn ? 'CORE INTERACTIVE SUBJECTS' : 'MÔN HỌC CHUẨN & MÔ PHỎNG'}
      </div>
      <div className="space-y-1 mt-1">
        {subjectItems.map((item) => {
          const selected = currentSubject === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectSubject(item.id);
                setIsSubjectMenuOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selected
                  ? item.activeRow
                  : 'border-transparent hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${item.iconBox}`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold leading-tight">{item.title}</span>
                  {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const activePerf =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === perfMode) || PERFORMANCE_MODE_OPTIONS[0];
  const cyclePerfMode = () => {
    const order: Array<'smooth' | 'balanced' | 'ultra'> = ['smooth', 'balanced', 'ultra'];
    const idx = order.indexOf(perfMode);
    setPerfMode(order[(idx + 1) % order.length]);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/88 dark:bg-slate-950/88 backdrop-blur-md border-b border-indigo-200/60 dark:border-indigo-500/20 shadow-[0_10px_35px_-16px_rgba(79,70,229,0.25)]">
      {/* ROW 1: Brand + Utility Cluster pushed right next to Synapse on the left | Settings & Auth on the right */}
      <div className="w-full px-3 sm:px-5 lg:px-7 flex items-center justify-between gap-2 sm:gap-3 h-14 sm:h-15">
        {/* Left Cluster: Back + Brand + VI/EN + XP + Creatures + Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {canGoBack && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs shrink-0 cursor-pointer"
              title={`${language === 'en' ? 'Back to' : 'Quay lại trang trước'}: ${prevLabel}`}
              aria-label={`Quay lại ${prevLabel}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline whitespace-nowrap">
                {language === 'en' ? 'Back' : 'Quay lại'}
              </span>
            </button>
          )}

          <button
            onClick={goClassroom}
            className="flex items-center gap-2 text-base sm:text-xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-1 py-1 rounded-xl shrink-0 cursor-pointer"
          >
            <BrandLogo sizeClass="w-7 h-7 sm:w-8 sm:h-8" />
            <span>Synapse</span>
          </button>

          <span
            aria-hidden="true"
            className="hidden sm:block h-5 w-px bg-slate-200/90 dark:bg-white/15 mx-0.5 shrink-0"
          />

          {/* VI / EN pushed directly next to Synapse */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title={language === 'vi' ? 'Switch interface to English' : 'Chuyển giao diện sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500 hidden sm:block" />
            <span
              className={
                language === 'vi' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'
              }
            >
              VI
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span
              className={
                language === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400'
              }
            >
              EN
            </span>
          </button>

          {/* XP Counter pushed right beside VI/EN */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 bg-amber-50/90 dark:bg-amber-950/45 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-[11px] sm:text-xs font-mono font-bold text-amber-700 dark:text-amber-300 shrink-0 whitespace-nowrap">
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="tabular-nums">{user ? user.xp : xp} XP</span>
          </div>

          {/* Interactive Background Creature Theme Selector */}
          <div className="relative shrink-0" ref={creatureMenuRef}>
            <button
              onClick={() => setIsCreatureMenuOpen(!isCreatureMenuOpen)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded-xl border border-indigo-200/80 dark:border-indigo-500/30 bg-indigo-50/85 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer whitespace-nowrap"
              title={
                language === 'vi'
                  ? 'Chọn sinh vật nền tương tác'
                  : 'Choose interactive background creature'
              }
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span className="hidden md:inline">
                {language === 'vi' ? activeCreature.shortVi : activeCreature.shortEn}
              </span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {isCreatureMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-1.5 z-50 text-xs max-h-[75vh] overflow-y-auto">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                  {language === 'vi' ? 'Nền Sinh Vật Tương Tác' : 'Interactive Creatures'}
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

          {/* Sun / Moon Theme Toggle pushed next to Creatures */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
            title={
              language === 'en'
                ? isDark
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
                : isDark
                ? 'Chuyển sang chế độ Sáng (Light)'
                : 'Chuyển sang chế độ Tối (Dark)'
            }
            aria-label={isDark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Cluster: Quick Ambient Audio Toggle + Settings Button + User Account / Sign In */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Background Soundscape Toggle */}
          <button
            type="button"
            onClick={toggleBgPlaying}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              isBgPlaying && bgSound !== 'off'
                ? 'border-emerald-400/70 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/85 text-slate-600 dark:text-slate-300 hover:border-indigo-400/60'
            }`}
            title={isEn ? 'Toggle background ambient sound' : 'Bật/tắt âm thanh nền học tập'}
          >
            {isBgPlaying && bgSound !== 'off' ? (
              <Volume2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <span className="hidden lg:inline">
              {isBgPlaying && bgSound !== 'off'
                ? isEn
                  ? 'Music On'
                  : 'Nhạc nền'
                : isEn
                ? 'Sound Off'
                : 'Âm nền'}
            </span>
          </button>

          {/* Quick FPS / Graphics Performance Mode Cycler */}
          <button
            type="button"
            onClick={cyclePerfMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs ${
              perfMode === 'smooth'
                ? 'border-sky-400/70 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                : perfMode === 'balanced'
                ? 'border-indigo-300/80 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-amber-300/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
            }`}
            title={
              isEn
                ? `Graphics Mode: ${activePerf.labelEn} (click to switch)`
                : `Chế độ đồ họa / FPS: ${activePerf.labelVi} (bấm để đổi)`
            }
          >
            <Gauge className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">
              {isEn ? activePerf.shortEn : activePerf.shortVi}
            </span>
          </button>

          {/* Dedicated Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-900/85 hover:border-indigo-400/70 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs"
            title={isEn ? 'Account, Audio, Gmail & Preferences' : 'Cài đặt âm thanh, tài khoản & giao diện'}
          >
            <Settings className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">{isEn ? 'Settings' : 'Cài đặt'}</span>
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer"
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
                <span className="font-semibold text-slate-800 dark:text-slate-200 hidden md:inline max-w-[110px] truncate">
                  {user.displayName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">@{user.username}</p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5 truncate">
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
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-indigo-500" />
                      <span>{isEn ? 'Account & Gmail Settings' : 'Cài đặt tài khoản & Gmail'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        if (onReturnToLanding) onReturnToLanding();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout', 'Đăng xuất', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {onReturnToLanding && (
                <button
                  onClick={onReturnToLanding}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  title={
                    language === 'en'
                      ? 'Return to Welcome Portal'
                      : 'Quay lại Trang Cổng Chào Mừng Galaxy'
                  }
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('nav.landing', 'Trang Chào Mừng', 'Welcome Portal')}</span>
                </button>
              )}
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-[11px] sm:text-xs shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.login', 'Đăng Nhập', 'Sign In')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Enlarged Primary Navigation Strip anchored at the OUTER LEFT EDGE */}
      <nav
        aria-label={isEn ? 'Primary navigation' : 'Điều hướng chính'}
        className="w-full border-t border-slate-200/70 dark:border-white/10 bg-slate-50/75 dark:bg-slate-900/60 px-3 sm:px-5 lg:px-7 py-2 sm:py-2.5 flex flex-wrap items-center justify-start gap-2 sm:gap-3"
      >
        <button
          onClick={() => onSelectSubject('roadmap')}
          className={`flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer ${
            currentSubject === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/90 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/80 dark:hover:border-white/10'
          }`}
        >
          <GitBranch className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
          <span>{t('nav.roadmap', 'Lộ trình học', 'Roadmap')}</span>
        </button>

        {/* Merged 3-Subject Dropdown (Toán · Lí · Tin) */}
        <div className="relative shrink-0" ref={subjectMenuRef}>
          <button
            type="button"
            onClick={() => setIsSubjectMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl border text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer ${
              isSubjectActive || isSubjectMenuOpen
                ? 'border-sky-500/60 bg-sky-500/15 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'border-slate-200/90 dark:border-white/15 bg-white/85 dark:bg-slate-800/70 text-slate-800 dark:text-slate-100 hover:border-sky-400/70 hover:bg-sky-50/60 dark:hover:bg-slate-800'
            }`}
          >
            <Atom className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-sky-500 dark:text-sky-400 shrink-0" />
            <span>
              {activeSubjectMeta
                ? activeSubjectMeta.title
                : isEn
                ? 'STEM Subjects'
                : 'Môn học'}
            </span>
            {isSubjectMenuOpen ? (
              <ChevronUp className="w-4 h-4 opacity-80" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-80" />
            )}
          </button>
          {isSubjectMenuOpen && renderSubjectDropdownPanel()}
        </div>

        <button
          onClick={() => onSelectSubject('exams')}
          className={`flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer ${
            currentSubject === 'exams'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/90 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/80 dark:hover:border-white/10'
          }`}
        >
          <FileText className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
          <span>{language === 'en' ? 'Exams' : 'Đề Thi'}</span>
        </button>

        <button
          onClick={() => onSelectSubject('arena')}
          className={`flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer ${
            currentSubject === 'arena'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/90 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/80 dark:hover:border-white/10'
          }`}
        >
          <Trophy className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
          <span>{t('nav.arena', 'Thi Đấu & BXH', 'Weekly Arena')}</span>
        </button>

        <button
          onClick={() => onSelectSubject('forum')}
          className={`flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer ${
            currentSubject === 'forum'
              ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/90 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/80 dark:hover:border-white/10'
          }`}
        >
          <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
          <span>{isEn ? 'Study Forum' : 'Diễn đàn học tập'}</span>
        </button>

        {/* Quick Scroll Button: Đánh giá & Bình chọn */}
        <button
          type="button"
          onClick={requestScrollToReviews}
          className="flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl border border-amber-300/80 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/50 dark:to-rose-950/40 text-amber-800 dark:text-amber-300 hover:border-amber-500 hover:shadow-xs text-[13px] sm:text-[15px] font-bold transition-all cursor-pointer"
          title={isEn ? 'Jump to Ratings & Community Votes' : 'Cuộn xuống phần Đánh giá & Bình chọn'}
        >
          <Star className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-500 fill-amber-400 shrink-0" />
          <span>{isEn ? 'Ratings & Votes' : 'Đánh giá & Bình chọn'}</span>
        </button>
      </nav>
    </header>
  );
};
