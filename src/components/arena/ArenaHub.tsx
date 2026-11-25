import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { safeFetchJson, resolveApiUrl } from '../../lib/apiClient';
import { recordMistake } from '../../lib/learningGrowthStore';
import { soundEngine } from '../../lib/soundEngine';
import {
  ArrowLeft,
  Award,
  BookmarkPlus,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  Copy,
  Crown,
  Dna,
  Download,
  Eye,
  FileText,
  Flag,
  Flame,
  FlaskConical,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Lock,
  LogIn,
  Medal,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
  XCircle,
  Zap,
  AlertCircle
} from 'lucide-react';
import {
  ArenaAttempt,
  ArenaDivisionId,
  ArenaEssayEvaluation,
  ArenaGradeGroup,
  ArenaMode,
  ArenaQuestionMCQ,
  ArenaRivalTarget,
  ArenaSprintRecord,
  ArenaSubject,
  ArenaTrack,
  CodeLanguage,
  TutorContextPayload,
  WeeklyLeaderboardEntry
} from '../../types';
import {
  ARENA_DIVISIONS,
  computeArenaAchievements,
  computeArenaEloAndTier,
  getArenaDivisionMeta,
  getArenaScopedWeekId,
  getDailyArenaSet,
  getDailyResetCountdown,
  getSprintArenaSet,
  getVietnamNowParts,
  getWeekDateRangeLabel
} from '../../data/arenaData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
import { VoiceMicButton } from '../common/VoiceMicButton';
import { compareOutputs, runCppInSandbox, runPythonInSandbox } from '../cs/codeRunner';
import {
  collection,
  db,
  doc,
  handleFirestoreError,
  onSnapshot,
  OperationType,
  query,
  setDoc,
  where
} from '../../lib/firebase';

interface ArenaHubProps {
  onBack: () => void;
  onEarnXP: (xp: number) => void;
  onOpenTutor: (ctx: TutorContextPayload) => void;
  onMatchActiveChange?: (active: boolean) => void;
}

const LOCAL_ATTEMPTS_KEY = 'educlassroom_arena_attempts_v1';
const LOCAL_SPRINTS_KEY = 'educlassroom_arena_sprints_v1';
const LOCAL_RIVALS_KEY = 'educlassroom_arena_rivals_v1';
const GUEST_ARENA_ID_KEY = 'educlassroom_arena_guest_profile_v1';
const ARENA_DIVISION_KEY = 'educlassroom_arena_division_v1';
const ARENA_SFX_KEY = 'educlassroom_arena_sfx_v1';

const SPRINT_DURATION_SEC = 90;

type RankFilterTab = 'overall' | 'math' | 'physics' | 'chemistry' | 'biology' | 'cs';
type RankSortMode = 'overallAvg' | 'bestTotal' | 'fastest' | 'attempts';
type LobbySubTab = 'arena' | 'achievements' | 'speedrun';

