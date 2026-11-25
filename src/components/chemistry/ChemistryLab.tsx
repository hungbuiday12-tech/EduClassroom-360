import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Box,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  StepForward,
  XCircle,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ChemistryLesson,
  CurriculumTrack,
  LectureStep,
  SpecializedTier
} from '../../types';
import { CHEMISTRY_LESSONS } from '../../data/chemistryLessonsData';
import {
  CHEMISTRY_2D_SIMS,
  CHEMISTRY_3D_SIMS
} from '../../data/chemistryDomainsData';
import { renderChemistry2DSim, ChemSimTelemetry } from './chemistry2DEngine';
import { Chemistry3DView } from './Chemistry3DView';
import { FormattedText, MathFormula } from '../common/MathRenderer';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { ViewportPortal } from '../common/ViewportPortal';
import { LabDataLoggerPanel } from '../common/LabDataLoggerPanel';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { SimAnalysisProBar } from '../common/SimAnalysisProBar';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';

interface DataLogEntry {
  id: number;
  timeStr: string;
  m1Label: string;
  m1Val: string;
  m2Label: string;
  m2Val: string;
  m3Label: string;
  m3Val: string;
}

export function buildChemistryLectureSteps(lesson: ChemistryLesson): LectureStep[] {
  const formula0 = lesson.keyFormulas[0] || '';
  const paramStr = Object.values(lesson.paramBounds)
    .map((b) => `${b.label} (${b.unit || 'val'})`)
    .join(', ');

  const sectionSteps: LectureStep[] = lesson.theorySections.map((sec, idx) => {
    const formula = lesson.keyFormulas[idx] || formula0;
    const secondary = lesson.keyFormulas.filter((f) => f !== formula).slice(0, 2);
    const mcq = lesson.practiceExercises[idx % Math.max(1, lesson.practiceExercises.length)];
    const essay = lesson.essayExercises[0];

    return {
      stepTitle: sec.heading,
      stepType: idx === 0 ? 'concept' : 'derivation',
      conceptSection: `${sec.content}\n\n• **Trọng tâm ${lesson.grade}**: ${lesson.subtitle}`,
      formulaSection: formula
        ? {
            primaryFormula: formula,
            secondaryFormulas: secondary,
            variablesNote: `Áp dụng cho chủ đề "${lesson.title}" (${lesson.stageLabel || lesson.grade}).`
          }
        : undefined,
      deepDiveSection: `${sec.content}\n\n**Phương pháp giải nhanh Hóa học ${lesson.grade}**:\n• Viết đúng phương trình hóa học hoặc bán phản ứng oxi hóa – khử và cân bằng hệ số.\n• Áp dụng định luật bảo toàn khối lượng, bảo toàn nguyên tố và bảo toàn electron trước khi lập hệ phương trình.`,
      teacherExplanation: sec.content,
      formulaHighlight: formula || undefined,
      workedExample:
        idx === lesson.theorySections.length - 1 && essay
          ? {
              problem: essay.question,
              steps: essay.solutionSteps,
              answer: essay.finalAnswer
            }
          : undefined,
      keyTakeaway: `Nắm chắc bản chất phản ứng và đơn vị chuẩn trong mục "${sec.heading}".`,
      miniQuiz: mcq
        ? [
            {
              id: `${lesson.id}-s${idx}-q1`,
              question: mcq.question,
              options: mcq.options,
              correctIndex: mcq.correctIndex,
              explanation: mcq.explanation
            }
          ]
        : [],
      miniEssay: essay
        ? {
            id: `${lesson.id}-s${idx}-e1`,
            question: essay.question,
            rubricChecklist: essay.solutionSteps.slice(0, 3),
            sampleAnswer: `${essay.solutionSteps.join('\n')} → ${essay.finalAnswer}`
          }
        : undefined
    };
  });

  sectionSteps.push({
    stepTitle: `${sectionSteps.length + 1}. Thực hành Kiểm chứng trên Phòng Lab 2D & Mô hình 3D`,
    stepType: 'experiment',
    conceptSection: `Chuyển sang tab Mô phỏng 2D hoặc Mô phỏng 3D để thay đổi trực tiếp: ${paramStr}.`,
    formulaSection: formula0
      ? {
          primaryFormula: formula0,
          secondaryFormulas: lesson.keyFormulas.slice(1, 3),
          variablesNote: `Các tham số điều chỉnh được: ${paramStr}.`
        }
      : undefined,
    deepDiveSection: `• Thay đổi từng thanh trượt và nhấn Ghi mẫu đo để lập bảng đối chiếu.\n• Sử dụng bộ công cụ Phân tích Pro (A/B Snapshot & Quét biến Sweep) ngay bên dưới mô phỏng.`,
    teacherExplanation: `Kiểm chứng trực quan định luật hóa học qua phòng thí nghiệm tương tác 2D/3D (${lesson.simulationType}).`,
    keyTakeaway: 'Ghi ít nhất 3 mẫu đo thực nghiệm để xác nhận xu hướng biến đổi.',
    miniQuiz: [],
    miniEssay: undefined
  });

  return sectionSteps;
}

