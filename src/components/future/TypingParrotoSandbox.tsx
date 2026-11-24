import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Clock,
  Crown,
  FileText,
  Flame,
  Heart,
  Keyboard,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Snowflake,
  Sparkles,
  Swords,
  Target,
  Upload,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PerformanceMode, useBackgroundTheme } from '../../context/BackgroundContext';
import { ClickSoundId, soundEngine } from '../../lib/soundEngine';
import {
  BossEncounterConfig,
  SPRINT_WORD_TARGETS,
  TIMED_PASSAGES,
  TYPING_DIFFICULTIES,
  TYPING_MEDALS,
  TYPING_RUN_FORMATS,
  TYPING_SOUND_PROFILES,
  TYPING_TOPICS,
  TypingDifficulty,
  TypingRunFormat,
  TypingSoundProfile,
  TypingTopicId,
  buildSmartDrillPassage,
  computeSuggestedTimeSec,
  formatCodeShortLabel,
  getBossForTopic,
  getWordsForTopicAndDifficulty,
  mapCharToPhysicalCode,
} from '../../data/typingSandboxData';
import { TypingArenaBackdrop } from './TypingArenaBackdrop';
import { MiniLiveKeyboard } from './MiniLiveKeyboard';
import {
  VietnameseImeMode,
  applyBuiltInVietnameseIme,
  matchesVietnamesePrefix,
} from '../../lib/vietnameseIme';

interface TypingParrotoSandboxProps {
  onEarnXP?: (xp: number) => void;
}

type SandboxMode = 'arcade' | 'timed_passage';
type GamePhase = 'MENU' | 'PLAYING' | 'PAUSED' | 'RESULTS';
type WordKind = 'normal' | 'gold' | 'heal' | 'boss';

interface FlyingWord {
  id: number;
  text: string;
  lane: 0 | 1 | 2;
  xPct: number; // 94 -> 5
  speedPctPerSec: number;
  kind: WordKind;
}

interface ActiveBossState {
  config: BossEncounterConfig;
  phaseIdx: number;
}

interface FloatingDelta {
  id: number;
  label: string;
  xPct: number;
  lane: number;
  tone: 'emerald' | 'amber' | 'rose' | 'cyan';
}

interface StoredTypingRecords {
  bestArcadeScore: Record<TypingDifficulty, number>;
  bestWpm: Record<TypingDifficulty, number>;
  totalWordsCleared: number;
  unlockedMedals: string[];
}

const STORAGE_KEY = 'synapse_parroto_typing_records_v1';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadRecords(): StoredTypingRecords {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredTypingRecords>;
      return {
        bestArcadeScore: {
          easy: parsed.bestArcadeScore?.easy || 0,
          normal: parsed.bestArcadeScore?.normal || 0,
          hard: parsed.bestArcadeScore?.hard || 0,
        },
        bestWpm: {
          easy: parsed.bestWpm?.easy || 0,
          normal: parsed.bestWpm?.normal || 0,
          hard: parsed.bestWpm?.hard || 0,
        },
        totalWordsCleared: parsed.totalWordsCleared || 0,
        unlockedMedals: Array.isArray(parsed.unlockedMedals) ? parsed.unlockedMedals : [],
      };
    }
  } catch {}
  return {
    bestArcadeScore: { easy: 0, normal: 0, hard: 0 },
    bestWpm: { easy: 0, normal: 0, hard: 0 },
    totalWordsCleared: 0,
    unlockedMedals: [],
  };
}

function saveRecords(rec: StoredTypingRecords): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
  } catch {}
}

