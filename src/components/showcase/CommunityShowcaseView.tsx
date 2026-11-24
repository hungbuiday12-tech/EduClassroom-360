import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Box,
  Check,
  Code2,
  Compass,
  Copy,
  Download,
  Eye,
  Heart,
  Layers,
  PenTool,
  Plus,
  Search,
  Sparkles,
  X,
  Zap
} from 'lucide-react';
import { CommunityShowcaseItem, GrowthSubject, ShowcaseCategory, SubjectType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  fetchShowcaseItems,
  publishShowcaseItem,
  toggleShowcaseLike
} from '../../lib/communityShowcaseStore';
import { loadLocalCustomModels, persistCustomSpatialModel } from '../spatial3d/customModelStore';
import { recordGrowthStat } from '../../lib/learningGrowthStore';
import { FormattedText } from '../common/MathRenderer';

interface CommunityShowcaseViewProps {
  onBack: () => void;
  onNavigateSubject: (subj: SubjectType) => void;
  onEarnXP: (xp: number) => void;
}

export const CommunityShowcaseView: React.FC<CommunityShowcaseViewProps> = ({
  onBack,
  onNavigateSubject,
  onEarnXP
}) => {
  const { user, firebaseUser } = useAuth();
  const { navigate } = useNavigation();
  const uid = user?.uid || firebaseUser?.uid;

  const [items, setItems] = useState<CommunityShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState<'all' | ShowcaseCategory>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | GrowthSubject>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'saved'>('popular');
  const [search, setSearch] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [inspectItem, setInspectItem] = useState<CommunityShowcaseItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(`synapse_showcase_saved_v1_${uid || 'guest'}`);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  // Publish Modal State
  const [showPublish, setShowPublish] = useState(false);
  const [pubCategory, setPubCategory] = useState<ShowcaseCategory>('3d_model');
  const [pubSubject, setPubSubject] = useState<GrowthSubject>('physics');
  const [pubTitle, setPubTitle] = useState('');
  const [pubDesc, setPubDesc] = useState('');
  const [pubCode, setPubCode] = useState('');
  const [selectedCustomModelId, setSelectedCustomModelId] = useState('');

  const my3DModels = useMemo(() => loadLocalCustomModels(), [showPublish]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void fetchShowcaseItems().then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleSaveBookmark = (id: string) => {
    setSavedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`synapse_showcase_saved_v1_${uid || 'guest'}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1600);
  };

  const handleDownloadPayload = (item: CommunityShowcaseItem) => {
    let content = item.description;
    let ext = 'txt';
    if (item.payloadCode?.code) {
      content = item.payloadCode.code;
      ext = item.payloadCode.language === 'python' ? 'py' : 'cpp';
    } else if (item.payload3dModel) {
      content = JSON.stringify(item.payload3dModel, null, 2);
      ext = 'json';
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter((it) => {
      if (catFilter !== 'all' && it.category !== catFilter) return false;
      if (subjectFilter !== 'all' && it.subject !== subjectFilter) return false;
      if (sortBy === 'saved' && !savedIds[it.id]) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    if (sortBy === 'newest') {
      return [...list].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }
    return [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }, [items, catFilter, subjectFilter, sortBy, savedIds, search]);

  const handleLike = async (id: string) => {
    const res = await toggleShowcaseLike(id);
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, likes: res.likes, likedByMe: res.likedByMe } : it
      )
    );
  };

  const handleRemixItem = async (item: CommunityShowcaseItem) => {
    if (item.category === '3d_model' && item.payload3dModel) {
      const cloned = {
        ...item.payload3dModel,
        id: `remix_${Date.now()}`,
        titleVi: `${item.payload3dModel.titleVi || item.title} (Remix)`,
        createdAt: new Date().toISOString()
      };
      await persistCustomSpatialModel(cloned);
      onEarnXP(15);
      setStatusBanner(`Đã nhân bản mô hình "${item.title}" vào Xưởng 3D của bạn!`);
      onNavigateSubject('spatial_3d');
      return;
    }

    if (item.category === 'cs_algo' && item.payloadCode?.code) {
      navigator.clipboard.writeText(item.payloadCode.code);
      onEarnXP(10);
      setStatusBanner(`Đã sao chép mã nguồn "${item.title}"! Đang mở Sublime Studio...`);
      navigate({ subject: 'cs', csViewMode: 'custom' });
      return;
    }

    onEarnXP(10);
    setStatusBanner(`Đã mở chế độ Tự do tạo 2D để bạn vẽ theo ý tưởng "${item.title}"!`);
    onNavigateSubject('spatial_3d');
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim()) return;
    const picked3d = my3DModels.find((m) => m.id === selectedCustomModelId);

    const created = await publishShowcaseItem({
      category: pubCategory,
      subject: pubSubject,
      title: pubTitle.trim(),
      description: pubDesc.trim() || 'Tác phẩm chia sẻ từ cộng đồng học viên Synapse.',
      authorName: user?.displayName || 'Thành viên Synapse',
      authorHandle: user?.username ? `@${user.username}` : '@synapse_creator',
      tags: [
        pubSubject === 'math' ? 'Toán' : pubSubject === 'physics' ? 'Vật lí' : 'Tin học',
        pubCategory === '3d_model' ? '3D CAD' : pubCategory === '2d_canvas' ? 'Tự do 2D' : 'Thuật toán'
      ],
      payload3dModel: pubCategory === '3d_model' ? picked3d || undefined : undefined,
      payloadCode:
        pubCategory === 'cs_algo' && pubCode.trim()
          ? { language: 'cpp', code: pubCode.trim(), complexity: 'Tối ưu' }
          : undefined,
      payload2dMeta:
        pubCategory === '2d_canvas'
          ? { modeId: 'free_create', shapeCount: 5, caption: pubDesc.trim() }
          : undefined
    });

    setItems((prev) => [created, ...prev]);
    recordGrowthStat('showcasePublished', 1, uid);
    onEarnXP(35);
    setPubTitle('');
    setPubDesc('');
    setPubCode('');
    setShowPublish(false);
    setStatusBanner('Đã đăng tác phẩm lên Thư viện Cộng đồng Synapse (+35 XP)!');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="sci-frame syn-top-laser bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Thư Viện Sáng Tạo Cộng Đồng 2D / 3D & Thuật Toán
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Khám phá, thả tim & bấm Nhân bản (Remix) 1 chạm các mô hình 3D, bản vẽ Tự do tạo 2D và template C++ chuẩn VNOI.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPublish(true)}
            className="cs-deck-btn px-4 py-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng tác phẩm từ Xưởng</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all' as const, label: 'Tất cả', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: '3d_model' as const, label: 'Mô hình 3D', icon: <Box className="w-3.5 h-3.5" /> },
              { id: '2d_canvas' as const, label: 'Tự do tạo 2D', icon: <PenTool className="w-3.5 h-3.5" /> },
              { id: 'cs_algo' as const, label: 'Thuật toán Code', icon: <Code2 className="w-3.5 h-3.5" /> }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCatFilter(f.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                  catFilter === f.id
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white border-slate-900 dark:border-cyan-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                {f.icon}
                <span>{f.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as 'all' | GrowthSubject)}
              className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold cursor-pointer"
            >
              <option value="all">Tất cả môn</option>
              <option value="math">Toán học</option>
              <option value="physics">Vật lí</option>
              <option value="cs">Tin học</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'saved')}
              className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold cursor-pointer"
            >
              <option value="popular">Nổi bật nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="saved">Đã lưu ({Object.values(savedIds).filter(Boolean).length})</option>
            </select>

            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm mô hình, thuật toán..."
                className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {statusBanner && (
        <div className="p-3 rounded border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <span>{statusBanner}</span>
          <button type="button" onClick={() => setStatusBanner(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-md bg-slate-200/70 dark:bg-slate-800/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/70 rounded-md overflow-hidden flex flex-col justify-between shadow-sm transition-all"
            >
              {/* Visual Preview Header */}
              <div className="h-36 bg-slate-950 relative overflow-hidden flex items-center justify-center p-4 border-b border-slate-800">
                {item.category === '3d_model' && (
                  <svg viewBox="0 0 180 100" className="w-full h-full">
                    <defs>
                      <linearGradient id={`g-${item.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="90" cy="52" rx="54" ry="20" fill="none" stroke={`url(#g-${item.id})`} strokeWidth="2" strokeDasharray="5 3" />
                    <ellipse cx="90" cy="52" rx="34" ry="38" fill="none" stroke="#f59e0b" strokeWidth="1.8" transform="rotate(28 90 52)" />
                    <polygon points="90,22 114,66 66,66" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="90" cy="52" r="5" fill="#22d3ee" />
                  </svg>
                )}
                {item.category === '2d_canvas' && (
                  <svg viewBox="0 0 180 100" className="w-full h-full">
                    <line x1="15" y1="50" x2="165" y2="50" stroke="#334155" strokeWidth="1" />
                    <line x1="90" y1="8" x2="90" y2="92" stroke="#334155" strokeWidth="1" />
                    <ellipse cx="90" cy="50" rx="58" ry="26" fill="rgba(16,185,129,0.12)" stroke="#34d399" strokeWidth="2" />
                    <path d="M 40 80 Q 90 12 140 80" fill="none" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="62" cy="50" r="3" fill="#f59e0b" />
                    <circle cx="118" cy="50" r="3" fill="#f59e0b" />
                  </svg>
                )}
                {item.category === 'cs_algo' && (
                  <pre className="w-full h-full overflow-hidden text-[10px] font-mono text-emerald-300 leading-tight opacity-90">
                    {item.payloadCode?.code?.slice(0, 260) || '// C++20 Competitive Template'}
                  </pre>
                )}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  {item.category === '3d_model' ? '3D Assembly' : item.category === '2d_canvas' ? '2D Sketch' : 'Algorithm'}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-slate-300">
                  {item.subject === 'math' ? <Compass className="w-3 h-3 inline text-sky-400" /> : item.subject === 'physics' ? <Zap className="w-3 h-3 inline text-amber-400" /> : <Code2 className="w-3 h-3 inline text-emerald-400" />}
                </span>
              </div>

              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    <FormattedText text={item.title} />
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    <FormattedText text={item.description} />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 truncate">
                    <strong className="text-slate-700 dark:text-slate-300">{item.authorName}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSaveBookmark(item.id)}
                      className={`p-1.5 rounded border cursor-pointer ${
                        savedIds[item.id]
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-300'
                      }`}
                      title={savedIds[item.id] ? 'Bỏ lưu tác phẩm' : 'Lưu vào bộ sưu tập'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${savedIds[item.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectItem(item)}
                      className="px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-cyan-500 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                      title="Xem chi tiết mã nguồn / cấu trúc"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleLike(item.id)}
                      className={`px-2 py-1.5 rounded border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        item.likedByMe
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.likedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="font-mono">{item.likes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRemixItem(item)}
                      className="cs-deck-btn px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nhân bản</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspector Modal */}
      {inspectItem && (
        <div
          className="fixed inset-0 z-[185] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sci-frame w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1 min-w-0">
                <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 uppercase font-bold">
                  {inspectItem.authorName} · {inspectItem.category}
                </div>
                <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  <FormattedText text={inspectItem.title} />
                </h3>
              </div>
              <button type="button" onClick={() => setInspectItem(null)} className="p-1 cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <FormattedText text={inspectItem.description} />
            </div>

            {inspectItem.payloadCode?.code && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                  <span>Mã nguồn ({inspectItem.payloadCode.language.toUpperCase()})</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(inspectItem.id, inspectItem.payloadCode!.code)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-white text-[11px] cursor-pointer"
                  >
                    {copiedId === inspectItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === inspectItem.id ? 'Đã chép mã' : 'Chép mã'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-72">
                  {inspectItem.payloadCode.code}
                </pre>
              </div>
            )}

            {inspectItem.payload3dModel && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Cấu trúc lắp ghép 3D ({inspectItem.payload3dModel.parts.length} khối hình học)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                  {inspectItem.payload3dModel.parts.map((pt: { id?: string; label?: string; shape?: string }, i: number) => (
                    <div key={pt.id || i} className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {i + 1}. {pt.label || pt.shape}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">{pt.shape}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDownloadPayload(inspectItem)}
                className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = inspectItem;
                  setInspectItem(null);
                  void handleRemixItem(target);
                }}
                className="cs-deck-btn px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Nhân bản vào Xưởng</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublish && (
        <div
          className="fixed inset-0 z-[185] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPublish(false)}
        >
          <form
            onSubmit={(e) => void handlePublishSubmit(e)}
            onClick={(e) => e.stopPropagation()}
            className="sci-frame w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-5 space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Đăng Tác Phẩm Lên Thư Viện Cộng Đồng</span>
              </h3>
              <button type="button" onClick={() => setShowPublish(false)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={pubCategory}
                onChange={(e) => setPubCategory(e.target.value as ShowcaseCategory)}
                className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
              >
                <option value="3d_model">Mô hình 3D (Xưởng 3D)</option>
                <option value="2d_canvas">Bản vẽ Tự do tạo 2D</option>
                <option value="cs_algo">Thuật toán C++ / Python</option>
              </select>
              <select
                value={pubSubject}
                onChange={(e) => setPubSubject(e.target.value as GrowthSubject)}
                className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
              >
                <option value="math">Toán học</option>
                <option value="physics">Vật lí</option>
                <option value="cs">Tin học</option>
              </select>
            </div>

            {pubCategory === '3d_model' && my3DModels.length > 0 && (
              <select
                value={selectedCustomModelId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedCustomModelId(id);
                  const found = my3DModels.find((m) => m.id === id);
                  if (found) {
                    setPubTitle(found.titleVi);
                    setPubDesc(found.descVi);
                  }
                }}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              >
                <option value="">-- Chọn mô hình 3D đã tạo trong Xưởng của bạn (nếu có) --</option>
                {my3DModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.titleVi} ({m.parts.length} bộ phận)
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              required
              value={pubTitle}
              onChange={(e) => setPubTitle(e.target.value)}
              placeholder="Tên tác phẩm..."
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={3}
              value={pubDesc}
              onChange={(e) => setPubDesc(e.target.value)}
              placeholder="Mô tả ý tưởng, công thức hoặc cách sử dụng..."
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
            />
            {pubCategory === 'cs_algo' && (
              <textarea
                rows={4}
                value={pubCode}
                onChange={(e) => setPubCode(e.target.value)}
                placeholder="Dán mã nguồn C++ hoặc Python tại đây..."
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
              />
            )}

            <button
              type="submit"
              className="cs-deck-btn w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
            >
              Xuất bản tác phẩm (+35 XP)
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
