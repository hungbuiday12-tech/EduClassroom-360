import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, Download, Square, Video } from 'lucide-react';

export function captureCanvasPng(
  canvas: HTMLCanvasElement | null | undefined,
  filename: string
): boolean {
  if (!canvas) return false;
  try {
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    a.click();
    return true;
  } catch {
    return false;
  }
}

export function exportRowsToCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): boolean {
  try {
    const escapeCell = (val: string | number) => {
      const s = String(val ?? '');
      if (/[,"\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCell).join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

export function exportJsonFile(filename: string, payload: unknown): boolean {
  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.json') ? filename : `${filename}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

export function useCanvasRecorder(
  getCanvas: () => HTMLCanvasElement | null | undefined,
  filenameBase = 'synapse-simulation'
) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [supported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return typeof MediaRecorder !== 'undefined' && typeof HTMLCanvasElement !== 'undefined';
  });

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopRecording = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    } catch {}
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const canvas = getCanvas();
    if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
      return false;
    }

    try {
      const stream = canvas.captureStream(30);
      streamRef.current = stream;

      const mimeCandidates = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_500_000 })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          chunksRef.current.push(ev.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filenameBase}-${Date.now()}.webm`;
          a.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 1500);
        }
        chunksRef.current = [];
        streamRef.current?.getTracks().forEach((tr) => tr.stop());
        streamRef.current = null;
      };

      recorder.start(250);
      recorderRef.current = recorder;
      setRecordSeconds(0);
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
      return true;
    } catch {
      setIsRecording(false);
      return false;
    }
  }, [filenameBase, getCanvas]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      try {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop();
        }
      } catch {}
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  return {
    isRecording,
    recordSeconds,
    toggleRecording,
    stopRecording,
    supported,
  };
}

export interface RecordVideoButtonProps {
  isRecording: boolean;
  recordSeconds: number;
  onToggle: () => void;
  supported?: boolean;
  compact?: boolean;
  isEn?: boolean;
  className?: string;
}

export const RecordVideoButton: React.FC<RecordVideoButtonProps> = ({
  isRecording,
  recordSeconds,
  onToggle,
  supported = true,
  compact = false,
  isEn = false,
  className = '',
}) => {
  if (!supported) return null;
  const mins = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
  const secs = String(recordSeconds % 60).padStart(2, '0');

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 rounded-md border text-xs font-bold cursor-pointer whitespace-nowrap transition-colors ${
        compact ? 'px-2 py-1 text-[11px]' : 'min-h-[36px] px-2.5 py-1.5'
      } ${
        isRecording
          ? 'bg-rose-600 hover:bg-rose-500 border-rose-300 text-white'
          : 'bg-white/5 hover:bg-white/15 border-white/15 text-slate-200'
      } ${className}`}
      title={
        isRecording
          ? isEn
            ? 'Stop and save .webm video'
            : 'Dừng và tải video .webm'
          : isEn
          ? 'Record simulation video (.webm)'
          : 'Quay video mô phỏng (.webm)'
      }
    >
      {isRecording ? (
        <>
          <Square className="w-3 h-3 fill-white shrink-0" />
          <span className="font-mono tabular-nums">
            REC {mins}:{secs}
          </span>
        </>
      ) : (
        <>
          <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          {!compact && <span className="hidden lg:inline">{isEn ? 'Record' : 'Quay Video'}</span>}
        </>
      )}
    </button>
  );
};

export interface TelemetrySeries {
  id: string;
  label: string;
  color: string;
  unit?: string;
  values: number[];
}

interface MiniTelemetryChartProps {
  title: string;
  series: TelemetrySeries[];
  height?: number;
  darkSurface?: boolean;
  onExportCsv?: () => void;
  exportLabel?: string;
}

export const MiniTelemetryChart: React.FC<MiniTelemetryChartProps> = ({
  title,
  series,
  height = 104,
  darkSurface = true,
  onExportCsv,
  exportLabel = 'CSV',
}) => {
  const width = 460;
  const padX = 8;
  const padY = 10;

  return (
    <div
      className={`rounded-xl border p-3 space-y-2 ${
        darkSurface
          ? 'bg-slate-950/90 border-white/15 text-slate-100'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold">
          <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400 shrink-0" />
          <span>{title}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tabular-nums">
          {series.map((s) => {
            const latest = s.values.length > 0 ? s.values[s.values.length - 1] : 0;
            return (
              <span key={s.id} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-xs shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className={darkSurface ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>
                  {s.label}:
                </span>
                <span className="font-bold" style={{ color: s.color }}>
                  {Number.isFinite(latest) ? latest.toFixed(2) : '0.00'}
                  {s.unit ? ` ${s.unit}` : ''}
                </span>
              </span>
            );
          })}
          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold cursor-pointer ${
                darkSurface
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <Download className="w-3 h-3" />
              <span>{exportLabel}</span>
            </button>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full rounded-lg border ${
          darkSurface
            ? 'bg-slate-900/80 border-white/10'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
        }`}
        style={{ height }}
        preserveAspectRatio="none"
      >
        {/* Reference horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            y1={f * height}
            x2={width}
            y2={f * height}
            stroke={darkSurface ? 'rgba(148,163,184,0.14)' : 'rgba(148,163,184,0.25)'}
            strokeDasharray="3 4"
            strokeWidth={1}
          />
        ))}

        {series.map((s) => {
          if (s.values.length < 2) return null;
          let min = Infinity;
          let max = -Infinity;
          for (let i = 0; i < s.values.length; i++) {
            const v = s.values[i];
            if (v < min) min = v;
            if (v > max) max = v;
          }
          const span = Math.max(1e-4, max - min);
          const pts = s.values
            .map((v, idx) => {
              const x = padX + (idx / Math.max(1, s.values.length - 1)) * (width - padX * 2);
              const norm = (v - min) / span;
              const y = height - padY - norm * (height - padY * 2);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <polyline
              key={s.id}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={pts}
            />
          );
        })}
      </svg>
    </div>
  );
};
