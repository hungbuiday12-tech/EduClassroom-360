import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  Send,
  Trash2,
  LogIn,
  MessageSquareHeart,
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { safeFetchJson } from '../../lib/apiClient';
import {
  auth,
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  orderBy,
  query,
  limit,
  OperationType,
  handleFirestoreError
} from '../../lib/firebase';
import { deleteDoc } from 'firebase/firestore';

export type ReviewCategory = 'simulations' | 'lectures_ai' | 'coding_exams' | 'interface' | 'general';

export interface PlatformReview {
  id: string;
  userId: string;
  username?: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  favoriteCategory: ReviewCategory;
  comment: string;
  helpfulUserIds: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}

const CATEGORY_OPTIONS: Array<{
  id: ReviewCategory;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'simulations', labelVi: 'Mô phỏng 2D/3D & Đồ thị', labelEn: '2D/3D Simulations' },
  { id: 'lectures_ai', labelVi: 'Bài giảng & Trợ lý AI', labelEn: 'Lectures & AI Tutors' },
  { id: 'coding_exams', labelVi: 'Code Sublime 4 & Kho Đề', labelEn: 'Coding & Exams' },
  { id: 'interface', labelVi: 'Giao diện & Nền sinh vật', labelEn: 'UI & Galaxy Creatures' },
  { id: 'general', labelVi: 'Trải nghiệm tổng thể', labelEn: 'Overall Experience' }
];

interface PlatformReviewsProps {
  id?: string;
}