const ParrotoMascot: React.FC<{
  mood: 'idle' | 'happy' | 'fever' | 'hurt';
  animate: boolean;
}> = ({ mood, animate }) => {
  const crestColor =
    mood === 'fever' ? '#fbbf24' : mood === 'hurt' ? '#fb7185' : '#38bdf8';
  const bodyColor =
    mood === 'fever' ? '#f59e0b' : mood === 'hurt' ? '#e11d48' : '#10b981';
  const wingColor =
    mood === 'fever' ? '#fde047' : mood === 'hurt' ? '#fda4af' : '#0ea5e9';

  return (
    <div
      className={`relative w-11 h-11 shrink-0 flex items-center justify-center ${
        mood === 'hurt'
          ? 'typing-shake-x'
          : animate
          ? 'parroto-mascot-flap'
          : ''
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md">
        {mood === 'fever' && (
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#fbbf24"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}
        {/* Crest feathers */}
        <path d="M26 15 C22 7, 30 6, 33 13 C36 6, 42 8, 38 16 Z" fill={crestColor} />
        {/* Body */}
        <ellipse cx="32" cy="36" rx="15" ry="18" fill={bodyColor} />
        {/* Wing */}
        <path
          d={
            mood === 'fever'
              ? 'M18 33 C8 25, 9 43, 21 44 Z'
              : 'M20 34 C14 38, 16 49, 25 46 Z'
          }
          fill={wingColor}
        />
        {/* Belly */}
        <ellipse cx="34" cy="40" rx="9" ry="11" fill="#ecfeff" fillOpacity="0.92" />
        {/* Eye patch + Eye */}
        <circle cx="37" cy="24" r="5.5" fill="#ffffff" />
        <circle cx="38.5" cy="24" r="2.6" fill="#0f172a" />
        <circle cx="39.3" cy="23.1" r="0.9" fill="#ffffff" />
        {/* Beak */}
        <path d="M43 24 L53 27 L43 32 Z" fill="#f59e0b" />
        <path d="M43 28 L49 30 L43 32 Z" fill="#d97706" />
      </svg>
    </div>
  );
};

export const TypingParrotoSandbox: React.FC<TypingParrotoSandboxProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode, applyGraphicsTier } = useBackgroundTheme();

  // Persistent Records & Audio Preferences
  const [records, setRecords] = useState<StoredTypingRecords>(loadRecords);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundProfile, setSoundProfile] = useState<TypingSoundProfile['id']>('mech_switch');
  const [showNextHint, setShowNextHint] = useState(true);
  const [imeMode, setImeMode] = useState<VietnameseImeMode>('telex');

  // Core Configuration State
  const [mode, setMode] = useState<SandboxMode>('arcade');
  const [runFormat, setRunFormat] = useState<TypingRunFormat>('campaign');
  const [difficulty, setDifficulty] = useState<TypingDifficulty>('normal');
  const [topic, setTopic] = useState<TypingTopicId>('random_mix');
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [practiceMissedPool, setPracticeMissedPool] = useState<string[]>([]);
  const [useMissedOnly, setUseMissedOnly] = useState(false);

  // Live Backdrop Reactors
  const [burstTick, setBurstTick] = useState(0);
  const [errorTick, setErrorTick] = useState(0);
  const [lastErrorChar, setLastErrorChar] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<'idle' | 'happy' | 'fever' | 'hurt'>('idle');

  // Common Metrics
  const [wpm, setWpm] = useState(0);
  const [peakWpm, setPeakWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [keyErrorCounts, setKeyErrorCounts] = useState<Record<string, number>>({});
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [newMedalsThisRound, setNewMedalsThisRound] = useState<string[]>([]);

  // Arcade Specific State (Waves, Boss, Overdrive, Time Attack)
  const [words, setWords] = useState<FlyingWord[]>([]);
  const [lockedWordId, setLockedWordId] = useState<number | null>(null);
  const [arcadeInput, setArcadeInput] = useState('');
  const [hearts, setHearts] = useState(TYPING_DIFFICULTIES.normal.hearts);
  const [clearedWordsCount, setClearedWordsCount] = useState(0);
  const [missedWordsList, setMissedWordsList] = useState<string[]>([]);
  const [deltas, setDeltas] = useState<FloatingDelta[]>([]);
  const [freezeRemainingSec, setFreezeRemainingSec] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [powerCharges, setPowerCharges] = useState({ freeze: 1, emp: 1, shield: 1 });
  const [inputShake, setInputShake] = useState(false);
  const [campaignWave, setCampaignWave] = useState<1 | 2 | 3>(1);
  const [waveBanner, setWaveBanner] = useState<string | null>(null);
  const [activeBoss, setActiveBoss] = useState<ActiveBossState | null>(null);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [arcadeVictory, setArcadeVictory] = useState<boolean | null>(null);
  const [arcadeTimeLeftSec, setArcadeTimeLeftSec] = useState(60);
  const [overdrivePct, setOverdrivePct] = useState(0);
  const [overdriveActive, setOverdriveActive] = useState(false);
  const [ghostWordsProgress, setGhostWordsProgress] = useState(0);

  // Timed Passage Specific State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(TIMED_PASSAGES[0].id);
  const [passageText, setPassageText] = useState<string>(TIMED_PASSAGES[0].text);
  const [customFilename, setCustomFilename] = useState<string | null>(null);
  const [showPassageEditor, setShowPassageEditor] = useState(false);
  const [useCustomTimer, setUseCustomTimer] = useState(false);
  const [customSeconds, setCustomSeconds] = useState<number>(() =>
    computeSuggestedTimeSec(TIMED_PASSAGES[0].text, 'normal')
  );
  const [timeLeftSec, setTimeLeftSec] = useState<number>(() =>
    computeSuggestedTimeSec(TIMED_PASSAGES[0].text, 'normal')
  );
  const [passageTyped, setPassageTyped] = useState('');
  const [waitingFirstKey, setWaitingFirstKey] = useState(true);
  const [passagePassed, setPassagePassed] = useState<boolean | null>(null);
  const [strictErrorLock, setStrictErrorLock] = useState(false);

  // Refs for High-Frequency Loops, Shuffle-Bag Deck & IME Safety
  const arcadeInputRef = useRef<HTMLInputElement | null>(null);
  const passageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const passageActiveCharRef = useRef<HTMLSpanElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isComposingRef = useRef(false);
  const userPickedImeRef = useRef(false);
  const lastCommittedArcadeRef = useRef('');
  const lastCommittedPassageRef = useRef('');
  const wordDeckRef = useRef<string[]>([]);
  const recentWordsRef = useRef<string[]>([]);

  const wordIdSeqRef = useRef(1);
  const deltaSeqRef = useRef(1);
  const wordsRef = useRef<FlyingWord[]>([]);
  wordsRef.current = words;
  const lockedWordIdRef = useRef<number | null>(lockedWordId);
  lockedWordIdRef.current = lockedWordId;
  const activeBossRef = useRef<ActiveBossState | null>(activeBoss);
  activeBossRef.current = activeBoss;

  const statsRef = useRef({
    startTimeMs: 0,
    correctChars: 0,
    totalKeystrokes: 0,
    errorCount: 0,
    combo: 0,
    maxCombo: 0,
    peakWpm: 0,
    score: 0,
    cleared: 0,
    hearts: 4,
    freezeSec: 0,
    shieldActive: false,
    overdrivePct: 0,
    overdriveSec: 0,
    everOverdrive: false,
    campaignWave: 1 as 1 | 2 | 3,
    bossSpawned: false,
    bossDefeated: false,
    xpAwardedForRound: false,
  });

  const diffCfg = TYPING_DIFFICULTIES[difficulty];
  const effectiveTimeLimitSec = useMemo(() => {
    if (useCustomTimer) return Math.max(15, Math.min(600, customSeconds));
    return computeSuggestedTimeSec(passageText, difficulty);
  }, [useCustomTimer, customSeconds, passageText, difficulty]);

  useEffect(() => {
    if (!useCustomTimer && phase === 'MENU') {
      const next = computeSuggestedTimeSec(passageText, difficulty);
      setCustomSeconds(next);
      setTimeLeftSec(next);
    }
  }, [passageText, difficulty, useCustomTimer, phase]);

  const playSfx = useCallback(
    (type: 'hit' | 'clear' | 'error' | 'power') => {
      if (!soundEnabled) return;
      if (type === 'hit') soundEngine.playClick(soundProfile as ClickSoundId, 0.42);
      else if (type === 'clear') soundEngine.playClick('crystal_ping', 0.55);
      else if (type === 'power') soundEngine.playClick('holo_pulse', 0.62);
      else soundEngine.playClick('wood_tap', 0.48);
    },
    [soundEnabled, soundProfile]
  );

  const showBanner = useCallback((msg: string) => {
    setWaveBanner(msg);
    window.setTimeout(() => {
      setWaveBanner((cur) => (cur === msg ? null : cur));
    }, 2200);
  }, []);

  const pushDelta = useCallback(
    (label: string, xPct: number, lane: number, tone: FloatingDelta['tone']) => {
      if (perfMode === 'smooth') return;
      const id = deltaSeqRef.current++;
      setDeltas((prev) => [...prev.slice(-8), { id, label, xPct, lane, tone }]);
      window.setTimeout(() => {
        setDeltas((prev) => prev.filter((d) => d.id !== id));
      }, 850);
    },
    [perfMode]
  );

  // Spawn Boss Encounter
  const spawnBossWord = useCallback(() => {
    if (statsRef.current.bossSpawned) return;
    statsRef.current.bossSpawned = true;
    const bossCfg = getBossForTopic(topic, difficulty, isEn);
    const nextBossState: ActiveBossState = { config: bossCfg, phaseIdx: 0 };
    setActiveBoss(nextBossState);
    activeBossRef.current = nextBossState;

    const firstPhrase = bossCfg.phases[0] || 'quantum core';
    const basePctPerSec = (diffCfg.baseSpeedPxPerSec / 7.5) * 0.42;

    const bossToken: FlyingWord = {
      id: wordIdSeqRef.current++,
      text: firstPhrase,
      lane: 1,
      xPct: 92,
      speedPctPerSec: basePctPerSec,
      kind: 'boss',
    };
    setWords([bossToken]);
    setLockedWordId(null);
    setArcadeInput('');
    lastCommittedArcadeRef.current = '';
    playSfx('power');
    showBanner(isEn ? bossCfg.titleEn : bossCfg.titleVi);
  }, [topic, difficulty, isEn, diffCfg.baseSpeedPxPerSec, playSfx, showBanner]);

  // Non-Repeating Shuffle-Bag Word Spawner
  const spawnWord = useCallback(() => {
    if (statsRef.current.bossSpawned) return;

    const current = wordsRef.current;
    if (current.length >= diffCfg.maxOnScreen) return;

    // Campaign wave completion gates: 8 (W1) + 10 (W2) + 8 (W3) = 26 -> spawn Boss!
    if (mode === 'arcade' && runFormat === 'campaign') {
      const pendingPlusCleared = statsRef.current.cleared + current.length;
      if (pendingPlusCleared >= 26) {
        return;
      }
    }
    // Sprint completion gate: don't over-spawn past target
    if (mode === 'arcade' && runFormat === 'sprint') {
      const sprintTarget = SPRINT_WORD_TARGETS[difficulty];
      if (statsRef.current.cleared + current.length >= sprintTarget) {
        return;
      }
    }

    const rawPool =
      useMissedOnly && practiceMissedPool.length > 0
        ? practiceMissedPool
        : getWordsForTopicAndDifficulty(topic, difficulty);
    const uniquePool = Array.from(new Set(rawPool));
    if (!uniquePool.length) return;

    const activeTexts = new Set(current.map((w) => w.text));

    // Refill deck using Fisher-Yates excluding active & recently spawned words
    if (wordDeckRef.current.length === 0) {
      const recentSet = new Set(recentWordsRef.current);
      const fresh = uniquePool.filter((t) => !activeTexts.has(t) && !recentSet.has(t));
      const fallback = uniquePool.filter((t) => !activeTexts.has(t));
      const chosenPool = fresh.length >= 6 ? fresh : fallback.length > 0 ? fallback : uniquePool;
      wordDeckRef.current = shuffleArray(chosenPool);
    }

    // Pop next word from deck that isn't currently on screen
    let pickedIdx = wordDeckRef.current.findIndex((t) => !activeTexts.has(t));
    if (pickedIdx < 0) {
      const fallback = uniquePool.filter((t) => !activeTexts.has(t));
      wordDeckRef.current = shuffleArray(fallback.length > 0 ? fallback : uniquePool);
      pickedIdx = 0;
    }
    const [text] = wordDeckRef.current.splice(pickedIdx, 1);

    const historyLimit = Math.min(26, Math.max(8, Math.floor(uniquePool.length * 0.65)));
    recentWordsRef.current = [...recentWordsRef.current.slice(-(historyLimit - 1)), text];

    const laneCounts: [number, number, number] = [0, 0, 0];
    current.forEach((w) => {
      laneCounts[w.lane]++;
    });
    const minCount = Math.min(...laneCounts);
    const availableLanes = ([0, 1, 2] as const).filter((l) => laneCounts[l] === minCount);
    const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

    // Decide word special type (Gold Overcharge or Heal Medkit)
    let kind: WordKind = 'normal';
    if (statsRef.current.cleared >= 2) {
      if (statsRef.current.hearts < diffCfg.hearts && Math.random() < 0.14) {
        kind = 'heal';
      } else if (Math.random() < 0.14) {
        kind = 'gold';
      }
    }

    const waveBoost = statsRef.current.campaignWave === 3 ? 1.18 : statsRef.current.campaignWave === 2 ? 1.09 : 1;
    const ramp = (1 + Math.min(0.65, statsRef.current.cleared * 0.012)) * waveBoost;
    const basePctPerSec = (diffCfg.baseSpeedPxPerSec / 7.5) * ramp;

    const newWord: FlyingWord = {
      id: wordIdSeqRef.current++,
      text,
      lane,
      xPct: 95,
      speedPctPerSec: basePctPerSec * (0.9 + Math.random() * 0.2),
      kind,
    };
    setWords((prev) => [...prev, newWord]);
  }, [topic, difficulty, diffCfg, mode, runFormat, useMissedOnly, practiceMissedPool]);

  const finishRound = useCallback(
    (passedFlag: boolean | null = null) => {
      setPhase('RESULTS');
      setPassagePassed(passedFlag);
      if (mode === 'arcade') {
        setArcadeVictory(passedFlag);
      }

      const st = statsRef.current;
      const elapsedMin = Math.max(0.08, (Date.now() - st.startTimeMs) / 60000);
      const finalWpm = Math.max(0, Math.round(st.correctChars / 5 / elapsedMin));
      const finalRaw = Math.max(finalWpm, Math.round(st.totalKeystrokes / 5 / elapsedMin));
      const finalAcc =
        st.totalKeystrokes > 0
          ? Math.max(
              0,
              Math.min(100, Math.round(((st.totalKeystrokes - st.errorCount) / st.totalKeystrokes) * 100))
            )
          : 100;

      setWpm(finalWpm);
      setPeakWpm(Math.max(st.peakWpm, finalWpm));
      setRawWpm(finalRaw);
      setAccuracy(finalAcc);

      // Evaluate Medals earned this round
      const earnedNow: string[] = [];
      if (st.bossDefeated) earnedNow.push('boss_slayer');
      if (finalAcc >= 97 && st.correctChars >= 30) earnedNow.push('flawless_run');
      if (finalWpm >= 65 && st.correctChars >= 25) earnedNow.push('speed_demon');
      if (st.maxCombo >= 25) earnedNow.push('combo_master');
      if (st.everOverdrive) earnedNow.push('overdrive_pro');

      setRecords((prev) => {
        const newlyUnlocked = earnedNow.filter((id) => !prev.unlockedMedals.includes(id));
        setNewMedalsThisRound(newlyUnlocked);
        const next: StoredTypingRecords = {
          bestArcadeScore: { ...prev.bestArcadeScore },
          bestWpm: { ...prev.bestWpm },
          totalWordsCleared: prev.totalWordsCleared + st.cleared,
          unlockedMedals: Array.from(new Set([...prev.unlockedMedals, ...earnedNow])),
        };
        let newBestHit = false;
        if (mode === 'arcade' && st.score > prev.bestArcadeScore[difficulty]) {
          next.bestArcadeScore[difficulty] = st.score;
          newBestHit = true;
        }
        if (finalWpm > prev.bestWpm[difficulty] && st.correctChars >= 15) {
          next.bestWpm[difficulty] = finalWpm;
          newBestHit = true;
        }
        setIsNewBest(newBestHit);
        saveRecords(next);
        return next;
      });

      if (!st.xpAwardedForRound && st.correctChars >= 15) {
        st.xpAwardedForRound = true;
        const xp = Math.min(
          85,
          Math.max(10, Math.round(finalWpm * 0.45 + (passedFlag ? 22 : 0) + (st.bossDefeated ? 15 : 0) + st.cleared * 1.1))
        );
        setLastXpEarned(xp);
        onEarnXP?.(xp);
      } else {
        setLastXpEarned(0);
      }
    },
    [difficulty, mode, onEarnXP]
  );

  const startNewRound = useCallback(
    (overrideUseMissed = false) => {
      if (overrideUseMissed) setUseMissedOnly(true);
      else setUseMissedOnly(false);

      const cfg = TYPING_DIFFICULTIES[difficulty];
      wordDeckRef.current = [];
      recentWordsRef.current = [];

      statsRef.current = {
        startTimeMs: Date.now(),
        correctChars: 0,
        totalKeystrokes: 0,
        errorCount: 0,
        combo: 0,
        maxCombo: 0,
        peakWpm: 0,
        score: 0,
        cleared: 0,
        hearts: cfg.hearts,
        freezeSec: 0,
        shieldActive: false,
        overdrivePct: 0,
        overdriveSec: 0,
        everOverdrive: false,
        campaignWave: 1,
        bossSpawned: false,
        bossDefeated: false,
        xpAwardedForRound: false,
      };

      setWpm(0);
      setPeakWpm(0);
      setRawWpm(0);
      setAccuracy(100);
      setCombo(0);
      setMaxCombo(0);
      setScore(0);
      setWpmHistory([]);
      setKeyErrorCounts({});
      setLastXpEarned(0);
      setIsNewBest(false);
      setNewMedalsThisRound([]);
      setMascotMood('idle');
      setDeltas([]);

      if (mode === 'arcade') {
        setWords([]);
        setLockedWordId(null);
        setArcadeInput('');
        lastCommittedArcadeRef.current = '';
        isComposingRef.current = false;
        setHearts(cfg.hearts);
        setClearedWordsCount(0);
        setMissedWordsList([]);
        setFreezeRemainingSec(0);
        setShieldActive(false);
        setPowerCharges({ freeze: 1, emp: 1, shield: 1 });
        setCampaignWave(1);
        setActiveBoss(null);
        activeBossRef.current = null;
        setBossDefeated(false);
        setArcadeVictory(null);
        setArcadeTimeLeftSec(60);
        setOverdrivePct(0);
        setOverdriveActive(false);
        setGhostWordsProgress(0);
        setPhase('PLAYING');
        if (runFormat === 'campaign') {
          showBanner(isEn ? 'WAVE 1 · WARM UP' : 'WAVE 1 · KHỞI ĐỘNG');
        }
        window.setTimeout(() => {
          arcadeInputRef.current?.focus();
        }, 40);
      } else {
        setPassageTyped('');
        lastCommittedPassageRef.current = '';
        isComposingRef.current = false;
        setTimeLeftSec(effectiveTimeLimitSec);
        setWaitingFirstKey(true);
        setPassagePassed(null);
        setShowPassageEditor(false);
        setPhase('PLAYING');
        window.setTimeout(() => {
          passageInputRef.current?.focus();
        }, 40);
      }
    },
    [difficulty, effectiveTimeLimitSec, mode, runFormat, isEn, showBanner]
  );

  // ==================== ARCADE GAME LOOP ====================
  useEffect(() => {
    if (mode !== 'arcade' || phase !== 'PLAYING') return;

    // Immediate first wave spawn
    if (wordsRef.current.length === 0 && !statsRef.current.bossSpawned) {
      spawnWord();
    }

    let rafId = 0;
    let lastNow = performance.now();
    let spawnAccMs = 0;
    let metricsAccMs = 0;

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden) {
        lastNow = now;
        return;
      }

      const dtMs = Math.min(80, now - lastNow);
      const dtSec = dtMs / 1000;
      lastNow = now;

      // Overdrive timer countdown
      if (statsRef.current.overdriveSec > 0) {
        statsRef.current.overdriveSec = Math.max(0, statsRef.current.overdriveSec - dtSec);
        setOverdrivePct(Math.round((statsRef.current.overdriveSec / 8) * 100));
        if (statsRef.current.overdriveSec <= 0) {
          setOverdriveActive(false);
          statsRef.current.overdrivePct = 0;
          setMascotMood(statsRef.current.combo >= 10 ? 'fever' : 'idle');
        }
      }

      // Handle Freeze timer & Spawn cadence
      if (statsRef.current.freezeSec > 0) {
        statsRef.current.freezeSec = Math.max(0, statsRef.current.freezeSec - dtSec);
        setFreezeRemainingSec(Math.ceil(statsRef.current.freezeSec));
      } else if (!statsRef.current.bossSpawned) {
        spawnAccMs += dtMs;
        const dynamicInterval = Math.max(
          780,
          diffCfg.spawnIntervalMs - statsRef.current.cleared * 16
        );
        if (spawnAccMs >= dynamicInterval) {
          spawnAccMs = 0;
          spawnWord();
        }
      }

      // Advance words if not frozen (Overdrive slows words gently by 22%)
      if (statsRef.current.freezeSec <= 0 && wordsRef.current.length > 0) {
        const overdriveSlow = statsRef.current.overdriveSec > 0 ? 0.78 : 1;
        let breachedWords: FlyingWord[] = [];
        const updated: FlyingWord[] = [];
        for (const w of wordsRef.current) {
          const nextX = w.xPct - w.speedPctPerSec * overdriveSlow * dtSec;
          if (nextX <= 6) {
            breachedWords.push(w);
          } else {
            updated.push({ ...w, xPct: nextX });
          }
        }

        if (breachedWords.length > 0) {
          const nonBossSurviving = updated;
          let bossPushedBack: FlyingWord | null = null;

          for (const bw of breachedWords) {
            if (bw.kind === 'boss') {
              bossPushedBack = { ...bw, xPct: 58 };
            }
            if (bw.id === lockedWordIdRef.current) {
              setLockedWordId(null);
              setArcadeInput('');
              lastCommittedArcadeRef.current = '';
            }
            if (bw.kind !== 'boss') {
              setMissedWordsList((prev) =>
                prev.includes(bw.text) ? prev : [...prev, bw.text]
              );
              setPracticeMissedPool((prev) =>
                prev.includes(bw.text) ? prev : [...prev.slice(-29), bw.text]
              );
            }

            if (statsRef.current.shieldActive) {
              statsRef.current.shieldActive = false;
              setShieldActive(false);
              pushDelta(isEn ? 'SHIELD BLOCKED!' : 'KHIÊN ĐỠ ĐÒN!', 10, bw.lane, 'cyan');
              playSfx('power');
            } else {
              statsRef.current.hearts -= 1;
              statsRef.current.combo = 0;
              setCombo(0);
              setHearts(statsRef.current.hearts);
              setErrorTick((t) => t + 1);
              setMascotMood('hurt');
              window.setTimeout(() => setMascotMood('idle'), 360);
              pushDelta('-1 ♥', 8, bw.lane, 'rose');
              playSfx('error');
              if (statsRef.current.hearts <= 0) {
                setWords(bossPushedBack ? [...nonBossSurviving, bossPushedBack] : nonBossSurviving);
                finishRound(false);
                return;
              }
            }
          }

          setWords(bossPushedBack ? [...nonBossSurviving, bossPushedBack] : nonBossSurviving);
          if (nonBossSurviving.length === 0 && !bossPushedBack && !statsRef.current.bossSpawned) {
            window.setTimeout(() => spawnWord(), 150);
          }
        } else {
          setWords(updated);
        }
      }

      // Live Telemetry, Time Attack Countdown, Ghost Rival & Sparkline every 500ms
      metricsAccMs += dtMs;
      if (metricsAccMs >= 500) {
        metricsAccMs = 0;
        const st = statsRef.current;
        const elapsedSec = (Date.now() - st.startTimeMs) / 1000;
        const elapsedMin = Math.max(0.05, elapsedSec / 60);
        const curWpm = Math.max(0, Math.round(st.correctChars / 5 / elapsedMin));
        const curRaw = Math.max(curWpm, Math.round(st.totalKeystrokes / 5 / elapsedMin));
        st.peakWpm = Math.max(st.peakWpm, curWpm);
        setWpm(curWpm);
        setPeakWpm(st.peakWpm);
        setRawWpm(curRaw);
        setWpmHistory((prev) => [...prev.slice(-29), curWpm]);

        // Ghost AI expected words progress
        const ghostWords = Math.floor((elapsedMin * diffCfg.targetWpm * 5) / 6.8);
        setGhostWordsProgress(ghostWords);

        if (runFormat === 'time_attack') {
          const rem = Math.max(0, Math.ceil(60 - elapsedSec));
          setArcadeTimeLeftSec(rem);
          if (rem <= 0) {
            finishRound(true);
            return;
          }
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mode, runFormat, phase, diffCfg, spawnWord, finishRound, pushDelta, playSfx, isEn]);

  // ==================== TIMED PASSAGE TIMER LOOP ====================
  useEffect(() => {
    if (mode !== 'timed_passage' || phase !== 'PLAYING' || waitingFirstKey) return;

    const interval = window.setInterval(() => {
      const st = statsRef.current;
      const elapsedSec = (Date.now() - st.startTimeMs) / 1000;
      const remaining = Math.max(0, Math.ceil(effectiveTimeLimitSec - elapsedSec));
      setTimeLeftSec(remaining);

      const elapsedMin = Math.max(0.04, elapsedSec / 60);
      const curWpm = Math.max(0, Math.round(st.correctChars / 5 / elapsedMin));
      const curRaw = Math.max(curWpm, Math.round(st.totalKeystrokes / 5 / elapsedMin));
      setWpm(curWpm);
      setRawWpm(curRaw);
      setWpmHistory((prev) => [...prev.slice(-29), curWpm]);

      if (remaining <= 0) {
        finishRound(false);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [mode, phase, waitingFirstKey, effectiveTimeLimitSec, finishRound]);

  // Keep active character scrolled into view in Timed Passage
  useEffect(() => {
    if (mode === 'timed_passage' && phase === 'PLAYING') {
      passageActiveCharRef.current?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [passageTyped.length, mode, phase]);

  // ==================== ARCADE INPUT PROCESSING (TELEX / VNI / OS IME SAFE) ====================
  const processArcadeValue = useCallback(
    (rawNextVal: string, prevVal: string, allowBuiltInIme: boolean) => {
      if (phase !== 'PLAYING') return;
      const activeWords = wordsRef.current;
      if (activeWords.length === 0) {
        setArcadeInput('');
        lastCommittedArcadeRef.current = '';
        return;
      }

      // Handle genuine Backspace / deletion cleanly without penalizing
      if (rawNextVal.length < prevVal.length && prevVal.startsWith(rawNextVal)) {
        setArcadeInput(rawNextVal);
        lastCommittedArcadeRef.current = rawNextVal;
        if (rawNextVal === '') setLockedWordId(null);
        return;
      }

      const currentLocked = activeWords.find((w) => w.id === lockedWordIdRef.current);
      const isAsciiOnlyTopic =
        topic === 'cpp_commands' || topic === 'python_commands' || topic === 'english_stem';
      const lockedIsPureAscii = currentLocked
        ? !/[^\u0000-\u007f]/.test(currentLocked.text)
        : false;
      const rawMatchesAsciiWord = activeWords.some(
        (w) => !/[^\u0000-\u007f]/.test(w.text) && w.text.startsWith(rawNextVal)
      );

      const shouldApplyBuiltIn =
        allowBuiltInIme &&
        imeMode !== 'system' &&
        !isAsciiOnlyTopic &&
        !lockedIsPureAscii &&
        !rawMatchesAsciiWord;

      const nextVal = shouldApplyBuiltIn
        ? applyBuiltInVietnameseIme(prevVal, rawNextVal, imeMode)
        : rawNextVal;

      const addedChars = Math.max(1, nextVal.length - prevVal.length);
      statsRef.current.totalKeystrokes += addedChars;

      // Helper to pick best matching flying word (exact -> exact Unicode prefix -> Telex/VNI partial prefix)
      const findBestCandidate = (val: string): FlyingWord | undefined => {
        const sorted = [...activeWords].sort((a, b) => a.xPct - b.xPct);
        const exactMatch = sorted.find((w) => w.text === val);
        if (exactMatch) return exactMatch;
        const unicodePrefixMatch = sorted.find((w) => w.text.startsWith(val));
        if (unicodePrefixMatch) return unicodePrefixMatch;
        return sorted.find((w) => matchesVietnamesePrefix(val, w.text).prefixMatch);
      };

      let target = currentLocked;
      if (!target || !matchesVietnamesePrefix(nextVal, target.text).prefixMatch) {
        const reassigned = findBestCandidate(nextVal);
        if (reassigned) {
          target = reassigned;
          setLockedWordId(reassigned.id);
        }
      }

      const matchResult = target ? matchesVietnamesePrefix(nextVal, target.text) : null;

      if (target && matchResult && matchResult.prefixMatch) {
        statsRef.current.correctChars += addedChars;
        setArcadeInput(nextVal);
        lastCommittedArcadeRef.current = nextVal;
        playSfx('hit');

        if (matchResult.exact) {
          const clearedTarget = target;
          setLockedWordId(null);
          setArcadeInput('');
          lastCommittedArcadeRef.current = '';

          // Handle Multi-Phase Boss Word Damage vs Normal/Special Word
          if (clearedTarget.kind === 'boss' && activeBossRef.current) {
            const boss = activeBossRef.current;
            const nextPhaseIdx = boss.phaseIdx + 1;

            statsRef.current.combo += 1;
            statsRef.current.maxCombo = Math.max(statsRef.current.maxCombo, statsRef.current.combo);
            statsRef.current.cleared += 1;

            if (nextPhaseIdx < boss.config.phases.length) {
              // Boss takes damage & transitions to next phrase
              const updatedBoss: ActiveBossState = { config: boss.config, phaseIdx: nextPhaseIdx };
              setActiveBoss(updatedBoss);
              activeBossRef.current = updatedBoss;
              const nextPhrase = boss.config.phases[nextPhaseIdx];
              const nextX = Math.min(84, Math.max(58, clearedTarget.xPct + 18));
              setWords([
                {
                  ...clearedTarget,
                  id: wordIdSeqRef.current++,
                  text: nextPhrase,
                  xPct: nextX,
                },
              ]);
              const dmgPts = Math.round(65 * diffCfg.scoreMultiplier);
              statsRef.current.score += dmgPts;
              setScore(statsRef.current.score);
              setCombo(statsRef.current.combo);
              setMaxCombo(statsRef.current.maxCombo);
              setClearedWordsCount(statsRef.current.cleared);
              setBurstTick((t) => t + 1);
              pushDelta(`BOSS HIT +${dmgPts}`, clearedTarget.xPct, clearedTarget.lane, 'amber');
              playSfx('power');
              return;
            } else {
              // BOSS DEFEATED!
              setWords([]);
              setActiveBoss(null);
              activeBossRef.current = null;
              statsRef.current.bossSpawned = false;
              statsRef.current.bossDefeated = true;
              setBossDefeated(true);
              const slayPts = Math.round(180 * diffCfg.scoreMultiplier);
              statsRef.current.score += slayPts;
              setScore(statsRef.current.score);
              setCombo(statsRef.current.combo);
              setMaxCombo(statsRef.current.maxCombo);
              setClearedWordsCount(statsRef.current.cleared);
              setBurstTick((t) => t + 1);
              pushDelta(`BOSS DEFEATED +${slayPts}`, clearedTarget.xPct, clearedTarget.lane, 'amber');
              playSfx('power');
              if (runFormat === 'campaign') {
                finishRound(true);
              } else {
                // Endless mini-boss victory heals +1 heart and keeps going
                if (statsRef.current.hearts < diffCfg.hearts) {
                  statsRef.current.hearts += 1;
                  setHearts(statsRef.current.hearts);
                }
                window.setTimeout(() => spawnWord(), 240);
              }
              return;
            }
          }

          setWords((prev) => prev.filter((w) => w.id !== clearedTarget.id));

          statsRef.current.combo += 1;
          statsRef.current.maxCombo = Math.max(
            statsRef.current.maxCombo,
            statsRef.current.combo
          );
          statsRef.current.cleared += 1;

          // Overdrive Charge (+14 normal, +22 gold)
          if (statsRef.current.overdriveSec <= 0) {
            const gain = clearedTarget.kind === 'gold' ? 22 : 14;
            statsRef.current.overdrivePct = Math.min(100, statsRef.current.overdrivePct + gain);
            setOverdrivePct(statsRef.current.overdrivePct);
            if (statsRef.current.overdrivePct >= 100) {
              statsRef.current.overdriveSec = 8;
              statsRef.current.everOverdrive = true;
              setOverdriveActive(true);
              setMascotMood('fever');
              pushDelta(isEn ? '⚡ OVERDRIVE ×2!' : '⚡ OVERDRIVE ×2!', 50, 1, 'amber');
              playSfx('power');
            }
          }

          // Special Rewards (Gold / Heal)
          if (clearedTarget.kind === 'gold') {
            const types: Array<'freeze' | 'emp' | 'shield'> = ['freeze', 'emp', 'shield'];
            const pick = types[Math.floor(Math.random() * types.length)];
            setPowerCharges((prev) => ({ ...prev, [pick]: Math.min(3, prev[pick] + 1) }));
          } else if (clearedTarget.kind === 'heal' && statsRef.current.hearts < diffCfg.hearts) {
            statsRef.current.hearts += 1;
            setHearts(statsRef.current.hearts);
          }

          const multiplier =
            (statsRef.current.combo >= 20
              ? 5
              : statsRef.current.combo >= 12
              ? 3
              : statsRef.current.combo >= 5
              ? 2
              : 1) *
            (statsRef.current.overdriveSec > 0 ? 2 : 1) *
            (clearedTarget.kind === 'gold' ? 2 : 1);

          const pts = Math.round(
            (10 + clearedTarget.text.length * 2) * multiplier * diffCfg.scoreMultiplier
          );
          statsRef.current.score += pts;

          if (statsRef.current.combo > 0 && statsRef.current.combo % 10 === 0) {
            const types: Array<'freeze' | 'emp' | 'shield'> = ['freeze', 'emp', 'shield'];
            const pick = types[(statsRef.current.combo / 10) % types.length];
            setPowerCharges((prev) => ({ ...prev, [pick]: Math.min(3, prev[pick] + 1) }));
          }

          setCombo(statsRef.current.combo);
          setMaxCombo(statsRef.current.maxCombo);
          setScore(statsRef.current.score);
          setClearedWordsCount(statsRef.current.cleared);
          setBurstTick((t) => t + 1);
          if (statsRef.current.overdriveSec <= 0) {
            setMascotMood(statsRef.current.combo >= 10 ? 'fever' : 'happy');
            if (statsRef.current.combo < 10) {
              window.setTimeout(() => setMascotMood('idle'), 320);
            }
          }

          const acc = Math.max(
            0,
            Math.min(
              100,
              Math.round(
                ((statsRef.current.totalKeystrokes - statsRef.current.errorCount) /
                  Math.max(1, statsRef.current.totalKeystrokes)) *
                  100
              )
            )
          );
          setAccuracy(acc);

          pushDelta(
            clearedTarget.kind === 'heal'
              ? `+${pts} · +1 ♥`
              : multiplier > 1
              ? `+${pts} (×${multiplier})`
              : `+${pts}`,
            clearedTarget.xPct,
            clearedTarget.lane,
            clearedTarget.kind === 'gold' || multiplier >= 3 ? 'amber' : 'emerald'
          );
          playSfx(clearedTarget.kind === 'gold' || clearedTarget.kind === 'heal' ? 'power' : 'clear');

          // Sprint target check
          if (runFormat === 'sprint' && statsRef.current.cleared >= SPRINT_WORD_TARGETS[difficulty]) {
            finishRound(true);
            return;
          }

          // Campaign wave transitions (Wave 1: 0..7 -> Wave 2: 8..17 -> Wave 3: 18..25 -> Boss at 26)
          if (runFormat === 'campaign') {
            if (statsRef.current.cleared === 8 && statsRef.current.campaignWave === 1) {
              statsRef.current.campaignWave = 2;
              setCampaignWave(2);
              showBanner(isEn ? 'WAVE 2 · SPEED UP!' : 'WAVE 2 · TĂNG TỐC!');
              playSfx('power');
            } else if (statsRef.current.cleared === 18 && statsRef.current.campaignWave === 2) {
              statsRef.current.campaignWave = 3;
              setCampaignWave(3);
              showBanner(isEn ? 'WAVE 3 · FINAL PUSH!' : 'WAVE 3 · SẮP GẶP BOSS!');
              playSfx('power');
            } else if (statsRef.current.cleared >= 26 && !statsRef.current.bossSpawned) {
              spawnBossWord();
              return;
            }
          }

          // Endless mini-boss every 15 words
          if (
            runFormat === 'endless' &&
            statsRef.current.cleared > 0 &&
            statsRef.current.cleared % 15 === 0 &&
            !statsRef.current.bossSpawned
          ) {
            spawnBossWord();
            return;
          }

          const remainingAfterClear = wordsRef.current.filter((w) => w.id !== clearedTarget.id).length;
          if (remainingAfterClear <= 2) {
            window.setTimeout(() => spawnWord(), 140);
          }
        }
        return;
      }

      // Real typo (does not match any active word even as Telex/VNI intermediate)
      statsRef.current.errorCount += 1;
      statsRef.current.combo = 0;
      if (statsRef.current.overdriveSec <= 0) {
        statsRef.current.overdrivePct = Math.max(0, statsRef.current.overdrivePct - 10);
        setOverdrivePct(statsRef.current.overdrivePct);
      }
      setCombo(0);
      setMascotMood('hurt');
      window.setTimeout(() => setMascotMood('idle'), 320);

      const expectedNext = target
        ? target.text[Math.min(target.text.length - 1, prevVal.length)]
        : null;
      const errChar = nextVal.slice(-1);
      const errCode = mapCharToPhysicalCode(errChar);
      if (errCode) {
        setKeyErrorCounts((prev) => ({ ...prev, [errCode]: (prev[errCode] || 0) + 1 }));
      }
      setLastErrorChar(errChar || expectedNext || null);
      setErrorTick((t) => t + 1);
      setInputShake(true);
      window.setTimeout(() => setInputShake(false), 280);
      playSfx('error');

      const acc = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            ((statsRef.current.totalKeystrokes - statsRef.current.errorCount) /
              Math.max(1, statsRef.current.totalKeystrokes)) *
              100
          )
        )
      );
      setAccuracy(acc);

      // Preserve prior valid prefix so user can recover immediately
      setArcadeInput(prevVal);
      lastCommittedArcadeRef.current = prevVal;
    },
    [
      phase,
      topic,
      difficulty,
      runFormat,
      imeMode,
      diffCfg.scoreMultiplier,
      diffCfg.hearts,
      isEn,
      playSfx,
      pushDelta,
      spawnWord,
      spawnBossWord,
      showBanner,
      finishRound,
    ]
  );

  const handleArcadeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isComposingRef.current) {
      setArcadeInput(val);
      return;
    }
    processArcadeValue(val, lastCommittedArcadeRef.current, true);
  };

  const handleArcadeCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const val = e.currentTarget.value;
    processArcadeValue(val, lastCommittedArcadeRef.current, false);
  };

  // ==================== POWER-UPS ====================
  const triggerPowerUp = useCallback(
    (kind: 'freeze' | 'emp' | 'shield') => {
      if (mode !== 'arcade' || phase !== 'PLAYING') return;
      if (powerCharges[kind] <= 0) return;

      setPowerCharges((prev) => ({ ...prev, [kind]: prev[kind] - 1 }));
      playSfx('power');

      if (kind === 'freeze') {
        statsRef.current.freezeSec = 5;
        setFreezeRemainingSec(5);
        pushDelta(isEn ? 'FREEZE 5s!' : 'ĐÓNG BĂNG 5s!', 50, 1, 'cyan');
      } else if (kind === 'emp') {
        const sorted = [...wordsRef.current].sort((a, b) => a.xPct - b.xPct);
        if (sorted.length > 0) {
          const victim = sorted[0];
          if (victim.kind === 'boss') {
            setWords((prev) =>
              prev.map((w) =>
                w.id === victim.id ? { ...w, xPct: Math.min(86, w.xPct + 26) } : w
              )
            );
            statsRef.current.score += 35;
            setScore(statsRef.current.score);
            setBurstTick((t) => t + 1);
            pushDelta('EMP STUN!', victim.xPct, victim.lane, 'cyan');
          } else {
            setWords((prev) => prev.filter((w) => w.id !== victim.id));
            if (lockedWordIdRef.current === victim.id) {
              setLockedWordId(null);
              setArcadeInput('');
              lastCommittedArcadeRef.current = '';
            }
            statsRef.current.cleared += 1;
            statsRef.current.score += 20;
            setScore(statsRef.current.score);
            setClearedWordsCount(statsRef.current.cleared);
            setBurstTick((t) => t + 1);
            pushDelta('EMP CLEAR!', victim.xPct, victim.lane, 'amber');

            if (runFormat === 'sprint' && statsRef.current.cleared >= SPRINT_WORD_TARGETS[difficulty]) {
              finishRound(true);
              return;
            }
            if (runFormat === 'campaign') {
              if (statsRef.current.cleared === 8 && statsRef.current.campaignWave === 1) {
                statsRef.current.campaignWave = 2;
                setCampaignWave(2);
                showBanner(isEn ? 'WAVE 2 · SPEED UP!' : 'WAVE 2 · TĂNG TỐC!');
              } else if (statsRef.current.cleared === 18 && statsRef.current.campaignWave === 2) {
                statsRef.current.campaignWave = 3;
                setCampaignWave(3);
                showBanner(isEn ? 'WAVE 3 · FINAL PUSH!' : 'WAVE 3 · SẮP GẶP BOSS!');
              } else if (statsRef.current.cleared >= 26 && !statsRef.current.bossSpawned) {
                spawnBossWord();
                return;
              }
            }
            if (wordsRef.current.length <= 1 && !statsRef.current.bossSpawned) {
              window.setTimeout(() => spawnWord(), 160);
            }
          }
        }
      } else if (kind === 'shield') {
        statsRef.current.shieldActive = true;
        setShieldActive(true);
        pushDelta(isEn ? 'SHIELD READY!' : 'ĐÃ BẬT KHIÊN!', 16, 1, 'cyan');
      }
      arcadeInputRef.current?.focus();
    },
    [
      mode,
      phase,
      powerCharges,
      runFormat,
      difficulty,
      playSfx,
      pushDelta,
      isEn,
      finishRound,
      showBanner,
      spawnBossWord,
      spawnWord,
    ]
  );

  // ==================== TIMED PASSAGE INPUT PROCESSING (TOKEN-ALIGNED TELEX/VNI) ====================
  const passageTokens = useMemo(
    () => passageText.split(/(\s+)/).filter((t) => t.length > 0),
    [passageText]
  );

  const passageAlignment = useMemo(() => {
    const typedTokens = passageTyped
      ? passageTyped.split(/(\s+)/).filter((t) => t.length > 0)
      : [];

    let activeTokenIdx = 0;
    let activeTyped = '';
    if (typedTokens.length > 0) {
      const lastToken = typedTokens[typedTokens.length - 1];
      if (/^\s+$/.test(lastToken)) {
        activeTokenIdx = Math.min(passageTokens.length - 1, typedTokens.length);
        activeTyped = '';
      } else {
        activeTokenIdx = Math.min(passageTokens.length - 1, typedTokens.length - 1);
        activeTyped = lastToken;
      }
    }

    const activeExpected = passageTokens[activeTokenIdx] || '';
    const activeMatch = matchesVietnamesePrefix(activeTyped, activeExpected);

    // Count true correctly typed characters across all tokens
    let correctCharsTotal = 0;
    for (let i = 0; i < Math.min(typedTokens.length, passageTokens.length); i++) {
      const exp = passageTokens[i];
      const typ = typedTokens[i];
      if (i < activeTokenIdx) {
        for (let c = 0; c < Math.min(exp.length, typ.length); c++) {
          if (exp[c] === typ[c]) correctCharsTotal += 1;
        }
      } else if (i === activeTokenIdx) {
        const m = matchesVietnamesePrefix(typ, exp);
        if (m.prefixMatch) {
          correctCharsTotal += m.visualMatchedLen;
        } else {
          for (let c = 0; c < Math.min(exp.length, typ.length); c++) {
            if (exp[c] === typ[c]) correctCharsTotal += 1;
          }
        }
      }
    }

    return {
      typedTokens,
      activeTokenIdx,
      activeTyped,
      activeExpected,
      activeMatch,
      correctCharsTotal,
    };
  }, [passageTokens, passageTyped]);

  const processPassageValue = useCallback(
    (rawNextVal: string, prevVal: string, allowBuiltInIme: boolean) => {
      if (phase !== 'PLAYING') return;

      if (waitingFirstKey && rawNextVal.length > 0) {
        statsRef.current.startTimeMs = Date.now();
        setWaitingFirstKey(false);
      }

      // Allow genuine Backspace / deletion freely
      if (rawNextVal.length < prevVal.length && prevVal.startsWith(rawNextVal)) {
        setPassageTyped(rawNextVal);
        lastCommittedPassageRef.current = rawNextVal;
        return;
      }

      // Determine current expected token so English/code tokens aren't mangled by Telex/VNI
      const rawTokens = rawNextVal ? rawNextVal.split(/(\s+)/).filter((t) => t.length > 0) : [];
      const curIdx = Math.min(
        passageTokens.length - 1,
        Math.max(
          0,
          rawTokens.length > 0 && /^\s+$/.test(rawTokens[rawTokens.length - 1])
            ? rawTokens.length
            : rawTokens.length - 1
        )
      );
      const expectedToken = passageTokens[curIdx] || '';
      const rawActiveToken =
        rawTokens.length > 0 && !/^\s+$/.test(rawTokens[rawTokens.length - 1])
          ? rawTokens[rawTokens.length - 1]
          : '';
      const expectedIsPureAscii = !/[^\u0000-\u007f]/.test(expectedToken);
      const rawMatchesAsciiExpected =
        expectedIsPureAscii && rawActiveToken.length > 0 && expectedToken.startsWith(rawActiveToken);

      const nextVal =
        allowBuiltInIme && imeMode !== 'system' && !rawMatchesAsciiExpected
          ? applyBuiltInVietnameseIme(prevVal, rawNextVal, imeMode)
          : rawNextVal;

      // Grade newly added or IME-updated active token
      const typedTokens = nextVal ? nextVal.split(/(\s+)/).filter((t) => t.length > 0) : [];
      let activeIdx = 0;
      let activeTyped = '';
      if (typedTokens.length > 0) {
        const last = typedTokens[typedTokens.length - 1];
        if (/^\s+$/.test(last)) {
          activeIdx = Math.min(passageTokens.length - 1, typedTokens.length);
          activeTyped = '';
        } else {
          activeIdx = Math.min(passageTokens.length - 1, typedTokens.length - 1);
          activeTyped = last;
        }
      }

      const activeExpected = passageTokens[activeIdx] || '';
      const activeMatch = matchesVietnamesePrefix(activeTyped, activeExpected);
      const justFinishedWhitespace =
        typedTokens.length > 0 && /^\s+$/.test(typedTokens[typedTokens.length - 1]);
      const prevTokenIdx = justFinishedWhitespace ? typedTokens.length - 2 : -1;
      const prevTokenMatched =
        prevTokenIdx >= 0
          ? typedTokens[prevTokenIdx] === passageTokens[prevTokenIdx]
          : true;

      const isValidStep = justFinishedWhitespace ? prevTokenMatched : activeMatch.prefixMatch;

      statsRef.current.totalKeystrokes += Math.max(1, nextVal.length - prevVal.length);

      if (isValidStep) {
        statsRef.current.combo += 1;
        statsRef.current.maxCombo = Math.max(
          statsRef.current.maxCombo,
          statsRef.current.combo
        );
        statsRef.current.score += Math.round(5 * diffCfg.scoreMultiplier);
        playSfx('hit');
        if (statsRef.current.combo >= 15) setMascotMood('fever');
      } else {
        statsRef.current.errorCount += 1;
        statsRef.current.combo = 0;
        setMascotMood('hurt');
        window.setTimeout(() => setMascotMood('idle'), 280);
        const expectedChar =
          activeExpected[Math.min(activeExpected.length - 1, activeMatch.visualMatchedLen)] ||
          activeExpected[0] ||
          ' ';
        const errChar = nextVal.slice(-1);
        const code = mapCharToPhysicalCode(expectedChar);
        if (code) {
          setKeyErrorCounts((prev) => ({ ...prev, [code]: (prev[code] || 0) + 1 }));
        }
        setLastErrorChar(errChar);
        setErrorTick((t) => t + 1);
        playSfx('error');

        if (strictErrorLock) {
          setCombo(0);
          setPassageTyped(prevVal);
          lastCommittedPassageRef.current = prevVal;
          return;
        }
      }

      // Recalculate true matched chars across all tokens
      let correctTotal = 0;
      for (let i = 0; i < Math.min(typedTokens.length, passageTokens.length); i++) {
        const exp = passageTokens[i];
        const typ = typedTokens[i];
        if (i < activeIdx) {
          for (let c = 0; c < Math.min(exp.length, typ.length); c++) {
            if (exp[c] === typ[c]) correctTotal += 1;
          }
        } else if (i === activeIdx) {
          const m = matchesVietnamesePrefix(typ, exp);
          if (m.prefixMatch) {
            correctTotal += m.visualMatchedLen;
          } else {
            for (let c = 0; c < Math.min(exp.length, typ.length); c++) {
              if (exp[c] === typ[c]) correctTotal += 1;
            }
          }
        }
      }
      statsRef.current.correctChars = correctTotal;

      setCombo(statsRef.current.combo);
      setMaxCombo(statsRef.current.maxCombo);
      setScore(statsRef.current.score);
      const acc = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            ((statsRef.current.totalKeystrokes - statsRef.current.errorCount) /
              Math.max(1, statsRef.current.totalKeystrokes)) *
              100
          )
        )
      );
      setAccuracy(acc);
      setPassageTyped(nextVal);
      lastCommittedPassageRef.current = nextVal;

      if (
        nextVal === passageText ||
        (nextVal.trimEnd() === passageText.trimEnd() && passageText.length > 0)
      ) {
        setBurstTick((t) => t + 1);
        playSfx('clear');
        finishRound(true);
      }
    },
    [
      phase,
      waitingFirstKey,
      passageTokens,
      passageText,
      imeMode,
      diffCfg.scoreMultiplier,
      strictErrorLock,
      playSfx,
      finishRound,
    ]
  );

  const handlePassageInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isComposingRef.current) {
      setPassageTyped(val);
      return;
    }
    processPassageValue(val, lastCommittedPassageRef.current, true);
  };

  const handlePassageCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    const val = e.currentTarget.value;
    processPassageValue(val, lastCommittedPassageRef.current, false);
  };

  // Upload custom passage file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '')
        .replace(/\r\n/g, '\n')
        .trim()
        .slice(0, 3500);
      if (content.length >= 10) {
        setPassageText(content);
        setSelectedPresetId('custom');
        setCustomFilename(file.name);
        setShowPassageEditor(false);
        const suggested = computeSuggestedTimeSec(content, difficulty);
        if (!useCustomTimer) {
          setCustomSeconds(suggested);
          setTimeLeftSec(suggested);
        }
      }
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  // Keyboard shortcuts during Gameplay (Tab unlocks word, Alt+1/2/3 trigger powerups)
  const handleArcadeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setLockedWordId(null);
      setArcadeInput('');
      lastCommittedArcadeRef.current = '';
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (arcadeInput) {
        setLockedWordId(null);
        setArcadeInput('');
        lastCommittedArcadeRef.current = '';
      } else {
        setPhase('PAUSED');
      }
      return;
    }
    if (e.altKey && (e.key === '1' || e.key === '2' || e.key === '3')) {
      e.preventDefault();
      if (e.key === '1') triggerPowerUp('freeze');
      if (e.key === '2') triggerPowerUp('emp');
      if (e.key === '3') triggerPowerUp('shield');
    }
  };

  // Next Expected Char for MiniLiveKeyboard hint (IME-aware)
  const expectedCharForHint = useMemo(() => {
    if (phase !== 'PLAYING') return null;
    if (mode === 'timed_passage') {
      const { activeExpected, activeTyped, activeMatch, activeTokenIdx } = passageAlignment;
      if (!activeExpected) return null;
      if (activeTyped === activeExpected) {
        return passageTokens[activeTokenIdx + 1]?.[0] || ' ';
      }
      const idx = activeMatch.prefixMatch
        ? Math.min(activeExpected.length - 1, activeMatch.visualMatchedLen)
        : Math.min(activeExpected.length - 1, activeTyped.length);
      return activeExpected[idx] || null;
    }
    const locked = words.find((w) => w.id === lockedWordId);
    if (locked) {
      const m = matchesVietnamesePrefix(arcadeInput, locked.text);
      const idx = m.prefixMatch
        ? Math.min(locked.text.length - 1, m.visualMatchedLen)
        : 0;
      return locked.text[idx] || null;
    }
    const closest = [...words].sort((a, b) => a.xPct - b.xPct)[0];
    return closest ? closest.text[0] || null : null;
  }, [phase, mode, passageAlignment, passageTokens, words, lockedWordId, arcadeInput]);

  // Passage ghost pace analytics
  const passageProgressPct = Math.min(
    100,
    Math.round(
      (Math.max(passageAlignment.correctCharsTotal, passageTyped.length) /
        Math.max(1, passageText.length)) *
        100
    )
  );
  const timeElapsedPct =
    waitingFirstKey || effectiveTimeLimitSec <= 0
      ? 0
      : Math.min(
          100,
          Math.round(((effectiveTimeLimitSec - timeLeftSec) / effectiveTimeLimitSec) * 100)
        );
  const paceDeltaWpm = wpm - diffCfg.targetWpm;

  // Top 4 Weak Keys for Post-Match Insights
  const topWeakKeys = useMemo(() => {
    return Object.entries(keyErrorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [keyErrorCounts]);

  // SVG WPM Sparkline Path
  const sparklinePath = useMemo(() => {
    if (wpmHistory.length < 2) return '';
    const maxVal = Math.max(40, ...wpmHistory);
    return wpmHistory
      .map((val, idx) => {
        const x = (idx / (wpmHistory.length - 1)) * 180;
        const y = 38 - (val / maxVal) * 32;
        return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [wpmHistory]);

  const activeThemeSurface =
    perfMode === 'ultra'
      ? 'border-cyan-400/40 text-slate-100 shadow-[0_24px_70px_-20px_rgba(6,182,212,0.45)]'
      : perfMode === 'balanced'
      ? 'border-sky-400/35 text-slate-900 dark:text-slate-100 shadow-xl'
      : 'border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-md';

  const cardSurface =
    perfMode === 'ultra'
      ? 'bg-slate-950/75 backdrop-blur-xl border-cyan-400/35 text-slate-100'
      : perfMode === 'balanced'
      ? 'bg-white/88 dark:bg-slate-900/82 backdrop-blur-md border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-100'
      : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100';

  const activeLockedWord = words.find((w) => w.id === lockedWordId) || null;

  return (
    <div
      className={`relative rounded-2xl border overflow-hidden min-h-[690px] sm:min-h-[720px] flex flex-col justify-between transition-colors duration-200 ${activeThemeSurface}`}
    >
      {/* Dynamic Tier-Scaled Background (Low Static Grid / Medium 2D Waves / Pro 3D WebGL Crystal & Stars) */}
      <TypingArenaBackdrop
        perfMode={perfMode}
        wpm={wpm}
        combo={combo}
        isPlaying={phase === 'PLAYING'}
        burstTick={burstTick}
        errorTick={errorTick}
        overdriveActive={overdriveActive}
      />

      {/* ==================== TOP GAME CONTROL DECK ==================== */}
      <div className="relative z-20 p-3 sm:p-4 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/75 dark:bg-slate-950/70 backdrop-blur-md space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Mascot + Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            <ParrotoMascot
              mood={overdriveActive ? 'fever' : mascotMood}
              animate={perfMode !== 'smooth' && phase === 'PLAYING'}
            />
            <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/70 dark:border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  setMode('arcade');
                  setPhase('MENU');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                  mode === 'arcade'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isEn ? 'Parroto Arcade' : 'Parroto Săn Từ'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('timed_passage');
                  setPhase('MENU');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                  mode === 'timed_passage'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isEn ? 'Timed Passage' : 'Gõ Đoạn Văn Đếm Giờ'}</span>
              </button>
            </div>
          </div>

          {/* Right: Vietnamese IME + Difficulty + Graphics Tier + Sound Profile */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Built-in Vietnamese Input Method Selector */}
            <div
              className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/70 dark:border-slate-700/80"
              title={
                isEn
                  ? 'Vietnamese Input Method (Telex / VNI built-in or OS UniKey/EVKey)'
                  : 'Kiểu gõ Tiếng Việt (Telex / VNI tích hợp sẵn hoặc dùng UniKey/EVKey)'
              }
            >
              {(
                [
                  { id: 'telex', label: 'Telex' },
                  { id: 'vni', label: 'VNI' },
                  { id: 'system', label: isEn ? 'OS IME' : 'UniKey/OS' },
                ] as Array<{ id: VietnameseImeMode; label: string }>
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    userPickedImeRef.current = true;
                    setImeMode(opt.id);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    imeMode === opt.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* 3 Difficulty Modes */}
            <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/70 dark:border-slate-700/80">
              {(['easy', 'normal', 'hard'] as TypingDifficulty[]).map((d) => {
                const cfg = TYPING_DIFFICULTIES[d];
                const active = difficulty === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDifficulty(d);
                      if (phase === 'PLAYING' || phase === 'PAUSED') {
                        setPhase('MENU');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                      active
                        ? d === 'easy'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : d === 'normal'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {isEn ? cfg.labelEn : cfg.labelVi}
                  </button>
                );
              })}
            </div>

            {/* Inline Graphics Tier Switcher (Low / Medium / Pro) */}
            <div
              className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300/70 dark:border-slate-700/80"
              title={isEn ? 'Graphics & Animation Tier' : 'Mức đồ họa & Nền động'}
            >
              {(
                [
                  { id: 'smooth', labelVi: 'Thấp', labelEn: 'Low' },
                  { id: 'balanced', labelVi: 'Trung bình', labelEn: 'Med' },
                  { id: 'ultra', labelVi: 'Pro 3D', labelEn: 'Pro 3D' },
                ] as Array<{ id: PerformanceMode; labelVi: string; labelEn: string }>
              ).map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => applyGraphicsTier(tier.id, false)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    perfMode === tier.id
                      ? tier.id === 'ultra'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-sm'
                        : 'bg-slate-800 dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isEn ? tier.labelEn : tier.labelVi}
                </button>
              ))}
            </div>

            {soundEnabled && (
              <select
                value={soundProfile}
                onChange={(e) => {
                  const id = e.target.value as TypingSoundProfile['id'];
                  setSoundProfile(id);
                  soundEngine.playClick(id as ClickSoundId, 0.48);
                }}
                aria-label={isEn ? 'Key sound profile' : 'Âm thanh bàn phím'}
                className="px-2 py-1.5 rounded-lg border border-slate-300/80 dark:border-slate-700 bg-white/85 dark:bg-slate-900/85 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:border-sky-400"
              >
                {TYPING_SOUND_PROFILES.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {isEn ? sp.labelEn : sp.labelVi}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="p-2 rounded-lg border border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-sky-400 cursor-pointer"
              title={soundEnabled ? (isEn ? 'Mute sound FX' : 'Tắt âm gõ phím') : isEn ? 'Enable sound FX' : 'Bật âm gõ phím'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-3.5 tabular-nums">
            <div>
              <span className="text-slate-500 dark:text-slate-400">WPM </span>
              <span className="font-mono font-bold text-sm text-sky-600 dark:text-cyan-300">
                {wpm}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400"> / {diffCfg.targetWpm}</span>
            </div>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <div>
              <span className="text-slate-500 dark:text-slate-400">{isEn ? 'Acc ' : 'Chính xác '}</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-300">
                {accuracy}%
              </span>
            </div>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <div className="inline-flex items-center gap-1">
              <Flame className={`w-3.5 h-3.5 ${overdriveActive || combo >= 10 ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="text-slate-500 dark:text-slate-400">Combo </span>
              <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-300">
                {combo}
              </span>
            </div>
            <span aria-hidden="true" className="text-slate-400">·</span>
            {mode === 'arcade' ? (
              <div className="inline-flex items-center gap-2">
                <div className="inline-flex items-center gap-1">
                  {Array.from({ length: diffCfg.hearts }).map((_, idx) => (
                    <Heart
                      key={idx}
                      className={`w-3.5 h-3.5 transition-transform ${
                        idx < hearts
                          ? 'text-rose-500 fill-rose-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                  {shieldActive && <Shield className="w-3.5 h-3.5 text-cyan-400 ml-0.5" />}
                </div>
                <span aria-hidden="true" className="text-slate-400">·</span>
                {runFormat === 'campaign' && (
                  <span className="font-mono font-bold text-sky-600 dark:text-cyan-300">
                    {activeBoss
                      ? isEn
                        ? `BOSS ${activeBoss.phaseIdx + 1}/${activeBoss.config.phases.length}`
                        : `BOSS ${activeBoss.phaseIdx + 1}/${activeBoss.config.phases.length}`
                      : `Wave ${campaignWave}/3 · ${clearedWordsCount}/26`}
                  </span>
                )}
                {runFormat === 'sprint' && (
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300">
                    {clearedWordsCount}/{SPRINT_WORD_TARGETS[difficulty]} {isEn ? 'words' : 'từ'}
                  </span>
                )}
                {runFormat === 'time_attack' && (
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    {arcadeTimeLeftSec}s
                  </span>
                )}
                {runFormat === 'endless' && (
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                    {clearedWordsCount} {isEn ? 'words' : 'từ'}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-1">
                <Clock className={`w-3.5 h-3.5 ${timeLeftSec <= 10 && !waitingFirstKey ? 'text-rose-500' : 'text-sky-500'}`} />
                <span
                  className={`font-mono font-bold text-sm ${
                    timeLeftSec <= 10 && !waitingFirstKey
                      ? 'text-rose-500'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {timeLeftSec}s
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
              {mode === 'arcade'
                ? `${isEn ? 'Score' : 'Điểm'}: ${score} · ${isEn ? 'Best' : 'Kỉ lục'}: ${records.bestArcadeScore[difficulty]}`
                : `${isEn ? 'Best Speed' : 'Tốt nhất'}: ${records.bestWpm[difficulty]} WPM`}
            </span>
            {phase === 'PLAYING' && (
              <button
                type="button"
                onClick={() => setPhase('PAUSED')}
                className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs font-semibold hover:border-sky-400 cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>{isEn ? 'Pause' : 'Tạm dừng'}</span>
              </button>
            )}
            {(phase === 'PLAYING' || phase === 'PAUSED') && (
              <button
                type="button"
                onClick={() => startNewRound(false)}
                className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs font-semibold hover:border-sky-400 cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Restart' : 'Chơi lại'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== CENTER INTERACTIVE ARENA STAGE ==================== */}
      <div className="relative z-10 flex-1 p-3 sm:p-5 pb-4 lg:pb-48 flex flex-col justify-center">
        {/* ---------- MENU PHASE ---------- */}
        {phase === 'MENU' && (
          <div className={`max-w-4xl mx-auto w-full rounded-2xl border p-4 sm:p-6 space-y-5 ${cardSurface}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
                  {mode === 'arcade'
                    ? isEn
                      ? 'Parroto Speed-Typing Arena'
                      : 'Đấu trường Luyện Gõ Tốc Độ Parroto'
                    : isEn
                    ? 'Timed Custom Passage Arena'
                    : 'Vùng Gõ Đoạn Văn Theo Thời Gian Quy Định'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {isEn ? diffCfg.descEn : diffCfg.descVi}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startNewRound(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isEn ? 'Start Game' : 'Bắt đầu ngay'}</span>
              </button>
            </div>

            {mode === 'arcade' ? (
              <div className="space-y-4">
                {/* Run Format Selector (Campaign / Sprint / Time Attack / Endless) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isEn ? 'Match Format & Objective' : 'Thể thức trận đấu (Không bị lặp & nhàm chán)'}
                  </span>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {TYPING_RUN_FORMATS.map((rf) => {
                      const active = runFormat === rf.id;
                      return (
                        <button
                          key={rf.id}
                          type="button"
                          onClick={() => setRunFormat(rf.id)}
                          className={`text-left p-2.5 rounded-xl border transition cursor-pointer ${
                            active
                              ? 'border-emerald-500 bg-emerald-500/12 dark:bg-emerald-500/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-950/40 hover:border-emerald-400/60'
                          }`}
                        >
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            {rf.id === 'campaign' && <Swords className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            {rf.id === 'sprint' && <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            {rf.id === 'time_attack' && <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
                            {rf.id === 'endless' && <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                            <span className="truncate">{isEn ? rf.labelEn : rf.labelVi}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {isEn ? rf.descEn : rf.descVi}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Word Topic Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {isEn ? 'Select Word Topic' : 'Chọn chủ đề từ ngữ xuất hiện'}
                    </span>
                    {practiceMissedPool.length > 0 && (
                      <button
                        type="button"
                        onClick={() => startNewRound(true)}
                        className="text-xs font-semibold text-amber-600 dark:text-amber-300 hover:underline cursor-pointer"
                      >
                        {isEn
                          ? `Drill ${practiceMissedPool.length} Missed Words`
                          : `Luyện lại ${practiceMissedPool.length} từ từng bỏ lỡ`}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {TYPING_TOPICS.map((t) => {
                      const active = topic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setTopic(t.id);
                            if (!userPickedImeRef.current) {
                              const isAsciiTopic =
                                t.id === 'cpp_commands' ||
                                t.id === 'python_commands' ||
                                t.id === 'english_stem';
                              setImeMode(isAsciiTopic ? 'system' : 'telex');
                            }
                          }}
                          className={`text-left p-3 rounded-xl border transition cursor-pointer ${
                            active
                              ? 'border-sky-500 bg-sky-500/12 dark:bg-sky-500/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-950/40 hover:border-sky-400/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm font-bold truncate">
                              {isEn ? t.labelEn : t.labelVi}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-cyan-300 shrink-0">
                              {t.badgeText}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 truncate">
                            {t.samplePreview}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* TIMED PASSAGE SETUP & UPLOAD */
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {TIMED_PASSAGES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(p.id);
                          setPassageText(p.text);
                          setCustomFilename(null);
                          setShowPassageEditor(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer whitespace-nowrap ${
                          selectedPresetId === p.id
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 hover:border-emerald-400'
                        }`}
                      >
                        {isEn ? p.categoryLabelEn : p.categoryLabelVi}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.md,.cpp,.py,.csv,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg border border-sky-400/60 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-cyan-300 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Upload .txt/.cpp/.py' : 'Tải file đoạn văn'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassageEditor((v) => !v)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:border-sky-400 cursor-pointer whitespace-nowrap"
                    >
                      {showPassageEditor
                        ? isEn
                          ? 'Done Editing'
                          : 'Xong văn bản'
                        : isEn
                        ? 'Paste / Edit Text'
                        : 'Dán / Tự sửa văn bản'}
                    </button>
                  </div>
                </div>

                {showPassageEditor ? (
                  <textarea
                    value={passageText}
                    onChange={(e) => {
                      setPassageText(e.target.value);
                      setSelectedPresetId('custom');
                    }}
                    rows={4}
                    placeholder={
                      isEn
                        ? 'Paste any English, Vietnamese, or code passage here...'
                        : 'Dán đoạn văn Tiếng Việt, Tiếng Anh, báo cáo hoặc code C++/Python vào đây...'
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 max-h-28 overflow-y-auto">
                    {customFilename && (
                      <div className="text-[11px] font-mono text-sky-600 dark:text-cyan-300 mb-1">
                        File: {customFilename}
                      </div>
                    )}
                    {passageText}
                  </div>
                )}

                {/* Time Limit Selector: Difficulty Auto vs Custom Override */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/70 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setUseCustomTimer(false)}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer whitespace-nowrap ${
                        !useCustomTimer
                          ? 'border-sky-500 bg-sky-500/15 text-sky-700 dark:text-cyan-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isEn
                        ? `Auto Time (${isEn ? diffCfg.labelEn : diffCfg.labelVi}: ${computeSuggestedTimeSec(passageText, difficulty)}s)`
                        : `Mốc chuẩn ${diffCfg.labelVi}: ${computeSuggestedTimeSec(passageText, difficulty)}s`}
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseCustomTimer(true)}
                      className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer whitespace-nowrap ${
                        useCustomTimer
                          ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isEn ? 'Custom Time' : 'Tự chỉnh thời gian'}
                    </button>

                    {useCustomTimer && (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={15}
                          max={600}
                          step={5}
                          value={customSeconds}
                          onChange={(e) => setCustomSeconds(Number(e.target.value))}
                          className="w-28 accent-amber-500 cursor-pointer"
                        />
                        <span className="font-mono font-bold tabular-nums">{customSeconds}s</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <span>
                      {passageText.length} {isEn ? 'chars' : 'kí tự'} · {passageText.trim().split(/\s+/).length}{' '}
                      {isEn ? 'words' : 'từ'}
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={strictErrorLock}
                        onChange={(e) => setStrictErrorLock(e.target.checked)}
                        className="accent-sky-500"
                      />
                      <span>{isEn ? 'Strict Stop on Typo' : 'Chặn khi gõ sai'}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- PAUSED OVERLAY ---------- */}
        {phase === 'PAUSED' && (
          <div className={`max-w-md mx-auto w-full rounded-2xl border p-6 text-center space-y-4 ${cardSurface}`}>
            <h3 className="text-xl font-bold">{isEn ? 'Game Paused' : 'Đang tạm dừng'}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isEn
                ? 'Resume whenever you are ready, or restart a fresh round.'
                : 'Nhấn Tiếp tục để giữ nguyên điểm số và nhịp độ hiện tại.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  statsRef.current.startTimeMs = Date.now() - Math.max(1000, wpmHistory.length * 700);
                  setPhase('PLAYING');
                  window.setTimeout(() => {
                    if (mode === 'arcade') arcadeInputRef.current?.focus();
                    else passageInputRef.current?.focus();
                  }, 30);
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isEn ? 'Resume' : 'Tiếp tục'}</span>
              </button>
              <button
                type="button"
                onClick={() => startNewRound(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:border-sky-400 cursor-pointer"
              >
                {isEn ? 'Restart' : 'Chơi lại'}
              </button>
            </div>
          </div>
        )}

        {/* ---------- ACTIVE PLAYING VIEW: PARROTO ARCADE ---------- */}
        {phase === 'PLAYING' && mode === 'arcade' && (
          <div className="space-y-2.5 w-full max-w-5xl mx-auto">
            {/* Compact Status Header: Overdrive Meter + Boss HP / Ghost Rival Progress */}
            <div className={`rounded-xl border px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs ${cardSurface}`}>
              {/* Overdrive Meter */}
              <div className="flex items-center gap-2 min-w-[190px] flex-1">
                <Zap className={`w-3.5 h-3.5 shrink-0 ${overdriveActive ? 'text-amber-400' : 'text-sky-500'}`} />
                <span className="font-bold whitespace-nowrap">
                  {overdriveActive ? 'OVERDRIVE ×2!' : 'Overdrive'}
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-[width] duration-150 ${
                      overdriveActive
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400'
                        : 'bg-gradient-to-r from-sky-500 to-cyan-400'
                    }`}
                    style={{ width: `${overdrivePct}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] tabular-nums w-8 text-right">{overdrivePct}%</span>
              </div>

              {/* Mission Objective / Boss Bar / Ghost Rival */}
              {activeBoss ? (
                <div className="flex items-center gap-2 min-w-[230px] flex-1">
                  <Crown className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-bold text-rose-600 dark:text-rose-300 truncate">
                    {isEn ? activeBoss.config.titleEn : activeBoss.config.titleVi}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-[width] duration-200"
                      style={{
                        width: `${Math.round(
                          ((activeBoss.config.phases.length - activeBoss.phaseIdx) /
                            activeBoss.config.phases.length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
                  {runFormat === 'campaign' && (
                    <span className="text-sky-600 dark:text-cyan-300 font-bold">
                      {isEn
                        ? `Wave ${campaignWave}/3 · ${Math.max(0, 26 - clearedWordsCount)} to Boss`
                        : `Wave ${campaignWave}/3 · Còn ${Math.max(0, 26 - clearedWordsCount)} từ gặp Boss`}
                    </span>
                  )}
                  {(runFormat === 'sprint' || runFormat === 'time_attack') && (
                    <span className="text-slate-600 dark:text-slate-300">
                      {isEn ? 'You' : 'Bạn'}: <strong className="text-emerald-500">{clearedWordsCount}</strong> vs Ghost:{' '}
                      <strong className="text-amber-500">{ghostWordsProgress}</strong>
                    </span>
                  )}
                  {runFormat === 'endless' && (
                    <span className="text-slate-600 dark:text-slate-300">
                      {isEn ? 'Next Mini-Boss in' : 'Mini-Boss sau'}:{' '}
                      <strong className="text-amber-500">{15 - (clearedWordsCount % 15)}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 3-Lane Glide Track */}
            <div
              onClick={() => arcadeInputRef.current?.focus()}
              className={`relative h-[255px] sm:h-[280px] rounded-2xl border overflow-hidden cursor-text transition-colors duration-200 ${
                overdriveActive
                  ? 'border-amber-400/75 bg-slate-950/70 shadow-[0_0_32px_rgba(251,191,36,0.28)]'
                  : perfMode === 'ultra'
                  ? 'border-cyan-400/40 bg-slate-950/60 backdrop-blur-md'
                  : 'border-slate-300/80 dark:border-slate-700/80 bg-white/65 dark:bg-slate-950/65'
              }`}
            >
              {/* Defense Barrier Line */}
              <div
                aria-hidden="true"
                className={`absolute inset-y-0 left-[6%] w-0.5 ${
                  shieldActive
                    ? 'bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.95)]'
                    : 'bg-rose-500/75'
                }`}
              />
              {freezeRemainingSec > 0 && (
                <div className="pointer-events-none absolute top-2 right-3 px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-300/60 text-cyan-200 text-xs font-mono font-bold z-20">
                  ❄ FREEZE {freezeRemainingSec}s
                </div>
              )}

              {/* Wave / Boss Intro Banner */}
              {waveBanner && (
                <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center z-30">
                  <div className="typing-banner-slide px-4 py-1.5 rounded-xl border border-amber-400/70 bg-slate-950/88 text-amber-300 font-mono text-xs sm:text-sm font-extrabold shadow-lg">
                    {waveBanner}
                  </div>
                </div>
              )}

              {/* Lane Horizontal Guides */}
              {[0, 1, 2].map((lane) => (
                <div
                  key={lane}
                  style={{ top: `${lane * 33.33}%`, height: '33.33%' }}
                  className="absolute inset-x-0 border-b last:border-b-0 border-slate-300/30 dark:border-slate-700/35"
                />
              ))}

              {/* Gliding Word Tokens */}
              {words.map((w) => {
                const isLocked = w.id === lockedWordId;
                const matchedLen = isLocked
                  ? matchesVietnamesePrefix(arcadeInput, w.text).visualMatchedLen
                  : 0;
                const matchedPart = w.text.slice(0, matchedLen);
                const restPart = w.text.slice(matchedLen);
                const danger = w.xPct <= 24;

                return (
                  <div
                    key={w.id}
                    style={{
                      transform: `translate3d(${w.xPct}%, 0, 0)`,
                      top: `${w.lane * 33.33 + 6}%`,
                      left: 0,
                      width: '100%',
                    }}
                    className="pointer-events-none absolute will-change-transform"
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm sm:text-base font-bold shadow-md transition-colors duration-100 ${
                        w.kind === 'boss'
                          ? 'bg-rose-950/95 border-amber-400 shadow-[0_0_24px_rgba(244,63,94,0.65)] scale-105'
                          : isLocked
                          ? perfMode === 'ultra'
                            ? 'bg-slate-900/95 border-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.55)] scale-105'
                            : 'bg-white dark:bg-slate-900 border-sky-500 shadow-lg scale-105'
                          : w.kind === 'gold'
                          ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.35)]'
                          : w.kind === 'heal'
                          ? 'bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-400'
                          : danger
                          ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-500/80'
                          : 'bg-white/92 dark:bg-slate-900/92 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {w.kind === 'boss' && <Crown className="w-4 h-4 text-amber-400 shrink-0" />}
                      {w.kind === 'gold' && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      {w.kind === 'heal' && <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 shrink-0" />}
                      <span>
                        {matchedPart && (
                          <span className="text-emerald-400">
                            {matchedPart}
                          </span>
                        )}
                        <span
                          className={
                            w.kind === 'boss'
                              ? 'text-amber-100'
                              : isLocked
                              ? 'text-slate-900 dark:text-white'
                              : w.kind === 'gold'
                              ? 'text-amber-800 dark:text-amber-200'
                              : w.kind === 'heal'
                              ? 'text-emerald-800 dark:text-emerald-200'
                              : danger
                              ? 'text-rose-700 dark:text-rose-200'
                              : 'text-slate-800 dark:text-slate-100'
                          }
                        >
                          {restPart}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Score Delta Popups */}
              {deltas.map((d) => (
                <div
                  key={d.id}
                  style={{
                    left: `${Math.min(82, Math.max(10, d.xPct))}%`,
                    top: `${d.lane * 33 + 12}%`,
                  }}
                  className={`pointer-events-none absolute typing-pop-float font-mono text-xs sm:text-sm font-extrabold z-20 ${
                    d.tone === 'amber'
                      ? 'text-amber-400'
                      : d.tone === 'rose'
                      ? 'text-rose-400'
                      : d.tone === 'cyan'
                      ? 'text-cyan-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {d.label}
                </div>
              ))}
            </div>

            {/* Active Typing Input & Power-up Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div
                className={`flex-1 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${cardSurface} ${
                  inputShake ? 'typing-shake-x border-rose-500' : ''
                }`}
              >
                <Keyboard className="w-4 h-4 text-sky-500 shrink-0" />
                <input
                  ref={arcadeInputRef}
                  type="text"
                  value={arcadeInput}
                  onChange={handleArcadeInputChange}
                  onCompositionStart={() => {
                    isComposingRef.current = true;
                  }}
                  onCompositionEnd={handleArcadeCompositionEnd}
                  onKeyDown={handleArcadeKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={
                    activeLockedWord
                      ? `${isEn ? 'Typing' : 'Đang khóa'}: ${activeLockedWord.text}`
                      : isEn
                      ? 'Type any flying word (supports Vietnamese Telex/VNI & Tab to switch)...'
                      : 'Gõ từ đang bay (hỗ trợ dấu Tiếng Việt, Tab để đổi mục tiêu)...'
                  }
                  className="w-full bg-transparent text-sm sm:text-base font-mono font-semibold focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Tactical Power-ups */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={powerCharges.freeze <= 0}
                  onClick={() => triggerPowerUp('freeze')}
                  className="px-3 py-2.5 rounded-xl border border-cyan-400/50 bg-cyan-500/15 hover:bg-cyan-500/25 disabled:opacity-40 text-xs font-bold text-cyan-700 dark:text-cyan-200 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1.5 whitespace-nowrap"
                  title="Alt + 1"
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Freeze' : 'Đóng băng'} ({powerCharges.freeze})</span>
                </button>
                <button
                  type="button"
                  disabled={powerCharges.emp <= 0}
                  onClick={() => triggerPowerUp('emp')}
                  className="px-3 py-2.5 rounded-xl border border-amber-400/50 bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-40 text-xs font-bold text-amber-700 dark:text-amber-200 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1.5 whitespace-nowrap"
                  title="Alt + 2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EMP ({powerCharges.emp})</span>
                </button>
                <button
                  type="button"
                  disabled={powerCharges.shield <= 0 || shieldActive}
                  onClick={() => triggerPowerUp('shield')}
                  className="px-3 py-2.5 rounded-xl border border-emerald-400/50 bg-emerald-500/15 hover:bg-emerald-500/25 disabled:opacity-40 text-xs font-bold text-emerald-700 dark:text-emerald-200 cursor-pointer disabled:cursor-not-allowed inline-flex items-center gap-1.5 whitespace-nowrap"
                  title="Alt + 3"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Shield' : 'Khiên'} ({powerCharges.shield})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- ACTIVE PLAYING VIEW: TIMED CUSTOM PASSAGE ---------- */}
        {phase === 'PLAYING' && mode === 'timed_passage' && (
          <div className="space-y-3 w-full max-w-5xl mx-auto">
            {/* Ghost Target Pace Bar */}
            <div className={`rounded-xl border px-3.5 py-2.5 space-y-2 ${cardSurface}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold">
                  {waitingFirstKey
                    ? isEn
                      ? 'Timer armed — type your first character to start countdown!'
                      : 'Sẵn sàng — gõ kí tự đầu tiên để bắt đầu đếm ngược!'
                    : paceDeltaWpm >= 0
                    ? isEn
                      ? `Ahead of target (+${paceDeltaWpm} WPM)`
                      : `Đang vượt mốc yêu cầu (+${paceDeltaWpm} WPM)`
                    : isEn
                    ? `Behind target (${paceDeltaWpm} WPM)`
                    : `Cần tăng tốc (${paceDeltaWpm} WPM so với mốc)`}
                </span>
                <span className="font-mono tabular-nums">
                  {passageProgressPct}% {isEn ? 'typed' : 'hoàn thành'} · {timeLeftSec}s{' '}
                  {isEn ? 'left' : 'còn lại'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-[width] duration-150"
                    style={{ width: `${passageProgressPct}%` }}
                  />
                </div>
                <div className="h-1 rounded-full bg-slate-200/70 dark:bg-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full transition-[width] duration-300 ${
                      timeElapsedPct > passageProgressPct ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${timeElapsedPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Token-Aligned Passage Viewport (Supports Telex, VNI, and OS IME) */}
            <div
              onClick={() => passageInputRef.current?.focus()}
              className={`relative rounded-2xl border p-4 sm:p-5 h-[225px] sm:h-[245px] overflow-y-auto cursor-text font-mono text-sm sm:text-base leading-relaxed select-none ${cardSurface}`}
            >
              <textarea
                ref={passageInputRef}
                value={passageTyped}
                onChange={handlePassageInputChange}
                onCompositionStart={() => {
                  isComposingRef.current = true;
                }}
                onCompositionEnd={handlePassageCompositionEnd}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setPhase('PAUSED');
                  }
                }}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label={isEn ? 'Timed passage typing input' : 'Khung nhập đoạn văn'}
                className="sr-only"
              />

              {/* Compact Active Word IME Preview Bar */}
              <div className="mb-2.5 pb-2 border-b border-slate-200/70 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">
                    {isEn ? 'Current word:' : 'Đang gõ:'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border font-mono font-bold ${
                      passageAlignment.activeMatch.prefixMatch
                        ? 'border-sky-400/50 bg-sky-500/10 text-sky-700 dark:text-cyan-200'
                        : 'border-rose-400/60 bg-rose-500/10 text-rose-600 dark:text-rose-300'
                    }`}
                  >
                    {passageAlignment.activeTyped || '…'}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                    {passageAlignment.activeExpected}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {imeMode === 'telex'
                    ? 'Telex (aa/aw/dd/s/f/r/x/j)'
                    : imeMode === 'vni'
                    ? 'VNI (1-5/6/7/8/9)'
                    : 'UniKey / OS IME'}
                </span>
              </div>

              <div className="whitespace-pre-wrap break-words">
                {passageTokens.map((expectedToken, tokenIdx) => {
                  const typedToken = passageAlignment.typedTokens[tokenIdx];
                  const isPastToken = tokenIdx < passageAlignment.activeTokenIdx;
                  const isActiveToken = tokenIdx === passageAlignment.activeTokenIdx;

                  if (isActiveToken) {
                    const m = passageAlignment.activeMatch;
                    const caretPos = m.prefixMatch
                      ? Math.min(expectedToken.length, m.visualMatchedLen)
                      : Math.min(expectedToken.length, passageAlignment.activeTyped.length);

                    return (
                      <span key={tokenIdx}>
                        {expectedToken.split('').map((ch, charIdx) => {
                          const isCaret = charIdx === caretPos;
                          const isMatched = m.prefixMatch
                            ? charIdx < m.visualMatchedLen
                            : charIdx < passageAlignment.activeTyped.length &&
                              passageAlignment.activeTyped[charIdx] === ch;
                          const isWrong =
                            !m.prefixMatch &&
                            charIdx < passageAlignment.activeTyped.length &&
                            passageAlignment.activeTyped[charIdx] !== ch;

                          return (
                            <span
                              key={charIdx}
                              ref={isCaret ? passageActiveCharRef : null}
                              className={
                                isCaret
                                  ? 'relative bg-sky-500/25 text-sky-900 dark:text-cyan-200 rounded-[2px] border-b-2 border-sky-500 typing-caret-pulse'
                                  : isMatched
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : isWrong
                                  ? 'bg-rose-500/25 text-rose-600 dark:text-rose-300 underline decoration-rose-500'
                                  : 'text-slate-500 dark:text-slate-400'
                              }
                            >
                              {ch}
                            </span>
                          );
                        })}
                        {caretPos >= expectedToken.length && (
                          <span
                            ref={passageActiveCharRef}
                            className="inline-block w-1.5 h-4 align-middle bg-sky-500/70 typing-caret-pulse ml-0.5"
                          />
                        )}
                      </span>
                    );
                  }

                  if (isPastToken) {
                    const actual = typedToken ?? '';
                    const exactPast = actual === expectedToken;
                    if (exactPast) {
                      return (
                        <span key={tokenIdx} className="text-emerald-600 dark:text-emerald-400">
                          {expectedToken}
                        </span>
                      );
                    }
                    return (
                      <span key={tokenIdx}>
                        {expectedToken.split('').map((ch, charIdx) => {
                          const ok = actual[charIdx] === ch;
                          return (
                            <span
                              key={charIdx}
                              className={
                                ok
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-500/25 text-rose-600 dark:text-rose-300 underline decoration-rose-500'
                              }
                            >
                              {ch}
                            </span>
                          );
                        })}
                      </span>
                    );
                  }

                  return (
                    <span key={tokenIdx} className="text-slate-400 dark:text-slate-500">
                      {expectedToken}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------- RESULTS & ANALYTICS PHASE ---------- */}
        {phase === 'RESULTS' && (() => {
          const rankGrade =
            wpm >= 72 && accuracy >= 96
              ? 'S+'
              : wpm >= 56 && accuracy >= 93
              ? 'S'
              : wpm >= 42 && accuracy >= 88
              ? 'A'
              : wpm >= 28 && accuracy >= 80
              ? 'B'
              : 'C';

          return (
            <div className={`max-w-3xl mx-auto w-full rounded-2xl border p-5 sm:p-6 space-y-5 ${cardSurface}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-2xl border shadow-md shrink-0 ${
                      rankGrade === 'S+' || rankGrade === 'S'
                        ? 'border-amber-400 bg-gradient-to-br from-amber-500/25 to-yellow-400/15 text-amber-400'
                        : rankGrade === 'A'
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-400'
                        : 'border-slate-400/50 bg-slate-500/10 text-slate-600 dark:text-slate-200'
                    }`}
                  >
                    {rankGrade}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      {bossDefeated ? (
                        <Crown className="w-6 h-6 text-amber-400" />
                      ) : (
                        <Award className="w-6 h-6 text-amber-500" />
                      )}
                      <span>
                        {mode === 'timed_passage'
                          ? passagePassed
                            ? isEn
                              ? 'Passage Completed in Time!'
                              : 'Hoàn thành bài gõ đúng hạn!'
                            : isEn
                            ? 'Time Expired!'
                            : 'Hết giờ quy định!'
                          : arcadeVictory
                          ? bossDefeated
                            ? isEn
                              ? 'Boss Defeated — Victory!'
                              : 'Hạ Gục Boss — Chiến Thắng!'
                            : isEn
                            ? 'Mission Accomplished!'
                            : 'Hoàn Thành Mục Tiêu!'
                          : isEn
                          ? 'Arcade Run Summary'
                          : 'Tổng kết lượt chơi Parroto'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                      {isNewBest
                        ? isEn
                          ? 'New personal record achieved in this difficulty tier.'
                          : 'Chúc mừng! Bạn vừa phá kỉ lục cá nhân ở chế độ này.'
                        : isEn
                        ? 'Review your speed, accuracy, medals, and weakest keys below.'
                        : 'Xem phân tích tốc độ, huy hiệu đạt được và bài luyện phím yếu.'}
                      {lastXpEarned > 0 && ` · +${lastXpEarned} XP`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(topWeakKeys.length > 0 || missedWordsList.length > 0) && (
                    <button
                      type="button"
                      onClick={() => {
                        const drill = buildSmartDrillPassage(
                          topWeakKeys.map((k) => k[0]),
                          missedWordsList,
                          isEn
                        );
                        setMode('timed_passage');
                        setSelectedPresetId('smart_drill');
                        setPassageText(drill);
                        setCustomFilename(isEn ? 'Smart Weak-Key Drill' : 'Bài luyện phím yếu tự động');
                        setShowPassageEditor(false);
                        setPhase('MENU');
                      }}
                      className="px-3.5 py-2 rounded-xl border border-cyan-400/60 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-200 text-xs font-bold cursor-pointer whitespace-nowrap"
                    >
                      {isEn ? 'Smart Weak-Key Drill' : 'Tạo bài luyện phím yếu'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startNewRound(false)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-sm font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Play Again' : 'Chơi lại ngay'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase('MENU')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:border-sky-400 cursor-pointer whitespace-nowrap"
                  >
                    {isEn ? 'Change Setup' : 'Đổi chế độ'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Net WPM</div>
                  <div className="text-2xl font-mono font-bold text-sky-600 dark:text-cyan-300">{wpm}</div>
                  <div className="text-[11px] text-slate-500">Peak {peakWpm} · Raw {rawWpm}</div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? 'Accuracy' : 'Độ chính xác'}
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-300">
                    {accuracy}%
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Max Combo</div>
                  <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-300">
                    {maxCombo}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {mode === 'arcade' ? (isEn ? 'Words / Score' : 'Từ / Điểm') : isEn ? 'Progress' : 'Tiến độ'}
                  </div>
                  <div className="text-2xl font-mono font-bold">
                    {mode === 'arcade' ? `${clearedWordsCount} · ${score}` : `${passageProgressPct}%`}
                  </div>
                </div>
              </div>

              {/* Earned Medals Showcase */}
              {records.unlockedMedals.length > 0 && (
                <div className="pt-1 border-t border-slate-200/70 dark:border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isEn ? 'Achievement Medals' : 'Huy hiệu Thành tựu'}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {TYPING_MEDALS.filter((m) => records.unlockedMedals.includes(m.id)).map((m) => {
                      const isFresh = newMedalsThisRound.includes(m.id);
                      return (
                        <span
                          key={m.id}
                          title={isEn ? m.descEn : m.descVi}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-semibold ${
                            isFresh
                              ? 'border-amber-400 bg-amber-500/20 text-amber-700 dark:text-amber-200'
                              : 'border-slate-300/80 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{isEn ? m.labelEn : m.labelVi}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {topWeakKeys.length > 0 && (
                <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-2">
                  <span className="font-semibold">
                    {isEn ? 'Keys needing practice:' : 'Phím hay gõ nhầm nhất:'}
                  </span>
                  {topWeakKeys.map(([code, count]) => (
                    <span key={code} className="font-mono text-rose-600 dark:text-rose-300">
                      {formatCodeShortLabel(code)} ({count}×)
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ==================== BOTTOM DECK: LIVE KEYBOARD (LEFT) + SPARKLINE (RIGHT) ==================== */}
      <div className="relative z-30 px-3 pb-3 flex flex-col lg:block pointer-events-none">
        {/* Bottom-Left Corner: Real-Time Mini Keyboard */}
        <div className="lg:absolute lg:left-3 lg:bottom-3">
          <MiniLiveKeyboard
            perfMode={perfMode}
            isEn={isEn}
            expectedChar={expectedCharForHint}
            lastErrorTick={errorTick}
            lastErrorChar={lastErrorChar}
            keyErrorCounts={keyErrorCounts}
            showNextHint={showNextHint}
            onToggleNextHint={() => setShowNextHint((v) => !v)}
          />
        </div>

        {/* Bottom-Right Corner: Live WPM Telemetry Sparkline */}
        <div
          className={`mt-2 lg:mt-0 lg:absolute lg:right-3 lg:bottom-3 pointer-events-auto rounded-xl border p-2.5 w-full sm:w-[236px] ${cardSurface}`}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {isEn ? 'Live Velocity (WPM)' : 'Đồ thị tốc độ (WPM)'}
            </span>
            <span className="font-mono font-bold text-sky-600 dark:text-cyan-300 tabular-nums">
              {wpm} WPM
            </span>
          </div>
          <svg viewBox="0 0 180 42" className="w-full h-10 overflow-visible" aria-hidden="true">
            <line
              x1="0"
              y1="38"
              x2="180"
              y2="38"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            {sparklinePath ? (
              <path
                d={sparklinePath}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <text x="0" y="25" fill="currentColor" fillOpacity="0.45" fontSize="9" fontFamily="monospace">
                {isEn ? 'Start typing to plot WPM...' : 'Gõ phím để vẽ tốc độ...'}
              </text>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
