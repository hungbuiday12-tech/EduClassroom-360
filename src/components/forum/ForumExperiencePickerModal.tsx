import React, { useMemo, useState } from 'react';
import {
  Atom,
  BookOpen,
  Box,
  Compass,
  Cpu,
  Dna,
  FlaskConical,
  Layers,
  Orbit,
  Search,
  Sparkles,
  X
} from 'lucide-react';
import {
  ForumExperienceAttachment,
  ForumExperienceKind,
  ForumExperienceSubject
} from '../../types';
import {
  ExperienceCatalogItem,
  catalogItemToAttachment,
  getExperienceCatalog
} from './forumExperienceCatalog';
import { MathFormula } from '../common/MathRenderer';

interface ForumExperiencePickerModalProps {
  open: boolean;
  isEn: boolean;
  initialKind?: 'all' | ForumExperienceKind;
  onClose: () => void;
  onSelect: (attachment: ForumExperienceAttachment) => void;
}

const KIND_TABS: Array<{ id: 'all' | ForumExperienceKind; labelVi: string; labelEn: string }> = [
  { id: 'all', labelVi: 'Tất cả', labelEn: 'All' },
  { id: 'sim2d', labelVi: 'Thí nghiệm 2D', labelEn: '2D Sims' },
  { id: 'sim3d', labelVi: 'Mô phỏng 3D', labelEn: '3D Models' },
  { id: 'sandbox', labelVi: 'Sandbox Lab', labelEn: 'Sandboxes' },
  { id: 'pre_lab', labelVi: 'Synapse Pre', labelEn: 'Synapse Pre' },
  { id: 'lecture', labelVi: 'Bài giảng', labelEn: 'Lectures' }
];

const SUBJECT_TABS: Array<{ id: 'all' | ForumExperienceSubject; labelVi: string; labelEn: string }> = [
  { id: 'all', labelVi: 'Mọi môn', labelEn: 'All Subjects' },
  { id: 'physics', labelVi: 'Vật lí', labelEn: 'Physics' },
  { id: 'chemistry', labelVi: 'Hóa học', labelEn: 'Chemistry' },
  { id: 'biology', labelVi: 'Sinh học', labelEn: 'Biology' },
  { id: 'math', labelVi: 'Toán học', labelEn: 'Math' },
  { id: 'cs', labelVi: 'Tin học', labelEn: 'CS' },
  { id: 'pre', labelVi: 'Synapse Pre', labelEn: 'Synapse Pre' }
];

function getSubjectIcon(subject: ForumExperienceSubject) {
  switch (subject) {
    case 'physics':
      return <Atom className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
    case 'chemistry':
      return <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
    case 'biology':
      return <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    case 'math':
      return <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />;
    case 'cs':
      return <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />;
    default:
      return <Orbit className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />;
  }
}

function getKindLabel(kind: ForumExperienceKind, isEn: boolean): string {
  switch (kind) {
    case 'sim2d':
      return isEn ? '2D Experiment' : 'Thí nghiệm 2D';
    case 'sim3d':
      return isEn ? '3D Simulation' : 'Mô phỏng 3D';
    case 'sandbox':
      return 'Sandbox Lab';
    case 'pre_lab':
      return 'Synapse Pre 3D';
    default:
      return isEn ? 'Lecture' : 'Bài giảng';
  }
}

export const ForumExperiencePickerModal: React.FC<ForumExperiencePickerModalProps> = ({
  open,
  isEn,
  initialKind = 'all',
  onClose,
  onSelect
}) => {
  const [kindFilter, setKindFilter] = useState<'all' | ForumExperienceKind>(initialKind);
  const [subjectFilter, setSubjectFilter] = useState<'all' | ForumExperienceSubject>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openSimForLecture, setOpenSimForLecture] = useState(true);

  React.useEffect(() => {
    if (open) {
      setKindFilter(initialKind);
    }
  }, [open, initialKind]);

  const catalog = useMemo(() => getExperienceCatalog(), []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return catalog
      .filter((item) => {
        if (kindFilter !== 'all' && item.kind !== kindFilter) return false;
        if (subjectFilter !== 'all' && item.subject !== subjectFilter) return false;
        if (!q) return true;
        return item.keywords.includes(q) || item.title.toLowerCase().includes(q);
      })
      .slice(0, 60);
  }, [catalog, kindFilter, subjectFilter, searchQuery]);

  if (!open) return null;

  const handleChoose = (item: ExperienceCatalogItem) => {
    onSelect(catalogItemToAttachment(item, item.kind === 'lecture' ? openSimForLecture : true));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
                {isEn
                  ? 'Attach Experiment, 3D Lab or Lecture'
                  : 'Gắn Thí Nghiệm 2D/3D, Sandbox Hoặc Bài Giảng'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {isEn
                  ? 'Viewers can click the card directly on the feed to launch and experience it.'
                  : 'Người xem có thể bấm trực tiếp vào thẻ trên bài đăng để mở và trải nghiệm ngay.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 space-y-3 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search simulation, Mendel, titration, projectile, Oxyz, Dijkstra...'
                  : 'Tìm thí nghiệm, Mendel, chuẩn độ pH, ném xiên, Oxyz, Dijkstra, bài giảng...'
              }
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {KIND_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setKindFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  kindFilter === tab.id
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                }`}
              >
                {isEn ? tab.labelEn : tab.labelVi}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {SUBJECT_TABS.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSubjectFilter(sub.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    subjectFilter === sub.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {isEn ? sub.labelEn : sub.labelVi}
                </button>
              ))}
            </div>

            {(kindFilter === 'all' || kindFilter === 'lecture') && (
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openSimForLecture}
                  onChange={(e) => setOpenSimForLecture(e.target.checked)}
                  className="accent-indigo-600"
                />
                <span>
                  {isEn ? 'Open lecture at Sim tab' : 'Bài giảng mở sẵn tab Mô phỏng'}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Result List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              {isEn
                ? 'No matching experiment or lecture found. Try another keyword.'
                : 'Không tìm thấy thí nghiệm hoặc bài giảng phù hợp.'}
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleChoose(item)}
                className="w-full text-left p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {getSubjectIcon(item.subject)}
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 flex items-center gap-1">
                    {item.kind === 'sim3d' || item.kind === 'pre_lab' ? (
                      <Box className="w-3.5 h-3.5" />
                    ) : item.kind === 'sim2d' || item.kind === 'sandbox' ? (
                      <Layers className="w-3.5 h-3.5" />
                    ) : (
                      <BookOpen className="w-3.5 h-3.5" />
                    )}
                    <span>{getKindLabel(item.kind, isEn)}</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-1.5">
                  <span className="truncate">{item.subtitle}</span>
                  {item.gradeLabel && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {item.gradeLabel}
                      </span>
                    </>
                  )}
                </div>

                {item.formula && (
                  <div className="pt-0.5 text-xs text-slate-700 dark:text-slate-200 overflow-x-auto">
                    <MathFormula formula={item.formula} />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
