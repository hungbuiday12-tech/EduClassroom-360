import React, { useCallback, useEffect, useState } from 'react';
import {
  Command,
  Loader2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Eye
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { BackgroundStyle, useBackgroundTheme } from '../../context/BackgroundContext';
import { useFocusTimer } from '../../context/FocusTimerContext';
import { useSpeechRecognition } from '../../lib/useSpeechRecognition';
import { safeFetchJson } from '../../lib/apiClient';
import { matchFuzzyVoiceOSCommand, buildLocalVoiceMentorAnswer } from '../../lib/voiceIntentEngine';
import {
  cancelActiveSpeech,
  captureWorkspaceSnapshot,
  requestLiveCoPilotReply,
  useLiveWorkspaceContext
} from '../../lib/liveCoPilotBridge';
import { SubjectType, VoiceOSActionPlan } from '../../types';

interface SynapseVoiceOSProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenTutor: (subject?: SubjectType, promptText?: string) => void;
}

const QUICK_CHIPS = [
  'Mở Mô phỏng & Vẽ Toán',
  'Mở Quang học Raytracing Lí',
  'Mở Mạch Logic & Neural Net',
  'Mở Đại công trình số 2 Tokamak',
  'Đổi nền Đại dương',
  'Giải thích định luật khúc xạ Snell'
];

