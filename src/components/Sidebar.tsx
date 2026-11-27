import React, { useEffect, useRef, useState } from 'react';
import { SubjectType } from '../types';
import {
  LayoutDashboard,
  GitBranch,
  Compass,
  Zap,
  Atom,
  Code2,
  Orbit,
  FileText,
  Trophy,
  MessageSquare,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ListOrdered,
  X,
  Download,
  Flame,
  Layers,
  Cpu,
  BookOpen,
  ChevronDown,
  Crown,
  FlaskConical,
  Dna,
  Sparkles,
  Video,
  HelpCircle,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBackgroundTheme } from '../context/BackgroundContext';
import { useNavigation } from '../context/NavigationContext';
import { usePremium } from '../context/PremiumContext';
import { BrandLogo } from './common/BrandLogo';
import { getPhysicsSimCounts } from '../data/physicsDomainsData';
import { CHEMISTRY_2D_SIMS, CHEMISTRY_3D_SIMS } from '../data/chemistryDomainsData';
import { BIOLOGY_2D_SIMS, BIOLOGY_3D_SIMS } from '../data/biologyDomainsData';
import { PRE_SANDBOX_DIVISIONS, PRE_SIDEBAR_GROUPS, PRE_STUDIOS, PRE_SUBJECT_ZONES, PreSidebarGroupId } from '../data/preLabsData';

interface SidebarProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  onOpenInstallApp?: () => void;
  pauseParticles?: boolean;
}

interface NavItemDef {
  id: SubjectType;
  labelVi: string;
  labelEn: string;
  badge?: string;
  icon: React.ReactNode;
  idleClass: string;
  activeClass: string;
  badgeIdleClass?: string;
  onExtra?: () => void;
}

const MOLECULE_PALETTE = [
  '#38bdf8', // sky
  '#34d399', // emerald
  '#fbbf24', // amber
  '#a78bfa', // violet
  '#2dd4bf', // teal
  '#fb7185'  // rose
];

