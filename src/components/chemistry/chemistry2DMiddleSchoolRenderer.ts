import { ChemistrySimType } from '../../types';
import { PerformanceMode } from '../../context/BackgroundContext';
import { ChemSimTelemetry } from './chemistry2DEngine';
import {
  drawStudioGlassVessel,
  drawStudioStandAndClamp,
  drawStudioThermometerProbe,
  getStudioBenchY
} from '../common/studio2DCanvasKit';

function round(v: number, d = 2): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

const ELEMENTS_1_TO_20: { z: number; sym: string; name: string; mass: number; valence: number }[] = [
  { z: 1, sym: 'H', name: 'Hydrogen', mass: 1, valence: 1 },
  { z: 2, sym: 'He', name: 'Helium', mass: 4, valence: 0 },
  { z: 3, sym: 'Li', name: 'Lithium', mass: 7, valence: 1 },
  { z: 4, sym: 'Be', name: 'Beryllium', mass: 9, valence: 2 },
  { z: 5, sym: 'B', name: 'Boron', mass: 11, valence: 3 },
  { z: 6, sym: 'C', name: 'Carbon', mass: 12, valence: 4 },
  { z: 7, sym: 'N', name: 'Nitrogen', mass: 14, valence: 3 },
  { z: 8, sym: 'O', name: 'Oxygen', mass: 16, valence: 2 },
  { z: 9, sym: 'F', name: 'Fluorine', mass: 19, valence: 1 },
  { z: 10, sym: 'Ne', name: 'Neon', mass: 20, valence: 0 },
  { z: 11, sym: 'Na', name: 'Sodium', mass: 23, valence: 1 },
  { z: 12, sym: 'Mg', name: 'Magnesium', mass: 24, valence: 2 },
  { z: 13, sym: 'Al', name: 'Aluminium', mass: 27, valence: 3 },
  { z: 14, sym: 'Si', name: 'Silicon', mass: 28, valence: 4 },
  { z: 15, sym: 'P', name: 'Phosphorus', mass: 31, valence: 3 },
  { z: 16, sym: 'S', name: 'Sulfur', mass: 32, valence: 2 },
  { z: 17, sym: 'Cl', name: 'Chlorine', mass: 35.5, valence: 1 },
  { z: 18, sym: 'Ar', name: 'Argon', mass: 40, valence: 0 },
  { z: 19, sym: 'K', name: 'Potassium', mass: 39, valence: 1 },
  { z: 20, sym: 'Ca', name: 'Calcium', mass: 40, valence: 2 }
];

function getShellDistribution(z: number): number[] {
  const caps = [2, 8, 8, 2];
  const out: number[] = [];
  let rem = z;
  for (const cap of caps) {
    if (rem <= 0) break;
    const take = Math.min(cap, rem);
    out.push(take);
    rem -= take;
  }
  return out;
}

function phToRgb(ph: number): string {
  const stops: [number, [number, number, number]][] = [
    [1, [239, 68, 68]],
    [3, [249, 115, 22]],
    [5, [234, 179, 8]],
    [7, [34, 197, 94]],
    [9, [20, 184, 166]],
    [11, [59, 130, 246]],
    [13.5, [139, 92, 246]]
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (ph <= p1) {
      const u = Math.max(0, Math.min(1, (ph - p0) / (p1 - p0)));
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * u);
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * u);
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * u);
      return `rgb(${r},${g},${b})`;
    }
  }
  return 'rgb(139,92,246)';
}

