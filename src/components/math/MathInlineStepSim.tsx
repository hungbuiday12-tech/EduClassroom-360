import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Compass,
  Maximize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sliders,
  Sparkles,
  StepForward
} from 'lucide-react';
import { MathLecture } from '../../types';
import { Math2DSimKind, resolveMathStepSim } from './mathStepSimResolver';
import { Math3DView } from './Math3DView';
import { FormattedText, MathFormula } from '../common/MathRenderer';

interface MathInlineStepSimProps {
  lesson: MathLecture;
  stepIndex: number;
  totalSteps: number;
  stepTitle?: string;
  stepConcept?: string;
  viewMode: 'both' | '2d' | '3d';
  isWebGLActive?: boolean;
  onActivateWebGL?: () => void;
  onOpenSim2D?: () => void;
  onOpenSim3D?: () => void;
}

interface MathTelemetryMetric {
  label: string;
  value: string;
  unit?: string;
}

function drawGridAndAxes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.fillStyle = '#070b18';
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.lineWidth = 1;
  for (let gx = cx % scale; gx < w; gx += scale) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = cy % scale; gy < h; gy += scale) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.stroke();

  // Origin + ticks
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText('O', cx + 4, cy + 12);
  ctx.fillText('x', w - 14, cy - 6);
  ctx.fillText('y', cx + 6, 14);
}

