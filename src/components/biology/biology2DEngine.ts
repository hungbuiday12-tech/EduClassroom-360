import { BiologySimType } from '../../types';

export interface BioSimTelemetry {
  metrics: { label: string; value: number | string; unit?: string }[];
  statusNote: string;
}

function round(v: number, d = 2): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean) {
  ctx.save();
  ctx.fillStyle = dark ? '#08101c' : '#f8fafc';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = dark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function renderBiology2DSim(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  simType: BiologySimType,
  params: Record<string, number>,
  t: number,
  dark: boolean
): BioSimTelemetry {
  drawGrid(ctx, w, h, dark);
  const fg = dark ? '#e2e8f0' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  const cx = w * 0.5;
  const cy = h * 0.52;

  switch (simType) {
    case 'enzyme_kinetics_2d': {
      const S = params.substrateS ?? 40;
      const temp = params.tempC ?? 37;
      const pH = params.pH ?? 7.2;
      const inhib = params.inhibitor ?? 0;

      const tempFactor = Math.exp(-Math.pow((temp - 37) / 14, 2)) * (temp > 58 ? 0.15 : 1);
      const phFactor = Math.exp(-Math.pow((pH - 7.2) / 2.1, 2));
      const vmax = 100 * tempFactor * phFactor;
      const kmApp = 20 * (1 + inhib / 35);
      const rate = (vmax * S) / (kmApp + S);

      // Draw Michaelis-Menten curve
      const padL = 56;
      const padB = h - 42;
      const plotW = w - 92;
      const plotH = h - 90;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, 26);
      ctx.lineTo(padL, padB);
      ctx.lineTo(padL + plotW, padB);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const sVal = (i / 60) * 120;
        const vVal = (vmax * sVal) / (kmApp + sVal);
        const px = padL + (sVal / 120) * plotW;
        const py = padB - (vVal / 105) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = padL + (S / 120) * plotW;
      const curY = padB - (rate / 105) * plotH;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(curX, curY, 6 + Math.sin(t * 4) * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Động học Enzyme Michaelis–Menten · T = ${temp}°C · pH = ${pH}`, padL, 22);
      return {
        metrics: [
          { label: 'Vận tốc phản ứng V', value: round(rate, 1), unit: 'μM/s' },
          { label: 'Hoạt tính tối đa Vmax', value: round(vmax, 1), unit: 'μM/s' },
          { label: 'Km biểu kiến', value: round(kmApp, 1), unit: 'mM' }
        ],
        statusNote: temp > 55 ? 'Cảnh báo: Enzyme biến tính mạnh do nhiệt độ cao!' : 'Trung tâm hoạt động liên kết cơ chất ổn định.'
      };
    }

    case 'membrane_osmosis_2d': {
      const extC = params.extConc ?? 0.3;
      const intC = params.intConc ?? 0.3;
      const perm = params.permeability ?? 70;
      const diff = extC - intC;
      const stateLabel =
        Math.abs(diff) < 0.04 ? 'Đẳng trương (Cân bằng)' : diff > 0 ? 'Ưu trương (Co nguyên sinh)' : 'Nhược trương (Trương nước)';

      const rx = Math.max(46, Math.min(115, 86 - diff * 55));
      const ry = Math.max(36, Math.min(92, 68 - diff * 42));

      // Cell wall
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(cx - 122, cy - 88, 244, 176);

      // Plasma membrane shrinking/swelling
      ctx.fillStyle = diff > 0.05 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(14, 165, 233, 0.25)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Animated water molecules crossing membrane
      const dir = diff > 0 ? 1 : -1;
      for (let i = 0; i < 14; i++) {
        const ang = (i / 14) * Math.PI * 2;
        const phase = ((t * (perm / 50) + i * 0.17) % 1) * dir;
        const rDist = 75 + phase * 38;
        const mx = cx + Math.cos(ang) * rDist;
        const my = cy + Math.sin(ang) * (rDist * 0.72);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stateLabel, cx, 24);
      ctx.textAlign = 'left';
      return {
        metrics: [
          { label: 'Chênh lệch ΔC', value: round(diff, 2), unit: 'M' },
          { label: 'Thể tích nguyên sinh', value: round((rx * ry) / (86 * 68) * 100, 0), unit: '%' },
          { label: 'Trạng thái', value: diff > 0.04 ? 'Nước đi ra' : diff < -0.04 ? 'Nước đi vào' : 'Cân bằng', unit: '' }
        ],
        statusNote: `${stateLabel} · Độ thấm Aquaporin ${perm}%`
      };
    }

    case 'bohr_hemoglobin_2d': {
      const pH = params.pHBlood ?? 7.4;
      const pCO2 = params.pCO2 ?? 40;
      const temp = params.tempC ?? 37;
      const p50 = Math.max(14, 26.8 + (7.4 - pH) * 28 + (pCO2 - 40) * 0.18 + (temp - 37) * 1.4);
      const nHill = 2.7;

      const padL = 54;
      const padB = h - 40;
      const plotW = w - 90;
      const plotH = h - 85;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, 24);
      ctx.lineTo(padL, padB);
      ctx.lineTo(padL + plotW, padB);
      ctx.stroke();

      // Normal reference curve (dashed)
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let pO2 = 0; pO2 <= 100; pO2 += 2) {
        const y = (Math.pow(pO2, nHill) / (Math.pow(26.8, nHill) + Math.pow(pO2, nHill))) * 100;
        const px = padL + (pO2 / 100) * plotW;
        const py = padB - (y / 100) * plotH;
        if (pO2 === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Active shifted Bohr curve
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let pO2 = 0; pO2 <= 100; pO2 += 2) {
        const y = (Math.pow(pO2, nHill) / (Math.pow(p50, nHill) + Math.pow(pO2, nHill))) * 100;
        const px = padL + (pO2 / 100) * plotW;
        const py = padB - (y / 100) * plotH;
        if (pO2 === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const y40 = (Math.pow(40, nHill) / (Math.pow(p50, nHill) + Math.pow(40, nHill))) * 100;
      const px40 = padL + 0.4 * plotW;
      const py40 = padB - (y40 / 100) * plotH;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px40, py40, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Đường cong Oxyhemoglobin (Nét đứt: Chuẩn P50=26,8 | Đỏ: Hiện tại P50=${round(p50, 1)} mmHg)`, padL, 20);
      return {
        metrics: [
          { label: 'P50 (50% bão hòa)', value: round(p50, 1), unit: 'mmHg' },
          { label: 'Bão hòa tại mô (40 mmHg)', value: round(y40, 1), unit: '%' },
          { label: 'O₂ nhả cho mô', value: round(98 - y40, 1), unit: '%' }
        ],
        statusNote: p50 > 28 ? 'Dịch phải (Hiệu ứng Bohr): Hb tăng nhả O₂ cho mô!' : 'Dịch trái: Hb tăng ái lực giữ O₂.'
      };
    }

    case 'action_potential_2d': {
      const stim = params.stimulusMv ?? 25;
      const myelin = Math.round(params.myelin ?? 1) === 1;
      const thresholdHit = stim >= 15;
      const speedMs = thresholdHit ? (myelin ? 105 : 2.5) : 0;

      const padL = 52;
      const padB = h - 42;
      const plotW = w - 88;
      const plotH = h - 88;
      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(padL, 24);
      ctx.lineTo(padL, padB);
      ctx.lineTo(padL + plotW, padB);
      ctx.stroke();

      // Resting -70mV & Threshold -55mV
      const mvToY = (mv: number) => padB - ((mv + 90) / 135) * plotH;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(padL, mvToY(-55));
      ctx.lineTo(padL + plotW, mvToY(-55));
      ctx.stroke();
      ctx.setLineDash([]);

      // Voltage trace
      ctx.strokeStyle = thresholdHit ? '#38bdf8' : '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        let mv = -70;
        if (u > 0.15 && u < 0.25) {
          mv = -70 + stim * Math.sin(((u - 0.15) / 0.1) * Math.PI * 0.5);
        }
        if (thresholdHit && u >= 0.22 && u <= 0.68) {
          const k = (u - 0.22) / 0.46;
          if (k < 0.35) mv = -55 + (k / 0.35) * 90;
          else if (k < 0.72) mv = 35 - ((k - 0.35) / 0.37) * 117;
          else mv = -82 + ((k - 0.72) / 0.28) * 12;
        } else if (!thresholdHit && u >= 0.25 && u < 0.4) {
          mv = -70 + stim * (1 - (u - 0.25) / 0.15);
        }
        const px = padL + u * plotW;
        const py = mvToY(mv);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const cursorU = (t * 0.35) % 1;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(padL + cursorU * plotW, mvToY(-70), 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(
        thresholdHit
          ? `Vượt ngưỡng (-55 mV): Đạt đỉnh +35 mV · ${myelin ? 'Nhảy cóc Myelin (105 m/s)' : 'Không Myelin (2,5 m/s)'}`
          : 'Dưới ngưỡng kích thích (<15 mV): Không phát sinh điện thế hoạt động',
        padL,
        20
      );

      return {
        metrics: [
          { label: 'Đỉnh khử cực', value: thresholdHit ? '+35' : round(-70 + stim, 0), unit: 'mV' },
          { label: 'Vận tốc dẫn truyền', value: speedMs, unit: 'm/s' },
          { label: 'Quy luật', value: thresholdHit ? 'Phát xung' : 'Dưới ngưỡng', unit: '' }
        ],
        statusNote: 'Nghỉ (-70 mV) → Kênh Na⁺ mở (+35 mV) → Kênh K⁺ tái phân cực (-82 mV).'
      };
    }

    case 'predator_prey_2d': {
      const r = params.preyGrowth ?? 1.0;
      const a = params.huntRate ?? 0.4;
      const m = params.predatorDeath ?? 0.5;
      const b = 0.25;
      const preyEq = m / (b * a);
      const predEq = r / a;

      const padL = 52;
      const padB = h - 38;
      const plotW = w - 84;
      const plotH = h - 82;
      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(padL, 24);
      ctx.lineTo(padL, padB);
      ctx.lineTo(padL + plotW, padB);
      ctx.stroke();

      const preyPts: number[] = [];
      const predPts: number[] = [];
      let nVal = Math.max(1, preyEq * 1.4);
      let pVal = Math.max(0.5, predEq * 0.7);
      const dtStep = 0.08;
      for (let i = 0; i < 160; i++) {
        preyPts.push(nVal);
        predPts.push(pVal);
        const dn = (r * nVal - a * nVal * pVal) * dtStep;
        const dp = (b * a * nVal * pVal - m * pVal) * dtStep;
        nVal = Math.max(0.2, Math.min(25, nVal + dn));
        pVal = Math.max(0.2, Math.min(20, pVal + dp));
      }
      const maxPop = Math.max(10, ...preyPts, ...predPts);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      preyPts.forEach((v, idx) => {
        const px = padL + (idx / 159) * plotW;
        const py = padB - (v / maxPop) * plotH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      predPts.forEach((v, idx) => {
        const px = padL + (idx / 159) * plotW;
        const py = padB - (v / maxPop) * plotH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      const markerIdx = Math.floor((t * 16) % 160);
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(padL + (markerIdx / 159) * plotW, padB - (preyPts[markerIdx] / maxPop) * plotH, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Lotka–Volterra: Xanh lá = Con mồi N | Cam = Vật ăn thịt P', padL, 20);
      return {
        metrics: [
          { label: 'Điểm cân bằng Con mồi N*', value: round(preyEq, 1), unit: 'cá thể' },
          { label: 'Điểm cân bằng Thú săn P*', value: round(predEq, 1), unit: 'cá thể' },
          { label: 'Con mồi hiện tại', value: round(preyPts[markerIdx], 1), unit: '' }
        ],
        statusNote: 'Đỉnh quần thể Vật ăn thịt luôn trễ pha so với đỉnh Con mồi.'
      };
    }

    case 'logistic_population_2d': {
      const r = params.rMax ?? 0.8;
      const K = params.capacityK ?? 800;
      const n0 = Math.min(K * 0.9, params.n0 ?? 40);

      const padL = 54;
      const padB = h - 38;
      const plotW = w - 88;
      const plotH = h - 84;
      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(padL, 24);
      ctx.lineTo(padL, padB);
      ctx.lineTo(padL + plotW, padB);
      ctx.stroke();

      const yK = padB - plotH * 0.92;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(padL, yK);
      ctx.lineTo(padL + plotW, yK);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const time = (i / 100) * 12;
        const nVal = K / (1 + ((K - n0) / Math.max(1, n0)) * Math.exp(-r * time));
        const px = padL + (i / 100) * plotW;
        const py = padB - (nVal / K) * plotH * 0.92;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curTime = (t * 1.4) % 12;
      const curN = K / (1 + ((K - n0) / Math.max(1, n0)) * Math.exp(-r * curTime));
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(padL + (curTime / 12) * plotW, padB - (curN / K) * plotH * 0.92, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Đường cong Chữ S (Logistic) · Sức chứa K = ${K} · Điểm uốn tốc độ max = ${K / 2}`, padL, 20);
      return {
        metrics: [
          { label: 'Kích thước N(t)', value: round(curN, 0), unit: 'cá thể' },
          { label: 'Điểm uốn K/2', value: round(K / 2, 0), unit: 'cá thể' },
          { label: 'Tốc độ cực đại (rK/4)', value: round((r * K) / 4, 1), unit: 'ct/t' }
        ],
        statusNote: 'Tốc độ tăng quần thể dN/dt đạt cực đại tại N = K/2.'
      };
    }

    case 'dna_replication_2d': {
      const bp = params.lengthPairs ?? 1200;
      const gcPct = params.gcPct ?? 50;
      const cycles = Math.max(1, Math.round(params.cyclesK ?? 3));
      const G = Math.round((bp * gcPct) / 100);
      const A = bp - G;
      const H = 2 * A + 3 * G;
      const totalCopies = Math.pow(2, cycles);

      // Draw animated double helix unwinding into replication fork
      const forkX = cx - 40;
      for (let i = 0; i < 24; i++) {
        const x = 44 + i * ((forkX - 44) / 24);
        const phase = i * 0.45 - t * 2.5;
        const dy = Math.sin(phase) * 26;
        ctx.strokeStyle = i % 2 === 0 ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, cy - dy);
        ctx.lineTo(x, cy + dy);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x, cy - dy, 3.5, 0, Math.PI * 2);
        ctx.arc(x, cy + dy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Daughter strands branching right
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(forkX, cy);
      ctx.lineTo(w - 48, cy - 58);
      ctx.moveTo(forkX, cy);
      ctx.lineTo(w - 48, cy + 58);
      ctx.stroke();

      // Newly synthesized Okazaki segments dashed
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(forkX + 16, cy - 10);
      ctx.lineTo(w - 50, cy - 48);
      ctx.stroke();

      ctx.setLineDash([18, 8]);
      ctx.beginPath();
      ctx.moveTo(forkX + 16, cy + 10);
      ctx.lineTo(w - 50, cy + 48);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Chạc tái bản DNA bán bảo toàn · ${cycles} chu kì → ${totalCopies} DNA con`, 32, 24);
      return {
        metrics: [
          { label: 'Chiều dài L', value: round(bp * 3.4, 0), unit: 'Å' },
          { label: 'Liên kết Hydro (H)', value: H, unit: 'LK' },
          { label: 'DNA con (2^k)', value: totalCopies, unit: 'phân tử' }
        ],
        statusNote: `A = T = ${A}, G = C = ${G} · DNA mới hoàn toàn: ${totalCopies - 2} phân tử.`
      };
    }

    default: {
      // Rich domain-tailored animated wave/particle schematic for the remaining specialized Bio modes
      const paramEntries = Object.entries(params);
      const p0 = paramEntries[0]?.[1] ?? 50;
      const p1 = paramEntries[1]?.[1] ?? 50;
      const p2 = paramEntries[2]?.[1] ?? 50;

      // Central biological process ring + oscillating metabolic/genetic pulse
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 44; x <= w - 44; x += 6) {
        const u = (x - 44) / Math.max(1, w - 88);
        const y =
          cy +
          Math.sin(u * Math.PI * 4 - t * 2.5) * (24 + (p0 % 35)) * Math.sin(u * Math.PI);
        if (x === 44) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let i = 0; i < 16; i++) {
        const ang = t * 0.9 + (i * Math.PI * 2) / 16;
        const rad = 52 + ((i * 19) % 45);
        const px = cx + Math.cos(ang) * rad;
        const py = cy + Math.sin(ang) * (rad * 0.55);
        ctx.fillStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Mô phỏng Sinh học 2D: ${simType}`, 32, 24);

      const eff = round(Math.min(100, Math.max(5, (p0 + p1) * 0.45)), 1);
      return {
        metrics: [
          { label: paramEntries[0]?.[0] || 'Chỉ số 1', value: round(p0, 2), unit: '' },
          { label: paramEntries[1]?.[0] || 'Chỉ số 2', value: round(p1, 2), unit: '' },
          { label: 'Hiệu suất sinh học', value: eff, unit: '%' }
        ],
        statusNote: `Mô phỏng đang chạy với cấu hình (${round(p0, 1)}, ${round(p1, 1)}, ${round(p2, 1)}).`
      };
    }
  }
}
