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
  FileCheck2,
  Copy,
  Check,
  Cpu,
  Radio,
  PenTool
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
import { safeFetchJson, streamTutorChat } from '../../lib/apiClient';
import { useNavigation, getLocationLabel } from '../../context/NavigationContext';
import { VoiceMicButton } from '../common/VoiceMicButton';
import { InteractiveScratchpad } from '../common/InteractiveScratchpad';

export const AI_ROADMAPS_STORAGE_KEY = 'educlassroom_ai_roadmaps_v1';

type AISubjectKey = 'math' | 'physics' | 'cs';

interface SubjectDiagConfig {
  grade: string;
  major: string;
  selfLevel: string;
  customGoal: string;
}

interface SocraticAITutorProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  context: TutorContextPayload;
  onChangeSubject?: (subj: SubjectType) => void;
  onNavigateSubject?: (subj: SubjectType) => void;
}

const MAJOR_OPTIONS_BY_SUBJ_VI: Record<AISubjectKey, string[]> = {
  math: [
    'Đội tuyển Chuyên Toán / HSG / Đánh giá năng lực 9+',
    'Công nghệ thông tin, Trí tuệ nhân tạo & Khoa học dữ liệu',
    'Kinh tế, Tài chính định lượng & Khoa học quản lý',
    'Kỹ thuật, Kiến trúc & Cơ điện tử'
  ],
  physics: [
    'Đội tuyển Chuyên Lí / HSG / Mục tiêu 9+ THPT QG',
    'Kỹ thuật Điện - Tự động hóa - Robotics',
    'Vi mạch bán dẫn - Vật lí kỹ thuật & AI phần cứng',
    'Hàng không - Cơ khí chế tạo - Năng lượng'
  ],
  cs: [
    'Lập trình thi đấu (Chuyên Tin / HSG QG / VNOI / ICPC)',
    'Trí tuệ nhân tạo (AI), Machine Learning & Khoa học dữ liệu',
    'Kỹ thuật phần mềm & Phát triển Hệ thống Web/App',
    'An toàn thông tin & Hệ thống nhúng'
  ]
};

const MAJOR_OPTIONS_BY_SUBJ_EN: Record<AISubjectKey, string[]> = {
  math: [
    'Olympiad / Gifted Math / Top University Entrance',
    'Computer Science, AI & Data Science',
    'Economics, Quantitative Finance & Management',
    'Engineering & Architecture'
  ],
  physics: [
    'High-School Physics Olympiad / Top University Exam',
    'Electrical, Automation & Robotics Engineering',
    'Semiconductors, Microchips & Applied Physics',
    'Aerospace, Mechanical & Energy Engineering'
  ],
  cs: [
    'Competitive Programming (HSG / IOI / VNOI / ICPC)',
    'Artificial Intelligence & Data Science',
    'Software Engineering & Full-Stack Systems',
    'Cybersecurity & Systems Architecture'
  ]
};

function normalizeSubject(subj?: SubjectType): AISubjectKey {
  if (subj === 'physics' || subj === 'cs') return subj;
  return 'math';
}

const SynCoreEmblem: React.FC<{ accentHex: string; secondaryHex: string; icon: React.ReactNode }> = ({
  accentHex,
  secondaryHex,
  icon
}) => (
  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke={accentHex}
        strokeWidth="1.6"
        strokeDasharray="10 6"
        className="holo-orbit-cw"
        opacity="0.85"
      />
      <circle
        cx="32"
        cy="32"
        r="21"
        fill="none"
        stroke={secondaryHex}
        strokeWidth="1.4"
        strokeDasharray="6 8"
        className="holo-orbit-ccw"
        opacity="0.75"
      />
      <circle cx="32" cy="4" r="2.4" fill={accentHex} className="holo-orbit-cw" />
    </svg>
    <div
      className="syn-core-pulse w-8 h-8 rounded-md border border-white/25 bg-slate-900/90 flex items-center justify-center text-white shadow-inner"
      style={{ boxShadow: `0 0 18px -2px ${accentHex}` }}
    >
      {icon}
    </div>
  </div>
);

