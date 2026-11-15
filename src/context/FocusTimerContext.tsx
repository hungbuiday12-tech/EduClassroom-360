import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAudio } from './AudioContext';

export type StudyFormatId =
  | 'pomodoro'
  | 'deep_work'
  | 'feynman'
  | 'quick_recall'
  | 'exam_mock'
  | 'custom';

export interface StudyFormatPreset {
  id: StudyFormatId;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  focusMinutes: number;
  breakMinutes: number;
}

export const STUDY_FORMAT_PRESETS: StudyFormatPreset[] = [
  {
    id: 'pomodoro',
    labelVi: 'Pomodoro (25/5)',
    labelEn: 'Pomodoro (25/5)',
    descVi: 'Nhịp cổ điển 25 phút học sâu, 5 phút nghỉ mắt',
    descEn: 'Classic 25m focus & 5m eye rest rhythm',
    focusMinutes: 25,
    breakMinutes: 5
  },
  {
    id: 'deep_work',
    labelVi: 'Học sâu (50/10)',
    labelEn: 'Deep Work (50/10)',
    descVi: 'Chuyên đề Toán/Lí nâng cao & thuật toán dài',
    descEn: 'Extended problem solving & deep flow',
    focusMinutes: 50,
    breakMinutes: 10
  },
  {
    id: 'feynman',
    labelVi: 'Feynman (30/5)',
    labelEn: 'Feynman (30/5)',
    descVi: 'Học lý thuyết & tự diễn giải lại khái niệm',
    descEn: 'Read, visualize & teach concepts back',
    focusMinutes: 30,
    breakMinutes: 5
  },
  {
    id: 'quick_recall',
    labelVi: 'Ôn nhanh (15/3)',
    labelEn: 'Quick Recall (15/3)',
    descVi: 'Flashcard công thức & bài tập trắc nghiệm ngắn',
    descEn: 'Rapid formula recall & quick quiz sprint',
    focusMinutes: 15,
    breakMinutes: 3
  },
  {
    id: 'exam_mock',
    labelVi: 'Thi thử (45/0)',
    labelEn: 'Exam Sprint (45/0)',
    descVi: 'Bấm giờ thi chuẩn phòng thi không ngắt quãng',
    descEn: 'Uninterrupted 45-minute mock test block',
    focusMinutes: 45,
    breakMinutes: 0
  },
  {
    id: 'custom',
    labelVi: 'Tự chọn',
    labelEn: 'Custom',
    descVi: 'Tự điều chỉnh số phút học và nghỉ linh hoạt',
    descEn: 'Set custom focus & break intervals',
    focusMinutes: 35,
    breakMinutes: 5
  }
];

interface FocusTimerContextValue {
  studyFormat: StudyFormatId;
  setStudyFormat: (id: StudyFormatId) => void;
  customFocusMinutes: number;
  setCustomFocusMinutes: (m: number) => void;
  customBreakMinutes: number;
  setCustomBreakMinutes: (m: number) => void;
  phase: 'focus' | 'break';
  switchPhase: (nextPhase: 'focus' | 'break') => void;
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  startPause: () => void;
  resetTimer: () => void;
  completedSessions: number;
  alarmRinging: boolean;
  dismissAlarm: () => void;
  isWidgetOpen: boolean;
  setIsWidgetOpen: (open: boolean) => void;
}

const FocusTimerCtx = createContext<FocusTimerContextValue | null>(null);

