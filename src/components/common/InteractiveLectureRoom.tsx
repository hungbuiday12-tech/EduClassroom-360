import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Calculator,
  Sparkles,
  List,
  Layers,
  Copy,
  Check,
  Code2,
  Compass,
  MessageSquarePlus,
  Send,
  Award,
  FileText,
  HelpCircle,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Save,
  Loader2,
  Target,
  ChevronDown,
  ChevronUp,
  Search,
  BookMarked,
  Bookmark,
  Download,
  StickyNote,
  Volume2,
  VolumeX,
  Film,
  PlayCircle
} from 'lucide-react';
import {
  AITutorMode,
  BiologyLesson,
  ChemistryLesson,
  LectureStep,
  LectureStepAiMessage,
  LectureStepEvaluation,
  LectureStepSavedResult,
  LessonAssessmentRecord,
  LessonProgressAnalysis,
  MathLecture,
  PhysicsLesson
} from '../../types';
import { PhysicsInline2DSim } from '../physics/PhysicsInline2DSim';
import { PhysicsInline3DSim } from '../physics/PhysicsInline3DSim';
import { ChemistryInlineStepSim } from '../chemistry/ChemistryInlineStepSim';
import { BiologyInlineStepSim } from '../biology/BiologyInlineStepSim';
import { MathInlineStepSim } from '../math/MathInlineStepSim';
import { FormattedText, MathFormula } from './MathRenderer';
import { MonokaiCodeBlock } from '../cs/SublimeEditor';
import { safeFetchJson, streamTutorChat } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceMicButton } from './VoiceMicButton';
import { useNavigation } from '../../context/NavigationContext';
import { subscribeRemoteCommand } from '../../lib/remoteControlBus';
import { MotionReelMiniChat, LectureReelStepSeed } from '../tutor/MotionReelMiniChat';
import {
  speakVietnameseLecture,
  stopVietnameseSpeech,
  toVietnameseSpokenMath
} from '../../lib/vietnameseSpeech';
import {
  computeAssessmentMetrics,
  loadLessonAssessment,
  saveLessonAssessment
} from '../../lib/lessonProgressStore';
import {
  progressDailyQuest,
  recordGrowthStat,
  recordMistake
} from '../../lib/learningGrowthStore';

export interface LectureActionItem {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber';
  icon?: React.ReactNode;
}

interface InteractiveLectureRoomProps {
  lessonKey: string;
  subject?: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs';
  physicsLesson?: PhysicsLesson;
  chemistryLesson?: ChemistryLesson;
  biologyLesson?: BiologyLesson;
  mathLecture?: MathLecture;
  grade?: string;
  subjectAccent: 'indigo' | 'blue' | 'emerald' | 'amber';
  kicker: string;
  title: string;
  subtitle?: string;
  steps: LectureStep[];
  keyFormulas?: string[];
  mnemonics?: string[];
  commonTraps?: string[];
  actions?: LectureActionItem[];
  onEarnXP?: (xp: number) => void;
  onOpenSim2D?: () => void;
  onOpenSim3D?: () => void;
  onNextLesson?: () => void;
  onOpenExams?: () => void;
  onOpenArena?: () => void;
}

const STEP_TYPE_LABEL: Record<NonNullable<LectureStep['stepType']>, string> = {
  intuition: 'Đặt vấn đề & Tư duy trực quan',
  concept: 'Khái niệm & Bản chất cốt lõi',
  derivation: 'Công thức & Chứng minh hệ thức',
  example: 'Ví dụ mẫu giải chi tiết từng bước',
  pitfall: 'Lưu ý thực chiến & Lỗi sai cần tránh',
  experiment: 'Thực hành Thí nghiệm & Kiểm chứng'
};

