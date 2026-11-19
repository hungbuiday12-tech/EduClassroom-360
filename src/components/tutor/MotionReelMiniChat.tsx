import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Download,
  Film,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Activity
} from 'lucide-react';
import { safeFetchJson } from '../../lib/apiClient';
import { cancelActiveSpeech, speakCoPilotReply } from '../../lib/liveCoPilotBridge';
import { FormattedText } from '../common/MathRenderer';
import { subscribeRemoteCommand } from '../../lib/remoteControlBus';
import { MotionVideoTracker } from './MotionVideoTracker';

export type MotionVisualKind =
  | 'derivative_tangent'
  | 'integral_area'
  | 'vector_addition'
  | 'phasor_circle'
  | 'wave_superposition'
  | 'parabola_vertex'
  | 'binary_search';

export interface MotionReelScene {
  id: string;
  title: string;
  caption: string;
  narration: string;
  formula: string;
  visualKind: MotionVisualKind;
  durationSec: number;
  accentHex: string;
  paramA: number;
  paramB: number;
  keyLabels?: string[];
}

export interface MotionReelScript {
  title: string;
  topicSummary: string;
  scenes: MotionReelScene[];
}

interface MotionReelMiniChatProps {
  language: 'vi' | 'en';
  subject: 'math' | 'physics' | 'cs';
  initialTopic?: string;
}

