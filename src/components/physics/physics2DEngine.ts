import { PhysicsSimType } from '../../types';
import { renderExtra2DPhysicsSim } from './physics2DExtraRenderer';

export interface Physics2DOverlayState {
  showRulerGrid: boolean;
  showVectors: boolean;
  showTrace: boolean;
  showRealtimeChart: boolean;
}

export interface Physics2DFlags {
  circuitOpen: boolean;
  reversePolarity: boolean;
  showVoltmeter: boolean;
  isDiverging: boolean;
  showThirdRay: boolean;
  airDrag: boolean;
  hasFriction: boolean;
  singleSource: boolean;
  showNodalLines: boolean;
  flipMagnet: boolean;
  inductionAction: number; // 0: Dao động | 1: Đưa vào | 2: Rút ra | 3: Đứng yên
  showProtractor: boolean;
  showFieldGrid: boolean;
  showElectrons?: boolean;
}

export interface Physics2DTelemetry {
  metric1Label: string;
  metric1Val: string;
  metric2Label: string;
  metric2Val: string;
  metric3Label: string;
  metric3Val: string;
  note: string;
}

export const DEFAULT_PHYSICS_2D_OVERLAYS: Physics2DOverlayState = {
  showRulerGrid: true,
  showVectors: true,
  showTrace: true,
  showRealtimeChart: true
};

export const DEFAULT_PHYSICS_2D_FLAGS: Physics2DFlags = {
  circuitOpen: false,
  reversePolarity: false,
  showVoltmeter: true,
  isDiverging: false,
  showThirdRay: true,
  airDrag: false,
  hasFriction: false,
  singleSource: false,
  showNodalLines: true,
  flipMagnet: false,
  inductionAction: 0,
  showProtractor: true,
  showFieldGrid: true,
  showElectrons: false
};

export interface Physics2DRenderOptions {
  simType: PhysicsSimType;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
  isDark: boolean;
  isRunning: boolean;
  params: Record<string, number>;
  flags: Physics2DFlags;
  overlays: Physics2DOverlayState;
  oscHistory: number[];
  pushTelemetry: (next: Physics2DTelemetry) => void;
}

type DrawCtx = Physics2DRenderOptions;

