import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  FileUp,
  Flame,
  Layers,
  Loader2,
  PenTool,
  Plus,
  RefreshCw,
  RotateCw,
  ShieldAlert,
  Sparkles,
  Trash2,
  Trophy,
  Zap
} from 'lucide-react';
import {
  CustomGeneratedLesson,
  ErrorNotebookEntry,
  FlashcardSM2Item,
  GrowthSubject,
  SubjectType
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  addCustomFlashcard,
  claimDailyQuestReward,
  computeStemBadges,
  deleteErrorEntry,
  getErrorNotebook,
  getFlashcards,
  getStreakState,
  GROWTH_UPDATED_EVENT,
  previewSM2IntervalLabel,
  recordGrowthStat,
  reviewFlashcardSM2,
  toggleErrorResolved
} from '../../lib/learningGrowthStore';
import {
  CUSTOM_LESSONS_UPDATED_EVENT,
  deleteCustomLesson,
  loadCustomLessons,
  saveCustomLesson
} from '../../lib/customLessonsStore';
import { compressImageFileForAI, readAttachmentFileText } from '../spatial3d/customModelStore';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { InteractiveScratchpad } from '../common/InteractiveScratchpad';

interface GrowthWorkspaceProps {
  onBack: () => void;
  onNavigateSubject: (subj: SubjectType) => void;
  onEarnXP: (xp: number) => void;
  onOpenPortfolio: () => void;
}

type GrowthTab = 'errors' | 'flashcards' | 'pdf_studio' | 'quests_badges';

