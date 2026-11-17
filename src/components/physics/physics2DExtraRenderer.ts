import { PhysicsSimType } from '../../types';

export interface Extra2DTelemetryPayload {
  metric1Label: string;
  metric1Val: string;
  metric2Label: string;
  metric2Val: string;
  metric3Label: string;
  metric3Val: string;
  note: string;
}

export interface Extra2DOverlays {
  showRulerGrid: boolean;
  showVectors: boolean;
  showTrace: boolean;
  showRealtimeChart: boolean;
}

function drawArrow2D(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  label?: string
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (Math.hypot(dx, dy) < 4) return;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9 * Math.cos(angle - 0.35), y2 - 9 * Math.sin(angle - 0.35));
  ctx.lineTo(x2 - 9 * Math.cos(angle + 0.35), y2 - 9 * Math.sin(angle + 0.35));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, x2 + 5, y2 - 4);
  }
}

export function renderExtra2DPhysicsSim(
  simType: PhysicsSimType,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isDark: boolean,
  p: Record<string, number>,
  ov: Extra2DOverlays,
  pushTelemetry: (next: Extra2DTelemetryPayload) => void
): boolean {
  const textPrimary = isDark ? '#e2e8f0' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const surfaceBorder = isDark ? '#334155' : '#cbd5e1';

  switch (simType) {
    // 1. ATWOOD PULLEY
    case 'atwood_pulley': {
      const m1 = p.m1 ?? 2.0;
      const m2 = p.m2 ?? 3.5;
      const g = p.g ?? 9.8;
      const a = ((m2 - m1) * g) / (m1 + m2);
      const T = (2 * m1 * m2 * g) / (m1 + m2);
      const cyc = (t % 3.6);
      const disp = Math.max(-75, Math.min(75, 0.5 * a * cyc * cyc * 9));
      const cx = w * 0.5;
      const pulleyY = 66;
      const pulleyR = 28;

      pushTelemetry({
        metric1Label: 'Gia tốc hệ (a)',
        metric1Val: `${a.toFixed(2)} m/s²`,
        metric2Label: 'Lực căng dây (T)',
        metric2Val: `${T.toFixed(2)} N`,
        metric3Label: 'Trạng thái',
        metric3Val: Math.abs(a) < 0.05 ? 'Cân bằng tĩnh' : a > 0 ? 'm₂ đi xuống' : 'm₁ đi xuống',
        note: `a = (m₂ − m₁)g / (m₁ + m₂) · T = 2m₁m₂g / (m₁ + m₂). Khi m₁ = m₂ thì a = 0.`
      });

      // Beam & Pulley wheel
      ctx.fillStyle = surfaceBorder;
      ctx.fillRect(cx - 50, 18, 100, 10);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, 28);
      ctx.lineTo(cx, pulleyY);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, pulleyY, pulleyR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const y1 = h * 0.54 - disp;
      const y2 = h * 0.54 + disp;
      const lx = cx - pulleyR;
      const rx = cx + pulleyR;

      // Rope
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(lx, pulleyY);
      ctx.lineTo(lx, y1);
      ctx.moveTo(rx, pulleyY);
      ctx.lineTo(rx, y2);
      ctx.stroke();

      const s1 = 28 + m1 * 3.2;
      const s2 = 28 + m2 * 3.2;
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(lx - s1 / 2, y1, s1, s1);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(rx - s2 / 2, y2, s2, s2);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${m1}kg`, lx, y1 + s1 / 2 + 4);
      ctx.fillText(`${m2}kg`, rx, y2 + s2 / 2 + 4);

      if (ov.showVectors) {
        drawArrow2D(ctx, lx, y1, lx, y1 - 36, '#10b981', 'T');
        drawArrow2D(ctx, lx, y1 + s1, lx, y1 + s1 + 18 + m1 * 3, '#38bdf8', 'P₁');
        drawArrow2D(ctx, rx, y2, rx, y2 - 36, '#10b981', 'T');
        drawArrow2D(ctx, rx, y2 + s2, rx, y2 + s2 + 18 + m2 * 3, '#fb7185', 'P₂');
      }
      return true;
    }

    // 2. INCLINED PLANE
    case 'inclined_plane': {
      const ang = p.angle ?? 30;
      const mu = p.mu ?? 0.2;
      const mass = p.mass ?? 3.0;
      const rad = (ang * Math.PI) / 180;
      const g = 9.8;
      const pxForce = mass * g * Math.sin(rad);
      const nForce = mass * g * Math.cos(rad);
      const fMax = mu * nForce;
      const a = pxForce > fMax ? (pxForce - fMax) / mass : 0;

      pushTelemetry({
        metric1Label: 'Gia tốc trượt (a)',
        metric1Val: `${a.toFixed(2)} m/s²`,
        metric2Label: 'Thành phần Pₓ / F_ms',
        metric2Val: `${pxForce.toFixed(1)} N / ${Math.min(pxForce, fMax).toFixed(1)} N`,
        metric3Label: 'Áp lực N = mg·cosα',
        metric3Val: `${nForce.toFixed(1)} N`,
        note: a === 0 ? `Vật ĐỨNG YÊN vì tan(${ang}°) ≤ μ (${mu}).` : `Vật trượt xuống dốc với gia tốc a = g(sinα − μcosα).`
      });

      const baseX = w * 0.16;
      const baseY = h * 0.84;
      const rampLen = Math.min(w * 0.64, 420);
      const topX = baseX;
      const topY = baseY - rampLen * Math.sin(rad);
      const endX = baseX + rampLen * Math.cos(rad);
      const endY = baseY;

      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.12)';
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(endX, endY);
      ctx.lineTo(topX, topY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const cyc = (t % 3.5);
      const distRatio = a > 0 ? Math.min(0.85, 0.12 + 0.04 * a * cyc * cyc) : 0.25;
      const bx = topX + distRatio * (endX - topX);
      const by = topY + distRatio * (endY - topY);

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(rad);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-20, -28, 40, 28);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass}kg`, 0, -10);
      ctx.restore();

      if (ov.showVectors) {
        drawArrow2D(ctx, bx, by - 10, bx, by + 48, '#ef4444', 'P');
        drawArrow2D(ctx, bx, by - 10, bx + Math.sin(rad) * 44, by - 10 - Math.cos(rad) * 44, '#10b981', 'N');
        if (mu > 0) {
          drawArrow2D(ctx, bx, by - 10, bx - Math.cos(rad) * 34, by - 10 - Math.sin(rad) * 34, '#38bdf8', 'F_ms');
        }
      }
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`α = ${ang}°`, endX - 55, baseY - 10);
      return true;
    }

    // 3. MOMENTUM COLLISION
    case 'momentum_collision': {
      const m1 = p.m1 ?? 3.0;
      const m2 = p.m2 ?? 2.0;
      const v1 = p.v1 ?? 5.0;
      const e = p.restitution ?? 1.0;
      const v1p = ((m1 - e * m2) * v1) / (m1 + m2);
      const v2p = ((1 + e) * m1 * v1) / (m1 + m2);

      const cycle = t % 4.0;
      const tHit = 1.6;
      const hitX = w * 0.48;
      let x1 = hitX - (tHit - cycle) * v1 * 38;
      let x2 = hitX + 34;
      if (cycle >= tHit) {
        const dt = cycle - tHit;
        x1 = hitX - 34 + v1p * dt * 38;
        x2 = hitX + 34 + v2p * dt * 38;
      } else {
        x1 = hitX - 34 - (tHit - cycle) * v1 * 38;
      }

      pushTelemetry({
        metric1Label: 'Vận tốc sau va chạm (v₁\', v₂\')',
        metric1Val: `${v1p.toFixed(2)} | ${v2p.toFixed(2)} m/s`,
        metric2Label: 'Tổng động lượng Σp',
        metric2Val: `${(m1 * v1).toFixed(1)} kg·m/s`,
        metric3Label: 'Động năng mất mát',
        metric3Val: `${(0.5 * m1 * v1 * v1 - (0.5 * m1 * v1p * v1p + 0.5 * m2 * v2p * v2p)).toFixed(1)} J`,
        note: e >= 0.99 ? 'Va chạm ĐÀN HỒI: Bảo toàn cả động lượng và động năng!' : `Va chạm hệ số e = ${e.toFixed(1)}: một phần động năng biến thành nhiệt.`
      });

      const railY = h * 0.65;
      ctx.strokeStyle = surfaceBorder;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(30, railY);
      ctx.lineTo(w - 30, railY);
      ctx.stroke();

      const r1 = 20 + m1 * 2.2;
      const r2 = 20 + m2 * 2.2;
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.arc(Math.max(40, Math.min(w - 40, x1)), railY - r1, r1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`m₁=${m1}`, Math.max(40, Math.min(w - 40, x1)), railY - r1 + 4);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.max(40, Math.min(w - 40, x2)), railY - r2, r2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`m₂=${m2}`, Math.max(40, Math.min(w - 40, x2)), railY - r2 + 4);

      if (ov.showVectors) {
        const curV1 = cycle < tHit ? v1 : v1p;
        const curV2 = cycle < tHit ? 0 : v2p;
        drawArrow2D(ctx, x1, railY - r1 * 2 - 14, x1 + curV1 * 12, railY - r1 * 2 - 14, '#38bdf8', `v₁`);
        drawArrow2D(ctx, x2, railY - r2 * 2 - 14, x2 + curV2 * 12, railY - r2 * 2 - 14, '#fbbf24', `v₂`);
      }
      return true;
    }

    // 4. TORQUE & LEVER
    case 'torque_lever': {
      const m1 = p.mLeft ?? 4.0;
      const d1 = p.dLeft ?? 2.0;
      const m2 = p.mRight ?? 2.0;
      const d2 = p.dRight ?? 4.0;
      const M1 = m1 * 9.8 * d1;
      const M2 = m2 * 9.8 * d2;
      const diff = M2 - M1;
      const tilt = Math.max(-0.32, Math.min(0.32, diff * 0.0028 + Math.sin(t * 2) * (Math.abs(diff) < 1 ? 0 : 0.015)));

      pushTelemetry({
        metric1Label: 'Momen bên trái (M₁)',
        metric1Val: `${M1.toFixed(1)} N·m`,
        metric2Label: 'Momen bên phải (M₂)',
        metric2Val: `${M2.toFixed(1)} N·m`,
        metric3Label: 'Cân bằng đòn bẩy',
        metric3Val: Math.abs(diff) < 1 ? 'CÂN BẰNG' : diff > 0 ? 'Lệch phải' : 'Lệch trái',
        note: `Quy tắc momen: m₁·d₁ = m₂·d₂ (${(m1 * d1).toFixed(1)} vs ${(m2 * d2).toFixed(1)} kg·m).`
      });

      const cx = w * 0.5;
      const cy = h * 0.56;
      const pxPerM = Math.min(w * 0.075, 42);

      // Fulcrum triangle
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 24, cy + 54);
      ctx.lineTo(cx + 24, cy + 54);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      // Bar
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-5.2 * pxPerM, -6, 10.4 * pxPerM, 12);

      // Weights
      const w1H = 20 + m1 * 3.5;
      const w2H = 20 + m2 * 3.5;
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(-d1 * pxPerM - 16, -6 - w1H, 32, w1H);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(d2 * pxPerM - 16, -6 - w2H, 32, w2H);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${m1}kg`, -d1 * pxPerM, -14);
      ctx.fillText(`${m2}kg`, d2 * pxPerM, -14);
      ctx.restore();

      ctx.fillStyle = textMuted;
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`d₁ = ${d1}m`, cx - d1 * pxPerM, cy + 72);
      ctx.fillText(`d₂ = ${d2}m`, cx + d2 * pxPerM, cy + 72);
      return true;
    }

    // 5. KEPLER ORBIT
    case 'kepler_orbit': {
      const aNorm = p.semiMajor ?? 1.5;
      const e = p.eccentricity ?? 0.45;
      const starM = p.starMass ?? 1.0;
      const aPx = Math.min(w * 0.32, 165) * (aNorm / 1.5);
      const bPx = aPx * Math.sqrt(Math.max(0.15, 1 - e * e));
      const cPx = aPx * e;
      const cx = w * 0.52;
      const cy = h * 0.52;
      const sunX = cx - cPx;

      // Kepler numerical eccentric anomaly
      const M = t * (1.25 * Math.sqrt(starM) / Math.pow(aNorm, 1.5));
      let E = M;
      for (let i = 0; i < 4; i++) E = M + e * Math.sin(E);
      const px = cx + aPx * Math.cos(E);
      const py = cy + bPx * Math.sin(E);
      const rAU = aNorm * (1 - e * Math.cos(E));
      const vRel = Math.sqrt(starM * (2 / rAU - 1 / aNorm)) * 29.8;

      pushTelemetry({
        metric1Label: 'Khoảng cách tới sao (r)',
        metric1Val: `${rAU.toFixed(2)} AU`,
        metric2Label: 'Tốc độ quỹ đạo (v)',
        metric2Val: `${vRel.toFixed(1)} km/s`,
        metric3Label: 'Chu kì Kepler (T)',
        metric3Val: `${(Math.pow(aNorm, 1.5) / Math.sqrt(starM)).toFixed(2)} năm`,
        note: 'Định luật II Kepler: Đoạn nối hành tinh – ngôi sao quét diện tích bằng nhau trong khoảng thời gian bằng nhau.'
      });

      // Orbit ellipse
      ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.45)' : 'rgba(2,132,199,0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, aPx, bPx, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Radius vector
      ctx.strokeStyle = 'rgba(251,191,36,0.45)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sunX, cy);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sun
      const sunGrad = ctx.createRadialGradient(sunX, cy, 3, sunX, cy, 24);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.5, '#f59e0b');
      sunGrad.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      // Planet
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();

      if (ov.showVectors) {
        const vx = -aPx * Math.sin(E);
        const vy = bPx * Math.cos(E);
        const mag = Math.hypot(vx, vy) || 1;
        drawArrow2D(ctx, px, py, px + (vx / mag) * (vRel * 1.1), py + (vy / mag) * (vRel * 1.1), '#10b981', 'v');
      }
      return true;
    }

    // 6. DAMPED RESONANCE
    case 'damped_resonance': {
      const f0 = p.f0 ?? 2.5;
      const fDrive = p.fDrive ?? 2.4;
      const c = p.damping ?? 0.25;
      const resAmp = (f: number) => 1 / Math.sqrt(Math.pow(f * f - f0 * f0, 2) + Math.pow(c * f * 2.2, 2));
      const ampCur = Math.min(3.5, resAmp(fDrive));
      const yOsc = Math.sin(t * fDrive * Math.PI * 2) * ampCur * 22;

      pushTelemetry({
        metric1Label: 'Biên độ ổn định (A)',
        metric1Val: `${ampCur.toFixed(2)} cm`,
        metric2Label: 'Độ lệch tần số |f − f₀|',
        metric2Val: `${Math.abs(fDrive - f0).toFixed(2)} Hz`,
        metric3Label: 'Trạng thái cộng hưởng',
        metric3Val: Math.abs(fDrive - f0) < 0.2 ? 'ĐẠT CỘNG HƯỞNG!' : 'Ngoài cộng hưởng',
        note: `Khi tần số ngoại lực f (${fDrive} Hz) bằng f₀ (${f0} Hz), biên độ dao động đạt cực đại!`
      });

      // Left oscillator
      const springX = w * 0.2;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(springX - 30, 32, 60, 8);
      const bobY = h * 0.52 + yOsc;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(springX, 40);
      for (let i = 1; i <= 10; i++) {
        const yy = 40 + ((bobY - 40) * i) / 10;
        const xx = springX + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(i === 10 ? springX : xx, yy);
      }
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(springX, bobY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Right Resonance curve A(f)
      const gx0 = w * 0.38;
      const gy0 = h * 0.82;
      const gw = w * 0.56;
      const gh = h * 0.62;
      ctx.strokeStyle = surfaceBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx0 + gw, gy0);
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx0, gy0 - gh);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const ff = 0.5 + (i / 100) * 5.0;
        const aa = Math.min(3.4, resAmp(ff));
        const px = gx0 + (i / 100) * gw;
        const py = gy0 - (aa / 3.5) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curPx = gx0 + ((fDrive - 0.5) / 5.0) * gw;
      const curPy = gy0 - (ampCur / 3.5) * gh;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(curPx, curPy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Đường cong cộng hưởng A(f)', gx0 + gw / 2, gy0 - gh - 10);
      return true;
    }

    // 7. BEAT WAVES
    case 'beat_waves': {
      const f1 = p.f1 ?? 8;
      const f2 = p.f2 ?? 9;
      const amp = p.amp ?? 1.0;
      const fBeat = Math.abs(f1 - f2);

      pushTelemetry({
        metric1Label: 'Tần số phách (f_phách)',
        metric1Val: `${fBeat.toFixed(1)} Hz`,
        metric2Label: 'Tần số sóng mang',
        metric2Val: `${((f1 + f2) / 2).toFixed(1)} Hz`,
        metric3Label: 'Biên độ cực đại',
        metric3Val: `${(2 * amp).toFixed(1)} đv`,
        note: `Phách âm xảy ra khi hai sóng lệch nhau chút ít về tần số: f_phách = |f₁ − f₂| = ${fBeat.toFixed(1)} Hz.`
      });

      const drawWaveRow = (cy: number, color: string, label: string, fn: (xNorm: number) => number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const xn = i / 180;
          const x = 40 + xn * (w - 80);
          const y = cy + fn(xn);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = textMuted;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, 42, cy - 26);
      };

      drawWaveRow(h * 0.22, '#38bdf8', `Sóng 1: f₁ = ${f1} Hz`, (xn) => Math.sin((xn * 4 - t * 0.4) * f1) * 18 * amp);
      drawWaveRow(h * 0.46, '#f59e0b', `Sóng 2: f₂ = ${f2} Hz`, (xn) => Math.sin((xn * 4 - t * 0.4) * f2) * 18 * amp);
      drawWaveRow(h * 0.76, '#10b981', `Sóng tổng hợp (x₁ + x₂) — Hình bao phách`, (xn) => {
        const s1 = Math.sin((xn * 4 - t * 0.4) * f1);
        const s2 = Math.sin((xn * 4 - t * 0.4) * f2);
        return (s1 + s2) * 18 * amp;
      });
      return true;
    }

    // 8. SOUND INTENSITY
    case 'sound_intensity': {
      const P = (p.powerMw ?? 50) * 1e-3;
      const r = p.distanceM ?? 5;
      const I = P / (4 * Math.PI * r * r);
      const L = Math.max(0, 10 * Math.log10(I / 1e-12));

      pushTelemetry({
        metric1Label: 'Cường độ âm (I)',
        metric1Val: `${I.toExponential(2)} W/m²`,
        metric2Label: 'Mức cường độ âm (L)',
        metric2Val: `${L.toFixed(1)} dB`,
        metric3Label: 'Đánh giá thính giác',
        metric3Val: L > 110 ? 'Chói tai / Nguy hại' : L > 75 ? 'Ồn lớn' : 'Êm dịu',
        note: 'Mỗi khi khoảng cách r tăng 10 lần thì I giảm 100 lần và mức cường độ âm L giảm đúng 20 dB.'
      });

      const sx = w * 0.18;
      const cy = h * 0.5;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(sx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < 6; i++) {
        const rad = ((t * 70 + i * 45) % 270) + 18;
        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.08, 1 - rad / 270)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, cy, rad, -0.7, 0.7);
        ctx.stroke();
      }

      const micX = sx + 45 + (r / 50) * (w * 0.56);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(micX - 8, cy - 16, 16, 32);
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Máy đo (${r}m)`, micX, cy - 24);
      ctx.fillText(`${L.toFixed(1)} dB`, micX, cy + 34);
      return true;
    }

    // 9. LISSAJOUS SHM
    case 'lissajous_shm': {
      const fx = p.fx ?? 3;
      const fy = p.fy ?? 2;
      const phi = ((p.phaseDeg ?? 90) * Math.PI) / 180;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const rx = Math.min(w, h) * 0.32;
      const ry = Math.min(w, h) * 0.32;

      pushTelemetry({
        metric1Label: 'Tỉ số tần số (fₓ : fᵧ)',
        metric1Val: `${fx} : ${fy}`,
        metric2Label: 'Độ lệch pha (Δφ)',
        metric2Val: `${p.phaseDeg ?? 90}°`,
        metric3Label: 'Biên độ tổng hợp',
        metric3Val: `Aₓ = Aᵧ`,
        note: 'Hình Lissajous đóng kín khi tỉ số fₓ/fᵧ là phân số hữu tỉ; đổi pha Δφ làm xoay dáng hình.'
      });

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const th = (i / 360) * Math.PI * 2;
        const x = cx + rx * Math.cos(fx * th + phi);
        const y = cy + ry * Math.cos(fy * th);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const dotX = cx + rx * Math.cos(fx * t * 1.4 + phi);
      const dotY = cy + ry * Math.cos(fy * t * 1.4);
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
      ctx.fill();
      return true;
    }

    // 10. COULOMB PENDULUM
    case 'coulomb_pendulum': {
      const q1 = p.q1uC ?? 4;
      const q2 = p.q2uC ?? 4;
      const m = (p.massG ?? 15) * 1e-3;
      const sameSign = q1 * q2 > 0;
      const forceScale = (Math.abs(q1 * q2) / Math.max(5, p.massG ?? 15)) * 0.14;
      const theta = sameSign ? Math.min(0.62, 0.08 + forceScale * 0.25) : q1 * q2 < 0 ? -Math.min(0.16, forceScale * 0.08) : 0;

      pushTelemetry({
        metric1Label: 'Tương tác tĩnh điện',
        metric1Val: q1 * q2 === 0 ? 'Không tương tác' : sameSign ? 'ĐẨY NHAU (Cùng dấu)' : 'HÚT NHAU (Trái dấu)',
        metric2Label: 'Tích độ lớn |q₁q₂|',
        metric2Val: `${Math.abs(q1 * q2).toFixed(1)} μC²`,
        metric3Label: 'Trọng lượng P = mg',
        metric3Val: `${(m * 9.8).toFixed(3)} N`,
        note: 'Định luật Coulomb: F = k|q₁q₂|/r². Hai điện tích cùng dấu đẩy nhau mở góc lệch α.'
      });

      const cx = w * 0.5;
      const topY = 44;
      const L = h * 0.56;
      const sep = sameSign ? 36 : 48;
      const x1 = cx - sep - Math.sin(theta) * L;
      const y1 = topY + Math.cos(theta) * L;
      const x2 = cx + sep + Math.sin(theta) * L;
      const y2 = topY + Math.cos(theta) * L;

      ctx.strokeStyle = surfaceBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - sep, topY);
      ctx.lineTo(x1, y1);
      ctx.moveTo(cx + sep, topY);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.fillStyle = q1 >= 0 ? '#ef4444' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(x1, y1, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = q2 >= 0 ? '#ef4444' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(x2, y2, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${q1 > 0 ? '+' : ''}${q1}`, x1, y1 + 3);
      ctx.fillText(`${q2 > 0 ? '+' : ''}${q2}`, x2, y2 + 3);
      return true;
    }

    // 11. RC CAPACITOR
    case 'rc_capacitor': {
      const E = p.emfV ?? 12;
      const R = (p.rKOhm ?? 20) * 1e3;
      const C = (p.capUF ?? 100) * 1e-6;
      const tau = R * C;
      const isCharge = Math.round(p.modeCharge ?? 1) === 1;
      const tCur = t % (tau * 4.5);
      const uC = isCharge ? E * (1 - Math.exp(-tCur / tau)) : E * Math.exp(-tCur / tau);
      const iMa = ((isCharge ? E - uC : -uC) / R) * 1000;

      pushTelemetry({
        metric1Label: 'Hằng số thời gian τ = RC',
        metric1Val: `${tau.toFixed(2)} s`,
        metric2Label: 'Điện áp tụ u_C(t)',
        metric2Val: `${uC.toFixed(2)} V`,
        metric3Label: 'Dòng điện i(t)',
        metric3Val: `${iMa.toFixed(2)} mA`,
        note: isCharge ? 'Nạp tụ: u_C tiến dần tới E và i giảm dần về 0 sau khoảng 5τ.' : 'Xả tụ: u_C giảm theo hàm mũ e^(-t/τ).'
      });

      const gx = 60;
      const gy = h * 0.8;
      const gw = w - 110;
      const gh = h * 0.56;
      ctx.strokeStyle = surfaceBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + gw, gy);
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy - gh);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const ts = (i / 100) * tau * 4.5;
        const val = isCharge ? E * (1 - Math.exp(-ts / tau)) : E * Math.exp(-ts / tau);
        const px = gx + (i / 100) * gw;
        const py = gy - (val / 24) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const dotX = gx + (tCur / (tau * 4.5)) * gw;
      const dotY = gy - (uC / 24) * gh;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Đồ thị điện áp tụ u_C(t) (${isCharge ? 'Đang NẠP' : 'Đang XẢ'})`, gx + 10, gy - gh - 12);
      return true;
    }

    // 12. WHEATSTONE BRIDGE
    case 'wheatstone_bridge': {
      const U = p.voltage ?? 12;
      const r1 = p.r1 ?? 10;
      const r2 = p.r2 ?? 20;
      const r3 = p.r3 ?? 15;
      const r4 = p.r4 ?? 30;
      const uC = U * (r2 / (r1 + r2));
      const uD = U * (r4 / (r3 + r4));
      const uCD = uC - uD;
      const balanced = Math.abs(uCD) < 0.08;

      pushTelemetry({
        metric1Label: 'Hiệu điện thế cầu U_CD',
        metric1Val: `${uCD.toFixed(2)} V`,
        metric2Label: 'Tỉ số R₁/R₂ vs R₃/R₄',
        metric2Val: `${(r1 / r2).toFixed(2)} vs ${(r3 / r4).toFixed(2)}`,
        metric3Label: 'Trạng thái cầu',
        metric3Val: balanced ? 'CÂN BẰNG (I_G = 0)' : uCD > 0 ? 'Dòng C → D' : 'Dòng D → C',
        note: 'Cầu Wheatstone cân bằng khi R₁·R₄ = R₂·R₃, kim điện kế G chỉ số 0!'
      });

      const cx = w * 0.5;
      const cy = h * 0.48;
      const ax = cx - 120;
      const bx = cx + 120;
      const cY = cy - 75;
      const dY = cy + 75;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ax, cy);
      ctx.lineTo(cx, cY);
      ctx.lineTo(bx, cy);
      ctx.lineTo(cx, dY);
      ctx.closePath();
      ctx.moveTo(cx, cY);
      ctx.lineTo(cx, dY);
      ctx.stroke();

      ctx.fillStyle = balanced ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('G', cx, cy + 4);

      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`R₁=${r1}Ω`, (ax + cx) / 2 - 14, (cy + cY) / 2 - 8);
      ctx.fillText(`R₂=${r2}Ω`, (cx + bx) / 2 + 14, (cy + cY) / 2 - 8);
      ctx.fillText(`R₃=${r3}Ω`, (ax + cx) / 2 - 14, (cy + dY) / 2 + 16);
      ctx.fillText(`R₄=${r4}Ω`, (cx + bx) / 2 + 14, (cy + dY) / 2 + 16);
      return true;
    }

    // 13. TRANSFORMER 2D
    case 'transformer_2d': {
      const u1 = p.u1 ?? 220;
      const n1 = p.n1 ?? 500;
      const n2 = p.n2 ?? 1000;
      const rLine = p.rLine ?? 20;
      const u2 = u1 * (n2 / n1);
      const pLoad = 2000;
      const iLine = pLoad / Math.max(10, u2);
      const loss = iLine * iLine * rLine;

      pushTelemetry({
        metric1Label: 'Điện áp đầu ra U₂',
        metric1Val: `${u2.toFixed(0)} V`,
        metric2Label: 'Loại máy biến áp',
        metric2Val: n2 > n1 ? 'Tăng áp (U₂ > U₁)' : n2 < n1 ? 'Hạ áp (U₂ < U₁)' : 'Biến áp cách li',
        metric3Label: 'Hao phí dây ΔP (P=2kW)',
        metric3Val: `${loss.toFixed(1)} W`,
        note: 'Tăng điện áp lên k lần giúp giảm công suất hao phí ΔP = P²R/U² xuống k² lần!'
      });

      const cx = w * 0.5;
      const cy = h * 0.5;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 22;
      ctx.strokeRect(cx - 80, cy - 55, 160, 110);

      // Coils
      const c1 = Math.max(3, Math.min(12, Math.round(n1 / 200)));
      const c2 = Math.max(3, Math.min(14, Math.round(n2 / 200)));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      for (let i = 0; i < c1; i++) {
        const y = cy - 40 + (i / c1) * 80;
        ctx.beginPath();
        ctx.moveTo(cx - 104, y);
        ctx.lineTo(cx - 56, y);
        ctx.stroke();
      }
      ctx.strokeStyle = '#38bdf8';
      for (let i = 0; i < c2; i++) {
        const y = cy - 42 + (i / c2) * 84;
        ctx.beginPath();
        ctx.moveTo(cx + 56, y);
        ctx.lineTo(cx + 104, y);
        ctx.stroke();
      }
      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`U₁ = ${u1}V (N₁=${n1})`, cx - 140, cy);
      ctx.fillText(`U₂ = ${u2.toFixed(0)}V (N₂=${n2})`, cx + 145, cy);
      return true;
    }

    // 14. LC OSCILLATION
    case 'lc_oscillation': {
      const L = (p.lMh ?? 40) * 1e-3;
      const C = (p.cUf ?? 25) * 1e-6;
      const U0 = p.u0 ?? 10;
      const omega = 1 / Math.sqrt(L * C);
      const T = (2 * Math.PI) / omega;
      const I0 = U0 * Math.sqrt(C / L);
      const W = 0.5 * C * U0 * U0;
      const phase = t * 2.4;
      const wE = W * Math.pow(Math.cos(phase), 2);
      const wM = W - wE;

      pushTelemetry({
        metric1Label: 'Chu kì dao động T = 2π√(LC)',
        metric1Val: `${(T * 1000).toFixed(2)} ms`,
        metric2Label: 'Dòng điện cực đại I₀',
        metric2Val: `${I0.toFixed(2)} A`,
        metric3Label: 'Năng lượng toàn phần W',
        metric3Val: `${(W * 1000).toFixed(2)} mJ`,
        note: 'Năng lượng điện trường tụ C và từ trường cuộn L chuyển hóa tuần hoàn ngược pha nhau với tần số góc 2ω.'
      });

      // Capacitor + Inductor loop
      const cx = w * 0.34;
      const cy = h * 0.5;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 75, cy - 55, 150, 110);
      ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
      ctx.fillRect(cx - 86, cy - 12, 22, 24);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(cx - 90, cy - 14, 30, 4);
      ctx.fillRect(cx - 90, cy + 10, 30, 4);

      // Energy bars on right
      const bx = w * 0.65;
      const by = h * 0.78;
      const bh = h * 0.52;
      const ratioE = W > 0 ? wE / W : 0.5;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(bx, by - ratioE * bh, 42, ratioE * bh);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bx + 68, by - (1 - ratioE) * bh, 42, (1 - ratioE) * bh);

      ctx.fillStyle = textPrimary;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('W_điện', bx + 21, by + 18);
      ctx.fillText('W_từ', bx + 89, by + 18);
      return true;
    }

    // 15. PRISM DISPERSION
    case 'prism_dispersion': {
      const A = p.apexAngle ?? 60;
      const i1 = p.incidenceDeg ?? 45;
      const disp = p.glassDisp ?? 1.0;

      pushTelemetry({
        metric1Label: 'Góc chiết quang A',
        metric1Val: `${A}°`,
        metric2Label: 'Góc tới chùm trắng i₁',
        metric2Val: `${i1}°`,
        metric3Label: 'Thứ tự lệch tia',
        metric3Val: 'Đỏ (ít nhất) → Tím (nhiều nhất)',
        note: 'Chiết suất thủy tinh tăng từ ánh sáng Đỏ (n≈1.51) đến Tím (n≈1.54) làm tách dải quang phổ cầu vồng.'
      });

      const cx = w * 0.44;
      const cy = h * 0.55;
      const halfBase = Math.tan(((A * Math.PI) / 180) / 2) * 110;

      // Prism triangle
      ctx.fillStyle = isDark ? 'rgba(139,92,246,0.16)' : 'rgba(139,92,246,0.12)';
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 75);
      ctx.lineTo(cx - halfBase, cy + 70);
      ctx.lineTo(cx + halfBase, cy + 70);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White beam entering left
      const inY = cy + 25;
      const hitX = cx - halfBase * 0.52;
      const hitY = cy - 4;
      ctx.strokeStyle = isDark ? '#f8fafc' : '#334155';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(40, inY + (i1 - 45) * 0.8);
      ctx.lineTo(hitX, hitY);
      ctx.stroke();

      // Rainbow fan exiting right
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'];
      colors.forEach((col, idx) => {
        const exX = cx + halfBase * 0.52;
        const exY = cy - 2 + idx * 3 * disp;
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(hitX, hitY);
        ctx.lineTo(exX, exY);
        ctx.lineTo(w - 40, exY + (12 + idx * 11) * disp);
        ctx.stroke();
      });
      return true;
    }

    // 16. SPHERICAL MIRROR
    case 'spherical_mirror': {
      const d = p.dObj ?? 180;
      const absF = p.focal ?? 80;
      const convex = Math.round(p.convexMode ?? 0) === 1;
      const f = convex ? -absF : absF;
      const dPrime = Math.abs(d - f) < 1 ? 9999 : (d * f) / (d - f);
      const k = -dPrime / d;

      pushTelemetry({
        metric1Label: 'Vị trí ảnh (d\')',
        metric1Val: Math.abs(dPrime) > 3000 ? 'Ảnh ở vô cực' : `${dPrime.toFixed(1)} cm`,
        metric2Label: 'Độ phóng đại k = -d\'/d',
        metric2Val: `${k.toFixed(2)}×`,
        metric3Label: 'Tính chất ảnh',
        metric3Val: dPrime > 0 ? 'Ảnh THẬT, ngược chiều' : 'Ảnh ẢO, cùng chiều',
        note: convex ? 'Gương cầu lồi luôn tạo ảnh ảo nhỏ hơn vật giúp mở rộng vùng nhìn thấy.' : 'Gương cầu lõm tạo ảnh ảo lớn hơn vật khi đặt vật sát gương (d < f).'
      });

      const mx = w * 0.62;
      const cy = h * 0.54;
      ctx.strokeStyle = surfaceBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(30, cy);
      ctx.lineTo(w - 30, cy);
      ctx.stroke();

      // Mirror arc
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      if (convex) {
        ctx.arc(mx + 140, cy, 140, Math.PI * 0.78, Math.PI * 1.22);
      } else {
        ctx.arc(mx - 140, cy, 140, -Math.PI * 0.22, Math.PI * 0.22);
      }
      ctx.stroke();

      const scale = 0.85;
      const ox = mx - d * scale;
      const oh = 46;
      drawArrow2D(ctx, ox, cy, ox, cy - oh, '#10b981', 'Vật AB');

      const ix = mx - dPrime * scale;
      const ih = oh * k;
      if (Math.abs(dPrime) < 900) {
        drawArrow2D(ctx, Math.max(30, Math.min(w - 30, ix)), cy, Math.max(30, Math.min(w - 30, ix)), cy - ih, dPrime > 0 ? '#f59e0b' : '#a855f7', 'Ảnh A\'B\'');
      }
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(mx - f * scale, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('F', mx - f * scale - 4, cy + 16);
      return true;
    }

    // 17. MALUS POLARIZATION
    case 'malus_polarization': {
      const i0 = p.i0 ?? 100;
      const deg = p.angleDeg ?? 45;
      const rad = (deg * Math.PI) / 180;
      const I = i0 * Math.pow(Math.cos(rad), 2);

      pushTelemetry({
        metric1Label: 'Cường độ sau kính 2 (I)',
        metric1Val: `${I.toFixed(1)} W/m²`,
        metric2Label: 'Hệ số truyền qua cos²θ',
        metric2Val: `${(Math.pow(Math.cos(rad), 2) * 100).toFixed(1)} %`,
        metric3Label: 'Góc lệch trục (θ)',
        metric3Val: `${deg}°`,
        note: 'Định luật Malus: Khi 2 bản phân cực vuông góc (θ = 90°), ánh sáng bị chặn hoàn toàn (I = 0).'
      });

      const cy = h * 0.5;
      // Source & filter 1 & filter 2
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(45, cy);
      ctx.lineTo(w * 0.32, cy);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.32, cy);
      ctx.lineTo(w * 0.64, cy);
      ctx.stroke();

      ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0.08, Math.pow(Math.cos(rad), 2))})`;
      ctx.lineWidth = 2 + Math.pow(Math.cos(rad), 2) * 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.64, cy);
      ctx.lineTo(w - 50, cy);
      ctx.stroke();

      // Draw two polarizer discs
      const drawPol = (x: number, ang: number, label: string) => {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, cy, 18, 52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(x, cy);
        ctx.rotate(ang);
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(0, -34);
        ctx.lineTo(0, 34);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, cy + 72);
      };

      drawPol(w * 0.32, 0, 'Kính phân cực 1 (0°)');
      drawPol(w * 0.64, rad, `Kính phân tích 2 (${deg}°)`);
      return true;
    }

    // 18. HYDROGEN SPECTRUM
    case 'hydrogen_spectrum': {
      const m = Math.max(2, Math.round(p.mUpper ?? 3));
      const n = Math.min(m - 1, Math.max(1, Math.round(p.nLower ?? 2)));
      const dE = 13.6 * (1 / (n * n) - 1 / (m * m));
      const lambdaNm = 1240 / dE;
      const series = n === 1 ? 'Dãy Lyman (Tử ngoại)' : n === 2 ? 'Dãy Balmer (Khả kiến)' : 'Dãy Paschen (Hồng ngoại)';

      pushTelemetry({
        metric1Label: 'Năng lượng photon (ε)',
        metric1Val: `${dE.toFixed(2)} eV`,
        metric2Label: 'Bước sóng phát ra (λ)',
        metric2Val: `${lambdaNm.toFixed(1)} nm`,
        metric3Label: 'Vùng quang phổ',
        metric3Val: series,
        note: `Electron nhảy từ mức E_${m} xuống E_${n} phát ra đúng 1 photon mang năng lượng hf = E_${m} − E_${n}.`
      });

      const leftX = w * 0.25;
      const rightX = w * 0.85;
      for (let lvl = 1; lvl <= 6; lvl++) {
        const y = h * 0.84 - (1 - 1 / (lvl * lvl)) * (h * 0.66);
        ctx.strokeStyle = lvl === m || lvl === n ? '#f59e0b' : surfaceBorder;
        ctx.lineWidth = lvl === m || lvl === n ? 2.6 : 1.3;
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`n=${lvl} (${(-13.6 / (lvl * lvl)).toFixed(2)} eV)`, leftX - 10, y + 4);
      }

      const ym = h * 0.84 - (1 - 1 / (m * m)) * (h * 0.66);
      const yn = h * 0.84 - (1 - 1 / (n * n)) * (h * 0.66);
      const arrowX = (leftX + rightX) * 0.5;
      const col = lambdaNm < 390 ? '#a855f7' : lambdaNm < 490 ? '#06b6d4' : lambdaNm < 590 ? '#22c55e' : lambdaNm < 760 ? '#ef4444' : '#f97316';
      drawArrow2D(ctx, arrowX, ym, arrowX, yn, col, `λ = ${lambdaNm.toFixed(0)} nm`);
      return true;
    }

    // 19. PV THERMODYNAMICS
    case 'pv_thermodynamics': {
      const proc = Math.round(p.processType ?? 0);
      const p1 = p.pStart ?? 2.0;
      const v1 = p.vStart ?? 4.0;
      const ratio = p.ratio ?? 2.0;
      let workKJ = 0;
      if (proc === 0) workKJ = p1 * 101.3 * v1 * 1e-3 * Math.log(ratio);
      else if (proc === 1) workKJ = p1 * 101.3 * (v1 * (ratio - 1)) * 1e-3;

      pushTelemetry({
        metric1Label: 'Quá trình nhiệt động',
        metric1Val: proc === 0 ? 'Đẳng nhiệt (T=const)' : proc === 1 ? 'Đẳng áp (p=const)' : 'Đẳng tích (V=const)',
        metric2Label: 'Công khối khí sinh (|A|)',
        metric2Val: `${workKJ.toFixed(3)} kJ`,
        metric3Label: 'Đặc trưng đồ thị',
        metric3Val: proc === 0 ? 'Đường Hypebol' : proc === 1 ? 'Đoạn ngang song song V' : 'Đoạn thẳng đứng',
        note: 'Diện tích phần tô màu dưới đồ thị p–V chính là độ lớn công cơ học do khối khí thực hiện!'
      });

      const gx = 75;
      const gy = h * 0.82;
      const gw = w - 135;
      const gh = h * 0.6;
      ctx.strokeStyle = surfaceBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + gw, gy);
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy - gh);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = 'rgba(56,189,248,0.22)';
      ctx.lineWidth = 3;
      const toX = (v: number) => gx + (v / 24) * gw;
      const toY = (pr: number) => gy - (pr / 5) * gh;

      if (proc === 0) {
        ctx.beginPath();
        const v2 = v1 * ratio;
        ctx.moveTo(toX(v1), gy);
        for (let i = 0; i <= 50; i++) {
          const vv = v1 + (i / 50) * (v2 - v1);
          const pp = (p1 * v1) / vv;
          ctx.lineTo(toX(vv), toY(pp));
        }
        ctx.lineTo(toX(v2), gy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (proc === 1) {
        const v2 = v1 * ratio;
        ctx.fillRect(toX(v1), toY(p1), toX(v2) - toX(v1), gy - toY(p1));
        ctx.beginPath();
        ctx.moveTo(toX(v1), toY(p1));
        ctx.lineTo(toX(v2), toY(p1));
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(toX(v1), toY(p1));
        ctx.lineTo(toX(v1), toY(Math.min(4.8, p1 * ratio)));
        ctx.stroke();
      }
      return true;
    }

    // 20. CALORIMETRY MIXING
    case 'calorimetry_mixing': {
      const m1 = p.mHot ?? 2.0;
      const t1 = p.tHot ?? 85;
      const m2 = p.mCold ?? 3.0;
      const t2 = p.tCold ?? 20;
      const tEq = (m1 * t1 + m2 * t2) / (m1 + m2);
      const qEx = m1 * 4180 * (t1 - tEq) * 1e-3;
      const prog = Math.min(1, (t % 5.0) / 3.5);
      const curT1 = t1 - (t1 - tEq) * prog;
      const curT2 = t2 + (tEq - t2) * prog;

      pushTelemetry({
        metric1Label: 'Nhiệt độ cân bằng (t_cb)',
        metric1Val: `${tEq.toFixed(1)} °C`,
        metric2Label: 'Nhiệt lượng trao đổi Q',
        metric2Val: `${qEx.toFixed(1)} kJ`,
        metric3Label: 'Trạng thái trộn',
        metric3Val: prog >= 0.99 ? 'Đã cân bằng nhiệt' : 'Đang truyền nhiệt...',
        note: 'Phương trình cân bằng nhiệt Q_tỏa = Q_thu: Nước nóng hạ xuống, nước lạnh tăng lên cùng đạt t_cb.'
      });

      const drawBeaker = (cx: number, label: string, temp: number, col: string) => {
        ctx.strokeStyle = surfaceBorder;
        ctx.lineWidth = 3;
        ctx.strokeRect(cx - 42, h * 0.34, 84, 110);
        ctx.fillStyle = col;
        ctx.fillRect(cx - 40, h * 0.34 + 34, 80, 74);
        ctx.fillStyle = textPrimary;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, h * 0.34 - 12);
        ctx.fillText(`${temp.toFixed(1)}°C`, cx, h * 0.34 + 132);
      };

      drawBeaker(w * 0.25, `Nước nóng (${m1}kg)`, curT1, 'rgba(244,63,94,0.45)');
      drawBeaker(w * 0.5, `Hỗn hợp cân bằng`, (curT1 * m1 + curT2 * m2) / (m1 + m2), 'rgba(245,158,11,0.45)');
      drawBeaker(w * 0.75, `Nước lạnh (${m2}kg)`, curT2, 'rgba(56,189,248,0.45)');
      return true;
    }

    // 21. BERNOULLI FLOW
    case 'bernoulli_flow': {
      const v1 = p.v1 ?? 2.0;
      const d1 = p.d1Cm ?? 10;
      const d2 = p.d2Cm ?? 5;
      const v2 = v1 * Math.pow(d1 / d2, 2);
      const dp = 0.5 * 1000 * (v2 * v2 - v1 * v1);

      pushTelemetry({
        metric1Label: 'Vận tốc chỗ thắt (v₂)',
        metric1Val: `${v2.toFixed(2)} m/s`,
        metric2Label: 'Độ sụt áp suất (p₁ − p₂)',
        metric2Val: `${(dp / 1000).toFixed(2)} kPa`,
        metric3Label: 'Lưu lượng Q = A·v',
        metric3Val: `${((Math.PI * d1 * d1) / 4 * 1e-4 * v1 * 1000).toFixed(2)} L/s`,
        note: 'Định luật Bernoulli: Nơi tiết diện thu hẹp, dòng chất lỏng chảy xiết hơn nên áp suất tĩnh giảm xuống.'
      });

      const cy = h * 0.58;
      const r1 = d1 * 4.5;
      const r2 = d2 * 4.5;
      ctx.fillStyle = isDark ? 'rgba(14,165,233,0.22)' : 'rgba(14,165,233,0.18)';
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(40, cy - r1);
      ctx.lineTo(w * 0.35, cy - r1);
      ctx.lineTo(w * 0.45, cy - r2);
      ctx.lineTo(w * 0.58, cy - r2);
      ctx.lineTo(w * 0.68, cy - r1);
      ctx.lineTo(w - 40, cy - r1);
      ctx.lineTo(w - 40, cy + r1);
      ctx.lineTo(w * 0.68, cy + r1);
      ctx.lineTo(w * 0.58, cy + r2);
      ctx.lineTo(w * 0.45, cy + r2);
      ctx.lineTo(w * 0.35, cy + r1);
      ctx.lineTo(40, cy + r1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pressure gauge columns
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(w * 0.22, cy - r1 - 75, 16, 75);
      const h2 = Math.max(12, 75 - dp * 0.0025);
      ctx.fillRect(w * 0.51, cy - r2 - h2, 16, h2);

      // Moving fluid tracer dots
      for (let i = 0; i < 12; i++) {
        const x = 50 + ((t * v1 * 38 + i * 55) % (w - 100));
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(x, cy + ((i % 3) - 1) * (r2 * 0.45), 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      return true;
    }

    // 22. NUCLEAR FISSION
    case 'nuclear_fission': {
      const enrich = p.enrichment ?? 65;
      const rod = p.controlRod ?? 45;
      const kEff = Math.max(0.15, (enrich / 55) * (1 - rod / 100) * 1.45);
      const status = kEff > 1.08 ? 'VƯỢT TỚI HẠN (k > 1)' : kEff < 0.92 ? 'DƯỚI TỚI HẠN (k < 1)' : 'ỔN ĐỊNH TỚI HẠN (k ≈ 1)';

      pushTelemetry({
        metric1Label: 'Hệ số nhân nơtron (k)',
        metric1Val: `${kEff.toFixed(2)}`,
        metric2Label: 'Năng lượng mỗi phân hạch',
        metric2Val: '≈ 200 MeV',
        metric3Label: 'Trạng thái phản ứng',
        metric3Val: status,
        note: 'Thanh điều khiển Bo/Cadimi hấp thụ bớt nơtron dư để giữ hệ số nhân k ≈ 1 trong lò phản ứng hạt nhân.'
      });

      const cx = w * 0.5;
      const cy = h * 0.5;
      // Control rods descending from top
      const rodDepth = (rod / 100) * (h * 0.55);
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 75, 22, 12, rodDepth);
      ctx.fillRect(cx + 63, 22, 12, rodDepth);

      // U-235 nuclei grid
      for (let ix = -2; ix <= 2; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          const nx = cx + ix * 78;
          const ny = cy + iy * 72;
          const hit = Math.sin(t * 2.5 + ix * 1.3 + iy) > 0.4 && kEff > 0.7;
          ctx.fillStyle = hit ? '#f59e0b' : '#10b981';
          ctx.beginPath();
          ctx.arc(nx, ny, hit ? 14 : 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('U235', nx, ny + 3);
        }
      }

      // Fast neutrons flying
      const count = Math.min(20, Math.round(kEff * 10));
      for (let i = 0; i < count; i++) {
        const ang = (i * 1.9) + t * 3.1;
        const rad = ((t * 95 + i * 28) % 210);
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * rad * 0.65;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      return true;
    }

    default:
      return false;
  }
}