// Helper: visible light wavelength (nm) -> CSS rgb
function wavelengthToColor(nm: number): string {
  let r = 0,
    g = 0,
    b = 0;
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm >= 440 && nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm >= 490 && nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else if (nm >= 645 && nm <= 780) {
    r = 1;
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

// 1. Ohm's Law Circuit (Lớp 9 & 11)
function drawOhmCircuit({ ctx, w, h, t, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const rawU = Number.isFinite(p.voltage) ? p.voltage : 12;
  const effReverse = rawU < 0 ? !flags.reversePolarity : flags.reversePolarity;
  const U = Math.abs(rawU);
  const R1 = Math.max(0.01, Number.isFinite(p.r1 ?? p.resistor1) ? (p.r1 ?? p.resistor1) : 10);
  const R2 = Math.max(0.01, Number.isFinite(p.r2 ?? p.resistor2) ? (p.r2 ?? p.resistor2) : 10);
  const isParallel = Math.round(p.circuitType ?? p.circuitMode ?? 0) === 1;
  const isOpen = flags.circuitOpen;
  const showElectrons = Boolean(flags.showElectrons);

  // Quy ước chiều dòng điện I: RA từ cực dương (+) -> qua mạch ngoài -> VÀO cực âm (-).
  // !effReverse: (+) bên TRÁI, (-) bên PHẢI => I ra trái từ (+) -> xuống Đèn -> phải qua R -> lên Ampe kế -> trái vào (-) [CCW = -1]
  // effReverse: (+) bên PHẢI, (-) bên TRÁI => I ra phải từ (+) -> qua K -> xuống Ampe kế -> trái qua R -> lên Đèn -> phải vào (-) [CW = +1]
  const conventionalDir: 1 | -1 = effReverse ? 1 : -1;

  const R_eq = isParallel ? (R1 * R2) / Math.max(0.01, R1 + R2) : R1 + R2;
  const I = isOpen ? 0 : U / Math.max(0.01, R_eq);
  const I1 = isOpen ? 0 : isParallel ? U / R1 : I;
  const I2 = isOpen ? 0 : isParallel ? U / R2 : I;
  const P = U * I;
  const U1 = isOpen ? 0 : isParallel ? U : I * R1;
  const U2 = isOpen ? 0 : isParallel ? U : I * R2;

  const fmtOhm = (val: number) => (Number.isInteger(val) ? `${val}` : val.toFixed(1));
  const fmtVolt = (val: number) => (Number.isInteger(val) ? `${val}` : val.toFixed(1));
  const dirLabel = conventionalDir === -1 ? 'Ngược KĐH: (+) trái → Đèn → R → Ampe kế → (−) phải' : 'Thuận KĐH: (+) phải → K → Ampe kế → R → Đèn → (−) trái';

  pushTelemetry({
    metric1Label: 'Điện trở tương đương (Rtđ)',
    metric1Val: `${R_eq.toFixed(2)} Ω`,
    metric2Label: 'Cường độ dòng (I)',
    metric2Val: isOpen ? '0.00 A (Mở K)' : `${I.toFixed(2)} A`,
    metric3Label: 'Công suất tiêu thụ (P)',
    metric3Val: `${P.toFixed(2)} W`,
    note: isOpen
      ? 'Khóa K đang MỞ: Mạch hở nên I = 0 A, đèn tắt, không có dòng điện chạy qua.'
      : isParallel
      ? `Mạch song song · Dòng I: ${dirLabel} · I₁ = ${I1.toFixed(2)} A, I₂ = ${I2.toFixed(2)} A, U₁ = U₂ = ${U.toFixed(1)} V.`
      : `Mạch nối tiếp · Dòng I: ${dirLabel} · U₁ = ${U1.toFixed(1)} V, U₂ = ${U2.toFixed(1)} V.`
  });

  // Ensure generous top/bottom/side margins so battery U label, I1/I2, Ammeter & legend NEVER clip
  const topMargin = 42;
  const botMargin = isParallel ? 48 : 34;
  const availH = Math.max(96, h - topMargin - botMargin);
  const ch = Math.min(availH, 230);
  const top = topMargin + (availH - ch) / 2;
  const bottom = top + ch;
  const cy = (top + bottom) / 2;

  const sideMargin = 66;
  const cw = Math.min(Math.max(210, w - sideMargin * 2), 460);
  const cx = w / 2;
  const left = cx - cw / 2;
  const right = cx + cw / 2;

  const wireColor = isOpen ? '#64748b' : isDark ? '#38bdf8' : '#0284c7';
  ctx.strokeStyle = wireColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const swX1 = cx + cw * 0.22;
  const swX2 = cx + cw * 0.36;

  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(swX1, top);
  if (!isOpen) {
    ctx.lineTo(right, top);
  } else {
    ctx.moveTo(swX2, top);
    ctx.lineTo(right, top);
  }
  ctx.lineTo(right, bottom);
  ctx.lineTo(left, bottom);
  ctx.closePath();
  ctx.stroke();

  const jLeft = cx - Math.min(80, cw * 0.22);
  const jRight = cx + Math.min(80, cw * 0.22);

  if (isParallel) {
    ctx.strokeStyle = wireColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(jLeft, bottom);
    ctx.lineTo(jLeft, bottom - 34);
    ctx.lineTo(jRight, bottom - 34);
    ctx.lineTo(jRight, bottom);
    ctx.stroke();
  }

  const drawArrowHead = (x: number, y: number, angle: number, color: string, size = 6.5) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.8, -size * 0.65);
    ctx.lineTo(-size * 0.45, 0);
    ctx.lineTo(-size * 0.8, size * 0.65);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Switch K on top-right
  ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
  ctx.fillRect(swX1, top - 14, swX2 - swX1, 24);
  ctx.strokeStyle = isOpen ? '#ef4444' : '#10b981';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(swX1, top);
  if (isOpen) {
    ctx.lineTo(swX2 - 4, top - 18);
  } else {
    ctx.lineTo(swX2, top);
  }
  ctx.stroke();
  ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isOpen ? 'K (Mở)' : 'K (Đóng)', (swX1 + swX2) / 2, top + 16);

  const batCx = cx - 22;
  const batGapHalf = 22;

  // Helper to sample position & tangent angle along an arbitrary polyline
  const samplePolyline = (pts: [number, number][], fracRaw: number): { x: number; y: number; ang: number } => {
    const frac = ((fracRaw % 1) + 1) % 1;
    let total = 0;
    const lens: number[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      lens.push(l);
      total += l;
    }
    let d = frac * total;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) {
        const segFrac = lens[i] > 0 ? d / lens[i] : 0;
        const dx = pts[i + 1][0] - pts[i][0];
        const dy = pts[i + 1][1] - pts[i][1];
        return {
          x: pts[i][0] + dx * segFrac,
          y: pts[i][1] + dy * segFrac,
          ang: Math.atan2(dy, dx)
        };
      }
      d -= lens[i];
    }
    return { x: pts[0][0], y: pts[0][1], ang: 0 };
  };

  if (!isOpen && I > 0.005) {
    const posTerminalX = batCx + (effReverse ? 10 : -10);
    const negTerminalX = batCx + (effReverse ? -10 : 10);

    // Outer loop path ordered in the EXACT direction of Conventional Current I: (+) -> mạch ngoài -> (-)
    const outerPathI: [number, number][] = !effReverse
      ? [
          [posTerminalX, top],
          [left, top],
          [left, bottom],
          [right, bottom],
          [right, top],
          [negTerminalX, top]
        ]
      : [
          [posTerminalX, top],
          [right, top],
          [right, bottom],
          [left, bottom],
          [left, top],
          [negTerminalX, top]
        ];

    const speedNorm = Math.min(0.45, Math.max(0.06, I * 0.065));

    // 1. Animated Current Flow Pulses & Directional Chevrons strictly (+) -> (-)
    if (!isParallel) {
      const pulseCount = 14;
      for (let i = 0; i < pulseCount; i++) {
        const pt = samplePolyline(outerPathI, t * speedNorm + i / pulseCount);
        if (Math.abs(pt.y - top) < 4 && Math.abs(pt.x - batCx) < batGapHalf) continue;
        // Skip directly inside Lamp center or Ammeter center
        if (Math.hypot(pt.x - left, pt.y - cy) < 15) continue;
        if (Math.hypot(pt.x - right, pt.y - cy) < 25) continue;
        drawArrowHead(pt.x, pt.y, pt.ang, '#10b981', 6.5);
      }
    } else {
      // Main wires outside parallel junction [jLeft, jRight]
      const preJunctionPts: [number, number][] = !effReverse
        ? [
            [posTerminalX, top],
            [left, top],
            [left, bottom],
            [jLeft, bottom]
          ]
        : [
            [posTerminalX, top],
            [right, top],
            [right, bottom],
            [jRight, bottom]
          ];
      const postJunctionPts: [number, number][] = !effReverse
        ? [
            [jRight, bottom],
            [right, bottom],
            [right, top],
            [negTerminalX, top]
          ]
        : [
            [jLeft, bottom],
            [left, bottom],
            [left, top],
            [negTerminalX, top]
          ];

      for (let i = 0; i < 6; i++) {
        const frac = (t * speedNorm * 1.8 + i / 6) % 1;
        const p1 = samplePolyline(preJunctionPts, frac);
        if (Math.hypot(p1.x - left, p1.y - cy) >= 15 && Math.hypot(p1.x - right, p1.y - cy) >= 25) {
          drawArrowHead(p1.x, p1.y, p1.ang, '#10b981', 6.5);
        }
        const p2 = samplePolyline(postJunctionPts, frac);
        if (Math.hypot(p2.x - left, p2.y - cy) >= 15 && Math.hypot(p2.x - right, p2.y - cy) >= 25) {
          drawArrowHead(p2.x, p2.y, p2.ang, '#10b981', 6.5);
        }
      }

      // Branch 1 (R1) pulses: strictly from entry junction to exit junction
      const b1Pts: [number, number][] = !effReverse
        ? [
            [jLeft, bottom],
            [jRight, bottom]
          ]
        : [
            [jRight, bottom],
            [jLeft, bottom]
          ];
      const b1Speed = Math.min(0.8, Math.max(0.12, I1 * 0.14));
      for (let i = 0; i < 3; i++) {
        const pt = samplePolyline(b1Pts, t * b1Speed + i / 3);
        if (Math.abs(pt.x - cx) < 35) continue;
        drawArrowHead(pt.x, pt.y, pt.ang, '#10b981', 6);
      }

      // Branch 2 (R2) pulses: strictly from entry junction up -> across R2 -> down to exit junction
      const b2Pts: [number, number][] = !effReverse
        ? [
            [jLeft, bottom],
            [jLeft, bottom - 34],
            [jRight, bottom - 34],
            [jRight, bottom]
          ]
        : [
            [jRight, bottom],
            [jRight, bottom - 34],
            [jLeft, bottom - 34],
            [jLeft, bottom]
          ];
      const b2Speed = Math.min(0.8, Math.max(0.12, I2 * 0.14));
      for (let i = 0; i < 4; i++) {
        const pt = samplePolyline(b2Pts, t * b2Speed + i / 4);
        if (Math.abs(pt.y - (bottom - 34)) < 3 && Math.abs(pt.x - cx) < 35) continue;
        drawArrowHead(pt.x, pt.y, pt.ang, '#10b981', 6);
      }
    }

    // 2. Optional Free Electron overlay (e-): ONLY drawn when explicitly toggled ON, moving (-) -> (+)
    if (showElectrons) {
      const electronPath: [number, number][] = [...outerPathI].reverse();
      const eCount = 16;
      for (let i = 0; i < eCount; i++) {
        const pt = samplePolyline(electronPath, t * speedNorm + i / eCount);
        if (Math.abs(pt.y - top) < 4 && Math.abs(pt.x - batCx) < batGapHalf) continue;
        if (Math.hypot(pt.x - left, pt.y - cy) < 15) continue;
        if (Math.hypot(pt.x - right, pt.y - cy) < 25) continue;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // Crisp text badge showing conventional current I direction right outside (+) pole
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    const topLeftMidX = (left + (batCx - batGapHalf)) / 2;
    const badgeX = topLeftMidX > left + 22 ? topLeftMidX : left + 34;
    ctx.fillText(conventionalDir === -1 ? '← Chiều I' : 'Chiều I →', badgeX, top - 11);
  }

  // Battery symbol (clear gap on top wire)
  const batW = 46;
  ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
  ctx.fillRect(batCx - batW / 2, top - 17, batW, 34);

  const posOffset = effReverse ? 10 : -10;
  const negOffset = effReverse ? -10 : 10;

  // Long plate (+)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(batCx + posOffset, top - 15);
  ctx.lineTo(batCx + posOffset, top + 15);
  ctx.stroke();

  // Short plate (-)
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(batCx + negOffset, top - 9);
  ctx.lineTo(batCx + negOffset, top + 9);
  ctx.stroke();

  // Explicit (+) and (-) marks right beside plates
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('+', batCx + posOffset + (posOffset < 0 ? -12 : 12), top - 10);
  ctx.fillStyle = '#3b82f6';
  ctx.fillText('−', batCx + negOffset + (negOffset < 0 ? -12 : 12), top - 10);

  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 11.5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Nguồn U = ${fmtVolt(U)}V`, batCx, top - 24);

  if (!isParallel) {
    const drawResistorBox = (rx: number, ry: number, label: string, rVal: number) => {
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(rx - 36, ry - 14, 72, 28);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - 36, ry - 14, 72, 28);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${label}:${fmtOhm(rVal)}Ω`, rx, ry + 4);
    };

    drawResistorBox(cx - 64, bottom, 'R₁', R1);
    drawResistorBox(cx + 64, bottom, 'R₂', R2);

    if (flags.showVoltmeter) {
      const vx = cx - 64;
      const vy = Math.max(top + 32, bottom - 48);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(vx - 40, bottom);
      ctx.lineTo(vx - 40, vy);
      ctx.lineTo(vx + 40, vy);
      ctx.lineTo(vx + 40, bottom);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#1e293b' : '#f3e8ff';
      ctx.beginPath();
      ctx.arc(vx, vy, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 10.5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`V:${U1.toFixed(1)}`, vx, vy + 4);
    }
  } else {
    // Junction dots for parallel circuit
    ctx.fillStyle = wireColor;
    [jLeft, jRight].forEach((jx) => {
      ctx.beginPath();
      ctx.arc(jx, bottom, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    const drawResistorBox = (rx: number, ry: number, label: string, rVal: number) => {
      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(rx - 34, ry - 12, 68, 24);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - 34, ry - 12, 68, 24);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${label}=${fmtOhm(rVal)}Ω`, rx, ry + 3.5);
    };

    drawResistorBox(cx, bottom, 'R₁', R1);
    drawResistorBox(cx, bottom - 34, 'R₂', R2);

    // Branch current labels I1 & I2
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`I₁=${I1.toFixed(2)}A`, cx, bottom + 21);
    ctx.fillText(`I₂=${I2.toFixed(2)}A`, cx, bottom - 49);

    if (flags.showVoltmeter) {
      const vy = Math.max(top + 32, bottom - 76);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(jLeft, bottom - 34);
      ctx.lineTo(jLeft, vy);
      ctx.lineTo(jRight, vy);
      ctx.lineTo(jRight, bottom - 34);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#1e293b' : '#f3e8ff';
      ctx.beginPath();
      ctx.arc(cx, vy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${U1.toFixed(1)}V`, cx, vy + 3.5);
    }
  }

  // Ammeter on right wire
  ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
  ctx.beginPath();
  ctx.arc(right, cy, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10.5px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${I.toFixed(2)}A`, right, cy + 4);
  ctx.font = 'bold 9.5px sans-serif';
  ctx.fillText('Ampe kế', right, cy + 35);

  // Lamp on left wire
  if (!isOpen && P > 0.05) {
    const glowRadius = Math.min(30 + P * 1.4, 58);
    const lampGrad = ctx.createRadialGradient(left, cy, 5, left, cy, glowRadius);
    lampGrad.addColorStop(0, 'rgba(250, 204, 21, 0.9)');
    lampGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.arc(left, cy, glowRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = isOpen || U <= 0.01 ? '#64748b' : '#fbbf24';
  ctx.beginPath();
  ctx.arc(left, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isOpen || U <= 0.01 ? '#475569' : '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = isOpen || U <= 0.01 ? '#f8fafc' : '#78350f';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Đèn', left, cy + 4);

  // Bottom Legend Bar (always stays inside canvas)
  ctx.font = 'bold 10.5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
  const legendY = h - 8;
  ctx.fillText(
    showElectrons
      ? 'Dòng điện I (mũi tên xanh): Ra (+) → Vào (−)  |  Electron e⁻ (hạt vàng): (−) → (+)'
      : 'Chiều dòng điện quy ước I (mũi tên xanh): Ra từ cực dương (+) → Vào cực âm (−)',
    cx,
    legendY
  );
}

// 2. Converging / Diverging Lens (Lớp 9 & Chuyên)
function drawLensOptics({ ctx, w, h, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const fRaw = Math.max(1, Math.abs(p.f ?? p.focalLength ?? 15));
  const f = flags.isDiverging ? -fRaw : fRaw;
  const d = Math.max(0.5, p.d ?? p.objectDistance ?? 35);
  const hObj = Math.max(0.5, p.objH ?? p.objectHeight ?? 10);

  const isAtFocal = Math.abs(d - f) < 0.15;
  const dPrime = isAtFocal ? 999999 : (d * f) / (d - f);
  const k = isAtFocal ? 0 : -dPrime / d;
  const hPrime = isAtFocal ? 0 : k * hObj;

  pushTelemetry({
    metric1Label: "Vị trí ảnh (d')",
    metric1Val: isAtFocal ? 'Vô cực (∞)' : `${dPrime.toFixed(1)} cm`,
    metric2Label: 'Số phóng đại (k)',
    metric2Val: isAtFocal ? '∞' : `${k.toFixed(2)}x`,
    metric3Label: "Chiều cao ảnh (A'B')",
    metric3Val: isAtFocal ? '∞' : `${Math.abs(hPrime).toFixed(1)} cm`,
    note: flags.isDiverging
      ? 'Thấu kính phân kì (f < 0): Luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật.'
      : isAtFocal
      ? 'Vật đặt tại tiêu điểm F (d = f): Chùm tia ló song song, ảnh ở vô cực.'
      : dPrime > 0
      ? 'Thấu kính hội tụ: Ảnh thật, ngược chiều, hứng được trên màn chắn phía sau.'
      : 'Thấu kính hội tụ (d < f): Ảnh ảo cùng chiều, lớn hơn vật (kính lúp).'
  });

  const s = Math.min(1, w / 560, h / 320);
  const maxSpan = Math.max(30, Math.abs(d), isAtFocal ? fRaw * 2 : Math.min(140, Math.abs(dPrime)));
  const scale = Math.min(5.5 * s, (w * 0.42) / maxSpan);
  const lensHalfH = 128 * s;
  const cx = w / 2;
  const cy = h / 2;

  ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(20, cy);
  ctx.lineTo(w - 20, cy);
  ctx.stroke();
  ctx.setLineDash([]);

  if (ov.showRulerGrid) {
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let cm = -80; cm <= 80; cm += 10) {
      if (cm === 0) continue;
      const tx = cx + cm * scale;
      if (tx > 25 && tx < w - 25) {
        ctx.beginPath();
        ctx.moveTo(tx, cy - 3);
        ctx.lineTo(tx, cy + 3);
        ctx.stroke();
        if (cm % 20 === 0) ctx.fillText(`${Math.abs(cm)}`, tx, cy + 13);
      }
    }
  }

  ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy - lensHalfH);
  ctx.lineTo(cx, cy + lensHalfH);
  ctx.stroke();

  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  if (!flags.isDiverging) {
    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy - lensHalfH + 10 * s);
    ctx.lineTo(cx, cy - lensHalfH - 4 * s);
    ctx.lineTo(cx + 8 * s, cy - lensHalfH + 10 * s);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy + lensHalfH - 10 * s);
    ctx.lineTo(cx, cy + lensHalfH + 4 * s);
    ctx.lineTo(cx + 8 * s, cy + lensHalfH - 10 * s);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy - lensHalfH - 4 * s);
    ctx.lineTo(cx, cy - lensHalfH + 10 * s);
    ctx.lineTo(cx + 8 * s, cy - lensHalfH - 4 * s);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 8 * s, cy + lensHalfH + 4 * s);
    ctx.lineTo(cx, cy + lensHalfH - 10 * s);
    ctx.lineTo(cx + 8 * s, cy + lensHalfH + 4 * s);
    ctx.fill();
  }

  const fPix = fRaw * scale;
  const leftFocusX = cx - fPix;
  const rightFocusX = cx + fPix;

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(leftFocusX, cy, 4, 0, Math.PI * 2);
  ctx.arc(rightFocusX, cy, 4, 0, Math.PI * 2);
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('O', cx + 8, cy + 15);
  ctx.fillText(flags.isDiverging ? "F'" : 'F', leftFocusX, cy - 10);
  ctx.fillText(flags.isDiverging ? 'F' : "F'", rightFocusX, cy - 10);

  const objX = cx - d * scale;
  const objY = cy - hObj * scale;

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(objX, cy);
  ctx.lineTo(objX, objY);
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(objX - 6, objY + 8);
  ctx.lineTo(objX, objY - 2);
  ctx.lineTo(objX + 6, objY + 8);
  ctx.fill();
  ctx.fillText('B (Vật)', objX, objY - 10);

  if (!isAtFocal && Math.abs(dPrime) < 220) {
    const imgX = cx + dPrime * scale;
    const imgY = cy - hPrime * scale;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    if (dPrime < 0) ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(imgX, cy);
    ctx.lineTo(imgX, imgY);
    ctx.stroke();
    ctx.setLineDash([]);

    const arrowDir = hPrime < 0 ? 1 : -1;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(imgX - 5, imgY - arrowDir * 6);
    ctx.lineTo(imgX, imgY + arrowDir * 2);
    ctx.lineTo(imgX + 5, imgY - arrowDir * 6);
    ctx.fill();
    ctx.fillText(dPrime > 0 ? "B' (Thật)" : "B' (Ảo)", imgX, imgY + (hPrime < 0 ? 18 : -10));

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(cx, objY);
    if (dPrime > 0) {
      ctx.lineTo(imgX, imgY);
    } else {
      const slope = flags.isDiverging
        ? (objY - cy) / (cx - leftFocusX)
        : (cy - objY) / (rightFocusX - cx);
      ctx.lineTo(w - 20, objY + slope * (w - 20 - cx));
    }
    ctx.stroke();

    if (dPrime < 0) {
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, objY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(dPrime > 0 ? imgX : w - 20, dPrime > 0 ? imgY : cy + ((cy - objY) / (cx - objX)) * (w - 20 - cx));
    ctx.stroke();

    if (flags.showThirdRay && !flags.isDiverging) {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(cx, imgY);
      if (dPrime > 0) {
        ctx.lineTo(imgX, imgY);
      } else {
        ctx.lineTo(w - 20, imgY);
      }
      ctx.stroke();
      if (dPrime < 0) {
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, imgY);
        ctx.lineTo(imgX, imgY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }
}

// 3. Projectile Motion (Lớp 10 & Chuyên)
function drawProjectile({ ctx, w, h, t, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const v0 = Math.max(0.5, p.v0 ?? p.initialVelocity ?? 25);
  const alphaDeg = p.angle ?? p.launchAngle ?? p.angleDeg ?? 45;
  const alphaRad = (alphaDeg * Math.PI) / 180;
  const g = Math.max(0.2, p.g ?? p.gravity ?? 9.8);
  const h0 = Math.max(0, p.h0 ?? p.height ?? 0);

  const v0x = v0 * Math.cos(alphaRad);
  const v0y = v0 * Math.sin(alphaRad);
  const dragCoeff = flags.airDrag ? 0.16 : 0;

  const delta = v0y * v0y + 2 * g * h0;
  const tVac = (v0y + Math.sqrt(Math.max(0, delta))) / g;
  const tTotal = flags.airDrag ? tVac * 0.92 : tVac;
  const posAt = (tt: number) => {
    if (!flags.airDrag) {
      return {
        x: v0x * tt,
        y: Math.max(0, h0 + v0y * tt - 0.5 * g * tt * tt),
        vx: v0x,
        vy: v0y - g * tt
      };
    }
    const k = dragCoeff;
    const expFactor = (1 - Math.exp(-k * tt)) / k;
    const xDrag = v0x * expFactor;
    const yDrag = Math.max(0, h0 + v0y * expFactor * 0.94 - 0.5 * g * tt * tt * 0.98);
    return {
      x: xDrag,
      y: yDrag,
      vx: v0x * Math.exp(-k * tt),
      vy: v0y * Math.exp(-k * tt) - g * tt
    };
  };

  const endSample = posAt(tTotal);
  const maxRange = Math.max(1, endSample.x);
  const maxH = Math.max(1, h0 + (v0y > 0 ? (v0y * v0y) / (2 * g) : 0));

  const curT = t % (tTotal + 1.1);
  const inFlight = curT <= tTotal;
  const curState = inFlight ? posAt(curT) : { x: maxRange, y: 0, vx: 0, vy: 0 };
  const curV = Math.sqrt(curState.vx * curState.vx + curState.vy * curState.vy);

  pushTelemetry({
    metric1Label: 'Tầm xa tối đa (L)',
    metric1Val: `${maxRange.toFixed(1)} m`,
    metric2Label: 'Độ cao cực đại (Hmax)',
    metric2Val: `${maxH.toFixed(1)} m`,
    metric3Label: 'Vận tốc tức thời (v)',
    metric3Val: `${curV.toFixed(1)} m/s`,
    note: flags.airDrag
      ? `Có lực cản không khí: Tầm xa giảm còn ${maxRange.toFixed(1)} m. vx giảm theo hàm mũ.`
      : `Chuyển động ném không ma sát: t = ${curT.toFixed(2)}s / ${tTotal.toFixed(2)}s | vx = ${curState.vx.toFixed(1)} m/s, vy = ${curState.vy.toFixed(1)} m/s`
  });

  const groundY = h - 54;
  const scaleX = (w - 130) / Math.max(10, maxRange * 1.12);
  const scaleY = (h - 130) / Math.max(5, maxH * 1.22);
  const originX = 56;

  ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
  ctx.fillRect(0, groundY, w, 54);
  ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.stroke();

  if (ov.showRulerGrid) {
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const stepM = Math.max(5, Math.ceil(maxRange / 5 / 5) * 5);
    for (let m = 0; m <= maxRange * 1.1; m += stepM) {
      const rx = originX + m * scaleX;
      if (rx < w - 20) {
        ctx.beginPath();
        ctx.moveTo(rx, groundY);
        ctx.lineTo(rx, groundY + 6);
        ctx.stroke();
        ctx.fillText(`${m}m`, rx, groundY + 18);
      }
    }
  }

  if (h0 > 0) {
    const hillW = originX - 8;
    const hillTopY = groundY - h0 * scaleY;
    ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
    ctx.fillRect(0, hillTopY, hillW, groundY - hillTopY);
  }

  if (ov.showTrace) {
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const sample = posAt((i / steps) * tTotal);
      const px = originX + sample.x * scaleX;
      const py = groundY - sample.y * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  const ballPx = originX + curState.x * scaleX;
  const ballPy = groundY - curState.y * scaleY;

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(ballPx, ballPy, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fee2e2';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (ov.showVectors && inFlight) {
    const vecScale = 1.25;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(ballPx, ballPy);
    ctx.lineTo(ballPx + curState.vx * vecScale, ballPy);
    ctx.stroke();
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(ballPx, ballPy);
    ctx.lineTo(ballPx, ballPy - curState.vy * vecScale);
    ctx.stroke();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(ballPx, ballPy);
    ctx.lineTo(ballPx + curState.vx * vecScale, ballPy - curState.vy * vecScale);
    ctx.stroke();
  }
}

// 4. Free Fall & Mechanical Energy (Lớp 9 & 10)
function drawFreeFall({ ctx, w, h, t, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const H = Math.max(0.5, p.height ?? p.dropHeight ?? 20);
  const m = Math.max(0.05, p.mass ?? 2.0);
  const g = Math.max(0.2, p.gravity ?? 9.8);

  const tVac = Math.sqrt((2 * H) / g);
  const tTotal = flags.airDrag ? tVac * 1.18 : tVac;
  const curT = t % (tTotal + 1.0);
  const inDrop = curT <= tTotal;

  const dragFactor = flags.airDrag ? 0.85 : 1.0;
  const curY = inDrop ? Math.max(0, H - 0.5 * g * dragFactor * curT * curT * (tVac / tTotal) ** 0.3) : 0;
  const curV = inDrop ? g * curT * (flags.airDrag ? 0.78 : 1.0) : Math.sqrt(2 * g * H) * (flags.airDrag ? 0.78 : 1.0);

  const Ep = m * g * curY;
  const Ek = 0.5 * m * curV * curV;
  const ETotal = Math.max(0.01, m * g * H);
  const EThermal = flags.airDrag ? Math.max(0, ETotal - Ep - Ek) : 0;

  pushTelemetry({
    metric1Label: 'Thế năng (Wt)',
    metric1Val: `${Ep.toFixed(1)} J`,
    metric2Label: 'Động năng (Wđ)',
    metric2Val: `${Ek.toFixed(1)} J`,
    metric3Label: flags.airDrag ? 'Nhiệt hao phí (Q)' : 'Cơ năng (W)',
    metric3Val: flags.airDrag ? `${EThermal.toFixed(1)} J` : `${ETotal.toFixed(1)} J`,
    note: flags.airDrag
      ? `Có lực cản không khí: Một phần cơ năng chuyển hóa thành nhiệt (${EThermal.toFixed(1)} J).`
      : `Bảo toàn cơ năng: W = Wđ + Wt = ${ETotal.toFixed(1)} J. Vận tốc chạm đất: ${Math.sqrt(2 * g * H).toFixed(1)} m/s.`
  });

  const groundY = h - 46;
  const topY = 44;
  const dropScale = Math.max(1, groundY - topY) / H;
  const ballX = Math.max(76, w * 0.3);
  const ballY = topY + (H - curY) * dropScale;

  ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
  ctx.fillRect(0, groundY, w, 46);

  if (ov.showRulerGrid) {
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballX - 34, topY);
    ctx.lineTo(ballX - 34, groundY);
    ctx.stroke();

    const stepM = Math.max(2, Math.floor(H / 5));
    for (let meter = 0; meter <= H; meter += stepM) {
      const markY = groundY - meter * dropScale;
      ctx.beginPath();
      ctx.moveTo(ballX - 42, markY);
      ctx.lineTo(ballX - 34, markY);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${meter}m`, Math.max(6, ballX - 66), markY + 4);
    }
  }

  if (ov.showTrace && inDrop) {
    for (let i = 1; i <= 4; i++) {
      const pastT = Math.max(0, curT - i * 0.14);
      const pastY = Math.max(0, H - 0.5 * g * dragFactor * pastT * pastT);
      const py = topY + (H - pastY) * dropScale;
      ctx.fillStyle = `rgba(59, 130, 246, ${0.35 - i * 0.07})`;
      ctx.beginPath();
      ctx.arc(ballX, py, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(ballX, ballY, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (ov.showVectors) {
    const vLen = Math.min(70, curV * 2.5);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ballX + 18, ballY);
    ctx.lineTo(ballX + 18, ballY + vLen);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('v', ballX + 23, ballY + vLen / 2 + 4);
  }

  if (ov.showRealtimeChart) {
    const barW = Math.min(82, Math.max(54, w * 0.22));
    const barX = Math.min(w - barW - 18, w * 0.62);
    const barMaxH = Math.min(180, Math.max(100, groundY - topY - 12));
    const barY = groundY - barMaxH;

    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(barX, barY, barW, barMaxH);

    const epHeight = Math.max(0, Math.min(barMaxH, (Ep / ETotal) * barMaxH));
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX, groundY - epHeight, barW, epHeight);

    const ekHeight = Math.max(0, Math.min(barMaxH - epHeight, (Ek / ETotal) * barMaxH));
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(barX, groundY - epHeight - ekHeight, barW, ekHeight);

    if (EThermal > 0.1) {
      const thHeight = Math.max(0, barMaxH - epHeight - ekHeight);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(barX, barY, barW, thHeight);
    }

    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Biểu đồ Năng lượng', barX + barW / 2, barY - 12);
    if (epHeight > 14) ctx.fillText(`Wt: ${Ep.toFixed(0)}J`, barX + barW / 2, groundY - epHeight / 2 + 4);
    if (ekHeight > 14) {
      ctx.fillText(`Wđ: ${Ek.toFixed(0)}J`, barX + barW / 2, groundY - epHeight - ekHeight / 2 + 4);
    }
  }
}

// 5. Light Refraction & Total Internal Reflection (Lớp 11 & 12)
function drawRefraction({ ctx, w, h, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const n1 = Math.max(1.0, p.n1 ?? 1.33);
  const n2 = Math.max(1.0, p.n2 ?? 1.0);
  const iDeg = Math.max(0, Math.min(89.9, p.angleI ?? p.angle ?? p.incidentAngle ?? 30));
  const iRad = (iDeg * Math.PI) / 180;

  const sinI = Math.sin(iRad);
  const sinR = (n1 / n2) * sinI;
  const isTIR = sinR > 1.0;
  const rRad = isTIR ? 0 : Math.asin(sinR);
  const rDeg = isTIR ? 0 : (rRad * 180) / Math.PI;

  const sinIgh = n1 > n2 ? n2 / n1 : 1.0;
  const ighDeg = n1 > n2 ? (Math.asin(sinIgh) * 180) / Math.PI : 90;

  pushTelemetry({
    metric1Label: 'Góc tới hạn (igh)',
    metric1Val: n1 > n2 ? `${ighDeg.toFixed(1)}°` : 'Không có (n1 ≤ n2)',
    metric2Label: 'Góc khúc xạ (r)',
    metric2Val: isTIR ? 'Phản xạ toàn phần' : `${rDeg.toFixed(1)}°`,
    metric3Label: 'Trạng thái tia ló',
    metric3Val: isTIR ? '100% Tia phản xạ' : 'Khúc xạ + Phản xạ 1 phần',
    note: isTIR
      ? `Phản xạ toàn phần vì i (${iDeg.toFixed(1)}°) > igh (${ighDeg.toFixed(1)}°)`
      : `Định luật Snell: ${n1.toFixed(2)} · sin(${iDeg.toFixed(1)}°) = ${n2.toFixed(2)} · sin(${rDeg.toFixed(1)}°)`
  });

  const midY = h / 2;
  const midX = w / 2;
  const beamLen = Math.min(165, Math.min(w, h) * 0.42);

  ctx.fillStyle = isDark ? '#1e293b' : '#e0f2fe';
  ctx.fillRect(0, 0, w, midY);
  ctx.fillStyle = isDark ? '#0f172a' : '#f0fdf4';
  ctx.fillRect(0, midY, w, h - midY);

  ctx.strokeStyle = isDark ? '#64748b' : '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(w, midY);
  ctx.stroke();

  if (flags.showProtractor) {
    const pR = Math.min(110, Math.min(w, h) * 0.28);
    ctx.strokeStyle = isDark ? 'rgba(248, 250, 252, 0.22)' : 'rgba(15, 23, 42, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(midX, midY, pR, 0, Math.PI * 2);
    ctx.stroke();

    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const inner = deg % 45 === 0 ? pR - 10 : pR - 5;
      ctx.beginPath();
      ctx.moveTo(midX + inner * Math.cos(rad), midY + inner * Math.sin(rad));
      ctx.lineTo(midX + pR * Math.cos(rad), midY + pR * Math.sin(rad));
      ctx.stroke();
    }
  }

  ctx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(midX, 20);
  ctx.lineTo(midX, h - 20);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = isDark ? '#93c5fd' : '#0369a1';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Môi trường 1 (n₁ = ${n1.toFixed(2)})`, 20, 30);
  ctx.fillText(`Môi trường 2 (n₂ = ${n2.toFixed(2)})`, 20, midY + 30);

  const incStartX = midX - beamLen * Math.sin(iRad);
  const incStartY = midY - beamLen * Math.cos(iRad);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(incStartX, incStartY);
  ctx.lineTo(midX, midY);
  ctx.stroke();

  const refEndX = midX + beamLen * Math.sin(iRad);
  const refEndY = midY - beamLen * Math.cos(iRad);
  ctx.strokeStyle = isTIR ? '#ef4444' : 'rgba(239, 68, 68, 0.45)';
  ctx.lineWidth = isTIR ? 3.5 : 2;
  ctx.beginPath();
  ctx.moveTo(midX, midY);
  ctx.lineTo(refEndX, refEndY);
  ctx.stroke();

  if (!isTIR) {
    const refrEndX = midX + beamLen * Math.sin(rRad);
    const refrEndY = midY + beamLen * Math.cos(rRad);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(refrEndX, refrEndY);
    ctx.stroke();

    if (ov.showVectors) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`r=${rDeg.toFixed(1)}°`, midX + 18, midY + 55);
    }
  }
  if (ov.showVectors) {
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`i=${iDeg.toFixed(1)}°`, midX - 62, midY - 40);
  }
}

// 6. Magnetic Induction (Lớp 11 & 12)
function drawInduction({ ctx, w, h, t, isDark, isRunning, params: p, flags, overlays: ov, oscHistory, pushTelemetry }: DrawCtx) {
  const N = Math.max(1, p.turns ?? 15);
  const B0 = Math.max(0.05, p.B ?? p.bField ?? p.magneticField ?? 1.2);
  const speed = Math.max(0.1, p.velocity ?? p.magnetSpeed ?? (p.rotationSpeed ? p.rotationSpeed / 30 : 4.0));
  const poleSign = flags.flipMagnet ? -1 : 1;

  let magnetPos = 0;
  let dPosDt = 0;
  if (flags.inductionAction === 0) {
    const freq = speed * 0.7;
    magnetPos = Math.sin(t * freq);
    dPosDt = freq * Math.cos(t * freq);
  } else if (flags.inductionAction === 1) {
    const cycle = (t * speed * 0.35) % 2;
    magnetPos = cycle <= 1 ? -1 + 2 * cycle : 1;
    dPosDt = cycle <= 1 ? speed * 0.7 : 0;
  } else if (flags.inductionAction === 2) {
    const cycle = (t * speed * 0.35) % 2;
    magnetPos = cycle <= 1 ? 1 - 2 * cycle : -1;
    dPosDt = cycle <= 1 ? -speed * 0.7 : 0;
  } else {
    magnetPos = 0.25;
    dPosDt = 0;
  }

  const flux = poleSign * B0 * N * 0.015 * (1 + 0.8 * magnetPos);
  const eC = -poleSign * B0 * N * 0.015 * 0.8 * dPosDt;

  if (isRunning) {
    oscHistory.push(eC);
    if (oscHistory.length > 90) oscHistory.shift();
  }

  pushTelemetry({
    metric1Label: 'Từ thông qua ống dây (Φ)',
    metric1Val: `${(flux * 1000).toFixed(1)} mWb`,
    metric2Label: 'Suất điện động cảm ứng (ec)',
    metric2Val: `${eC.toFixed(2)} V`,
    metric3Label: 'Dòng điện cảm ứng (ic)',
    metric3Val: `${(eC * 12).toFixed(1)} mA`,
    note:
      Math.abs(eC) < 0.05
        ? 'Nam châm ĐỨNG YÊN: Từ thông không đổi (ΔΦ = 0) → Không có dòng điện cảm ứng!'
        : eC > 0
        ? 'Định luật Len-xơ: Từ trường cảm ứng chống lại sự biến thiên từ thông ban đầu.'
        : 'Đảo cực hoặc đổi chiều chuyển động làm đổi dấu suất điện động cảm ứng e_c.'
  });

  const midX = w / 2;
  const midY = h * 0.44;
  const s = Math.min(1, w / 480, h / 280);

  const coilW = 140 * s;
  const coilH = 70 * s;
  ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
  ctx.fillRect(midX - coilW / 2, midY - coilH / 2, coilW, coilH);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;

  const loops = Math.min(12, Math.max(4, Math.round(N / 2)));
  for (let i = 0; i < loops; i++) {
    const lx = midX - coilW / 2 + (i * coilW) / (loops - 1);
    ctx.beginPath();
    ctx.ellipse(lx, midY, 6 * s, coilH / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  const magW = 84 * s;
  const magH = 36 * s;
  const magX = midX - 155 * s + magnetPos * 54 * s;
  const magY = midY;

  if (ov.showVectors) {
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.3)';
    ctx.lineWidth = 1.4;
    for (let arc = 1; arc <= 2; arc++) {
      ctx.beginPath();
      ctx.ellipse(magX + magW / 2, magY, magW * (0.65 + arc * 0.25), magH * (0.75 + arc * 0.45), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const leftIsNorth = flags.flipMagnet;
  ctx.fillStyle = leftIsNorth ? '#ef4444' : '#3b82f6';
  ctx.fillRect(magX, magY - magH / 2, magW / 2, magH);
  ctx.fillStyle = leftIsNorth ? '#3b82f6' : '#ef4444';
  ctx.fillRect(magX + magW / 2, magY - magH / 2, magW / 2, magH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(leftIsNorth ? 'N' : 'S', magX + magW / 4, magY + 4);
  ctx.fillText(leftIsNorth ? 'S' : 'N', magX + (3 * magW) / 4, magY + 4);

  const galX = midX;
  const galY = Math.min(h - 32, midY + 86 * s);
  const galR = 24 * s;
  ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
  ctx.beginPath();
  ctx.arc(galX, galY, galR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const needleAngle = -Math.PI / 2 + Math.max(-1.2, Math.min(1.2, eC * 0.35));
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(galX, galY);
  ctx.lineTo(galX + 17 * s * Math.cos(needleAngle), galY + 17 * s * Math.sin(needleAngle));
  ctx.stroke();

  if (ov.showRealtimeChart && oscHistory.length > 2) {
    const cw2 = Math.min(130, w * 0.28);
    const ch2 = 54;
    const cx2 = w - cw2 - 12;
    const cy2 = h - ch2 - 12;
    ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(cx2, cy2, cw2, ch2);
    ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx2, cy2, cw2, ch2);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const maxAmp = Math.max(1.5, ...oscHistory.map(Math.abs));
    for (let i = 0; i < oscHistory.length; i++) {
      const px = cx2 + (i / Math.max(1, oscHistory.length - 1)) * cw2;
      const py = cy2 + ch2 / 2 - (oscHistory[i] / maxAmp) * (ch2 * 0.38);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
}

// 7. Spring Pendulum (Lớp 11 & 12)
function drawSpring({ ctx, w, h, t, isDark, isRunning, params: p, flags, overlays: ov, oscHistory, pushTelemetry }: DrawCtx) {
  const m = Math.max(0.05, p.m ?? p.mass ?? 1.0);
  const k = Math.max(0.5, p.k ?? p.stiffness ?? p.springK ?? 40);
  const rawAmp = p.A ?? p.amplitude ?? 12;
  const A = Math.min(0.45, Math.abs(rawAmp > 1 ? rawAmp / 100 : rawAmp));
  const gamma = flags.hasFriction ? 0.24 : 0;

  const omega0 = Math.sqrt(k / m);
  const env = Math.exp(-gamma * t);
  const x = A * env * Math.cos(omega0 * t);
  const v = -A * omega0 * env * Math.sin(omega0 * t);

  const Ek = 0.5 * m * v * v;
  const Ep = 0.5 * k * x * x;
  const ETotal = Ek + Ep;

  if (isRunning) {
    oscHistory.push(x * 100);
    if (oscHistory.length > 100) oscHistory.shift();
  }

  pushTelemetry({
    metric1Label: 'Li độ (x)',
    metric1Val: `${(x * 100).toFixed(1)} cm`,
    metric2Label: 'Vận tốc (v)',
    metric2Val: `${(v * 100).toFixed(1)} cm/s`,
    metric3Label: 'Cơ năng (W)',
    metric3Val: `${ETotal.toFixed(3)} J`,
    note: flags.hasFriction
      ? `Dao động tắt dần (có ma sát): Biên độ giảm theo hàm mũ. ω₀ = ${omega0.toFixed(2)} rad/s.`
      : `Dao động điều hòa lí tưởng: ω = ${omega0.toFixed(2)} rad/s | T = ${((2 * Math.PI) / omega0).toFixed(2)} s`
  });

  const midY = h * 0.48;
  const s = Math.min(1, w / 480);
  const anchorX = Math.max(24, w * 0.1);
  const eqX = w * 0.56;
  const scale = 500 * s;
  const massSize = Math.max(36, 50 * s);
  const halfM = massSize / 2;
  const massX = Math.max(anchorX + halfM + 30, Math.min(w - halfM - 12, eqX + x * scale));

  if (ov.showRulerGrid) {
    ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(5, 150, 105, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(eqX, midY - 68);
    ctx.lineTo(eqX, midY + 68);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VTCB O', eqX, midY - 74);
  }

  ctx.fillStyle = isDark ? '#334155' : '#94a3b8';
  ctx.fillRect(anchorX - 14, midY - 56 * s, 14, 112 * s);

  ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(anchorX, midY);
  const coils = 16;
  const coilW = (massX - anchorX - halfM) / coils;
  for (let i = 0; i < coils; i++) {
    const cxPt = anchorX + i * coilW;
    const cyPt = midY + (i % 2 === 0 ? -13 * s : 13 * s);
    ctx.lineTo(cxPt, cyPt);
  }
  ctx.lineTo(massX - halfM, midY);
  ctx.stroke();

  ctx.fillStyle = '#8b5cf6';
  ctx.fillRect(massX - halfM, midY - halfM, massSize, massSize);
  ctx.strokeStyle = '#c4b5fd';
  ctx.lineWidth = 2;
  ctx.strokeRect(massX - halfM, midY - halfM, massSize, massSize);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${m}kg`, massX, midY + 4);

  if (ov.showVectors) {
    const fLen = Math.max(-55, Math.min(55, -k * x * 12));
    if (Math.abs(fLen) > 3) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(massX, midY - halfM - 10);
      ctx.lineTo(massX + fLen, midY - halfM - 10);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Fkv', massX + fLen / 2, midY - halfM - 16);
    }

    const vLen = Math.max(-55, Math.min(55, v * 45));
    if (Math.abs(vLen) > 3) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(massX, midY + halfM + 12);
      ctx.lineTo(massX + vLen, midY + halfM + 12);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('v', massX + vLen / 2, midY + halfM + 25);
    }
  }

  if (ov.showRealtimeChart && oscHistory.length > 2) {
    const cw2 = Math.min(200, w * 0.42);
    const ch2 = 52;
    const cx2 = w - cw2 - 14;
    const cy2 = h - ch2 - 12;
    ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.88)';
    ctx.fillRect(cx2, cy2, cw2, ch2);
    ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx2, cy2, cw2, ch2);

    const maxXcm = Math.max(1, A * 100);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < oscHistory.length; i++) {
      const px = cx2 + (i / Math.max(1, oscHistory.length - 1)) * cw2;
      const py = cy2 + ch2 / 2 - (oscHistory[i] / maxXcm) * (ch2 * 0.38);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
}

