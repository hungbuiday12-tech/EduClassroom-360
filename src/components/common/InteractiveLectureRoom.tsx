import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Calculator,
  Sparkles,
  List,
  Layers,
  Copy,
  Check,
  Code2,
  Compass
} from 'lucide-react';
import { LectureStep } from '../../types';
import { FormattedText, MathFormula } from './MathRenderer';
import { MonokaiCodeBlock } from '../cs/SublimeEditor';

export interface LectureActionItem {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber';
  icon?: React.ReactNode;
}

interface InteractiveLectureRoomProps {
  lessonKey: string;
  subjectAccent: 'indigo' | 'blue' | 'emerald' | 'amber';
  kicker: string;
  title: string;
  subtitle?: string;
  steps: LectureStep[];
  keyFormulas?: string[];
  mnemonics?: string[];
  commonTraps?: string[];
  actions?: LectureActionItem[];
}

const STEP_TYPE_LABEL: Record<NonNullable<LectureStep['stepType']>, string> = {
  intuition: 'Đặt vấn đề & Tư duy trực quan',
  concept: 'Giảng giải bản chất kiến thức',
  derivation: 'Chứng minh & Thiết lập công thức',
  example: 'Ví dụ mẫu giải chi tiết từng bước',
  pitfall: 'Lưu ý thực chiến & Lỗi sai cần tránh',
  experiment: 'Hướng dẫn thí nghiệm & Kiểm chứng'
};

