import React, { useMemo, useState } from 'react';
import { MATH_LECTURES } from '../../data/curriculumData';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { CS_LESSONS } from '../../data/csLessonsData';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../../data/csTracksData';
import { useLanguage } from '../../context/LanguageContext';
import {
  BookOpen,
  Compass,
  Zap,
  Code2,
  Search,
  ArrowRight,
  Layers,
  GitBranch
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
  onSelectCsTrack?: (trackId: CSTrackId) => void;
  actionHintVi?: string;
  actionHintEn?: string;
}

export const LectureDirectorySection: React.FC<LectureDirectorySectionProps> = ({
  id,
  subjectFilter,
  onSubjectFilterChange,
  onSelectLecture,
  onSelectCsTrack,
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

  const filteredCsTracks = useMemo(() => {
    if (subjectFilter !== 'all' && subjectFilter !== 'cs') return [];
    if (trackFilter === 'khong_chuyen') return [];
    const kw = query.trim().toLowerCase();
    return CS_SPECIALIZED_TRACKS.filter((t) => {
      if (!kw) return true;
      const hay = `${t.shortName} ${t.title} ${t.titleEn} ${t.categoryLabel} ${t.officialRef} ${t.summary}`.toLowerCase();
      return hay.includes(kw);
    });
  }, [subjectFilter, trackFilter, query]);

  const csSpecializedStageCount = useMemo(
    () => CS_SPECIALIZED_TRACKS.reduce((sum, t) => sum + t.stages.length, 0),
    []
  );

  const totalCount = allItems.length;

  const subjectMeta = {
    math: {
      headingVi: 'Toán Học · Đồ Thị 2D & Hình Học Oxyz 3D',
      headingEn: 'Mathematics · 2D Graphs & Oxyz 3D',
      icon: <Compass className="w-4 h-4 text-sky-600 dark:text-sky-300 icon-anim-compass shrink-0" />,
      headerBadge: 'bg-sky-500/12 border-sky-400/40 text-sky-700 dark:text-sky-300',
      cardSurface:
        'bg-sky-50/45 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-800/95 border-sky-300/80 dark:border-sky-500/30 hover:border-sky-500 hover:shadow-[0_12px_28px_-10px_rgba(2,132,199,0.34)] text-sky-700 dark:text-sky-300',
      indexBg:
        'bg-sky-500/12 border border-sky-400/35 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 group-hover:bg-sky-600 group-hover:border-sky-500 group-hover:text-white',
      arrowBg:
        'bg-sky-500/10 border border-sky-400/30 text-sky-600 dark:text-sky-300 group-hover:bg-sky-600 group-hover:border-sky-500 group-hover:text-white',
      titleHover: 'group-hover:text-sky-700 dark:group-hover:text-sky-300',
      sheenGlow: 'from-sky-400/12 via-blue-400/10 to-transparent'
    },
    physics: {
      headingVi: 'Vật Lí · Phòng Thí Nghiệm 2D & 3D 60 FPS',
      headingEn: 'Physics · 2D & 3D 60 FPS Simulation Labs',
      icon: <Zap className="w-4 h-4 text-amber-600 dark:text-amber-300 icon-anim-zap shrink-0" />,
      headerBadge: 'bg-amber-500/12 border-amber-400/45 text-amber-800 dark:text-amber-300',
      cardSurface:
        'bg-amber-50/45 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-800/95 border-amber-300/85 dark:border-amber-500/30 hover:border-amber-500 hover:shadow-[0_12px_28px_-10px_rgba(245,158,11,0.34)] text-amber-700 dark:text-amber-300',
      indexBg:
        'bg-amber-500/15 border border-amber-400/40 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:text-slate-950',
      arrowBg:
        'bg-amber-500/10 border border-amber-400/35 text-amber-700 dark:text-amber-300 group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:text-slate-950',
      titleHover: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
      sheenGlow: 'from-amber-400/12 via-orange-400/10 to-transparent'
    },
    cs: {
      headingVi: 'Tin Học · 5 Lộ Trình (VNOI & C++ Quốc Tế) · Sublime 4 Judge',
      headingEn: 'Computer Science · 5 Roadmaps (VNOI & C++ Tracks) · Sublime Judge',
      icon: <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300 icon-anim-code shrink-0" />,
      headerBadge: 'bg-emerald-500/12 border-emerald-400/40 text-emerald-800 dark:text-emerald-300',
      cardSurface:
        'bg-emerald-50/45 dark:bg-slate-900/75 hover:bg-white dark:hover:bg-slate-800/95 border-emerald-300/80 dark:border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_12px_28px_-10px_rgba(16,185,129,0.34)] text-emerald-700 dark:text-emerald-300',
      indexBg:
        'bg-emerald-500/12 border border-emerald-400/35 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:text-white',
      arrowBg:
        'bg-emerald-500/10 border border-emerald-400/30 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:text-white',
      titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
      sheenGlow: 'from-emerald-400/12 via-teal-400/10 to-transparent'
    }
  };

  const renderGroup = (subj: 'math' | 'physics' | 'cs', items: UnifiedLectureItem[]) => {
    const showCsTracks = subj === 'cs' && filteredCsTracks.length > 0;
    if (items.length === 0 && !showCsTracks) return null;
    const meta = subjectMeta[subj];
    return (
      <div key={subj} className="space-y-3">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/85 dark:border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 ${meta.headerBadge}`}>
              {meta.icon}
            </span>
            <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {isEn ? meta.headingEn : meta.headingVi}
            </h4>
          </div>
          <span className={`px-2 py-0.5 rounded border text-[11px] font-mono font-bold tabular-nums shrink-0 ${meta.headerBadge}`}>
            {subj === 'cs'
              ? isEn
                ? `${items.length} VNOI · +4 C++ tracks (${csSpecializedStageCount})`
                : `${items.length} VNOI · +4 lộ trình (${csSpecializedStageCount} chặng)`
              : `${items.length} ${isEn ? 'lessons' : 'bài'}`}
          </span>
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-ripple="true"
                onClick={() => onSelectLecture({ subject: item.subject, lectureId: item.id })}
                style={{ animationDelay: `${Math.min(idx * 18, 220)}ms` }}
                className={`group sci-frame cs-deck-btn lecture-card-reveal relative overflow-hidden text-left p-3.5 sm:p-4 rounded-md border ${meta.cardSurface} transition-all duration-200 shadow-xs flex items-start justify-between gap-3 cursor-pointer active:scale-[0.97]`}
              >
                {/* Animated hover sheen */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
                />
                {/* Subtle radial glow overlay on hover */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.sheenGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex items-start gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-extrabold tabular-nums w-8 h-8 rounded flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 ${meta.indexBg}`}
                  >
                    {String(item.indexNumber).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <div className={`text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-snug transition-colors line-clamp-2 ${meta.titleHover}`}>
                      {item.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="truncate">{item.metaLine}</span>
                    </div>
                  </div>
                </div>

                <span className={`relative z-10 w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:scale-105 ${meta.arrowBg}`}>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        )}

        {showCsTracks && (
          <div className="pt-2 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isEn
                    ? `4 Additional C++ Career & Certification Roadmaps (${csSpecializedStageCount} Stages)`
                    : `4 Lộ Trình Tin Học & C++ Bổ Sung (${csSpecializedStageCount} Chặng Chuẩn Quốc Tế)`}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCsTracks.map((track, tIdx) => (
                <button
                  key={track.id}
                  type="button"
                  data-ripple="true"
                  onClick={() => {
                    if (onSelectCsTrack) {
                      onSelectCsTrack(track.id);
                    } else if (track.stages[0]?.linkedLessonIds[0]) {
                      onSelectLecture({ subject: 'cs', lectureId: track.stages[0].linkedLessonIds[0] });
                    }
                  }}
                  className="group sci-frame cs-deck-btn relative overflow-hidden text-left p-3.5 rounded-md border border-emerald-300/80 dark:border-emerald-500/35 bg-emerald-50/55 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800/95 hover:border-emerald-500 transition-all duration-200 shadow-xs flex items-start justify-between gap-3 cursor-pointer active:scale-[0.98]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[160%] group-hover-sheen"
                  />
                  <div className="relative z-10 flex items-start gap-3 min-w-0">
                    <span className="font-mono text-[11px] font-extrabold tabular-nums px-2 h-8 rounded flex items-center justify-center shrink-0 bg-emerald-600 text-white">
                      LT{tIdx + 2}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 leading-snug line-clamp-1">
                        {track.shortName} · {isEn ? track.categoryLabelEn : track.categoryLabel}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                        {track.officialRef} · {track.stages.length} {isEn ? 'stages' : 'chặng'} · ~{track.estimatedWeeks}{' '}
                        {isEn ? 'weeks' : 'tuần'}
                      </p>
                    </div>
                  </div>
                  <span className="relative z-10 w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/10 border border-emerald-400/30 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 sci-frame sci-scan-bar relative rounded-lg bg-white/90 dark:bg-slate-900/82 backdrop-blur-md ring-1 ring-inset ring-white/60 dark:ring-white/10 border border-slate-200/90 dark:border-sky-500/25 p-5 sm:p-7 shadow-[0_18px_48px_-18px_rgba(15,23,42,0.16)] space-y-5"
    >
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-blue-700 dark:text-sky-400">
            <BookOpen className="w-4 h-4 shrink-0 icon-anim-book" />
            <span className="tabular-nums">
              {isEn
                ? `COMPLETE LECTURE DIRECTORY · ${totalCount} LESSONS`
                : `DANH SÁCH BÀI GIẢNG TOÀN HỆ THỐNG · ${totalCount} BÀI`}
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEn
              ? 'All Interactive Lectures (Math · Physics · CS)'
              : 'Danh Sách Bài Giảng 5 Bước (Toán · Vật Lí · Tin Học)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {isEn
              ? actionHintEn ||
                `Click any lesson to open its 5-step classroom, or jump straight into 5 CS roadmaps (${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} C++ stages).`
              : actionHintVi ||
                `Bấm chọn bất kỳ bài giảng nào để mở phòng học 5 bước, hoặc truy cập ngay 5 lộ trình Tin học (${CS_LESSONS.length} VNOI + ${csSpecializedStageCount} chặng C++ Quốc tế).`}
          </p>
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? 'Search lesson title or grade...' : 'Tìm tên bài giảng, lớp 9–12...'}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/85 border border-slate-300/85 dark:border-white/15 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Filter Bar — Responsive wrap prevents subject pills & track switcher from overlapping */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Subject Tabs — Crisp Square-ish Image 3 Aesthetic */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-ripple="true"
            onClick={() => onSubjectFilterChange('all')}
            className={`group cs-deck-btn flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              subjectFilter === 'all'
                ? 'bg-blue-700 dark:bg-sky-500 text-white dark:text-slate-950 border-blue-700 dark:border-sky-400 shadow-md shadow-blue-600/20'
                : 'bg-sky-50/70 dark:bg-slate-800/75 text-slate-800 dark:text-slate-200 border-sky-300/80 dark:border-sky-500/30 hover:border-blue-500 hover:bg-sky-100/80 dark:hover:bg-sky-950/45'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0 icon-anim-list" />
            <span>{isEn ? 'All' : 'Tất cả'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums ${
                subjectFilter === 'all'
                  ? 'bg-white/20 dark:bg-slate-950/20 text-current'
                  : 'bg-sky-500/15 text-blue-700 dark:text-sky-300 border border-sky-400/30'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => onSubjectFilterChange('math')}
            className={`group cs-deck-btn flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              subjectFilter === 'math'
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/25'
                : 'bg-sky-50/65 dark:bg-slate-800/75 text-sky-900 dark:text-sky-200 border-sky-300/80 dark:border-sky-500/30 hover:border-sky-500 hover:bg-sky-100/80 dark:hover:bg-sky-950/45'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0 icon-anim-compass" />
            <span>{isEn ? 'Math' : 'Toán học'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums ${
                subjectFilter === 'math'
                  ? 'bg-white/20 text-white'
                  : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-400/30'
              }`}
            >
              {MATH_LECTURES.length}
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => onSubjectFilterChange('physics')}
            className={`group cs-deck-btn flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              subjectFilter === 'physics'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/25'
                : 'bg-amber-50/65 dark:bg-slate-800/75 text-amber-950 dark:text-amber-200 border-amber-300/85 dark:border-amber-500/30 hover:border-amber-500 hover:bg-amber-100/80 dark:hover:bg-amber-950/45'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0 icon-anim-zap" />
            <span>{isEn ? 'Physics' : 'Vật lí'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums ${
                subjectFilter === 'physics'
                  ? 'bg-slate-950/15 text-slate-950'
                  : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/35'
              }`}
            >
              {PHYSICS_LESSONS.length}
            </span>
          </button>

          <button
            type="button"
            data-ripple="true"
            onClick={() => onSubjectFilterChange('cs')}
            className={`group cs-deck-btn flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap border transition-all cursor-pointer ${
              subjectFilter === 'cs'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25'
                : 'bg-emerald-50/65 dark:bg-slate-800/75 text-emerald-950 dark:text-emerald-200 border-emerald-300/80 dark:border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/45'
            }`}
          >
            <Code2 className="w-4 h-4 shrink-0 icon-anim-code" />
            <span>{isEn ? 'CS · 5 Roadmaps' : 'Tin học · 5 Lộ trình'}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold tabular-nums ${
                subjectFilter === 'cs'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-400/30'
              }`}
            >
              {CS_LESSONS.length}+{csSpecializedStageCount}
            </span>
          </button>
        </div>

        {/* Track Filter — Crisp Square-ish Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-md bg-slate-100/90 dark:bg-slate-800/85 border border-slate-300/80 dark:border-white/15 self-start xl:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setTrackFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              trackFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-white/15'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isEn ? 'All Tracks' : 'Mọi trình độ'}
          </button>
          <button
            type="button"
            onClick={() => setTrackFilter('khong_chuyen')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              trackFilter === 'khong_chuyen'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-300/60 dark:border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Standard' : 'Cơ bản GDPT'}
          </button>
          <button
            type="button"
            onClick={() => setTrackFilter('chuyen')}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              trackFilter === 'chuyen'
                ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-300/60 dark:border-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isEn ? 'Specialized' : 'Chuyên / HSG'}
          </button>
        </div>
      </div>

      {/* Lecture Lists */}
      {filteredItems.length === 0 && filteredCsTracks.length === 0 ? (
        <div className="py-10 text-center rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
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
