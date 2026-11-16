import React from 'react';
import {
  Bell,
  Clock,
  Coffee,
  Music,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { useFocusTimer, STUDY_FORMAT_PRESETS } from '../../context/FocusTimerContext';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from '../../context/LanguageContext';
import { BELL_SOUND_OPTIONS, BG_SOUND_OPTIONS, BellSoundId, BgSoundId } from '../../lib/soundEngine';

function formatClock(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const FloatingFocusTimer: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
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
  } = useFocusTimer();

  const {
    bellSound,
    setBellSound,
    playBell,
    bgSound,
    setBgSound,
    bgVolume,
    setBgVolume,
    isBgPlaying,
    toggleBgPlaying
  } = useAudio();

  const activePreset = STUDY_FORMAT_PRESETS.find((p) => p.id === studyFormat) || STUDY_FORMAT_PRESETS[0];
  const progressRatio = totalDuration > 0 ? Math.max(0, Math.min(1, timeLeft / totalDuration)) : 0;
  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 lg:left-[calc(var(--sidebar-w,248px)+16px)] z-[85] flex flex-col items-start gap-2.5 transition-[left] duration-200">
      {/* Expanded Mini-Chat Style Focus Panel */}
      {isWidgetOpen && (
        <div className="w-[318px] sm:w-[348px] max-w-[calc(100vw-24px)] rounded-xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-[0_24px_60px_-14px_rgba(15,23,42,0.55)] overflow-hidden text-xs">
          {/* Panel Header */}
          <div className="px-4 py-3 bg-slate-900 dark:bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <div className="font-display font-extrabold text-[13px] leading-tight truncate">
                  {isEn ? 'Focus Studio Mini' : 'Góc Tập Trung Mini'}
                </div>
                <div className="text-[10px] text-indigo-100/90 truncate">
                  {isEn ? activePreset.labelEn : activePreset.labelVi} · {completedSessions}{' '}
                  {isEn ? 'sessions' : 'phiên'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsWidgetOpen(false)}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
              aria-label={isEn ? 'Minimize timer' : 'Thu gọn đồng hồ'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3.5 max-h-[72vh] overflow-y-auto">
            {/* Alarm Banner when finished */}
            {alarmRinging && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/70 flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold">
                  <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    {phase === 'focus'
                      ? isEn
                        ? 'Focus block complete!'
                        : 'Hoàn thành phiên tập trung!'
                      : isEn
                      ? 'Break finished!'
                      : 'Hết giờ nghỉ giải lao!'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={dismissAlarm}
                  className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] cursor-pointer shrink-0"
                >
                  OK
                </button>
              </div>
            )}

            {/* Phase Switch + Circular Clock */}
            <div className="flex items-center gap-4 bg-slate-50/90 dark:bg-slate-900/70 rounded-2xl p-3 border border-slate-200/70 dark:border-white/10">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    fill="none"
                    stroke={phase === 'break' ? '#10b981' : isRunning ? '#f59e0b' : '#6366f1'}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringCircumference * (1 - progressRatio)}
                    className="transition-[stroke-dashoffset,stroke] duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {formatClock(timeLeft)}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {phase === 'focus' ? (isEn ? 'Focus' : 'Học') : isEn ? 'Break' : 'Nghỉ'}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => switchPhase('focus')}
                    className={`py-1 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      phase === 'focus'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>{isEn ? 'Focus' : 'Tập trung'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchPhase('break')}
                    className={`py-1 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      phase === 'break'
                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Coffee className="w-3 h-3" />
                    <span>{isEn ? 'Break' : 'Nghỉ'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={startPause}
                    className={`flex-1 py-2 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      isRunning
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : 'bg-indigo-600 hover:bg-indigo-500'
                    }`}
                  >
                    {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>
                      {isRunning
                        ? isEn
                          ? 'Pause'
                          : 'Tạm dừng'
                        : isEn
                        ? 'Start'
                        : 'Bắt đầu'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetTimer}
                    className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                    title={isEn ? 'Reset timer' : 'Đặt lại'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Study Formats Grid */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isEn ? 'Study Method / Rhythm' : 'Hình thức học tập'}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {STUDY_FORMAT_PRESETS.map((preset) => {
                  const selected = preset.id === studyFormat;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setStudyFormat(preset.id)}
                      className={`px-2.5 py-1.5 rounded-xl border text-left text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between gap-1 ${
                        selected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                      }`}
                    >
                      <span className="truncate">{isEn ? preset.labelEn : preset.labelVi}</span>
                      {selected && <CheckCircle2 className="w-3 h-3 shrink-0 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>

              {studyFormat === 'custom' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="block">
                    <span className="text-[10px] text-slate-500 block mb-0.5">
                      {isEn ? 'Focus (min)' : 'Học (phút)'}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={customFocusMinutes}
                      onChange={(e) => setCustomFocusMinutes(Number(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 font-mono text-xs"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-slate-500 block mb-0.5">
                      {isEn ? 'Break (min)' : 'Nghỉ (phút)'}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={45}
                      value={customBreakMinutes}
                      onChange={(e) => setCustomBreakMinutes(Number(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/15 font-mono text-xs"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Alarm Bell Selector + Test */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-amber-500" />
                  {isEn ? 'Completion Bell' : 'Chuông báo hết giờ'}
                </span>
                <button
                  type="button"
                  onClick={() => playBell()}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {isEn ? 'Test bell' : 'Nghe thử chuông'}
                </button>
              </div>
              <select
                value={bellSound}
                onChange={(e) => setBellSound(e.target.value as BellSoundId)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/15 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
              >
                {BELL_SOUND_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isEn ? opt.labelEn : opt.labelVi}
                  </option>
                ))}
              </select>
            </div>

            {/* Background Study Ambience Quick Picker */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Music className="w-3 h-3 text-sky-500" />
                  {isEn ? 'Background Sound' : 'Âm thanh nền học tập'}
                </span>
                <button
                  type="button"
                  onClick={toggleBgPlaying}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                    isBgPlaying && bgSound !== 'off'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isBgPlaying && bgSound !== 'off' ? (
                    <Volume2 className="w-3 h-3" />
                  ) : (
                    <VolumeX className="w-3 h-3" />
                  )}
                  <span>
                    {isBgPlaying && bgSound !== 'off'
                      ? isEn
                        ? 'Playing'
                        : 'Đang phát'
                      : isEn
                      ? 'Muted'
                      : 'Đang tắt'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={bgSound}
                  onChange={(e) => setBgSound(e.target.value as BgSoundId)}
                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/15 text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                >
                  {BG_SOUND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {isEn ? opt.labelEn : opt.labelVi}
                    </option>
                  ))}
                </select>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.05}
                  value={bgVolume}
                  onChange={(e) => setBgVolume(Number(e.target.value))}
                  aria-label={isEn ? 'Ambient volume' : 'Âm lượng nền'}
                  className="w-16 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Mini-Chat Launcher Pill in Bottom-Left */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 dark:bg-slate-900/92 border border-white/15 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.65)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsWidgetOpen(!isWidgetOpen)}
          className={`px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            alarmRinging
              ? 'bg-amber-400 text-slate-950'
              : isRunning
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800/95 hover:bg-slate-700 text-white'
          }`}
          title={isEn ? 'Open Mini Focus Timer' : 'Mở đồng hồ bấm giờ tập trung'}
        >
          {alarmRinging ? (
            <Bell className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Clock className="w-3.5 h-3.5 shrink-0 text-sky-300" />
          )}
          <span className="font-mono tabular-nums font-extrabold">{formatClock(timeLeft)}</span>
          <span className="hidden sm:inline text-[10px] opacity-80">
            {phase === 'focus' ? (isEn ? 'Focus' : 'Tập trung') : isEn ? 'Break' : 'Nghỉ'}
          </span>
        </button>

        <button
          type="button"
          onClick={startPause}
          className={`p-2 rounded-xl text-white transition-colors cursor-pointer ${
            isRunning ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
          title={isRunning ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Start' : 'Bắt đầu'}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={toggleBgPlaying}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isBgPlaying && bgSound !== 'off'
              ? 'bg-sky-500 text-slate-950'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title={isEn ? 'Toggle background ambient sound' : 'Bật / Tắt âm thanh nền'}
          aria-label="Toggle ambient music"
        >
          {isBgPlaying && bgSound !== 'off' ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
