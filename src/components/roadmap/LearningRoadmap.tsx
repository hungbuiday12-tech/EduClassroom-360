import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Compass,
  HelpCircle,
  Layers,
  Play,
  Pause,
  Sparkles,
  Trophy,
  Zap,
  Code2,
  BookOpen,
  BarChart3,
  Target,
  AlertTriangle,
  CalendarDays,
  SlidersHorizontal,
  Download,
  Printer,
  Search,
  StickyNote,
  RefreshCw,
  Award
} from 'lucide-react';
import {
  LessonAssessmentRecord,
  LessonRoadmapRecommendationItem,
  PersonalizedRoadmapResult,
  RoadmapNode,
  SubjectType,
  TutorContextPayload
} from '../../types';
import { ROADMAP_NODES, WORKFLOW_STAGES } from '../../data/roadmapData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { FormattedText } from '../common/MathRenderer';
import { db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from '../../lib/firebase';
import { AI_ROADMAPS_STORAGE_KEY } from '../tutor/SocraticAITutor';
import {
  CloudLessonAssessmentSummary,
  fetchCloudLessonAssessments,
  LESSON_ASSESSMENT_UPDATED_EVENT,
  loadAllLessonAssessments
} from '../../lib/lessonProgressStore';
import { SmartKnowledgeMap } from './SmartKnowledgeMap';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../../data/csTracksData';
import { CS_LESSONS } from '../../data/csLessonsData';

interface LearningRoadmapProps {
  onBack: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onOpenTutor: (ctx: TutorContextPayload) => void;
  onEarnXP?: (xp: number) => void;
}

type StudyGoalId = 'foundation' | 'entrance_10' | 'thpt_qg' | 'olympiad';
type StudyPaceId = 'steady' | 'balanced' | 'intensive';
type ReadinessFilter = 'all' | 'ready' | 'completed' | 'locked';

interface StudentPlanProfile {
  grade: 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';
  goal: StudyGoalId;
  focusSubjects: Array<'math' | 'physics' | 'cs'>;
  hoursPerWeek: number;
  pace: StudyPaceId;
}

const LOCAL_ROADMAP_KEY = 'educlassroom_roadmap_completed_v1';
const LOCAL_PLAN_PROFILE_KEY = 'synapse_student_plan_profile_v1';
const LOCAL_NODE_NOTES_KEY = 'synapse_roadmap_node_notes_v1';

const DEFAULT_PROFILE: StudentPlanProfile = {
  grade: 'Lớp 10',
  goal: 'foundation',
  focusSubjects: ['math', 'physics', 'cs'],
  hoursPerWeek: 10,
  pace: 'balanced'
};

const WEEK_DAYS_VI = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const WEEK_DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const GRADE_ORDER: Record<string, number> = {
  'Lớp 9': 1,
  'Cơ bản': 1,
  'Lớp 10': 2,
  'Trung cấp': 2,
  'Lớp 11': 3,
  'Lớp 12': 4,
  'Nâng cao / HSG': 4
};

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  onBack,
  onNavigateSubject,
  onOpenTutor,
  onEarnXP
}) => {
  const { user, firebaseUser } = useAuth();
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const isEn = language === 'en';

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [autoPlayWorkflow, setAutoPlayWorkflow] = useState<boolean>(false);
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'math' | 'physics' | 'cs'>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [readinessFilter, setReadinessFilter] = useState<ReadinessFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(ROADMAP_NODES[0].id);
  const [completedCsStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('synapse_cs_track_completed_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [planProfile, setPlanProfile] = useState<StudentPlanProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PLAN_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<StudentPlanProfile>;
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          focusSubjects:
            Array.isArray(parsed.focusSubjects) && parsed.focusSubjects.length > 0
              ? parsed.focusSubjects
              : DEFAULT_PROFILE.focusSubjects
        };
      }
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [nodeNotes, setNodeNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_NODE_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ROADMAP_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [aiRoadmaps, setAiRoadmaps] = useState<Partial<Record<'math' | 'physics' | 'cs', PersonalizedRoadmapResult>>>(() => {
    try {
      const saved = localStorage.getItem(AI_ROADMAPS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [localLessonAssessments, setLocalLessonAssessments] = useState<LessonAssessmentRecord[]>(() =>
    loadAllLessonAssessments(user?.uid || firebaseUser?.uid)
  );
  const [cloudLessonAssessments, setCloudLessonAssessments] = useState<CloudLessonAssessmentSummary[]>([]);

  // Persist student profile & notes locally
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_PLAN_PROFILE_KEY, JSON.stringify(planProfile));
    } catch {}
  }, [planProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_NODE_NOTES_KEY, JSON.stringify(nodeNotes));
    } catch {}
  }, [nodeNotes]);

  // Workflow walkthrough animation timer
  useEffect(() => {
    if (!autoPlayWorkflow) return;
    const id = window.setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % WORKFLOW_STAGES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [autoPlayWorkflow]);

  useEffect(() => {
    const syncAiRoadmaps = () => {
      try {
        const saved = localStorage.getItem(AI_ROADMAPS_STORAGE_KEY);
        setAiRoadmaps(saved ? JSON.parse(saved) : {});
      } catch {}
    };
    window.addEventListener('educlassroom:roadmap-updated', syncAiRoadmaps);
    return () => window.removeEventListener('educlassroom:roadmap-updated', syncAiRoadmaps);
  }, []);

  useEffect(() => {
    const uid = user?.uid || firebaseUser?.uid;
    const syncAssessments = () => {
      setLocalLessonAssessments(loadAllLessonAssessments(uid));
    };
    syncAssessments();
    window.addEventListener(LESSON_ASSESSMENT_UPDATED_EVENT, syncAssessments);
    return () => window.removeEventListener(LESSON_ASSESSMENT_UPDATED_EVENT, syncAssessments);
  }, [user?.uid, firebaseUser?.uid]);

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setCloudLessonAssessments([]);
      return;
    }
    let cancelled = false;
    fetchCloudLessonAssessments(firebaseUser.uid).then((items) => {
      if (!cancelled) {
        setCloudLessonAssessments(items);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [firebaseUser?.uid]);

  // Load roadmap completion from Firestore if signed into Firebase
  useEffect(() => {
    if (!firebaseUser) return;
    const loadFromFirestore = async () => {
      const path = `study_roadmap/${firebaseUser.uid}`;
      try {
        const snap = await getDoc(doc(db, 'study_roadmap', firebaseUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.completedNodeIds)) {
            setCompletedNodeIds(data.completedNodeIds);
            localStorage.setItem(LOCAL_ROADMAP_KEY, JSON.stringify(data.completedNodeIds));
          }
        }
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch {}
      }
    };
    loadFromFirestore();
  }, [firebaseUser]);

  const persistCompletedNodes = async (nextIds: string[]) => {
    setCompletedNodeIds(nextIds);
    try {
      localStorage.setItem(LOCAL_ROADMAP_KEY, JSON.stringify(nextIds));
    } catch {}

    if (firebaseUser) {
      const path = `study_roadmap/${firebaseUser.uid}`;
      try {
        await setDoc(
          doc(db, 'study_roadmap', firebaseUser.uid),
          {
            userId: firebaseUser.uid,
            completedNodeIds: nextIds.slice(0, 100),
            currentStage: WORKFLOW_STAGES[activeStageIdx]?.id || 'concept',
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.WRITE, path);
        } catch {}
      }
    }
  };

  const toggleNodeComplete = (node: RoadmapNode) => {
    const exists = completedNodeIds.includes(node.id);
    const nextIds = exists
      ? completedNodeIds.filter((id) => id !== node.id)
      : [...completedNodeIds, node.id];
    persistCompletedNodes(nextIds);
    if (!exists && onEarnXP) {
      onEarnXP(30);
    }
  };

  const savedLessonSummaries = useMemo(() => {
    type UnifiedSummary = {
      lessonKey: string;
      subject: 'math' | 'physics' | 'cs';
      lessonTitle: string;
      grade?: string;
      totalSteps: number;
      completedSteps: number;
      mcqCorrect: number;
      mcqTotal: number;
      essayGradedCount: number;
      essayAvgScore: number;
      overallMastery: number;
      strongPoints: string[];
      weakPoints: string[];
      readinessLevel?: string;
      summaryFeedback?: string;
      recommendedRoadmap: LessonRoadmapRecommendationItem[];
      recommendedAction?: string;
      updatedAt: string;
    };

    const byKey = new Map<string, UnifiedSummary>();

    for (const cloud of cloudLessonAssessments) {
      byKey.set(cloud.lessonKey, {
        lessonKey: cloud.lessonKey,
        subject: cloud.subject,
        lessonTitle: cloud.lessonTitle,
        grade: cloud.grade,
        totalSteps: cloud.totalSteps || 0,
        completedSteps: cloud.completedSteps || 0,
        mcqCorrect: cloud.mcqCorrect || 0,
        mcqTotal: cloud.mcqTotal || 0,
        essayGradedCount: cloud.essayGradedCount || 0,
        essayAvgScore: cloud.essayAvgScore || 0,
        overallMastery: cloud.overallMastery || 0,
        strongPoints: cloud.strongStepTitles || [],
        weakPoints: cloud.weakStepTitles || [],
        readinessLevel: cloud.readinessLevel,
        recommendedRoadmap: [],
        recommendedAction: cloud.recommendedAction,
        updatedAt: cloud.updatedAt || ''
      });
    }

    for (const rec of localLessonAssessments) {
      const stepEntries = Object.values(rec.stepResults || {});
      let mcqCorrect = 0;
      let mcqTotal = 0;
      let essaySum = 0;
      let essayCount = 0;
      let completedSteps = 0;
      const derivedStrong: string[] = [];
      const derivedWeak: string[] = [];

      for (const st of stepEntries) {
        const checkedIndices = Object.keys(st.mcqChecked || {}).filter((k) => st.mcqChecked[Number(k)]);
        let stCorrect = 0;
        let stChecked = 0;
        const quizList = st.customQuiz?.miniQuiz || [];
        if (typeof st.mcqCheckedCount === 'number' && typeof st.mcqCorrectCount === 'number') {
          stChecked = st.mcqCheckedCount;
          stCorrect = st.mcqCorrectCount;
          mcqTotal += stChecked;
          mcqCorrect += stCorrect;
        } else {
          checkedIndices.forEach((k) => {
            const qIdx = Number(k);
            const qObj = quizList[qIdx];
            stChecked += 1;
            mcqTotal += 1;
            if (qObj && st.mcqAnswers?.[qIdx] === qObj.correctIndex) {
              mcqCorrect += 1;
              stCorrect += 1;
            }
          });
        }
        const hasEssay = typeof st.essayEvaluation?.score === 'number';
        if (hasEssay && st.essayEvaluation) {
          essayCount += 1;
          essaySum += st.essayEvaluation.score;
        }
        if (stChecked > 0 || hasEssay) {
          completedSteps += 1;
          const mcqRatio = stChecked > 0 ? stCorrect / stChecked : 0;
          const essayRatio = hasEssay && st.essayEvaluation ? st.essayEvaluation.score / 10 : mcqRatio;
          const combined = (mcqRatio + essayRatio) / 2;
          if (combined >= 0.75) {
            derivedStrong.push(st.stepTitle);
          } else {
            derivedWeak.push(st.stepTitle);
          }
        }
      }

      const existing = byKey.get(rec.lessonKey);
      const essayAvg =
        essayCount > 0 ? Math.round((essaySum / essayCount) * 10) / 10 : existing?.essayAvgScore || 0;
      const mcqPct = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 100 : 0;
      const essayPct = essayCount > 0 ? essayAvg * 10 : mcqPct;
      const fallbackMastery =
        mcqTotal > 0 || essayCount > 0
          ? Math.max(0, Math.min(100, Math.round(mcqPct * 0.55 + essayPct * 0.45)))
          : 0;
      const computedMastery =
        typeof rec.analysis?.overallMastery === 'number'
          ? Math.round(rec.analysis.overallMastery)
          : existing?.overallMastery ?? fallbackMastery;

      if (!existing || (rec.updatedAt || '') >= (existing.updatedAt || '')) {
        byKey.set(rec.lessonKey, {
          lessonKey: rec.lessonKey,
          subject: rec.subject,
          lessonTitle: rec.lessonTitle,
          grade: rec.grade || existing?.grade,
          totalSteps: rec.totalSteps || existing?.totalSteps || 0,
          completedSteps: Math.max(completedSteps, existing?.completedSteps || 0),
          mcqCorrect: mcqTotal > 0 ? mcqCorrect : existing?.mcqCorrect || 0,
          mcqTotal: mcqTotal > 0 ? mcqTotal : existing?.mcqTotal || 0,
          essayGradedCount: Math.max(essayCount, existing?.essayGradedCount || 0),
          essayAvgScore: essayAvg,
          overallMastery: computedMastery,
          strongPoints:
            rec.analysis?.strongPoints && rec.analysis.strongPoints.length > 0
              ? rec.analysis.strongPoints
              : derivedStrong.length > 0
              ? derivedStrong
              : existing?.strongPoints || [],
          weakPoints:
            rec.analysis?.weakPoints && rec.analysis.weakPoints.length > 0
              ? rec.analysis.weakPoints
              : derivedWeak.length > 0
              ? derivedWeak
              : existing?.weakPoints || [],
          readinessLevel: rec.analysis?.readinessLevel || existing?.readinessLevel,
          summaryFeedback: rec.analysis?.summaryFeedback,
          recommendedRoadmap: rec.analysis?.recommendedRoadmap || [],
          recommendedAction: existing?.recommendedAction,
          updatedAt: rec.updatedAt || existing?.updatedAt || ''
        });
      }
    }

    return Array.from(byKey.values()).sort((a, b) =>
      (b.updatedAt || '').localeCompare(a.updatedAt || '')
    );
  }, [localLessonAssessments, cloudLessonAssessments]);

  // Map mastery gaps from saved assessments
  const weakSubjectBoost = useMemo(() => {
    const scores: Record<'math' | 'physics' | 'cs', number> = { math: 0, physics: 0, cs: 0 };
    savedLessonSummaries.forEach((s) => {
      if (s.overallMastery < 65 || s.weakPoints.length > 0) {
        scores[s.subject] += 1;
      }
    });
    return scores;
  }, [savedLessonSummaries]);

  // Smart Prioritized Study Queue & Weekly Timetable Generator
  const generatedPlan = useMemo(() => {
    const targetGradeNum = GRADE_ORDER[planProfile.grade] || 2;
    const focusSet = new Set(planProfile.focusSubjects);

    const scoredNodes = ROADMAP_NODES.filter((n) => focusSet.has(n.subject))
      .map((node) => {
        const isDone = completedNodeIds.includes(node.id);
        const prereqReady = node.prerequisites.every((p) => completedNodeIds.includes(p));
        const nodeGradeNum = GRADE_ORDER[node.grade] || 2;

        // Compute priority score
        let priority = 0;
        if (!isDone) priority += 100;
        if (prereqReady && !isDone) priority += 40;
        if (nodeGradeNum === targetGradeNum) priority += 35;
        else if (nodeGradeNum < targetGradeNum && !isDone) priority += 22; // patch foundation first

        if (planProfile.goal === 'entrance_10' && nodeGradeNum === 1) priority += 35;
        if (planProfile.goal === 'thpt_qg' && nodeGradeNum >= 3) priority += 32;
        if (planProfile.goal === 'olympiad' && (node.subject === 'cs' || nodeGradeNum >= 3)) priority += 28;

        priority += (weakSubjectBoost[node.subject] || 0) * 10;
        priority -= node.order * 1.5;

        const masteryMatch = savedLessonSummaries.find((s) => s.lessonKey === node.targetLessonId);
        const reason =
          masteryMatch && masteryMatch.overallMastery < 70
            ? isEn
              ? `Low mastery (${masteryMatch.overallMastery}%) — priority review`
              : `Độ vững ${masteryMatch.overallMastery}% — cần củng cố ngay`
            : !isDone && prereqReady
            ? isEn
              ? 'Prerequisites met — ready now'
              : 'Đã đủ nền tảng — học ngay'
            : !isDone
            ? isEn
              ? 'Upcoming milestone'
              : 'Chặng kế tiếp theo tuyến'
            : isEn
            ? 'Mastered — quick spaced review'
            : 'Đã xong — ôn nhắc lại 15p';

        return { node, isDone, prereqReady, priority, reason };
      })
      .sort((a, b) => b.priority - a.priority);

    const paceMultiplier = planProfile.pace === 'steady' ? 0.85 : planProfile.pace === 'intensive' ? 1.15 : 1.0;
    const targetWeeklyMinutes = Math.round(planProfile.hoursPerWeek * 60);
    const activeQueue = scoredNodes.filter((x) => !x.isDone);
    const pool = activeQueue.length > 0 ? activeQueue : scoredNodes;

    // Distribute across 7 days balanced
    const days: Array<{
      dayIndex: number;
      dayLabel: string;
      sessions: Array<{
        id: string;
        node: RoadmapNode;
        minutes: number;
        focusLabel: string;
        isReview: boolean;
      }>;
      totalMinutes: number;
    }> = (isEn ? WEEK_DAYS_EN : WEEK_DAYS_VI).map((dayLabel, idx) => ({
      dayIndex: idx,
      dayLabel,
      sessions: [],
      totalMinutes: 0
    }));

    let accumulatedMinutes = 0;
    let cursor = 0;
    const maxPerDay = Math.max(45, Math.ceil(targetWeeklyMinutes / 5));

    // Day rotation so every active day gets crisp sessions without overloading Sunday
    const daySequence = [0, 2, 4, 1, 3, 5, 6];
    let safety = 0;
    while (accumulatedMinutes < targetWeeklyMinutes && pool.length > 0 && safety < 28) {
      safety++;
      const entry = pool[cursor % pool.length];
      const baseMins = Math.round(entry.node.estimatedMinutes * paceMultiplier);
      const sessionMins = Math.min(60, Math.max(25, baseMins));
      const daySlotIdx = daySequence[(safety - 1) % daySequence.length];
      const dayBucket = days[daySlotIdx];

      if (dayBucket.totalMinutes + sessionMins <= maxPerDay + 20 || safety > 14) {
        const isReview = entry.isDone || safety > pool.length;
        dayBucket.sessions.push({
          id: `${entry.node.id}-${safety}`,
          node: entry.node,
          minutes: isReview ? Math.min(30, sessionMins) : sessionMins,
          focusLabel: isReview
            ? isEn
              ? 'Spaced Practice + Arena'
              : 'Luyện đề & Củng cố'
            : entry.reason,
          isReview
        });
        dayBucket.totalMinutes += isReview ? Math.min(30, sessionMins) : sessionMins;
        accumulatedMinutes += isReview ? Math.min(30, sessionMins) : sessionMins;
      }
      cursor++;
    }

    const remainingMinutes = ROADMAP_NODES.filter(
      (n) => focusSet.has(n.subject) && !completedNodeIds.includes(n.id)
    ).reduce((acc, n) => acc + n.estimatedMinutes, 0);

    const estimatedWeeksToFinish = Math.max(
      1,
      Math.ceil(remainingMinutes / Math.max(120, targetWeeklyMinutes))
    );

    return {
      priorityQueue: pool.slice(0, 6),
      days,
      accumulatedMinutes,
      estimatedWeeksToFinish,
      remainingHours: Math.round((remainingMinutes / 60) * 10) / 10
    };
  }, [planProfile, completedNodeIds, weakSubjectBoost, savedLessonSummaries, isEn]);

  const filteredNodes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ROADMAP_NODES.filter((n) => {
      const matchSubj = subjectFilter === 'all' || n.subject === subjectFilter;
      const matchGrade = gradeFilter === 'all' || n.grade === gradeFilter;
      const isDone = completedNodeIds.includes(n.id);
      const isReady = !isDone && n.prerequisites.every((p) => completedNodeIds.includes(p));
      const matchReadiness =
        readinessFilter === 'all' ||
        (readinessFilter === 'completed' && isDone) ||
        (readinessFilter === 'ready' && isReady) ||
        (readinessFilter === 'locked' && !isDone && !isReady);
      const matchQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.titleEn.toLowerCase().includes(q) ||
        n.goal.toLowerCase().includes(q);
      return matchSubj && matchGrade && matchReadiness && matchQuery;
    });
  }, [subjectFilter, gradeFilter, readinessFilter, searchQuery, completedNodeIds]);

  const activeNode =
    ROADMAP_NODES.find((n) => n.id === selectedNodeId) || filteredNodes[0] || ROADMAP_NODES[0];

  const activeStage = WORKFLOW_STAGES[activeStageIdx] || WORKFLOW_STAGES[0];
  const progressPercent = Math.round((completedNodeIds.length / ROADMAP_NODES.length) * 100);

  const subjectMasteryStats = useMemo(() => {
    return (['math', 'physics', 'cs'] as const).map((subj) => {
      const nodes = ROADMAP_NODES.filter((n) => n.subject === subj);
      const done = nodes.filter((n) => completedNodeIds.includes(n.id)).length;
      const pct = nodes.length > 0 ? Math.round((done / nodes.length) * 100) : 0;
      return { subj, done, total: nodes.length, pct };
    });
  }, [completedNodeIds]);

  const recommendedNextNode =
    ROADMAP_NODES.find(
      (n) =>
        !completedNodeIds.includes(n.id) &&
        n.prerequisites.every((pre) => completedNodeIds.includes(pre))
    ) || ROADMAP_NODES[0];

  const getSubjectName = (subj: 'math' | 'physics' | 'cs') => {
    if (subj === 'math') return isEn ? 'Mathematics' : 'Toán học';
    if (subj === 'physics') return isEn ? 'Physics' : 'Vật lí';
    return isEn ? 'Computer Science' : 'Tin học';
  };

  const getSubjectIcon = (subj: 'math' | 'physics' | 'cs') => {
    if (subj === 'math') return <Compass className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    if (subj === 'physics') return <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    return <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
  };

  const handleOpenSavedLesson = (
    subject: 'math' | 'physics' | 'cs',
    lessonKey?: string,
    explicitCsTrackId?: CSTrackId
  ) => {
    const NODE_TO_CS_TRACK: Record<string, CSTrackId> = {
      'rm-cs-openedg': 'openedg_cpp',
      'rm-cs-roadmapsh': 'roadmap_sh_cpp',
      'rm-cs-learncpp': 'learncpp',
      'rm-cs-github': 'github_career'
    };

    if (subject === 'math') {
      navigate({
        subject: 'math',
        mathTab: 'lectures',
        mathViewMode: lessonKey ? 'lecture' : 'catalog',
        ...(lessonKey ? { mathLectureId: lessonKey } : {})
      });
    } else if (subject === 'physics') {
      navigate({
        subject: 'physics',
        physicsView: lessonKey ? 'lecture' : 'catalog',
        ...(lessonKey ? { physicsLessonId: lessonKey } : {}),
        physicsTab: 'theory'
      });
    } else {
      const resolvedTrack = explicitCsTrackId || (lessonKey ? NODE_TO_CS_TRACK[lessonKey] : undefined);
      if (resolvedTrack) {
        navigate({
          subject: 'cs',
          csViewMode: 'curriculum',
          csSubView: 'roadmap',
          csTrackId: resolvedTrack,
          csLessonTab: 'lecture'
        });
        return;
      }
      navigate({
        subject: 'cs',
        csViewMode: 'curriculum',
        csSubView: lessonKey ? 'lecture' : 'roadmap',
        ...(lessonKey ? { csLessonId: lessonKey, csTrackId: 'vnoi' } : {}),
        csLessonTab: 'lecture'
      });
    }
  };

  const toggleFocusSubject = (subj: 'math' | 'physics' | 'cs') => {
    setPlanProfile((prev) => {
      const exists = prev.focusSubjects.includes(subj);
      if (exists && prev.focusSubjects.length === 1) return prev; // Keep at least 1 subject active
      return {
        ...prev,
        focusSubjects: exists
          ? prev.focusSubjects.filter((s) => s !== subj)
          : [...prev.focusSubjects, subj]
      };
    });
  };

  const handleExportPlanJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: planProfile,
      progressPercent,
      completedNodes: completedNodeIds,
      weeklySchedule: generatedPlan.days.map((d) => ({
        day: d.dayLabel,
        totalMinutes: d.totalMinutes,
        sessions: d.sessions.map((s) => ({
          title: s.node.title,
          subject: s.node.subject,
          grade: s.node.grade,
          minutes: s.minutes
        }))
      }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapse-lo-trinh-${planProfile.grade.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ringRadius = 32;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringOffset = ringCirc * (1 - progressPercent / 100);

  const uniqueGrades = useMemo(
    () => Array.from(new Set(ROADMAP_NODES.map((n) => n.grade))),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header Banner with Animated SVG Mastery Gauge */}
      <div className="sci-frame sci-blueprint-bg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2.5">
            <button
              onClick={onBack}
              className="cs-deck-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-700 dark:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back to Classroom' : 'Quay lại Lớp học'}</span>
            </button>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isEn
                ? 'Smart Study Planner & Procedural Learning Roadmap (Grades 9–12)'
                : 'Lộ Trình Học Thông Minh & Sơ Đồ Qui Trình (Lớp 9 – 12)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {isEn
                ? 'Automatically build a balanced weekly schedule tailored to your grade, target exam, and mastery diagnostics across Math, Physics, and CS.'
                : 'Tự động lập thời khóa biểu tuần tối ưu theo lớp học, mục tiêu kỳ thi và kết quả đánh giá năng lực Toán · Lí · Tin.'}
            </p>

            {/* Per-Subject Inline Mastery Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
              {subjectMasteryStats.map((st, idx) => (
                <React.Fragment key={st.subj}>
                  {idx > 0 && <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>}
                  <span className="inline-flex items-center gap-1.5">
                    {getSubjectIcon(st.subj)}
                    <span className="font-semibold">{getSubjectName(st.subj)}:</span>
                    <strong className="font-mono text-slate-900 dark:text-white">
                      {st.done}/{st.total}
                    </strong>
                    <span className="text-slate-400">({st.pct}%)</span>
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Animated SVG Ring + Shimmer Progress */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 flex items-center gap-3.5 min-w-[230px]">
              <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                <svg className="w-18 h-18 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                  <circle
                    cx="40"
                    cy="40"
                    r={ringRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={ringRadius}
                    fill="none"
                    stroke="url(#roadmapGaugeGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringOffset}
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="roadmapGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-xs font-mono font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {progressPercent}%
                </span>
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isEn ? 'Overall Mastery' : 'Tiến độ toàn chặng'}
                </div>
                <div className="text-sm font-mono font-extrabold text-blue-700 dark:text-sky-400 tabular-nums">
                  {completedNodeIds.length}/{ROADMAP_NODES.length} {isEn ? 'nodes' : 'chặng'}
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 roadmap-shimmer-bar transition-all duration-500"
                    style={{ width: `${Math.max(4, progressPercent)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() =>
                  onOpenTutor({
                    subject: activeNode.subject,
                    mode: 'diagnostic_roadmap',
                    topicTitle: activeNode.title,
                    grade: activeNode.grade
                  })
                }
                className="cs-deck-btn px-4 py-2.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEn ? 'Syn AI Mode 3: Build My Roadmap' : 'Syn AI Chế Độ 3: Tạo Sơ Đồ Riêng'}</span>
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => onNavigateSubject('growth_hub')}
                  className="cs-deck-btn px-2.5 py-1.5 rounded bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/70 border border-rose-300/80 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'Error SM-2' : 'Sổ Lỗi & SM-2'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateSubject('exams')}
                  className="cs-deck-btn px-2.5 py-1.5 rounded bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/70 border border-sky-300/80 dark:border-sky-500/40 text-sky-700 dark:text-sky-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? 'Weak Mock' : 'Đề Điểm Yếu'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SMART INTERACTIVE KNOWLEDGE GRAPH HUD */}
      <SmartKnowledgeMap
        isEn={isEn}
        completedNodeIds={completedNodeIds}
        savedLessonSummaries={savedLessonSummaries}
        aiRoadmaps={aiRoadmaps}
        dailyStudyMinutes={generatedPlan.days}
        activePlanGrade={planProfile.grade}
        activePlanHoursPerWeek={planProfile.hoursPerWeek}
        onSelectRoadmapNode={(nodeId) => setSelectedNodeId(nodeId)}
        onOpenNodeLesson={(subj, lessonId, csTrackId) => handleOpenSavedLesson(subj, lessonId, csTrackId)}
        onOpenDiagnosticAI={(subj, topicTitle) =>
          onOpenTutor({
            subject: subj,
            mode: 'diagnostic_roadmap',
            topicTitle,
            grade: planProfile.grade
          })
        }
        onNavigateSubject={onNavigateSubject}
      />

      {/* SECTION 00: PERSONALIZED SMART STUDY PLAN GENERATOR & WEEKLY TIMETABLE */}
      <div className="rm-arch-frame bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 sm:p-6 shadow-xs space-y-5 roadmap-card-enter">
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-sky-500/60" />
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-sky-500/60" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-sky-600 dark:text-sky-400 icon-anim-compass" />
              <span>
                {isEn
                  ? '00. Personalized Study Plan & Weekly Schedule Generator'
                  : '00. Thiết Lập Lộ Trình & Thời Khóa Biểu Tuần Cá Nhân Hóa'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEn
                ? 'Adjust your grade, target exam, priority subjects, and weekly hours — the schedule updates live.'
                : 'Chọn lớp hiện tại, mục tiêu ôn thi, môn ưu tiên và quỹ giờ/tuần — hệ thống tự xếp lịch học hợp lí theo năng lực.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPlanJson}
              className="cs-deck-btn px-3 py-1.5 rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Export Plan' : 'Xuất Lộ Trình'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="cs-deck-btn px-3 py-1.5 rounded-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEn ? 'Print' : 'In Lịch'}</span>
            </button>
            <button
              onClick={() => setPlanProfile(DEFAULT_PROFILE)}
              className="cs-deck-btn px-3 py-1.5 rounded-sm border border-slate-200 dark:border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-600 dark:text-slate-300 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset' : 'Mặc định'}</span>
            </button>
          </div>
        </div>

        {/* Profile Configurator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-md border border-slate-200/80 dark:border-slate-800">
          {/* Grade */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>{isEn ? 'Current Grade' : 'Khối lớp hiện tại'}</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setPlanProfile((p) => ({ ...p, grade: g }))}
                  className={`py-1.5 px-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                    planProfile.grade === g
                      ? 'bg-blue-700 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isEn ? 'Learning Goal' : 'Mục tiêu trọng tâm'}
            </label>
            <select
              value={planProfile.goal}
              onChange={(e) => setPlanProfile((p) => ({ ...p, goal: e.target.value as StudyGoalId }))}
              className="w-full py-2 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-sky-500"
            >
              <option value="foundation">{isEn ? 'GDPT Core Mastery' : 'Nắm chắc nền tảng GDPT'}</option>
              <option value="entrance_10">{isEn ? 'Grade 10 Entrance Exam' : 'Ôn thi Tuyển sinh vào 10'}</option>
              <option value="thpt_qg">{isEn ? 'National High School Exam' : 'Ôn thi Tốt nghiệp THPT QG'}</option>
              <option value="olympiad">{isEn ? 'Specialized / Olympiad (VNOI)' : 'Thi Chuyên & HSG (VNOI)'}</option>
            </select>
          </div>

          {/* Focus Subjects */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isEn ? 'Focus Subjects' : 'Môn ưu tiên'}
            </label>
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'math', label: isEn ? 'Math' : 'Toán' },
                  { id: 'physics', label: isEn ? 'Phys' : 'Lí' },
                  { id: 'cs', label: isEn ? 'CS' : 'Tin' }
                ] as const
              ).map((s) => {
                const active = planProfile.focusSubjects.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleFocusSubject(s.id)}
                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekly Hours Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span>{isEn ? 'Weekly Budget' : 'Quỹ giờ / tuần'}</span>
              <span className="font-mono text-blue-700 dark:text-sky-400 tabular-nums">
                {planProfile.hoursPerWeek}h ({generatedPlan.accumulatedMinutes}p)
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={28}
              step={1}
              value={planProfile.hoursPerWeek}
              onChange={(e) => setPlanProfile((p) => ({ ...p, hoursPerWeek: Number(e.target.value) }))}
              className="w-full accent-blue-700 cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
              <span>4h</span>
              <span>16h</span>
              <span>28h</span>
            </div>
          </div>

          {/* Pace + Summary */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isEn ? 'Study Pace' : 'Nhịp độ học'}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { id: 'steady', label: isEn ? 'Steady' : 'Chậm chắc' },
                  { id: 'balanced', label: isEn ? 'Normal' : 'Cân bằng' },
                  { id: 'intensive', label: isEn ? 'Fast' : 'Tăng tốc' }
                ] as const
              ).map((pc) => (
                <button
                  key={pc.id}
                  onClick={() => setPlanProfile((p) => ({ ...p, pace: pc.id }))}
                  className={`py-2 px-1 rounded-sm text-[11px] font-bold transition-all whitespace-nowrap cs-deck-btn ${
                    planProfile.pace === pc.id
                      ? 'bg-emerald-600 text-white border border-emerald-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  {pc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Summary Strip + Priority Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Top Priority Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-2.5 rm-arch-frame bg-slate-50/90 dark:bg-slate-950/75 border border-slate-200 dark:border-slate-800 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500 icon-anim-bounce-subtle" />
                <span>{isEn ? 'Top Priority Milestones' : 'Thứ Tự Ưu Tiên Tuần Này'}</span>
              </h3>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                ~{generatedPlan.estimatedWeeksToFinish} {isEn ? 'wks left' : 'tuần hoàn tất'}
              </span>
            </div>

            <div className="space-y-2">
              {generatedPlan.priorityQueue.map((item, idx) => (
                <div
                  key={item.node.id}
                  style={{ animationDelay: `${idx * 45}ms` }}
                  className="roadmap-card-enter rm-card-interactive p-2.5 rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 flex items-start justify-between gap-2"
                >
                  <div
                    onClick={() => setSelectedNodeId(item.node.id)}
                    className="min-w-0 cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        #{idx + 1}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{getSubjectName(item.node.subject)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.node.grade}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">
                      {isEn ? item.node.titleEn : item.node.title}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {item.reason}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenSavedLesson(item.node.subject, item.node.targetLessonId)}
                    className="px-2.5 py-1 rounded-sm border border-indigo-200 dark:border-indigo-800/70 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white text-[10px] font-bold shrink-0 transition-colors cs-deck-btn"
                  >
                    {isEn ? 'Study' : 'Học'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Interactive Timetable Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {generatedPlan.days.map((day, dIdx) => (
              <div
                key={day.dayIndex}
                style={{ animationDelay: `${dIdx * 40}ms` }}
                className="roadmap-card-enter rm-card-interactive p-3 rounded-md bg-slate-50/90 dark:bg-slate-950/75 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2 overflow-hidden relative"
              >
                <div className={`h-0.5 w-full absolute top-0 left-0 ${day.sessions.length > 0 ? 'roadmap-shimmer-bar' : 'bg-slate-200 dark:bg-slate-800'}`} />
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70 dark:border-slate-800">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      {day.dayLabel}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {day.totalMinutes}p
                    </span>
                  </div>

                  {day.sessions.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-2">
                      {isEn ? 'Light review / rest day' : 'Nghỉ ngơi hoặc đấu Arena 15p'}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {day.sessions.map((sess) => (
                        <button
                          key={sess.id}
                          onClick={() => handleOpenSavedLesson(sess.node.subject, sess.node.targetLessonId)}
                          className="w-full text-left p-2 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition-all group cs-deck-btn"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1 font-semibold">
                              {getSubjectIcon(sess.node.subject)}
                              <span>{sess.node.grade}</span>
                            </span>
                            <span className="font-mono tabular-nums">{sess.minutes}p</span>
                          </div>
                          <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 mt-0.5 leading-snug">
                            {isEn ? sess.node.titleEn : sess.node.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {day.sessions.length > 0 && (
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{day.sessions[0].isReview ? (isEn ? 'Consolidate' : 'Củng cố') : isEn ? 'New Skill' : 'Kiến thức mới'}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SAVED LESSON ASSESSMENTS & AI STUDY ROADMAP RECOMMENDATIONS */}
      {savedLessonSummaries.length > 0 && (
        <div className="rm-arch-frame bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/70 rounded-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500 icon-anim-zap" />
                <span>
                  {isEn
                    ? 'Saved Lesson Assessments & AI Recommendations'
                    : 'Kết Quả Từng Bài Giảng Đã Lưu & Gợi Ý Lộ Trình AI'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Detailed per-section MCQ & mini-essay tracking, strengths/weaknesses analysis, and direct study links.'
                  : 'Tổng hợp điểm Trắc nghiệm + Tự luận nhỏ theo từng phần nội dung/công thức để ôn đúng chỗ còn hổng.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {savedLessonSummaries.length} {isEn ? 'lessons tracked' : 'bài đã lưu kết quả'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLessonSummaries.slice(0, 6).map((item, sIdx) => {
              const firstStepRec = item.recommendedRoadmap[0];
              return (
                <div
                  key={item.lessonKey}
                  style={{ animationDelay: `${sIdx * 50}ms` }}
                  className="rm-card-interactive roadmap-card-enter p-4 rounded-md bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {getSubjectIcon(item.subject)}
                          <span>{getSubjectName(item.subject)}</span>
                          {item.grade && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{item.grade}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-2">
                          {item.lessonTitle}
                        </h3>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-sm text-xs font-mono font-extrabold tabular-nums ${
                            item.overallMastery >= 80
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : item.overallMastery >= 55
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {item.overallMastery}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
                        <div
                          className={`h-full roadmap-shimmer-bar transition-all duration-500 ${
                            item.overallMastery >= 80
                              ? 'bg-emerald-500'
                              : item.overallMastery >= 55
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.max(4, item.overallMastery)}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
                        <span>
                          {isEn ? 'Completed:' : 'Đã làm:'}{' '}
                          <strong className="text-slate-900 dark:text-slate-200">
                            {item.completedSteps}/{item.totalSteps || '?'}
                          </strong>{' '}
                          {isEn ? 'steps' : 'phần'}
                        </span>
                        {item.mcqTotal > 0 && (
                          <span>
                            {isEn ? 'MCQ:' : 'TN:'}{' '}
                            <strong className="text-indigo-600 dark:text-indigo-400">
                              {item.mcqCorrect}/{item.mcqTotal}
                            </strong>
                          </span>
                        )}
                        {item.essayGradedCount > 0 && (
                          <span>
                            {isEn ? 'Short Essay:' : 'TL nhỏ:'}{' '}
                            <strong className="text-emerald-600 dark:text-emerald-400">
                              {item.essayAvgScore}/10
                            </strong>{' '}
                            ({item.essayGradedCount} {isEn ? 'Q' : 'câu'})
                          </span>
                        )}
                      </div>
                    </div>

                    {item.readinessLevel && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                        <Target className="w-3 h-3 shrink-0" />
                        <span>{item.readinessLevel}</span>
                      </div>
                    )}

                    {(item.strongPoints.length > 0 || item.weakPoints.length > 0) && (
                      <div className="space-y-1.5 text-[11px]">
                        {item.strongPoints.length > 0 && (
                          <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong>{isEn ? 'Mastered:' : 'Nắm vững:'}</strong> {item.strongPoints.slice(0, 2).join('; ')}
                            </span>
                          </div>
                        )}
                        {item.weakPoints.length > 0 && (
                          <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong>{isEn ? 'Needs Review:' : 'Cần củng cố:'}</strong> {item.weakPoints.slice(0, 2).join('; ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {(firstStepRec || item.recommendedAction) && (
                      <div className="p-2.5 rounded-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {isEn ? 'Next Roadmap Suggestion: ' : 'Gợi ý lộ trình tiếp theo: '}
                        </span>
                        {firstStepRec
                          ? `${firstStepRec.title} — ${firstStepRec.action}`
                          : item.recommendedAction}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenSavedLesson(item.subject, item.lessonKey)}
                      className="cs-deck-btn flex-1 min-w-[140px] py-2 px-3 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-xs font-bold flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Reopen Lesson & Review' : 'Mở Lại Bài Giảng & Xem Phân Tích'}</span>
                    </button>

                    {item.weakPoints.length > 0 && (
                      <button
                        onClick={() =>
                          onOpenTutor({
                            subject: item.subject,
                            topicTitle: item.lessonTitle,
                            grade: item.grade,
                            problemStatement: `Hãy giúp em ôn lại các phần còn yếu trong bài "${item.lessonTitle}": ${item.weakPoints.join('; ')}.`
                          })
                        }
                        className="cs-deck-btn py-2 px-3 rounded-sm bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ôn phần yếu với AI</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PERSONALIZED AI ROADMAPS FROM MODE 3 */}
      {Object.values(aiRoadmaps).some(Boolean) && (
        <div className="rm-arch-frame bg-white dark:bg-slate-900 border border-emerald-300/70 dark:border-emerald-800/70 rounded-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {isEn ? 'Your AI-Diagnosed Personalized Roadmaps' : 'Sơ Đồ Học Tập Cá Nhân Hóa Từ AI Chế Độ 3'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Built from your skill assessment & specialization choices.'
                  : 'Được tổng hợp từ bài kiểm tra kỹ năng chuyên môn và định hướng chuyên ngành của bạn.'}
              </p>
            </div>
            <button
              onClick={() => onOpenTutor({ subject: 'math', mode: 'diagnostic_roadmap' })}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto cursor-pointer"
            >
              {isEn ? 'Re-assess with AI →' : 'Đánh giá lại với AI →'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['math', 'physics', 'cs'] as const).map((subj, idx) => {
              const rm = aiRoadmaps[subj];
              if (!rm) return null;
              return (
                <div
                  key={subj}
                  style={{ animationDelay: `${idx * 55}ms` }}
                  className="rm-card-interactive roadmap-card-enter p-4 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-400/80 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {getSubjectName(subj)} · {rm.grade}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {rm.knowledgeScore}%
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                      {rm.targetMajor}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {rm.estimatedLevel}
                    </p>
                    <div className="space-y-1 pt-1">
                      {rm.stages.slice(0, 3).map((st) => (
                        <div key={st.step} className="text-[11px] text-slate-700 dark:text-slate-300 truncate">
                          0{st.step}. {st.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onOpenTutor({
                        subject: subj,
                        mode: 'diagnostic_roadmap'
                      })
                    }
                    className="cs-deck-btn w-full py-2 px-3 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {isEn ? 'View Full Flowchart' : 'Mở Sơ Đồ Chi Tiết'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 1: ANIMATED 5-STEP PROCEDURAL LEARNING WORKFLOW */}
      <div className="rm-arch-frame roadmap-beam-sweep bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 sm:p-6 shadow-xs space-y-5">
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-indigo-500/60" />
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-indigo-500/60" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {isEn ? '01. Standard 5-Step Study Workflow' : '01. Qui Trình Học Tập Chuẩn 5 Bước Cho Mỗi Bài'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Click each step or enable the animated cycle walkthrough to follow the study loop.'
                : 'Bấm từng bước hoặc bật chế độ Trình diễn Luồng học để xem dòng chuyển hóa kiến thức.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setAutoPlayWorkflow((v) => !v)}
              className={`cs-deck-btn px-3 py-1.5 rounded-sm text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                autoPlayWorkflow
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {autoPlayWorkflow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoPlayWorkflow ? (isEn ? 'Pause Tour' : 'Dừng Minh Họa') : isEn ? 'Animate Loop' : 'Chạy Minh Họa Luồng'}</span>
            </button>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              ~75 {isEn ? 'min / cycle' : 'phút / chu trình'}
            </span>
          </div>
        </div>

        {/* Connected 5-step diagram with animated SVG energy connector */}
        <div className="relative">
          {/* Desktop Animated SVG Line behind cards */}
          <svg
            className="hidden sm:block absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 w-[80%] h-8 pointer-events-none z-0"
            preserveAspectRatio="none"
            viewBox="0 0 800 32"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="16"
              x2="800"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-200 dark:text-slate-800"
            />
            <line
              x1="0"
              y1="16"
              x2={Math.max(40, ((activeStageIdx + 0.5) / WORKFLOW_STAGES.length) * 800)}
              y2="16"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              className="roadmap-connector-flow transition-all duration-500"
            />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const isActive = activeStageIdx === idx;
              const isPassed = idx < activeStageIdx;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setAutoPlayWorkflow(false);
                    setActiveStageIdx(idx);
                  }}
                  className={`rm-card-interactive relative overflow-hidden text-left p-3.5 rounded-md border flex flex-col justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-slate-900 dark:text-white shadow-md scale-[1.02] roadmap-beam-sweep'
                      : isPassed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400/50 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-50 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-sm font-mono text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-indigo-600 text-white roadmap-node-aura'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {isPassed ? '✓' : `0${stage.stepNumber}`}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {stage.estimatedMinutes}p
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-snug">
                    {isEn ? stage.titleEn : stage.titleVi}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail Card */}
        <div
          key={activeStage.id}
          className="roadmap-card-enter bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10"
        >
          <div className="space-y-2.5 flex-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              {isEn ? activeStage.titleEn : activeStage.titleVi}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isEn ? activeStage.subtitleEn : activeStage.subtitleVi}
            </p>
            <ul className="space-y-1.5 pt-1">
              {(isEn ? activeStage.actionChecklistEn : activeStage.actionChecklistVi).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2">
            {activeStage.id === 'tutor' ? (
              <button
                onClick={() =>
                  onOpenTutor({
                    subject: activeNode.subject,
                    topicTitle: activeNode.title,
                    grade: activeNode.grade
                  })
                }
                className="cs-deck-btn px-4 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-4 h-4 icon-anim-star" />
                <span>{isEn ? 'Open Syn AI Now' : 'Mở Syn AI Ngay'}</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateSubject(activeStage.targetSubject)}
                className="cs-deck-btn px-4 py-2.5 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>
                  {activeStage.id === 'arena'
                    ? isEn
                      ? 'Go to Weekly Arena'
                      : 'Vào Đấu Trường Tuần'
                    : isEn
                    ? 'Launch Module for This Step'
                    : 'Thực Hành Bước Này'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setActiveStageIdx((i) => (i + 1) % WORKFLOW_STAGES.length)}
              className="cs-deck-btn px-3 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              {isEn ? 'Next Step →' : 'Bước kế tiếp →'}
            </button>
          </div>
        </div>
      </div>

      {/* Next Recommended Milestone Banner */}
      <div className="rm-arch-frame roadmap-beam-sweep bg-slate-900 dark:bg-indigo-950/60 border border-slate-800 dark:border-indigo-900 text-white rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="text-xs text-indigo-300 font-semibold font-mono">
            {isEn ? 'Recommended Next Step' : 'Đề xuất chặng tiếp theo dành cho bạn'} · {getSubjectName(recommendedNextNode.subject)} · {recommendedNextNode.grade}
          </div>
          <div className="text-sm sm:text-base font-bold">{recommendedNextNode.title}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 relative z-10">
          <button
            onClick={() => handleOpenSavedLesson(recommendedNextNode.subject, recommendedNextNode.targetLessonId)}
            className="cs-deck-btn px-4 py-2 rounded-sm bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isEn ? 'Start Lesson' : 'Học Ngay Bài Này'}</span>
          </button>
          <button
            onClick={() => setSelectedNodeId(recommendedNextNode.id)}
            className="cs-deck-btn px-4 py-2 rounded-sm bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{isEn ? 'Inspect Step' : 'Xem hướng dẫn'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SPECIALIZED CS & C++ LEARNING ROADMAPS (5 TRACKS) */}
      <div className="rm-arch-frame bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 sm:p-6 shadow-xs space-y-4">
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-emerald-500/60" />
        <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-emerald-500/60" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 icon-anim-code" />
              <span>
                {isEn
                  ? 'Specialized Computer Science & C++ Roadmaps (5 Tracks)'
                  : 'Lộ Trình Tin Học & C++ Chuyên Sâu (5 Lộ Trình Chuẩn Quốc Tế)'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEn
                ? 'Follow VNOI Competitive Programming or switch seamlessly across OpenEDG Certification, Roadmap.sh, LearnCpp.com, and GitHub Career Track with built-in C++20 mini-lessons & quizzes.'
                : 'Chọn theo mục tiêu: Thi đấu HSG VNOI, Chứng chỉ Quốc tế OpenEDG, Thực chiến Roadmap.sh, Tự học bài bản LearnCpp.com hoặc Sự nghiệp GitHub Career Track.'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
            {isEn ? '18 Interactive C++ Stages' : '18 Chặng Thực Hành C++'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5">
          {/* VNOI Card */}
          <div className="rm-card-interactive roadmap-card-enter relative overflow-hidden p-4 rounded-md bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/70 flex flex-col justify-between gap-3">
            <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {isEn ? 'Competitive Track' : 'Thi Đấu / HSG'}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {isEn ? 'VNOI Competitive Roadmap' : 'Lộ trình VNOI Thi đấu & HSG'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {isEn
                  ? `${CS_LESSONS.length} structured algorithm lessons from Complexity, DP, Graphs to HSG problem solving.`
                  : `${CS_LESSONS.length} bài giảng thuật toán có trình chấm tự động từ cơ bản đến Quy hoạch động & Đồ thị.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenSavedLesson('cs', undefined, 'vnoi')}
              className="cs-deck-btn w-full py-2 px-3 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{isEn ? 'Open VNOI' : 'Mở lộ trình'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Specialized International/Career C++ Tracks */}
          {CS_SPECIALIZED_TRACKS.map((track, tIdx) => {
            const doneCount = track.stages.filter((s) => completedCsStageIds.includes(s.id)).length;
            const totalCount = track.stages.length;
            const pct = Math.round((doneCount / Math.max(1, totalCount)) * 100);
            return (
              <div
                key={track.id}
                style={{ animationDelay: `${(tIdx + 1) * 45}ms` }}
                className="rm-card-interactive roadmap-card-enter relative overflow-hidden p-4 rounded-md bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/70 flex flex-col justify-between gap-3"
              >
                <span aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 to-emerald-500" />
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold font-mono text-sky-600 dark:text-sky-400 truncate">
                      {isEn ? track.categoryLabelEn : track.categoryLabel}
                    </span>
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                      {doneCount}/{totalCount}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {track.shortName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {isEn ? track.summaryEn : track.summary}
                  </p>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 roadmap-shimmer-bar transition-all duration-300"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSavedLesson('cs', undefined, track.id)}
                  className="cs-deck-btn w-full py-2 px-3 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-xs font-bold flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                >
                  <span>{isEn ? 'Open Track' : 'Mở lộ trình'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE SUBJECT ROADMAP TREE + INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Connected Nodes Timeline */}
        <div className="rm-arch-frame lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500 icon-anim-list" />
              <span>{isEn ? '02. Curriculum Skill Tree' : '02. Sơ Đồ Tuyến Kiến Thức Tiên Quyết'}</span>
            </h2>

            {/* Segmented Subject Filter */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm">
              {[
                { id: 'all' as const, label: isEn ? 'All' : 'Tất cả' },
                { id: 'math' as const, label: isEn ? 'Math' : 'Toán' },
                { id: 'physics' as const, label: isEn ? 'Physics' : 'Lí' },
                { id: 'cs' as const, label: isEn ? 'CS' : 'Tin' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSubjectFilter(tab.id);
                    setGradeFilter('all');
                  }}
                  className={`px-3 py-1 rounded-sm text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    subjectFilter === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search + Grade + Readiness Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Filter topics...' : 'Tìm nhanh chuyên đề...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="all">{isEn ? 'All Grades / Levels' : 'Tất cả Khối lớp / Cấp độ'}</option>
              {uniqueGrades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={readinessFilter}
              onChange={(e) => setReadinessFilter(e.target.value as ReadinessFilter)}
              className="px-2.5 py-1.5 rounded-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="all">{isEn ? 'All Statuses' : 'Mọi trạng thái'}</option>
              <option value="ready">{isEn ? 'Ready to Learn' : 'Sẵn sàng học'}</option>
              <option value="completed">{isEn ? 'Mastered' : 'Đã thông thạo'}</option>
              <option value="locked">{isEn ? 'Needs Prereq' : 'Cần học chặng trước'}</option>
            </select>
          </div>

          {/* Connected Vertical Flow Nodes with Animated SVG Energy Rail */}
          <div className="relative pl-6 space-y-3">
            <svg
              className="absolute left-[11px] top-4 bottom-4 w-2 h-[calc(100%-2rem)] pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 8 100"
              aria-hidden="true"
            >
              <line
                x1="4"
                y1="0"
                x2="4"
                y2="100"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-200 dark:text-slate-800"
              />
              <line
                x1="4"
                y1="0"
                x2="4"
                y2="100"
                stroke="#6366f1"
                strokeWidth="2.5"
                className="roadmap-connector-flow opacity-75"
              />
            </svg>

            {filteredNodes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'No milestones match the current filters.'
                  : 'Không có chặng nào khớp với bộ lọc hiện tại.'}
              </div>
            ) : (
              filteredNodes.map((node, idx) => {
                const isCompleted = completedNodeIds.includes(node.id);
                const isSelected = activeNode.id === node.id;
                const prereqMet = node.prerequisites.every((p) => completedNodeIds.includes(p));
                const hasNote = Boolean(nodeNotes[node.id]?.trim());

                return (
                  <div
                    key={node.id}
                    style={{ animationDelay: `${Math.min(idx, 10) * 35}ms` }}
                    className="relative roadmap-card-enter"
                  >
                    {/* Crisp 4px Architectural Square Node */}
                    <button
                      onClick={() => toggleNodeComplete(node)}
                      title={isCompleted ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã thông thạo (+30 XP)'}
                      className={`rm-square-node absolute -left-6 top-4 w-6 h-6 flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white roadmap-node-aura'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 hover:border-indigo-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-1.5 h-1.5 bg-current rounded-[1px]" />}
                    </button>

                    {/* Node Card */}
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`rm-card-interactive ml-3 p-4 rounded-md border cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/75 dark:bg-indigo-950/35 border-indigo-500 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-indigo-400/70'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <div className="flex items-center gap-1.5">
                          {getSubjectIcon(node.subject)}
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {getSubjectName(node.subject)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{node.grade}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-mono">{node.estimatedMinutes}p</span>
                          {hasNote && (
                            <>
                              <span aria-hidden="true">·</span>
                              <StickyNote className="w-3 h-3 text-amber-500" />
                            </>
                          )}
                        </div>
                        <span
                          className={`font-semibold font-mono text-[11px] ${
                            isCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : prereqMet
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {isCompleted
                            ? isEn
                              ? 'Mastered'
                              : 'Đã thông thạo'
                            : prereqMet
                            ? isEn
                              ? 'Ready'
                              : 'Sẵn sàng học'
                            : isEn
                            ? 'Needs prereq'
                            : 'Nên học chặng trước'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {isEn ? node.titleEn : node.title}
                      </h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Step Execution Inspector */}
        <div className="lg:col-span-5">
          <div
            key={activeNode.id}
            className="rm-arch-frame roadmap-card-enter sticky top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 sm:p-6 shadow-xs space-y-5"
          >
            <span aria-hidden="true" className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-indigo-500/60" />
            <span aria-hidden="true" className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-indigo-500/60" />
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                {getSubjectIcon(activeNode.subject)}
                <span className="font-semibold">{getSubjectName(activeNode.subject)}</span>
                <span aria-hidden="true">·</span>
                <span>{activeNode.grade}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums font-mono">
                  <Clock className="w-3 h-3" /> {activeNode.estimatedMinutes} {isEn ? 'min' : 'phút'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                {isEn ? activeNode.titleEn : activeNode.title}
              </h3>
              <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <FormattedText text={isEn ? activeNode.goalEn : activeNode.goal} />
              </div>
            </div>

            {/* Prerequisites */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isEn ? 'Prerequisite Steps:' : 'Kiến thức tiên quyết cần có:'}
              </div>
              {activeNode.prerequisites.length === 0 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  {isEn ? 'Entry point — no prerequisites required.' : 'Điểm khởi đầu — có thể bắt đầu học ngay.'}
                </p>
              ) : (
                <div className="space-y-1">
                  {activeNode.prerequisites.map((preId) => {
                    const preNode = ROADMAP_NODES.find((n) => n.id === preId);
                    if (!preNode) return null;
                    const done = completedNodeIds.includes(preId);
                    return (
                      <button
                        key={preId}
                        onClick={() => setSelectedNodeId(preId)}
                        className="w-full text-left flex items-center justify-between text-xs p-2 rounded-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 cursor-pointer"
                      >
                        <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                          {isEn ? preNode.titleEn : preNode.title}
                        </span>
                        <span className={done ? 'text-emerald-600 font-semibold shrink-0 ml-2' : 'text-amber-600 font-semibold shrink-0 ml-2'}>
                          {done ? (isEn ? '✓ Done' : '✓ Xong') : (isEn ? 'Pending' : 'Chưa xong')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Procedural Study Tips */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isEn ? 'How to Practice on Synapse:' : 'Cách thực hành đúng qui trình:'}</span>
              </div>
              {activeNode.workflowTips.map((tip, i) => (
                <div key={i} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <FormattedText text={tip} />
                </div>
              ))}
            </div>

            {/* Self-check Questions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEn ? 'Self-Check Questions Before Advancing:' : 'Tự kiểm tra trước khi qua chặng mới:'}</span>
              </div>
              <ul className="space-y-1.5">
                {activeNode.checkQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-sm border border-slate-200 dark:border-slate-800">
                    <FormattedText text={q} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Personal Study Notes per Milestone */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEn ? 'Personal Note for This Milestone:' : 'Ghi chú cá nhân cho chặng này:'}</span>
              </label>
              <textarea
                rows={2}
                value={nodeNotes[activeNode.id] || ''}
                onChange={(e) =>
                  setNodeNotes((prev) => ({
                    ...prev,
                    [activeNode.id]: e.target.value
                  }))
                }
                placeholder={
                  isEn
                    ? 'Note tricky formulas, mistakes, or exam dates...'
                    : 'Ghi lại công thức hay nhầm, lỗi sai vừa gặp hoặc lịch ôn lại...'
                }
                className="w-full p-2.5 rounded-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenSavedLesson(activeNode.subject, activeNode.targetLessonId)}
                  className="cs-deck-btn px-4 py-2.5 rounded-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open Target Lesson' : 'Vào Đúng Bài Giảng'}</span>
                </button>

                <button
                  onClick={() =>
                    onOpenTutor({
                      subject: activeNode.subject,
                      topicTitle: activeNode.title,
                      grade: activeNode.grade,
                      problemStatement: `Mục tiêu chặng học: ${activeNode.goal}\nCâu hỏi tự kiểm tra: ${activeNode.checkQuestions.join(' | ')}`
                    })
                  }
                  className="cs-deck-btn px-4 py-2.5 rounded-sm bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Ask Syn AI' : 'Hỏi Syn AI'}</span>
                </button>
              </div>

              <button
                onClick={() => toggleNodeComplete(activeNode)}
                className={`cs-deck-btn w-full py-2.5 px-4 rounded-sm text-xs font-bold flex items-center justify-center gap-2 transition-colors border cursor-pointer ${
                  completedNodeIds.includes(activeNode.id)
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedNodeIds.includes(activeNode.id)
                    ? isEn
                      ? 'Completed (Click to unmark)'
                      : 'Đã hoàn thành chặng này (Bấm để bỏ đánh dấu)'
                    : isEn
                    ? 'Mark as Mastered (+30 XP)'
                    : 'Đánh dấu đã thông thạo (+30 XP)'}
                </span>
              </button>
            </div>

            {!user && (
              <p className="text-[11px] text-slate-400 text-center">
                {isEn
                  ? 'Progress & notes saved locally. Sign in to sync across devices.'
                  : 'Tiến độ & ghi chú đang lưu trên trình duyệt. Đăng nhập để đồng bộ lên đám mây.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Arena CTA */}
      <div className="rm-arch-frame roadmap-beam-sweep bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-sm bg-amber-50 dark:bg-amber-950/50 border border-amber-300/70 dark:border-amber-700 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 icon-anim-trophy" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isEn ? 'Step 05: Ready to Test Your Skills in the Weekly Arena?' : 'Bước 05: Sẵn sàng thi đấu Trắc nghiệm / Tự luận hôm nay?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? '1 official match per subject per day · Live weekly ranking by subject & overall average.'
                : 'Mỗi ngày 1 lượt/môn · Tính điểm xếp hạng tuần theo từng môn và điểm trung bình chung.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateSubject('arena')}
          className="cs-deck-btn relative z-10 px-4 py-2.5 rounded-sm bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>{isEn ? 'Enter Weekly Arena' : 'Vào Đấu Trường Tuần'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
