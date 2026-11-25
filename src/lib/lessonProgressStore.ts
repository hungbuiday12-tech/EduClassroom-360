import {
  LessonAssessmentRecord,
  LessonProgressAnalysis,
  LectureStep,
  LectureStepSavedResult
} from '../types';
import {
  db,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  handleFirestoreError,
  OperationType
} from './firebase';

export const LESSON_ASSESSMENTS_STORAGE_KEY = 'educlassroom_lesson_assessments_v1';
export const LESSON_ASSESSMENT_UPDATED_EVENT = 'educlassroom:lesson-assessment-updated';

function getUserScope(uid?: string | null): string {
  return uid && uid.trim() ? uid.trim() : 'guest';
}

function readAllLocalRecords(): Record<string, LessonAssessmentRecord> {
  try {
    const raw = localStorage.getItem(LESSON_ASSESSMENTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeAllLocalRecords(map: Record<string, LessonAssessmentRecord>) {
  try {
    localStorage.setItem(LESSON_ASSESSMENTS_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(LESSON_ASSESSMENT_UPDATED_EVENT));
  } catch {
    // ignore storage quota errors
  }
}

export function getScopedLessonStorageId(lessonKey: string, uid?: string | null): string {
  return `${getUserScope(uid)}::${lessonKey}`;
}

export function loadLessonAssessment(
  lessonKey: string,
  uid?: string | null
): LessonAssessmentRecord | null {
  const all = readAllLocalRecords();
  const scoped = all[getScopedLessonStorageId(lessonKey, uid)];
  if (scoped) return scoped;
  // Fallback to guest cache if user just logged in and hasn't saved under uid yet
  if (uid) {
    return all[getScopedLessonStorageId(lessonKey, null)] || null;
  }
  return null;
}

export function loadAllLessonAssessments(uid?: string | null): LessonAssessmentRecord[] {
  const all = readAllLocalRecords();
  const scopePrefix = `${getUserScope(uid)}::`;
  const guestPrefix = 'guest::';
  const byLesson = new Map<string, LessonAssessmentRecord>();

  // Load guest first, then override with user-scoped records
  for (const [k, rec] of Object.entries(all)) {
    if (k.startsWith(guestPrefix) && rec?.lessonKey) {
      byLesson.set(rec.lessonKey, rec);
    }
  }
  if (uid) {
    for (const [k, rec] of Object.entries(all)) {
      if (k.startsWith(scopePrefix) && rec?.lessonKey) {
        byLesson.set(rec.lessonKey, rec);
      }
    }
  }

  return Array.from(byLesson.values()).sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || '')
  );
}

export function computeAssessmentMetrics(
  record: LessonAssessmentRecord,
  steps: LectureStep[]
) {
  let mcqCorrect = 0;
  let mcqTotal = 0;
  let essayScoreSum = 0;
  let essayGradedCount = 0;
  let completedSteps = 0;
  const strongStepTitles: string[] = [];
  const weakStepTitles: string[] = [];

  steps.forEach((step, idx) => {
    const saved: LectureStepSavedResult | undefined = record.stepResults?.[idx];
    const effectiveQuiz = saved?.customQuiz?.miniQuiz || step.miniQuiz || [];
    let stepCorrect = 0;
    let stepChecked = 0;

    effectiveQuiz.forEach((q, qIdx) => {
      if (saved?.mcqChecked?.[qIdx]) {
        stepChecked += 1;
        mcqTotal += 1;
        if (saved.mcqAnswers?.[qIdx] === q.correctIndex) {
          stepCorrect += 1;
          mcqCorrect += 1;
        }
      }
    });

    const essayScore = saved?.essayEvaluation?.score;
    const hasEssay = typeof essayScore === 'number';
    if (hasEssay) {
      essayGradedCount += 1;
      essayScoreSum += essayScore;
    }

    if (stepChecked > 0 || hasEssay) {
      completedSteps += 1;
      const mcqRatio = stepChecked > 0 ? stepCorrect / stepChecked : 0;
      const essayRatio = hasEssay ? essayScore / 10 : mcqRatio;
      const combined = (mcqRatio + essayRatio) / 2;

      if (combined >= 0.75) {
        strongStepTitles.push(step.stepTitle.slice(0, 195));
      } else {
        weakStepTitles.push(step.stepTitle.slice(0, 195));
      }
    }
  });

  const essayAvgScore =
    essayGradedCount > 0 ? Math.round((essayScoreSum / essayGradedCount) * 10) / 10 : 0;

  const mcqPct = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 100 : 0;
  const essayPct = essayGradedCount > 0 ? essayAvgScore * 10 : mcqPct;
  const computedMastery =
    mcqTotal > 0 || essayGradedCount > 0
      ? Math.max(0, Math.min(100, Math.round(mcqPct * 0.55 + essayPct * 0.45)))
      : 0;

  const overallMastery =
    typeof record.analysis?.overallMastery === 'number'
      ? Math.max(0, Math.min(100, Math.round(record.analysis.overallMastery)))
      : computedMastery;

  return {
    completedSteps,
    mcqCorrect,
    mcqTotal,
    essayGradedCount,
    essayAvgScore,
    overallMastery,
    strongStepTitles: strongStepTitles.slice(0, 20),
    weakStepTitles: weakStepTitles.slice(0, 20)
  };
}

export async function saveLessonAssessment(
  record: LessonAssessmentRecord,
  steps: LectureStep[],
  options?: { uid?: string | null; firebaseUid?: string | null }
): Promise<void> {
  const all = readAllLocalRecords();
  const updatedRecord: LessonAssessmentRecord = {
    ...record,
    updatedAt: new Date().toISOString()
  };

  all[getScopedLessonStorageId(record.lessonKey, options?.uid)] = updatedRecord;
  writeAllLocalRecords(all);

  if (options?.firebaseUid) {
    const cleanKey = record.lessonKey.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const docId = `${options.firebaseUid}__${cleanKey}`.slice(0, 128);
    const metrics = computeAssessmentMetrics(updatedRecord, steps);
    const firstRec = updatedRecord.analysis?.recommendedRoadmap?.[0];
    const recommendedAction = firstRec
      ? `${firstRec.title}: ${firstRec.action}`.slice(0, 395)
      : '';

    const firestorePayload = {
      userId: options.firebaseUid,
      lessonKey: record.lessonKey.slice(0, 128),
      subject: record.subject,
      lessonTitle: record.lessonTitle.slice(0, 200),
      grade: (record.grade || '').slice(0, 64),
      totalSteps: Math.min(50, Math.max(0, steps.length)),
      completedSteps: Math.min(50, Math.max(0, metrics.completedSteps)),
      mcqCorrect: Math.min(200, Math.max(0, metrics.mcqCorrect)),
      mcqTotal: Math.min(200, Math.max(0, metrics.mcqTotal)),
      essayGradedCount: Math.min(50, Math.max(0, metrics.essayGradedCount)),
      essayAvgScore: Math.min(10, Math.max(0, metrics.essayAvgScore)),
      overallMastery: Math.min(100, Math.max(0, metrics.overallMastery)),
      strongStepTitles: metrics.strongStepTitles,
      weakStepTitles: metrics.weakStepTitles,
      readinessLevel: (updatedRecord.analysis?.readinessLevel || '').slice(0, 160),
      recommendedAction,
      updatedAt: updatedRecord.updatedAt.slice(0, 64)
    };

    const path = `lesson_assessments/${docId}`;
    try {
      await setDoc(doc(db, 'lesson_assessments', docId), firestorePayload, { merge: true });
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch {
        // Already logged cleanly by handleFirestoreError; localStorage persistence remains intact
      }
    }
  }
}

export interface CloudLessonAssessmentSummary {
  lessonKey: string;
  subject: 'math' | 'physics' | 'chemistry' | 'biology' | 'cs';
  lessonTitle: string;
  grade?: string;
  totalSteps: number;
  completedSteps: number;
  mcqCorrect: number;
  mcqTotal: number;
  essayGradedCount: number;
  essayAvgScore: number;
  overallMastery: number;
  strongStepTitles: string[];
  weakStepTitles: string[];
  readinessLevel?: string;
  recommendedAction?: string;
  updatedAt: string;
}

export async function fetchCloudLessonAssessments(
  firebaseUid: string
): Promise<CloudLessonAssessmentSummary[]> {
  const path = 'lesson_assessments';
  try {
    const q = query(collection(db, path), where('userId', '==', firebaseUid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as CloudLessonAssessmentSummary);
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {}
    return [];
  }
}