export const GrowthWorkspace: React.FC<GrowthWorkspaceProps> = ({
  onBack,
  onNavigateSubject,
  onEarnXP,
  onOpenPortfolio
}) => {
  const { user, firebaseUser } = useAuth();
  const uid = user?.uid || firebaseUser?.uid;

  const [activeTab, setActiveTab] = useState<GrowthTab>('errors');
  const [refreshTick, setRefreshTick] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState<'all' | GrowthSubject>('all');
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Flashcard state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardSubject, setNewCardSubject] = useState<GrowthSubject>('math');
  const [newCardTopic, setNewCardTopic] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');

  // PDF/Image-to-5-Step Studio state
  const [pdfSubject, setPdfSubject] = useState<GrowthSubject>('math');
  const [pdfGrade, setPdfGrade] = useState('Lớp 12');
  const [pdfTitleHint, setPdfTitleHint] = useState('');
  const [pdfExtractedText, setPdfExtractedText] = useState('');
  const [pdfImageBase64, setPdfImageBase64] = useState('');
  const [pdfImageMime, setPdfImageMime] = useState('image/jpeg');
  const [pdfFileName, setPdfFileName] = useState('');
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<CustomGeneratedLesson | null>(null);

  useEffect(() => {
    const onUpdate = () => setRefreshTick((t) => t + 1);
    window.addEventListener(GROWTH_UPDATED_EVENT, onUpdate);
    window.addEventListener(CUSTOM_LESSONS_UPDATED_EVENT, onUpdate);
    return () => {
      window.removeEventListener(GROWTH_UPDATED_EVENT, onUpdate);
      window.removeEventListener(CUSTOM_LESSONS_UPDATED_EVENT, onUpdate);
    };
  }, []);

  const errors = useMemo(() => getErrorNotebook(uid), [uid, refreshTick]);
  const flashcards = useMemo(() => getFlashcards(uid), [uid, refreshTick]);
  const streak = useMemo(() => getStreakState(uid), [uid, refreshTick]);
  const badges = useMemo(() => computeStemBadges(uid), [uid, refreshTick]);
  const customLessons = useMemo(() => loadCustomLessons(uid), [uid, refreshTick]);

  const filteredErrors = useMemo(() => {
    return errors.filter((e) => subjectFilter === 'all' || e.subject === subjectFilter);
  }, [errors, subjectFilter]);

  const dueFlashcards = useMemo(() => {
    const now = Date.now();
    const list = flashcards.filter((c) => subjectFilter === 'all' || c.subject === subjectFilter);
    const due = list.filter((c) => new Date(c.dueAt).getTime() <= now);
    return due.length > 0 ? due : list;
  }, [flashcards, subjectFilter]);

  const activeCard: FlashcardSM2Item | undefined =
    dueFlashcards[cardIdx % Math.max(1, dueFlashcards.length)];

  const unresolvedCount = errors.filter((e) => !e.resolved).length;
  const dueCount = flashcards.filter((c) => new Date(c.dueAt).getTime() <= Date.now()).length;

  const handleReviewCard = (quality: 1 | 3 | 4 | 5) => {
    if (!activeCard) return;
    reviewFlashcardSM2(activeCard.id, quality, uid);
    onEarnXP(quality >= 4 ? 15 : 8);
    setIsFlipped(false);
    setCardIdx((i) => (i + 1) % Math.max(1, dueFlashcards.length));
  };

  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    addCustomFlashcard(
      {
        subject: newCardSubject,
        topic: newCardTopic,
        front: newCardFront,
        back: newCardBack
      },
      uid
    );
    setNewCardTopic('');
    setNewCardFront('');
    setNewCardBack('');
    setShowAddCard(false);
  };

  const handlePickPdfOrImage = async (file: File | undefined) => {
    if (!file) return;
    setPdfError(null);
    setPdfFileName(file.name);
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await compressImageFileForAI(file);
        setPdfImageBase64(compressed.base64);
        setPdfImageMime(compressed.mimeType);
      } catch (err: any) {
        setPdfError(err?.message || 'Không đọc được file ảnh.');
      }
    } else {
      try {
        const txt = await readAttachmentFileText(file);
        setPdfExtractedText((prev) => (prev ? `${prev}\n\n${txt}` : txt));
        setPdfImageBase64('');
      } catch {
        setPdfError('Không trích xuất được nội dung tệp. Em có thể dán trực tiếp văn bản vào khung dưới.');
      }
    }
  };

  const handleGenerate5StepLesson = async () => {
    if (!pdfExtractedText.trim() && !pdfImageBase64) {
      setPdfError('Vui lòng tải ảnh/file PDF hoặc dán nội dung bài học vào khung trước khi tạo.');
      return;
    }
    setIsGeneratingLesson(true);
    setPdfError(null);

    const res = await safeFetchJson<{ success: boolean; lesson: CustomGeneratedLesson }>(
      '/api/gemini/pdf-to-lesson',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleHint: pdfTitleHint,
          subject: pdfSubject,
          grade: pdfGrade,
          extractedText: pdfExtractedText,
          imageBase64: pdfImageBase64,
          mimeType: pdfImageMime,
          language: 'vi'
        })
      },
      65000
    );

    setIsGeneratingLesson(false);
    if (!res.ok || !res.data?.lesson) {
      setPdfError(res.error || 'AI chưa tạo được bài giảng 5 bước lúc này. Vui lòng thử lại.');
      return;
    }

    saveCustomLesson(res.data.lesson, uid);
    recordGrowthStat('customLessonsCreated', 1, uid);
    onEarnXP(40);
    setPlayingLesson(res.data.lesson);
  };

  if (playingLesson) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-3">
          <button
            type="button"
            onClick={() => setPlayingLesson(null)}
            className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Studio Bài giảng PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setShowScratchpad(true)}
            className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Mở Bảng Nháp Vẽ Tay</span>
          </button>
        </div>

        <InteractiveLectureRoom
          lessonKey={playingLesson.id}
          subject={playingLesson.subject}
          grade={playingLesson.grade}
          subjectAccent={
            playingLesson.subject === 'physics'
              ? 'amber'
              : playingLesson.subject === 'cs'
              ? 'emerald'
              : 'blue'
          }
          kicker={`Bài giảng AI từ PDF/Ảnh · ${playingLesson.grade}`}
          title={playingLesson.title}
          subtitle={playingLesson.description}
          steps={playingLesson.steps}
          keyFormulas={playingLesson.keyFormulas}
          onEarnXP={onEarnXP}
        />

        <InteractiveScratchpad
          isOpen={showScratchpad}
          onClose={() => setShowScratchpad(false)}
          defaultSubject={playingLesson.subject}
          contextTitle={playingLesson.title}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="sci-frame syn-top-laser bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Trung Tâm Ôn Luyện Thông Minh & Sổ Tay Lỗi Sai
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Ghi nhận lỗi sai tự động · Thẻ ghi nhớ SM-2 · Biến PDF/Ảnh thành Bài giảng 5 Bước · Nhiệm vụ & Chuỗi ngày học
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowScratchpad(true)}
              className="cs-deck-btn px-3 py-2 rounded border border-sky-400/60 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Bảng Nháp & Công Thức</span>
            </button>
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="cs-deck-btn px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Hồ sơ Năng lực & PDF</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded border border-amber-300/70 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 flex items-center gap-3">
            <Flame className="w-6 h-6 text-amber-500 streak-flame-pulse shrink-0" />
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Chuỗi ngày học</div>
              <div className="text-lg font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
                {streak.currentStreak} ngày
              </div>
            </div>
          </div>
          <div className="p-3 rounded border border-rose-300/70 dark:border-rose-700/60 bg-rose-50/70 dark:bg-rose-950/30 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Lỗi chờ khắc phục</div>
              <div className="text-lg font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
                {unresolvedCount} lỗi
              </div>
            </div>
          </div>
          <div className="p-3 rounded border border-sky-300/70 dark:border-sky-700/60 bg-sky-50/70 dark:bg-sky-950/30 flex items-center gap-3">
            <Layers className="w-6 h-6 text-sky-500 shrink-0" />
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Thẻ SM-2 đến hạn</div>
              <div className="text-lg font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
                {dueCount} / {flashcards.length} thẻ
              </div>
            </div>
          </div>
          <div className="p-3 rounded border border-emerald-300/70 dark:border-emerald-700/60 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Huy hiệu STEM</div>
              <div className="text-lg font-display font-extrabold text-slate-900 dark:text-white tabular-nums">
                {badges.filter((b) => b.unlocked).length} / {badges.length}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded border border-slate-200 dark:border-slate-800">
          {[
            { id: 'errors' as GrowthTab, label: `Sổ tay Lỗi sai (${errors.length})`, icon: <ShieldAlert className="w-4 h-4" /> },
            { id: 'flashcards' as GrowthTab, label: `Thẻ SM-2 (${dueCount})`, icon: <RotateCw className="w-4 h-4" /> },
            { id: 'pdf_studio' as GrowthTab, label: `PDF/Ảnh → 5 Bước (${customLessons.length})`, icon: <FileUp className="w-4 h-4" /> },
            { id: 'quests_badges' as GrowthTab, label: 'Nhiệm vụ & Huy hiệu', icon: <Trophy className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cs-deck-btn px-3 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white/70 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter for Errors & Flashcards */}
      {(activeTab === 'errors' || activeTab === 'flashcards') && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all' as const, label: 'Tất cả 3 môn' },
              { id: 'math' as const, label: 'Toán học' },
              { id: 'physics' as const, label: 'Vật lí' },
              { id: 'cs' as const, label: 'Tin học' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setSubjectFilter(f.id);
                  setCardIdx(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold border cursor-pointer ${
                  subjectFilter === f.id
                    ? 'bg-slate-900 dark:bg-sky-600 text-white border-slate-900 dark:border-sky-500'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {activeTab === 'flashcards' && (
            <button
              type="button"
              onClick={() => setShowAddCard((s) => !s)}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo thẻ ghi nhớ mới</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 1: SMART ERROR NOTEBOOK */}
      {activeTab === 'errors' && (
        <div className="space-y-3">
          {filteredErrors.length === 0 ? (
            <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Chưa có lỗi sai nào được ghi lại
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Mỗi khi em làm sai câu trắc nghiệm, tự luận điểm dưới 6.5 hoặc submit Code Judge chưa đạt 100%, hệ thống sẽ tự động lưu lại vào đây kèm thẻ ôn SM-2 để em không vấp lại.
              </p>
              <button
                type="button"
                onClick={() => onNavigateSubject('exams')}
                className="px-4 py-2 rounded bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                Thử Đề kiểm tra theo điểm yếu ngay
              </button>
            </div>
          ) : (
            filteredErrors.map((err: ErrorNotebookEntry) => (
              <div
                key={err.id}
                className={`bg-white/95 dark:bg-slate-900/95 border rounded-md p-4 space-y-2.5 transition-all ${
                  err.resolved
                    ? 'border-emerald-300/70 dark:border-emerald-800/60 opacity-80'
                    : 'border-rose-300/80 dark:border-rose-800/70 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold uppercase">
                      {err.subject === 'math' ? 'Toán' : err.subject === 'physics' ? 'Vật lí' : 'Tin'}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{err.lessonTitle}</span>
                    {err.stepTitle && <span className="text-slate-500">· {err.stepTitle}</span>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleErrorResolved(err.id, !err.resolved, uid)}
                      className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        err.resolved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{err.resolved ? 'Đã khắc phục' : 'Đánh dấu đã hiểu'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteErrorEntry(err.id, uid)}
                      className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 cursor-pointer"
                      aria-label="Xóa lỗi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-900 dark:text-slate-100 font-medium">
                  <FormattedText text={err.prompt} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/35 border border-rose-200 dark:border-rose-800/60">
                    <span className="font-bold text-rose-700 dark:text-rose-300 block mb-0.5">
                      Lỗi / Câu trả lời của em:
                    </span>
                    <FormattedText text={err.userAnswer} />
                  </div>
                  <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800/60">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                      Đáp án / Hướng chuẩn:
                    </span>
                    <FormattedText text={err.correctAnswer} />
                  </div>
                </div>

                {err.explanation && (
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-sky-600 dark:text-sky-400">Giải thích: </strong>
                    <FormattedText text={err.explanation} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: SM-2 SPACED REPETITION 3D FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-4">
          {showAddCard && (
            <form
              onSubmit={handleCreateCustomCard}
              className="bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-md p-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newCardSubject}
                  onChange={(e) => setNewCardSubject(e.target.value as GrowthSubject)}
                  className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
                >
                  <option value="math">Toán học</option>
                  <option value="physics">Vật lí</option>
                  <option value="cs">Tin học</option>
                </select>
                <input
                  type="text"
                  value={newCardTopic}
                  onChange={(e) => setNewCardTopic(e.target.value)}
                  placeholder="Chủ đề (vd: Nguyên hàm từng phần)"
                  className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
                />
              </div>
              <textarea
                rows={2}
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                placeholder="Mặt trước (Câu hỏi hoặc tên định lý, hỗ trợ $LaTeX$)..."
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
              <textarea
                rows={2}
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                placeholder="Mặt sau (Công thức, đáp án chuẩn, mẹo nhớ)..."
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Lưu thẻ vào bộ SM-2
                </button>
              </div>
            </form>
          )}

          {activeCard ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>
                  Thẻ {(cardIdx % dueFlashcards.length) + 1} / {dueFlashcards.length} · {activeCard.topic}
                </span>
                <span>
                  Lặp: {activeCard.repetitions} · EF {activeCard.easeFactor}
                </span>
              </div>

              <div
                className="flip-card-3d cursor-pointer"
                onClick={() => setIsFlipped((f) => !f)}
              >
                <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                  {/* FRONT */}
                  <div className="flip-card-face sci-frame bg-white dark:bg-slate-900 border-2 border-sky-400/70 dark:border-sky-600/60 rounded-md p-6 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase text-sky-600 dark:text-sky-400 font-bold">
                      <span>Mặt trước · Câu hỏi ghi nhớ</span>
                      <span>Bấm để lật thẻ</span>
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed my-auto py-4">
                      <FormattedText text={activeCard.front} />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Chủ đề: {activeCard.topic}
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="flip-card-face flip-card-back sci-frame bg-slate-900 text-white border-2 border-emerald-500/70 rounded-md p-6 flex flex-col justify-between shadow-xl">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase text-emerald-400 font-bold">
                      <span>Mặt sau · Đáp án & Công thức</span>
                      <span>Chọn mức độ nhớ bên dưới</span>
                    </div>
                    <div className="text-sm sm:text-base text-slate-100 leading-relaxed my-auto py-3 overflow-y-auto max-h-48">
                      <FormattedText text={activeCard.back} />
                    </div>
                    {activeCard.tip && (
                      <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-700/50 rounded px-3 py-1.5">
                        Mẹo: <FormattedText text={activeCard.tip} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SM-2 Rating Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { q: 1 as const, label: 'Quên', cls: 'bg-rose-600 hover:bg-rose-500 text-white' },
                  { q: 3 as const, label: 'Khó', cls: 'bg-amber-500 hover:bg-amber-400 text-slate-950' },
                  { q: 4 as const, label: 'Nhớ tốt', cls: 'bg-sky-600 hover:bg-sky-500 text-white' },
                  { q: 5 as const, label: 'Rất dễ', cls: 'bg-emerald-600 hover:bg-emerald-500 text-white' }
                ].map((btn) => (
                  <button
                    key={btn.q}
                    type="button"
                    onClick={() => handleReviewCard(btn.q)}
                    className={`cs-deck-btn px-3 py-2.5 rounded text-xs font-extrabold flex flex-col items-center cursor-pointer shadow ${btn.cls}`}
                  >
                    <span>{btn.label}</span>
                    <span className="text-[10px] font-mono opacity-90">
                      Ôn sau {previewSM2IntervalLabel(activeCard, btn.q)} ngày
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 3: PDF / IMAGE -> 5-STEP LESSON STUDIO */}
      {activeTab === 'pdf_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Biến Tài Liệu PDF / Ảnh Sách Thành Bài Giảng 5 Bước Riêng
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <select
                value={pdfSubject}
                onChange={(e) => setPdfSubject(e.target.value as GrowthSubject)}
                className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
              >
                <option value="math">Toán học</option>
                <option value="physics">Vật lí</option>
                <option value="cs">Tin học</option>
              </select>
              <select
                value={pdfGrade}
                onChange={(e) => setPdfGrade(e.target.value)}
                className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
              >
                <option value="Lớp 9">Lớp 9</option>
                <option value="Lớp 10">Lớp 10</option>
                <option value="Lớp 11">Lớp 11</option>
                <option value="Lớp 12">Lớp 12</option>
                <option value="Chuyên / HSG">Chuyên / HSG</option>
              </select>
              <input
                type="text"
                value={pdfTitleHint}
                onChange={(e) => setPdfTitleHint(e.target.value)}
                placeholder="Tên chuyên đề (tùy chọn)"
                className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs"
              />
            </div>

            <label className="flex flex-col items-center justify-center gap-1.5 p-4 border-2 border-dashed border-sky-400/70 rounded bg-sky-50/60 dark:bg-sky-950/30 hover:bg-sky-100/70 cursor-pointer text-center">
              <FileUp className="w-6 h-6 text-sky-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {pdfFileName ? `Đã nạp tệp: ${pdfFileName}` : 'Chọn Ảnh trang sách (.jpg/.png) hoặc File PDF / TXT / MD'}
              </span>
              <span className="text-[11px] text-slate-500">
                AI tự trích xuất Khái niệm, Công thức, Giải thích sâu, 2 Trắc nghiệm & 1 Tự luận cho từng bước
              </span>
              <input
                type="file"
                accept="image/*,.pdf,.txt,.md"
                onChange={(e) => void handlePickPdfOrImage(e.target.files?.[0])}
                className="hidden"
              />
            </label>

            <textarea
              rows={5}
              value={pdfExtractedText}
              onChange={(e) => setPdfExtractedText(e.target.value)}
              placeholder="Hoặc dán trực tiếp nội dung lý thuyết / đề cương ôn tập từ PDF, Word vào đây..."
              className="w-full px-3 py-2.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-mono"
            />

            {pdfError && (
              <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-xs text-rose-700 dark:text-rose-300">
                {pdfError}
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleGenerate5StepLesson()}
              disabled={isGeneratingLesson}
              className="cs-deck-btn w-full py-2.5 rounded bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingLesson ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syn AI đang cấu trúc hóa thành Bài giảng 5 bước...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Bài Giảng 5 Bước Tương Tác</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-5 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-5 space-y-3">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Kho Bài Giảng Cá Nhân Của Em ({customLessons.length})</span>
            </h3>
            {customLessons.length === 0 ? (
              <p className="text-xs text-slate-500 leading-relaxed">
                Chưa có bài giảng tự tạo nào. Hãy tải ảnh trang sách hoặc dán tóm tắt kiến thức bên trái để biến thành phòng học 5 bước có AI chấm bài!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {customLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                          {lesson.subject} · {lesson.grade}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                          {lesson.title}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCustomLesson(lesson.id, uid)}
                        className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                        aria-label="Xóa bài giảng"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                      {lesson.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPlayingLesson(lesson)}
                      className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Mở phòng học 5 bước ({lesson.steps.length} bước)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DAILY QUESTS & STEM BADGES */}
      {activeTab === 'quests_badges' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Nhiệm vụ hôm nay ({streak.dailyQuestsDate})</span>
              </h3>
              <button
                type="button"
                onClick={() => setRefreshTick((t) => t + 1)}
                className="text-xs text-sky-600 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Làm mới
              </button>
            </div>
            <div className="space-y-2.5">
              {streak.dailyQuests.map((q) => {
                const done = q.progress >= q.target;
                const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{q.titleVi}</span>
                      <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                        +{q.xpReward} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{q.descriptionVi}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            done ? 'bg-emerald-500 quest-bar-shimmer' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                        {q.progress}/{q.target}
                      </span>
                      {done && !q.claimed && (
                        <button
                          type="button"
                          onClick={() => {
                            const xp = claimDailyQuestReward(q.id, uid);
                            if (xp > 0) onEarnXP(xp);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Nhận thưởng
                        </button>
                      )}
                      {q.claimed && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Đã nhận
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-5 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Bộ sưu tập Huy hiệu Kỹ năng STEM</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded border space-y-1 transition-all ${
                    b.unlocked
                      ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{b.titleVi}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        b.unlocked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {b.unlocked ? 'Mở khóa' : b.progressText}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {b.descriptionVi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <InteractiveScratchpad
        isOpen={showScratchpad}
        onClose={() => setShowScratchpad(false)}
        defaultSubject={subjectFilter === 'all' ? 'math' : subjectFilter}
        contextTitle="Bảng nháp ôn luyện từ Sổ tay Lỗi sai"
      />
    </div>
  );
};
