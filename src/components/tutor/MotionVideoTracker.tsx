import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  Crosshair,
  Download,
  Pause,
  Play,
  RotateCcw,
  Ruler,
  SkipBack,
  SkipForward,
  Sparkles,
  Square,
  Target,
  Trash2,
  Undo2,
  Upload,
  Video
} from 'lucide-react';

interface MotionVideoTrackerProps {
  language: 'vi' | 'en';
}

type TrackerTool = 'manual' | 'auto_color' | 'calibrate' | 'origin';
type ExperimentKind = 'free_fall' | 'pendulum' | 'linear';
type SourceKind = 'demo_free_fall' | 'demo_pendulum' | 'uploaded_video';

interface TrackedPoint {
  frame: number;
  t: number;
  px: number;
  py: number;
  xM: number;
  yM: number;
}

interface QuadraticFit {
  c0: number;
  c1: number;
  c2: number;
  r2: number;
}

const STAGE_W = 720;
const STAGE_H = 405;
const DEMO_FPS = 30;

function solveLinear3x3(A: number[][], b: number[]): number[] | null {
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < 3; col++) {
    let pivot = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) return null;
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const div = M[col][col];
    for (let c = col; c < 4; c++) M[col][c] /= div;
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      for (let c = col; c < 4; c++) {
        M[r][c] -= factor * M[col][c];
      }
    }
  }
  return [M[0][3], M[1][3], M[2][3]];
}

function fitQuadraticOLS(ts: number[], ys: number[]): QuadraticFit | null {
  const n = ts.length;
  if (n < 3) return null;
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let sy = 0;
  let sty = 0;
  let st2y = 0;

  for (let i = 0; i < n; i++) {
    const t = ts[i];
    const t2 = t * t;
    const y = ys[i];
    s0 += 1;
    s1 += t;
    s2 += t2;
    s3 += t2 * t;
    s4 += t2 * t2;
    sy += y;
    sty += t * y;
    st2y += t2 * y;
  }

  const coeffs = solveLinear3x3(
    [
      [s0, s1, s2],
      [s1, s2, s3],
      [s2, s3, s4]
    ],
    [sy, sty, st2y]
  );
  if (!coeffs) return null;

  const [c0, c1, c2] = coeffs;
  const meanY = sy / n;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const pred = c0 + c1 * ts[i] + c2 * ts[i] * ts[i];
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - meanY) ** 2;
  }
  const r2 = ssTot > 1e-10 ? Math.max(0, 1 - ssRes / ssTot) : 1;
  return { c0, c1, c2, r2 };
}

function estimateOscillationPeriod(ts: number[], xs: number[]): {
  periodSec: number | null;
  cyclesCount: number;
  amplitudeM: number;
} {
  if (ts.length < 6) {
    return { periodSec: null, cyclesCount: 0, amplitudeM: 0 };
  }
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const midX = (minX + maxX) * 0.5;
  const amp = (maxX - minX) * 0.5;
  if (amp < 0.015) {
    return { periodSec: null, cyclesCount: 0, amplitudeM: amp };
  }

  // Detect interpolated upward zero-crossings around mean X
  const crossings: number[] = [];
  for (let i = 1; i < ts.length; i++) {
    const prev = xs[i - 1] - midX;
    const curr = xs[i] - midX;
    if (prev <= 0 && curr > 0) {
      const frac = Math.abs(curr - prev) > 1e-9 ? -prev / (curr - prev) : 0;
      crossings.push(ts[i - 1] + frac * (ts[i] - ts[i - 1]));
    }
  }
  if (crossings.length >= 2) {
    const periods: number[] = [];
    for (let i = 1; i < crossings.length; i++) {
      periods.push(crossings[i] - crossings[i - 1]);
    }
    const meanT = periods.reduce((s, p) => s + p, 0) / periods.length;
    return { periodSec: meanT, cyclesCount: periods.length, amplitudeM: amp };
  }

  // Fallback: peak-to-peak or half-period via max -> min extrema
  const peaks: number[] = [];
  const troughs: number[] = [];
  for (let i = 1; i < xs.length - 1; i++) {
    if (xs[i] >= xs[i - 1] && xs[i] > xs[i + 1] && xs[i] - midX > amp * 0.35) {
      peaks.push(ts[i]);
    } else if (xs[i] <= xs[i - 1] && xs[i] < xs[i + 1] && midX - xs[i] > amp * 0.35) {
      troughs.push(ts[i]);
    }
  }
  if (peaks.length >= 2) {
    const avg = (peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1);
    return { periodSec: avg, cyclesCount: peaks.length - 1, amplitudeM: amp };
  }
  if (peaks.length >= 1 && troughs.length >= 1) {
    const halfT = Math.abs(peaks[0] - troughs[0]);
    if (halfT > 0.08) return { periodSec: halfT * 2, cyclesCount: 0.5, amplitudeM: amp };
  }
  return { periodSec: null, cyclesCount: 0, amplitudeM: amp };
}

/**
 * Renders deterministic laboratory calibration footage onto any 2D canvas
 * so both Manual Tracking and RGB Auto Color Tracking work on real pixel buffers.
 */
function renderDemoFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  kind: 'demo_free_fall' | 'demo_pendulum',
  tSec: number
): void {
  // Subtle dark slate laboratory backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#1e293b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle background millimeter/decimeter calibration grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
  ctx.lineWidth = 1;
  for (let gx = 40; gx < w; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 40; gy < h; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  if (kind === 'demo_free_fall') {
    // 1.00m Calibration Ruler on left: 260 px = 1.00 m -> from y=65 to y=325
    const rulerX = 156;
    const topY = 65;
    const pxPerM = 260;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(rulerX - 10, topY, 20, pxPerM);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 10; i++) {
      const ty = topY + (i / 10) * pxPerM;
      ctx.beginPath();
      ctx.moveTo(rulerX - 10, ty);
      ctx.lineTo(rulerX + (i % 5 === 0 ? 6 : 0), ty);
      ctx.stroke();
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('1.00 m', rulerX - 68, topY + pxPerM * 0.52);

    // Release electromagnet clamp at top
    ctx.fillStyle = '#475569';
    ctx.fillRect(340, 26, 40, 14);

    // Exact free-fall physics y = y0 + 0.5 * 9.81 * t^2 (m)
    const gTrue = 9.81;
    const yMeter = Math.min(1.22, 0.5 * gTrue * tSec * tSec);
    const ballX = 360;
    const ballY = topY + yMeter * pxPerM;

    // Bright red/coral sphere (distinct from slate background for crisp RGB tracking)
    const grad = ctx.createRadialGradient(ballX - 5, ballY - 5, 3, ballX, ballY, 17);
    grad.addColorStop(0, '#ff6b6b');
    grad.addColorStop(0.65, '#ef4444');
    grad.addColorStop(1, '#b91c1c');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 16, 0, Math.PI * 2);
    ctx.fill();

    // Timestamp readout bottom right
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(w - 150, h - 34, 136, 22);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`t = ${tSec.toFixed(3)} s`, w - 140, h - 19);
  } else {
    // Simple Pendulum: T = 1.60 s -> L = g*T^2/(4*pi^2) = 0.6368 m -> scale 300 px/m => rod ~191 px
    const pxPerM = 300;
    const pivotX = w * 0.5;
    const pivotY = 58;
    const TTrue = 1.6;
    const rodLenPx = 0.6368 * pxPerM;
    const thetaMax = 0.34; // ~19.5 deg small angle
    const theta = thetaMax * Math.cos((2 * Math.PI * tSec) / TTrue);
    const bobX = pivotX + Math.sin(theta) * rodLenPx;
    const bobY = pivotY + Math.cos(theta) * rodLenPx;

    // Horizontal 0.50m scale bar near bottom
    const barX = 110;
    const barY = h - 42;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(barX, barY, 150, 6); // 150 px = 0.50 m
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('0.50 m scale', barX + 26, barY - 8);

    // Support frame & string
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pivotX - 44, pivotY - 12, 88, 12);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Vertical equilibrium dashed line
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + rodLenPx + 35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Bright orange bob (high RGB contrast)
    const grad = ctx.createRadialGradient(bobX - 5, bobY - 5, 3, bobX, bobY, 18);
    grad.addColorStop(0, '#fdba74');
    grad.addColorStop(0.65, '#f97316');
    grad.addColorStop(1, '#c2410c');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(w - 150, h - 34, 136, 22);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`t = ${tSec.toFixed(3)} s`, w - 140, h - 19);
  }
}