// 8. Simple Pendulum (Lớp 12 & Chuyên)
function drawPendulum({ ctx, w, h, t, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const l = Math.max(0.1, p.length ?? 2.0);
  const g = Math.max(0.2, p.gravity ?? 9.8);
  const theta0Deg = p.theta0 ?? p.angle0 ?? p.initialAngleDeg ?? 15;
  const theta0Rad = (theta0Deg * Math.PI) / 180;
  const omega = Math.sqrt(g / l);
  const gamma = flags.hasFriction ? 0.14 : 0;
  const env = Math.exp(-gamma * t);

  const theta = theta0Rad * env * Math.cos(omega * t);
  const v = -omega * l * theta0Rad * env * Math.sin(omega * t);

  pushTelemetry({
    metric1Label: 'Góc lệch (α)',
    metric1Val: `${((theta * 180) / Math.PI).toFixed(1)}°`,
    metric2Label: 'Vận tốc tiếp tuyến (v)',
    metric2Val: `${v.toFixed(2)} m/s`,
    metric3Label: 'Chu kỳ dao động (T)',
    metric3Val: `${((2 * Math.PI) / omega).toFixed(2)} s`,
    note: flags.hasFriction
      ? `Con lắc tắt dần (có lực cản môi trường): Biên độ góc giảm dần theo thời gian.`
      : `Dao động điều hòa: T = 2π√(l/g) = ${((2 * Math.PI) / omega).toFixed(2)} s (không phụ thuộc khối lượng m).`
  });

  const pivotX = w / 2;
  const pivotY = 46;
  const lengthPix = Math.min(h * 0.66, Math.max(70, l * 95));

  const bobX = pivotX + lengthPix * Math.sin(theta);
  const bobY = pivotY + lengthPix * Math.cos(theta);

  if (flags.showProtractor) {
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + lengthPix + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    const arcR = 56;
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, arcR, Math.PI / 2 - Math.abs(theta0Rad), Math.PI / 2 + Math.abs(theta0Rad));
    ctx.stroke();
  }

  if (ov.showTrace) {
    ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.35)' : 'rgba(219, 39, 119, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      pivotX,
      pivotY,
      lengthPix,
      Math.PI / 2 - Math.abs(theta0Rad) * env,
      Math.PI / 2 + Math.abs(theta0Rad) * env
    );
    ctx.stroke();
  }

  ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(bobX, bobY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (ov.showVectors && Math.abs(v) > 0.02) {
    const vx = v * Math.cos(theta) * 28;
    const vy = -v * Math.sin(theta) * 28;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(bobX, bobY);
    ctx.lineTo(bobX + vx, bobY + vy);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('v', bobX + vx + 8, bobY + vy);
  }
}

