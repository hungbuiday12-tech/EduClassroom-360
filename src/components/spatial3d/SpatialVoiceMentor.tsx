import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Cpu, Loader2, Send, X } from 'lucide-react';
import { useSpeechRecognition } from '../../lib/useSpeechRecognition';
import { safeFetchJson } from '../../lib/apiClient';
import { MathFormula } from '../common/MathRenderer';

interface SpatialVoiceMentorProps {
  spaceName: string;
  modelTitle: string;
  partName?: string;
  partDescription?: string;
  formula?: string;
  language?: 'vi' | 'en';
}

export const SpatialVoiceMentor: React.FC<SpatialVoiceMentorProps> = ({
  spaceName,
  modelTitle,
  partName,
  partDescription,
  formula,
  language = 'vi'
}) => {
  const isEn = language === 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState('');
  const [lastAnswer, setLastAnswer] = useState<{
    question: string;
    spokenAnswer: string;
    formulaHighlight: string;
    suggestedFollowUps: string[];
  } | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const speakText = (text: string) => {
    if (!autoSpeak || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = isEn ? 'en-US' : 'vi-VN';
      utter.rate = 1.04;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const askVoiceMentor = async (questionText: string) => {
    const clean = questionText.trim();
    if (!clean) return;
    setIsThinking(true);
    setErrorText(null);

    const res = await safeFetchJson<{
      success: boolean;
      spokenAnswer: string;
      formulaHighlight: string;
      suggestedFollowUps: string[];
    }>(
      '/api/gemini/voice-mentor-3d',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: clean,
          spaceName,
          modelTitle,
          partName,
          partDescription,
          formula,
          language
        })
      },
      25000
    );

    setIsThinking(false);
    if (!res.ok || !res.data) {
      setErrorText(res.error || 'Chưa kết nối được Syn AI Giọng nói.');
      return;
    }

    setLastAnswer({
      question: clean,
      spokenAnswer: res.data.spokenAnswer,
      formulaHighlight: res.data.formulaHighlight,
      suggestedFollowUps: res.data.suggestedFollowUps || []
    });
    setDraftQuestion('');
    speakText(res.data.spokenAnswer);
  };

  const { isSupported, isListening, interimText, toggleListening } = useSpeechRecognition({
    language,
    continuous: false,
    onFinalTranscript: (transcript) => {
      setDraftQuestion(transcript);
      void askVoiceMentor(transcript);
    }
  });

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="sci-frame cs-deck-btn px-3 py-2 rounded bg-slate-900/95 hover:bg-slate-800 border border-cyan-500/45 text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
        title={isEn ? 'Hands-Free Syn AI Voice Mentor' : 'Trợ lý Giọng nói Syn AI rảnh tay'}
      >
        <Mic className="w-3.5 h-3.5 text-cyan-400" />
        <span>{isEn ? 'Voice Mentor' : 'Trợ lý Giọng nói 3D'}</span>
      </button>
    );
  }

  return (
    <div className="sci-frame syn-top-laser w-[310px] sm:w-[350px] bg-slate-950/95 backdrop-blur-xl border border-cyan-500/50 rounded-md shadow-2xl p-3 text-slate-100 space-y-2.5">
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-mono font-extrabold text-cyan-200 uppercase truncate">
              Syn AI · Voice 3D
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {partName ? `${modelTitle} → ${partName}` : modelTitle}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              const next = !autoSpeak;
              setAutoSpeak(next);
              if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
            }}
            className={`p-1.5 rounded border cursor-pointer ${
              autoSpeak
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title={autoSpeak ? 'Tắt đọc giọng nói tự động' : 'Bật đọc giọng nói tự động'}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Equalizer + Mic Control */}
      <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 rounded p-2">
        <button
          type="button"
          onClick={toggleListening}
          disabled={!isSupported || isThinking}
          className={`px-3 py-2 rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
          } disabled:opacity-45`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isListening ? 'Đang nghe...' : 'Nói câu hỏi'}</span>
        </button>

        {/* Animated Waveform Bars */}
        <div className="flex items-end gap-1 h-6 flex-1 justify-center">
          {[0.1, 0.25, 0.4, 0.15, 0.35, 0.2].map((delay, i) => (
            <span
              key={i}
              style={{ animationDelay: `${delay}s` }}
              className={`w-1 rounded-sm ${
                isListening || isSpeaking
                  ? 'h-5 bg-cyan-400 voice-eq-bar'
                  : 'h-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {interimText && (
        <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-1 rounded">
          “{interimText}”
        </div>
      )}

      {/* Text Fallback Input */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={draftQuestion}
          onChange={(e) => setDraftQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void askVoiceMentor(draftQuestion);
          }}
          placeholder={isEn ? 'Ask Syn AI about this 3D part...' : 'Hỏi nhanh về mô hình / bộ phận này...'}
          className="flex-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={() => void askVoiceMentor(draftQuestion)}
          disabled={isThinking || !draftQuestion.trim()}
          className="p-2 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 cursor-pointer"
        >
          {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </div>

      {errorText && <p className="text-[11px] text-rose-400">{errorText}</p>}

      {lastAnswer ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5 space-y-2 text-xs">
          <p className="text-[11px] text-cyan-300 font-semibold">Hỏi: {lastAnswer.question}</p>
          <p className="text-slate-200 leading-relaxed">{lastAnswer.spokenAnswer}</p>
          {lastAnswer.formulaHighlight && (
            <div className="p-2 rounded bg-slate-950 border border-slate-800 overflow-x-auto text-cyan-300">
              <MathFormula formula={lastAnswer.formulaHighlight} />
            </div>
          )}
          {lastAnswer.suggestedFollowUps.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {lastAnswer.suggestedFollowUps.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => void askVoiceMentor(q)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 text-[10px] text-cyan-200 text-left cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {[
            'Giải thích chức năng phần này',
            'Công thức liên quan là gì?',
            'Ứng dụng thực tế của mô hình?'
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => void askVoiceMentor(preset)}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
