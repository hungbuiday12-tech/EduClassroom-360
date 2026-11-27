import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Box,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Dna,
  FileText,
  GraduationCap,
  Layers,
  Lightbulb,
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
import { BiologyLesson, CurriculumTrack, LectureStep, SpecializedTier } from '../../types';
import { BIOLOGY_LESSONS } from '../../data/biologyLessonsData';
import { BIOLOGY_2D_SIMS, BIOLOGY_3D_SIMS, BIOLOGY_DOMAINS } from '../../data/biologyDomainsData';
import { renderBiology2DSim, BioSimTelemetry } from './biology2DEngine';
import { Biology3DView } from './Biology3DView';
import { FormattedText, MathFormula } from '../common/MathRenderer';
import { InteractiveLectureRoom } from '../common/InteractiveLectureRoom';
import { LectureThumbnail } from '../common/LectureThumbnail';
import { ViewportPortal } from '../common/ViewportPortal';
import { LabDataLoggerPanel } from '../common/LabDataLoggerPanel';
import { captureCanvasPng, RecordVideoButton, useCanvasRecorder } from '../common/SimProToolkit';
import { SimAnalysisProBar } from '../common/SimAnalysisProBar';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { enrichLectureStepWithConceptsAndAnnotations } from '../../data/lectureConceptAnnotations';

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

