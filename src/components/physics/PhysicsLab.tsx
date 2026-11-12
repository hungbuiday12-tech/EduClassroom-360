import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PHYSICS_LESSONS } from '../../data/physicsLessonsData';
import { PhysicsLesson, PhysicsSimType } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Gauge,
  Sparkles,
  ChevronRight,
  Award,
  Layers,
  GraduationCap,
  Copy,
  Check,
  Maximize2,
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MathFormula, FormattedText } from '../common/MathRenderer';
import { Physics3DView } from './Physics3DView';
import { useLanguage } from '../../context/LanguageContext';

interface PhysicsLabProps {
  onScoreEarned?: (xp: number) => void;
}

export const PhysicsLab: React.FC<PhysicsLabProps> = ({ onScoreEarned }) => {
  const { t, translate } = useLanguage();
  // Grade Filter: 'all' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12'
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    if (selectedGrade === 'all') return PHYSICS_LESSONS;
    return PHYSICS_LESSONS.filter((l) => l.grade === selectedGrade);
  }, [selectedGrade]);

  // Current selected lesson
  const [selectedLessonId, setSelectedLessonId] = useState<string>(PHYSICS_LESSONS[0].id);
  const lesson = useMemo(() => {
    return (
      PHYSICS_LESSONS.find((l) => l.id === selectedLessonId) ||
      filteredLessons[0] ||
      PHYSICS_LESSONS[0]
    );
  }, [selectedLessonId, filteredLessons]);

  // Active sub-tab: 'theory' | 'simulation' | 'sim3d' | 'practice'
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'sim3d' | 'practice'>('theory');

  // Simulation controls & params
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [params, setParams] = useState<Record<string, number>>(lesson.defaultParams);

  // Quiz / practice states: { [exerciseId]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Canvas ref & internal simulation physics clock
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Telemetry real-time values
  const [telemetry, setTelemetry] = useState<{
    metric1Label: string;
    metric1Val: string;
    metric2Label: string;
    metric2Val: string;
    metric3Label: string;
    metric3Val: string;
    note: string;
  }>({
    metric1Label: 'Điện áp (U)',
    metric1Val: '12.0 V',
    metric2Label: 'Dòng điện (I)',
    metric2Val: '0.60 A',
    metric3Label: 'Công suất (P)',
    metric3Val: '7.20 W',
    note: 'Định luật Ôm mạch kín: I = U / R'
  });

  // When lesson changes, reset params & time
  useEffect(() => {
    setParams(lesson.defaultParams);
    simTimeRef.current = 0;
    setIsRunning(true);
  }, [lesson]);

  // Copy formula helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(text);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Submit exercise answer
  const handleAnswer = (exId: string, optIndex: number, correctIdx: number) => {
    if (userAnswers[exId] !== undefined) return; // already answered
    setUserAnswers((prev) => ({ ...prev, [exId]: optIndex }));

    if (optIndex === correctIdx) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      if (onScoreEarned) onScoreEarned(25);
    }
  };

  // -------------------------------------------------------------
  // 60 FPS HTML5 Canvas Physics Engine
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== 'simulation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05) * simSpeed;
      lastTimestamp = now;

      if (isRunning) {
        simTimeRef.current += dt;
      }
      const t = simTimeRef.current;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      const isDark = document.documentElement.classList.contains('dark');

      // Clear Canvas Background
      ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle grid
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Render specialized 2D simulation
      switch (lesson.simulationType) {
        case 'ohm_circuit':
          drawOhmCircuit(ctx, w, h, t, isDark);
          break;
        case 'lens_optics':
          drawLensOptics(ctx, w, h, t, isDark);
          break;
        case 'projectile_motion':
          drawProjectile(ctx, w, h, t, isDark);
          break;
        case 'free_fall_energy':
          drawFreeFall(ctx, w, h, t, isDark);
          break;
        case 'light_refraction':
          drawRefraction(ctx, w, h, isDark);
          break;
        case 'magnetic_induction':
          drawInduction(ctx, w, h, t, isDark);
          break;
        case 'spring_pendulum':
          drawSpring(ctx, w, h, t, isDark);
          break;
        case 'simple_pendulum':
          drawPendulum(ctx, w, h, t, isDark);
          break;
        case 'wave_interference':
          drawWaveInterference(ctx, w, h, t, isDark);
          break;
        default:
          drawSpring(ctx, w, h, t, isDark);
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isRunning, simSpeed, lesson.simulationType, params, activeTab]);

  // 1. Ohm's Law Circuit (Lớp 9)
  const drawOhmCircuit = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const U = params.voltage || 12;
    const R1 = params.r1 || 10;
    const R2 = params.r2 || 10;
    const isParallel = (params.circuitType || 0) === 1;

    const R_eq = isParallel ? (R1 * R2) / (R1 + R2) : R1 + R2;
    const I = U / R_eq;
    const P = U * I;

    setTelemetry({
      metric1Label: 'Điện trở tương đương (Rtđ)',
      metric1Val: `${R_eq.toFixed(2)} Ω`,
      metric2Label: 'Cường độ dòng mạch chính (I)',
      metric2Val: `${I.toFixed(2)} A`,
      metric3Label: 'Công suất tiêu thụ (P)',
      metric3Val: `${P.toFixed(2)} W`,
      note: isParallel
        ? `Mạch song song: 1/Rtđ = 1/R1 + 1/R2. I1 = ${(U / R1).toFixed(2)}A, I2 = ${(U / R2).toFixed(2)}A`
        : `Mạch nối tiếp: Rtđ = R1 + R2. U1 = ${(I * R1).toFixed(1)}V, U2 = ${(I * R2).toFixed(1)}V`
    });

    const cx = w / 2;
    const cy = h / 2;
    const cw = Math.min(w * 0.7, 460);
    const ch = Math.min(h * 0.6, 260);

    const left = cx - cw / 2;
    const right = cx + cw / 2;
    const top = cy - ch / 2;
    const bottom = cy + ch / 2;

    // Draw Circuit Wire
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.rect(left, top, cw, ch);
    ctx.stroke();

    // Moving electrons (Current Animation)
    const electronCount = 20;
    const perimeter = 2 * (cw + ch);
    const speedPix = I * 70;
    const electronOffset = (t * speedPix) % perimeter;

    ctx.fillStyle = '#facc15';
    for (let i = 0; i < electronCount; i++) {
      let d = (electronOffset + (i * perimeter) / electronCount) % perimeter;
      let ex = left;
      let ey = top;

      if (d < cw) {
        // top wire (left -> right)
        ex = left + d;
        ey = top;
      } else if (d < cw + ch) {
        // right wire (top -> bottom)
        ex = right;
        ey = top + (d - cw);
      } else if (d < 2 * cw + ch) {
        // bottom wire (right -> left)
        ex = right - (d - cw - ch);
        ey = bottom;
      } else {
        // left wire (bottom -> top)
        ex = left;
        ey = bottom - (d - 2 * cw - ch);
      }

      ctx.beginPath();
      ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // DC Battery on Top Wire
    const batW = 50;
    ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
    ctx.fillRect(cx - batW / 2, top - 15, batW, 30);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, top - 15);
    ctx.lineTo(cx - 10, top + 15);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 8, top - 9);
    ctx.lineTo(cx + 8, top + 9);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`+ Nguồn U = ${U}V -`, cx, top - 24);

    // Resistors on Bottom Wire
    if (!isParallel) {
      // Series: 2 Resistors side-by-side
      const drawResistorBox = (rx: number, ry: number, label: string, rVal: number) => {
        ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.fillRect(rx - 35, ry - 14, 70, 28);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx - 35, ry - 14, 70, 28);

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = '11px monospace';
        ctx.fillText(`${label}: ${rVal}Ω`, rx, ry + 4);
      };

      drawResistorBox(cx - 70, bottom, 'R1', R1);
      drawResistorBox(cx + 70, bottom, 'R2', R2);
    } else {
      // Parallel: Branching
      const drawResistorBox = (rx: number, ry: number, label: string, rVal: number) => {
        ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
        ctx.fillRect(rx - 30, ry - 12, 60, 24);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(rx - 30, ry - 12, 60, 24);

        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.font = '10px monospace';
        ctx.fillText(`${label}=${rVal}Ω`, rx, ry + 3);
      };

      ctx.beginPath();
      ctx.moveTo(cx - 80, bottom);
      ctx.lineTo(cx - 80, bottom - 30);
      ctx.lineTo(cx + 80, bottom - 30);
      ctx.lineTo(cx + 80, bottom);
      ctx.stroke();

      drawResistorBox(cx, bottom, 'R1', R1);
      drawResistorBox(cx, bottom - 30, 'R2', R2);
    }

    // Ammeter on Right Wire
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.beginPath();
    ctx.arc(right, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('A', right, cy + 5);

    // Glowing Lamp on Left Wire
    const glowRadius = Math.min(30 + P * 2, 65);
    const lampGrad = ctx.createRadialGradient(left, cy, 5, left, cy, glowRadius);
    lampGrad.addColorStop(0, 'rgba(250, 204, 21, 0.9)');
    lampGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.arc(left, cy, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Lamp Bulb Icon
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(left, cy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Đèn', left, cy + 4);
  };

  // 2. Converging / Diverging Lens (Lớp 9)
  const drawLensOptics = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    _t: number,
    isDark: boolean
  ) => {
    const f = params.focalLength || 20; // cm
    const d = params.objectDistance || 35; // cm
    const hObj = params.objectHeight || 8; // cm

    // Lens formula: 1/f = 1/d + 1/d' => d' = d*f / (d - f)
    const isAtFocal = Math.abs(d - f) < 0.1;
    const dPrime = isAtFocal ? 999999 : (d * f) / (d - f);
    const k = isAtFocal ? 0 : -dPrime / d;
    const hPrime = isAtFocal ? 0 : k * hObj;

    setTelemetry({
      metric1Label: 'Vị trí ảnh (d\')',
      metric1Val: isAtFocal ? 'Vô cực (∞)' : `${dPrime.toFixed(1)} cm`,
      metric2Label: 'Số phóng đại (k)',
      metric2Val: isAtFocal ? '∞' : `${k.toFixed(2)}x`,
      metric3Label: 'Chiều cao ảnh (A\'B\')',
      metric3Val: isAtFocal ? '∞' : `${Math.abs(hPrime).toFixed(1)} cm`,
      note:
        dPrime > 0
          ? 'Ảnh thật, ngược chiều, hứng được trên màn chắn phía sau thấu kính.'
          : 'Ảnh ảo, cùng chiều với vật, quan sát trực tiếp qua thấu kính.'
    });

    const scale = 5.5; // pixel per cm
    const cx = w / 2;
    const cy = h / 2;

    // Principal Axis (Trục chính)
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, cy);
    ctx.lineTo(w - 30, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lens at Center
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 130);
    ctx.lineTo(cx, cy + 130);
    ctx.stroke();

    // Arrows at Lens ends (Converging)
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 120);
    ctx.lineTo(cx, cy - 134);
    ctx.lineTo(cx + 8, cy - 120);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 120);
    ctx.lineTo(cx, cy + 134);
    ctx.lineTo(cx + 8, cy + 120);
    ctx.fill();

    // Optical Center O & Foci F, F'
    const fPix = f * scale;
    const Fx = cx - fPix;
    const FPrimeX = cx + fPix;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(Fx, cy, 4, 0, Math.PI * 2);
    ctx.arc(FPrimeX, cy, 4, 0, Math.PI * 2);
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('O', cx + 6, cy + 14);
    ctx.fillText('F', Fx - 4, cy + 16);
    ctx.fillText("F'", FPrimeX - 4, cy + 16);

    // Object AB
    const objX = cx - d * scale;
    const objY = cy - hObj * scale;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, objY);
    ctx.stroke();

    // Object Arrow Head
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(objX - 6, objY + 8);
    ctx.lineTo(objX, objY - 2);
    ctx.lineTo(objX + 6, objY + 8);
    ctx.fill();
    ctx.fillText('B (Vật)', objX - 10, objY - 8);
    ctx.fillText('A', objX - 6, cy + 14);

    // Image A'B'
    if (!isAtFocal && Math.abs(dPrime) < 150) {
      const imgX = cx + dPrime * scale;
      const imgY = cy - hPrime * scale;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      if (dPrime < 0) ctx.setLineDash([5, 3]); // virtual image dashed
      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head for Image
      const arrowDir = hPrime < 0 ? 1 : -1;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(imgX - 5, imgY - arrowDir * 6);
      ctx.lineTo(imgX, imgY + arrowDir * 2);
      ctx.lineTo(imgX + 5, imgY - arrowDir * 6);
      ctx.fill();
      ctx.fillText(dPrime > 0 ? "B' (Ảnh thật)" : "B' (Ảnh ảo)", imgX - 10, imgY + (hPrime < 0 ? 16 : -8));

      // Light Rays
      // Ray 1: Parallel to axis -> refracted through F'
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(cx, objY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();

      // Ray 2: Through Optical Center O straight
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
    }
  };

  // 3. Projectile Motion (Lớp 10)
  const drawProjectile = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const v0 = params.v0 || 25; // m/s
    const alphaDeg = params.angle || 45; // deg
    const alphaRad = (alphaDeg * Math.PI) / 180;
    const g = params.gravity || 9.8;
    const h0 = params.h0 || 10; // m

    const v0x = v0 * Math.cos(alphaRad);
    const v0y = v0 * Math.sin(alphaRad);

    // Total flight time: y = h0 + v0y*t - 0.5*g*t^2 = 0
    const delta = v0y * v0y + 2 * g * h0;
    const tTotal = (v0y + Math.sqrt(delta)) / g;
    const maxRange = v0x * tTotal;
    const tMaxH = v0y / g;
    const maxH = h0 + (v0y * v0y) / (2 * g);

    // Current projectile time (looping)
    const curT = t % (tTotal + 1.2);
    const inFlight = curT <= tTotal;

    const curX = inFlight ? v0x * curT : maxRange;
    const curY = inFlight ? h0 + v0y * curT - 0.5 * g * curT * curT : 0;
    const curVx = inFlight ? v0x : 0;
    const curVy = inFlight ? v0y - g * curT : 0;
    const curV = Math.sqrt(curVx * curVx + curVy * curVy);

    setTelemetry({
      metric1Label: 'Tầm xa tối đa (L)',
      metric1Val: `${maxRange.toFixed(1)} m`,
      metric2Label: 'Độ cao cực đại (Hmax)',
      metric2Val: `${maxH.toFixed(1)} m`,
      metric3Label: 'Vận tốc tức thời (v)',
      metric3Val: `${curV.toFixed(1)} m/s`,
      note: `Thời gian bay: t = ${curT.toFixed(2)}s / ${tTotal.toFixed(2)}s | vx = ${curVx.toFixed(1)} m/s, vy = ${curVy.toFixed(1)} m/s`
    });

    const groundY = h - 60;
    const scaleX = (w - 140) / (maxRange * 1.15 || 100);
    const scaleY = (h - 140) / (maxH * 1.25 || 100);
    const originX = 60;

    // Ground
    ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
    ctx.fillRect(0, groundY, w, 60);
    ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Launch cliff/hill (h0)
    const hillW = originX - 10;
    const hillTopY = groundY - h0 * scaleY;
    ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
    ctx.fillRect(0, hillTopY, hillW, groundY - hillTopY);

    // Parabolic trajectory path
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const stepT = (i / steps) * tTotal;
      const px = originX + v0x * stepT * scaleX;
      const py = groundY - (h0 + v0y * stepT - 0.5 * g * stepT * stepT) * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Projectile Ball
    const ballPx = originX + curX * scaleX;
    const ballPy = groundY - Math.max(curY, 0) * scaleY;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(ballPx, ballPy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fee2e2';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity Vector
    if (inFlight) {
      const vecScale = 1.2;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ballPx, ballPy);
      ctx.lineTo(ballPx + curVx * vecScale, ballPy - curVy * vecScale);
      ctx.stroke();
    }
  };

  // 4. Free Fall & Mechanical Energy (Lớp 10)
  const drawFreeFall = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const H = params.dropHeight || 20; // m
    const m = params.mass || 1.0; // kg
    const g = params.gravity || 9.8;

    const tTotal = Math.sqrt((2 * H) / g);
    const curT = t % (tTotal + 1.0);
    const inDrop = curT <= tTotal;

    const curY = inDrop ? H - 0.5 * g * curT * curT : 0;
    const curV = inDrop ? g * curT : Math.sqrt(2 * g * H);

    const Ep = m * g * curY;
    const Ek = 0.5 * m * curV * curV;
    const ETotal = m * g * H;

    setTelemetry({
      metric1Label: 'Thế năng hấp dẫn (Wt)',
      metric1Val: `${Ep.toFixed(1)} J`,
      metric2Label: 'Động năng (Wđ)',
      metric2Val: `${Ek.toFixed(1)} J`,
      metric3Label: 'Cơ năng toàn phần (W)',
      metric3Val: `${ETotal.toFixed(1)} J`,
      note: `Bảo toàn cơ năng: W = Wđ + Wt = const. Vận tốc chạm đất: v = ${(Math.sqrt(2 * g * H)).toFixed(1)} m/s`
    });

    const groundY = h - 60;
    const topY = 60;
    const dropScale = (groundY - topY) / H;
    const ballX = w * 0.35;
    const ballY = topY + (H - curY) * dropScale;

    // Ground
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(0, groundY, w, 60);

    // Height Ruler
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballX - 40, topY);
    ctx.lineTo(ballX - 40, groundY);
    ctx.stroke();

    for (let meter = 0; meter <= H; meter += Math.max(2, Math.floor(H / 5))) {
      const markY = groundY - meter * dropScale;
      ctx.beginPath();
      ctx.moveTo(ballX - 48, markY);
      ctx.lineTo(ballX - 40, markY);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '10px monospace';
      ctx.fillText(`${meter}m`, ballX - 70, markY + 4);
    }

    // Falling Ball
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Energy Bar Chart on Right side
    const barX = w * 0.65;
    const barW = 80;
    const barMaxH = 180;
    const barY = groundY - barMaxH;

    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(barX, barY, barW, barMaxH);

    // Ep block (Bottom)
    const epHeight = (Ep / ETotal) * barMaxH;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX, groundY - epHeight, barW, epHeight);

    // Ek block (Top)
    const ekHeight = (Ek / ETotal) * barMaxH;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(barX, groundY - epHeight - ekHeight, barW, ekHeight);

    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Biểu đồ Năng lượng', barX + barW / 2, barY - 12);
    ctx.fillText(`Wt: ${Ep.toFixed(0)}J`, barX + barW / 2, groundY - epHeight / 2 + 4);
    if (ekHeight > 16) {
      ctx.fillText(`Wđ: ${Ek.toFixed(0)}J`, barX + barW / 2, groundY - epHeight - ekHeight / 2 + 4);
    }
  };

  // 5. Light Refraction & Total Internal Reflection (Lớp 11)
  const drawRefraction = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    isDark: boolean
  ) => {
    const n1 = params.n1 || 1.33; // Môi trường tới (ví dụ: nước/thủy tinh)
    const n2 = params.n2 || 1.0; // Môi trường khúc xạ (ví dụ: không khí)
    const iDeg = params.angle || 30; // Góc tới
    const iRad = (iDeg * Math.PI) / 180;

    const sinI = Math.sin(iRad);
    const sinR = (n1 / n2) * sinI;
    const isTIR = sinR > 1.0; // Hiện tượng phản xạ toàn phần
    const rRad = isTIR ? 0 : Math.asin(sinR);
    const rDeg = isTIR ? 0 : (rRad * 180) / Math.PI;

    // Critical angle
    const sinIgh = n1 > n2 ? n2 / n1 : 1.0;
    const ighDeg = n1 > n2 ? (Math.asin(sinIgh) * 180) / Math.PI : 90;

    setTelemetry({
      metric1Label: 'Góc tới hạn (igh)',
      metric1Val: n1 > n2 ? `${ighDeg.toFixed(1)}°` : 'Không có (n1 ≤ n2)',
      metric2Label: 'Góc khúc xạ (r)',
      metric2Val: isTIR ? 'Phản xạ toàn phần' : `${rDeg.toFixed(1)}°`,
      metric3Label: 'Trạng thái',
      metric3Val: isTIR ? '100% Tia phản xạ' : 'Khúc xạ + Phản xạ 1 phần',
      note: isTIR
        ? `Tia sáng bị phản xạ toàn phần trở lại môi trường 1 vì i (${iDeg}°) > igh (${ighDeg.toFixed(1)}°)`
        : `Định luật Snellius: ${n1.toFixed(2)} · sin(${iDeg}°) = ${n2.toFixed(2)} · sin(${rDeg.toFixed(1)}°)`
    });

    const midY = h / 2;
    const midX = w / 2;
    const beamLen = 160;

    // Interface
    ctx.fillStyle = isDark ? '#1e293b' : '#e0f2fe';
    ctx.fillRect(0, 0, w, midY); // Top (Medium 1)
    ctx.fillStyle = isDark ? '#0f172a' : '#f0fdf4';
    ctx.fillRect(0, midY, w, h - midY); // Bottom (Medium 2)

    // Interface boundary
    ctx.strokeStyle = isDark ? '#64748b' : '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Normal line (Pháp tuyến N-N')
    ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Medium Labels
    ctx.fillStyle = isDark ? '#93c5fd' : '#0369a1';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Môi trường 1 (n₁ = ${n1})`, 20, 30);
    ctx.fillText(`Môi trường 2 (n₂ = ${n2})`, 20, midY + 30);

    // Incident Ray (Tia tới)
    const incStartX = midX - beamLen * Math.sin(iRad);
    const incStartY = midY - beamLen * Math.cos(iRad);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(incStartX, incStartY);
    ctx.lineTo(midX, midY);
    ctx.stroke();

    // Reflected Ray (Tia phản xạ)
    const refEndX = midX + beamLen * Math.sin(iRad);
    const refEndY = midY - beamLen * Math.cos(iRad);

    ctx.strokeStyle = isTIR ? '#ef4444' : 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = isTIR ? 3.5 : 2;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(refEndX, refEndY);
    ctx.stroke();

    // Refracted Ray (Tia khúc xạ)
    if (!isTIR) {
      const refrEndX = midX + beamLen * Math.sin(rRad);
      const refrEndY = midY + beamLen * Math.cos(rRad);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(refrEndX, refrEndY);
      ctx.stroke();
    }
  };

  // 6. Magnetic Induction (Lớp 11)
  const drawInduction = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const N = params.turns || 200; // Số vòng dây
    const B0 = params.bField || 0.5; // Tesla
    const speed = params.magnetSpeed || 1.0;

    // Magnet oscillating into coil
    const magnetPos = Math.sin(t * speed * 2.5); // -1 to 1
    const flux = B0 * N * 0.01 * (1 + 0.8 * magnetPos);
    const dFluxDt = B0 * N * 0.01 * 0.8 * Math.cos(t * speed * 2.5) * speed * 2.5;
    const eC = -dFluxDt; // Suất điện động cảm ứng

    setTelemetry({
      metric1Label: 'Từ thông qua ống dây (Φ)',
      metric1Val: `${(flux * 1000).toFixed(1)} mWb`,
      metric2Label: 'Suất điện động cảm ứng (ec)',
      metric2Val: `${eC.toFixed(2)} V`,
      metric3Label: 'Dòng điện cảm ứng (ic)',
      metric3Val: `${(eC * 10).toFixed(1)} mA`,
      note:
        eC > 0
          ? 'Từ thông giảm -> Dòng điện cảm ứng sinh từ trường cùng chiều chống lại sự giảm.'
          : 'Từ thông tăng -> Dòng điện cảm ứng sinh từ trường ngược chiều chống lại sự tăng (Định luật Len-xơ).'
    });

    const midX = w / 2;
    const midY = h / 2;

    // Solenoid Coil (Ống dây)
    const coilW = 140;
    const coilH = 70;
    ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
    ctx.fillRect(midX - coilW / 2, midY - coilH / 2, coilW, coilH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;

    // Draw coil loops
    const loops = 8;
    for (let i = 0; i < loops; i++) {
      const lx = midX - coilW / 2 + (i * coilW) / (loops - 1);
      ctx.beginPath();
      ctx.ellipse(lx, midY, 6, coilH / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Permanent Bar Magnet (Nam châm thanh)
    const magX = midX - 160 + magnetPos * 50;
    const magY = midY;
    const magW = 80;
    const magH = 36;

    // North Pole (Red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(magX + magW / 2, magY - magH / 2, magW / 2, magH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('N', magX + (3 * magW) / 4 - 4, magY + 4);

    // South Pole (Blue)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(magX, magY - magH / 2, magW / 2, magH);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('S', magX + magW / 4 - 4, magY + 4);

    // Galvanometer (Điện kế G)
    const galX = midX;
    const galY = midY + 90;
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.beginPath();
    ctx.arc(galX, galY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Needle deflected by eC
    const needleAngle = -Math.PI / 2 + eC * 0.4;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(galX, galY);
    ctx.lineTo(galX + 18 * Math.cos(needleAngle), galY + 18 * Math.sin(needleAngle));
    ctx.stroke();
  };

  // 7. Spring Pendulum (Lớp 12)
  const drawSpring = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const m = params.mass || 0.5;
    const k = params.stiffness || 50;
    const A = params.amplitude || 0.15;
    const gamma = params.damping || 0.02;

    const omega0 = Math.sqrt(k / m);
    const env = Math.exp(-gamma * t);
    const x = A * env * Math.cos(omega0 * t);
    const v = -A * omega0 * env * Math.sin(omega0 * t);
    const a = -omega0 * omega0 * x;

    const Ek = 0.5 * m * v * v;
    const Ep = 0.5 * k * x * x;
    const ETotal = Ek + Ep;

    setTelemetry({
      metric1Label: 'Li độ (x)',
      metric1Val: `${(x * 100).toFixed(1)} cm`,
      metric2Label: 'Vận tốc (v)',
      metric2Val: `${(v * 100).toFixed(1)} cm/s`,
      metric3Label: 'Cơ năng (W)',
      metric3Val: `${ETotal.toFixed(3)} J`,
      note: `Tần số góc: ω = ${omega0.toFixed(2)} rad/s | Chu kỳ: T = ${(2 * Math.PI / omega0).toFixed(2)}s`
    });

    const midY = h / 2;
    const anchorX = 60;
    const eqX = w / 2;
    const scale = 500;
    const massX = eqX + x * scale;

    // Anchor Wall
    ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
    ctx.fillRect(anchorX - 15, midY - 60, 15, 120);

    // Spring Coils
    ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(anchorX, midY);
    const coils = 16;
    const coilW = (massX - anchorX - 25) / coils;
    for (let i = 0; i < coils; i++) {
      const cx_pt = anchorX + i * coilW;
      const cy_pt = midY + (i % 2 === 0 ? -14 : 14);
      ctx.lineTo(cx_pt, cy_pt);
    }
    ctx.lineTo(massX - 25, midY);
    ctx.stroke();

    // Mass Block
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(massX - 25, midY - 25, 50, 50);
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 2;
    ctx.strokeRect(massX - 25, midY - 25, 50, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${m}kg`, massX, midY + 4);
  };

  // 8. Simple Pendulum (Lớp 12)
  const drawPendulum = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const l = params.length || 1.0;
    const g = params.gravity || 9.8;
    const theta0Deg = params.angle0 || 20;
    const theta0Rad = (theta0Deg * Math.PI) / 180;
    const omega = Math.sqrt(g / l);

    const theta = theta0Rad * Math.cos(omega * t);
    const v = -omega * l * theta0Rad * Math.sin(omega * t);

    setTelemetry({
      metric1Label: 'Góc lệch (α)',
      metric1Val: `${((theta * 180) / Math.PI).toFixed(1)}°`,
      metric2Label: 'Vận tốc tiếp tuyến (v)',
      metric2Val: `${v.toFixed(2)} m/s`,
      metric3Label: 'Chu kỳ dao động (T)',
      metric3Val: `${((2 * Math.PI) / omega).toFixed(2)} s`,
      note: `Công thức dao động nhỏ: T = 2π√(l/g). Lực căng cực đại tại VTCB: Tmax = mg(3 - 2cosα₀)`
    });

    const pivotX = w / 2;
    const pivotY = 50;
    const lengthPix = Math.min(h * 0.65, l * 180);

    const bobX = pivotX + lengthPix * Math.sin(theta);
    const bobY = pivotY + lengthPix * Math.cos(theta);

    // Pivot
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
    ctx.fill();

    // String
    ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbcfe8';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // 9. Wave Interference (Lớp 12)
  const drawWaveInterference = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const lambda = params.wavelength || 40;
    const d = params.sourceDistance || 180;
    const omega = 4.0;

    setTelemetry({
      metric1Label: 'Bước sóng (λ)',
      metric1Val: `${lambda} px`,
      metric2Label: 'Khoảng cách nguồn (S1S2)',
      metric2Val: `${d} px`,
      metric3Label: 'Số cực đại giao thoa',
      metric3Val: `${2 * Math.floor(d / lambda) + 1}`,
      note: 'Điều kiện cực đại: d2 - d1 = k·λ. Điều kiện cực tiểu: d2 - d1 = (k + 0.5)·λ'
    });

    const midY = h / 2;
    const s1X = w / 2 - d / 2;
    const s2X = w / 2 + d / 2;

    // Draw interference ripples
    const maxR = Math.min(w, h) * 0.7;
    ctx.lineWidth = 1.5;

    for (let r = (t * 20) % lambda; r < maxR; r += lambda) {
      // Source 1
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.25)';
      ctx.beginPath();
      ctx.arc(s1X, midY, r, 0, Math.PI * 2);
      ctx.stroke();

      // Source 2
      ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(219, 39, 119, 0.25)';
      ctx.beginPath();
      ctx.arc(s2X, midY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Source 1 point
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(s1X, midY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('S1', s1X - 8, midY - 12);

    // Source 2 point
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.arc(s2X, midY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('S2', s2X - 8, midY - 12);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Vật Lý 9 - 12 Chuyên Sâu
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Mô phỏng 2D 60 FPS + Lý thuyết + Lời giải
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Phòng Lab Vật Lý Tương Tác 2D (Lớp 9 - 12)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Mỗi bài học tích hợp đầy đủ: Bài giảng trọng tâm, Thí nghiệm đồ họa thời gian thực và Hệ thống bài tập củng cố có lời giải chi tiết.
          </p>
        </div>

        {/* Grade Filter Bar */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          {['all', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedGrade === grade
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
              }`}
            >
              {grade === 'all'
                ? t('grade.all', `Tất cả (${PHYSICS_LESSONS.length} bài)`, `All (${PHYSICS_LESSONS.length} lessons)`)
                : t(grade, grade)}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredLessons.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLessonId(l.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              lesson.id === l.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-semibold'
                : 'bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                lesson.id === l.id
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
              }`}
            >
              {t(l.grade, l.grade)}
            </span>
            <span>{translate(l.title.split(':')[0])}</span>
          </button>
        ))}
      </div>

      {/* Active Lesson Header & Tab Switcher */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {t(lesson.grade, lesson.grade)} • {t('lesson.num', 'Bài', 'Lesson')} {lesson.lessonNumber}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {translate(lesson.subtitle)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {translate(lesson.title)}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {translate(lesson.description)}
            </p>
          </div>

          {/* 4 Main Action Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'theory'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('sim.theory', '1. Bài Giảng Lý Thuyết', '1. Theory Lectures')}</span>
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulation'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t('sim.2d', '2. Phòng Lab 2D Động', '2. Dynamic 2D Lab')}</span>
            </button>
            <button
              onClick={() => setActiveTab('sim3d')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'sim3d'
                  ? 'bg-amber-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{t('sim.3d', '3. Mô Phỏng 3D Three.js', '3. Three.js 3D Sim')}</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'practice'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('sim.practice', '4. Bài Tập & Lời Giải', '4. Exercises & Solutions')}</span>
            </button>
          </div>
        </div>

        {/* Key Formulas Pills with KaTeX */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Công thức then chốt:
          </span>
          {lesson.keyFormulas.map((kf, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-mono rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
            >
              <MathFormula formula={kf} />
            </span>
          ))}
        </div>
      </div>

      {/* VIEW 1: THEORY LECTURE */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lesson.theorySections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {sec.heading}
                  </h3>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  <FormattedText text={sec.content} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() => setActiveTab('simulation')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
            >
              <span>Vào Thí Nghiệm Mô Phỏng 2D</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('sim3d')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-all shadow-md shadow-amber-500/20"
            >
              <Box className="w-4 h-4" />
              <span>Khám Phá Mô Phỏng 3D Three.js</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3D: THREE.JS 3D PHYSICS SIMULATION */}
      {activeTab === 'sim3d' && (
        <div className="space-y-4">
          <Physics3DView />
        </div>
      )}

      {/* VIEW 2: 2D INTERACTIVE SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Main Stage (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
              {/* Canvas Action Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isRunning
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isRunning ? 'Tạm dừng' : 'Chạy tiếp'}</span>
                  </button>

                  <button
                    onClick={() => {
                      simTimeRef.current = 0;
                      setParams(lesson.defaultParams);
                      setIsRunning(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                    title="Đặt lại trạng thái ban đầu"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 ml-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Tốc độ:</span>
                    {[0.5, 1.0, 2.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setSimSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          simSpeed === spd
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>60 FPS Live Physics</span>
                </div>
              </div>

              {/* HTML5 Canvas */}
              <div className="relative w-full h-[380px] bg-slate-950">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* Real-time Telemetry Dashboard */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {telemetry.metric1Label}
                  </div>
                  <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                    {telemetry.metric1Val}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {telemetry.metric2Label}
                  </div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {telemetry.metric2Val}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {telemetry.metric3Label}
                  </div>
                  <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                    {telemetry.metric3Val}
                  </div>
                </div>
              </div>

              {/* Physical Note / Law explanation */}
              <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-t border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                <span>{telemetry.note}</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Slider Box (1 col) */}
          <div className="space-y-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Thông Số Thí Nghiệm
                  </h3>
                </div>
                <button
                  onClick={() => setParams(lesson.defaultParams)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Mặc định
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(lesson.paramBounds).map(([paramKey, bound]) => {
                  const curVal = params[paramKey] ?? bound.min;
                  return (
                    <div key={paramKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {bound.label}
                        </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {curVal} {bound.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={bound.min}
                        max={bound.max}
                        step={bound.step}
                        value={curVal}
                        onChange={(e) =>
                          setParams((prev) => ({
                            ...prev,
                            [paramKey]: parseFloat(e.target.value)
                          }))
                        }
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>
                          {bound.min} {bound.unit}
                        </span>
                        <span>
                          {bound.max} {bound.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  onClick={() => setActiveTab('practice')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Làm Bài Tập Củng Cố Ngay (+25 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: PRACTICE EXERCISES WITH STEP-BY-STEP SOLUTIONS */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bài Tập Củng Cố & Lời Giải Chi Tiết
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Thử sức với các câu hỏi vận dụng thực tế. Mỗi câu đúng nhận ngay +25 XP!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {lesson.practiceExercises.map((ex, exIdx) => {
              const exKey = `${lesson.id}-ex-${exIdx}`;
              const selectedOpt = userAnswers[exKey];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === ex.correctIndex;
              const isRevealed = revealedSolutions[exKey] || isAnswered;

              return (
                <div
                  key={exKey}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                        Câu {exIdx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {ex.question}
                      </h4>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ex.options.map((opt, optIdx) => {
                      let btnStyle =
                        'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';

                      if (isAnswered) {
                        if (optIdx === ex.correctIndex) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                        } else if (optIdx === selectedOpt) {
                          btnStyle =
                            'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 line-through';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleAnswer(exKey, optIdx, ex.correctIndex)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === ex.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                          )}
                          {isAnswered && optIdx === selectedOpt && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Solution Accordion */}
                  <div className="pt-2">
                    <button
                      onClick={() =>
                        setRevealedSolutions((prev) => ({
                          ...prev,
                          [exKey]: !prev[exKey]
                        }))
                      }
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>
                        {revealedSolutions[exKey]
                          ? 'Ẩn lời giải chi tiết'
                          : 'Xem lời giải chi tiết & Phân tích đáp án'}
                      </span>
                    </button>

                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Đáp án đúng: {ex.options[ex.correctIndex]}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {ex.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