const PRESET_REELS: Record<string, { labelVi: string; labelEn: string; reel: MotionReelScript }> = {
  derivative: {
    labelVi: 'Đạo hàm & Tiếp tuyến (3B1B)',
    labelEn: 'Derivative & Tangent Slope',
    reel: {
      title: 'Bản Chất Hình Học Đạo Hàm f\'(x)',
      topicSummary: 'Tiếp tuyến là giới hạn của cát tuyến khi Δx → 0, biểu diễn tốc độ biến thiên tức thời.',
      scenes: [
        {
          id: 's1',
          title: '1. Đường cong f(x) và điểm M₀',
          caption: 'Xét hàm số liên tục y = f(x) trong hệ trục Oxy.',
          narration: 'Hãy tưởng tượng một điểm M không ngừng trượt trên đường cong hàm số bậc ba.',
          formula: 'y = f(x) = 0.25x^3 - 1.1x',
          visualKind: 'parabola_vertex',
          durationSec: 5,
          accentHex: '#38bdf8',
          paramA: 0.4,
          paramB: 0.9,
          keyLabels: ['M₀(x₀, f(x₀))', 'Đường cong f(x)']
        },
        {
          id: 's2',
          title: '2. Tỉ số biến thiên & Tiếp tuyến trượt',
          caption: 'Hệ số góc k = Δy/Δx dần tới đạo hàm f\'(x₀) khi Δx tiến về 0.',
          narration: 'Khi khoảng cách delta x co nhỏ lại gần 0, cát tuyến xoay dần và chạm khít thành tiếp tuyến tại điểm đang xét.',
          formula: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x}",
          visualKind: 'derivative_tangent',
          durationSec: 6.5,
          accentHex: '#f59e0b',
          paramA: 1.0,
          paramB: 0.8,
          keyLabels: ['Δx → 0', 'k = f\'(x₀)']
        },
        {
          id: 's3',
          title: '3. Liên hệ Tích phân · Diện tích Riemann',
          caption: 'Cộng dồn vô số dải hình chữ nhật mỏng dưới đường cong.',
          narration: 'Ngược lại với đạo hàm, tích phân cộng dồn từng dải diện tích vi phân rất nhỏ dưới đồ thị.',
          formula: '\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^n f(x_i)\\Delta x',
          visualKind: 'integral_area',
          durationSec: 6,
          accentHex: '#34d399',
          paramA: 1.1,
          paramB: 1.0,
          keyLabels: ['dS = f(x)dx', 'Định lí cơ bản']
        }
      ]
    }
  },
  shm_phasor: {
    labelVi: 'Dao động điều hòa & Giản đồ Fresnel',
    labelEn: 'SHM Phasor Circle & Sine Wave',
    reel: {
      title: 'Chiếu Chuyển Động Tròn Lên Sóng Hình Sin',
      topicSummary: 'Li độ điều hòa x = A cos(ωt + φ) chính là hình chiếu trục hoành của vectơ quay đều.',
      scenes: [
        {
          id: 'p1',
          title: '1. Vectơ quay bán kính A',
          caption: 'Vectơ quay đều tốc độ góc ω sinh ra hình chiếu dao động điều hòa.',
          narration: 'Khi bán kính R bằng A quay tròn đều với tốc độ góc omega, hình chiếu theo phương đứng vẽ ra đúng đường sóng hình sin.',
          formula: 'x(t) = A\\cos(\\omega t + \\varphi), \\quad v(t) = -\\omega A\\sin(\\omega t + \\varphi)',
          visualKind: 'phasor_circle',
          durationSec: 6.5,
          accentHex: '#38bdf8',
          paramA: 1.25,
          paramB: 1.0,
          keyLabels: ['Pha ωt + φ', 'Biên độ A']
        },
        {
          id: 'p2',
          title: '2. Giao thoa hai sóng kết hợp',
          caption: 'Tổng hợp hai dao động cùng tần số tạo cực đại & cực tiểu giao thoa.',
          narration: 'Khi hai nguồn sóng giao thoa nhau, các đỉnh sóng cộng hưởng tăng biên độ gấp đôi tại cực đại.',
          formula: 'y = 2A\\cos\\left(\\frac{\\pi(d_2-d_1)}{\\lambda}\\right)\\cos(\\omega t)',
          visualKind: 'wave_superposition',
          durationSec: 6,
          accentHex: '#a855f7',
          paramA: 1.4,
          paramB: 0.9,
          keyLabels: ['Cực đại kλ', 'Triệt tiêu (k+0.5)λ']
        }
      ]
    }
  },
  vector_binary: {
    labelVi: 'Vector & Thuật toán Nhị phân',
    labelEn: 'Vector Parallelogram & Binary Search',
    reel: {
      title: 'Tổng Hợp Vector & Tìm Kiếm Nhị Phân O(log N)',
      topicSummary: 'Biểu diễn phép cộng vector không gian và cách thu hẹp nửa mảng tìm kiếm.',
      scenes: [
        {
          id: 'v1',
          title: '1. Quy tắc Hình bình hành',
          caption: 'Tổng hai vectơ lực hoặc vận tốc bằng đường chéo hình bình hành.',
          narration: 'Từ hai vectơ thành phần u và v, đường chéo hình bình hành biểu diễn vectơ tổng hợp lực tác dụng.',
          formula: '\\vec{F}_{\\text{net}} = \\vec{F}_1 + \\vec{F}_2',
          visualKind: 'vector_addition',
          durationSec: 5.5,
          accentHex: '#2dd4bf',
          paramA: 1.3,
          paramB: 0.7,
          keyLabels: ['Vector u', 'Vector v', 'u + v']
        },
        {
          id: 'v2',
          title: '2. Tìm kiếm nhị phân chia đôi',
          caption: 'Loại bỏ một nửa không gian tìm kiếm sau mỗi lần so sánh tại mid.',
          narration: 'Mỗi bước chọn phần tử giữa mid và loại ngay một nửa dãy không phù hợp, đạt độ phức tạp O log N.',
          formula: 'mid = l + \\lfloor (r - l) / 2 \\rfloor, \\quad T(N) = O(\\log_2 N)',
          visualKind: 'binary_search',
          durationSec: 6,
          accentHex: '#fbbf24',
          paramA: 1.0,
          paramB: 1.0,
          keyLabels: ['Left L', 'Mid', 'Right R']
        }
      ]
    }
  }
};

function drawGridBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  const step = 36;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawMotionSceneFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  scene: MotionReelScene,
  progress: number,
  sceneIdx: number,
  totalScenes: number
) {
  drawGridBackground(ctx, w, h);
  const accent = scene.accentHex || '#38bdf8';
  const cx = w * 0.5;
  const cy = h * 0.54;
  const pA = Math.max(0.4, Math.min(2.2, scene.paramA || 1));

  // Header strip inside canvas
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.fillRect(18, 14, w - 36, 46);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.strokeRect(18, 14, w - 36, 46);

  ctx.fillStyle = accent;
  ctx.font = '700 13px monospace';
  ctx.fillText(`3B1B MOTION REEL · ${sceneIdx + 1}/${totalScenes}`, 30, 32);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 16px sans-serif';
  ctx.fillText(scene.title.slice(0, 58), 30, 51);

  const plotLeft = 56;
  const plotRight = w - 56;
  const plotW = plotRight - plotLeft;

  if (scene.visualKind === 'derivative_tangent' || scene.visualKind === 'parabola_vertex') {
    // Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(plotLeft, cy + 50);
    ctx.lineTo(plotRight, cy + 50);
    ctx.moveTo(cx, 82);
    ctx.lineTo(cx, h - 76);
    ctx.stroke();

    const fn = (u: number) =>
      scene.visualKind === 'derivative_tangent'
        ? 0.32 * pA * (u * u * u - 3 * u)
        : 0.45 * pA * (u * u - 1.5);
    const dfn = (u: number) =>
      scene.visualKind === 'derivative_tangent' ? 0.32 * pA * (3 * u * u - 3) : 0.9 * pA * u;

    // Curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = plotLeft; px <= plotRight; px += 4) {
      const u = ((px - cx) / plotW) * 5.2;
      const py = cy + 32 - fn(u) * 34;
      if (px === plotLeft) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Sliding tangent point
    const u0 = -1.95 + progress * 3.9;
    const x0 = cx + (u0 / 5.2) * plotW;
    const y0 = cy + 32 - fn(u0) * 34;
    const slope = dfn(u0);
    const dxPx = 95;
    const dyPx = slope * (dxPx / plotW) * 5.2 * 34;

    // Secant approaching tangent visualization
    const delta = (1 - progress * 0.85) * 0.9;
    if (scene.visualKind === 'derivative_tangent') {
      const x1 = cx + ((u0 + delta) / 5.2) * plotW;
      const y1 = cy + 32 - fn(u0 + delta) * 34;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x0 - dxPx, y0 + dyPx);
    ctx.lineTo(x0 + dxPx, y0 - dyPx);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x0, y0, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '700 12px monospace';
    ctx.fillText(`x=${u0.toFixed(2)}  k=f'(x)=${slope.toFixed(2)}`, Math.min(plotRight - 190, Math.max(plotLeft, x0 + 10)), Math.max(92, y0 - 12));
  } else if (scene.visualKind === 'integral_area') {
    const baseY = h - 95;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(plotLeft, baseY);
    ctx.lineTo(plotRight, baseY);
    ctx.stroke();

    const fn = (t: number) => 0.42 + 0.36 * Math.sin(t * 2.8 * pA) + 0.16 * Math.cos(t * 5);
    const numRects = Math.round(6 + progress * 28);
    const barW = (plotW * 0.72) / numRects;
    const startX = plotLeft + plotW * 0.14;

    for (let i = 0; i < numRects; i++) {
      const t = (i + 0.5) / numRects;
      const val = fn(t);
      const bh = val * 140;
      const bx = startX + i * barW;
      ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 1;
      ctx.fillRect(bx, baseY - bh, Math.max(2, barW - 1), bh);
      ctx.strokeRect(bx, baseY - bh, Math.max(2, barW - 1), bh);
    }

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const px = startX + t * plotW * 0.72;
      const py = baseY - fn(t) * 140;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.font = '700 13px monospace';
    ctx.fillText(`N = ${numRects} Riemann slices (Δx → 0)`, startX, 95);
  } else if (scene.visualKind === 'phasor_circle') {
    const circleCx = w * 0.26;
    const circleCy = h * 0.52;
    const R = 68;
    const theta = progress * Math.PI * 2.5 * pA;
    const px = circleCx + Math.cos(theta) * R;
    const py = circleCy - Math.sin(theta) * R;

    // Circle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(circleCx, circleCy, R, 0, Math.PI * 2);
    ctx.stroke();

    // Phasor arrow
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(circleCx, circleCy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(px, py, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Projection dashed line
    const waveStart = w * 0.45;
    const waveEnd = w - 46;
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(waveStart, py);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axes for sine wave
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.beginPath();
    ctx.moveTo(waveStart, circleCy);
    ctx.lineTo(waveEnd, circleCy);
    ctx.stroke();

    // Sine trace
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = waveStart; x <= waveEnd; x += 3) {
      const dt = (x - waveStart) / (waveEnd - waveStart);
      const y = circleCy - Math.sin(theta - dt * Math.PI * 3) * R;
      if (x === waveStart) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (scene.visualKind === 'wave_superposition') {
    const midY = h * 0.52;
    const k = 0.032 * pA;
    const phase = progress * Math.PI * 4;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let x = plotLeft; x <= plotRight; x += 4) {
      const y = midY - Math.sin(k * (x - plotLeft) - phase) * 34;
      if (x === plotLeft) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.beginPath();
    for (let x = plotLeft; x <= plotRight; x += 4) {
      const y = midY - Math.sin(k * (x - plotLeft) + phase) * 34;
      if (x === plotLeft) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = accent;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    for (let x = plotLeft; x <= plotRight; x += 3) {
      const y1 = Math.sin(k * (x - plotLeft) - phase) * 34;
      const y2 = Math.sin(k * (x - plotLeft) + phase) * 34;
      const y = midY - (y1 + y2);
      if (x === plotLeft) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else if (scene.visualKind === 'vector_addition') {
    const ox = w * 0.28;
    const oy = h * 0.66;
    const ux = 175 * pA * 0.85;
    const uy = -55;
    const vx = 75 + Math.cos(progress * Math.PI * 1.5) * 45;
    const vy = -110 - Math.sin(progress * Math.PI) * 25;

    const drawVec = (x1: number, y1: number, x2: number, y2: number, col: string, label: string) => {
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 11 * Math.cos(ang - 0.35), y2 - 11 * Math.sin(ang - 0.35));
      ctx.lineTo(x2 - 11 * Math.cos(ang + 0.35), y2 - 11 * Math.sin(ang + 0.35));
      ctx.closePath();
      ctx.fill();
      ctx.font = '700 12px monospace';
      ctx.fillText(label, (x1 + x2) / 2 + 6, (y1 + y2) / 2 - 6);
    };

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(ox + ux, oy + uy);
    ctx.lineTo(ox + ux + vx, oy + uy + vy);
    ctx.lineTo(ox + vx, oy + vy);
    ctx.stroke();
    ctx.setLineDash([]);

    drawVec(ox, oy, ox + ux, oy + uy, '#38bdf8', 'u');
    drawVec(ox, oy, ox + vx, oy + vy, '#fbbf24', 'v');
    drawVec(ox, oy, ox + ux + vx, oy + uy + vy, '#2dd4bf', 'u + v');
  } else if (scene.visualKind === 'binary_search') {
    const arr = [4, 9, 13, 18, 25, 31, 39, 44, 52, 61, 74, 88];
    const target = 52;
    const stepStage = Math.min(2, Math.floor(progress * 3));
    const ranges = [
      { l: 0, r: 11, mid: 5 },
      { l: 6, r: 11, mid: 8 },
      { l: 8, r: 8, mid: 8 }
    ];
    const { l, r, mid } = ranges[stepStage];
    const bw = 42;
    const gap = 8;
    const startX = (w - (arr.length * bw + (arr.length - 1) * gap)) / 2;
    const baseY = h * 0.64;

    arr.forEach((val, idx) => {
      const inRange = idx >= l && idx <= r;
      const isMid = idx === mid;
      const x = startX + idx * (bw + gap);
      const bh = 24 + val * 1.15;
      ctx.fillStyle = isMid ? '#fbbf24' : inRange ? 'rgba(56, 189, 248, 0.65)' : 'rgba(51, 65, 85, 0.45)';
      ctx.fillRect(x, baseY - bh, bw, bh);
      ctx.fillStyle = isMid ? '#0f172a' : '#f8fafc';
      ctx.font = '700 12px monospace';
      ctx.fillText(String(val), x + 12, baseY - bh + 18);

      if (idx === l) {
        ctx.fillStyle = '#34d399';
        ctx.fillText('L', x + 16, baseY + 18);
      }
      if (idx === r) {
        ctx.fillStyle = '#f43f5e';
        ctx.fillText('R', x + 16, baseY + 33);
      }
      if (isMid) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('MID', x + 8, baseY - bh - 10);
      }
    });
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 13px monospace';
    ctx.fillText(`Target = ${target} · Range [${l}..${r}] · mid = ${mid}`, plotLeft, 95);
  }

  // Bottom caption plate inside 16:9 reel
  ctx.fillStyle = 'rgba(2, 6, 23, 0.84)';
  ctx.fillRect(18, h - 62, w - 36, 48);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.strokeRect(18, h - 62, w - 36, 48);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 13px sans-serif';
  ctx.fillText(scene.caption.slice(0, 78), 30, h - 33);

  // Scene Progress Thin Line
  ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
  ctx.fillRect(18, h - 16, w - 36, 3);
  ctx.fillStyle = accent;
  ctx.fillRect(18, h - 16, (w - 36) * Math.max(0.02, Math.min(1, progress)), 3);
}

export const MotionReelMiniChat: React.FC<MotionReelMiniChatProps> = ({
  language,
  subject,
  initialTopic = ''
}) => {
  const isEn = language === 'en';
  const [reelMode, setReelMode] = useState<'ai_reel' | 'video_tracker'>('ai_reel');
  const [prompt, setPrompt] = useState(initialTopic);
  const [reel, setReel] = useState<MotionReelScript>(PRESET_REELS.derivative.reel);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [voiceOn, setVoiceOn] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastSpokenIdxRef = useRef<number>(-1);

  useEffect(() => {
    return subscribeRemoteCommand((cmd) => {
      if (reelMode !== 'ai_reel') return;
      if (cmd.type === 'toggle_play') {
        setIsPlaying((prev) => !prev);
      } else if (cmd.type === 'reset_view') {
        setSceneIdx(0);
        setSceneProgress(0);
        lastSpokenIdxRef.current = -1;
      } else if (cmd.type === 'slide_prev') {
        setSceneIdx((prev) => (prev - 1 + reel.scenes.length) % reel.scenes.length);
        setSceneProgress(0);
        lastSpokenIdxRef.current = -1;
      } else if (cmd.type === 'slide_next') {
        setSceneIdx((prev) => (prev + 1) % reel.scenes.length);
        setSceneProgress(0);
        lastSpokenIdxRef.current = -1;
      }
    });
  }, [reel.scenes.length, reelMode]);

  const activeScene = reel.scenes[sceneIdx] || reel.scenes[0];

  const generateMotionReel = async (topicOverride?: string) => {
    const clean = (topicOverride ?? prompt).trim();
    if (!clean || isGenerating) return;
    setIsGenerating(true);
    setErrorMsg(null);
    cancelActiveSpeech();
    lastSpokenIdxRef.current = -1;

    const res = await safeFetchJson<{ success?: boolean; reel?: MotionReelScript; error?: string }>(
      '/api/gemini/motion-reel',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: clean, subject, language })
      },
      22000
    );
    setIsGenerating(false);

    if (!res.ok || !res.data?.reel) {
      setErrorMsg(
        res.error ||
          (isEn
            ? 'Could not generate AI motion reel right now. You can preview the built-in reels above.'
            : 'Không thể tạo kịch bản Motion Reel AI lúc này. Bạn có thể xem các kịch bản mẫu bên trên.')
      );
      return;
    }

    setReel(res.data.reel);
    setSceneIdx(0);
    setSceneProgress(0);
    setIsPlaying(true);
    setPrompt('');
  };

  // Speak narration when entering new scene while playing
  useEffect(() => {
    if (!voiceOn || !isPlaying || !activeScene) return;
    if (lastSpokenIdxRef.current === sceneIdx) return;
    lastSpokenIdxRef.current = sceneIdx;
    speakCoPilotReply(activeScene.narration, language);
  }, [activeScene, isPlaying, language, sceneIdx, voiceOn]);

  useEffect(() => {
    return () => cancelActiveSpeech();
  }, []);

  // Animation loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dtSec = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (isPlaying && activeScene) {
        setSceneProgress((prev) => {
          const next = prev + dtSec / Math.max(3, activeScene.durationSec);
          if (next >= 1) {
            setSceneIdx((idx) => (idx + 1) % reel.scenes.length);
            return 0;
          }
          return next;
        });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [activeScene, isPlaying, reel.scenes.length]);

  // Draw canvas whenever scene/progress updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeScene) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawMotionSceneFrame(ctx, canvas.width, canvas.height, activeScene, sceneProgress, sceneIdx, reel.scenes.length);
  }, [activeScene, reel.scenes.length, sceneIdx, sceneProgress]);

  const handleExportWebM = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined' || typeof canvas.captureStream !== 'function') {
      setErrorMsg(
        isEn ? 'Browser does not support canvas WebM recording.' : 'Trình duyệt chưa hỗ trợ xuất video WebM.'
      );
      return;
    }
    setIsRecording(true);
    setSceneIdx(0);
    setSceneProgress(0);
    setIsPlaying(true);

    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) chunks.push(ev.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Synapse_3B1B_${Date.now()}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setIsRecording(false);
    };
    recorder.start();
    const recordDurationMs = Math.min(24000, reel.scenes.reduce((s, x) => s + x.durationSec * 1000, 0));
    setTimeout(() => {
      if (recorder.state !== 'inactive') recorder.stop();
    }, recordDurationMs);
  }, [isEn, reel.scenes]);

  const totalDurationLabel = useMemo(
    () => `${Math.round(reel.scenes.reduce((s, sc) => s + sc.durationSec, 0))}s`,
    [reel.scenes]
  );

  return (
    <div className="space-y-3">
      {/* Sub-mode switcher: AI 3B1B Reel vs Real Motion Video Tracker */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-md bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
        <button
          type="button"
          data-testid="synreel-tab-3b1b"
          onClick={() => setReelMode('ai_reel')}
          className={`px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            reelMode === 'ai_reel'
              ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{isEn ? '3B1B Vector Reel (AI)' : 'Video 3B1B AI'}</span>
        </button>
        <button
          type="button"
          data-testid="synreel-tab-tracker"
          onClick={() => {
            cancelActiveSpeech();
            setIsPlaying(false);
            setReelMode('video_tracker');
          }}
          className={`px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            reelMode === 'video_tracker'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {isEn ? 'Real Motion Video Tracker' : 'Phân tích Video Thí nghiệm'}
          </span>
        </button>
      </div>

      {reelMode === 'video_tracker' ? (
        <MotionVideoTracker language={language} />
      ) : (
        <>
      {/* Header + Built-in Quick Reels */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>SYN REEL MINI-CHAT · 3BLUE1BROWN VECTOR ENGINE</span>
          </div>
          <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white truncate">
            {reel.title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const next = !voiceOn;
              setVoiceOn(next);
              if (!next) cancelActiveSpeech();
              else lastSpokenIdxRef.current = -1;
            }}
            className={`px-2.5 py-1.5 rounded text-[11px] font-bold border flex items-center gap-1 cursor-pointer ${
              voiceOn
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            {voiceOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isEn ? 'Narration' : 'Thuyết minh'}</span>
          </button>
          <button
            type="button"
            onClick={handleExportWebM}
            disabled={isRecording}
            className="px-2.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            {isRecording ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isRecording ? (isEn ? 'Recording...' : 'Đang ghi...') : 'WebM'}</span>
          </button>
        </div>
      </div>

      {/* 16:9 Canvas Stage */}
      <div className="relative rounded-lg overflow-hidden border border-sky-500/40 bg-[#070b14] shadow-xl">
        <canvas ref={canvasRef} width={720} height={405} className="w-full h-auto block" />
      </div>

      {/* Transport & Scene Scrubber */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-2">
        <button
          type="button"
          onClick={() => setIsPlaying((v) => !v)}
          className="px-3 py-1.5 rounded bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Play' : 'Phát'}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setSceneIdx(0);
            setSceneProgress(0);
            lastSpokenIdxRef.current = -1;
          }}
          className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          title={isEn ? 'Restart reel' : 'Phát lại từ đầu'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {reel.scenes.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setSceneIdx(idx);
                setSceneProgress(0);
                lastSpokenIdxRef.current = -1;
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold whitespace-nowrap cursor-pointer border ${
                idx === sceneIdx
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {idx + 1}. {sc.title.replace(/^\d+\.\s*/, '').slice(0, 16)}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
          {totalDurationLabel}
        </span>
      </div>

      {/* Formula + Narration Transcript */}
      {activeScene && (
        <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="text-slate-700 dark:text-slate-200 leading-relaxed">{activeScene.narration}</div>
          {activeScene.formula && (
            <div className="p-2 rounded bg-slate-950 text-cyan-300 overflow-x-auto">
              <FormattedText text={`$$${activeScene.formula}$$`} />
            </div>
          )}
        </div>
      )}

      {/* Presets + AI Motion Generator Prompt */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRESET_REELS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                cancelActiveSpeech();
                lastSpokenIdxRef.current = -1;
                setReel(item.reel);
                setSceneIdx(0);
                setSceneProgress(0);
                setIsPlaying(true);
              }}
              className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-sky-400 text-[11px] font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {isEn ? item.labelEn : item.labelVi}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generateMotionReel();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isEn
                ? 'Type any Math/Physics topic to animate (e.g. "Taylor series", "Doppler shift")...'
                : 'Nhập bất kỳ chủ đề nào để dựng Motion Reel AI (vd: "Tích phân từng phần", "Sóng dừng")...'
            }
            className="flex-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="px-3.5 py-2 rounded-md bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isEn ? 'Create Reel' : 'Dựng Video AI'}</span>
          </button>
        </form>
      </div>
        </>
      )}
    </div>
  );
};
