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
  ArrowLeft
} from 'lucide-react';
import { SubjectType, TutorContextPayload, TutorMessage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { FormattedText } from '../common/MathRenderer';
import { ViewportPortal } from '../common/ViewportPortal';

interface SocraticAITutorProps {
  isOpen: boolean;
  onClose: () => void;
  context: TutorContextPayload;
  onChangeSubject?: (subj: SubjectType) => void;
}

export const SocraticAITutor: React.FC<SocraticAITutorProps> = ({
  isOpen,
  onClose,
  context,
  onChangeSubject
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const makeWelcomeMessage = (ctx: TutorContextPayload): TutorMessage => ({
    id: `welcome_${Date.now()}`,
    role: 'tutor',
    text: isEn
      ? `Hello! I am your **Socratic Mentor**${ctx.topicTitle ? ` for **${ctx.topicTitle}**` : ''}. I won't give away the final answer directly—instead, let's solve it together!\n\n**Which exact part or step are you unsure about?** (For example: understanding what the problem asks, choosing the right formula, or a specific algebraic/code step?)`
      : `Chào em! Thầy/Cô là **Trợ Giảng AI Socratic**${ctx.topicTitle ? ` đang đồng hành ở chủ đề **${ctx.topicTitle}**` : ''}. Nguyên tắc của lớp mình là **không giải hộ ra đáp án cuối cùng ngay**, mà sẽ cùng em tháo gỡ đúng chỗ vướng mắc.\n\n**Em hãy cho thầy/cô biết em đang chưa hiểu cụ thể ở phần nào?** (Ví dụ: chưa hiểu đề bài hỏi gì, quên công thức nào, hay bị kẹt ở bước biến đổi nào?)`,
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  });

  const [messages, setMessages] = useState<TutorMessage[]>(() => [makeWelcomeMessage(context)]);
  const [inputText, setInputText] = useState('');
  const [activeSubject, setActiveSubject] = useState<SubjectType>(context.subject || 'math');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveSubject(context.subject || 'math');
  }, [context.subject]);

  useEffect(() => {
    if (context.topicTitle || context.problemStatement) {
      setMessages([makeWelcomeMessage(context)]);
    }
  }, [context.topicTitle, context.problemStatement, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  const diagnosticPrompts = isEn
    ? [
        'I do not understand the core concept or what the question asks',
        'I forgot which formula or theorem applies here',
        'I got stuck in the middle algebraic / logic step',
        'Check if my initial approach is on the right track'
      ]
    : [
        'Em chưa hiểu bản chất khái niệm / đề bài đang hỏi gì',
        'Em chưa biết nên dùng công thức hay định lí nào',
        'Em bị kẹt ở bước biến đổi trung gian này',
        'Thầy/cô xem giúp hướng giải em tự nghĩ đúng chưa'
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
      text: textToSend || (isEn ? 'Here is the problem/step I am stuck on:' : 'Đây là phần bài làm em đang vướng:'),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      imagePreview: pendingImage?.base64
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
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

      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          context: {
            ...context,
            subject: activeSubject
          },
          language
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Lỗi phản hồi từ Trợ giảng AI');
      }

      const tutorMsg: TutorMessage = {
        id: `t_${Date.now()}`,
        role: 'tutor',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể kết nối AI Trợ Giảng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([makeWelcomeMessage({ ...context, subject: activeSubject })]);
    setErrorMsg(null);
    setPendingImage(null);
  };

  const tutorWindow = (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[115] w-screen h-[100dvh] bg-white dark:bg-slate-950 flex flex-col overflow-hidden'
          : 'fixed bottom-4 right-4 z-[95] w-[calc(100vw-2rem)] sm:w-[440px] md:w-[480px] h-[min(640px,82dvh)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden'
      }
    >
      {/* Top Bar */}
      <div className="px-4 py-3 bg-slate-900 dark:bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 flex items-center gap-1 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isEn ? 'Back' : 'Thu gọn'}</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate">
              {isEn ? 'Socratic AI Tutor (Guided Hints)' : 'Gia Sư AI Socratic (Hỏi & Giảng Lại)'}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              {context.topicTitle
                ? context.topicTitle
                : isEn
                ? 'Explains exact unclear steps · Never spoils final answers'
                : 'Hỏi chỗ chưa hiểu · Giảng cụ thể từng bước · Không giải hộ'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isEn ? 'Start fresh dialogue' : 'Tạo cuộc hội thoại mới'}
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

      {/* Subject Context Selector */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'math' as SubjectType, label: isEn ? 'Math' : 'Toán học' },
            { id: 'physics' as SubjectType, label: isEn ? 'Physics' : 'Vật lí' },
            { id: 'cs' as SubjectType, label: isEn ? 'CS / Code' : 'Tin học' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSubject(s.id);
                onChangeSubject?.(s.id);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                activeSubject === s.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline truncate">
          <BookOpen className="w-3 h-3 inline mr-1" />
          {isEn ? 'Step-by-step Mode' : 'Chế độ giảng từng bước'}
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
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
              {msg.role === 'tutor' ? 'Gia sư AI' : 'Em'} · {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              {isEn ? 'Tutor is reviewing your exact question...' : 'Thầy/Cô đang xem kỹ phần em chưa hiểu để giảng lại...'}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Diagnostic Quick Chips */}
      <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isEn ? 'Tell the tutor what you do not understand:' : 'Chọn nhanh phần em đang vướng:'}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {diagnosticPrompts.map((prompt, i) => (
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
              isEn
                ? 'Type the concept, formula, or step you do not understand...'
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