export const ChemistryLab: React.FC<{ onScoreEarned?: (xp: number) => void; onBack?: () => void }> = ({
  onScoreEarned,
  onBack
}) => {
  const { language, translate } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate, goBack } = useNavigation();

  const activeView = location.chemistryView;
  const activeTab = location.chemistryTab;

  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>('khong_chuyen');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | SpecializedTier>('all');

  const isStandardTrack = selectedTrack === 'khong_chuyen' || selectedTrack === 'gdpt_2006';

  const filteredLessons = useMemo(() => {
    return CHEMISTRY_LESSONS.filter((l) => {
      if (l.track !== selectedTrack) return false;
      if (isStandardTrack) {
        return selectedGrade === 'all' || l.grade === selectedGrade;
      }
      return selectedTier === 'all' || l.tier === selectedTier;
    });
  }, [selectedTrack, selectedGrade, selectedTier, isStandardTrack]);

  const lesson = useMemo(() => {
    return (
      CHEMISTRY_LESSONS.find((l) => l.id === location.chemistryLessonId) ||
      filteredLessons[0] ||
      CHEMISTRY_LESSONS[0]
    );
  }, [location.chemistryLessonId, filteredLessons]);

  const currentIndex = filteredLessons.findIndex((l) => l.id === lesson.id);

  const active2DSpec = useMemo(
    () => CHEMISTRY_2D_SIMS.find((s) => s.id === lesson.simulationType) || CHEMISTRY_2D_SIMS[0],
    [lesson.simulationType]
  );

  // 2D simulation state
  const [params, setParams] = useState<Record<string, number>>(() => ({ ...active2DSpec.defaultParams }));
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [isSimFullscreen, setIsSimFullscreen] = useState(false);
  const [telemetry, setTelemetry] = useState<ChemSimTelemetry>({ metrics: [], statusNote: '' });
  const [dataLogs, setDataLogs] = useState<DataLogEntry[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const speedRef = useRef(simSpeed);
  speedRef.current = simSpeed;

  const recorder = useCanvasRecorder(() => canvasRef.current, `chem-2d-${active2DSpec.id}`);

  useEffect(() => {
    setParams({ ...active2DSpec.defaultParams });
    simTimeRef.current = 0;
    setDataLogs([]);
  }, [active2DSpec]);

  useEffect(() => {
    if (activeView !== 'lecture' || activeTab !== 'simulation') return;
    let raf = 0;
    let lastTs = performance.now();
    let frameCount = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (isRunningRef.current) {
        simTimeRef.current += dt * speedRef.current;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const isDark = document.documentElement.classList.contains('dark');
            const out = renderChemistry2DSim(
              ctx,
              rect.width,
              rect.height,
              active2DSpec.id,
              paramsRef.current,
              simTimeRef.current,
              isDark
            );
            ctx.restore();
            frameCount++;
            if (frameCount % 6 === 0) {
              setTelemetry(out);
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeView, activeTab, active2DSpec.id]);

  // Practice states
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [mcqChecked, setMcqChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setMcqAnswers({});
    setMcqChecked({});
  }, [lesson.id]);

  const lectureSteps = useMemo(() => buildChemistryLectureSteps(lesson), [lesson]);

  const handleOpenLesson = (target: ChemistryLesson, tab: 'theory' | 'simulation' | 'sim3d' | 'practice' = 'theory') => {
    navigate({
      subject: 'chemistry',
      chemistryView: 'lecture',
      chemistryLessonId: target.id,
      chemistryTab: tab
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogSample = () => {
    const m = telemetry.metrics;
    const entry: DataLogEntry = {
      id: Date.now(),
      timeStr: `${simTimeRef.current.toFixed(2)}s`,
      m1Label: m[0]?.label || 'M1',
      m1Val: m[0] ? `${m[0].value} ${m[0].unit || ''}`.trim() : '—',
      m2Label: m[1]?.label || 'M2',
      m2Val: m[1] ? `${m[1].value} ${m[1].unit || ''}`.trim() : '—',
      m3Label: m[2]?.label || 'M3',
      m3Val: m[2] ? `${m[2].value} ${m[2].unit || ''}`.trim() : '—'
    };
    setDataLogs((prev) => [entry, ...prev].slice(0, 20));
  };

  if (activeView === 'catalog') {
    return (
      <div className="space-y-6 pb-12">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={onBack || goBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Back' : 'Quay lại'}</span>
                </button>
                <span>KHTN &amp; Hóa học THPT · {CHEMISTRY_LESSONS.length} bài giảng chuẩn 2D/3D</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isEn ? 'Chemistry Lecture & Lab Classroom' : 'Khu Bài Giảng & Thí Nghiệm Hóa Học (Lớp 9 – 12)'}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => navigate({ subject: 'chemistry_sims' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{isEn ? 'Open Chemistry Lab & Sandbox Hub' : 'Mở Khu Lab, Mô phỏng & Sandbox Hóa'}</span>
            </button>
          </div>

          {/* 3 Track Cards: GDPT 2018, GDPT 2006, Khu Chuyên Hóa */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {(
              [
                {
                  id: 'khong_chuyen' as CurriculumTrack,
                  title: 'Khu GDPT 2018 (Lớp 9 – 12)',
                  sub: `KHTN 9 & Hóa 10–12 + Chuyên đề (${CHEMISTRY_LESSONS.filter((l) => l.track === 'khong_chuyen').length} bài)`,
                  activeCls: 'bg-sky-600 text-white border-sky-600'
                },
                {
                  id: 'gdpt_2006' as CurriculumTrack,
                  title: 'Khu Chương trình GDPT 2006',
                  sub: `Hóa học 9–12 SGK 2006 (${CHEMISTRY_LESSONS.filter((l) => l.track === 'gdpt_2006').length} bài)`,
                  activeCls: 'bg-emerald-600 text-white border-emerald-600'
                },
                {
                  id: 'chuyen' as CurriculumTrack,
                  title: 'Khu Chuyên Hóa & HSG / IChO',
                  sub: `Cơ bản → Nâng cao → Chuyên sâu (${CHEMISTRY_LESSONS.filter((l) => l.track === 'chuyen').length} chuyên đề)`,
                  activeCls: 'bg-amber-500 text-slate-950 border-amber-500'
                }
              ]
            ).map((tr) => {
              const active = selectedTrack === tr.id;
              return (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => setSelectedTrack(tr.id)}
                  className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? tr.activeCls
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-sm font-extrabold">{tr.title}</div>
                  <div className={`text-xs mt-1 ${active ? 'opacity-90' : 'text-slate-500 dark:text-slate-400'}`}>
                    {tr.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub-filter */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            {isStandardTrack ? (
              (['all', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'] as const).map((grade) => {
                const count =
                  grade === 'all'
                    ? CHEMISTRY_LESSONS.filter((l) => l.track === selectedTrack).length
                    : CHEMISTRY_LESSONS.filter((l) => l.track === selectedTrack && l.grade === grade).length;
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      selectedGrade === grade
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {grade === 'all' ? `Tất cả (${count})` : `${grade} (${count})`}
                  </button>
                );
              })
            ) : (
              (['all', 'Cơ bản', 'Nâng cao', 'Chuyên / HSG'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                    selectedTier === tier
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tier === 'all' ? 'Tất cả bậc Chuyên' : tier}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Lesson cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((l) => (
            <div
              key={l.id}
              onClick={() => handleOpenLesson(l, 'theory')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 cursor-pointer hover:border-emerald-500 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {l.track === 'chuyen'
                      ? `Chuyên Hóa · ${l.tier || 'Chuyên sâu'}`
                      : l.track === 'gdpt_2006'
                      ? `${l.grade} · GDPT 2006 · Bài ${l.lessonNumber}`
                      : `${l.grade} · Bài ${l.lessonNumber}`}
                  </span>
                  <span className="font-mono tabular-nums">{l.practiceExercises.length} TN + {l.essayExercises.length} TL</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  <FormattedText text={translate(l.title)} />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  <FormattedText text={translate(l.description)} />
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLesson(l, 'simulation');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Mô phỏng 2D</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLesson(l, 'sim3d');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 cursor-pointer"
                  >
                    <Box className="w-3 h-3" />
                    <span>Mô phỏng 3D</span>
                  </button>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Vào bài →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ chemistryView: 'catalog' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Danh sách bài Hóa học</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentIndex <= 0}
                onClick={() => handleOpenLesson(filteredLessons[currentIndex - 1], activeTab)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentIndex < 0 || currentIndex >= filteredLessons.length - 1}
                onClick={() => handleOpenLesson(filteredLessons[currentIndex + 1], activeTab)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(
              [
                { id: 'theory', label: '1. Bài Giảng', icon: BookOpen },
                { id: 'simulation', label: '2. Mô phỏng 2D', icon: Zap },
                { id: 'sim3d', label: '3. Mô phỏng 3D', icon: Box },
                { id: 'practice', label: '4. Bài Tập', icon: GraduationCap }
              ] as const
            ).map((tb) => {
              const Icon = tb.icon;
              const active = activeTab === tb.id;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => navigate({ chemistryTab: tb.id })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tb.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {lesson.stageLabel || lesson.grade} · {lesson.sourceTag || 'Hóa học'}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            <FormattedText text={translate(lesson.title)} />
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <FormattedText text={translate(lesson.description)} />
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Biểu thức chuẩn:</span>
          {lesson.keyFormulas.map((kf, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono border border-slate-200 dark:border-slate-700"
            >
              <MathFormula formula={kf} />
            </span>
          ))}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE LECTURE ROOM */}
      {activeTab === 'theory' && (
        <InteractiveLectureRoom
          lessonKey={lesson.id}
          subject="chemistry"
          grade={lesson.grade}
          subjectAccent={lesson.track === 'chuyen' ? 'amber' : 'emerald'}
          kicker={lesson.stageLabel || `${lesson.grade} · Hóa học`}
          title={translate(lesson.title)}
          subtitle={translate(lesson.description)}
          steps={lectureSteps}
          keyFormulas={lesson.keyFormulas}
          onEarnXP={onScoreEarned}
          onOpenSim2D={() => navigate({ chemistryTab: 'simulation' })}
          onOpenSim3D={() => navigate({ chemistryTab: 'sim3d' })}
          onNextLesson={
            currentIndex >= 0 && currentIndex < filteredLessons.length - 1
              ? () => handleOpenLesson(filteredLessons[currentIndex + 1], 'theory')
              : undefined
          }
          actions={[
            {
              label: 'Mở Mô Phỏng Hóa Học 2D',
              onClick: () => navigate({ chemistryTab: 'simulation' }),
              variant: 'primary',
              icon: <Zap className="w-4 h-4" />
            },
            {
              label: 'Mở Mô Hình Phân Tử 3D',
              onClick: () => navigate({ chemistryTab: 'sim3d' }),
              variant: 'amber',
              icon: <Box className="w-4 h-4" />
            },
            {
              label: 'Làm Bài Tập (+25 XP)',
              onClick: () => navigate({ chemistryTab: 'practice' }),
              variant: 'emerald',
              icon: <GraduationCap className="w-4 h-4" />
            }
          ]}
        />
      )}

      {/* TAB 2: 2D SIMULATION + PRO ANALYSIS */}
      {activeTab === 'simulation' && (
        <ViewportPortal active={isSimFullscreen}>
          <div
            className={
              isSimFullscreen
                ? 'fixed inset-0 z-[100] h-[100dvh] w-screen p-4 bg-slate-100 dark:bg-slate-950 flex flex-col gap-4 overflow-y-auto'
                : 'space-y-4'
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Phòng Thí Nghiệm 2D · {active2DSpec.title}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {active2DSpec.presets.map((pr) => (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => setParams({ ...active2DSpec.defaultParams, ...pr.params })}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white cursor-pointer"
                  >
                    {pr.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsSimFullscreen((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  {isSimFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isSimFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsRunning((r) => !r)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                      >
                        {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isRunning ? 'Tạm dừng' : 'Chạy tiếp'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          simTimeRef.current += 0.25;
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        <StepForward className="w-3.5 h-3.5 text-sky-500" />
                        <span>+0,25s</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setParams({ ...active2DSpec.defaultParams });
                          simTimeRef.current = 0;
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleLogSample}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        Ghi mẫu đo
                      </button>
                      <button
                        type="button"
                        onClick={() => captureCanvasPng(canvasRef.current, `chem-2d-${active2DSpec.id}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>PNG</span>
                      </button>
                      <RecordVideoButton
                        isRecording={recorder.isRecording}
                        recordSeconds={recorder.recordSeconds}
                        onToggle={recorder.toggleRecording}
                        supported={recorder.supported}
                        compact
                        isEn={isEn}
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950">
                    <canvas ref={canvasRef} className="w-full h-[360px] block rounded-lg" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                    {telemetry.metrics.slice(0, 3).map((m, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-2.5">
                        <div className="text-[11px] text-slate-500">{m.label}</div>
                        <div className="text-sm font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                          {m.value} {m.unit || ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <SimAnalysisProBar
                  simKey={`chem-${active2DSpec.id}`}
                  title={active2DSpec.title}
                  formula={active2DSpec.formula}
                  params={params}
                  paramBounds={active2DSpec.paramBounds}
                  metrics={telemetry.metrics}
                  onApplyParams={setParams}
                  onTogglePlay={() => setIsRunning((r) => !r)}
                  onReset={() => {
                    setParams({ ...active2DSpec.defaultParams });
                    simTimeRef.current = 0;
                  }}
                  onSpeedDelta={(d) => setSimSpeed((s) => Math.max(0.25, Math.min(2.5, s + d)))}
                  isEn={isEn}
                />

                {dataLogs.length > 0 && (
                  <LabDataLoggerPanel
                    title={active2DSpec.title}
                    rows={dataLogs}
                    onClear={() => setDataLogs([])}
                  />
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 h-fit">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>Thông số Thí nghiệm</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParams({ ...active2DSpec.defaultParams })}
                    className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Mặc định
                  </button>
                </div>

                <div className="space-y-3">
                  {Object.entries(active2DSpec.paramBounds).map(([k, bound]) => {
                    const v = params[k] ?? active2DSpec.defaultParams[k] ?? bound.min;
                    return (
                      <label key={k} className="block space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span>{bound.label}</span>
                          <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                            {v} {bound.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={bound.min}
                          max={bound.max}
                          step={bound.step}
                          value={v}
                          onChange={(e) => setParams((p) => ({ ...p, [k]: Number(e.target.value) }))}
                          className="w-full accent-emerald-600"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ViewportPortal>
      )}

      {/* TAB 3: 3D MODEL VIEW */}
      {activeTab === 'sim3d' && (
        <div className="space-y-4">
          <Chemistry3DView
            mode={lesson.sim3dType}
            title={CHEMISTRY_3D_SIMS.find((x) => x.id === lesson.sim3dType)?.title || lesson.title}
            heightClass="h-[460px]"
            isEn={isEn}
          />
          <SimAnalysisProBar
            simKey={`chem-3d-${lesson.sim3dType}`}
            title={CHEMISTRY_3D_SIMS.find((x) => x.id === lesson.sim3dType)?.title || lesson.title}
            formula={lesson.keyFormulas[0]}
            params={params}
            paramBounds={active2DSpec.paramBounds}
            metrics={telemetry.metrics}
            onApplyParams={setParams}
            isEn={isEn}
          />
        </div>
      )}

      {/* TAB 4: PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          {lesson.practiceExercises.map((ex, idx) => {
            const chosen = mcqAnswers[idx];
            const checked = Boolean(mcqChecked[idx]);
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
              >
                <div className="text-xs font-semibold text-emerald-600">{ex.source}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Câu {idx + 1}: <FormattedText text={ex.question} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ex.options.map((opt, oIdx) => {
                    const isPicked = chosen === oIdx;
                    const isRight = oIdx === ex.correctIndex;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          if (checked) return;
                          setMcqAnswers((p) => ({ ...p, [idx]: oIdx }));
                        }}
                        className={`text-left p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          checked
                            ? isRight
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                              : isPicked
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200'
                              : 'border-slate-200 dark:border-slate-800'
                            : isPicked
                            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <FormattedText text={opt} />
                      </button>
                    );
                  })}
                </div>
                {!checked ? (
                  <button
                    type="button"
                    disabled={chosen === undefined}
                    onClick={() => {
                      setMcqChecked((p) => ({ ...p, [idx]: true }));
                      if (chosen === ex.correctIndex) {
                        onScoreEarned?.(15);
                        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <div className="text-xs p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      {chosen === ex.correctIndex ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Chính xác (+15 XP)
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Chưa chính xác
                        </span>
                      )}
                    </div>
                    <FormattedText text={ex.explanation} />
                  </div>
                )}
              </div>
            );
          })}

          {lesson.essayExercises.map((es, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                <Award className="w-4 h-4" />
                <span>Tự luận Vận dụng · {es.source}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                <FormattedText text={es.question} />
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1">
                {es.solutionSteps.map((st, sIdx) => (
                  <div key={sIdx}>
                    <FormattedText text={`• ${st}`} />
                  </div>
                ))}
                <div className="font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                  Đáp số: <FormattedText text={es.finalAnswer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
