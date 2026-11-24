import React, { useEffect, useState } from 'react';
import { Command, Loader2, Mic, MicOff, Send, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSpeechRecognition } from '../../lib/useSpeechRecognition';
import { cancelActiveSpeech } from '../../lib/liveCoPilotBridge';
import { useVoiceOSController } from '../../hooks/useVoiceOSController';
import { SubjectType } from '../../types';

interface QuickVoiceWidgetProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenTutor: (subject?: SubjectType, promptText?: string) => void;
  onOpenFullVoiceOS: () => void;
}

export const QuickVoiceWidget: React.FC<QuickVoiceWidgetProps> = ({
  isDark,
  onToggleTheme,
  onOpenTutor,
  onOpenFullVoiceOS
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  const { logs, processing, runCommand, clearLogs } = useVoiceOSController({
    isDark,
    onToggleTheme,
    onOpenTutor,
    onCloseParent: () => setPopoverOpen(false),
    initialGreeting: false
  });

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
    onFinalTranscript: (transcript, confidence) => {
      setPopoverOpen(true);
      void runCommand(transcript, confidence);
    }
  });

  const latestOsEntry = [...logs].reverse().find((l) => l.role === 'os');
  const latestUserEntry = [...logs].reverse().find((l) => l.role === 'user');

  // Auto-open compact status bubble whenever listening or error occurs
  useEffect(() => {
    if (isListening || interimText || speechError) {
      setPopoverOpen(true);
    }
  }, [isListening, interimText, speechError]);

  const handleToggleMic = () => {
    cancelActiveSpeech();
    if (!isSupported) {
      setPopoverOpen((v) => !v);
      return;
    }
    if (!isListening) {
      setPopoverOpen(true);
    }
    toggleListening();
  };

  return (
    <div className="relative flex items-center" data-testid="quick-voice-widget">
      {popoverOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-[min(300px,calc(100vw-24px))] rounded-xl bg-slate-950/95 border border-cyan-500/45 shadow-2xl text-slate-100 overflow-hidden z-[90]">
          <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isListening ? 'bg-rose-400 animate-pulse' : 'bg-cyan-400'
                }`}
              />
              <span>{isListening ? (isEn ? 'Listening...' : 'Đang nghe lệnh...') : 'Voice Nhanh'}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (isListening) stopListening();
                  setPopoverOpen(false);
                  onOpenFullVoiceOS();
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-semibold text-cyan-200 cursor-pointer whitespace-nowrap"
                title={isEn ? 'Open full Voice OS window' : 'Mở bảng Voice OS đầy đủ'}
              >
                <Command className="w-3 h-3" />
                <span>Voice OS</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isListening) stopListening();
                  clearLogs();
                  setPopoverOpen(false);
                }}
                className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white cursor-pointer"
                aria-label={isEn ? 'Close quick voice' : 'Đóng Voice nhanh'}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-3 space-y-2.5 text-xs">
            {interimText && (
              <div className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 italic">
                “{interimText}...”
              </div>
            )}

            {latestUserEntry && !interimText && (
              <div className="text-[11px] text-slate-400 truncate">
                <span className="font-semibold text-sky-300">{isEn ? 'You:' : 'Bạn:'}</span> “{latestUserEntry.text}”
              </div>
            )}

            {processing && (
              <div className="inline-flex items-center gap-1.5 text-cyan-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isEn ? 'Thinking...' : 'Đang xử lý...'}</span>
              </div>
            )}

            {latestOsEntry && !processing && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed space-y-2">
                <div>{latestOsEntry.text}</div>
                {latestOsEntry.clarifyOptions && latestOsEntry.clarifyOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {latestOsEntry.clarifyOptions.map((opt) => (
                      <button
                        key={opt.command}
                        type="button"
                        onClick={() => void runCommand(opt.command, 1)}
                        className="px-2 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/50 text-[11px] font-semibold text-cyan-200 transition-colors cursor-pointer"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {speechError && <div className="text-[11px] text-amber-300">{speechError}</div>}

            {!isListening && !latestOsEntry && !interimText && !speechError && (
              <div className="text-[11px] text-slate-400 leading-relaxed">
                {isEn
                  ? 'Tap mic & speak (e.g. "Mở Bài giảng Lí", "Đổi nền Ngân hà", or ask a formula).'
                  : 'Nói hoặc gõ nhanh lệnh ("Mở Bài giảng Lí", "Đổi nền Ngân hà", "Định luật Ôm là gì?").'}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = quickInput.trim();
                if (!trimmed) return;
                setQuickInput('');
                void runCommand(trimmed, 1);
              }}
              className="flex gap-1.5 pt-0.5"
            >
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={isEn ? 'Quick command...' : 'Nhập lệnh nhanh...'}
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={processing || !quickInput.trim()}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-45 text-white cursor-pointer shrink-0"
                title={isEn ? 'Send' : 'Gửi lệnh'}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        data-no-lift="true"
        data-testid="quick-voice-btn"
        onClick={handleToggleMic}
        onContextMenu={(e) => {
          e.preventDefault();
          setPopoverOpen((v) => !v);
        }}
        title={
          isListening
            ? isEn
              ? 'Stop listening'
              : 'Dừng nghe'
            : isEn
            ? 'Quick Voice Command (no need to open Voice OS window)'
            : 'Ra lệnh giọng nói nhanh (không cần mở cửa sổ Voice OS)'
        }
        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md border text-xs font-bold transition-colors cursor-pointer shadow-lg ${
          isListening
            ? 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white voice-os-orb-pulse'
            : 'bg-slate-950 hover:bg-slate-900 border-cyan-500/45 text-cyan-200 hover:text-white'
        }`}
      >
        {isListening ? (
          <MicOff className="w-3.5 h-3.5 text-white shrink-0" />
        ) : (
          <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        )}
        <span className="hidden sm:inline text-[11px] font-mono tracking-tight">
          {isListening ? (isEn ? 'Listening' : 'Đang nghe') : 'Voice'}
        </span>
      </button>
    </div>
  );
};