function drawMath2DSim(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  kind: Math2DSimKind,
  params: Record<string, number>,
  t: number
): MathTelemetryMetric[] {
  const cx = w * 0.5;
  const cy = h * 0.54;
  const scale = Math.max(24, Math.min(44, Math.min(w, h) / 7.5));

  const toPx = (x: number) => cx + x * scale;
  const toPy = (y: number) => cy - y * scale;

  switch (kind) {
    case 'quadratic_parabola_2d': {
      drawGridAndAxes(ctx, w, h, cx, cy, scale);
      const a = Math.abs(params.a ?? 1) < 0.05 ? 0.25 : (params.a ?? 1);
      const b = params.b ?? -2;
      const c = params.c ?? -3;
      const delta = b * b - 4 * a * c;
      const vx = -b / (2 * a);
      const vy = -delta / (4 * a);

      // Axis of symmetry
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.beginPath();
      ctx.moveTo(toPx(vx), 8);
      ctx.lineTo(toPx(vx), h - 8);
      ctx.stroke();
      ctx.restore();

      // Parabola curve
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px <= w; px += 2) {
        const x = (px - cx) / scale;
        const y = a * x * x + b * x + c;
        const py = toPy(y);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Moving trace point
      const xm = Math.sin(t * 0.9) * 2.5;
      const ym = a * xm * xm + b * xm + c;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(toPx(xm), toPy(ym), 5, 0, Math.PI * 2);
      ctx.fill();

      // Vertex I
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(toPx(vx), toPy(vy), 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(`I(${vx.toFixed(1)}; ${vy.toFixed(1)})`, toPx(vx) + 8, toPy(vy) - 6);

      // Roots
      if (delta >= 0) {
        const r1 = (-b - Math.sqrt(delta)) / (2 * a);
        const r2 = (-b + Math.sqrt(delta)) / (2 * a);
        [r1, r2].forEach((r, idx) => {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(toPx(r), cy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`x${idx + 1}=${r.toFixed(1)}`, toPx(r) - 14, cy + 16);
        });
      }

      return [
        { label: 'Biệt thức Δ', value: delta.toFixed(2) },
        { label: 'Đỉnh Parabol I', value: `(${vx.toFixed(2)}; ${vy.toFixed(2)})` },
        {
          label: 'Số giao điểm Ox',
          value: delta > 0 ? '2 nghiệm phân biệt' : Math.abs(delta) < 1e-6 ? '1 nghiệm kép' : 'Vô nghiệm thực'
        }
      ];
    }

    case 'cubic_extrema_2d': {
      drawGridAndAxes(ctx, w, h, cx, cy, scale);
      const a = Math.abs(params.a ?? 1) < 0.05 ? 0.25 : (params.a ?? 1);
      const b = params.b ?? 0;
      const c = params.c ?? -3;
      const d = params.d ?? 1;

      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px <= w; px += 2) {
        const x = (px - cx) / scale;
        const y = a * x * x * x + b * x * x + c * x + d;
        const py = toPy(y);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      const disc = 4 * b * b - 12 * a * c;
      const xInf = -b / (3 * a);
      const yInf = a * xInf * xInf * xInf + b * xInf * xInf + c * xInf + d;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(toPx(xInf), toPy(yInf), 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('Điểm uốn', toPx(xInf) + 6, toPy(yInf) - 4);

      if (disc > 0) {
        const x1 = (-2 * b - Math.sqrt(disc)) / (6 * a);
        const x2 = (-2 * b + Math.sqrt(disc)) / (6 * a);
        [x1, x2].forEach((xe, i) => {
          const ye = a * xe * xe * xe + b * xe * xe + c * xe + d;
          ctx.fillStyle = i === 0 ? '#f43f5e' : '#10b981';
          ctx.beginPath();
          ctx.arc(toPx(xe), toPy(ye), 5.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`(${xe.toFixed(1)}; ${ye.toFixed(1)})`, toPx(xe) + 6, toPy(ye) - 8);
        });
      }

      return [
        { label: 'Δ(y’)', value: disc.toFixed(2) },
        { label: 'Số điểm cực trị', value: disc > 0 ? '2 cực trị' : '0 cực trị (đơn điệu)' },
        { label: 'Tâm đối xứng U', value: `(${xInf.toFixed(2)}; ${yInf.toFixed(2)})` }
      ];
    }

    case 'derivative_tangent_2d': {
      drawGridAndAxes(ctx, w, h, cx, cy, scale);
      const a = params.a ?? 0.5;
      const c = params.c ?? -1.0;
      const x0 = params.x0 ?? 1.0;
      const f = (x: number) => a * x * x + 0.4 * x + c;
      const fp = (x: number) => 2 * a * x + 0.4;
      const y0 = f(x0);
      const k = fp(x0);

      // Curve
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = (px - cx) / scale;
        const py = toPy(f(x));
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Tangent line
      const xL = -6;
      const xR = 6;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(toPx(xL), toPy(y0 + k * (xL - x0)));
      ctx.lineTo(toPx(xR), toPy(y0 + k * (xR - x0)));
      ctx.stroke();

      // Slope triangle
      ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
      ctx.beginPath();
      ctx.moveTo(toPx(x0), toPy(y0));
      ctx.lineTo(toPx(x0 + 1), toPy(y0));
      ctx.lineTo(toPx(x0 + 1), toPy(y0 + k));
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(toPx(x0), toPy(y0), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(`M(${x0.toFixed(1)}; ${y0.toFixed(2)})  k = ${k.toFixed(2)}`, toPx(x0) + 10, toPy(y0) - 8);

      return [
        { label: 'Tiếp điểm M', value: `(${x0.toFixed(2)}; ${y0.toFixed(2)})` },
        { label: 'Hệ số góc k = f’(x₀)', value: k.toFixed(3) },
        { label: 'Góc nghiêng α', value: ((Math.atan(k) * 180) / Math.PI).toFixed(1), unit: '°' }
      ];
    }

    case 'integral_riemann_2d': {
      const cyI = h * 0.72;
      const cxI = w * 0.3;
      drawGridAndAxes(ctx, w, h, cxI, cyI, scale);
      const aLim = Math.min(params.aLim ?? 0, (params.bLim ?? 3) - 0.5);
      const bLim = Math.max(params.bLim ?? 3, aLim + 0.5);
      const n = Math.max(2, Math.round(params.nRects ?? 8));
      const f = (x: number) => 0.25 * x * x + 0.65;
      const exactInt =
        (0.25 / 3) * (bLim ** 3 - aLim ** 3) + 0.65 * (bLim - aLim);

      const dx = (bLim - aLim) / n;
      let riemannSum = 0;

      for (let i = 0; i < n; i++) {
        const xMid = aLim + (i + 0.5) * dx;
        const hVal = f(xMid);
        riemannSum += hVal * dx;
        const x1 = cxI + (aLim + i * dx) * scale;
        const rw = dx * scale;
        const rh = hVal * scale;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.34)' : 'rgba(99, 102, 241, 0.34)';
        ctx.fillRect(x1, cyI - rh, rw, rh);
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.75)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x1, cyI - rh, rw, rh);
      }

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = (px - cxI) / scale;
        const py = cyI - f(x) * scale;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      return [
        { label: `Tổng Riemann (n=${n})`, value: riemannSum.toFixed(4) },
        { label: 'Tích phân chính xác', value: exactInt.toFixed(4) },
        { label: 'Sai số |Sₙ − ∫|', value: Math.abs(riemannSum - exactInt).toFixed(4) }
      ];
    }

    case 'trig_unit_circle_2d': {
      ctx.fillStyle = '#070b18';
      ctx.fillRect(0, 0, w, h);
      const R = Math.min(w * 0.22, h * 0.36);
      const ucx = w * 0.23;
      const ucy = h * 0.52;
      const amp = params.amp ?? 1.0;
      const freq = params.freq ?? 1.0;
      const rad = (((params.angleDeg ?? 45) + (t * 28) % 360) * Math.PI) / 180;
      const sinV = Math.sin(rad * freq) * amp;
      const cosV = Math.cos(rad * freq) * amp;

      // Unit circle axes & circle
      ctx.strokeStyle = 'rgba(148,163,184,0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ucx - R - 18, ucy);
      ctx.lineTo(ucx + R + 18, ucy);
      ctx.moveTo(ucx, ucy - R - 18);
      ctx.lineTo(ucx, ucy + R + 18);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ucx, ucy, R, 0, Math.PI * 2);
      ctx.stroke();

      const mx = ucx + Math.cos(rad) * R;
      const my = ucy - Math.sin(rad) * R;

      // Radius & projections
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ucx, ucy);
      ctx.lineTo(mx, my);
      ctx.stroke();

      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx, ucy);
      ctx.stroke();
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(ucx, my);
      ctx.stroke();
      ctx.setLineDash([]);

      // Wave graph on the right
      const gx0 = w * 0.48;
      const gw = w * 0.48;
      ctx.strokeStyle = 'rgba(148,163,184,0.4)';
      ctx.beginPath();
      ctx.moveTo(gx0, ucy);
      ctx.lineTo(gx0 + gw, ucy);
      ctx.moveTo(gx0, ucy - R - 12);
      ctx.lineTo(gx0, ucy + R + 12);
      ctx.stroke();

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const px = gx0 + (i / 140) * gw;
        const a = (i / 140) * Math.PI * 2;
        const py = ucy - Math.sin(a * freq) * amp * R * 0.85;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Sync connector from circle point to wave
      const waveX = gx0 + ((rad % (Math.PI * 2)) / (Math.PI * 2)) * gw;
      const waveY = ucy - sinV * R * 0.85;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(waveX, waveY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(mx, my, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(waveX, waveY, 5.5, 0, Math.PI * 2);
      ctx.fill();

      return [
        { label: 'sin(ωα)', value: sinV.toFixed(3) },
        { label: 'cos(ωα)', value: cosV.toFixed(3) },
        { label: 'sin² + cos²', value: (Math.sin(rad * freq) ** 2 + Math.cos(rad * freq) ** 2).toFixed(2) }
      ];
    }

    case 'exp_log_2d': {
      drawGridAndAxes(ctx, w, h, cx, cy, scale);
      const a = Math.abs((params.baseA ?? 2) - 1) < 0.08 ? 1.2 : Math.max(0.25, params.baseA ?? 2);
      const xv = params.xVal ?? 1.5;

      // Symmetry line y = x
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'rgba(148,163,184,0.55)';
      ctx.beginPath();
      ctx.moveTo(toPx(-5), toPy(-5));
      ctx.lineTo(toPx(5), toPy(5));
      ctx.stroke();
      ctx.restore();

      // y = a^x
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let st = false;
      for (let px = 0; px <= w; px += 2) {
        const x = (px - cx) / scale;
        const y = Math.pow(a, x);
        const py = toPy(y);
        if (py > -40 && py < h + 40) {
          if (!st) {
            ctx.moveTo(px, py);
            st = true;
          } else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // y = log_a(x)
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      st = false;
      for (let px = Math.ceil(cx + 2); px <= w; px += 2) {
        const x = (px - cx) / scale;
        if (x <= 0.02) continue;
        const y = Math.log(x) / Math.log(a);
        const py = toPy(y);
        if (py > -40 && py < h + 40) {
          if (!st) {
            ctx.moveTo(px, py);
            st = true;
          } else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      const yExp = Math.pow(a, xv);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(toPx(xv), toPy(yExp), 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(toPx(yExp), toPy(xv), 5.5, 0, Math.PI * 2);
      ctx.fill();

      return [
        { label: `aˣ (${a.toFixed(1)}^${xv.toFixed(2)})`, value: yExp.toFixed(3) },
        { label: 'Chiều biến thiên', value: a > 1 ? 'Đồng biến (a > 1)' : 'Nghịch biến (0 < a < 1)' },
        { label: 'Điểm đối xứng qua y=x', value: `(${yExp.toFixed(2)}; ${xv.toFixed(2)})` }
      ];
    }

    case 'circle_theorems_2d': {
      ctx.fillStyle = '#070b18';
      ctx.fillRect(0, 0, w, h);
      const R = Math.min(params.radius ?? 95, Math.min(w, h) * 0.36);
      const ox = w * 0.38;
      const oy = h * 0.52;
      const halfArc = (((params.arcAngle ?? 110) / 2) * Math.PI) / 180;
      const ax = ox + Math.cos(-halfArc) * R;
      const ay = oy + Math.sin(-halfArc) * R;
      const bx = ox + Math.cos(halfArc) * R;
      const by = oy + Math.sin(halfArc) * R;
      const cAng = Math.PI + Math.sin(t * 0.8) * 0.45;
      const cxP = ox + Math.cos(cAng) * R;
      const cyP = oy + Math.sin(cAng) * R;

      // Circle
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(ox, oy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Inscribed triangle ABC + Central OAB
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ox, oy);
      ctx.lineTo(bx, by);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(cxP, cyP);
      ctx.lineTo(bx, by);
      ctx.stroke();

      // Tangents intersection M
      const extD = R / Math.max(0.25, Math.cos(halfArc));
      const mx = ox + extD;
      const my = oy;
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(mx, my);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);

      [
        { x: ox, y: oy, lbl: 'O', col: '#94a3b8' },
        { x: ax, y: ay, lbl: 'A', col: '#38bdf8' },
        { x: bx, y: by, lbl: 'B', col: '#38bdf8' },
        { x: cxP, y: cyP, lbl: 'C', col: '#10b981' },
        { x: mx, y: my, lbl: 'M', col: '#f43f5e' }
      ].forEach((pt) => {
        ctx.fillStyle = pt.col;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(pt.lbl, pt.x + 6, pt.y - 6);
      });

      const aob = params.arcAngle ?? 110;
      const maLen = (R * Math.tan(halfArc)) / 30;
      return [
        { label: 'Góc ở tâm AOB', value: aob.toFixed(0), unit: '°' },
        { label: 'Góc nội tiếp ACB', value: (aob / 2).toFixed(1), unit: '°' },
        { label: 'Tiếp tuyến MA = MB', value: maLen.toFixed(2), unit: 'cm' }
      ];
    }

    case 'triangle_pythagoras_2d': {
      ctx.fillStyle = '#070b18';
      ctx.fillRect(0, 0, w, h);
      const bSide = params.sideC ?? 4.0; // AC
      const cSide = params.sideB ?? 3.0; // AB
      const aHyp = Math.hypot(bSide, cSide);
      const pxScale = Math.min(w, h) / 11;
      const ax = w * 0.25;
      const ay = h * 0.78;
      const bx = ax;
      const by = ay - cSide * pxScale;
      const cxP = ax + bSide * pxScale;
      const cyP = ay;

      // Altitude foot H onto hypotenuse BC
      const k = (cSide * cSide) / (aHyp * aHyp);
      const hx = bx + (cxP - bx) * k;
      const hy = by + (cyP - by) * k;
      const hAlt = (bSide * cSide) / aHyp;

      // Triangle fill
      ctx.fillStyle = 'rgba(99, 102, 241, 0.16)';
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cxP, cyP);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // Altitude AH
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right angle square at A
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(ax, ay - 14, 14, 14);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('A (90°)', ax - 36, ay + 14);
      ctx.fillText(`B (c=${cSide})`, bx - 10, by - 8);
      ctx.fillText(`C (b=${bSide})`, cxP + 8, cyP + 4);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`H (h=${hAlt.toFixed(2)})`, hx + 6, hy - 6);

      return [
        { label: 'Cạnh huyền a = √(b²+c²)', value: aHyp.toFixed(3), unit: 'cm' },
        { label: 'Đường cao h = bc/a', value: hAlt.toFixed(3), unit: 'cm' },
        { label: 'Diện tích S = ½bc', value: (0.5 * bSide * cSide).toFixed(2), unit: 'cm²' }
      ];
    }

    case 'conic_sections_2d': {
      drawGridAndAxes(ctx, w, h, cx, cy, scale);
      const a = Math.max(params.semiA ?? 4.5, (params.semiB ?? 2.7) + 0.25);
      const b = params.semiB ?? 2.7;
      const c = Math.sqrt(Math.max(0, a * a - b * b));
      const theta = (((params.thetaDeg ?? 40) + t * 22) * Math.PI) / 180;
      const mx = a * Math.cos(theta);
      const my = b * Math.sin(theta);

      // Ellipse
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, a * scale, b * scale, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Foci F1, F2
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(toPx(-c), cy);
      ctx.lineTo(toPx(mx), toPy(my));
      ctx.lineTo(toPx(c), cy);
      ctx.stroke();

      [
        { x: -c, y: 0, lbl: 'F₁', col: '#f43f5e' },
        { x: c, y: 0, lbl: 'F₂', col: '#f43f5e' },
        { x: mx, y: my, lbl: 'M', col: '#10b981' }
      ].forEach((pt) => {
        ctx.fillStyle = pt.col;
        ctx.beginPath();
        ctx.arc(toPx(pt.x), toPy(pt.y), 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(pt.lbl, toPx(pt.x) + 6, toPy(pt.y) - 6);
      });

      const mf1 = Math.hypot(mx + c, my);
      const mf2 = Math.hypot(mx - c, my);
      return [
        { label: 'Tiêu cự c = √(a²−b²)', value: c.toFixed(3) },
        { label: 'Tổng MF₁ + MF₂ = 2a', value: (mf1 + mf2).toFixed(2) },
        { label: 'Tâm sai e = c/a', value: (c / a).toFixed(3) }
      ];
    }

    case 'vectors_2d': {
      drawGridAndAxes(ctx, w, h, cx, cy, scale);
      const ux = params.ux ?? 3;
      const uy = params.uy ?? 1.5;
      const vx = params.vx ?? 1;
      const vy = params.vy ?? 3;
      const sx = ux + vx;
      const sy = uy + vy;

      const drawArrow = (x1: number, y1: number, x2: number, y2: number, col: string, lbl: string) => {
        const px1 = toPx(x1);
        const py1 = toPy(y1);
        const px2 = toPx(x2);
        const py2 = toPy(y2);
        ctx.strokeStyle = col;
        ctx.fillStyle = col;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.lineTo(px2, py2);
        ctx.stroke();
        const ang = Math.atan2(py2 - py1, px2 - px1);
        ctx.beginPath();
        ctx.moveTo(px2, py2);
        ctx.lineTo(px2 - 10 * Math.cos(ang - 0.35), py2 - 10 * Math.sin(ang - 0.35));
        ctx.lineTo(px2 - 10 * Math.cos(ang + 0.35), py2 - 10 * Math.sin(ang + 0.35));
        ctx.closePath();
        ctx.fill();
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(lbl, px2 + 6, py2 - 6);
      };

      // Parallelogram dashed lines
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.beginPath();
      ctx.moveTo(toPx(ux), toPy(uy));
      ctx.lineTo(toPx(sx), toPy(sy));
      ctx.lineTo(toPx(vx), toPy(vy));
      ctx.stroke();
      ctx.restore();

      drawArrow(0, 0, ux, uy, '#fbbf24', `u(${ux},${uy})`);
      drawArrow(0, 0, vx, vy, '#38bdf8', `v(${vx},${vy})`);
      drawArrow(0, 0, sx, sy, '#10b981', `u+v(${sx},${sy})`);

      const dot = ux * vx + uy * vy;
      const uMag = Math.hypot(ux, uy);
      const vMag = Math.hypot(vx, vy);
      const cosA = uMag > 0 && vMag > 0 ? Math.max(-1, Math.min(1, dot / (uMag * vMag))) : 1;
      const deg = (Math.acos(cosA) * 180) / Math.PI;
      return [
        { label: 'Tích vô hướng u·v', value: dot.toFixed(2) },
        { label: 'Góc (u, v)', value: deg.toFixed(1), unit: '°' },
        { label: 'Độ dài |u + v|', value: Math.hypot(sx, sy).toFixed(2) }
      ];
    }

    default: {
      // probability_normal_2d
      const cyP = h * 0.78;
      drawGridAndAxes(ctx, w, h, cx, cyP, scale);
      const mu = params.mu ?? 0;
      const sigma = Math.max(0.4, params.sigma ?? 1.0);
      const zBand = params.zBand ?? 1.0;
      const gauss = (x: number) =>
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));

      const leftX = mu - zBand * sigma;
      const rightX = mu + zBand * sigma;

      // Shaded confidence band
      ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
      ctx.beginPath();
      ctx.moveTo(toPx(leftX), cyP);
      for (let x = leftX; x <= rightX; x += 0.05) {
        ctx.lineTo(toPx(x), cyP - gauss(x) * scale * 5.2);
      }
      ctx.lineTo(toPx(rightX), cyP);
      ctx.closePath();
      ctx.fill();

      // Curve
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 2) {
        const x = (px - cx) / scale;
        const py = cyP - gauss(x) * scale * 5.2;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Numerical integral of Gaussian over [leftX, rightX]
      let prob = 0;
      const steps = 60;
      const dx = (rightX - leftX) / steps;
      for (let i = 0; i < steps; i++) {
        prob += gauss(leftX + (i + 0.5) * dx) * dx;
      }

      return [
        { label: `Xác suất |X−μ| ≤ ${zBand}σ`, value: (prob * 100).toFixed(2), unit: '%' },
        { label: 'Kỳ vọng μ', value: mu.toFixed(2) },
        { label: 'Độ lệch chuẩn σ', value: sigma.toFixed(2) }
      ];
    }
  }
}