export const InteractiveLectureRoom: React.FC<InteractiveLectureRoomProps> = ({
  lessonKey,
  subject = 'math',
  physicsLesson,
  chemistryLesson,
  biologyLesson,
  mathLecture,
  grade = '',
  subjectAccent,
  kicker,
  title,
  subtitle,
  steps,
  keyFormulas = [],
  mnemonics = [],
  commonTraps = [],
  actions = [],
  onEarnXP,
  onOpenSim2D,
  onOpenSim3D,
  onNextLesson,
  onOpenExams,
  onOpenArena
}) => {
  const { user, firebaseUser, addXP } = useAuth();
  const { language } = useLanguage();
  const { selectSubject, navigate } = useNavigation();

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [viewLayout, setViewLayout] = useState<'slides' | 'full' | 'video3b1b' | 'glossary' | 'analytics'>('slides');
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal');
  const [revealedStepsMap, setRevealedStepsMap] = useState<Record<number, number>>({});
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Per-lesson persistent state
  const [assessmentRecord, setAssessmentRecord] = useState<LessonAssessmentRecord>(() => {
    const existing = loadLessonAssessment(lessonKey, user?.uid);
    if (existing) return existing;
    return {
      lessonKey,
      subject,
      lessonTitle: title,
      grade,
      totalSteps: steps.length,
      stepResults: {},
      updatedAt: new Date().toISOString()
    };
  });

  // Inline AI Q&A states (per step)
  const [openAiPanelSteps, setOpenAiPanelSteps] = useState<Record<number, boolean>>({});
  const [aiDraftByStep, setAiDraftByStep] = useState<Record<number, string>>({});
  const [aiModeByStep, setAiModeByStep] = useState<Record<number, AITutorMode>>({});
  const [aiLoadingStep, setAiLoadingStep] = useState<number | null>(null);
  const [aiErrorByStep, setAiErrorByStep] = useState<Record<number, string>>({});

  // Essay UI states (per step)
  const [revealedEssayHintSteps, setRevealedEssayHintSteps] = useState<Record<number, boolean>>({});
  const [revealedEssaySampleSteps, setRevealedEssaySampleSteps] = useState<Record<number, boolean>>({});
  const [gradingEssayStep, setGradingEssayStep] = useState<number | null>(null);
  const [essayErrorByStep, setEssayErrorByStep] = useState<Record<number, string>>({});
  const [refreshingQuizStep, setRefreshingQuizStep] = useState<number | null>(null);
  const [quizGenErrorByStep, setQuizGenErrorByStep] = useState<Record<number, string>>({});

  // Overall analysis loading / feedback
  const [isAnalyzingLesson, setIsAnalyzingLesson] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [savePulseMsg, setSavePulseMsg] = useState<string | null>(null);
  const [openDeepDiveSteps, setOpenDeepDiveSteps] = useState<Record<number, boolean>>({});
  const [csTierByStep, setCsTierByStep] = useState<Record<number, 'basic' | 'advanced'>>({});
  const [csLangByStep, setCsLangByStep] = useState<Record<number, 'cpp' | 'python'>>({});
  const [activeFull3DStep, setActiveFull3DStep] = useState<number>(0);
  const [inlineSimViewByStep, setInlineSimViewByStep] = useState<Record<number, 'both' | '2d' | '3d'>>({});

  // Modern Study Tools: Quick formula drawer, per-step bookmarks, personal notes, Vietnamese TTS narration & 3B1B Video
  const [showFormulaDrawer, setShowFormulaDrawer] = useState<boolean>(false);
  const [bookmarkedSteps, setBookmarkedSteps] = useState<Record<number, boolean>>({});
  const [stepNotes, setStepNotes] = useState<Record<number, string>>({});
  const [openNoteSteps, setOpenNoteSteps] = useState<Record<number, boolean>>({});
  const [speakingStepIdx, setSpeakingStepIdx] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState<0.9 | 1.02 | 1.15>(1.02);
  const [isAutoNarratingAll, setIsAutoNarratingAll] = useState<boolean>(false);
  const [videoSeedTopic, setVideoSeedTopic] = useState<string | undefined>(undefined);
  const autoNarratingRef = React.useRef<boolean>(false);

  // Award XP tracking per session/record so students aren't double-rewarded for re-clicking
  const [awardedKeys, setAwardedKeys] = useState<Record<string, boolean>>({});

  // Reload saved progress when lessonKey or user changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setActiveFull3DStep(0);
    setVisitedSteps([0]);
    setRevealedStepsMap({});
    setOpenAiPanelSteps({});
    setOpenDeepDiveSteps({});
    setAiErrorByStep({});
    setEssayErrorByStep({});
    setQuizGenErrorByStep({});
    setAnalysisError(null);
    setViewLayout((prev) => (prev === 'analytics' ? 'slides' : prev));

    const loaded = loadLessonAssessment(lessonKey, user?.uid);
    if (loaded) {
      setAssessmentRecord({
        ...loaded,
        lessonTitle: title,
        subject,
        grade,
        totalSteps: steps.length
      });
    } else {
      setAssessmentRecord({
        lessonKey,
        subject,
        lessonTitle: title,
        grade,
        totalSteps: steps.length,
        stepResults: {},
        updatedAt: new Date().toISOString()
      });
    }
  }, [lessonKey, user?.uid, title, subject, grade, steps.length]);

  const studyStorageKey = `synapse_lecture_study_v1_${user?.uid || 'guest'}_${lessonKey}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(studyStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          bookmarks?: Record<number, boolean>;
          notes?: Record<number, string>;
        };
        setBookmarkedSteps(parsed.bookmarks || {});
        setStepNotes(parsed.notes || {});
      } else {
        setBookmarkedSteps({});
        setStepNotes({});
      }
    } catch {
      setBookmarkedSteps({});
      setStepNotes({});
    }
    setOpenNoteSteps({});
    setShowFormulaDrawer(false);
    stopVietnameseSpeech();
    autoNarratingRef.current = false;
    setIsAutoNarratingAll(false);
    setSpeakingStepIdx(null);
    setVideoSeedTopic(undefined);
  }, [studyStorageKey]);

  const persistStudyMeta = (nextBookmarks: Record<number, boolean>, nextNotes: Record<number, string>) => {
    try {
      localStorage.setItem(
        studyStorageKey,
        JSON.stringify({ bookmarks: nextBookmarks, notes: nextNotes })
      );
    } catch {
      // ignore quota errors
    }
  };

  const toggleStepBookmark = (idx: number) => {
    setBookmarkedSteps((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      persistStudyMeta(next, stepNotes);
      return next;
    });
  };

  const updateStepNote = (idx: number, val: string) => {
    setStepNotes((prev) => {
      const next = { ...prev, [idx]: val };
      persistStudyMeta(bookmarkedSteps, next);
      return next;
    });
  };

  const buildStepSpeechScript = (st: LectureStep, idx: number) => {
    const parts = [
      `Phần ${idx + 1}: ${toVietnameseSpokenMath(st.stepTitle)}.`,
      st.quickIntuition ? `Tư duy trực quan: ${toVietnameseSpokenMath(st.quickIntuition)}.` : '',
      st.conceptSection || st.teacherExplanation
        ? toVietnameseSpokenMath((st.conceptSection || st.teacherExplanation || '').slice(0, 900))
        : '',
      st.formulaSection?.primaryFormula
        ? `Công thức trọng tâm: ${toVietnameseSpokenMath(st.formulaSection.primaryFormula)}.`
        : '',
      st.keyTakeaway ? `Ghi nhớ nhanh: ${toVietnameseSpokenMath(st.keyTakeaway)}.` : ''
    ];
    return parts.filter(Boolean).join(' ');
  };

  const speakStepAt = (idx: number, autoAdvance: boolean) => {
    const st = safeSteps[idx];
    if (!st) {
      autoNarratingRef.current = false;
      setIsAutoNarratingAll(false);
      setSpeakingStepIdx(null);
      return;
    }
    const script = buildStepSpeechScript(st, idx);
    setSpeakingStepIdx(idx);
    speakVietnameseLecture(script, {
      lang: 'vi',
      rate: speechRate,
      onEnd: () => {
        if (autoAdvance && autoNarratingRef.current && idx + 1 < safeSteps.length) {
          const nextIdx = idx + 1;
          setCurrentStepIdx(nextIdx);
          setVisitedSteps((prev) => (prev.includes(nextIdx) ? prev : [...prev, nextIdx]));
          speakStepAt(nextIdx, true);
        } else {
          autoNarratingRef.current = false;
          setIsAutoNarratingAll(false);
          setSpeakingStepIdx(null);
        }
      }
    });
  };

  const toggleSpeakStep = (st: LectureStep, idx: number) => {
    if (speakingStepIdx === idx) {
      stopVietnameseSpeech();
      autoNarratingRef.current = false;
      setIsAutoNarratingAll(false);
      setSpeakingStepIdx(null);
      return;
    }
    autoNarratingRef.current = false;
    setIsAutoNarratingAll(false);
    const script = buildStepSpeechScript(st, idx);
    setSpeakingStepIdx(idx);
    speakVietnameseLecture(script, {
      lang: 'vi',
      rate: speechRate,
      onEnd: () => {
        if (!autoNarratingRef.current) {
          setSpeakingStepIdx(null);
        }
      }
    });
  };

  const toggleAutoNarrateAll = () => {
    if (isAutoNarratingAll) {
      stopVietnameseSpeech();
      autoNarratingRef.current = false;
      setIsAutoNarratingAll(false);
      setSpeakingStepIdx(null);
      return;
    }
    if (safeSteps.length === 0) return;
    autoNarratingRef.current = true;
    setIsAutoNarratingAll(true);
    speakStepAt(currentStepIdx, true);
  };

  useEffect(() => {
    return () => {
      stopVietnameseSpeech();
      autoNarratingRef.current = false;
    };
  }, []);

  const safeSteps = steps.length > 0 ? steps : [];
  const activeStep = safeSteps[currentStepIdx] || safeSteps[0];
  const lectureReelSeeds: LectureReelStepSeed[] = useMemo(
    () =>
      safeSteps.map((st) => ({
        title: st.stepTitle,
        concept: st.quickIntuition || st.conceptSection || st.teacherExplanation || '',
        formula: st.formulaSection?.primaryFormula || ''
      })),
    [safeSteps]
  );

  // Keyboard shortcuts (Left/Right arrow to switch slides when not editing text)
  useEffect(() => {
    if (viewLayout !== 'slides' || safeSteps.length <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setCurrentStepIdx((prev) => Math.min(safeSteps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewLayout, safeSteps.length]);

  const handleExportStudyMarkdown = () => {
    const lines: string[] = [
      `# ${title}`,
      subtitle ? `> ${subtitle}` : '',
      '',
      keyFormulas.length > 0 ? '## Công thức trọng tâm' : '',
      ...keyFormulas.map((f) => `- $$${f}$$`),
      '',
      ...safeSteps.flatMap((st, i) => [
        `## ${i + 1}. ${st.stepTitle}${bookmarkedSteps[i] ? ' [Cần ôn]' : ''}`,
        st.quickIntuition ? `**Hiểu nhanh:** ${st.quickIntuition}` : '',
        (st.formulaSection?.primaryFormula || st.formulaHighlight)
          ? `**Công thức:** \`${st.formulaSection?.primaryFormula || st.formulaHighlight}\``
          : '',
        stepNotes[i]?.trim() ? `**Ghi chú của bạn:**\n${stepNotes[i].trim()}` : '',
        ''
      ]),
      mnemonics.length > 0 ? '## Mẹo nhớ nhanh' : '',
      ...mnemonics.map((m) => `- ${m}`),
      commonTraps.length > 0 ? '\n## Lỗi sai thường gặp' : '',
      ...commonTraps.map((t) => `- ${t}`)
    ].filter((x) => x !== undefined);
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonKey.replace(/[^a-zA-Z0-9_-]/g, '_')}-on-tap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerXP = (rewardKey: string, amount: number) => {
    if (awardedKeys[rewardKey]) return;
    setAwardedKeys((prev) => ({ ...prev, [rewardKey]: true }));
    if (onEarnXP) {
      onEarnXP(amount);
    } else {
      addXP(amount).catch(() => {});
    }
  };

  const persistRecord = (nextRecord: LessonAssessmentRecord, showNotice = true) => {
    setAssessmentRecord(nextRecord);
    saveLessonAssessment(nextRecord, safeSteps, {
      uid: user?.uid,
      firebaseUid: firebaseUser?.uid
    }).catch(() => {});
    if (showNotice) {
      setSavePulseMsg(
        firebaseUser
          ? 'Đã lưu kết quả lên Cloud & Máy'
          : 'Đã tự động lưu kết quả học tập'
      );
      setTimeout(() => setSavePulseMsg(null), 2200);
    }
  };

  const getStepSaved = (idx: number, step: LectureStep): LectureStepSavedResult => {
    return (
      assessmentRecord.stepResults?.[idx] || {
        stepIndex: idx,
        stepTitle: step.stepTitle,
        mcqAnswers: {},
        mcqChecked: {},
        essayAnswer: '',
        aiMessages: [],
        updatedAt: new Date().toISOString()
      }
    );
  };

  const updateStepSaved = (
    idx: number,
    step: LectureStep,
    updater: (prev: LectureStepSavedResult) => LectureStepSavedResult,
    showNotice = true
  ) => {
    const prevStep = getStepSaved(idx, step);
    const drafted = updater(prevStep);
    const quizList = drafted.customQuiz?.miniQuiz || step.miniQuiz || [];
    let checkedCount = 0;
    let correctCount = 0;
    quizList.forEach((q, qIdx) => {
      if (drafted.mcqChecked?.[qIdx]) {
        checkedCount += 1;
        if (drafted.mcqAnswers?.[qIdx] === q.correctIndex) {
          correctCount += 1;
        }
      }
    });

    const updatedStep: LectureStepSavedResult = {
      ...drafted,
      stepIndex: idx,
      stepTitle: step.stepTitle,
      mcqCheckedCount: checkedCount,
      mcqCorrectCount: correctCount,
      updatedAt: new Date().toISOString()
    };
    const nextRecord: LessonAssessmentRecord = {
      ...assessmentRecord,
      lessonKey,
      subject,
      lessonTitle: title,
      grade,
      totalSteps: safeSteps.length,
      stepResults: {
        ...assessmentRecord.stepResults,
        [idx]: updatedStep
      },
      updatedAt: new Date().toISOString()
    };
    persistRecord(nextRecord, showNotice);
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setVisitedSteps((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
    if (viewLayout === 'analytics') {
      setViewLayout('slides');
    }
  };

  useEffect(() => {
    const total = safeSteps.length;
    if (total === 0) return;
    return subscribeRemoteCommand((cmd) => {
      if (cmd.type === 'slide_prev') {
        setCurrentStepIdx((prev) => {
          const next = Math.max(0, prev - 1);
          setVisitedSteps((v) => (v.includes(next) ? v : [...v, next]));
          return next;
        });
        setViewLayout((vl) => (vl === 'analytics' ? 'slides' : vl));
      } else if (cmd.type === 'slide_next') {
        setCurrentStepIdx((prev) => {
          const next = Math.min(total - 1, prev + 1);
          setVisitedSteps((v) => (v.includes(next) ? v : [...v, next]));
          return next;
        });
        setViewLayout((vl) => (vl === 'analytics' ? 'slides' : vl));
      }
    });
  }, [safeSteps.length]);

  const handleCopyFormula = (f: string) => {
    try {
      navigator.clipboard.writeText(f);
      setCopiedFormula(f);
      setTimeout(() => setCopiedFormula(null), 1600);
    } catch {
      // ignore clipboard errors
    }
  };

  // =========================================================================
  // HANDLERS: PER-STEP 2 MCQs, 1 MINI ESSAY, AI Q&A, AI REFRESH QUIZ
  // =========================================================================
  const handleSelectMcqOption = (stepIdx: number, qIdx: number, optIdx: number) => {
    const step = safeSteps[stepIdx];
    if (!step) return;
    updateStepSaved(
      stepIdx,
      step,
      (prev) => ({
        ...prev,
        mcqAnswers: { ...prev.mcqAnswers, [qIdx]: optIdx }
      }),
      false
    );
  };

  const handleCheckMcqAnswer = (stepIdx: number, qIdx: number) => {
    const step = safeSteps[stepIdx];
    if (!step) return;
    const saved = getStepSaved(stepIdx, step);
    const quizList = saved.customQuiz?.miniQuiz || step.miniQuiz || [];
    const targetQ = quizList[qIdx];
    if (!targetQ) return;

    const selected = saved.mcqAnswers?.[qIdx];
    if (selected === undefined) return;
    const isCorrect = selected === targetQ.correctIndex;

    updateStepSaved(stepIdx, step, (prev) => ({
      ...prev,
      mcqChecked: { ...prev.mcqChecked, [qIdx]: true }
    }));

    if (isCorrect) {
      triggerXP(`${lessonKey}-s${stepIdx}-mcq-${qIdx}`, 15);
      recordGrowthStat('mcqCorrectCount', 1, user?.uid);
      progressDailyQuest('practice_quiz_or_code', 1, user?.uid);
    } else {
      recordMistake(
        {
          subject,
          sourceType: 'lecture_mcq',
          lessonKey,
          lessonTitle: title,
          stepTitle: step.stepTitle,
          prompt: targetQ.question,
          userAnswer: targetQ.options[selected] || `Phương án ${selected + 1}`,
          correctAnswer: targetQ.options[targetQ.correctIndex] || '',
          explanation: targetQ.explanation || ''
        },
        user?.uid
      );
    }
  };

  const handleGradeMiniEssay = async (stepIdx: number) => {
    const step = safeSteps[stepIdx];
    if (!step) return;
    const saved = getStepSaved(stepIdx, step);
    const essaySpec = saved.customQuiz?.miniEssay || step.miniEssay;
    if (!essaySpec) return;

    const studentAnswer = (saved.essayAnswer || '').trim();
    if (!studentAnswer) {
      setEssayErrorByStep((prev) => ({
        ...prev,
        [stepIdx]: 'Em hãy viết câu trả lời ngắn (3–5 dòng) vào ô trên trước khi bấm chấm bài nhé.'
      }));
      return;
    }

    setEssayErrorByStep((prev) => ({ ...prev, [stepIdx]: '' }));
    setGradingEssayStep(stepIdx);

    const res = await safeFetchJson<{ success: boolean; evaluation: LectureStepEvaluation }>(
      '/api/gemini/grade-mini-essay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          lessonTitle: title,
          stepTitle: step.stepTitle,
          question: essaySpec.question,
          rubricChecklist: essaySpec.rubricChecklist,
          sampleAnswer: essaySpec.sampleAnswer,
          studentAnswer,
          language
        })
      },
      65000
    );

    setGradingEssayStep(null);

    if (!res.ok || !res.data?.evaluation) {
      setEssayErrorByStep((prev) => ({
        ...prev,
        [stepIdx]:
          res.error ||
          'Không kết nối được tới Gemini AI để chấm bài tự luận. Vui lòng thử lại sau giây lát.'
      }));
      return;
    }

    const evaluation = res.data.evaluation;

    updateStepSaved(stepIdx, step, (prev) => ({
      ...prev,
      essayEvaluation: evaluation
    }));
    if (evaluation.score >= 6) {
      triggerXP(`${lessonKey}-s${stepIdx}-essay`, 25);
    }
    if (evaluation.score < 6.5) {
      recordMistake(
        {
          subject,
          sourceType: 'lecture_essay',
          lessonKey,
          lessonTitle: title,
          stepTitle: step.stepTitle,
          prompt: essaySpec.question,
          userAnswer: studentAnswer,
          correctAnswer: essaySpec.sampleAnswer,
          explanation: evaluation.feedback || (evaluation.mistakes || []).join(' ')
        },
        user?.uid
      );
    }
  };

  const handleSelfGradeEssay = (stepIdx: number, score: number) => {
    const step = safeSteps[stepIdx];
    if (!step) return;
    const evaluation: LectureStepEvaluation = {
      score,
      maxScore: 10,
      isCorrectDirection: score >= 5,
      strengths:
        score >= 7
          ? ['Đã đối chiếu đúng hướng giải và các ý chính trong đáp án mẫu.']
          : ['Đã hoàn thành nháp và tự kiểm tra lại lời giải.'],
      mistakes:
        score < 7
          ? ['Cần bổ sung thêm điều kiện áp dụng hoặc trình bày rõ bước biến đổi trung gian.']
          : [],
      feedback:
        score >= 7
          ? 'Tốt! Em đã tự kiểm chứng được lời giải chuẩn.'
          : 'Hãy đọc kỹ lại mục Giải thích sâu hơn và hỏi AI nếu còn vướng nhé.',
      gradedBy: 'self'
    };

    updateStepSaved(stepIdx, step, (prev) => ({
      ...prev,
      essayEvaluation: evaluation
    }));
    if (score >= 6) {
      triggerXP(`${lessonKey}-s${stepIdx}-essay`, 15);
    } else {
      const saved = getStepSaved(stepIdx, step);
      const essaySpec = saved.customQuiz?.miniEssay || step.miniEssay;
      if (essaySpec) {
        recordMistake(
          {
            subject,
            sourceType: 'lecture_essay',
            lessonKey,
            lessonTitle: title,
            stepTitle: step.stepTitle,
            prompt: essaySpec.question,
            userAnswer: saved.essayAnswer || 'Tự chấm dưới 6 điểm',
            correctAnswer: essaySpec.sampleAnswer,
            explanation: evaluation.feedback
          },
          user?.uid
        );
      }
    }
  };

  const handleRefreshStepQuizWithAI = async (stepIdx: number) => {
    const step = safeSteps[stepIdx];
    if (!step) return;

    setRefreshingQuizStep(stepIdx);
    setQuizGenErrorByStep((prev) => ({ ...prev, [stepIdx]: '' }));

    const res = await safeFetchJson<{
      success: boolean;
      miniQuiz: LectureStep['miniQuiz'];
      miniEssay: LectureStep['miniEssay'];
    }>(
      '/api/gemini/generate-step-quiz',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          lessonTitle: title,
          stepTitle: step.stepTitle,
          conceptSection: step.conceptSection || step.teacherExplanation,
          primaryFormula: step.formulaSection?.primaryFormula || step.formulaHighlight || '',
          deepDiveSection: step.deepDiveSection || '',
          language
        })
      },
      65000
    );

    setRefreshingQuizStep(null);

    if (!res.ok || !res.data?.miniQuiz || !res.data?.miniEssay) {
      setQuizGenErrorByStep((prev) => ({
        ...prev,
        [stepIdx]:
          res.error ||
          'Gemini AI chưa tạo được bộ câu hỏi mới lúc này. Vui lòng thử lại.'
      }));
      return;
    }

    const generated = { miniQuiz: res.data.miniQuiz, miniEssay: res.data.miniEssay };

    updateStepSaved(stepIdx, step, (prev) => ({
      ...prev,
      mcqAnswers: {},
      mcqChecked: {},
      essayAnswer: '',
      essayEvaluation: undefined,
      customQuiz: generated
    }));
  };

  const handleSendStepAiQuestion = async (stepIdx: number, presetQuestion?: string) => {
    const step = safeSteps[stepIdx];
    if (!step) return;

    const text = (presetQuestion ?? aiDraftByStep[stepIdx] ?? '').trim();
    if (!text) return;

    const saved = getStepSaved(stepIdx, step);
    const prevMsgs = saved.aiMessages || [];
    const userMsg: LectureStepAiMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const nextMsgs = [...prevMsgs, userMsg];
    if (!presetQuestion) {
      setAiDraftByStep((prev) => ({ ...prev, [stepIdx]: '' }));
    }
    setAiErrorByStep((prev) => ({ ...prev, [stepIdx]: '' }));
    setAiLoadingStep(stepIdx);

    updateStepSaved(
      stepIdx,
      step,
      (prev) => ({ ...prev, aiMessages: nextMsgs }),
      false
    );

    const mode: AITutorMode = aiModeByStep[stepIdx] || 'explain_no_answer';
    const formulaTxt = step.formulaSection?.primaryFormula || step.formulaHighlight || '';
    const problemStatement = [
      `Khái niệm: ${step.conceptSection || step.teacherExplanation}`,
      formulaTxt ? `Công thức trọng tâm: $${formulaTxt}$` : '',
      step.deepDiveSection ? `Giải thích sâu: ${step.deepDiveSection}` : ''
    ]
      .filter(Boolean)
      .join('\n\n');

    const tutorMsgId = `ai_${Date.now()}`;
    const tutorTimestamp = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const streamRes = await streamTutorChat(
      {
        messages: nextMsgs.map((m) => ({ role: m.role, text: m.text })),
        context: {
          subject,
          mode,
          topicTitle: `${title} — ${step.stepTitle}`,
          grade,
          problemStatement
        },
        language
      },
      (accumulated) => {
        const partialMsg: LectureStepAiMessage = {
          id: tutorMsgId,
          role: 'tutor',
          text: accumulated,
          timestamp: tutorTimestamp
        };
        updateStepSaved(
          stepIdx,
          step,
          (prev) => ({ ...prev, aiMessages: [...nextMsgs, partialMsg] }),
          false
        );
      },
      70000
    );

    setAiLoadingStep(null);

    const finalReply = streamRes.reply ?? '';
    if (!streamRes.ok || !finalReply.trim()) {
      updateStepSaved(
        stepIdx,
        step,
        (prev) => ({ ...prev, aiMessages: nextMsgs }),
        false
      );
      setAiErrorByStep((prev) => ({
        ...prev,
        [stepIdx]:
          streamRes.error ||
          'Gemini AI chưa phản hồi được câu hỏi này. Vui lòng thử lại.'
      }));
      return;
    }

    const finalTutorMsg: LectureStepAiMessage = {
      id: tutorMsgId,
      role: 'tutor',
      text: finalReply,
      timestamp: tutorTimestamp
    };
    updateStepSaved(
      stepIdx,
      step,
      (prev) => ({ ...prev, aiMessages: [...nextMsgs, finalTutorMsg] }),
      false
    );
  };

  // =========================================================================
  // ANALYTICS & ROADMAP SUGGESTION GENERATOR
  // =========================================================================
  const liveMetrics = useMemo(
    () => computeAssessmentMetrics(assessmentRecord, safeSteps),
    [assessmentRecord, safeSteps]
  );

  const buildLocalLessonAnalysis = (): LessonProgressAnalysis => {
    const metrics = computeAssessmentMetrics(assessmentRecord, safeSteps);
    const strongPoints: string[] = [];
    const weakPoints: string[] = [];
    const weakIndices: number[] = [];
    const unattemptedIndices: number[] = [];

    safeSteps.forEach((st, idx) => {
      const saved = assessmentRecord.stepResults?.[idx];
      const quiz = saved?.customQuiz?.miniQuiz || st.miniQuiz || [];
      let checked = 0;
      let correct = 0;
      quiz.forEach((q, qIdx) => {
        if (saved?.mcqChecked?.[qIdx]) {
          checked += 1;
          if (saved.mcqAnswers?.[qIdx] === q.correctIndex) correct += 1;
        }
      });
      const essayScore = saved?.essayEvaluation?.score;
      const hasEssay = typeof essayScore === 'number';

      if (checked === 0 && !hasEssay) {
        unattemptedIndices.push(idx);
        return;
      }

      const mcqRatio = checked > 0 ? correct / checked : 0;
      const essayRatio = hasEssay ? essayScore / 10 : mcqRatio;
      const combined =
        checked > 0 && hasEssay ? mcqRatio * 0.55 + essayRatio * 0.45 : checked > 0 ? mcqRatio : essayRatio;

      if (combined >= 0.7) {
        strongPoints.push(
          `Nắm vững "${st.stepTitle}" (TN đúng ${correct}/${checked || quiz.length}${
            hasEssay ? `, Tự luận ${essayScore}/10` : ''
          }).`
        );
      } else {
        weakIndices.push(idx);
        weakPoints.push(
          `Cần củng cố "${st.stepTitle}" (TN đúng ${correct}/${checked || quiz.length}${
            hasEssay ? `, Tự luận ${essayScore}/10` : ', chưa hoàn thành tự luận'
          }).`
        );
      }
    });

    if (strongPoints.length === 0) {
      strongPoints.push(
        metrics.completedSteps === 0
          ? 'Em đã bắt đầu xem bài giảng — hãy làm ngay 2 câu trắc nghiệm + 1 câu tự luận ở mục đầu tiên để ghi nhận điểm mạnh.'
          : 'Em đã chủ động thực hành và lưu kết quả tự đánh giá trong bài giảng này.'
      );
    }

    if (weakPoints.length === 0 && unattemptedIndices.length > 0) {
      weakPoints.push(
        `Còn ${unattemptedIndices.length} nội dung chưa làm bài thực hành (bắt đầu từ "${safeSteps[unattemptedIndices[0]].stepTitle}").`
      );
    } else if (weakPoints.length === 0) {
      weakPoints.push('Chưa phát hiện lỗ hổng lớn; em nên thử thêm bài vận dụng cao hoặc đề thi chuẩn để giữ phong độ.');
    }

    const overallMastery =
      metrics.completedSteps > 0 ? metrics.overallMastery : 0;

    const readinessLevel =
      metrics.completedSteps === 0
        ? 'Mới khởi động — Cần hoàn thành bài tập từng phần'
        : overallMastery >= 80
        ? 'Nắm vững kiến thức — Sẵn sàng nâng cao & thi đấu'
        : overallMastery >= 55
        ? 'Đạt mức khá — Cần ôn lại các nội dung còn sai'
        : 'Cần củng cố nền tảng Khái niệm & Công thức';

    const summaryFeedback =
      metrics.completedSteps === 0
        ? `Em chưa nộp câu trắc nghiệm hay tự luận nào trong bài "${title}". Hãy hoàn thành tối thiểu 2 câu trắc nghiệm và 1 câu tự luận ngắn ở mỗi phần để hệ thống chấm điểm chính xác năng lực của em.`
        : `Em đã hoàn thành ${metrics.completedSteps}/${safeSteps.length} phần của bài "${title}", đạt ${metrics.mcqCorrect}/${metrics.mcqTotal} câu trắc nghiệm${
            metrics.essayGradedCount > 0 ? ` và điểm tự luận trung bình ${metrics.essayAvgScore}/10` : ''
          } (mức thành thạo ${overallMastery}%). ${
            weakIndices.length > 0
              ? `Ưu tiên xem lại kỹ phần công thức và giải thích sâu hơn ở ${weakIndices.length} mục còn yếu trước khi chuyển bài mới.`
              : 'Phong độ hiện tại rất tốt, hãy kiểm chứng thêm trên mô phỏng hoặc luyện đề chuẩn.'
          }`;

    const firstReviewIdx = weakIndices[0] ?? unattemptedIndices[0] ?? 0;
    const recommendedRoadmap: LessonProgressAnalysis['recommendedRoadmap'] = [
      weakIndices.length > 0
        ? {
            step: 1,
            title: 'Ôn kỹ và làm lại phần còn hổng',
            action: `Quay lại mục "${safeSteps[firstReviewIdx].stepTitle}", đọc kỹ phần Công thức & Giải thích sâu hơn rồi làm lại trắc nghiệm/tự luận.`,
            targetType: 'review_step',
            stepIndex: firstReviewIdx
          }
        : unattemptedIndices.length > 0
        ? {
            step: 1,
            title: 'Hoàn tất các phần bài giảng còn lại',
            action: `Tiếp tục mục "${safeSteps[firstReviewIdx].stepTitle}" và hoàn thành đủ 2 câu trắc nghiệm + 1 câu tự luận nhỏ.`,
            targetType: 'review_step',
            stepIndex: firstReviewIdx
          }
        : {
            step: 1,
            title: 'Kiểm chứng công thức bằng trực quan',
            action:
              subject === 'cs'
                ? 'Mở trình chấm code C++/Python để tự cài đặt lại thuật toán vừa học.'
                : 'Mở phòng Mô phỏng 2D và thay đổi thử từng tham số để kiểm chứng quy luật.',
            targetType: subject === 'cs' ? 'ai_tutor' : 'sim_2d'
          },
      {
        step: 2,
        title:
          subject === 'cs'
            ? 'Thảo luận test biên với Syn Code (Syn AI)'
            : 'Thực hành Mô phỏng 2D/3D để khắc sâu bản chất',
        action:
          subject === 'cs'
            ? 'Đặt câu hỏi về trường hợp biên (N=0, tràn số, độ phức tạp) với AI gợi mở.'
            : 'Quan sát trực quan hiện tượng/đồ thị để hiểu rõ vì sao công thức lại có dạng như vậy.',
        targetType: subject === 'cs' ? 'ai_tutor' : onOpenSim2D || actions[0] ? 'sim_2d' : 'ai_tutor'
      },
      {
        step: 3,
        title:
          overallMastery >= 75
            ? 'Thử sức Bộ đề & Đấu trường xếp hạng'
            : 'Hỏi đáp 1-1 với AI Tutor trước khi qua bài mới',
        action:
          overallMastery >= 75
            ? 'Áp dụng kiến thức bài học vào bộ đề kiểm tra hoặc chuyển sang bài tiếp theo trong lộ trình.'
            : 'Hỏi AI giải thích lại đúng chỗ em còn phân vân, sau đó nâng mức thành thạo lên trên 75%.',
        targetType: overallMastery >= 75 ? (onOpenExams ? 'exams' : 'next_lesson') : 'ai_tutor'
      }
    ];

    return {
      overallMastery,
      readinessLevel,
      summaryFeedback,
      strongPoints,
      weakPoints,
      recommendedRoadmap,
      analyzedAt: new Date().toISOString()
    };
  };

  const handleAnalyzeLessonProgress = async () => {
    setIsAnalyzingLesson(true);
    setAnalysisError(null);

    const stepsSummary = safeSteps.map((st, idx) => {
      const saved = assessmentRecord.stepResults?.[idx];
      const quiz = saved?.customQuiz?.miniQuiz || st.miniQuiz || [];
      let mcqCorrect = 0;
      let mcqCheckedCount = 0;
      const wrongMcqTopics: string[] = [];

      quiz.forEach((q, qIdx) => {
        if (saved?.mcqChecked?.[qIdx]) {
          mcqCheckedCount += 1;
          if (saved.mcqAnswers?.[qIdx] === q.correctIndex) {
            mcqCorrect += 1;
          } else {
            wrongMcqTopics.push(q.question.slice(0, 120));
          }
        }
      });

      return {
        stepIndex: idx,
        stepTitle: st.stepTitle,
        conceptSummary: (st.conceptSection || st.teacherExplanation).slice(0, 160),
        mcqCorrect,
        mcqTotal: mcqCheckedCount || quiz.length,
        mcqAttempted: mcqCheckedCount,
        wrongMcqTopics,
        essayScore: saved?.essayEvaluation?.score,
        essayQuestion: (saved?.customQuiz?.miniEssay || st.miniEssay)?.question?.slice(0, 120),
        studentEssayAnswer: saved?.essayAnswer?.slice(0, 200),
        essayMistakes: saved?.essayEvaluation?.mistakes || []
      };
    });

    const res = await safeFetchJson<{ success: boolean; analysis: LessonProgressAnalysis }>(
      '/api/gemini/analyze-lesson-progress',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade,
          lessonTitle: title,
          stepsSummary,
          language
        })
      },
      65000
    );

    setIsAnalyzingLesson(false);

    const resolvedAnalysis =
      res.ok && res.data?.analysis ? res.data.analysis : buildLocalLessonAnalysis();

    const nextRecord: LessonAssessmentRecord = {
      ...assessmentRecord,
      lessonKey,
      subject,
      lessonTitle: title,
      grade,
      totalSteps: safeSteps.length,
      analysis: resolvedAnalysis,
      updatedAt: new Date().toISOString()
    };
    persistRecord(nextRecord, true);
    setViewLayout('analytics');
  };

  const handleExecuteRoadmapAction = (
    targetType:
      | 'review_step'
      | 'sim_2d'
      | 'sim_3d'
      | 'ai_tutor'
      | 'next_lesson'
      | 'exams'
      | 'arena',
    stepIndex?: number
  ) => {
    if (targetType === 'review_step') {
      handleSelectStep(typeof stepIndex === 'number' ? Math.min(safeSteps.length - 1, Math.max(0, stepIndex)) : 0);
      return;
    }
    if (targetType === 'sim_2d') {
      if (onOpenSim2D) onOpenSim2D();
      else actions[0]?.onClick();
      return;
    }
    if (targetType === 'sim_3d') {
      if (onOpenSim3D) onOpenSim3D();
      else if (actions[1]) actions[1].onClick();
      return;
    }
    if (targetType === 'ai_tutor') {
      navigate({ tutorOpen: true, tutorSubject: subject });
      return;
    }
    if (targetType === 'next_lesson') {
      if (onNextLesson) onNextLesson();
      else selectSubject('roadmap');
      return;
    }
    if (targetType === 'exams') {
      if (onOpenExams) onOpenExams();
      else selectSubject('exams');
      return;
    }
    if (targetType === 'arena') {
      if (onOpenArena) onOpenArena();
      else selectSubject('arena');
    }
  };

  const accentBtnClass =
    subjectAccent === 'amber'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : subjectAccent === 'emerald'
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
      : subjectAccent === 'blue'
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  const accentTextClass =
    subjectAccent === 'amber'
      ? 'text-amber-600 dark:text-amber-400'
      : subjectAccent === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : subjectAccent === 'blue'
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-indigo-600 dark:text-indigo-400';

  const renderStepBody = (step: LectureStep, idx: number) => {
    const saved = getStepSaved(idx, step);
    const totalExampleSteps = step.workedExample?.steps.length || 0;
    const revealedCount = revealedStepsMap[idx] ?? totalExampleSteps;

    const conceptText = step.conceptSection || step.teacherExplanation;
    const primaryFormula = step.formulaSection?.primaryFormula || step.formulaHighlight;
    const secondaryFormulas = step.formulaSection?.secondaryFormulas || [];
    const variablesNote = step.formulaSection?.variablesNote;
    const deepDiveText = step.deepDiveSection || step.teacherExplanation;

    const activeMcqs = (saved.customQuiz?.miniQuiz || step.miniQuiz || []).slice(0, 2);
    const activeEssay = saved.customQuiz?.miniEssay || step.miniEssay;
    const aiOpen = !!openAiPanelSteps[idx];
    const aiMessages = saved.aiMessages || [];
    const activeAiMode: AITutorMode = aiModeByStep[idx] || 'explain_no_answer';

    const quickPrompts = [
      `Giải thích thật trực quan ý nghĩa phần "${step.stepTitle}" cho em dễ nhớ hơn?`,
      primaryFormula
        ? `Tại sao công thức $${primaryFormula}$ lại có dạng như vậy và khi nào KHÔNG áp dụng được?`
        : `Những lỗi sai bẫy nào dễ mất điểm nhất ở phần "${step.stepTitle}"?`,
      'Cho em xin thêm 1 ví dụ ngắn áp dụng trực tiếp phần này để em tự làm thử?'
    ];

    const stepMcqDone = activeMcqs.filter((_, qIdx) => saved.mcqChecked?.[qIdx]).length;
    const stepMcqCorrect = activeMcqs.filter(
      (q, qIdx) => saved.mcqChecked?.[qIdx] && saved.mcqAnswers?.[qIdx] === q.correctIndex
    ).length;

    return (
      <div className="space-y-6">
        {/* Step Heading */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={`font-bold ${accentTextClass} tabular-nums`}>
                Nội dung {idx + 1} / {safeSteps.length}
              </span>
              {step.stepType && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{STEP_TYPE_LABEL[step.stepType]}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => toggleSpeakStep(step, idx)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                  speakingStepIdx === idx
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-400'
                }`}
                title="Nghe lời giảng tiếng Việt phần này"
              >
                {speakingStepIdx === idx ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{speakingStepIdx === idx ? 'Dừng đọc' : 'Nghe giảng'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopVietnameseSpeech();
                  autoNarratingRef.current = false;
                  setIsAutoNarratingAll(false);
                  setSpeakingStepIdx(null);
                  setVideoSeedTopic(step.stepTitle);
                  setViewLayout('video3b1b');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-indigo-300 dark:border-indigo-700 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer whitespace-nowrap"
                title="Xem & tạo Video minh họa phong cách 3Blue1Brown kèm thuyết minh tiếng Việt"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video 3B1B</span>
              </button>
              <button
                type="button"
                onClick={() => toggleStepBookmark(idx)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                  bookmarkedSteps[idx]
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-amber-700 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
                title="Đánh dấu phần này để ôn lại"
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarkedSteps[idx] ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{bookmarkedSteps[idx] ? 'Đã đánh dấu ôn' : 'Cần ôn'}</span>
              </button>
              <button
                type="button"
                onClick={() => setOpenNoteSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                  openNoteSteps[idx] || stepNotes[idx]?.trim()
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                }`}
                title="Mở sổ ghi chú cá nhân cho phần này"
              >
                <StickyNote className="w-3.5 h-3.5" />
                <span>{stepNotes[idx]?.trim() ? 'Ghi chú (đã lưu)' : 'Ghi chú'}</span>
              </button>
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tabular-nums">
                TN: {stepMcqCorrect}/{activeMcqs.length} ({stepMcqDone} đã làm)
              </span>
              {saved.essayEvaluation && (
                <span
                  className={`px-2 py-1 rounded-md tabular-nums ${
                    saved.essayEvaluation.score >= 7
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  Tự luận: {saved.essayEvaluation.score}/10
                </span>
              )}
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            <FormattedText text={step.stepTitle} />
          </h3>
        </div>

        {(openNoteSteps[idx] || false) && (
          <section className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Ghi chú cá nhân cho phần {idx + 1} (tự động lưu)
              </span>
              <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                Xuất kèm khi bấm &ldquo;Xuất phiếu ôn (.md)&rdquo;
              </span>
            </div>
            <textarea
              rows={2}
              value={stepNotes[idx] || ''}
              onChange={(e) => updateStepNote(idx, e.target.value)}
              placeholder="Ghi lại ý hiểu riêng, công thức cần nhớ hoặc lỗi sai bạn hay mắc ở phần này..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SUB-SECTION 0: HIỂU NHANH TRONG 30 GIÂY & VÍ DỤ ĐỜI THỰC       */}
        {/* ============================================================== */}
        {step.quickIntuition && (
          <section className="rounded-xl border border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/45 dark:bg-emerald-950/20 p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Hiểu nhanh trong 30 giây</span>
            </div>
            <div
              className={`leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line ${
                fontScale === 'large' ? 'text-[15px] sm:text-base' : 'text-sm'
              }`}
            >
              <FormattedText text={step.quickIntuition} />
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SUB-SECTION 1: KHÁI NIỆM & BẢN CHẤT                            */}
        {/* ============================================================== */}
        <section className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              <BookOpen className="w-4 h-4" />
              <span>1. Khái niệm &amp; Bản chất</span>
            </div>
            {step.conceptGlossary && step.conceptGlossary.length > 0 && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                {step.conceptGlossary.length} khái niệm
              </span>
            )}
          </div>
          <div
            className={`leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line ${
              fontScale === 'large' ? 'text-[15px] sm:text-base' : 'text-sm'
            }`}
          >
            <FormattedText text={conceptText} />
          </div>

          {step.conceptGlossary && step.conceptGlossary.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              {step.conceptGlossary.map((cg, cgIdx) => (
                <div
                  key={cgIdx}
                  className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      <FormattedText text={cg.term} />
                    </span>
                    {cg.symbol && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-xs font-mono text-indigo-700 dark:text-indigo-300 overflow-x-auto max-w-full">
                        <MathFormula formula={cg.symbol} />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <FormattedText text={cg.definition} />
                  </div>
                  {cg.intuition && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-semibold">Nhớ nhanh: </span>
                      <FormattedText text={cg.intuition} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* SUB-SECTION 2: CÔNG THỨC / CODE MẪU & BẢNG CHẠY TAY TỪNG BƯỚC  */}
        {/* ============================================================== */}
        {(primaryFormula || secondaryFormulas.length > 0 || variablesNote || step.codeSnippet || step.dryRunTrace) && (
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                <Calculator className={`w-4 h-4 ${accentTextClass}`} />
                <span>2. Công thức, Code mẫu &amp; Chạy tay từng bước</span>
              </div>
              {primaryFormula && (
                <button
                  onClick={() => handleCopyFormula(primaryFormula)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  {copiedFormula === primaryFormula ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Đã chép LaTeX</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Chép LaTeX</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {primaryFormula && (
              <div className="p-3 sm:p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center overflow-x-auto text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
                <MathFormula formula={primaryFormula} displayMode />
              </div>
            )}

            {secondaryFormulas.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {secondaryFormulas.map((sf, sfIdx) => (
                  <div
                    key={sfIdx}
                    className="px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm overflow-x-auto flex items-center justify-center"
                  >
                    <MathFormula formula={sf} />
                  </div>
                ))}
              </div>
            )}

            {variablesNote && (
              <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line bg-white/70 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200/60 dark:border-slate-800/80">
                <FormattedText text={variablesNote} />
              </div>
            )}

            {step.annotations && step.annotations.length > 0 && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                  <span>Bảng Chú Thích Ký Hiệu · Đơn Vị / Kiểu Dữ Liệu · Điều Kiện</span>
                  <span className="font-mono text-slate-500 tabular-nums">{step.annotations.length} mục</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                        <th className="py-2 px-3 font-bold">Ký hiệu</th>
                        <th className="py-2 px-3 font-bold">Ý nghĩa</th>
                        <th className="py-2 px-3 font-bold">Đơn vị / Kiểu</th>
                        <th className="py-2 px-3 font-bold">Điều kiện áp dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {step.annotations.map((ann, aIdx) => (
                        <tr key={aIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60">
                          <td className="py-2 px-3 font-mono font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                            <MathFormula formula={ann.symbol} />
                          </td>
                          <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                            <FormattedText text={ann.meaning} />
                          </td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            <FormattedText text={ann.unitOrType || '—'} />
                          </td>
                          <td className="py-2 px-3 text-amber-700 dark:text-amber-300">
                            <FormattedText text={ann.condition || 'Theo bài toán'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {step.stepByStepNotes && step.stepByStepNotes.length > 0 && (
              <div className="rounded-lg border border-sky-200/80 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 p-3 space-y-1.5">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                  Trình tự đọc &amp; áp dụng từng bước
                </div>
                <ul className="space-y-1">
                  {step.stepByStepNotes.map((note, nIdx) => (
                    <li key={nIdx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2">
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0 tabular-nums">
                        {nIdx + 1}.
                      </span>
                      <span className="leading-relaxed">
                        <FormattedText text={note} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.dryRunTrace && (
              <div className="rounded-lg border border-sky-300/70 dark:border-sky-800/70 bg-white dark:bg-slate-900/90 p-3.5 sm:p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                    <List className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>{step.dryRunTrace.title}</span>
                  </span>
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/70">
                    Input: {step.dryRunTrace.sampleInput}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {step.dryRunTrace.traceRows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-950/70 px-3 py-2 rounded border border-slate-200/70 dark:border-slate-800"
                    >
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0 tabular-nums">
                        #{rIdx + 1}
                      </span>
                      <span className="leading-relaxed">
                        <FormattedText text={row} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Kết quả cuối cùng (Output): {step.dryRunTrace.finalOutput}</span>
                </div>
              </div>
            )}

            {step.codeSnippet && (() => {
              const snip = step.codeSnippet;
              const activeLang: 'cpp' | 'python' =
                csLangByStep[idx] ||
                snip.language ||
                'cpp';
              const hasPy = Boolean(snip.pythonBasicCode || snip.pythonAdvancedCode || snip.language === 'python');
              const cppBasic = snip.basicCode;
              const cppAdv = snip.advancedCode || snip.code;
              const pyBasic = snip.pythonBasicCode || (snip.language === 'python' ? snip.basicCode : undefined);
              const pyAdv = snip.pythonAdvancedCode || (snip.language === 'python' ? (snip.advancedCode || snip.code) : undefined);

              const activeBasicCode = activeLang === 'python' ? pyBasic : cppBasic;
              const activeAdvCode = activeLang === 'python' ? (pyAdv || cppAdv) : cppAdv;
              const hasBasicTier = Boolean(activeBasicCode && activeBasicCode.trim());
              const hasAdvTier = Boolean(activeAdvCode && activeAdvCode.trim());
              const activeTier: 'basic' | 'advanced' =
                (csTierByStep[idx] === 'basic' && hasBasicTier)
                  ? 'basic'
                  : (csTierByStep[idx] === 'advanced' && hasAdvTier)
                  ? 'advanced'
                  : hasBasicTier
                  ? 'basic'
                  : 'advanced';

              const renderedCode =
                activeTier === 'basic'
                  ? (activeBasicCode || activeAdvCode)
                  : activeAdvCode;
              const renderedTitle =
                activeTier === 'basic'
                  ? (snip.basicTitle || snip.title)
                  : (snip.advancedTitle || snip.title);
              const renderedExpl =
                activeTier === 'basic'
                  ? (snip.basicExplanation || 'Phiên bản Cơ bản: Thuật toán tối giản, viết tuần tự, không lạm dụng hàm phụ hay cấu trúc phức tạp.')
                  : (snip.advancedExplanation || 'Phiên bản Nâng cao / Chuyên: Dùng kỹ thuật tối ưu Big-O, DP / STL / Fast I/O.');

              return (
                <div className="space-y-2.5 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-0">
                      <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{renderedTitle}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {hasBasicTier && (
                        <div className="inline-flex items-center p-0.5 rounded-md bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setCsTierByStep((prev) => ({ ...prev, [idx]: 'basic' }))}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                              activeTier === 'basic'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Cơ bản (Tối giản)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCsTierByStep((prev) => ({ ...prev, [idx]: 'advanced' }))}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                              activeTier === 'advanced'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Nâng cao / Chuyên
                          </button>
                        </div>
                      )}

                      {hasPy && (
                        <div className="inline-flex items-center p-0.5 rounded-md bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setCsLangByStep((prev) => ({ ...prev, [idx]: 'cpp' }))}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                              activeLang === 'cpp'
                                ? 'bg-sky-600 text-white'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            C++
                          </button>
                          <button
                            type="button"
                            onClick={() => setCsLangByStep((prev) => ({ ...prev, [idx]: 'python' }))}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                              activeLang === 'python'
                                ? 'bg-sky-600 text-white'
                                : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            Python
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`px-3 py-2 rounded-lg border text-[11px] leading-relaxed ${
                      activeTier === 'basic'
                        ? 'bg-emerald-50/75 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-50/75 dark:bg-amber-950/25 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <span className="font-extrabold mr-1.5">
                      {activeTier === 'basic' ? 'Cơ bản (Ít hàm, dễ hiểu):' : 'Nâng cao / Chuyên (DP · Tối ưu):'}
                    </span>
                    <FormattedText text={renderedExpl} />
                  </div>

                  <MonokaiCodeBlock
                    code={renderedCode}
                    language={activeLang}
                    title={
                      activeTier === 'basic'
                        ? activeLang === 'cpp'
                          ? 'basic_solution.cpp'
                          : 'basic_solution.py'
                        : activeLang === 'cpp'
                        ? 'advanced_solution.cpp'
                        : 'advanced_solution.py'
                    }
                    maxHeightClass="max-h-[340px]"
                  />
                </div>
              );
            })()}
          </section>
        )}

        {/* ============================================================== */}
        {/* INLINE 2D + 3D PHYSICS SIMULATIONS (UNIFIED WORKBENCH HEADER)  */}
        {/* ============================================================== */}
        {subject === 'physics' && physicsLesson && (() => {
          const simView = inlineSimViewByStep[idx] || 'both';
          return (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>Phòng Thí Nghiệm Trực Quan (Phần {idx + 1})</span>
                </div>
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                  {(
                    [
                      { id: 'both', label: '2D + 3D' },
                      { id: '2d', label: 'Chỉ 2D' },
                      { id: '3d', label: 'Chỉ 3D' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setInlineSimViewByStep((prev) => ({ ...prev, [idx]: opt.id }))
                      }
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        simView === opt.id
                          ? 'bg-slate-900 dark:bg-sky-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {(simView === 'both' || simView === '2d') && (
                <PhysicsInline2DSim
                  lesson={physicsLesson}
                  stepIndex={idx}
                  totalSteps={steps.length}
                  stepTitle={step.stepTitle}
                  stepConcept={step.conceptSection}
                  onOpenSim2D={onOpenSim2D}
                  onOpenSim3D={onOpenSim3D}
                />
              )}
              {(simView === 'both' || simView === '3d') && (
                <PhysicsInline3DSim
                  lesson={physicsLesson}
                  stepIndex={idx}
                  totalSteps={steps.length}
                  stepTitle={step.stepTitle}
                  stepConcept={step.conceptSection}
                  isWebGLActive={viewLayout === 'slides' || simView === '3d' || activeFull3DStep === idx}
                  onActivateWebGL={() => setActiveFull3DStep(idx)}
                  onOpenSim3D={onOpenSim3D}
                />
              )}
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* INLINE 2D + 3D CHEMISTRY SIMULATIONS                           */}
        {/* ============================================================== */}
        {subject === 'chemistry' && chemistryLesson && (() => {
          const simView = inlineSimViewByStep[idx] || 'both';
          return (
            <div className="space-y-3">
              <div className="chem-zone-frame flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50/70 dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Phòng Thí Nghiệm Hóa Học 2D &amp; 3D (Phần {idx + 1})</span>
                </div>
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                  {(
                    [
                      { id: 'both', label: '2D + 3D' },
                      { id: '2d', label: 'Chỉ 2D' },
                      { id: '3d', label: 'Chỉ 3D' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      data-ripple="true"
                      onClick={() =>
                        setInlineSimViewByStep((prev) => ({ ...prev, [idx]: opt.id }))
                      }
                      className={`sim-btn-chem px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        simView === opt.id
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <ChemistryInlineStepSim
                lesson={chemistryLesson}
                stepIndex={idx}
                totalSteps={steps.length}
                stepTitle={step.stepTitle}
                stepConcept={step.conceptSection}
                viewMode={simView}
                isWebGLActive={viewLayout === 'slides' || simView === '3d' || activeFull3DStep === idx}
                onActivateWebGL={() => setActiveFull3DStep(idx)}
                onOpenSim2D={onOpenSim2D}
                onOpenSim3D={onOpenSim3D}
              />
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* INLINE 2D + 3D BIOLOGY SIMULATIONS                             */}
        {/* ============================================================== */}
        {subject === 'biology' && biologyLesson && (() => {
          const simView = inlineSimViewByStep[idx] || 'both';
          return (
            <div className="space-y-3">
              <div className="bio-zone-frame flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-teal-50/70 dark:bg-slate-900 border border-teal-200/90 dark:border-teal-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>Phòng Thí Nghiệm Sinh Học 2D &amp; 3D (Phần {idx + 1})</span>
                </div>
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                  {(
                    [
                      { id: 'both', label: '2D + 3D' },
                      { id: '2d', label: 'Chỉ 2D' },
                      { id: '3d', label: 'Chỉ 3D' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      data-ripple="true"
                      onClick={() =>
                        setInlineSimViewByStep((prev) => ({ ...prev, [idx]: opt.id }))
                      }
                      className={`sim-btn-bio px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        simView === opt.id
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <BiologyInlineStepSim
                lesson={biologyLesson}
                stepIndex={idx}
                totalSteps={steps.length}
                stepTitle={step.stepTitle}
                stepConcept={step.conceptSection}
                viewMode={simView}
                isWebGLActive={viewLayout === 'slides' || simView === '3d' || activeFull3DStep === idx}
                onActivateWebGL={() => setActiveFull3DStep(idx)}
                onOpenSim2D={onOpenSim2D}
                onOpenSim3D={onOpenSim3D}
              />
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* INLINE 2D + 3D MATH SIMULATIONS                                */}
        {/* ============================================================== */}
        {subject === 'math' && mathLecture && (() => {
          const simView = inlineSimViewByStep[idx] || 'both';
          return (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-slate-900 border border-indigo-200/90 dark:border-indigo-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                  <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Mô Hình Toán Học Trực Quan 2D &amp; 3D (Phần {idx + 1})</span>
                </div>
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
                  {(
                    [
                      { id: 'both', label: '2D + 3D' },
                      { id: '2d', label: 'Chỉ 2D' },
                      { id: '3d', label: 'Chỉ 3D' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setInlineSimViewByStep((prev) => ({ ...prev, [idx]: opt.id }))
                      }
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        simView === opt.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <MathInlineStepSim
                lesson={mathLecture}
                stepIndex={idx}
                totalSteps={steps.length}
                stepTitle={step.stepTitle}
                stepConcept={step.conceptSection}
                viewMode={simView}
                isWebGLActive={viewLayout === 'slides' || simView === '3d' || activeFull3DStep === idx}
                onActivateWebGL={() => setActiveFull3DStep(idx)}
                onOpenSim2D={onOpenSim2D}
                onOpenSim3D={onOpenSim3D}
              />
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* SUB-SECTION 3: LỖI SAI HAY GẶP, VÍ DỤ & PHÂN TÍCH SÂU          */}
        {/* ============================================================== */}
        <section className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/75 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>3. Lỗi sai hay gặp &amp; Giải thích chuyên sâu</span>
            </div>

            {subject === 'cs' && (
              <button
                type="button"
                onClick={() =>
                  setOpenDeepDiveSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900 border border-amber-300/70 dark:border-amber-800/60 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-950/50 transition-colors cursor-pointer"
              >
                {openDeepDiveSteps[idx] ? (
                  <>
                    <span>Thu gọn phân tích nâng cao</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Xem phân tích kỹ thuật &amp; Big-O</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {step.commonMistakes && step.commonMistakes.length > 0 && (
            <div className="rounded-lg border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>Những lỗi dễ mất điểm nhất &amp; Cách sửa nhanh (WA / TLE)</span>
              </div>
              <ul className="space-y-1.5">
                {step.commonMistakes.map((err, mIdx) => (
                  <li
                    key={mIdx}
                    className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">•</span>
                    <span>
                      <FormattedText text={err} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(subject !== 'cs' || openDeepDiveSteps[idx]) && (
            <div
              className={`leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line ${
                fontScale === 'large' ? 'text-[15px] sm:text-base' : 'text-sm'
              }`}
            >
              <FormattedText text={deepDiveText} />
            </div>
          )}

          {step.workedExample && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Compass className={`w-4 h-4 ${accentTextClass}`} />
                  <span>Ví dụ mẫu giải từng bước</span>
                </div>

                {totalExampleSteps > 1 && (
                  <button
                    onClick={() =>
                      setRevealedStepsMap((prev) => ({
                        ...prev,
                        [idx]: revealedCount < totalExampleSteps ? revealedCount + 1 : 1
                      }))
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                  >
                    {revealedCount < totalExampleSteps
                      ? `Hiện bước tiếp (${revealedCount}/${totalExampleSteps})`
                      : 'Thu về Bước 1 (Tự nhẩm lại)'}
                  </button>
                )}
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                <FormattedText text={step.workedExample.problem} />
              </div>

              <div className="space-y-2">
                {step.workedExample.steps.slice(0, revealedCount).map((sText, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-lg bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <FormattedText text={sText} />
                  </div>
                ))}
              </div>

              {revealedCount >= totalExampleSteps && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Kết luận: <FormattedText text={step.workedExample.answer} />
                </div>
              )}
            </div>
          )}

          {step.keyTakeaway && (
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-amber-300/60 dark:border-amber-800/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Ghi nhớ cốt lõi: </span>
                <FormattedText text={step.keyTakeaway} />
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* SUB-SECTION 4: ĐẶT CÂU HỎI CHO AI (NẾU MUỐN)                   */}
        {/* ============================================================== */}
        <section className="rounded-2xl border border-sky-200/80 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/15 overflow-hidden">
          <button
            type="button"
            onClick={() =>
              setOpenAiPanelSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
            }
            className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-sky-100/50 dark:hover:bg-sky-900/20 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <MessageSquarePlus className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-sky-800 dark:text-sky-300">
                  4. Đặt câu hỏi cho AI về nội dung này (nếu muốn)
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  {aiMessages.length > 0
                    ? `Đã trao đổi ${aiMessages.length} tin nhắn trong phần này`
                    : 'Bấm để hỏi ngay chỗ chưa hiểu trong Khái niệm hoặc Công thức trên'}
                </div>
              </div>
            </div>
            {aiOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            )}
          </button>

          {aiOpen && (
            <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-sky-200/60 dark:border-sky-900/40 space-y-3">
              {/* Mode selector + Quick question chips */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      setAiModeByStep((prev) => ({ ...prev, [idx]: 'explain_no_answer' }))
                    }
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                      activeAiMode === 'explain_no_answer'
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Giảng gợi mở (Không lộ đáp án)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAiModeByStep((prev) => ({ ...prev, [idx]: 'full_solution' }))
                    }
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                      activeAiMode === 'full_solution'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Giải thích &amp; Lời giải chi tiết
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate({ tutorOpen: true, tutorSubject: subject })}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Mở Syn AI toàn màn hình →
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((qp, qpIdx) => (
                  <button
                    key={qpIdx}
                    type="button"
                    disabled={aiLoadingStep === idx}
                    onClick={() => handleSendStepAiQuestion(idx, qp)}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-sky-200/80 dark:border-sky-800 text-[11px] text-slate-700 dark:text-slate-200 hover:border-sky-400 transition-colors"
                  >
                    <FormattedText text={qp} />
                  </button>
                ))}
              </div>

              {/* Conversation Thread */}
              {aiMessages.length > 0 && (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {aiMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white ml-6 sm:ml-12'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 mr-4 sm:mr-10'
                      }`}
                    >
                      <div className="text-[10px] opacity-75 font-semibold mb-1">
                        {msg.role === 'user' ? 'Em hỏi' : 'Trợ giảng AI'} · {msg.timestamp}
                      </div>
                      <div className="whitespace-pre-line">
                        <FormattedText text={msg.text} />
                      </div>
                    </div>
                  ))}
                  {aiLoadingStep === idx && (
                    <div className="flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300 px-2 py-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Trợ giảng AI đang phân tích câu hỏi...</span>
                    </div>
                  )}
                </div>
              )}

              {aiErrorByStep[idx] && (
                <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
                  {aiErrorByStep[idx]}
                </div>
              )}

              {/* Input Row */}
              <div className="flex items-center gap-2">
                <VoiceMicButton
                  language={language}
                  disabled={aiLoadingStep === idx}
                  onTranscript={(spoken) =>
                    setAiDraftByStep((prev) => ({
                      ...prev,
                      [idx]: prev[idx]?.trim() ? `${prev[idx].trim()} ${spoken}` : spoken
                    }))
                  }
                />
                <input
                  type="text"
                  value={aiDraftByStep[idx] || ''}
                  onChange={(e) =>
                    setAiDraftByStep((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendStepAiQuestion(idx);
                    }
                  }}
                  placeholder="Nhập hoặc bấm Mic nói thắc mắc của em về khái niệm/công thức..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 outline-none"
                />
                <button
                  type="button"
                  disabled={aiLoadingStep === idx || !(aiDraftByStep[idx] || '').trim()}
                  onClick={() => handleSendStepAiQuestion(idx)}
                  className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  {aiLoadingStep === idx ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Gửi AI</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* SUB-SECTION 5: KIỂM TRA PHẦN NÀY (2 TRẮC NGHIỆM + 1 TỰ LUẬN)   */}
        {/* ============================================================== */}
        <section className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/15 p-4 sm:p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>5. Thực hành ngay phần này: 2 Trắc nghiệm + 1 Tự luận nhỏ</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Kết quả làm bài được tự động lưu lại để phân tích năng lực &amp; gợi ý lộ trình học tiếp theo.
              </p>
            </div>

            <button
              type="button"
              disabled={refreshingQuizStep === idx}
              onClick={() => handleRefreshStepQuizWithAI(idx)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300/70 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshingQuizStep === idx ? 'animate-spin' : ''}`}
              />
              <span>
                {refreshingQuizStep === idx ? 'Đang sinh câu hỏi AI...' : 'Đổi bộ câu hỏi AI mới'}
              </span>
            </button>
          </div>

          {quizGenErrorByStep[idx] && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
              {quizGenErrorByStep[idx]}
            </div>
          )}

          {/* 2 MCQs */}
          <div className="space-y-4">
            {activeMcqs.map((q, qIdx) => {
              const selectedOpt = saved.mcqAnswers?.[qIdx];
              const isChecked = !!saved.mcqChecked?.[qIdx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id || qIdx}
                  className="bg-white/95 dark:bg-slate-900/95 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      <span className="text-emerald-600 dark:text-emerald-400 mr-1.5">
                        Trắc nghiệm {qIdx + 1}/2:
                      </span>
                      <FormattedText text={q.question} />
                    </div>
                    {isChecked && (
                      <span
                        className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {isCorrect ? 'Đúng (+15 XP)' : 'Chưa đúng'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSel = selectedOpt === optIdx;
                      let cls =
                        'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300';
                      if (isChecked) {
                        if (optIdx === q.correctIndex) {
                          cls =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                        } else if (isSel) {
                          cls =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold';
                        }
                      } else if (isSel) {
                        cls =
                          'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isChecked}
                          onClick={() => handleSelectMcqOption(idx, qIdx, optIdx)}
                          className={`text-left px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed transition-all ${cls}`}
                        >
                          <FormattedText text={opt} />
                        </button>
                      );
                    })}
                  </div>

                  {!isChecked ? (
                    <button
                      type="button"
                      disabled={selectedOpt === undefined}
                      onClick={() => handleCheckMcqAnswer(idx, qIdx)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white text-xs font-bold transition-colors"
                    >
                      Kiểm tra đáp án
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Chính xác!
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Chưa chính xác — Giải thích:
                          </span>
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
          </div>

          {/* 1 Mini Essay */}
          {activeEssay && (
            <div className="bg-white/95 dark:bg-slate-900/95 rounded-xl p-4 sm:p-5 border border-amber-200/80 dark:border-amber-900/50 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                  <FileText className="w-4 h-4" />
                  <span>Tự luận nhỏ (1 câu · 0–10 điểm)</span>
                </div>

                {saved.essayEvaluation && (
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold tabular-nums ${
                      saved.essayEvaluation.score >= 7
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : saved.essayEvaluation.score >= 5
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    Điểm: {saved.essayEvaluation.score}/10 (
                    {saved.essayEvaluation.gradedBy === 'ai' ? 'AI chấm' : 'Tự đối chiếu'})
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                <FormattedText text={activeEssay.question} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activeEssay.hint && (
                  <button
                    type="button"
                    onClick={() =>
                      setRevealedEssayHintSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{revealedEssayHintSteps[idx] ? 'Ẩn gợi ý' : 'Gợi ý hướng làm'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setRevealedEssaySampleSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {revealedEssaySampleSteps[idx] ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu & Tự chấm'}
                  </span>
                </button>
              </div>

              {revealedEssayHintSteps[idx] && activeEssay.hint && (
                <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200">
                  <strong>Gợi ý: </strong>
                  <FormattedText text={activeEssay.hint} />
                </div>
              )}

              <div className="flex items-start gap-2">
                <textarea
                  rows={3}
                  value={saved.essayAnswer || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateStepSaved(
                      idx,
                      step,
                      (prev) => ({ ...prev, essayAnswer: val }),
                      false
                    );
                  }}
                  placeholder="Viết ngắn gọn hoặc bấm Mic đọc lời giải, công thức hoặc lập luận của em tại đây..."
                  className="flex-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <VoiceMicButton
                  language={language}
                  onTranscript={(spoken) =>
                    updateStepSaved(
                      idx,
                      step,
                      (prev) => ({
                        ...prev,
                        essayAnswer: prev.essayAnswer?.trim()
                          ? `${prev.essayAnswer.trim()} ${spoken}`
                          : spoken
                      }),
                      false
                    )
                  }
                />
              </div>

              {essayErrorByStep[idx] && (
                <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg px-3 py-2">
                  {essayErrorByStep[idx]}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  disabled={gradingEssayStep === idx}
                  onClick={() => handleGradeMiniEssay(idx)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {gradingEssayStep === idx ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {gradingEssayStep === idx ? 'AI đang chấm bài...' : 'Chấm bài tự luận với AI'}
                  </span>
                </button>

                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Đạt ≥ 6/10 nhận +25 XP
                </span>
              </div>

              {/* AI Evaluation Feedback */}
              {saved.essayEvaluation && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Nhận xét ({saved.essayEvaluation.score}/10 điểm):
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <FormattedText text={saved.essayEvaluation.feedback} />
                  </div>
                  {saved.essayEvaluation.strengths.length > 0 && (
                    <div className="text-emerald-700 dark:text-emerald-300">
                      <strong>Điểm tốt:</strong> <FormattedText text={saved.essayEvaluation.strengths.join(' · ')} />
                    </div>
                  )}
                  {saved.essayEvaluation.mistakes.length > 0 && (
                    <div className="text-rose-700 dark:text-rose-300">
                      <strong>Cần bổ sung:</strong> <FormattedText text={saved.essayEvaluation.mistakes.join(' · ')} />
                    </div>
                  )}
                </div>
              )}

              {/* Sample Solution & Rubric */}
              {revealedEssaySampleSteps[idx] && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/50 space-y-2.5 text-xs">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">
                    Thang ý chấm chuẩn:
                  </div>
                  <ul className="space-y-1 text-emerald-950 dark:text-emerald-200/90">
                    {activeEssay.rubricChecklist.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <FormattedText text={r} />
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-900/40">
                    <div className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                      Đáp án mẫu tham khảo:
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                      <FormattedText text={activeEssay.sampleAnswer} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-900/40 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Tự đánh giá nhanh:
                    </span>
                    {[
                      { label: 'Chưa vững (4/10)', score: 4 },
                      { label: 'Tạm ổn (7/10)', score: 7 },
                      { label: 'Thuộc chắc (9/10)', score: 9 }
                    ].map((opt) => (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => handleSelfGradeEssay(idx, opt.score)}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    );
  };

  // =========================================================================
  // RENDER: SAVED RESULTS, ANALYSIS & ROADMAP SUGGESTION PANEL
  // =========================================================================
  const renderAnalyticsAndRoadmapView = () => {
    const analysis = assessmentRecord.analysis;

    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Tổng kết &amp; Phân tích kết quả bài giảng
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              <FormattedText text={title} />
            </h3>
          </div>

          <button
            type="button"
            disabled={isAnalyzingLesson}
            onClick={handleAnalyzeLessonProgress}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            {isAnalyzingLesson ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>
              {isAnalyzingLesson
                ? 'AI đang phân tích & lập lộ trình...'
                : analysis
                ? 'Cập nhật Phân tích & Gợi ý Lộ trình AI'
                : 'Phân tích Kết quả & Đề xuất Lộ trình AI'}
            </span>
          </button>
        </div>

        {/* 4 Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">Số phần đã kiểm tra</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
              {liveMetrics.completedSteps} / {safeSteps.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">Trắc nghiệm đã làm</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
              {liveMetrics.mcqCorrect} / {liveMetrics.mcqTotal || safeSteps.length * 2}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">Điểm Tự luận nhỏ TB</div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums mt-1">
              {liveMetrics.essayGradedCount > 0 ? `${liveMetrics.essayAvgScore}/10` : 'Chưa chấm'}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">Mức độ nắm vững</div>
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums mt-1">
              {liveMetrics.overallMastery}%
            </div>
          </div>
        </div>

        {analysisError && (
          <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl px-4 py-3">
            {analysisError}
          </div>
        )}

        {/* Per-Section Breakdown */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Chi tiết kết quả theo từng nội dung / công thức:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {safeSteps.map((st, idx) => {
              const saved = assessmentRecord.stepResults?.[idx];
              const mcqs = (saved?.customQuiz?.miniQuiz || st.miniQuiz || []).slice(0, 2);
              const checkedCount = mcqs.filter((_, qIdx) => saved?.mcqChecked?.[qIdx]).length;
              const correctCount = mcqs.filter(
                (q, qIdx) => saved?.mcqChecked?.[qIdx] && saved.mcqAnswers?.[qIdx] === q.correctIndex
              ).length;
              const essayScore = saved?.essayEvaluation?.score;
              const isDone = checkedCount > 0 || typeof essayScore === 'number';
              const isStrong =
                isDone &&
                (checkedCount === 0 || correctCount / checkedCount >= 0.5) &&
                (typeof essayScore !== 'number' || essayScore >= 6);

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      <FormattedText text={st.stepTitle} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>TN: {correctCount}/{mcqs.length}</span>
                      <span>·</span>
                      <span>
                        Tự luận: {typeof essayScore === 'number' ? `${essayScore}/10` : 'Chưa làm'}
                      </span>
                      <span>·</span>
                      <span
                        className={`font-bold ${
                          !isDone
                            ? 'text-slate-400'
                            : isStrong
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {!isDone ? 'Chưa kiểm tra' : isStrong ? 'Đã vững' : 'Cần ôn lại'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectStep(idx)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 shrink-0 whitespace-nowrap"
                  >
                    Mở phần này
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Analysis & Personalized Roadmap */}
        {analysis ? (
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {analysis.readinessLevel}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Phân tích cập nhật lúc {new Date(analysis.analyzedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-extrabold tabular-nums">
                Mastery: {analysis.overallMastery}%
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              <FormattedText text={analysis.summaryFeedback} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
                <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  Nội dung / Công thức đã nắm vững
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysis.strongPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><FormattedText text={pt} /></span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/50 space-y-2">
                <div className="text-xs font-extrabold text-rose-700 dark:text-rose-400">
                  Điểm yếu cần củng cố ngay
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysis.weakPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span><FormattedText text={pt} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Next-Step Roadmap */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-indigo-800 dark:text-indigo-300">
                Lộ trình học tập hợp lý tiếp theo dành cho em
              </div>
              <div className="space-y-2.5">
                {analysis.recommendedRoadmap.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                        0{rec.step}
                      </span>
                      <div className="space-y-1">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          <FormattedText text={rec.title} />
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          <FormattedText text={rec.action} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteRoadmapAction(rec.targetType, rec.stepIndex)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:opacity-90 shrink-0 self-start sm:self-auto whitespace-nowrap"
                    >
                      <span>Thực hiện ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Sau khi làm các câu trắc nghiệm và tự luận nhỏ ở từng phần, hãy bấm{' '}
              <strong>&quot;Phân tích Kết quả &amp; Đề xuất Lộ trình AI&quot;</strong> để hệ thống tổng hợp điểm mạnh/yếu và vạch ra bước học tiếp theo phù hợp nhất!
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Teaching Toolbar Header */}
      <div className="bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{kicker}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
              {liveMetrics.completedSteps}/{safeSteps.length} phần
            </span>
            {savePulseMsg && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Save className="w-3 h-3" />
                {savePulseMsg}
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
            <FormattedText text={title} />
          </h2>
          {subtitle && (
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <FormattedText text={subtitle} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
            <button
              type="button"
              onClick={toggleAutoNarrateAll}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                isAutoNarratingAll
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
              title="Phát lời giảng tiếng Việt liên tục qua tất cả các phần"
            >
              {isAutoNarratingAll ? <VolumeX className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
              <span>{isAutoNarratingAll ? 'Dừng giảng bài' : 'Nghe cả bài'}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setSpeechRate((r) => (r === 0.9 ? 1.02 : r === 1.02 ? 1.15 : 0.9))
              }
              className="px-2 py-1 rounded-lg text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer tabular-nums"
              title="Đổi tốc độ giọng đọc tiếng Việt"
            >
              {speechRate === 1.02 ? '1.0x' : `${speechRate}x`}
            </button>
          </div>

          <button
            onClick={() => setFontScale((prev) => (prev === 'normal' ? 'large' : 'normal'))}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
            title="Thay đổi kích thước chữ bài giảng"
          >
            {fontScale === 'normal' ? 'A+ Chữ lớn' : 'A- Chữ vừa'}
          </button>

          {/* View Layout Switch: Interactive Slides vs Full Page vs Video 3B1B vs Glossary vs Analytics */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
            <button
              onClick={() => setViewLayout('slides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewLayout === 'slides'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Từng phần</span>
            </button>
            <button
              onClick={() => setViewLayout('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewLayout === 'full'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Trọn bài ({safeSteps.length})</span>
            </button>
            <button
              onClick={() => {
                stopVietnameseSpeech();
                autoNarratingRef.current = false;
                setIsAutoNarratingAll(false);
                setSpeakingStepIdx(null);
                setViewLayout('video3b1b');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewLayout === 'video3b1b'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video 3B1B</span>
            </button>
            <button
              onClick={() => setViewLayout('glossary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewLayout === 'glossary'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Từ điển</span>
            </button>
            <button
              onClick={() => setViewLayout('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewLayout === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Lộ trình AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Teaching Stage */}
      {viewLayout === 'analytics' ? (
        renderAnalyticsAndRoadmapView()
      ) : viewLayout === 'video3b1b' ? (
        <div className="bg-slate-950 border border-sky-500/30 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                <span>Phòng dựng Video 3Blue1Brown &amp; Thuyết minh Tiếng Việt</span>
              </div>
              <p className="text-xs text-slate-300">
                Video hoạt hình vector 2D dựng theo các bước bài giảng <strong className="text-white">{title}</strong> — hỗ trợ phát giọng đọc tiếng Việt, tùy chỉnh kịch bản AI và xuất file WebM.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewLayout('slides')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
            >
              ← Quay lại slide bài giảng
            </button>
          </div>

          <MotionReelMiniChat
            key={`${lessonKey}::${videoSeedTopic || 'lesson'}`}
            language={language === 'en' ? 'en' : 'vi'}
            subject={subject}
            initialTopic={videoSeedTopic || activeStep?.stepTitle || title}
            lectureTitle={title}
            lectureSteps={lectureReelSeeds}
            autoVoiceOn={true}
            compactLectureMode={true}
          />
        </div>
      ) : viewLayout === 'glossary' ? (() => {
        const q = glossaryQuery.trim().toLowerCase();
        const uniqueConcepts = Array.from(
          new Map(
            safeSteps
              .flatMap((st) => st.conceptGlossary || [])
              .map((c) => [c.term, c])
          ).values()
        ).filter(
          (c) =>
            !q ||
            c.term.toLowerCase().includes(q) ||
            c.definition.toLowerCase().includes(q) ||
            (c.intuition || '').toLowerCase().includes(q)
        );
        const uniqueAnnotations = Array.from(
          new Map(
            safeSteps
              .flatMap((st) => st.annotations || [])
              .map((a) => [a.symbol, a])
          ).values()
        ).filter(
          (a) =>
            !q ||
            a.symbol.toLowerCase().includes(q) ||
            a.meaning.toLowerCase().includes(q) ||
            (a.unitOrType || '').toLowerCase().includes(q)
        );

        return (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Từ điển Khái niệm &amp; Bảng chú thích ký hiệu toàn bài
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  <FormattedText text={title} />
                </h3>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossaryQuery}
                  onChange={(e) => setGlossaryQuery(e.target.value)}
                  placeholder="Tìm khái niệm hoặc ký hiệu..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Concept Cards */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                1. Hệ thống Khái niệm &amp; Ý nghĩa trực quan ({uniqueConcepts.length})
              </div>
              {uniqueConcepts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Không tìm thấy khái niệm phù hợp.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {uniqueConcepts.map((c, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          <FormattedText text={c.term} />
                        </span>
                        {c.symbol && (
                          <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800 text-xs font-mono text-indigo-700 dark:text-indigo-300">
                            <MathFormula formula={c.symbol} />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <FormattedText text={c.definition} />
                      </div>
                      {c.intuition && (
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/25 rounded px-2.5 py-1.5 border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-bold">Gợi ý nhớ nhanh: </span>
                          <FormattedText text={c.intuition} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unified Symbol Annotation Table */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-200">
                2. Bảng Chú Thích Ký Hiệu · Đơn Vị · Điều Kiện ({uniqueAnnotations.length})
              </div>
              {uniqueAnnotations.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Không tìm thấy ký hiệu phù hợp.</p>
              ) : (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Ký hiệu</th>
                        <th className="py-2.5 px-3 font-bold">Ý nghĩa</th>
                        <th className="py-2.5 px-3 font-bold">Đơn vị / Kiểu</th>
                        <th className="py-2.5 px-3 font-bold">Điều kiện áp dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {uniqueAnnotations.map((a, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
                            <MathFormula formula={a.symbol} />
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                            <FormattedText text={a.meaning} />
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            <FormattedText text={a.unitOrType || '—'} />
                          </td>
                          <td className="py-2.5 px-3 text-amber-700 dark:text-amber-300">
                            <FormattedText text={a.condition || 'Theo đề bài'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })() : viewLayout === 'slides' && activeStep ? (
        <div className="space-y-5">
          {/* TOP HORIZONTAL SYLLABUS DOCK (Unobstructed full-width lecture & sim workspace below) */}
          <div className="bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className={`w-4 h-4 ${accentTextClass}`} />
                  <span>Mục lục từng nội dung</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {liveMetrics.completedSteps}/{safeSteps.length} đã làm
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 dark:text-slate-500">
                  Phím tắt: ← / → chuyển phần
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {keyFormulas.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowFormulaDrawer((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      showFormulaDrawer
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Công thức tra nhanh ({keyFormulas.length})</span>
                    {showFormulaDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleExportStudyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-emerald-400 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  title="Tải phiếu ôn tập & ghi chú cá nhân (.md)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Xuất phiếu ôn (.md)</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyzeLessonProgress}
                  disabled={isAnalyzingLesson}
                  className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isAnalyzingLesson ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <BarChart3 className="w-3.5 h-3.5" />
                  )}
                  <span>Phân tích &amp; Lộ trình AI</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  subjectAccent === 'amber'
                    ? 'bg-amber-500'
                    : subjectAccent === 'emerald'
                    ? 'bg-emerald-500'
                    : subjectAccent === 'blue'
                    ? 'bg-blue-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${Math.round(((currentStepIdx + 1) / safeSteps.length) * 100)}%` }}
              />
            </div>

            {/* Horizontal Multi-Column Syllabus Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {safeSteps.map((st, idx) => {
                const isActive = idx === currentStepIdx;
                const saved = assessmentRecord.stepResults?.[idx];
                const mcqs = (saved?.customQuiz?.miniQuiz || st.miniQuiz || []).slice(0, 2);
                const checkedCount = mcqs.filter((_, qIdx) => saved?.mcqChecked?.[qIdx]).length;
                const correctCount = mcqs.filter(
                  (q, qIdx) =>
                    saved?.mcqChecked?.[qIdx] && saved.mcqAnswers?.[qIdx] === q.correctIndex
                ).length;
                const essayScore = saved?.essayEvaluation?.score;
                const isAssessed = checkedCount > 0 || typeof essayScore === 'number';
                const isBookmarked = Boolean(bookmarkedSteps[idx]);

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectStep(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-white/20 dark:bg-slate-900/15'
                          : isAssessed
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isAssessed && !isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="text-xs font-bold leading-snug">
                          <FormattedText text={st.stepTitle} />
                        </div>
                        {isBookmarked && (
                          <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                        )}
                      </div>
                      <div
                        className={`text-[11px] mt-1 tabular-nums ${
                          isActive
                            ? 'text-slate-300 dark:text-slate-600'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        TN: {correctCount}/{mcqs.length}
                        {typeof essayScore === 'number' ? ` · TL: ${essayScore}/10` : ' · 1 TL nhỏ'}
                        {stepNotes[idx]?.trim() ? ' · Có ghi chú' : ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Collapsible Quick Formula Grid */}
            {showFormulaDrawer && keyFormulas.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Công thức tra nhanh cả bài (bấm để sao chép LaTeX)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {keyFormulas.map((kf, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCopyFormula(kf)}
                      className="text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 text-xs overflow-x-auto flex items-center justify-between gap-2 cursor-pointer transition-colors"
                    >
                      <MathFormula formula={kf} />
                      <span className="shrink-0 text-[10px] font-mono text-slate-400">
                        {copiedFormula === kf ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Full-Width Expanded Active Lecture & Simulation Stage */}
          <div className="w-full space-y-5">
            <div className="bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xs">
              {renderStepBody(activeStep, currentStepIdx)}

              {/* Stepper Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => handleSelectStep(Math.max(0, currentStepIdx - 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Phần trước</span>
                </button>

                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {currentStepIdx + 1} / {safeSteps.length}
                </span>

                {currentStepIdx < safeSteps.length - 1 ? (
                  <button
                    onClick={() => handleSelectStep(currentStepIdx + 1)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs ${accentBtnClass}`}
                  >
                    <span>Giảng phần tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleAnalyzeLessonProgress}
                    disabled={isAnalyzingLesson}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors whitespace-nowrap shadow-xs"
                  >
                    {isAnalyzingLesson ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                    <span>Tổng kết, Phân tích &amp; Lộ trình AI</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mnemonics & Pitfalls Summary Cards on Final Slide */}
            {currentStepIdx === safeSteps.length - 1 &&
              (mnemonics.length > 0 || commonTraps.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mnemonics.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/50 space-y-2">
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Bí kíp phòng thi &amp; Mẹo nhớ nhanh
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-200/90">
                        {mnemonics.map((m, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-amber-500">•</span>
                            <div>
                              <FormattedText text={m} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {commonTraps.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/25 border border-rose-200/70 dark:border-rose-900/50 space-y-2">
                      <div className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        Lỗi sai phổ biến cần tránh
                      </div>
                      <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-200/90">
                        {commonTraps.map((trap, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-rose-500">•</span>
                            <div>
                              <FormattedText text={trap} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            {/* Next Step Action Bar */}
            {actions.length > 0 && (
              <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Bước tiếp theo trong qui trình học:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {actions.map((act, aIdx) => {
                    const v = act.variant || 'secondary';
                    const cls =
                      v === 'primary'
                        ? accentBtnClass
                        : v === 'emerald'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : v === 'amber'
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100';
                    return (
                      <button
                        key={aIdx}
                        onClick={act.onClick}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs ${cls}`}
                      >
                        {act.icon}
                        <span>{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Scrollable View */
        <div className="space-y-5">
          {safeSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs"
            >
              {renderStepBody(step, idx)}
            </div>
          ))}

          {/* Embedded Analytics Summary CTA at bottom of Full View */}
          {renderAnalyticsAndRoadmapView()}

          {actions.length > 0 && (
            <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-end gap-2">
              {actions.map((act, aIdx) => {
                const v = act.variant || 'secondary';
                const cls =
                  v === 'primary'
                    ? accentBtnClass
                    : v === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : v === 'amber'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100';
                return (
                  <button
                    key={aIdx}
                    onClick={act.onClick}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs ${cls}`}
                  >
                    {act.icon}
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
