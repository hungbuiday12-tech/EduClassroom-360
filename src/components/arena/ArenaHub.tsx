import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { safeFetchJson, resolveApiUrl } from '../../lib/apiClient';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  Eye,
  FileText,
  Image as ImageIcon,
  Lock,
  Play,
  Send,
  Sparkles,
  Trophy,
  Users,
  XCircle,
  Zap,
  AlertCircle,
  LogIn
} from 'lucide-react';
import {
  ArenaAttempt,
  ArenaEssayEvaluation,
  ArenaMode,
  ArenaSubject,
  CodeLanguage,
  TutorContextPayload,
  WeeklyLeaderboardEntry
} from '../../types';
import {
  getDailyArenaSet,
  getDailyResetCountdown,
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
}

const LOCAL_ATTEMPTS_KEY = 'educlassroom_arena_attempts_v1';
const GUEST_ARENA_ID_KEY = 'educlassroom_arena_guest_profile_v1';

type RankFilterTab = 'overall' | 'math' | 'physics' | 'cs';

export const ArenaHub: React.FC<ArenaHubProps> = ({ onBack, onEarnXP, onOpenTutor }) => {
  const { user, firebaseUser, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [{ dateKey, weekId }, setTimeParts] = useState(() => getVietnamNowParts());
  const [resetCountdown, setResetCountdown] = useState(() => getDailyResetCountdown());

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

  // Leaderboard & Attempts State
  const [serverLeaderboard, setServerLeaderboard] = useState<WeeklyLeaderboardEntry[]>([]);
  const [firestoreLeaderboard, setFirestoreLeaderboard] = useState<WeeklyLeaderboardEntry[]>([]);
  const [userAttemptsToday, setUserAttemptsToday] = useState<Record<ArenaSubject, ArenaAttempt | null>>({
    math: null,
    physics: null,
    cs: null
  });
  const [userWeekAttempts, setUserWeekAttempts] = useState<ArenaAttempt[]>([]);
  const [rankTab, setRankTab] = useState<RankFilterTab>('overall');
  const [isStreamLive, setIsStreamLive] = useState(false);

  // Active Match State
  const [activeMatch, setActiveMatch] = useState<{
    subject: ArenaSubject;
    mode: ArenaMode;
    startedAt: number;
  } | null>(null);
  const [matchElapsedSec, setMatchElapsedSec] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
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
    cs: 'mcq'
  });

  // Update Vietnam clock & daily reset countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeParts(getVietnamNowParts());
      setResetCountdown(getDailyResetCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Match timer
  useEffect(() => {
    if (!activeMatch || mcqResult || essayResult) return;
    const t = setInterval(() => {
      setMatchElapsedSec(Math.floor((Date.now() - activeMatch.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [activeMatch, mcqResult, essayResult]);

  // Load local cached attempts as immediate hydration + fallback
  const syncLocalAttempts = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      if (!raw) return;
      const all: ArenaAttempt[] = JSON.parse(raw);
      const mineToday: Record<ArenaSubject, ArenaAttempt | null> = {
        math: null,
        physics: null,
        cs: null
      };
      for (const subj of ['math', 'physics', 'cs'] as ArenaSubject[]) {
        mineToday[subj] =
          all.find(
            (a) =>
              a.userId === activeContestant.uid &&
              a.dateKey === dateKey &&
              a.subject === subj
          ) || null;
      }
      setUserAttemptsToday((prev) => ({
        math: prev.math || mineToday.math,
        physics: prev.physics || mineToday.physics,
        cs: prev.cs || mineToday.cs
      }));
      const mineWeek = all.filter(
        (a) => a.userId === activeContestant.uid && a.weekId === weekId
      );
      if (mineWeek.length > 0) {
        setUserWeekAttempts((prev) => (prev.length >= mineWeek.length ? prev : mineWeek));
      }
    } catch {}
  }, [activeContestant.uid, dateKey, weekId]);

  // Fetch initial state from Express server + subscribe to SSE live updates
  const fetchServerState = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        weekId,
        dateKey,
        userId: activeContestant.uid
      });
      const res = await safeFetchJson<any>(`/api/arena/state?${params.toString()}`);
      if (!res.ok || !res.data) return;
      const data = res.data;
      if (Array.isArray(data.leaderboard)) {
        setServerLeaderboard(data.leaderboard);
      }
      if (data.userAttemptsToday) {
        setUserAttemptsToday((prev) => ({
          math: data.userAttemptsToday.math || prev.math,
          physics: data.userAttemptsToday.physics || prev.physics,
          cs: data.userAttemptsToday.cs || prev.cs
        }));
      }
      if (Array.isArray(data.userWeekAttempts)) {
        setUserWeekAttempts(data.userWeekAttempts);
      }
    } catch {}
  }, [weekId, dateKey, activeContestant.uid]);

  useEffect(() => {
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
            if (parsed.type === 'arena:update' && parsed.weekId === weekId && Array.isArray(parsed.leaderboard)) {
              setServerLeaderboard(parsed.leaderboard);
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
  }, [weekId, syncLocalAttempts, fetchServerState]);

  // Subscribe to Firestore weekly_leaderboard when signed in (with handleFirestoreError)
  useEffect(() => {
    if (!firebaseUser) return;
    const lbQuery = query(
      collection(db, 'weekly_leaderboard'),
      where('weekId', '==', weekId)
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
  }, [firebaseUser, weekId]);

  // Merge server + Firestore leaderboards seamlessly
  const mergedLeaderboard = useMemo(() => {
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
    const list = Array.from(map.values());

    if (rankTab === 'overall') {
      return list.sort((a, b) => {
        if (b.overallAvg !== a.overallAvg) return b.overallAvg - a.overallAvg;
        if (b.totalAttempts !== a.totalAttempts) return b.totalAttempts - a.totalAttempts;
        return a.totalTimeSec - b.totalTimeSec;
      });
    }
    if (rankTab === 'math') {
      return list
        .filter((r) => r.mathAvg !== null)
        .sort((a, b) => (b.mathAvg ?? 0) - (a.mathAvg ?? 0) || (b.mathBest ?? 0) - (a.mathBest ?? 0));
    }
    if (rankTab === 'physics') {
      return list
        .filter((r) => r.physicsAvg !== null)
        .sort((a, b) => (b.physicsAvg ?? 0) - (a.physicsAvg ?? 0) || (b.physicsBest ?? 0) - (a.physicsBest ?? 0));
    }
    return list
      .filter((r) => r.csAvg !== null)
      .sort((a, b) => (b.csAvg ?? 0) - (a.csAvg ?? 0) || (b.csBest ?? 0) - (a.csBest ?? 0));
  }, [serverLeaderboard, firestoreLeaderboard, rankTab]);

  const myLeaderboardRow = useMemo(() => {
    const idx = mergedLeaderboard.findIndex((r) => r.userId === activeContestant.uid);
    return {
      rank: idx >= 0 ? idx + 1 : null,
      entry: idx >= 0 ? mergedLeaderboard[idx] : null
    };
  }, [mergedLeaderboard, activeContestant.uid]);

  const handleUpdateGuestName = () => {
    const clean = editingGuestName.trim() || 'Thí sinh Tự do';
    const next = { ...guestIdentity, displayName: clean };
    setGuestIdentity(next);
    try {
      localStorage.setItem(GUEST_ARENA_ID_KEY, JSON.stringify(next));
    } catch {}
  };

  const startArenaMatch = (subject: ArenaSubject, mode: ArenaMode) => {
    if (userAttemptsToday[subject]) return;
    const daily = getDailyArenaSet(subject, dateKey);

    setActiveMatch({ subject, mode, startedAt: Date.now() });
    setMatchElapsedSec(0);
    setMcqAnswers({});
    setMcqResult(null);
    setEssayResult(null);
    setSubmitError(null);
    setEssayImage(null);
    setCsTestOutput(null);
    setShowEssayPreview(false);

    if (mode === 'essay' && subject === 'cs' && daily.essay.sampleCode) {
      setCsLang(daily.essay.sampleCode.language);
      setEssayText(daily.essay.sampleCode.starter);
    } else {
      setEssayText('');
    }
  };

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

    if (res.ok && res.data?.attempt) {
      savedAttempt = res.data.attempt;
      myEntry = res.data.myEntry;
      if (Array.isArray(res.data.leaderboard)) {
        setServerLeaderboard(res.data.leaderboard);
      }
    } else if (res.isStaticFallback || res.status === 0 || res.status === 404 || res.status === 405 || res.status >= 500) {
      // Static-export fallback: compute attempt & weekly row locally
      savedAttempt = {
        ...payload,
        id: `local_${payload.userId}_${payload.dateKey}_${payload.subject}`,
        createdAt: new Date().toISOString()
      };
    } else {
      throw new Error(res.error || 'Không thể lưu điểm thi đấu hôm nay.');
    }

    // Persist locally
    let allLocal: ArenaAttempt[] = [];
    try {
      const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
      const list: ArenaAttempt[] = raw ? JSON.parse(raw) : [];
      allLocal = list.filter(
        (a) =>
          a.id !== savedAttempt.id &&
          !(a.userId === payload.userId && a.dateKey === payload.dateKey && a.subject === payload.subject)
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

    // Sync to Firestore if signed into Firebase
    if (firebaseUser && myEntry) {
      const data = { myEntry };
      const attemptId = `${firebaseUser.uid}_${payload.dateKey}_${payload.subject}`;
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
      const me = data.myEntry as WeeklyLeaderboardEntry;
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

  // Submit MCQ Round
  const handleSubmitMCQ = async () => {
    if (!activeMatch || isSubmittingMatch) return;
    setIsSubmittingMatch(true);
    setSubmitError(null);

    try {
      const { mcqs } = getDailyArenaSet(activeMatch.subject, dateKey);
      let correctCount = 0;
      mcqs.forEach((q) => {
        if (mcqAnswers[q.id] === q.correctIndex) correctCount += 1;
      });
      const score = Math.round((correctCount / mcqs.length) * 100);
      const durationSec = Math.max(5, Math.floor((Date.now() - activeMatch.startedAt) / 1000));

      const attempt = await commitAttemptToBackendAndFirestore({
        userId: activeContestant.uid,
        username: activeContestant.username,
        displayName: activeContestant.displayName,
        weekId,
        dateKey,
        subject: activeMatch.subject,
        mode: 'mcq',
        score,
        correctCount,
        totalQuestions: mcqs.length,
        durationSec,
        summary: `Trắc nghiệm ${correctCount}/${mcqs.length} câu đúng (${score}/100đ)`
      });

      setMcqResult({ attempt, correctCount, total: mcqs.length });
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

  // Run CS sample tests inside Essay mode
  const handleRunCsSampleTests = () => {
    if (!activeMatch) return;
    const { essay } = getDailyArenaSet(activeMatch.subject, dateKey);
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
      const { essay } = getDailyArenaSet(activeMatch.subject, dateKey);

      // Run sandbox tests automatically if CS problem has tests
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

      const attempt = await commitAttemptToBackendAndFirestore({
        userId: activeContestant.uid,
        username: activeContestant.username,
        displayName: activeContestant.displayName,
        weekId,
        dateKey,
        subject: activeMatch.subject,
        mode: 'essay',
        score: evaluation.score,
        durationSec,
        summary: `Tự luận: ${evaluation.score}/100đ · ${evaluation.detailedFeedback.slice(0, 120)}`
      });

      setEssayResult({ attempt, evaluation });
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

  const subjectMeta: Record<
    ArenaSubject,
    { label: string; labelEn: string; accent: string; icon: React.ReactNode }
  > = {
    math: {
      label: 'Toán học',
      labelEn: 'Mathematics',
      accent: 'text-sky-600 dark:text-sky-400',
      icon: <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
    },
    physics: {
      label: 'Vật lí',
      labelEn: 'Physics',
      accent: 'text-amber-600 dark:text-amber-400',
      icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
    },
    cs: {
      label: 'Tin học',
      labelEn: 'Computer Science',
      accent: 'text-emerald-600 dark:text-emerald-400',
      icon: <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // =====================================================================
  // VIEW: ACTIVE MATCH (TRẮC NGHIỆM HOẶC TỰ LUẬN)
  // =====================================================================
  if (activeMatch) {
    const { mcqs, essay } = getDailyArenaSet(activeMatch.subject, dateKey);
    const meta = subjectMeta[activeMatch.subject];

    return (
      <div className="space-y-6">
        {/* Match Top Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveMatch(null)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Arena Lobby' : 'Quay lại Sảnh Đấu Trường'}</span>
            </button>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? meta.labelEn : meta.label} · {activeMatch.mode === 'mcq' ? (isEn ? 'Speed MCQ' : 'Trắc nghiệm tốc độ') : (isEn ? 'Deep Essay' : 'Tự luận chuyên sâu')} · {dateKey}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {activeMatch.mode === 'mcq' ? (isEn ? `Daily Paper ${dateKey} (${mcqs.length} Qs)` : `Bộ đề ngày ${dateKey} (${mcqs.length} câu)`) : essay.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 tabular-nums">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{formatDuration(matchElapsedSec)}</span>
            </div>
            <button
              onClick={() =>
                onOpenTutor({
                  subject: activeMatch.subject,
                  topicTitle: activeMatch.mode === 'mcq' ? `${isEn ? 'Arena' : 'Thi đấu'} ${isEn ? meta.labelEn : meta.label}` : essay.title,
                  problemStatement:
                    activeMatch.mode === 'essay'
                      ? essay.prompt
                      : mcqs.map((q, idx) => `Câu ${idx + 1}: ${q.question}`).join('\n')
                })
              }
              className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Hint via Syn AI' : 'Hỏi Syn AI'}</span>
            </button>
          </div>
        </div>

        {/* MCQ MODE */}
        {activeMatch.mode === 'mcq' && (
          <div className="space-y-4">
            {mcqResult && (
              <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-amber-300 font-semibold">
                    {isEn ? `Official Today (${dateKey}) · Recorded on ${weekId} Leaderboard` : `Kết quả chính thức hôm nay (${dateKey}) · Đã ghi nhận vào BXH ${weekId}`}
                  </div>
                  <h3 className="text-2xl font-extrabold tabular-nums">
                    {isEn ? `Score: ${mcqResult.attempt.score}/100 (${mcqResult.correctCount}/${mcqResult.total} correct)` : `Điểm số: ${mcqResult.attempt.score}/100 (${mcqResult.correctCount}/{mcqResult.total} câu đúng)`}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isEn
                      ? `Completion time: ${formatDuration(mcqResult.attempt.durationSec)} · Today's ${meta.labelEn} attempt is locked until 00:00 tomorrow.`
                      : `Thời gian hoàn thành: ${formatDuration(mcqResult.attempt.durationSec)} · Lượt thi môn ${meta.label} hôm nay đã khóa đến 00:00 ngày mai.`}
                  </p>
                </div>
                <button
                  onClick={() => setActiveMatch(null)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shrink-0"
                >
                  {isEn ? 'View Weekly Leaderboard' : 'Xem Bảng Xếp Hạng Tuần'}
                </button>
              </div>
            )}

            {mcqs.map((q, idx) => {
              const picked = mcqAnswers[q.id];
              const isSubmitted = Boolean(mcqResult);
              const isRight = picked === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {isEn ? `Question ${idx + 1}` : `Câu ${idx + 1}`} · {q.grade}
                    </span>
                    <span className="tabular-nums font-mono">{q.points} {isEn ? 'pts' : 'điểm'}</span>
                  </div>

                  <div className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
                    <FormattedText text={q.question} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const selected = picked === optIdx;
                      let stateStyle =
                        'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-indigo-400';

                      if (isSubmitted) {
                        if (optIdx === q.correctIndex) {
                          stateStyle =
                            'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                        } else if (selected && optIdx !== q.correctIndex) {
                          stateStyle =
                            'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                        }
                      } else if (selected) {
                        stateStyle =
                          'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-all ${stateStyle}`}
                        >
                          <span className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <div className="flex-1 pt-0.5">
                            <FormattedText text={opt} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold flex items-center gap-1.5 ${
                            isRight ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isRight ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {isRight
                            ? (isEn ? 'Correct' : 'Chính xác')
                            : (isEn ? `Incorrect (Answer: ${String.fromCharCode(65 + q.correctIndex)})` : `Chưa đúng (Đáp án: ${String.fromCharCode(65 + q.correctIndex)})`)}
                        </span>
                        {!isRight && (
                          <button
                            onClick={() =>
                              onOpenTutor({
                                subject: activeMatch.subject,
                                topicTitle: `${isEn ? 'Question' : 'Câu'} ${idx + 1} (${q.grade})`,
                                problemStatement: `${q.question}\nCác lựa chọn: ${q.options.join(' | ')}`
                              })
                            }
                            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Ask Syn AI to explain' : 'Hỏi Syn AI giảng lại câu này'}</span>
                          </button>
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
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {!mcqResult && (
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {isEn ? `Selected ${Object.keys(mcqAnswers).length}/${mcqs.length} questions` : `Đã chọn ${Object.keys(mcqAnswers).length}/${mcqs.length} câu`}
                </span>
                <button
                  onClick={handleSubmitMCQ}
                  disabled={isSubmittingMatch}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmittingMatch
                      ? (isEn ? 'Submitting & ranking...' : 'Đang nộp & xếp hạng...')
                      : (isEn ? "Submit Today's Round" : 'Nộp Bài Thi Hôm Nay')}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESSAY MODE (TỰ LUẬN / CODE) */}
        {activeMatch.mode === 'essay' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Prompt & Official Rubric */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {essay.grade} · {isEn ? '100-point Scale' : 'Thang điểm 100'}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{essay.title}</h3>
                <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  <FormattedText text={essay.prompt} />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isEn ? 'Essay Grading Rubric:' : 'Biểu điểm chấm Tự luận:'}
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

            {/* Right: Answer Composer & Grading Result */}
            <div className="lg:col-span-7 space-y-4">
              {essayResult ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
                  <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-amber-300 font-semibold">
                        {isEn ? `Official Essay Score (${dateKey})` : `Điểm Tự Luận Chính Thức (${dateKey})`}
                      </div>
                      <div className="text-3xl font-extrabold tabular-nums mt-1">
                        {essayResult.evaluation.score} / 100 {isEn ? 'pts' : 'điểm'}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveMatch(null)}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold"
                    >
                      {isEn ? 'View Weekly Leaderboard' : 'Xem Bảng Xếp Hạng Tuần'}
                    </button>
                  </div>

                  {/* Step Rubric Breakdown */}
                  {essayResult.evaluation.stepScores.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Chi tiết chấm theo từng ý:
                      </h4>
                      <div className="space-y-2">
                        {essayResult.evaluation.stepScores.map((st, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
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
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300">Điểm làm tốt:</div>
                      {essayResult.evaluation.strengths.map((s, i) => (
                        <div key={i} className="text-slate-700 dark:text-slate-300">
                          • <FormattedText text={s} />
                        </div>
                      ))}
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1.5">
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

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>{isEn ? 'Your Essay Solution' : 'Bài Làm Tự Luận Của Bạn'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeMatch.subject === 'cs' && (
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                          {(['cpp', 'python'] as CodeLanguage[]).map((lg) => (
                            <button
                              key={lg}
                              onClick={() => setCsLang(lg)}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
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
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showEssayPreview ? 'Soạn thảo' : 'Xem trước KaTeX'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Math/Physics Symbol Bar */}
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
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          + {sym.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {showEssayPreview ? (
                    <div className="min-h-[220px] p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
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
                      className={`w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 ${
                        activeMatch.subject === 'cs' ? 'font-mono text-xs' : 'text-sm'
                      }`}
                    />
                  )}

                  {/* CS Code Sandbox Preview Runner */}
                  {activeMatch.subject === 'cs' && essay.sampleCode && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleRunCsSampleTests}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Chạy thử {essay.sampleCode.tests.length} test mẫu</span>
                      </button>
                      {csTestOutput && (
                        <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] whitespace-pre-wrap border border-slate-800">
                          {csTestOutput}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Optional handwritten image upload */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                      <ImageIcon className="w-4 h-4 text-indigo-500" />
                      <span>
                        {essayImage
                          ? (isEn ? 'Handwritten Photo Attached' : 'Đã đính kèm ảnh bài làm')
                          : (isEn ? 'Or upload handwritten photo' : 'Hoặc tải ảnh bài viết giấy')}
                      </span>
                      <input type="file" accept="image/*" onChange={handleEssayImagePick} className="hidden" />
                    </label>

                    <button
                      onClick={handleSubmitEssay}
                      disabled={isSubmittingMatch}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {isSubmittingMatch
                          ? (isEn ? 'Syn AI Grading...' : 'Syn AI đang chấm...')
                          : (isEn ? 'Submit for AI Grading' : 'Nộp Chấm Tự Luận')}
                      </span>
                    </button>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
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
  // VIEW: ARENA LOBBY + DAILY LOCKS + WEEKLY LEADERBOARD
  // =====================================================================
  return (
    <div className="space-y-6">
      {/* Top Arena Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
            </button>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isEn
                ? 'Weekly Online Academic Arena & Leaderboard'
                : 'Đấu Trường Giải Bài Online & Xếp Hạng Tuần'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {isEn
                ? 'Compete in Multiple Choice or Essay rounds. Limit: 1 official round per subject per day · Live weekly ranking by subject & overall average.'
                : 'Chọn thi Trắc nghiệm tốc độ hoặc Tự luận có giám khảo AI chấm điểm. Mỗi ngày được thi tối đa 1 lần/môn · Xếp hạng theo tuần từng môn và Điểm Trung Bình.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100">
                {weekId} · {getWeekDateRangeLabel()}
              </div>
              <div className="text-slate-500 dark:text-slate-400 tabular-nums flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEn ? `Next daily reset in: ${resetCountdown}` : `Mở lượt ngày mới sau: ${resetCountdown}`}</span>
              </div>
            </div>

            {!user && (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>{isEn ? 'Sign In to Save Rank' : 'Đăng nhập lưu hạng'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Contestant Name Bar (when playing as guest) */}
        {!user && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Bạn đang thi đấu với tên hiển thị khách (hoặc đăng nhập tài khoản để đồng bộ đa thiết bị):
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingGuestName}
                onChange={(e) => setEditingGuestName(e.target.value)}
                maxLength={40}
                className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
              <button
                onClick={handleUpdateGuestName}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Lưu tên
              </button>
            </div>
          </div>
        )}
      </div>

      {/* My Weekly Performance KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isEn ? 'Weekly Avg / Rank' : 'Điểm TB Tuần / Hạng'}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
            {myLeaderboardRow.entry ? `${myLeaderboardRow.entry.overallAvg}${isEn ? 'pt' : 'đ'}` : '—'}
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 ml-2">
              {myLeaderboardRow.rank ? `#${myLeaderboardRow.rank}` : (isEn ? 'Unranked' : 'Chưa có hạng')}
            </span>
          </div>
        </div>

        {(['math', 'physics', 'cs'] as ArenaSubject[]).map((subj) => {
          const avg =
            subj === 'math'
              ? myLeaderboardRow.entry?.mathAvg
              : subj === 'physics'
              ? myLeaderboardRow.entry?.physicsAvg
              : myLeaderboardRow.entry?.csAvg;
          const best =
            subj === 'math'
              ? myLeaderboardRow.entry?.mathBest
              : subj === 'physics'
              ? myLeaderboardRow.entry?.physicsBest
              : myLeaderboardRow.entry?.csBest;
          const meta = subjectMeta[subj];
          return (
            <div
              key={subj}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{isEn ? `${meta.labelEn} (Weekly Avg)` : `${meta.label} (TB tuần)`}</span>
                {meta.icon}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                {avg !== null && avg !== undefined ? `${avg}${isEn ? 'pt' : 'đ'}` : '—'}
                {best !== null && best !== undefined && (
                  <span className="text-xs font-medium text-slate-500 ml-2">Max {best}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Arena Subject Cards (1 Attempt / Day / Subject) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(['math', 'physics', 'cs'] as ArenaSubject[]).map((subj) => {
          const meta = subjectMeta[subj];
          const todayAttempt = userAttemptsToday[subj];
          const chosenMode = selectedLobbyMode[subj];

          return (
            <div
              key={subj}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {meta.icon}
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {isEn ? meta.labelEn : meta.label}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      todayAttempt ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {todayAttempt
                      ? (isEn ? '0/1 today' : '0/1 lượt hôm nay')
                      : (isEn ? '1/1 today' : '1/1 lượt hôm nay')}
                  </span>
                </div>

                {todayAttempt ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isEn ? `Completed today's round (${dateKey})` : `Đã hoàn thành lượt thi hôm nay (${dateKey})`}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 tabular-nums">
                      {isEn ? 'Mode:' : 'Hình thức:'}{' '}
                      {todayAttempt.mode === 'mcq' ? (isEn ? 'MCQ' : 'Trắc nghiệm') : (isEn ? 'Essay' : 'Tự luận')} ·{' '}
                      {isEn ? 'Score:' : 'Điểm:'}{' '}
                      <strong className="text-indigo-600 dark:text-indigo-400">{todayAttempt.score}/100</strong> ·{' '}
                      {formatDuration(todayAttempt.durationSec)}
                    </div>
                    <div className="text-[11px] text-slate-500">{todayAttempt.summary}</div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {isEn ? "Select round mode for today's single attempt:" : 'Chọn hình thức thi đấu cho lượt duy nhất hôm nay:'}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      <button
                        onClick={() => setSelectedLobbyMode((prev) => ({ ...prev, [subj]: 'mcq' }))}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${
                          chosenMode === 'mcq'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isEn ? 'MCQ (5 Qs)' : 'Trắc nghiệm (5 câu)'}
                      </button>
                      <button
                        onClick={() => setSelectedLobbyMode((prev) => ({ ...prev, [subj]: 'essay' }))}
                        className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors ${
                          chosenMode === 'essay'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isEn ? 'Essay (AI Graded)' : 'Tự luận (AI Chấm)'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {todayAttempt ? (
                <div className="text-center py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                  {isEn ? `Reopens in ${resetCountdown}` : `Mở lại sau ${resetCountdown}`}
                </div>
              ) : (
                <button
                  onClick={() => startArenaMatch(subj, chosenMode)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {isEn
                      ? `Start ${chosenMode === 'mcq' ? 'MCQ' : 'Essay'} (${meta.labelEn})`
                      : `Bắt đầu thi ${chosenMode === 'mcq' ? 'Trắc nghiệm' : 'Tự luận'} (${meta.label})`}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* WEEKLY LEADERBOARD (MULTI-SUBJECT + OVERALL AVERAGE) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>{isEn ? `Weekly Leaderboard (${weekId})` : `Bảng Xếp Hạng Thành Tích Tuần (${weekId})`}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{getWeekDateRangeLabel()}</span>
              <span aria-hidden="true">·</span>
              <span>
                {isStreamLive
                  ? (isEn ? 'Live Real-Time Sync' : 'Đồng bộ trực tuyến thời gian thực')
                  : (isEn ? 'Server Sync' : 'Đồng bộ máy chủ')}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {[
              { id: 'overall' as RankFilterTab, label: isEn ? 'Overall Avg' : 'Trung Bình Chung' },
              { id: 'math' as RankFilterTab, label: isEn ? 'Math' : 'Môn Toán' },
              { id: 'physics' as RankFilterTab, label: isEn ? 'Physics' : 'Môn Vật Lí' },
              { id: 'cs' as RankFilterTab, label: isEn ? 'CS' : 'Môn Tin Học' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setRankTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  rankTab === t.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {mergedLeaderboard.length === 0 ? (
          <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isEn ? `No submissions yet for week ${weekId}` : `Chưa có thí sinh nào nộp bài trong tuần ${weekId}`}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Complete 1 round in Math, Physics, or CS above to claim the #1 rank this week!'
                : 'Hãy hoàn thành 1 lượt thi Toán, Vật lí hoặc Tin học ở phía trên để ghi danh vị trí #1 đầu tiên của tuần!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Rank' : 'Hạng'}</th>
                  <th className="py-2.5 px-3 font-semibold">{isEn ? 'Contestant' : 'Thí sinh'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'Math (Avg)' : 'Toán (TB)'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'Physics (Avg)' : 'Vật lí (TB)'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'CS (Avg)' : 'Tin học (TB)'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'Overall' : 'TB Chung'}</th>
                  <th className="py-2.5 px-3 font-semibold text-right">{isEn ? 'Rounds / Time' : 'Lượt / Thời gian'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {mergedLeaderboard.map((row, idx) => {
                  const isMe = row.userId === activeContestant.uid;
                  return (
                    <tr
                      key={row.userId}
                      className={
                        isMe
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }
                    >
                      <td className="py-3 px-3 font-mono font-bold tabular-nums">
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {row.displayName} {isMe && <span className="text-indigo-600 dark:text-indigo-400">(Bạn)</span>}
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
                        {row.csAvg !== null ? `${row.csAvg}đ` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {row.overallAvg}đ
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-xs text-slate-500 tabular-nums">
                        {row.totalAttempts} lượt · {formatDuration(row.totalTimeSec)}
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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500" />
            <span>
              {isEn
                ? `Your Weekly Attempts Log (${userWeekAttempts.length} rounds)`
                : `Nhật ký các lượt thi tuần này của bạn (${userWeekAttempts.length} lượt)`}
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userWeekAttempts.map((att) => (
              <div
                key={att.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
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
    </div>
  );
};