export const InteractiveLectureRoom: React.FC<InteractiveLectureRoomProps> = ({
  lessonKey,
  subjectAccent,
  kicker,
  title,
  subtitle,
  steps,
  keyFormulas = [],
  mnemonics = [],
  commonTraps = [],
  actions = []
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [viewLayout, setViewLayout] = useState<'slides' | 'full'>('slides');
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal');
  const [revealedStepsMap, setRevealedStepsMap] = useState<Record<number, number>>({});
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStepIdx(0);
    setVisitedSteps([0]);
    setRevealedStepsMap({});
  }, [lessonKey]);

  const safeSteps = steps.length > 0 ? steps : [];
  const activeStep = safeSteps[currentStepIdx] || safeSteps[0];

  const handleSelectStep = (idx: number) => {
    setCurrentStepIdx(idx);
    setVisitedSteps((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  const handleCopyFormula = (f: string) => {
    try {
      navigator.clipboard.writeText(f);
      setCopiedFormula(f);
      setTimeout(() => setCopiedFormula(null), 1600);
    } catch {
      // ignore clipboard errors
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
    const totalExampleSteps = step.workedExample?.steps.length || 0;
    const revealedCount = revealedStepsMap[idx] ?? totalExampleSteps;

    return (
      <div className="space-y-5">
        {/* Step Heading */}
        <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className={`font-bold ${accentTextClass} tabular-nums`}>
              Phần {idx + 1} / {safeSteps.length}
            </span>
            {step.stepType && (
              <>
                <span aria-hidden="true">·</span>
                <span>{STEP_TYPE_LABEL[step.stepType]}</span>
              </>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {step.stepTitle}
          </h3>
        </div>

        {/* Detailed Teacher Explanation */}
        <div
          className={`space-y-3 leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line ${
            fontScale === 'large' ? 'text-[15px] sm:text-base' : 'text-sm'
          }`}
        >
          <FormattedText text={step.teacherExplanation} />
        </div>

        {/* Formula Highlight Box */}
        {step.formulaHighlight && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calculator className={`w-3.5 h-3.5 ${accentTextClass}`} />
                Công thức / Hệ thức trọng tâm cần khắc sâu
              </span>
              <button
                onClick={() => handleCopyFormula(step.formulaHighlight!)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
              >
                {copiedFormula === step.formulaHighlight ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Chép LaTeX</span>
                  </>
                )}
              </button>
            </div>
            <div className="py-2 text-center overflow-x-auto text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              <MathFormula formula={step.formulaHighlight} displayMode />
            </div>
          </div>
        )}

        {/* Optional Code Snippet (for CS VNOI Roadmap) */}
        {step.codeSnippet && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cài đặt minh họa: {step.codeSnippet.title}</span>
            </div>
            <MonokaiCodeBlock
              code={step.codeSnippet.code}
              language={step.codeSnippet.language}
              title={step.codeSnippet.language === 'cpp' ? 'lesson_demo.cpp' : 'lesson_demo.py'}
              maxHeightClass="max-h-[340px]"
            />
          </div>
        )}

        {/* Worked Example Walkthrough */}
        {step.workedExample && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Compass className={`w-4 h-4 ${accentTextClass}`} />
                <span>Ví dụ giảng giải trực tiếp trên lớp</span>
              </div>

              {totalExampleSteps > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setRevealedStepsMap((prev) => ({
                        ...prev,
                        [idx]: revealedCount < totalExampleSteps ? revealedCount + 1 : 1
                      }))
                    }
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                  >
                    {revealedCount < totalExampleSteps
                      ? `Hiện bước tiếp (${revealedCount}/${totalExampleSteps})`
                      : 'Thu về Bước 1 (Tự nhẩm lại)'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              <FormattedText text={step.workedExample.problem} />
            </div>

            <div className="space-y-2">
              {step.workedExample.steps.slice(0, revealedCount).map((sText, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
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

        {/* Key Takeaway */}
        {step.keyTakeaway && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-900/50 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Ghi nhớ cốt lõi: </span>
              <FormattedText text={step.keyTakeaway} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Teaching Toolbar Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1 min-w-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{kicker}</div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
            {title}
          </h2>
          {subtitle && (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <FormattedText text={subtitle} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Font Scale Switch */}
          <button
            onClick={() => setFontScale((prev) => (prev === 'normal' ? 'large' : 'normal'))}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            title="Thay đổi kích thước chữ bài giảng"
          >
            {fontScale === 'normal' ? 'A+ Chữ lớn' : 'A- Chữ vừa'}
          </button>

          {/* View Layout Switch: Interactive Slides vs Full Page */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewLayout('slides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                viewLayout === 'slides'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Giảng từng phần</span>
            </button>
            <button
              onClick={() => setViewLayout('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                viewLayout === 'full'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Xem trọn bài ({safeSteps.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Teaching Stage */}
      {viewLayout === 'slides' && activeStep ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Syllabus Outline (3 cols) */}
          <div className="lg:col-span-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className={`w-4 h-4 ${accentTextClass}`} />
                Mục lục buổi giảng
              </span>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                {visitedSteps.length}/{safeSteps.length} phần
              </span>
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

            <div className="space-y-1.5">
              {safeSteps.map((st, idx) => {
                const isActive = idx === currentStepIdx;
                const isDone = visitedSteps.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectStep(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-white/20 dark:bg-slate-900/15'
                          : isDone
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isDone && !isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold leading-snug">{st.stepTitle}</div>
                      {st.stepType && (
                        <div
                          className={`text-[11px] mt-0.5 truncate ${
                            isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {STEP_TYPE_LABEL[st.stepType]}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Key Formulas Quick Reference */}
            {keyFormulas.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Công thức tra nhanh
                </div>
                <div className="space-y-1.5">
                  {keyFormulas.map((kf, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-xs overflow-x-auto"
                    >
                      <MathFormula formula={kf} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Active Lecture Board (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xs">
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã hoàn thành bài giảng lý thuyết
                  </span>
                )}
              </div>
            </div>

            {/* Mnemonics & Pitfalls Summary Cards on Final Slide or Full View */}
            {currentStepIdx === safeSteps.length - 1 && (mnemonics.length > 0 || commonTraps.length > 0) && (
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
                          <div><FormattedText text={m} /></div>
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
                          <div><FormattedText text={trap} /></div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Next Step Action Bar (Simulations / Judge / Practice) */}
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
