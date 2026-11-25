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

function drawPlotAxes(ctx: CanvasRenderingContext2D, padL: number, topY: number, padB: number, plotW: number, muted: string) {
  ctx.strokeStyle = muted;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padL, topY);
  ctx.lineTo(padL, padB);
  ctx.lineTo(padL + plotW, padB);
  ctx.stroke();
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
    case 'cell_organelles_2d': {
      const rate = params.metabolicRate ?? 60;
      const isPlant = Math.round(params.isPlantCell ?? 1) === 1;
      const atpDemand = params.atpDemand ?? 55;

      if (isPlant) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.strokeRect(cx - 140, cy - 92, 280, 184);
      }
      ctx.fillStyle = 'rgba(16,185,129,0.14)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 126, 80, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nucleus + Mito + Chloroplast/Vacuole + Vesicles
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(cx - 38, cy - 12, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(cx + 55, cy - 32, 22, 11, 0.4, 0, Math.PI * 2);
      ctx.fill();

      if (isPlant) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(cx + 56, cy + 32, 20, 10, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(56,189,248,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx - 65, cy + 32, 34, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Secretory vesicles moving from Nucleus/ER -> membrane
      for (let i = 0; i < 6; i++) {
        const u = ((t * (rate / 90) + i / 6) % 1);
        const vx = cx - 20 + u * 135;
        const vy = cy + Math.sin(u * Math.PI * 2 + i) * 14;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(vx, vy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const atpGen = round((atpDemand * (isPlant ? 1.15 : 1.0)) * 0.36, 1);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Tế bào ${isPlant ? 'Thực vật (Thành + Lục lạp)' : 'Động vật'} · Tiết protein ${rate}%`, 22, 22);
      return {
        metrics: [
          { label: 'Loại tế bào', value: isPlant ? 'Thực vật' : 'Động vật' },
          { label: 'ATP cung cấp', value: atpGen, unit: 'mmol/s' },
          { label: 'Chuỗi bài tiết', value: 'Nhân → RER → Golgi' }
        ],
        statusNote: 'Túi tiết di chuyển liên tục từ lưới nội chất RER qua Golgi ra màng sinh chất.'
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

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(cx - 122, cy - 88, 244, 176);

      ctx.fillStyle = diff > 0.05 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(14, 165, 233, 0.25)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

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
          { label: 'Trạng thái', value: diff > 0.04 ? 'Nước đi ra' : diff < -0.04 ? 'Nước đi vào' : 'Cân bằng' }
        ],
        statusNote: `${stateLabel} · Độ thấm Aquaporin ${perm}%`
      };
    }

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

      const padL = 56;
      const padB = h - 42;
      const plotW = w - 92;
      const plotH = h - 90;
      drawPlotAxes(ctx, padL, 26, padB, plotW, muted);

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

    case 'photosynthesis_calvin_2d': {
      const lux = params.lightLux ?? 65;
      const co2 = params.co2Ppm ?? 420;
      const temp = params.tempC ?? 28;
      const tempF = Math.exp(-Math.pow((temp - 28) / 13, 2));
      const pMax = 100 * (co2 / (co2 + 240)) * tempF;

      const padL = 54;
      const padB = h - 42;
      const plotW = w - 90;
      const plotH = h - 88;
      drawPlotAxes(ctx, padL, 26, padB, plotW, muted);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let i = 0; i <= 50; i++) {
        const lVal = (i / 50) * 100;
        const rate = (pMax * lVal) / (24 + lVal);
        const px = padL + (lVal / 100) * plotW;
        const py = padB - (rate / 85) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curRate = (pMax * lux) / (24 + lux);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(padL + (lux / 100) * plotW, padB - (curRate / 85) * plotH, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Quang hợp · Ánh sáng ${lux}% · CO₂ ${co2} ppm · Cường độ = ${round(curRate, 1)} mg/dm²·h`, padL, 20);
      return {
        metrics: [
          { label: 'Cường độ quang hợp', value: round(curRate, 1), unit: 'đv' },
          { label: 'Sản lượng NADPH/ATP', value: round(lux * 0.9, 0), unit: '%' },
          { label: 'Hệ số nhiệt độ', value: round(tempF, 2) }
        ],
        statusNote: 'Ánh sáng thúc đẩy pha sáng; nồng độ CO₂ và nhiệt độ quyết định tốc độ chu trình Calvin.'
      };
    }

    case 'cellular_respiration_2d': {
      const glu = params.glucoseM ?? 5;
      const o2 = params.oxygenPct ?? 21;
      const uncoupler = Math.round(params.uncoupler ?? 0) === 1;
      const isAerobic = o2 >= 5;
      const atpPerGlu = !isAerobic ? 2 : uncoupler ? 4 : 32;
      const totalAtp = glu * atpPerGlu;

      const stages = ['Đường phân (2 ATP)', 'Chu trình Krebs (2 ATP)', 'Chuỗi truyền e⁻ (28 ATP)'];
      const vals = [2, isAerobic ? 2 : 0, isAerobic && !uncoupler ? 28 : 0];
      vals.forEach((v, idx) => {
        const bx = 54 + idx * ((w - 110) / 3);
        const bh = Math.max(10, (v / 28) * (h - 140));
        ctx.fillStyle = idx === 2 ? '#10b981' : idx === 1 ? '#0ea5e9' : '#f59e0b';
        ctx.fillRect(bx, h - 55 - bh, 82, bh);
        ctx.fillStyle = fg;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(stages[idx], bx - 8, h - 34);
        ctx.fillText(`${v * glu} ATP`, bx + 16, h - 62 - bh);
      });

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${glu} mol Glucose · O₂=${o2}% · Tổng thu = ${totalAtp} ATP`, 22, 22);
      return {
        metrics: [
          { label: 'Tổng ATP thu được', value: totalAtp, unit: 'mol ATP' },
          { label: 'Con đường chuyển hóa', value: !isAerobic ? 'Lên men kỵ khí' : uncoupler ? 'Tách cặp tỏa nhiệt' : 'Hiếu khí 32 ATP' },
          { label: 'O₂ tiêu thụ', value: isAerobic ? glu * 6 : 0, unit: 'mol' }
        ],
        statusNote: uncoupler ? 'Chất tách cặp phá vỡ gradient proton H⁺ nên năng lượng biến thành nhiệt!' : 'Chuỗi truyền electron màng trong ti thể tạo ~90% tổng lượng ATP.'
      };
    }

    case 'mitosis_meiosis_2d': {
      const n2 = Math.max(4, Math.min(16, Math.round(params.diploid2n ?? 8)));
      const meiosis = Math.round(params.isMeiosis ?? 0) === 1;
      const prog = params.phaseProgress ?? 50;
      const phaseName = prog < 25 ? 'Kì đầu' : prog < 50 ? 'Kì giữa (Xếp hàng)' : prog < 78 ? 'Kì sau (Phân li)' : 'Kì cuối (Tạo tế bào con)';
      const sep = prog > 50 ? ((prog - 50) / 50) * 62 : 0;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 130 + sep * 0.4, 84, 0, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < Math.min(8, n2); i++) {
        const yOff = -42 + (i / Math.max(1, Math.min(8, n2) - 1)) * 84;
        ctx.strokeStyle = i % 2 === 0 ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - sep - 8, cy + yOff - 5);
        ctx.lineTo(cx - sep - 8, cy + yOff + 5);
        ctx.moveTo(cx + sep + 8, cy + yOff - 5);
        ctx.lineTo(cx + sep + 8, cy + yOff + 5);
        ctx.stroke();
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${meiosis ? 'Giảm phân' : 'Nguyên phân'} (2n=${n2}) · ${phaseName} (${prog}%)`, 22, 22);
      return {
        metrics: [
          { label: 'Giai đoạn hiện tại', value: phaseName },
          { label: 'Số tế bào con tạo thành', value: meiosis ? 4 : 2, unit: 'tế bào' },
          { label: 'Bộ NST tế bào con', value: meiosis ? `n = ${n2 / 2}` : `2n = ${n2}`, unit: 'NST' }
        ],
        statusNote: meiosis ? 'Giảm phân gồm 2 lần phân bào tạo 4 giao tử đơn bội khác biệt di truyền.' : 'Nguyên phân giữ nguyên bộ NST 2n cho hai tế bào con.'
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

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(forkX, cy);
      ctx.lineTo(w - 48, cy - 58);
      ctx.moveTo(forkX, cy);
      ctx.lineTo(w - 48, cy + 58);
      ctx.stroke();

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

    case 'transcription_translation_2d': {
      const codons = params.codons ?? 150;
      const ribos = Math.max(1, Math.min(10, Math.round(params.ribosomes ?? 5)));
      const ratePct = params.ratePct ?? 75;
      const aaLen = Math.max(1, codons - 2);

      // mRNA strand + sliding ribosomes (Polysome)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(46, cy);
      ctx.lineTo(w - 46, cy);
      ctx.stroke();

      for (let i = 0; i < ribos; i++) {
        const u = ((i / ribos) + (t * ratePct) / 500) % 1;
        const rx = 64 + u * (w - 128);
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.ellipse(rx, cy - 6, 16, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        // Growing polypeptide chain
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rx, cy - 26);
        ctx.lineTo(rx - 14, cy - 26 - u * 44);
        ctx.stroke();
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Polysome: ${ribos} Ribosome trượt 5'→3' · ${codons} codon → ${aaLen} aa/chuỗi`, 22, 22);
      return {
        metrics: [
          { label: 'Số amino acid/chuỗi', value: aaLen, unit: 'aa' },
          { label: 'Số chuỗi tổng hợp song song', value: ribos, unit: 'chuỗi' },
          { label: 'Số lượt tRNA tham gia', value: ribos * (codons - 1), unit: 'lượt' }
        ],
        statusNote: 'Polysome giúp tăng năng suất tổng hợp nhiều chuỗi polipeptit cùng lúc.'
      };
    }

    case 'lac_operon_2d': {
      const lac = Math.round(params.lactosePresent ?? 1) === 1;
      const glu = Math.round(params.glucosePresent ?? 0) === 1;
      const mut = Math.round(params.lacIMutant ?? 0) === 1;
      const isOn = mut || lac;
      const level = !isOn ? 0 : glu ? 20 : 100;

      const blocks = [
        { lbl: 'P', col: '#38bdf8' },
        { lbl: 'O', col: '#f59e0b' },
        { lbl: 'lacZ', col: '#10b981' },
        { lbl: 'lacY', col: '#10b981' },
        { lbl: 'lacA', col: '#10b981' }
      ];
      blocks.forEach((b, idx) => {
        const bx = 64 + idx * ((w - 128) / 5);
        ctx.fillStyle = b.col;
        ctx.fillRect(bx, cy, 74, 34);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(b.lbl, bx + 24, cy + 21);
      });

      if (!isOn) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(64 + ((w - 128) / 5) + 37, cy - 18, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText('R', 64 + ((w - 128) / 5) + 33, cy - 14);
      } else {
        const polX = 64 + ((t * (level + 20)) % (w - 160));
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.ellipse(polX, cy - 22, 22, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Operon Lac: ${isOn ? `BẬT (${level}% mRNA)` : 'TẮT (Protein R bám O)'}`, 22, 22);
      return {
        metrics: [
          { label: 'Trạng thái Operon', value: isOn ? 'Phiên mã BẬT' : 'Ức chế TẮT' },
          { label: 'Mức phiên mã Z,Y,A', value: level, unit: '%' },
          { label: 'Protein ức chế R', value: mut ? 'Đột biến hỏng' : lac ? 'Bị Allolactose bất hoạt' : 'Gắn chặt vùng O' }
        ],
        statusNote: 'Thiếu Glucose + Có Lactose: phức CAP-cAMP kích hoạt RNA polymerase đạt 100%.'
      };
    }

    case 'crispr_editing_2d': {
      const match = params.matchScore ?? 20;
      const hdr = Math.round(params.hdrTemplate ?? 1) === 1;
      const cas9 = params.cas9Level ?? 70;
      const cutEff = match >= 17 ? round((match / 20) * cas9, 0) : 5;

      // Double DNA strand + Cas9-sgRNA scissors cutting at PAM NGG
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(46, cy - 14);
      ctx.lineTo(w - 46, cy - 14);
      ctx.moveTo(46, cy + 14);
      ctx.lineTo(w - 46, cy + 14);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168,85,247,0.3)';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 58, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fg;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Cas9 · ${match}/20 nt`, cx - 44, cy + 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('PAM: 5\'-NGG-3\'', cx + 70, cy - 24);

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`CRISPR–Cas9 · Khớp ${match}/20 nt → ${hdr ? 'Sửa chính xác HDR' : 'NHEJ gây đột biến mất/thêm'}`, 22, 22);
      return {
        metrics: [
          { label: 'Hiệu suất cắt đúng đích', value: cutEff, unit: '%' },
          { label: 'Cơ chế sửa chữa', value: hdr ? 'HDR (Theo khuôn)' : 'NHEJ (Ngẫu nhiên)' },
          { label: 'Khớp cặp sgRNA', value: `${match}/20`, unit: 'nt' }
        ],
        statusNote: 'Yêu cầu bắt buộc có trình tự PAM (NGG) ngay sát vùng mục tiêu để Cas9 cắt DSB.'
      };
    }

    case 'mendel_punnett_2d': {
      const p1 = Math.round(params.parent1Het ?? 2);
      const p2 = Math.round(params.parent2Het ?? 2);
      const nSample = params.sampleN ?? 640;
      const gridSize = p1 === 2 && p2 === 2 ? 4 : 2;
      const cell = Math.min(48, (h - 90) / gridSize);
      const sx = cx - (gridSize * cell) / 2;
      const sy = cy - (gridSize * cell) / 2;

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const domA = r < gridSize / 2 || c < gridSize / 2;
          ctx.fillStyle = domA ? 'rgba(16,185,129,0.28)' : 'rgba(245,158,11,0.28)';
          ctx.fillRect(sx + c * cell, sy + r * cell, cell, cell);
          ctx.strokeStyle = fg;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(sx + c * cell, sy + r * cell, cell, cell);
        }
      }
      const ratioStr = gridSize === 4 ? '9 : 3 : 3 : 1' : p1 === 1 && p2 === 1 ? '3 : 1' : '3 : 3 : 1 : 1';
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Khung Punnett ${gridSize}×${gridSize} · Tỉ lệ kiểu hình: ${ratioStr} (Mẫu n=${nSample})`, 22, 22);
      return {
        metrics: [
          { label: 'Tỉ lệ kiểu hình lý thuyết', value: ratioStr },
          { label: 'Số tổ hợp giao tử', value: gridSize * gridSize, unit: 'tổ hợp' },
          { label: 'Đồng hợp lặn ước tính', value: round(nSample / (gridSize * gridSize), 0), unit: 'cây' }
        ],
        statusNote: 'Các cặp gen phân li độc lập nhân xác suất giao tử tạo khung Punnett đối xứng.'
      };
    }

    case 'gene_linkage_2d': {
      const f = params.recombFreq ?? 20;
      const cis = Math.round(params.cisConfig ?? 1) === 1;
      const nSample = params.sampleN ?? 1000;
      const parental = 50 - f / 2;
      const recomb = f / 2;
      const rows = cis
        ? [
            { g: 'AB', p: parental, c: '#10b981' },
            { g: 'ab', p: parental, c: '#10b981' },
            { g: 'Ab (HV)', p: recomb, c: '#f59e0b' },
            { g: 'aB (HV)', p: recomb, c: '#f59e0b' }
          ]
        : [
            { g: 'Ab', p: parental, c: '#10b981' },
            { g: 'aB', p: parental, c: '#10b981' },
            { g: 'AB (HV)', p: recomb, c: '#f59e0b' },
            { g: 'ab (HV)', p: recomb, c: '#f59e0b' }
          ];

      rows.forEach((row, i) => {
        const y = 64 + i * 54;
        const barW = Math.max(6, (row.p / 50) * (w - 220));
        ctx.fillStyle = row.c;
        ctx.fillRect(110, y, barW, 28);
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px monospace';
        ctx.fillText(row.g, 24, y + 18);
        ctx.fillText(`${row.p}% (${Math.round((nSample * row.p) / 100)})`, 120 + barW, y + 18);
      });
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Hoán vị gen Morgan · Kiểu gen ${cis ? 'AB/ab' : 'Ab/aB'} · f = ${f}%`, 22, 24);
      return {
        metrics: [
          { label: 'Khoảng cách di truyền', value: f, unit: 'cM' },
          { label: 'Mỗi loại giao tử liên kết', value: parental, unit: '%' },
          { label: 'Mỗi loại giao tử hoán vị', value: recomb, unit: '%' }
        ],
        statusNote: 'Tần số hoán vị gen f ≤ 50% tỷ lệ thuận với khoảng cách giữa 2 gen trên NST.'
      };
    }

    case 'hardy_weinberg_2d': {
      const p = params.pFreq ?? 0.6;
      const q = round(1 - p, 2);
      const F = params.inbreedingF ?? 0;
      const pAA = round(p * p * (1 - F) + p * F, 3);
      const pAa = round(2 * p * q * (1 - F), 3);
      const paa = round(q * q * (1 - F) + q * F, 3);

      const bars = [
        { lbl: 'AA', val: pAA, col: '#10b981' },
        { lbl: 'Aa', val: pAa, col: '#0ea5e9' },
        { lbl: 'aa', val: paa, col: '#f59e0b' }
      ];
      bars.forEach((b, i) => {
        const bx = 78 + i * ((w - 156) / 3);
        const bh = Math.max(8, b.val * (h - 120));
        ctx.fillStyle = b.col;
        ctx.fillRect(bx, h - 52 - bh, 82, bh);
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${b.lbl}: ${b.val}`, bx + 12, h - 32);
      });
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Hardy–Weinberg · p=${p}, q=${q} · F=${F}`, 22, 22);
      return {
        metrics: [
          { label: 'Tần số AA', value: pAA },
          { label: 'Tần số dị hợp Aa', value: pAa },
          { label: 'Tần số đồng lặn aa', value: paa }
        ],
        statusNote: F > 0 ? 'Giao phối gần làm giảm tỉ lệ dị hợp tử Aa và tăng đồng hợp tử!' : 'Quần thể ngẫu phối đạt trạng thái cân bằng p²AA + 2pqAa + q²aa = 1.'
      };
    }

    case 'natural_selection_2d': {
      const p0 = params.p0 ?? 0.5;
      const ne = params.popSizeNe ?? 200;
      const s = params.fitnessAdv ?? 0.15;

      const padL = 52;
      const padB = h - 40;
      const plotW = w - 86;
      const plotH = h - 84;
      drawPlotAxes(ctx, padL, 26, padB, plotW, muted);

      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let pCur = p0;
      for (let g = 0; g <= 40; g++) {
        const px = padL + (g / 40) * plotW;
        const py = padB - pCur * plotH;
        if (g === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        const drift = Math.sin(g * 1.7 + p0 * 10) * (1 / Math.sqrt(ne)) * 0.45;
        pCur = Math.max(0.01, Math.min(0.99, pCur + s * pCur * (1 - pCur) + drift));
      }
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Diễn biến tần số alen qua 40 thế hệ · p₀=${p0}, Ne=${ne}, s=${s}`, padL, 20);
      return {
        metrics: [
          { label: 'Tần số alen sau 40 thế hệ', value: round(pCur, 3) },
          { label: 'Kích thước hiệu quả Ne', value: ne, unit: 'cá thể' },
          { label: 'Áp lực chọn lọc s', value: s }
        ],
        statusNote: 'Quần thể nhỏ (Ne nhỏ) chịu tác động rất mạnh của phiêu bạt di truyền.'
      };
    }

    case 'plant_transpiration_2d': {
      const hum = params.humidityPct ?? 55;
      const wind = params.windSpeed ?? 3;
      const soil = params.soilWater ?? 80;
      const openPct = soil < 25 ? 12 : Math.min(100, Math.round(soil * 0.9));
      const rate = round(((100 - hum) / 80) * (1 + wind * 0.12) * (openPct / 100) * 12.5, 1);

      // Guard cells & stomatal pore + rising xylem blue particles
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 10;
      const gap = 4 + (openPct / 100) * 20;
      ctx.beginPath();
      ctx.arc(cx - gap, cy, 44, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + gap, cy, 44, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();

      for (let i = 0; i < 8; i++) {
        const wy = cy + 60 - ((t * (18 + rate * 4) + i * 24) % 130);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx + Math.sin(t * 2 + i) * 6, wy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Độ mở khí khổng: ${openPct}% · Tốc độ thoát hơi nước = ${rate} g/dm²·h`, 22, 22);
      return {
        metrics: [
          { label: 'Thoát hơi nước', value: rate, unit: 'g/dm²·h' },
          { label: 'Độ mở khí khổng', value: openPct, unit: '%' },
          { label: 'Độ ẩm đất', value: soil, unit: '%' }
        ],
        statusNote: 'Lực hút thoát hơi nước qua lá là động lực chính kéo dòng mạch gỗ đi lên.'
      };
    }

    case 'phytohormone_tropism_2d': {
      const angle = params.lightAngle ?? 45;
      const auxin = params.auxinLevel ?? 70;
      const intact = Math.round(params.intactTip ?? 1) === 1;
      const bend = intact ? (angle * (auxin / 100)) * 0.75 : 0;

      // Sun beam icon
      const rad = (angle * Math.PI) / 180;
      const sunX = cx + Math.sin(rad) * 140;
      const sunY = cy - Math.cos(rad) * 110;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Coleoptile stem curving toward light
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy + 75);
      ctx.quadraticCurveTo(cx, cy, cx + bend * 1.4, cy - 68);
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Hướng sáng · Góc uốn = ${round(bend, 1)}° · ${intact ? 'Còn đỉnh sinh trưởng tiết Auxin' : 'Cắt đỉnh → Không uốn cong'}`, 22, 22);
      return {
        metrics: [
          { label: 'Góc uốn ngọn cây', value: round(bend, 1), unit: '°' },
          { label: 'Phân bố Auxin tối/sáng', value: intact ? '65% / 35%' : '0% (Mất đỉnh)' },
          { label: 'Hàm lượng IAA', value: auxin, unit: '%' }
        ],
        statusNote: 'Auxin di chuyển sang phía tối kích thích tế bào mặt tối giãn dài nhanh hơn.'
      };
    }

    case 'cardiac_cycle_2d': {
      const hr = params.heartRate ?? 75;
      const sv = params.strokeVol ?? 70;
      const res = params.resistance ?? 1.0;
      const co = round((hr * sv) / 1000, 2);
      const sysBp = Math.round(80 + sv * 0.55 * res);
      const diaBp = Math.round(62 + res * 18);

      const padL = 48;
      const padB = h - 40;
      const plotW = w - 82;
      drawPlotAxes(ctx, padL, 28, padB, plotW, muted);

      // Animated ECG trace
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const u = i / 140;
        const phase = (u * (hr / 38) + t * 0.55) % 1;
        let ecg = 0;
        if (phase > 0.1 && phase < 0.2) ecg = 12 * Math.sin(((phase - 0.1) / 0.1) * Math.PI);
        else if (phase >= 0.28 && phase < 0.34) ecg = 68 * Math.sin(((phase - 0.28) / 0.06) * Math.PI);
        else if (phase >= 0.34 && phase < 0.39) ecg = -24;
        else if (phase > 0.48 && phase < 0.62) ecg = 18 * Math.sin(((phase - 0.48) / 0.14) * Math.PI);
        const px = padL + u * plotW;
        const py = cy + 28 - ecg;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Chu kì tim (${round(60 / hr, 2)}s/nhịp) · HR=${hr} bpm · Huyết áp ${sysBp}/${diaBp} mmHg`, padL, 22);
      return {
        metrics: [
          { label: 'Lưu lượng tim (CO)', value: co, unit: 'L/phút' },
          { label: 'Huyết áp ước tính', value: `${sysBp}/${diaBp}`, unit: 'mmHg' },
          { label: 'Thời gian 1 chu kì', value: round(60 / hr, 2), unit: 'giây' }
        ],
        statusNote: 'Lưu lượng tim CO = Nhịp tim (HR) × Thể tích tâm thu (SV).'
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
      drawPlotAxes(ctx, padL, 24, padB, plotW, muted);

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
      ctx.fillText(`Đường cong Oxyhemoglobin (Nét đứt: P50=26,8 | Đỏ: Hiện tại P50=${round(p50, 1)} mmHg)`, padL, 20);
      return {
        metrics: [
          { label: 'P50 (50% bão hòa)', value: round(p50, 1), unit: 'mmHg' },
          { label: 'Bão hòa tại mô (40 mmHg)', value: round(y40, 1), unit: '%' },
          { label: 'O₂ nhả cho mô', value: round(98 - y40, 1), unit: '%' }
        ],
        statusNote: p50 > 28 ? 'Dịch phải (Hiệu ứng Bohr): Hb tăng nhả O₂ cho mô!' : 'Dịch trái: Hb tăng ái lực giữ O₂.'
      };
    }

    case 'nephron_filtration_2d': {
      const pArt = params.arterialP ?? 55;
      const adh = params.adhLevel ?? 60;
      const salt = params.saltIntake ?? 50;
      const pNet = Math.max(0, round(pArt - (30 + 15), 1));
      const gfr = round(pNet * 12.5, 0);
      const reabsorb = round(Math.min(99.5, 92 + adh * 0.075), 1);

      // Glomerulus + Henle loop U-shape
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w * 0.25, cy - 28, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(w * 0.34, cy - 28);
      ctx.lineTo(w * 0.44, cy - 28);
      ctx.lineTo(w * 0.44, cy + 72);
      ctx.lineTo(w * 0.58, cy + 72);
      ctx.lineTo(w * 0.58, cy - 28);
      ctx.lineTo(w * 0.76, cy - 28);
      ctx.lineTo(w * 0.76, cy + 72);
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Nephron · Áp suất lọc P_lọc = ${pNet} mmHg · GFR = ${gfr} mL/p · Tái hấp thu ADH = ${reabsorb}%`, 22, 22);
      return {
        metrics: [
          { label: 'Tốc độ lọc cầu thận GFR', value: gfr, unit: 'mL/phút' },
          { label: 'Nước tái hấp thu (ADH)', value: reabsorb, unit: '%' },
          { label: 'Bài xuất Na⁺', value: `${salt}%` }
        ],
        statusNote: 'ADH mở kênh aquaporin ở ống góp để thu hồi nước về máu khi cơ thể thiếu nước.'
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
      drawPlotAxes(ctx, padL, 24, padB, plotW, muted);

      const mvToY = (mv: number) => padB - ((mv + 90) / 135) * plotH;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(padL, mvToY(-55));
      ctx.lineTo(padL + plotW, mvToY(-55));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = thresholdHit ? '#38bdf8' : '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const u = i / 100;
        let mv = -70;
        if (u > 0.15 && u < 0.25) mv = -70 + stim * Math.sin(((u - 0.15) / 0.1) * Math.PI * 0.5);
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
          { label: 'Quy luật', value: thresholdHit ? 'Phát xung' : 'Dưới ngưỡng' }
        ],
        statusNote: 'Nghỉ (-70 mV) → Kênh Na⁺ mở (+35 mV) → Kênh K⁺ tái phân cực (-82 mV).'
      };
    }

    case 'synapse_transmission_2d': {
      const freq = params.frequencyHz ?? 40;
      const ca = params.caExt ?? 80;
      const blocked = Math.round(params.enzymeBlock ?? 0) === 1;
      const postSignal = round((freq * ca) / 100 * (blocked ? 1.8 : 1.0), 1);

      // Presynaptic bulb + cleft + postsynaptic membrane
      ctx.fillStyle = 'rgba(16,185,129,0.22)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 80, cy, 62, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx + 38, cy - 84);
      ctx.lineTo(cx + 38, cy + 84);
      ctx.stroke();

      // Neurotransmitter particles crossing cleft
      for (let i = 0; i < 10; i++) {
        const u = (t * (freq / 35) + i * 0.15) % 1;
        const nx = cx - 20 + u * 56;
        const ny = cy - 42 + ((i * 23) % 84);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Xináp Hóa học · Tần số ${freq} Hz · Ca²⁺=${ca}% · ${blocked ? 'Ức chế AChE (Co cứng!)' : 'Truyền tin 1 chiều chuẩn'}`, 22, 22);
      return {
        metrics: [
          { label: 'Xung sau xináp', value: postSignal, unit: 'mV' },
          { label: 'Nồng độ Ca²⁺', value: ca, unit: '%' },
          { label: 'Enzyme AChE', value: blocked ? 'Bị ức chế' : 'Phân giải kịp thời' }
        ],
        statusNote: 'Chất trung gian hóa học chỉ có ở chùy xináp, thụ thể chỉ có ở màng sau → truyền tin 1 chiều.'
      };
    }

    case 'glucose_insulin_2d': {
      const meal = params.mealCarb ?? 60;
      const sens = params.insulinSens ?? 85;
      const ex = params.exercise ?? 20;
      const peakMg = Math.round(90 + meal * 0.9 * (1 - ex / 240));
      const post2h = Math.round(90 + (meal * (100 - sens)) / 95);

      const padL = 52;
      const padB = h - 40;
      const plotW = w - 88;
      const plotH = h - 84;
      drawPlotAxes(ctx, padL, 26, padB, plotW, muted);

      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const u = i / 60;
        const g = 90 + meal * 1.1 * Math.sin(Math.min(Math.PI, u * 4.2)) * Math.exp(-u * (sens / 38));
        const px = padL + u * plotW;
        const py = padB - Math.min(0.95, g / 240) * plotH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Đường huyết sau ăn · Đỉnh: ${peakMg} mg/dL · Sau 2h: ${post2h} mg/dL`, padL, 20);
      return {
        metrics: [
          { label: 'Đỉnh đường huyết', value: peakMg, unit: 'mg/dL' },
          { label: 'Đường huyết sau 2 giờ', value: post2h, unit: 'mg/dL' },
          { label: 'Đánh giá chuyển hóa', value: post2h < 140 ? 'Bình thường' : 'Rối loạn dung nạp' }
        ],
        statusNote: 'Insulin giúp tế bào hấp thu Glucose và gan tổng hợp Glycogen dự trữ.'
      };
    }

    case 'immune_antibody_2d': {
      const load = params.antigenLoad ?? 50;
      const boost = params.boosterDay ?? 28;
      const mem = params.memoryEfficiency ?? 85;

      const padL = 52;
      const padB = h - 40;
      const plotW = w - 86;
      const plotH = h - 86;
      drawPlotAxes(ctx, padL, 26, padB, plotW, muted);

      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let d = 0; d <= 56; d++) {
        const p1 = d > 6 ? (load / 80) * 28 * Math.exp(-Math.pow((d - 14) / 7, 2)) : 0;
        const p2 = d > boost ? (mem / 100) * 95 * Math.exp(-Math.pow((d - (boost + 5)) / 8, 2)) : 0;
        const val = Math.min(100, p1 + p2);
        const px = padL + (d / 56) * plotW;
        const py = padB - (val / 105) * plotH;
        if (d === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Đáp ứng miễn dịch · Mũi 1 (Ngày 0) vs Nhắc lại (Ngày ${boost})`, padL, 20);
      return {
        metrics: [
          { label: 'Kháng thể mũi 2 (IgG)', value: `${round(mem * 0.95, 0)}×`, unit: 'mũi 1' },
          { label: 'Thời gian tiềm phát mũi 2', value: '2 – 4', unit: 'ngày' },
          { label: 'Tế bào B nhớ', value: mem, unit: '%' }
        ],
        statusNote: 'Nhờ tế bào nhớ miễn dịch, lần tiếp xúc thứ hai tạo lượng kháng thể vượt trội và cực nhanh.'
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
      drawPlotAxes(ctx, padL, 24, padB, plotW, muted);

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
          { label: 'Con mồi hiện tại', value: round(preyPts[markerIdx], 1) }
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
      drawPlotAxes(ctx, padL, 24, padB, plotW, muted);

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
      ctx.fillText(`Đường cong Chữ S (Logistic) · Sức chứa K = ${K} · Điểm uốn = ${K / 2}`, padL, 20);
      return {
        metrics: [
          { label: 'Kích thước N(t)', value: round(curN, 0), unit: 'cá thể' },
          { label: 'Điểm uốn K/2', value: round(K / 2, 0), unit: 'cá thể' },
          { label: 'Tốc độ cực đại (rK/4)', value: round((r * K) / 4, 1), unit: 'ct/t' }
        ],
        statusNote: 'Tốc độ tăng quần thể dN/dt đạt cực đại tại N = K/2.'
      };
    }

    case 'trophic_pyramid_2d': {
      const kcal = params.primaryKcal ?? 10000;
      const eff = params.efficiencyPct ?? 10;
      const levels = Math.max(3, Math.min(5, Math.round(params.levels ?? 4)));
      const labels = ['Bậc 1: Sinh vật sản xuất', 'Bậc 2: Động vật ăn cỏ', 'Bậc 3: Thú ăn thịt 1', 'Bậc 4: Thú ăn thịt 2', 'Bậc 5: Đỉnh chuỗi'];
      const cols = ['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#ef4444'];

      for (let i = 0; i < levels; i++) {
        const bw = (w - 140) * Math.pow(0.68, i);
        const bh = (h - 90) / levels;
        const y = h - 38 - (i + 1) * bh;
        const eVal = round(kcal * Math.pow(eff / 100, i), 1);
        ctx.fillStyle = cols[i];
        ctx.fillRect(cx - bw / 2, y + 3, bw, bh - 6);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${labels[i]} (${eVal} kcal)`, cx - bw / 2 + 10, y + bh * 0.56);
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Tháp năng lượng sinh thái · Hiệu suất truyền ${eff}%/bậc`, 22, 22);
      const topE = round(kcal * Math.pow(eff / 100, levels - 1), 2);
      return {
        metrics: [
          { label: `Năng lượng bậc đỉnh (${levels})`, value: topE, unit: 'kcal' },
          { label: 'Hiệu suất mỗi bậc', value: eff, unit: '%' },
          { label: 'Tổn thất hô hấp/thải bỏ', value: 100 - eff, unit: '%' }
        ],
        statusNote: '~90% năng lượng thất thoát qua hô hấp, nhiệt và chất thải ở mỗi bậc dinh dưỡng.'
      };
    }

    case 'carbon_nitrogen_cycle_2d': {
      const forest = params.forestCover ?? 60;
      const fossil = params.fossilFuel ?? 45;
      const nFix = params.nFixation ?? 65;
      const netCo2 = round(380 + fossil * 2.2 - forest * 1.4, 0);

      // Cyclic boxes
      const nodes = [
        { x: cx, y: 74, l: `CO₂ Khí quyển (${netCo2} ppm)`, c: netCo2 > 440 ? '#ef4444' : '#0ea5e9' },
        { x: w * 0.25, y: cy + 56, l: `Sinh quyển Rừng (${forest}%)`, c: '#10b981' },
        { x: w * 0.75, y: cy + 56, l: `Vi khuẩn N₂ (${nFix}%)`, c: '#8b5cf6' }
      ];
      nodes.forEach((n) => {
        ctx.fillStyle = n.c;
        ctx.beginPath();
        ctx.ellipse(n.x, n.y, 92, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.l, n.x, n.y + 4);
      });
      ctx.textAlign = 'left';
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Chu trình Cacbon & Nitơ · Cân bằng hấp thụ/phát thải`, 22, 22);
      return {
        metrics: [
          { label: 'Nồng độ CO₂ ước tính', value: netCo2, unit: 'ppm' },
          { label: 'Đạm sinh học NH₄⁺/NO₃⁻', value: `${nFix}%` },
          { label: 'Cân bằng khí hậu', value: netCo2 > 440 ? 'Hiệu ứng nhà kính tăng' : 'Ổn định xanh' }
        ],
        statusNote: 'Thực vật hấp thụ CO₂ qua quang hợp; vi khuẩn cố định đạm chuyển N₂ thành NH₄⁺.'
      };
    }

    case 'viral_lytic_cycle_2d': {
      const lysogenic = Math.round(params.isLysogenic ?? 0) === 1;
      const burst = params.burstSize ?? 120;
      const temp = params.tempC ?? 37;

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 118, 68, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Bacterial chromosome loop + Prophage or multiplying virions
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 24, cy, 34, 0, Math.PI * 2);
      ctx.stroke();

      if (lysogenic) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx - 24, cy, 34, 0, 0.9);
        ctx.stroke();
      } else {
        for (let i = 0; i < 8; i++) {
          const ang = t * 1.4 + (i * Math.PI) / 4;
          const vx = cx + Math.cos(ang) * 56;
          const vy = cy + Math.sin(ang) * 36;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(vx, vy, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`${lysogenic ? 'Chu trình Tiềm tan (Prophage xen vào DNA)' : `Chu trình Sinh tan (${burst} virion/chu kì)`} · T=${temp}°C`, 22, 22);
      return {
        metrics: [
          { label: 'Chu trình nhân lên', value: lysogenic ? 'Tiềm tan' : 'Sinh tan (Phá vỡ TB)' },
          { label: 'Hệ số phóng thích', value: lysogenic ? 0 : burst, unit: 'virion' },
          { label: 'Nhiệt độ vật chủ', value: temp, unit: '°C' }
        ],
        statusNote: 'Ở chu trình tiềm tan, DNA virus xen cài thành prophage nhân đôi cùng vi khuẩn mà chưa làm tan tế bào.'
      };
    }

    case 'pcr_electrophoresis_2d': {
      const cycles = Math.max(1, Math.min(35, Math.round(params.pcrCycles ?? 25)));
      const targetBp = params.targetBp ?? 600;
      const copies = Math.pow(2, cycles);

      // Agarose Gel Electrophoresis bands on right, Thermal PCR ladder on left
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx + 20, 44, w * 0.36, h - 82);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(cx + 20, 44, w * 0.36, h - 82);

      // Ladder lane
      [1500, 1000, 750, 500, 250].forEach((bpVal) => {
        const y = 64 + (1 - Math.log10(bpVal / 150) / Math.log10(15)) * (h - 130);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx + 38, y, 42, 4);
      });
      // Target amplified band (brightness scales with cycles)
      const bandY = 64 + (1 - Math.log10(targetBp / 150) / Math.log10(15)) * (h - 130);
      ctx.fillStyle = `rgba(16, 185, 129, ${Math.min(1, 0.25 + cycles / 32).toFixed(2)})`;
      ctx.fillRect(cx + 106, bandY - 3, 52, 8);

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`PCR ${cycles} chu kì → ${copies.toExponential(2)} bản sao · Băng ${targetBp} bp`, 22, 22);
      ctx.fillText('Biến tính 94°C -> Gắn mồi 56°C -> Taq 72°C', 24, cy);
      return {
        metrics: [
          { label: 'Số bản sao DNA (2ⁿ)', value: copies > 1e6 ? `${round(copies / 1e6, 1)} triệu` : Math.round(copies) },
          { label: 'Kích thước băng điện di', value: targetBp, unit: 'bp' },
          { label: 'Độ sáng băng Gel', value: `${Math.min(100, Math.round((cycles / 30) * 100))}%` }
        ],
        statusNote: 'Phân tử DNA kích thước càng ngắn (bp nhỏ) chạy về cực dương càng nhanh trên gel Agarose.'
      };
    }

    case 'blood_typing_2d': {
      const donor = Math.max(0, Math.min(3, Math.round(params.donorType ?? 0)));
      const recip = Math.max(0, Math.min(3, Math.round(params.recipientType ?? 3)));
      const labels = ['O', 'A', 'B', 'AB'];
      const compat: Record<number, number[]> = { 0: [0], 1: [0, 1], 2: [0, 2], 3: [0, 1, 2, 3] };
      const safe = compat[recip].includes(donor);

      // Show Anti-A and Anti-B slide agglutination test for Donor
      const hasA = donor === 1 || donor === 3;
      const hasB = donor === 2 || donor === 3;
      [
        { x: w * 0.28, label: 'Anti-A', clump: hasA },
        { x: w * 0.52, label: 'Anti-B', clump: hasB }
      ].forEach((well) => {
        ctx.fillStyle = 'rgba(239,68,68,0.18)';
        ctx.strokeStyle = fg;
        ctx.beginPath();
        ctx.arc(well.x, cy, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (well.clump) {
          for (let i = 0; i < 8; i++) {
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(well.x + Math.cos(i) * 18, cy + Math.sin(i * 1.4) * 18, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${well.label}: ${well.clump ? 'Ngưng kết (+)' : 'Đều (−)'}`, well.x - 42, cy + 62);
      });

      ctx.fillStyle = safe ? '#10b981' : '#ef4444';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(
        `Truyền máu: Cho [${labels[donor]}] → Nhận [${labels[recip]}] : ${safe ? 'AN TOÀN' : 'NGƯNG KẾT (KHÔNG ĐƯỢC TRUYỀN)'}`,
        22,
        24
      );
      return {
        metrics: [
          { label: 'Nhóm máu người cho', value: labels[donor] },
          { label: 'Nhóm máu người nhận', value: labels[recip] },
          { label: 'Tương thích truyền máu', value: safe ? 'An toàn' : 'Nguy hiểm (Ngưng kết)' }
        ],
        statusNote: 'Nguyên tắc truyền máu: Kháng nguyên hồng cầu người cho không bị kháng thể huyết tương người nhận làm ngưng kết.'
      };
    }

    default: {
      return {
        metrics: [{ label: 'Sim ID', value: simType }],
        statusNote: 'Chế độ mô phỏng Sinh học 2D sẵn sàng.'
      };
    }
  }
}
