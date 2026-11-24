import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Keyboard, Maximize2, Minimize2 } from 'lucide-react';
import { PerformanceMode } from '../../context/BackgroundContext';
import {
  MINI_KEYBOARD_ROWS,
  formatCodeShortLabel,
  mapCharToPhysicalCode,
} from '../../data/typingSandboxData';

interface MiniLiveKeyboardProps {
  perfMode: PerformanceMode;
  isEn: boolean;
  expectedChar?: string | null;
  lastErrorTick?: number;
  lastErrorChar?: string | null;
  keyErrorCounts?: Record<string, number>;
  showNextHint: boolean;
  onToggleNextHint: () => void;
}

export const MiniLiveKeyboard: React.FC<MiniLiveKeyboardProps> = ({
  perfMode,
  isEn,
  expectedChar,
  lastErrorTick = 0,
  lastErrorChar,
  keyErrorCounts = {},
  showNextHint,
  onToggleNextHint,
}) => {
  const [pressedCodes, setPressedCodes] = useState<Record<string, boolean>>({});
  const [recentFlashCode, setRecentFlashCode] = useState<string | null>(null);
  const [errorFlashCode, setErrorFlashCode] = useState<string | null>(null);
  const [lastPressedLabel, setLastPressedLabel] = useState<string>('—');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [sizeMode, setSizeMode] = useState<'compact' | 'comfort'>('compact');

  const flashTimerRef = useRef<number | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  const expectedCode = showNextHint ? mapCharToPhysicalCode(expectedChar || undefined) : null;

  useEffect(() => {
    const resolveCode = (e: KeyboardEvent): string | null => {
      if (e.code && e.code !== 'Unidentified') return e.code;
      return mapCharToPhysicalCode(e.key);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const code = resolveCode(e);
      if (!code) return;
      setPressedCodes((prev) => (prev[code] ? prev : { ...prev, [code]: true }));
      setRecentFlashCode(code);
      setLastPressedLabel(formatCodeShortLabel(code));

      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => {
        setRecentFlashCode(null);
      }, 170);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const code = resolveCode(e);
      if (!code) return;
      setPressedCodes((prev) => {
        if (!prev[code]) return prev;
        const next = { ...prev };
        delete next[code];
        return next;
      });
    };

    const onBlur = () => {
      setPressedCodes({});
      setRecentFlashCode(null);
    };

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('blur', onBlur);
      if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!lastErrorTick) return;
    const code = mapCharToPhysicalCode(lastErrorChar || undefined) || recentFlashCode;
    if (!code) return;
    setErrorFlashCode(code);
    if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => {
      setErrorFlashCode(null);
    }, 320);
  }, [lastErrorTick, lastErrorChar, recentFlashCode]);

  const widthClass =
    sizeMode === 'compact'
      ? 'w-[288px] sm:w-[348px]'
      : 'w-[320px] sm:w-[424px]';

  const keyHeightClass = sizeMode === 'compact' ? 'h-5 sm:h-6 text-[9px]' : 'h-6 sm:h-7 text-[10px]';

  const panelSurfaceClass =
    perfMode === 'ultra'
      ? 'bg-slate-950/88 backdrop-blur-xl border-cyan-400/45 shadow-[0_14px_40px_-10px_rgba(6,182,212,0.45)]'
      : perfMode === 'balanced'
      ? 'bg-white/92 dark:bg-slate-950/90 backdrop-blur-md border-sky-400/40 shadow-lg'
      : 'bg-white/96 dark:bg-slate-950/96 border-slate-300 dark:border-slate-700 shadow-md';

  if (collapsed) {
    return (
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition cursor-pointer whitespace-nowrap ${panelSurfaceClass} ${
            perfMode === 'ultra'
              ? 'text-cyan-200 hover:border-cyan-300'
              : 'text-slate-800 dark:text-slate-100 hover:border-sky-400'
          }`}
          title={isEn ? 'Show live mini keyboard' : 'Hiện bàn phím thời gian thực'}
        >
          <Keyboard className="w-4 h-4 text-sky-500 dark:text-cyan-400 shrink-0" />
          <span>{isEn ? 'Live Keyboard' : 'Bàn phím trực tiếp'}</span>
          <span className="font-mono text-[10px] text-sky-500 dark:text-cyan-300 tabular-nums">
            {lastPressedLabel}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-auto rounded-xl border p-2 sm:p-2.5 select-none transition-all duration-150 ${widthClass} ${panelSurfaceClass}`}
      aria-label={isEn ? 'Real-time live keyboard overlay' : 'Bàn phím thời gian thực'}
    >
      {/* Compact Header Strip */}
      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <Keyboard className="w-3.5 h-3.5 text-sky-500 dark:text-cyan-400 shrink-0" />
          <span
            className={`text-[11px] font-semibold truncate ${
              perfMode === 'ultra' ? 'text-slate-100' : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {isEn ? 'Live Keyboard' : 'Bàn phím trực tiếp'}
          </span>
          <span className="text-[10px] font-mono text-sky-600 dark:text-cyan-300 tabular-nums shrink-0">
            · {lastPressedLabel}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleNextHint}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition cursor-pointer inline-flex items-center gap-1 whitespace-nowrap ${
              showNextHint
                ? 'bg-sky-500/20 text-sky-600 dark:text-cyan-300 border border-sky-400/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
            }`}
            title={isEn ? 'Highlight next expected key' : 'Gợi ý phím tiếp theo'}
          >
            {showNextHint ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isEn ? 'Hint' : 'Gợi ý'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSizeMode((s) => (s === 'compact' ? 'comfort' : 'compact'))}
            className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-cyan-300 cursor-pointer"
            title={sizeMode === 'compact' ? (isEn ? 'Larger' : 'Phóng to') : isEn ? 'Smaller' : 'Thu nhỏ'}
          >
            {sizeMode === 'compact' ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title={isEn ? 'Collapse keyboard' : 'Thu gọn'}
          >
            —
          </button>
        </div>
      </div>

      {/* Key Rows */}
      <div className="space-y-1">
        {MINI_KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex items-center gap-[3px]">
            {row.map((keyDef) => {
              const isHeld = Boolean(pressedCodes[keyDef.code]);
              const isFlashed = recentFlashCode === keyDef.code;
              const isPressed = isHeld || isFlashed;
              const isErr = errorFlashCode === keyDef.code;
              const isExpected = expectedCode === keyDef.code;
              const errCount = keyErrorCounts[keyDef.code] || 0;

              let keyStyle =
                perfMode === 'ultra'
                  ? 'bg-slate-900/90 border-slate-700/80 text-slate-300'
                  : 'bg-slate-100 dark:bg-slate-800/90 border-slate-300/90 dark:border-slate-700 text-slate-700 dark:text-slate-200';

              if (isErr) {
                keyStyle =
                  'bg-rose-500 border-rose-300 text-white translate-y-[1.5px] shadow-[0_0_14px_rgba(244,63,94,0.85)]';
              } else if (isPressed) {
                if (perfMode === 'ultra') {
                  keyStyle = keyDef.isModifier
                    ? 'bg-amber-400 border-amber-200 text-slate-950 translate-y-[1.5px] shadow-[0_0_16px_rgba(251,191,36,0.9)]'
                    : 'bg-cyan-400 border-cyan-200 text-slate-950 translate-y-[1.5px] shadow-[0_0_18px_rgba(34,211,238,0.95)]';
                } else if (perfMode === 'balanced') {
                  keyStyle = keyDef.isModifier
                    ? 'bg-amber-500 border-amber-300 text-slate-950 translate-y-[1px] shadow-md'
                    : 'bg-sky-500 border-sky-300 text-white translate-y-[1px] shadow-[0_0_10px_rgba(14,165,233,0.65)]';
                } else {
                  keyStyle =
                    'bg-sky-600 border-sky-400 text-white translate-y-[1px]';
                }
              } else if (isExpected) {
                keyStyle =
                  perfMode === 'ultra'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                    : 'bg-sky-500/15 border-sky-500 text-sky-700 dark:text-cyan-300';
              } else if (errCount >= 3) {
                keyStyle =
                  perfMode === 'ultra'
                    ? 'bg-rose-950/60 border-rose-500/45 text-rose-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-600/50 text-rose-700 dark:text-rose-200';
              }

              return (
                <div
                  key={keyDef.code}
                  style={{ flexGrow: keyDef.widthUnit, flexBasis: 0 }}
                  className={`${keyHeightClass} rounded-[5px] border font-mono font-semibold flex items-center justify-center leading-none transition-[transform,background-color,box-shadow] duration-75 ${keyStyle}`}
                >
                  <span className="truncate px-0.5">{keyDef.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