export function renderMiddleSchool2DChemSim(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  simType: ChemistrySimType,
  params: Record<string, number>,
  t: number,
  dark: boolean,
  perfMode: PerformanceMode
): ChemSimTelemetry {
  const benchY = getStudioBenchY(h, h < 310);
  const fg = dark ? '#e2e8f0' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  const cx = w * 0.5;
  const cy = Math.min(h * 0.54, benchY - 72);

  switch (simType) {
    case 'states_of_matter_2d': {
      const tempC = params.tempC ?? 25;
      const airMix = Math.round(params.airMixMode ?? 0) === 1;
      const pressure = params.pressureAtm ?? 1;

      if (airMix) {
        // Air composition pie chart + oxygen glowing splint test
        const pieX = w * 0.31;
        const pieY = h * 0.56;
        const rad = Math.min(w * 0.19, h * 0.28);
        const slices = [
          { label: '78% Nitơ (N₂)', frac: 0.78, color: '#38bdf8' },
          { label: '21% Oxygen (O₂)', frac: 0.21, color: '#ef4444' },
          { label: '1% CO₂, Ar, hơi nước', frac: 0.01, color: '#a855f7' }
        ];
        let ang = -Math.PI / 2;
        slices.forEach((sl) => {
          const span = sl.frac * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(pieX, pieY);
          ctx.arc(pieX, pieY, rad, ang, ang + span);
          ctx.closePath();
          ctx.fillStyle = sl.color;
          ctx.fill();
          ctx.strokeStyle = dark ? '#0f172a' : '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          ang += span;
        });

        // Legend
        slices.forEach((sl, idx) => {
          const ly = h * 0.3 + idx * 24;
          ctx.fillStyle = sl.color;
          ctx.fillRect(w * 0.56, ly - 10, 14, 14);
          ctx.fillStyle = fg;
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(sl.label, w * 0.56 + 22, ly + 1);
        });

        // Glowing splint in O2 bottle
        const bx = w * 0.73;
        const by = h * 0.63;
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 42, by - 55, 84, 110);
        ctx.fillStyle = 'rgba(239,68,68,0.12)';
        ctx.fillRect(bx - 40, by - 53, 80, 106);

        // Wooden splint stick + bright O2 flame
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(bx + 18, by - 78);
        ctx.lineTo(bx - 4, by + 5);
        ctx.stroke();

        const pulse = 1 + Math.sin(t * 9) * 0.16;
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.ellipse(bx - 5, by + 8, 9 * pulse, 16 * pulse, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(bx - 5, by + 10, 4.5 * pulse, 9 * pulse, 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Lọ khí O₂ nguyên chất: Tàn đóm bùng cháy!', bx - 100, by + 76);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Thành phần Không khí sạch & Vai trò duy trì sự cháy của Oxygen (21%)', 18, 28);

        return {
          metrics: [
            { label: 'Khí Nitơ (N₂)', value: 78, unit: '%' },
            { label: 'Khí Oxygen (O₂)', value: 21, unit: '%' },
            { label: 'Khí khác (CO₂, Ar...)', value: 1, unit: '%' }
          ],
          statusNote: 'Không khí là hỗn hợp khí gồm khoảng 78% N₂, 21% O₂ và 1% khí khác; O₂ duy trì sự hô hấp và sự cháy.'
        };
      }

      // 3 states of matter chamber + piston
      const boxW = Math.min(280, w * 0.48);
      const boxL = cx - boxW * 0.55;
      const boxB = h - 46;
      const maxBoxH = h - 115;
      const pistonDrop = (pressure - 1) * 26;
      const boxT = boxB - maxBoxH + pistonDrop;

      // Glass chamber
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(boxL, boxB - maxBoxH - 8);
      ctx.lineTo(boxL, boxB);
      ctx.lineTo(boxL + boxW, boxB);
      ctx.lineTo(boxL + boxW, boxB - maxBoxH - 8);
      ctx.stroke();

      // Movable piston
      ctx.fillStyle = '#64748b';
      ctx.fillRect(boxL + 2, boxT, boxW - 4, 14);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cx - boxW * 0.05 - 8, boxT - 28, 16, 28);

      // Heater / Ice plate under container
      if (tempC >= 50) {
        ctx.fillStyle = 'rgba(249,115,22,0.75)';
        ctx.fillRect(boxL + 16, boxB + 4, boxW - 32, 10);
      } else if (tempC < 0) {
        ctx.fillStyle = 'rgba(56,189,248,0.75)';
        ctx.fillRect(boxL + 16, boxB + 4, boxW - 32, 10);
      }

      const stateName = tempC < 0 ? 'Thể Rắn (Solid)' : tempC < 100 ? 'Thể Lỏng (Liquid)' : 'Thể Khí (Gas)';
      const pColor = tempC < 0 ? '#38bdf8' : tempC < 100 ? '#14b8a6' : '#f59e0b';
      const cols = 6;
      const rows = 4;
      const rMol = 10;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          let mx = boxL + 36 + c * 36;
          let my = boxB - 24 - r * 26;

          if (tempC < 0) {
            // Solid lattice vibration
            const amp = 1.6 + ((tempC + 25) / 25) * 1.4;
            mx += Math.sin(t * 16 + idx * 1.7) * amp;
            my += Math.cos(t * 14 + idx * 2.1) * amp;
          } else if (tempC < 100) {
            // Liquid sliding in lower volume
            const ag = 0.4 + (tempC / 100) * 0.9;
            mx = boxL + 24 + ((c * 42 + Math.sin(t * 2.4 * ag + idx) * 24 + 260) % (boxW - 48));
            my = boxB - 20 - r * 22 - Math.abs(Math.sin(t * 3 * ag + idx * 0.8)) * 12;
          } else {
            // Gas fast bouncing inside chamber
            const speed = 75 + (tempC - 100) * 1.8;
            const spanX = boxW - 32;
            const spanY = Math.max(45, boxB - (boxT + 26));
            const rawX = Math.abs(((c * 47 + t * speed * Math.cos(idx * 1.3 + 0.4)) % (spanX * 2)));
            const rawY = Math.abs(((r * 35 + t * speed * Math.sin(idx * 1.9 + 0.7)) % (spanY * 2)));
            mx = boxL + 16 + (rawX > spanX ? spanX * 2 - rawX : rawX);
            my = boxT + 24 + (rawY > spanY ? spanY * 2 - rawY : rawY);
          }

          ctx.fillStyle = pColor;
          ctx.beginPath();
          ctx.arc(mx, my, rMol, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = dark ? '#0f172a' : '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Side Thermometer Bar
      const tx = boxL + boxW + 46;
      const thH = maxBoxH;
      const thTop = boxB - thH;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2;
      ctx.strokeRect(tx, thTop, 16, thH);
      const fillFrac = Math.max(0.04, Math.min(1, (tempC + 25) / 165));
      ctx.fillStyle = tempC < 0 ? '#38bdf8' : tempC < 100 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(tx + 3, boxB - thH * fillFrac, 10, thH * fillFrac);
      ctx.fillStyle = fg;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${tempC}°C`, tx - 4, thTop - 8);
      ctx.fillText('100°C (Sôi)', tx + 22, boxB - thH * (125 / 165));
      ctx.fillText('0°C (Đông)', tx + 22, boxB - thH * (25 / 165));

      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${stateName} · T = ${tempC}°C · P = ${pressure} bar`, 18, 28);

      return {
        metrics: [
          { label: 'Trạng thái chất', value: stateName },
          { label: 'Nhiệt độ', value: tempC, unit: '°C' },
          { label: 'Khả năng nén', value: tempC >= 100 ? 'Rất dễ nén' : 'Rất khó nén' }
        ],
        statusNote:
          tempC < 0
            ? 'Ở thể rắn, các hạt xếp khít trật tự và chỉ dao động tại chỗ → có hình dạng và thể tích xác định.'
            : tempC < 100
            ? 'Ở thể lỏng, các hạt trượt lên nhau → có thể tích xác định nhưng mang hình dạng bình chứa.'
            : 'Ở thể khí, các hạt bay nhanh tán loạn mọi phía → chiếm toàn bộ thể tích bình và dễ bị nén.'
      };
    }

    case 'mixture_separation_2d': {
      const m = Math.round(params.methodId ?? 1);
      const prog = (params.progressPct ?? 65) / 100;
      const heat = (params.heatLevel ?? 50) / 100;
      const titles = [
        '1. Lọc qua giấy lọc (Tách Cát không tan khỏi Nước)',
        '2. Cô cạn bằng nhiệt (Tách Muối tan khỏi Nước)',
        '3. Phễu chiết (Tách 2 chất lỏng không tan: Dầu ăn & Nước)',
        '4. Dùng Nam châm (Tách bột Sắt có từ tính khỏi Lưu huỳnh)'
      ];

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(titles[m - 1] ?? titles[0], 18, 28);

      if (m === 1) {
        // Funnel + filter paper + sand + beaker below
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - 75, cy - 95);
        ctx.lineTo(cx - 12, cy - 8);
        ctx.lineTo(cx - 12, cy + 28);
        ctx.moveTo(cx + 75, cy - 95);
        ctx.lineTo(cx + 12, cy - 8);
        ctx.lineTo(cx + 12, cy + 28);
        ctx.stroke();

        // Filter paper cone
        ctx.fillStyle = 'rgba(248,250,252,0.55)';
        ctx.beginPath();
        ctx.moveTo(cx - 64, cy - 90);
        ctx.lineTo(cx, cy - 16);
        ctx.lineTo(cx + 64, cy - 90);
        ctx.closePath();
        ctx.fill();

        // Sand trapped on filter paper
        ctx.fillStyle = '#d97706';
        for (let i = 0; i < 18; i++) {
          const sx = cx - 28 + ((i * 19) % 56);
          const sy = cy - 42 - ((i * 7) % 24);
          ctx.beginPath();
          ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Falling clear water droplets
        for (let d = 0; d < 3; d++) {
          const dy = cy + 32 + ((t * 95 + d * 24) % 52);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(cx, dy, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Receiving beaker
        const bkTop = cy + 60;
        const bkH = 85;
        ctx.strokeStyle = fg;
        ctx.strokeRect(cx - 56, bkTop, 112, bkH);
        const liqH = 15 + prog * 55;
        ctx.fillStyle = 'rgba(56,189,248,0.5)';
        ctx.fillRect(cx - 54, bkTop + bkH - liqH, 108, liqH);
        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        ctx.fillText('Cát (chất rắn không tan) giữ trên giấy lọc', cx + 82, cy - 60);
        ctx.fillText('Nước trong chảy xuống bình hứng', cx + 72, bkTop + 50);

        return {
          metrics: [
            { label: 'Phương pháp', value: 'Lọc (Filtration)' },
            { label: 'Tiến độ tách', value: Math.round(prog * 100), unit: '%' },
            { label: 'Cơ sở tách', value: 'Kích thước hạt / Không tan' }
          ],
          statusNote: 'Phương pháp lọc tách chất rắn không tan (cát, kết tủa) ra khỏi chất lỏng nhờ lỗ nhỏ của giấy lọc.'
        };
      }

      if (m === 2) {
        // Evaporating dish + flame + rising steam + salt crystals
        const dishY = cy - 12;
        ctx.fillStyle = dark ? '#e2e8f0' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(cx, dishY, 85, 0, Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Remaining brine level decreases with progressPct
        const waterAlpha = Math.max(0.1, 0.75 * (1 - prog * 0.85));
        ctx.fillStyle = `rgba(56,189,248,${waterAlpha})`;
        ctx.beginPath();
        ctx.ellipse(cx, dishY + 8, 72, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // White NaCl crystals appear as prog increases
        const crystalN = Math.round(4 + prog * 18);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#94a3b8';
        for (let i = 0; i < crystalN; i++) {
          const kx = cx - 44 + ((i * 23) % 88);
          const ky = dishY + 26 + ((i * 11) % 24);
          ctx.fillRect(kx, ky, 7, 7);
          ctx.strokeRect(kx, ky, 7, 7);
        }

        // Burner flame
        const flameR = 14 + heat * 18;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(cx, dishY + 102, flameR * 0.6, flameR, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(cx, dishY + 105, flameR * 0.3, flameR * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rising steam wisps
        for (let s = 0; s < 6; s++) {
          const sy = dishY - 12 - ((t * (35 + heat * 50) + s * 19) % 85);
          const sx = cx - 45 + s * 18 + Math.sin(t * 4 + s) * 8;
          ctx.fillStyle = 'rgba(226,232,240,0.45)';
          ctx.beginPath();
          ctx.arc(sx, sy, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        ctx.fillText('Hơi nước bay đi', cx + 95, dishY - 45);
        ctx.fillText('Muối ăn NaCl kết tinh lại', cx + 95, dishY + 25);

        return {
          metrics: [
            { label: 'Phương pháp', value: 'Cô cạn (Evaporation)' },
            { label: 'Lượng nước đã bay hơi', value: Math.round(prog * 100), unit: '%' },
            { label: 'Nhiệt độ đun', value: Math.round(40 + heat * 70), unit: '°C' }
          ],
          statusNote: 'Phương pháp cô cạn thu hồi chất rắn tan bền nhiệt (như muối ăn NaCl) bằng cách làm bay hơi dung môi.'
        };
      }

      if (m === 3) {
        // Separatory funnel with oil (yellow top) and water (blue bottom)
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - 58, cy - 105);
        ctx.lineTo(cx + 58, cy - 105);
        ctx.quadraticCurveTo(cx + 68, cy - 42, cx + 10, cy + 12);
        ctx.lineTo(cx + 10, cy + 56);
        ctx.moveTo(cx - 58, cy - 105);
        ctx.quadraticCurveTo(cx - 68, cy - 42, cx - 10, cy + 12);
        ctx.lineTo(cx - 10, cy + 56);
        ctx.stroke();

        // Top yellow oil layer
        ctx.fillStyle = 'rgba(250,204,21,0.75)';
        ctx.fillRect(cx - 48, cy - 92, 96, 44);
        // Bottom blue water layer shrinks as prog increases
        const watH = Math.max(8, 42 * (1 - prog * 0.85));
        ctx.fillStyle = 'rgba(56,189,248,0.72)';
        ctx.fillRect(cx - 26, cy - 48, 52, watH);

        // Stopcock valve
        ctx.fillStyle = '#10b981';
        ctx.fillRect(cx - 22, cy + 24, 44, 10);

        // Receiving beaker
        ctx.strokeRect(cx - 46, cy + 72, 92, 68);
        ctx.fillStyle = 'rgba(56,189,248,0.68)';
        ctx.fillRect(cx - 44, cy + 138 - prog * 48, 88, prog * 48);

        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        ctx.fillText('Lớp dầu nhẹ nổi lên trên (D ≈ 0.8 g/cm³)', cx + 75, cy - 70);
        ctx.fillText('Lớp nước nặng ở dưới xả qua khóa van', cx + 65, cy + 95);

        return {
          metrics: [
            { label: 'Phương pháp', value: 'Chiết tách lớp' },
            { label: 'Nước đã xả xuống cốc', value: Math.round(prog * 100), unit: '%' },
            { label: 'Cơ sở tách', value: 'Không trộn lẫn & KLR khác nhau' }
          ],
          statusNote: 'Dầu ăn nhẹ hơn và không tan trong nước nên nổi lên trên; mở khóa phễu chiết xả hết lớp nước bên dưới.'
        };
      }

      // Method 4: Magnet attracting Fe from S
      const magY = cy - 45 - prog * 35;
      // U-magnet
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(cx, magY - 22, 34, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(cx - 41, magY - 22, 14, 26);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cx + 27, magY - 22, 14, 26);

      // Dish at bottom
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 110, cy + 52, 220, 32);

      // Sulfur yellow grains stay at bottom
      ctx.fillStyle = '#facc15';
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.arc(cx - 94 + i * 8, cy + 74 - (i % 3) * 4, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Iron filings lift toward magnet poles
      ctx.fillStyle = '#64748b';
      for (let i = 0; i < 18; i++) {
        const poleX = i % 2 === 0 ? cx - 34 : cx + 34;
        const startX = cx - 80 + i * 9;
        const fx = startX + (poleX - startX) * Math.min(1, prog * (0.6 + heat * 0.6));
        const fy = cy + 72 - (cy + 72 - (magY + 8)) * Math.min(1, prog * (0.6 + heat * 0.6));
        ctx.fillRect(fx - 3, fy - 2, 6, 4);
      }
      ctx.fillStyle = fg;
      ctx.font = '12px sans-serif';
      ctx.fillText('Bột Sắt (Fe) bị nam châm hút lên', cx + 65, magY);
      ctx.fillText('Lưu huỳnh (S) không từ tính ở lại đĩa', cx + 118, cy + 72);

      return {
        metrics: [
          { label: 'Phương pháp', value: 'Tách từ tính (Nam châm)' },
          { label: 'Lượng Fe đã hút', value: Math.round(Math.min(100, prog * (65 + heat * 45))), unit: '%' },
          { label: 'Chất còn lại', value: 'Lưu huỳnh (S)' }
        ],
        statusNote: 'Sắt có từ tính bị nam châm hút, còn lưu huỳnh hay cát không có từ tính nên được tách rời sạch sẽ.'
      };
    }

    case 'bohr_shells_2d': {
      const z = Math.max(1, Math.min(20, Math.round(params.atomicZ ?? 11)));
      const demo = Math.round(params.bondDemoMode ?? 0);
      const anim = (params.electronAnim ?? 1) >= 0.5;
      const el = ELEMENTS_1_TO_20[z - 1] ?? ELEMENTS_1_TO_20[10];
      const shells = getShellDistribution(z);

      if (demo === 1) {
        // Ionic bond Na (2-8-1) -> Cl (2-8-7)
        const leftX = w * 0.3;
        const rightX = w * 0.7;
        const shift = anim ? 0.5 + 0.5 * Math.sin(t * 1.6) : 1;
        // Na nucleus & 3 shells
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(leftX, cy, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('+11 Na', leftX - 20, cy + 4);
        [38, 62, 86].forEach((r, idx) => {
          ctx.strokeStyle = idx === 2 ? 'rgba(245,158,11,0.45)' : 'rgba(148,163,184,0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(leftX, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });
        // Cl nucleus & 3 shells
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(rightX, cy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillText('+17 Cl', rightX - 20, cy + 4);
        [38, 62, 86].forEach((r) => {
          ctx.strokeStyle = 'rgba(34,197,94,0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(rightX, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });
        // Transferring valence electron
        const startEx = leftX + 86;
        const endEx = rightX - 86;
        const ex = startEx + (endEx - startEx) * shift;
        const ey = cy - Math.sin(shift * Math.PI) * 58;
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startEx, cy);
        ctx.quadraticCurveTo(cx, cy - 82, endEx, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Liên kết Ion: Na nhường 1e → Na⁺ (2-8) hút tĩnh điện Cl⁻ (2-8-8)', 18, 28);
        ctx.fillText('Na⁺ (+1)', leftX - 24, cy + 114);
        ctx.fillText('Cl⁻ (-1)', rightX - 24, cy + 114);

        return {
          metrics: [
            { label: 'Loại liên kết', value: 'Liên kết Ion (Cho – Nhận e)' },
            { label: 'Cặp ion tạo thành', value: 'Na⁺ & Cl⁻' },
            { label: 'Công thức phân tử', value: 'NaCl (Muối ăn)' }
          ],
          statusNote: 'Kim loại Na nhường 1e lớp ngoài cùng cho phi kim Cl tạo hai ion trái dấu hút nhau bằng lực tĩnh điện.'
        };
      }

      if (demo === 2) {
        // Covalent bond H2O (shared pairs)
        const ox = cx;
        const oy = cy - 12;
        const h1x = cx - 82;
        const h1y = cy + 44;
        const h2x = cx + 82;
        const h2y = cy + 44;

        ctx.strokeStyle = 'rgba(56,189,248,0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy, 64, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(h1x, h1y, 38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(h2x, h2y, 38, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ox, oy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('O (+8)', ox - 19, oy + 5);

        [[h1x, h1y], [h2x, h2y]].forEach(([hx, hy]) => {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(hx, hy, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.fillText('H', hx - 5, hy + 4);
        });

        // Shared pairs highlighted
        const rot = anim ? t * 2 : 0;
        [[(ox + h1x) / 2, (oy + h1y) / 2], [(ox + h2x) / 2, (oy + h2y) / 2]].forEach(([mx, my], pairIdx) => {
          for (let e = 0; e < 2; e++) {
            const a = rot + pairIdx + e * Math.PI;
            ctx.fillStyle = e === 0 ? '#facc15' : '#34d399';
            ctx.beginPath();
            ctx.arc(mx + Math.cos(a) * 8, my + Math.sin(a) * 8, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.fillStyle = fg;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Liên kết Cộng hóa trị (H₂O): O và 2 H góp chung 2 cặp electron', 18, 28);
        return {
          metrics: [
            { label: 'Loại liên kết', value: 'Cộng hóa trị (Góp chung e)' },
            { label: 'Số cặp e chung', value: 2, unit: 'cặp (H–O–H)' },
            { label: 'Góc liên kết', value: 104.5, unit: '°' }
          ],
          statusNote: 'Hai phi kim góp chung cặp electron để cùng đạt lớp vỏ ngoài cùng bền vững giống khí hiếm.'
        };
      }

      // Mode 0: Bohr atomic model for Z = 1..20
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`+${z} ${el.sym}`, cx - 18, cy + 4);

      const shellNames = ['K', 'L', 'M', 'N'];
      shells.forEach((cnt, sIdx) => {
        const rad = 44 + sIdx * 28;
        ctx.strokeStyle = sIdx === shells.length - 1 ? '#38bdf8' : 'rgba(148,163,184,0.45)';
        ctx.lineWidth = sIdx === shells.length - 1 ? 2 : 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        const omega = anim ? (0.85 - sIdx * 0.16) * (sIdx % 2 === 0 ? 1 : -1) : 0;
        for (let i = 0; i < cnt; i++) {
          const ang = (i / cnt) * Math.PI * 2 + t * omega;
          const ex = cx + Math.cos(ang) * rad;
          const ey = cy + Math.sin(ang) * rad;
          ctx.fillStyle = sIdx === shells.length - 1 ? '#facc15' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(ex, ey, 4.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = muted;
        ctx.font = '10.5px monospace';
        ctx.fillText(`${shellNames[sIdx]}:${cnt}`, cx + rad + 4, cy - 4 - sIdx * 8);
      });

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        `Nguyên tử ${el.name} (${el.sym}) · Z = ${z} · Cấu hình vỏ: ${shells.join('-')}`,
        18,
        28
      );
      return {
        metrics: [
          { label: 'Nguyên tố', value: `${el.name} (${el.sym})` },
          { label: 'Cấu hình lớp e', value: shells.join(' - ') },
          { label: 'KLNT & Hóa trị', value: `${el.mass} amu · HT ${el.valence === 0 ? '0 (Khí hiếm)' : el.valence}` }
        ],
        statusNote: 'Số hạt proton (+p) bằng số electron (-e); các electron xếp thành từng lớp theo mức tối đa 2 – 8 – 8 – 2.'
      };
    }

    case 'acid_base_oxide_2d': {
      const ph = params.samplePh ?? 2.0;
      const ind = Math.round(params.indicatorType ?? 1);
      const addZn = (params.addZnRibbon ?? 0) >= 0.5;
      const isAcid = ph < 6.5;
      const isBase = ph > 7.5;

      // Top pH color scale 1..14
      const barX = w * 0.12;
      const barW = w * 0.76;
      const barY = 52;
      for (let i = 0; i < 14; i++) {
        const sw = barW / 14;
        ctx.fillStyle = phToRgb(i + 1);
        ctx.fillRect(barX + i * sw, barY, sw - 1, 18);
        ctx.fillStyle = fg;
        ctx.font = '10px monospace';
        ctx.fillText(String(i + 1), barX + i * sw + sw * 0.32, barY + 30);
      }
      const markerX = barX + ((ph - 1) / 13) * barW;
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(markerX, barY - 2);
      ctx.lineTo(markerX - 6, barY - 11);
      ctx.lineTo(markerX + 6, barY - 11);
      ctx.closePath();
      ctx.fill();

      // Solution beaker with Fresnel glass + volumetric scale + stand
      const bx = cx - 64;
      const by = cy - 28;
      const bw = 128;
      const bh = 124;

      let liqColor = isAcid ? 'rgba(56,189,248,0.28)' : isBase ? 'rgba(56,189,248,0.3)' : 'rgba(186,230,253,0.26)';
      if (ind === 2) {
        liqColor = ph >= 8.3 ? 'rgba(236,72,153,0.68)' : 'rgba(226,232,240,0.18)';
      } else if (ind === 3) {
        liqColor = ph < 4 ? 'rgba(239,68,68,0.58)' : ph < 6.5 ? 'rgba(192,132,252,0.5)' : ph < 8.5 ? 'rgba(99,102,241,0.5)' : ph < 11 ? 'rgba(16,185,129,0.55)' : 'rgba(234,179,8,0.62)';
      }

      drawStudioStandAndClamp(ctx, bx - 44, benchY, Math.max(150, benchY - by + 20), by + 10, bx, dark, 'GIÁ KẸP');
      drawStudioGlassVessel(ctx, bx, by, bw, bh, {
        fillFraction: 0.76,
        liquidColor: liqColor,
        liquidTopColor: 'rgba(224,242,254,0.65)',
        maxMl: 100,
        perfMode,
        dark
      });
      drawStudioThermometerProbe(ctx, bx + bw - 22, by - 18, 108, 25 + (addZn && ph < 6 ? 12 : 0), dark, 0, 80);

      // Litmus strip dipped in beaker if ind === 1
      let indResult = '';
      if (ind === 1) {
        const dryColor = '#a855f7';
        const wetColor = isAcid ? '#ef4444' : isBase ? '#2563eb' : '#9333ea';
        ctx.fillStyle = dryColor;
        ctx.fillRect(cx - 12, by - 26, 24, 54);
        ctx.fillStyle = wetColor;
        ctx.fillRect(cx - 12, by + 28, 24, 52);
        ctx.strokeStyle = dark ? '#e2e8f0' : '#0f172a';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 12, by - 26, 24, 106);
        indResult = isAcid ? 'Quỳ tím hóa ĐỎ' : isBase ? 'Quỳ tím hóa XANH' : 'Quỳ giữ nguyên TÍM';
      } else if (ind === 2) {
        indResult = ph >= 8.3 ? 'Phenolphthalein hóa HỒNG' : 'Phenolphthalein KHÔNG MÀU';
      } else {
        indResult = ph < 6.5 ? 'Bắp cải tím hóa ĐỎ/HỒNG' : ph > 7.5 ? 'Bắp cải tím hóa XANH/VÀNG' : 'Bắp cải tím màu TÍM';
      }

      // Zinc ribbon + H2 bubbles in acid
      let gasBubbling = false;
      if (addZn) {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 32, by + bh - 18, 64, 12);
        if (ph < 6.0) {
          gasBubbling = true;
          const rate = Math.max(4, Math.round((6.5 - ph) * 3.5));
          for (let i = 0; i < rate; i++) {
            const prog = (t * (0.9 + (6.5 - ph) * 0.25) + i / rate) % 1;
            const gx = cx - 24 + ((i * 19) % 48) + Math.sin(t * 7 + i) * 4;
            const gy = by + bh - 20 - prog * (bh - 50);
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.arc(gx, gy, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(indResult, cx + 88, cy + 16);
      if (gasBubbling) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Zn + 2HCl → ZnCl₂ + H₂↑ (Sủi bọt mạnh!)', cx + 88, cy + 40);
      }

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Thử pH = ${round(ph, 1)} · ${isAcid ? 'Môi trường Acid' : isBase ? 'Môi trường Base (Kiềm)' : 'Trung tính'}`, 18, 28);

      return {
        metrics: [
          { label: 'Giá trị pH', value: round(ph, 1) },
          { label: 'Môi trường', value: isAcid ? 'Acid (pH < 7)' : isBase ? 'Kiềm / Base (pH > 7)' : 'Trung tính (pH = 7)' },
          { label: 'Hiện tượng chỉ thị', value: indResult }
        ],
        statusNote: 'Dung dịch Acid (pH < 7) làm quỳ hóa đỏ và tác dụng kim loại (Mg, Zn, Fe) giải phóng khí H₂; Kiềm (pH > 7) làm quỳ hóa xanh.'
      };
    }

    case 'oxygen_combustion_2d': {
      const o2Pct = params.o2Concentration ?? 95;
      const fuelId = Math.max(1, Math.min(3, Math.round(params.fuelType ?? 1))); // 1:Tan dom/C, 2:Fe, 3:H2 + CuO
      const tempC = params.ignitionTemp ?? 550;
      const ignited = tempC >= 350 && o2Pct >= 14;
      const flamePower = ignited ? Math.min(1.6, 0.35 + (o2Pct / 100) * 1.1) : 0;

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      const titleTxt =
        fuelId === 1
          ? `Thử tàn đóm đỏ trong khí O₂ (${o2Pct}%)`
          : fuelId === 2
          ? `Đốt dây Sắt (Fe) tạo Oxit sắt từ Fe₃O₄`
          : `Đốt khí H₂ & Khử CuO đen → Cu đỏ`;
      ctx.fillText(titleTxt, 18, 28);

      // Gas Jar on left/center
      const jx = w * 0.32;
      const jy = cy + 8;
      drawStudioGlassVessel(ctx, jx - 62, jy - 82, 124, 152, {
        fillFraction: Math.min(0.88, 0.25 + (o2Pct / 100) * 0.55),
        liquidColor: `rgba(56, 189, 248, ${0.12 + (o2Pct / 100) * 0.2})`,
        liquidTopColor: 'rgba(186, 230, 253, 0.45)',
        maxMl: 250,
        perfMode,
        dark
      });

      // Glowing splint / iron wire / copper oxide boat inside jar
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(jx, jy - 105);
      ctx.lineTo(jx, jy + 18);
      ctx.stroke();

      if (ignited) {
        const pulse = 1 + Math.sin(t * 14) * 0.14;
        const rFlame = 18 * flamePower * pulse;
        ctx.fillStyle = fuelId === 3 ? 'rgba(56, 189, 248, 0.78)' : 'rgba(249, 115, 22, 0.85)';
        ctx.beginPath();
        ctx.ellipse(jx, jy + 22, rFlame * 0.7, rFlame * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(jx, jy + 24, rFlame * 0.45, 0, Math.PI * 2);
        ctx.fill();

        if (fuelId === 2) {
          // Bright sparks around burning iron wire
          for (let i = 0; i < 10; i++) {
            const ang = t * 5 + i * 0.62;
            const rad = 14 + ((t * 60 + i * 9) % 36);
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(jx + Math.cos(ang) * rad, jy + 22 + Math.sin(ang) * rad, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(jx, jy + 20, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Right info & reaction equation panel
      const rx = w * 0.56;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rx, cy - 82, w * 0.39, 160);
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      const eq =
        fuelId === 1
          ? 'C + O₂ —(t°)→ CO₂↑'
          : fuelId === 2
          ? '3Fe + 2O₂ —(t°)→ Fe₃O₄'
          : 'H₂ + CuO —(t°)→ Cu (đỏ) + H₂O';
      ctx.fillText(`Phương trình: ${eq}`, rx + 14, cy - 48);
      ctx.fillStyle = ignited ? '#10b981' : '#f43f5e';
      ctx.fillText(
        ignited ? (o2Pct > 60 ? 'BÙNG CHÁY MÃNH LIỆT!' : 'Cháy đều trong không khí') : 'Không đủ O₂ hoặc nhiệt độ (<350°C)',
        rx + 14,
        cy - 18
      );
      ctx.fillStyle = muted;
      ctx.font = '11.5px sans-serif';
      ctx.fillText(`Nồng độ O₂ trong bình: ${o2Pct}%`, rx + 14, cy + 16);
      ctx.fillText(`Nhiệt độ nguồn kích: ${tempC}°C`, rx + 14, cy + 40);

      return {
        metrics: [
          { label: 'Nồng độ O₂', value: o2Pct, unit: '%' },
          { label: 'Hiện tượng cháy', value: ignited ? (o2Pct > 60 ? 'Bùng sáng rực rỡ' : 'Cháy nhẹ') : 'Tắt dần' },
          { label: 'Sản phẩm phản ứng', value: fuelId === 1 ? 'CO₂ (Oxide)' : fuelId === 2 ? 'Fe₃O₄ (rắn)' : 'Cu + H₂O' }
        ],
        statusNote: 'Khí Oxygen (O₂) duy trì sự cháy và sự hô hấp; không khí chỉ chứa ~21% O₂ nên cháy chậm hơn nhiều so với O₂ tinh khiết.'
      };
    }

    case 'mass_conservation_2d': {
      const mReact1 = params.massReactantA ?? 20.8; // e.g. BaCl2 (g)
      const mReact2 = params.massReactantB ?? 14.2; // e.g. Na2SO4 (g)
      const closedFlask = (params.isClosedSystem ?? 1) >= 0.5;
      const reactionDone = (params.reactionProgress ?? 80) >= 40;
      const gasLoss = !closedFlask && reactionDone ? round(mReact2 * 0.25, 1) : 0;
      const totalBefore = round(mReact1 + mReact2, 1);
      const totalAfter = round(totalBefore - gasLoss, 1);

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        closedFlask ? 'Bình kín: Kiểm chứng Định luật Bảo toàn Khối lượng (Σm_đầu = Σm_sau)' : 'Bình hở: Khí thoát ra làm cân nhẹ đi',
        18,
        28
      );

      // Electronic balance pan + scale beam
      const bx = w * 0.36;
      const panY = cy + 68;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(bx - 95, panY + 12, 190, 44, 8);
      ctx.fill();
      ctx.fillStyle = '#0ea5e9';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${(reactionDone ? totalAfter : totalBefore).toFixed(1)} g`, bx, panY + 40);

      // Conical flask on scale
      ctx.fillStyle = reactionDone ? 'rgba(248, 250, 252, 0.72)' : 'rgba(56, 189, 248, 0.32)';
      ctx.beginPath();
      ctx.moveTo(bx - 16, panY - 90);
      ctx.lineTo(bx + 16, panY - 90);
      ctx.lineTo(bx + 54, panY + 4);
      ctx.lineTo(bx - 54, panY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      if (closedFlask) {
        // Rubber stopper sealing the flask
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(bx - 18, panY - 104, 36, 16);
      } else if (reactionDone) {
        // Gas bubbles escaping into air
        for (let i = 0; i < 6; i++) {
          const gy = panY - 102 - ((t * 50 + i * 16) % 58);
          const gx = bx + Math.sin(t * 4 + i) * 12;
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(gx, gy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Right comparison bar & atom count preservation
      ctx.textAlign = 'left';
      const rx = w * 0.6;
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Tổng khối lượng trước: ${totalBefore.toFixed(1)} g`, rx, cy - 36);
      ctx.fillStyle = gasLoss > 0 ? '#f59e0b' : '#10b981';
      ctx.fillText(`Số chỉ cân sau PƯ: ${totalAfter.toFixed(1)} g`, rx, cy - 10);
      ctx.fillStyle = muted;
      ctx.font = '11.5px sans-serif';
      ctx.fillText('Số nguyên tử mỗi nguyên tố được BẢO TOÀN', rx, cy + 24);
      ctx.fillText('Chỉ thay đổi liên kết giữa các nguyên tử!', rx, cy + 46);

      return {
        metrics: [
          { label: 'Tổng m chất tham gia', value: totalBefore, unit: 'g' },
          { label: 'Số chỉ cân sau PƯ', value: totalAfter, unit: 'g' },
          { label: 'Hệ phản ứng', value: closedFlask ? 'Hệ kín (Bảo toàn 100%)' : `Hệ hở (Bay ${gasLoss}g khí)` }
        ],
        statusNote: 'Trong mọi phản ứng hóa học, tổng khối lượng các chất sản phẩm luôn bằng tổng khối lượng các chất tham gia phản ứng (ĐLBTKL Lomonosov–Lavoisier).'
      };
    }

    case 'solution_solubility_2d': {
      const soluteG = params.soluteMassG ?? 36;
      const waterG = params.waterMassG ?? 100;
      const tempC = params.solutionTempC ?? 25;
      // Solubility S(g/100g nước) increases with temperature: e.g., KNO3/CuSO4 curve ~ 20 + 0.65 * T
      const solubilityS = round(20 + 0.65 * tempC, 1);
      const maxDissolvable = round((solubilityS * waterG) / 100, 1);
      const dissolvedG = Math.min(soluteG, maxDissolvable);
      const undissolvedG = round(Math.max(0, soluteG - maxDissolvable), 1);
      const concPct = round((dissolvedG / (waterG + dissolvedG)) * 100, 1);
      const stateTxt = undissolvedG > 0.2 ? 'Dung dịch BÃO HÒA (có kết tinh dư)' : soluteG > maxDissolvable * 0.9 ? 'Gần bão hòa' : 'Dung dịch CHƯA BÃO HÒA';

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Độ tan S(${tempC}°C) = ${solubilityS} g/100g H₂O · ${stateTxt}`, 18, 28);

      // Beaker with dissolved blue solution + thermometer + excess crystals
      const bx = w * 0.26;
      const by = cy - 55;
      const bw = 136;
      const bh = 130;
      const hueAlpha = Math.min(0.85, 0.22 + (concPct / 65) * 0.62);
      drawStudioGlassVessel(ctx, bx, by, bw, bh, {
        fillFraction: 0.78,
        liquidColor: `rgba(14, 165, 233, ${hueAlpha})`,
        liquidTopColor: 'rgba(186, 230, 253, 0.72)',
        maxMl: 100,
        perfMode,
        dark
      });
      drawStudioThermometerProbe(ctx, bx + bw - 22, by - 14, 114, tempC, dark, 0, 100);

      // Moving dissolved solute ions
      const ionN = Math.min(24, Math.round(dissolvedG / 3));
      for (let i = 0; i < ionN; i++) {
        const ix = bx + 16 + ((i * 29 + Math.sin(t * 2 + i) * 18 + 100) % (bw - 32));
        const iy = by + 40 + ((i * 23 + Math.cos(t * 2.4 + i) * 14 + 80) % (bh - 55));
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(ix, iy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Excess crystal mound at bottom if undissolved > 0
      if (undissolvedG > 0.2) {
        const moundH = Math.min(28, 6 + undissolvedG * 0.5);
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(bx + 20, by + bh - 3);
        ctx.lineTo(bx + bw / 2, by + bh - 3 - moundH);
        ctx.lineTo(bx + bw - 20, by + bh - 3);
        ctx.closePath();
        ctx.fill();
      }

      // Solubility vs Temperature Mini Graph on right
      const gx = w * 0.58;
      const gy = cy + 68;
      const gw = w * 0.36;
      const gh = 120;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(gx, gy - gh);
      ctx.lineTo(gx, gy);
      ctx.lineTo(gx + gw, gy);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let tt = 0; tt <= 100; tt += 10) {
        const sVal = 20 + 0.65 * tt;
        const px = gx + (tt / 100) * gw;
        const py = gy - (sVal / 100) * gh;
        if (tt === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const curX = gx + (tempC / 100) * gw;
      const curS = (soluteG / Math.max(1, waterG)) * 100;
      const curY = Math.max(gy - gh, gy - (curS / 100) * gh);
      ctx.fillStyle = undissolvedG > 0.2 ? '#f43f5e' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fg;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Đường Độ Tan S(t°C) · C% = ${concPct}%`, gx, gy - gh - 10);

      return {
        metrics: [
          { label: 'Độ tan cực đại S', value: `${solubilityS} g/100g H₂O` },
          { label: 'Nồng độ phần trăm C%', value: concPct, unit: '%' },
          { label: 'Chất rắn kết tinh dư', value: undissolvedG, unit: 'g' }
        ],
        statusNote: 'Đa số chất rắn tăng độ tan S khi nhiệt độ tăng; nâng nhiệt độ hoặc thêm nước sẽ hòa tan tiếp phần tinh thể chưa tan.'
      };
    }

    default:
      return {
        metrics: [{ label: 'Sim ID', value: simType }],
        statusNote: 'Chế độ mô phỏng Hóa học 2D sẵn sàng.'
      };
  }
}