export function buildBiologyLectureSteps(lesson: BiologyLesson): LectureStep[] {
  const formula0 = lesson.keyFormulas[0] || '';
  const paramStr = Object.values(lesson.paramBounds)
    .map((b) => `${b.label} (${b.unit || 'val'})`)
    .join(', ');
  const isSpecialized = lesson.track === 'chuyen';

  const sectionSteps: LectureStep[] = lesson.theorySections.map((sec, idx) => {
    const formula = lesson.keyFormulas[idx] || formula0;
    const secondary = lesson.keyFormulas.filter((f) => f !== formula).slice(0, 2);
    const mcq = lesson.practiceExercises[idx % Math.max(1, lesson.practiceExercises.length)];
    const essay = lesson.essayExercises[0];

    const step: LectureStep = {
      stepTitle: sec.heading,
      stepType: idx === 0 ? 'concept' : 'derivation',
      conceptSection: isSpecialized
        ? `${sec.content}\n\n• **Trọng tâm ${lesson.grade}**: ${lesson.subtitle}`
        : `**Giải thích đơn giản, dễ hiểu (${lesson.grade}):**\n${sec.content}\n\n• **Ý chính cần nhớ**: ${lesson.subtitle}\n• **Liên hệ cơ thể & thiên nhiên**: Luôn gắn cấu tạo của sinh vật (tế bào, cơ quan, hệ sinh thái) với công việc hằng ngày mà nó đảm nhiệm.`,
      formulaSection: formula
        ? {
            primaryFormula: formula,
            secondaryFormulas: secondary,
            variablesNote: `Áp dụng trực tiếp cho "${lesson.title}" (${lesson.stageLabel || lesson.grade}).`
          }
        : undefined,
      deepDiveSection: isSpecialized
        ? `${sec.content}\n\n**Phương pháp học sâu Sinh học ${lesson.grade} (Chuyên/HSG)**:\n• Liên hệ trực tiếp cấu trúc phân tử/tế bào với chức năng sinh lí tương ứng.\n• Khi làm bài tập quy luật di truyền hoặc sinh thái, kiểm tra điều kiện áp dụng (độc lập/liên kết, ngẫu phối/tự thụ).`
        : `**Cách hiểu bài từng bước (${lesson.grade}):**\n1. **Nhìn đúng cấp độ**: Xác định xem bài đang nói về phân tử (DNA), tế bào (nhân, ti thể), cơ thể (tim, phổi, lá cây) hay quần thể.\n2. **Hiểu nhân – quả sinh học**: Hỏi "vì sao cơ quan này có hình dạng đó?" để nhớ chức năng tự nhiên mà không cần học vẹt.\n3. **Quan sát mô hình 2D/3D**: Bật mô phỏng ngay bên dưới để thấy chuyển động tế bào, mạch dẫn hay sơ đồ lai chạy từng bước.`,
      stepByStepNotes: isSpecialized
        ? undefined
        : [
            `Bước 1 (Đọc ý chính): "${sec.heading}" giải thích cấu tạo và hoạt động sống trong ${lesson.title}.`,
            'Bước 2 (Ghi nhớ từ khóa): Nắm các đại lượng hoặc tỉ lệ quan trọng (nếu có) và điều kiện môi trường tác động.',
            'Bước 3 (Xem 2D/3D trực tiếp): Nhấn nút điều khiển trên khung mô phỏng ngay bên dưới để tự tay kiểm chứng.'
          ],
      teacherExplanation: sec.content,
      formulaHighlight: formula || undefined,
      quickIntuition: isSpecialized
        ? `Đọc kĩ khái niệm ở trên rồi thử kích hoạt mô phỏng sinh học 2D/3D bên dưới để quan sát diễn biến theo thời gian thực.`
        : `Đọc phần giải thích ngắn gọn ở trên rồi mở ngay mô phỏng 2D/3D bên dưới để nhìn trực tiếp sự sống vận hành thay vì phải tưởng tượng chay.`,
      workedExample:
        idx === lesson.theorySections.length - 1 && essay
          ? {
              problem: essay.question,
              steps: essay.solutionSteps,
              answer: essay.finalAnswer
            }
          : undefined,
      keyTakeaway: isSpecialized
        ? `Nắm chắc khái niệm, đặc điểm và quy luật sinh học trong mục "${sec.heading}".`
        : `Chỉ cần nắm bản chất cơ chế của "${sec.heading}" và biết cách xem biểu hiện thực tế trên mô hình 2D/3D.`,
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

    return enrichLectureStepWithConceptsAndAnnotations(
      step,
      { subject: 'biology', lessonTitle: lesson.title, keyFormulas: lesson.keyFormulas },
      idx
    );
  });

  const labStep: LectureStep = {
    stepTitle: `${sectionSteps.length + 1}. Thực hành Quan sát & Điều khiển Mô phỏng Sinh học 2D & 3D`,
    stepType: 'experiment',
    conceptSection: `Chuyển sang mô phỏng 2D hoặc Mô hình 3D để tương tác trực tiếp các bước thí nghiệm (thụ phấn lai Mendel, xung thần kinh, nhịp tim, chu kì PCR...) và điều chỉnh: ${paramStr}.`,
    formulaSection: formula0
      ? {
          primaryFormula: formula0,
          secondaryFormulas: lesson.keyFormulas.slice(1, 3),
          variablesNote: `Các thông số điều chỉnh: ${paramStr}.`
        }
      : undefined,
    deepDiveSection: `• Sử dụng các nút tương tác thí nghiệm và thanh trượt thông số ngay trong bảng điều khiển 3D.\n• Nhấn **Ghi mẫu đo** ở nhiều mức thông số khác nhau để lập bảng số liệu và xem biểu đồ xu hướng.`,
    teacherExplanation: `Kiểm chứng trực quan quá trình sinh học qua phòng thí nghiệm ảo (${lesson.simulationType}).`,
    keyTakeaway: 'Ghi ít nhất 3 mẫu đo thực nghiệm để quan sát sự đáp ứng của hệ sinh học.',
    miniQuiz: [],
    miniEssay: undefined
  };

  sectionSteps.push(
    enrichLectureStepWithConceptsAndAnnotations(
      labStep,
      { subject: 'biology', lessonTitle: lesson.title, keyFormulas: lesson.keyFormulas },
      sectionSteps.length
    )
  );

  return sectionSteps;
}

export const BiologyLab: React.FC<{ onScoreEarned?: (xp: number) => void; onBack?: () => void }> = ({
  onScoreEarned,
  onBack
}) => {
  const { language, translate } = useLanguage();
  const isEn = language === 'en';
  const { location, navigate, goBack } = useNavigation();
  const { perfMode } = useBackgroundTheme();
  const perfModeRef = useRef(perfMode);
  perfModeRef.current = perfMode;

  const activeView = location.biologyView;
  const activeTab = location.biologyTab;

  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>('khong_chuyen');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | SpecializedTier>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [showStudyPrinciples, setShowStudyPrinciples] = useState<boolean>(false);

  const isStandardTrack = selectedTrack === 'khong_chuyen' || selectedTrack === 'gdpt_2006';

  useEffect(() => {
    setSelectedStage('all');
  }, [selectedTrack, selectedGrade, selectedTier]);

  useEffect(() => {
    if (location.catalogGrade) {
      setSelectedGrade(location.catalogGrade);
      setSelectedStage('all');
    }
    if (location.catalogTrack) {
      setSelectedTrack(location.catalogTrack);
    }
  }, [location.catalogGrade, location.catalogTrack]);

  const baseTrackLessons = useMemo(() => {
    return BIOLOGY_LESSONS.filter((l) => {
      if (l.track !== selectedTrack) return false;
      if (isStandardTrack) {
        return selectedGrade === 'all' || l.grade === selectedGrade;
      }
      return selectedTier === 'all' || l.tier === selectedTier;
    });
  }, [selectedTrack, selectedGrade, selectedTier, isStandardTrack]);

  const availableStages = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const l of baseTrackLessons) {
      if (l.stageLabel && !seen.has(l.stageLabel)) {
        seen.add(l.stageLabel);
        list.push(l.stageLabel);
      }
    }
    return list;
  }, [baseTrackLessons]);

  const filteredLessons = useMemo(() => {
    if (selectedStage === 'all') return baseTrackLessons;
    return baseTrackLessons.filter((l) => l.stageLabel === selectedStage);
  }, [baseTrackLessons, selectedStage]);

  const lesson = useMemo(() => {
    return (
      BIOLOGY_LESSONS.find((l) => l.id === location.biologyLessonId) ||
      filteredLessons[0] ||
      BIOLOGY_LESSONS[0]
    );
  }, [location.biologyLessonId, filteredLessons]);

  const currentIndex = filteredLessons.findIndex((l) => l.id === lesson.id);

  const active2DSpec = useMemo(
    () => BIOLOGY_2D_SIMS.find((s) => s.id === lesson.simulationType) || BIOLOGY_2D_SIMS[0],
    [lesson.simulationType]
  );

  const [params, setParams] = useState<Record<string, number>>(() => ({ ...active2DSpec.defaultParams }));
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [isSimFullscreen, setIsSimFullscreen] = useState(false);
  const [telemetry, setTelemetry] = useState<BioSimTelemetry>({ metrics: [], statusNote: '' });
  const [dataLogs, setDataLogs] = useState<DataLogEntry[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const speedRef = useRef(simSpeed);
  speedRef.current = simSpeed;

  const recorder = useCanvasRecorder(() => canvasRef.current, `bio-2d-${active2DSpec.id}`);

  useEffect(() => {
    setParams({ ...active2DSpec.defaultParams });
    simTimeRef.current = 0;
    setDataLogs([]);
  }, [active2DSpec]);

  useEffect(() => {
    if (activeView !== 'lecture' || activeTab !== 'simulation') return;
    let raf = 0;
    let lastTs = performance.now();
    let count = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (isRunningRef.current) simTimeRef.current += dt * speedRef.current;
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
            const dark = document.documentElement.classList.contains('dark');
            const out = renderBiology2DSim(
              ctx,
              rect.width,
              rect.height,
              active2DSpec.id,
              paramsRef.current,
              simTimeRef.current,
              dark,
              perfModeRef.current
            );
            ctx.restore();
            count++;
            if (count % 6 === 0) setTelemetry(out);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [activeView, activeTab, active2DSpec.id]);

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [mcqChecked, setMcqChecked] = useState<Record<number, boolean>>({});
  useEffect(() => {
    setMcqAnswers({});
    setMcqChecked({});
  }, [lesson.id]);

  const lectureSteps = useMemo(() => buildBiologyLectureSteps(lesson), [lesson]);

  const handleOpenLesson = (target: BiologyLesson, tab: 'theory' | 'simulation' | 'sim3d' | 'practice' = 'theory') => {
    navigate({
      subject: 'biology',
      biologyView: 'lecture',
      biologyLessonId: target.id,
      biologyTab: tab
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogSample = () => {
    const m = telemetry.metrics;
    setDataLogs((prev) =>
      [
        {
          id: Date.now(),
          timeStr: `${simTimeRef.current.toFixed(2)}s`,
          m1Label: m[0]?.label || 'M1',
          m1Val: m[0] ? `${m[0].value} ${m[0].unit || ''}`.trim() : '—',
          m2Label: m[1]?.label || 'M2',
          m2Val: m[1] ? `${m[1].value} ${m[1].unit || ''}`.trim() : '—',
          m3Label: m[2]?.label || 'M3',
          m3Val: m[2] ? `${m[2].value} ${m[2].unit || ''}`.trim() : '—'
        },
        ...prev
      ].slice(0, 20)
    );
  };

  if (activeView === 'catalog') {
    return (
      <div className="space-y-6 pb-12 overflow-x-hidden">
        <div className="sci-frame sci-blueprint-bg bg-white/95 dark:bg-slate-900/95 rounded-xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  data-ripple="true"
                  onClick={onBack || goBack}
                  className="sim-btn-bio inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Back' : 'Quay lại'}</span>
                </button>
                <span className="font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                  Sinh Học 6 – 12 &amp; Bồi Dưỡng Chuyên
                </span>
                <span aria-hidden="true">·</span>
                <span>{BIOLOGY_LESSONS.length} bài giảng chuẩn 2D/3D</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Dna className="w-6 h-6 text-teal-600 dark:text-teal-400 icon-anim-dna shrink-0" />
                <span>{isEn ? 'Biology Lecture & Lab Classroom' : 'Hệ Thống Bài Giảng & Phòng Thí Nghiệm Sinh Học'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Chọn khung chương trình bên dưới rồi mở bài giảng, Mô phỏng 2D hoặc Mô phỏng 3D tương tác theo thời gian thực.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
              <button
                type="button"
                data-ripple="true"
                onClick={() => navigate({ subject: 'biology_sims', biologyView: 'sim2d_hub' })}
                className="group sim-btn-bio sim-btn-hero sim-btn-active flex items-center gap-2 px-4 py-2.5 rounded-[3px] border border-teal-400/70 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span className="sim-led-square text-teal-100" />
                <Zap className="w-4 h-4 icon-anim-zap" />
                <span>Mô phỏng 2D ({BIOLOGY_DOMAINS.length} Lĩnh Vực · {BIOLOGY_2D_SIMS.length} Lab)</span>
              </button>
              <button
                type="button"
                data-ripple="true"
                onClick={() => navigate({ subject: 'biology_sims', biologyView: 'sim3d_hub' })}
                className="group sim-btn-bio sim-btn-hero sim-btn-active flex items-center gap-2 px-4 py-2.5 rounded-[3px] border border-amber-300/80 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span className="sim-led-square text-slate-900" />
                <Box className="w-4 h-4 icon-anim-3d-cube" />
                <span>Mô phỏng 3D ({BIOLOGY_DOMAINS.length} Lĩnh Vực · {BIOLOGY_3D_SIMS.length} Lab)</span>
              </button>
            </div>
          </div>

          {/* Dedicated Biology Simulation & Sandbox Hub Banner */}
          <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Trang Mô Phỏng &amp; Sandbox Sinh Học Tách Riêng Theo {BIOLOGY_DOMAINS.length} Lĩnh Vực (Lớp 6 – 12)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {BIOLOGY_DOMAINS.map((d) => d.shortName).join(' · ')} — kèm Dịch mã Gen DNA/mRNA, Hardy–Weinberg &amp; Tế bào 3D
              </p>
            </div>
            <button
              type="button"
              data-ripple="true"
              onClick={() => navigate({ subject: 'biology_sims' })}
              className="sim-btn-bio flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 dark:bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Dna className="w-4 h-4 icon-anim-dna shrink-0" />
              <span>{isEn ? 'Open Biology Lab & Sandbox Hub' : 'Mở Khu Lab, Mô phỏng & Sandbox Sinh'}</span>
            </button>
          </div>

          {/* 3 Separate 2-Layer Animated Framed Track Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                {
                  id: 'khong_chuyen' as CurriculumTrack,
                  title: 'Khu GDPT 2018 (Lớp 6 – 12)',
                  sub: `KHTN 6–9 & Sinh 10–12 chuẩn mới · ${BIOLOGY_LESSONS.filter((l) => l.track === 'khong_chuyen').length} bài học`,
                  accentHex: '#0284c7',
                  secondaryHex: '#38bdf8',
                  icon: Dna,
                  iconAnim: 'icon-anim-dna',
                  activeWrapShadow: 'shadow-[0_14px_34px_-12px_rgba(2,132,199,0.4)]',
                  activeBtnBg: 'bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-600 text-white',
                  activeIconBg: 'bg-white/20 text-white',
                  idleIconBg: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
                  activeSubText: 'text-sky-100',
                  idleCtaText: 'text-sky-600 dark:text-sky-400',
                  activeCtaText: 'text-white'
                },
                {
                  id: 'gdpt_2006' as CurriculumTrack,
                  title: 'Khu GDPT 2006 (Không chuyên)',
                  sub: `Sinh học 6–12 chuẩn SGK 2006 · ${BIOLOGY_LESSONS.filter((l) => l.track === 'gdpt_2006').length} bài kèm 2D & 3D`,
                  accentHex: '#0d9488',
                  secondaryHex: '#10b981',
                  icon: BookOpen,
                  iconAnim: 'icon-anim-book',
                  activeWrapShadow: 'shadow-[0_14px_34px_-12px_rgba(13,148,136,0.42)]',
                  activeBtnBg: 'bg-gradient-to-br from-teal-700 via-emerald-600 to-teal-600 text-white',
                  activeIconBg: 'bg-white/20 text-white',
                  idleIconBg: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400',
                  activeSubText: 'text-teal-100',
                  idleCtaText: 'text-teal-700 dark:text-teal-400',
                  activeCtaText: 'text-white'
                },
                {
                  id: 'chuyen' as CurriculumTrack,
                  title: 'Khu Chuyên Sinh & HSG / IBO',
                  sub: `Cơ bản → Nâng cao → Chuyên sâu · ${BIOLOGY_LESSONS.filter((l) => l.track === 'chuyen').length} chuyên đề`,
                  accentHex: '#d97706',
                  secondaryHex: '#f97316',
                  icon: Zap,
                  iconAnim: 'icon-anim-zap',
                  activeWrapShadow: 'shadow-[0_14px_34px_-12px_rgba(217,119,6,0.45)]',
                  activeBtnBg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-slate-950',
                  activeIconBg: 'bg-slate-950/15 text-slate-950',
                  idleIconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
                  activeSubText: 'text-slate-900/85 font-medium',
                  idleCtaText: 'text-amber-600 dark:text-amber-400',
                  activeCtaText: 'text-slate-950'
                }
              ]
            ).map((tr) => {
              const active = selectedTrack === tr.id;
              const TrackIcon = tr.icon;
              return (
                <div
                  key={tr.id}
                  style={
                    {
                      '--phy-accent': tr.accentHex,
                      '--phy-secondary': tr.secondaryHex
                    } as React.CSSProperties
                  }
                  className={`bio-orbit-wrapper bio-zone-frame group ${
                    active ? `bio-zone-active ${tr.activeWrapShadow}` : 'shadow-xs'
                  }`}
                >
                  <div aria-hidden="true" className="bio-orbit-ring" />
                  <button
                    type="button"
                    data-ripple="true"
                    onClick={() => setSelectedTrack(tr.id)}
                    className={`relative z-10 w-full h-full text-left rounded-[0.5rem] p-4 sm:p-5 overflow-hidden transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      active
                        ? tr.activeBtnBg
                        : 'bg-slate-50/95 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span aria-hidden="true" className="bio-helix-sweep" />
                    <div className="relative z-10 flex items-start gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                          active ? tr.activeIconBg : tr.idleIconBg
                        }`}
                      >
                        <TrackIcon className={`w-6 h-6 ${tr.iconAnim}`} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="text-sm sm:text-base font-extrabold leading-snug">
                          {tr.title}
                        </div>
                        <div
                          className={`text-xs leading-relaxed ${
                            active ? tr.activeSubText : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {tr.sub}
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 shrink-0 flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
                      {active ? (
                        <span className={`inline-flex items-center gap-1 ${tr.activeCtaText}`}>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Đang mở</span>
                        </span>
                      ) : (
                        <span className={`${tr.idleCtaText} group-hover:translate-x-0.5 transition-transform`}>
                          Chọn khu →
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/70 dark:border-slate-800">
            {isStandardTrack ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1">Khối lớp:</span>
                {(['all', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'] as const).map((grade) => {
                  const count =
                    grade === 'all'
                      ? BIOLOGY_LESSONS.filter((l) => l.track === selectedTrack).length
                      : BIOLOGY_LESSONS.filter((l) => l.track === selectedTrack && l.grade === grade).length;
                  return (
                    <button
                      key={grade}
                      type="button"
                      data-ripple="true"
                      onClick={() => setSelectedGrade(grade)}
                      className={`sim-btn-bio px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                        selectedGrade === grade
                          ? selectedTrack === 'gdpt_2006'
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {grade === 'all' ? `Tất cả (${count} bài)` : `${grade} (${count})`}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1">Trình độ Chuyên:</span>
                {(['all', 'Cơ bản', 'Nâng cao', 'Chuyên / HSG'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    data-ripple="true"
                    onClick={() => setSelectedTier(tier)}
                    className={`sim-btn-bio px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      selectedTier === tier
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tier === 'all' ? 'Tất cả lộ trình Chuyên' : tier}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowStudyPrinciples((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Nguyên tắc tự học Sinh học &amp; Cơ chế Phân tử</span>
              {showStudyPrinciples ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {availableStages.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/70">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Chuyên mục / Phần:</span>
              <button
                type="button"
                data-ripple="true"
                onClick={() => setSelectedStage('all')}
                className={`sim-btn-bio px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                  selectedStage === 'all'
                    ? 'bg-slate-900 dark:bg-teal-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Tất cả phần
              </button>
              {availableStages.map((stg) => (
                <button
                  key={stg}
                  type="button"
                  data-ripple="true"
                  onClick={() => setSelectedStage(stg)}
                  className={`sim-btn-bio px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all text-left cursor-pointer ${
                    selectedStage === stg
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          )}

          {showStudyPrinciples && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                  Liên hệ Cấu trúc Tế bào – Chức năng Sinh lí
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Quan sát mô hình 3D tế bào, lục lạp, ti thể và cơ chế phiên mã–dịch mã DNA trước khi tổng hợp chuỗi phản ứng chuyển hóa năng lượng.
                </p>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-500" />
                  Phân tích Điều kiện Áp dụng Quy luật Di truyền
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Luôn kiểm tra phân li độc lập vs hoán vị gen, ngẫu phối Hardy–Weinberg vs tự thụ phấn và hiệu suất truyền bậc dinh dưỡng 10%.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3-Column Animated Framed Biology Lesson Cards Catalog (Matched to Physics) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((l) => {
            const isPro = l.track === 'chuyen';
            const isGdpt2006 = l.track === 'gdpt_2006';
            return (
              <div
                key={l.id}
                style={
                  {
                    '--phy-accent': isPro ? '#f59e0b' : isGdpt2006 ? '#0d9488' : '#0ea5e9',
                    '--phy-secondary': isPro ? '#ef4444' : isGdpt2006 ? '#10b981' : '#14b8a6'
                  } as React.CSSProperties
                }
                className="bio-orbit-wrapper bio-card-frame group shadow-sm hover:shadow-[0_18px_40px_-14px_rgba(20,184,166,0.34)]"
              >
                <div aria-hidden="true" className="bio-orbit-ring" />
                <div
                  onClick={() => handleOpenLesson(l, 'theory')}
                  className="relative z-10 h-full cursor-pointer bg-white/95 dark:bg-slate-900/95 rounded-[0.65rem] p-5 flex flex-col justify-between gap-4 overflow-hidden"
                >
                  <span aria-hidden="true" className="bio-helix-sweep" />
                  <div className="relative z-10 space-y-2.5">
                    <div className="flex items-start gap-3">
                      <LectureThumbnail
                        subject="biology"
                        id={l.id}
                        category={l.grade}
                        simType={l.simulationType}
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span
                            className={`font-bold uppercase tracking-wider ${
                              isPro
                                ? 'text-amber-600 dark:text-amber-400'
                                : isGdpt2006
                                ? 'text-teal-700 dark:text-teal-400'
                                : 'text-sky-600 dark:text-sky-400'
                            }`}
                          >
                            {isPro
                              ? `Chuyên Sinh · ${l.tier || 'Nâng cao'}`
                              : isGdpt2006
                              ? `${l.grade} · 2006 · Bài ${l.lessonNumber}`
                              : `${l.grade} · Bài ${l.lessonNumber}`}
                          </span>
                          <span className="font-mono shrink-0 tabular-nums">
                            {l.practiceExercises.length} TN + {(l.essayExercises || []).length} TL
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                          <FormattedText text={translate(l.title)} />
                        </h3>
                        {l.stageLabel && (
                          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                            {l.stageLabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      <FormattedText text={translate(l.description)} />
                    </div>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        data-ripple="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLesson(l, 'simulation');
                        }}
                        className="sim-btn-bio inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/60 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Zap className="w-3 h-3 icon-anim-zap" />
                        <span>Mô phỏng 2D</span>
                      </button>
                      <button
                        type="button"
                        data-ripple="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenLesson(l, 'sim3d');
                        }}
                        className="sim-btn-bio sim-btn-3d inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Box className="w-3 h-3 icon-anim-3d-cube" />
                        <span>Mô phỏng 3D</span>
                      </button>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                      <span>Vào bài</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ biologyView: 'catalog' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Danh sách bài Sinh học</span>
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
              return (
                <button
                  key={tb.id}
                  type="button"
                  data-ripple="true"
                  onClick={() => navigate({ biologyTab: tb.id })}
                  className={`sim-btn-bio inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                    activeTab === tb.id
                      ? 'bg-teal-600 text-white'
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
          <div className="text-xs font-medium text-teal-700 dark:text-teal-400">
            {lesson.stageLabel || lesson.grade} · {lesson.sourceTag || 'Sinh học'}
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

      {activeTab === 'theory' && (
        <InteractiveLectureRoom
          lessonKey={lesson.id}
          subject="biology"
          biologyLesson={lesson}
          grade={lesson.grade}
          subjectAccent={lesson.track === 'chuyen' ? 'amber' : 'emerald'}
          kicker={lesson.stageLabel || `${lesson.grade} · Sinh học`}
          title={translate(lesson.title)}
          subtitle={translate(lesson.description)}
          steps={lectureSteps}
          keyFormulas={lesson.keyFormulas}
          onEarnXP={onScoreEarned}
          onOpenSim2D={() => navigate({ biologyTab: 'simulation' })}
          onOpenSim3D={() => navigate({ biologyTab: 'sim3d' })}
          onNextLesson={
            currentIndex >= 0 && currentIndex < filteredLessons.length - 1
              ? () => handleOpenLesson(filteredLessons[currentIndex + 1], 'theory')
              : undefined
          }
          actions={[
            {
              label: 'Mở Mô Phỏng Sinh Học 2D',
              onClick: () => navigate({ biologyTab: 'simulation' }),
              variant: 'primary',
              icon: <Zap className="w-4 h-4" />
            },
            {
              label: 'Mở Mô Hình Giải Phẫu / Tế Bào 3D',
              onClick: () => navigate({ biologyTab: 'sim3d' }),
              variant: 'amber',
              icon: <Box className="w-4 h-4" />
            },
            {
              label: 'Làm Bài Tập (+25 XP)',
              onClick: () => navigate({ biologyTab: 'practice' }),
              variant: 'emerald',
              icon: <GraduationCap className="w-4 h-4" />
            }
          ]}
        />
      )}

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
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white cursor-pointer"
                  >
                    {pr.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsSimFullscreen((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer"
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer"
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
                        onClick={() => captureCanvasPng(canvasRef.current, `bio-2d-${active2DSpec.id}`)}
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
                        <div className="text-sm font-mono font-bold tabular-nums text-teal-600 dark:text-teal-400">
                          {m.value} {m.unit || ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <SimAnalysisProBar
                  simKey={`bio-${active2DSpec.id}`}
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
                    <Sliders className="w-4 h-4 text-teal-600" />
                    <span>Thông số Sinh học</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParams({ ...active2DSpec.defaultParams })}
                    className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
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
                          <span className="font-mono tabular-nums text-teal-600 dark:text-teal-400">
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
                          className="w-full accent-teal-600"
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

      {activeTab === 'sim3d' && (
        <div className="space-y-4">
          <Biology3DView
            mode={lesson.sim3dType}
            title={BIOLOGY_3D_SIMS.find((x) => x.id === lesson.sim3dType)?.title || lesson.title}
            heightClass="h-[460px]"
            isEn={isEn}
          />
          <SimAnalysisProBar
            simKey={`bio-3d-${lesson.sim3dType}`}
            title={BIOLOGY_3D_SIMS.find((x) => x.id === lesson.sim3dType)?.title || lesson.title}
            formula={lesson.keyFormulas[0]}
            params={params}
            paramBounds={active2DSpec.paramBounds}
            metrics={telemetry.metrics}
            onApplyParams={setParams}
            isEn={isEn}
          />
        </div>
      )}

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
                <div className="text-xs font-semibold text-teal-600">{ex.source}</div>
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
                    className="px-4 py-2 rounded-lg bg-teal-600 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
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
                <div className="font-bold text-teal-600 dark:text-teal-400 pt-1">
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
