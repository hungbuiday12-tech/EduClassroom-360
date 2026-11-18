import React, { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PenTool,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target,
  XCircle
} from 'lucide-react';
import {
  CustomMockQuestionItem,
  CustomMockTestResult,
  GrowthSubject
} from '../../types';
import { MATH_LECTURES } from '../../data/curriculumData';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { CS_LESSONS } from '../../data/csLessonsData';
import { useAuth } from '../../context/AuthContext';
import { loadAllLessonAssessments } from '../../lib/lessonProgressStore';
import {
  getErrorNotebook,
  progressDailyQuest,
  recordGrowthStat,
  recordMistake
} from '../../lib/learningGrowthStore';
import { saveCustomMockResult } from '../../lib/customLessonsStore';
import { FormattedText } from '../common/MathRenderer';
import { InteractiveScratchpad } from '../common/InteractiveScratchpad';
import { CognitiveRadarPanel, QuestionTelemetry } from './CognitiveRadarPanel';

interface CustomMockTestBuilderProps {
  onEarnXP?: (xp: number) => void;
}

export const CustomMockTestBuilder: React.FC<CustomMockTestBuilderProps> = ({ onEarnXP }) => {
  const { user, firebaseUser } = useAuth();
  const uid = user?.uid || firebaseUser?.uid;

  const [selectedSubjects, setSelectedSubjects] = useState<GrowthSubject[]>(['math', 'physics']);
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [prioritizeWeak, setPrioritizeWeak] = useState<boolean>(true);
  const [strictFocusMode, setStrictFocusMode] = useState<boolean>(true);

  const [activeQuestions, setActiveQuestions] = useState<CustomMockQuestionItem[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);
  const [tabWarnings, setTabWarnings] = useState<number>(0);
  const [submittedResult, setSubmittedResult] = useState<CustomMockTestResult | null>(null);
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<Record<string, QuestionTelemetry>>({});
  const lastActionTsRef = React.useRef<number>(Date.now());

  // Gather weak keywords from Error Notebook & Lesson Assessments
  const weakHints = useMemo(() => {
    const assessments = loadAllLessonAssessments(uid);
    const errors = getErrorNotebook(uid).filter((e) => !e.resolved);
    const keywords = new Set<string>();
    for (const a of assessments) {
      if ((a.analysis?.overallMastery ?? 100) < 75) {
        keywords.add(a.lessonTitle.toLowerCase());
      }
    }
    for (const err of errors) {
      keywords.add(err.lessonTitle.toLowerCase());
    }
    return Array.from(keywords);
  }, [uid, activeQuestions]);

  // Countdown + Tab switch detector while mock test is running
  useEffect(() => {
    if (!activeQuestions || submittedResult) return;
    const timer = window.setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          handleGradeTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeQuestions, submittedResult]);

  useEffect(() => {
    if (!activeQuestions || submittedResult || !strictFocusMode) return;
    const onVis = () => {
      if (document.hidden) {
        setTabWarnings((w) => w + 1);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [activeQuestions, submittedResult, strictFocusMode]);

  const toggleSubject = (s: GrowthSubject) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(s)) {
        return prev.length > 1 ? prev.filter((x) => x !== s) : prev;
      }
      return [...prev, s];
    });
  };

  const buildQuestionPool = (): CustomMockQuestionItem[] => {
    const pool: CustomMockQuestionItem[] = [];
    const matchesWeak = (title: string) =>
      weakHints.some((kw) => title.toLowerCase().includes(kw.slice(0, 12)));

    if (selectedSubjects.includes('math')) {
      for (const lec of MATH_LECTURES) {
        const isWeak = matchesWeak(lec.title);
        (lec.sampleProblems || []).forEach((q, idx) => {
          pool.push({
            id: `m-${lec.id}-sp-${idx}`,
            subject: 'math',
            topic: lec.title,
            grade: lec.grade || 'Toán THPT',
            isWeakTopic: isWeak,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation
          });
        });
        (lec.lectureSteps || []).forEach((st, sIdx) => {
          (st.miniQuiz || []).forEach((q, qIdx) => {
            pool.push({
              id: `m-${lec.id}-st-${sIdx}-${qIdx}`,
              subject: 'math',
              topic: lec.title,
              grade: lec.grade || 'Toán THPT',
              isWeakTopic: isWeak,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation
            });
          });
        });
      }
    }

    if (selectedSubjects.includes('physics')) {
      for (const lec of PHYSICS_LESSONS) {
        const isWeak = matchesWeak(lec.title);
        (lec.practiceExercises || []).forEach((q, idx) => {
          pool.push({
            id: `p-${lec.id}-pe-${idx}`,
            subject: 'physics',
            topic: lec.title,
            grade: lec.grade || 'Vật lí',
            isWeakTopic: isWeak,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation
          });
        });
        (lec.lectureSteps || []).forEach((st, sIdx) => {
          (st.miniQuiz || []).forEach((q, qIdx) => {
            pool.push({
              id: `p-${lec.id}-st-${sIdx}-${qIdx}`,
              subject: 'physics',
              topic: lec.title,
              grade: lec.grade || 'Vật lí',
              isWeakTopic: isWeak,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation
            });
          });
        });
      }
    }

    if (selectedSubjects.includes('cs')) {
      for (const lec of CS_LESSONS) {
        const isWeak = matchesWeak(lec.title);
        (lec.lectureSteps || []).forEach((st, sIdx) => {
          (st.miniQuiz || []).forEach((q, qIdx) => {
            pool.push({
              id: `c-${lec.id}-st-${sIdx}-${qIdx}`,
              subject: 'cs',
              topic: lec.title,
              grade: lec.level,
              isWeakTopic: isWeak,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation
            });
          });
        });
      }
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    if (prioritizeWeak) {
      shuffled.sort((a, b) => Number(b.isWeakTopic) - Number(a.isWeakTopic));
    }
    return shuffled.slice(0, Math.min(questionCount, shuffled.length));
  };

  const handleStartTest = () => {
    const picked = buildQuestionPool();
    if (picked.length === 0) return;
    setActiveQuestions(picked);
    setAnswers({});
    setTelemetry({});
    lastActionTsRef.current = Date.now();
    setTimeLeftSec(durationMinutes * 60);
    setTabWarnings(0);
    setSubmittedResult(null);
  };

  const handlePickOption = (questionId: string, optIdx: number) => {
    const now = Date.now();
    const deltaMs = Math.min(180000, Math.max(400, now - lastActionTsRef.current));
    lastActionTsRef.current = now;
    const prevChosen = answers[questionId];
    setTelemetry((prev) => {
      const cur = prev[questionId];
      const isSwitch = prevChosen !== undefined && prevChosen !== optIdx;
      return {
        ...prev,
        [questionId]: {
          questionId,
          switches: (cur?.switches ?? 0) + (isSwitch ? 1 : 0),
          firstPickIndex: cur?.firstPickIndex ?? optIdx,
          lastPickAtMs: now,
          totalHesitationMs: (cur?.totalHesitationMs ?? 0) + deltaMs
        }
      };
    });
    setAnswers((prev) => ({ ...prev, [questionId]: optIdx }));
  };

  const handleGradeTest = () => {
    if (!activeQuestions || submittedResult) return;
    let correct = 0;
    const topicMap = new Map<string, { correct: number; total: number }>();

    activeQuestions.forEach((q) => {
      const pickedIdx = answers[q.id];
      const isOk = pickedIdx === q.correctIndex;
      if (isOk) correct += 1;
      else {
        recordMistake(
          {
            subject: q.subject,
            sourceType: 'mock_test',
            lessonTitle: q.topic,
            prompt: q.question,
            userAnswer: pickedIdx !== undefined ? q.options[pickedIdx] || 'Chưa chọn' : 'Bỏ trống',
            correctAnswer: q.options[q.correctIndex] || '',
            explanation: q.explanation
          },
          uid
        );
      }
      const prev = topicMap.get(q.topic) || { correct: 0, total: 0 };
      topicMap.set(q.topic, {
        correct: prev.correct + (isOk ? 1 : 0),
        total: prev.total + 1
      });
    });

    const total = activeQuestions.length;
    const score10 = Math.round(((correct / Math.max(1, total)) * 10) * 10) / 10;
    const result: CustomMockTestResult = {
      id: `mock_${Date.now()}`,
      title: `Đề Kiểm Tra ${selectedSubjects.map((s) => (s === 'math' ? 'Toán' : s === 'physics' ? 'Lí' : 'Tin')).join(' + ')}`,
      subjects: selectedSubjects,
      score10,
      correctCount: correct,
      totalCount: total,
      durationUsedSec: Math.max(1, durationMinutes * 60 - timeLeftSec),
      tabSwitchWarnings: tabWarnings,
      topicBreakdown: Array.from(topicMap.entries()).map(([topic, val]) => ({
        topic,
        correct: val.correct,
        total: val.total
      })),
      completedAt: new Date().toISOString()
    };

    setSubmittedResult(result);
    saveCustomMockResult(result, uid);
    recordGrowthStat('mockTestsCompleted', 1, uid);
    progressDailyQuest('practice_quiz_or_code', correct, uid);
    const earned = Math.max(15, correct * 12);
    onEarnXP?.(earned);
    if (score10 >= 7) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
    }
  };

  const fmtTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (activeQuestions) {
    return (
      <div className="sci-frame syn-top-laser bg-white/95 dark:bg-slate-900/95 border border-sky-300 dark:border-sky-800 rounded-md p-5 space-y-5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Đề Kiểm Tra Cá Nhân Hóa ({activeQuestions.length} câu)
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 text-blue-600 dark:text-sky-400 font-bold">
                <Clock className="w-3.5 h-3.5" /> {fmtTime(timeLeftSec)}
              </span>
              {strictFocusMode && (
                <span
                  className={`flex items-center gap-1 font-bold ${
                    tabWarnings > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Rời tab: {tabWarnings} lần
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowScratchpad(true)}
              className="px-3 py-1.5 rounded border border-sky-400/60 bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Bảng Nháp Vẽ Tay</span>
            </button>
            {!submittedResult ? (
              <button
                type="button"
                onClick={handleGradeTest}
                className="cs-deck-btn px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                Nộp bài & Chấm điểm
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveQuestions(null)}
                className="px-3 py-1.5 rounded bg-slate-200 dark:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tạo đề khác</span>
              </button>
            )}
          </div>
        </div>

        {submittedResult && (
          <div className="p-4 rounded border border-emerald-400 bg-emerald-50/75 dark:bg-emerald-950/35 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-base font-display font-extrabold text-emerald-800 dark:text-emerald-200">
                Điểm số: {submittedResult.score10.toFixed(1)} / 10 ({submittedResult.correctCount}/{submittedResult.totalCount} câu đúng)
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                Các câu làm sai đã tự động đưa vào Sổ tay Lỗi sai & Thẻ SM-2
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {submittedResult.topicBreakdown.map((tb) => (
                <div key={tb.topic} className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between gap-2">
                  <span className="truncate font-medium">{tb.topic}</span>
                  <span className="font-mono font-bold shrink-0">{tb.correct}/{tb.total}</span>
                </div>
              ))}
            </div>
            <CognitiveRadarPanel
              questions={activeQuestions}
              answers={answers}
              telemetry={telemetry}
              totalDurationSec={submittedResult.durationUsedSec}
            />
          </div>
        )}

        <div className="space-y-4">
          {activeQuestions.map((q, idx) => {
            const chosen = answers[q.id];
            const isGraded = Boolean(submittedResult);
            return (
              <div
                key={q.id}
                className="p-4 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="font-bold text-blue-700 dark:text-sky-400">
                    Câu {idx + 1} · {q.subject === 'math' ? 'Toán' : q.subject === 'physics' ? 'Vật lí' : 'Tin'} · {q.topic}
                  </span>
                  {q.isWeakTopic && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                      Ưu tiên ôn điểm yếu
                    </span>
                  )}
                </div>

                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  <FormattedText text={q.question} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const selected = chosen === optIdx;
                    const isRightOpt = optIdx === q.correctIndex;
                    let cls =
                      'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-400';
                    if (isGraded) {
                      if (isRightOpt) cls = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      else if (selected) cls = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                    } else if (selected) {
                      cls = 'bg-blue-600 border-blue-500 text-white font-bold';
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isGraded}
                        onClick={() => handlePickOption(q.id, optIdx)}
                        className={`p-2.5 rounded border text-left text-xs flex items-start gap-2 cursor-pointer transition-colors ${cls}`}
                      >
                        <span className="font-mono font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1"><FormattedText text={opt} /></span>
                        {isGraded && isRightOpt && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {isGraded && selected && !isRightOpt && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {isGraded && q.explanation && (
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-sky-600">Lời giải: </strong>
                    <FormattedText text={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <InteractiveScratchpad
          isOpen={showScratchpad}
          onClose={() => setShowScratchpad(false)}
          defaultSubject={selectedSubjects[0] || 'math'}
          contextTitle="Bảng nháp Đề Kiểm Tra Cá Nhân Hóa"
        />
      </div>
    );
  }

  return (
    <div className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-indigo-300/80 dark:border-indigo-700/60 rounded-md p-5 space-y-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
            <Target className="w-3.5 h-3.5" />
            <span>Trình Tạo Đề Kiểm Tra Cá Nhân Hóa Theo Điểm Yếu</span>
          </div>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
            Tạo Đề Thi Thử Riêng Trong 3 Giây
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Tự động lọc câu hỏi ưu tiên các chuyên đề yếu từ Bản đồ Tri thức & Sổ tay Lỗi sai, có bấm giờ & chống chuyển tab.
          </p>
        </div>
        {weakHints.length > 0 && (
          <div className="px-2.5 py-1.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Phát hiện {weakHints.length} chuyên đề cần củng cố</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Chọn môn thi</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'math' as GrowthSubject, label: 'Toán' },
              { id: 'physics' as GrowthSubject, label: 'Vật lí' },
              { id: 'cs' as GrowthSubject, label: 'Tin học' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSubject(s.id)}
                className={`px-3 py-1.5 rounded text-xs font-bold border cursor-pointer ${
                  selectedSubjects.includes(s.id)
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Số câu</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
            >
              <option value={5}>5 câu nhanh</option>
              <option value={8}>8 câu chuẩn</option>
              <option value={12}>12 câu sâu</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Thời gian</label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
            >
              <option value={5}>5 phút</option>
              <option value={10}>10 phút</option>
              <option value={20}>20 phút</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartTest}
          className="cs-deck-btn w-full py-2.5 px-4 rounded bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Bắt đầu Làm Đề Cá Nhân Hóa</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={prioritizeWeak}
            onChange={(e) => setPrioritizeWeak(e.target.checked)}
            className="rounded border-slate-300 text-blue-600"
          />
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Ưu tiên câu thuộc chuyên đề yếu
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={strictFocusMode}
            onChange={(e) => setStrictFocusMode(e.target.checked)}
            className="rounded border-slate-300 text-blue-600"
          />
          <span>Chế độ phòng thi nghiêm ngặt (đếm số lần chuyển tab)</span>
        </label>
      </div>
    </div>
  );
};
