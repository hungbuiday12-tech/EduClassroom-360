import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Compass,
  Code2,
  Cpu,
  GitBranch,
  Play,
  Sparkles,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { PersonalizedRoadmapResult, RoadmapNode, SubjectType } from '../../types';
import { ROADMAP_NODES } from '../../data/roadmapData';
import { CS_SPECIALIZED_TRACKS, CSTrackId } from '../../data/csTracksData';
import { CS_LESSONS } from '../../data/csLessonsData';
import { getPhysicsSimCounts } from '../../data/physicsDomainsData';

const SIM_COUNTS = getPhysicsSimCounts();

type MapFocusFilter = 'all' | 'math' | 'physics' | 'cs';

interface SmartKnowledgeMapSummary {
  lessonKey: string;
  subject: 'math' | 'physics' | 'cs';
  lessonTitle: string;
  overallMastery: number;
  weakPoints: string[];
  strongPoints: string[];
}

interface SmartKnowledgeMapProps {
  isEn: boolean;
  completedNodeIds: string[];
  savedLessonSummaries: SmartKnowledgeMapSummary[];
  aiRoadmaps: Partial<Record<'math' | 'physics' | 'cs', PersonalizedRoadmapResult>>;
  dailyStudyMinutes: Array<{ dayLabel: string; totalMinutes: number }>;
  activePlanGrade: string;
  activePlanHoursPerWeek: number;
  onSelectRoadmapNode: (nodeId: string) => void;
  onOpenNodeLesson: (subject: 'math' | 'physics' | 'cs', lessonId?: string, csTrackId?: CSTrackId) => void;
  onOpenDiagnosticAI: (subject: 'math' | 'physics' | 'cs', topicTitle?: string) => void;
  onNavigateSubject: (subject: SubjectType) => void;
}

type GraphNodeId =
  | 'student_profile'
  | 'math_pillar'
  | 'physics_pillar'
  | 'cs_pillar'
  | 'gap_detector'
  | 'practice_labs'
  | 'mastery_goal';

interface GraphNodeDef {
  id: GraphNodeId;
  xPct: number;
  yPct: number;
  labelVi: string;
  labelEn: string;
  subVi: string;
  subEn: string;
  tone: 'cyan' | 'sky' | 'amber' | 'emerald' | 'violet' | 'indigo';
  subjectTag?: 'math' | 'physics' | 'cs';
}

const GRAPH_NODES: GraphNodeDef[] = [
  {
    id: 'student_profile',
    xPct: 14,
    yPct: 22,
    labelVi: 'Hồ Sơ Học Sinh',
    labelEn: 'Student Profile',
    subVi: 'Dữ liệu năng lực',
    subEn: 'Competency Vector',
    tone: 'sky'
  },
  {
    id: 'math_pillar',
    xPct: 45,
    yPct: 22,
    labelVi: 'Toán · Giải Tích & Oxyz',
    labelEn: 'Math · 2D & Oxyz',
    subVi: 'Đồ thị & Hình không gian',
    subEn: 'Calculus & Geometry',
    tone: 'cyan',
    subjectTag: 'math'
  },
  {
    id: 'physics_pillar',
    xPct: 77,
    yPct: 20,
    labelVi: `Vật Lí · ${SIM_COUNTS.domainCount} Chuyên Đề`,
    labelEn: `Physics · ${SIM_COUNTS.domainCount} Domains`,
    subVi: `${SIM_COUNTS.count2D} Lab 2D + ${SIM_COUNTS.count3D} Lab 3D`,
    subEn: 'Interactive 2D/3D Labs',
    tone: 'amber',
    subjectTag: 'physics'
  },
  {
    id: 'gap_detector',
    xPct: 33,
    yPct: 60,
    labelVi: 'Syn AI Lọc Lỗ Hổng',
    labelEn: 'Syn AI Gap Analyzer',
    subVi: 'TN + Tự luận tự lưu',
    subEn: 'Auto Weakness Scan',
    tone: 'violet'
  },
  {
    id: 'cs_pillar',
    xPct: 58,
    yPct: 48,
    labelVi: 'Tin · 5 Lộ Trình C++',
    labelEn: 'CS · 5 C++ Tracks',
    subVi: 'VNOI + 4 Tracks (18 chặng)',
    subEn: 'VNOI + 4 Tracks',
    tone: 'emerald',
    subjectTag: 'cs'
  },
  {
    id: 'practice_labs',
    xPct: 58,
    yPct: 80,
    labelVi: 'Phòng Lab 3D & Judge',
    labelEn: '3D Labs & Sublime IDE',
    subVi: 'Synapse Pre · 10-Ngón · IDE',
    subEn: 'Simulations & Judge',
    tone: 'indigo'
  },
  {
    id: 'mastery_goal',
    xPct: 85,
    yPct: 72,
    labelVi: 'Đích Thông Thạo',
    labelEn: 'Mastery Target',
    subVi: 'Thi THPT / HSG',
    subEn: 'Exam Readiness',
    tone: 'cyan'
  }
];