// 9. Wave Interference (Lớp 11 & 12)
function drawWaveInterference({ ctx, w, h, t, isDark, params: p, flags, pushTelemetry }: DrawCtx) {
  const freq = Math.max(0.2, p.freq ?? 2.5);
  const speed = Math.max(10, p.speed ?? 60);
  const d = Math.max(10, p.sep ?? p.sourceDistance ?? p.separation ?? 120);
  const lambda = p.wavelength ?? Math.max(8, speed / freq);

  const maxK = Math.floor(d / Math.max(1, lambda));

  pushTelemetry({
    metric1Label: 'Bước sóng (λ = v/f)',
    metric1Val: `${lambda.toFixed(1)} cm`,
    metric2Label: 'Khoảng cách nguồn (S1S2)',
    metric2Val: flags.singleSource ? '1 nguồn đơn' : `${d.toFixed(0)} cm`,
    metric3Label: 'Số cực đại giao thoa',
    metric3Val: flags.singleSource ? 'Không giao thoa' : `${2 * maxK + 1} dãy`,
    note: flags.singleSource
      ? 'Chế độ 1 nguồn: Sóng tròn lan tỏa đều với tốc độ v, chưa có giao thoa.'
      : `Giao thoa 2 nguồn cùng pha: d₂ - d₁ = kλ (cực đại), d₂ - d₁ = (k + 0.5)λ (cực tiểu).`
  });

  const midY = h / 2;
  const drawD = Math.min(d * 1.4, Math.max(70, w * 0.56));
  const s1X = flags.singleSource ? w / 2 : w / 2 - drawD / 2;
  const s2X = w / 2 + drawD / 2;
  const waveStepPix = Math.max(14, Math.min(70, lambda * 1.3));
  const maxR = Math.min(w, h) * 0.72;

  ctx.lineWidth = 1.6;
  for (let r = (t * speed * 0.8) % waveStepPix; r < maxR; r += waveStepPix) {
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.32)';
    ctx.beginPath();
    ctx.arc(s1X, midY, r, 0, Math.PI * 2);
    ctx.stroke();

    if (!flags.singleSource) {
      ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.35)' : 'rgba(219, 39, 119, 0.32)';
      ctx.beginPath();
      ctx.arc(s2X, midY, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  if (!flags.singleSource && flags.showNodalLines) {
    ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    const kLim = Math.min(4, maxK);
    for (let k = -kLim; k <= kLim; k++) {
      ctx.beginPath();
      const a = (k * (drawD / Math.max(1, d / lambda))) / 2;
      const c = drawD / 2;
      if (Math.abs(a) < c) {
        const b = Math.sqrt(Math.max(1, c * c - a * a));
        for (let yy = -h * 0.42; yy <= h * 0.42; yy += 10) {
          const xHyp = w / 2 + (a >= 0 ? 1 : -1) * Math.abs(a) * Math.sqrt(1 + (yy * yy) / (b * b));
          if (yy === -h * 0.42) ctx.moveTo(xHyp, midY + yy);
          else ctx.lineTo(xHyp, midY + yy);
        }
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
  }

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(s1X, midY, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('S1', s1X, midY - 12);

  if (!flags.singleSource) {
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.arc(s2X, midY, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('S2', s2X, midY - 12);
  }
}

// 10. Kinematics Graphs (d-t, v-t) & Vector / Trigonometry Visualizer
function drawKinematicsGraphs({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const vizMode = Math.round(p.vizMode ?? 1);
  const v0 = p.v0 ?? 5;
  const accel = p.accel ?? 0;
  const angleDeg = p.angleDeg ?? 35;
  const f1 = p.f1 ?? 30;
  const f2 = p.f2 ?? 20;

  if (vizMode === 0) {
    const rad = (angleDeg * Math.PI) / 180;
    const res = Math.sqrt(f1 * f1 + f2 * f2 + 2 * f1 * f2 * Math.cos(rad));
    const fx = f1 + f2 * Math.cos(rad);
    const fy = f2 * Math.sin(rad);

    pushTelemetry({
      metric1Label: 'Thành phần ngang (Fx)',
      metric1Val: `${fx.toFixed(1)} N`,
      metric2Label: 'Thành phần đứng (Fy)',
      metric2Val: `${fy.toFixed(1)} N`,
      metric3Label: 'Hợp lực tổng (F)',
      metric3Val: `${res.toFixed(1)} N`,
      note: `sin(${angleDeg}°) = ${Math.sin(rad).toFixed(2)}, cos(${angleDeg}°) = ${Math.cos(rad).toFixed(2)} | F = √(F₁² + F₂² + 2F₁F₂cosα)`
    });

    const ox = Math.max(70, w * 0.25);
    const oy = h * 0.72;
    const maxForce = Math.max(10, Math.abs(f1), Math.abs(f2), res);
    const scale = (Math.min(w, h) * 0.45) / maxForce;

    ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, oy);
    ctx.lineTo(w - 30, oy);
    ctx.moveTo(ox, h - 25);
    ctx.lineTo(ox, 25);
    ctx.stroke();

    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const a = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 10 * Math.cos(a - 0.35), y2 - 10 * Math.sin(a - 0.35));
      ctx.lineTo(x2 - 10 * Math.cos(a + 0.35), y2 - 10 * Math.sin(a + 0.35));
      ctx.closePath();
      ctx.fill();
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, (x1 + x2) / 2 + 8, (y1 + y2) / 2 - 8);
    };

    const p1x = ox + f1 * scale;
    const p1y = oy;
    const p2x = ox + f2 * Math.cos(rad) * scale;
    const p2y = oy - f2 * Math.sin(rad) * scale;
    const prx = ox + fx * scale;
    const pry = oy - fy * scale;

    if (ov.showTrace) {
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.5)' : 'rgba(100,116,139,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(prx, pry);
      ctx.lineTo(p2x, p2y);
      ctx.moveTo(prx, pry);
      ctx.lineTo(prx, oy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    drawArrow(ox, oy, p1x, p1y, '#38bdf8', `F₁ = ${f1}N`);
    drawArrow(ox, oy, p2x, p2y, '#f59e0b', `F₂ = ${f2}N`);
    if (ov.showVectors) {
      drawArrow(ox, oy, prx, pry, '#ef4444', `F = ${res.toFixed(1)}N`);
    }
    return;
  }

  const maxT = 5.0;
  const tCur = t % maxT;
  const curD = v0 * tCur + 0.5 * accel * tCur * tCur;
  const curV = v0 + accel * tCur;

  pushTelemetry({
    metric1Label: 'Thời gian (t)',
    metric1Val: `${tCur.toFixed(2)} s`,
    metric2Label: 'Vận tốc tức thời (v)',
    metric2Val: `${curV.toFixed(2)} m/s`,
    metric3Label: 'Độ dịch chuyển (d)',
    metric3Val: `${curD.toFixed(2)} m`,
    note:
      vizMode === 1
        ? 'Đồ thị (d - t): Độ dốc biểu thị vận tốc v. Nếu a = 0 đường thẳng xiên đều.'
        : 'Đồ thị (v - t): Độ dốc là gia tốc a, diện tích tô màu dưới đường bằng độ dịch chuyển d!'
  });

  const roadY = h * 0.24;
  ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, roadY + 18);
  ctx.lineTo(w - 40, roadY + 18);
  ctx.stroke();

  const maxD = Math.max(15, Math.abs(v0 * maxT + 0.5 * accel * maxT * maxT));
  const normPos = Math.max(0, Math.min(1, curD / maxD));
  const carX = 50 + normPos * (w - 130);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(carX, roadY - 12, 46, 22);
  ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
  ctx.beginPath();
  ctx.arc(carX + 10, roadY + 12, 6, 0, Math.PI * 2);
  ctx.arc(carX + 36, roadY + 12, 6, 0, Math.PI * 2);
  ctx.fill();

  if (ov.showVectors) {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(carX + 46, roadY - 2);
    ctx.lineTo(carX + 46 + Math.max(-30, Math.min(70, curV * 4)), roadY - 2);
    ctx.stroke();
  }

  const gx0 = 60;
  const gy0 = h * 0.88;
  const gw = w - 100;
  const gh = h * 0.44;

  ctx.strokeStyle = isDark ? '#64748b' : '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(gx0, gy0 - gh);
  ctx.lineTo(gx0, gy0);
  ctx.lineTo(gx0 + gw, gy0);
  ctx.stroke();

  ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('t (s)', gx0 + gw - 22, gy0 + 16);
  ctx.fillText(vizMode === 1 ? 'd (m)' : 'v (m/s)', gx0 - 42, gy0 - gh + 10);

  const valAtT = (tt: number) => (vizMode === 1 ? v0 * tt + 0.5 * accel * tt * tt : v0 + accel * tt);
  const maxYVal = Math.max(10, Math.abs(valAtT(maxT)), Math.abs(valAtT(0)));

  if (vizMode === 2) {
    ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.16)' : 'rgba(14, 165, 233, 0.15)';
    ctx.beginPath();
    ctx.moveTo(gx0, gy0);
    for (let i = 0; i <= 40; i++) {
      const tt = (i / 40) * tCur;
      const px = gx0 + (tt / maxT) * gw;
      const py = gy0 - Math.max(0, Math.min(gh, (valAtT(tt) / maxYVal) * gh * 0.85));
      ctx.lineTo(px, py);
    }
    ctx.lineTo(gx0 + (tCur / maxT) * gw, gy0);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = vizMode === 1 ? '#f59e0b' : '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const tt = (i / 60) * maxT;
    const px = gx0 + (tt / maxT) * gw;
    const py = gy0 - Math.max(-10, Math.min(gh, (valAtT(tt) / maxYVal) * gh * 0.85));
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const dotX = gx0 + (tCur / maxT) * gw;
  const dotY = gy0 - Math.max(-10, Math.min(gh, (valAtT(tCur) / maxYVal) * gh * 0.85));
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
  ctx.fill();
}

// 11. Thermal Gas & Ideal Gas Law Chamber (Lớp 12)
function drawThermalGas({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const tempK = Math.max(10, p.tempK ?? 320);
  const vol = Math.max(0.5, p.volume ?? 10);
  const moles = Math.max(0.1, p.moles ?? 1);
  const pressureKPa = (moles * 8.31 * tempK) / vol;
  const eMean = 1.5 * 1.38e-23 * tempK * 1e21;

  pushTelemetry({
    metric1Label: 'Nhiệt độ tuyệt đối (T)',
    metric1Val: `${tempK} K (${(tempK - 273).toFixed(0)} °C)`,
    metric2Label: 'Áp suất khí (p)',
    metric2Val: `${pressureKPa.toFixed(1)} kPa`,
    metric3Label: 'Động năng TB phân tử',
    metric3Val: `${eMean.toFixed(2)} × 10⁻²¹ J`,
    note: 'Phương trình Clapeyron: pV = nRT. Tăng nhiệt độ T làm tốc độ phân tử và áp suất tăng tỉ lệ thuận.'
  });

  const boxW = Math.min(w * 0.52, 290);
  const maxBoxH = h * 0.68;
  const boxH = Math.max(60, Math.min(maxBoxH, (vol / 18) * maxBoxH));
  const bx = w / 2 - boxW / 2 - 20;
  const byBottom = h * 0.85;
  const byTop = byBottom - boxH;

  ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 3;
  ctx.strokeRect(bx, byTop, boxW, boxH);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(bx + 2, byTop - 12, boxW - 4, 12);

  const count = Math.min(80, Math.max(6, Math.round(14 + moles * 10)));
  const speedFactor = Math.sqrt(tempK / 300) * 90;
  ctx.fillStyle = tempK > 450 ? '#ef4444' : tempK > 330 ? '#f59e0b' : '#38bdf8';

  for (let i = 0; i < count; i++) {
    const rx = ((i * 73 + 19) % 100) / 100;
    const ry = ((i * 41 + 7) % 100) / 100;
    const vx = (i % 2 === 0 ? 1 : -1) * (0.7 + (i % 5) * 0.2) * speedFactor;
    const vy = (i % 3 === 0 ? 1 : -1) * (0.6 + (i % 4) * 0.22) * speedFactor;

    const spanX = Math.max(12, boxW - 16);
    const spanY = Math.max(12, boxH - 16);
    const rawX = (((rx * boxW + vx * t) % (2 * spanX)) + 2 * spanX) % (2 * spanX);
    const posX = bx + 8 + (rawX > spanX ? 2 * spanX - rawX : rawX);
    const rawY = (((ry * boxH + vy * t) % (2 * spanY)) + 2 * spanY) % (2 * spanY);
    const posY = byTop + 8 + (rawY > spanY ? 2 * spanY - rawY : rawY);

    ctx.beginPath();
    ctx.arc(posX, posY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    if (ov.showVectors && i < 6) {
      ctx.strokeStyle = isDark ? 'rgba(248, 250, 252, 0.55)' : 'rgba(15, 23, 42, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(posX, posY);
      ctx.lineTo(posX + (vx / speedFactor) * 14, posY + (vy / speedFactor) * 14);
      ctx.stroke();
    }
  }

  if (ov.showRealtimeChart) {
    const gx = bx + boxW + 24;
    const gh = 140;
    const gy = byBottom - gh;
    ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    ctx.fillRect(gx, gy, 24, gh);
    const pFrac = Math.min(1, pressureKPa / 800);
    ctx.fillStyle = pressureKPa > 450 ? '#ef4444' : '#10b981';
    ctx.fillRect(gx, byBottom - pFrac * gh, 24, pFrac * gh);
    ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('p', gx + 12, gy - 6);
  }
}

// 12. Electric Field & Coulomb Interaction (Lớp 11)
function drawElectricField({ ctx, w, h, t, isDark, params: p, flags, overlays: ov, pushTelemetry }: DrawCtx) {
  const q1 = p.q1 ?? 4;
  const q2 = p.q2 ?? -4;
  const distMm = Math.max(10, p.dist ?? 180);
  const rMeters = distMm / 1000;
  const force = (9e9 * Math.abs(q1 * q2) * 1e-12) / (rMeters * rMeters);
  const sameSign = q1 * q2 > 0;

  pushTelemetry({
    metric1Label: 'Lực tương tác Coulomb',
    metric1Val: `${force.toFixed(2)} N`,
    metric2Label: 'Tính chất tương tác',
    metric2Val: q1 === 0 || q2 === 0 ? 'Không tương tác' : sameSign ? 'Đẩy nhau' : 'Hút nhau',
    metric3Label: 'Khoảng cách r',
    metric3Val: `${distMm} mm`,
    note: 'Định luật Coulomb: F = k|q₁q₂|/r². Mũi tên lưới biểu diễn hướng vectơ cường độ điện trường tổng hợp E.'
  });

  const cy = h / 2;
  const drawSpan = Math.min(w * 0.65, Math.max(70, distMm * 1.4));
  const x1 = w / 2 - drawSpan / 2;
  const x2 = w / 2 + drawSpan / 2;

  if (flags.showFieldGrid) {
    const step = 42;
    for (let gx = 30; gx < w - 20; gx += step) {
      for (let gy = 30; gy < h - 20; gy += step) {
        const dx1 = gx - x1;
        const dy1 = gy - cy;
        const r1Sq = Math.max(400, dx1 * dx1 + dy1 * dy1);
        const dx2 = gx - x2;
        const dy2 = gy - cy;
        const r2Sq = Math.max(400, dx2 * dx2 + dy2 * dy2);

        const ex = (q1 * dx1) / Math.pow(r1Sq, 1.5) + (q2 * dx2) / Math.pow(r2Sq, 1.5);
        const ey = (q1 * dy1) / Math.pow(r1Sq, 1.5) + (q2 * dy2) / Math.pow(r2Sq, 1.5);
        const mag = Math.hypot(ex, ey);
        if (mag > 1e-7) {
          const ux = (ex / mag) * 13;
          const uy = (ey / mag) * 13;
          const alpha = Math.min(0.8, 0.25 + mag * 15000);
          ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(gx - ux * 0.5, gy - uy * 0.5);
          ctx.lineTo(gx + ux * 0.5, gy + uy * 0.5);
          ctx.stroke();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.beginPath();
          ctx.arc(gx + ux * 0.5, gy + uy * 0.5, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  for (let i = 1; i <= 3; i++) {
    const rad = i * 24 + ((t * 14) % 24);
    ctx.strokeStyle = q1 >= 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x1, cy, rad, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = q2 >= 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.arc(x2, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (ov.showVectors && q1 !== 0 && q2 !== 0) {
    const fLen = Math.min(75, Math.max(25, force * 8));
    const dir1 = sameSign ? -1 : 1;
    const dir2 = sameSign ? 1 : -1;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, cy);
    ctx.lineTo(x1 + dir1 * fLen, cy);
    ctx.moveTo(x2, cy);
    ctx.lineTo(x2 + dir2 * fLen, cy);
    ctx.stroke();
  }

  const drawCharge = (cx: number, q: number, name: string) => {
    ctx.fillStyle = q > 0 ? '#ef4444' : q < 0 ? '#3b82f6' : '#64748b';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(q > 0 ? '+' : q < 0 ? '−' : '0', cx, cy + 5);
    ctx.fillStyle = isDark ? '#e2e8f0' : '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`${name} = ${q > 0 ? '+' : ''}${q} μC`, cx, cy - 26);
  };

  drawCharge(x1, q1, 'q₁');
  drawCharge(x2, q2, 'q₂');
}

// 13. Nuclear Decay Grid & Exponential Curve (Lớp 12)
function drawNuclearDecay({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const halfLife = Math.max(0.2, p.halfLife ?? 4.0);
  const n0 = Math.max(1, p.n0 ?? 100);
  const cycleT = t % (halfLife * 4.2);
  const remaining = n0 * Math.pow(2, -cycleT / halfLife);
  const decayed = n0 - remaining;

  pushTelemetry({
    metric1Label: 'Thời gian trôi qua (t)',
    metric1Val: `${cycleT.toFixed(1)} s (${(cycleT / halfLife).toFixed(2)} T)`,
    metric2Label: 'Số hạt còn lại N(t)',
    metric2Val: `${remaining.toFixed(1)} (${((remaining / n0) * 100).toFixed(1)}%)`,
    metric3Label: 'Đã phân rã ΔN',
    metric3Val: `${decayed.toFixed(1)}`,
    note: 'Định luật phóng xạ: N(t) = N₀ · 2^(-t/T). Sau mỗi chu kì bán rã T, một nửa số hạt nhân mẹ phân rã thành hạt con.'
  });

  const cols = 10;
  const rows = 10;
  const cell = Math.min((w * 0.42) / cols, (h * 0.72) / rows);
  const startX = 28;
  const startY = h / 2 - (rows * cell) / 2;
  const activeCount = Math.round((remaining / n0) * 100);

  for (let idx = 0; idx < 100; idx++) {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const orderRank = (idx * 37 + 13) % 100;
    const isParent = orderRank < activeCount;
    ctx.fillStyle = isParent ? '#f59e0b' : isDark ? '#334155' : '#cbd5e1';
    ctx.beginPath();
    ctx.arc(startX + c * cell + cell / 2, startY + r * cell + cell / 2, cell * 0.34, 0, Math.PI * 2);
    ctx.fill();
  }

  if (ov.showRealtimeChart) {
    const gx0 = w * 0.54;
    const gy0 = h * 0.82;
    const gw = w * 0.4;
    const gh = h * 0.62;

    ctx.strokeStyle = isDark ? '#64748b' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gx0, gy0 - gh);
    ctx.lineTo(gx0, gy0);
    ctx.lineTo(gx0 + gw, gy0);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const maxGraphT = halfLife * 4.2;
    for (let k = 1; k <= 4; k++) {
      const tx = gx0 + ((k * halfLife) / maxGraphT) * gw;
      ctx.fillText(`${k}T`, tx, gy0 + 14);
    }

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const tt = (i / 60) * maxGraphT;
      const frac = Math.pow(2, -tt / halfLife);
      const px = gx0 + (tt / maxGraphT) * gw;
      const py = gy0 - frac * gh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const curPx = gx0 + (cycleT / maxGraphT) * gw;
    const curPy = gy0 - (remaining / n0) * gh;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(curPx, curPy, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 14. Uniform Circular Motion & Centripetal Force (Lớp 10)
function drawCircularMotion({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const r = Math.max(0.2, p.radius ?? 2.0);
  const omega = Math.max(0.2, p.omega ?? 2.5);
  const mass = Math.max(0.1, p.mass ?? 1.5);

  const v = omega * r;
  const aHt = omega * omega * r;
  const fHt = mass * aHt;
  const period = (2 * Math.PI) / omega;

  pushTelemetry({
    metric1Label: 'Tốc độ dài v = ω·r',
    metric1Val: `${v.toFixed(2)} m/s`,
    metric2Label: 'Gia tốc hướng tâm a_ht',
    metric2Val: `${aHt.toFixed(2)} m/s²`,
    metric3Label: 'Lực hướng tâm F_ht · Chu kì T',
    metric3Val: `${fHt.toFixed(1)} N · ${period.toFixed(2)} s`,
    note: 'Trong chuyển động tròn đều: vectơ vận tốc v luôn tiếp tuyến quỹ đạo, còn gia tốc & lực hướng tâm luôn hướng vào tâm O.'
  });

  const cx = w * 0.42;
  const cy = h * 0.52;
  const rPx = Math.min(w * 0.28, h * 0.36) * Math.min(1.2, Math.max(0.45, r / 3.0));
  const angle = omega * t;
  const objX = cx + rPx * Math.cos(angle);
  const objY = cy - rPx * Math.sin(angle);

  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  if (ov.showTrace) {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rPx, -angle, -angle + Math.PI / 3, false);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(objX, objY);
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`O (r=${r.toFixed(1)}m)`, cx + 8, cy + 16);

  const drawVec = (x0: number, y0: number, dx: number, dy: number, color: string, label: string) => {
    const len = Math.hypot(dx, dy);
    if (len < 4) return;
    const ang = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + dx, y0 + dy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x0 + dx, y0 + dy);
    ctx.lineTo(x0 + dx - 10 * Math.cos(ang - Math.PI / 6), y0 + dy - 10 * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(x0 + dx - 10 * Math.cos(ang + Math.PI / 6), y0 + dy - 10 * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 11px monospace';
    ctx.fillText(label, x0 + dx + 6, y0 + dy - 4);
  };

  if (ov.showVectors) {
    const vScale = Math.min(85, Math.max(26, v * 8));
    const tx = -Math.sin(angle) * vScale;
    const ty = -Math.cos(angle) * vScale;
    drawVec(objX, objY, tx, ty, '#10b981', 'v');

    const fScale = Math.min(rPx * 0.78, Math.max(24, fHt * 1.4));
    const fx = -Math.cos(angle) * fScale;
    const fy = Math.sin(angle) * fScale;
    drawVec(objX, objY, fx, fy, '#ef4444', 'F_ht');
  }

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(objX, objY, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  if (ov.showRealtimeChart && w > 420) {
    const gx = w * 0.72;
    const gy = h * 0.52;
    const gw = w * 0.24;
    ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(gx, gy - rPx);
    ctx.lineTo(gx, gy + rPx);
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + gw, gy);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 60; i++) {
      const dtBack = (i / 60) * 3.0;
      const yProj = gy - rPx * Math.sin(omega * (t - dtBack));
      const px = gx + (i / 60) * gw;
      if (i === 0) ctx.moveTo(px, yProj);
      else ctx.lineTo(px, yProj);
    }
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.fillText('Hình chiếu y(t) = r·sin(ωt)', gx, gy - rPx - 8);
  }
}

// 15. AC RLC Series Circuit, Fresnel Phasor & Oscilloscope (Lớp 12)
function drawAcRlcCircuit({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const uEff = Math.max(10, p.uEff ?? 120);
  const freq = Math.max(10, p.freq ?? 50);
  const resR = Math.max(5, p.resR ?? 40);
  const indL = Math.max(0.05, p.indL ?? 0.3);
  const capC = Math.max(5, p.capC ?? 40);

  const omega = 2 * Math.PI * freq;
  const zl = omega * indL;
  const zc = 1 / (omega * capC * 1e-6);
  const zTotal = Math.sqrt(resR * resR + (zl - zc) * (zl - zc));
  const iEff = uEff / zTotal;
  const phi = Math.atan2(zl - zc, resR);
  const cosPhi = resR / zTotal;
  const powerP = uEff * iEff * cosPhi;
  const isResonance = Math.abs(zl - zc) < Math.max(4, resR * 0.12);

  pushTelemetry({
    metric1Label: 'Cảm kháng Z_L · Dung kháng Z_C',
    metric1Val: `${zl.toFixed(1)} Ω · ${zc.toFixed(1)} Ω`,
    metric2Label: 'Tổng trở Z · Dòng I hiệu dụng',
    metric2Val: `${zTotal.toFixed(1)} Ω · ${iEff.toFixed(2)} A`,
    metric3Label: 'Hệ số cos φ · Công suất P',
    metric3Val: `${cosPhi.toFixed(2)} · ${powerP.toFixed(0)} W`,
    note: isResonance
      ? 'ĐANG CỘNG HƯỞNG ĐIỆN (Z_L ≈ Z_C): Tổng trở Z = R cực tiểu, I đạt cực đại và cos φ ≈ 1!'
      : `Độ lệch pha φ = ${((phi * 180) / Math.PI).toFixed(1)}°. ${zl > zc ? 'Mạch có tính cảm kháng (u sớm pha hơn i).' : 'Mạch có tính dung kháng (u trễ pha hơn i).'}`
  });

  const boxLeft = 26;
  const boxTop = 44;
  const boxW = Math.min(w * 0.44, 320);
  const boxH = h * 0.38;

  ctx.strokeStyle = isDark ? '#64748b' : '#475569';
  ctx.lineWidth = 2.2;
  ctx.strokeRect(boxLeft, boxTop, boxW, boxH);

  ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
  ctx.beginPath();
  ctx.arc(boxLeft, boxTop + boxH / 2, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('~', boxLeft, boxTop + boxH / 2 + 5);

  const segW = boxW / 3;
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(boxLeft + segW * 0.25, boxTop - 9, 44, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('R', boxLeft + segW * 0.25 + 22, boxTop + 3);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(boxLeft + segW * 1.25, boxTop - 9, 44, 18);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('L', boxLeft + segW * 1.25 + 22, boxTop + 3);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(boxLeft + segW * 2.25, boxTop - 9, 44, 18);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('C', boxLeft + segW * 2.25 + 22, boxTop + 3);

  const driftPos = Math.sin(t * 4) * 18;
  ctx.fillStyle = isResonance ? '#10b981' : '#38bdf8';
  ctx.beginPath();
  ctx.arc(boxLeft + boxW / 2 + driftPos, boxTop + boxH, 5, 0, Math.PI * 2);
  ctx.fill();

  if (isResonance) {
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ CỘNG HƯỞNG ĐIỆN (Z_L = Z_C)', boxLeft, boxTop + boxH + 22);
  }

  const oscX = 26;
  const oscY = h * 0.78;
  const oscW = Math.min(w * 0.48, 360);
  const oscH = h * 0.16;
  ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(oscX, oscY);
  ctx.lineTo(oscX + oscW, oscY);
  ctx.stroke();

  const drawSine = (amp: number, phaseOffset: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const theta = (i / 80) * Math.PI * 4 - t * 4;
      const px = oscX + (i / 80) * oscW;
      const py = oscY - amp * Math.sin(theta + phaseOffset);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  };
  drawSine(oscH, 0, '#f59e0b');
  drawSine(oscH * Math.min(1.0, (iEff / Math.max(1, uEff / resR)) * 0.85), -phi, '#38bdf8');
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('u(t)', oscX, oscY - oscH - 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('i(t)', oscX + 42, oscY - oscH - 4);

  const phX = w * 0.74;
  const phY = h * 0.56;
  const phScale = Math.min(w * 0.18, h * 0.34) / Math.max(1, iEff * Math.max(resR, zl, zc));
  const uR_px = Math.min(110, Math.max(25, iEff * resR * phScale));
  const uL_px = Math.min(125, iEff * zl * phScale);
  const uC_px = Math.min(125, iEff * zc * phScale);

  ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(phX - 40, phY);
  ctx.lineTo(phX + 120, phY);
  ctx.moveTo(phX, phY - 120);
  ctx.lineTo(phX, phY + 120);
  ctx.stroke();

  if (ov.showVectors) {
    const drawArrow = (x1: number, y1: number, x2: number, y2: number, color: string, text: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.font = 'bold 10px monospace';
      ctx.fillText(text, x2 + 6, y2 + 3);
    };
    drawArrow(phX, phY, phX + uR_px, phY, '#3b82f6', 'U_R (I)');
    drawArrow(phX, phY, phX, phY - uL_px, '#10b981', 'U_L');
    drawArrow(phX, phY, phX, phY + uC_px, '#a855f7', 'U_C');
    drawArrow(phX, phY, phX + uR_px, phY - (uL_px - uC_px), '#f59e0b', 'U_AB');
  }
}

// 16. Young's Double-Slit Interference (Lớp 12)
function drawYoungInterference({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const lambdaUm = Math.max(0.38, Math.min(0.76, p.lambda ?? 0.55));
  const slitA = Math.max(0.2, p.slitA ?? 1.0);
  const screenD = Math.max(0.5, p.screenD ?? 2.0);
  const fringeI = (lambdaUm * screenD) / slitA;

  const lightColor = wavelengthToColor(lambdaUm * 1000);

  pushTelemetry({
    metric1Label: 'Bước sóng λ · Màu sắc',
    metric1Val: `${lambdaUm.toFixed(2)} μm (${Math.round(lambdaUm * 1000)} nm)`,
    metric2Label: 'Khoảng vân i = λD/a',
    metric2Val: `${fringeI.toFixed(2)} mm`,
    metric3Label: 'Vân sáng bậc 1 · Vân tối 1',
    metric3Val: `±${fringeI.toFixed(2)} · ±${(fringeI * 0.5).toFixed(2)} mm`,
    note: 'Vân sáng: x_s = k·i (k ∈ Z). Vân tối: x_t = (k + 0.5)·i. Ánh sáng có λ càng lớn (đỏ) thì khoảng vân i càng rộng.'
  });

  const slitX = w * 0.22;
  const screenX = w * 0.72;
  const cy = h * 0.52;
  const slitHalfGap = Math.max(16, Math.min(54, slitA * 22));
  const s1Y = cy - slitHalfGap;
  const s2Y = cy + slitHalfGap;

  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 2;
  for (let x = 22 + ((t * 45) % 18); x < slitX - 8; x += 18) {
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(x, cy - 65);
    ctx.lineTo(x, cy + 65);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = isDark ? '#475569' : '#334155';
  ctx.fillRect(slitX - 4, 24, 8, s1Y - 28);
  ctx.fillRect(slitX - 4, s1Y + 5, 8, s2Y - s1Y - 10);
  ctx.fillRect(slitX - 4, s2Y + 5, 8, h - 24 - (s2Y + 5));

  const waveStep = Math.max(12, lambdaUm * 32);
  const phaseShift = (((t * 50) % waveStep) + waveStep) % waveStep;
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 1.3;
  for (let rad = Math.max(1, phaseShift); rad < screenX - slitX; rad += waveStep) {
    ctx.globalAlpha = Math.max(0.08, 0.45 * (1 - rad / Math.max(1, screenX - slitX)));
    ctx.beginPath();
    ctx.arc(slitX, s1Y, rad, -Math.PI / 2.6, Math.PI / 2.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(slitX, s2Y, rad, -Math.PI / 2.6, Math.PI / 2.6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const screenH = h - 56;
  const screenTop = 28;
  const pxPerMm = 26 / Math.max(0.5, fringeI / 1.1);
  const stripW = 28;

  for (let y = 0; y < screenH; y += 2) {
    const distFromCenterMm = (y - screenH / 2) / pxPerMm;
    const intensity = Math.pow(Math.cos((Math.PI * distFromCenterMm) / fringeI), 2);
    ctx.fillStyle = lightColor;
    ctx.globalAlpha = Math.max(0.04, intensity);
    ctx.fillRect(screenX, screenTop + y, stripW, 2);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(screenX, screenTop, stripW, screenH);

  if (ov.showRealtimeChart) {
    const graphBaseX = screenX + stripW + 12;
    const maxAmp = Math.min(72, w - graphBaseX - 18);
    if (maxAmp > 20) {
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = 0; y < screenH; y += 2) {
        const distFromCenterMm = (y - screenH / 2) / pxPerMm;
        const intensity = Math.pow(Math.cos((Math.PI * distFromCenterMm) / fringeI), 2);
        const gx = graphBaseX + intensity * maxAmp;
        const gy = screenTop + y;
        if (y === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();
    }
  }

  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('S₁', slitX - 24, s1Y + 4);
  ctx.fillText('S₂', slitX - 24, s2Y + 4);
  ctx.fillText(`i = ${fringeI.toFixed(2)} mm`, screenX - 12, screenTop + screenH + 16);
}

// 17. Standing Waves on a String (Sóng Dừng Trên Sợi Dây - Lớp 11 & Chuyên)
function drawStandingWave({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const lengthM = Math.max(0.5, p.length ?? 2.4);
  const speedV = Math.max(4, p.waveSpeed ?? 24);
  const ampCm = Math.max(1, Math.min(10, p.amplitude ?? 4));
  const harmonicN = Math.max(1, Math.min(8, Math.round(p.harmonicN ?? 3)));
  const isFreeEnd = Math.round(p.openEnd ?? 0) === 1;

  const lambdaM = isFreeEnd
    ? (4 * lengthM) / Math.max(1, 2 * harmonicN - 1)
    : (2 * lengthM) / harmonicN;
  const freqHz = speedV / lambdaM;
  const omega = 2 * Math.PI * Math.min(4.5, Math.max(0.6, freqHz * 0.14));

  const padX = 56;
  const wireStartX = padX;
  const wireEndX = w - padX;
  const wireLenPx = Math.max(120, wireEndX - wireStartX);
  const centerY = h * 0.52;
  const ampPx = Math.min(h * 0.28, ampCm * 8.5);
  const effectiveHalfWaves = isFreeEnd ? harmonicN - 0.5 : harmonicN;

  pushTelemetry({
    metric1Label: 'Bước sóng λ',
    metric1Val: `${lambdaM.toFixed(2)} m`,
    metric2Label: 'Tần số cộng hưởng f',
    metric2Val: `${freqHz.toFixed(2)} Hz`,
    metric3Label: isFreeEnd ? 'Số bó / Nút-Bụng (1 đầu tự do)' : 'Số bó sóng nguyên (k)',
    metric3Val: isFreeEnd ? `${harmonicN} nút · ${harmonicN} bụng` : `${harmonicN} bó (${harmonicN + 1} nút)`,
    note: isFreeEnd
      ? `Dây 1 đầu cố định 1 đầu tự do: l = (2k - 1)λ/4 = ${lengthM.toFixed(2)} m với k = ${harmonicN}.`
      : `Dây 2 đầu cố định: l = k·λ/2 = ${lengthM.toFixed(2)} m với k = ${harmonicN} bó sóng.`
  });

  ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.35)' : 'rgba(100,116,139,0.4)';
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(wireStartX, centerY);
  ctx.lineTo(wireEndX, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.28)' : 'rgba(14,165,233,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.4;
  for (const sign of [-1, 1]) {
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) {
      const u = i / 160;
      const x = wireStartX + u * wireLenPx;
      const envY = centerY + sign * ampPx * Math.abs(Math.sin(effectiveHalfWaves * Math.PI * u));
      if (i === 0) ctx.moveTo(x, envY);
      else ctx.lineTo(x, envY);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const cosWt = Math.cos(omega * t);
  ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  for (let i = 0; i <= 180; i++) {
    const u = i / 180;
    const x = wireStartX + u * wireLenPx;
    const y = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI * u) * cosWt;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = isDark ? '#475569' : '#334155';
  ctx.fillRect(wireStartX - 10, centerY - 38, 10, 76);

  if (isFreeEnd) {
    ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wireEndX + 2, centerY - ampPx - 18);
    ctx.lineTo(wireEndX + 2, centerY + ampPx + 18);
    ctx.stroke();
    const tipY = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI) * cosWt;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(wireEndX + 2, tipY, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = isDark ? '#475569' : '#334155';
    ctx.fillRect(wireEndX, centerY - 38, 10, 76);
  }

  const nodeCount = isFreeEnd ? harmonicN : harmonicN + 1;
  for (let nIdx = 0; nIdx < nodeCount; nIdx++) {
    const uNode = nIdx / effectiveHalfWaves;
    if (uNode <= 1.001) {
      const nx = wireStartX + Math.min(1, uNode) * wireLenPx;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(nx, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let aIdx = 0; aIdx < harmonicN; aIdx++) {
    const uAnti = (aIdx + 0.5) / effectiveHalfWaves;
    const ax = wireStartX + Math.min(1, uAnti) * wireLenPx;
    const ay = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI * Math.min(1, uAnti)) * cosWt;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(ax, ay, 4.8, 0, Math.PI * 2);
    ctx.fill();

    if (ov.showVectors && Math.abs(cosWt) > 0.15) {
      const vY = centerY - ampPx * Math.sin(effectiveHalfWaves * Math.PI * Math.min(1, uAnti)) * Math.sin(omega * t) * 0.45;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax, ay + (ay - vY) * 0.55);
      ctx.stroke();
    }
  }

  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('● Nút sóng (Biên độ = 0)', wireStartX, 26);
  ctx.fillStyle = '#10b981';
  ctx.fillText('● Bụng sóng (Biên độ 2A)', wireStartX + 165, 26);
  ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
  ctx.fillText(`l = ${lengthM.toFixed(2)} m · v = ${speedV.toFixed(0)} m/s`, wireStartX, h - 14);
}

// 18. Doppler Effect & Mach Cone
function drawDopplerEffect({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const vWave = Math.max(100, p.waveSpeed ?? 340);
  const vSource = Math.max(0, Math.min(vWave * 1.6, p.sourceSpeed ?? 140));
  const f0 = Math.max(100, p.sourceFreq ?? 440);
  const ratio = vSource / vWave;
  const isMach = ratio >= 1;

  const fApproach = ratio < 0.99 ? f0 * (vWave / (vWave - vSource)) : Infinity;
  const fRecede = f0 * (vWave / (vWave + vSource));

  pushTelemetry({
    metric1Label: "Tần số máy thu phía trước (f')",
    metric1Val: Number.isFinite(fApproach) ? `${fApproach.toFixed(1)} Hz` : 'Sóng xung kích!',
    metric2Label: 'Tần số phía sau (f")',
    metric2Val: `${fRecede.toFixed(1)} Hz`,
    metric3Label: 'Tỉ số Mach (v_s / v)',
    metric3Val: `${ratio.toFixed(2)} M`,
    note: isMach
      ? `Nguồn vượt tốc độ sóng (Mach = ${ratio.toFixed(2)}) tạo mặt đầu sóng hình nón (Sóng xung kích)!`
      : `Phía trước nguồn, các gợn sóng bị nén (λ' = λ·(1 - v_s/v)) nên tần số tăng lên ${fApproach.toFixed(1)} Hz.`
  });

  const cy = h * 0.52;
  const pxSpeedWave = 68;
  const pxSpeedSrc = pxSpeedWave * ratio;
  const periodSec = Math.max(0.16, 1.35 / Math.max(1, f0 / 350));

  const cycleDuration = Math.max(4.5, (w * 0.85) / Math.max(18, pxSpeedSrc || 40));
  const localT = ratio < 0.01 ? t % 6 : t % cycleDuration;
  const srcStartX = ratio < 0.01 ? w * 0.5 : w * 0.14;
  const srcX = srcStartX + pxSpeedSrc * localT;

  const numPulses = 16;
  const currentStep = Math.floor(localT / periodSec);
  for (let k = Math.max(0, currentStep - numPulses); k <= currentStep; k++) {
    const emitT = k * periodSec;
    const age = localT - emitT;
    if (age <= 0) continue;
    const emitX = srcStartX + pxSpeedSrc * emitT;
    const rad = pxSpeedWave * age;
    const alpha = Math.max(0.08, 1 - age / (numPulses * periodSec));

    ctx.strokeStyle = isDark
      ? `rgba(56, 189, 248, ${alpha.toFixed(2)})`
      : `rgba(2, 132, 199, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(emitX, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (isMach && localT > 0.25) {
    const halfConeAngle = Math.asin(Math.min(1, 1 / ratio));
    const coneLen = Math.min(w * 0.65, pxSpeedSrc * localT * 1.15);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.4;
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(srcX, cy);
      ctx.lineTo(
        srcX - coneLen * Math.cos(halfConeAngle),
        cy + sgn * coneLen * Math.sin(halfConeAngle)
      );
      ctx.stroke();
    }
  }

  if (ov.showVectors && vSource > 0) {
    const arrowLen = Math.min(90, 20 + ratio * 48);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(srcX, cy);
    ctx.lineTo(srcX + arrowLen, cy);
    ctx.lineTo(srcX + arrowLen - 7, cy - 5);
    ctx.moveTo(srcX + arrowLen, cy);
    ctx.lineTo(srcX + arrowLen - 7, cy + 5);
    ctx.stroke();
  }

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(srcX, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  const obsX = w - 48;
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(obsX, cy, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Máy thu', obsX, cy - 15);
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.fillText(`Nguồn f₀=${f0.toFixed(0)}Hz`, Math.min(w - 90, Math.max(70, srcX)), cy + 24);
}

// 19. Photoelectric Effect (Lớp 12)
function drawPhotoelectricEffect({ ctx, w, h, t, isDark, params: p, overlays: ov, pushTelemetry }: DrawCtx) {
  const lambdaNm = Math.max(150, Math.min(760, p.wavelengthNm ?? 280));
  const workEv = Math.max(1.2, Math.min(5.5, p.workFunctionEv ?? 2.14));
  const stopV = Math.max(-5, Math.min(5, p.voltageUak ?? 1.5));

  const photonEv = 1240 / lambdaNm;
  const lambda0Nm = 1240 / workEv;
  const canEmit = photonEv >= workEv;
  const maxKeEv = canEmit ? Math.max(0, photonEv - workEv) : 0;
  const stoppingV = maxKeEv;
  const netReachable = canEmit && stopV >= -stoppingV;

  let beamColor = '#8b5cf6';
  if (lambdaNm < 380) beamColor = '#a855f7';
  else if (lambdaNm < 450) beamColor = '#6366f1';
  else if (lambdaNm < 495) beamColor = '#3b82f6';
  else if (lambdaNm < 570) beamColor = '#10b981';
  else if (lambdaNm < 590) beamColor = '#eab308';
  else if (lambdaNm < 620) beamColor = '#f97316';
  else beamColor = '#ef4444';

  pushTelemetry({
    metric1Label: 'Năng lượng photon (ε)',
    metric1Val: `${photonEv.toFixed(2)} eV`,
    metric2Label: 'Giới hạn quang điện (λ₀)',
    metric2Val: `${lambda0Nm.toFixed(0)} nm`,
    metric3Label: 'Động năng ban đầu W_đ0max',
    metric3Val: canEmit ? `${maxKeEv.toFixed(2)} eV (U_h=${stoppingV.toFixed(2)}V)` : '0 eV (Không bứt e)',
    note: canEmit
      ? netReachable
        ? `ε = ${photonEv.toFixed(2)} eV ≥ A = ${workEv.toFixed(2)} eV → Bật quang electron! ${stopV < 0 ? 'Điện áp hãm đang làm chậm dòng e.' : 'U_AK giúp tăng tốc dòng quang điện.'}`
        : `Electron đã bật ra nhưng bị điện áp hãm |U_AK| = ${Math.abs(stopV).toFixed(2)} V > U_h = ${stoppingV.toFixed(2)} V đẩy ngược lại Catốt!`
      : `λ = ${lambdaNm.toFixed(0)} nm > λ₀ = ${lambda0Nm.toFixed(0)} nm (ε < A) → Không xảy ra hiệu ứng quang điện.`
  });

  const tubeL = w * 0.14;
  const tubeR = w * 0.86;
  const tubeW = tubeR - tubeL;
  const tubeTop = h * 0.24;
  const tubeBot = h * 0.78;
  const tubeMidY = (tubeTop + tubeBot) / 2;

  ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(226, 232, 240, 0.55)';
  ctx.strokeStyle = isDark ? '#475569' : '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(tubeL, tubeTop, tubeW, tubeBot - tubeTop, 32);
  ctx.fill();
  ctx.stroke();

  const catX = tubeL + 36;
  const anoX = tubeR - 36;
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(catX - 6, tubeTop + 22, 12, tubeBot - tubeTop - 44);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(anoX - 6, tubeTop + 22, 12, tubeBot - tubeTop - 44);

  for (let i = 0; i < 4; i++) {
    const targetY = tubeTop + 42 + i * ((tubeBot - tubeTop - 84) / 3);
    const startX = tubeL + tubeW * 0.42 + i * 16;
    const startY = 18;
    const progress = (t * 1.4 + i * 0.23) % 1;
    const px = startX + (catX - startX) * progress;
    const py = startY + (targetY - startY) * progress;

    ctx.strokeStyle = beamColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(catX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    ctx.fillStyle = beamColor;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (canEmit) {
    const travelSpan = anoX - catX - 12;
    const eSpeedFactor = Math.max(0.35, Math.min(2.2, 0.5 + maxKeEv * 0.35 + stopV * 0.14));
    for (let i = 0; i < 7; i++) {
      const yOff = tubeTop + 34 + ((i * 29) % Math.max(30, tubeBot - tubeTop - 68));
      const phase = (t * eSpeedFactor + i * 0.14) % 1;
      let ex: number;
      if (netReachable) {
        ex = catX + 8 + phase * travelSpan;
      } else {
        const maxReachRatio = Math.max(0.12, Math.min(0.85, stoppingV / Math.max(0.1, Math.abs(stopV))));
        const dist = Math.sin(phase * Math.PI) * travelSpan * maxReachRatio;
        ex = catX + 8 + dist;
      }
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ex, yOff, 4, 0, Math.PI * 2);
      ctx.fill();
      if (ov.showVectors) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ex, yOff);
        ctx.lineTo(ex + (netReachable || phase < 0.5 ? 10 : -10), yOff);
        ctx.stroke();
      }
    }
  }

  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0ea5e9';
  ctx.fillText(`Catốt (K) · A=${workEv.toFixed(2)}eV`, catX + 18, tubeBot + 18);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText(`Anốt (A) · U_AK=${stopV.toFixed(1)}V`, anoX - 18, tubeBot + 18);
  ctx.fillStyle = beamColor;
  ctx.fillText(`Chùm sáng λ = ${lambdaNm.toFixed(0)} nm`, w * 0.5, 22);
  if (!canEmit) {
    ctx.fillStyle = '#ef4444';
    ctx.fillText('KHÔNG BỨT ELECTRON (λ > λ₀)', (catX + anoX) / 2, tubeMidY);
  }
}

/**
 * Shared 2D Canvas Physics Frame Renderer used by both PhysicsLab (full 2D workbench)
 * and PhysicsInline2DSim (inline per-step visual lab inside every Physics lecture step).
 */
export function renderPhysics2DSimulation(opts: Physics2DRenderOptions): void {
  const { simType, ctx, w, h, t, isDark, params, overlays, pushTelemetry } = opts;

  // Clear Canvas Background
  ctx.fillStyle = isDark ? '#0c101d' : '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  // Draw Grid / Ruler Overlay
  if (overlays.showRulerGrid) {
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
  }

  switch (simType) {
    case 'ohm_circuit':
      drawOhmCircuit(opts);
      break;
    case 'lens_optics':
      drawLensOptics(opts);
      break;
    case 'projectile_motion':
      drawProjectile(opts);
      break;
    case 'free_fall_energy':
      drawFreeFall(opts);
      break;
    case 'light_refraction':
      drawRefraction(opts);
      break;
    case 'magnetic_induction':
      drawInduction(opts);
      break;
    case 'spring_pendulum':
      drawSpring(opts);
      break;
    case 'simple_pendulum':
      drawPendulum(opts);
      break;
    case 'wave_interference':
      drawWaveInterference(opts);
      break;
    case 'kinematics_graphs':
      drawKinematicsGraphs(opts);
      break;
    case 'thermal_gas':
      drawThermalGas(opts);
      break;
    case 'electric_field':
      drawElectricField(opts);
      break;
    case 'nuclear_decay':
      drawNuclearDecay(opts);
      break;
    case 'circular_motion':
      drawCircularMotion(opts);
      break;
    case 'ac_rlc_circuit':
      drawAcRlcCircuit(opts);
      break;
    case 'young_interference':
      drawYoungInterference(opts);
      break;
    case 'standing_wave':
      drawStandingWave(opts);
      break;
    case 'doppler_effect':
      drawDopplerEffect(opts);
      break;
    case 'photoelectric_effect':
      drawPhotoelectricEffect(opts);
      break;
    default: {
      const handledExtra = renderExtra2DPhysicsSim(
        simType,
        ctx,
        w,
        h,
        t,
        isDark,
        params,
        overlays,
        pushTelemetry
      );
      if (!handledExtra) {
        drawSpring(opts);
      }
      break;
    }
  }

  // Subtle Time Stamp badge in top-right of canvas
  ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(w - 94, 8, 84, 22);
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(w - 94, 8, 84, 22);
  ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`t = ${t.toFixed(2)}s`, w - 52, 23);
}
