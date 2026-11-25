import { ChemistrySimType } from '../../types';
import { PerformanceMode } from '../../context/BackgroundContext';

export interface ChemSimTelemetry {
  metrics: { label: string; value: number | string; unit?: string }[];
  statusNote: string;
}

function round(val: number, digits = 2): number {
  const f = Math.pow(10, digits);
  return Math.round(val * f) / f;
}

function drawBloomOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  coreColor: string,
  midColor: string,
  perfMode: PerformanceMode
) {
  if (perfMode === 'smooth') return;
  ctx.save();
  const radius = perfMode === 'ultra' ? r * 1.45 : r;
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, coreColor);
  g.addColorStop(perfMode === 'ultra' ? 0.45 : 0.35, midColor);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGlassReflect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  wGlass: number,
  hGlass: number,
  perfMode: PerformanceMode
) {
  if (perfMode === 'smooth') return;
  ctx.save();
  const sheen = ctx.createLinearGradient(x, y, x + wGlass, y);
  sheen.addColorStop(0, 'rgba(255,255,255,0.22)');
  sheen.addColorStop(0.18, 'rgba(255,255,255,0.06)');
  sheen.addColorStop(0.7, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.92, perfMode === 'ultra' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(x + 2, y + 2, wGlass - 4, hGlass - 4);
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean, perfMode: PerformanceMode = 'balanced') {
  ctx.save();
  ctx.fillStyle = dark ? '#0b1120' : '#f8fafc';
  ctx.fillRect(0, 0, w, h);
  if (perfMode !== 'smooth') {
    const amb = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.45, Math.max(w, h) * 0.65);
    amb.addColorStop(0, dark ? 'rgba(16,185,129,0.09)' : 'rgba(14,165,233,0.06)');
    amb.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, w, h);
  }
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

function drawAtomNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  label: string,
  textColor = '#ffffff'
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (label) {
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.max(10, Math.round(r * 0.72))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y + 0.5);
  }
  ctx.restore();
}

