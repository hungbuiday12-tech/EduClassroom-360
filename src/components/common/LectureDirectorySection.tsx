import React, { useMemo, useState } from 'react';
import { MATH_LECTURES } from '../../data/curriculumData';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { CS_LESSONS } from '../../data/csLessonsData';
import { useLanguage } from '../../context/LanguageContext';
import {
  BookOpen,
  Compass,
  Zap,
  Code2,
  Search,
  ArrowRight,
  Layers
} from 'lucide-react';

export type DirectorySubjectFilter = 'all' | 'math' | 'physics' | 'cs';
export type DirectoryTrackFilter = 'all' | 'khong_chuyen' | 'chuyen';

export interface LectureDirectoryTarget {
  subject: 'math' | 'physics' | 'cs';
  lectureId: string;
}

interface UnifiedLectureItem {
  id: string;
  subject: 'math' | 'physics' | 'cs';
  indexNumber: number;
  title: string;
  metaLine: string;
  track: 'khong_chuyen' | 'chuyen';
  searchText: string;
}

interface LectureDirectorySectionProps {
  id: string;
  subjectFilter: DirectorySubjectFilter;
  onSubjectFilterChange: (subject: DirectorySubjectFilter) => void;
  onSelectLecture: (target: LectureDirectoryTarget) => void;
  actionHintVi?: string;
  actionHintEn?: string;
}

