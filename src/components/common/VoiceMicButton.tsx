import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../lib/useSpeechRecognition';

interface VoiceMicButtonProps {
  language?: 'vi' | 'en';
  onTranscript: (spokenText: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  darkSurface?: boolean;
  className?: string;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  language = 'vi',
  onTranscript,
  disabled = false,
  size = 'md',
  showLabel = false,
  darkSurface = false,
  className = ''
}) => {
  const isEn = language === 'en';
  const {
    isSupported,
    isListening,
    interimText,
    error,
    clearError,
    toggleListening
  } = useSpeechRecognition({
    language,
    continuous: true,
    onFinalTranscript: (text) => {
      onTranscript(text);
    }
  });

  const padCls = size === 'sm' ? 'px-2 py-1.5 text-[11px]' : 'p-2.5 text-xs';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        disabled={disabled || !isSupported}
        onClick={() => {
          if (error) clearError();
          toggleListening();
        }}
        title={
          !isSupported
            ? isEn
              ? 'Voice input requires Chrome or Edge'
              : 'Trình duyệt không hỗ trợ đọc giọng nói (khuyên dùng Chrome/Edge)'
            : isListening
            ? isEn
              ? 'Stop voice input'
              : 'Dừng nhận diện giọng nói'
            : isEn
            ? 'Speak question or problem (Voice Input)'
            : 'Nói câu hỏi hoặc đọc đề bài bằng giọng nói'
        }
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${padCls} ${
          isListening
            ? 'bg-rose-600 text-white border-rose-500 shadow-sm ring-2 ring-rose-500/35'
            : darkSurface
            ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400'
        } ${className}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4 shrink-0" />
        ) : (
          <Mic className="w-4 h-4 shrink-0" />
        )}
        {showLabel && (
          <span>
            {isListening
              ? isEn
                ? 'Listening...'
                : 'Đang nghe...'
              : isEn
              ? 'Voice'
              : 'Giọng nói'}
          </span>
        )}
      </button>

      {isListening && interimText && (
        <div className="absolute bottom-full mb-2 right-0 z-50 max-w-[260px] px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-[11px] font-medium shadow-lg border border-slate-700 truncate pointer-events-none">
          {interimText}
        </div>
      )}

      {error && (
        <div
          onClick={clearError}
          className="absolute bottom-full mb-2 right-0 z-50 w-60 px-2.5 py-1.5 rounded-md bg-rose-950 text-rose-100 text-[11px] shadow-lg border border-rose-700 cursor-pointer"
        >
          {error}
        </div>
      )}
    </div>
  );
};
