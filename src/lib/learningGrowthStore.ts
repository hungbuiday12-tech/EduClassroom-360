import {
  DailyQuestItem,
  ErrorNotebookEntry,
  FlashcardSM2Item,
  GrowthSubject,
  LearningStreakState,
  StemBadge
} from '../types';

export const GROWTH_UPDATED_EVENT = 'synapse:growth-updated';

const ERROR_NOTEBOOK_KEY = 'synapse_error_notebook_v1';
const FLASHCARDS_KEY = 'synapse_sm2_flashcards_v1';
const STREAK_QUESTS_KEY = 'synapse_streak_quests_v1';

function scopeKey(baseKey: string, uid?: string | null): string {
  const scope = uid && uid.trim() ? uid.trim() : 'guest';
  return `${baseKey}::${scope}`;
}

export function getTodayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayKey(date: Date = new Date()): string {
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() - 1);
  return getTodayKey(copy);
}

function emitGrowthUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GROWTH_UPDATED_EVENT));
  }
}

// ============================================================================
// #1A ERROR NOTEBOOK
// ============================================================================

export function getErrorNotebook(uid?: string | null): ErrorNotebookEntry[] {
  try {
    const raw = localStorage.getItem(scopeKey(ERROR_NOTEBOOK_KEY, uid));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    if (uid) {
      const guestRaw = localStorage.getItem(scopeKey(ERROR_NOTEBOOK_KEY, null));
      if (guestRaw) {
        const parsed = JSON.parse(guestRaw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {}
  return [];
}

function saveErrorNotebook(entries: ErrorNotebookEntry[], uid?: string | null) {
  try {
    localStorage.setItem(scopeKey(ERROR_NOTEBOOK_KEY, uid), JSON.stringify(entries.slice(0, 120)));
    emitGrowthUpdate();
  } catch {}
}

export function recordMistake(
  input: {
    subject: GrowthSubject;
    sourceType: ErrorNotebookEntry['sourceType'];
    lessonKey?: string;
    lessonTitle: string;
    stepTitle?: string;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  },
  uid?: string | null
): ErrorNotebookEntry {
  const existing = getErrorNotebook(uid);
  const now = new Date().toISOString();
  const fingerprint = `${input.subject}|${input.lessonTitle}|${input.prompt.slice(0, 90)}`.toLowerCase();

  const matchIdx = existing.findIndex(
    (e) => `${e.subject}|${e.lessonTitle}|${e.prompt.slice(0, 90)}`.toLowerCase() === fingerprint
  );

  let entry: ErrorNotebookEntry;
  if (matchIdx >= 0) {
    entry = {
      ...existing[matchIdx],
      userAnswer: input.userAnswer,
      correctAnswer: input.correctAnswer,
      explanation: input.explanation || existing[matchIdx].explanation,
      resolved: false,
      reviewCount: existing[matchIdx].reviewCount + 1,
      updatedAt: now
    };
    const next = [entry, ...existing.filter((_, i) => i !== matchIdx)];
    saveErrorNotebook(next, uid);
  } else {
    entry = {
      id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      subject: input.subject,
      sourceType: input.sourceType,
      lessonKey: input.lessonKey,
      lessonTitle: input.lessonTitle,
      stepTitle: input.stepTitle,
      prompt: input.prompt.slice(0, 600),
      userAnswer: input.userAnswer.slice(0, 400),
      correctAnswer: input.correctAnswer.slice(0, 400),
      explanation: input.explanation.slice(0, 900),
      resolved: false,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now
    };
    saveErrorNotebook([entry, ...existing], uid);
  }

  // Auto-generate or refresh an SM-2 Flashcard for this mistake so the student drills it
  ensureFlashcardFromError(entry, uid);
  return entry;
}

export function toggleErrorResolved(id: string, resolved: boolean, uid?: string | null): void {
  const list = getErrorNotebook(uid);
  const next = list.map((item) =>
    item.id === id
      ? {
          ...item,
          resolved,
          reviewCount: item.reviewCount + 1,
          updatedAt: new Date().toISOString()
        }
      : item
  );
  saveErrorNotebook(next, uid);
  if (resolved) {
    recordGrowthStat('errorsResolved', 1, uid);
    progressDailyQuest('review_errors_or_cards', 1, uid);
  }
}

export function deleteErrorEntry(id: string, uid?: string | null): void {
  const next = getErrorNotebook(uid).filter((e) => e.id !== id);
  saveErrorNotebook(next, uid);
}

// ============================================================================
// #1B SM-2 SPACED REPETITION FLASHCARDS
// ============================================================================

const SEEDED_STARTER_FLASHCARDS: Omit<FlashcardSM2Item, 'easeFactor' | 'intervalDays' | 'repetitions' | 'dueAt' | 'createdAt'>[] = [
  {
    id: 'seed_math_1',
    subject: 'math',
    topic: 'Giải tích 12 · Cực trị & Đạo hàm',
    front: 'Điều kiện đủ để hàm số $y = f(x)$ có cực trị tại $x_0$ là gì?',
    back: '$f\'(x)$ đổi dấu khi đi qua $x_0$ (hoặc $f\'(x_0)=0$ và $f\'\'(x_0) \\neq 0$: $f\'\'(x_0)<0$ là cực đại, $f\'\'(x_0)>0$ là cực tiểu).',
    tip: 'Đừng quên kiểm tra $x_0$ có thuộc tập xác định hay không!'
  },
  {
    id: 'seed_math_2',
    subject: 'math',
    topic: 'Hình học Oxyz 12',
    front: 'Khoảng cách từ điểm $M(x_0; y_0; z_0)$ đến mặt phẳng $(P): Ax + By + Cz + D = 0$?',
    back: '$$d(M, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$',
    tip: 'Nhớ lấy trị tuyệt đối ở tử số và tổng bình phương 3 hệ số $(A,B,C)$ ở mẫu.'
  },
  {
    id: 'seed_phys_1',
    subject: 'physics',
    topic: 'Dao động điều hòa',
    front: 'Hệ thức độc lập theo thời gian giữa li độ $x$, vận tốc $v$ và tần số góc $\\omega$?',
    back: '$$A^2 = x^2 + \\frac{v^2}{\\omega^2} \\quad \\text{và} \\quad \\frac{v^2}{v_{\\max}^2} + \\frac{a^2}{a_{\\max}^2} = 1$$',
    tip: 'Vì $v$ vuông pha với $x$, và $a$ vuông pha với $v$.'
  },
  {
    id: 'seed_phys_2',
    subject: 'physics',
    topic: 'Điện xoay chiều RLC',
    front: 'Điều kiện cộng hưởng điện trong mạch R-L-C mắc nối tiếp và hệ quả nổi bật?',
    back: '$Z_L = Z_C \\iff \\omega = \\frac{1}{\\sqrt{LC}}$. Khi đó $Z_{\\min} = R$, $I_{\\max} = \\frac{U}{R}$, $\\cos\\varphi = 1$, $u$ cùng pha $i$.',
    tip: 'Công suất tiêu thụ đạt cực đại $P_{\\max} = \\frac{U^2}{R}$.'
  },
  {
    id: 'seed_cs_1',
    subject: 'cs',
    topic: 'Thuật toán · Tìm kiếm nhị phân',
    front: 'Khi tìm kiếm nhị phân trên đáp án (Binary Search on Answer), hàm kiểm tra `check(mid)` phải thỏa tính chất gì?',
    back: 'Tính chất đơn điệu (Monotonicity): nếu `mid` thỏa thì mọi giá trị lớn hơn (hoặc nhỏ hơn) đều thỏa, chia miền tìm kiếm thành đúng 2 vùng `False...False | True...True`.',
    tip: 'Luôn kiểm tra giới hạn `lo`, `hi` và tránh tràn số khi tính `mid = lo + (hi - lo) / 2`.'
  },
  {
    id: 'seed_cs_2',
    subject: 'cs',
    topic: 'Đồ thị · Dijkstra',
    front: 'Thuật toán Dijkstra tìm đường đi ngắn nhất chạy đúng khi nào và độ phức tạp chuẩn với Priority Queue?',
    back: 'Chạy đúng khi mọi trọng số cạnh đều **không âm** ($w \\ge 0$). Độ phức tạp: $O((V + E) \\log V)$.',
    tip: 'Nếu có cạnh âm không chu trình âm, hãy dùng Bellman-Ford hoặc SPFA.'
  }
];

function buildInitialFlashcards(): FlashcardSM2Item[] {
  const now = new Date().toISOString();
  return SEEDED_STARTER_FLASHCARDS.map((card) => ({
    ...card,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now,
    createdAt: now
  }));
}

export function getFlashcards(uid?: string | null): FlashcardSM2Item[] {
  try {
    const raw = localStorage.getItem(scopeKey(FLASHCARDS_KEY, uid));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const seeded = buildInitialFlashcards();
  saveFlashcards(seeded, uid);
  return seeded;
}

function saveFlashcards(cards: FlashcardSM2Item[], uid?: string | null) {
  try {
    localStorage.setItem(scopeKey(FLASHCARDS_KEY, uid), JSON.stringify(cards.slice(0, 180)));
    emitGrowthUpdate();
  } catch {}
}

export function ensureFlashcardFromError(entry: ErrorNotebookEntry, uid?: string | null): void {
  const cards = getFlashcards(uid);
  const exists = cards.some((c) => c.sourceErrorId === entry.id);
  if (exists) return;

  const now = new Date().toISOString();
  const card: FlashcardSM2Item = {
    id: `fc_err_${entry.id}`,
    subject: entry.subject,
    topic: entry.stepTitle ? `${entry.lessonTitle} · ${entry.stepTitle}` : entry.lessonTitle,
    front: entry.prompt,
    back: `Đáp án đúng: ${entry.correctAnswer}\n\nGiải thích: ${entry.explanation}`,
    tip: entry.userAnswer ? `Lỗi trước đó em chọn/làm: ${entry.userAnswer}` : undefined,
    sourceErrorId: entry.id,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now,
    createdAt: now
  };
  saveFlashcards([card, ...cards], uid);
}

export function addCustomFlashcard(
  input: { subject: GrowthSubject; topic: string; front: string; back: string; tip?: string },
  uid?: string | null
): FlashcardSM2Item {
  const cards = getFlashcards(uid);
  const now = new Date().toISOString();
  const card: FlashcardSM2Item = {
    id: `fc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    subject: input.subject,
    topic: input.topic.trim() || 'Ghi nhớ trọng tâm',
    front: input.front.trim(),
    back: input.back.trim(),
    tip: input.tip?.trim(),
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now,
    createdAt: now
  };
  saveFlashcards([card, ...cards], uid);
  return card;
}

/**
 * Standard SM-2 algorithm quality mapping:
 * 1 = Again (Quên, ôn lại ngày mai / ngay lập tức)
 * 3 = Hard (Khó)
 * 4 = Good (Nhớ tốt)
 * 5 = Easy (Rất dễ)
 */
export function reviewFlashcardSM2(
  cardId: string,
  quality: 1 | 3 | 4 | 5,
  uid?: string | null
): FlashcardSM2Item | null {
  const cards = getFlashcards(uid);
  let updated: FlashcardSM2Item | null = null;
  const now = new Date();

  const next = cards.map((card) => {
    if (card.id !== cardId) return card;

    let reps = card.repetitions;
    let interval = card.intervalDays;
    let ef = card.easeFactor;

    if (quality < 3) {
      reps = 0;
      interval = 1;
    } else {
      if (reps === 0) interval = 1;
      else if (reps === 1) interval = 3;
      else interval = Math.max(1, Math.round(interval * ef));
      if (quality === 3) interval = Math.max(1, Math.round(interval * 0.7));
      if (quality === 5) interval = Math.max(2, Math.round(interval * 1.3));
      reps += 1;
    }

    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    ef = Math.max(1.3, Math.round(ef * 100) / 100);

    const nextDue = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    updated = {
      ...card,
      repetitions: reps,
      intervalDays: interval,
      easeFactor: ef,
      lastReviewedAt: now.toISOString(),
      dueAt: nextDue.toISOString()
    };
    return updated;
  });

  if (updated) {
    saveFlashcards(next, uid);
    recordGrowthStat('flashcardsReviewed', 1, uid);
    progressDailyQuest('review_errors_or_cards', 1, uid);
  }
  return updated;
}

export function previewSM2IntervalLabel(card: FlashcardSM2Item, quality: 1 | 3 | 4 | 5): number {
  if (quality < 3) return 1;
  let interval = card.intervalDays;
  if (card.repetitions === 0) interval = 1;
  else if (card.repetitions === 1) interval = 3;
  else interval = Math.max(1, Math.round(interval * card.easeFactor));
  if (quality === 3) interval = Math.max(1, Math.round(interval * 0.7));
  if (quality === 5) interval = Math.max(2, Math.round(interval * 1.3));
  return interval;
}

// ============================================================================
// #9 DAILY QUESTS, LEARNING STREAK & STEM SKILL BADGES
// ============================================================================

function buildDailyQuests(): DailyQuestItem[] {
  return [
    {
      id: 'focus_pomodoro',
      titleVi: 'Hoàn thành 1 phiên tập trung Pomodoro',
      titleEn: 'Complete 1 Pomodoro focus session',
      descriptionVi: 'Bật đồng hồ Góc tập trung ở góc dưới trái hoặc Trang chủ và học trọn 1 phiên.',
      descriptionEn: 'Finish 1 focus timer session.',
      target: 1,
      progress: 0,
      xpReward: 40,
      claimed: false
    },
    {
      id: 'practice_quiz_or_code',
      titleVi: 'Chinh phục 3 câu hỏi / bài code thực hành',
      titleEn: 'Solve 3 practice questions or code tasks',
      descriptionVi: 'Trả lời đúng trắc nghiệm bài giảng, đề thi cá nhân hóa hoặc pass test Code Judge.',
      descriptionEn: 'Answer lesson MCQs, mock tests, or pass Code Judge.',
      target: 3,
      progress: 0,
      xpReward: 50,
      claimed: false
    },
    {
      id: 'review_errors_or_cards',
      titleVi: 'Ôn tập 3 thẻ SM-2 hoặc gỡ 1 lỗi sai',
      titleEn: 'Review 3 SM-2 flashcards or fix errors',
      descriptionVi: 'Mở Sổ tay Lỗi sai & Thẻ SM-2 để củng cố phần kiến thức từng vấp.',
      descriptionEn: 'Review spaced-repetition cards or resolve logged mistakes.',
      target: 3,
      progress: 0,
      xpReward: 45,
      claimed: false
    }
  ];
}

export function getStreakState(uid?: string | null): LearningStreakState {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(scopeKey(STREAK_QUESTS_KEY, uid));
    if (raw) {
      const parsed = JSON.parse(raw) as LearningStreakState;
      if (parsed && typeof parsed === 'object') {
        const questsResetNeeded = parsed.dailyQuestsDate !== today;
        const normalized: LearningStreakState = {
          currentStreak: parsed.currentStreak || 0,
          longestStreak: parsed.longestStreak || 0,
          lastActiveDate: parsed.lastActiveDate || '',
          activeDates: Array.isArray(parsed.activeDates) ? parsed.activeDates : [],
          dailyQuestsDate: today,
          dailyQuests: questsResetNeeded
            ? buildDailyQuests()
            : Array.isArray(parsed.dailyQuests) && parsed.dailyQuests.length > 0
            ? parsed.dailyQuests
            : buildDailyQuests(),
          stats: {
            pomodoroCompleted: parsed.stats?.pomodoroCompleted || 0,
            mcqCorrectCount: parsed.stats?.mcqCorrectCount || 0,
            codeAcceptedCount: parsed.stats?.codeAcceptedCount || 0,
            flashcardsReviewed: parsed.stats?.flashcardsReviewed || 0,
            errorsResolved: parsed.stats?.errorsResolved || 0,
            mockTestsCompleted: parsed.stats?.mockTestsCompleted || 0,
            customLessonsCreated: parsed.stats?.customLessonsCreated || 0,
            showcasePublished: parsed.stats?.showcasePublished || 0
          }
        };
        if (questsResetNeeded) {
          saveStreakState(normalized, uid);
        }
        return normalized;
      }
    }
  } catch {}

  const fresh: LearningStreakState = {
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: today,
    activeDates: [today],
    dailyQuestsDate: today,
    dailyQuests: buildDailyQuests(),
    stats: {
      pomodoroCompleted: 0,
      mcqCorrectCount: 0,
      codeAcceptedCount: 0,
      flashcardsReviewed: 0,
      errorsResolved: 0,
      mockTestsCompleted: 0,
      customLessonsCreated: 0,
      showcasePublished: 0
    }
  };
  saveStreakState(fresh, uid);
  return fresh;
}

function saveStreakState(state: LearningStreakState, uid?: string | null) {
  try {
    localStorage.setItem(scopeKey(STREAK_QUESTS_KEY, uid), JSON.stringify(state));
    emitGrowthUpdate();
  } catch {}
}

export function touchDailyActivity(uid?: string | null): LearningStreakState {
  const state = getStreakState(uid);
  const today = getTodayKey();
  if (state.lastActiveDate === today && state.activeDates.includes(today)) {
    return state;
  }

  const yesterday = getYesterdayKey();
  const nextStreak =
    state.lastActiveDate === yesterday
      ? state.currentStreak + 1
      : state.lastActiveDate === today
      ? Math.max(1, state.currentStreak)
      : 1;

  const activeDates = state.activeDates.includes(today)
    ? state.activeDates
    : [...state.activeDates.slice(-59), today];

  const next: LearningStreakState = {
    ...state,
    currentStreak: nextStreak,
    longestStreak: Math.max(state.longestStreak, nextStreak),
    lastActiveDate: today,
    activeDates
  };
  saveStreakState(next, uid);
  return next;
}

export function recordGrowthStat(
  statKey: keyof LearningStreakState['stats'],
  delta: number = 1,
  uid?: string | null
): void {
  const state = touchDailyActivity(uid);
  const next: LearningStreakState = {
    ...state,
    stats: {
      ...state.stats,
      [statKey]: Math.max(0, (state.stats[statKey] || 0) + delta)
    }
  };
  saveStreakState(next, uid);
}

export function progressDailyQuest(
  questId: DailyQuestItem['id'],
  delta: number = 1,
  uid?: string | null
): void {
  const state = touchDailyActivity(uid);
  const nextQuests = state.dailyQuests.map((q) =>
    q.id === questId ? { ...q, progress: Math.min(q.target, q.progress + delta) } : q
  );
  saveStreakState({ ...state, dailyQuests: nextQuests }, uid);
}

export function claimDailyQuestReward(
  questId: DailyQuestItem['id'],
  uid?: string | null
): number {
  const state = getStreakState(uid);
  let reward = 0;
  const nextQuests = state.dailyQuests.map((q) => {
    if (q.id === questId && q.progress >= q.target && !q.claimed) {
      reward = q.xpReward;
      return { ...q, claimed: true };
    }
    return q;
  });
  if (reward > 0) {
    saveStreakState({ ...state, dailyQuests: nextQuests }, uid);
  }
  return reward;
}

export function computeStemBadges(uid?: string | null): StemBadge[] {
  const state = getStreakState(uid);
  const s = state.stats;
  return [
    {
      id: 'badge_streak_3',
      titleVi: 'Ngọn Lửa Bền Bỉ',
      titleEn: 'Consistent Flame',
      descriptionVi: 'Duy trì chuỗi học liên tục từ 3 ngày trở lên.',
      descriptionEn: 'Maintain a 3+ day learning streak.',
      tier: 'bronze',
      unlocked: state.longestStreak >= 3,
      progressText: `${Math.min(state.longestStreak, 3)}/3 ngày`
    },
    {
      id: 'badge_error_hunter',
      titleVi: 'Thợ Săn Lỗi Sai',
      titleEn: 'Error Hunter',
      descriptionVi: 'Ôn tập >= 5 thẻ SM-2 hoặc đánh dấu sửa xong >= 3 lỗi sai.',
      descriptionEn: 'Review >= 5 flashcards or resolve >= 3 mistakes.',
      tier: 'silver',
      unlocked: s.flashcardsReviewed >= 5 || s.errorsResolved >= 3,
      progressText: `${Math.min(s.flashcardsReviewed, 5)}/5 thẻ · ${Math.min(s.errorsResolved, 3)}/3 lỗi`
    },
    {
      id: 'badge_pomodoro_master',
      titleVi: 'Tâm Trí Tập Trung',
      titleEn: 'Deep Focus Master',
      descriptionVi: 'Hoàn thành >= 3 phiên đồng hồ Pomodoro.',
      descriptionEn: 'Complete >= 3 Pomodoro focus sessions.',
      tier: 'silver',
      unlocked: s.pomodoroCompleted >= 3,
      progressText: `${Math.min(s.pomodoroCompleted, 3)}/3 phiên`
    },
    {
      id: 'badge_code_warrior',
      titleVi: 'Chiến Binh Thuật Toán',
      titleEn: 'Algorithm Warrior',
      descriptionVi: 'Đạt Accepted trên Sublime Online Judge từ 2 bài trở lên.',
      descriptionEn: 'Earn Accepted on >= 2 Online Judge problems.',
      tier: 'gold',
      unlocked: s.codeAcceptedCount >= 2,
      progressText: `${Math.min(s.codeAcceptedCount, 2)}/2 bài AC`
    },
    {
      id: 'badge_mock_strategist',
      titleVi: 'Chiến Lược Phòng Thi',
      titleEn: 'Exam Strategist',
      descriptionVi: 'Hoàn thành ít nhất 1 đề kiểm tra cá nhân hóa theo điểm yếu.',
      descriptionEn: 'Complete at least 1 weak-spot Custom Mock Test.',
      tier: 'gold',
      unlocked: s.mockTestsCompleted >= 1,
      progressText: `${Math.min(s.mockTestsCompleted, 1)}/1 đề thi`
    },
    {
      id: 'badge_creator_3d',
      titleVi: 'Kiến Trúc Sư Sáng Tạo',
      titleEn: 'STEM Creator',
      descriptionVi: 'Tạo bài giảng từ PDF/ảnh hoặc chia sẻ tác phẩm lên Thư viện Cộng đồng.',
      descriptionEn: 'Create a PDF/Image lesson or publish to Community Showcase.',
      tier: 'diamond',
      unlocked: s.customLessonsCreated >= 1 || s.showcasePublished >= 1,
      progressText: `${s.customLessonsCreated + s.showcasePublished}/1 tác phẩm`
    }
  ];
}