const SidebarMolecularParticles: React.FC<{ paused?: boolean }> = ({ paused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let w = 272;
    let h = 720;

    const syncSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(72, parent.clientWidth);
      h = Math.max(300, parent.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const atoms = Array.from({ length: 24 }, (_, i) => ({
      x: ((i * 83) % 97) / 97,
      y: ((i * 151) % 99) / 99,
      vx: (((i % 5) - 2) || 1) * 0.14,
      vy: (((i % 7) - 3) || -1) * 0.16,
      r: 2.1 + (i % 3) * 1.15,
      color: MOLECULE_PALETTE[i % MOLECULE_PALETTE.length],
      phase: i * 0.85,
      isRing: i % 4 === 0,
      px: 0,
      py: 0
    }));

    const pointer = { x: -999, y: -999 };
    const parentEl = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      if (!parentEl) return;
      const rect = parentEl.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -999;
      pointer.y = -999;
    };
    parentEl?.addEventListener('mousemove', onMove);
    parentEl?.addEventListener('mouseleave', onLeave);

    let last = performance.now();
    const render = (now: number) => {
      if (!reduceMotion) {
        rafId = requestAnimationFrame(render);
      }
      if (pausedRef.current || document.hidden || w < 96 || now - last < 40) return;
      const dt = Math.min(56, now - last) / 16.67;
      last = now;
      const t = now * 0.001;
      const isDark = document.documentElement.classList.contains('dark');

      ctx.clearRect(0, 0, w, h);

      // Update positions in place (zero per-frame array/object allocation)
      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];
        if (!reduceMotion) {
          a.x += (a.vx * dt) / w;
          a.y += (a.vy * dt) / h;
          if (a.x < 0.03 || a.x > 0.97) a.vx *= -1;
          if (a.y < 0.02 || a.y > 0.98) a.vy *= -1;
          a.x = Math.max(0.02, Math.min(0.98, a.x));
          a.y = Math.max(0.02, Math.min(0.98, a.y));
        }
        let px = a.x * w;
        let py = a.y * h;
        if (pointer.x > 0) {
          const dx = px - pointer.x;
          const dy = py - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 76 && dist > 1) {
            const push = (1 - dist / 76) * 8;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }
        a.px = px;
        a.py = py;
      }

      // Draw molecular covalent bonds
      const maxBondDist = Math.min(92, w * 0.44);
      ctx.lineWidth = 1;
      for (let i = 0; i < atoms.length; i++) {
        const ai = atoms[i];
        for (let j = i + 1; j < atoms.length; j++) {
          const aj = atoms[j];
          const dx = ai.px - aj.px;
          const dy = ai.py - aj.py;
          const d = Math.hypot(dx, dy);
          if (d < maxBondDist) {
            const alpha = (1 - d / maxBondDist) * (isDark ? 0.34 : 0.24);
            ctx.strokeStyle = isDark
              ? `rgba(125, 211, 252, ${alpha.toFixed(3)})`
              : `rgba(2, 132, 199, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(ai.px, ai.py);
            ctx.lineTo(aj.px, aj.py);
            ctx.stroke();
          }
        }
      }

      // Draw molecular atoms & faint valence orbital rings (without save/restore inside loop)
      const prevAlpha = ctx.globalAlpha;
      for (let i = 0; i < atoms.length; i++) {
        const p = atoms[i];
        const pulse = 0.72 + 0.28 * Math.sin(t * 2.1 + p.phase);
        if (p.isRing) {
          ctx.globalAlpha = (isDark ? 0.28 : 0.2) * pulse;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.r * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = (isDark ? 0.68 : 0.48) * pulse;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = prevAlpha;
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      parentEl?.removeEventListener('mousemove', onMove);
      parentEl?.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full z-0"
    />
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentSubject,
  onSelectSubject,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onOpenSettings,
  onOpenInstallApp,
  pauseParticles = false
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();
  const { hasPremiumAccess, dailyQuotaRemaining, dailyQuotaLimit } = usePremium();
  const { location, navigate, requestScrollToReviews, requestScrollToDirectory } = useNavigation();
  const [physicsSimTotal, setPhysicsSimTotal] = useState<number>(() => getPhysicsSimCounts().total);

  const [isSubjectsOpen, setIsSubjectsOpen] = useState<boolean>(
    () =>
      currentSubject === 'math' ||
      currentSubject === 'physics' ||
      currentSubject === 'chemistry' ||
      currentSubject === 'biology' ||
      currentSubject === 'cs'
  );
  const [isVirtualLabsOpen, setIsVirtualLabsOpen] = useState<boolean>(
    () =>
      currentSubject === 'physics_sims' ||
      currentSubject === 'math_sims' ||
      currentSubject === 'chemistry_sims' ||
      currentSubject === 'biology_sims' ||
      currentSubject === 'cs_sims'
  );
  const [openPreGroups, setOpenPreGroups] = useState<Record<PreSidebarGroupId, boolean>>({
    labs: false,
    simulations: false,
    sandboxes: false,
  });

  useEffect(() => {
    if (
      currentSubject === 'math' ||
      currentSubject === 'physics' ||
      currentSubject === 'chemistry' ||
      currentSubject === 'biology' ||
      currentSubject === 'cs'
    ) {
      setIsSubjectsOpen(true);
    }
    if (
      currentSubject === 'physics_sims' ||
      currentSubject === 'math_sims' ||
      currentSubject === 'chemistry_sims' ||
      currentSubject === 'biology_sims' ||
      currentSubject === 'cs_sims'
    ) {
      setIsVirtualLabsOpen(true);
    }
    if ((currentSubject === 'synapse_v2' || currentSubject === 'future_lab') && location.futureTab) {
      const matched = PRE_STUDIOS.find((s) => s.id === location.futureTab);
      if (matched) {
        setOpenPreGroups((prev) => ({ ...prev, [matched.sidebarGroup]: true }));
      }
    }
  }, [currentSubject, location.futureTab]);

  useEffect(() => {
    const syncSimCount = () => {
      setPhysicsSimTotal(getPhysicsSimCounts().total);
    };
    syncSimCount();
    window.addEventListener('educlassroom:physics-sims-updated', syncSimCount);
    window.addEventListener('storage', syncSimCount);
    return () => {
      window.removeEventListener('educlassroom:physics-sims-updated', syncSimCount);
      window.removeEventListener('storage', syncSimCount);
    };
  }, []);

  const navGroups: { titleVi: string; titleEn: string; items: NavItemDef[] }[] = [
    {
      titleVi: 'Bục giảng & Lộ trình',
      titleEn: 'Classroom & Path',
      items: [
        {
          id: 'overview',
          labelVi: 'Trang chủ lớp học',
          labelEn: 'Classroom Home',
          icon: (
            <span className="icon-anim-grid">
              <LayoutDashboard className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-sky-50/85 dark:bg-sky-950/35 border border-sky-300/75 dark:border-sky-500/35 text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/55 hover:border-sky-400',
          activeClass:
            'bg-gradient-to-r from-sky-600 to-blue-600 border border-sky-400 text-white shadow-md shadow-sky-600/25'
        },
        {
          id: 'roadmap',
          labelVi: 'Lộ trình học 6–12',
          labelEn: 'Study Roadmap 6–12',
          icon: (
            <span className="icon-anim-branch">
              <GitBranch className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-indigo-50/85 dark:bg-indigo-950/35 border border-indigo-300/75 dark:border-indigo-500/35 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/55 hover:border-indigo-400',
          activeClass:
            'bg-gradient-to-r from-indigo-600 to-blue-600 border border-indigo-400 text-white shadow-md shadow-indigo-600/25'
        },
        {
          id: 'guide',
          labelVi: 'Hướng dẫn sử dụng',
          labelEn: 'Interactive Guide',
          icon: <HelpCircle className="w-5 h-5 shrink-0" />,
          idleClass:
            'bg-cyan-50/85 dark:bg-cyan-950/35 border border-cyan-300/75 dark:border-cyan-500/35 text-cyan-900 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/55 hover:border-cyan-400',
          activeClass:
            'bg-gradient-to-r from-cyan-600 to-sky-600 border border-cyan-400 text-white shadow-md shadow-cyan-600/25'
        },
        {
          id: 'authors',
          labelVi: 'Nhóm tác giả 9/4',
          labelEn: 'Creators (9/4)',
          icon: <Users className="w-5 h-5 shrink-0" />,
          idleClass:
            'bg-slate-50/90 dark:bg-slate-900/50 border border-slate-300/80 dark:border-slate-600/45 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:border-slate-400',
          activeClass:
            'bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 border border-slate-500 text-white shadow-md'
        }
      ]
    },
    {
      titleVi: 'Môn học & Phòng lab ảo',
      titleEn: 'Disciplines & Labs',
      items: []
    },
    {
      titleVi: 'Kiểm tra & Cộng đồng',
      titleEn: 'Exams & Community',
      items: [
        {
          id: 'exams',
          labelVi: 'Kho Đề Thi & AI',
          labelEn: 'Exam Bank & AI',
          icon: (
            <span className="icon-anim-book">
              <FileText className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-rose-50/85 dark:bg-rose-950/30 border border-rose-300/80 dark:border-rose-500/35 text-rose-900 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:border-rose-400',
          activeClass:
            'bg-gradient-to-r from-rose-600 to-pink-600 border border-rose-400 text-white shadow-md shadow-rose-600/25'
        },
        {
          id: 'arena',
          labelVi: 'Thi đấu & BXH',
          labelEn: 'Weekly Arena',
          icon: (
            <span className="icon-anim-trophy">
              <Trophy className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-yellow-50/85 dark:bg-yellow-950/30 border border-yellow-300/80 dark:border-yellow-500/35 text-yellow-900 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:border-yellow-400',
          activeClass:
            'bg-gradient-to-r from-yellow-400 to-amber-500 border border-yellow-300 text-slate-950 font-semibold shadow-md shadow-yellow-500/25'
        },
        {
          id: 'live_meet',
          labelVi: 'Syn Meet',
          labelEn: 'Syn Meet · 3D',
          badge: 'LIVE',
          icon: (
            <span className="icon-anim-wave">
              <Video className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-sky-50/85 dark:bg-sky-950/30 border border-sky-300/80 dark:border-sky-500/35 text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/50 hover:border-sky-400',
          activeClass:
            'bg-gradient-to-r from-sky-500 to-cyan-500 border border-sky-300 text-slate-950 font-semibold shadow-md shadow-sky-500/25',
          badgeIdleClass:
            'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-400/30'
        },
        {
          id: 'forum',
          labelVi: 'Diễn đàn học tập',
          labelEn: 'Study Forum',
          icon: (
            <span className="icon-anim-wave">
              <MessageSquare className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-violet-50/85 dark:bg-violet-950/30 border border-violet-300/80 dark:border-violet-500/35 text-violet-900 dark:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-900/50 hover:border-violet-400',
          activeClass:
            'bg-gradient-to-r from-violet-600 to-purple-600 border border-violet-400 text-white shadow-md shadow-violet-600/25'
        },
        {
          id: 'growth_hub',
          labelVi: 'Sổ Lỗi Sai & SM-2',
          labelEn: 'Error Notebook & SM-2',
          icon: (
            <span className="icon-anim-zap">
              <Flame className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-rose-50/85 dark:bg-rose-950/30 border border-rose-300/80 dark:border-rose-500/35 text-rose-900 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:border-rose-400',
          activeClass:
            'bg-gradient-to-r from-rose-600 to-amber-500 border border-rose-400 text-white shadow-md shadow-rose-600/25'
        },
        {
          id: 'showcase',
          labelVi: 'Thư viện Sáng tạo',
          labelEn: '2D/3D Showcase',
          icon: (
            <span className="icon-anim-cosmos">
              <Layers className="w-5 h-5 shrink-0" />
            </span>
          ),
          idleClass:
            'bg-cyan-50/85 dark:bg-cyan-950/30 border border-cyan-300/80 dark:border-cyan-500/35 text-cyan-900 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 hover:border-cyan-400',
          activeClass:
            'bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-400 text-white shadow-md shadow-cyan-600/25'
        }
      ]
    }
  ];

  const handleSelect = (item: NavItemDef) => {
    onSelectSubject(item.id);
    item.onExtra?.();
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const isRail = !isMobileDrawer && collapsed;
    return (
      <div className="relative overflow-hidden flex flex-col h-full bg-white/95 dark:bg-slate-950/95 border-r border-slate-200/90 dark:border-slate-800/90 select-none">
        {/* Moving Molecular Particles & Covalent Bonds Background (skipped in smooth mode to save CPU) */}
        {perfMode !== 'smooth' && <SidebarMolecularParticles paused={pauseParticles || isRail} />}

        {/* Top Brand + Collapse Row */}
        <div
          className={`relative z-10 h-16 px-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center shrink-0 bg-white/85 dark:bg-slate-950/85 ${
            isRail ? 'justify-center' : 'justify-between gap-2'
          }`}
        >
          <button
            type="button"
            data-ripple="true"
            onClick={() => {
              onSelectSubject('overview');
              onCloseMobile();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 min-w-0 cursor-pointer group"
            title="Synapse STEM Studio"
          >
            <BrandLogo sizeClass="w-8 h-8 shrink-0" />
            {!isRail && (
              <div className="text-left min-w-0">
                <span className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white block leading-none">
                  Synapse
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                  {isEn ? 'STEM Academy 6–12' : 'Học viện STEM 6–12'}
                </span>
              </div>
            )}
          </button>

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-2 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label={isEn ? 'Close menu' : 'Đóng thanh điều hướng'}
            >
              <X className="w-5 h-5" />
            </button>
          ) : !isRail ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isEn ? 'Collapse sidebar' : 'Thu gọn thanh bên'}
              aria-label={isEn ? 'Collapse sidebar' : 'Thu gọn thanh bên'}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Navigation Groups — Individual Colors, Kinetic Icons & Hover Sweep */}
        <nav
          aria-label={isEn ? 'Primary sidebar navigation' : 'Thanh điều hướng bên trái'}
          className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-5 scrollbar-none"
        >
          {hasPremiumAccess && !isRail && (
            <div className="rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-cyan-500/15 px-3 py-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-300">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>SYNAPSE PREMIUM</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300">
                {dailyQuotaRemaining}/{dailyQuotaLimit}
              </span>
            </div>
          )}

          {navGroups.map((group) => (
            <div key={group.titleEn} className="space-y-1.5">
              {!isRail ? (
                <div className="px-2.5 pb-1 text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                  {isEn ? group.titleEn : group.titleVi}
                </div>
              ) : (
                <div className="h-px bg-slate-200/70 dark:bg-slate-800 mx-2 my-2" />
              )}

              {group.items.map((item) => {
                const isActive =
                  currentSubject === item.id ||
                  (item.id === 'synapse_v2' && currentSubject === 'future_lab');
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-ripple="true"
                    onClick={() => handleSelect(item)}
                    title={isEn ? item.labelEn : item.labelVi}
                    className={`group cs-deck-btn w-full min-h-[46px] flex items-center ${
                      isRail
                        ? 'justify-center px-2.5 py-3'
                        : 'justify-between gap-2.5 px-3 py-2.5'
                    } rounded text-[13.5px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      isActive ? item.activeClass : item.idleClass
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {item.icon}
                      {!isRail && (
                        <span className="truncate">{isEn ? item.labelEn : item.labelVi}</span>
                      )}
                    </span>
                    {!isRail && item.badge && (
                      <span
                        className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-sm tabular-nums shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-current'
                            : item.badgeIdleClass ||
                              'bg-white/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Grouped "Phòng lab ảo" Folder Button (Physics · Math · Code) */}
              {group.titleEn === 'Disciplines & Labs' && (
                <div className="space-y-1.5 pt-0.5">
                  <button
                    type="button"
                    data-ripple="true"
                    aria-expanded={isVirtualLabsOpen}
                    onClick={() => {
                      if (isRail) {
                        onToggleCollapse();
                        setIsVirtualLabsOpen(true);
                      } else {
                        setIsVirtualLabsOpen((v) => !v);
                      }
                    }}
                    title={
                      isEn
                        ? 'Virtual Labs (Physics · Math · Chemistry · Biology · Code)'
                        : 'Phòng lab ảo (Lí · Toán · Hóa · Sinh · Code)'
                    }
                    className={`group cs-deck-btn w-full min-h-[46px] flex items-center ${
                      isRail
                        ? 'justify-center px-2.5 py-3'
                        : 'justify-between gap-2.5 px-3 py-2.5'
                    } rounded text-[13.5px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      currentSubject === 'physics_sims' ||
                      currentSubject === 'math_sims' ||
                      currentSubject === 'chemistry_sims' ||
                      currentSubject === 'biology_sims' ||
                      currentSubject === 'cs_sims'
                        ? 'bg-gradient-to-r from-amber-500 to-cyan-600 border border-amber-300 text-white shadow-md'
                        : 'bg-amber-50/85 dark:bg-slate-900/85 border border-amber-300/80 dark:border-amber-500/35 text-slate-900 dark:text-amber-100 hover:border-amber-400'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <FlaskConical className="w-5 h-5 shrink-0" />
                      {!isRail && (
                        <span className="truncate">{isEn ? 'Virtual Labs' : 'Phòng lab ảo'}</span>
                      )}
                    </span>
                    {!isRail && (
                      <span className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono opacity-80">5</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-150 ${
                            isVirtualLabsOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    )}
                  </button>

                  {!isRail && isVirtualLabsOpen && (
                    <div className="pl-3 space-y-2 border-l-2 border-amber-400/40 ml-3">
                      {[
                        {
                          id: 'physics_sims' as SubjectType,
                          label: isEn ? 'Physics 2D/3D Labs' : 'Mô phỏng Lí 2D/3D',
                          badge: String(physicsSimTotal),
                          icon: <Atom className="w-4 h-4 shrink-0 text-orange-400" />,
                          chips: [
                            { label: '2D', onClick: () => navigate({ subject: 'physics_sims', physicsView: 'sim2d_hub', tutorOpen: false }) },
                            { label: '3D', onClick: () => navigate({ subject: 'physics_sims', physicsView: 'sim3d_hub', tutorOpen: false }) },
                          ],
                        },
                        {
                          id: 'math_sims' as SubjectType,
                          label: isEn ? 'Math 2D/3D & Draw' : 'Mô phỏng & Vẽ Toán',
                          badge: '2D·3D',
                          icon: <Compass className="w-4 h-4 shrink-0 text-blue-400" />,
                          chips: [
                            { label: isEn ? 'Graph 2D' : 'Đồ thị 2D', onClick: () => navigate({ subject: 'math_sims', mathTab: 'grapher', tutorOpen: false }) },
                            { label: '3D', onClick: () => navigate({ subject: 'math_sims', mathTab: 'math3d', tutorOpen: false }) },
                          ],
                        },
                        {
                          id: 'chemistry_sims' as SubjectType,
                          label: isEn ? 'Chemistry 2D/3D Labs' : 'Mô phỏng Hóa 2D/3D',
                          badge: `${CHEMISTRY_2D_SIMS.length + CHEMISTRY_3D_SIMS.length}+4`,
                          icon: <FlaskConical className="w-4 h-4 shrink-0 text-violet-400" />,
                          chips: [
                            { label: '2D', onClick: () => navigate({ subject: 'chemistry_sims', chemistryView: 'sim2d_hub', tutorOpen: false }) },
                            { label: '3D', onClick: () => navigate({ subject: 'chemistry_sims', chemistryView: 'sim3d_hub', tutorOpen: false }) },
                            { label: 'Sandbox', onClick: () => navigate({ subject: 'chemistry_sims', chemistryView: 'sandbox', tutorOpen: false }) },
                          ],
                        },
                        {
                          id: 'biology_sims' as SubjectType,
                          label: isEn ? 'Biology 2D/3D Labs' : 'Mô phỏng Sinh 2D/3D',
                          badge: `${BIOLOGY_2D_SIMS.length + BIOLOGY_3D_SIMS.length}+4`,
                          icon: <Dna className="w-4 h-4 shrink-0 text-teal-400" />,
                          chips: [
                            { label: '2D', onClick: () => navigate({ subject: 'biology_sims', biologyView: 'sim2d_hub', tutorOpen: false }) },
                            { label: '3D', onClick: () => navigate({ subject: 'biology_sims', biologyView: 'sim3d_hub', tutorOpen: false }) },
                            { label: 'Sandbox', onClick: () => navigate({ subject: 'biology_sims', biologyView: 'sandbox', tutorOpen: false }) },
                          ],
                        },
                        {
                          id: 'cs_sims' as SubjectType,
                          label: isEn ? 'Code 2D/3D Sims' : 'Mô phỏng Code',
                          badge: '2D·3D',
                          icon: <Code2 className="w-4 h-4 shrink-0 text-emerald-400" />,
                          chips: [
                            { label: '2D/3D', onClick: () => navigate({ subject: 'cs_sims', csViewMode: 'visualizer', csSimTab: 'viz3d', tutorOpen: false }) },
                            { label: 'IDE', onClick: () => navigate({ subject: 'cs_sims', csViewMode: 'custom', tutorOpen: false }) },
                          ],
                        },
                      ].map((lab) => {
                        const active = currentSubject === lab.id;
                        return (
                          <div key={lab.id} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectSubject(lab.id);
                                onCloseMobile();
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded text-xs font-semibold transition cursor-pointer ${
                                active
                                  ? 'bg-amber-500/20 border border-amber-400/60 text-amber-900 dark:text-amber-200'
                                  : 'bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-400/50'
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                {lab.icon}
                                <span className="truncate">{lab.label}</span>
                              </span>
                              <span className="text-[10px] font-mono opacity-80 shrink-0">
                                {lab.badge}
                              </span>
                            </button>
                            <div className="flex flex-wrap gap-1 pl-1">
                              {lab.chips.map((chip) => (
                                <button
                                  key={chip.label}
                                  type="button"
                                  onClick={() => {
                                    chip.onClick();
                                    onCloseMobile();
                                  }}
                                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/90 hover:bg-amber-500/20 border border-slate-200/80 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 cursor-pointer"
                                >
                                  {chip.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Grouped "Môn học" Folder Button right inside Disciplines & Labs group */}
              {group.titleEn === 'Disciplines & Labs' && (
                <div className="space-y-1.5 pt-0.5">
                  <button
                    type="button"
                    data-ripple="true"
                    aria-expanded={isSubjectsOpen}
                    onClick={() => {
                      if (isRail) {
                        onToggleCollapse();
                        setIsSubjectsOpen(true);
                      } else {
                        setIsSubjectsOpen((v) => !v);
                      }
                    }}
                    title={isEn ? 'Subjects (Math · Physics · Chemistry · Biology · CS)' : 'Môn học (Toán · Lí · Hóa · Sinh · Tin)'}
                    className={`group cs-deck-btn w-full min-h-[46px] flex items-center ${
                      isRail
                        ? 'justify-center px-2.5 py-3'
                        : 'justify-between gap-2.5 px-3 py-2.5'
                    } rounded text-[13.5px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                      currentSubject === 'math' ||
                      currentSubject === 'physics' ||
                      currentSubject === 'chemistry' ||
                      currentSubject === 'biology' ||
                      currentSubject === 'cs'
                        ? 'bg-slate-900 dark:bg-sky-600 border border-sky-400 text-white shadow-md'
                        : 'bg-blue-50/85 dark:bg-slate-900/85 border border-blue-300/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-sky-400'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-5 h-5 shrink-0" />
                      {!isRail && (
                        <span className="truncate">{isEn ? 'Subjects (5)' : 'Môn học'}</span>
                      )}
                    </span>
                    {!isRail && (
                      <span className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono opacity-80">5</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-150 ${
                            isSubjectsOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </span>
                    )}
                  </button>

                  {!isRail && isSubjectsOpen && (
                    <div className="pl-3 space-y-1.5 border-l border-slate-200 dark:border-slate-800 ml-3">
                      {(
                        [
                          {
                            id: 'math',
                            labelVi: 'Toán học (Bài giảng)',
                            labelEn: 'Math Lessons',
                            icon: <Compass className="w-4 h-4 shrink-0" />,
                            idleClass:
                              'bg-blue-50/85 dark:bg-blue-950/35 border border-blue-300/80 dark:border-blue-500/35 text-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/55',
                            activeClass:
                              'bg-gradient-to-r from-blue-600 to-sky-500 border border-blue-400 text-white shadow-sm'
                          },
                          {
                            id: 'physics',
                            labelVi: 'Vật lí (Bài giảng)',
                            labelEn: 'Physics Lessons',
                            icon: <Zap className="w-4 h-4 shrink-0" />,
                            idleClass:
                              'bg-amber-50/85 dark:bg-amber-950/35 border border-amber-300/80 dark:border-amber-500/35 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/55',
                            activeClass:
                              'bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-300 text-slate-950 font-bold shadow-sm'
                          },
                          {
                            id: 'chemistry',
                            labelVi: 'Hóa học (Bài giảng & Lab)',
                            labelEn: 'Chemistry Lessons & Lab',
                            icon: <FlaskConical className="w-4 h-4 shrink-0" />,
                            idleClass:
                              'bg-emerald-50/85 dark:bg-emerald-950/35 border border-emerald-300/80 dark:border-emerald-500/35 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/55',
                            activeClass:
                              'bg-gradient-to-r from-emerald-600 to-green-500 border border-emerald-400 text-white shadow-sm'
                          },
                          {
                            id: 'biology',
                            labelVi: 'Sinh học (Bài giảng & Lab)',
                            labelEn: 'Biology Lessons & Lab',
                            icon: <Dna className="w-4 h-4 shrink-0" />,
                            idleClass:
                              'bg-teal-50/85 dark:bg-teal-950/35 border border-teal-300/80 dark:border-teal-500/35 text-teal-900 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/55',
                            activeClass:
                              'bg-gradient-to-r from-teal-600 to-cyan-500 border border-teal-400 text-white shadow-sm'
                          },
                          {
                            id: 'cs',
                            labelVi: 'Tin học & IDE Code',
                            labelEn: 'CS & Code IDE',
                            icon: <Code2 className="w-4 h-4 shrink-0" />,
                            idleClass:
                              'bg-emerald-50/85 dark:bg-emerald-950/35 border border-emerald-300/80 dark:border-emerald-500/35 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/55',
                            activeClass:
                              'bg-gradient-to-r from-emerald-600 to-teal-500 border border-emerald-400 text-white shadow-sm'
                          }
                        ] as NavItemDef[]
                      ).map((subItem) => {
                        const subActive = currentSubject === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            type="button"
                            data-ripple="true"
                            onClick={() => handleSelect(subItem)}
                            className={`group cs-deck-btn w-full min-h-[40px] flex items-center gap-2.5 px-3 py-2 rounded text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                              subActive ? subItem.activeClass : subItem.idleClass
                            }`}
                          >
                            {subItem.icon}
                            <span className="truncate">
                              {isEn ? subItem.labelEn : subItem.labelVi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Synapse Pre Left Sidebar Groups (Phòng Lab, Mô phỏng, Sandboxes) — 22 Labs Directly in Left Nav when Pre is Active */}
          {hasPremiumAccess && (
            <div className="space-y-1.5 pt-2 border-t border-amber-400/35 dark:border-amber-500/25">
              {!isRail && (
                <div className="px-2.5 pb-1 flex items-center justify-between text-[11px] font-bold tracking-wide text-amber-700 dark:text-amber-300">
                  <span>
                    {isEn
                      ? `Synapse Pre · ${PRE_STUDIOS.length} Spaces`
                      : `Synapse Pre · ${PRE_STUDIOS.length} Không gian`}
                  </span>
                  <span className="font-mono text-[10px] opacity-80">3D/4D</span>
                </div>
              )}

              {PRE_SIDEBAR_GROUPS.map((grp) => {
                const groupLabs = PRE_STUDIOS.filter((s) => s.sidebarGroup === grp.id);
                const isGroupActive =
                  (currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
                  groupLabs.some((lab) => lab.id === location.futureTab);
                const isOpen = openPreGroups[grp.id];
                const GroupIcon =
                  grp.id === 'labs'
                    ? FlaskConical
                    : grp.id === 'simulations'
                    ? Orbit
                    : Sparkles;

                return (
                  <div key={grp.id} className="space-y-1">
                    <button
                      type="button"
                      data-ripple="true"
                      aria-expanded={isOpen}
                      onClick={() => {
                        if (isRail) {
                          onToggleCollapse();
                          setOpenPreGroups((prev) => ({ ...prev, [grp.id]: true }));
                        } else {
                          setOpenPreGroups((prev) => ({ ...prev, [grp.id]: !prev[grp.id] }));
                        }
                      }}
                      title={`${isEn ? grp.labelEn : grp.labelVi} (${groupLabs.length})`}
                      className={`group cs-deck-btn w-full min-h-[44px] flex items-center ${
                        isRail
                          ? 'justify-center px-2.5 py-2.5'
                          : 'justify-between gap-2.5 px-3 py-2'
                      } rounded text-[13.5px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                        isGroupActive ? grp.activeClass : grp.idleClass
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <GroupIcon className="w-5 h-5 shrink-0" />
                        {!isRail && (
                          <span className="truncate">{isEn ? grp.labelEn : grp.labelVi}</span>
                        )}
                      </span>
                      {!isRail && (
                        <span className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[11px] font-mono opacity-80">
                            {groupLabs.length}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-150 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </span>
                      )}
                    </button>

                    {!isRail && isOpen && (
                      <div className={`pl-2.5 space-y-2 border-l-2 ${grp.borderLineClass} ml-3`}>
                        {grp.id === 'sandboxes'
                          ? PRE_SANDBOX_DIVISIONS.map((div) => {
                              const divLabs = groupLabs.filter((lab) => lab.sandboxDivision === div.id);
                              if (divLabs.length === 0) return null;
                              return (
                                <div key={div.id} className="space-y-1.5 pt-1">
                                  <div
                                    className={`px-2 py-1 rounded border text-[10px] font-extrabold uppercase tracking-wider ${div.badgeClass}`}
                                  >
                                    {isEn ? div.labelEn : div.labelVi}
                                  </div>
                                  {PRE_SUBJECT_ZONES.filter((z) => div.subjectZones.includes(z.id)).map((zone) => {
                                    const zoneLabs = divLabs.filter((lab) => lab.subjectZone === zone.id);
                                    if (zoneLabs.length === 0) return null;
                                    const ZoneIcon = zone.icon;
                                    return (
                                      <div key={zone.id} className="space-y-1">
                                        <div className="flex items-center gap-1.5 px-1.5 pt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                          <ZoneIcon className="w-3 h-3 shrink-0" />
                                          <span>{isEn ? zone.labelEn : zone.labelVi}</span>
                                        </div>
                                        {zoneLabs.map((lab) => {
                                          const LabIcon = lab.icon;
                                          const labActive =
                                            (currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
                                            location.futureTab === lab.id;
                                          return (
                                            <button
                                              key={lab.id}
                                              type="button"
                                              onClick={() => {
                                                navigate({
                                                  subject: 'synapse_v2',
                                                  futureTab: lab.id,
                                                  synapseMode: 'catalog',
                                                  tutorOpen: false,
                                                });
                                                onCloseMobile();
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                              }}
                                              title={isEn ? lab.titleEn : lab.titleVi}
                                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                                                labActive
                                                  ? 'bg-gradient-to-r from-amber-500/25 to-cyan-500/20 border border-amber-400/70 text-slate-950 dark:text-amber-200 shadow-xs'
                                                  : 'bg-white/75 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-cyan-400/60 hover:bg-white dark:hover:bg-slate-900'
                                              }`}
                                            >
                                              <span className="flex items-center gap-2 min-w-0">
                                                <LabIcon className={`w-3.5 h-3.5 shrink-0 ${lab.accentTextClass}`} />
                                                <span className="truncate">
                                                  {isEn ? lab.shortEn : lab.shortVi}
                                                </span>
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })
                          : PRE_SUBJECT_ZONES.map((zone) => {
                              const zoneLabs = groupLabs.filter((lab) => lab.subjectZone === zone.id);
                              if (zoneLabs.length === 0) return null;
                              const ZoneIcon = zone.icon;
                              return (
                                <div key={zone.id} className="space-y-1">
                                  <div className="flex items-center gap-1.5 px-1.5 pt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <ZoneIcon className="w-3 h-3 shrink-0" />
                                    <span>{isEn ? zone.labelEn : zone.labelVi}</span>
                                  </div>
                                  {zoneLabs.map((lab) => {
                                    const LabIcon = lab.icon;
                                    const labActive =
                                      (currentSubject === 'synapse_v2' || currentSubject === 'future_lab') &&
                                      location.futureTab === lab.id;
                                    return (
                                      <button
                                        key={lab.id}
                                        type="button"
                                        onClick={() => {
                                          navigate({
                                            subject: 'synapse_v2',
                                            futureTab: lab.id,
                                            synapseMode: 'catalog',
                                            tutorOpen: false,
                                          });
                                          onCloseMobile();
                                          window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        title={isEn ? lab.titleEn : lab.titleVi}
                                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
                                          labActive
                                            ? 'bg-gradient-to-r from-amber-500/25 to-cyan-500/20 border border-amber-400/70 text-slate-950 dark:text-amber-200 shadow-xs'
                                            : 'bg-white/75 dark:bg-slate-900/75 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-cyan-400/60 hover:bg-white dark:hover:bg-slate-900'
                                        }`}
                                      >
                                        <span className="flex items-center gap-2 min-w-0">
                                          <LabIcon className={`w-3.5 h-3.5 shrink-0 ${lab.accentTextClass}`} />
                                          <span className="truncate">
                                            {isEn ? lab.shortEn : lab.shortVi}
                                          </span>
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              );
                            })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Jump Actions */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
            {!isRail && (
              <div className="px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                {isEn ? 'Quick Jump' : 'Truy cập nhanh'}
              </div>
            )}

            <button
              type="button"
              data-ripple="true"
              onClick={() => {
                onCloseMobile();
                requestScrollToDirectory('all');
              }}
              title={isEn ? 'Table of Contents (All Lectures)' : 'Mục lục bài giảng'}
              className={`group cs-deck-btn w-full min-h-[46px] flex items-center ${
                isRail ? 'justify-center px-2.5 py-3' : 'gap-2.5 px-3 py-2.5'
              } rounded text-[13.5px] font-medium bg-sky-50/85 dark:bg-sky-950/35 border border-sky-300/80 dark:border-sky-500/35 text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/55 hover:border-sky-400 transition-all cursor-pointer whitespace-nowrap`}
            >
              <span className="icon-anim-list">
                <ListOrdered className="w-5 h-5 shrink-0" />
              </span>
              {!isRail && (
                <span className="truncate">{isEn ? 'Lecture Directory' : 'Mục lục bài giảng'}</span>
              )}
            </button>

            <button
              type="button"
              data-ripple="true"
              onClick={() => {
                onCloseMobile();
                requestScrollToReviews();
              }}
              title={isEn ? 'Ratings & Community Votes' : 'Đánh giá & Bình chọn'}
              className={`group cs-deck-btn w-full min-h-[46px] flex items-center ${
                isRail ? 'justify-center px-2.5 py-3' : 'gap-2.5 px-3 py-2.5'
              } rounded text-[13.5px] font-medium bg-amber-50/85 dark:bg-amber-950/35 border border-amber-300/80 dark:border-amber-500/35 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/55 hover:border-amber-400 transition-all cursor-pointer whitespace-nowrap`}
            >
              <span className="icon-anim-star">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
              </span>
              {!isRail && (
                <span className="truncate">{isEn ? 'Ratings & Votes' : 'Đánh giá & Bình chọn'}</span>
              )}
            </button>
          </div>
        </nav>

        {/* Bottom Utility Actions */}
        <div className="relative z-10 p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5 shrink-0 bg-white/60 dark:bg-slate-950/55 backdrop-blur-sm">
          {onOpenInstallApp && (
            <button
              type="button"
              data-ripple="true"
              onClick={() => {
                onCloseMobile();
                onOpenInstallApp();
              }}
              title={isEn ? 'Install App (Laptop / Android / iPhone)' : 'Tải App (Laptop / Android / iPhone)'}
              className={`group cs-deck-btn w-full min-h-[44px] flex items-center ${
                isRail ? 'justify-center px-2.5 py-2.5' : 'gap-2.5 px-3 py-2'
              } rounded text-[13px] font-bold bg-sky-50/90 dark:bg-sky-950/45 border border-sky-300/80 dark:border-sky-500/40 text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors cursor-pointer whitespace-nowrap`}
            >
              <Download className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              {!isRail && (
                <span className="truncate">{isEn ? 'Install App (PC/Mobile)' : 'Tải App (PC / Mobile)'}</span>
              )}
            </button>
          )}

          <button
            type="button"
            data-ripple="true"
            onClick={() => {
              onCloseMobile();
              onOpenSettings();
            }}
            title={isEn ? 'Settings & PC Background' : 'Cài đặt & Giao diện nền'}
            className={`group cs-deck-btn w-full min-h-[46px] flex items-center ${
              isRail ? 'justify-center px-2.5 py-3' : 'gap-2.5 px-3 py-2.5'
            } rounded text-[13.5px] font-medium bg-slate-100/90 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-sky-400/60 transition-colors cursor-pointer whitespace-nowrap`}
          >
            <span className="icon-anim-gear">
              <Settings className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            </span>
            {!isRail && <span className="truncate">{isEn ? 'Settings' : 'Cài đặt hệ thống'}</span>}
          </button>

          {!isMobileDrawer && isRail && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title={isEn ? 'Expand sidebar' : 'Mở rộng thanh bên'}
              className="w-full min-h-[44px] flex items-center justify-center px-2 py-2.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Fixed Left Vertical Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-40 transition-[width] duration-200 ${
          collapsed ? 'w-[78px]' : 'w-[272px]'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[130] flex">
          <div
            className="fixed inset-0 bg-slate-950/55 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[284px] max-w-[85vw] h-full shadow-2xl">
            {renderSidebarBody(true)}
          </aside>
        </div>
      )}
    </>
  );
};
