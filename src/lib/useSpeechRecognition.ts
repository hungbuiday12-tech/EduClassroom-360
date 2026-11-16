import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstanceLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstanceLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export interface UseSpeechRecognitionOptions {
  language?: 'vi' | 'en';
  continuous?: boolean;
  onFinalTranscript?: (text: string) => void;
}

export function useSpeechRecognition({
  language = 'vi',
  continuous = true,
  onFinalTranscript
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof window !== 'undefined' && getSpeechRecognitionCtor() !== null;

  const recRef = useRef<SpeechRecognitionInstanceLike | null>(null);
  const onFinalRef = useRef(onFinalTranscript);
  onFinalRef.current = onFinalTranscript;
  const isListeningRef = useRef(false);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setInterimText('');
    if (recRef.current) {
      try {
        recRef.current.stop();
      } catch {}
    }
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError(
        language === 'en'
          ? 'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
          : 'Trình duyệt hiện tại chưa hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge.'
      );
      return;
    }

    setError(null);
    if (recRef.current) {
      try {
        recRef.current.abort();
      } catch {}
    }

    const rec = new Ctor();
    rec.lang = language === 'en' ? 'en-US' : 'vi-VN';
    rec.continuous = continuous;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event: SpeechRecognitionEventLike) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || '';
        if (result.isFinal) {
          finalChunk += transcript + ' ';
        } else {
          interimChunk += transcript;
        }
      }
      setInterimText(interimChunk.trim());
      if (finalChunk.trim()) {
        onFinalRef.current?.(finalChunk.trim());
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEventLike) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setInterimText('');
        return;
      }
      isListeningRef.current = false;
      setIsListening(false);
      setInterimText('');
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError(
          language === 'en'
            ? 'Microphone permission denied. Please allow microphone access in browser settings.'
            : 'Chưa được cấp quyền Micro. Vui lòng cho phép trình duyệt truy cập Micro.'
        );
      } else {
        setError(
          language === 'en'
            ? `Voice error: ${event.error}`
            : `Lỗi nhận diện giọng nói: ${event.error}`
        );
      }
    };

    rec.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      setInterimText('');
    };

    recRef.current = rec;
    try {
      rec.start();
      isListeningRef.current = true;
      setIsListening(true);
    } catch {
      isListeningRef.current = false;
      setIsListening(false);
      setError(
        language === 'en'
          ? 'Could not start microphone capture.'
          : 'Không thể khởi động Micro lúc này.'
      );
    }
  }, [continuous, language]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recRef.current) {
        try {
          recRef.current.abort();
        } catch {}
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    interimText,
    error,
    clearError: () => setError(null),
    startListening,
    stopListening,
    toggleListening
  };
}