export const PlatformReviews: React.FC<PlatformReviewsProps> = ({ id = 'platform-reviews' }) => {
  const { user, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [reviews, setReviews] = useState<PlatformReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [favoriteCategory, setFavoriteCategory] = useState<ReviewCategory>('simulations');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | ReviewCategory>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');

  const fetchAllReviews = async () => {
    setLoading(true);
    const mergedMap = new Map<string, PlatformReview>();

    // 1. Fetch from Express persistent store (.reviews_db.json)
    try {
      const apiRes = await safeFetchJson<{ reviews: PlatformReview[] }>('/api/reviews', {
        method: 'GET'
      });
      if (apiRes.ok && Array.isArray(apiRes.data?.reviews)) {
        for (const r of apiRes.data.reviews) {
          if (r && r.id) {
            mergedMap.set(r.id, {
              ...r,
              helpfulUserIds: Array.isArray(r.helpfulUserIds) ? r.helpfulUserIds : [],
              helpfulCount: typeof r.helpfulCount === 'number' ? r.helpfulCount : 0
            });
          }
        }
      }
    } catch {
      // ignore fallback fetch error
    }

    // 2. Fetch from Firestore public collection if available
    try {
      const q = query(
        collection(db, 'platform_reviews'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        const d = docSnap.data() as any;
        if (d && typeof d.rating === 'number' && d.comment) {
          mergedMap.set(docSnap.id, {
            id: docSnap.id,
            userId: d.userId,
            username: d.username,
            displayName: d.displayName,
            avatarUrl: d.avatarUrl,
            rating: d.rating,
            favoriteCategory: d.favoriteCategory || 'general',
            comment: d.comment,
            helpfulUserIds: Array.isArray(d.helpfulUserIds) ? d.helpfulUserIds : [],
            helpfulCount: typeof d.helpfulCount === 'number' ? d.helpfulCount : 0,
            createdAt: d.createdAt || new Date().toISOString(),
            updatedAt: d.updatedAt
          });
        }
      });
    } catch {
      // Firestore optional if offline / unconfigured
    }

    const list = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setReviews(list);
    setLoading(false);
  };

  useEffect(() => {
    void fetchAllReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFeedbackMsg(null);

    if (!user) {
      openAuthModal('login');
      return;
    }

    const cleanComment = comment.trim();
    if (cleanComment.length < 3) {
      setErrorMsg(
        isEn
          ? 'Please write at least 3 characters for your review.'
          : 'Vui lòng nhập nhận xét tối thiểu 3 ký tự.'
      );
      return;
    }

    setSubmitting(true);
    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const nowIso = new Date().toISOString();

    const newReview: PlatformReview = {
      id: reviewId,
      userId: user.uid,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl || '',
      rating,
      favoriteCategory,
      comment: cleanComment,
      helpfulUserIds: [],
      helpfulCount: 0,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    try {
      // Save to Express backend (.reviews_db.json) so it persists across all browsers/visitors
      const apiRes = await safeFetchJson<{ success: boolean; review: PlatformReview; error?: string }>(
        '/api/reviews',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview)
        }
      );

      // Mirror to Firestore if user has active Firebase Auth session
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        try {
          const firestorePayload: Record<string, any> = {
            userId: user.uid,
            username: user.username,
            displayName: user.displayName,
            rating,
            favoriteCategory,
            comment: cleanComment,
            helpfulUserIds: [],
            helpfulCount: 0,
            createdAt: nowIso,
            updatedAt: nowIso
          };
          if (user.avatarUrl) {
            firestorePayload.avatarUrl = user.avatarUrl;
          }
          await setDoc(doc(db, 'platform_reviews', reviewId), firestorePayload);
        } catch (fsErr) {
          try {
            handleFirestoreError(fsErr, OperationType.CREATE, `platform_reviews/${reviewId}`);
          } catch {
            // already logged; server API persisted cleanly
          }
        }
      }

      const saved = apiRes.ok && apiRes.data?.review ? apiRes.data.review : newReview;
      setReviews((prev) => [saved, ...prev]);
      setComment('');
      setRating(5);
      setFeedbackMsg(
        isEn
          ? 'Thank you! Your review & vote have been published for everyone to see.'
          : 'Cảm ơn bạn! Đánh giá và bình chọn đã được lưu công khai cho mọi người cùng xem.'
      );
    } catch {
      setErrorMsg(
        isEn ? 'Could not save your review. Please try again.' : 'Không thể lưu đánh giá, vui lòng thử lại.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHelpful = async (rev: PlatformReview) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    const alreadyVoted = rev.helpfulUserIds.includes(user.uid);
    const nextIds = alreadyVoted
      ? rev.helpfulUserIds.filter((uid) => uid !== user.uid)
      : [...rev.helpfulUserIds, user.uid];
    const nextCount = nextIds.length;
    const nowIso = new Date().toISOString();

    // Optimistic UI update
    setReviews((prev) =>
      prev.map((item) =>
        item.id === rev.id
          ? { ...item, helpfulUserIds: nextIds, helpfulCount: nextCount, updatedAt: nowIso }
          : item
      )
    );

    await safeFetchJson(`/api/reviews/${encodeURIComponent(rev.id)}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid })
    });

    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'platform_reviews', rev.id), {
          helpfulUserIds: nextIds,
          helpfulCount: nextCount,
          updatedAt: nowIso
        });
      } catch {
        // server persistence already updated
      }
    }
  };

  const handleDeleteReview = async (rev: PlatformReview) => {
    if (!user || user.uid !== rev.userId) return;
    setReviews((prev) => prev.filter((item) => item.id !== rev.id));

    await safeFetchJson(
      `/api/reviews/${encodeURIComponent(rev.id)}?userId=${encodeURIComponent(user.uid)}`,
      { method: 'DELETE' }
    );

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await deleteDoc(doc(db, 'platform_reviews', rev.id));
      } catch {
        // ignore if doc wasn't stored in Firestore
      }
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg =
      total > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => Math.round(r.rating) === star).length;
      return { star, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
    });
    const categoryVotes = CATEGORY_OPTIONS.map((cat) => ({
      ...cat,
      count: reviews.filter((r) => r.favoriteCategory === cat.id).length
    })).sort((a, b) => b.count - a.count);

    return { total, avg, distribution, categoryVotes };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    let list =
      filterCategory === 'all'
        ? reviews
        : reviews.filter((r) => r.favoriteCategory === filterCategory);

    if (sortBy === 'helpful') {
      list = [...list].sort(
        (a, b) =>
          b.helpfulCount - a.helpfulCount ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return list;
  }, [reviews, filterCategory, sortBy]);

  const getCategoryLabel = (catId: ReviewCategory) => {
    const found = CATEGORY_OPTIONS.find((c) => c.id === catId);
    return found ? (isEn ? found.labelEn : found.labelVi) : catId;
  };

  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.14)] dark:shadow-[0_18px_45px_-16px_rgba(0,0,0,0.6)] space-y-6"
    >
      {/* Header & Overall Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200/70 dark:border-white/10">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            <MessageSquareHeart className="w-4 h-4" />
            <span>
              {isEn
                ? 'Community Reviews & Favorite Votes'
                : 'Đánh Giá Người Dùng & Bình Chọn Yêu Thích'}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isEn
              ? 'Learner Feedback, Star Ratings & Feature Votes'
              : 'Cảm Nhận Học Viên, Đánh Giá Chất Lượng & Bình Chọn Tính Năng'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isEn
              ? 'Every signed-in member can submit a rating, vote for their favorite classroom module, and share feedback visible to the whole community.'
              : 'Thành viên đã đăng nhập có thể chấm sao chất lượng, bình chọn mục yêu thích và để lại nhận xét được lưu công khai cho mọi người cùng xem.'}
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0 bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 sm:p-5 min-w-[295px]">
          <div className="flex flex-col justify-center items-center sm:items-start">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                {stats.total > 0 ? stats.avg.toFixed(1) : '—'}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 my-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.avg)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
              {stats.total} {isEn ? 'verified reviews' : 'lượt đánh giá công khai'}
            </span>
          </div>

          <div className="space-y-1.5 justify-center flex flex-col">
            {stats.distribution.map((row) => (
              <div key={row.star} className="flex items-center gap-2 text-[11px]">
                <span className="w-6 font-mono font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                  {row.star}★
                </span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-slate-500 tabular-nums">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Composer OR Guest Sign-in Callout */}
      <div className="rounded-2xl bg-slate-50/85 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 p-5">
        {user ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full object-cover border border-indigo-400"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {user.displayName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">@{user.username}</div>
                </div>
              </div>

              {/* Interactive Star Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {isEn ? 'Quality Rating:' : 'Chất lượng:'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const active = starVal <= (hoverRating || rating);
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        className="p-1 rounded-lg hover:bg-amber-100/60 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
                        title={`${starVal} / 5`}
                      >
                        <Star
                          className={`w-6 h-6 transition-transform ${
                            active
                              ? 'text-amber-400 fill-amber-400 scale-110'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                  {hoverRating || rating}/5
                </span>
              </div>
            </div>

            {/* Favorite Aspect Vote Chips */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isEn ? 'Vote your favorite feature:' : 'Bình chọn phần bạn yêu thích nhất:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const selected = favoriteCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFavoriteCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {isEn ? cat.labelEn : cat.labelVi}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Input + Enlarged Submit Button */}
            <div className="space-y-2.5">
              <textarea
                rows={3}
                maxLength={800}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isEn
                    ? 'Share what you liked about the simulations, lectures, AI tutors, or coding judge...'
                    : 'Chia sẻ cảm nhận của bạn về bài giảng, mô phỏng 2D/3D, chấm code AI hoặc giao diện...'
                }
                className="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                  {comment.trim().length}/800 {isEn ? 'characters' : 'ký tự'}
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white text-sm font-extrabold shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting
                      ? isEn
                        ? 'Publishing...'
                        : 'Đang lưu đánh giá...'
                      : isEn
                      ? 'Submit Review & Vote'
                      : 'Gửi Đánh Giá & Bình Chọn'}
                  </span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                {errorMsg}
              </div>
            )}
            {feedbackMsg && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {isEn
                    ? 'Have an account? Sign in to rate & vote!'
                    : 'Bạn đã có tài khoản? Đăng nhập để đánh giá & bình chọn yêu thích!'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'All submitted ratings, feature votes, and reviews are permanently saved and visible to every learner.'
                  : 'Mọi đánh giá sao, lượt vote và bình luận của tài khoản sẽ được lưu lại công khai để tất cả người dùng cùng theo dõi.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="shrink-0 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span>{isEn ? 'Sign In to Review' : 'Đăng Nhập Để Đánh Giá'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Vote Tally & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{isEn ? 'Filter:' : 'Lọc:'}</span>
          </span>
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isEn ? 'All' : 'Tất cả'} ({stats.total})
          </button>
          {stats.categoryVotes.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
                filterCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isEn ? cat.labelEn : cat.labelVi} ({cat.count})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              sortBy === 'newest'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isEn ? 'Newest' : 'Mới nhất'}
          </button>
          <button
            type="button"
            onClick={() => setSortBy('helpful')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              sortBy === 'helpful'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isEn ? 'Most Helpful' : 'Nhiều vote nhất'}
          </button>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-10 text-center text-xs text-slate-500">
          {isEn ? 'Loading community reviews...' : 'Đang tải đánh giá từ cộng đồng...'}
        </div>
      ) : visibleReviews.length === 0 ? (
        <div className="py-10 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {isEn
            ? 'No reviews in this category yet. Sign in and be the first to share your thoughts!'
            : 'Chưa có đánh giá nào ở mục này. Hãy đăng nhập và trở thành người đầu tiên gửi nhận xét!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleReviews.map((rev) => {
            const hasUpvoted = user ? rev.helpfulUserIds.includes(user.uid) : false;
            const isOwner = user && user.uid === rev.userId;

            return (
              <div
                key={rev.id}
                className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/35 p-4 sm:p-5 flex flex-col justify-between gap-3.5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {rev.avatarUrl ? (
                        <img
                          src={rev.avatarUrl}
                          alt={rev.displayName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {rev.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {rev.displayName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                          {rev.username && <span className="font-mono">@{rev.username}</span>}
                          <span aria-hidden="true">·</span>
                          <span>
                            {new Date(rev.createdAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {isEn ? 'Voted Favorite:' : 'Yêu thích:'} {getCategoryLabel(rev.favoriteCategory)}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer tabular-nums ${
                      hasUpvoted
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>
                      {isEn ? 'Helpful' : 'Hữu ích'} ({rev.helpfulCount})
                    </span>
                  </button>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={isEn ? 'Delete your review' : 'Xóa đánh giá của bạn'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