export const LectureDirectorySection: React.FC<LectureDirectorySectionProps> = ({
  id,
  subjectFilter,
  onSubjectFilterChange,
  onSelectLecture,
  actionHintVi,
  actionHintEn
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [trackFilter, setTrackFilter] = useState<DirectoryTrackFilter>('all');
  const [query, setQuery] = useState('');

  const allItems = useMemo<UnifiedLectureItem[]>(() => {
    const mathItems: UnifiedLectureItem[] = MATH_LECTURES.map((l, idx) => {
      const isChuyen = l.track === 'chuyen' || l.gradeGroup === 'Chuyên Toán';
      const parts = [
        l.grade || (isChuyen ? 'Chuyên Toán' : 'THPT'),
        l.category || 'Toán học',
        isChuyen ? (isEn ? 'Specialized' : 'Chuyên / HSG') : (isEn ? 'Standard' : 'Cơ bản GDPT')
      ];
      return {
        id: l.id,
        subject: 'math',
        indexNumber: idx + 1,
        title: l.title,
        metaLine: parts.join(' · '),
        track: isChuyen ? 'chuyen' : 'khong_chuyen',
        searchText: `${l.title} ${l.grade} ${l.category || ''} ${l.description || ''}`.toLowerCase()
      };
    });

    const physicsItems: UnifiedLectureItem[] = PHYSICS_LESSONS.map((l, idx) => {
      const isChuyen = l.track === 'chuyen';
      const parts = [
        l.grade,
        l.tier || (isChuyen ? (isEn ? 'Specialized' : 'Chuyên / HSG') : (isEn ? 'Standard' : 'Cơ bản GDPT')),
        l.subtitle
      ].filter(Boolean);
      return {
        id: l.id,
        subject: 'physics',
        indexNumber: idx + 1,
        title: l.title,
        metaLine: parts.slice(0, 2).join(' · '),
        track: isChuyen ? 'chuyen' : 'khong_chuyen',
        searchText: `${l.title} ${l.grade} ${l.subtitle} ${l.description || ''}`.toLowerCase()
      };
    });

    const csItems: UnifiedLectureItem[] = CS_LESSONS.map((l, idx) => {
      const isChuyen = l.level === 'Nâng cao / HSG';
      const parts = [
        l.vnoiPhase || l.level,
        l.topic,
        `${l.estimatedMinutes} phút`
      ].filter(Boolean);
      return {
        id: l.id,
        subject: 'cs',
        indexNumber: idx + 1,
        title: l.title,
        metaLine: parts.slice(0, 2).join(' · '),
        track: isChuyen ? 'chuyen' : 'khong_chuyen',
        searchText: `${l.title} ${l.topic} ${l.level} ${l.vnoiPhase || ''}`.toLowerCase()
      };
    });

    return [...mathItems, ...physicsItems, ...csItems];
  }, [isEn]);

  const filteredItems = useMemo(() => {
    const kw = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (subjectFilter !== 'all' && item.subject !== subjectFilter) return false;
      if (trackFilter !== 'all' && item.track !== trackFilter) return false;
      if (kw && !item.searchText.includes(kw)) return false;
      return true;
    });
  }, [allItems, subjectFilter, trackFilter, query]);

  const groupedBySubject = useMemo(() => {
    return {
      math: filteredItems.filter((i) => i.subject === 'math'),
      physics: filteredItems.filter((i) => i.subject === 'physics'),
      cs: filteredItems.filter((i) => i.subject === 'cs')
    };
  }, [filteredItems]);

  const totalCount = allItems.length;

  const subjectMeta = {
    math: {
      headingVi: 'Toán Học · Đồ Thị 2D & Hình Học Oxyz 3D',
      headingEn: 'Mathematics · 2D Graphs & Oxyz 3D',
      icon: <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />,
      accentBorder: 'border-l-sky-500',
      hoverBorder: 'hover:border-sky-400/90 dark:hover:border-sky-400/80 hover:shadow-[0_14px_30px_-10px_rgba(14,165,233,0.35)]',
      indexBg: 'bg-sky-500/12 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 group-hover:bg-sky-600 group-hover:text-white',
      sheenGlow: 'from-sky-400/10 via-indigo-400/10 to-transparent'
    },
    physics: {
      headingVi: 'Vật Lí · Phòng Thí Nghiệm 2D & 3D 60 FPS',
      headingEn: 'Physics · 2D & 3D 60 FPS Simulation Labs',
      icon: <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
      accentBorder: 'border-l-amber-500',
      hoverBorder: 'hover:border-amber-400/90 dark:hover:border-amber-400/80 hover:shadow-[0_14px_30px_-10px_rgba(245,158,11,0.35)]',
      indexBg: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950',
      sheenGlow: 'from-amber-400/10 via-orange-400/10 to-transparent'
    },
    cs: {
      headingVi: 'Tin Học · Lộ Trình VNOI & Sublime Text 4 Judge',
      headingEn: 'Computer Science · VNOI Roadmap & Sublime Judge',
      icon: <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
      accentBorder: 'border-l-emerald-500',
      hoverBorder: 'hover:border-emerald-400/90 dark:hover:border-emerald-400/80 hover:shadow-[0_14px_30px_-10px_rgba(16,185,129,0.35)]',
      indexBg: 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white',
      sheenGlow: 'from-emerald-400/10 via-teal-400/10 to-transparent'
    }
  };

  const renderGroup = (subj: 'math' | 'physics' | 'cs', items: UnifiedLectureItem[]) => {
    if (items.length === 0) return null;
    const meta = subjectMeta[subj];
    return (
      <div key={subj} className="space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            {meta.icon}
            <h4 className="font-display text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
              {isEn ? meta.headingEn : meta.headingVi}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
            {items.length} {isEn ? 'lessons' : 'bài'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              data-ripple="true"
              onClick={() => onSelectLecture({ subject: item.subject, lectureId: item.id })}
              className={`group relative overflow-hidden text-left p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800/95 border border-slate-200/85 dark:border-white/10 border-l-[4px] ${meta.accentBorder} ${meta.hoverBorder} transition-all duration-200 shadow-2xs flex items-start justify-between gap-3 cursor-pointer active:scale-[0.96]`}
            >
              {/* Animated hover sheen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
              />
              {/* Subtle radial glow overlay on hover */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.sheenGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10 flex items-start gap-3 min-w-0">
                <span
                  className={`font-mono text-xs font-extrabold tabular-nums w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:-rotate-3 ${meta.indexBg}`}
                >
                  {String(item.indexNumber).padStart(2, '0')}
                </span>
                <div className="min-w-0 space-y-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.metaLine}
                  </div>
                </div>
              </div>
              <span className="relative z-10 w-7 h-7 rounded-xl bg-slate-200/60 dark:bg-white/5 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:scale-105">
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-3xl bg-white/85 dark:bg-slate-900/76 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/85 dark:border-white/10 p-5 sm:p-8 shadow-[0_16px_48px_-18px_rgba(15,23,42,0.14)] space-y-6"
    >
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="tabular-nums">
              {isEn
                ? `COMPLETE LECTURE DIRECTORY · ${totalCount} LESSONS`
                : `DANH SÁCH BÀI GIẢNG TOÀN HỆ THỐNG · ${totalCount} BÀI`}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEn
              ? 'All Interactive Lectures (Math · Physics · CS)'
              : 'Danh Sách Bài Giảng 5 Bước (Toán · Vật Lí · Tin Học)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isEn
              ? actionHintEn || 'Click any lesson below to open its interactive 5-step lecture, 2D/3D simulation, and practice quiz.'
              : actionHintVi || 'Bấm chọn bất kỳ bài giảng nào bên dưới để mở ngay phòng học 5 bước, mô phỏng 2D/3D và bài tập thực hành.'}
          </p>
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? 'Search lesson title or grade...' : 'Tìm tên bài giảng, lớp 9–12...'}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Subject Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSubjectFilterChange('all')}
            className={`group sheen-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
              subjectFilter === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="tabular-nums">
              {isEn ? `All (${totalCount})` : `Tất cả (${totalCount} bài)`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSubjectFilterChange('math')}
            className={`group sheen-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
              subjectFilter === 'math'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/25'
                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-sky-400 hover:bg-sky-50/70 dark:hover:bg-sky-950/50'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 group-hover:rotate-12 transition-transform" />
            <span className="tabular-nums">
              {isEn ? `Math (${MATH_LECTURES.length})` : `Toán học (${MATH_LECTURES.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSubjectFilterChange('physics')}
            className={`group sheen-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
              subjectFilter === 'physics'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25'
                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-amber-400 hover:bg-amber-50/70 dark:hover:bg-amber-950/50'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="tabular-nums">
              {isEn ? `Physics (${PHYSICS_LESSONS.length})` : `Vật lí (${PHYSICS_LESSONS.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSubjectFilterChange('cs')}
            className={`group sheen-btn flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
              subjectFilter === 'cs'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25'
                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/50'
            }`}
          >
            <Code2 className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="tabular-nums">
              {isEn ? `CS (${CS_LESSONS.length})` : `Tin học (${CS_LESSONS.length})`}
            </span>
          </button>
        </div>

        {/* Track Filter */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/85 border border-slate-200/80 dark:border-white/10 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setTrackFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              trackFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'All Tracks' : 'Mọi trình độ'}
          </button>
          <button
            type="button"
            onClick={() => setTrackFilter('khong_chuyen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              trackFilter === 'khong_chuyen'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Standard' : 'Cơ bản GDPT'}
          </button>
          <button
            type="button"
            onClick={() => setTrackFilter('chuyen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              trackFilter === 'chuyen'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Specialized' : 'Chuyên / HSG'}
          </button>
        </div>
      </div>

      {/* Lecture Lists */}
      {filteredItems.length === 0 ? (
        <div className="py-10 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
          {isEn
            ? 'No matching lectures found. Try clearing your filter.'
            : 'Không tìm thấy bài giảng phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc.'}
        </div>
      ) : (
        <div className="space-y-7 max-h-[540px] overflow-y-auto pr-1">
          {renderGroup('math', groupedBySubject.math)}
          {renderGroup('physics', groupedBySubject.physics)}
          {renderGroup('cs', groupedBySubject.cs)}
        </div>
      )}
    </section>
  );
};
