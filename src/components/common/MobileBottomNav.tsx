import React, { useEffect, useState } from 'react';
import {
  Home,
  Boxes,
  BookOpen,
  Trophy,
  Menu,
  X,
  LineChart,
  Atom,
  Binary,
  Cpu,
  Hand,
  Calculator,
  Zap,
  Code2,
  FileCheck2,
  Compass,
  Bot,
  PenTool,
  MessageSquare,
  ChevronRight,
  FlaskConical,
  Dna
} from 'lucide-react';
import { SubjectType } from '../../types';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';

interface MobileBottomNavProps {
  currentSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  onOpenMobileMenu: () => void;
  onOpenTutor: (subject?: SubjectType) => void;
  isHidden?: boolean;
}

type ActiveSheet = 'sims' | 'subjects' | 'arena' | null;

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentSubject,
  onSelectSubject,
  onOpenMobileMenu,
  onOpenTutor,
  isHidden = false
}) => {
  const { navigate } = useNavigation();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  useEffect(() => {
    setActiveSheet(null);
  }, [currentSubject]);

  if (isHidden) return null;

  const isHomeActive = currentSubject === 'overview';
  const isSimsActive = [
    'math_sims',
    'physics_sims',
    'chemistry_sims',
    'biology_sims',
    'cs_sims',
    'synapse_v2',
    'future_lab',
    'spatial_3d'
  ].includes(currentSubject);
  const isSubjectsActive = ['math', 'physics', 'chemistry', 'biology', 'cs', 'exams', 'roadmap'].includes(
    currentSubject
  );
  const isArenaActive = ['arena', 'growth_hub', 'forum'].includes(currentSubject);

  const toggleSheet = (sheet: Exclude<ActiveSheet, null>) => {
    setActiveSheet((prev) => (prev === sheet ? null : sheet));
  };

  const simItems: {
    id: string;
    titleVi: string;
    titleEn: string;
    subVi: string;
    subEn: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    onClick: () => void;
  }[] = [
    {
      id: 'math_sims',
      titleVi: 'Mô phỏng Toán 2D & Oxyz 3D',
      titleEn: 'Math 2D & Oxyz 3D Lab',
      subVi: 'Đồ thị hàm số · Hình học · 8 cảnh 3D',
      subEn: 'Grapher · Geometry · 8 Oxyz 3D Scenes',
      icon: LineChart,
      accentClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({ subject: 'math_sims', tutorOpen: false });
      }
    },
    {
      id: 'physics_sims',
      titleVi: 'Mô phỏng Vật lí 2D & 3D (10 lĩnh vực)',
      titleEn: 'Physics 2D & 3D (10 Domains)',
      subVi: '32 cảnh 3D + Động cơ RK4 & Đo cảm biến',
      subEn: '32 3D Scenes + RK4 Solver & Lab Bench',
      icon: Atom,
      accentClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({ subject: 'physics_sims', tutorOpen: false });
      }
    },
    {
      id: 'chemistry_sims',
      titleVi: 'Khu Lab & Mô phỏng Hóa 2D/3D',
      titleEn: 'Chemistry 2D/3D & Sandboxes',
      subVi: '30 Lab 2D · 16 Mô phỏng 3D · 4 Sandboxes',
      subEn: '30 2D · 16 3D Models · 4 Chem Sandboxes',
      icon: FlaskConical,
      accentClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({ subject: 'chemistry_sims', chemistryView: 'sim2d_hub', tutorOpen: false });
      }
    },
    {
      id: 'biology_sims',
      titleVi: 'Khu Lab & Mô phỏng Sinh 2D/3D',
      titleEn: 'Biology 2D/3D & Sandboxes',
      subVi: '30 Lab 2D · 16 Tế bào/DNA 3D · 4 Sandboxes',
      subEn: '30 2D · 16 3D Cell/DNA · 4 Bio Sandboxes',
      icon: Dna,
      accentClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({ subject: 'biology_sims', biologyView: 'sim2d_hub', tutorOpen: false });
      }
    },
    {
      id: 'cs_sims',
      titleVi: 'Mô phỏng Code 2D (16) & 3D (5)',
      titleEn: 'Code Visualizer 2D (16) & 3D (5)',
      subVi: 'Cây, Đồ thị, DP, Đệ quy & Bộ nhớ 3D',
      subEn: 'Trees, Graphs, DP & 3D Memory Stack',
      icon: Binary,
      accentClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({ subject: 'cs_sims', tutorOpen: false });
      }
    },
    {
      id: 'synapse_v2',
      titleVi: 'Synapse Pre · 30 Đại Công Trình & Lab 3D/4D',
      titleEn: 'Synapse Pre · 30 Mega & 3D/4D Labs',
      subVi: 'Hố đen, Lượng tử, Y sinh 4D, Phóng tên lửa',
      subEn: 'Quantum, Bio-Swarm 4D, Rocket Launch',
      icon: Cpu,
      accentClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({
          subject: 'synapse_v2',
          futureTab: 'megastructures',
          synapseMode: 'catalog',
          tutorOpen: false
        });
      }
    },
    {
      id: 'spatial_3d',
      titleVi: 'Học Cảm Giác 3D, Tay 10 Ngón & WebAR',
      titleEn: 'Spatial 3D, Hand Gesture & WebAR',
      subVi: 'Chạm xoay 3D, Camera quét vật thật & Point-Ask',
      subEn: 'Touch 3D, Real Object Scan & Point-Ask',
      icon: Hand,
      accentClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/35',
      onClick: () => {
        setActiveSheet(null);
        navigate({ subject: 'spatial_3d', tutorOpen: false });
      }
    }
  ];

  const subjectItems: {
    id: SubjectType;
    titleVi: string;
    titleEn: string;
    subVi: string;
    subEn: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
  }[] = [
    {
      id: 'math',
      titleVi: 'Bài giảng Toán',
      titleEn: 'Mathematics',
      subVi: 'Lý thuyết trọng tâm Lớp 9 → 12',
      subEn: 'Grades 9 → 12 Curriculum',
      icon: Calculator,
      accentClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
    },
    {
      id: 'physics',
      titleVi: 'Bài giảng Vật lí',
      titleEn: 'Physics',
      subVi: '10 lĩnh vực & Thí nghiệm kèm bài',
      subEn: '10 Domains & Interactive Labs',
      icon: Zap,
      accentClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
    },
    {
      id: 'chemistry',
      titleVi: 'Bài giảng Hóa học',
      titleEn: 'Chemistry',
      subVi: 'GDPT 2018 · 2006 · Chuyên & Lab 2D/3D',
      subEn: '2018 & 2006 Curricula + 2D/3D Labs',
      icon: FlaskConical,
      accentClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'biology',
      titleVi: 'Bài giảng Sinh học',
      titleEn: 'Biology',
      subVi: 'GDPT 2018 · 2006 · Chuyên & Lab 2D/3D',
      subEn: '2018 & 2006 Curricula + 2D/3D Labs',
      icon: Dna,
      accentClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30'
    },
    {
      id: 'cs',
      titleVi: 'Tin học & Chấm Code IDE',
      titleEn: 'CS & Online Judge IDE',
      subVi: 'Code Cơ bản / Chuyên + Chấm test',
      subEn: 'Basic / Competitive + Judge',
      icon: Code2,
      accentClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'exams',
      titleVi: 'Kho Đề Thi & Mã Đề',
      titleEn: 'Exam Vault & Codes',
      subVi: 'Tải DOCX, Tra mã đề & Giải chi tiết',
      subEn: 'DOCX Download & Full Solutions',
      icon: FileCheck2,
      accentClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
    },
    {
      id: 'roadmap',
      titleVi: 'Lộ trình Học STEM',
      titleEn: 'STEM Roadmap',
      subVi: 'Ôn tập theo mục tiêu điểm số',
      subEn: 'Guided Study Milestones',
      icon: Compass,
      accentClass: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30'
    }
  ];

  const arenaItems: {
    id: string;
    titleVi: string;
    titleEn: string;
    subVi: string;
    subEn: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    onClick: () => void;
  }[] = [
    {
      id: 'arena',
      titleVi: 'Đấu Trường Tri Thức & BXH',
      titleEn: 'Knowledge Arena & Ranks',
      subVi: 'Thi đấu theo Lớp / Hệ Chuyên',
      subEn: 'Grade & Gifted Divisions',
      icon: Trophy,
      accentClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      onClick: () => {
        setActiveSheet(null);
        onSelectSubject('arena');
      }
    },
    {
      id: 'tutor',
      titleVi: 'Syn AI Gia Sư Tương Tác',
      titleEn: 'Syn AI Interactive Tutor',
      subVi: 'Giải thích từng bước Toán · Lí · Hóa · Sinh · Tin',
      subEn: 'Step-by-step Math, Physics, Chem, Bio & CS',
      icon: Bot,
      accentClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      onClick: () => {
        setActiveSheet(null);
        onOpenTutor('math');
      }
    },
    {
      id: 'growth_hub',
      titleVi: 'Phát triển & Bảng Nháp Vô Cực',
      titleEn: 'Growth & Infinite Scratchpad',
      subVi: 'Ghi chú STEM, Công thức & Lịch sử',
      subEn: 'STEM Notes, Formulas & Progress',
      icon: PenTool,
      accentClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
      onClick: () => {
        setActiveSheet(null);
        onSelectSubject('growth_hub');
      }
    },
    {
      id: 'forum',
      titleVi: 'Diễn Đàn STEM',
      titleEn: 'STEM Forum',
      subVi: 'Thảo luận đề thi & chia sẻ mô phỏng',
      subEn: 'Exam Q&A & Simulations',
      icon: MessageSquare,
      accentClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      onClick: () => {
        setActiveSheet(null);
        onSelectSubject('forum');
      }
    }
  ];

  return (
    <div className="lg:hidden">
      {/* Backdrop & Quick Launcher Sheet */}
      {activeSheet && (
        <div
          className="fixed inset-0 z-[74] bg-slate-950/55 backdrop-blur-xs"
          onClick={() => setActiveSheet(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-[60px] left-2 right-2 sm:left-auto sm:right-4 sm:w-[420px] max-h-[72dvh] overflow-y-auto rounded-[4px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                {activeSheet === 'sims'
                  ? isEn
                    ? 'Quick Launch 2D / 3D / AR Labs'
                    : 'Mở nhanh Mô phỏng 2D / 3D / AR'
                  : activeSheet === 'subjects'
                  ? isEn
                    ? 'Subjects, Exams & Roadmap'
                    : 'Môn học, Kho đề & Lộ trình'
                  : isEn
                  ? 'Arena, Syn AI & Tools'
                  : 'Đấu trường, Syn AI & Công cụ'}
              </div>
              <button
                type="button"
                onClick={() => setActiveSheet(null)}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[4px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer"
                aria-label={isEn ? 'Close drawer' : 'Đóng bảng'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeSheet === 'sims' && (
              <div className="space-y-1.5">
                {simItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className="w-full min-h-[52px] flex items-center gap-3 p-2.5 rounded-[4px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:border-sky-500/60 text-left transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-[4px] border flex items-center justify-center shrink-0 ${item.accentClass}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {isEn ? item.titleEn : item.titleVi}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {isEn ? item.subEn : item.subVi}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            {activeSheet === 'subjects' && (
              <div className="space-y-1.5">
                {subjectItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveSheet(null);
                        onSelectSubject(item.id);
                      }}
                      className="w-full min-h-[50px] flex items-center gap-3 p-2.5 rounded-[4px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:border-sky-500/60 text-left transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-9 h-9 rounded-[4px] border flex items-center justify-center shrink-0 ${item.accentClass}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {isEn ? item.titleEn : item.titleVi}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {isEn ? item.subEn : item.subVi}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            {activeSheet === 'arena' && (
              <div className="space-y-1.5">
                {arenaItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.onClick}
                      className="w-full min-h-[50px] flex items-center gap-3 p-2.5 rounded-[4px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:border-sky-500/60 text-left transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-9 h-9 rounded-[4px] border flex items-center justify-center shrink-0 ${item.accentClass}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {isEn ? item.titleEn : item.titleVi}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {isEn ? item.subEn : item.subVi}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation Dock (56px height) */}
      <nav
        aria-label={isEn ? 'Mobile navigation bar' : 'Thanh điều hướng nhanh'}
        className="fixed bottom-0 inset-x-0 z-[75] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800/90 px-1.5 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 gap-1 h-14 items-center max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => {
              setActiveSheet(null);
              onSelectSubject('overview');
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[4px] text-[10px] font-bold transition-colors cursor-pointer ${
              isHomeActive && !activeSheet
                ? 'bg-sky-500/12 text-sky-600 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-full px-0.5">{isEn ? 'Home' : 'Trang chủ'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSheet('sims')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[4px] text-[10px] font-extrabold transition-colors cursor-pointer border ${
              activeSheet === 'sims' || isSimsActive
                ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                : 'bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/35'
            }`}
          >
            <Boxes className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-full px-0.5">{isEn ? 'Sims' : 'Mô phỏng'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSheet('subjects')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[4px] text-[10px] font-bold transition-colors cursor-pointer ${
              activeSheet === 'subjects' || isSubjectsActive
                ? 'bg-blue-500/12 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-full px-0.5">{isEn ? 'Learn' : 'Môn học'}</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSheet('arena')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[4px] text-[10px] font-bold transition-colors cursor-pointer ${
              activeSheet === 'arena' || isArenaActive
                ? 'bg-amber-500/12 text-amber-600 dark:text-amber-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-full px-0.5">{isEn ? 'Arena' : 'Đấu trường'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSheet(null);
              onOpenMobileMenu();
            }}
            className="min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-[4px] text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-full px-0.5">{isEn ? 'Menu' : 'Menu'}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
