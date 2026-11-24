import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  Sparkles,
  User
} from 'lucide-react';
import { streamTutorChat } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';
import { VoiceMicButton } from '../common/VoiceMicButton';

interface QaMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface CsStepAiTutorPanelProps {
  isPaused: boolean;
  simCategory: '2d' | '3d' | 'trace';
  algorithmName: string;
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  formula?: string;
  activeCodeLineText?: string;
  variablesSummary?: string;
  codeSnippet?: string;
  isEn?: boolean;
}

export const CsStepAiTutorPanel: React.FC<CsStepAiTutorPanelProps> = ({
  isPaused,
  simCategory,
  algorithmName,
  stepNumber,
  totalSteps,
  stepTitle,
  stepDescription = '',
  formula = '',
  activeCodeLineText = '',
  variablesSummary = '',
  codeSnippet = '',
  isEn = false
}) => {
  const stepContextKey = `${simCategory}::${algorithmName}::${stepNumber}::${stepTitle}`;
  const [isOpen, setIsOpen] = useState(false);
  const [messagesByKey, setMessagesByKey] = useState<Record<string, QaMessage[]>>({});
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const activeRequestKeyRef = useRef<string>('');

  const messages = useMemo(() => messagesByKey[stepContextKey] || [], [messagesByKey, stepContextKey]);

  useEffect(() => {
    if (!isPaused) {
      setIsOpen(false);
      setErrorMsg(null);
    }
  }, [isPaused]);

  useEffect(() => {
    setErrorMsg(null);
  }, [stepContextKey]);

  useEffect(() => {
    if (isOpen && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isOpen, messages.length, isLoading]);

  if (!isPaused) {
    return null;
  }

  const buildStepSnapshotPrompt = (question: string) => {
    const lines = [
      `Tôi đang tạm dừng mô phỏng ${simCategory.toUpperCase()} của thuật toán/bài toán "${algorithmName}" tại Bước ${stepNumber}/${Math.max(1, totalSteps)}.`,
      `• Tiêu đề bước: ${stepTitle || 'Không rõ'}`,
      stepDescription ? `• Diễn biến tại bước này: ${stepDescription}` : '',
      formula ? `• Biểu thức / Công thức: ${formula}` : '',
      activeCodeLineText ? `• Dòng code đang thực thi: \`${activeCodeLineText.trim()}\`` : '',
      variablesSummary ? `• Trạng thái biến / dữ liệu hiện tại: ${variablesSummary}` : '',
      codeSnippet ? `• Mã nguồn tham chiếu:\n\`\`\`\n${codeSnippet.slice(0, 1400)}\n\`\`\`` : '',
      `Câu hỏi của học sinh: ${question}`
    ];
    return lines.filter(Boolean).join('\n');
  };

  const askAiAboutStep = async (questionText: string) => {
    const cleanQ = questionText.trim();
    if (!cleanQ || isLoading) return;

    const reqKey = stepContextKey;
    activeRequestKeyRef.current = reqKey;
    setErrorMsg(null);
    setIsOpen(true);

    const prior = messagesByKey[reqKey] || [];
    const nextHistory: QaMessage[] = [...prior, { role: 'user', text: cleanQ }];

    setMessagesByKey((prev) => ({
      ...prev,
      [reqKey]: [...nextHistory, { role: 'assistant', text: '' }]
    }));
    setIsLoading(true);

    const apiMessages = nextHistory.map((m, idx) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      text: idx === 0 && m.role === 'user' ? buildStepSnapshotPrompt(m.text) : m.text
    }));

    const res = await streamTutorChat(
      {
        messages: apiMessages,
        language: isEn ? 'en' : 'vi',
        context: {
          subject: 'cs',
          mode: 'full_solution',
          topicTitle: `${algorithmName} — Bước ${stepNumber}`,
          problemStatement: buildStepSnapshotPrompt(cleanQ)
        }
      },
      (accumulated) => {
        if (activeRequestKeyRef.current !== reqKey) return;
        setMessagesByKey((prev) => {
          const list = prev[reqKey] || nextHistory;
          const updated = [...list];
          updated[updated.length - 1] = { role: 'assistant', text: accumulated };
          return { ...prev, [reqKey]: updated };
        });
      },
      65000
    );

    if (activeRequestKeyRef.current !== reqKey) return;
    setIsLoading(false);

    if (!res.ok) {
      setErrorMsg(res.error || (isEn ? 'Could not reach AI tutor.' : 'Không thể kết nối AI gia sư. Vui lòng thử lại.'));
      setMessagesByKey((prev) => {
        const list = prev[reqKey] || [];
        const trimmed =
          list.length > 0 && list[list.length - 1].role === 'assistant' && !list[list.length - 1].text.trim()
            ? list.slice(0, -1)
            : list;
        return { ...prev, [reqKey]: trimmed };
      });
      return;
    }

    if (res.reply) {
      setMessagesByKey((prev) => {
        const list = prev[reqKey] || nextHistory;
        const updated = [...list];
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
          updated[updated.length - 1] = { role: 'assistant', text: res.reply! };
        } else {
          updated.push({ role: 'assistant', text: res.reply! });
        }
        return { ...prev, [reqKey]: updated };
      });
    }
  };

  const handleToggleAndAutoExplain = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (messages.length === 0 && !isLoading) {
        const defaultPrompt = isEn
          ? `Explain step #${stepNumber} ("${stepTitle}") clearly: what is happening right now, why variables changed, and what comes next.`
          : `Hãy giải thích rõ ràng diễn biến tại Bước #${stepNumber} ("${stepTitle}"): thuật toán vừa làm gì, vì sao trạng thái/biến đổi như vậy và ý nghĩa của dòng code đang chạy.`;
        void askAiAboutStep(defaultPrompt);
      }
    } else {
      setIsOpen(false);
    }
  };

  const quickPrompts = isEn
    ? [
        'Explain this paused step in detail',
        'Why did the variables or array change?',
        'Analyze this code line & Big-O'
      ]
    : [
        'Giải thích kỹ bước này',
        'Vì sao biến / mảng đổi vậy?',
        'Phân tích dòng code & Big-O'
      ];

  return (
    <div className="rounded-2xl border border-cyan-500/35 bg-[#061121] text-slate-100 shadow-xs overflow-hidden">
      {/* Paused Action Bar */}
      <div className="px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-xs font-mono text-slate-300 truncate">
            <span className="font-bold text-amber-300">
              {isEn ? 'PAUSED' : 'ĐANG DỪNG'}
            </span>
            <span className="mx-1.5 text-slate-600">·</span>
            <span className="tabular-nums text-cyan-200">
              {isEn ? `Step ${stepNumber}/${Math.max(1, totalSteps)}` : `Bước ${stepNumber}/${Math.max(1, totalSteps)}`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleAndAutoExplain}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 text-xs font-extrabold shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{isEn ? 'Ask AI about this step' : 'Hỏi AI về bước này'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Step Q&A Drawer */}
      {isOpen && (
        <div className="p-3.5 border-t border-cyan-500/20 space-y-3 bg-[#030914]">
          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                type="button"
                disabled={isLoading}
                onClick={() => void askAiAboutStep(qp)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/25 hover:border-cyan-400/60 text-[11px] font-semibold text-cyan-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Conversation Thread */}
          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
            {messages.length === 0 && !isLoading && (
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400">
                {isEn
                  ? 'Select a quick prompt above or type your own question about this paused step.'
                  : 'Chọn gợi ý nhanh bên trên hoặc nhập câu hỏi bất kỳ về trạng thái biến, con trỏ hoặc dòng code tại bước đang dừng.'}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-950/50 border border-cyan-500/30 text-cyan-100'
                    : 'bg-slate-900/90 border border-emerald-500/25 text-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold mb-1.5">
                  {msg.role === 'user' ? (
                    <>
                      <User className="w-3.5 h-3.5 text-cyan-300" />
                      <span className="text-cyan-300">{isEn ? 'Your Question' : 'Câu hỏi của bạn'}</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">
                        {isEn ? `AI Step #${stepNumber} Explanation` : `AI Giải thích Bước #${stepNumber}`}
                      </span>
                    </>
                  )}
                </div>

                {msg.role === 'assistant' ? (
                  msg.text ? (
                    <FormattedText text={msg.text} />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>{isEn ? 'Analyzing paused state...' : 'AI đang phân tích bước đang dừng...'}</span>
                    </div>
                  )
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}
              </div>
            ))}
            <div ref={listEndRef} />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Custom Follow-up Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim() || isLoading) return;
              const q = draft;
              setDraft('');
              void askAiAboutStep(q);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                isEn
                  ? `Ask anything about step #${stepNumber}...`
                  : `Nhập câu hỏi về Bước #${stepNumber} (VD: tại sao đổi chỗ? giá trị biến?)...`
              }
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none text-xs text-white placeholder:text-slate-500"
            />
            <VoiceMicButton
              language={isEn ? 'en' : 'vi'}
              onTranscript={(text) => setDraft((prev) => (prev ? `${prev} ${text}` : text))}
              size="sm"
              darkSurface
            />
            <button
              type="submit"
              disabled={!draft.trim() || isLoading}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-45 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isEn ? 'Ask' : 'Hỏi'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