export const SynapseVoiceOS: React.FC<SynapseVoiceOSProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  onOpenTutor
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { navigate, selectSubject } = useNavigation();
  const { setBgStyle } = useBackgroundTheme();
  const { isRunning, startPause, resetTimer } = useFocusTimer();

  const [inputCmd, setInputCmd] = useState('');
  const [processing, setProcessing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [visionCoPilot, setVisionCoPilot] = useState(true);
  const workspaceCtx = useLiveWorkspaceContext();
  const [logs, setLogs] = useState<{ role: 'user' | 'os'; text: string }[]>([
    {
      role: 'os',
      text: isEn
        ? 'Synapse Voice OS ready. Speak naturally — Voice OS sees your active workspace/canvas & supports instant barge-in!'
        : 'Synapse Voice OS đã tích hợp Live Co-Pilot Mắt Thần & Ngắt lời tức thì! Ra lệnh mở công trình/mô phỏng hoặc hỏi trực tiếp về hình/code đang hiện trên màn hình.'
    }
  ]);

  const speakFeedback = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        cancelActiveSpeech();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = isEn ? 'en-US' : 'vi-VN';
        utter.rate = 1.06;
        window.speechSynthesis.speak(utter);
      } catch {}
    },
    [ttsEnabled, isEn]
  );

  const executePlan = useCallback(
    (plan: VoiceOSActionPlan) => {
      const reply = plan.replyVi || 'Đã thực hiện lệnh.';
      setLogs((prev) => [...prev.slice(-8), { role: 'os', text: reply }]);
      speakFeedback(reply);

      switch (plan.actionType) {
        case 'navigate':
          if (plan.targetSubject) {
            selectSubject(plan.targetSubject);
          }
          break;
        case 'navigate_math_sim':
          navigate({
            subject: 'math_sims',
            mathTab: plan.targetMathTab || 'grapher',
            tutorOpen: false
          });
          break;
        case 'navigate_monument':
          navigate({
            subject: 'synapse_v2',
            futureTab: 'megastructures',
            synapseMode: 'stage',
            synapseMonumentId: plan.targetMonumentId || 'dyson',
            tutorOpen: false
          });
          break;
        case 'navigate_future':
          if (plan.targetFutureTab === 'infinite_canvas') {
            window.dispatchEvent(new CustomEvent('synapse:open-scratchpad-mini'));
            onClose();
            break;
          }
          navigate({
            subject: 'synapse_v2',
            futureTab: plan.targetFutureTab || 'megastructures',
            synapseMode: 'catalog',
            tutorOpen: false
          });
          break;
        case 'set_background':
          if (plan.bgStyle) {
            setBgStyle(plan.bgStyle as BackgroundStyle);
          }
          break;
        case 'toggle_theme':
          if (typeof plan.darkMode === 'boolean') {
            if (plan.darkMode !== isDark) onToggleTheme();
          } else {
            onToggleTheme();
          }
          break;
        case 'timer':
          if (plan.timerAction === 'start' && !isRunning) startPause();
          else if (plan.timerAction === 'pause' && isRunning) startPause();
          else if (plan.timerAction === 'reset') resetTimer();
          break;
        case 'open_tutor':
          onOpenTutor(plan.tutorSubject || 'math', plan.tutorQuestion);
          onClose();
          break;
        case 'answer_qa':
        default:
          break;
      }
    },
    [
      isDark,
      isRunning,
      navigate,
      onClose,
      onOpenTutor,
      onToggleTheme,
      resetTimer,
      selectSubject,
      setBgStyle,
      speakFeedback,
      startPause
    ]
  );

  const runCommand = useCallback(
    async (rawText: string) => {
      const clean = rawText.trim();
      if (!clean) return;
      // Barge-in: stop previous speech immediately
      cancelActiveSpeech();
      setInputCmd('');
      setLogs((prev) => [...prev.slice(-8), { role: 'user', text: clean }]);

      // 1. Permissive fuzzy intent matcher first
      const localPlan = matchFuzzyVoiceOSCommand(clean);
      if (localPlan) {
        executePlan(localPlan);
        return;
      }

      // 2. If Vision Co-Pilot is active and user asks about current screen/canvas/code, answer with multimodal Live Co-Pilot
      const asksAboutScreen = /(màn hình|đây|hình|code|lỗi|sai|giải thích|phân tích|tại sao|this|screen|why|wrong|fix)/i.test(clean);
      if (visionCoPilot && asksAboutScreen) {
        setProcessing(true);
        const snap = await captureWorkspaceSnapshot();
        const coReply = await requestLiveCoPilotReply({
          question: clean,
          subject: workspaceCtx.subject,
          language,
          workspaceCtx,
          imageBase64: snap.imageBase64,
          mimeType: snap.mimeType
        });
        setProcessing(false);
        const fullText = coReply.visualPinHint
          ? `${coReply.spokenAnswer} (${coReply.visualPinHint})`
          : coReply.spokenAnswer;
        setLogs((prev) => [...prev.slice(-8), { role: 'os', text: fullText }]);
        speakFeedback(coReply.spokenAnswer);
        return;
      }

      // 3. Ask Gemini Intent + Q&A Router
      setProcessing(true);
      const res = await safeFetchJson<{ success: boolean; plan: VoiceOSActionPlan }>(
        '/api/gemini/voice-os-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: clean, language })
        },
        10000
      );
      setProcessing(false);

      if (res.ok && res.data?.plan && res.data.plan.actionType !== 'none') {
        executePlan(res.data.plan);
        return;
      }

      // 4. Fallback with multimodal workspace vision context
      const qaFallback = buildLocalVoiceMentorAnswer({
        question: clean,
        modelTitle: workspaceCtx.title || 'Hệ sinh thái Synapse STEM',
        partDescription: res.data?.plan?.replyVi || workspaceCtx.summary,
        formula: workspaceCtx.formula,
        language
      });
      const fallbackReply =
        res.ok && res.data?.plan?.replyVi
          ? res.data.plan.replyVi
          : qaFallback.spokenAnswer;

      setLogs((prev) => [...prev.slice(-8), { role: 'os', text: fallbackReply }]);
      speakFeedback(fallbackReply);
    },
    [executePlan, language, speakFeedback, visionCoPilot, workspaceCtx]
  );

  const {
    isSupported,
    isListening,
    interimText,
    error: speechError,
    toggleListening,
    stopListening
  } = useSpeechRecognition({
    language,
    continuous: false,
    onFinalTranscript: (transcript) => {
      void runCommand(transcript);
    }
  });

  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
  }, [isOpen, isListening, stopListening]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4">
      <div className="w-full max-w-2xl rounded-md border border-cyan-500/40 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded flex items-center justify-center border ${
                isListening
                  ? 'bg-rose-500/20 border-rose-400 voice-os-orb-pulse'
                  : 'bg-cyan-500/15 border-cyan-400/50'
              }`}
            >
              <Command className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                Synapse Voice OS
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                  Fuzzy AI
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {isEn
                  ? 'Flexible intent recognition & live STEM Q&A'
                  : 'Hiểu ý định linh hoạt (gần đúng vẫn chạy) & Trả lời kiến thức STEM'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVisionCoPilot((v) => !v)}
              className={`px-2 py-1.5 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                visionCoPilot
                  ? 'bg-emerald-600/25 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isEn ? 'Live Screen/Canvas Vision Co-Pilot' : 'Mắt Thần quan sát mô phỏng & code trên màn hình'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'Screen Vision' : 'Mắt Thần AI'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !ttsEnabled;
                setTtsEnabled(next);
                if (!next) cancelActiveSpeech();
              }}
              className="p-2 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title={ttsEnabled ? 'Tắt giọng đọc phản hồi' : 'Bật giọng đọc phản hồi'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded border border-slate-700 bg-slate-800 hover:bg-rose-600 hover:border-rose-500 text-slate-200 cursor-pointer"
              aria-label="Đóng Voice OS"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orb & Transcript Feed */}
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded border border-slate-800 bg-slate-900/70">
            <button
              type="button"
              onClick={() => {
                cancelActiveSpeech();
                toggleListening();
              }}
              disabled={!isSupported}
              className={`w-16 h-16 rounded-md flex flex-col items-center justify-center border transition shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 border-rose-400 text-white voice-os-orb-pulse'
                  : isSupported
                  ? 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="text-[10px] font-bold mt-1">
                {isListening ? 'ĐANG NGHE' : 'NÓI NGAY'}
              </span>
            </button>

            <div className="flex-1 w-full space-y-2 max-h-48 overflow-y-auto pr-1">
              {logs.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded text-xs leading-relaxed ${
                    item.role === 'user'
                      ? 'bg-sky-950/80 border border-sky-700/60 text-sky-100 ml-6'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 mr-6'
                  }`}
                >
                  <span className="font-bold mr-1.5 text-[10px] uppercase text-cyan-400">
                    {item.role === 'user' ? 'Bạn:' : 'Voice OS:'}
                  </span>
                  {item.text}
                </div>
              ))}
              {interimText && (
                <div className="px-3 py-1.5 rounded bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 italic">
                  “{interimText}...”
                </div>
              )}
              {processing && (
                <div className="inline-flex items-center gap-2 text-xs text-cyan-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isEn ? 'Analyzing intent...' : 'Đang phân tích ý định & tri thức...'}
                </div>
              )}
              {speechError && (
                <div className="text-xs text-amber-300">{speechError}</div>
              )}
            </div>
          </div>

          {/* Text Command Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runCommand(inputCmd);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputCmd}
              onChange={(e) => setInputCmd(e.target.value)}
              placeholder={
                isEn
                  ? 'Speak or type naturally (e.g., "open math draw", "wonder 2", "explain Snell law")...'
                  : 'Nói/gõ tự nhiên ("vẽ toán", "công trình 5", "quang học", "hố đen Kerr là gì?")...'
              }
              className="flex-1 px-3 py-2.5 rounded border border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={processing || !inputCmd.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isEn ? 'Run' : 'Thực thi'}
            </button>
          </form>

          {/* Preset Voice Command Chips */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isEn ? 'Instant Voice / Command Presets' : 'Lệnh & Câu hỏi mẫu thử ngay'}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void runCommand(chip)}
                  className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800 hover:border-cyan-500 text-xs text-slate-200 transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
