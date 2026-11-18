import React, { useEffect, useRef, useState } from 'react';
import { History, Layers, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FrameSnapshot {
  timeSec: number;
  canvas: HTMLCanvasElement;
}

interface LabTimeMachineBarProps {
  simKey: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isRunning: boolean;
  onSetRunning: (running: boolean) => void;
  simSpeed: number;
  onSetSimSpeed: (speed: number) => void;
  simTimeRef: React.MutableRefObject<number>;
}

const MAX_FRAMES = 120; // ~10s at 12fps telemetry capture

export const LabTimeMachineBar: React.FC<LabTimeMachineBarProps> = ({
  simKey,
  canvasRef,
  isRunning,
  onSetRunning,
  simSpeed,
  onSetSimSpeed,
  simTimeRef
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const framesRef = useRef<FrameSnapshot[]>([]);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [scrubIndex, setScrubIndex] = useState<number>(-1); // -1 means Live
  const [strobeEnabled, setStrobeEnabled] = useState<boolean>(false);
  const [strobeGhostCount, setStrobeGhostCount] = useState<number>(7);

  const isReplayActive = scrubIndex >= 0 && scrubIndex < frameCount;

  // Reset telemetry blackbox when switching simulation
  useEffect(() => {
    framesRef.current = [];
    setFrameCount(0);
    setScrubIndex(-1);
  }, [simKey]);

  // Background Blackbox Frame Capture while live & running
  useEffect(() => {
    if (!isRunning || isReplayActive) return;
    const interval = window.setInterval(() => {
      const src = canvasRef.current;
      if (!src || src.width === 0 || src.height === 0) return;

      const snap = document.createElement('canvas');
      const targetW = Math.min(src.width, 680);
      const scale = targetW / src.width;
      snap.width = Math.max(120, Math.round(targetW));
      snap.height = Math.max(80, Math.round(src.height * scale));
      const sctx = snap.getContext('2d');
      if (!sctx) return;
      sctx.drawImage(src, 0, 0, snap.width, snap.height);

      const list = framesRef.current;
      list.push({ timeSec: simTimeRef.current, canvas: snap });
      if (list.length > MAX_FRAMES) {
        list.shift();
      }
      setFrameCount(list.length);
    }, 90);

    return () => window.clearInterval(interval);
  }, [isRunning, isReplayActive, canvasRef, simTimeRef]);

  // Render Replay Frame OR Stroboscope Ghost Frames into Overlay Canvas inside Stage
  useEffect(() => {
    const srcCanvas = canvasRef.current;
    if (!srcCanvas || !srcCanvas.parentElement) return;

    // Create/sync lightweight overlay canvas right inside the canvas parent wrapper
    const host = srcCanvas.parentElement;
    let ov = overlayCanvasRef.current;
    if (!ov) {
      ov = document.createElement('canvas');
      ov.className = 'pointer-events-none absolute inset-0 w-full h-full z-[4]';
      overlayCanvasRef.current = ov;
    }
    if (!host.contains(ov)) {
      host.appendChild(ov);
    }

    const drawOverlay = () => {
      if (!ov || !srcCanvas) return;
      const w = srcCanvas.clientWidth || 640;
      const h = srcCanvas.clientHeight || 360;
      if (ov.width !== w || ov.height !== h) {
        ov.width = w;
        ov.height = h;
      }
      const octx = ov.getContext('2d');
      if (!octx) return;
      octx.clearRect(0, 0, w, h);

      const frames = framesRef.current;
      if (frames.length === 0) return;

      // 1. Replay frozen frame when scrubbing history
      if (isReplayActive && frames[scrubIndex]) {
        octx.globalAlpha = 1;
        octx.drawImage(frames[scrubIndex].canvas, 0, 0, w, h);

        // Stroboscope ghosts leading up to scrubIndex
        if (strobeEnabled) {
          octx.save();
          octx.globalCompositeOperation = 'lighter';
          const step = Math.max(1, Math.floor(Math.min(scrubIndex, 48) / strobeGhostCount));
          for (let i = Math.max(0, scrubIndex - step * strobeGhostCount); i < scrubIndex; i += step) {
            const ageRatio = (i - Math.max(0, scrubIndex - step * strobeGhostCount)) / Math.max(1, step * strobeGhostCount);
            octx.globalAlpha = 0.08 + ageRatio * 0.22;
            octx.drawImage(frames[i].canvas, 0, 0, w, h);
          }
          octx.restore();
        }
        return;
      }

      // 2. Live Stroboscope Multi-Exposure Overlay
      if (strobeEnabled && frames.length >= 3) {
        octx.save();
        octx.globalCompositeOperation = 'lighter';
        const lookback = Math.min(frames.length - 1, strobeGhostCount * 4);
        const startIdx = Math.max(0, frames.length - 1 - lookback);
        const step = Math.max(1, Math.floor(lookback / strobeGhostCount));
        for (let i = startIdx; i < frames.length - 1; i += step) {
          const frac = (i - startIdx) / Math.max(1, lookback);
          octx.globalAlpha = 0.06 + frac * 0.20;
          octx.drawImage(frames[i].canvas, 0, 0, w, h);
        }
        octx.restore();
      }
    };

    drawOverlay();
    let timerId = 0;
    if (strobeEnabled && !isReplayActive) {
      timerId = window.setInterval(drawOverlay, 95);
    }
    return () => {
      if (timerId) window.clearInterval(timerId);
    };
  }, [isReplayActive, scrubIndex, strobeEnabled, strobeGhostCount, frameCount, canvasRef]);

  useEffect(() => {
    return () => {
      if (overlayCanvasRef.current && overlayCanvasRef.current.parentElement) {
        overlayCanvasRef.current.parentElement.removeChild(overlayCanvasRef.current);
      }
    };
  }, []);

  const enterReplayAt = (idx: number) => {
    if (framesRef.current.length === 0) return;
    onSetRunning(false);
    setScrubIndex(Math.max(0, Math.min(framesRef.current.length - 1, idx)));
  };

  const exitReplayToLive = () => {
    setScrubIndex(-1);
  };

  const activeTimeLabel =
    isReplayActive && framesRef.current[scrubIndex]
      ? `${framesRef.current[scrubIndex].timeSec.toFixed(2)}s`
      : `${simTimeRef.current.toFixed(2)}s`;

  return (
    <div className="px-3 sm:px-4 py-2 bg-slate-900/95 border-t border-slate-800 text-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-[11px]">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-mono font-bold text-cyan-300">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isEn ? 'Time-Machine' : 'Tua Thời Gian'}</span>
        </span>

        {/* Ultra Slow-Mo 0.05x & 0.1x */}
        <button
          type="button"
          onClick={() => onSetSimSpeed(simSpeed === 0.05 ? 1.0 : 0.05)}
          className={`px-2 py-0.5 rounded font-mono font-bold border cursor-pointer transition-colors ${
            simSpeed === 0.05
              ? 'bg-cyan-600 border-cyan-400 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-cyan-400'
          }`}
          title={isEn ? 'Ultra Slow-Motion 0.05x' : 'Siêu chậm 0.05x soi từng mili-giây'}
        >
          0.05x
        </button>

        {/* Step Backward / Forward inside blackbox */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={frameCount === 0}
            onClick={() => enterReplayAt(isReplayActive ? scrubIndex - 1 : frameCount - 2)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            title={isEn ? 'Previous recorded frame (-90ms)' : 'Lùi 1 khung hình (-90ms)'}
          >
            <SkipBack className="w-3 h-3" />
          </button>
          <button
            type="button"
            disabled={!isReplayActive || scrubIndex >= frameCount - 1}
            onClick={() => enterReplayAt(scrubIndex + 1)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
            title={isEn ? 'Next recorded frame (+90ms)' : 'Tiến 1 khung hình (+90ms)'}
          >
            <SkipForward className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Blackbox Scrubber Slider */}
      <div className="flex items-center gap-2 flex-1 min-w-[170px] max-w-sm">
        <input
          type="range"
          min={0}
          max={Math.max(0, frameCount - 1)}
          value={isReplayActive ? scrubIndex : Math.max(0, frameCount - 1)}
          disabled={frameCount < 2}
          onChange={(e) => enterReplayAt(Number(e.target.value))}
          className="flex-1 accent-cyan-400 cursor-pointer"
          aria-label={isEn ? 'Simulation timeline scrubber' : 'Thanh tua thời gian thí nghiệm'}
        />
        <span className="font-mono font-bold tabular-nums text-amber-300 min-w-[56px] text-right">
          {isReplayActive ? `REC ${activeTimeLabel}` : `LIVE`}
        </span>
        {isReplayActive && (
          <button
            type="button"
            onClick={() => {
              exitReplayToLive();
              onSetRunning(true);
            }}
            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-2.5 h-2.5" />
            <span>Live</span>
          </button>
        )}
      </div>

      {/* Stroboscope Multi-Exposure Ghost Trail */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setStrobeEnabled((v) => !v)}
          className={`px-2.5 py-1 rounded border font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
            strobeEnabled
              ? 'bg-amber-500 border-amber-300 text-slate-950'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-400'
          }`}
          title={
            isEn
              ? 'Multi-exposure ghost trail to measure Δx spacing'
              : 'Đèn chớp Stroboscope chụp chồng bóng mờ cách đều để đo Δx bằng thước'
          }
        >
          <Layers className="w-3 h-3" />
          <span>{isEn ? 'Stroboscope' : 'Đèn chớp Ghost'}</span>
        </button>

        {strobeEnabled && (
          <select
            value={strobeGhostCount}
            onChange={(e) => setStrobeGhostCount(Number(e.target.value))}
            className="px-1.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-mono text-amber-300"
          >
            <option value={5}>5 bóng</option>
            <option value={8}>8 bóng</option>
            <option value={12}>12 bóng</option>
          </select>
        )}

        {frameCount > 0 && (
          <button
            type="button"
            onClick={() => {
              framesRef.current = [];
              setFrameCount(0);
              setScrubIndex(-1);
            }}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            title={isEn ? 'Clear telemetry buffer' : 'Xóa bộ đệm hộp đen'}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
