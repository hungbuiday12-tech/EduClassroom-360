import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Image as ImageIcon,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Compass,
  Zap,
  Code2,
  CheckCircle2,
  GitBranch,
  Target,
  Clock,
  ArrowRight,
  BrainCircuit,
  FileCheck2
} from 'lucide-react';
import {
  AITutorMode,
  DiagnosticQuestion,
  PersonalizedRoadmapResult,
  SubjectType,
  TutorContextPayload,
  TutorMessage
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
import { ViewportPortal } from '../common/ViewportPortal';
import { safeFetchJson } from '../../lib/apiClient';

export const AI_ROADMAPS_STORAGE_KEY = 'educlassroom_ai_roadmaps_v1';

type AISubjectKey = 'math' | 'physics' | 'cs';

interface SocraticAITutorProps {
  isOpen: boolean;
  onClose: () => void;
  context: TutorContextPayload;
  onChangeSubject?: (subj: SubjectType) => void;
  onNavigateSubject?: (subj: SubjectType) => void;
}

const MAJOR_OPTIONS_VI = [
  'CNTT, Trí tuệ nhân tạo & Khoa học dữ liệu',
  'Kỹ thuật, Cơ điện tử, Điện - Tự động hóa',
  'Kinh tế, Tài chính định lượng & Quản trị',
  'Khoa học Tự nhiên / Chuyên - Học sinh Giỏi',
  'Y - Dược / Công nghệ Sinh học'
];

const MAJOR_OPTIONS_EN = [
  'Computer Science, AI & Data Science',
  'Engineering, Mechatronics & Automation',
  'Economics, Quantitative Finance & Management',
  'Natural Sciences / Olympiad & Gifted Track',
  'Medicine, Pharmacy & Biotechnology'
];

function normalizeSubject(subj?: SubjectType): AISubjectKey {
  if (subj === 'physics' || subj === 'cs') return subj;
  return 'math';
}

export const SocraticAITutor: React.FC<SocraticAITutorProps> = ({
  isOpen,
  onClose,
  context,
  onChangeSubject,
  onNavigateSubject
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [activeSubject, setActiveSubject] = useState<AISubjectKey>(() => normalizeSubject(context.subject));
  const [activeMode, setActiveMode] = useState<AITutorMode>(() => context.mode || 'explain_no_answer');

  const getAiPersonaMeta = (subj: AISubjectKey) => {
    if (subj === 'physics') {
      return {
        nameVi: 'AI Vật Lí',
        nameEn: 'Physics AI',
        badgeVi: 'Cơ · Điện · Quang · Lượng tử',
        badgeEn: 'Mechanics · Optics · Quantum',
        colorClass: 'bg-amber-600 text-white border-amber-500',
        softClass: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
        icon: <Zap className="w-3.5 h-3.5" />
      };
    }
    if (subj === 'cs') {
      return {
        nameVi: 'AI Tin Học',
        nameEn: 'CS & Code AI',
        badgeVi: 'Thuật toán · C++ · Python',
        badgeEn: 'Algorithms · C++ · Python',
        colorClass: 'bg-emerald-600 text-white border-emerald-500',
        softClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
        icon: <Code2 className="w-3.5 h-3.5" />
      };
    }
    return {
      nameVi: 'AI Toán Học',
      nameEn: 'Math AI',
      badgeVi: 'Đại số · Giải tích · Oxyz',
      badgeEn: 'Algebra · Calculus · Oxyz',
      colorClass: 'bg-indigo-600 text-white border-indigo-500',
      softClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30',
      icon: <Compass className="w-3.5 h-3.5" />
    };
  };

  const makeWelcomeMessage = (subj: AISubjectKey, mode: AITutorMode, ctx: TutorContextPayload): TutorMessage => {
    const meta = getAiPersonaMeta(subj);
    const subjName = isEn ? meta.nameEn : meta.nameVi;
    const topicPart = ctx.topicTitle ? (isEn ? ` on **${ctx.topicTitle}**` : ` ở chủ đề **${ctx.topicTitle}**`) : '';
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (mode === 'full_solution') {
      return {
        id: `welcome_${subj}_${mode}_${Date.now()}`,
        role: 'tutor',
        text: isEn
          ? `Hello! I am **${subjName} (Mode 2: Full Summary, Method & Detailed Solution)**${topicPart}.\n\nSend me your problem or photo: I will **summarize the givens, explain the best method, and provide the complete step-by-step solution & final answer**.`
          : `Chào em! Thầy/Cô là **${subjName} — Chế độ 2 (Tóm tắt · Cách làm · Lời giải cụ thể)**${topicPart}.\n\nHãy gửi đề bài hoặc ảnh chụp: Thầy/Cô sẽ **tóm tắt giả thiết, phân tích phương pháp giải và trình bày lời giải chi tiết đến đáp án cuối cùng**.`,
        timestamp
      };
    }

    if (mode === 'diagnostic_roadmap') {
      return {
        id: `welcome_${subj}_${mode}_${Date.now()}`,
        role: 'tutor',
        text: isEn
          ? `Hello! I am **${subjName} (Mode 3: Skill Diagnosis & Roadmap Architect)**.\n\nComplete the quick 5-question professional + major-track check above to generate your personalized **Study Flowchart**, or ask me any follow-up questions about your study plan below.`
          : `Chào em! Thầy/Cô là **${subjName} — Chế độ 3 (Đánh giá trình độ & Thiết kế Sơ đồ học tập)**.\n\nEm hãy làm bộ **5 câu hỏi chuyên môn + lựa chọn chuyên ngành** ngay phía trên để AI phân tích điểm mạnh/yếu và vẽ ra sơ đồ lộ trình riêng cho em nhé!`,
        timestamp
      };
    }

    return {
      id: `welcome_${subj}_${mode}_${Date.now()}`,
      role: 'tutor',
      text: isEn
        ? `Hello! I am **${subjName} (Mode 1: Clarify Doubts — No Final Answer)**${topicPart}.\n\nI will analyze the problem with you and explain any unclear step in detail, **without spoiling the final result**.\n\n**Which exact concept, formula, or step are you unsure about?**`
        : `Chào em! Thầy/Cô là **${subjName} — Chế độ 1 (Giải đáp thắc mắc · Không đưa kết quả)**${topicPart}.\n\nThầy/Cô sẽ phân tích đề và giảng thật cụ thể chỗ em chưa hiểu, nhưng **tuyệt đối không đưa ra đáp án cuối ngay** để em tự bứt phá tư duy.\n\n**Em hãy nói rõ em đang chưa hiểu cụ thể ở phần nào?** (Ví dụ: chưa hiểu đề hỏi gì, quên công thức nào, hay vướng ở bước biến đổi nào?)`,
      timestamp
    };
  };

  // Separate thread state per (subject, mode) so all 3 subject AIs & 3 modes keep clean history
  const [threads, setThreads] = useState<Record<string, TutorMessage[]>>({});
  const threadKey = `${activeSubject}_${activeMode}`;

  const currentMessages = threads[threadKey] || [makeWelcomeMessage(activeSubject, activeMode, context)];

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(null);

  // Mode 3 Diagnostic & Personalized Roadmap states (per subject)
  const [diagGrade, setDiagGrade] = useState<string>('Lớp 12');
  const [diagMajor, setDiagMajor] = useState<string>(() => (isEn ? MAJOR_OPTIONS_EN[0] : MAJOR_OPTIONS_VI[0]));
  const [diagSelfLevel, setDiagSelfLevel] = useState<string>('Khá');
  const [diagCustomGoal, setDiagCustomGoal] = useState<string>('');
  const [diagQuestionsBySubj, setDiagQuestionsBySubj] = useState<Record<AISubjectKey, DiagnosticQuestion[]>>({
    math: [],
    physics: [],
    cs: []
  });
  const [diagAnswersBySubj, setDiagAnswersBySubj] = useState<Record<AISubjectKey, Record<string, number>>>({
    math: {},
    physics: {},
    cs: {}
  });
  const [roadmapsBySubj, setRoadmapsBySubj] = useState<Partial<Record<AISubjectKey, PersonalizedRoadmapResult>>>(() => {
    try {
      const saved = localStorage.getItem(AI_ROADMAPS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [diagLoadingQuiz, setDiagLoadingQuiz] = useState(false);
  const [diagLoadingRoadmap, setDiagLoadingRoadmap] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (context.subject === 'math' || context.subject === 'physics' || context.subject === 'cs') {
      setActiveSubject(context.subject);
    }
    if (context.mode) {
      setActiveMode(context.mode);
    }
  }, [context.subject, context.mode]);

  useEffect(() => {
    if (context.topicTitle || context.problemStatement) {
      const s = normalizeSubject(context.subject);
      const m = context.mode || activeMode;
      const k = `${s}_${m}`;
      setThreads((prev) => ({
        ...prev,
        [k]: [makeWelcomeMessage(s, m, context)]
      }));
    }
  }, [context.topicTitle, context.problemStatement, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isLoading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  if (!isOpen) return null;

  const activeMeta = getAiPersonaMeta(activeSubject);
  const diagQuestions = diagQuestionsBySubj[activeSubject] || [];
  const diagAnswers = diagAnswersBySubj[activeSubject] || {};
  const activeRoadmap = roadmapsBySubj[activeSubject] || null;

  const quickChips =
    activeMode === 'explain_no_answer'
      ? isEn
        ? [
            'I do not understand what the problem is asking',
            'Which theorem or formula applies here?',
            'I am stuck on this middle step',
            'Is my starting direction correct?'
          ]
        : [
            'Em chưa hiểu đề bài đang hỏi gì',
            'Em chưa biết dùng công thức hay định lý nào',
            'Em bị kẹt ở bước biến đổi trung gian này',
            'Thầy/cô xem hướng làm em tự nghĩ đúng chưa'
          ]
      : activeMode === 'full_solution'
      ? isEn
        ? [
            'Summarize givens & show best method + full solution',
            'Solve step-by-step and state the final answer',
            'Write clean C++/Python solution with complexity'
          ]
        : [
            'Tóm tắt đề, nêu cách làm và giải chi tiết ra đáp số',
            'Giải thích từng bước biến đổi đến kết quả cuối',
            'Viết code C++ / Python chuẩn và phân tích độ phức tạp'
          ]
      : isEn
      ? [
          'Adjust my roadmap for 30 min/day',
          'Which exam track fits my major best?',
          'Suggest the next 3 key lessons to master'
        ]
      : [
          'Điều chỉnh sơ đồ xuống còn 30 phút/ngày',
          'Chuyên ngành này cần ưu tiên chuyên đề nào nhất?',
          'Gợi ý 3 bài học đầu tiên em nên mở ngay hôm nay'
        ];

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage({
        base64: String(reader.result || ''),
        mimeType: file.type || 'image/png'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? inputText).trim();
    if (!textToSend && !pendingImage) return;
    if (isLoading) return;

    const userMsg: TutorMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: textToSend || (isEn ? 'Here is the problem/step I uploaded:' : 'Đây là đề bài / bài làm em gửi lên:'),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      imagePreview: pendingImage?.base64
    };

    const nextHistory = [...currentMessages, userMsg];
    setThreads((prev) => ({ ...prev, [threadKey]: nextHistory }));
    if (!overrideText) setInputText('');
    const imageToSend = pendingImage;
    setPendingImage(null);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const apiMessages = nextHistory.map((m, idx) => ({
        role: m.role,
        text: m.text,
        ...(idx === nextHistory.length - 1 && imageToSend
          ? { imageBase64: imageToSend.base64, mimeType: imageToSend.mimeType }
          : {})
      }));

      const res = await safeFetchJson<{ success?: boolean; reply?: string; error?: string }>(
        '/api/gemini/tutor',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages,
            context: {
              ...context,
              subject: activeSubject,
              mode: activeMode
            },
            language
          })
        }
      );

      if (!res.ok || !res.data?.reply) {
        throw new Error(res.error || 'Lỗi phản hồi từ Trợ giảng AI');
      }

      const tutorMsg: TutorMessage = {
        id: `t_${Date.now()}`,
        role: 'tutor',
        text: res.data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setThreads((prev) => ({
        ...prev,
        [threadKey]: [...(prev[threadKey] || nextHistory), tutorMsg]
      }));
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể kết nối AI Trợ Giảng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (diagLoadingQuiz) return;
    setDiagLoadingQuiz(true);
    setDiagError(null);

    const res = await safeFetchJson<{ success?: boolean; questions?: DiagnosticQuestion[]; error?: string }>(
      '/api/gemini/diagnostic-quiz',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSubject,
          grade: diagGrade,
          targetMajor: diagMajor,
          selfLevel: diagSelfLevel,
          language
        })
      }
    );

    setDiagLoadingQuiz(false);

    if (!res.ok || !Array.isArray(res.data?.questions) || res.data.questions.length === 0) {
      setDiagError(res.error || 'Không thể tạo bộ câu hỏi đánh giá lúc này. Vui lòng thử lại.');
      return;
    }

    setDiagQuestionsBySubj((prev) => ({ ...prev, [activeSubject]: res.data!.questions! }));
    setDiagAnswersBySubj((prev) => ({ ...prev, [activeSubject]: {} }));
  };

  const handleBuildRoadmap = async () => {
    if (diagLoadingRoadmap || diagQuestions.length === 0) return;

    const unanswered = diagQuestions.some((q) => typeof diagAnswers[q.id] !== 'number');
    if (unanswered) {
      setDiagError(
        isEn
          ? 'Please select an answer for all 5 diagnostic & specialization questions.'
          : 'Em hãy chọn đầy đủ cả 5 câu chuyên môn & lựa chọn chuyên ngành trước khi tạo sơ đồ nhé.'
      );
      return;
    }

    setDiagLoadingRoadmap(true);
    setDiagError(null);

    const quizAnswers = diagQuestions.map((q) => {
      const selectedIndex = diagAnswers[q.id];
      return {
        id: q.id,
        category: q.category,
        topicTag: q.topicTag,
        question: q.question,
        selectedIndex,
        selectedOption: q.options[selectedIndex] || '',
        correctIndex: q.correctIndex,
        correctOption: typeof q.correctIndex === 'number' ? q.options[q.correctIndex] : undefined
      };
    });

    const res = await safeFetchJson<{ success?: boolean; roadmap?: PersonalizedRoadmapResult; error?: string }>(
      '/api/gemini/diagnostic-roadmap',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSubject,
          grade: diagGrade,
          targetMajor: diagMajor,
          quizAnswers,
          customGoal: diagCustomGoal,
          language
        })
      }
    );

    setDiagLoadingRoadmap(false);

    if (!res.ok || !res.data?.roadmap) {
      setDiagError(res.error || 'Không thể phân tích & tạo sơ đồ học tập lúc này.');
      return;
    }

    const createdRoadmap = res.data.roadmap;
    setRoadmapsBySubj((prev) => {
      const next = { ...prev, [activeSubject]: createdRoadmap };
      try {
        localStorage.setItem(AI_ROADMAPS_STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('educlassroom:roadmap-updated'));
      } catch {}
      return next;
    });
  };

  const handleReset = () => {
    setThreads((prev) => ({
      ...prev,
      [threadKey]: [makeWelcomeMessage(activeSubject, activeMode, { ...context, subject: activeSubject })]
    }));
    setErrorMsg(null);
    setPendingImage(null);
  };

  const handleSwitchSubject = (subj: AISubjectKey) => {
    setActiveSubject(subj);
    setErrorMsg(null);
    setDiagError(null);
    onChangeSubject?.(subj);
  };

  const modeTabs: { id: AITutorMode; shortVi: string; shortEn: string; descVi: string; descEn: string }[] = [
    {
      id: 'explain_no_answer',
      shortVi: '1. Giảng Chưa Hiểu (Không Đáp Án)',
      shortEn: '1. Guided Explain (No Answer)',
      descVi: 'Phân tích đề · Hỏi chỗ vướng · Giảng chi tiết từng bước (không đưa đáp án cuối)',
      descEn: 'Analyzes problem · Asks unclear step · Explains deeply without spoiling answer'
    },
    {
      id: 'full_solution',
      shortVi: '2. Tóm Tắt · Cách Làm · Lời Giải',
      shortEn: '2. Summary · Method · Full Solution',
      descVi: 'Tóm tắt giả thiết · Nêu phương pháp · Xuất lời giải + kết quả cụ thể',
      descEn: 'Summarizes problem · Explains method · Gives full solution & final answer'
    },
    {
      id: 'diagnostic_roadmap',
      shortVi: '3. Đánh Giá & Sơ Đồ Học Tập',
      shortEn: '3. Skill Check & Study Roadmap',
      descVi: 'Hỏi chuyên môn & chọn chuyên ngành → Phân tích năng lực → Vẽ sơ đồ học tập',
      descEn: 'Diagnostic + major choices → Skill analysis → Personalized study flowchart'
    }
  ];

  const activeModeMeta = modeTabs.find((m) => m.id === activeMode) || modeTabs[0];

  const tutorWindow = (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[115] w-screen h-[100dvh] bg-white dark:bg-slate-950 flex flex-col overflow-hidden'
          : 'fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[95] w-[calc(100vw-1.5rem)] sm:w-[490px] md:w-[540px] h-[min(690px,86dvh)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden'
      }
    >
      {/* Top Header */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back' : 'Thu gọn'}</span>
            </button>
          )}
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${activeMeta.softClass}`}>
            {activeMeta.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold truncate">
              {isEn ? `${activeMeta.nameEn} · 3-Mode Assistant` : `${activeMeta.nameVi} · Trợ Giảng 3 Chế Độ`}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              {isEn ? activeMeta.badgeEn : activeMeta.badgeVi}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isEn ? 'Reset current conversation' : 'Làm mới cuộc trò chuyện'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsFullscreen(false);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Dedicated Subject AI Switcher */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="grid grid-cols-3 gap-1.5 w-full">
          {(['math', 'physics', 'cs'] as AISubjectKey[]).map((subj) => {
            const meta = getAiPersonaMeta(subj);
            const selected = activeSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => handleSwitchSubject(subj)}
                className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                  selected
                    ? meta.colorClass
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                }`}
              >
                {meta.icon}
                <span>{isEn ? meta.nameEn : meta.nameVi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Pedagogical AI Modes Switcher */}
      <div className="px-3 py-2 bg-white dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 space-y-1.5 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {modeTabs.map((m) => {
            const selected = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMode(m.id);
                  setErrorMsg(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 border transition-colors ${
                  selected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isEn ? m.shortEn : m.shortVi}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          {isEn ? activeModeMeta.descEn : activeModeMeta.descVi}
        </p>
      </div>

      {/* MAIN BODY: Mode 3 includes interactive Skill Diagnosis & Visual Flowchart + optional chat */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/60">
        {activeMode === 'diagnostic_roadmap' && (
          <div className="space-y-3.5">
            {/* Step 1: Configuration Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <BrainCircuit className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>
                    {isEn
                      ? `Configure ${activeMeta.nameEn} Skill & Major Assessment`
                      : `Thiết Lập Đánh Giá Năng Lực ${activeMeta.nameVi}`}
                  </span>
                </div>
                {activeRoadmap && (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {isEn ? 'Saved' : 'Đã có sơ đồ'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {isEn ? 'Grade Level' : 'Khối lớp hiện tại'}
                  </span>
                  <select
                    value={diagGrade}
                    onChange={(e) => setDiagGrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                  >
                    {['Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {isEn ? 'Self-Assessed Level' : 'Tự đánh giá trình độ'}
                  </span>
                  <select
                    value={diagSelfLevel}
                    onChange={(e) => setDiagSelfLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                  >
                    <option value="Cần xây lại gốc">{isEn ? 'Foundational' : 'Cần xây lại gốc'}</option>
                    <option value="Trung bình">{isEn ? 'Average' : 'Trung bình'}</option>
                    <option value="Khá">{isEn ? 'Good / Intermediate' : 'Khá'}</option>
                    <option value="Giỏi / Ôn Chuyên">{isEn ? 'Advanced / Olympiad' : 'Giỏi / Ôn Chuyên - HSG'}</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {isEn ? 'Target Specialization / Major' : 'Chuyên ngành / Định hướng lựa chọn'}
                </span>
                <select
                  value={diagMajor}
                  onChange={(e) => setDiagMajor(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
                >
                  {(isEn ? MAJOR_OPTIONS_EN : MAJOR_OPTIONS_VI).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <input
                type="text"
                value={diagCustomGoal}
                onChange={(e) => setDiagCustomGoal(e.target.value)}
                placeholder={
                  isEn
                    ? 'Optional goal (e.g., 9+ entrance exam, master DP graphs...)'
                    : 'Mục tiêu riêng (VD: Thi đỗ chuyên Toán, đạt 9+ THPT QG, làm chủ Quy hoạch động...)'
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs"
              />

              <button
                onClick={handleGenerateQuiz}
                disabled={diagLoadingQuiz}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {diagLoadingQuiz
                    ? isEn
                      ? 'Generating Diagnostic & Major Questions...'
                      : 'AI đang tạo câu hỏi chuyên môn & chuyên ngành...'
                    : diagQuestions.length > 0
                    ? isEn
                      ? 'Regenerate 5 Assessment Questions'
                      : 'Tạo lại bộ 5 câu hỏi chuyên môn & chuyên ngành'
                    : isEn
                    ? 'Create 5 Skill & Major Questions'
                    : 'Tạo Bộ Câu Hỏi Chuyên Môn & Chọn Chuyên Ngành'}
                </span>
              </button>
            </div>

            {diagError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {diagError}
              </div>
            )}

            {/* Step 2: Interactive 5-Question Quiz */}
            {diagQuestions.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {isEn ? 'Answer 5 Questions Below:' : 'Hoàn thành 5 câu hỏi đánh giá:'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {Object.keys(diagAnswers).length}/{diagQuestions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {diagQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">
                          Câu {idx + 1} · {q.category === 'specialization' ? (isEn ? 'Major & Style' : 'Định hướng chuyên ngành') : (isEn ? 'Subject Skill' : 'Kiến thức chuyên môn')}
                        </span>
                        <span className="truncate">{q.topicTag}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                        <FormattedText text={q.question} />
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {q.options.map((opt, optIdx) => {
                          const picked = diagAnswers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() =>
                                setDiagAnswersBySubj((prev) => ({
                                  ...prev,
                                  [activeSubject]: { ...(prev[activeSubject] || {}), [q.id]: optIdx }
                                }))
                              }
                              className={`text-left px-3 py-2 rounded-lg text-xs border transition-colors flex items-start gap-2 ${
                                picked
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                              }`}
                            >
                              <span className="font-mono font-bold shrink-0">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span className="min-w-0 flex-1">
                                <FormattedText text={opt} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleBuildRoadmap}
                  disabled={diagLoadingRoadmap}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>
                    {diagLoadingRoadmap
                      ? isEn
                        ? 'Analyzing Skills & Building Flowchart...'
                        : 'Đang phân tích kỹ năng & vẽ sơ đồ học tập...'
                      : isEn
                      ? 'Analyze Skills & Generate Study Roadmap'
                      : 'Phân Tích Trình Độ & Tạo Sơ Đồ Học Tập'}
                  </span>
                </button>
              </div>
            )}

            {/* Step 3: Visual Personalized Roadmap Diagram */}
            {activeRoadmap && (
              <div className="bg-white dark:bg-slate-900 border border-emerald-300/70 dark:border-emerald-800/70 rounded-xl p-4 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4" />
                      <span>
                        {isEn ? 'Personalized Study Flowchart' : 'Sơ Đồ Lộ Trình Học Tập Cá Nhân Hóa'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeRoadmap.grade} · {activeRoadmap.targetMajor}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {activeRoadmap.knowledgeCorrect}/{activeRoadmap.knowledgeTotal} ({activeRoadmap.knowledgeScore}%)
                    </div>
                    <div className="text-[10px] text-slate-500">{activeRoadmap.estimatedLevel}</div>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 space-y-1">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300">
                      {isEn ? 'Strengths' : 'Điểm mạnh'}
                    </div>
                    {activeRoadmap.strengths.map((s, i) => (
                      <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span><FormattedText text={s} /></span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 space-y-1">
                    <div className="font-bold text-amber-800 dark:text-amber-300">
                      {isEn ? 'Gaps to Fix' : 'Điểm cần bù đắp'}
                    </div>
                    {activeRoadmap.weaknesses.map((w, i) => (
                      <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                        <Target className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <span><FormattedText text={w} /></span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-900/50 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                  <div>
                    <strong className="text-indigo-700 dark:text-indigo-300">
                      {isEn ? 'Major Strategy: ' : 'Tư vấn chuyên ngành: '}
                    </strong>
                    <FormattedText text={activeRoadmap.majorAdvice} />
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{activeRoadmap.dailyScheduleSummary}</span>
                  </div>
                </div>

                {/* Connected Visual Stages Flowchart */}
                <div className="space-y-2.5">
                  {activeRoadmap.stages.map((st, idx) => (
                    <div key={st.step} className="relative pl-6">
                      {idx < activeRoadmap.stages.length - 1 && (
                        <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-800/80" />
                      )}
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {st.step}
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            {st.phase}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 tabular-nums">
                            {st.durationWeeks} {isEn ? 'wks' : 'tuần'} · {st.dailyMinutes}p/{isEn ? 'day' : 'ngày'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{st.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {st.focusTopics.join(' · ')}
                        </div>
                        <ul className="space-y-1 pt-0.5">
                          {st.concreteTasks.map((task, ti) => (
                            <li key={ti} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span><FormattedText text={task} /></span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                            Mục tiêu: {st.targetMilestone}
                          </span>
                          {onNavigateSubject && (
                            <button
                              onClick={() => onNavigateSubject(st.recommendedModule)}
                              className="px-2.5 py-1 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold flex items-center gap-1 hover:opacity-90"
                            >
                              <span>{isEn ? 'Open Module' : 'Học ngay'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Messages Feed (Active in all 3 modes; acts as follow-up refinement chat in Mode 3) */}
        <div className="space-y-3">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm'
                }`}
              >
                {msg.imagePreview && (
                  <img
                    src={msg.imagePreview}
                    alt="Uploaded question"
                    className="max-h-40 rounded-lg mb-2 border border-white/20 object-contain"
                  />
                )}
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                ) : (
                  <div className="space-y-1.5">
                    <FormattedText text={msg.text} />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 tabular-nums">
                {msg.role === 'tutor' ? (isEn ? activeMeta.nameEn : activeMeta.nameVi) : 'Em'} · {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {activeMode === 'full_solution'
                  ? isEn
                    ? 'Preparing full problem summary & detailed solution...'
                    : 'AI đang tóm tắt đề và trình bày lời giải chi tiết...'
                  : activeMode === 'diagnostic_roadmap'
                  ? isEn
                    ? 'Updating your study advice...'
                    : 'AI đang tinh chỉnh lộ trình cho em...'
                  : isEn
                  ? 'Reviewing your exact unclear step...'
                  : 'AI đang phân tích kỹ phần em chưa hiểu...'}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-[11px] font-bold underline shrink-0"
              >
                {isEn ? 'Dismiss' : 'Đóng'}
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Chips */}
      <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isEn ? 'Quick prompts:' : 'Gợi ý nhanh:'}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickChips.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
        {pendingImage && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
            <span className="text-slate-700 dark:text-slate-300 truncate">
              {isEn ? 'Attached photo of problem/step' : 'Đã đính kèm ảnh bài tập / bước giải'}
            </span>
            <button
              onClick={() => setPendingImage(null)}
              className="text-rose-500 hover:underline text-[11px] font-semibold ml-2"
            >
              {isEn ? 'Remove' : 'Xóa'}
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <label
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer shrink-0 transition-colors"
            title={isEn ? 'Attach problem photo' : 'Gửi ảnh đề bài hoặc bước làm'}
          >
            <ImageIcon className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
          </label>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder={
              activeMode === 'full_solution'
                ? isEn
                  ? 'Paste a problem to get summary, method & full solution...'
                  : 'Dán đề bài để AI tóm tắt, nêu cách làm và xuất lời giải chi tiết...'
                : activeMode === 'diagnostic_roadmap'
                ? isEn
                  ? 'Ask to refine your study roadmap...'
                  : 'Hỏi thêm để AI tinh chỉnh sơ đồ học tập cho em...'
                : isEn
                ? 'Describe the step or concept you do not understand...'
                : 'Nhập đề bài hoặc nói rõ em đang chưa hiểu bước/công thức nào...'
            }
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!inputText.trim() && !pendingImage)}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 transition-colors disabled:opacity-40"
            title={isEn ? 'Send to AI Tutor' : 'Gửi câu hỏi'}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return <ViewportPortal active={true}>{tutorWindow}</ViewportPortal>;
  }

  return tutorWindow;
};