const GRAPH_STREAMS: Array<{
  id: string;
  d: string;
  color: string;
  reverse?: boolean;
  count: number;
  subjectTag?: 'math' | 'physics' | 'cs';
}> = [
  { id: 's-1', d: 'M 140 62 C 250 32, 330 84, 450 62', color: '#22d3ee', count: 4, subjectTag: 'math' },
  { id: 's-2', d: 'M 140 62 C 210 128, 250 155, 330 168', color: '#38bdf8', count: 2 },
  { id: 's-3', d: 'M 450 62 C 560 40, 660 72, 770 56', color: '#f59e0b', count: 2, subjectTag: 'physics' },
  { id: 's-4', d: 'M 450 62 C 500 95, 530 116, 580 134', color: '#34d399', count: 2, subjectTag: 'cs' },
  { id: 's-5', d: 'M 330 168 C 430 155, 490 142, 580 134', color: '#a78bfa', reverse: true, count: 2 },
  { id: 's-6', d: 'M 330 168 C 415 215, 485 228, 580 224', color: '#818cf8', count: 3 },
  { id: 's-7', d: 'M 580 134 C 690 138, 760 156, 850 202', color: '#10b981', count: 2, subjectTag: 'cs' },
  { id: 's-8', d: 'M 580 224 C 690 232, 770 220, 850 202', color: '#38bdf8', count: 2 },
  { id: 's-9', d: 'M 770 56 C 835 110, 845 152, 850 202', color: '#fbbf24', count: 2, subjectTag: 'physics' }
];

