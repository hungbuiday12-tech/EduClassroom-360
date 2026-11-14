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
  Sparkles,
  Trophy,
  Zap,
  Code2,
  BookOpen
} from 'lucide-react';
import { PersonalizedRoadmapResult, RoadmapNode, SubjectType, TutorContextPayload } from '../../types';
import { ROADMAP_NODES, WORKFLOW_STAGES } from '../../data/roadmapData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
import { db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from '../../lib/firebase';
import { AI_ROADMAPS_STORAGE_KEY } from '../tutor/SocraticAITutor';

interface LearningRoadmapProps {
  onBack: () => void;
  onNavigateSubject: (subject: SubjectType) => void;
  onOpenTutor: (ctx: TutorContextPayload) => void;
  onEarnXP?: (xp: number) => void;
}

const LOCAL_ROADMAP_KEY = 'educlassroom_roadmap_completed_v1';

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  onBack,
  onNavigateSubject,
  onOpenTutor,
  onEarnXP
}) => {
  const { user, firebaseUser } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'math' | 'physics' | 'cs'>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(ROADMAP_NODES[0].id);

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

  const filteredNodes = useMemo(() => {
    return ROADMAP_NODES.filter((n) => {
      const matchSubj = subjectFilter === 'all' || n.subject === subjectFilter;
      const matchGrade = gradeFilter === 'all' || n.grade === gradeFilter;
      return matchSubj && matchGrade;
    });
  }, [subjectFilter, gradeFilter]);

  const activeNode =
    ROADMAP_NODES.find((n) => n.id === selectedNodeId) || filteredNodes[0] || ROADMAP_NODES[0];

  const activeStage = WORKFLOW_STAGES[activeStageIdx] || WORKFLOW_STAGES[0];
  const progressPercent = Math.round((completedNodeIds.length / ROADMAP_NODES.length) * 100);

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
                ? 'Procedural Learning Roadmap (Grades 9–12)'
                : 'Bản Đồ Hướng Dẫn Học Tập Theo Qui Trình (Lớp 9 – 12)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {isEn
                ? 'Follow the 5-step mastery loop and connected subject path from foundational concepts to weekly arena competitions.'
                : 'Đi theo qui trình 5 bước khép kín cho từng chuyên đề và sơ đồ cây kiến thức liên môn Toán · Lí · Tin từ nền tảng đến Thi đấu tuần.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{isEn ? 'Overall Mastery' : 'Tiến độ lộ trình'}</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {completedNodeIds.length}/{ROADMAP_NODES.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={() =>
                onOpenTutor({
                  subject: activeNode.subject,
                  mode: 'diagnostic_roadmap',
                  topicTitle: activeNode.title,
                  grade: activeNode.grade
                })
              }
              className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'AI Mode 3: Build My Roadmap' : 'AI Chế Độ 3: Tạo Sơ Đồ Riêng'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PERSONALIZED AI ROADMAPS FROM MODE 3 (IF CREATED) */}
      {Object.values(aiRoadmaps).some(Boolean) && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-300/70 dark:border-emerald-800/70 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
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
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
            >
              {isEn ? 'Re-assess with AI →' : 'Đánh giá lại với AI →'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['math', 'physics', 'cs'] as const).map((subj) => {
              const rm = aiRoadmaps[subj];
              if (!rm) return null;
              return (
                <div
                  key={subj}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between"
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
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold hover:opacity-90 transition-opacity"
                  >
                    {isEn ? 'View Full Flowchart' : 'Mở Sơ Đồ Chi Tiết'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 1: 5-STEP PROCEDURAL LEARNING WORKFLOW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {isEn ? '01. Standard 5-Step Study Workflow' : '01. Qui Trình Học Tập Chuẩn 5 Bước Cho Mỗi Bài'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Click each step in the flow diagram below to inspect concrete study actions and launch tools directly.'
                : 'Bấm vào từng bước trên sơ đồ qui trình bên dưới để xem hướng dẫn thực hiện và mở nhanh công cụ tương ứng.'}
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            ~70 {isEn ? 'min / full cycle' : 'phút / chu trình trọn vẹn'}
          </span>
        </div>

        {/* Connected 5-step horizontal diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isActive = activeStageIdx === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIdx(idx)}
                className={`relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    0{stage.stepNumber}
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

        {/* Active Stage Detail Card */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
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

          <div className="shrink-0 flex flex-wrap gap-2">
            {activeStage.id === 'tutor' ? (
              <button
                onClick={() =>
                  onOpenTutor({
                    subject: activeNode.subject,
                    topicTitle: activeNode.title,
                    grade: activeNode.grade
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEn ? 'Open Socratic AI Tutor' : 'Mở Gia Sư AI Ngay'}</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateSubject(activeStage.targetSubject)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold flex items-center gap-2 transition-colors"
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
          </div>
        </div>
      </div>

      {/* Next Recommended Milestone Banner */}
      <div className="bg-slate-900 dark:bg-indigo-950/60 border border-slate-800 dark:border-indigo-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-indigo-300 font-semibold">
            {isEn ? 'Recommended Next Step' : 'Đề xuất chặng tiếp theo dành cho bạn'} · {getSubjectName(recommendedNextNode.subject)} · {recommendedNextNode.grade}
          </div>
          <div className="text-sm sm:text-base font-bold">{recommendedNextNode.title}</div>
        </div>
        <button
          onClick={() => setSelectedNodeId(recommendedNextNode.id)}
          className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shrink-0 flex items-center gap-1.5"
        >
          <span>{isEn ? 'Inspect Step' : 'Xem hướng dẫn chặng này'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION 2: INTERACTIVE SUBJECT ROADMAP TREE + INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Connected Nodes Timeline */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{isEn ? '02. Curriculum Skill Tree' : '02. Sơ Đồ Tuyến Kiến Thức Tiên Quyết'}</span>
            </h2>

            {/* Segmented Subject Filter */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
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
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
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

          {/* Connected Vertical Flow Nodes */}
          <div className="relative pl-6 space-y-3">
            {/* Vertical Connector Line */}
            <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

            {filteredNodes.map((node) => {
              const isCompleted = completedNodeIds.includes(node.id);
              const isSelected = activeNode.id === node.id;
              const prereqMet = node.prerequisites.every((p) => completedNodeIds.includes(p));

              return (
                <div key={node.id} className="relative">
                  {/* Connector Dot */}
                  <button
                    onClick={() => toggleNodeComplete(node)}
                    title={isCompleted ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã thông thạo (+30 XP)'}
                    className={`absolute -left-6 top-4 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 hover:border-indigo-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />}
                  </button>

                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`ml-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500'
                        : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
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
                        <span className="tabular-nums">{node.estimatedMinutes}p</span>
                      </div>
                      <span
                        className={`font-semibold ${
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
            })}
          </div>
        </div>

        {/* Right: Step Execution Inspector */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                {getSubjectIcon(activeNode.subject)}
                <span className="font-semibold">{getSubjectName(activeNode.subject)}</span>
                <span aria-hidden="true">·</span>
                <span>{activeNode.grade}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
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
                        className="w-full text-left flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-400"
                      >
                        <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                          {preNode.title}
                        </span>
                        <span className={done ? 'text-emerald-600 font-semibold shrink-0 ml-2' : 'text-amber-600 font-semibold shrink-0 ml-2'}>
                          {done ? '✓ Xong' : 'Chưa xong'}
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
                <span>{isEn ? 'How to Practice on EduClassroom 360:' : 'Cách thực hành đúng qui trình:'}</span>
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
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <FormattedText text={q} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateSubject(activeNode.subject)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Open Subject Lesson' : 'Vào Học Chặng Này'}</span>
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
                  className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Ask AI Tutor' : 'Hỏi Gia Sư AI'}</span>
                </button>
              </div>

              <button
                onClick={() => toggleNodeComplete(activeNode)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border ${
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
                  ? 'Progress saved locally. Sign in to sync across devices.'
                  : 'Tiến độ đang lưu trên trình duyệt. Đăng nhập để đồng bộ lên đám mây.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Arena CTA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
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
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <span>{isEn ? 'Enter Weekly Arena' : 'Vào Đấu Trường Tuần'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
