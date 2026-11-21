import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  X,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  Crown,
  Zap,
  GitBranch,
  Film,
  Copy,
  Check,
  PenTool,
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX,
  Eye,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Clock,
  Target,
  FileCheck2,
  Layers
} from 'lucide-react';
import {
  DiagnosticQuestion,
  PersonalizedRoadmapResult,
  SubjectType,
  TutorMessage
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
import { ViewportPortal } from '../common/ViewportPortal';
import { safeFetchJson, streamTutorChat } from '../../lib/apiClient';
import { useNavigation, getLocationLabel } from '../../context/NavigationContext';
import { VoiceMicButton } from '../common/VoiceMicButton';
import { InteractiveScratchpad } from '../common/InteractiveScratchpad';
import { MotionReelMiniChat } from './MotionReelMiniChat';
import {
  captureWorkspaceSnapshot,
  cancelActiveSpeech,
  requestLiveCoPilotReply,
  speakCoPilotReply,
  useLiveWorkspaceContext
} from '../../lib/liveCoPilotBridge';
import { AI_ROADMAPS_STORAGE_KEY } from './SocraticAITutor';

export type SynProMode = 'pro_turbo' | 'pro_deep' | 'pro_roadmap' | 'motion_reel';
export type SynProDomain = 'all' | 'math' | 'physics' | 'cs';

interface SynAIProChatProps {
  isOpen: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onBack?: () => void;
  initialMode?: SynProMode;
  initialDomain?: SynProDomain;
  onNavigateSubject?: (subj: SubjectType) => void;
}

const PRO_THREADS_STORAGE_KEY = 'synapse_ai_pro_threads_v1';

const PRO_DOMAINS: { id: SynProDomain; labelVi: string; labelEn: string; apiSubj: 'math' | 'physics' | 'cs' }[] = [
  { id: 'all', labelVi: 'Toàn Năng STEM', labelEn: 'All-in-One STEM', apiSubj: 'math' },
  { id: 'math', labelVi: 'Toán Chuyên', labelEn: 'Advanced Math', apiSubj: 'math' },
  { id: 'physics', labelVi: 'Vật Lí 3D', labelEn: '3D Physics', apiSubj: 'physics' },
  { id: 'cs', labelVi: 'Thuật Toán & AI', labelEn: 'Algorithms & AI', apiSubj: 'cs' }
];

const PRO_MAJORS_VI: Record<'math' | 'physics' | 'cs', string[]> = {
  math: [
    'Đội tuyển Chuyên Toán / HSG / Đánh giá năng lực 9+',
    'Công nghệ thông tin, Trí tuệ nhân tạo & Khoa học dữ liệu',
    'Kinh tế, Tài chính định lượng & Khoa học quản lý'
  ],
  physics: [
    'Đội tuyển Chuyên Lí / HSG / Mục tiêu 9+ THPT QG',
    'Kỹ thuật Điện - Tự động hóa - Robotics',
    'Vi mạch bán dẫn - Vật lí kỹ thuật & Hàng không'
  ],
  cs: [
    'Lập trình thi đấu (Chuyên Tin / HSG QG / VNOI / ICPC)',
    'Trí tuệ nhân tạo (AI), Machine Learning & Khoa học dữ liệu',
    'Kỹ thuật phần mềm & Hệ thống phân tán'
  ]
};

function loadSavedProThreads(): Record<string, TutorMessage[]> {
  try {
    const raw = sessionStorage.getItem(PRO_THREADS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const SynAIProChat: React.FC<SynAIProChatProps> = ({
  isOpen,
  onMinimize,
  onClose,
  onBack,
  initialMode = 'pro_turbo',
  initialDomain = 'all',
  onNavigateSubject
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { previousLocation } = useNavigation();
  const backLabel = previousLocation
    ? getLocationLabel(previousLocation, language)
    : isEn
    ? 'Classroom'
    : 'Lớp học';

  const [proMode, setProMode] = useState<SynProMode>(initialMode);
  const [proDomain, setProDomain] = useState<SynProDomain>(initialDomain);
  const [threads, setThreads] = useState<Record<string, TutorMessage[]>>(loadSavedProThreads);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [reelTopicSeed, setReelTopicSeed] = useState('');

  // Live Vision + Voice Co-Pilot
  const liveWorkspaceCtx = useLiveWorkspaceContext();
  const [liveCoPilotEnabled, setLiveCoPilotEnabled] = useState(false);
  const [coPilotVoiceAuto, setCoPilotVoiceAuto] = useState(true);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  screenStreamRef.current = screenStream;

  // Roadmap diagnostics inside Syn AI Pro
  const apiSubject: 'math' | 'physics' | 'cs' =
    PRO_DOMAINS.find((d) => d.id === proDomain)?.apiSubj || 'math';
  const [diagGrade, setDiagGrade] = useState('Lớp 12');
  const [diagSelfLevel, setDiagSelfLevel] = useState('Khá');
  const [diagMajor, setDiagMajor] = useState(PRO_MAJORS_VI.math[0]);
  const [diagCustomGoal, setDiagCustomGoal] = useState('');
  const [diagQuestions, setDiagQuestions] = useState<DiagnosticQuestion[]>([]);
  const [diagAnswers, setDiagAnswers] = useState<Record<string, number>>({});
  const [diagLoadingQuiz, setDiagLoadingQuiz] = useState(false);
  const [diagLoadingRoadmap, setDiagLoadingRoadmap] = useState(false);
  const [diagError, setDiagError] = useState<string | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<PersonalizedRoadmapResult | null>(() => {
    try {
      const saved = localStorage.getItem(AI_ROADMAPS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      return parsed?.math || null;
    } catch {
      return null;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setProDomain(initialDomain);
  }, [initialDomain]);

  useEffect(() => {
    setDiagMajor(PRO_MAJORS_VI[apiSubject][0]);
  }, [apiSubject]);

  useEffect(() => {
    try {
      sessionStorage.setItem(PRO_THREADS_STORAGE_KEY, JSON.stringify(threads));
    } catch {
      // ignore sessionStorage limits
    }
  }, [threads]);

  useEffect(() => {
    return () => {
      cancelActiveSpeech();
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

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

  const threadKey = `pro_${proDomain}_${proMode}`;

  // Stable deterministic welcome message (no Date.now() on re-render to avoid jitter)
  const welcomeMessage: TutorMessage = useMemo(() => {
    const domainLabel =
      PRO_DOMAINS.find((d) => d.id === proDomain)?.[isEn ? 'labelEn' : 'labelVi'] || 'Toàn Năng STEM';

    if (proMode === 'pro_deep') {
      return {
        id: `welcome_pro_deep_${proDomain}`,
        role: 'tutor',
        text: isEn
          ? `Welcome to **Syn AI Pro · Deep Olympiad Reasoning** (${domainLabel}).\n\nI provide multi-approach proofs, subtle boundary conditions, and structural insights beyond standard textbooks. Share any challenging problem or screenshot below.`
          : `Chào mừng em đến với **Syn AI Pro · Suy Luận Chuyên Sâu** (${domainLabel}).\n\nĐây là trợ lý riêng độc quyền của **Synapse Pre**: AI sẽ phân tích đa hướng giải, chỉ ra bẫy điều kiện biên và bản chất sâu nhất của bài toán. Hãy gửi đề bài hoặc ảnh chụp ngay bên dưới!`,
        timestamp: 'PRO'
      };
    }

    if (proMode === 'pro_roadmap') {
      return {
        id: `welcome_pro_roadmap_${proDomain}`,
        role: 'tutor',
        text: isEn
          ? `Welcome to **Syn AI Pro · Skill Architect & Flowchart** (${domainLabel}).\n\nGenerate the 5-question assessment above to build your bespoke study flowchart, or ask me directly how to optimize your weekly target.`
          : `Chào mừng em đến với **Syn AI Pro · Phân Tích & Sơ Đồ Pro** (${domainLabel}).\n\nHãy bấm tạo bộ **5 câu hỏi chẩn đoán** ngay phía trên để Syn AI Pro lập sơ đồ lộ trình học tập riêng, hoặc chat trực tiếp bên dưới để tinh chỉnh kế hoạch.`,
        timestamp: 'PRO'
      };
    }

    return {
      id: `welcome_pro_turbo_${proDomain}`,
      role: 'tutor',
      text: isEn
        ? `Hello! I am **Syn AI Pro** — the dedicated flagship assistant for **Synapse Pre** (${domainLabel}).\n\nEvery solution uses a crystal-clear **3-Layer Scientific Layout**:\n1. **Core Summary & Intuition**\n2. **Optimal Strategy**\n3. **Verified Step-by-Step Solution & Final Answer**`
        : `Chào em! Mình là **Syn AI Pro** — trợ lý AI độc quyền dành riêng cho **Synapse Pre** (${domainLabel}).\n\nMỗi câu trả lời được trình bày theo **Bố cục 3 Tầng Khoa Học** tốc độ cao:\n1. **Tóm tắt giả thiết & Bản chất bài toán**\n2. **Chiến lược / Phương pháp giải tối ưu**\n3. **Lời giải chuẩn từng bước & Kết quả kiểm chứng**`,
      timestamp: 'PRO'
    };
  }, [proDomain, proMode, isEn]);

  const currentMessages = threads[threadKey] || [welcomeMessage];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages.length, isLoading, isOpen]);

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

  const toggleScreenVisionShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      return;
    }
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
      setErrorMsg(
        isEn
          ? 'Screen share unsupported here — Syn AI Pro still captures your active simulation canvas.'
          : 'Trình duyệt không hỗ trợ Chia sẻ màn hình — Syn AI Pro vẫn tự quan sát Canvas mô phỏng đang mở.'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      stream.getVideoTracks()[0]?.addEventListener('ended', () => setScreenStream(null));
      setScreenStream(stream);
      setLiveCoPilotEnabled(true);
    } catch {
      // User cancelled cleanly
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedMsgId(msgId);
      window.setTimeout(() => {
        setCopiedMsgId((prev) => (prev === msgId ? null : prev));
      }, 1800);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setThreads((prev) => ({
      ...prev,
      [threadKey]: [welcomeMessage]
    }));
    setErrorMsg(null);
    setPendingImage(null);
  };

  const handleSend = async (overrideText?: string, fromVoiceBargeIn = false) => {
    const textToSend = (overrideText ?? inputText).trim();
    if (!textToSend && !pendingImage) return;
    if (isLoading) return;

    cancelActiveSpeech();

    let attachedImage = pendingImage;
    let visionTag = '';
    if ((liveCoPilotEnabled || fromVoiceBargeIn) && !attachedImage) {
      const snap = await captureWorkspaceSnapshot(screenStreamRef.current);
      if (snap.imageBase64) {
        attachedImage = { base64: snap.imageBase64, mimeType: snap.mimeType };
        visionTag =
          snap.sourceKind === 'screen_share'
            ? isEn
              ? '[Screen Vision] '
              : '[Mắt Thần Màn Hình] '
            : isEn
            ? '[Canvas Vision] '
            : '[Mắt Thần Mô Phỏng] ';
      }
    }

    const targetThreadKey = threadKey;
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: TutorMessage = {
      id: `pro_u_${Date.now()}`,
      role: 'user',
      text:
        (visionTag ? `${visionTag}` : '') +
        (textToSend || (isEn ? 'Please analyze this attached image:' : 'Phân tích giúp em ảnh bài toán này:')),
      timestamp: nowTime,
      imagePreview: attachedImage
        ? attachedImage.base64.startsWith('data:')
          ? attachedImage.base64
          : `data:${attachedImage.mimeType};base64,${attachedImage.base64}`
        : undefined
    };

    const nextHistory = [...currentMessages, userMsg];
    const tutorMsgId = `pro_t_${Date.now() + 1}`;
    const placeholderTutorMsg: TutorMessage = {
      id: tutorMsgId,
      role: 'tutor',
      text: '',
      timestamp: nowTime
    };

    setThreads((prev) => ({ ...prev, [targetThreadKey]: [...nextHistory, placeholderTutorMsg] }));
    if (!overrideText) setInputText('');
    const imageToSend = attachedImage;
    setPendingImage(null);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (liveCoPilotEnabled || fromVoiceBargeIn) {
        const coRes = await requestLiveCoPilotReply({
          question:
            textToSend ||
            (isEn
              ? 'Analyze what is on my workspace right now.'
              : 'Phân tích giúp em nội dung đang hiển thị trên màn hình lúc này.'),
          subject: apiSubject,
          language,
          workspaceCtx: liveWorkspaceCtx,
          imageBase64: imageToSend?.base64,
          mimeType: imageToSend?.mimeType
        });
        const formattedReply = [
          coRes.spokenAnswer,
          coRes.visualPinHint ? `\n\n**${isEn ? 'Visual Focus' : 'Vị trí cần chú ý'}:** ${coRes.visualPinHint}` : '',
          coRes.formulaLatex ? `\n\n$$${coRes.formulaLatex}$$` : '',
          coRes.nextStepQuestion ? `\n\n*${coRes.nextStepQuestion}*` : ''
        ]
          .filter(Boolean)
          .join('');

        setThreads((prev) => ({
          ...prev,
          [targetThreadKey]: (prev[targetThreadKey] || []).map((m) =>
            m.id === tutorMsgId ? { ...m, text: formattedReply } : m
          )
        }));
        if (coPilotVoiceAuto) {
          speakCoPilotReply(coRes.spokenAnswer, language);
        }
        return;
      }

      const modeDirective =
        proMode === 'pro_deep'
          ? '[SYN AI PRO · SUY LUẬN CHUYÊN SÂU ĐA HƯỚNG · PHÂN TÍCH BẪY ĐIỀU KIỆN BIÊN]'
          : proMode === 'pro_roadmap'
          ? '[SYN AI PRO · CỐ VẤN SƠ ĐỒ LỘ TRÌNH & CHIẾN LƯỢC ÔN THI]'
          : '[SYN AI PRO · TURBO 3 TẦNG: 1) TÓM TẮT & BẢN CHẤT 2) PHƯƠNG PHÁP TỐI ƯU 3) LỜI GIẢI CHI TIẾT & ĐÁP ÁN CUỐI]';

      const domainDirective =
        proDomain === 'all' ? '[CHUYÊN MÔN: TOÀN NĂNG STEM TOÁN - LÍ - TIN]' : `[CHUYÊN MÔN: ${proDomain.toUpperCase()}]`;

      const apiMessages = nextHistory.map((m, idx) => ({
        role: m.role,
        text:
          idx === nextHistory.length - 1
            ? `${modeDirective} ${domainDirective} ${m.text}`
            : m.text,
        ...(idx === nextHistory.length - 1 && imageToSend
          ? { imageBase64: imageToSend.base64, mimeType: imageToSend.mimeType }
          : {})
      }));

      const mappedMode = proMode === 'pro_roadmap' ? 'diagnostic_roadmap' : 'full_solution';

      const streamRes = await streamTutorChat(
        {
          messages: apiMessages,
          context: {
            subject: apiSubject,
            mode: mappedMode,
            topicTitle: 'Syn AI Pro · Synapse Pre'
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
        throw new Error(streamRes.error || 'Syn AI Pro không thể phản hồi lúc này. Vui lòng thử lại.');
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
      setErrorMsg(err?.message || 'Không thể kết nối Syn AI Pro. Vui lòng kiểm tra kết nối và thử lại.');
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
          subject: apiSubject,
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
      setDiagError(res.error || 'Syn AI Pro chưa tạo được bộ câu hỏi. Vui lòng bấm thử lại.');
      return;
    }
    setDiagQuestions(res.data.questions);
    setDiagAnswers({});
  };

  const handleBuildRoadmap = async () => {
    if (diagLoadingRoadmap || diagQuestions.length === 0) return;
    if (diagQuestions.some((q) => typeof diagAnswers[q.id] !== 'number')) {
      setDiagError('Em hãy chọn đầy đủ 5 câu hỏi trước khi xuất Sơ đồ Pro nhé.');
      return;
    }
    setDiagLoadingRoadmap(true);
    setDiagError(null);
    const quizAnswers = diagQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      topicTag: q.topicTag,
      question: q.question,
      selectedIndex: diagAnswers[q.id],
      selectedOption: q.options[diagAnswers[q.id]] || '',
      correctIndex: q.correctIndex,
      correctOption: typeof q.correctIndex === 'number' ? q.options[q.correctIndex] : undefined
    }));
    const res = await safeFetchJson<{ success?: boolean; roadmap?: PersonalizedRoadmapResult; error?: string }>(
      '/api/gemini/diagnostic-roadmap',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: apiSubject,
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
      setDiagError(res.error || 'Syn AI Pro chưa hoàn thành sơ đồ. Vui lòng thử lại.');
      return;
    }
    setActiveRoadmap(res.data.roadmap);
    try {
      const saved = localStorage.getItem(AI_ROADMAPS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        AI_ROADMAPS_STORAGE_KEY,
        JSON.stringify({ ...parsed, [apiSubject]: res.data.roadmap })
      );
      window.dispatchEvent(new Event('educlassroom:roadmap-updated'));
    } catch {}
  };

  const quickChips =
    proMode === 'pro_deep'
      ? [
          'Phân tích đa hướng giải & chỉ ra bẫy điều kiện biên',
          'Chứng minh chặt chẽ & tổng quát hóa bài toán này',
          'Tối ưu độ phức tạp thuật toán xuống mức tốt nhất'
        ]
      : proMode === 'pro_roadmap'
      ? [
          'Tối ưu sơ đồ ôn thi còn 45 phút mỗi ngày',
          'Xếp thứ tự 4 chuyên đề trọng tâm cần cày trước',
          'Phân tích lỗ hổng kiến thức phổ biến ở khối 12'
        ]
      : [
          'Giải siêu tốc theo bố cục 3 tầng khoa học',
          'Tóm tắt giả thiết, nêu chiến lược và chốt đáp số cuối',
          'So sánh 2 cách làm: tự luận chuẩn và mẹo trắc nghiệm nhanh'
        ];

  const shellClass = !isOpen
    ? 'hidden'
    : isFullscreen
    ? 'fixed inset-0 z-[115] w-screen h-[100dvh] bg-[#050b18] text-slate-100 flex flex-col overflow-hidden'
    : `fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[95] w-[calc(100vw-1.5rem)] ${
        proMode === 'motion_reel' ? 'sm:w-[680px] lg:w-[860px]' : 'sm:w-[580px] md:w-[650px]'
      } h-[min(780px,90dvh)] bg-[#050b18] text-slate-100 border ${
        isDraggingImage ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-400/55'
      } rounded-xl shadow-[0_32px_90px_-14px_rgba(2,6,23,0.92)] flex flex-col overflow-hidden`;

  const proWindow = (
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
          }
        }
      }}
      className={shellClass}
    >
      {isDraggingImage && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center gap-2 text-white pointer-events-none">
          <ImageIcon className="w-8 h-8 text-amber-300" />
          <div className="text-sm font-bold">Thả ảnh đề bài vào để Syn AI Pro giải siêu tốc</div>
        </div>
      )}

      {/* SYN AI PRO HEADER */}
      <div className="px-3.5 sm:px-5 py-3 bg-gradient-to-r from-[#070d1f] via-[#121936] to-[#081526] border-b border-amber-400/35 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={() => {
                if (isFullscreen) setIsFullscreen(false);
                onBack();
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-200 flex items-center gap-1 shrink-0 cursor-pointer"
              title={`Quay lại ${backLabel}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-[95px] truncate">{backLabel}</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-cyan-400 p-[1.5px] shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            <div className="w-full h-full rounded-[10px] bg-[#070d1f] flex items-center justify-center text-amber-300">
              <Crown className="w-5 h-5" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-cyan-400 font-mono text-[10px] font-black tracking-wider text-slate-950 uppercase">
                SYN AI PRO
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                {isEn ? 'Synapse Pre Neural Engine' : 'Siêu Trợ Lý Synapse Pre'}
              </h3>
            </div>
            <p className="text-[11px] text-amber-200/80 truncate">
              {isEn
                ? '3-Layer Fast Solver · Deep Proof · 3B1B Video Studio'
                : 'Giải Siêu Tốc 3 Tầng · Biện Luận Sâu · Dựng Video 3B1B'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title={isEn ? 'Reset conversation' : 'Làm mới cuộc trò chuyện'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(false);
              onMinimize();
            }}
            className="px-2.5 py-1.5 rounded-lg text-amber-200 hover:text-slate-950 bg-amber-500/20 hover:bg-amber-400 border border-amber-400/50 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title={isEn ? 'Pause & keep chat to resume later' : 'Tạm đóng — Giữ nguyên cuộc trò chuyện để mở lại tiếp tục'}
          >
            <Minus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Pause' : 'Tạm đóng'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ' : 'Mở toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(false);
              onClose();
            }}
            className="p-2 rounded-lg text-slate-300 hover:text-rose-300 bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PRO MODES + DOMAIN STRIP (100% OPAQUE DARK OBSIDIAN) */}
      <div className="px-3.5 sm:px-5 py-2.5 bg-[#081022] border-b border-slate-800 space-y-2 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {[
            { id: 'pro_turbo' as const, code: '01', label: isEn ? '3-Layer Fast' : 'Giải Siêu Tốc', icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'pro_deep' as const, code: '02', label: isEn ? 'Deep Reasoning' : 'Suy Luận Sâu', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'pro_roadmap' as const, code: '03', label: isEn ? 'Pro Flowchart' : 'Sơ Đồ Pro', icon: <GitBranch className="w-3.5 h-3.5" /> },
            { id: 'motion_reel' as const, code: '04', label: isEn ? 'Video 3B1B AI' : 'Video 3B1B AI', icon: <Film className="w-3.5 h-3.5" /> }
          ].map((tab) => {
            const active = proMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setProMode(tab.id);
                  setErrorMsg(null);
                }}
                className={`flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                  active
                    ? tab.id === 'motion_reel'
                      ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 text-slate-950 border-amber-300'
                      : 'bg-cyan-500/20 text-cyan-200 border-cyan-400/70'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{tab.code}</span>
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-wrap">
            {PRO_DOMAINS.map((d) => {
              const selected = proDomain === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setProDomain(d.id)}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-amber-400/20 border-amber-400/70 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isEn ? d.labelEn : d.labelVi}
                </button>
              );
            })}
          </div>

          {proMode !== 'motion_reel' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const next = !liveCoPilotEnabled;
                  setLiveCoPilotEnabled(next);
                  if (!next) cancelActiveSpeech();
                }}
                className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                  liveCoPilotEnabled
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-400'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Mắt Thần AI</span>
              </button>
              <button
                type="button"
                onClick={() => void toggleScreenVisionShare()}
                className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                  screenStream
                    ? 'bg-cyan-600 border-cyan-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400'
                }`}
              >
                {screenStream ? <MonitorOff className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                <span className="hidden md:inline">{screenStream ? 'Dừng Share' : 'Share Màn Hình'}</span>
              </button>
              {liveCoPilotEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    const next = !coPilotVoiceAuto;
                    setCoPilotVoiceAuto(next);
                    if (!next) cancelActiveSpeech();
                  }}
                  className={`p-1 rounded border cursor-pointer ${
                    coPilotVoiceAuto
                      ? 'bg-sky-600 border-sky-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {coPilotVoiceAuto ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SOLID OPAQUE MESSAGE VIEWPORT (NO TRANSPARENCY BLEED / NO JITTER) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 bg-[#050b18]">
        <div className={`space-y-4 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
          {proMode === 'motion_reel' ? (
            <MotionReelMiniChat
              language={language}
              subject={apiSubject}
              initialTopic={reelTopicSeed}
            />
          ) : (
            <>
              {proMode === 'pro_roadmap' && (
                <div className="rounded-xl border border-cyan-500/35 bg-[#0b1326] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white">
                      <BrainCircuit className="w-4 h-4 text-cyan-400" />
                      <span>Chẩn Đoán & Sơ Đồ Pro ({apiSubject.toUpperCase()})</span>
                    </div>
                    {activeRoadmap && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã có sơ đồ
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <select
                      value={diagGrade}
                      onChange={(e) => setDiagGrade(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                    >
                      {['Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <select
                      value={diagSelfLevel}
                      onChange={(e) => setDiagSelfLevel(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                    >
                      <option value="Cần xây lại gốc">Cần xây lại gốc</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Khá">Khá</option>
                      <option value="Giỏi / Ôn Chuyên">Giỏi / Ôn Chuyên</option>
                    </select>
                  </div>

                  <select
                    value={diagMajor}
                    onChange={(e) => setDiagMajor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                  >
                    {PRO_MAJORS_VI[apiSubject].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={diagCustomGoal}
                    onChange={(e) => setDiagCustomGoal(e.target.value)}
                    placeholder="Mục tiêu riêng (VD: Đạt 9.5+ THPT QG, Thủ khoa đầu vào)..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs"
                  />

                  <button
                    type="button"
                    onClick={handleGenerateQuiz}
                    disabled={diagLoadingQuiz}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-extrabold text-xs cursor-pointer disabled:opacity-50"
                  >
                    {diagLoadingQuiz ? 'Đang tạo bộ 5 câu chẩn đoán Pro...' : 'Tạo 5 Câu Chẩn Đoán Năng Lực Pro'}
                  </button>

                  {diagError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
                      {diagError}
                    </div>
                  )}

                  {diagQuestions.length > 0 && (
                    <div className="space-y-3 pt-1">
                      {diagQuestions.map((q, qi) => (
                        <div key={q.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                          <div className="text-xs font-bold text-slate-100">
                            Câu {qi + 1}: <FormattedText text={q.question} />
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            {q.options.map((opt, oi) => {
                              const checked = diagAnswers[q.id] === oi;
                              return (
                                <button
                                  key={oi}
                                  type="button"
                                  onClick={() => setDiagAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                                  className={`text-left px-3 py-2 rounded-lg border text-xs cursor-pointer ${
                                    checked
                                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                                  }`}
                                >
                                  <FormattedText text={opt} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleBuildRoadmap}
                        disabled={diagLoadingRoadmap}
                        className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>{diagLoadingRoadmap ? 'Đang dựng Sơ Đồ Pro...' : 'Xuất Sơ Đồ Lộ Trình Pro'}</span>
                      </button>
                    </div>
                  )}

                  {activeRoadmap && (
                    <div className="rounded-lg bg-slate-900/90 border border-emerald-500/35 p-3.5 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                          <Target className="w-4 h-4" /> {activeRoadmap.estimatedLevel}
                        </span>
                        <span className="font-mono text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {activeRoadmap.dailyScheduleSummary}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {activeRoadmap.stages.slice(0, 4).map((st, idx) => (
                          <div key={`${st.phase}_${idx}`} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-amber-300">{st.phase} · {st.title}</span>
                              {onNavigateSubject && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateSubject(st.recommendedModule)}
                                  className="text-cyan-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  Học ngay <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300">{st.focusTopics.join(' · ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MESSAGE THREAD */}
              <div className="space-y-4">
                {currentMessages
                  .filter((msg) => msg.text.length > 0 || Boolean(msg.imagePreview))
                  .map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`flex items-end gap-2.5 max-w-[93%] ${
                          msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {msg.role === 'tutor' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 text-slate-950 flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
                            <Crown className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`rounded-xl px-4 py-3 text-xs sm:text-[13.5px] leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-cyan-400 text-slate-950 font-semibold shadow-md'
                              : 'bg-[#0b1326] border border-cyan-500/35 text-slate-100 shadow-md'
                          }`}
                        >
                          {msg.role === 'tutor' && (
                            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-300">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              <span>SYN AI PRO · SYNAPSE PRE ENGINE</span>
                            </div>
                          )}
                          {msg.imagePreview && (
                            <img
                              src={msg.imagePreview}
                              alt="Uploaded problem"
                              className="max-h-44 rounded-lg mb-2.5 border border-white/20 object-contain"
                            />
                          )}
                          {msg.role === 'user' ? (
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                          ) : (
                            <div className="space-y-1.5 text-slate-100">
                              <FormattedText text={msg.text} />
                            </div>
                          )}
                          {msg.role === 'tutor' && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.text)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-slate-200 cursor-pointer"
                              >
                                {copiedMsgId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Đã chép</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Sao chép</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReelTopicSeed(msg.text.slice(0, 140));
                                  setProMode('motion_reel');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-[10px] font-bold text-amber-200 cursor-pointer"
                              >
                                <Film className="w-3 h-3" />
                                <span>Dựng Video 3B1B</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono text-slate-400 mt-1 ${
                          msg.role === 'tutor' ? 'pl-11' : 'pr-1'
                        }`}
                      >
                        {msg.role === 'tutor' ? 'Syn AI Pro' : isEn ? 'You' : 'Em'} · {msg.timestamp}
                      </span>
                    </div>
                  ))}

                {isLoading &&
                  !(
                    currentMessages[currentMessages.length - 1]?.role === 'tutor' &&
                    currentMessages[currentMessages.length - 1]?.text.length > 0
                  ) && (
                    <div className="flex items-end gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div className="bg-[#0b1326] border border-cyan-500/35 rounded-xl px-4 py-3 text-xs text-slate-200 flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>Syn AI Pro đang xử lý cấu trúc 3 tầng siêu tốc...</span>
                      </div>
                    </div>
                  )}

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-500/45 text-xs text-rose-200 flex items-center justify-between gap-2">
                    <span>{errorMsg}</span>
                    <button
                      type="button"
                      onClick={() => setErrorMsg(null)}
                      className="text-[11px] font-bold underline cursor-pointer shrink-0"
                    >
                      Đóng
                    </button>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* QUICK PRO CHIPS */}
      {proMode !== 'motion_reel' && (
        <div className="px-3.5 sm:px-5 py-2 bg-[#081022] border-t border-slate-800 shrink-0">
          <div className={`space-y-1.5 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1 text-amber-300">
                <Sparkles className="w-3 h-3" /> Gợi ý nhanh Syn AI Pro:
              </span>
              <span className="hidden sm:inline font-mono">Dán ảnh đề: Ctrl+V</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 text-[11px] font-semibold text-slate-200 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRO COMPOSER */}
      {proMode !== 'motion_reel' && (
        <div className="px-3.5 sm:px-5 py-3 bg-[#050b18] border-t border-slate-800 shrink-0">
          <div className={`space-y-2 ${isFullscreen ? 'max-w-5xl mx-auto' : ''}`}>
            {pendingImage && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-amber-400/40 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={
                      pendingImage.base64.startsWith('data:')
                        ? pendingImage.base64
                        : `data:${pendingImage.mimeType};base64,${pendingImage.base64}`
                    }
                    alt="Preview"
                    className="w-9 h-9 rounded object-cover border border-slate-700 shrink-0"
                  />
                  <span className="text-amber-200 font-semibold truncate">Đã đính kèm ảnh đề bài</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingImage(null)}
                  className="text-rose-400 hover:underline text-[11px] font-bold cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            )}

            <div className="flex items-end gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-amber-400/40 focus-within:ring-2 focus-within:ring-amber-400/50">
              <label
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer shrink-0 transition-colors"
                title="Gửi ảnh đề bài (hoặc dán Ctrl+V)"
              >
                <ImageIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) attachImageFile(f);
                  }}
                  className="hidden"
                />
              </label>

              <VoiceMicButton
                language={language}
                darkSurface={true}
                disabled={isLoading}
                onTranscript={(spoken) => {
                  cancelActiveSpeech();
                  if (liveCoPilotEnabled) {
                    void handleSend(spoken, true);
                  } else {
                    setInputText((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken));
                  }
                }}
              />

              <button
                type="button"
                onClick={() => setIsScratchpadOpen(true)}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer shrink-0 transition-colors"
                title="Mở Bảng Nháp Vẽ Tay & Công Thức"
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
                placeholder="Nhập đề bài, kéo thả hoặc Ctrl+V ảnh, hoặc bấm Mic để nói với Syn AI Pro..."
                className="flex-1 px-2.5 py-2 bg-transparent text-xs sm:text-[13px] text-slate-100 placeholder-slate-400 focus:outline-none resize-none"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={isLoading || (!inputText.trim() && !pendingImage)}
                className="p-3 rounded-lg bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 text-slate-950 font-bold shrink-0 hover:brightness-110 transition-all disabled:opacity-40 cursor-pointer"
                title="Gửi tới Syn AI Pro"
              >
                <Send className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      )}

      <InteractiveScratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        defaultSubject={apiSubject}
        contextTitle="Syn AI Pro · Bảng Nháp"
        onAttachToTutor={(imgDataUrl, latexNote) => {
          const cleanBase64 = imgDataUrl.includes(',') ? imgDataUrl.split(',')[1] : imgDataUrl;
          setPendingImage({ base64: cleanBase64, mimeType: 'image/jpeg' });
          if (latexNote) {
            setInputText((prev) => (prev.trim() ? `${prev.trim()}\n$$${latexNote}$$` : `$$${latexNote}$$`));
          } else if (!inputText.trim()) {
            setInputText('Hãy giải siêu tốc theo 3 tầng từ bài nháp trong ảnh này.');
          }
        }}
      />
    </div>
  );

  if (isFullscreen && isOpen) {
    return <ViewportPortal active={true}>{proWindow}</ViewportPortal>;
  }

  return proWindow;
};