export const FocusTimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playBell } = useAudio();

  const [studyFormat, setStudyFormatState] = useState<StudyFormatId>('pomodoro');
  const [customFocusMinutes, setCustomFocusMinutesState] = useState<number>(35);
  const [customBreakMinutes, setCustomBreakMinutesState] = useState<number>(5);
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [totalDuration, setTotalDuration] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('synapse_focus_sessions') || '0', 10) || 0;
    } catch {
      return 0;
    }
  });
  const [alarmRinging, setAlarmRinging] = useState<boolean>(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

  const getDurationFor = useCallback(
    (fmt: StudyFormatId, ph: 'focus' | 'break', cFocus: number, cBreak: number) => {
      if (fmt === 'custom') {
        const mins = ph === 'focus' ? Math.max(1, cFocus) : Math.max(1, cBreak || 5);
        return mins * 60;
      }
      const preset = STUDY_FORMAT_PRESETS.find((p) => p.id === fmt) || STUDY_FORMAT_PRESETS[0];
      const mins = ph === 'focus' ? preset.focusMinutes : Math.max(1, preset.breakMinutes || 5);
      return mins * 60;
    },
    []
  );

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setIsRunning(false);
          setAlarmRinging(true);
          playBell();
          if (phase === 'focus') {
            setCompletedSessions((s) => {
              const next = s + 1;
              try {
                localStorage.setItem('synapse_focus_sessions', String(next));
              } catch {}
              return next;
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, timeLeft, phase, playBell]);

  const setStudyFormat = useCallback(
    (id: StudyFormatId) => {
      setStudyFormatState(id);
      setIsRunning(false);
      setAlarmRinging(false);
      setPhase('focus');
      const nextSecs = getDurationFor(id, 'focus', customFocusMinutes, customBreakMinutes);
      setTotalDuration(nextSecs);
      setTimeLeft(nextSecs);
    },
    [customFocusMinutes, customBreakMinutes, getDurationFor]
  );

  const setCustomFocusMinutes = useCallback(
    (m: number) => {
      const clamped = Math.min(120, Math.max(1, Math.round(m)));
      setCustomFocusMinutesState(clamped);
      if (studyFormat === 'custom' && phase === 'focus') {
        setIsRunning(false);
        setAlarmRinging(false);
        setTotalDuration(clamped * 60);
        setTimeLeft(clamped * 60);
      }
    },
    [studyFormat, phase]
  );

  const setCustomBreakMinutes = useCallback(
    (m: number) => {
      const clamped = Math.min(45, Math.max(0, Math.round(m)));
      setCustomBreakMinutesState(clamped);
      if (studyFormat === 'custom' && phase === 'break') {
        setIsRunning(false);
        setAlarmRinging(false);
        const secs = Math.max(1, clamped) * 60;
        setTotalDuration(secs);
        setTimeLeft(secs);
      }
    },
    [studyFormat, phase]
  );

  const switchPhase = useCallback(
    (nextPhase: 'focus' | 'break') => {
      setIsRunning(false);
      setAlarmRinging(false);
      setPhase(nextPhase);
      const nextSecs = getDurationFor(
        studyFormat,
        nextPhase,
        customFocusMinutes,
        customBreakMinutes
      );
      setTotalDuration(nextSecs);
      setTimeLeft(nextSecs);
    },
    [studyFormat, customFocusMinutes, customBreakMinutes, getDurationFor]
  );

  const startPause = useCallback(() => {
    setAlarmRinging(false);
    if (timeLeft <= 0) {
      const nextSecs = getDurationFor(studyFormat, phase, customFocusMinutes, customBreakMinutes);
      setTotalDuration(nextSecs);
      setTimeLeft(nextSecs);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  }, [timeLeft, studyFormat, phase, customFocusMinutes, customBreakMinutes, getDurationFor]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setAlarmRinging(false);
    const nextSecs = getDurationFor(studyFormat, phase, customFocusMinutes, customBreakMinutes);
    setTotalDuration(nextSecs);
    setTimeLeft(nextSecs);
  }, [studyFormat, phase, customFocusMinutes, customBreakMinutes, getDurationFor]);

  const dismissAlarm = useCallback(() => {
    setAlarmRinging(false);
  }, []);

  return (
    <FocusTimerCtx.Provider
      value={{
        studyFormat,
        setStudyFormat,
        customFocusMinutes,
        setCustomFocusMinutes,
        customBreakMinutes,
        setCustomBreakMinutes,
        phase,
        switchPhase,
        timeLeft,
        totalDuration,
        isRunning,
        startPause,
        resetTimer,
        completedSessions,
        alarmRinging,
        dismissAlarm,
        isWidgetOpen,
        setIsWidgetOpen
      }}
    >
      {children}
    </FocusTimerCtx.Provider>
  );
};

export function useFocusTimer(): FocusTimerContextValue {
  const ctx = useContext(FocusTimerCtx);
  if (!ctx) {
    throw new Error('useFocusTimer must be used inside FocusTimerProvider');
  }
  return ctx;
}