export const ArenaHub: React.FC<ArenaHubProps> = ({
  onBack,
  onEarnXP,
  onOpenTutor,
  onMatchActiveChange
}) => {
  const { user, firebaseUser, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [{ dateKey, weekId }, setTimeParts] = useState(() => getVietnamNowParts());
  const [resetCountdown, setResetCountdown] = useState(() => getDailyResetCountdown());

  const [selectedDivision, setSelectedDivision] = useState<ArenaDivisionId>(() => {
    try {
      const saved = localStorage.getItem(ARENA_DIVISION_KEY) as ArenaDivisionId | null;
      if (saved && ARENA_DIVISIONS.some((d) => d.id === saved)) return saved;
    } catch {}
    return '12k';
  });

  const divisionMeta = useMemo(() => getArenaDivisionMeta(selectedDivision), [selectedDivision]);
  const liveScopedWeekId = useMemo(
    () => getArenaScopedWeekId(weekId, selectedDivision),
    [weekId, selectedDivision]
  );

  // Historical week viewer
  const [selectedWeekOverride, setSelectedWeekOverride] = useState<string | null>(null);
  const activeScopedWeekId = selectedWeekOverride || liveScopedWeekId;

  useEffect(() => {
    setSelectedWeekOverride(null);
  }, [selectedDivision]);

  const handleSelectDivision = (divId: ArenaDivisionId) => {
    setSelectedDivision(divId);
    try {
      localStorage.setItem(ARENA_DIVISION_KEY, divId);
    } catch {}
  };

  const handleSelectGradeAndTrack = (grade: ArenaGradeGroup, track?: ArenaTrack) => {
    if (grade === 'olp') {
      handleSelectDivision('olp');
      return;
    }
    const nextTrack: ArenaTrack = track || divisionMeta.track;
    const suffix = nextTrack === 'chuyen' ? 'c' : 'k';
    handleSelectDivision(`${grade}${suffix}` as ArenaDivisionId);
  };

  // Guest contestant identity fallback if not logged in
  const [guestIdentity, setGuestIdentity] = useState<{ uid: string; username: string; displayName: string }>(() => {
    try {
      const saved = localStorage.getItem(GUEST_ARENA_ID_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    const created = {
      uid: 'guest_' + Math.random().toString(36).slice(2, 10),
      username: 'thisinh_' + Math.floor(100 + Math.random() * 900),
      displayName: 'Thí sinh Tự do'
    };
    try {
      localStorage.setItem(GUEST_ARENA_ID_KEY, JSON.stringify(created));
    } catch {}
    return created;
  });

  const activeContestant = useMemo(() => {
    if (user) {
      return {
        uid: user.uid,
        username: user.username,
        displayName: user.displayName
      };
    }
    return guestIdentity;
  }, [user, guestIdentity]);

  const [editingGuestName, setEditingGuestName] = useState(guestIdentity.displayName);

  // Sound FX preference
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ARENA_SFX_KEY) !== 'false';
    } catch {
      return true;
    }
  });
  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    try {
      localStorage.setItem(ARENA_SFX_KEY, String(next));
    } catch {}
  };
  const playSfx = useCallback(
    (id: 'tick' | 'correct' | 'wrong' | 'finish') => {
      if (!sfxEnabled) return;
      if (id === 'correct') soundEngine.playClick('crystal_ping', 0.45);
      else if (id === 'wrong') soundEngine.playClick('wood_tap', 0.3);
      else if (id === 'finish') soundEngine.playClick('holo_pulse', 0.55);
      else soundEngine.playClick('mech_switch', 0.25);
    },
    [sfxEnabled]
  );

  // Leaderboard & Attempts State
  const [serverLeaderboard, setServerLeaderboard] = useState<WeeklyLeaderboardEntry[]>([]);
  const [firestoreLeaderboard, setFirestoreLeaderboard] = useState<WeeklyLeaderboardEntry[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [sprintLeaderboard, setSprintLeaderboard] = useState<ArenaSprintRecord[]>([]);
  const [localSprints, setLocalSprints] = useState<ArenaSprintRecord[]>([]);
  const [divisionStats, setDivisionStats] = useState<{
    totalPlayers: number;
    totalRounds: number;
    topScore: number;
    fastestHighSec: number | null;
  }>({ totalPlayers: 0, totalRounds: 0, topScore: 0, fastestHighSec: null });

  const [userAttemptsToday, setUserAttemptsToday] = useState<Record<ArenaSubject, ArenaAttempt | null>>({
    math: null,
    physics: null,
    chemistry: null,
    biology: null,
    cs: null
  });
  const [userWeekAttempts, setUserWeekAttempts] = useState<ArenaAttempt[]>([]);
  const [allMyAttempts, setAllMyAttempts] = useState<ArenaAttempt[]>([]);

  // Lobby UI tabs, search, filters, rivals, H2H modal
  const [lobbySubTab, setLobbySubTab] = useState<LobbySubTab>('arena');
  const [rankTab, setRankTab] = useState<RankFilterTab>('overall');
  const [rankSort, setRankSort] = useState<RankSortMode>('overallAvg');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyRivalsFilter, setOnlyRivalsFilter] = useState(false);
  const [rivalIds, setRivalIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_RIVALS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [ghostRival, setGhostRival] = useState<ArenaRivalTarget | null>(null);
  const [h2hEntry, setH2hEntry] = useState<WeeklyLeaderboardEntry | null>(null);
  const [isStreamLive, setIsStreamLive] = useState(false);

  const myRowRef = useRef<HTMLTableRowElement | null>(null);

  // Active Match State (official MCQ/Essay OR unlimited Speedrun 90s)
  const [activeMatch, setActiveMatch] = useState<{
    subject: ArenaSubject;
    mode: ArenaMode;
    division: ArenaDivisionId;
    startedAt: number;
    isSprint?: boolean;
    sprintQuestions?: ArenaQuestionMCQ[];
  } | null>(null);
  const [matchElapsedSec, setMatchElapsedSec] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [flaggedQIds, setFlaggedQIds] = useState<Record<string, boolean>>({});
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [savedMistakeIds, setSavedMistakeIds] = useState<Record<string, boolean>>({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Sprint combo state
  const [sprintCombo, setSprintCombo] = useState(0);
  const [sprintMaxCombo, setSprintMaxCombo] = useState(0);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintResult, setSprintResult] = useState<ArenaSprintRecord | null>(null);

  const [mcqResult, setMcqResult] = useState<{
    attempt: ArenaAttempt;
    correctCount: number;
    total: number;
  } | null>(null);

  // Essay Mode State
  const [essayText, setEssayText] = useState('');
  const [showEssayPreview, setShowEssayPreview] = useState(false);
  const [essayImage, setEssayImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [csLang, setCsLang] = useState<CodeLanguage>('cpp');
  const [csTestOutput, setCsTestOutput] = useState<string | null>(null);
  const [isSubmittingMatch, setIsSubmittingMatch] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [essayResult, setEssayResult] = useState<{
    attempt: ArenaAttempt;
    evaluation: ArenaEssayEvaluation;
  } | null>(null);

  // Selected mode per subject card on lobby
  const [selectedLobbyMode, setSelectedLobbyMode] = useState<Record<ArenaSubject, ArenaMode>>({
    math: 'mcq',
    physics: 'mcq',
    chemistry: 'mcq',
    biology: 'mcq',
    cs: 'mcq'
  });

  // Notify parent App when entering/exiting an active competition round so Syn AI is turned off during match
  const isMatchInProgress = Boolean(activeMatch && !mcqResult && !essayResult && !sprintResult);
  useEffect(() => {
    onMatchActiveChange?.(isMatchInProgress);
  }, [isMatchInProgress, onMatchActiveChange]);

  useEffect(() => {
    return () => {
      onMatchActiveChange?.(false);
    };
  }, [onMatchActiveChange]);

  // Update Vietnam clock & daily reset countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeParts(getVietnamNowParts());
      setResetCountdown(getDailyResetCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load local cached attempts & sprint records
  const syncLocalAttempts = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      if (!raw) {
        setUserAttemptsToday({ math: null, physics: null, chemistry: null, biology: null, cs: null });
        setUserWeekAttempts([]);
        setAllMyAttempts([]);
      } else {
        const all: ArenaAttempt[] = JSON.parse(raw);
        const mineAll = all.filter((a) => a.userId === activeContestant.uid);
        setAllMyAttempts(mineAll);

        const mineToday: Record<ArenaSubject, ArenaAttempt | null> = {
          math: null,
          physics: null,
          chemistry: null,
          biology: null,
          cs: null
        };
        for (const subj of ['math', 'physics', 'chemistry', 'biology', 'cs'] as ArenaSubject[]) {
          mineToday[subj] =
            mineAll.find(
              (a) =>
                a.dateKey === dateKey &&
                a.subject === subj &&
                (a.division || '12k') === selectedDivision &&
                a.weekId === liveScopedWeekId
            ) || null;
        }
        setUserAttemptsToday(mineToday);
        const mineWeek = mineAll.filter((a) => a.weekId === activeScopedWeekId);
        setUserWeekAttempts(mineWeek);
      }
    } catch {}

    try {
      const rawSp = localStorage.getItem(LOCAL_SPRINTS_KEY);
      if (rawSp) {
        const parsed: ArenaSprintRecord[] = JSON.parse(rawSp);
        setLocalSprints(parsed);
      }
    } catch {}
  }, [activeContestant.uid, dateKey, liveScopedWeekId, activeScopedWeekId, selectedDivision]);

  // Fetch initial state from Express server + subscribe to SSE live updates
  const fetchServerState = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        weekId: activeScopedWeekId,
        dateKey,
        division: selectedDivision,
        userId: activeContestant.uid
      });
      const res = await safeFetchJson<any>(`/api/arena/state?${params.toString()}`);
      if (!res.ok || !res.data) return;
      const data = res.data;
      if (Array.isArray(data.leaderboard)) {
        setServerLeaderboard(data.leaderboard);
      }
      if (Array.isArray(data.availableWeeks)) {
        setAvailableWeeks(data.availableWeeks);
      }
      if (data.divisionStats) {
        setDivisionStats(data.divisionStats);
      }
      if (Array.isArray(data.sprintLeaderboard)) {
        setSprintLeaderboard(data.sprintLeaderboard);
      }
      if (data.userAttemptsToday && activeScopedWeekId === liveScopedWeekId) {
        setUserAttemptsToday((prev) => ({
          math: data.userAttemptsToday.math || prev.math,
          physics: data.userAttemptsToday.physics || prev.physics,
          chemistry: data.userAttemptsToday.chemistry || prev.chemistry,
          biology: data.userAttemptsToday.biology || prev.biology,
          cs: data.userAttemptsToday.cs || prev.cs
        }));
      }
      if (Array.isArray(data.userWeekAttempts)) {
        setUserWeekAttempts(data.userWeekAttempts);
      }
    } catch {}
  }, [activeScopedWeekId, liveScopedWeekId, dateKey, selectedDivision, activeContestant.uid]);

  useEffect(() => {
    setServerLeaderboard([]);
    setFirestoreLeaderboard([]);
    syncLocalAttempts();
    fetchServerState();

    let evtSource: EventSource | null = null;
    try {
      if (typeof window !== 'undefined' && typeof EventSource !== 'undefined') {
        evtSource = new EventSource(resolveApiUrl('/api/arena/stream'));
        evtSource.onopen = () => setIsStreamLive(true);
        evtSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (
              parsed.type === 'arena:update' &&
              parsed.weekId === activeScopedWeekId &&
              Array.isArray(parsed.leaderboard)
            ) {
              setServerLeaderboard(parsed.leaderboard);
            } else if (
              parsed.type === 'arena:sprint_update' &&
              parsed.division === selectedDivision &&
              Array.isArray(parsed.sprintLeaderboard)
            ) {
              setSprintLeaderboard(parsed.sprintLeaderboard);
            }
          } catch {}
        };
        evtSource.onerror = () => {
          setIsStreamLive(false);
          evtSource?.close();
        };
      }
    } catch {
      setIsStreamLive(false);
    }

    return () => {
      evtSource?.close();
    };
  }, [activeScopedWeekId, selectedDivision, syncLocalAttempts, fetchServerState]);

  // Subscribe to Firestore weekly_leaderboard when signed in (scoped by activeScopedWeekId)
  useEffect(() => {
    if (!firebaseUser) return;
    const lbQuery = query(
      collection(db, 'weekly_leaderboard'),
      where('weekId', '==', activeScopedWeekId)
    );
    const unsub = onSnapshot(
      lbQuery,
      (snap) => {
        const rows: WeeklyLeaderboardEntry[] = [];
        snap.forEach((docSnap) => {
          rows.push({ id: docSnap.id, ...(docSnap.data() as Omit<WeeklyLeaderboardEntry, 'id'>) });
        });
        setFirestoreLeaderboard(rows);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'weekly_leaderboard');
        } catch {}
      }
    );
    return () => unsub();
  }, [firebaseUser, activeScopedWeekId]);

  // Merge server + Firestore leaderboards & apply tab / search / rival / sort filters
  const baseLeaderboard = useMemo(() => {
    const map = new Map<string, WeeklyLeaderboardEntry>();
    for (const row of serverLeaderboard) {
      map.set(row.userId, row);
    }
    for (const row of firestoreLeaderboard) {
      const existing = map.get(row.userId);
      if (!existing || row.totalAttempts >= existing.totalAttempts) {
        map.set(row.userId, row);
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      if (b.overallAvg !== a.overallAvg) return b.overallAvg - a.overallAvg;
      if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts;
      return a.totalTimeSec - b.totalTimeSec;
    });
  }, [serverLeaderboard, firestoreLeaderboard]);

  const mergedLeaderboard = useMemo(() => {
    let list = [...baseLeaderboard];

    if (rankTab === 'math') list = list.filter((r) => r.mathAvg !== null);
    else if (rankTab === 'physics') list = list.filter((r) => r.physicsAvg !== null);
    else if (rankTab === 'chemistry') list = list.filter((r) => r.chemistryAvg !== null && r.chemistryAvg !== undefined);
    else if (rankTab === 'biology') list = list.filter((r) => r.biologyAvg !== null && r.biologyAvg !== undefined);
    else if (rankTab === 'cs') list = list.filter((r) => r.csAvg !== null);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (r) => r.displayName.toLowerCase().includes(q) || r.username.toLowerCase().includes(q)
      );
    }

    if (onlyRivalsFilter) {
      list = list.filter((r) => rivalIds.includes(r.userId) || r.userId === activeContestant.uid);
    }

    list.sort((a, b) => {
      if (rankSort === 'bestTotal') {
        const aBest =
          (a.mathBest ?? 0) +
          (a.physicsBest ?? 0) +
          (a.chemistryBest ?? 0) +
          (a.biologyBest ?? 0) +
          (a.csBest ?? 0);
        const bBest =
          (b.mathBest ?? 0) +
          (b.physicsBest ?? 0) +
          (b.chemistryBest ?? 0) +
          (b.biologyBest ?? 0) +
          (b.csBest ?? 0);
        if (bBest !== aBest) return bBest - aBest;
      } else if (rankSort === 'fastest') {
        const aPace = a.totalAttempts > 0 ? a.totalTimeSec / a.totalAttempts : 9999;
        const bPace = b.totalAttempts > 0 ? b.totalTimeSec / b.totalAttempts : 9999;
        if (aPace !== bPace) return aPace - bPace;
      } else if (rankSort === 'attempts') {
        if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts;
      }

      if (rankTab === 'math') return (b.mathAvg ?? 0) - (a.mathAvg ?? 0) || (b.mathBest ?? 0) - (a.mathBest ?? 0);
      if (rankTab === 'physics') return (b.physicsAvg ?? 0) - (a.physicsAvg ?? 0) || (b.physicsBest ?? 0) - (a.physicsBest ?? 0);
      if (rankTab === 'chemistry') return (b.chemistryAvg ?? 0) - (a.chemistryAvg ?? 0) || (b.chemistryBest ?? 0) - (a.chemistryBest ?? 0);
      if (rankTab === 'biology') return (b.biologyAvg ?? 0) - (a.biologyAvg ?? 0) || (b.biologyBest ?? 0) - (a.biologyBest ?? 0);
      if (rankTab === 'cs') return (b.csAvg ?? 0) - (a.csAvg ?? 0) || (b.csBest ?? 0) - (a.csBest ?? 0);

      if (b.overallAvg !== a.overallAvg) return b.overallAvg - a.overallAvg;
      if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts;
      return a.totalTimeSec - b.totalTimeSec;
    });

    return list;
  }, [baseLeaderboard, rankTab, rankSort, searchQuery, onlyRivalsFilter, rivalIds, activeContestant.uid]);

  const myLeaderboardRow = useMemo(() => {
    const idx = baseLeaderboard.findIndex((r) => r.userId === activeContestant.uid);
    return {
      rank: idx >= 0 ? idx + 1 : null,
      entry: idx >= 0 ? baseLeaderboard[idx] : null
    };
  }, [baseLeaderboard, activeContestant.uid]);

  // Merged Sprint Leaderboard
  const mergedSprintLeaderboard = useMemo(() => {
    const map = new Map<string, ArenaSprintRecord>();
    [...sprintLeaderboard, ...localSprints]
      .filter((s) => s.division === selectedDivision)
      .forEach((rec) => {
        if (!map.has(rec.id)) map.set(rec.id, rec);
      });
    return Array.from(map.values())
      .sort((a, b) => b.score - a.score || b.correctCount - a.correctCount || a.durationSec - b.durationSec)
      .slice(0, 20);
  }, [sprintLeaderboard, localSprints, selectedDivision]);

  const mySprints = useMemo(
    () => mergedSprintLeaderboard.filter((s) => s.userId === activeContestant.uid),
    [mergedSprintLeaderboard, activeContestant.uid]
  );

  // Competitive ELO & Achievements computation
  const myEloStats = useMemo(
    () =>
      computeArenaEloAndTier(
        allMyAttempts.length > 0 ? allMyAttempts : userWeekAttempts,
        myLeaderboardRow.entry,
        mySprints
      ),
    [allMyAttempts, userWeekAttempts, myLeaderboardRow.entry, mySprints]
  );

  const myAchievements = useMemo(
    () =>
      computeArenaAchievements(
        allMyAttempts.length > 0 ? allMyAttempts : userWeekAttempts,
        mySprints
      ),
    [allMyAttempts, userWeekAttempts, mySprints]
  );

  // Target Score Advisor (points needed for #3 or #1)
  const targetAdvisor = useMemo(() => {
    if (baseLeaderboard.length === 0) return null;
    const top1 = baseLeaderboard[0];
    const top3 = baseLeaderboard[Math.min(2, baseLeaderboard.length - 1)];
    const myAvg = myLeaderboardRow.entry?.overallAvg ?? 0;
    const myRank = myLeaderboardRow.rank;
    if (myRank === 1) {
      return isEn ? 'Leading #1 in this zone!' : 'Bạn đang dẫn đầu #1 bảng xếp hạng khu vực!';
    }
    if (myRank && myRank <= 3) {
      const gap1 = Math.max(0.5, +(top1.overallAvg - myAvg).toFixed(1));
      return isEn
        ? `Top 3! +${gap1} avg pts to claim #1 (${top1.displayName}).`
        : `Đang giữ Top ${myRank}! Cần +${gap1}đ TB để vượt #1 (${top1.displayName}).`;
    }
    const gap3 = Math.max(1, +(top3.overallAvg - myAvg).toFixed(1));
    return isEn
      ? `Target Top 3: Reach ${top3.overallAvg}đ (+${gap3}đ avg).`
      : `Mục tiêu vào Top 3: Đạt ${top3.overallAvg}đ (+${gap3}đ TB nữa).`;
  }, [baseLeaderboard, myLeaderboardRow, isEn]);

  const toggleRival = (uid: string) => {
    setRivalIds((prev) => {
      const next = prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid];
      try {
        localStorage.setItem(LOCAL_RIVALS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleChallengeGhost = (row: WeeklyLeaderboardEntry) => {
    setGhostRival({
      userId: row.userId,
      displayName: row.displayName,
      username: row.username,
      targetScore: row.overallAvg,
      targetDurationSec: row.totalAttempts > 0 ? Math.round(row.totalTimeSec / row.totalAttempts) : 90,
      subjectLabel: divisionMeta.shortLabelVi
    });
    setLobbySubTab('arena');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportCsv = () => {
    const header = ['Hang', 'Ten Hien Thi', 'Username', 'Toan TB', 'Vat Li TB', 'Hoa Hoc TB', 'Sinh Hoc TB', 'Tin Hoc TB', 'TB Chung', 'So Luot', 'Thoi Gian (s)'];
    const lines = [header.join(',')];
    mergedLeaderboard.forEach((row, idx) => {
      const safeName = `"${row.displayName.replace(/"/g, '""')}"`;
      lines.push(
        [
          idx + 1,
          safeName,
          row.username,
          row.mathAvg ?? '',
          row.physicsAvg ?? '',
          row.chemistryAvg ?? '',
          row.biologyAvg ?? '',
          row.csAvg ?? '',
          row.overallAvg,
          row.totalAttempts,
          row.totalTimeSec
        ].join(',')
      );
    });
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-bxh-${activeScopedWeekId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdateGuestName = () => {
    const clean = editingGuestName.trim() || 'Thí sinh Tự do';
    const next = { ...guestIdentity, displayName: clean };
    setGuestIdentity(next);
    try {
      localStorage.setItem(GUEST_ARENA_ID_KEY, JSON.stringify(next));
    } catch {}
  };

  const startArenaMatch = (subject: ArenaSubject, mode: ArenaMode, isSprint = false) => {
    if (!isSprint && userAttemptsToday[subject]) return;
    if (!isSprint && selectedWeekOverride) setSelectedWeekOverride(null);
    const daily = getDailyArenaSet(subject, dateKey, selectedDivision);
    const sprintQuestions = isSprint ? getSprintArenaSet(subject, selectedDivision, Date.now() % 1000) : undefined;

    setActiveMatch({
      subject,
      mode: isSprint ? 'mcq' : mode,
      division: selectedDivision,
      startedAt: Date.now(),
      isSprint,
      sprintQuestions
    });
    setMatchElapsedSec(0);
    setMcqAnswers({});
    setFlaggedQIds({});
    setActiveQIndex(0);
    setSavedMistakeIds({});
    setCopiedSummary(false);
    setMcqResult(null);
    setEssayResult(null);
    setSprintResult(null);
    setSprintCombo(0);
    setSprintMaxCombo(0);
    setSprintScore(0);
    setSubmitError(null);
    setEssayImage(null);
    setCsTestOutput(null);
    setShowEssayPreview(false);

    if (!isSprint && mode === 'essay' && subject === 'cs' && daily.essay.sampleCode) {
      setCsLang(daily.essay.sampleCode.language);
      setEssayText(daily.essay.sampleCode.starter);
    } else {
      setEssayText('');
    }
    playSfx('tick');
  };

  // Commit Speedrun 90s record
  const handleSubmitSprint = useCallback(async () => {
    if (!activeMatch || !activeMatch.isSprint || sprintResult || isSubmittingMatch) return;
    setIsSubmittingMatch(true);
    const mcqs = activeMatch.sprintQuestions || [];
    let correctCount = 0;
    mcqs.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctIndex) correctCount += 1;
    });
    const durationSec = Math.max(1, Math.min(SPRINT_DURATION_SEC, Math.floor((Date.now() - activeMatch.startedAt) / 1000)));
    const speedBonus = Math.max(0, SPRINT_DURATION_SEC - durationSec) * (correctCount >= 3 ? 2 : 0);
    const finalScore = sprintScore + speedBonus;

    const payload = {
      userId: activeContestant.uid,
      username: activeContestant.username,
      displayName: activeContestant.displayName,
      division: activeMatch.division,
      subject: activeMatch.subject,
      score: finalScore,
      correctCount,
      totalQuestions: mcqs.length,
      maxCombo: sprintMaxCombo,
      durationSec
    };

    let savedRecord: ArenaSprintRecord | null = null;
    try {
      const res = await safeFetchJson<any>('/api/arena/sprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok && res.data?.record) {
        savedRecord = res.data.record;
        if (Array.isArray(res.data.sprintLeaderboard)) {
          setSprintLeaderboard(res.data.sprintLeaderboard);
        }
      }
    } catch {}

    if (!savedRecord) {
      savedRecord = {
        ...payload,
        id: `local_sprint_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
    }

    try {
      const raw = localStorage.getItem(LOCAL_SPRINTS_KEY);
      const list: ArenaSprintRecord[] = raw ? JSON.parse(raw) : [];
      const next = [savedRecord, ...list].slice(0, 40);
      localStorage.setItem(LOCAL_SPRINTS_KEY, JSON.stringify(next));
      setLocalSprints(next);
    } catch {}

    setSprintResult(savedRecord);
    setIsSubmittingMatch(false);
    playSfx('finish');
    onEarnXP(25 + Math.round(finalScore / 15));
    if (correctCount >= Math.max(3, mcqs.length - 1)) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
    }
  }, [activeMatch, sprintResult, isSubmittingMatch, mcqAnswers, sprintScore, sprintMaxCombo, activeContestant, playSfx, onEarnXP]);

  // Match timer + Speedrun 90s auto-submit
  useEffect(() => {
    if (!activeMatch || mcqResult || essayResult || sprintResult) return;
    const t = setInterval(() => {
      const sec = Math.floor((Date.now() - activeMatch.startedAt) / 1000);
      setMatchElapsedSec(sec);
      if (activeMatch.isSprint && sec >= SPRINT_DURATION_SEC) {
        void handleSubmitSprint();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [activeMatch, mcqResult, essayResult, sprintResult, handleSubmitSprint]);

  const commitAttemptToBackendAndFirestore = async (
    payload: Omit<ArenaAttempt, 'id' | 'createdAt'>
  ): Promise<ArenaAttempt> => {
    const res = await safeFetchJson<any>('/api/arena/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let savedAttempt: ArenaAttempt;
    let myEntry: WeeklyLeaderboardEntry | undefined;
    const divTag = payload.division || selectedDivision;

    if (res.ok && res.data?.attempt) {
      savedAttempt = res.data.attempt;
      myEntry = res.data.myEntry;
      if (Array.isArray(res.data.leaderboard)) {
        setServerLeaderboard(res.data.leaderboard);
      }
    } else if (res.isStaticFallback || res.status === 0 || res.status === 404 || res.status === 405 || res.status >= 500) {
      savedAttempt = {
        ...payload,
        id: `local_${payload.userId}_${payload.dateKey}_${payload.subject}_${divTag}`,
        createdAt: new Date().toISOString()
      };
    } else {
      throw new Error(res.error || 'Không thể lưu điểm thi đấu hôm nay.');
    }

    let allLocal: ArenaAttempt[] = [];
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      const list: ArenaAttempt[] = raw ? JSON.parse(raw) : [];
      allLocal = list.filter(
        (a) =>
          a.id !== savedAttempt.id &&
          !(
            a.userId === payload.userId &&
            a.dateKey === payload.dateKey &&
            a.subject === payload.subject &&
            a.weekId === payload.weekId
          )
      );
      allLocal.push(savedAttempt);
      localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(allLocal));
    } catch {}

    if (!myEntry) {
      const mineWeek = allLocal.filter((a) => a.userId === payload.userId && a.weekId === payload.weekId);
      const calcSubj = (s: ArenaSubject) => {
        const sub = mineWeek.filter((a) => a.subject === s);
        if (sub.length === 0) return { best: null, avg: null, count: 0 };
        const best = Math.max(...sub.map((a) => a.score));
        const avg = Math.round((sub.reduce((acc, a) => acc + a.score, 0) / sub.length) * 10) / 10;
        return { best, avg, count: sub.length };
      };
      const m = calcSubj('math');
      const p = calcSubj('physics');
      const ch = calcSubj('chemistry');
      const bi = calcSubj('biology');
      const c = calcSubj('cs');
      const overallAvg =
        mineWeek.length > 0
          ? Math.round((mineWeek.reduce((acc, a) => acc + a.score, 0) / mineWeek.length) * 10) / 10
          : payload.score;
      myEntry = {
        id: `${payload.weekId}_${payload.userId}`,
        userId: payload.userId,
        username: payload.username,
        displayName: payload.displayName,
        weekId: payload.weekId,
        mathBest: m.best,
        mathAvg: m.avg,
        mathAttempts: m.count,
        physicsBest: p.best,
        physicsAvg: p.avg,
        physicsAttempts: p.count,
        chemistryBest: ch.best,
        chemistryAvg: ch.avg,
        chemistryAttempts: ch.count,
        biologyBest: bi.best,
        biologyAvg: bi.avg,
        biologyAttempts: bi.count,
        csBest: c.best,
        csAvg: c.avg,
        csAttempts: c.count,
        overallAvg,
        totalAttempts: mineWeek.length,
        totalTimeSec: mineWeek.reduce((acc, a) => acc + (a.durationSec || 0), 0),
        updatedAt: new Date().toISOString()
      };
      setServerLeaderboard((prev) => [
        ...prev.filter((row) => row.userId !== payload.userId),
        myEntry!
      ]);
    }

    setUserAttemptsToday((prev) => ({ ...prev, [payload.subject]: savedAttempt }));
    setUserWeekAttempts((prev) => [...prev.filter((a) => a.id !== savedAttempt.id), savedAttempt]);
    setAllMyAttempts((prev) => [...prev.filter((a) => a.id !== savedAttempt.id), savedAttempt]);

    // Sync to Firestore if signed into Firebase (strict schema compliance)
    if (firebaseUser && myEntry) {
      const attemptId = `${firebaseUser.uid}_${payload.dateKey}_${payload.subject}_${divTag}`;
      try {
        await setDoc(doc(db, 'arena_attempts', attemptId), {
          userId: firebaseUser.uid,
          username: payload.username,
          displayName: payload.displayName,
          weekId: payload.weekId,
          dateKey: payload.dateKey,
          subject: payload.subject,
          mode: payload.mode,
          score: payload.score,
          durationSec: payload.durationSec,
          summary: payload.summary,
          createdAt: savedAttempt.createdAt
        });
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.CREATE, `arena_attempts/${attemptId}`);
        } catch {}
      }

      const lbId = `${payload.weekId}_${firebaseUser.uid}`;
      const me = myEntry;
      try {
        await setDoc(
          doc(db, 'weekly_leaderboard', lbId),
          {
            userId: firebaseUser.uid,
            username: me.username,
            displayName: me.displayName,
            weekId: payload.weekId,
            mathBest: me.mathBest,
            mathAvg: me.mathAvg,
            mathAttempts: me.mathAttempts,
            physicsBest: me.physicsBest,
            physicsAvg: me.physicsAvg,
            physicsAttempts: me.physicsAttempts,
            chemistryBest: me.chemistryBest ?? null,
            chemistryAvg: me.chemistryAvg ?? null,
            chemistryAttempts: me.chemistryAttempts ?? 0,
            biologyBest: me.biologyBest ?? null,
            biologyAvg: me.biologyAvg ?? null,
            biologyAttempts: me.biologyAttempts ?? 0,
            csBest: me.csBest,
            csAvg: me.csAvg,
            csAttempts: me.csAttempts,
            overallAvg: me.overallAvg,
            totalAttempts: me.totalAttempts,
            totalTimeSec: me.totalTimeSec,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.WRITE, `weekly_leaderboard/${lbId}`);
        } catch {}
      }
    }

    return savedAttempt;
  };

  // Handle MCQ option pick (including Speedrun live combo calculation)
  const handleSelectMcqOption = (q: ArenaQuestionMCQ, optIdx: number, idx: number) => {
    if (mcqResult || sprintResult) return;
    if (activeMatch?.isSprint) {
      if (mcqAnswers[q.id] !== undefined) return; // Lock answer immediately in Speedrun
      setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
      const isRight = optIdx === q.correctIndex;
      if (isRight) {
        const nextCombo = sprintCombo + 1;
        setSprintCombo(nextCombo);
        setSprintMaxCombo((m) => Math.max(m, nextCombo));
        const mult = nextCombo >= 4 ? 3 : nextCombo >= 2 ? 2 : 1;
        setSprintScore((s) => s + 60 * mult);
        playSfx('correct');
      } else {
        setSprintCombo(0);
        playSfx('wrong');
      }
      setActiveQIndex(idx);
      return;
    }

    setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
    setActiveQIndex(idx);
    playSfx('tick');
  };

  // Submit Official MCQ Round
  const handleSubmitMCQ = async () => {
    if (!activeMatch || isSubmittingMatch) return;
    if (activeMatch.isSprint) {
      await handleSubmitSprint();
      return;
    }
    setIsSubmittingMatch(true);
    setSubmitError(null);

    try {
      const { mcqs } = getDailyArenaSet(activeMatch.subject, dateKey, activeMatch.division);
      let correctCount = 0;
      mcqs.forEach((q) => {
        if (mcqAnswers[q.id] === q.correctIndex) correctCount += 1;
      });
      const score = Math.round((correctCount / mcqs.length) * 100);
      const durationSec = Math.max(5, Math.floor((Date.now() - activeMatch.startedAt) / 1000));
      const matchWeekId = getArenaScopedWeekId(weekId, activeMatch.division);

      const attempt = await commitAttemptToBackendAndFirestore({
        userId: activeContestant.uid,
        username: activeContestant.username,
        displayName: activeContestant.displayName,
        weekId: matchWeekId,
        dateKey,
        division: activeMatch.division,
        subject: activeMatch.subject,
        mode: 'mcq',
        score,
        correctCount,
        totalQuestions: mcqs.length,
        durationSec,
        summary: `Trắc nghiệm ${correctCount}/${mcqs.length} câu đúng (${score}/100đ)`
      });

      setMcqResult({ attempt, correctCount, total: mcqs.length });
      playSfx('finish');
      onEarnXP(40 + Math.round(score / 2));
      if (score >= 80) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Lỗi khi nộp bài trắc nghiệm.');
    } finally {
      setIsSubmittingMatch(false);
    }
  };

  // Save wrong question(s) into Error Notebook + SM-2 Flashcards
  const saveQuestionToErrorNotebook = (q: ArenaQuestionMCQ, pickedIdx?: number) => {
    if (!activeMatch) return;
    recordMistake(
      {
        subject: activeMatch.subject,
        sourceType: 'mock_test',
        lessonKey: `arena_${activeMatch.division}_${activeMatch.subject}`,
        lessonTitle: `Đấu trường ${divisionMeta.shortLabelVi} · ${subjectMeta[activeMatch.subject].label}`,
        stepTitle: q.grade,
        prompt: q.question,
        userAnswer:
          pickedIdx !== undefined && q.options[pickedIdx]
            ? `${String.fromCharCode(65 + pickedIdx)}. ${q.options[pickedIdx]}`
            : 'Chưa chọn đáp án',
        correctAnswer: `${String.fromCharCode(65 + q.correctIndex)}. ${q.options[q.correctIndex]}`,
        explanation: q.explanation
      },
      user?.uid
    );
    setSavedMistakeIds((prev) => ({ ...prev, [q.id]: true }));
  };

  const saveAllWrongQuestions = (mcqs: ArenaQuestionMCQ[]) => {
    mcqs.forEach((q) => {
      const picked = mcqAnswers[q.id];
      if (picked !== q.correctIndex) {
        saveQuestionToErrorNotebook(q, picked);
      }
    });
  };

  // Run CS sample tests inside Essay mode
  const handleRunCsSampleTests = () => {
    if (!activeMatch) return;
    const { essay } = getDailyArenaSet(activeMatch.subject, dateKey, activeMatch.division);
    const tests = essay.sampleCode?.tests || [];
    if (tests.length === 0) return;

    const extractCode = (raw: string) => {
      const m = raw.match(/```(?:cpp|c\+\+|python|py)?\s*([\s\S]*?)```/i);
      return m ? m[1] : raw;
    };
    const codeToRun = extractCode(essayText);

    const results = tests.map((tc, i) => {
      const run =
        csLang === 'cpp'
          ? runCppInSandbox(codeToRun, tc.input)
          : runPythonInSandbox(codeToRun, tc.input);
      const passed = !run.isError && compareOutputs(run.stdout, tc.expectedOutput);
      return `Test #${i + 1}: ${
        passed
          ? 'PASSED'
          : run.isError
          ? `ERROR (${run.stderr || 'Runtime/Syntax Error'})`
          : `WRONG (got "${run.stdout.trim()}", expected "${tc.expectedOutput.trim()}")`
      }`;
    });
    setCsTestOutput(results.join('\n'));
  };

  // Submit Essay Round (Graded by Gemini Examiner)
  const handleSubmitEssay = async () => {
    if (!activeMatch || isSubmittingMatch) return;
    if (!essayText.trim() && !essayImage) {
      setSubmitError('Vui lòng nhập lời giải tự luận hoặc tải ảnh bài làm trước khi nộp.');
      return;
    }

    setIsSubmittingMatch(true);
    setSubmitError(null);

    try {
      const { essay } = getDailyArenaSet(activeMatch.subject, dateKey, activeMatch.division);

      let extraCodeNote = '';
      if (activeMatch.subject === 'cs' && essay.sampleCode?.tests?.length) {
        const m = essayText.match(/```(?:cpp|c\+\+|python|py)?\s*([\s\S]*?)```/i);
        const codeToRun = m ? m[1] : essayText;
        let passedTests = 0;
        const details: string[] = [];
        essay.sampleCode.tests.forEach((tc, i) => {
          const run =
            csLang === 'cpp'
              ? runCppInSandbox(codeToRun, tc.input)
              : runPythonInSandbox(codeToRun, tc.input);
          const ok = !run.isError && compareOutputs(run.stdout, tc.expectedOutput);
          if (ok) passedTests++;
          details.push(`Test #${i + 1}: ${ok ? 'AC' : run.isError ? (run.stderr || 'Error') : `WA (${run.stdout.trim()})`}`);
        });
        extraCodeNote = `\n[KẾT QUẢ CHẠY SANDBOX ${csLang.toUpperCase()}: ${passedTests}/${essay.sampleCode.tests.length} test đạt (${details.join('; ')})]`;
      }

      const gradeRes = await safeFetchJson<any>('/api/gemini/grade-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeMatch.subject,
          title: essay.title,
          prompt: essay.prompt,
          rubricChecklist: essay.rubricChecklist,
          referenceSolution: essay.referenceSolution,
          studentAnswer: `${essayText}${extraCodeNote}`,
          imageBase64: essayImage?.base64,
          mimeType: essayImage?.mimeType,
          language
        })
      }, 65000);

      if (!gradeRes.ok || !gradeRes.data?.evaluation) {
        throw new Error(
          gradeRes.error ||
            'Gemini AI chưa chấm được bài tự luận lúc này. Vui lòng thử nộp lại sau giây lát.'
        );
      }

      const evaluation: ArenaEssayEvaluation = gradeRes.data.evaluation;
      const durationSec = Math.max(10, Math.floor((Date.now() - activeMatch.startedAt) / 1000));
      const matchWeekId = getArenaScopedWeekId(weekId, activeMatch.division);

      const attempt = await commitAttemptToBackendAndFirestore({
        userId: activeContestant.uid,
        username: activeContestant.username,
        displayName: activeContestant.displayName,
        weekId: matchWeekId,
        dateKey,
        division: activeMatch.division,
        subject: activeMatch.subject,
        mode: 'essay',
        score: evaluation.score,
        durationSec,
        summary: `Tự luận: ${evaluation.score}/100đ · ${evaluation.detailedFeedback.slice(0, 120)}`
      });

      setEssayResult({ attempt, evaluation });
      playSfx('finish');
      onEarnXP(50 + Math.round(evaluation.score / 2));
      if (evaluation.score >= 80) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Lỗi khi chấm và nộp bài tự luận.');
    } finally {
      setIsSubmittingMatch(false);
    }
  };

  const handleEssayImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEssayImage({
        base64: String(reader.result || ''),
        mimeType: file.type || 'image/png'
      });
    };
    reader.readAsDataURL(file);
  };

  const insertLatexSnippet = (snippet: string) => {
    setEssayText((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + snippet);
  };

  // Keyboard shortcuts during MCQ / Speedrun match
  useEffect(() => {
    if (!activeMatch || activeMatch.mode !== 'mcq' || mcqResult || sprintResult) return;
    const activeMcqs = activeMatch.isSprint
      ? activeMatch.sprintQuestions || []
      : getDailyArenaSet(activeMatch.subject, dateKey, activeMatch.division).mcqs;
    if (activeMcqs.length === 0) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const q = activeMcqs[activeQIndex];
        const optIdx = Number(e.key) - 1;
        if (q && optIdx < q.options.length) {
          handleSelectMcqOption(q, optIdx, activeQIndex);
        }
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'n') {
        const nextIdx = Math.min(activeMcqs.length - 1, activeQIndex + 1);
        setActiveQIndex(nextIdx);
        document.getElementById(`arena-q-${nextIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'p') {
        const prevIdx = Math.max(0, activeQIndex - 1);
        setActiveQIndex(prevIdx);
        document.getElementById(`arena-q-${prevIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key.toLowerCase() === 'f') {
        const q = activeMcqs[activeQIndex];
        if (q) setFlaggedQIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const subjectMeta: Record<
    ArenaSubject,
    { label: string; labelEn: string; accent: string; icon: React.ReactNode }
  > = {
    math: {
      label: 'Toán học',
      labelEn: 'Mathematics',
      accent: 'text-sky-600 dark:text-sky-400',
      icon: <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400 icon-anim-compass" />
    },
    physics: {
      label: 'Vật lí',
      labelEn: 'Physics',
      accent: 'text-amber-600 dark:text-amber-400',
      icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 icon-anim-zap" />
    },
    chemistry: {
      label: 'Hóa học',
      labelEn: 'Chemistry',
      accent: 'text-teal-600 dark:text-teal-400',
      icon: <FlaskConical className="w-5 h-5 text-teal-600 dark:text-teal-400" />
    },
    biology: {
      label: 'Sinh học',
      labelEn: 'Biology',
      accent: 'text-rose-600 dark:text-rose-400',
      icon: <Dna className="w-5 h-5 text-rose-600 dark:text-rose-400" />
    },
    cs: {
      label: 'Tin học',
      labelEn: 'Computer Science',
      accent: 'text-emerald-600 dark:text-emerald-400',
      icon: <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 icon-anim-code" />
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // =====================================================================
  // VIEW: ACTIVE MATCH (TRẮC NGHIỆM / SPEEDRUN 90s / TỰ LUẬN)
  // =====================================================================
  if (activeMatch) {
    const matchDivMeta = getArenaDivisionMeta(activeMatch.division);
    const dailySet = getDailyArenaSet(activeMatch.subject, dateKey, activeMatch.division);
    const mcqs = activeMatch.isSprint ? activeMatch.sprintQuestions || [] : dailySet.mcqs;
    const essay = dailySet.essay;
    const meta = subjectMeta[activeMatch.subject];
    const sprintRemainingSec = Math.max(0, SPRINT_DURATION_SEC - matchElapsedSec);
    const sprintMultiplier = sprintCombo >= 4 ? 3 : sprintCombo >= 2 ? 2 : 1;

    return (
      <div className="space-y-5">
        {/* Match Top Bar */}
        <div className="arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="arena-beam-sweep" />
          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={() => setActiveMatch(null)}
              className="arena-btn cs-deck-btn px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Lobby' : 'Quay lại Sảnh'}</span>
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold ${matchDivMeta.badgeColor}`}>
                  {isEn ? matchDivMeta.labelEn : matchDivMeta.labelVi}
                </span>
                {activeMatch.isSprint && (
                  <span className="px-2 py-0.5 rounded-sm border border-amber-400/60 bg-amber-500/15 text-amber-600 dark:text-amber-300 text-[11px] font-extrabold">
                    SPEEDRUN 90s
                  </span>
                )}
                <span>·</span>
                <span>
                  {isEn ? meta.labelEn : meta.label} · {activeMatch.isSprint ? 'Đấu Tốc Độ' : activeMatch.mode === 'mcq' ? 'Trắc nghiệm' : 'Tự luận'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activeMatch.isSprint
                  ? `Speedrun ${mcqs.length} câu · Combo x1/x2/x3`
                  : activeMatch.mode === 'mcq'
                  ? `Bộ đề ngày ${dateKey} (${mcqs.length} câu)`
                  : essay.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-10">
            {activeMatch.isSprint && (
              <div className="px-3 py-1.5 rounded-md bg-amber-500/15 border border-amber-400/60 font-mono text-xs font-extrabold text-amber-600 dark:text-amber-300 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-3.5 h-3.5" />
                <span>{sprintScore}đ</span>
                {sprintCombo > 0 && <span>· {sprintCombo} Combo (x{sprintMultiplier})</span>}
              </div>
            )}

            <button
              type="button"
              onClick={toggleSfx}
              className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 cursor-pointer"
              title={sfxEnabled ? 'Tắt âm thanh thi đấu' : 'Bật âm thanh thi đấu'}
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div
              className={`px-3 py-1.5 rounded-md border font-mono text-sm font-bold flex items-center gap-1.5 tabular-nums ${
                activeMatch.isSprint && sprintRemainingSec <= 15
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-600 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300/70 dark:border-slate-700 text-slate-900 dark:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>
                {activeMatch.isSprint
                  ? formatDuration(sprintRemainingSec)
                  : formatDuration(matchElapsedSec)}
              </span>
            </div>

            {isMatchInProgress ? (
              <div
                className="px-3 py-2 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5"
                title="Trợ lý Syn AI đã tạm tắt khi đang thi đấu để đảm bảo công bằng"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Đã tắt Syn AI khi thi</span>
              </div>
            ) : (
              <button
                onClick={() =>
                  onOpenTutor({
                    subject: activeMatch.subject,
                    topicTitle: activeMatch.mode === 'mcq' ? `Thi đấu ${meta.label}` : essay.title,
                    problemStatement:
                      activeMatch.mode === 'essay'
                        ? essay.prompt
                        : mcqs.map((q, idx) => `Câu ${idx + 1}: ${q.question}`).join('\n')
                  })
                }
                className="arena-btn cs-deck-btn px-3 py-2 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hỏi Syn AI sau thi</span>
              </button>
            )}
          </div>
        </div>

        {/* Speedrun 90s countdown progress bar */}
        {activeMatch.isSprint && !sprintResult && (
          <div className="w-full h-2 rounded-sm bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                sprintRemainingSec <= 15
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-sky-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (sprintRemainingSec / SPRINT_DURATION_SEC) * 100))}%` }}
            />
          </div>
        )}

        {/* Active Ghost Rival Duel Strip */}
        {ghostRival && (
          <div className="px-4 py-2.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-300/80 dark:border-indigo-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-indigo-800 dark:text-indigo-200">
              <Swords className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>
                Đang thách đấu Ghost của <strong>{ghostRival.displayName}</strong> · Mục tiêu:{' '}
                <span className="font-mono font-bold">{ghostRival.targetScore}đ</span> trong{' '}
                <span className="font-mono font-bold">{formatDuration(ghostRival.targetDurationSec)}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setGhostRival(null)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* MCQ / SPEEDRUN MODE */}
        {activeMatch.mode === 'mcq' && (
          <div className="space-y-4">
            {/* Official MCQ Result Banner */}
            {mcqResult && (
              <div className="arena-frame arena-stagger-in bg-slate-900 border border-sky-500/40 text-white rounded-md p-6 space-y-4">
                <div className="arena-beam-sweep" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="text-xs text-amber-300 font-mono font-bold uppercase tracking-wider">
                      Kết quả chính thức hôm nay ({dateKey}) · Đã ghi nhận vào BXH {weekId}
                    </div>
                    <h3 className="text-2xl font-extrabold tabular-nums">
                      Điểm số: {mcqResult.attempt.score}/100 ({mcqResult.correctCount}/{mcqResult.total} câu đúng)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Thời gian hoàn thành: {formatDuration(mcqResult.attempt.durationSec)} · Lượt thi môn {meta.label} hôm nay đã khóa đến 00:00 ngày mai.
                    </p>
                    {ghostRival && (
                      <div
                        className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-sm text-xs font-bold ${
                          mcqResult.attempt.score >= ghostRival.targetScore
                            ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                            : 'bg-rose-500/20 border border-rose-400/50 text-rose-300'
                        }`}
                      >
                        <Swords className="w-3.5 h-3.5" />
                        <span>
                          {mcqResult.attempt.score > ghostRival.targetScore
                            ? `Thắng Ghost ${ghostRival.displayName} (+${+(mcqResult.attempt.score - ghostRival.targetScore).toFixed(1)}đ)!`
                            : mcqResult.attempt.score === ghostRival.targetScore
                            ? `Hòa điểm Ghost ${ghostRival.displayName}!`
                            : `Thua Ghost ${ghostRival.displayName} (${+(mcqResult.attempt.score - ghostRival.targetScore).toFixed(1)}đ).`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {mcqResult.correctCount < mcqResult.total && (
                      <button
                        type="button"
                        onClick={() => saveAllWrongQuestions(mcqs)}
                        className="arena-btn px-3.5 py-2.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                        <span>Lưu câu sai vào Sổ lỗi SM-2</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const summaryText = `[Synapse Arena · ${divisionMeta.shortLabelVi}] ${activeContestant.displayName} đạt ${mcqResult.attempt.score}/100đ (${mcqResult.correctCount}/${mcqResult.total} câu) môn ${meta.label} trong ${formatDuration(mcqResult.attempt.durationSec)}!`;
                        navigator.clipboard?.writeText(summaryText).catch(() => {});
                        setCopiedSummary(true);
                        window.setTimeout(() => setCopiedSummary(false), 1800);
                      }}
                      className="arena-btn px-3.5 py-2.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSummary ? 'Đã chép' : 'Chia sẻ'}</span>
                    </button>
                    <button
                      onClick={() => setActiveMatch(null)}
                      className="arena-btn arena-btn-primary cs-deck-btn px-5 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 border border-amber-200 text-slate-950 text-xs font-extrabold shrink-0 cursor-pointer"
                    >
                      Xem Bảng Xếp Hạng Tuần
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Speedrun 90s Result Banner */}
            {sprintResult && (
              <div className="arena-frame arena-stagger-in bg-slate-900 border border-amber-400/50 text-white rounded-md p-6 space-y-4">
                <div className="arena-beam-sweep" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="text-xs text-amber-300 font-mono font-bold uppercase tracking-wider">
                      SPEEDRUN 90s · ĐÃ LƯU BXH TỐC ĐỘ ({divisionMeta.shortLabelVi})
                    </div>
                    <h3 className="text-2xl font-extrabold tabular-nums">
                      Tổng điểm Combo: {sprintResult.score}đ ({sprintResult.correctCount}/{sprintResult.totalQuestions} đúng)
                    </h3>
                    <p className="text-xs text-slate-300">
                      Max Combo: x{sprintResult.maxCombo} · Thời gian: {formatDuration(sprintResult.durationSec)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {sprintResult.correctCount < sprintResult.totalQuestions && (
                      <button
                        type="button"
                        onClick={() => saveAllWrongQuestions(mcqs)}
                        className="arena-btn px-3.5 py-2.5 rounded-md bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/50 text-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                        <span>Lưu câu sai SM-2</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => startArenaMatch(activeMatch.subject, 'mcq', true)}
                      className="arena-btn px-4 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Chơi lại Speedrun mới</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMatch(null)}
                      className="arena-btn px-4 py-2.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Về Sảnh Arena
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Question Navigator + Keyboard Shortcuts Hint */}
            <div className="arena-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-md p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {mcqs.map((q, idx) => {
                  const answered = mcqAnswers[q.id] !== undefined;
                  const isCurrent = activeQIndex === idx;
                  const isFlagged = Boolean(flaggedQIds[q.id]);
                  const isSubmitted = Boolean(mcqResult || sprintResult);
                  const isRight = mcqAnswers[q.id] === q.correctIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setActiveQIndex(idx);
                        document.getElementById(`arena-q-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className={`relative min-w-[34px] h-8 px-2 rounded-sm font-mono text-xs font-bold border transition cursor-pointer ${
                        isSubmitted
                          ? isRight
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-rose-500 text-white border-rose-400'
                          : isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-400'
                          : answered
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-400/70'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-sm bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
                Phím tắt: 1–4 chọn · ←/→ chuyển câu · F đánh dấu
              </span>
            </div>

            {mcqs.map((q, idx) => {
              const picked = mcqAnswers[q.id];
              const isSubmitted = Boolean(mcqResult || sprintResult);
              const isInstantSprintLocked = Boolean(activeMatch.isSprint && picked !== undefined);
              const revealAnswer = isSubmitted || isInstantSprintLocked;
              const isRight = picked === q.correctIndex;
              const isFlagged = Boolean(flaggedQIds[q.id]);

              return (
                <div
                  key={q.id}
                  id={`arena-q-${idx}`}
                  onClick={() => setActiveQIndex(idx)}
                  style={{ animationDelay: `${idx * 45}ms` }}
                  className={`arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border rounded-md p-5 space-y-3 transition-colors ${
                    activeQIndex === idx
                      ? 'border-indigo-400 dark:border-indigo-500'
                      : 'border-slate-200/90 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        Câu {idx + 1} · {q.grade}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFlaggedQIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
                        }}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border text-[10px] font-bold cursor-pointer ${
                          isFlagged
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        <span>{isFlagged ? 'Đã gắn cờ' : 'Gắn cờ'}</span>
                      </button>
                    </div>
                    <span className="tabular-nums font-mono font-semibold">{q.points} điểm</span>
                  </div>

                  <div className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                    <FormattedText text={q.question} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const selected = picked === optIdx;
                      let stateStyle =
                        'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-indigo-400';

                      if (revealAnswer) {
                        if (optIdx === q.correctIndex) {
                          stateStyle =
                            'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                        } else if (selected && optIdx !== q.correctIndex) {
                          stateStyle =
                            'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                        }
                      } else if (selected) {
                        stateStyle =
                          'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-semibold shadow-sm';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted || isInstantSprintLocked}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectMcqOption(q, optIdx, idx);
                          }}
                          className={`arena-btn p-3 rounded-md border text-left text-xs sm:text-sm flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${stateStyle}`}
                        >
                          <span className="w-6 h-6 rounded-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <div className="flex-1 pt-0.5">
                            <FormattedText text={opt} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {revealAnswer && (
                    <div className="mt-3 p-3.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`font-bold flex items-center gap-1.5 ${
                            isRight ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isRight ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {isRight
                            ? 'Chính xác'
                            : `Chưa đúng (Đáp án: ${String.fromCharCode(65 + q.correctIndex)})`}
                        </span>

                        {isSubmitted && !isRight && (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => saveQuestionToErrorNotebook(q, picked)}
                              disabled={Boolean(savedMistakeIds[q.id])}
                              className="text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-60"
                            >
                              <BookmarkPlus className="w-3.5 h-3.5" />
                              <span>{savedMistakeIds[q.id] ? 'Đã lưu Sổ lỗi' : 'Lưu vào Sổ lỗi'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onOpenTutor({
                                  subject: activeMatch.subject,
                                  topicTitle: `Câu ${idx + 1} (${q.grade})`,
                                  problemStatement: `${q.question}\nCác lựa chọn: ${q.options.join(' | ')}`
                                })
                              }
                              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Hỏi Syn AI giảng lại</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        <FormattedText text={q.explanation} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {submitError && (
              <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {!mcqResult && !sprintResult && (
              <div className="arena-frame flex items-center justify-between bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-md p-4">
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                  Đã chọn {Object.keys(mcqAnswers).length}/{mcqs.length} câu
                </span>
                <button
                  onClick={handleSubmitMCQ}
                  disabled={isSubmittingMatch}
                  className="arena-btn arena-btn-primary cs-deck-btn px-6 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-400/50 text-white text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingMatch
                      ? 'Đang nộp & xếp hạng...'
                      : activeMatch.isSprint
                      ? 'Chốt điểm Speedrun 90s'
                      : 'Nộp Bài Thi Hôm Nay'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESSAY MODE (TỰ LUẬN / CODE) */}
        {activeMatch.mode === 'essay' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-md p-5 space-y-4">
                <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {essay.grade} · Thang điểm 100
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{essay.title}</h3>
                <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  <FormattedText text={essay.prompt} />
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Biểu điểm chấm Tự luận:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {essay.rubricChecklist.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{i + 1}.</span>
                        <div className="flex-1">
                          <FormattedText text={r} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {essayResult ? (
                <div className="arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-md p-6 space-y-5">
                  <div className="arena-frame bg-slate-900 border border-amber-400/40 text-white rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="arena-beam-sweep" />
                    <div className="relative z-10">
                      <div className="text-xs text-amber-300 font-mono font-bold uppercase tracking-wider">
                        Điểm Tự Luận Chính Thức ({dateKey})
                      </div>
                      <div className="text-3xl font-extrabold tabular-nums mt-1">
                        {essayResult.evaluation.score} / 100 điểm
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveMatch(null)}
                      className="arena-btn arena-btn-primary cs-deck-btn relative z-10 px-4 py-2.5 rounded-md bg-amber-400 hover:bg-amber-300 border border-amber-200 text-slate-950 text-xs font-extrabold cursor-pointer"
                    >
                      Xem Bảng Xếp Hạng Tuần
                    </button>
                  </div>

                  {essayResult.evaluation.stepScores.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Chi tiết chấm theo từng ý:
                      </h4>
                      <div className="space-y-2">
                        {essayResult.evaluation.stepScores.map((st, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                              <span>{st.criterion}</span>
                              <span className="font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                                {st.earned}/{st.max}đ
                              </span>
                            </div>
                            <div className="text-slate-600 dark:text-slate-400">
                              <FormattedText text={st.comment} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">Điểm làm tốt:</div>
                      {essayResult.evaluation.strengths.map((s, i) => (
                        <div key={i} className="text-slate-700 dark:text-slate-300">
                          • <FormattedText text={s} />
                        </div>
                      ))}
                    </div>
                    <div className="p-3.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1.5">
                      <div className="font-bold text-amber-700 dark:text-amber-300">Phần cần khắc phục:</div>
                      {essayResult.evaluation.mistakes.length > 0 ? (
                        essayResult.evaluation.mistakes.map((m, i) => (
                          <div key={i} className="text-slate-700 dark:text-slate-300">
                            • <FormattedText text={m} />
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-600 dark:text-slate-400">Không phát hiện sai sót đáng kể.</div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Nhận xét & Đáp án tham khảo:</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      <FormattedText text={essayResult.evaluation.detailedFeedback} />
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Lời giải chuẩn: </span>
                      <FormattedText text={essay.referenceSolution} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 rounded-md p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>Bài Làm Tự Luận Của Bạn</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeMatch.subject === 'cs' && (
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-md">
                          {(['cpp', 'python'] as CodeLanguage[]).map((lg) => (
                            <button
                              key={lg}
                              onClick={() => setCsLang(lg)}
                              className={`px-2 py-0.5 rounded-sm text-[11px] font-mono font-bold cursor-pointer ${
                                csLang === lg
                                  ? 'bg-indigo-600 text-white'
                                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {lg === 'cpp' ? 'C++' : 'Python'}
                            </button>
                          ))}
                        </div>
                      )}
                      <VoiceMicButton
                        language={language}
                        size="sm"
                        showLabel={true}
                        onTranscript={(spoken) =>
                          setEssayText((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
                        }
                      />
                      <button
                        onClick={() => setShowEssayPreview(!showEssayPreview)}
                        className="arena-btn px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showEssayPreview ? 'Soạn thảo' : 'Xem trước KaTeX'}</span>
                      </button>
                    </div>
                  </div>

                  {activeMatch.subject !== 'cs' && (
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Phân số', val: '$\\frac{a}{b}$' },
                        { label: 'Căn bậc 2', val: '$\\sqrt{x}$' },
                        { label: 'Delta', val: '$\\Delta = b^2 - 4ac$' },
                        { label: 'Suy ra', val: '$\\Rightarrow$' },
                        { label: 'Tương đương', val: '$\\Leftrightarrow$' },
                        { label: 'Tích phân', val: '$\\int_{a}^{b} f(x)\\,dx$' }
                      ].map((sym) => (
                        <button
                          key={sym.label}
                          type="button"
                          onClick={() => insertLatexSnippet(sym.val)}
                          className="arena-btn px-2 py-1 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-[11px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          + {sym.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {showEssayPreview ? (
                    <div className="min-h-[220px] p-4 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                      {essayText.trim() ? <FormattedText text={essayText} /> : 'Chưa có nội dung bài giải.'}
                    </div>
                  ) : (
                    <textarea
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      rows={10}
                      placeholder={
                        activeMatch.subject === 'cs'
                          ? 'Viết giải thích thuật toán & code C++/Python tại đây...'
                          : 'Trình bày từng bước giải rõ ràng (có thể dùng $...$ cho công thức Toán/Lí)...'
                      }
                      className={`w-full p-3.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 ${
                        activeMatch.subject === 'cs' ? 'font-mono text-xs' : 'text-sm'
                      }`}
                    />
                  )}

                  {activeMatch.subject === 'cs' && essay.sampleCode && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleRunCsSampleTests}
                        className="arena-btn px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Chạy thử {essay.sampleCode.tests.length} test mẫu</span>
                      </button>
                      {csTestOutput && (
                        <pre className="p-3 rounded-md bg-slate-950 text-emerald-300 font-mono text-[11px] whitespace-pre-wrap border border-slate-800">
                          {csTestOutput}
                        </pre>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <label className="arena-btn inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      <span>
                        {essayImage ? 'Đã đính kèm ảnh bài làm' : 'Hoặc tải ảnh bài viết giấy'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleEssayImagePick} className="hidden" />
                    </label>

                    <button
                      onClick={handleSubmitEssay}
                      disabled={isSubmittingMatch}
                      className="arena-btn arena-btn-primary cs-deck-btn px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-400/50 text-white text-xs font-extrabold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmittingMatch ? 'Syn AI đang chấm...' : 'Nộp Chấm Tự Luận'}
                      </span>
                    </button>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =====================================================================
  // VIEW: MODERN COMPETITIVE ARENA LOBBY + PODIUM + BXH + ACHIEVEMENTS + SPEEDRUN
  // =====================================================================
  const unlockedCount = myAchievements.filter((a) => a.unlocked).length;
  const top3Entries = mergedLeaderboard.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Arena Header & Season ELO Card */}
      <div className="rm-arch-frame arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 sm:p-6 shadow-sm space-y-5">
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-indigo-500/60" />
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-indigo-500/60" />
        <div className="arena-beam-sweep" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="arena-btn cs-deck-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:border-indigo-400 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
            </button>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Đấu Trường Giải Bài Online & BXH Mùa Giải
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Thi đấu chính thức (1 lượt/ngày/môn tính điểm Tuần & ELO), đấu Speedrun 90s không giới hạn và đối đầu Ghost của Top Ranker.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-3 text-xs space-y-1">
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {weekId} · {getWeekDateRangeLabel()}
              </div>
              <div className="text-slate-500 dark:text-slate-400 tabular-nums flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Mở lượt mới sau: {resetCountdown}</span>
              </div>
            </div>

            {!user && (
              <button
                onClick={() => openAuthModal('login')}
                className="arena-btn arena-btn-primary cs-deck-btn px-4 py-3 rounded-md bg-slate-900 dark:bg-white border border-slate-700 dark:border-slate-200 text-white dark:text-slate-900 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập lưu hạng</span>
              </button>
            )}
          </div>
        </div>

        {/* Competitive Tier & Season ELO Bar */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className={`lg:col-span-6 p-3.5 rounded-md border flex flex-col justify-between gap-2 ${myEloStats.tier.borderClass}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-md bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <Crown className={`w-5 h-5 ${myEloStats.tier.accentClass}`} />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Bậc Xếp Hạng Mùa Giải
                  </div>
                  <div className={`text-sm font-extrabold ${myEloStats.tier.accentClass}`}>
                    {isEn ? myEloStats.tier.nameEn : myEloStats.tier.nameVi}
                  </div>
                </div>
              </div>
              <div className="text-right font-mono tabular-nums">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">{myEloStats.elo} ELO</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {myEloStats.nextTier
                    ? `Còn ${myEloStats.pointsToNext} → ${myEloStats.nextTier.nameVi}`
                    : 'Bậc Cao Nhất'}
                </div>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-sm bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${myEloStats.progressPct}%` }}
              />
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Chuỗi đạt (≥60đ)</div>
              <div className="text-lg font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums mt-0.5 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {myEloStats.winStreakEstimate} trận
              </div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Huy hiệu mở khóa</div>
              <div className="text-lg font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums mt-0.5 flex items-center gap-1">
                <Medal className="w-4 h-4" />
                {unlockedCount}/{myAchievements.length}
              </div>
            </div>
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Sĩ số khu vực</div>
              <div className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                {divisionStats.totalPlayers || baseLeaderboard.length} thí sinh
              </div>
            </div>
          </div>
        </div>

        {/* Sub-View Switcher + Target Score Advisor */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
            {(
              [
                { id: 'arena' as LobbySubTab, label: 'Sảnh Thi Đấu & BXH', icon: <Trophy className="w-3.5 h-3.5" /> },
                { id: 'speedrun' as LobbySubTab, label: `BXH Speedrun 90s (${mergedSprintLeaderboard.length})`, icon: <Flame className="w-3.5 h-3.5" /> },
                { id: 'achievements' as LobbySubTab, label: `Huy Hiệu (${unlockedCount}/${myAchievements.length})`, icon: <Award className="w-3.5 h-3.5" /> }
              ]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLobbySubTab(tab.id)}
                className={`arena-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border whitespace-nowrap cursor-pointer ${
                  lobbySubTab === tab.id
                    ? 'bg-white dark:bg-slate-900 border-indigo-400/70 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {targetAdvisor && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-300/70 dark:border-sky-700 text-xs font-semibold text-sky-800 dark:text-sky-200">
              <Target className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>{targetAdvisor}</span>
            </div>
          )}
        </div>

        {/* Contestant Name Bar (when playing as guest) */}
        {!user && (
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Bạn đang thi đấu với tên hiển thị khách (hoặc đăng nhập tài khoản để đồng bộ đa thiết bị):
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingGuestName}
                onChange={(e) => setEditingGuestName(e.target.value)}
                maxLength={40}
                className="px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleUpdateGuestName}
                className="arena-btn cs-deck-btn px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-400/50 text-white text-xs font-bold cursor-pointer"
              >
                Lưu tên
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Ghost Challenge Banner */}
      {ghostRival && (
        <div className="arena-frame bg-indigo-600 text-white rounded-md p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Swords className="w-5 h-5 shrink-0 text-amber-300" />
            <div>
              <strong>Chế độ Thách Đấu Ghost:</strong> Đang khóa mục tiêu vượt qua{' '}
              <span className="font-bold underline">{ghostRival.displayName}</span> (TB{' '}
              <span className="font-mono font-bold">{ghostRival.targetScore}đ</span> · tốc độ{' '}
              <span className="font-mono font-bold">{formatDuration(ghostRival.targetDurationSec)}</span>)
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGhostRival(null)}
            className="px-3 py-1 rounded-sm bg-white/15 hover:bg-white/25 text-xs font-bold cursor-pointer"
          >
            Hủy thách đấu
          </button>
        </div>
      )}

      {/* Zone / Division Selector */}
      <div
        style={{ animationDelay: '60ms' }}
        className="rm-arch-frame arena-frame roadmap-beam-sweep arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 shadow-sm space-y-4"
      >
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-sky-500/60" />
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-sky-500/60" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Khu Vực Thi Đấu Theo Lớp & Hệ Chuyên / Không Chuyên
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mỗi khu vực có bộ đề riêng đúng trình độ và BXH tuần độc lập. Trợ lý Syn AI sẽ tự động tắt khi thí sinh bước vào phòng thi.
              </p>
            </div>
          </div>

          <span className={`self-start md:self-auto px-3 py-1 rounded-sm border text-xs font-bold shrink-0 ${divisionMeta.badgeColor}`}>
            {isEn ? divisionMeta.labelEn : divisionMeta.labelVi}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 relative z-10">
          <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap items-center gap-1.5 max-w-full scrollbar-none pb-0.5 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
              Khối lớp:
            </span>
            {(
              [
                { id: '9', vi: 'Lớp 9' },
                { id: '10', vi: 'Lớp 10' },
                { id: '11', vi: 'Lớp 11' },
                { id: '12', vi: 'Lớp 12' },
                { id: 'olp', vi: 'Đội tuyển HSG / Olympic' }
              ] as { id: ArenaGradeGroup; vi: string }[]
            ).map((g) => {
              const active = divisionMeta.gradeGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGradeAndTrack(g.id)}
                  className={`arena-btn cs-deck-btn min-h-[38px] px-3.5 py-2 rounded-md text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {g.vi}
                </button>
              );
            })}
          </div>

          {divisionMeta.gradeGroup !== 'olp' ? (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md w-full sm:w-auto overflow-x-auto scrollbar-none">
              {(
                [
                  { id: 'khong_chuyen', vi: 'Hệ Không Chuyên (Chuẩn)' },
                  { id: 'chuyen', vi: 'Hệ Chuyên (Nâng cao)' }
                ] as { id: ArenaTrack; vi: string }[]
              ).map((t) => {
                const active = divisionMeta.track === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectGradeAndTrack(divisionMeta.gradeGroup, t.id)}
                    className={`arena-btn min-h-[36px] flex-1 sm:flex-initial px-3 py-1.5 rounded-sm text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 border ${
                      active
                        ? 'bg-white dark:bg-slate-900 border-indigo-400/70 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.vi}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-700 text-xs font-bold text-purple-700 dark:text-purple-300">
              <Layers className="w-3.5 h-3.5" />
              <span>Bảng Chuyên Sâu HSG Tỉnh / Quốc Gia / VNOI</span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* SUB-TAB: ACHIEVEMENTS & SEASON STATS                           */}
      {/* ============================================================= */}
      {lobbySubTab === 'achievements' && (
        <div className="space-y-6">
          <div className="arena-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Tủ Huy Hiệu Thành Tích ({unlockedCount}/{myAchievements.length})</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">Cập nhật tự động theo kết quả thi đấu</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-md border space-y-2 transition-colors ${
                    ach.unlocked
                      ? 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-400/70'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {ach.unlocked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      {isEn ? ach.titleEn : ach.titleVi}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm border text-[10px] font-mono font-bold uppercase border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {ach.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {isEn ? ach.descriptionEn : ach.descriptionVi}
                  </p>
                  <div className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    Tiến độ: {ach.progressText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB: SPEEDRUN 90s HALL OF FAME                             */}
      {/* ============================================================= */}
      {lobbySubTab === 'speedrun' && (
        <div className="arena-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>BXH Speedrun 90s · {divisionMeta.labelVi}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Đấu tốc độ không giới hạn lượt/ngày · Tính điểm chuỗi Combo x1 → x2 → x3 + thưởng tốc độ.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['math', 'physics', 'chemistry', 'biology', 'cs'] as ArenaSubject[]).map((subj) => (
                <button
                  key={subj}
                  type="button"
                  onClick={() => startArenaMatch(subj, 'mcq', true)}
                  className="arena-btn px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Đấu {subjectMeta[subj].label}</span>
                </button>
              ))}
            </div>
          </div>

          {mergedSprintLeaderboard.length === 0 ? (
            <div className="py-10 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-md text-xs text-slate-500">
              Chưa có kỷ lục Speedrun 90s nào ở khu vực này. Nhấn nút &ldquo;Đấu Speedrun&rdquo; để lập kỷ lục #1!
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono">
                    <th className="py-2.5 px-3">Hạng</th>
                    <th className="py-2.5 px-3">Thí sinh</th>
                    <th className="py-2.5 px-3">Môn</th>
                    <th className="py-2.5 px-3 text-right">Điểm Combo</th>
                    <th className="py-2.5 px-3 text-right">Đúng / Max Combo</th>
                    <th className="py-2.5 px-3 text-right">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mergedSprintLeaderboard.map((rec, idx) => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono font-bold tabular-nums">#{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {rec.displayName} {rec.userId === activeContestant.uid && <span className="text-indigo-500">(Bạn)</span>}
                      </td>
                      <td className="py-2.5 px-3">{subjectMeta[rec.subject].label}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                        {rec.score}đ
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {rec.correctCount}/{rec.totalQuestions} · x{rec.maxCombo}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500 tabular-nums">
                        {formatDuration(rec.durationSec)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB: MAIN ARENA LOBBY + TOP 3 PODIUM + FULL BXH            */}
      {/* ============================================================= */}
      {lobbySubTab === 'arena' && (
        <>
          {/* My Weekly Performance KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rm-card-interactive arena-frame arena-card-hover bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-4 shadow-sm">
              <div className="h-[2.5px] w-12 bg-indigo-500 roadmap-shimmer-bar mb-2" />
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Điểm TB / Hạng ({divisionMeta.shortLabelVi})
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                {myLeaderboardRow.entry ? `${myLeaderboardRow.entry.overallAvg}đ` : '—'}
                <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 ml-2">
                  {myLeaderboardRow.rank ? `#${myLeaderboardRow.rank}` : 'Chưa có hạng'}
                </span>
              </div>
            </div>

            {(['math', 'physics', 'chemistry', 'biology', 'cs'] as ArenaSubject[]).map((subj) => {
              const avg =
                subj === 'math'
                  ? myLeaderboardRow.entry?.mathAvg
                  : subj === 'physics'
                  ? myLeaderboardRow.entry?.physicsAvg
                  : subj === 'chemistry'
                  ? myLeaderboardRow.entry?.chemistryAvg
                  : subj === 'biology'
                  ? myLeaderboardRow.entry?.biologyAvg
                  : myLeaderboardRow.entry?.csAvg;
              const best =
                subj === 'math'
                  ? myLeaderboardRow.entry?.mathBest
                  : subj === 'physics'
                  ? myLeaderboardRow.entry?.physicsBest
                  : subj === 'chemistry'
                  ? myLeaderboardRow.entry?.chemistryBest
                  : subj === 'biology'
                  ? myLeaderboardRow.entry?.biologyBest
                  : myLeaderboardRow.entry?.csBest;
              const meta = subjectMeta[subj];
              const topBarColor =
                subj === 'math'
                  ? 'bg-blue-500'
                  : subj === 'physics'
                  ? 'bg-amber-500'
                  : subj === 'chemistry'
                  ? 'bg-teal-500'
                  : subj === 'biology'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500';
              return (
                <div
                  key={subj}
                  className="rm-card-interactive arena-frame arena-card-hover bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-4 shadow-sm"
                >
                  <div className={`h-[2.5px] w-12 ${topBarColor} roadmap-shimmer-bar mb-2`} />
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{meta.label} (TB tuần)</span>
                    {meta.icon}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                    {avg !== null && avg !== undefined ? `${avg}đ` : '—'}
                    {best !== null && best !== undefined && (
                      <span className="text-xs font-mono font-medium text-slate-500 ml-2">Max {best}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Arena Subject Cards + Unlimited Speedrun 90s */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {(['math', 'physics', 'chemistry', 'biology', 'cs'] as ArenaSubject[]).map((subj) => {
              const meta = subjectMeta[subj];
              const todayAttempt = userAttemptsToday[subj];
              const chosenMode = selectedLobbyMode[subj];
              const accentStrip =
                subj === 'math'
                  ? 'from-blue-500 via-cyan-400 to-indigo-500'
                  : subj === 'physics'
                  ? 'from-amber-500 via-orange-400 to-yellow-400'
                  : subj === 'chemistry'
                  ? 'from-teal-500 via-cyan-400 to-emerald-500'
                  : subj === 'biology'
                  ? 'from-rose-500 via-pink-400 to-amber-400'
                  : 'from-emerald-500 via-teal-400 to-cyan-500';

              return (
                <div
                  key={subj}
                  className="rm-card-interactive arena-frame arena-card-hover bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentStrip} roadmap-shimmer-bar`} />

                  <div className="space-y-3 pt-1 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          {meta.icon}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{meta.label}</h3>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold tabular-nums ${
                          todayAttempt ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {todayAttempt ? '0/1 lượt hôm nay' : '1/1 lượt hôm nay'}
                      </span>
                    </div>

                    {todayAttempt ? (
                      <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Đã hoàn thành lượt chính thức ({dateKey})</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 tabular-nums">
                          {todayAttempt.mode === 'mcq' ? 'Trắc nghiệm' : 'Tự luận'} ·{' '}
                          <strong className="font-mono text-indigo-600 dark:text-indigo-400">{todayAttempt.score}/100</strong> ·{' '}
                          <span className="font-mono">{formatDuration(todayAttempt.durationSec)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Chọn hình thức thi đấu chính thức hôm nay:
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                          <button
                            onClick={() => setSelectedLobbyMode((prev) => ({ ...prev, [subj]: 'mcq' }))}
                            className={`arena-btn py-2 px-2 rounded-sm text-xs font-bold cursor-pointer border ${
                              chosenMode === 'mcq'
                                ? 'bg-white dark:bg-slate-900 border-indigo-400/70 text-slate-900 dark:text-white shadow-xs'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Trắc nghiệm (5 câu)
                          </button>
                          <button
                            onClick={() => setSelectedLobbyMode((prev) => ({ ...prev, [subj]: 'essay' }))}
                            className={`arena-btn py-2 px-2 rounded-sm text-xs font-bold cursor-pointer border ${
                              chosenMode === 'essay'
                                ? 'bg-white dark:bg-slate-900 border-indigo-400/70 text-slate-900 dark:text-white shadow-xs'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Tự luận (AI Chấm)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 relative z-10">
                    {todayAttempt ? (
                      <div className="text-center py-2 px-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                        Mở lại lượt chính thức sau {resetCountdown}
                      </div>
                    ) : (
                      <button
                        onClick={() => startArenaMatch(subj, chosenMode, false)}
                        className="arena-btn arena-btn-primary cs-deck-btn w-full py-2.5 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 border border-indigo-400/60 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>
                          Thi Chính Thức ({chosenMode === 'mcq' ? 'Trắc nghiệm' : 'Tự luận'})
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => startArenaMatch(subj, 'mcq', true)}
                      className="arena-btn w-full py-2 px-3 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/50 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Đấu Tốc Độ Speedrun 90s (Không giới hạn)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* WEEKLY LEADERBOARD (PODIUM + TOOLBAR + H2H + GHOST DUEL) */}
          <div className="rm-arch-frame arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 sm:p-6 shadow-sm space-y-5">
            <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-amber-500/70" />
            <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-amber-500/70" />
            <div className="arena-beam-sweep" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-2">
                  <div className="w-8 h-8 rounded-sm bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-500 icon-anim-trophy" />
                  </div>
                  <span>
                    Bảng Xếp Hạng ({activeScopedWeekId.split('_')[0]}) · {divisionMeta.labelVi}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-mono">{getWeekDateRangeLabel()}</span>
                  <span>·</span>
                  <span>
                    {isStreamLive ? 'Đồng bộ trực tuyến thời gian thực' : 'Đồng bộ máy chủ'}
                  </span>
                  {divisionStats.topScore > 0 && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400">
                        Cao nhất: {divisionStats.topScore}đ
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
                {[
                  { id: 'overall' as RankFilterTab, label: 'Trung Bình Chung' },
                  { id: 'math' as RankFilterTab, label: 'Toán' },
                  { id: 'physics' as RankFilterTab, label: 'Vật Lí' },
                  { id: 'chemistry' as RankFilterTab, label: 'Hóa Học' },
                  { id: 'biology' as RankFilterTab, label: 'Sinh Học' },
                  { id: 'cs' as RankFilterTab, label: 'Tin Học' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRankTab(t.id)}
                    className={`arena-btn px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap cursor-pointer border ${
                      rankTab === t.id
                        ? 'bg-white dark:bg-slate-900 border-indigo-400/70 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TOP 3 OLYMPIC PODIUM SHOWCASE */}
            {top3Entries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
                {top3Entries.map((row, idx) => {
                  const styleMap = [
                    {
                      badge: '🥇 HẠNG #1',
                      border: 'border-amber-400/80 bg-amber-50/70 dark:bg-amber-950/25',
                      scoreColor: 'text-amber-600 dark:text-amber-300'
                    },
                    {
                      badge: '🥈 HẠNG #2',
                      border: 'border-slate-300 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/40',
                      scoreColor: 'text-slate-700 dark:text-slate-200'
                    },
                    {
                      badge: '🥉 HẠNG #3',
                      border: 'border-orange-300 dark:border-orange-700 bg-orange-50/60 dark:bg-orange-950/25',
                      scoreColor: 'text-orange-600 dark:text-orange-300'
                    }
                  ][idx];

                  return (
                    <div
                      key={row.userId}
                      className={`p-4 rounded-md border flex items-center justify-between gap-3 ${styleMap.border}`}
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono font-extrabold text-slate-600 dark:text-slate-300">
                          {styleMap.badge}
                        </div>
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                          {row.displayName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          @{row.username} · {row.totalAttempts} lượt
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-xl font-extrabold font-mono tabular-nums ${styleMap.scoreColor}`}>
                          {row.overallAvg}đ
                        </div>
                        <button
                          type="button"
                          onClick={() => handleChallengeGhost(row)}
                          className="mt-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Thách đấu Ghost
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Competitive BXH Filter & Action Toolbar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[220px]">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên thí sinh hoặc @username..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={rankSort}
                  onChange={(e) => setRankSort(e.target.value as RankSortMode)}
                  className="px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="overallAvg">Xếp theo: Điểm TB</option>
                  <option value="bestTotal">Xếp theo: Tổng Best 5 môn</option>
                  <option value="fastest">Xếp theo: Tốc độ trung bình</option>
                  <option value="attempts">Xếp theo: Số lượt thi</option>
                </select>

                {availableWeeks.length > 1 && (
                  <select
                    value={activeScopedWeekId}
                    onChange={(e) =>
                      setSelectedWeekOverride(e.target.value === liveScopedWeekId ? null : e.target.value)
                    }
                    className="px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {availableWeeks.map((wk) => (
                      <option key={wk} value={wk}>
                        {wk === liveScopedWeekId ? `${wk.split('_')[0]} (Hiện tại)` : wk.split('_')[0]}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyRivalsFilter((v) => !v)}
                  className={`arena-btn px-2.5 py-1.5 rounded-md border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    onlyRivalsFilter
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Đối thủ ({rivalIds.length})</span>
                </button>

                {myLeaderboardRow.rank && (
                  <button
                    type="button"
                    onClick={() => myRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="arena-btn px-2.5 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold cursor-pointer"
                  >
                    Vị trí của tôi (#{myLeaderboardRow.rank})
                  </button>
                )}

                {mergedLeaderboard.length > 0 && (
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="arena-btn px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer hover:border-indigo-400"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất CSV</span>
                  </button>
                )}
              </div>
            </div>

            {mergedLeaderboard.length === 0 ? (
              <div className="py-10 text-center space-y-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-md relative z-10">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {searchQuery || onlyRivalsFilter
                    ? 'Không tìm thấy thí sinh phù hợp bộ lọc'
                    : `Chưa có thí sinh nào nộp bài trong tuần ${activeScopedWeekId.split('_')[0]}`}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hoàn thành 1 lượt thi Toán, Lí, Hóa, Sinh hoặc Tin học phía trên để ghi danh vào Bảng Xếp Hạng!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto relative z-10 border border-slate-200 dark:border-slate-800 rounded-md">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono">
                      <th className="py-2.5 px-3 font-semibold">Hạng</th>
                      <th className="py-2.5 px-3 font-semibold">Thí sinh</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Toán</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Lí</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Hóa</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Sinh</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Tin</th>
                      <th className="py-2.5 px-3 font-semibold text-right">TB Chung</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Lượt / T.Gian</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {mergedLeaderboard.map((row, idx) => {
                      const isMe = row.userId === activeContestant.uid;
                      const isRival = rivalIds.includes(row.userId);
                      const podiumBg =
                        idx === 0
                          ? 'bg-amber-50/45 dark:bg-amber-950/15'
                          : idx === 1
                          ? 'bg-slate-50/60 dark:bg-slate-800/25'
                          : idx === 2
                          ? 'bg-orange-50/40 dark:bg-orange-950/15'
                          : '';
                      return (
                        <tr
                          key={row.userId}
                          ref={isMe ? myRowRef : undefined}
                          style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                          className={`arena-row-in transition-colors ${
                            isMe
                              ? 'bg-indigo-50/80 dark:bg-indigo-950/35 font-semibold'
                              : `${podiumBg} hover:bg-slate-50 dark:hover:bg-slate-800/45`
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold tabular-nums">
                            <span
                              className={`inline-flex items-center justify-center min-w-[44px] px-2 py-0.5 rounded-sm border text-xs ${
                                idx === 0
                                  ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-300'
                                  : idx === 1
                                  ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                                  : idx === 2
                                  ? 'bg-orange-100 dark:bg-orange-950/60 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-300'
                                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100">
                              {row.displayName}{' '}
                              {isMe && <span className="text-indigo-600 dark:text-indigo-400">(Bạn)</span>}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">@{row.username}</div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">
                            {row.mathAvg !== null ? `${row.mathAvg}đ` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">
                            {row.physicsAvg !== null ? `${row.physicsAvg}đ` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">
                            {row.chemistryAvg !== null && row.chemistryAvg !== undefined ? `${row.chemistryAvg}đ` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">
                            {row.biologyAvg !== null && row.biologyAvg !== undefined ? `${row.biologyAvg}đ` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums">
                            {row.csAvg !== null ? `${row.csAvg}đ` : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            {row.overallAvg}đ
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-xs text-slate-500 tabular-nums">
                            {row.totalAttempts} lượt · {formatDuration(row.totalTimeSec)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {!isMe && (
                              <div className="inline-flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => toggleRival(row.userId)}
                                  title={isRival ? 'Bỏ theo dõi đối thủ' : 'Đánh dấu đối thủ'}
                                  className={`p-1.5 rounded-sm border cursor-pointer ${
                                    isRival
                                      ? 'bg-amber-400/20 border-amber-400 text-amber-500'
                                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-400'
                                  }`}
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setH2hEntry(row)}
                                  className="px-2 py-1 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer whitespace-nowrap"
                                >
                                  So sánh
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleChallengeGhost(row)}
                                  className="px-2 py-1 rounded-sm bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white cursor-pointer whitespace-nowrap"
                                >
                                  Ghost
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* My Weekly Attempts History */}
          {userWeekAttempts.length > 0 && (
            <div className="arena-frame arena-stagger-in bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 rounded-md p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>Nhật ký các lượt thi tuần này của bạn ({userWeekAttempts.length} lượt)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userWeekAttempts.map((att, hIdx) => (
                  <div
                    key={att.id}
                    style={{ animationDelay: `${hIdx * 35}ms` }}
                    className="arena-card-hover arena-row-in p-3 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {subjectMeta[att.subject].label} · {att.mode === 'mcq' ? 'Trắc nghiệm' : 'Tự luận'} · {att.dateKey}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 truncate mt-0.5">{att.summary}</div>
                    </div>
                    <div className="text-right shrink-0 font-mono tabular-nums">
                      <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{att.score}đ</div>
                      <div className="text-[11px] text-slate-400">{formatDuration(att.durationSec)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* HEAD-TO-HEAD (H2H) COMPARISON MODAL */}
      {h2hEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          onClick={() => setH2hEntry(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 sm:p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
                <Swords className="w-5 h-5 text-indigo-500" />
                <span>So Sánh Đối Đầu (Head-to-Head)</span>
              </div>
              <button
                type="button"
                onClick={() => setH2hEntry(null)}
                className="p-1.5 rounded-sm text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-300">BẠN</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                  {activeContestant.displayName}
                </div>
                <div className="text-xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                  {myLeaderboardRow.entry?.overallAvg ?? 0}đ
                </div>
              </div>
              <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="text-xs font-mono text-amber-600 dark:text-amber-300">ĐỐI THỦ</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                  {h2hEntry.displayName}
                </div>
                <div className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
                  {h2hEntry.overallAvg}đ
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {(
                [
                  {
                    label: 'Toán học (TB)',
                    mine: myLeaderboardRow.entry?.mathAvg ?? 0,
                    theirs: h2hEntry.mathAvg ?? 0
                  },
                  {
                    label: 'Vật lí (TB)',
                    mine: myLeaderboardRow.entry?.physicsAvg ?? 0,
                    theirs: h2hEntry.physicsAvg ?? 0
                  },
                  {
                    label: 'Hóa học (TB)',
                    mine: myLeaderboardRow.entry?.chemistryAvg ?? 0,
                    theirs: h2hEntry.chemistryAvg ?? 0
                  },
                  {
                    label: 'Sinh học (TB)',
                    mine: myLeaderboardRow.entry?.biologyAvg ?? 0,
                    theirs: h2hEntry.biologyAvg ?? 0
                  },
                  {
                    label: 'Tin học (TB)',
                    mine: myLeaderboardRow.entry?.csAvg ?? 0,
                    theirs: h2hEntry.csAvg ?? 0
                  }
                ]
              ).map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{metric.mine}đ</span>
                    <span>{metric.label}</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">{metric.theirs}đ</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 h-2">
                    <div className="bg-slate-200 dark:bg-slate-800 rounded-l-sm overflow-hidden flex justify-end">
                      <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, metric.mine)}%` }} />
                    </div>
                    <div className="bg-slate-200 dark:bg-slate-800 rounded-r-sm overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, metric.theirs)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleChallengeGhost(h2hEntry);
                  setH2hEntry(null);
                }}
                className="arena-btn px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Thách đấu Ghost ngay</span>
              </button>
              <button
                type="button"
                onClick={() => setH2hEntry(null)}
                className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