export const MathInlineStepSim: React.FC<MathInlineStepSimProps> = ({
  lesson,
  stepIndex,
  totalSteps,
  stepTitle,
  stepConcept,
  viewMode,
  isWebGLActive = true,
  onActivateWebGL,
  onOpenSim2D,
  onOpenSim3D
}) => {
  const resolved = useMemo(
    () => resolveMathStepSim(lesson, stepIndex, stepTitle, stepConcept),
    [lesson, stepIndex, stepTitle, stepConcept]
  );

  const [params, setParams] = useState<Record<string, number>>(() => ({ ...resolved.defaultParams }));
  const [isRunning, setIsRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [metrics, setMetrics] = useState<MathTelemetryMetric[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;
  const speedRef = useRef(simSpeed);
  speedRef.current = simSpeed;

  useEffect(() => {
    setParams({ ...resolved.defaultParams });
    simTimeRef.current = 0;
  }, [resolved.sim2dKind, lesson.id, stepIndex]);

  useEffect(() => {
    if (viewMode === '3d') return;
    let raf = 0;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) simTimeRef.current += dt * speedRef.current;

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.scale(dpr, dpr);
            const m = drawMath2DSim(ctx, rect.width, rect.height, resolved.sim2dKind, paramsRef.current, simTimeRef.current);
            ctx.restore();
            frame++;
            if (frame % 6 === 0) setMetrics(m);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [viewMode, resolved.sim2dKind]);

  return (
    <div className="space-y-3">
      {(viewMode === 'both' || viewMode === '2d') && (
        <section
          data-testid={`math-inline-2d-step-${stepIndex}`}
          className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-white dark:bg-slate-950 overflow-hidden shadow-sm"
        >
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-indigo-500/15 border border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono font-bold uppercase shrink-0">
                <Compass className="w-3 h-3" />
                2D TOÁN · PHẦN {stepIndex + 1}/{totalSteps}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                <FormattedText text={resolved.title2d} />
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {resolved.presets.slice(0, 3).map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  onClick={() => setParams({ ...resolved.defaultParams, ...pr.params })}
                  className="px-2 py-1 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-400 cursor-pointer whitespace-nowrap"
                >
                  {pr.label}
                </button>
              ))}
              {onOpenSim2D && (
                <button
                  type="button"
                  onClick={onOpenSim2D}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer whitespace-nowrap"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Phòng Đồ Thị 2D</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <canvas ref={canvasRef} className="w-full h-[250px] sm:h-[285px] block select-none" />
          </div>

          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11px] font-bold cursor-pointer ${
                  isRunning ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isRunning ? 'Tạm dừng' : 'Chạy'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  simTimeRef.current += 0.25;
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                <StepForward className="w-3 h-3 text-indigo-500" />
                <span>+0.25s</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setParams({ ...resolved.defaultParams });
                  simTimeRef.current = 0;
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
              {[0.5, 1, 1.5].map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSimSpeed(sp)}
                  className={`px-2 py-1 rounded-sm text-[10px] font-mono font-bold tabular-nums cursor-pointer ${
                    simSpeed === sp
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 truncate max-w-md">
              <MathFormula formula={resolved.formula2d} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            {metrics.slice(0, 3).map((m, idx) => (
              <div key={idx} className="px-4 py-2">
                <div className="text-[10px] font-mono uppercase text-slate-500">{m.label}</div>
                <div className="text-sm font-mono font-bold tabular-nums text-indigo-700 dark:text-indigo-300">
                  {m.value} {m.unit || ''}
                </div>
              </div>
            ))}
          </div>

          {resolved.paramDefs.length > 0 && (
            <div className="p-3 bg-slate-50/75 dark:bg-slate-900/50 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {resolved.paramDefs.map((bound) => {
                const v = params[bound.key] ?? resolved.defaultParams[bound.key] ?? bound.min;
                const decimals = (bound.step.toString().split('.')[1] || '').length;
                return (
                  <div
                    key={bound.key}
                    className="rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 truncate">
                        <Sliders className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate">{bound.label}</span>
                      </span>
                      <div className="flex items-center gap-1 shrink-0 font-mono font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
                        <button
                          type="button"
                          onClick={() =>
                            setParams((p) => ({
                              ...p,
                              [bound.key]: Math.max(bound.min, Number((v - bound.step).toFixed(Math.max(decimals, 2))))
                            }))
                          }
                          className="w-6 h-6 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-[54px] text-right">
                          {v} {bound.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setParams((p) => ({
                              ...p,
                              [bound.key]: Math.min(bound.max, Number((v + bound.step).toFixed(Math.max(decimals, 2))))
                            }))
                          }
                          className="w-6 h-6 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={bound.min}
                      max={bound.max}
                      step={bound.step}
                      value={v}
                      onChange={(e) => setParams((p) => ({ ...p, [bound.key]: Number(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {(viewMode === 'both' || viewMode === '3d') && (
        <section data-testid={`math-inline-3d-step-${stepIndex}`} className="rounded-xl overflow-hidden">
          {!isWebGLActive ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 text-white overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold uppercase shrink-0">
                    <Box className="w-3 h-3" />
                    3D TOÁN · PHẦN {stepIndex + 1}/{totalSteps}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {resolved.title3d}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  {onActivateWebGL && (
                    <button
                      type="button"
                      onClick={onActivateWebGL}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Mở Mô hình 3D WebGL</span>
                    </button>
                  )}
                  {onOpenSim3D && (
                    <button
                      type="button"
                      onClick={onOpenSim3D}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Lab 3D Đầy đủ</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070b18]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>THREE.JS WEBGL · {resolved.title3d.toUpperCase()}</span>
                  </div>
                  <p className="text-xs text-slate-300">{resolved.subtitle3d}</p>
                </div>
                {onActivateWebGL && (
                  <button
                    type="button"
                    onClick={onActivateWebGL}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    <span>Chạy cảnh 3D tại đây</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Math3DView
              initialMode={resolved.mode3d}
              allowedModes={resolved.allowed3dModes}
              embedded
              embeddedBadge={`3D TOÁN · PHẦN ${stepIndex + 1}/${totalSteps}`}
              heightClass="h-[340px]"
              onOpenFull3D={onOpenSim3D}
            />
          )}
        </section>
      )}
    </div>
  );
};
