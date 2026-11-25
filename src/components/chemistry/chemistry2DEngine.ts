import { ChemistrySimType } from '../../types';

export interface ChemSimTelemetry {
  metrics: { label: string; value: number | string; unit?: string }[];
  statusNote: string;
}

function round(val: number, digits = 2): number {
  const f = Math.pow(10, digits);
  return Math.round(val * f) / f;
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean) {
  ctx.save();
  ctx.fillStyle = dark ? '#0b1120' : '#f8fafc';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = dark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 2
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const hl = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hl * Math.cos(ang - Math.PI / 6), y2 - hl * Math.sin(ang - Math.PI / 6));
  ctx.lineTo(x2 - hl * Math.cos(ang + Math.PI / 6), y2 - hl * Math.sin(ang + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function renderChemistry2DSim(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  simType: ChemistrySimType,
  params: Record<string, number>,
  t: number,
  dark: boolean
): ChemSimTelemetry {
  drawGrid(ctx, w, h, dark);
  const fg = dark ? '#e2e8f0' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  const cx = w * 0.5;
  const cy = h * 0.5;

  switch (simType) {
    case 'atomic_orbitals_2d': {
      const n = Math.max(1, Math.min(4, Math.round(params.n ?? 2)));
      const l = Math.max(0, Math.min(n - 1, Math.round(params.l ?? 1)));
      const zEff = params.zEff ?? 6;
      const aoNames = ['s (Cầu)', 'p (Số 8)', 'd (4 thùy)', 'f (Đa thùy)'];

      // Draw probability cloud
      const maxR = Math.min(w, h) * 0.34;
      for (let i = 0; i < 420; i++) {
        const seed = i * 137.508 + Math.floor(t * 2.5) * 0.01;
        const rNorm = ((i * 0.618033) % 1) * (0.25 + 0.18 * n);
        const theta = seed + t * 0.25;
        let lobeWeight = 1;
        let phaseSign = 1;
        if (l === 1) {
          lobeWeight = Math.abs(Math.cos(theta));
          phaseSign = Math.cos(theta) >= 0 ? 1 : -1;
        } else if (l === 2) {
          lobeWeight = Math.abs(Math.sin(2 * theta));
          phaseSign = Math.sin(2 * theta) >= 0 ? 1 : -1;
        }
        if (lobeWeight < 0.22) continue;
        const rad = maxR * rNorm * lobeWeight;
        const px = cx + rad * Math.cos(theta);
        const py = cy + rad * Math.sin(theta);
        ctx.fillStyle = phaseSign > 0 ? 'rgba(14,165,233,0.55)' : 'rgba(244,63,94,0.55)';
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Nucleus
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`AO ${n}${['s', 'p', 'd', 'f'][l]} · Z = ${zEff}`, 18, 28);
      ctx.fillStyle = muted;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`Số nút xuyên tâm (n - l - 1) = ${Math.max(0, n - l - 1)} · Nút góc l = ${l}`, 18, 48);

      return {
        metrics: [
          { label: 'Phân lớp AO', value: `${n}${['s', 'p', 'd', 'f'][l]}` },
          { label: 'Hình học', value: aoNames[l] || 's' },
          { label: 'Số AO tối đa', value: 2 * l + 1, unit: 'AO' }
        ],
        statusNote: 'Màu xanh (+ψ) và hồng (−ψ) biểu diễn hai pha ngược dấu của hàm sóng.'
      };
    }

    case 'periodic_trends_2d': {
      const zMax = Math.max(10, Math.min(36, Math.round(params.zMax ?? 20)));
      const highlightZ = Math.max(1, Math.min(zMax, Math.round(params.highlightZ ?? 11)));
      const mode = Math.round(params.mode ?? 1);
      const labels = ['Bán kính R (pm)', 'Năng lượng ion hóa IE₁ (kJ/mol)', 'Độ âm điện Pauling χ'];
      const symbols = ['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr'];
      const rVals = [37,32,152,112,85,77,70,66,64,70,186,160,143,118,110,103,99,98,227,197,162,147,134,128,127,126,125,124,128,134,135,122,121,117,114,112];
      const ieVals = [1312,2372,520,899,801,1086,1402,1314,1681,2081,496,738,578,787,1012,1000,1251,1521,419,590,633,659,651,653,717,762,760,737,745,906,579,762,947,941,1140,1351];
      const enVals = [2.2,0,0.98,1.57,2.04,2.55,3.04,3.44,3.98,0,0.93,1.31,1.61,1.9,2.19,2.58,3.16,0,0.82,1.0,1.36,1.54,1.63,1.66,1.55,1.83,1.88,1.91,1.9,1.65,1.81,2.01,2.18,2.55,2.96,3.0];

      const series = mode === 1 ? rVals : mode === 2 ? ieVals : enVals;
      const maxVal = Math.max(...series.slice(0, zMax));
      const padL = 56;
      const padB = 46;
      const plotW = w - padL - 28;
      const plotH = h - 88 - padB;

      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(padL, 54);
      ctx.lineTo(padL, 54 + plotH);
      ctx.lineTo(padL + plotW, 54 + plotH);
      ctx.stroke();

      ctx.strokeStyle = mode === 1 ? '#0ea5e9' : mode === 2 ? '#f59e0b' : '#10b981';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i < zMax; i++) {
        const px = padL + (i / Math.max(1, zMax - 1)) * plotW;
        const py = 54 + plotH - (series[i] / (maxVal || 1)) * (plotH - 12);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      for (let i = 0; i < zMax; i++) {
        const px = padL + (i / Math.max(1, zMax - 1)) * plotW;
        const py = 54 + plotH - (series[i] / (maxVal || 1)) * (plotH - 12);
        const isSel = i + 1 === highlightZ;
        ctx.fillStyle = isSel ? '#f43f5e' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, isSel ? 6 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        if (isSel || i % 3 === 0) {
          ctx.fillStyle = isSel ? '#f43f5e' : muted;
          ctx.font = isSel ? 'bold 12px Inter, sans-serif' : '10px Inter, sans-serif';
          ctx.fillText(symbols[i], px - 6, 54 + plotH + 16);
        }
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`${labels[mode - 1]} · Đang chọn: Z=${highlightZ} (${symbols[highlightZ - 1]} = ${series[highlightZ - 1]})`, 18, 28);

      return {
        metrics: [
          { label: 'Nguyên tố', value: `${symbols[highlightZ - 1]} (Z=${highlightZ})` },
          { label: 'Bán kính R', value: rVals[highlightZ - 1], unit: 'pm' },
          { label: 'IE₁ / Độ âm điện χ', value: `${ieVals[highlightZ - 1]} / ${enVals[highlightZ - 1]}` }
        ],
        statusNote: 'Quan sát bước nhảy chu kì rõ rệt sau mỗi khí hiếm (He, Ne, Ar, Kr).'
      };
    }

    case 'acid_base_titration_2d': {
      const acidC = params.acidConc ?? 0.1;
      const baseMl = params.baseAddedMl ?? 12;
      const isWeak = Math.round(params.isWeakAcid ?? 0) === 1;
      const va = 25;
      const cb = 0.1;
      const vEq = (acidC * va) / cb;

      const calcPh = (vb: number) => {
        const molA = acidC * va;
        const molB = cb * vb;
        const totV = va + vb;
        if (Math.abs(molA - molB) < 1e-4) return isWeak ? 8.72 : 7.0;
        if (molB < molA) {
          if (!isWeak) return Math.max(0.5, -Math.log10((molA - molB) / totV));
          const ratio = Math.max(0.02, molB / Math.max(0.01, molA - molB));
          return Math.min(8.5, 4.76 + Math.log10(ratio));
        }
        const oh = (molB - molA) / totV;
        return Math.min(13.5, 14 + Math.log10(oh));
      };

      const curPh = round(calcPh(baseMl), 2);
      const isPink = curPh >= 8.2;

      // Left: Burette + Erlenmeyer Flask
      const fx = w * 0.25;
      const fy = h * 0.68;
      // Burette
      ctx.strokeStyle = muted;
      ctx.lineWidth = 2;
      ctx.strokeRect(fx - 12, 24, 24, 108);
      const buretteFill = Math.max(0.1, 1 - baseMl / 50);
      ctx.fillStyle = 'rgba(56,189,248,0.35)';
      ctx.fillRect(fx - 10, 26 + (1 - buretteFill) * 102, 20, buretteFill * 102);

      // Animated falling drop
      const dropY = 136 + ((t * 95) % 58);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(fx, dropY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Flask
      ctx.beginPath();
      ctx.moveTo(fx - 14, fy - 42);
      ctx.lineTo(fx - 52, fy + 48);
      ctx.lineTo(fx + 52, fy + 48);
      ctx.lineTo(fx + 14, fy - 42);
      ctx.closePath();
      ctx.fillStyle = isPink
        ? 'rgba(236,72,153,0.45)'
        : curPh > 6.5
        ? 'rgba(244,114,182,0.2)'
        : 'rgba(148,163,184,0.16)';
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.stroke();

      // Right: pH Titration Curve
      const gx = w * 0.48;
      const gw = w * 0.46;
      const gy = 48;
      const gh = h - 92;
      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy + gh);
      ctx.lineTo(gx + gw, gy + gh);
      ctx.stroke();

      // Equivalence dashed line
      const eqX = gx + (vEq / 50) * gw;
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(eqX, gy);
      ctx.lineTo(eqX, gy + gh);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let ml = 0; ml <= 50; ml += 0.5) {
        const px = gx + (ml / 50) * gw;
        const py = gy + gh - (calcPh(ml) / 14) * gh;
        if (ml === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Current marker
      const curX = gx + (baseMl / 50) * gw;
      const curY = gy + gh - (curPh / 14) * gh;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`pH = ${curPh} · V_tđ = ${round(vEq, 1)} mL`, gx, 28);
      ctx.fillStyle = muted;
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`V_NaOH = ${baseMl} mL`, fx - 38, fy + 68);

      return {
        metrics: [
          { label: 'pH hiện tại', value: curPh },
          { label: 'Điểm tương đương V_tđ', value: round(vEq, 1), unit: 'mL' },
          { label: 'Màu chỉ thị', value: isPink ? 'Hồng bền (pH ≥ 8.2)' : 'Không màu' }
        ],
        statusNote: 'Quan sát bước nhảy pH thẳng đứng tại điểm tương đương V_tđ.'
      };
    }

    case 'galvanic_cell_2d': {
      const anode = Math.round(params.anodeMetal ?? 1);
      const concA = params.znConc ?? 1.0;
      const concC = params.cuConc ?? 1.0;
      const names = ['Zn', 'Fe', 'Mg'];
      const e0s = [-0.76, -0.44, -2.37];
      const e0Pin = 0.34 - e0s[anode - 1];
      const q = concA / Math.max(0.01, concC);
      const eCell = round(e0Pin - (0.0592 / 2) * Math.log10(q), 3);

      // Left beaker (Anode) & Right beaker (Cathode)
      const lx = w * 0.25;
      const rx = w * 0.75;
      const by = h * 0.56;

      // Beakers
      [lx, rx].forEach((bx, idx) => {
        ctx.fillStyle = idx === 0 ? 'rgba(148,163,184,0.2)' : 'rgba(14,165,233,0.28)';
        ctx.fillRect(bx - 65, by - 30, 130, 105);
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 65, by - 30, 130, 105);
      });

      // Electrodes
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(lx - 42, by - 65, 22, 115);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(rx + 20, by - 65, 22, 115);

      // Salt bridge
      ctx.strokeStyle = dark ? '#cbd5e1' : '#475569';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(lx + 24, by + 10);
      ctx.lineTo(lx + 24, by - 64);
      ctx.lineTo(rx - 24, by - 64);
      ctx.lineTo(rx - 24, by + 10);
      ctx.stroke();

      // Wire + Voltmeter
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lx - 31, by - 65);
      ctx.lineTo(lx - 31, 46);
      ctx.lineTo(rx + 31, 46);
      ctx.lineTo(rx + 31, by - 65);
      ctx.stroke();

      ctx.fillStyle = dark ? '#0f172a' : '#fff';
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, 46, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`${eCell}V`, cx - 22, 50);

      // Animated electrons moving left -> right
      for (let i = 0; i < 6; i++) {
        const u = ((t * 0.45 + i / 6) % 1);
        const ex = lx - 31 + u * (rx + 31 - (lx - 31));
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, 46, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      drawArrow(ctx, cx - 70, 32, cx - 35, 32, '#38bdf8', 2);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`Anode (−): ${names[anode - 1]}`, lx - 50, h - 18);
      ctx.fillText(`Cathode (+): Cu`, rx - 45, h - 18);

      return {
        metrics: [
          { label: 'Suất điện động E_pin', value: eCell, unit: 'V' },
          { label: 'E°_pin chuẩn', value: round(e0Pin, 2), unit: 'V' },
          { label: 'Cực âm (Anode)', value: `${names[anode - 1]} -> ${names[anode - 1]}²⁺ + 2e` }
        ],
        statusNote: 'Electron chạy từ Anode sang Cathode; cầu muối cân bằng ion giữa 2 bình.'
      };
    }

    case 'electrolysis_faraday_2d': {
      const current = params.currentA ?? 5;
      const mins = params.timeMin ?? 16;
      const code = Math.round(params.electrolyteCode ?? 1);
      const ne = round((current * mins * 60) / 96500, 3);
      const mCu = code === 2 ? 0 : round((ne / 2) * 64, 2);
      const gasMol = round(code === 1 ? ne / 4 : ne / 2, 3);

      // Tank
      ctx.fillStyle = code === 2 ? 'rgba(148,163,184,0.18)' : 'rgba(14,165,233,0.28)';
      ctx.fillRect(cx - 140, cy - 45, 280, 145);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 140, cy - 45, 280, 145);

      // Electrodes
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 95, cy - 72, 20, 130); // Cathode
      ctx.fillRect(cx + 75, cy - 72, 20, 130); // Anode
      if (code !== 2) {
        const coat = Math.min(8, 2 + mCu * 0.45);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cx - 95 - coat / 2, cy - 40, 20 + coat, 98);
      }

      // Rising gas bubbles on anode (or both if NaCl)
      for (let i = 0; i < 12; i++) {
        const by = cy + 75 - ((t * 55 + i * 19) % 115);
        const bx = cx + 85 + Math.sin(t * 4 + i) * 9;
        ctx.fillStyle = code === 1 ? 'rgba(56,189,248,0.8)' : 'rgba(163,230,53,0.8)';
        ctx.beginPath();
        ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
        ctx.fill();
        if (code === 2) {
          ctx.fillStyle = 'rgba(226,232,240,0.85)';
          ctx.beginPath();
          ctx.arc(cx - 85 + Math.cos(t * 4 + i) * 8, by, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`I = ${current} A · t = ${mins} phút · n_e = ${ne} mol`, 18, 28);
      ctx.fillText('Cathode (−)', cx - 122, cy - 82);
      ctx.fillText('Anode (+)', cx + 56, cy - 82);

      return {
        metrics: [
          { label: 'Số mol electron n_e', value: ne, unit: 'mol' },
          { label: 'Khối lượng Cu bám', value: mCu, unit: 'g' },
          { label: code === 1 ? 'Khí O₂ Anode' : 'Khí Cl₂ Anode', value: gasMol, unit: 'mol' }
        ],
        statusNote: 'Áp dụng m = A·I·t / (n·F) với F = 96500 C/mol.'
      };
    }

    case 'enthalpy_hess_2d': {
      const dh = params.deltaH ?? -92;
      const ea = params.ea ?? 110;
      const drop = params.catalystDrop ?? 38;
      const startY = dh < 0 ? cy - 20 : cy + 45;
      const endY = startY - dh * 0.42;
      const peakY = Math.min(startY, endY) - ea * 0.48;
      const catPeakY = Math.min(startY, endY) - Math.max(20, ea - drop) * 0.48;

      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(64, 38);
      ctx.lineTo(64, h - 38);
      ctx.lineTo(w - 36, h - 38);
      ctx.stroke();

      // Uncatalyzed curve
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(85, startY);
      ctx.lineTo(w * 0.25, startY);
      ctx.bezierCurveTo(w * 0.4, startY, w * 0.42, peakY, cx, peakY);
      ctx.bezierCurveTo(w * 0.58, peakY, w * 0.62, endY, w * 0.76, endY);
      ctx.lineTo(w - 56, endY);
      ctx.stroke();

      // Catalyzed curve
      if (drop > 0) {
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(w * 0.25, startY);
        ctx.bezierCurveTo(w * 0.4, startY, w * 0.42, catPeakY, cx, catPeakY);
        ctx.bezierCurveTo(w * 0.58, catPeakY, w * 0.62, endY, w * 0.76, endY);
        ctx.stroke();
        ctx.restore();
      }

      // Animated reaction progress sphere
      const prog = (t * 0.28) % 1;
      const bx = 85 + prog * (w - 145);
      const by =
        prog < 0.2
          ? startY
          : prog > 0.8
          ? endY
          : startY + (endY - startY) * ((prog - 0.2) / 0.6) - Math.sin(((prog - 0.2) / 0.6) * Math.PI) * (ea - drop) * 0.46;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`${dh < 0 ? 'Tỏa nhiệt' : 'Thu nhiệt'}: ΔH = ${dh > 0 ? `+${dh}` : dh} kJ · Ea(xt) = ${Math.max(15, ea - drop)} kJ`, 74, 28);

      return {
        metrics: [
          { label: 'Biến thiên ΔH', value: dh, unit: 'kJ/mol' },
          { label: 'Ea không xúc tác', value: ea, unit: 'kJ' },
          { label: 'Ea có xúc tác', value: Math.max(15, ea - drop), unit: 'kJ' }
        ],
        statusNote: 'Xúc tác làm giảm rào năng lượng hoạt hóa Ea nhưng KHÔNG làm thay đổi ΔH.'
      };
    }

    case 'maxwell_boltzmann_2d': {
      const tempK = params.tempK ?? 350;
      const ea = params.eaThreshold ?? 55;
      const shift = params.catalystShift ?? 0;
      const effEa = Math.max(15, ea - shift);

      const gx = 54;
      const gy = 48;
      const gw = w - 88;
      const gh = h - 94;
      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy + gh);
      ctx.lineTo(gx + gw, gy + gh);
      ctx.stroke();

      const scaleT = tempK / 320;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let reactiveArea = 0;
      let totalArea = 0;
      for (let i = 0; i <= 120; i++) {
        const E = i; // 0..120 kJ
        const val = (E / (scaleT * 28)) * Math.exp(-E / (scaleT * 26)) * 2.1;
        totalArea += val;
        if (E >= effEa) reactiveArea += val;
        const px = gx + (i / 120) * gw;
        const py = gy + gh - Math.min(0.95, val) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Shade reactive region >= effEa
      const eaX = gx + (effEa / 120) * gw;
      ctx.fillStyle = 'rgba(16,185,129,0.28)';
      ctx.beginPath();
      ctx.moveTo(eaX, gy + gh);
      for (let i = Math.round(effEa); i <= 120; i++) {
        const val = (i / (scaleT * 28)) * Math.exp(-i / (scaleT * 26)) * 2.1;
        ctx.lineTo(gx + (i / 120) * gw, gy + gh - Math.min(0.95, val) * gh);
      }
      ctx.lineTo(gx + gw, gy + gh);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(eaX, gy);
      ctx.lineTo(eaX, gy + gh);
      ctx.stroke();

      const pct = round((reactiveArea / Math.max(1e-6, totalArea)) * 100, 1);
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`T = ${tempK} K · Ea hiệu dụng = ${effEa} kJ · Phân tử vượt ngưỡng ≈ ${pct}%`, gx, 28);

      return {
        metrics: [
          { label: 'Nhiệt độ T', value: tempK, unit: 'K' },
          { label: 'Ngưỡng Ea', value: effEa, unit: 'kJ' },
          { label: 'Tỉ lệ hạt phản ứng', value: pct, unit: '%' }
        ],
        statusNote: 'Vùng tô xanh biểu diễn số phân tử đủ động năng để phản ứng thành công.'
      };
    }

    case 'equilibrium_shift_2d': {
      const tempC = params.tempC ?? 35;
      const pAtm = params.pressureAtm ?? 1.5;
      const kc = Math.exp(3.2 * ((tempC - 25) / 50)) * 0.18;
      const no2Frac = Math.min(0.95, Math.max(0.08, kc / (kc + pAtm * 0.55)));
      const pistonW = Math.max(w * 0.28, w * (0.68 - (pAtm - 0.5) * 0.1));

      // Gas chamber with color N2O4 (clear) <-> NO2 (red-brown)
      const chX = w * 0.16;
      const chY = 58;
      const chH = h - 105;
      ctx.fillStyle = `rgba(180, 62, 24, ${(0.08 + no2Frac * 0.65).toFixed(2)})`;
      ctx.fillRect(chX, chY, pistonW, chH);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(chX, chY, pistonW, chH);

      // Piston plate
      ctx.fillStyle = '#64748b';
      ctx.fillRect(chX + pistonW - 8, chY, 16, chH);

      const nNo2 = Math.round(no2Frac * 26);
      const nN2O4 = 26 - nNo2;
      for (let i = 0; i < nNo2; i++) {
        const px = chX + 18 + ((i * 53 + t * 80) % Math.max(40, pistonW - 36));
        const py = chY + 20 + ((i * 37 + Math.sin(t * 2 + i) * 35 + chH) % (chH - 40));
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < nN2O4; i++) {
        const px = chX + 18 + ((i * 71 + t * 42) % Math.max(40, pistonW - 36));
        const py = chY + 20 + ((i * 61 + Math.cos(t * 1.5 + i) * 30 + chH) % (chH - 40));
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px - 4, py, 4.5, 0, Math.PI * 2);
        ctx.arc(px + 4, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`N₂O₄ (xanh) ⇌ 2NO₂ (đỏ nâu) · T=${tempC}°C · P=${pAtm} atm`, 18, 28);

      return {
        metrics: [
          { label: 'Tỉ lệ NO₂ (nâu đỏ)', value: round(no2Frac * 100, 1), unit: '%' },
          { label: 'Hằng số Kc(T)', value: round(kc, 3) },
          { label: 'Áp suất hệ', value: pAtm, unit: 'atm' }
        ],
        statusNote: 'Đun nóng tăng NO₂ (thuận thu nhiệt); nén áp suất cao tạo N₂O₄ (ít mol khí hơn).'
      };
    }

    case 'amino_acid_zwitterion_2d': {
      const ph = params.phSolution ?? 6.0;
      const aa = Math.round(params.aminoAcidId ?? 1);
      const eField = Math.round(params.eFieldOn ?? 1) === 1;
      const pIs = [6.0, 3.2, 9.7];
      const names = ['Glycine (pI=6.0)', 'Glutamic Acid (pI=3.2)', 'Lysine (pI=9.7)'];
      const pI = pIs[aa - 1];
      const diff = ph - pI;
      const charge = Math.abs(diff) < 0.35 ? 0 : diff > 0 ? -1 : +1;

      // Electrophoresis strip
      ctx.fillStyle = dark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(w * 0.14, cy - 36, w * 0.72, 72);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(w * 0.1, cy - 46, 22, 92);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(w * 0.9 - 22, cy - 46, 22, 92);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('+', w * 0.1 + 7, cy + 5);
      ctx.fillText('−', w * 0.9 - 15, cy + 5);

      const drift = eField ? Math.max(-0.3, Math.min(0.3, -charge * 0.24 * Math.min(1, (t % 4) / 3))) : 0;
      const spotX = cx + drift * w;
      ctx.fillStyle = charge === 0 ? '#10b981' : charge > 0 ? '#3b82f6' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(spotX, cy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`${names[aa - 1]} tại pH = ${ph} → ${charge === 0 ? 'Đứng yên (Lưỡng cực)' : charge > 0 ? 'Cation (+) về cực Âm' : 'Anion (−) về cực Dương'}`, 18, 28);

      return {
        metrics: [
          { label: 'pI đẳng điện', value: pI },
          { label: 'pH đệm', value: ph },
          { label: 'Điện tích chính', value: charge === 0 ? '0 (Zwitterion)' : charge > 0 ? '+1 (Cation)' : '−1 (Anion)' }
        ],
        statusNote: 'So sánh pH với pI quyết định hướng di chuyển trong điện trường điện di.'
      };
    }

    default: {
      // Rich generic dynamic molecular reaction chamber for remaining specific chemistry sims
      const keys = Object.keys(params);
      const p0 = keys[0] ? params[keys[0]] : 1;
      const p1 = keys[1] ? params[keys[1]] : 25;
      const count = 24;
      for (let i = 0; i < count; i++) {
        const ang = t * (0.7 + (i % 5) * 0.15) + i * 0.65;
        const rx = w * 0.34 * Math.sin(ang + i);
        const ry = h * 0.28 * Math.cos(ang * 0.8 + i * 1.1);
        const px = cx + rx;
        const py = cy + ry;
        ctx.fillStyle = i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#f59e0b' : '#10b981';
        ctx.beginPath();
        ctx.arc(px, py, i % 3 === 0 ? 7 : 5, 0, Math.PI * 2);
        ctx.fill();
        if (i % 2 === 0 && i + 1 < count) {
          ctx.strokeStyle = dark ? 'rgba(226,232,240,0.22)' : 'rgba(15,23,42,0.18)';
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(cx + rx * 0.72, cy + ry * 0.72);
          ctx.stroke();
        }
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText(`Mô phỏng Hóa học Tương tác · ${simType}`, 18, 28);
      ctx.fillStyle = muted;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`Thông số hoạt động: ${keys.map((k) => `${k}=${params[k]}`).join(' · ')}`, 18, 48);

      return {
        metrics: [
          { label: keys[0] || 'Thông số 1', value: round(p0, 2) },
          { label: keys[1] || 'Thông số 2', value: round(p1, 2) },
          { label: 'Mật độ va chạm', value: round(12 + Math.abs(p0) * 8, 1), unit: 'mol/s' }
        ],
        statusNote: 'Điều chỉnh các thanh trượt để quan sát tốc độ va chạm & cân bằng phân tử.'
      };
    }
  }
}