export const MotionVideoTracker: React.FC<MotionVideoTrackerProps> = ({ language }) => {
  const isEn = language === 'en';

  // Source & Playback State
  const [sourceKind, setSourceKind] = useState<SourceKind>('demo_free_fall');
  const [experimentKind, setExperimentKind] = useState<ExperimentKind>('free_fall');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0.5);
  const [frameStep, setFrameStep] = useState<number>(1); // 1, 2, or 3 frames per step
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Camera Recorder State
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [isRecordingCam, setIsRecordingCam] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Tracking & Calibration State
  const [tool, setTool] = useState<TrackerTool>('auto_color');
  const [calP1, setCalP1] = useState<{ x: number; y: number }>({ x: 156, y: 65 });
  const [calP2, setCalP2] = useState<{ x: number; y: number }>({ x: 156, y: 325 });
  const [calWaitingSecond, setCalWaitingSecond] = useState<boolean>(false);
  const [scaleMeters, setScaleMeters] = useState<number>(1.0);
  const [originPx, setOriginPx] = useState<{ x: number; y: number }>({ x: 360, y: 65 });
  const [yAxisUp, setYAxisUp] = useState<boolean>(false); // false = +y downwards for free fall

  // Auto RGB Color Target State
  const [targetRgb, setTargetRgb] = useState<[number, number, number]>([239, 68, 68]);
  const [colorTolerance, setColorTolerance] = useState<number>(62);
  const [isAutoTracking, setIsAutoTracking] = useState<boolean>(false);

  // Tracked Points
  const [points, setPoints] = useState<TrackedPoint[]>([]);

  // DOM & Offscreen Refs
  const stageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const camPreviewRef = useRef<HTMLVideoElement | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const autoTrackAbortRef = useRef<boolean>(false);

  const pxPerMeter = useMemo(() => {
    const distPx = Math.hypot(calP2.x - calP1.x, calP2.y - calP1.y);
    return Math.max(10, distPx / Math.max(0.01, scaleMeters));
  }, [calP1, calP2, scaleMeters]);

  const totalFrames = useMemo(() => {
    if (sourceKind === 'demo_free_fall') return 16; // 0..0.50s
    if (sourceKind === 'demo_pendulum') return 75; // 0..2.47s
    return Math.max(2, Math.floor(videoDuration * DEMO_FPS));
  }, [sourceKind, videoDuration]);

  const toPhysicalCoords = useCallback(
    (px: number, py: number) => {
      const xM = (px - originPx.x) / pxPerMeter;
      const dyPx = yAxisUp ? originPx.y - py : py - originPx.y;
      const yM = dyPx / pxPerMeter;
      return { xM, yM };
    },
    [originPx, pxPerMeter, yAxisUp]
  );

  // Load one of the 2 calibrated built-in experiments
  const loadDemoExperiment = useCallback((kind: 'demo_free_fall' | 'demo_pendulum') => {
    autoTrackAbortRef.current = true;
    setIsAutoTracking(false);
    setIsPlaying(false);
    setSourceKind(kind);
    setCurrentFrame(0);
    setPoints([]);
    setCalWaitingSecond(false);

    if (kind === 'demo_free_fall') {
      setExperimentKind('free_fall');
      setCalP1({ x: 156, y: 65 });
      setCalP2({ x: 156, y: 325 });
      setScaleMeters(1.0);
      setOriginPx({ x: 360, y: 65 });
      setYAxisUp(false);
      setTargetRgb([239, 68, 68]);
      setColorTolerance(65);
      setFrameStep(1);
    } else {
      setExperimentKind('pendulum');
      setCalP1({ x: 110, y: 363 });
      setCalP2({ x: 260, y: 363 });
      setScaleMeters(0.5);
      setOriginPx({ x: 360, y: 249 });
      setYAxisUp(true);
      setTargetRgb([249, 115, 22]);
      setColorTolerance(68);
      setFrameStep(2);
    }
  }, []);

  // Ensure offscreen clean sample canvas exists
  const getSampleCtx = useCallback((): CanvasRenderingContext2D | null => {
    if (!sampleCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = STAGE_W;
      c.height = STAGE_H;
      sampleCanvasRef.current = c;
    }
    return sampleCanvasRef.current.getContext('2d', { willReadFrequently: true });
  }, []);

  // Draw raw clean frame to sampleCanvas AND visible overlays to stageCanvas
  const drawFrameAt = useCallback(
    (frameIdx: number) => {
      const stageCanvas = stageCanvasRef.current;
      const sampleCtx = getSampleCtx();
      if (!stageCanvas || !sampleCtx) return;
      const stageCtx = stageCanvas.getContext('2d');
      if (!stageCtx) return;

      const tSec = frameIdx / DEMO_FPS;
      if (sourceKind === 'demo_free_fall' || sourceKind === 'demo_pendulum') {
        renderDemoFrame(sampleCtx, STAGE_W, STAGE_H, sourceKind, tSec);
      } else if (videoElRef.current && videoElRef.current.readyState >= 2) {
        const vid = videoElRef.current;
        sampleCtx.fillStyle = '#0f172a';
        sampleCtx.fillRect(0, 0, STAGE_W, STAGE_H);
        const vw = vid.videoWidth || STAGE_W;
        const vh = vid.videoHeight || STAGE_H;
        const fit = Math.min(STAGE_W / vw, STAGE_H / vh);
        const dw = vw * fit;
        const dh = vh * fit;
        sampleCtx.drawImage(vid, (STAGE_W - dw) * 0.5, (STAGE_H - dh) * 0.5, dw, dh);
      } else {
        sampleCtx.fillStyle = '#0f172a';
        sampleCtx.fillRect(0, 0, STAGE_W, STAGE_H);
      }

      // Copy clean raw pixels onto display canvas
      stageCtx.clearRect(0, 0, STAGE_W, STAGE_H);
      stageCtx.drawImage(sampleCanvasRef.current!, 0, 0);

      // Draw Calibration Scale Line
      stageCtx.save();
      stageCtx.strokeStyle = '#facc15';
      stageCtx.lineWidth = 2.5;
      stageCtx.beginPath();
      stageCtx.moveTo(calP1.x, calP1.y);
      stageCtx.lineTo(calP2.x, calP2.y);
      stageCtx.stroke();
      [calP1, calP2].forEach((p) => {
        stageCtx.fillStyle = '#facc15';
        stageCtx.beginPath();
        stageCtx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        stageCtx.fill();
      });

      // Draw Coordinate Origin Crosshair
      stageCtx.strokeStyle = '#38bdf8';
      stageCtx.lineWidth = 1.5;
      stageCtx.beginPath();
      stageCtx.moveTo(originPx.x - 16, originPx.y);
      stageCtx.lineTo(originPx.x + 16, originPx.y);
      stageCtx.moveTo(originPx.x, originPx.y - 16);
      stageCtx.lineTo(originPx.x, originPx.y + 16);
      stageCtx.stroke();
      stageCtx.fillStyle = '#38bdf8';
      stageCtx.font = 'bold 11px monospace';
      stageCtx.fillText('O(0,0)', originPx.x + 6, originPx.y - 6);

      // Draw Tracked Trajectory & Points
      if (points.length > 1) {
        stageCtx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
        stageCtx.lineWidth = 2;
        stageCtx.beginPath();
        points.forEach((pt, idx) => {
          if (idx === 0) stageCtx.moveTo(pt.px, pt.py);
          else stageCtx.lineTo(pt.px, pt.py);
        });
        stageCtx.stroke();
      }
      points.forEach((pt, idx) => {
        const isCurrent = pt.frame === frameIdx;
        stageCtx.fillStyle = isCurrent ? '#34d399' : '#22d3ee';
        stageCtx.beginPath();
        stageCtx.arc(pt.px, pt.py, isCurrent ? 5.5 : 3.8, 0, Math.PI * 2);
        stageCtx.fill();
        if (isCurrent || idx === points.length - 1) {
          stageCtx.strokeStyle = '#ffffff';
          stageCtx.lineWidth = 1.5;
          stageCtx.stroke();
        }
      });
      stageCtx.restore();
    },
    [calP1, calP2, getSampleCtx, originPx, points, sourceKind]
  );

  // Sync seeked <video> or demo frame
  useEffect(() => {
    if (sourceKind === 'uploaded_video' && videoElRef.current && videoUrl) {
      const vid = videoElRef.current;
      const targetTime = Math.min(Math.max(0, currentFrame / DEMO_FPS), Math.max(0, videoDuration - 0.01));
      if (Math.abs(vid.currentTime - targetTime) > 0.008) {
        const onSeeked = () => {
          vid.removeEventListener('seeked', onSeeked);
          drawFrameAt(currentFrame);
        };
        vid.addEventListener('seeked', onSeeked);
        try {
          vid.currentTime = targetTime;
        } catch {
          drawFrameAt(currentFrame);
        }
        return () => vid.removeEventListener('seeked', onSeeked);
      }
    }
    drawFrameAt(currentFrame);
  }, [currentFrame, drawFrameAt, sourceKind, videoDuration, videoUrl]);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || isAutoTracking) return;
    const id = window.setInterval(() => {
      setCurrentFrame((prev) => {
        const next = prev + 1;
        if (next >= totalFrames) return 0;
        return next;
      });
    }, 1000 / DEMO_FPS);
    return () => window.clearInterval(id);
  }, [isAutoTracking, isPlaying, totalFrames]);

  // Clean up object URL & camera on unmount
  useEffect(() => {
    return () => {
      autoTrackAbortRef.current = true;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (camStreamRef.current) {
        camStreamRef.current.getTracks().forEach((tr) => tr.stop());
      }
    };
  }, [videoUrl]);

  const handleVideoFile = (file: File) => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setSourceKind('uploaded_video');
    setCurrentFrame(0);
    setPoints([]);
    setIsPlaying(false);
  };

  // Live Camera Recording Controls
  const openLiveCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        isEn ? 'Browser camera capture is unavailable here.' : 'Trình duyệt hiện chưa hỗ trợ quay camera trực tiếp.'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      camStreamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (camPreviewRef.current) {
          camPreviewRef.current.srcObject = stream;
          camPreviewRef.current.play().catch(() => {});
        }
      }, 60);
    } catch {
      setCameraError(
        isEn
          ? 'Could not access camera. Check browser permission or upload a video file.'
          : 'Không mở được camera. Hãy cấp quyền hoặc tải file video trực tiếp từ máy.'
      );
    }
  };

  const closeLiveCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (camStreamRef.current) {
      camStreamRef.current.getTracks().forEach((tr) => tr.stop());
      camStreamRef.current = null;
    }
    setCameraOpen(false);
    setIsRecordingCam(false);
  };

  const toggleCamRecording = () => {
    if (!camStreamRef.current) return;
    if (isRecordingCam && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecordingCam(false);
      return;
    }
    const chunks: BlobPart[] = [];
    const mime = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '';
    const recorder = mime
      ? new MediaRecorder(camStreamRef.current, { mimeType: mime })
      : new MediaRecorder(camStreamRef.current);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) chunks.push(ev.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mime || 'video/webm' });
      const file = new File([blob], `experiment_${Date.now()}.webm`, { type: blob.type });
      handleVideoFile(file);
      closeLiveCamera();
    };
    recorder.start();
    setIsRecordingCam(true);
  };

  // Find centroid of matching color cluster near hint point (or whole frame)
  const detectColorCentroidOnSample = useCallback(
    (hint?: { x: number; y: number }): { x: number; y: number } | null => {
      const sampleCtx = getSampleCtx();
      if (!sampleCtx) return null;
      const img = sampleCtx.getImageData(0, 0, STAGE_W, STAGE_H);
      const data = img.data;
      const [tr, tg, tb] = targetRgb;
      const tolSq = colorTolerance * colorTolerance;

      const x0 = hint ? Math.max(0, Math.floor(hint.x - 110)) : 20;
      const x1 = hint ? Math.min(STAGE_W - 1, Math.ceil(hint.x + 110)) : STAGE_W - 20;
      const y0 = hint ? Math.max(0, Math.floor(hint.y - 110)) : 20;
      const y1 = hint ? Math.min(STAGE_H - 1, Math.ceil(hint.y + 110)) : STAGE_H - 20;

      let sumX = 0;
      let sumY = 0;
      let count = 0;
      let bestScore = Infinity;
      let bestX = 0;
      let bestY = 0;

      for (let y = y0; y <= y1; y += 2) {
        const rowOff = y * STAGE_W;
        for (let x = x0; x <= x1; x += 2) {
          const i = (rowOff + x) * 4;
          const dr = data[i] - tr;
          const dg = data[i + 1] - tg;
          const db = data[i + 2] - tb;
          const dSq = dr * dr + dg * dg + db * db;
          if (dSq < bestScore) {
            bestScore = dSq;
            bestX = x;
            bestY = y;
          }
          if (dSq <= tolSq) {
            sumX += x;
            sumY += y;
            count += 1;
          }
        }
      }

      if (count >= 4) {
        return { x: sumX / count, y: sumY / count };
      }
      if (bestScore <= tolSq * 1.45) {
        return { x: bestX, y: bestY };
      }
      return null;
    },
    [colorTolerance, getSampleCtx, targetRgb]
  );

  // Seek or render a specific frame synchronously/async and return clean sample
  const prepareSampleFrame = useCallback(
    async (fIdx: number): Promise<void> => {
      const sampleCtx = getSampleCtx();
      if (!sampleCtx) return;
      if (sourceKind === 'demo_free_fall' || sourceKind === 'demo_pendulum') {
        renderDemoFrame(sampleCtx, STAGE_W, STAGE_H, sourceKind, fIdx / DEMO_FPS);
        return;
      }
      const vid = videoElRef.current;
      if (!vid) return;
      const targetTime = Math.min(Math.max(0, fIdx / DEMO_FPS), Math.max(0, videoDuration - 0.01));
      if (Math.abs(vid.currentTime - targetTime) > 0.01) {
        await new Promise<void>((resolve) => {
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            vid.removeEventListener('seeked', finish);
            resolve();
          };
          vid.addEventListener('seeked', finish);
          vid.currentTime = targetTime;
          setTimeout(finish, 180);
        });
      }
      sampleCtx.fillStyle = '#0f172a';
      sampleCtx.fillRect(0, 0, STAGE_W, STAGE_H);
      const vw = vid.videoWidth || STAGE_W;
      const vh = vid.videoHeight || STAGE_H;
      const fit = Math.min(STAGE_W / vw, STAGE_H / vh);
      sampleCtx.drawImage(vid, (STAGE_W - vw * fit) * 0.5, (STAGE_H - vh * fit) * 0.5, vw * fit, vh * fit);
    },
    [getSampleCtx, sourceKind, videoDuration]
  );

  const runAutoColorTrack = async () => {
    if (isAutoTracking) {
      autoTrackAbortRef.current = true;
      setIsAutoTracking(false);
      return;
    }

    autoTrackAbortRef.current = false;
    setIsPlaying(false);
    setIsAutoTracking(true);
    setPoints([]);

    const collected: TrackedPoint[] = [];
    let lastHint: { x: number; y: number } | undefined = undefined;

    for (let f = 0; f < totalFrames; f += frameStep) {
      if (autoTrackAbortRef.current) break;
      await prepareSampleFrame(f);
      const hit = detectColorCentroidOnSample(lastHint);
      if (hit) {
        lastHint = hit;
        const { xM, yM } = toPhysicalCoords(hit.x, hit.y);
        collected.push({
          frame: f,
          t: f / DEMO_FPS,
          px: hit.x,
          py: hit.y,
          xM,
          yM
        });
        setCurrentFrame(f);
        setPoints([...collected]);
      } else if (collected.length > 3) {
        // Object exited frame or lost
        break;
      }
      await new Promise((r) => setTimeout(r, 22));
    }

    setIsAutoTracking(false);
  };

  // Interactive click on tracker canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = stageCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / Math.max(1, rect.width)) * STAGE_W;
    const py = ((e.clientY - rect.top) / Math.max(1, rect.height)) * STAGE_H;

    if (tool === 'calibrate') {
      if (!calWaitingSecond) {
        setCalP1({ x: px, y: py });
        setCalWaitingSecond(true);
      } else {
        setCalP2({ x: px, y: py });
        setCalWaitingSecond(false);
      }
      return;
    }

    if (tool === 'origin') {
      setOriginPx({ x: px, y: py });
      return;
    }

    if (tool === 'auto_color') {
      const sampleCtx = getSampleCtx();
      if (sampleCtx) {
        const pixel = sampleCtx.getImageData(
          Math.max(0, Math.min(STAGE_W - 1, Math.round(px))),
          Math.max(0, Math.min(STAGE_H - 1, Math.round(py))),
          1,
          1
        ).data;
        setTargetRgb([pixel[0], pixel[1], pixel[2]]);
      }
      return;
    }

    // Manual tracking click
    const { xM, yM } = toPhysicalCoords(px, py);
    const tSec = currentFrame / DEMO_FPS;
    setPoints((prev) => {
      const filtered = prev.filter((p) => p.frame !== currentFrame);
      return [...filtered, { frame: currentFrame, t: tSec, px, py, xM, yM }].sort((a, b) => a.frame - b.frame);
    });
    if (currentFrame + frameStep < totalFrames) {
      setCurrentFrame((f) => Math.min(totalFrames - 1, f + frameStep));
    }
  };

  // Quantitative Physics Fitting & Kinematics
  const analysis = useMemo(() => {
    const sorted = [...points].sort((a, b) => a.t - b.t);
    const ts = sorted.map((p) => p.t);
    const activeCoords = sorted.map((p) => (experimentKind === 'free_fall' ? p.yM : p.xM));

    // Velocities (central difference where available)
    const velocities = sorted.map((p, idx) => {
      if (sorted.length < 2) return 0;
      if (idx === 0) {
        const dt = Math.max(1e-5, sorted[1].t - p.t);
        return (activeCoords[1] - activeCoords[0]) / dt;
      }
      if (idx === sorted.length - 1) {
        const dt = Math.max(1e-5, p.t - sorted[idx - 1].t);
        return (activeCoords[idx] - activeCoords[idx - 1]) / dt;
      }
      const dt = Math.max(1e-5, sorted[idx + 1].t - sorted[idx - 1].t);
      return (activeCoords[idx + 1] - activeCoords[idx - 1]) / dt;
    });

    const quadFit = fitQuadraticOLS(ts, activeCoords);
    const measuredG = quadFit ? Math.abs(2 * quadFit.c2) : null;
    const gErrorPct = measuredG !== null ? (Math.abs(measuredG - 9.81) / 9.81) * 100 : null;
    const osc = estimateOscillationPeriod(ts, sorted.map((p) => p.xM));
    const inferredPendulumLength =
      osc.periodSec !== null ? (9.81 * osc.periodSec * osc.periodSec) / (4 * Math.PI * Math.PI) : null;

    return {
      sorted,
      ts,
      activeCoords,
      velocities,
      quadFit,
      measuredG,
      gErrorPct,
      osc,
      inferredPendulumLength
    };
  }, [experimentKind, points]);

  const exportCsv = () => {
    if (analysis.sorted.length === 0) return;
    const header = 'frame,t_s,x_m,y_m,v_active_ms\n';
    const rows = analysis.sorted
      .map(
        (p, idx) =>
          `${p.frame},${p.t.toFixed(4)},${p.xM.toFixed(4)},${p.yM.toFixed(4)},${analysis.velocities[idx].toFixed(4)}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Synapse_MotionTracker_${experimentKind}_${Date.now()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  // Build responsive SVG polyline strings
  const renderChart = (
    titleText: string,
    series: number[],
    fitCurve: ((t: number) => number) | null,
    strokeHex: string,
    unitLabel: string
  ) => {
    const W = 320;
    const H = 132;
    const padL = 36;
    const padR = 12;
    const padT = 14;
    const padB = 22;

    if (analysis.ts.length < 2) {
      return (
        <div className="p-3 rounded-md bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono font-bold text-slate-300">{titleText}</div>
          <div className="h-[112px] flex items-center justify-center text-[11px] text-slate-500">
            {isEn ? 'Track at least 2 points to plot graph' : 'Chấm tối thiểu 2 điểm (hoặc Track tự động) để vẽ đồ thị'}
          </div>
        </div>
      );
    }

    const minT = Math.min(...analysis.ts);
    const maxT = Math.max(minT + 0.05, Math.max(...analysis.ts));
    const minY = Math.min(...series);
    const maxY = Math.max(minY + 0.05, Math.max(...series));
    const mapX = (t: number) => padL + ((t - minT) / (maxT - minT)) * (W - padL - padR);
    const mapY = (y: number) => H - padB - ((y - minY) / (maxY - minY)) * (H - padT - padB);

    const ptsAttr = analysis.ts.map((t, i) => `${mapX(t).toFixed(1)},${mapY(series[i]).toFixed(1)}`).join(' ');
    let fitAttr = '';
    if (fitCurve) {
      const samples: string[] = [];
      for (let i = 0; i <= 24; i++) {
        const t = minT + ((maxT - minT) * i) / 24;
        const y = Math.min(maxY + 0.2 * (maxY - minY), Math.max(minY - 0.2 * (maxY - minY), fitCurve(t)));
        samples.push(`${mapX(t).toFixed(1)},${mapY(y).toFixed(1)}`);
      }
      fitAttr = samples.join(' ');
    }

    return (
      <div className="p-2.5 rounded-md bg-slate-950 border border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="font-bold text-slate-200">{titleText}</span>
          <span className="text-slate-400 tabular-nums">
            [{minY.toFixed(2)} .. {maxY.toFixed(2)}] {unitLabel}
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#334155" strokeWidth="1" />
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#334155" strokeWidth="1" />
          <text x={padL - 4} y={padT + 8} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
            {maxY.toFixed(2)}
          </text>
          <text x={padL - 4} y={H - padB} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
            {minY.toFixed(2)}
          </text>
          <text x={W - padR} y={H - 5} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
            {maxT.toFixed(2)}s
          </text>
          {fitAttr && (
            <polyline fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="4 3" points={fitAttr} />
          )}
          <polyline fill="none" stroke={strokeHex} strokeWidth="2" points={ptsAttr} />
          {analysis.ts.map((t, i) => (
            <circle key={i} cx={mapX(t)} cy={mapY(series[i])} r="2.6" fill={strokeHex} />
          ))}
        </svg>
      </div>
    );
  };

  const targetColorHex = `#${targetRgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

  return (
    <div className="space-y-3" data-testid="motion-video-tracker">
      {/* Hidden source video element for uploaded/recorded files */}
      {videoUrl && (
        <video
          ref={videoElRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const vid = e.currentTarget;
            if (Number.isFinite(vid.duration) && vid.duration > 0) {
              setVideoDuration(vid.duration);
            }
            drawFrameAt(0);
          }}
          className="hidden"
        />
      )}

      {/* Source Selection Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            data-testid="tracker-demo-freefall"
            onClick={() => loadDemoExperiment('demo_free_fall')}
            className={`px-2.5 py-1.5 rounded text-xs font-bold border cursor-pointer transition-colors ${
              sourceKind === 'demo_free_fall'
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            {isEn ? 'Demo: Free Fall (g)' : 'Mẫu: Rơi tự do (Đo g)'}
          </button>
          <button
            type="button"
            data-testid="tracker-demo-pendulum"
            onClick={() => loadDemoExperiment('demo_pendulum')}
            className={`px-2.5 py-1.5 rounded text-xs font-bold border cursor-pointer transition-colors ${
              sourceKind === 'demo_pendulum'
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            {isEn ? 'Demo: Pendulum (T)' : 'Mẫu: Con lắc đơn (Đo T)'}
          </button>
          <label className="px-2.5 py-1.5 rounded text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-400 flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-sky-500" />
            <span>{isEn ? 'Upload Video' : 'Tải Video thật'}</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoFile(file);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => (cameraOpen ? closeLiveCamera() : void openLiveCamera())}
            className={`px-2.5 py-1.5 rounded text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
              cameraOpen
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-rose-400'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{cameraOpen ? (isEn ? 'Close Camera' : 'Đóng Camera') : isEn ? 'Record Lab' : 'Quay Thí Nghiệm'}</span>
          </button>
        </div>

        <select
          value={experimentKind}
          onChange={(e) => setExperimentKind(e.target.value as ExperimentKind)}
          aria-label="Loại bài toán đo lường"
          className="px-2.5 py-1.5 rounded text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100"
        >
          <option value="free_fall">{isEn ? 'Gravity (g = 2c₂)' : 'Rơi tự do · Đo g (m/s²)'}</option>
          <option value="pendulum">{isEn ? 'Oscillation Period (T)' : 'Dao động · Đo chu kỳ T (s)'}</option>
          <option value="linear">{isEn ? 'Linear Kinematics (v, a)' : 'Chuyển động thẳng (v, a)'}</option>
        </select>
      </div>

      {cameraError && (
        <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-xs text-rose-700 dark:text-rose-300">
          {cameraError}
        </div>
      )}

      {/* Live Camera Recorder Panel */}
      {cameraOpen && (
        <div className="rounded-lg border border-rose-500/40 bg-slate-950 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span className="font-bold flex items-center gap-1.5">
              <Video className="w-4 h-4 text-rose-400" />
              {isEn ? 'Live Experiment Recorder' : 'Quay trực tiếp thí nghiệm ngoài đời'}
            </span>
            <button
              type="button"
              onClick={toggleCamRecording}
              className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isRecordingCam ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isRecordingCam ? <Square className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
              <span>{isRecordingCam ? (isEn ? 'Stop & Analyze' : 'Dừng quay & Phân tích') : isEn ? 'Start Recording' : 'Bắt đầu quay'}</span>
            </button>
          </div>
          <video ref={camPreviewRef} muted playsInline className="w-full max-h-[260px] object-contain rounded bg-black" />
        </div>
      )}

      {/* 2-Zone Scientific Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left: Video Canvas + Tools + Frame Stepper */}
        <div className="lg:col-span-7 space-y-2.5">
          {/* Interactive Tools */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(
              [
                { id: 'auto_color', icon: Sparkles, labelVi: 'Tự bắt màu', labelEn: 'Auto Color' },
                { id: 'manual', icon: Target, labelVi: 'Chấm điểm', labelEn: 'Point Click' },
                { id: 'calibrate', icon: Ruler, labelVi: 'Thước (px/m)', labelEn: 'Scale Ruler' },
                { id: 'origin', icon: Crosshair, labelVi: 'Đặt gốc O', labelEn: 'Set Origin' }
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const active = tool === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTool(item.id);
                    setCalWaitingSecond(false);
                  }}
                  className={`px-2.5 py-2 rounded text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    active
                      ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-sky-400'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? item.labelEn : item.labelVi}</span>
                </button>
              );
            })}
          </div>

          {/* Tool Sub-bar: Calibration or Auto Color Target */}
          {tool === 'calibrate' && (
            <div className="flex flex-wrap items-center gap-2 p-2 rounded bg-amber-50 dark:bg-amber-950/35 border border-amber-300/70 dark:border-amber-700/60 text-xs">
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                {calWaitingSecond
                  ? isEn
                    ? 'Click 2nd endpoint on reference ruler'
                    : 'Chấm tiếp điểm thứ 2 trên thước chuẩn'
                  : isEn
                  ? 'Click 2 endpoints of known length:'
                  : 'Chấm 2 đầu thước biết trước độ dài:'}
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={scaleMeters}
                  onChange={(e) => setScaleMeters(Math.max(0.05, Number(e.target.value) || 1))}
                  className="w-16 px-1.5 py-1 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                />
                <span className="font-mono text-amber-800 dark:text-amber-300">m ({pxPerMeter.toFixed(0)} px/m)</span>
              </div>
            </div>
          )}

          {tool === 'auto_color' && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded bg-slate-900 border border-sky-500/40 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded border border-white/40 shrink-0"
                  style={{ backgroundColor: targetColorHex }}
                  title={targetColorHex}
                />
                <span className="text-[11px]">
                  {isEn ? 'Click object to sample color' : 'Bấm lên vật để lấy màu'} ({targetColorHex})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Tol {colorTolerance}</span>
                <input
                  type="range"
                  min={20}
                  max={105}
                  value={colorTolerance}
                  onChange={(e) => setColorTolerance(Number(e.target.value))}
                  className="w-20 accent-sky-400"
                />
                <button
                  type="button"
                  data-testid="tracker-auto-track-btn"
                  onClick={() => void runAutoColorTrack()}
                  className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${
                    isAutoTracking
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isAutoTracking
                    ? isEn
                      ? 'Stop Track'
                      : 'Dừng'
                    : isEn
                    ? 'Auto Track All'
                    : 'Tự động Track'}
                </button>
              </div>
            </div>
          )}

          {/* 16:9 Canvas Stage */}
          <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 shadow-lg">
            <canvas
              ref={stageCanvasRef}
              width={STAGE_W}
              height={STAGE_H}
              onClick={handleCanvasClick}
              className="w-full h-auto block cursor-crosshair"
            />
          </div>

          {/* Video Transport & Step Bar */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-2 text-xs">
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              className="px-2.5 py-1.5 rounded bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setCurrentFrame((f) => Math.max(0, f - frameStep))}
              className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
              title="Prev frame"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentFrame((f) => Math.min(totalFrames - 1, f + frameStep))}
              className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer"
              title="Next frame"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <input
              type="range"
              min={0}
              max={Math.max(1, totalFrames - 1)}
              value={currentFrame}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrame(Number(e.target.value));
              }}
              className="flex-1 min-w-[90px] accent-sky-500"
            />

            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
              F{currentFrame}/{totalFrames - 1} · {(currentFrame / DEMO_FPS).toFixed(2)}s
            </span>

            <select
              value={frameStep}
              onChange={(e) => setFrameStep(Number(e.target.value))}
              className="px-1.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[11px]"
              title="Bước nhảy khung hình"
            >
              <option value={1}>+1f</option>
              <option value={2}>+2f</option>
              <option value={3}>+3f</option>
            </select>

            <button
              type="button"
              onClick={() => setPoints((prev) => prev.slice(0, -1))}
              disabled={points.length === 0}
              className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
              title={isEn ? 'Undo last point' : 'Hoàn tác 1 điểm'}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setPoints([]);
                setCurrentFrame(0);
              }}
              disabled={points.length === 0}
              className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-rose-500 cursor-pointer"
              title={isEn ? 'Clear all points' : 'Xóa toàn bộ điểm'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Experimental Measurements & Dual Charts */}
        <div className="lg:col-span-5 space-y-2.5">
          {/* Primary Physics Fit Card */}
          <div className="p-3 rounded-md bg-slate-900 border border-sky-500/35 text-white space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-sky-400">
              <span>
                {isEn ? 'MEASURED PHYSICS MODEL' : 'KẾT QUẢ ĐO ĐẠC THỰC NGHIỆM'} · {analysis.sorted.length} pts
              </span>
              <button
                type="button"
                onClick={exportCsv}
                disabled={analysis.sorted.length === 0}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>

            {experimentKind === 'free_fall' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Gravity g_exp' : 'Gia tốc trọng trường g'}
                  </div>
                  <div
                    data-testid="tracker-measured-g"
                    className="text-lg font-mono font-extrabold text-emerald-400 tabular-nums"
                  >
                    {analysis.measuredG !== null ? `${analysis.measuredG.toFixed(2)} m/s²` : '--'}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Fit R² · Error' : 'Độ khớp R² · Sai số'}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300 tabular-nums mt-0.5">
                    {analysis.quadFit ? `R²=${analysis.quadFit.r2.toFixed(3)}` : '--'}
                    {analysis.gErrorPct !== null ? ` · ${analysis.gErrorPct.toFixed(1)}%` : ''}
                  </div>
                </div>
              </div>
            )}

            {experimentKind === 'pendulum' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Period T_exp' : 'Chu kỳ dao động T'}
                  </div>
                  <div
                    data-testid="tracker-measured-t"
                    className="text-lg font-mono font-extrabold text-emerald-400 tabular-nums"
                  >
                    {analysis.osc.periodSec !== null ? `${analysis.osc.periodSec.toFixed(3)} s` : '--'}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Freq f · Length l' : 'Tần số f · Chiều dài l'}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300 tabular-nums mt-0.5">
                    {analysis.osc.periodSec
                      ? `${(1 / analysis.osc.periodSec).toFixed(2)} Hz · ${(analysis.inferredPendulumLength ?? 0).toFixed(2)} m`
                      : '--'}
                  </div>
                </div>
              </div>
            )}

            {experimentKind === 'linear' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Acceleration a' : 'Gia tốc trung bình a'}
                  </div>
                  <div className="text-lg font-mono font-extrabold text-emerald-400 tabular-nums">
                    {analysis.quadFit ? `${(2 * analysis.quadFit.c2).toFixed(2)} m/s²` : '--'}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {isEn ? 'Initial v₀' : 'Vận tốc ban đầu v₀'}
                  </div>
                  <div className="text-sm font-mono font-bold text-amber-300 tabular-nums mt-0.5">
                    {analysis.quadFit ? `${analysis.quadFit.c1.toFixed(2)} m/s` : '--'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dual Physics Graphs */}
          {renderChart(
            experimentKind === 'free_fall' ? 'Đồ thị tọa độ rơi y(t)' : 'Đồ thị li độ x(t)',
            analysis.activeCoords,
            analysis.quadFit
              ? (t) => analysis.quadFit!.c0 + analysis.quadFit!.c1 * t + analysis.quadFit!.c2 * t * t
              : null,
            '#38bdf8',
            'm'
          )}

          {renderChart('Đồ thị vận tốc tức thời v(t)', analysis.velocities, null, '#34d399', 'm/s')}

          {/* Quick toggle for +y axis direction */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 px-1">
            <span>
              {isEn ? 'Vertical axis:' : 'Chiều dương Oy:'}{' '}
              <button
                type="button"
                onClick={() => setYAxisUp((v) => !v)}
                className="font-bold text-sky-600 dark:text-sky-400 underline cursor-pointer"
              >
                {yAxisUp ? (isEn ? 'Upwards (+y ↑)' : 'Hướng lên (+y ↑)') : isEn ? 'Downwards (+y ↓)' : 'Hướng xuống (+y ↓)'}
              </button>
            </span>
            <button
              type="button"
              onClick={() =>
                loadDemoExperiment(sourceKind === 'demo_pendulum' ? 'demo_pendulum' : 'demo_free_fall')
              }
              className="flex items-center gap-1 font-semibold hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? 'Reset Demo' : 'Đặt lại mẫu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