export const SmartKnowledgeMap: React.FC<SmartKnowledgeMapProps> = ({
  isEn,
  completedNodeIds,
  savedLessonSummaries,
  aiRoadmaps,
  dailyStudyMinutes,
  activePlanGrade,
  activePlanHoursPerWeek,
  onSelectRoadmapNode,
  onOpenNodeLesson,
  onOpenDiagnosticAI,
  onNavigateSubject
}) => {
  const [focusFilter, setFocusFilter] = useState<MapFocusFilter>('all');
  const [activeGraphNodeId, setActiveGraphNodeId] = useState<GraphNodeId>('cs_pillar');

  const csCompletedTrackStages = useMemo(() => {
    try {
      const raw = localStorage.getItem('synapse_cs_track_completed_v1');
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const metrics = useMemo(() => {
    const mathNodes = ROADMAP_NODES.filter((n) => n.subject === 'math');
    const physNodes = ROADMAP_NODES.filter((n) => n.subject === 'physics');
    const csNodes = ROADMAP_NODES.filter((n) => n.subject === 'cs');

    const mathDone = mathNodes.filter((n) => completedNodeIds.includes(n.id)).length;
    const physDone = physNodes.filter((n) => completedNodeIds.includes(n.id)).length;
    const csDone = csNodes.filter((n) => completedNodeIds.includes(n.id)).length;

    const mathPct = mathNodes.length ? Math.round((mathDone / mathNodes.length) * 100) : 0;
    const physPct = physNodes.length ? Math.round((physDone / physNodes.length) * 100) : 0;
    const csPct = csNodes.length ? Math.round((csDone / csNodes.length) * 100) : 0;

    const totalTrackStages = CS_SPECIALIZED_TRACKS.reduce((acc, tr) => acc + tr.stages.length, 0);
    const csTrackPct = totalTrackStages
      ? Math.round((csCompletedTrackStages.length / totalTrackStages) * 100)
      : 0;

    const overallRoadmapPct = ROADMAP_NODES.length
      ? Math.round((completedNodeIds.length / ROADMAP_NODES.length) * 100)
      : 0;

    const avgLessonMastery =
      savedLessonSummaries.length > 0
        ? Math.round(
            savedLessonSummaries.reduce((acc, s) => acc + s.overallMastery, 0) /
              savedLessonSummaries.length
          )
        : Math.max(24, overallRoadmapPct);

    const readinessOutOfTen = Number(
      Math.min(10, Math.max(1.5, (overallRoadmapPct * 0.45 + avgLessonMastery * 0.55) / 10)).toFixed(2)
    );
    const velocityIndex = Number(
      Math.min(10, Math.max(2.0, activePlanHoursPerWeek / 2.2)).toFixed(2)
    );
    const csTrackDiversityScore = Number(
      (2.5 + (csCompletedTrackStages.length / Math.max(1, totalTrackStages)) * 7.5).toFixed(2)
    );

    const weakTopics = savedLessonSummaries
      .filter((s) => s.overallMastery < 75 || s.weakPoints.length > 0)
      .slice(0, 3);

    return {
      mathDone,
      mathTotal: mathNodes.length,
      mathPct,
      physDone,
      physTotal: physNodes.length,
      physPct,
      csDone,
      csTotal: csNodes.length,
      csPct,
      csTrackDone: csCompletedTrackStages.length,
      totalTrackStages,
      csTrackPct,
      overallRoadmapPct,
      avgLessonMastery,
      readinessOutOfTen,
      velocityIndex,
      csTrackDiversityScore,
      weakTopics
    };
  }, [completedNodeIds, savedLessonSummaries, csCompletedTrackStages, activePlanHoursPerWeek]);

  // Smooth performance trajectory curve SVG points
  const trajectoryCurve = useMemo(() => {
    const baseScores =
      savedLessonSummaries.length >= 2
        ? [...savedLessonSummaries]
            .slice(0, 8)
            .reverse()
            .map((s) => Math.max(15, Math.min(98, s.overallMastery)))
        : [28, 36, 33, 49, 58, 53, 72, Math.max(76, metrics.overallRoadmapPct + 35)];

    const w = 320;
    const h = 112;
    const padX = 12;
    const padTop = 12;
    const padBottom = 14;
    const usableW = w - padX * 2;
    const usableH = h - padTop - padBottom;

    const pts = baseScores.map((val, i) => {
      const x = padX + (i / Math.max(1, baseScores.length - 1)) * usableW;
      const y = padTop + (1 - val / 100) * usableH;
      return { x, y, val };
    });

    let linePath = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = ((p0.x + p1.x) / 2).toFixed(1);
      linePath += ` C ${cx} ${p0.y.toFixed(1)}, ${cx} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${h - 4} L ${pts[0].x.toFixed(1)} ${h - 4} Z`;

    return { pts, linePath, areaPath };
  }, [savedLessonSummaries, metrics.overallRoadmapPct]);

  // Left analytics vertical bars (12 knowledge vectors across Math/Physics/CS)
  const analyticsHistogram = useMemo(() => {
    const rawValues = [
      Math.max(26, metrics.mathPct || 48),
      64,
      Math.max(32, metrics.physPct || 52),
      84,
      Math.max(28, metrics.csPct || 44),
      56,
      78,
      Math.max(35, metrics.csTrackPct || 62),
      92,
      74,
      Math.max(40, metrics.avgLessonMastery),
      88
    ];
    return rawValues;
  }, [metrics]);

  // Sub-histogram telemetry (3 highlighted goals)
  const milestonePulseBars = useMemo(
    () => [24, 38, 22, 62, 74, 48, 34, 82, 58, 66],
    []
  );

  // Determine the next actionable node for the selected constellation point
  const activeInspector = useMemo(() => {
    const nextMath: RoadmapNode | undefined =
      ROADMAP_NODES.find((n) => n.subject === 'math' && !completedNodeIds.includes(n.id)) ||
      ROADMAP_NODES.find((n) => n.subject === 'math');
    const nextPhys: RoadmapNode | undefined =
      ROADMAP_NODES.find((n) => n.subject === 'physics' && !completedNodeIds.includes(n.id)) ||
      ROADMAP_NODES.find((n) => n.subject === 'physics');
    const nextCs: RoadmapNode | undefined =
      ROADMAP_NODES.find((n) => n.subject === 'cs' && !completedNodeIds.includes(n.id)) ||
      ROADMAP_NODES.find((n) => n.subject === 'cs');

    switch (activeGraphNodeId) {
      case 'math_pillar':
        return {
          title: isEn ? 'Mathematics · 2D Calculus & Oxyz 3D' : 'Toán Học · Giải Tích 2D & Không Gian Oxyz',
          metric: `${metrics.mathDone}/${metrics.mathTotal} (${metrics.mathPct}%)`,
          desc: isEn
            ? `Current priority milestone: ${nextMath?.titleEn || 'Logarithms & 3D Geometry'}`
            : `Chặng đề xuất tiếp theo: ${nextMath?.title || 'Khảo sát Hàm số & Tọa độ Oxyz'}`,
          ctaLabel: isEn ? 'Open Math Lecture' : 'Học Bài Toán Đề Xuất',
          onLaunch: () => onOpenNodeLesson('math', nextMath?.targetLessonId),
          onInspect: () => nextMath && onSelectRoadmapNode(nextMath.id)
        };
      case 'physics_pillar':
        return {
          title: isEn
            ? `Physics · ${SIM_COUNTS.domainCount} Interactive Simulation Domains`
            : `Vật Lí · ${SIM_COUNTS.domainCount} Chuyên Đề Tương Tác 2D & 3D 60 FPS`,
          metric: `${metrics.physDone}/${metrics.physTotal} (${metrics.physPct}%)`,
          desc: isEn
            ? `${SIM_COUNTS.count2D} 2D Labs + ${SIM_COUNTS.count3D} 3D Labs. Recommended next: ${nextPhys?.titleEn || 'Harmonic Oscillation'}`
            : `${SIM_COUNTS.count2D} Lab 2D + ${SIM_COUNTS.count3D} Lab 3D. Chặng tiếp theo: ${nextPhys?.title || 'Dao động điều hòa & Mạch RLC'}`,
          ctaLabel: isEn ? 'Launch Physics Lab' : 'Vào Lab & Bài Vật Lí',
          onLaunch: () => onOpenNodeLesson('physics', nextPhys?.targetLessonId),
          onInspect: () => nextPhys && onSelectRoadmapNode(nextPhys.id)
        };
      case 'cs_pillar':
        return {
          title: isEn
            ? 'Computer Science · 5 Full Learning Paths'
            : 'Tin Học · 5 Lộ Trình Chuẩn Quốc Tế & VNOI',
          metric: `VNOI ${CS_LESSONS.length} bài · 4 Tracks (${metrics.csTrackDone}/${metrics.totalTrackStages})`,
          desc: isEn
            ? 'Includes VNOI Roadmap (12 lessons) + 4 newly added C++ Tracks: OpenEDG Certification, Roadmap.sh, LearnCpp.com & GitHub Career (18 stages).'
            : 'Bao gồm VNOI Roadmap (12 bài) + 4 lộ trình mới lên: OpenEDG Certificate, Roadmap.sh C++ Dev, LearnCpp.com & GitHub Career Track (18 chặng).',
          ctaLabel: isEn ? 'Open 5 CS Tracks' : 'Mở 5 Lộ Trình Tin Học',
          onLaunch: () => onOpenNodeLesson('cs', nextCs?.targetLessonId, 'openedg_cpp'),
          onInspect: () => nextCs && onSelectRoadmapNode(nextCs.id)
        };
      case 'gap_detector':
        return {
          title: isEn ? 'Syn AI Knowledge Gap Scanner' : 'Syn AI · Phân Tích Lỗ Hổng Từ Bài Giảng 5 Bước',
          metric: `${savedLessonSummaries.length} ${isEn ? 'evaluated' : 'bài đã lưu'}`,
          desc:
            metrics.weakTopics.length > 0
              ? isEn
                ? `Detected weak topic: ${metrics.weakTopics[0].lessonTitle} (${metrics.weakTopics[0].overallMastery}%).`
                : `Phát hiện chuyên đề cần vá ngay: ${metrics.weakTopics[0].lessonTitle} (${metrics.weakTopics[0].overallMastery}%).`
              : isEn
              ? 'No critical gaps yet — complete 2 MCQs & 1 essay inside any lecture to auto-calibrate.'
              : 'Chưa có lỗ hổng nghiêm trọng — làm 2 câu trắc nghiệm + 1 tự luận nhỏ trong bài giảng để AI hiệu chỉnh.',
          ctaLabel: isEn ? 'Run Syn AI Diagnosis' : 'Chẩn Đoán Bằng Syn AI',
          onLaunch: () =>
            onOpenDiagnosticAI(
              metrics.weakTopics[0]?.subject || 'math',
              metrics.weakTopics[0]?.lessonTitle
            ),
          onInspect: () => nextMath && onSelectRoadmapNode(nextMath.id)
        };
      case 'practice_labs':
        return {
          title: isEn ? 'Synapse Pre · Spatial 3D & Sublime Judge' : 'Thực Hành Trực Quan · Synapse Pre & Cảm Giác 3D',
          metric: '30 Công trình · 15 Mô hình 3D · 16 Algos',
          desc: isEn
            ? 'Reinforce abstract concepts via 10-finger 3D manipulation, 2D freehand drawing, and Sublime Text 4 C++/Python grading.'
            : 'Củng cố trực giác bằng 30 đại công trình tương lai Synapse Pre, 10 đầu ngón tay + vẽ 2D tự do và chấm code Sublime Text 4.',
          ctaLabel: isEn ? 'Open Spatial 3D Lab' : 'Mở Học Cảm Giác 3D',
          onLaunch: () => onNavigateSubject('spatial_3d'),
          onInspect: () => nextPhys && onSelectRoadmapNode(nextPhys.id)
        };
      case 'mastery_goal':
        return {
          title: isEn ? `Goal Calibration · ${activePlanGrade}` : `Đích Thông Thạo · ${activePlanGrade}`,
          metric: `${metrics.readinessOutOfTen} / 10.0`,
          desc: isEn
            ? `${activePlanHoursPerWeek}h/week pace synced across Weekly Arena & ${ROADMAP_NODES.length} milestone nodes.`
            : `Nhịp độ ${activePlanHoursPerWeek} giờ/tuần đồng bộ trực tiếp với Đấu Trường Tuần & ${ROADMAP_NODES.length} chặng kiến thức.`,
          ctaLabel: isEn ? 'Test in Weekly Arena' : 'Thử Sức Đấu Trường Tuần',
          onLaunch: () => onNavigateSubject('arena'),
          onInspect: () => nextCs && onSelectRoadmapNode(nextCs.id)
        };
      default:
        return {
          title: isEn ? `Learner Vector · ${activePlanGrade}` : `Hồ Sơ Năng Lực · ${activePlanGrade}`,
          metric: `${completedNodeIds.length}/${ROADMAP_NODES.length} ${isEn ? 'nodes' : 'chặng'}`,
          desc: isEn
            ? `${Object.keys(aiRoadmaps).length} Syn AI custom trees synced + ${savedLessonSummaries.length} lesson scores tracked.`
            : `Đã đồng bộ ${Object.keys(aiRoadmaps).length} cây lộ trình Syn AI & ${savedLessonSummaries.length} điểm bài giảng chi tiết.`,
          ctaLabel: isEn ? 'Launch Syn AI Mode 3' : 'Vẽ Sơ Đồ Với Syn AI',
          onLaunch: () => onOpenDiagnosticAI('math'),
          onInspect: () => nextMath && onSelectRoadmapNode(nextMath.id)
        };
    }
  }, [
    activeGraphNodeId,
    isEn,
    metrics,
    completedNodeIds,
    savedLessonSummaries,
    activePlanGrade,
    activePlanHoursPerWeek,
    aiRoadmaps,
    onOpenNodeLesson,
    onSelectRoadmapNode,
    onOpenDiagnosticAI,
    onNavigateSubject
  ]);

  const gaugeItems = [
    {
      labelVi: 'Phủ Chặng (%)',
      labelEn: 'Coverage',
      valText: `${metrics.overallRoadmapPct}%`,
      pct: Math.max(8, metrics.overallRoadmapPct),
      color: '#22d3ee'
    },
    {
      labelVi: 'Tin 5 Lộ Trình',
      labelEn: 'CS 5 Paths',
      valText: `${metrics.csTrackDone}/${metrics.totalTrackStages}`,
      pct: Math.max(12, metrics.csTrackPct),
      color: '#34d399'
    },
    {
      labelVi: 'Sẵn Sàng Thi',
      labelEn: 'Readiness',
      valText: metrics.readinessOutOfTen.toFixed(2),
      pct: Math.min(100, Math.round(metrics.readinessOutOfTen * 10)),
      color: '#38bdf8'
    }
  ];

  const getNodeToneClasses = (tone: GraphNodeDef['tone'], selected: boolean) => {
    const map = {
      cyan: selected
        ? 'bg-cyan-500/30 border-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.55)] text-white'
        : 'bg-cyan-950/90 border-cyan-400/70 hover:border-cyan-300 text-cyan-100 shadow-[0_0_16px_rgba(6,182,212,0.28)]',
      sky: selected
        ? 'bg-sky-500/35 border-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.55)] text-white'
        : 'bg-sky-950/90 border-sky-400/70 hover:border-sky-300 text-sky-100 shadow-[0_0_16px_rgba(14,165,233,0.28)]',
      amber: selected
        ? 'bg-amber-500/30 border-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.5)] text-white'
        : 'bg-amber-950/85 border-amber-400/65 hover:border-amber-300 text-amber-100 shadow-[0_0_16px_rgba(245,158,11,0.24)]',
      emerald: selected
        ? 'bg-emerald-500/30 border-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.55)] text-white'
        : 'bg-emerald-950/90 border-emerald-400/70 hover:border-emerald-300 text-emerald-100 shadow-[0_0_16px_rgba(16,185,129,0.28)]',
      violet: selected
        ? 'bg-violet-500/35 border-violet-300 shadow-[0_0_24px_rgba(167,139,250,0.55)] text-white'
        : 'bg-violet-950/90 border-violet-400/70 hover:border-violet-300 text-violet-100 shadow-[0_0_16px_rgba(139,92,246,0.28)]',
      indigo: selected
        ? 'bg-indigo-500/35 border-indigo-300 shadow-[0_0_24px_rgba(129,140,248,0.55)] text-white'
        : 'bg-indigo-950/90 border-indigo-400/70 hover:border-indigo-300 text-indigo-100 shadow-[0_0_16px_rgba(99,102,241,0.28)]'
    };
    return map[tone];
  };

  return (
    <section
      aria-label={isEn ? 'Smart Knowledge Map HUD' : 'Bản Đồ Tri Thức Thông Minh'}
      className="sci-frame kmap-laser-scan relative rounded-md bg-[#060d1c] border border-cyan-500/35 text-slate-100 shadow-[0_26px_70px_-20px_rgba(6,182,212,0.32)] overflow-hidden"
    >
      {/* Subtle HUD Coordinate Blueprint Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(56, 189, 248, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.14) 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      {/* Top HUD Command Bar */}
      <div className="relative z-10 px-4 sm:px-6 py-3.5 bg-[#091429]/95 border-b border-cyan-500/25 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-md bg-cyan-500/15 border border-cyan-400/45 flex items-center justify-center text-cyan-300 shrink-0">
            <GitBranch className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-cyan-300">
              <span className="syn-live-square bg-cyan-400" />
              <span>{isEn ? 'REAL-TIME ADAPTIVE TELEMETRY' : 'BẢN ĐỒ TRI THỨC THÔNG MINH · SYNAPSE HUD'}</span>
            </div>
            <h2 className="font-display text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
              {isEn
                ? 'AI Adaptive Knowledge Map (Math · Physics · 5 CS Tracks)'
                : 'Sơ Đồ Liên Kết Tri Thức Thích Ứng · Toán · Vật Lí · 5 Lộ Trình Tin Học'}
            </h2>
          </div>
        </div>

        {/* Focus Filters + Quick Syn AI Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-md bg-slate-950/90 border border-slate-700/80">
            {(
              [
                { id: 'all', vi: 'Tất cả', en: 'All' },
                { id: 'math', vi: 'Toán', en: 'Math' },
                { id: 'physics', vi: 'Lí', en: 'Physics' },
                { id: 'cs', vi: 'Tin (5 Lộ trình)', en: 'CS (5 Paths)' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFocusFilter(tab.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  focusFilter === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isEn ? tab.en : tab.vi}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenDiagnosticAI('math')}
            className="cs-deck-btn px-3 py-1.5 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isEn ? 'Syn AI Auto-Calibrate' : 'Syn AI Chẩn Đoán'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Cybernetic Telemetry Grid */}
      <div className="relative z-10 p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* LEFT COLUMN (3 cols): Real-Time Vector Bars + Weekly Load + Core Readiness Ring */}
        <div className="xl:col-span-3 space-y-4">
          {/* Vector Mastery Histogram */}
          <div className="rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                {isEn ? 'Vector Analytics' : 'Phân Tích Năng Lực'}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 tabular-nums">
                {ROADMAP_NODES.length} NODES
              </span>
            </div>

            <div className="h-28 flex items-end gap-1.5 pt-2 border-b border-slate-700/70 pb-1">
              {analyticsHistogram.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div
                    className="w-full rounded-t-[2px] transition-all duration-500 group-hover:brightness-125"
                    style={{
                      height: `${Math.max(14, val)}%`,
                      background:
                        idx % 3 === 0
                          ? 'linear-gradient(to top, #0284c7, #22d3ee)'
                          : idx % 3 === 1
                          ? 'linear-gradient(to top, #4f46e5, #818cf8)'
                          : 'linear-gradient(to top, #059669, #34d399)'
                    }}
                    title={`${val}%`}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tabular-nums">
              <span>TOÁN {metrics.mathPct}%</span>
              <span>LÍ {metrics.physPct}%</span>
              <span>TIN {metrics.csPct}%</span>
            </div>
          </div>

          {/* Goal Progress Strip */}
          <div className="rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                {isEn ? 'Mastery Target' : 'Độ Phủ Mục Tiêu'}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/35 font-mono font-bold text-cyan-300 tabular-nums">
                {metrics.overallRoadmapPct}%
              </span>
            </div>

            <div className="h-14 flex items-end gap-1">
              {milestonePulseBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i === 3 || i === 7 ? '#22d3ee' : 'rgba(56,189,248,0.28)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Compact AI Readiness Dial */}
          <div className="rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle
                  cx="40"
                  cy="40"
                  r="33"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="5"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="33"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 33}
                  strokeDashoffset={2 * Math.PI * 33 * (1 - metrics.avgLessonMastery / 100)}
                  transform="rotate(-90 40 40)"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="24"
                  fill="none"
                  stroke="#38bdf8"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  className="kmap-core-orbit"
                />
              </svg>
              <span className="absolute font-mono text-xs font-extrabold text-cyan-300">
                AI
              </span>
            </div>
            <div className="min-w-0 space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300">
                {isEn ? 'Neural Sync' : 'Đồng Bộ Năng Lực'}
              </div>
              <div className="text-lg font-mono font-extrabold text-white tabular-nums">
                {metrics.avgLessonMastery}%
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {isEn ? 'Synced across 5-step lectures' : 'Tổng hợp từ bài tập 5 bước'}
              </p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (6 cols): Interactive Node Constellation Graph + Performance Curve & 3 AI Gauges */}
        <div className="xl:col-span-6 space-y-4">
          {/* Interactive Constellation Node Matrix */}
          <div className="relative rounded-md bg-[#071124] border border-cyan-500/35 p-3 sm:p-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-[11px] font-mono">
              <span className="text-cyan-300 font-bold">
                {isEn
                  ? 'NEURAL TOPOLOGY · CLICK ANY NODE TO INSPECT'
                  : 'MẠNG NƠ-RON KIẾN THỨC · BẤM VÀO NÚT ĐỂ MỞ CHI TIẾT'}
              </span>
              <span className="text-slate-400 tabular-nums">
                {completedNodeIds.length}/{ROADMAP_NODES.length} CHẶNG · 5 LỘ TRÌNH TIN
              </span>
            </div>

            {/* Graph Canvas (Responsive 1000x280 coordinate space) */}
            <div className="relative w-full h-[270px] sm:h-[295px] rounded bg-[#050c1b] border border-slate-800/90 overflow-hidden">
              <svg
                viewBox="0 0 1000 280"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <filter id="kmapGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {GRAPH_STREAMS.map((stream) => {
                  const dimmed =
                    focusFilter !== 'all' &&
                    stream.subjectTag &&
                    stream.subjectTag !== focusFilter;
                  const lines = Array.from({ length: stream.count });
                  return (
                    <g key={stream.id} opacity={dimmed ? 0.16 : 0.92}>
                      {lines.map((_, lineIdx) => {
                        const offsetY = (lineIdx - (stream.count - 1) / 2) * 5;
                        return (
                          <g key={lineIdx} transform={`translate(0, ${offsetY})`}>
                            <path
                              d={stream.d}
                              fill="none"
                              stroke={stream.color}
                              strokeOpacity="0.22"
                              strokeWidth="1.5"
                            />
                            <path
                              d={stream.d}
                              fill="none"
                              stroke={stream.color}
                              strokeWidth={lineIdx === 0 ? '2' : '1.25'}
                              filter="url(#kmapGlow)"
                              className={stream.reverse ? 'kmap-packet-flow-rev' : 'kmap-packet-flow'}
                              style={{ animationDelay: `${lineIdx * 180}ms` }}
                            />
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* Junction Hub Triangle Symbol matching telemetry map */}
                <g transform="translate(715, 165)">
                  <circle cx="0" cy="0" r="11" fill="#091428" stroke="#38bdf8" strokeWidth="1.6" />
                  <polygon points="-4,4 0,-5 4,4" fill="#22d3ee" />
                </g>
              </svg>

              {/* Clickable Constellation Nodes */}
              {GRAPH_NODES.map((node) => {
                const isSelected = activeGraphNodeId === node.id;
                const dimmed =
                  focusFilter !== 'all' &&
                  node.subjectTag &&
                  node.subjectTag !== focusFilter;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveGraphNodeId(node.id)}
                    style={{
                      left: `${node.xPct}%`,
                      top: `${node.yPct}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`absolute z-10 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md border text-left transition-all duration-200 cursor-pointer max-w-[148px] sm:max-w-[175px] ${getNodeToneClasses(
                      node.tone,
                      isSelected
                    )} ${dimmed ? 'opacity-30' : 'opacity-100 hover:scale-105'}`}
                  >
                    <div className="text-[10px] sm:text-[11px] font-bold leading-tight truncate">
                      {isEn ? node.labelEn : node.labelVi}
                    </div>
                    <div className="text-[9px] font-mono opacity-80 truncate mt-0.5">
                      {isEn ? node.subEn : node.subVi}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Selected Node Action Strip */}
            <div className="mt-3 rounded-md bg-slate-900/95 border border-cyan-500/30 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white">{activeInspector.title}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-400/35 text-[10px] font-mono font-bold text-cyan-300 tabular-nums">
                    {activeInspector.metric}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                  {activeInspector.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={activeInspector.onInspect}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
                >
                  {isEn ? 'Highlight Node' : 'Soi chặng dưới'}
                </button>
                <button
                  type="button"
                  onClick={activeInspector.onLaunch}
                  className="cs-deck-btn px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3 h-3" />
                  <span>{activeInspector.ctaLabel}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Split: Performance Trajectory Area Chart + 3 Radial Telemetry Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Performance Area Chart */}
            <div className="md:col-span-5 rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {isEn ? 'Performance Curve' : 'Biểu Đồ Tiến Bộ'}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 tabular-nums">
                  AVG {metrics.avgLessonMastery}%
                </span>
              </div>

              <svg viewBox="0 0 320 118" className="w-full h-28 overflow-visible" aria-hidden="true">
                <defs>
                  <linearGradient id="kmapAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <line x1="12" y1="30" x2="308" y2="30" stroke="#1e293b" strokeDasharray="3 4" />
                <line x1="12" y1="65" x2="308" y2="65" stroke="#1e293b" strokeDasharray="3 4" />
                <line x1="12" y1="100" x2="308" y2="100" stroke="#1e293b" />
                <path d={trajectoryCurve.areaPath} fill="url(#kmapAreaFill)" />
                <path
                  d={trajectoryCurve.linePath}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {trajectoryCurve.pts.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={idx === trajectoryCurve.pts.length - 1 ? 3.8 : 2.2}
                    fill="#67e8f9"
                  />
                ))}
              </svg>
            </div>

            {/* 3 AI Algorithm Telemetry Gauges */}
            <div className="md:col-span-7 rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  {isEn ? 'AI Algorithm Telemetry' : 'Chỉ Số Thuật Toán Lộ Trình'}
                </span>
                <span className="text-[10px] font-mono text-emerald-300">LIVE SYNC</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {gaugeItems.map((g, idx) => {
                  const r = 28;
                  const c = 2 * Math.PI * r;
                  const off = c * (1 - g.pct / 100);
                  return (
                    <div key={idx} className="flex flex-col items-center text-center gap-1.5">
                      <div className="relative w-18 h-18 flex items-center justify-center">
                        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                          <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="5.5" />
                          <circle
                            cx="36"
                            cy="36"
                            r={r}
                            fill="none"
                            stroke={g.color}
                            strokeWidth="5.5"
                            strokeLinecap="round"
                            strokeDasharray={c}
                            strokeDashoffset={off}
                            className="transition-all duration-700"
                          />
                        </svg>
                        <span className="absolute font-mono text-[11px] font-extrabold text-white tabular-nums">
                          {g.valText}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300 leading-tight">
                        {isEn ? g.labelEn : g.labelVi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (3 cols): Discipline Bars + Dual-Ring AI Core + 7-Day Velocity Matrix */}
        <div className="xl:col-span-3 space-y-4">
          {/* Subject & 5-Track CS Breakdown */}
          <div className="rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                {isEn ? 'Domain Coverage' : 'Tiến Độ Theo Chuyên Ngành'}
              </span>
              <span className="text-[10px] font-mono text-cyan-300">5 CS TRACKS</span>
            </div>

            {[
              {
                label: isEn ? 'Mathematics' : 'Toán 2D/Oxyz',
                pct: metrics.mathPct,
                color: 'bg-sky-400',
                subj: 'math' as const
              },
              {
                label: isEn ? 'Physics Labs' : 'Vật lí 5 Chuyên đề',
                pct: metrics.physPct,
                color: 'bg-amber-400',
                subj: 'physics' as const
              },
              {
                label: isEn ? 'CS · VNOI' : `Tin · VNOI (${CS_LESSONS.length} bài)`,
                pct: metrics.csPct,
                color: 'bg-emerald-400',
                subj: 'cs' as const
              },
              {
                label: isEn ? 'CS · 4 C++ Tracks' : 'Tin · 4 Tracks C++ (18)',
                pct: metrics.csTrackPct,
                color: 'bg-cyan-400',
                subj: 'cs' as const
              }
            ].map((row, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onOpenNodeLesson(row.subj, undefined, idx === 3 ? 'openedg_cpp' : undefined)}
                className="w-full text-left group cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 group-hover:text-cyan-300 transition-colors truncate">
                    {row.label}
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">{row.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-sm bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${row.color} transition-all duration-500`}
                    style={{ width: `${Math.max(6, row.pct)}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Syn AI Rotating Dual-Ring Diagnostics Core */}
          <div className="rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {isEn ? 'Syn AI Recommendations' : 'Lõi Điều Phối Syn AI'}
              </span>
              <span className="text-[10px] font-mono text-emerald-300">ACTIVE</span>
            </div>

            <div className="flex items-center justify-center py-1">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg viewBox="0 0 110 110" className="w-full h-full">
                  <circle
                    cx="55"
                    cy="55"
                    r="48"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeOpacity="0.35"
                    strokeWidth="2"
                    strokeDasharray="18 8 6 8"
                    className="kmap-core-orbit"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="38"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="4.5"
                    strokeDasharray="48 18 28 18"
                    strokeLinecap="round"
                    className="kmap-core-orbit-rev"
                  />
                  <circle cx="55" cy="55" r="26" fill="#071329" stroke="#38bdf8" strokeOpacity="0.45" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-sm font-extrabold text-white tracking-wide">AI</span>
                  <span className="text-[9px] font-mono text-cyan-300">SYN-V3</span>
                </div>
              </div>
            </div>

            {/* Micro Recommendation Telemetry Rows */}
            <div className="space-y-1.5 text-[11px]">
              {metrics.weakTopics.length > 0 ? (
                metrics.weakTopics.map((wt) => (
                  <button
                    key={wt.lessonKey}
                    type="button"
                    onClick={() => onOpenNodeLesson(wt.subject, wt.lessonKey)}
                    className="w-full px-2.5 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/35 text-left flex items-center justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5 min-w-0 text-amber-200 truncate">
                      <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                      <span className="truncate">{wt.lessonTitle}</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-amber-300 tabular-nums shrink-0">
                      {wt.overallMastery}%
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-2.5 py-1.5 rounded bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {isEn
                      ? 'Optimal pace — keep unlocking milestones!'
                      : 'Nhịp độ ổn định — tiếp tục mở khóa chặng mới!'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Weekly Velocity Chart */}
          <div className="rounded-md bg-[#0a162d]/90 border border-cyan-500/25 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                {isEn ? '7-Day Velocity' : 'Cường Độ Tuần (7 Ngày)'}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 tabular-nums">
                {activePlanHoursPerWeek}h/wk
              </span>
            </div>

            <div className="h-14 flex items-end gap-1.5 pt-1">
              {dailyStudyMinutes.map((d, idx) => {
                const maxMin = Math.max(60, ...dailyStudyMinutes.map((x) => x.totalMinutes));
                const hPct = Math.max(15, Math.round((d.totalMinutes / maxMin) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full rounded-t-[2px] bg-gradient-to-t from-sky-600 to-cyan-300"
                      style={{ height: `${hPct}%` }}
                      title={`${d.dayLabel}: ${d.totalMinutes}p`}
                    />
                    <span className="text-[9px] font-mono text-slate-400">
                      {d.dayLabel.replace('Thứ ', 'T').replace('Chủ nhật', 'CN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