export const SocraticAITutor: React.FC<SocraticAITutorProps> = ({
  isOpen,
  onClose,
  onBack,
  context,
  onChangeSubject,
  onNavigateSubject
}) => {
  const { language } = useLanguage();
  const { previousLocation } = useNavigation();
  const isEn = language === 'en';
  const backLabel = previousLocation
    ? getLocationLabel(previousLocation, language)
    : isEn
    ? 'Previous'
    : 'Trang trước';

  const [activeSubject, setActiveSubject] = useState<AISubjectKey>(() => normalizeSubject(context.subject));
  const [activeMode, setActiveMode] = useState<AITutorMode>(() => context.mode || 'explain_no_answer');

  const getAiPersonaMeta = (subj: AISubjectKey) => {
    if (subj === 'physics') {
      return {
        nameVi: 'Syn Physics',
        nameEn: 'Syn Physics',
        roleVi: 'Vật Lí Học Lượng Tử & Mô Phỏng',
        roleEn: 'Physics & Quantum Engine',
        badgeVi: 'Cơ · Điện · Quang · Lượng tử',
        badgeEn: 'Mechanics · Optics · Quantum',
        accentHex: '#f59e0b',
        secondaryHex: '#fb7185',
        tabActive:
          'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 border-amber-300 shadow-[0_10px_28px_-8px_rgba(245,158,11,0.55)]',
        glowRing: 'ring-1 ring-amber-400/45 border-amber-500/50',
        headerGrad: 'from-slate-950 via-[#1f1305] to-slate-950',
        auroraOrb:
          'bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.34),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.22),transparent_60%)]',
        userBubble:
          'bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-medium shadow-md shadow-amber-500/25',
        sendBtn:
          'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/35',
        accentRing: 'focus-within:ring-amber-400/60 focus-within:border-amber-400',
        avatarRing: 'ring-amber-400/60 bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950',
        eqBar: 'bg-amber-400',
        icon: <Zap className="w-4 h-4" />
      };
    }
    if (subj === 'cs') {
      return {
        nameVi: 'Syn Code',
        nameEn: 'Syn Code',
        roleVi: 'Thuật Toán & Lập Trình Thi Đấu',
        roleEn: 'Algorithms & Code Engine',
        badgeVi: 'Thuật toán · C++20 · Python 3',
        badgeEn: 'Algorithms · C++20 · Python 3',
        accentHex: '#10b981',
        secondaryHex: '#06b6d4',
        tabActive:
          'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 border-emerald-300 shadow-[0_10px_28px_-8px_rgba(16,185,129,0.55)]',
        glowRing: 'ring-1 ring-emerald-400/45 border-emerald-500/50',
        headerGrad: 'from-slate-950 via-[#041d17] to-slate-950',
        auroraOrb:
          'bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.34),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.22),transparent_60%)]',
        userBubble:
          'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/25',
        sendBtn:
          'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/35',
        accentRing: 'focus-within:ring-emerald-400/60 focus-within:border-emerald-400',
        avatarRing: 'ring-emerald-400/60 bg-gradient-to-br from-emerald-500 to-cyan-600 text-white',
        eqBar: 'bg-emerald-400',
        icon: <Code2 className="w-4 h-4" />
      };
    }
    return {
      nameVi: 'Syn Math',
      nameEn: 'Syn Math',
      roleVi: 'Đại Số · Giải Tích · Hình Học Oxyz',
      roleEn: 'Algebra · Calculus · Oxyz Engine',
      badgeVi: 'Đại số · Giải tích · Oxyz',
      badgeEn: 'Algebra · Calculus · Oxyz',
      accentHex: '#38bdf8',
      secondaryHex: '#818cf8',
      tabActive:
        'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-sky-300 shadow-[0_10px_28px_-8px_rgba(56,189,248,0.55)]',
      glowRing: 'ring-1 ring-sky-400/45 border-sky-500/50',
      headerGrad: 'from-slate-950 via-[#0a1333] to-slate-950',
      auroraOrb:
        'bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.34),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.28),transparent_60%)]',
      userBubble:
        'bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white shadow-md shadow-blue-500/25',
      sendBtn:
        'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/35',
      accentRing: 'focus-within:ring-sky-400/60 focus-within:border-sky-400',
      avatarRing: 'ring-sky-400/60 bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
      eqBar: 'bg-sky-400',
      icon: <Compass className="w-4 h-4" />
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
          ? `Hello! I am **${subjName}** inside **Syn AI** (Mode 2: Full Summary, Method & Detailed Solution)${topicPart}.\n\nSend me your problem or photo: I will **summarize the givens, explain the best method, and provide the complete step-by-step solution & final answer**.`
          : `Chào em! Mình là **${subjName}** thuộc hệ thống **Syn AI** — Chế độ 2 (Tóm tắt · Cách làm · Lời giải cụ thể)${topicPart}.\n\nHãy gửi đề bài hoặc ảnh chụp: Syn AI sẽ **tóm tắt giả thiết, phân tích phương pháp giải và trình bày lời giải chi tiết đến đáp án cuối cùng**.`,
        timestamp
      };
    }

    if (mode === 'diagnostic_roadmap') {
      return {
        id: `welcome_${subj}_${mode}_${Date.now()}`,
        role: 'tutor',
        text: isEn
          ? `Hello! I am **${subjName}** inside **Syn AI** (Mode 3: Skill Diagnosis & Roadmap Architect).\n\nComplete the quick 5-question professional + major-track check above to generate your personalized **Study Flowchart**, or ask me any follow-up questions about your study plan below.`
          : `Chào em! Mình là **${subjName}** thuộc **Syn AI** — Chế độ 3 (Đánh giá trình độ & Thiết kế Sơ đồ học tập).\n\nEm hãy làm bộ **5 câu hỏi chuyên môn + lựa chọn chuyên ngành** ngay phía trên để Syn AI phân tích điểm mạnh/yếu và vẽ ra sơ đồ lộ trình riêng cho em nhé!`,
        timestamp
      };
    }

    return {
      id: `welcome_${subj}_${mode}_${Date.now()}`,
      role: 'tutor',
      text: isEn
        ? `Hello! I am **${subjName}** inside **Syn AI** (Mode 1: Clarify Doubts — No Final Answer)${topicPart}.\n\nI will analyze the problem with you and explain any unclear step in detail, **without spoiling the final result**.\n\n**Which exact concept, formula, or step are you unsure about?**`
        : `Chào em! Mình là **${subjName}** thuộc **Syn AI** — Chế độ 1 (Giải đáp thắc mắc · Không đưa kết quả)${topicPart}.\n\nSyn AI sẽ phân tích đề và giảng thật cụ thể chỗ em chưa hiểu, nhưng **tuyệt đối không đưa ra đáp án cuối ngay** để em tự bứt phá tư duy.\n\n**Em hãy nói rõ em đang chưa hiểu cụ thể ở phần nào?** (Ví dụ: chưa hiểu đề hỏi gì, quên công thức nào, hay vướng ở bước biến đổi nào?)`,
      timestamp
    };
  };

  const [threads, setThreads] = useState<Record<string, TutorMessage[]>>({});
  const threadKey = `${activeSubject}_${activeMode}`;
  const currentMessages = threads[threadKey] || [makeWelcomeMessage(activeSubject, activeMode, context)];

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  const [diagConfigBySubj, setDiagConfigBySubj] = useState<Record<AISubjectKey, SubjectDiagConfig>>(() => ({
    math: {
      grade: 'Lớp 12',
      major: isEn ? MAJOR_OPTIONS_BY_SUBJ_EN.math[0] : MAJOR_OPTIONS_BY_SUBJ_VI.math[0],
      selfLevel: 'Khá',
      customGoal: ''
    },
    physics: {
      grade: 'Lớp 12',
      major: isEn ? MAJOR_OPTIONS_BY_SUBJ_EN.physics[0] : MAJOR_OPTIONS_BY_SUBJ_VI.physics[0],
      selfLevel: 'Khá',
      customGoal: ''
    },
    cs: {
      grade: 'Lớp 12',
      major: isEn ? MAJOR_OPTIONS_BY_SUBJ_EN.cs[0] : MAJOR_OPTIONS_BY_SUBJ_VI.cs[0],
      selfLevel: 'Khá',
      customGoal: ''
    }
  }));

  const activeDiagConfig = diagConfigBySubj[activeSubject];
  const diagGrade = activeDiagConfig.grade;
  const diagMajor = activeDiagConfig.major;
  const diagSelfLevel = activeDiagConfig.selfLevel;
  const diagCustomGoal = activeDiagConfig.customGoal;

  const updateActiveDiagConfig = (patch: Partial<SubjectDiagConfig>) => {
    setDiagConfigBySubj((prev) => ({
      ...prev,
      [activeSubject]: { ...prev[activeSubject], ...patch }
    }));
  };

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
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const handleCopyMessage = (msgId: string, text: string) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedMsgId(msgId);
      window.setTimeout(() => {
        setCopiedMsgId((prev) => (prev === msgId ? null : prev));
      }, 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

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
    if (context.topicTitle || context.problemStatement || context.initialImageBase64) {
      const s = normalizeSubject(context.subject);
      const m = context.mode || activeMode;
      const k = `${s}_${m}`;
      setThreads((prev) => ({
        ...prev,
        [k]: [makeWelcomeMessage(s, m, context)]
      }));
      if (context.problemStatement) {
        setInputText(context.problemStatement);
      }
      if (context.initialImageBase64) {
        setPendingImage({
          base64: context.initialImageBase64,
          mimeType: context.initialImageMimeType || 'image/png'
        });
      }
    }
  }, [context.topicTitle, context.problemStatement, context.initialImageBase64, language]);

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

  useEffect(() => {
    if (!isOpen) return;
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = () => {
              setPendingImage({
                base64: String(reader.result || ''),
                mimeType: file.type || 'image/png'
              });
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const activeMeta = getAiPersonaMeta(activeSubject);
  const diagQuestions = diagQuestionsBySubj[activeSubject] || [];
  const diagAnswers = diagAnswersBySubj[activeSubject] || {};
  const activeRoadmap = roadmapsBySubj[activeSubject] || null;
  const activeMajorOptions = isEn
    ? MAJOR_OPTIONS_BY_SUBJ_EN[activeSubject]
    : MAJOR_OPTIONS_BY_SUBJ_VI[activeSubject];

  const quickChips =
    activeMode === 'explain_no_answer'
      ? isEn
        ? [
            'I do not understand what the problem is asking',
            'Which theorem or formula applies here?',
            'I am stuck on this middle step',
            'Check if my starting idea is on the right track'
          ]
        : activeSubject === 'cs'
        ? [
            'Em chưa hiểu yêu cầu bài toán & ràng buộc dữ liệu N',
            'Bài này nên dùng cấu trúc dữ liệu hay thuật toán nào?',
            'Code em bị sai test biên hoặc TLE ở đoạn này',
            'Xem giúp hướng tiếp cận của em đúng chưa (chưa đưa code)'
          ]
        : activeSubject === 'physics'
        ? [
            'Em chưa hình dung được hiện tượng và các lực tác dụng',
            'Bài này chọn công thức hay định luật bảo toàn nào?',
            'Em bị vướng ở bước đổi đơn vị SI / xét dấu',
            'Kiểm tra giúp hướng lập phương trình của em'
          ]
        : [
            'Em chưa hiểu đề bài đang hỏi gì',
            'Bài này cần dùng định lý, công thức hay phép biến đổi nào?',
            'Em bị kẹt ở bước tìm điều kiện / biến đổi trung gian này',
            'Xem hướng làm em tự nghĩ đúng chưa (đừng giải hết)'
          ]
      : activeMode === 'full_solution'
      ? isEn
        ? [
            'Summarize givens & show best method + full solution',
            'Solve step-by-step and state the final answer',
            'Write clean C++/Python solution with complexity'
          ]
        : activeSubject === 'cs'
        ? [
            'Tóm tắt đề, nêu thuật toán tối ưu và viết code C++20 chuẩn',
            'Viết lời giải Python 3 sạch và phân tích độ phức tạp Big-O',
            'Phân tích các test biên dễ sai và đưa code hoàn chỉnh'
          ]
        : [
            'Tóm tắt đề, nêu cách làm và giải chi tiết ra đáp số cuối',
            'Trình bày lời giải từng bước chuẩn tự luận + lưu ý bẫy',
            'Giải thích hướng tư duy và kiểm chứng lại kết quả'
          ]
      : isEn
      ? [
          'Adjust my roadmap for 30 min/day',
          'Which exam track fits my major best?',
          'Suggest the next 3 key lessons to master'
        ]
      : [
          'Điều chỉnh sơ đồ xuống còn 30 phút/ngày',
          `Với môn ${activeSubject === 'math' ? 'Toán' : activeSubject === 'physics' ? 'Vật lí' : 'Tin học'}, nên ưu tiên chuyên đề nào?`,
          'Gợi ý 3 bài học đầu tiên em nên mở ngay hôm nay'
        ];

  const attachImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingImage({
        base64: String(reader.result || ''),
        mimeType: file.type || 'image/png'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    attachImageFile(file);
  };

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? inputText).trim();
    if (!textToSend && !pendingImage) return;
    if (isLoading) return;

    const targetThreadKey = threadKey;
    const userMsg: TutorMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: textToSend || (isEn ? 'Here is the problem/step I uploaded:' : 'Đây là đề bài / bài làm em gửi lên:'),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      imagePreview: pendingImage?.base64
    };

    const nextHistory = [...currentMessages, userMsg];
    const tutorMsgId = `t_${Date.now() + 1}`;
    const placeholderTutorMsg: TutorMessage = {
      id: tutorMsgId,
      role: 'tutor',
      text: '',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setThreads((prev) => ({ ...prev, [targetThreadKey]: [...nextHistory, placeholderTutorMsg] }));
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

      const streamRes = await streamTutorChat(
        {
          messages: apiMessages,
          context: {
            ...context,
            subject: activeSubject,
            mode: activeMode
          },
          language
        },
        (accumulatedText) => {
          setThreads((prev) => {
            const list = prev[targetThreadKey] || [];
            return {
              ...prev,
              [targetThreadKey]: list.map((m) =>
                m.id === tutorMsgId ? { ...m, text: accumulatedText } : m
              )
            };
          });
        }
      );

      if (!streamRes.ok || !streamRes.reply) {
        setThreads((prev) => ({
          ...prev,
          [targetThreadKey]: (prev[targetThreadKey] || []).filter((m) => m.id !== tutorMsgId)
        }));
        throw new Error(streamRes.error || 'Syn AI không thể phản hồi lúc này. Vui lòng thử lại.');
      }

      setThreads((prev) => {
        const list = prev[targetThreadKey] || [];
        return {
          ...prev,
          [targetThreadKey]: list.map((m) =>
            m.id === tutorMsgId ? { ...m, text: streamRes.reply! } : m
          )
        };
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể kết nối Syn AI. Vui lòng kiểm tra kết nối và thử lại.');
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
      },
      65000
    );

    setDiagLoadingQuiz(false);

    if (!res.ok || !Array.isArray(res.data?.questions) || res.data.questions.length === 0) {
      setDiagError(res.error || 'Syn AI chưa tạo được bộ câu hỏi. Vui lòng bấm thử lại.');
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
      },
      65000
    );

    setDiagLoadingRoadmap(false);

    if (!res.ok || !res.data?.roadmap) {
      setDiagError(res.error || 'Syn AI chưa hoàn thành sơ đồ lộ trình. Vui lòng bấm thử lại.');
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

  const modeTabs: { id: AITutorMode; code: string; shortVi: string; shortEn: string; descVi: string; descEn: string }[] = [
    {
      id: 'explain_no_answer',
      code: '01',
      shortVi: 'Giảng Gợi Mở (Không Đáp Án)',
      shortEn: 'Guided Explain (No Answer)',
      descVi: 'Phân tích đề · Hỏi chỗ vướng · Giảng chi tiết từng bước (không đưa đáp án cuối)',
      descEn: 'Analyzes problem · Asks unclear step · Explains deeply without spoiling answer'
    },
    {
      id: 'full_solution',
      code: '02',
      shortVi: 'Tóm Tắt · Cách Làm · Lời Giải',
      shortEn: 'Summary · Method · Solution',
      descVi: 'Tóm tắt giả thiết · Nêu phương pháp · Xuất lời giải + kết quả cụ thể',
      descEn: 'Summarizes problem · Explains method · Gives full solution & final answer'
    },
    {
      id: 'diagnostic_roadmap',
      code: '03',
      shortVi: 'Đánh Giá & Sơ Đồ Học Tập',
      shortEn: 'Skill Check & Roadmap',
      descVi: 'Hỏi chuyên môn & chọn chuyên ngành → Phân tích năng lực → Vẽ sơ đồ học tập',
      descEn: 'Diagnostic + major choices → Skill analysis → Personalized study flowchart'
    }
  ];

  const activeModeMeta = modeTabs.find((m) => m.id === activeMode) || modeTabs[0];

  const tutorWindow = (
    <div
      onDragOver={(e) => {
        if (e.dataTransfer?.types?.includes('Files')) {
          e.preventDefault();
          setIsDraggingImage(true);
        }
      }}
      onDragLeave={() => setIsDraggingImage(false)}
      onDrop={(e) => {
        if (e.dataTransfer?.files?.length) {
          e.preventDefault();
          setIsDraggingImage(false);
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith('image/')) {
            attachImageFile(file);
          } else if (file) {
            file
              .text()
              .then((txt) => {
                if (txt.trim()) {
                  setInputText((prev) => (prev ? `${prev}\n${txt.slice(0, 6000)}` : txt.slice(0, 6000)));
                }
              })
              .catch(() => {});
          }
        }
      }}
      className={
        isFullscreen
          ? `syn-window-enter fixed inset-0 z-[115] w-screen h-[100dvh] bg-slate-950 flex flex-col overflow-hidden ${
              isDraggingImage ? 'ring-2 ring-inset ring-sky-400' : ''
            }`
          : `syn-window-enter sci-frame fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[95] w-[calc(100vw-1.5rem)] sm:w-[560px] md:w-[630px] h-[min(770px,89dvh)] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border ${
              isDraggingImage ? 'border-sky-400 ring-2 ring-sky-400/50' : activeMeta.glowRing
            } rounded-md shadow-[0_32px_90px_-16px_rgba(2,6,23,0.68)] flex flex-col overflow-hidden`
      }
    >
      {/* Drag-and-drop HUD overlay */}
      {isDraggingImage && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm border-2 border-dashed border-sky-400 flex flex-col items-center justify-center gap-2 text-white pointer-events-none">
          <div className="w-14 h-14 rounded-md bg-sky-500/20 border border-sky-400 flex items-center justify-center animate-bounce">
            <ImageIcon className="w-7 h-7 text-sky-300" />
          </div>
          <div className="font-display text-sm font-bold">
            {isEn ? 'Drop image for Syn AI visual analysis' : 'Thả ảnh vào đây để Syn AI phân tích'}
          </div>
        </div>
      )}

      {/* GRAND COMMAND HEADER */}
      <div
        className={`syn-header-beam relative px-3.5 sm:px-5 py-3.5 bg-gradient-to-r ${activeMeta.headerGrad} text-white border-b border-white/15 flex items-center justify-between gap-2.5 shrink-0`}
      >
        <div aria-hidden="true" className={`absolute inset-0 pointer-events-none ${activeMeta.auroraOrb}`} />
        <div aria-hidden="true" className="absolute inset-0 syn-neural-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => {
              if (isFullscreen) {
                setIsFullscreen(false);
              }
              if (onBack) {
                onBack();
              } else {
                onClose();
              }
            }}
            className="group px-2.5 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-sky-200 hover:text-white flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap"
            title={isEn ? `Back to ${backLabel}` : `Quay lại ${backLabel}`}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline max-w-[115px] truncate">
              {isEn ? backLabel : backLabel}
            </span>
          </button>

          <SynCoreEmblem
            accentHex={activeMeta.accentHex}
            secondaryHex={activeMeta.secondaryHex}
            icon={activeMeta.icon}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-white/12 border border-white/20 font-mono text-[10px] font-extrabold tracking-widest uppercase text-sky-200">
                SYN AI
              </span>
              <h3 className="font-display text-sm sm:text-base font-extrabold tracking-tight truncate text-white">
                {isEn ? activeMeta.nameEn : activeMeta.nameVi}
              </h3>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-mono text-emerald-300">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300/90 truncate flex items-center gap-1.5 mt-0.5">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                style={{ backgroundColor: activeMeta.accentHex }}
              />
              <span>{isEn ? activeMeta.roleEn : activeMeta.roleVi}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleReset}
            className="p-2 rounded-md text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
            title={isEn ? 'Reset current conversation' : 'Làm mới cuộc trò chuyện'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
            title={isFullscreen ? (isEn ? 'Exit Fullscreen' : 'Thu nhỏ') : isEn ? 'Fullscreen' : 'Mở toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              setIsFullscreen(false);
              onClose();
            }}
            className="p-2 rounded-md text-slate-300 hover:text-rose-300 bg-white/5 hover:bg-rose-500/20 border border-white/10 transition-all cursor-pointer"
            title={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 DEDICATED SYN AI ENGINES SWITCHER */}
      <div className="px-3.5 sm:px-5 py-2.5 bg-slate-900/95 dark:bg-slate-950 border-b border-slate-800 shrink-0">
        <div className={`grid grid-cols-3 gap-2 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
          {(['math', 'physics', 'cs'] as AISubjectKey[]).map((subj) => {
            const meta = getAiPersonaMeta(subj);
            const selected = activeSubject === subj;
            const shortcut = subj === 'math' ? 'Ctrl(L)+D' : subj === 'physics' ? 'Ctrl(L)+F' : 'Ctrl(L)+G';
            const shortKey = subj === 'math' ? '^D' : subj === 'physics' ? '^F' : '^G';
            const iconAnim =
              subj === 'math'
                ? 'icon-anim-compass'
                : subj === 'physics'
                ? 'icon-anim-zap'
                : 'icon-anim-code';
            return (
              <button
                key={subj}
                data-ripple="true"
                onClick={() => handleSwitchSubject(subj)}
                title={isEn ? `Shortcut: Left ${shortcut}` : `Phím tắt: ${shortcut.replace('Ctrl(L)', 'Ctrl trái')}`}
                className={`group cs-deck-btn relative overflow-hidden flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-md text-xs sm:text-[13px] font-bold border transition-all whitespace-nowrap cursor-pointer ${
                  selected
                    ? meta.tabActive
                    : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:border-sky-400/70 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className={iconAnim}>{meta.icon}</span>
                  <span className="truncate">{isEn ? meta.nameEn : meta.nameVi}</span>
                </span>
                <kbd
                  className={`hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    selected
                      ? 'bg-black/20 border-white/25 text-current'
                      : 'bg-slate-950 border-slate-700 text-slate-400'
                  }`}
                >
                  {shortKey}
                </kbd>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 PEDAGOGICAL MODES TACTICAL BAR */}
      <div className="px-3.5 sm:px-5 py-2.5 bg-slate-100/95 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className={`space-y-1.5 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {modeTabs.map((m) => {
              const selected = activeMode === m.id;
              const modeIcon =
                m.id === 'explain_no_answer' ? (
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                ) : m.id === 'full_solution' ? (
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <GitBranch className="w-3.5 h-3.5 shrink-0" />
                );
              return (
                <button
                  key={m.id}
                  data-ripple="true"
                  onClick={() => {
                    setActiveMode(m.id);
                    setErrorMsg(null);
                  }}
                  className={`group sheen-btn flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-2 rounded-md text-[11px] sm:text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    selected
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`px-1 py-0.5 rounded font-mono text-[10px] ${
                      selected
                        ? 'bg-sky-500 text-white dark:bg-slate-900 dark:text-sky-300'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {m.code}
                  </span>
                  <span className="group-hover:scale-110 transition-transform">{modeIcon}</span>
                  <span className="truncate">{isEn ? m.shortEn : m.shortVi}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug flex items-center gap-1.5 px-0.5">
            <Sparkles className="w-3 h-3 text-sky-500 shrink-0" />
            <span>{isEn ? activeModeMeta.descEn : activeModeMeta.descVi}</span>
          </p>
        </div>
      </div>

      {/* MAIN NEURAL VIEWPORT */}
      <div className="relative flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 bg-gradient-to-b from-slate-50 via-white to-slate-100/80 dark:from-slate-950 dark:via-[#060c1a] dark:to-slate-950 syn-neural-grid">
        <div className={`space-y-4 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
          {activeMode === 'diagnostic_roadmap' && (
            <div className="space-y-3.5 roadmap-card-enter">
              {/* Step 1: Configuration Card */}
              <div className="sci-frame bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-indigo-200 dark:border-indigo-500/30 rounded-md p-4 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    <div className="w-7 h-7 rounded-md bg-indigo-500/15 border border-indigo-400/30 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                      <BrainCircuit className="w-4 h-4 shrink-0" />
                    </div>
                    <span>
                      {isEn
                        ? `Configure ${activeMeta.nameEn} Skill & Major Assessment`
                        : `Thiết Lập Đánh Giá Năng Lực ${activeMeta.nameVi}`}
                    </span>
                  </div>
                  {activeRoadmap && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
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
                      onChange={(e) => updateActiveDiagConfig({ grade: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      onChange={(e) => updateActiveDiagConfig({ selfLevel: e.target.value })}
                      className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    onChange={(e) => updateActiveDiagConfig({ major: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {activeMajorOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={diagCustomGoal}
                    onChange={(e) => updateActiveDiagConfig({ customGoal: e.target.value })}
                    placeholder={
                      isEn
                        ? 'Optional goal (e.g., 9+ entrance exam, master DP graphs...)'
                        : 'Mục tiêu riêng (VD: Thi đỗ chuyên Toán, đạt 9+ THPT QG, làm chủ Quy hoạch động...)'
                    }
                    className="flex-1 px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <VoiceMicButton
                    language={language}
                    onTranscript={(spoken) =>
                      updateActiveDiagConfig({
                        customGoal: diagCustomGoal ? `${diagCustomGoal} ${spoken}` : spoken
                      })
                    }
                  />
                </div>

                <button
                  onClick={handleGenerateQuiz}
                  disabled={diagLoadingQuiz}
                  className={`group sheen-btn w-full py-2.5 px-4 rounded-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer ${activeMeta.sendBtn}`}
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>
                    {diagLoadingQuiz
                      ? isEn
                        ? 'Generating Diagnostic & Major Questions...'
                        : 'Syn AI đang tạo câu hỏi chuyên môn & chuyên ngành...'
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
                <div className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                  {diagError}
                </div>
              )}

              {/* Step 2: 5 Diagnostic Questions */}
              {diagQuestions.length > 0 && (
                <div className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-md p-4 space-y-4 shadow-sm roadmap-card-enter">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 dark:text-white">
                    <span>{isEn ? 'Answer 5 Questions Below:' : 'Hoàn thành 5 câu hỏi đánh giá:'}</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">
                      {Object.keys(diagAnswers).length}/{diagQuestions.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {diagQuestions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            Q{qIdx + 1} · {q.topicTag}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            {q.category === 'specialization'
                              ? isEn
                                ? 'Specialization'
                                : 'Chuyên ngành'
                              : isEn
                              ? 'Core Knowledge'
                              : 'Kiến thức nền'}
                          </span>
                        </div>
                        <div className="text-xs sm:text-[13px] font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                          <FormattedText text={q.question} />
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {q.options.map((opt, optIdx) => {
                            const picked = diagAnswers[q.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                data-ripple="true"
                                onClick={() =>
                                  setDiagAnswersBySubj((prev) => ({
                                    ...prev,
                                    [activeSubject]: { ...(prev[activeSubject] || {}), [q.id]: optIdx }
                                  }))
                                }
                                className={`group text-left px-3.5 py-2.5 rounded-md text-xs border transition-all flex items-start gap-2.5 cursor-pointer ${
                                  picked
                                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400/70 hover:bg-indigo-50/30 dark:hover:bg-slate-800'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded font-mono text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                                    picked
                                      ? 'bg-indigo-600 text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="min-w-0 flex-1 pt-0.5">
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
                    className="sheen-btn w-full py-3 px-4 rounded-md bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>
                      {diagLoadingRoadmap
                        ? isEn
                          ? 'Analyzing Skills & Building Flowchart...'
                          : 'Syn AI đang phân tích kỹ năng & vẽ sơ đồ học tập...'
                        : isEn
                        ? 'Analyze Skills & Generate Study Roadmap'
                        : 'Phân Tích Trình Độ & Tạo Sơ Đồ Học Tập'}
                    </span>
                  </button>
                </div>
              )}

              {/* Step 3: Visual Personalized Roadmap Diagram */}
              {activeRoadmap && (
                <div className="sci-frame bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-300/80 dark:border-emerald-500/35 rounded-md p-4 sm:p-5 space-y-4 shadow-sm roadmap-card-enter">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
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
                      <div className="text-sm sm:text-base font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {activeRoadmap.knowledgeCorrect}/{activeRoadmap.knowledgeTotal} ({activeRoadmap.knowledgeScore}%)
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">{activeRoadmap.estimatedLevel}</div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-md bg-emerald-50/80 dark:bg-emerald-950/35 border border-emerald-200/80 dark:border-emerald-900/60 space-y-1.5">
                      <div className="font-extrabold text-emerald-800 dark:text-emerald-300">
                        {isEn ? 'Strengths' : 'Điểm mạnh'}
                      </div>
                      {activeRoadmap.strengths.map((s, i) => (
                        <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><FormattedText text={s} /></span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-md bg-amber-50/80 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
                      <div className="font-extrabold text-amber-800 dark:text-amber-300">
                        {isEn ? 'Gaps to Fix' : 'Điểm cần bù đắp'}
                      </div>
                      {activeRoadmap.weaknesses.map((w, i) => (
                        <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                          <Target className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><FormattedText text={w} /></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-md bg-indigo-50/80 dark:bg-indigo-950/35 border border-indigo-200/80 dark:border-indigo-900/60 text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5">
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
                  <div className="space-y-3">
                    {activeRoadmap.stages.map((st, idx) => (
                      <div key={st.step} className="relative pl-7">
                        {idx < activeRoadmap.stages.length - 1 && (
                          <div className="absolute left-3 top-7 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-sky-400 to-indigo-200 dark:to-indigo-800/80" />
                        )}
                        <div className="roadmap-node-aura absolute left-0 top-1 w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-sky-500 text-white text-[11px] font-extrabold flex items-center justify-center shadow-sm">
                          {st.step}
                        </div>
                        <div className="p-3.5 rounded-md bg-slate-50/90 dark:bg-slate-950/85 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400/60 transition-colors space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                              {st.phase}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                              {st.durationWeeks} {isEn ? 'wks' : 'tuần'} · {st.dailyMinutes}p/{isEn ? 'day' : 'ngày'}
                            </span>
                          </div>
                          <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">{st.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {st.focusTopics.join(' · ')}
                          </div>
                          <ul className="space-y-1 pt-0.5">
                            {st.concreteTasks.map((task, ti) => (
                              <li key={ti} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span><FormattedText text={task} /></span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              {isEn ? 'Goal' : 'Mục tiêu'}: {st.targetMilestone}
                            </span>
                            {onNavigateSubject && (
                              <button
                                onClick={() => onNavigateSubject(st.recommendedModule)}
                                className="group sheen-btn px-3 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold flex items-center gap-1 hover:bg-indigo-600 dark:hover:bg-indigo-100 transition-all cursor-pointer"
                              >
                                <span>{isEn ? 'Open Module' : 'Học ngay'}</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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

          {/* LIVE STREAMING CONVERSATION FEED */}
          <div className="space-y-4">
            {currentMessages
              .filter((msg) => msg.text.length > 0 || Boolean(msg.imagePreview))
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`animate-msg-in flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`flex items-end gap-2.5 max-w-[93%] ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {msg.role === 'tutor' && (
                      <div
                        className={`w-8 h-8 rounded-md ring-1 flex items-center justify-center shrink-0 mb-0.5 shadow-sm ${activeMeta.avatarRing}`}
                      >
                        <Cpu className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`group relative rounded-md px-4 py-3 text-xs sm:text-[13.5px] leading-relaxed ${
                        msg.role === 'user'
                          ? `${activeMeta.userBubble}`
                          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/90 text-slate-800 dark:text-slate-100 shadow-sm'
                      }`}
                    >
                      {msg.imagePreview && (
                        <img
                          src={msg.imagePreview}
                          alt="Uploaded question"
                          className="max-h-44 rounded-md mb-2.5 border border-white/25 object-contain shadow-xs"
                        />
                      )}
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      ) : (
                        <div className="space-y-1.5">
                          <FormattedText text={msg.text} />
                        </div>
                      )}
                      {msg.role === 'tutor' && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="mt-2.5 inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200/80 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-300 transition-colors cursor-pointer"
                          title={isEn ? 'Copy response' : 'Sao chép nội dung'}
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400">
                                {isEn ? 'Copied' : 'Đã chép'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isEn ? 'Copy' : 'Sao chép'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono text-slate-400 mt-1 tabular-nums ${
                      msg.role === 'tutor' ? 'pl-11' : 'pr-1'
                    }`}
                  >
                    {msg.role === 'tutor' ? (isEn ? activeMeta.nameEn : activeMeta.nameVi) : isEn ? 'You' : 'Em'} ·{' '}
                    {msg.timestamp}
                  </span>
                </div>
              ))}

            {isLoading &&
              !(
                currentMessages[currentMessages.length - 1]?.role === 'tutor' &&
                currentMessages[currentMessages.length - 1]?.text.length > 0
              ) && (
                <div className="animate-msg-in flex items-end gap-2.5">
                  <div
                    className={`syn-core-pulse w-8 h-8 rounded-md ring-1 flex items-center justify-center shrink-0 mb-0.5 shadow-sm ${activeMeta.avatarRing}`}
                  >
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="sci-frame bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 text-xs text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-3">
                    {/* 5-bar modern harmonic waveform */}
                    <div className="flex items-center gap-0.5 h-4 shrink-0" aria-hidden="true">
                      <span className={`w-1 h-4 rounded-xs ${activeMeta.eqBar} syn-eq-1`} />
                      <span className={`w-1 h-4 rounded-xs ${activeMeta.eqBar} syn-eq-2`} />
                      <span className={`w-1 h-4 rounded-xs ${activeMeta.eqBar} syn-eq-3`} />
                      <span className={`w-1 h-4 rounded-xs ${activeMeta.eqBar} syn-eq-4`} />
                      <span className={`w-1 h-4 rounded-xs ${activeMeta.eqBar} syn-eq-5`} />
                    </div>
                    <span className="font-medium">
                      {activeMode === 'full_solution'
                        ? isEn
                          ? `${activeMeta.nameEn} is preparing full summary & detailed solution...`
                          : `${activeMeta.nameVi} đang tóm tắt đề và giải chi tiết...`
                        : activeMode === 'diagnostic_roadmap'
                        ? isEn
                          ? `${activeMeta.nameEn} is updating your study advice...`
                          : `${activeMeta.nameVi} đang tinh chỉnh lộ trình cho em...`
                        : isEn
                        ? `${activeMeta.nameEn} is analyzing your unclear step...`
                        : `${activeMeta.nameVi} đang phân tích kỹ phần em chưa hiểu...`}
                    </span>
                  </div>
                </div>
              )}

            {errorMsg && (
              <div className="p-3.5 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2 shadow-xs">
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-[11px] font-bold underline shrink-0 cursor-pointer"
                >
                  {isEn ? 'Dismiss' : 'Đóng'}
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* QUICK TACTICAL PROMPTS */}
      <div className="px-3.5 sm:px-5 py-2.5 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className={`${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>{isEn ? 'Quick prompts:' : 'Gợi ý hỏi nhanh:'}</span>
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
              {isEn ? 'Paste image: Ctrl+V' : 'Dán ảnh đề: Ctrl+V'}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickChips.map((prompt, i) => (
              <button
                key={i}
                data-ripple="true"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="sheen-btn px-3 py-1.5 rounded-md bg-slate-100/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 border border-slate-200 dark:border-slate-700 hover:border-sky-400 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0 transition-all cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MULTIMODAL COMPOSER */}
      <div className="px-3.5 sm:px-5 py-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className={`space-y-2.5 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
          {pendingImage && (
            <div className="flex items-center justify-between px-3 py-2 rounded-md bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/35 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    pendingImage.base64.startsWith('data:')
                      ? pendingImage.base64
                      : `data:${pendingImage.mimeType};base64,${pendingImage.base64}`
                  }
                  alt="Preview"
                  className="w-9 h-9 rounded object-cover border border-indigo-300/60 shrink-0"
                />
                <span className="text-indigo-900 dark:text-indigo-200 font-semibold truncate">
                  {isEn ? 'Attached photo of problem/step' : 'Đã đính kèm ảnh bài tập / bước giải'}
                </span>
              </div>
              <button
                onClick={() => setPendingImage(null)}
                className="text-rose-500 hover:underline text-[11px] font-bold ml-2 shrink-0 cursor-pointer"
              >
                {isEn ? 'Remove' : 'Xóa'}
              </button>
            </div>
          )}

          <div
            className={`flex items-end gap-1.5 p-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner transition-all focus-within:ring-2 ${activeMeta.accentRing}`}
          >
            <label
              data-ripple="true"
              className="p-2.5 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0 transition-all active:scale-95"
              title={isEn ? 'Attach problem photo (or drag/paste Ctrl+V)' : 'Gửi ảnh đề bài (hoặc kéo thả / dán Ctrl+V)'}
            >
              <ImageIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <input type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
            </label>

            <VoiceMicButton
              language={language}
              disabled={isLoading}
              onTranscript={(spoken) =>
                setInputText((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
              }
            />

            <button
              type="button"
              onClick={() => setIsScratchpadOpen(true)}
              className="p-2.5 rounded-md bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-slate-600 dark:text-slate-300 hover:text-sky-600 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0 transition-all"
              title={isEn ? 'Open Scratchpad & Math Ink' : 'Mở Bảng Nháp Vẽ Tay & Công Thức'}
            >
              <PenTool className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

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
                    ? 'Paste a problem, drop image, Ctrl+V or click Mic to speak...'
                    : 'Dán đề, kéo thả/Ctrl+V ảnh đề hoặc bấm Mic để đọc câu hỏi...'
                  : activeMode === 'diagnostic_roadmap'
                  ? isEn
                    ? 'Ask to refine your study roadmap (text or voice)...'
                    : 'Hỏi thêm bằng chữ hoặc giọng nói để tinh chỉnh sơ đồ học tập...'
                  : isEn
                  ? 'Describe the step you do not understand (text, image or voice)...'
                  : 'Nhập đề, dán ảnh (Ctrl+V) hoặc bấm Mic nói phần em chưa hiểu...'
              }
              className="flex-1 px-2.5 py-2 bg-transparent text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!inputText.trim() && !pendingImage)}
              className={`sheen-btn p-3 rounded-md shrink-0 transition-all disabled:opacity-40 cursor-pointer ${activeMeta.sendBtn}`}
              title={isEn ? 'Send to Syn AI' : 'Gửi tới Syn AI'}
            >
              <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
      <InteractiveScratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        defaultSubject={activeSubject}
        contextTitle={context.topicTitle || activeMeta.nameVi}
        onAttachToTutor={(imgDataUrl, latexNote) => {
          const cleanBase64 = imgDataUrl.includes(',') ? imgDataUrl.split(',')[1] : imgDataUrl;
          setPendingImage({ base64: cleanBase64, mimeType: 'image/jpeg' });
          if (latexNote) {
            setInputText((prev) => (prev.trim() ? `${prev.trim()}\n$$${latexNote}$$` : `$$${latexNote}$$`));
          } else if (!inputText.trim()) {
            setInputText('Hãy kiểm tra giúp em từng bước trong ảnh bài nháp này.');
          }
        }}
      />
    </div>
  );

  if (isFullscreen) {
    return <ViewportPortal active={true}>{tutorWindow}</ViewportPortal>;
  }

  return tutorWindow;
};
