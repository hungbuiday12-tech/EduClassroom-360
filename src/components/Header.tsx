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
  MessageSquare,
  Orbit,
  Hand
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

  const creaturePanelRef = useRef<HTMLDivElement | null>(null);
  const subjectPanelRef = useRef<HTMLDivElement | null>(null);
  const userPanelRef = useRef<HTMLDivElement | null>(null);

  const [subjectCoords, setSubjectCoords] = useState<{ top: number; left: number }>({ top: 108, left: 16 });
  const [creatureCoords, setCreatureCoords] = useState<{ top: number; left: number }>({ top: 56, left: 16 });
  const [userCoords, setUserCoords] = useState<{ top: number; right: number }>({ top: 56, right: 16 });

  const syncMenuCoords = useCallback(() => {
    if (subjectMenuRef.current) {
      const r = subjectMenuRef.current.getBoundingClientRect();
      const maxLeft = Math.max(12, window.innerWidth - 344);
      setSubjectCoords({ top: r.bottom + 8, left: Math.min(Math.max(12, r.left), maxLeft) });
    }
    if (creatureMenuRef.current) {
      const r = creatureMenuRef.current.getBoundingClientRect();
      const maxLeft = Math.max(12, window.innerWidth - 268);
      setCreatureCoords({ top: r.bottom + 8, left: Math.min(Math.max(12, r.left), maxLeft) });
    }
    if (userMenuRef.current) {
      const r = userMenuRef.current.getBoundingClientRect();
      setUserCoords({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    }
  }, []);

  useEffect(() => {
    if (!isCreatureMenuOpen && !isSubjectMenuOpen && !isUserMenuOpen) return;
    syncMenuCoords();
    window.addEventListener('resize', syncMenuCoords);
    window.addEventListener('scroll', syncMenuCoords, true);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isCreatureMenuOpen &&
        creatureMenuRef.current &&
        !creatureMenuRef.current.contains(target) &&
        !(creaturePanelRef.current && creaturePanelRef.current.contains(target))
      ) {
        setIsCreatureMenuOpen(false);
      }
      if (
        isSubjectMenuOpen &&
        subjectMenuRef.current &&
        !subjectMenuRef.current.contains(target) &&
        !(subjectPanelRef.current && subjectPanelRef.current.contains(target))
      ) {
        setIsSubjectMenuOpen(false);
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
  }, [isCreatureMenuOpen, isSubjectMenuOpen, isUserMenuOpen, syncMenuCoords]);

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

  const renderSubjectDropdownPanel = () => {
    if (typeof document === 'undefined') return null;
    return createPortal(
      <div
        ref={subjectPanelRef}
        style={{ top: subjectCoords.top, left: subjectCoords.left }}
        className="fixed w-[310px] sm:w-[336px] bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-300/90 dark:border-sky-500/25 rounded-lg shadow-[0_24px_60px_-12px_rgba(15,23,42,0.34)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] p-2 z-[220]"
      >
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {isEn ? 'CORE INTERACTIVE SUBJECTS' : 'MÔN HỌC CHUẨN & MÔ PHỎNG (TOÁN · LÍ · TIN)'}
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
                className={`group w-full flex items-start gap-3 p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                  selected
                    ? item.activeRow
                    : 'border-transparent hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${item.iconBox}`}
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
      </div>,
      document.body
    );
  };

  const activePerf =
    PERFORMANCE_MODE_OPTIONS.find((p) => p.id === perfMode) || PERFORMANCE_MODE_OPTIONS[0];
  const cyclePerfMode = () => {
    const order: Array<'smooth' | 'balanced' | 'ultra'> = ['smooth', 'balanced', 'ultra'];
    const idx = order.indexOf(perfMode);
    setPerfMode(order[(idx + 1) % order.length]);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/92 dark:bg-slate-950/92 backdrop-blur-md border-b border-sky-200/80 dark:border-sky-500/20 shadow-[0_8px_28px_-14px_rgba(2,132,199,0.2)]">
      {/* Subtle Scientific Calibration Laser Trace along Top Edge */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600/20 via-sky-500/40 to-teal-500/20 sci-scan-bar" />

      {/* ROW 1: Single-line Utility Bar */}
      <div className="w-full px-3 sm:px-5 lg:px-7 py-1.5 flex items-center justify-between gap-2 min-h-[56px] sm:min-h-[60px] flex-nowrap overflow-x-auto scrollbar-none">
        {/* Left Cluster: Back + Brand + VI/EN + XP + Creatures + Theme */}
        <div className="flex items-center gap-1.5 lg:gap-2 min-w-0 flex-nowrap shrink-0">
          {canGoBack && (
            <button
              onClick={goBack}
              className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-100 border border-slate-300/80 dark:border-white/15 hover:bg-sky-50 dark:hover:bg-sky-950/70 hover:text-blue-700 dark:hover:text-sky-300 hover:border-sky-400/80 shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
              title={`${language === 'en' ? 'Back to' : 'Quay lại trang trước'}: ${prevLabel}`}
              aria-label={`Quay lại ${prevLabel}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden xl:inline whitespace-nowrap">
                {language === 'en' ? 'Back' : 'Quay lại'}
              </span>
            </button>
          )}

          <button
            onClick={goClassroom}
            className="group flex items-center gap-2 text-lg sm:text-xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:text-blue-700 dark:hover:text-sky-400 transition-colors px-1.5 py-1 rounded-md shrink-0 cursor-pointer"
          >
            <BrandLogo sizeClass="w-7 h-7 sm:w-8 sm:h-8" />
            <span>Synapse</span>
            <span aria-hidden="true" className="hidden sm:inline-flex items-end gap-[2px] h-3.5 ml-0.5 opacity-80">
              <span className="w-[2px] h-full bg-sky-600 dark:bg-sky-400 sci-meter-1" />
              <span className="w-[2px] h-full bg-blue-600 dark:bg-blue-400 sci-meter-2" />
              <span className="w-[2px] h-full bg-teal-600 dark:bg-teal-400 sci-meter-3" />
            </span>
          </button>

          <span
            aria-hidden="true"
            className="hidden sm:block h-5 w-px bg-slate-200/90 dark:bg-white/15 mx-0.5 shrink-0"
          />

          {/* Medium-Balanced VI / EN Toggle */}
          <button
            onClick={toggleLanguage}
            className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-slate-300/90 dark:border-white/15 bg-slate-50/95 dark:bg-slate-800/90 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:border-sky-500 shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
            title={language === 'vi' ? 'Switch interface to English' : 'Chuyển giao diện sang Tiếng Việt'}
          >
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400 icon-anim-globe shrink-0" />
            <span
              className={
                language === 'vi' ? 'text-blue-700 dark:text-sky-300 font-black' : 'text-slate-400'
              }
            >
              VI
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span
              className={
                language === 'en' ? 'text-blue-700 dark:text-sky-300 font-black' : 'text-slate-400'
              }
            >
              EN
            </span>
          </button>

          {/* Medium-Balanced XP Counter */}
          <div
            data-ripple="true"
            className="group sheen-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 bg-amber-50/95 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-700/60 rounded-md text-xs font-mono font-extrabold text-amber-800 dark:text-amber-300 shrink-0 whitespace-nowrap shadow-xs cursor-default"
          >
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 icon-anim-award shrink-0" />
            <span className="tabular-nums">{user ? user.xp : xp} XP</span>
          </div>

          {/* Medium-Balanced Creature Theme Selector */}
          <div className="relative shrink-0" ref={creatureMenuRef}>
            <button
              onClick={() => {
                syncMenuCoords();
                setIsCreatureMenuOpen((v) => !v);
                setIsSubjectMenuOpen(false);
                setIsUserMenuOpen(false);
              }}
              className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 text-xs font-bold rounded-md border border-sky-300/80 dark:border-sky-500/35 bg-sky-50/90 dark:bg-sky-950/55 text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/65 hover:border-sky-500 shadow-xs transition-all cursor-pointer whitespace-nowrap"
              title={
                language === 'vi'
                  ? 'Chọn sinh vật nền tương tác'
                  : 'Choose interactive background creature'
              }
            >
              <Wand2 className="w-4 h-4 text-sky-600 dark:text-sky-300 icon-anim-wand shrink-0" />
              <span className="hidden lg:inline">
                {language === 'vi' ? activeCreature.shortVi : activeCreature.shortEn}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75 group-hover:translate-y-0.5 transition-transform" />
            </button>

            {isCreatureMenuOpen &&
              typeof document !== 'undefined' &&
              createPortal(
                <div
                  ref={creaturePanelRef}
                  style={{ top: creatureCoords.top, left: creatureCoords.left }}
                  className="fixed w-64 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-300/90 dark:border-sky-500/25 rounded-lg shadow-2xl p-1.5 z-[220] text-xs max-h-[75vh] overflow-y-auto"
                >
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
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-sky-50 dark:bg-sky-950/70 text-blue-700 dark:text-sky-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{language === 'vi' ? opt.labelVi : opt.labelEn}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>,
                document.body
              )}
          </div>

          {/* Sun / Moon Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="group cs-deck-btn p-2 text-slate-600 dark:text-slate-200 bg-slate-50/95 dark:bg-slate-800/90 border border-slate-300/80 dark:border-white/15 hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-400/70 rounded-md shadow-xs transition-all cursor-pointer shrink-0 flex items-center justify-center"
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
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 icon-anim-star" />
            ) : (
              <Moon className="w-4 h-4 text-blue-700 group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>

        {/* Right Cluster: Compact Single-Row Audio + FPS + Settings + Account */}
        <div className="flex items-center gap-1.5 lg:gap-2 flex-nowrap shrink-0">
          {/* Background Soundscape Toggle */}
          <button
            type="button"
            onClick={toggleBgPlaying}
            className={`group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              isBgPlaying && bgSound !== 'off'
                ? 'border-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/55 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-300/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:border-sky-500/70'
            }`}
            title={isEn ? 'Toggle background ambient sound' : 'Bật/tắt âm thanh nền học tập'}
          >
            {isBgPlaying && bgSound !== 'off' ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 icon-anim-wave shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform shrink-0" />
            )}
            <span className="hidden xl:inline">
              {isBgPlaying && bgSound !== 'off'
                ? isEn
                  ? 'Music On'
                  : 'Nhạc nền'
                : isEn
                ? 'Sound Off'
                : 'Âm nền'}
            </span>
          </button>

          {/* FPS / Graphics Performance Mode Cycler */}
          <button
            type="button"
            onClick={cyclePerfMode}
            className={`group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md border text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
              perfMode === 'smooth'
                ? 'border-sky-400/80 bg-sky-50 dark:bg-sky-950/55 text-sky-700 dark:text-sky-300'
                : perfMode === 'balanced'
                ? 'border-blue-400/90 bg-blue-50 dark:bg-blue-950/45 text-blue-700 dark:text-blue-300'
                : 'border-amber-400/90 bg-amber-50 dark:bg-amber-950/45 text-amber-800 dark:text-amber-300'
            }`}
            title={
              isEn
                ? `Graphics Mode: ${activePerf.labelEn} (click to switch)`
                : `Chế độ đồ họa / FPS: ${activePerf.labelVi} (bấm để đổi)`
            }
          >
            <Gauge className="w-4 h-4 icon-anim-compass shrink-0" />
            <span className="hidden 2xl:inline">
              {isEn ? activePerf.shortEn : activePerf.shortVi}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="group cs-deck-btn flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md border border-slate-300/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/90 hover:border-sky-500/80 hover:bg-sky-50/80 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs"
            title={isEn ? 'Account, Audio, Gmail & Preferences' : 'Cài đặt âm thanh, tài khoản & giao diện'}
          >
            <Settings className="w-4 h-4 text-sky-600 dark:text-sky-400 icon-anim-gear shrink-0" />
            <span className="hidden md:inline">{isEn ? 'Settings' : 'Cài đặt'}</span>
          </button>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  syncMenuCoords();
                  setIsUserMenuOpen((v) => !v);
                  setIsSubjectMenuOpen(false);
                  setIsCreatureMenuOpen(false);
                }}
                className="group cs-deck-btn flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md bg-slate-100/95 dark:bg-slate-800/95 border border-slate-300/80 dark:border-white/15 hover:bg-slate-200/85 dark:hover:bg-slate-700 transition-colors text-xs cursor-pointer shadow-xs whitespace-nowrap"
              >
                {user.role === 'admin' ? (
                  <BrandLogo sizeClass="w-6 h-6 rounded-sm" />
                ) : user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-sm object-cover border border-slate-300 dark:border-slate-600"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-sm bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-slate-800 dark:text-slate-100 hidden md:inline max-w-[115px] truncate">
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
                    className="fixed w-64 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl border border-slate-300/90 dark:border-sky-500/25 rounded-lg shadow-2xl py-2 z-[220] text-xs"
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-sky-950/40 font-semibold transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-sky-600" />
                        <span>{isEn ? 'Account & Gmail Settings' : 'Cài đặt tài khoản & Gmail'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          if (onReturnToLanding) onReturnToLanding();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors cursor-pointer"
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
            <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
              {onReturnToLanding && (
                <button
                  onClick={onReturnToLanding}
                  className="group cs-deck-btn hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-50 dark:bg-sky-950/65 border border-sky-300/80 dark:border-sky-700 text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/70 font-bold text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs"
                  title={
                    language === 'en'
                      ? 'Return to Welcome Portal'
                      : 'Quay lại Trang Cổng Chào Mừng Galaxy'
                  }
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 icon-anim-star shrink-0" />
                  <span>{t('nav.landing', 'Chào mừng', 'Welcome')}</span>
                </button>
              )}
              <button
                onClick={() => openAuthModal('login')}
                className="group cs-deck-btn flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-700 dark:hover:bg-sky-100 font-bold text-xs shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                <span>{t('nav.login', 'Đăng Nhập', 'Sign In')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Crisp Architectural Navigation Strip */}
      <nav
        aria-label={isEn ? 'Primary navigation' : 'Điều hướng chính'}
        className="w-full border-t border-slate-200/80 dark:border-white/10 bg-slate-50/85 dark:bg-slate-900/75 px-3 sm:px-5 lg:px-7 py-2 flex items-center justify-start gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none"
      >
        {/* Flagship Synapse v2 Virtual Observatory Campus */}
        <button
          onClick={() => {
            onSelectSubject('synapse_v2');
            window.dispatchEvent(new Event('educlassroom:synapse-reset'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`group cs-deck-btn sci-frame flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
            currentSubject === 'synapse_v2'
              ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 text-white border-sky-400 shadow-md shadow-sky-600/25'
              : 'bg-blue-50/90 dark:bg-blue-950/35 border-blue-300/80 dark:border-sky-500/35 text-blue-800 dark:text-sky-200 hover:border-sky-500 hover:bg-blue-600 hover:text-white'
          }`}
        >
          <Orbit className="w-4 h-4 sm:w-[18px] sm:h-[18px] icon-anim-cosmos shrink-0" />
          <span>{isEn ? 'Virtual Campus · Synapse v2' : 'Lớp học ảo · Synapse v2'}</span>
        </button>

        {/* Spatial 3D Hand-Gesture Learning Lab */}
        <button
          onClick={() => {
            onSelectSubject('spatial_3d');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`group cs-deck-btn sci-frame flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
            currentSubject === 'spatial_3d'
              ? 'bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white border-cyan-300 shadow-md shadow-teal-600/25'
              : 'bg-teal-50/90 dark:bg-teal-950/35 border-teal-300/80 dark:border-teal-500/35 text-teal-800 dark:text-teal-200 hover:border-teal-500 hover:bg-teal-600 hover:text-white'
          }`}
        >
          <Hand className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
          <span>{isEn ? 'Spatial 3D Gesture' : 'Học cảm giác 3D'}</span>
        </button>

        <button
          onClick={() => onSelectSubject('roadmap')}
          className={`group cs-deck-btn flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            currentSubject === 'roadmap'
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-white hover:bg-white/95 dark:hover:bg-slate-800/85 border-transparent hover:border-slate-300/90 dark:hover:border-white/15'
          }`}
        >
          <GitBranch className="w-4 h-4 sm:w-[18px] sm:h-[18px] icon-anim-branch shrink-0" />
          <span>{t('nav.roadmap', 'Lộ trình học', 'Roadmap')}</span>
        </button>

        {/* Merged 3-Subject Dropdown (Toán · Lí · Tin) */}
        <div className="relative shrink-0" ref={subjectMenuRef}>
          <button
            type="button"
            onClick={() => {
              syncMenuCoords();
              setIsSubjectMenuOpen((prev) => !prev);
              setIsCreatureMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className={`group cs-deck-btn flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isSubjectActive || isSubjectMenuOpen
                ? 'border-sky-600/70 bg-sky-500/15 text-sky-800 dark:text-sky-300 shadow-xs'
                : 'border-slate-300/85 dark:border-white/15 bg-white/90 dark:bg-slate-800/75 text-slate-800 dark:text-slate-100 hover:border-sky-500 hover:bg-sky-50/70 dark:hover:bg-slate-800'
            }`}
          >
            <Atom className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-sky-600 dark:text-sky-400 icon-anim-atom shrink-0" />
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
          className={`group cs-deck-btn flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            currentSubject === 'exams'
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-white hover:bg-white/95 dark:hover:bg-slate-800/85 border-transparent hover:border-slate-300/90 dark:hover:border-white/15'
          }`}
        >
          <FileText className="w-4 h-4 sm:w-[18px] sm:h-[18px] icon-anim-code shrink-0" />
          <span>{language === 'en' ? 'Exams' : 'Đề Thi'}</span>
        </button>

        <button
          onClick={() => onSelectSubject('arena')}
          className={`group cs-deck-btn flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            currentSubject === 'arena'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/95 dark:hover:bg-slate-800/85 border-transparent hover:border-slate-300/90 dark:hover:border-white/15'
          }`}
        >
          <Trophy className="w-4 h-4 sm:w-[18px] sm:h-[18px] icon-anim-trophy shrink-0" />
          <span>{t('nav.arena', 'Thi Đấu & BXH', 'Weekly Arena')}</span>
        </button>

        <button
          onClick={() => onSelectSubject('forum')}
          className={`group cs-deck-btn flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            currentSubject === 'forum'
              ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-sky-400 shadow-sm'
              : 'text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-white hover:bg-white/95 dark:hover:bg-slate-800/85 border-transparent hover:border-slate-300/90 dark:hover:border-white/15'
          }`}
        >
          <MessageSquare className="w-4 h-4 sm:w-[18px] sm:h-[18px] icon-anim-wave shrink-0" />
          <span>{isEn ? 'Study Forum' : 'Diễn đàn học tập'}</span>
        </button>

        {/* Quick Scroll Button: Đánh giá & Bình chọn */}
        <button
          type="button"
          onClick={requestScrollToReviews}
          className="group cs-deck-btn flex items-center gap-2 whitespace-nowrap shrink-0 px-3.5 py-2 rounded-md border border-amber-400/70 dark:border-amber-500/40 bg-amber-50/90 dark:bg-amber-950/45 text-amber-800 dark:text-amber-300 hover:border-amber-500 hover:bg-amber-100/90 dark:hover:bg-amber-900/50 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          title={isEn ? 'Jump to Ratings & Community Votes' : 'Cuộn xuống phần Đánh giá & Bình chọn'}
        >
          <Star className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-500 fill-amber-400 icon-anim-star shrink-0" />
          <span>{isEn ? 'Ratings & Votes' : 'Đánh giá & Bình chọn'}</span>
        </button>
      </nav>
    </header>
  );
};