export function renderChemistry2DSim(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  simType: ChemistrySimType,
  params: Record<string, number>,
  t: number,
  dark: boolean,
  perfMode: PerformanceMode = 'balanced'
): ChemSimTelemetry {
  drawGrid(ctx, w, h, dark, perfMode);
  const fg = dark ? '#e2e8f0' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  const cx = w * 0.5;
  const cy = h * 0.52;

  switch (simType) {
    case 'atomic_orbitals_2d': {
      const n = Math.max(1, Math.min(4, Math.round(params.n ?? 2)));
      const l = Math.max(0, Math.min(n - 1, Math.round(params.l ?? 1)));
      const zEff = params.zEff ?? 6;
      const aoNames = ['s (Cầu)', 'p (Số 8)', 'd (4 thùy)', 'f (Đa thùy)'];

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
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`AO ${n}${['s', 'p', 'd', 'f'][l]} · Z = ${zEff}`, 18, 28);
      ctx.fillStyle = muted;
      ctx.font = '12px sans-serif';
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
          ctx.font = isSel ? 'bold 12px sans-serif' : '10px sans-serif';
          ctx.fillText(symbols[i], px - 6, 54 + plotH + 16);
        }
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
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

    case 'flame_spectroscopy_2d': {
      const ionCode = Math.max(1, Math.min(6, Math.round(params.ionCode ?? 2)));
      const tempK = params.tempK ?? 1800;
      const slitWidth = params.slitWidth ?? 2;
      const ions = [
        { name: 'Li⁺', color: '#e11d48', flame: 'Đỏ son', lines: [671, 610] },
        { name: 'Na⁺', color: '#facc15', flame: 'Vàng rực (vạch D)', lines: [589, 589.6] },
        { name: 'K⁺', color: '#a855f7', flame: 'Tím hoa cà', lines: [404, 766] },
        { name: 'Ca²⁺', color: '#f97316', flame: 'Đỏ cam', lines: [622, 553] },
        { name: 'Cu²⁺', color: '#10b981', flame: 'Xanh lục lam', lines: [515, 522] },
        { name: 'Ba²⁺', color: '#84cc16', flame: 'Vàng lục', lines: [524, 554] }
      ];
      const ion = ions[ionCode - 1];
      const intensity = Math.min(1, Math.max(0.25, (tempK - 700) / 1800));

      // Burner + animated flame on left
      const bx = w * 0.22;
      const by = h * 0.72;
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx - 16, by, 32, 60);
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 36, by + 56, 72, 14);

      const flicker = Math.sin(t * 9) * 5;
      drawBloomOrb(ctx, bx, by - 54, 96, `${ion.color}44`, `${ion.color}18`, perfMode);
      const grad = ctx.createRadialGradient(bx, by - 36, 4, bx, by - 45, 58);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, ion.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      if (perfMode === 'ultra') {
        ctx.shadowColor = ion.color;
        ctx.shadowBlur = 22;
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(bx - 22, by);
      ctx.quadraticCurveTo(bx - 28, by - 65, bx + flicker, by - (88 + intensity * 38));
      ctx.quadraticCurveTo(bx + 28, by - 65, bx + 22, by);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Right: Visible Spectrum Bar (380nm - 780nm) + sharp emission lines
      const sx = w * 0.44;
      const sw = w * 0.5;
      const sy = h * 0.42;
      const sh = 68;
      ctx.fillStyle = '#020617';
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = muted;
      ctx.strokeRect(sx, sy, sw, sh);

      const wlToColor = (nm: number) => {
        if (nm < 440) return '#8b5cf6';
        if (nm < 495) return '#3b82f6';
        if (nm < 570) return '#10b981';
        if (nm < 595) return '#facc15';
        if (nm < 625) return '#f97316';
        return '#ef4444';
      };

      ion.lines.forEach((nm) => {
        const u = Math.max(0.03, Math.min(0.97, (nm - 380) / 400));
        const lx = sx + u * sw;
        const lCol = wlToColor(nm);
        ctx.save();
        if (perfMode !== 'smooth') {
          ctx.shadowColor = lCol;
          ctx.shadowBlur = perfMode === 'ultra' ? 16 : 8;
        }
        ctx.fillStyle = lCol;
        ctx.globalAlpha = intensity;
        ctx.fillRect(lx - slitWidth, sy + 2, slitWidth * 2 + 1, sh - 4);
        ctx.restore();
        ctx.fillStyle = fg;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${nm}nm`, lx - 16, sy - 8);
      });

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Quang phổ vạch ${ion.name} · Ngọn lửa: ${ion.flame}`, 18, 28);
      ctx.fillStyle = muted;
      ctx.font = '11px monospace';
      ctx.fillText('380 nm (Tím)', sx, sy + sh + 18);
      ctx.fillText('780 nm (Đỏ)', sx + sw - 74, sy + sh + 18);

      const mainWl = ion.lines[0];
      const deltaE = round((6.626e-34 * 3e8) / (mainWl * 1e-9) / 1.602e-19, 2);
      return {
        metrics: [
          { label: 'Ion kim loại', value: ion.name },
          { label: 'Bước sóng chính λ', value: mainWl, unit: 'nm' },
          { label: 'Năng lượng photon ΔE', value: deltaE, unit: 'eV' }
        ],
        statusNote: `Electron chuyển từ mức kích thích về cơ bản phát ra vạch đặc trưng ${mainWl} nm.`
      };
    }

    case 'vsepr_bonding_2d': {
      const bp = Math.max(2, Math.min(6, Math.round(params.bondingPairs ?? 4)));
      const lp = Math.max(0, Math.min(2, Math.round(params.lonePairs ?? 0)));
      const enDiff = params.enDiff ?? 0.4;
      const steric = bp + lp;
      const hyb = steric <= 2 ? 'sp' : steric === 3 ? 'sp²' : steric === 4 ? 'sp³' : steric === 5 ? 'sp³d' : 'sp³d²';
      const baseAngles: Record<number, number> = { 2: 180, 3: 120, 4: 109.5, 5: 90, 6: 90 };
      const angle = round((baseAngles[steric] ?? 109.5) - lp * 2.5, 1);

      const geomName =
        bp === 2 && lp === 0
          ? 'Thẳng (180°)'
          : bp === 3 && lp === 0
          ? 'Tam giác phẳng'
          : bp === 4 && lp === 0
          ? 'Tứ diện đều'
          : bp === 3 && lp === 1
          ? 'Chóp tam giác'
          : bp === 2 && lp >= 1
          ? 'Chữ V (Gấp khúc)'
          : bp === 5
          ? 'Lưỡng chóp tam giác'
          : 'Bát diện đều';

      // Draw central atom + bonds + lone pair lobes
      const radius = Math.min(w, h) * 0.27;
      for (let i = 0; i < bp; i++) {
        const ang = -Math.PI / 2 + (i / Math.max(1, steric)) * Math.PI * 2 + Math.sin(t) * 0.03;
        const ax = cx + Math.cos(ang) * radius;
        const ay = cy + Math.sin(ang) * radius;
        ctx.strokeStyle = dark ? '#cbd5e1' : '#334155';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        if (enDiff > 0.4) {
          drawArrow(ctx, cx, cy, (cx + ax) * 0.52, (cy + ay) * 0.52, '#f59e0b', 2);
        }
        drawAtomNode(ctx, ax, ay, 18, '#0ea5e9', `X${i + 1}`);
      }
      for (let j = 0; j < lp; j++) {
        const ang = -Math.PI / 2 + ((bp + j) / Math.max(1, steric)) * Math.PI * 2;
        const lx = cx + Math.cos(ang) * (radius * 0.58);
        const ly = cy + Math.sin(ang) * (radius * 0.58);
        ctx.fillStyle = 'rgba(244,63,94,0.28)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(lx, ly, 24, 14, ang, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('••', lx - 6, ly + 4);
      }
      drawAtomNode(ctx, cx, cy, 24, '#6366f1', 'A');

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`AX${bp}E${lp} · Lai hóa ${hyb} · ${geomName}`, 18, 28);
      return {
        metrics: [
          { label: 'Dạng VSEPR / Lai hóa', value: `${geomName} (${hyb})` },
          { label: 'Góc liên kết ước tính', value: angle, unit: '°' },
          { label: 'Phân cực liên kết Δχ', value: round(enDiff, 2) }
        ],
        statusNote: 'Cặp electron tự do (hồng) chiếm vùng không gian lớn, ép góc liên kết hẹp lại.'
      };
    }

    case 'crystal_packing_2d': {
      const lattice = Math.round(params.latticeType ?? 2);
      const ratio = params.radiusRatio ?? 0.55;
      const tempK = params.tempScale ?? 300;
      const types = [
        { name: 'SC (Lập phương đơn giản)', z: 1, eta: 52.4, coord: 6 },
        { name: 'BCC (Lập phương tâm khối)', z: 2, eta: 68.0, coord: 8 },
        { name: 'FCC (Lập phương tâm mặt)', z: 4, eta: 74.0, coord: 12 }
      ];
      const info = types[Math.max(0, Math.min(2, lattice - 1))];
      const vib = ((tempK - 100) / 800) * 3.5;

      const cols = 4;
      const rows = 3;
      const sp = Math.min(w * 0.14, h * 0.22);
      const x0 = cx - ((cols - 1) * sp) / 2;
      const y0 = cy - ((rows - 1) * sp) / 2;
      const atomR = lattice === 3 ? sp * 0.34 : sp * 0.29;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jx = Math.sin(t * 7 + r * 2 + c) * vib;
          const jy = Math.cos(t * 6 + c * 2 + r) * vib;
          const px = x0 + c * sp + (lattice === 3 && r % 2 === 1 ? sp * 0.5 : 0) + jx;
          const py = y0 + r * sp + jy;
          drawAtomNode(ctx, px, py, atomR, '#10b981', '');
          if (lattice === 2 && r < rows - 1 && c < cols - 1) {
            drawAtomNode(ctx, px + sp * 0.5, py + sp * 0.5, atomR * ratio * 1.15, '#8b5cf6', '+');
          }
        }
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(x0, y0, sp, sp);

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${info.name} · Độ đặc khít η = ${info.eta}% · T = ${tempK}K`, 18, 28);
      return {
        metrics: [
          { label: 'Số nguyên tử Z / ô', value: info.z, unit: 'nguyên tử' },
          { label: 'Độ đặc khít η', value: info.eta, unit: '%' },
          { label: 'Số phối trí CN', value: info.coord }
        ],
        statusNote: 'Tăng nhiệt độ làm ion/nguyên tử dao động nhiệt mạnh quanh nút mạng tinh thể.'
      };
    }

    case 'complex_ligand_2d': {
      const dCount = Math.max(1, Math.min(9, Math.round(params.dElectrons ?? 9)));
      const deltaO = params.ligandStrength ?? 1.4;
      const geom = Math.round(params.complexGeom ?? 1);
      const isOct = geom === 1;
      const gapPx = Math.min(115, deltaO * 44);
      const lambdaNm = Math.round(1240 / Math.max(0.5, deltaO));
      const solColor = deltaO > 2.0 ? '#1d4ed8' : deltaO > 1.5 ? '#0284c7' : '#22c55e';

      // Left: Solution Beaker of complex color
      const bx = w * 0.22;
      ctx.fillStyle = solColor;
      ctx.globalAlpha = 0.65;
      ctx.fillRect(bx - 52, cy - 35, 104, 110);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bx - 52, cy - 45, 104, 120);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Phức chất d${dCount}`, bx - 38, cy + 96);

      // Right: d-orbital splitting diagram (t2g vs eg)
      const dx = w * 0.5;
      const midY = cy + 8;
      const upperY = midY - gapPx * 0.55;
      const lowerY = midY + gapPx * 0.45;
      const upperCount = isOct ? 2 : 3;
      const lowerCount = isOct ? 3 : 2;

      const drawOrbRow = (y: number, count: number, lbl: string) => {
        ctx.fillStyle = muted;
        ctx.font = 'bold 12px monospace';
        ctx.fillText(lbl, dx - 38, y + 4);
        for (let i = 0; i < count; i++) {
          const ox = dx + i * 48;
          ctx.strokeStyle = fg;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(ox, y);
          ctx.lineTo(ox + 32, y);
          ctx.stroke();
        }
      };
      drawOrbRow(upperY, upperCount, isOct ? 'e_g' : 't₂');
      drawOrbRow(lowerY, lowerCount, isOct ? 't₂g' : 'e');

      // Fill d electrons
      const lowCap = lowerCount * 2;
      const highSpin = deltaO < 1.8;
      let rem = dCount;
      let lowerFilled = 0;
      let upperFilled = 0;
      if (highSpin) {
        lowerFilled = Math.min(lowerCount, rem);
        rem -= lowerFilled;
        upperFilled = Math.min(upperCount, rem);
        rem -= upperFilled;
        const addLow = Math.min(lowCap - lowerFilled, rem);
        lowerFilled += addLow;
        rem -= addLow;
        upperFilled += rem;
      } else {
        lowerFilled = Math.min(lowCap, rem);
        upperFilled = Math.max(0, rem - lowCap);
      }

      for (let i = 0; i < lowerFilled; i++) {
        const slot = i % lowerCount;
        const spinUp = i < lowerCount;
        const ex = dx + slot * 48 + (spinUp ? 10 : 22);
        drawArrow(ctx, ex, spinUp ? lowerY + 12 : lowerY - 12, ex, spinUp ? lowerY - 12 : lowerY + 12, '#38bdf8', 2);
      }
      for (let i = 0; i < upperFilled; i++) {
        const slot = i % upperCount;
        const spinUp = i < upperCount;
        const ex = dx + slot * 48 + (spinUp ? 10 : 22);
        drawArrow(ctx, ex, spinUp ? upperY + 12 : upperY - 12, ex, spinUp ? upperY - 12 : upperY + 12, '#f59e0b', 2);
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Tách mức năng lượng trường tinh thể Δ₀ = ${deltaO} eV (λ ≈ ${lambdaNm} nm)`, 18, 28);
      return {
        metrics: [
          { label: 'Phân tách năng lượng Δ₀', value: deltaO, unit: 'eV' },
          { label: 'Bước sóng hấp thụ λ', value: lambdaNm, unit: 'nm' },
          { label: 'Trạng thái spin', value: deltaO >= 1.8 ? 'Spin thấp (ghép cặp)' : 'Spin cao' }
        ],
        statusNote: 'Phối tử trường mạnh (NH₃, CN⁻) tăng Δ₀ làm đổi màu hấp thụ của phức kim loại.'
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

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(85, startY);
      ctx.lineTo(w * 0.25, startY);
      ctx.bezierCurveTo(w * 0.4, startY, w * 0.42, peakY, cx, peakY);
      ctx.bezierCurveTo(w * 0.58, peakY, w * 0.62, endY, w * 0.76, endY);
      ctx.lineTo(w - 56, endY);
      ctx.stroke();

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
      ctx.font = 'bold 13px sans-serif';
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

    case 'reaction_kinetics_2d': {
      const concA = params.concA ?? 1.5;
      const tempC = params.tempC ?? 35;
      const gamma = params.gamma ?? 2.2;
      const cat = Math.round(params.catalystOn ?? 0) === 1;
      const rateRel = concA * Math.pow(gamma, (tempC - 25) / 10) * (cat ? 2.4 : 1);

      const nDots = Math.round(14 + concA * 12);
      const speedScale = 35 + Math.pow(gamma, (tempC - 20) / 15) * 32;
      for (let i = 0; i < nDots; i++) {
        const rx = 40 + ((i * 73 + t * speedScale * ((i % 3) + 0.7)) % (w - 80));
        const ry = 58 + ((i * 59 + Math.sin(t * 2.5 + i) * 42 + h) % (h - 92));
        ctx.fillStyle = i % 2 === 0 ? '#0ea5e9' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(rx, ry, i % 2 === 0 ? 5.5 : 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (cat) {
        ctx.fillStyle = 'rgba(16,185,129,0.28)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 80, h - 52, 160, 18);
        ctx.strokeRect(cx - 80, h - 52, 160, 18);
        ctx.fillStyle = fg;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Bề mặt Xúc tác', cx - 42, h - 39);
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Nồng độ ${concA} M · T = ${tempC}°C · Tốc độ tương đối v/v₀ = ${round(rateRel, 2)}×`, 18, 28);
      return {
        metrics: [
          { label: 'Hệ số tốc độ v/v₀', value: round(rateRel, 2), unit: 'lần' },
          { label: 'Hệ số Van \'t Hoff γ', value: gamma },
          { label: 'Trạng thái xúc tác', value: cat ? 'Bật (×2.4 tốc độ)' : 'Không dùng' }
        ],
        statusNote: 'Tăng nhiệt độ +10°C làm tốc độ phản ứng tăng γ lần theo quy tắc Van \'t Hoff.'
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
        const E = i;
        const val = (E / (scaleT * 28)) * Math.exp(-E / (scaleT * 26)) * 2.1;
        totalArea += val;
        if (E >= effEa) reactiveArea += val;
        const px = gx + (i / 120) * gw;
        const py = gy + gh - Math.min(0.95, val) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

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
      ctx.font = 'bold 13px sans-serif';
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

      const chX = w * 0.16;
      const chY = 58;
      const chH = h - 105;
      ctx.fillStyle = `rgba(180, 62, 24, ${(0.08 + no2Frac * 0.65).toFixed(2)})`;
      ctx.fillRect(chX, chY, pistonW, chH);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(chX, chY, pistonW, chH);

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
      ctx.font = 'bold 13px sans-serif';
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

      const fx = w * 0.25;
      const fy = h * 0.68;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 2;
      ctx.strokeRect(fx - 12, 24, 24, 108);
      const buretteFill = Math.max(0.1, 1 - baseMl / 50);
      ctx.fillStyle = 'rgba(56,189,248,0.35)';
      ctx.fillRect(fx - 10, 26 + (1 - buretteFill) * 102, 20, buretteFill * 102);

      const dropY = 136 + ((t * 95) % 58);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(fx, dropY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(fx - 14, fy - 42);
      ctx.lineTo(fx - 52, fy + 48);
      ctx.lineTo(fx + 52, fy + 48);
      ctx.lineTo(fx + 14, fy - 42);
      ctx.closePath();
      ctx.fillStyle = isPink
        ? 'rgba(236,72,153,0.48)'
        : curPh > 6.5
        ? 'rgba(244,114,182,0.22)'
        : 'rgba(148,163,184,0.16)';
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.stroke();
      drawBloomOrb(
        ctx,
        fx,
        fy + 16,
        58,
        isPink ? 'rgba(236,72,153,0.28)' : 'rgba(56,189,248,0.16)',
        'rgba(236,72,153,0.06)',
        perfMode
      );
      // Spinning magnetic stir bar at flask bottom
      ctx.fillStyle = '#e2e8f0';
      const barW = 10 + Math.abs(Math.cos(t * 7)) * 12;
      ctx.fillRect(fx - barW * 0.5, fy + 40, barW, 4);

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

      const curX = gx + (baseMl / 50) * gw;
      const curY = gy + gh - (curPh / 14) * gh;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`pH = ${curPh} · V_tđ = ${round(vEq, 1)} mL`, gx, 28);
      ctx.fillStyle = muted;
      ctx.font = '11px sans-serif';
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

    case 'buffer_ph_2d': {
      const pka = params.pka ?? 4.76;
      const ratio = params.ratioSaltAcid ?? 1.0;
      const added = params.addedStrongMl ?? 0;
      const molAcid = Math.max(0.05, 1.0 - added * 0.045);
      const molBase = Math.max(0.05, ratio + added * 0.045);
      const effPh = round(Math.max(1, Math.min(13, pka + Math.log10(molBase / molAcid))), 2);

      // Bar comparison HA vs A- + pH curve
      const bx = w * 0.14;
      const barW = 48;
      const maxH = h - 120;
      const haH = Math.min(maxH, (molAcid / 2.5) * maxH);
      const aH = Math.min(maxH, (molBase / 2.5) * maxH);

      ctx.fillStyle = '#f97316';
      ctx.fillRect(bx, h - 48 - haH, barW, haH);
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(bx + 76, h - 48 - aH, barW, aH);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('[HA]', bx + 10, h - 28);
      ctx.fillText('[A⁻]', bx + 86, h - 28);

      // Right: Henderson-Hasselbalch Curve
      const gx = w * 0.45;
      const gw = w * 0.48;
      const gy = 54;
      const gh = h - 102;
      ctx.strokeStyle = muted;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy + gh);
      ctx.lineTo(gx + gw, gy + gh);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const addVal = -15 + (i / 40) * 30;
        const mA = Math.max(0.05, 1.0 - addVal * 0.045);
        const mB = Math.max(0.05, ratio + addVal * 0.045);
        const phVal = Math.max(1, Math.min(13, pka + Math.log10(mB / mA)));
        const px = gx + (i / 40) * gw;
        const py = gy + gh - (phVal / 14) * gh;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = gx + ((added + 15) / 30) * gw;
      const curY = gy + gh - (effPh / 14) * gh;
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Dung dịch đệm Henderson–Hasselbalch · pKa=${pka} · pH=${effPh}`, 18, 28);

      return {
        metrics: [
          { label: 'pH dung dịch đệm', value: effPh },
          { label: 'Tỉ lệ [A⁻]/[HA]', value: round(molBase / molAcid, 2) },
          { label: 'Lượng H⁺/OH⁻ thêm', value: `${added > 0 ? `+${added}` : added}`, unit: 'mmol' }
        ],
        statusNote: 'Vùng đệm quanh pH = pKa ± 1 có khả năng chống biến đổi pH mạnh nhất.'
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

      const lx = w * 0.25;
      const rx = w * 0.75;
      const by = h * 0.56;

      [lx, rx].forEach((bx, idx) => {
        ctx.fillStyle = idx === 0 ? 'rgba(148,163,184,0.2)' : 'rgba(14,165,233,0.28)';
        ctx.fillRect(bx - 65, by - 30, 130, 105);
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 65, by - 30, 130, 105);
      });

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(lx - 42, by - 65, 22, 115);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(rx + 20, by - 65, 22, 115);

      ctx.strokeStyle = dark ? '#cbd5e1' : '#475569';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(lx + 24, by + 10);
      ctx.lineTo(lx + 24, by - 64);
      ctx.lineTo(rx - 24, by - 64);
      ctx.lineTo(rx - 24, by + 10);
      ctx.stroke();

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

      for (let i = 0; i < 6; i++) {
        const u = (t * 0.45 + i / 6) % 1;
        const ex = lx - 31 + u * (rx + 31 - (lx - 31));
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, 46, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      drawArrow(ctx, cx - 70, 32, cx - 35, 32, '#38bdf8', 2);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Anode (−): ${names[anode - 1]}`, lx - 50, h - 18);
      ctx.fillText('Cathode (+): Cu', rx - 45, h - 18);

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

      ctx.fillStyle = code === 2 ? 'rgba(148,163,184,0.18)' : 'rgba(14,165,233,0.28)';
      ctx.fillRect(cx - 140, cy - 45, 280, 145);
      drawGlassReflect(ctx, cx - 140, cy - 45, 280, 145, perfMode);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 140, cy - 45, 280, 145);

      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 95, cy - 72, 20, 130);
      ctx.fillRect(cx + 75, cy - 72, 20, 130);
      if (code !== 2) {
        const coat = Math.min(8, 2 + mCu * 0.45);
        drawBloomOrb(ctx, cx - 85, cy + 8, 56, 'rgba(217,119,6,0.26)', 'rgba(245,158,11,0.06)', perfMode);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cx - 95 - coat / 2, cy - 40, 20 + coat, 98);
      }

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
      ctx.font = 'bold 13px sans-serif';
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

    case 'metal_activity_2d': {
      const metalCode = Math.max(1, Math.min(4, Math.round(params.metalCode ?? 2)));
      const solCode = Math.max(1, Math.min(3, Math.round(params.solutionCode ?? 2)));
      const conc = params.acidConc ?? 1.5;
      const metals = ['Mg', 'Zn', 'Fe', 'Cu'];
      const sols = ['HCl', 'CuSO₄', 'AgNO₃'];
      const reacts =
        (metalCode <= 3 && solCode === 1) ||
        (metalCode <= 3 && solCode === 2) ||
        solCode === 3;
      const intensity = reacts ? (5 - metalCode) * conc : 0;

      // Test tube with solution & metal strip
      ctx.fillStyle = solCode === 2 ? 'rgba(14,165,233,0.34)' : 'rgba(148,163,184,0.18)';
      ctx.fillRect(cx - 65, cy - 45, 130, 145);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 65, cy - 55, 130, 155);

      ctx.fillStyle = metalCode === 4 ? '#d97706' : '#94a3b8';
      ctx.fillRect(cx - 12, cy - 82, 24, 150);

      if (reacts) {
        if (solCode === 1) {
          for (let i = 0; i < Math.round(6 + intensity * 3); i++) {
            const by = cy + 65 - ((t * (35 + intensity * 12) + i * 23) % 105);
            const bx = cx + Math.sin(t * 5 + i) * 18;
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = solCode === 2 ? '#b45309' : '#e2e8f0';
          ctx.fillRect(cx - 16, cy - 35, 32, 95);
        }
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        `${metals[metalCode - 1]} + ${sols[solCode - 1]} (${conc}M) → ${reacts ? 'Phản ứng xảy ra!' : 'Không phản ứng (Cu sau H)'}`,
        18,
        28
      );
      return {
        metrics: [
          { label: 'Cặp chất thử', value: `${metals[metalCode - 1]} + ${sols[solCode - 1]}` },
          { label: 'Khả năng đẩy', value: reacts ? 'Có phản ứng' : 'Không xảy ra' },
          { label: 'Cường độ tốc độ', value: round(intensity, 1) }
        ],
        statusNote: 'Kim loại đứng trước trong dãy hoạt động (K Ba Ca Na Mg Al Zn Fe Ni Sn Pb H Cu Hg Ag Pt Au) đẩy kim loại yếu hơn.'
      };
    }

    case 'halogen_displacement_2d': {
      const hal = Math.max(1, Math.min(3, Math.round(params.halogenAdded ?? 1)));
      const salt = Math.max(1, Math.min(3, Math.round(params.halideSalt ?? 2)));
      const shake = params.shakeLevel ?? 50;
      const rxnHappens = hal < salt;
      const topColor = rxnHappens
        ? salt === 2
          ? 'rgba(249,115,22,0.72)'
          : 'rgba(168,85,247,0.75)'
        : 'rgba(226,232,240,0.22)';
      const botColor = rxnHappens
        ? salt === 2
          ? 'rgba(245,158,11,0.38)'
          : 'rgba(147,51,234,0.35)'
        : 'rgba(56,189,248,0.16)';

      // Organic hexan upper layer + Aqueous lower layer in extraction cylinder
      const tx = cx - 55;
      const ty = cy - 75;
      ctx.fillStyle = topColor;
      ctx.fillRect(tx, ty + 18, 110, 52);
      ctx.fillStyle = botColor;
      ctx.fillRect(tx, ty + 70, 110, 88);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(tx, ty, 110, 158);
      ctx.fillStyle = fg;
      ctx.font = '11px sans-serif';
      ctx.fillText('Lớp hữu cơ (Hexan)', tx + 118, ty + 48);
      ctx.fillText('Lớp dung dịch nước', tx + 118, ty + 116);

      const halNames = ['Cl₂', 'Br₂', 'I₂'];
      const saltNames = ['NaCl', 'NaBr', 'KI'];
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        `${halNames[hal - 1]} + ${saltNames[salt - 1]} → ${rxnHappens ? `Đẩy ${halNames[salt - 1]} tự do!` : 'Không đẩy được halogen mạnh hơn'}`,
        18,
        28
      );
      return {
        metrics: [
          { label: 'Phản ứng oxi hóa', value: `${halNames[hal - 1]} + ${saltNames[salt - 1]}` },
          { label: 'Kết quả chiết Hexan', value: rxnHappens ? (salt === 2 ? 'Da cam (Br₂)' : 'Tím (I₂)') : 'Không đổi màu' },
          { label: 'Mức độ khuấy', value: shake, unit: '%' }
        ],
        statusNote: 'Tính oxi hóa giảm dần: F₂ > Cl₂ > Br₂ > I₂.'
      };
    }

    case 'haber_ammonia_2d': {
      const tempC = params.tempC ?? 450;
      const pAtm = params.pressureAtm ?? 200;
      const cat = params.catalystActivity ?? 90;
      const eqYield = Math.min(72, Math.max(6, (pAtm / (pAtm + 240)) * Math.exp(-(tempC - 250) / 260) * 95));
      const practicalYield = round(eqYield * (0.45 + 0.55 * (cat / 100)) * (tempC > 380 ? 1 : tempC / 380), 1);

      // Reactor tower + recycling loop
      ctx.fillStyle = 'rgba(14,165,233,0.16)';
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.fillRect(cx - 120, cy - 60, 110, 140);
      ctx.strokeRect(cx - 120, cy - 60, 110, 140);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(cx + 30, cy - 45, 95, 110);
      drawArrow(ctx, cx - 10, cy - 20, cx + 28, cy - 20, '#38bdf8', 3);
      drawArrow(ctx, cx + 28, cy + 40, cx - 10, cy + 40, '#f59e0b', 2);

      // Animated molecules
      for (let i = 0; i < 12; i++) {
        const my = cy - 48 + ((i * 29 + t * 50) % 116);
        const mx = cx - 95 + (i % 4) * 20;
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#f43f5e';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Tháp ngưng tụ', cx + 38, cy + 4);
      ctx.fillText(`NH₃: ${practicalYield}%`, cx + 42, cy + 24);
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Haber–Bosch: N₂ + 3H₂ ⇌ 2NH₃ · T=${tempC}°C · P=${pAtm} atm · XT=${cat}%`, 18, 28);
      return {
        metrics: [
          { label: 'Hiệu suất NH₃ thu được', value: practicalYield, unit: '%' },
          { label: 'Hiệu suất cân bằng lý thuyết', value: round(eqYield, 1), unit: '%' },
          { label: 'Áp suất vận hành', value: pAtm, unit: 'atm' }
        ],
        statusNote: '450°C, 200 atm & xúc tác Fe dung hòa tốc độ cao và hiệu suất thu hồi kinh tế.'
      };
    }

    case 'contact_sulfuric_2d': {
      const tempC = params.tempC ?? 450;
      const o2Excess = params.o2Excess ?? 1.5;
      const stages = Math.max(1, Math.min(4, Math.round(params.stages ?? 3)));
      const tempPenalty = 1 - Math.abs(tempC - 450) / 500;
      const conv = round(Math.min(99.6, (1 - Math.pow(0.28, stages)) * 100 * Math.min(1, 0.72 + o2Excess * 0.16) * tempPenalty), 1);

      for (let s = 0; s < stages; s++) {
        const bx = 68 + s * ((w - 136) / Math.max(1, stages));
        ctx.fillStyle = 'rgba(245,158,11,0.28)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.fillRect(bx, cy - 42, 84, 88);
        ctx.strokeRect(bx, cy - 42, 84, 88);
        ctx.fillStyle = fg;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Tầng V₂O₅ #${s + 1}`, bx + 8, cy);
        if (s < stages - 1) {
          drawArrow(ctx, bx + 86, cy, bx + ((w - 136) / stages) - 6, cy, '#10b981', 2.2);
        }
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Tháp Tiếp xúc H₂SO₄ (${stages} tầng V₂O₅) · T=${tempC}°C · Hiệu suất SO₃ = ${conv}%`, 18, 28);
      return {
        metrics: [
          { label: 'Chuyển hóa SO₂ → SO₃', value: conv, unit: '%' },
          { label: 'Số tầng V₂O₅', value: stages, unit: 'tầng' },
          { label: 'Tỉ lệ O₂ dư', value: o2Excess, unit: 'mol' }
        ],
        statusNote: 'Hấp thụ SO₃ bằng H₂SO₄ đặc tạo Oleum H₂SO₄·nSO₃ tránh tạo sương mù axit.'
      };
    }

    case 'redox_balancing_2d': {
      const rxnId = Math.max(1, Math.min(4, Math.round(params.rxnId ?? 1)));
      const stepPhase = Math.max(1, Math.min(4, Math.round(params.stepPhase ?? 4)));
      const rxns = [
        { eq: '3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O', ox: 'Cu⁰ → Cu⁺² + 2e', red: 'N⁺⁵ + 3e → N⁺²', ne: 6 },
        { eq: '2Fe + 6H₂SO₄(đ) → Fe₂(SO₄)₃ + 3SO₂↑ + 6H₂O', ox: 'Fe⁰ → Fe⁺³ + 3e', red: 'S⁺⁶ + 2e → S⁺⁴', ne: 6 },
        { eq: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O', ox: '2Cl⁻¹ → Cl₂⁰ + 2e', red: 'Mn⁺⁷ + 5e → Mn⁺²', ne: 10 },
        { eq: '8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O↑ + 15H₂O', ox: 'Al⁰ → Al⁺³ + 3e', red: '2N⁺⁵ + 8e → N₂⁺¹', ne: 24 }
      ];
      const rx = rxns[rxnId - 1];

      // Electron transfer boxes
      ctx.fillStyle = 'rgba(14,165,233,0.14)';
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.fillRect(42, 68, w * 0.36, 72);
      ctx.strokeRect(42, 68, w * 0.36, 72);
      ctx.fillStyle = 'rgba(244,63,94,0.14)';
      ctx.strokeStyle = '#f43f5e';
      ctx.fillRect(w * 0.58, 68, w * 0.36, 72);
      ctx.strokeRect(w * 0.58, 68, w * 0.36, 72);

      drawArrow(ctx, 42 + w * 0.36 + 6, 104, w * 0.58 - 6, 104, '#f59e0b', 3);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Nhường e (Chất khử):`, 54, 92);
      ctx.fillText(rx.ox, 54, 118);
      ctx.fillText(`Nhận e (Chất oxi hóa):`, w * 0.58 + 12, 92);
      ctx.fillText(rx.red, w * 0.58 + 12, 118);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(stepPhase >= 4 ? `Phương trình cân bằng: ${rx.eq}` : `Đang ở bước ${stepPhase}/4: Nhân bội chung nhỏ nhất ${rx.ne} electron`, 42, cy + 72);
      return {
        metrics: [
          { label: 'Bội số chung e trao đổi', value: rx.ne, unit: 'e' },
          { label: 'Bán phản ứng oxi hóa', value: rx.ox },
          { label: 'Tiến độ cân bằng', value: `Bước ${stepPhase}/4` }
        ],
        statusNote: 'Nguyên tắc vàng: Tổng số electron nhường = Tổng số electron nhận.'
      };
    }

    case 'hydrocarbon_isomers_2d': {
      const cCount = Math.max(4, Math.min(7, Math.round(params.carbonCount ?? 5)));
      const branch = Math.max(0, Math.min(2, Math.round(params.branchLevel ?? 0)));
      const bType = Math.max(1, Math.min(3, Math.round(params.bondType ?? 1)));
      const names = ['Ankan C_nH_{2n+2}', 'Anken C_nH_{2n}', 'Ankin C_nH_{2n-2}'];
      const bp = round(-42 + cCount * 22 - branch * 14 + (bType === 3 ? 6 : 0), 1);

      const mainC = Math.max(3, cCount - branch);
      const startX = cx - ((mainC - 1) * 58) / 2;
      for (let i = 0; i < mainC; i++) {
        const px = startX + i * 58;
        const py = cy + (i % 2 === 0 ? -12 : 12);
        if (i > 0) {
          const prevX = startX + (i - 1) * 58;
          const prevY = cy + ((i - 1) % 2 === 0 ? -12 : 12);
          ctx.strokeStyle = fg;
          ctx.lineWidth = i === 1 && bType > 1 ? 6 : 3;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
        drawAtomNode(ctx, px, py, 16, '#334155', `C${i + 1}`);
      }
      for (let b = 0; b < branch; b++) {
        const anchorX = startX + 58;
        const anchorY = cy + 12;
        const by = b === 0 ? anchorY + 56 : anchorY - 56;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        ctx.lineTo(anchorX, by);
        ctx.stroke();
        drawAtomNode(ctx, anchorX, by, 14, '#f59e0b', 'CH₃');
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${names[bType - 1]} (C${cCount}) · ${branch} nhánh · Nhiệt độ sôi ≈ ${bp}°C`, 18, 28);
      return {
        metrics: [
          { label: 'Dãy đồng đẳng', value: names[bType - 1] },
          { label: 'Nhiệt độ sôi ước tính', value: bp, unit: '°C' },
          { label: 'Số nhánh metyl', value: branch }
        ],
        statusNote: 'Phân nhánh càng nhiều thì diện tích tiếp xúc giảm → nhiệt độ sôi giảm.'
      };
    }

    case 'alkene_addition_2d': {
      const reagent = Math.round(params.reagentCode ?? 1);
      const peroxide = Math.round(params.peroxide ?? 0) === 1;
      const majorPct = reagent === 3 ? 100 : peroxide && reagent === 1 ? 15 : 92;
      const reacNames = ['HBr', 'H₂O (H⁺)', 'Br₂'];

      // Propen CH3-CH=CH2 + reagent -> Major & Minor products
      drawAtomNode(ctx, cx - 150, cy - 36, 20, '#334155', 'CH₃');
      drawAtomNode(ctx, cx - 75, cy - 36, 20, '#0ea5e9', 'CH=');
      drawAtomNode(ctx, cx, cy - 36, 20, '#10b981', 'CH₂');
      ctx.fillStyle = fg;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`+ ${reacNames[reagent - 1]}`, cx + 38, cy - 32);

      // Major bar vs minor bar
      ctx.fillStyle = '#10b981';
      ctx.fillRect(64, cy + 28, (w - 180) * (majorPct / 100), 26);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(64, cy + 68, (w - 180) * ((100 - majorPct) / 100), 22);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Sản phẩm thế bậc cao (Markovnikov): ${majorPct}%`, 64, cy + 22);
      ctx.fillText(`Sản phẩm phụ bậc thấp: ${100 - majorPct}%`, 64, cy + 63);
      return {
        metrics: [
          { label: 'Tác nhân cộng', value: reacNames[reagent - 1] },
          { label: 'Tỉ lệ sản phẩm chính', value: majorPct, unit: '%' },
          { label: 'Hiệu ứng Peroxit', value: peroxide && reagent === 1 ? 'Ngược Markovnikov' : 'Markovnikov chuẩn' }
        ],
        statusNote: 'H⁺ ưu tiên gắn vào Cacbon mang nhiều H hơn để tạo cacbocation trung gian bậc cao bền hơn.'
      };
    }

    case 'benzene_substitution_2d': {
      const sub = Math.max(1, Math.min(4, Math.round(params.substituent ?? 1)));
      const subLabels = ['H', 'CH₃ (o/p)', 'OH (o/p)', 'NO₂ (meta)'];
      const isMeta = sub === 4;

      const r = 68;
      for (let i = 0; i < 6; i++) {
        const a1 = -Math.PI / 2 + (i * Math.PI) / 3;
        const a2 = -Math.PI / 2 + ((i + 1) * Math.PI) / 3;
        ctx.strokeStyle = fg;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r);
        ctx.stroke();
      }
      ctx.strokeStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
      ctx.stroke();

      // Top substituent group
      drawAtomNode(ctx, cx, cy - r - 28, 22, isMeta ? '#ef4444' : '#10b981', subLabels[sub - 1].split(' ')[0]);

      // Highlight favored positions
      const targets = isMeta ? [2, 4] : [1, 3, 5];
      targets.forEach((idx) => {
        const ang = -Math.PI / 2 + (idx * Math.PI) / 3;
        drawAtomNode(ctx, cx + Math.cos(ang) * (r + 22), cy + Math.sin(ang) * (r + 22), 14, '#f59e0b', idx === 3 ? 'p' : isMeta ? 'm' : 'o');
      });

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Nhóm thế: ${subLabels[sub - 1]} → Định hướng ưu tiên vị trí ${isMeta ? 'meta (m)' : 'ortho / para (o/p)'}`, 18, 28);
      return {
        metrics: [
          { label: 'Nhóm thế sẵn có', value: subLabels[sub - 1] },
          { label: 'Hướng thế ưu tiên', value: isMeta ? 'Vị trí meta' : 'Vị trí ortho & para' },
          { label: 'Khả năng phản ứng', value: isMeta ? 'Phản hoạt hóa vòng' : 'Hoạt hóa vòng thơm' }
        ],
        statusNote: 'Nhóm đẩy e (loại I) làm giàu mật độ e tại o/p; nhóm hút e (loại II) định hướng meta.'
      };
    }

    case 'esterification_2d': {
      const aMol = params.acidMol ?? 1.0;
      const alcMol = params.alcoholMol ?? 2.0;
      const hasH2SO4 = Math.round(params.catalystH2SO4 ?? 1) === 1;
      const kc = hasH2SO4 ? 4.8 : 4.0;
      // Solve x^2 / ((a-x)(b-x)) = Kc approximately by Newton/bisection
      let lo = 0;
      let hi = Math.min(aMol, alcMol) * 0.999;
      for (let it = 0; it < 20; it++) {
        const mid = (lo + hi) * 0.5;
        const lhs = mid * mid;
        const rhs = kc * (aMol - mid) * (alcMol - mid);
        if (lhs < rhs) lo = mid;
        else hi = mid;
      }
      const xEq = (lo + hi) * 0.5;
      const yieldPct = round((xEq / Math.min(aMol, alcMol)) * 100, 1);

      // Flask + two-layer ester phase
      ctx.fillStyle = 'rgba(251,191,36,0.55)';
      ctx.fillRect(cx - 75, cy - 35, 150, Math.max(16, (yieldPct / 100) * 52));
      ctx.fillStyle = 'rgba(56,189,248,0.22)';
      ctx.fillRect(cx - 75, cy - 35 + Math.max(16, (yieldPct / 100) * 52), 150, 75);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - 75, cy - 45, 150, 140);

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`CH₃COOH (${aMol} mol) + C₂H₅OH (${alcMol} mol) → Hiệu suất Este = ${yieldPct}%`, 18, 28);
      return {
        metrics: [
          { label: 'Số mol Este tạo thành', value: round(xEq, 2), unit: 'mol' },
          { label: 'Hiệu suất este hóa', value: yieldPct, unit: '%' },
          { label: 'Lớp trên nổi nhẹ hơn nước', value: 'CH₃COOC₂H₅ (mùi thơm)' }
        ],
        statusNote: 'Tăng nồng độ ancol và dùng H₂SO₄ đặc hút nước kéo cân bằng về phía tạo este.'
      };
    }

    case 'soap_micelle_2d': {
      const conc = params.soapConc ?? 65;
      const hard = Math.round(params.waterHardness ?? 0) === 1;
      const agit = params.agitation ?? 60;
      const count = Math.round(8 + (conc / 100) * 14);
      const radius = 56;

      // Oil droplet core
      ctx.fillStyle = hard ? '#94a3b8' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + t * (agit / 70);
        const ix = cx + Math.cos(ang) * 32;
        const iy = cy + Math.sin(ang) * 32;
        const ox = cx + Math.cos(ang) * (radius + 18);
        const oy = cy + Math.sin(ang) * (radius + 18);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ox, oy);
        ctx.stroke();
        drawAtomNode(ctx, ox, oy, 8, hard ? '#ef4444' : '#10b981', '');
      }

      const efficiency = hard ? round(Math.max(15, conc * 0.25), 0) : round(Math.min(98, conc * 0.7 + agit * 0.28), 0);
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Hạt Mixen · ${hard ? 'Nước cứng tạo kết tủa (RCOO)₂Ca!' : 'Nước mềm nhũ hóa sạch dầu mỡ'}`, 18, 28);
      return {
        metrics: [
          { label: 'Hiệu quả tẩy rửa', value: efficiency, unit: '%' },
          { label: 'Mật độ phân tử bao', value: count, unit: 'gốc RCOO⁻' },
          { label: 'Ảnh hưởng nước', value: hard ? 'Bị kết tủa Ca²⁺/Mg²⁺' : 'Ổn định tạo bọt tốt' }
        ],
        statusNote: 'Đuôi kị nước -R cắm vào vết dầu, đầu ưa nước -COO⁻ kéo vào pha nước.'
      };
    }

    case 'carbohydrate_ring_2d': {
      const sugar = Math.round(params.sugarType ?? 1);
      const ph = params.phLevel ?? 7;
      const tollens = Math.round(params.silverTest ?? 1) === 1;
      const names = ['Glucozơ (C₆H₁₂O₆)', 'Fructozơ (C₆H₁₂O₆)', 'Saccarozơ (C₁₂H₂₂O₁₁)'];
      const hasMirror = tollens && (sugar === 1 || (sugar === 2 && ph >= 8));

      // Hexagon ring + Tollen's silver test tube
      const rx = w * 0.34;
      for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI) / 3;
        const a2 = ((i + 1) * Math.PI) / 3;
        ctx.strokeStyle = fg;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rx + Math.cos(a1) * 52, cy + Math.sin(a1) * 52);
        ctx.lineTo(rx + Math.cos(a2) * 52, cy + Math.sin(a2) * 52);
        ctx.stroke();
      }
      drawAtomNode(ctx, rx + 52, cy, 12, '#ef4444', 'O');

      // Test tube on right showing Silver Mirror!
      const tx = w * 0.7;
      ctx.fillStyle = hasMirror ? 'rgba(226,232,240,0.82)' : 'rgba(56,189,248,0.18)';
      ctx.fillRect(tx - 32, cy - 60, 64, 130);
      ctx.strokeStyle = hasMirror ? '#cbd5e1' : fg;
      ctx.lineWidth = hasMirror ? 5 : 2;
      ctx.strokeRect(tx - 32, cy - 60, 64, 130);

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${names[sugar - 1]} · pH=${ph} · ${hasMirror ? 'Phản ứng tráng bạc 2Ag↓ thành công!' : 'Không có phản ứng tráng bạc'}`, 18, 28);
      return {
        metrics: [
          { label: 'Cacbohiđrat', value: names[sugar - 1] },
          { label: 'Kết quả Tollens', value: hasMirror ? 'Tạo gương bạc (2Ag↓)' : 'Âm tính' },
          { label: 'Môi trường kiềm', value: ph >= 8 ? 'Chuyển hóa Fructozơ ⇌ Glucozơ' : 'Trung tính / Axit' }
        ],
        statusNote: 'Glucozơ và Fructozơ (trong môi trường kiềm OH⁻) đều tráng bạc; Saccarozơ thì không.'
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

      ctx.fillStyle = dark ? '#1e293b' : '#e2e8f0';
      ctx.fillRect(w * 0.14, cy - 36, w * 0.72, 72);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(w * 0.1, cy - 46, 22, 92);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(w * 0.9 - 22, cy - 46, 22, 92);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('+', w * 0.1 + 7, cy + 5);
      ctx.fillText('−', w * 0.9 - 15, cy + 5);

      const drift = eField ? Math.max(-0.3, Math.min(0.3, -charge * 0.24 * Math.min(1, (t % 4) / 3))) : 0;
      const spotX = cx + drift * w;
      ctx.fillStyle = charge === 0 ? '#10b981' : charge > 0 ? '#3b82f6' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(spotX, cy, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
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

    case 'polymerization_2d': {
      const pMode = Math.round(params.polymerMode ?? 1);
      const count = Math.max(6, Math.min(24, Math.round(params.monomerCount ?? 14)));
      const cross = params.crosslink ?? 20;
      const names = ['Trùng hợp PE (-CH₂-CH₂-)ₙ', 'Trùng ngưng Nilon-6,6 (tách H₂O)', 'Lưu hóa cao su (cầu -S-S-)'];

      const stepX = Math.min(34, (w - 100) / count);
      const sx = cx - ((count - 1) * stepX) / 2;
      for (let i = 0; i < count; i++) {
        const px = sx + i * stepX;
        const py = cy - 26 + (i % 2 === 0 ? -12 : 12);
        if (i > 0) {
          ctx.strokeStyle = fg;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(sx + (i - 1) * stepX, cy - 26 + ((i - 1) % 2 === 0 ? -12 : 12));
          ctx.lineTo(px, py);
          ctx.stroke();
        }
        drawAtomNode(ctx, px, py, 9, pMode === 2 && i % 3 === 0 ? '#a855f7' : '#0ea5e9', '');

        if (pMode === 3) {
          const py2 = cy + 44 + (i % 2 === 0 ? -10 : 10);
          drawAtomNode(ctx, px, py2, 9, '#0ea5e9', '');
          if (i % Math.max(2, Math.round(6 - cross / 22)) === 0) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py2);
            ctx.stroke();
          }
        }
      }
      const mw = count * (pMode === 2 ? 113 : 28);
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${names[pMode - 1]} · n = ${count} · M ≈ ${mw} đvC`, 18, 28);
      return {
        metrics: [
          { label: 'Hệ số trùng hợp n', value: count, unit: 'mắt xích' },
          { label: 'Phân tử khối M', value: mw, unit: 'g/mol' },
          { label: 'Cầu khâu mạng', value: pMode === 3 ? `${cross}% (-S-S-)` : 'Mạch không phân nhánh' }
        ],
        statusNote: 'Cầu đisunfua -S-S- biến cao su dẻo thành mạng không gian đàn hồi bền nhiệt.'
      };
    }

    case 'corrosion_protection_2d': {
      const znOn = Math.round(params.zincAttached ?? 0) === 1;
      const sal = params.salinity ?? 3.5;
      const oxy = params.oxygenLevel ?? 80;
      const rustRate = znOn ? 0 : round(sal * (oxy / 40), 2);

      // Steel hull block + water droplet + optional Zn sacrificial block
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 130, cy, 260, 56);
      ctx.fillStyle = 'rgba(14,165,233,0.32)';
      ctx.beginPath();
      ctx.arc(cx, cy, 78, Math.PI, 0);
      ctx.fill();

      if (znOn) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx - 120, cy - 28, 42, 28);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Zn (-)', cx - 116, cy - 10);
        drawArrow(ctx, cx - 76, cy + 16, cx + 10, cy + 16, '#38bdf8', 2.5);
      } else {
        ctx.fillStyle = 'rgba(180,83,9,0.75)';
        ctx.beginPath();
        ctx.arc(cx, cy - 4, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        znOn
          ? 'Gắn Anode Hy sinh Zn: Kẽm bị ăn mòn thay Thép (Fe được bảo vệ hoàn toàn!)'
          : `Pin cục bộ Fe–C trong NaCl ${sal}%: Thép bị oxi hóa gỉ sét Fe(OH)₃!`,
        18,
        28
      );
      return {
        metrics: [
          { label: 'Trạng thái vỏ thép', value: znOn ? 'Được bảo vệ Catot' : 'Đang gỉ sét nhanh' },
          { label: 'Tốc độ ăn mòn Fe', value: rustRate, unit: 'mm/năm' },
          { label: 'Cực bị oxi hóa (Anode)', value: znOn ? 'Thanh Zn (E°=-0.76V)' : 'Thép Fe (E°=-0.44V)' }
        ],
        statusNote: 'Phương pháp điện hóa gắn tấm Zn vào vỏ tàu biển để bảo vệ thân thép.'
      };
    }

    case 'colligative_boiling_2d': {
      const m = params.molality ?? 1.5;
      const iFactor = Math.max(1, Math.min(3, Math.round(params.vantHoffI ?? 2)));
      const tempC = params.tempCurrent ?? 99;
      const tb = round(100 + iFactor * 0.512 * m, 2);
      const tf = round(0 - iFactor * 1.86 * m, 2);
      const phase = tempC >= tb ? 'Sôi (Hóa hơi)' : tempC <= tf ? 'Đóng băng (Rắn)' : 'Trạng thái Lỏng';

      // Thermometer bar
      const tx = w * 0.25;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(tx - 18, 56, 36, h - 108);
      const fillFrac = Math.max(0.05, Math.min(1, (tempC + 15) / 130));
      ctx.fillStyle = tempC >= tb ? '#ef4444' : tempC <= tf ? '#38bdf8' : '#10b981';
      ctx.fillRect(tx - 14, 56 + (1 - fillFrac) * (h - 114), 28, fillFrac * (h - 114));

      // Particles on right
      const nSolute = Math.round(m * 6 * iFactor);
      for (let i = 0; i < nSolute; i++) {
        const px = w * 0.52 + ((i * 57 + t * 40) % (w * 0.36));
        const py = 72 + ((i * 43 + Math.sin(t * 2 + i) * 28 + h) % (h - 125));
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`m = ${m} mol/kg · i = ${iFactor} · T_đông = ${tf}°C · T_sôi = ${tb}°C (${phase})`, 18, 28);
      return {
        metrics: [
          { label: 'Nhiệt độ sôi Tb', value: tb, unit: '°C' },
          { label: 'Nhiệt độ đông đặc Tf', value: tf, unit: '°C' },
          { label: 'Pha hiện tại', value: phase }
        ],
        statusNote: 'Chất tan không bay hơi mở rộng khoảng lỏng của dung môi ở cả hai đầu.'
      };
    }

    case 'stoichiometry_gas_2d': {
      const nZn = params.molZn ?? 0.2;
      const nHCl = params.molHCl ?? 0.3;
      const gasStd = Math.round(params.gasStd ?? 1);
      const vm = gasStd === 1 ? 24.79 : 22.4;
      const nH2 = Math.min(nZn, nHCl / 2);
      const volL = round(nH2 * vm, 2);
      const excess = nZn > nHCl / 2 ? `Dư ${round(nZn - nHCl / 2, 2)} mol Zn` : nZn < nHCl / 2 ? `Dư ${round(nHCl - 2 * nZn, 2)} mol HCl` : 'Phản ứng vừa đủ';

      // Flask + gas syringe piston on right
      ctx.fillStyle = 'rgba(14,165,233,0.22)';
      ctx.fillRect(w * 0.16, cy - 10, 110, 95);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(w * 0.16, cy - 35, 110, 120);

      const pistonLen = Math.min(w * 0.36, volL * 24 + 32);
      ctx.fillStyle = 'rgba(16,185,129,0.25)';
      ctx.fillRect(w * 0.45, cy - 22, pistonLen, 44);
      ctx.strokeRect(w * 0.45, cy - 22, w * 0.38, 44);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(w * 0.45 + pistonLen, cy - 22, 12, 44);

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Zn (${nZn} mol) + HCl (${nHCl} mol) → H₂ = ${nH2} mol (${volL} L tại ${gasStd === 1 ? 'ĐKC 24.79L' : 'ĐKTC 22.4L'})`, 18, 28);
      return {
        metrics: [
          { label: 'Thể tích khí H₂', value: volL, unit: 'L' },
          { label: 'Số mol H₂ sinh ra', value: round(nH2, 3), unit: 'mol' },
          { label: 'Chất dư sau phản ứng', value: excess }
        ],
        statusNote: 'Tính lượng sản phẩm luôn theo chất hết trước (n_Zn vs n_HCl / 2).'
      };
    }

    case 'carbonyl_alcohol_2d': {
      const comp = Math.max(1, Math.min(4, Math.round(params.compoundId ?? 3)));
      const reag = Math.max(1, Math.min(4, Math.round(params.reagentId ?? 1)));
      const tempC = params.tempC ?? 65;

      const compInfo = [
        { name: 'Etanol (C₂H₅OH)', grp: 'Ancol đơn chức bậc I', col: '#38bdf8' },
        { name: 'Glixerol (C₃H₅(OH)₃)', grp: 'Poliancol có ≥2 nhóm -OH kề', col: '#0ea5e9' },
        { name: 'Anđehit axetic (CH₃CHO)', grp: 'Nhóm chức -CHO & CH₃CO-', col: '#10b981' },
        { name: 'Phenol (C₆H₅OH)', grp: 'Nhóm -OH gắn vòng Benzen', col: '#a855f7' }
      ][comp - 1];

      const reagNames = [
        'Tollens [Ag(NH₃)₂]OH',
        'Cu(OH)₂ / OH⁻',
        'Nước Brom (Br₂)',
        'I₂ / NaOH (Iodoform)'
      ];

      // Determine chemical reaction & visual phenotype accurately
      let rxOccurs = false;
      let solColor = 'rgba(148,163,184,0.18)';
      let pptColor = '';
      let silverMirror = false;
      let phenomenon = 'Không có hiện tượng rõ rệt';
      let equation = 'Không phản ứng ở điều kiện này';

      if (reag === 1) {
        // Tollens
        if (comp === 3 && tempC >= 45) {
          rxOccurs = true;
          silverMirror = true;
          solColor = 'rgba(226,232,240,0.45)';
          phenomenon = 'Lớp Bạc (Ag) sáng bóng bám thành ống nghiệm!';
          equation = 'CH₃CHO + 2[Ag(NH₃)₂]OH → CH₃COONH₄ + 2Ag↓ + 3NH₃↑ + H₂O';
        } else if (comp === 3) {
          solColor = 'rgba(203,213,225,0.28)';
          phenomenon = 'Cần đun nóng ≥ 45°C để tráng bạc nhanh';
          equation = 'Tăng nhiệt độ cách thủy để phản ứng Tollens xảy ra mạnh';
        }
      } else if (reag === 2) {
        // Cu(OH)2
        if (comp === 2) {
          rxOccurs = true;
          solColor = 'rgba(29,78,216,0.78)';
          phenomenon = 'Hòa tan Cu(OH)₂ tạo phức xanh lam thẫm!';
          equation = '2C₃H₅(OH)₃ + Cu(OH)₂ → [C₃H₅(OH)₂O]₂Cu (xanh lam) + 2H₂O';
        } else if (comp === 3 && tempC >= 60) {
          rxOccurs = true;
          solColor = 'rgba(56,189,248,0.22)';
          pptColor = '#dc2626';
          phenomenon = 'Kết tủa Đỏ gạch Cu₂O↓ xuất hiện khi đun nóng!';
          equation = 'CH₃CHO + 2Cu(OH)₂ + NaOH → CH₃COONa + Cu₂O↓ (đỏ gạch) + 3H₂O';
        } else {
          solColor = 'rgba(56,189,248,0.25)';
          pptColor = '#0284c7';
          phenomenon = comp === 3 ? 'Đun nóng ≥ 60°C để tạo Cu₂O đỏ gạch' : 'Kết tủa xanh Cu(OH)₂ không tan';
        }
      } else if (reag === 3) {
        // Bromine water
        if (comp === 4) {
          rxOccurs = true;
          solColor = 'rgba(241,245,249,0.35)';
          pptColor = '#f8fafc';
          phenomenon = 'Mất màu nước Brom & ↓ trắng 2,4,6-tribromophenol!';
          equation = 'C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ (trắng) + 3HBr';
        } else if (comp === 3) {
          rxOccurs = true;
          solColor = 'rgba(226,232,240,0.24)';
          phenomenon = 'Nhóm -CHO khử làm mất màu nâu đỏ của nước Br₂!';
          equation = 'CH₃CHO + Br₂ + H₂O → CH₃COOH + 2HBr';
        } else {
          solColor = 'rgba(217,119,6,0.58)';
          phenomenon = 'Nước Brom giữ nguyên màu nâu đỏ';
        }
      } else if (reag === 4) {
        // Iodoform I2/NaOH
        if (comp === 1 || comp === 3) {
          rxOccurs = true;
          solColor = 'rgba(254,240,138,0.28)';
          pptColor = '#eab308';
          phenomenon = 'Kết tủa Vàng chanh Iodoform (CHI₃↓) mùi đặc trưng!';
          equation = comp === 3 ? 'CH₃CHO + 3I₂ + 4NaOH → CHI₃↓ + HCOONa + 3NaI + 3H₂O' : 'C₂H₅OH + 4I₂ + 6NaOH → CHI₃↓ + HCOONa + 5NaI + 5H₂O';
        } else {
          solColor = 'rgba(180,83,9,0.42)';
          phenomenon = 'Không có nhóm CH₃CO- / CH₃CH(OH)- → âm tính Iodoform';
        }
      }

      // Left: Molecule badge & functional group card
      const lx = 26;
      ctx.fillStyle = dark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)';
      ctx.strokeStyle = compInfo.col;
      ctx.lineWidth = 2;
      ctx.fillRect(lx, 56, w * 0.44, h - 104);
      ctx.strokeRect(lx, 56, w * 0.44, h - 104);

      drawAtomNode(ctx, lx + 46, 108, 22, compInfo.col, comp === 4 ? 'PhOH' : comp === 3 ? 'CHO' : 'OH');
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(compInfo.name, lx + 82, 102);
      ctx.fillStyle = muted;
      ctx.font = '11px sans-serif';
      ctx.fillText(compInfo.grp, lx + 82, 122);

      ctx.fillStyle = rxOccurs ? '#10b981' : '#f59e0b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Thuốc thử: ${reagNames[reag - 1]}`, lx + 18, 168);
      ctx.fillStyle = fg;
      ctx.font = '11.5px sans-serif';
      ctx.fillText(phenomenon.slice(0, 46), lx + 18, 194);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10.5px monospace';
      ctx.fillText(equation.slice(0, 48), lx + 18, 224);

      // Right: Heated water bath + reaction test tube
      const tx = w * 0.72;
      const ty = cy - 68;
      // Water bath beaker
      ctx.fillStyle = tempC > 50 ? 'rgba(249,115,22,0.16)' : 'rgba(56,189,248,0.14)';
      ctx.fillRect(tx - 78, ty + 32, 156, 128);
      ctx.strokeStyle = muted;
      ctx.lineWidth = 2;
      ctx.strokeRect(tx - 78, ty + 24, 156, 136);

      // Test tube inside bath
      if (silverMirror) {
        drawBloomOrb(ctx, tx, ty + 76, 86, 'rgba(226,232,240,0.45)', 'rgba(56,189,248,0.15)', perfMode);
      } else if (rxOccurs) {
        drawBloomOrb(ctx, tx, ty + 76, 74, `${compInfo.col}38`, 'rgba(16,185,129,0.08)', perfMode);
      }

      ctx.fillStyle = solColor;
      ctx.fillRect(tx - 28, ty + 22, 56, 114);
      drawGlassReflect(ctx, tx - 28, ty - 6, 56, 142, perfMode);
      ctx.strokeStyle = silverMirror ? '#f8fafc' : fg;
      ctx.lineWidth = silverMirror ? 5 : 2.5;
      ctx.strokeRect(tx - 28, ty - 6, 56, 142);

      // Precipitate settling particles or rising bubbles
      if (pptColor) {
        const dropCount = perfMode === 'ultra' ? 28 : perfMode === 'balanced' ? 18 : 10;
        for (let i = 0; i < dropCount; i++) {
          const px = tx - 20 + ((i * 19) % 40);
          const py = ty + 112 + ((i * 11 + Math.sin(t * 2 + i) * 4) % 20);
          ctx.fillStyle = pptColor;
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (tempC >= 55) {
        for (let i = 0; i < (perfMode === 'ultra' ? 12 : 7); i++) {
          const bx = tx - 64 + ((i * 23) % 128);
          const by = ty + 148 - ((t * 48 + i * 21) % 105);
          ctx.fillStyle = 'rgba(226,232,240,0.45)';
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Thử nghiệm ${compInfo.name} + ${reagNames[reag - 1]} (${tempC}°C)`, 18, 28);

      return {
        metrics: [
          { label: 'Chất hữu cơ', value: compInfo.name },
          { label: 'Hiện tượng chính', value: rxOccurs ? (silverMirror ? 'Tráng gương Ag' : pptColor ? 'Kết tủa đặc trưng' : 'Đổi màu/tạo phức') : 'Âm tính' },
          { label: 'Nhiệt độ đun', value: tempC, unit: '°C' }
        ],
        statusNote: phenomenon
      };
    }

    case 'qualitative_ion_2d': {
      const ionCode = Math.max(1, Math.min(6, Math.round(params.ionCode ?? 1)));
      const drops = params.reagentDrops ?? 70;
      const excess = Math.round(params.excessBase ?? 0) === 1;
      const frac = Math.min(1, drops / 100);

      if (ionCode === 1) {
        // 3 Halide comparison tubes: Cl-, Br-, I- + AgNO3 (+ optional NH3 excess)
        const halides = [
          { lbl: 'Cl⁻ + Ag⁺', ppt: 'AgCl↓ (Trắng)', col: '#f8fafc', dissolves: true },
          { lbl: 'Br⁻ + Ag⁺', ppt: 'AgBr↓ (Vàng nhạt)', col: '#fef08a', dissolves: false },
          { lbl: 'I⁻ + Ag⁺', ppt: 'AgI↓ (Vàng đậm)', col: '#eab308', dissolves: false }
        ];
        halides.forEach((hal, idx) => {
          const tx = w * (0.24 + idx * 0.26);
          const ty = cy - 62;
          const dissolved = excess && hal.dissolves;
          drawBloomOrb(ctx, tx, ty + 80, 62, `${hal.col}28`, 'rgba(56,189,248,0.05)', perfMode);
          ctx.fillStyle = dissolved ? 'rgba(226,232,240,0.16)' : 'rgba(56,189,248,0.22)';
          ctx.fillRect(tx - 28, ty + 16, 56, 118);
          drawGlassReflect(ctx, tx - 28, ty, 56, 134, perfMode);
          ctx.strokeStyle = fg;
          ctx.lineWidth = 2.4;
          ctx.strokeRect(tx - 28, ty, 56, 134);

          if (!dissolved && drops > 10) {
            const pCount = Math.round(frac * (perfMode === 'ultra' ? 24 : 14));
            for (let i = 0; i < pCount; i++) {
              const px = tx - 20 + ((i * 17) % 40);
              const py = ty + 106 + ((i * 9 + Math.sin(t * 2 + i) * 3) % 24);
              ctx.fillStyle = hal.col;
              ctx.beginPath();
              ctx.arc(px, py, 3.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.fillStyle = fg;
          ctx.font = 'bold 11.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(hal.lbl, tx, ty - 10);
          ctx.fillStyle = dissolved ? '#38bdf8' : muted;
          ctx.fillText(dissolved ? 'Tan -> [Ag(NH₃)₂]⁺' : hal.ppt, tx, ty + 154);
        });
        ctx.textAlign = 'left';
        ctx.fillStyle = fg;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Nhận biết Halogenua Cl⁻ / Br⁻ / I⁻ bằng AgNO₃ (${drops}% · ${excess ? 'Có NH₃ dư' : 'Chưa thêm NH₃'})`, 18, 28);
        return {
          metrics: [
            { label: 'Thuốc thử chính', value: 'AgNO₃ + NH₃' },
            { label: 'Thứ tự đậm màu ↓', value: 'AgCl < AgBr < AgI' },
            { label: 'Ảnh hưởng NH₃ dư', value: excess ? 'Hòa tan AgCl tạo phức' : 'Tách 3 kết tủa rõ màu' }
          ],
          statusNote: 'AgCl trắng tan hết trong dung dịch NH₃ loãng; AgI vàng đậm hầu như không tan.'
        };
      }

      const specs = [
        { ion: 'SO₄²⁻', reag: 'BaCl₂', ppt: 'BaSO₄↓ (Trắng bền)', solCol: 'rgba(148,163,184,0.2)', pptCol: '#f8fafc', amphoteric: false, complexCol: '' },
        { ion: 'Fe³⁺', reag: 'NaOH', ppt: 'Fe(OH)₃↓ (Nâu đỏ)', solCol: 'rgba(245,158,11,0.24)', pptCol: '#9a3412', amphoteric: false, complexCol: '' },
        { ion: 'Fe²⁺', reag: 'NaOH', ppt: 'Fe(OH)₂↓ (Trắng xanh → nâu)', solCol: 'rgba(16,185,129,0.2)', pptCol: '#bbf7d0', amphoteric: false, complexCol: '' },
        { ion: 'Cu²⁺', reag: 'NH₃ / NaOH', ppt: 'Cu(OH)₂↓ (Xanh lam)', solCol: 'rgba(14,165,233,0.34)', pptCol: '#0284c7', amphoteric: false, complexCol: 'rgba(29,78,216,0.82)' },
        { ion: 'Al³⁺', reag: 'NaOH', ppt: 'Al(OH)₃↓ (Keo trắng)', solCol: 'rgba(148,163,184,0.18)', pptCol: '#e2e8f0', amphoteric: true, complexCol: 'rgba(226,232,240,0.15)' }
      ][ionCode - 2];

      const tx = cx - 44;
      const ty = cy - 64;
      const dissolvedIntoComplex = excess && Boolean(specs.complexCol);

      // Animated reagent droplet falling from pipette
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 5, 42, 10, 32);
      if (drops > 0) {
        const dropY = 76 + ((t * 95) % 44);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, dropY, 4.2, 0, Math.PI * 2);
        ctx.fill();
      }

      drawBloomOrb(ctx, cx, ty + 78, 90, dissolvedIntoComplex && ionCode === 5 ? 'rgba(29,78,216,0.38)' : `${specs.pptCol}28`, 'rgba(56,189,248,0.06)', perfMode);
      ctx.fillStyle = dissolvedIntoComplex ? specs.complexCol : specs.solCol;
      ctx.fillRect(tx, ty + 20, 88, 126);
      drawGlassReflect(ctx, tx, ty, 88, 146, perfMode);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.6;
      ctx.strokeRect(tx, ty, 88, 146);

      if (!dissolvedIntoComplex && drops > 10) {
        const pCount = Math.round(frac * (perfMode === 'ultra' ? 32 : 18));
        for (let i = 0; i < pCount; i++) {
          const px = tx + 10 + ((i * 23) % 68);
          const py = ty + 112 + ((i * 11 + Math.sin(t * 2 + i) * 4) % 28);
          ctx.fillStyle = specs.pptCol;
          ctx.beginPath();
          ctx.arc(px, py, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        `Nhận biết ${specs.ion} + ${specs.reag} (${drops}%) → ${
          dissolvedIntoComplex
            ? ionCode === 5
              ? 'Tan thành phức [Cu(NH₃)₄]²⁺ xanh thẫm!'
              : 'Al(OH)₃ tan trong NaOH dư → [Al(OH)₄]⁻!'
            : specs.ppt
        }`,
        18,
        28
      );
      return {
        metrics: [
          { label: 'Ion khảo sát', value: specs.ion },
          { label: 'Kết tủa ban đầu', value: specs.ppt },
          { label: 'Kiềm / NH₃ dư', value: dissolvedIntoComplex ? 'Kết tủa TAN hết' : 'Không tan' }
        ],
        statusNote: 'Quan sát màu kết tủa đặc trưng và tính tan lưỡng tính / tạo phức khi nhỏ dư thuốc thử.'
      };
    }

    case 'metallurgy_furnace_2d': {
      const mode = Math.round(params.processMode ?? 1);
      const tempC = params.blastTemp ?? 1550;
      const o2Pct = params.oxygenBlast ?? 75;
      const heatRatio = Math.min(1, Math.max(0.15, (tempC - 500) / 1900));

      if (mode === 1) {
        // Blast furnace cutaway: C + O2 -> CO2 -> CO reducing Fe2O3
        const fx = cx - 90;
        drawBloomOrb(ctx, cx, cy + 44, 140 * heatRatio, 'rgba(249,115,22,0.45)', 'rgba(239,68,68,0.12)', perfMode);
        const fGrad = ctx.createLinearGradient(0, 56, 0, h - 38);
        fGrad.addColorStop(0, 'rgba(56,189,248,0.18)');
        fGrad.addColorStop(0.45, `rgba(245,158,11,${(0.25 + heatRatio * 0.4).toFixed(2)})`);
        fGrad.addColorStop(1, `rgba(239,68,68,${(0.45 + heatRatio * 0.45).toFixed(2)})`);
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.moveTo(fx + 35, 56);
        ctx.lineTo(fx + 145, 56);
        ctx.lineTo(fx + 175, cy + 28);
        ctx.lineTo(fx + 155, h - 42);
        ctx.lineTo(fx + 25, h - 42);
        ctx.lineTo(fx + 5, cy + 28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = fg;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Molten Pig Iron hearth
        ctx.fillStyle = '#f97316';
        ctx.fillRect(fx + 28, h - 66, 124, 22);

        // Rising CO gas bubbles & O2 blast arrows
        drawArrow(ctx, fx - 54, cy + 44, fx + 12, cy + 44, '#38bdf8', 3);
        drawArrow(ctx, fx + 234, cy + 44, fx + 168, cy + 44, '#38bdf8', 3);
        const nGas = perfMode === 'ultra' ? 20 : 12;
        for (let i = 0; i < nGas; i++) {
          const gy = h - 74 - ((t * (40 + o2Pct * 0.8) + i * 26) % (h - 140));
          const gx = cx - 45 + ((i * 29) % 90) + Math.sin(t * 3 + i) * 6;
          ctx.fillStyle = gy < cy - 20 ? '#94a3b8' : '#fde047';
          ctx.beginPath();
          ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Vùng 400–700°C: Fe₂O₃ + 3CO → 2Fe + 3CO₂', cx + 98, 108);
        ctx.fillText('Vùng 1000°C: CaCO₃ → CaO + CO₂ (tạo xỉ CaSiO₃)', cx + 98, 174);
        ctx.fillText('Nồi lò ≥1500°C: Gang lỏng chảy ra', cx + 98, h - 54);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Lò Cao Luyện Gang · T_nồi = ${tempC}°C · Gió O₂ = ${o2Pct}%`, 18, 28);

        const feYield = round(Math.min(98.5, 45 + heatRatio * 42 + o2Pct * 0.14), 1);
        return {
          metrics: [
            { label: 'Nhiệt độ nồi lò', value: tempC, unit: '°C' },
            { label: 'Hiệu suất hoàn nguyên Fe', value: feYield, unit: '%' },
            { label: 'Chất khử chính', value: 'Khí CO (từ C + O₂)' }
          ],
          statusNote: 'Khí CO sinh ra từ than cốc khử oxit sắt qua nhiều tầng: Fe₂O₃ → Fe₃O₄ → FeO → Fe.'
        };
      }

      // Process 2: Thermite Reaction (2Al + Fe2O3 -> Al2O3 + 2Fe)
      drawBloomOrb(ctx, cx, cy - 12, 145 * heatRatio, 'rgba(253,224,71,0.58)', 'rgba(249,115,22,0.18)', perfMode);
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(cx - 64, cy - 42);
      ctx.lineTo(cx + 64, cy - 42);
      ctx.lineTo(cx + 38, cy + 48);
      ctx.lineTo(cx - 38, cy + 48);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // White-hot sparks erupting
      const sparkN = perfMode === 'ultra' ? 28 : 14;
      for (let i = 0; i < sparkN; i++) {
        const life = (t * 1.4 + i / sparkN) % 1;
        const ang = -Math.PI * 0.85 + ((i * 37) % 100) * 0.007 * Math.PI;
        const sx = cx + Math.cos(ang) * life * 115;
        const sy = cy - 36 + Math.sin(ang) * life * 95 + life * life * 45;
        ctx.fillStyle = life < 0.4 ? '#ffffff' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2 * (1 - life * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      // Molten iron pool below crucible
      ctx.fillStyle = '#f97316';
      ctx.fillRect(cx - 56, h - 54, 112, 18);
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Phản ứng Nhiệt Nhôm (2Al + Fe₂O₃ → Al₂O₃ + 2Fe) · T ≈ ${Math.max(1800, tempC)}°C`, 18, 28);
      return {
        metrics: [
          { label: 'Nhiệt độ phản ứng', value: Math.max(1800, tempC), unit: '°C' },
          { label: 'Biến thiên ΔH', value: -851.5, unit: 'kJ/mol' },
          { label: 'Sản phẩm nóng chảy', value: 'Fe lỏng + xỉ Al₂O₃' }
        ],
        statusNote: 'Nhôm khử mạnh oxit sắt giải phóng nhiệt lượng cực lớn làm sắt nóng chảy dùng hàn đường ray.'
      };
    }

    default: {
      return {
        metrics: [{ label: 'Sim ID', value: simType }],
        statusNote: 'Chế độ mô phỏng Hóa học 2D sẵn sàng.'
      };
    }
  }
}
