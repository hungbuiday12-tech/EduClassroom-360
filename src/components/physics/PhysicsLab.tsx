import React, { useState, useRef, useEffect } from 'react';
import { PHYSICS_EXPERIMENTS } from '../../data/curriculumData';
import { PhysicsExperiment, PhysicsSimType } from '../../types';
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
  Gauge
} from 'lucide-react';

export const PhysicsLab: React.FC = () => {
  const [selectedExpId, setSelectedExpId] = useState<PhysicsSimType>('spring_pendulum');
  const exp = PHYSICS_EXPERIMENTS.find((e) => e.id === selectedExpId) || PHYSICS_EXPERIMENTS[0];

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [params, setParams] = useState<Record<string, number>>(exp.defaultParams);

  // Active sub-tab: 'simulation' or 'theory'
  const [viewMode, setViewMode] = useState<'simulation' | 'theory'>('simulation');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});

  // Canvas ref & internal simulation physics clock
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Wave history buffer for oscillator graphs
  const xHistoryRef = useRef<number[]>([]);

  // Telemetry real-time values
  const [telemetry, setTelemetry] = useState<{
    t: number;
    pos: number;
    vel: number;
    acc: number;
    ek: number;
    ep: number;
    extra?: string;
  }>({ t: 0, pos: 0, vel: 0, acc: 0, ek: 0, ep: 0 });

  // Reset params on experiment switch
  useEffect(() => {
    setParams(exp.defaultParams);
    simTimeRef.current = 0;
    xHistoryRef.current = [];
    setIsRunning(true);
  }, [selectedExpId, exp]);

  // Main 2D Canvas Physics Loop
  useEffect(() => {
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
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      const isDark = document.documentElement.classList.contains('dark');

      // Clear Canvas
      ctx.fillStyle = isDark ? '#090d16' : '#ffffff';
      ctx.fillRect(0, 0, w, h);

      // Branch simulation type
      if (selectedExpId === 'spring_pendulum') {
        renderSpringPendulum(ctx, w, h, t, isDark);
      } else if (selectedExpId === 'simple_pendulum') {
        renderSimplePendulum(ctx, w, h, t, isDark);
      } else if (selectedExpId === 'light_refraction') {
        renderLightRefraction(ctx, w, h, isDark);
      } else if (selectedExpId === 'projectile_motion') {
        renderProjectileMotion(ctx, w, h, t, isDark);
      } else if (selectedExpId === 'wave_interference') {
        renderWaveInterference(ctx, w, h, t, isDark);
      }

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isRunning, simSpeed, selectedExpId, params]);

  // 1. Spring Pendulum Renderer
  const renderSpringPendulum = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const m = params.mass || 0.5;
    const k = params.stiffness || 50;
    const A = params.amplitude || 0.15;
    const gamma = params.damping || 0;

    const omega0 = Math.sqrt(k / m);
    // Damped or undamped harmonic motion
    const envelope = Math.exp(-gamma * 1.5 * t);
    const x = A * envelope * Math.cos(omega0 * t);
    const v = -A * omega0 * envelope * Math.sin(omega0 * t);
    const a = -Math.pow(omega0, 2) * x;

    const Ek = 0.5 * m * v * v;
    const Ep = 0.5 * k * x * x;
    const ETotal = Ek + Ep;

    setTelemetry({
      t,
      pos: x,
      vel: v,
      acc: a,
      ek: Ek,
      ep: Ep,
      extra: `T = ${(2 * Math.PI / omega0).toFixed(2)}s | ω = ${omega0.toFixed(2)} rad/s`
    });

    // Drawing Spring on Left / Middle
    const wallX = 60;
    const centerY = h * 0.4;
    const scalePx = 500; // 500 px per 1 meter
    const restLen = 140;
    const blockX = wallX + restLen + x * scalePx;
    const blockSize = 48;

    // Draw fixed wall & track
    ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.fillRect(wallX - 12, centerY - 60, 12, 120);

    // Wall hatching
    ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
    ctx.lineWidth = 1.5;
    for (let y = centerY - 55; y <= centerY + 55; y += 12) {
      ctx.beginPath();
      ctx.moveTo(wallX - 12, y);
      ctx.lineTo(wallX - 22, y + 10);
      ctx.stroke();
    }

    // Horizontal track line
    ctx.strokeStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wallX, centerY + blockSize / 2 + 1);
    ctx.lineTo(w - 40, centerY + blockSize / 2 + 1);
    ctx.stroke();

    // Equilibrium marker (O)
    const eqX = wallX + restLen;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(eqX, centerY - 50);
    ctx.lineTo(eqX, centerY + 50);
    ctx.stroke();
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('O (VTCB)', eqX - 22, centerY + 65);
    ctx.restore();

    // Draw Spring Coils
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(wallX, centerY);

    const coils = 14;
    const springLen = blockX - wallX;
    const coilStep = springLen / (coils + 2);

    ctx.lineTo(wallX + coilStep, centerY);
    for (let i = 1; i <= coils; i++) {
      const cx = wallX + coilStep + (i - 0.5) * (springLen - 2 * coilStep) / coils;
      const cy = centerY + (i % 2 === 0 ? 18 : -18);
      ctx.lineTo(cx, cy);
    }
    ctx.lineTo(blockX, centerY);
    ctx.stroke();

    // Draw Mass Block
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(blockX, centerY - blockSize / 2, blockSize, blockSize);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.strokeRect(blockX, centerY - blockSize / 2, blockSize, blockSize);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`${m}kg`, blockX + 8, centerY + 4);

    // Vector Force F & Velocity v arrows
    const vecScale = 1.2;
    // Velocity vector (Green)
    if (Math.abs(v) > 0.02) {
      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.lineWidth = 2.5;
      const vLen = v * 80;
      ctx.beginPath();
      ctx.moveTo(blockX + blockSize / 2, centerY - blockSize / 2 - 12);
      ctx.lineTo(blockX + blockSize / 2 + vLen, centerY - blockSize / 2 - 12);
      ctx.stroke();
      ctx.fillText('v', blockX + blockSize / 2 + vLen + (vLen > 0 ? 4 : -12), centerY - blockSize / 2 - 8);
    }

    // Restoring Force vector (Red)
    const F = -k * x;
    if (Math.abs(F) > 0.2) {
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      const fLen = F * 6;
      ctx.beginPath();
      ctx.moveTo(blockX + blockSize / 2, centerY + blockSize / 2 + 14);
      ctx.lineTo(blockX + blockSize / 2 + fLen, centerY + blockSize / 2 + 14);
      ctx.stroke();
      ctx.fillText('F', blockX + blockSize / 2 + fLen + (fLen > 0 ? 4 : -12), centerY + blockSize / 2 + 18);
    }

    // Energy Bars on Bottom
    const barBaseY = h - 50;
    const barW = Math.min(w * 0.45, 240);
    const maxBarH = 36;
    const maxEnergy = 0.5 * k * A * A || 1;

    // Background bar
    ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
    ctx.fillRect(40, barBaseY, barW, 16);

    const ekW = Math.min((Ek / maxEnergy) * barW, barW);
    const epW = Math.min((Ep / maxEnergy) * barW, barW);

    // Ek bar
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(40, barBaseY, ekW, 7);

    // Ep bar
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(40, barBaseY + 9, epW, 7);

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`Wđ: ${Ek.toFixed(2)} J`, 40, barBaseY - 6);
    ctx.fillText(`Wt: ${Ep.toFixed(2)} J`, 140, barBaseY - 6);
    ctx.fillText(`Cơ năng W: ${ETotal.toFixed(2)} J`, 230, barBaseY - 6);
  };

  // 2. Simple Pendulum Renderer
  const renderSimplePendulum = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const l = params.length || 1.0;
    const g = params.gravity || 9.8;
    const a0Deg = params.angle0 || 20;
    const gamma = params.damping || 0;

    const omega0 = Math.sqrt(g / l);
    const a0Rad = (a0Deg * Math.PI) / 180;
    const theta = a0Rad * Math.exp(-gamma * t) * Math.cos(omega0 * t);
    const omega = -a0Rad * omega0 * Math.exp(-gamma * t) * Math.sin(omega0 * t);
    const v = l * omega;

    setTelemetry({
      t,
      pos: (theta * 180) / Math.PI,
      vel: v,
      acc: -g * Math.sin(theta),
      ek: 0.5 * 1.0 * v * v,
      ep: 1.0 * g * l * (1 - Math.cos(theta)),
      extra: `T = ${(2 * Math.PI * Math.sqrt(l / g)).toFixed(2)}s | Góc: ${((theta * 180) / Math.PI).toFixed(1)}°`
    });

    const pivotX = w / 2;
    const pivotY = 70;
    const lengthPx = Math.min(l * 160, h * 0.65);

    const bobX = pivotX + lengthPx * Math.sin(theta);
    const bobY = pivotY + lengthPx * Math.cos(theta);

    // Pivot mount
    ctx.fillStyle = isDark ? '#475569' : '#94a3b8';
    ctx.fillRect(pivotX - 30, pivotY - 10, 60, 10);
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Vertical dashed reference
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + lengthPx + 30);
    ctx.stroke();

    // Arc for angle theta
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 40, Math.PI / 2, Math.PI / 2 + theta, theta < 0);
    ctx.stroke();
    ctx.restore();

    // String
    ctx.strokeStyle = isDark ? '#e2e8f0' : '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Pendulum Bob
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Velocity arrow
    if (Math.abs(v) > 0.05) {
      const vScale = 35;
      const vx = v * Math.cos(theta) * vScale;
      const vy = -v * Math.sin(theta) * vScale;

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();
    }
  };

  // 3. Light Refraction & Total Internal Reflection
  const renderLightRefraction = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    isDark: boolean
  ) => {
    const n1 = params.n1 || 1.5;
    const n2 = params.n2 || 1.0;
    const iDeg = params.incidenceDeg || 35;

    const iRad = (iDeg * Math.PI) / 180;
    const midY = h / 2;
    const centerX = w / 2;

    // Interface boundary
    ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.06)' : 'rgba(56, 189, 248, 0.12)';
    ctx.fillRect(0, midY, w, h - midY);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Medium labels
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`Môi trường 1 (n₁ = ${n1})`, 24, midY - 20);
    ctx.fillText(`Môi trường 2 (n₂ = ${n2})`, 24, midY + 30);

    // Normal line (Pháp tuyến NN')
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, h - 20);
    ctx.stroke();
    ctx.fillText('N', centerX + 6, 30);
    ctx.fillText("N'", centerX + 6, h - 30);
    ctx.restore();

    // Incident Ray (Tia tới SI)
    const rayLength = Math.min(w * 0.35, midY * 0.8);
    const startX = centerX - rayLength * Math.sin(iRad);
    const startY = midY - rayLength * Math.cos(iRad);

    ctx.strokeStyle = '#10b981'; // Green laser
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(centerX, midY);
    ctx.stroke();

    // Laser emitter device
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(startX - 10, startY - 10, 20, 20);

    // Reflected Ray (Tia phản xạ IR: i' = i)
    const reflX = centerX + rayLength * Math.sin(iRad);
    const reflY = midY - rayLength * Math.cos(iRad);

    // Refraction calculation (Snell: n1 * sin(i) = n2 * sin(r))
    const sinR = (n1 / n2) * Math.sin(iRad);
    const isTIR = sinR > 1.0; // Total internal reflection

    // Draw Reflected ray
    ctx.strokeStyle = isTIR ? '#10b981' : 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = isTIR ? 3 : 1.8;
    ctx.beginPath();
    ctx.moveTo(centerX, midY);
    ctx.lineTo(reflX, reflY);
    ctx.stroke();

    let rDeg = 0;
    if (!isTIR) {
      const rRad = Math.asin(sinR);
      rDeg = (rRad * 180) / Math.PI;

      // Refracted ray (Tia khúc xạ)
      const refrX = centerX + rayLength * Math.sin(rRad);
      const refrY = midY + rayLength * Math.cos(rRad);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, midY);
      ctx.lineTo(refrX, refrY);
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.fillText(`r = ${rDeg.toFixed(1)}°`, centerX + 18, midY + 45);
    } else {
      // Total Internal Reflection Warning Pill
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('⚠ PHẢN XẠ TOÀN PHẦN (i ≥ igh)', centerX + 20, midY - 60);
    }

    // Critical angle igh
    const igh = n1 > n2 ? ((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(1) : 'Không có';
    setTelemetry({
      t: 0,
      pos: iDeg,
      vel: isTIR ? 0 : rDeg,
      acc: 0,
      ek: 0,
      ep: 0,
      extra: `Góc tới i: ${iDeg}° | Góc khúc xạ r: ${isTIR ? 'Phản xạ toàn phần' : rDeg.toFixed(1) + '°'} | igh: ${igh}°`
    });
  };

  // 4. Projectile Motion Renderer
  const renderProjectileMotion = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const v0 = params.initialVelocity || 25;
    const angleDeg = params.launchAngle || 45;
    const initH = params.initialHeight || 0;
    const g = params.gravity || 9.8;

    const angleRad = (angleDeg * Math.PI) / 180;
    const vx = v0 * Math.cos(angleRad);
    const vy0 = v0 * Math.sin(angleRad);

    // Flight time until hit ground y = 0
    // 0 = initH + vy0*t - 0.5*g*t^2
    const totalFlightTime = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * initH)) / g;
    const curT = Math.min(t % (totalFlightTime + 1.5), totalFlightTime);

    const xMeters = vx * curT;
    const yMeters = initH + vy0 * curT - 0.5 * g * curT * curT;
    const vy = vy0 - g * curT;

    const scale = Math.min(w / (vx * totalFlightTime + 20), 8.0);
    const originX = 60;
    const groundY = h - 60;

    // Ground line
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, groundY);
    ctx.lineTo(w - 20, groundY);
    ctx.stroke();

    // Cannon stand
    const cannonY = groundY - initH * scale;
    ctx.fillStyle = '#334155';
    ctx.fillRect(originX - 16, cannonY, 24, groundY - cannonY);

    // Parabolic trajectory path
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let simX = 0; simX <= vx * totalFlightTime; simX += 1) {
      const timeAtX = simX / vx;
      const simY = initH + vy0 * timeAtX - 0.5 * g * timeAtX * timeAtX;
      const px = originX + simX * scale;
      const py = groundY - simY * scale;
      if (simX === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Target bullseye on ground
    const targetX = originX + (vx * totalFlightTime) * scale;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(targetX - 10, groundY - 6, 20, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(targetX - 4, groundY - 6, 8, 6);

    // Projectile ball
    const ballPx = originX + xMeters * scale;
    const ballPy = groundY - yMeters * scale;

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(ballPx, ballPy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Velocity vector
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballPx, ballPy);
    ctx.lineTo(ballPx + vx * 1.5, ballPy - vy * 1.5);
    ctx.stroke();

    const Hmax = initH + (vy0 * vy0) / (2 * g);
    const L = vx * totalFlightTime;

    setTelemetry({
      t: curT,
      pos: xMeters,
      vel: Math.hypot(vx, vy),
      acc: g,
      ek: 0.5 * (vx * vx + vy * vy),
      ep: g * yMeters,
      extra: `Tầm xa L: ${L.toFixed(1)}m | Độ cao max H: ${Hmax.toFixed(1)}m | Thời gian bay: ${totalFlightTime.toFixed(2)}s`
    });
  };

  // 5. Wave Interference Renderer
  const renderWaveInterference = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const lambda = params.wavelength || 25;
    const distS = params.sourceDist || 120;
    const freq = params.frequency || 2.0;

    const centerY = h / 2;
    const s1X = w / 2 - distS / 2;
    const s2X = w / 2 + distS / 2;

    // Draw wave ripples
    const maxR = Math.max(w, h);
    ctx.save();
    ctx.lineWidth = 1.2;

    for (let r = (t * freq * lambda) % lambda; r <= maxR; r += lambda) {
      // Source 1 rings
      ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.35)';
      ctx.beginPath();
      ctx.arc(s1X, centerY, r, 0, Math.PI * 2);
      ctx.stroke();

      // Source 2 rings
      ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.35)';
      ctx.beginPath();
      ctx.arc(s2X, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Antinodal Hyperbolic lines (Cực đại giao thoa: d2 - d1 = k * lambda)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    // Central maximum (Trung trực k = 0)
    ctx.beginPath();
    ctx.moveTo(w / 2, 20);
    ctx.lineTo(w / 2, h - 20);
    ctx.stroke();

    ctx.restore();

    // Source markers S1, S2
    [
      { x: s1X, l: 'S₁' },
      { x: s2X, l: 'S₂' }
    ].forEach((s) => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(s.x, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(s.l, s.x - 8, centerY - 12);
    });

    setTelemetry({
      t,
      pos: distS,
      vel: lambda * freq,
      acc: 0,
      ek: 0,
      ep: 0,
      extra: `v = ${(lambda * freq).toFixed(0)} mm/s | λ = ${lambda} mm | S₁S₂ = ${distS} mm`
    });
  };

  const handleParamChange = (key: string, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetSim = () => {
    simTimeRef.current = 0;
    xHistoryRef.current = [];
  };

  return (
    <div className="space-y-6">
      {/* Header & Experiment Picker */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Vật lí thực nghiệm 2D (Interactive Physics Lab)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mô phỏng thời gian thực, đo lường các đại lượng cơ học, quang học & sóng cơ
          </p>
        </div>

        {/* Experiment Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto max-w-full">
          {PHYSICS_EXPERIMENTS.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedExpId(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedExpId === item.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {item.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Simulation vs Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulation Canvas Stage */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          {/* Stage Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {exp.title}
              </span>
              <span className="text-slate-400 mx-2" aria-hidden="true">·</span>
              <span className="text-xs text-slate-500">{exp.category}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-1.5 rounded-md transition-colors ${
                  isRunning
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
                title={isRunning ? 'Tạm dừng mô phỏng' : 'Tiếp tục mô phỏng'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Reset */}
              <button
                onClick={handleResetSim}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
                title="Khôi phục trạng thái ban đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Speed Buttons */}
              <div className="flex items-center text-xs font-mono bg-slate-200 dark:bg-slate-800 rounded-md p-0.5">
                {[0.5, 1.0, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      simSpeed === s ? 'bg-white dark:bg-slate-700 font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative h-[420px] bg-slate-900/5 dark:bg-black/20">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Telemetry Strip */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
              <span>Thời gian t: {telemetry.t.toFixed(2)}s</span>
              <span>{telemetry.extra}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              <span>Dữ liệu thực nghiệm 60fps</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Parameters & Theory Quiz */}
        <div className="lg:col-span-4 space-y-4">
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('simulation')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'simulation'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Thông số thực nghiệm
            </button>
            <button
              onClick={() => setViewMode('theory')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'theory'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Lý thuyết & Trắc nghiệm
            </button>
          </div>

          {viewMode === 'simulation' ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Điều chỉnh tham số vật lý
              </h3>

              {Object.entries(exp.paramBounds).map(([k, meta]) => (
                <div key={k}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{meta.label}</span>
                    <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold">
                      {params[k]} {meta.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={params[k]}
                    onChange={(e) => handleParamChange(k, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Công thức chính
                </h4>
                {exp.keyConcepts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5 max-h-[500px] overflow-y-auto">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  Khái niệm cơ bản
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {exp.theoryMarkdown}
                </p>
              </div>

              {/* Self-check Quiz */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Câu hỏi kiểm tra nhanh
                </h4>

                {exp.quiz.map((q, idx) => {
                  const qKey = `${exp.id}-${idx}`;
                  const selected = quizAnswers[qKey];
                  const evaluated = showQuizResults[qKey];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {q.question}
                      </p>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            disabled={evaluated}
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [qKey]: optIdx }))
                            }
                            className={`w-full text-left px-2.5 py-1.5 rounded border transition-colors ${
                              evaluated
                                ? optIdx === q.correctIndex
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-medium'
                                  : selected === optIdx
                                  ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200'
                                  : 'border-transparent text-slate-500'
                                : selected === optIdx
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {!evaluated ? (
                        <button
                          disabled={selected === undefined}
                          onClick={() =>
                            setShowQuizResults((prev) => ({ ...prev, [qKey]: true }))
                          }
                          className="px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded transition-colors"
                        >
                          Kiểm tra
                        </button>
                      ) : (
                        <div className="pt-2 text-slate-600 dark:text-slate-400">
                          <span className={isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {isCorrect ? '✓ Đúng rồi!' : '✗ Chưa đúng!'}
                          </span>{' '}
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
