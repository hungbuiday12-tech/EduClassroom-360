import { BiologySimType } from '../../types';
import { PerformanceMode } from '../../context/BackgroundContext';
import { BioSimTelemetry } from './biology2DEngine';
import {
  drawStudioGlassVessel,
  drawStudioThermometerProbe,
  getStudioBenchY
} from '../common/studio2DCanvasKit';

function round(v: number, d = 2): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function renderMiddleSchool2DBioSim(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  simType: BiologySimType,
  params: Record<string, number>,
  t: number,
  dark: boolean,
  perfMode: PerformanceMode
): BioSimTelemetry {
  const benchY = getStudioBenchY(h, h < 310);
  const fg = dark ? '#e2e8f0' : '#0f172a';
  const muted = dark ? '#94a3b8' : '#64748b';
  const cx = w * 0.5;
  const cy = Math.min(h * 0.52, benchY - 125);

  switch (simType) {
    case 'microscope_cell_compare_2d': {
      const cellMode = Math.max(1, Math.min(3, Math.round(params.cellMode ?? 2)));
      const objX = params.objectiveX ?? 40;
      const focus = params.focusOffset ?? 0;
      const totalMag = 10 * objX;
      const blur = Math.abs(focus);

      // Left: Optical Microscope schematic seated flush on benchY
      const mx = w * 0.22;
      const baseY = benchY - 2;
      const baseGrad = ctx.createLinearGradient(mx - 48, baseY - 14, mx + 48, baseY);
      baseGrad.addColorStop(0, '#1e293b');
      baseGrad.addColorStop(0.5, '#475569');
      baseGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = baseGrad;
      ctx.beginPath();
      ctx.roundRect(mx - 48, baseY - 14, 96, 14, [4, 4, 1, 1]);
      ctx.fill();

      // Brushed metallic arm
      ctx.strokeStyle = dark ? '#94a3b8' : '#475569';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(mx - 22, baseY - 14);
      ctx.quadraticCurveTo(mx - 44, cy, mx - 8, cy - 82);
      ctx.stroke();

      // Eyepiece & brushed body tube
      const tubeGrad = ctx.createLinearGradient(mx - 14, 0, mx + 14, 0);
      tubeGrad.addColorStop(0, '#1e293b');
      tubeGrad.addColorStop(0.35, '#64748b');
      tubeGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = tubeGrad;
      ctx.fillRect(mx - 14, cy - 118, 28, 44);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(mx - 11, cy - 124, 22, 7);

      // Objective nosepiece highlighting active lens
      const activeIdx = objX <= 10 ? 0 : objX <= 40 ? 1 : 2;
      [-14, 0, 14].forEach((ox, idx) => {
        ctx.fillStyle = idx === activeIdx ? '#10b981' : '#64748b';
        ctx.fillRect(mx + ox - 4, cy - 72, 8, idx === activeIdx ? 26 : 18);
      });

      // Mechanical stage + glass slide + illuminated condenser cone
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(mx - 40, cy - 22 - focus * 2, 80, 8);
      ctx.fillStyle = 'rgba(56,189,248,0.72)';
      ctx.fillRect(mx - 22, cy - 26 - focus * 2, 44, 4);
      const beamAlpha = perfMode === 'ultra' ? 0.34 : perfMode === 'balanced' ? 0.24 : 0.16;
      const condGrad = ctx.createLinearGradient(mx, baseY - 22, mx, cy - 24);
      condGrad.addColorStop(0, `rgba(250, 204, 21, ${beamAlpha * 1.2})`);
      condGrad.addColorStop(1, `rgba(56, 189, 248, ${beamAlpha * 0.45})`);
      ctx.fillStyle = condGrad;
      ctx.beginPath();
      ctx.moveTo(mx - 14, baseY - 22);
      ctx.lineTo(mx + 14, baseY - 22);
      ctx.lineTo(mx + 6, cy - 24);
      ctx.lineTo(mx - 6, cy - 24);
      ctx.closePath();
      ctx.fill();

      // Fine focus knob indicator
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(mx - 34, baseY - 56, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`10× × ${objX}× = ${totalMag}×`, mx - 46, cy - 134);

      // Right: Circular eyepiece FOV showing cell structure
      const vx = w * 0.66;
      const vy = cy + 6;
      const vRad = Math.min(w * 0.24, (benchY - 36) * 0.38);

      ctx.save();
      ctx.beginPath();
      ctx.arc(vx, vy, vRad, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = dark ? '#082f49' : '#ecfeff';
      ctx.fillRect(vx - vRad, vy - vRad, vRad * 2, vRad * 2);

      const scaleBoost = (0.68 + (objX / 100) * 0.42);
      const passes = blur === 0 ? [0] : [-blur * 1.4, 0, blur * 1.4];
      passes.forEach((offset) => {
        ctx.save();
        ctx.translate(vx + offset, vy + offset * 0.5);
        ctx.scale(scaleBoost, scaleBoost);
        ctx.globalAlpha = blur === 0 ? 1 : 0.42;

        if (cellMode === 1) {
          // Prokaryotic Bacterium: capsule, cell wall, nucleoid tangle, flagellum
          ctx.strokeStyle = '#fb923c';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(64, 0);
          for (let i = 0; i <= 18; i++) {
            ctx.lineTo(64 + i * 5, Math.sin(t * 6 + i * 0.6) * 14);
          }
          ctx.stroke();

          ctx.fillStyle = '#fde68a';
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.roundRect(-64, -34, 128, 68, 34);
          ctx.fill();
          ctx.stroke();

          // Nucleoid DNA loop (no nuclear membrane)
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 4; a += 0.35) {
            const rx = Math.cos(a * 1.3) * 26;
            const ry = Math.sin(a * 2.1) * 14;
            if (a === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.stroke();
        } else if (cellMode === 2) {
          // Plant cell: hexagonal cellulose wall, chloroplasts, central vacuole, nucleus
          ctx.fillStyle = '#bbf7d0';
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 6;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3 + Math.PI / 6;
            const px = Math.cos(a) * 86;
            const py = Math.sin(a) * 74;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Large central vacuole
          ctx.fillStyle = 'rgba(56,189,248,0.45)';
          ctx.beginPath();
          ctx.ellipse(12, 6, 36, 26, 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Nucleus
          ctx.fillStyle = '#6366f1';
          ctx.beginPath();
          ctx.arc(-34, -14, 18, 0, Math.PI * 2);
          ctx.fill();

          // Chloroplasts
          [[-32, 26], [36, -28], [40, 32], [-4, -40]].forEach(([gx, gy]) => {
            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.ellipse(gx, gy, 11, 6, 0.4, 0, Math.PI * 2);
            ctx.fill();
          });
        } else {
          // Animal cell: flexible membrane, central nucleus, mitochondria, NO cell wall/chloroplast
          ctx.fillStyle = '#fbcfe8';
          ctx.strokeStyle = '#db2777';
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = 0; i <= 32; i++) {
            const a = (i / 32) * Math.PI * 2;
            const r = 74 + Math.sin(a * 5 + t * 1.2) * 4;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r * 0.86;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#7c3aed';
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();

          // Mitochondria
          [[-40, -24], [38, 22], [-28, 36]].forEach(([mx0, my0]) => {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.ellipse(mx0, my0, 12, 6, -0.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        ctx.restore();
      });
      ctx.restore();

      ctx.strokeStyle = fg;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(vx, vy, vRad, 0, Math.PI * 2);
      ctx.stroke();

      const names = ['Vi khuẩn (Tế bào Nhân sơ)', 'Tế bào Thực vật (Có thành & lục lạp)', 'Tế bào Động vật (Không có thành)'];
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${names[cellMode - 1]} · Độ phóng đại ${totalMag}×`, 18, 28);

      return {
        metrics: [
          { label: 'Loại tế bào', value: cellMode === 1 ? 'Nhân sơ (Chưa có màng nhân)' : cellMode === 2 ? 'Nhân thực (Thực vật)' : 'Nhân thực (Động vật)' },
          { label: 'Độ phóng đại', value: totalMag, unit: '×' },
          { label: 'Độ nét mẫu vật', value: blur === 0 ? 'Rõ nét chuẩn' : `Mờ lệch ${blur} vạch` }
        ],
        statusNote:
          cellMode === 1
            ? 'Tế bào nhân sơ chưa có màng nhân (chỉ có vùng nhân) và chưa có các bào quan có màng.'
            : cellMode === 2
            ? 'Tế bào thực vật có thành xenlulozơ vuông vắn, không bào trung tâm lớn và lục lạp màu xanh lục.'
            : 'Tế bào động vật có màng sinh chất mềm dẻo, nhân thật hoàn chỉnh nhưng không có thành tế bào và lục lạp.'
      };
    }

    case 'plant_organs_flowering_2d': {
      const stage = Math.max(1, Math.min(3, Math.round(params.stageId ?? 1)));
      const water = params.waterLevel ?? 70;
      const poll = (params.pollinationPct ?? 65) / 100;

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      const titles = [
        '1. Cơ quan Sinh dưỡng: Rễ hút nước – Thân vận chuyển mạch gỗ/rây – Lá thoát hơi nước',
        '2. Cơ quan Sinh sản: Hoa lưỡng tính thụ phấn & Ống phấn thụ tinh noãn',
        '3. Hình thành Quả – Hạt & Điều kiện Hạt nảy mầm'
      ];
      ctx.fillText(titles[stage - 1], 18, 28);

      if (stage === 1) {
        // Soil, Root hairs, Stem with xylem/phloem, Leaf
        const soilY = cy + 48;
        ctx.fillStyle = dark ? 'rgba(120,53,15,0.45)' : 'rgba(180,83,9,0.22)';
        ctx.fillRect(40, soilY, w - 80, h - soilY - 24);
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, soilY);
        ctx.lineTo(w - 40, soilY);
        ctx.stroke();

        // Stem + roots
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(cx - 14, cy - 95, 28, soilY - (cy - 95));
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx, soilY);
        ctx.lineTo(cx, soilY + 75);
        ctx.moveTo(cx, soilY + 25);
        ctx.lineTo(cx - 52, soilY + 62);
        ctx.moveTo(cx, soilY + 35);
        ctx.lineTo(cx + 52, soilY + 68);
        ctx.stroke();

        // Leaves
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(cx - 64, cy - 42, 48, 20, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 64, cy - 58, 48, 20, 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Animated water molecules going up Xylem
        const rate = 0.5 + (water / 100) * 1.4;
        for (let i = 0; i < 5; i++) {
          const wy = soilY + 50 - ((t * 70 * rate + i * 36) % 180);
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(cx - 5, wy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        // Sugar flowing down Phloem
        for (let i = 0; i < 4; i++) {
          const sy = cy - 65 + ((t * 50 + i * 32) % 130);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(cx + 6, sy, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        ctx.fillText('Mạch gỗ (Xylem): Nước + muối khoáng ↑', cx + 100, cy - 10);
        ctx.fillText('Mạch rây (Phloem): Chất hữu cơ từ lá ↓', cx + 100, cy + 14);
        ctx.fillText('Lông hút rễ hấp thụ nước & ion khoáng', cx + 80, soilY + 42);

        return {
          metrics: [
            { label: 'Độ ẩm đất', value: water, unit: '%' },
            { label: 'Mạch đi lên', value: 'Mạch gỗ (Nước + Khoáng)' },
            { label: 'Mạch đi xuống', value: 'Mạch rây (Đường hữu cơ)' }
          ],
          statusNote: 'Lông hút ở rễ hút nước; mạch gỗ đưa nước lên lá thoát hơi nước, mạch rây vận chuyển chất hữu cơ nuôi cây.'
        };
      }

      if (stage === 2) {
        // Bisexual Flower cross-section + pollen tube
        // Petals
        ctx.fillStyle = 'rgba(244,114,182,0.55)';
        ctx.beginPath();
        ctx.ellipse(cx - 72, cy - 12, 48, 28, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 72, cy - 12, 48, 28, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Sepals
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.ellipse(cx - 46, cy + 56, 36, 12, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 46, cy + 56, 36, 12, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Pistil (Ovary + Style + Stigma)
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(cx, cy + 36, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 8, cy - 58, 16, 75);
        ctx.beginPath();
        ctx.ellipse(cx, cy - 62, 22, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ovule inside ovary
        ctx.fillStyle = poll > 0.75 ? '#f59e0b' : '#fef08a';
        ctx.beginPath();
        ctx.arc(cx, cy + 38, 12, 0, Math.PI * 2);
        ctx.fill();

        // Stamens (filaments + yellow anthers)
        [-52, 52].forEach((sx) => {
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx + sx * 0.45, cy + 38);
          ctx.lineTo(cx + sx, cy - 42);
          ctx.stroke();
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.ellipse(cx + sx, cy - 46, 12, 7, 0.3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Pollen grain + pollen tube growing down to ovule
        const pProg = Math.min(1, poll);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx, cy - 66, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 62);
        ctx.lineTo(cx, cy - 62 + pProg * 96);
        ctx.stroke();

        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        ctx.fillText('Nhị (Bao phấn tạo hạt phấn)', cx + 78, cy - 48);
        ctx.fillText('Đầu nhụy nhận hạt phấn', cx + 36, cy - 72);
        ctx.fillText(pProg >= 0.85 ? 'Thụ tinh hoàn tất trong Noãn!' : 'Ống phấn đang mọc xuống bầu nhụy...', cx + 45, cy + 42);

        return {
          metrics: [
            { label: 'Tiến trình thụ phấn', value: Math.round(poll * 100), unit: '%' },
            { label: 'Kết quả sau thụ tinh', value: poll >= 0.8 ? 'Bầu → Quả · Noãn → Hạt' : 'Đang mọc ống phấn' },
            { label: 'Loại hoa', value: 'Hoa lưỡng tính (Đủ nhị & nhụy)' }
          ],
          statusNote: 'Thụ phấn là hạt phấn rơi lên đầu nhụy; Thụ tinh là tế bào sinh dục đực kết hợp với noãn trong bầu nhụy.'
        };
      }

      // Stage 3: Fruit & Seed Germination
      const canSprout = water >= 50 && poll >= 0.6;
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(w * 0.33, cy + 8, 56, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(w * 0.33, cy + 8, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(w * 0.33, cy + 8, 12, 18, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Quả thịt (từ Bầu nhụy)', w * 0.33 - 64, cy + 86);

      // Germinating seed on right
      const gx = w * 0.68;
      const gy = cy + 28;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(gx, gy, 24, 15, -0.2, 0, Math.PI * 2);
      ctx.fill();

      if (canSprout) {
        const len = 24 + (water / 100) * 34;
        // Stem shoot up
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(gx, gy - 8);
        ctx.quadraticCurveTo(gx + 10, gy - len * 0.6, gx, gy - len);
        ctx.stroke();
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.ellipse(gx - 12, gy - len, 14, 7, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(gx + 12, gy - len, 14, 7, 0.4, 0, Math.PI * 2);
        ctx.fill();
        // Root radicle down
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(gx, gy + 10);
        ctx.lineTo(gx - 6, gy + 48);
        ctx.stroke();
      }
      ctx.fillStyle = fg;
      ctx.fillText(canSprout ? 'Đủ Nước + O₂ + Ấm → Nảy mầm!' : 'Thiếu độ ẩm (<50%) → Hạt ngủ nghỉ', gx - 95, cy + 92);

      return {
        metrics: [
          { label: 'Độ ẩm nảy mầm', value: water, unit: '%' },
          { label: 'Trạng thái hạt', value: canSprout ? 'Đang nảy mầm thành cây non' : 'Chưa đủ nước để nảy mầm' },
          { label: 'Nguồn gốc', value: 'Hạt phát triển từ Noãn' }
        ],
        statusNote: 'Điều kiện cần cho hạt nảy mầm là đủ nước, đủ không khí (Oxygen) và nhiệt độ thích hợp (hạt chất lượng tốt).'
      };
    }

    case 'vertebrate_taxonomy_2d': {
      const cls = Math.max(1, Math.min(4, Math.round(params.animalClass ?? 2)));
      const view = Math.round(params.viewMode ?? 1);
      const demand = params.oxygenDemand ?? 60;

      if (view === 2) {
        // 5-Kingdom classification & Dichotomous key
        ctx.fillStyle = fg;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Hệ thống 5 Giới Sinh vật (Whittaker) & Khóa Lưỡng phân', 18, 28);

        const kingdoms = [
          { name: 'Khởi sinh', sub: 'Vi khuẩn (Nhân sơ)', col: '#f59e0b', x: w * 0.14 },
          { name: 'Nguyên sinh', sub: 'Trùng roi, Tảo đơn bào', col: '#38bdf8', x: w * 0.32 },
          { name: 'Nấm', sub: 'Dị dưỡng hoại sinh', col: '#a855f7', x: w * 0.5 },
          { name: 'Thực vật', sub: 'Tự dưỡng quang hợp', col: '#22c55e', x: w * 0.68 },
          { name: 'Động vật', sub: 'Di chuyển · Dị dưỡng', col: '#ef4444', x: w * 0.86 }
        ];
        kingdoms.forEach((k, idx) => {
          const yBox = cy - 42;
          ctx.fillStyle = k.col;
          ctx.beginPath();
          ctx.roundRect(k.x - 54, yBox, 108, 52, 10);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(k.name, k.x - 36, yBox + 22);
          ctx.font = '10px sans-serif';
          ctx.fillText(k.sub, k.x - 46, yBox + 38);
          if (idx === 4) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.strokeRect(k.x - 56, yBox - 2, 112, 56);
          }
        });

        // Dichotomous key branch under Animalia
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Khóa Lưỡng phân: Chia nhóm bằng 1 cặp đặc điểm đối lập (Có / Không)', 28, cy + 56);
        ctx.fillStyle = muted;
        ctx.font = '12px sans-serif';
        ctx.fillText('1a. Không có xương sống → Ruột khoang, Giun, Thân mềm, Chân khớp', 36, cy + 82);
        ctx.fillText('1b. Có xương sống → Cá (vảy, mang) → Lưỡng cư → Bò sát → Chim (lông vũ) → Thú (lông mao, đẻ con)', 36, cy + 106);

        return {
          metrics: [
            { label: 'Hệ thống phân loại', value: '5 Giới Sinh vật' },
            { label: 'Nguyên tắc khóa lưỡng phân', value: 'Chia đôi theo cặp đối lập' },
            { label: 'Bậc phân loại nhỏ → lớn', value: 'Loài → Chi → Họ → Bộ → Lớp → Ngành → Giới' }
          ],
          statusNote: 'Khóa lưỡng phân phân chia liên tiếp một nhóm sinh vật thành hai nhánh dựa vào sự có/không một đặc điểm nổi bật.'
        };
      }

      // View 1: Vertebrate Hearts comparison (2 -> 3 -> 4 chambers)
      const beat = 1 + Math.sin(t * (3 + demand / 22)) * 0.06;
      const stages = [
        { id: 1, title: 'Cá (2 ngăn)', sub: '1 Nhĩ + 1 Thất', x: w * 0.16, col: '#38bdf8' },
        { id: 2, title: 'Ếch (3 ngăn)', sub: '2 Nhĩ + 1 Thất (Máu pha)', x: w * 0.39, col: '#a855f7' },
        { id: 3, title: 'Bò sát (3 ngăn vách hụt)', sub: 'Máu ít pha hơn', x: w * 0.62, col: '#f59e0b' },
        { id: 4, title: 'Chim & Thú (4 ngăn)', sub: '2 Nhĩ + 2 Thất (Hằng nhiệt)', x: w * 0.85, col: '#ef4444' }
      ];

      stages.forEach((st) => {
        const isSel = st.id === cls;
        const sc = isSel ? beat * 1.12 : 0.9;
        ctx.save();
        ctx.translate(st.x, cy - 8);
        ctx.scale(sc, sc);

        if (isSel) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.strokeRect(-58, -66, 116, 132);
        }

        // Draw chambers schematically
        if (st.id === 1) {
          // 2 chambers
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(-34, -46, 68, 40);
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(-34, -4, 68, 48);
        } else if (st.id === 2 || st.id === 3) {
          // 2 atria + 1 shared ventricle (purple mixed blood)
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-38, -48, 36, 38);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(2, -48, 36, 38);
          ctx.fillStyle = st.id === 2 ? '#9333ea' : '#be185d';
          ctx.fillRect(-38, -8, 76, 52);
          if (st.id === 3) {
            // Partial septum
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-2, 16, 4, 28);
          }
        } else {
          // 4 chambers fully separated
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-38, -48, 36, 38);
          ctx.fillRect(-38, -8, 36, 52);
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(2, -48, 36, 38);
          ctx.fillRect(2, -8, 36, 52);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-2, -48, 4, 92);
        }

        ctx.restore();
        ctx.fillStyle = fg;
        ctx.font = 'bold 11.5px sans-serif';
        ctx.fillText(st.title, st.x - 46, cy + 78);
        ctx.fillStyle = muted;
        ctx.font = '10px sans-serif';
        ctx.fillText(st.sub, st.x - 54, cy + 94);
      });

      const active = stages[cls - 1];
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`Tiến hóa Tim Động vật có xương sống · Đang chọn: ${active.title}`, 18, 28);

      return {
        metrics: [
          { label: 'Lớp động vật', value: active.title },
          { label: 'Cấu tạo tim', value: active.sub },
          { label: 'Thân nhiệt', value: cls === 4 ? 'Hằng nhiệt (Ổn định)' : 'Biến nhiệt (Theo môi trường)' }
        ],
        statusNote: 'Từ Cá (2 ngăn) → Lưỡng cư (3 ngăn) → Chim & Thú (4 ngăn hoàn chỉnh) giúp máu giàu O₂ không pha trộn.'
      };
    }

    case 'kingdoms_invertebrates_2d': {
      const groupId = Math.max(1, Math.min(4, Math.round(params.invertebrateGroup ?? 4)));
      const viewMode = Math.round(params.viewMode ?? 1);
      const envMoisture = params.envMoisture ?? 75;

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(
        viewMode === 2
          ? 'Hệ thống 5 Giới Sinh vật (Whittaker) & Khóa Lưỡng phân Thực hành'
          : 'Đa dạng Động vật Không xương sống (Ruột khoang → Giun → Thân mềm → Chân khớp)',
        18,
        28
      );

      if (viewMode === 2) {
        const kingdoms = [
          { name: '1. Khởi sinh', sub: 'Vi khuẩn (Nhân sơ)', col: '#f59e0b', x: w * 0.13 },
          { name: '2. Nguyên sinh', sub: 'Trùng roi, Trùng giày, Tảo', col: '#38bdf8', x: w * 0.31 },
          { name: '3. Nấm', sub: 'Nấm men, Nấm rơm (Dị dưỡng)', col: '#a855f7', x: w * 0.5 },
          { name: '4. Thực vật', sub: 'Rêu, Dương xỉ, Hạt trần/kín', col: '#22c55e', x: w * 0.69 },
          { name: '5. Động vật', sub: 'Không XS & Có xương sống', col: '#ef4444', x: w * 0.87 }
        ];
        kingdoms.forEach((k, idx) => {
          const yBox = cy - 58;
          ctx.fillStyle = k.col;
          ctx.beginPath();
          ctx.roundRect(k.x - 56, yBox, 112, 54, 10);
          ctx.fill();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11.5px sans-serif';
          ctx.fillText(k.name, k.x - 46, yBox + 21);
          ctx.font = '10px sans-serif';
          ctx.fillText(k.sub, k.x - 50, yBox + 38);
          if (idx === groupId || (groupId === 4 && idx === 4)) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 3;
            ctx.strokeRect(k.x - 58, yBox - 2, 116, 58);
          }
        });

        // Dichotomous key tree
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Khóa Lưỡng phân (Dichotomous Key) phân loại 4 ngành Không xương sống:', 24, cy + 28);
        ctx.font = '11.5px sans-serif';
        ctx.fillStyle = groupId === 1 ? '#38bdf8' : muted;
        ctx.fillText('• Bước 1a: Cơ thể đối xứng tỏa tròn, có tế bào gai (Thủy tức, Sứa, San hô) → Ngành Ruột khoang', 32, cy + 54);
        ctx.fillStyle = groupId === 2 ? '#f472b6' : muted;
        ctx.fillText('• Bước 2a: Cơ thể đối xứng hai bên, phân đốt mềm không vỏ đá vôi (Giun đất, Đỉa) → Ngành Giun', 32, cy + 78);
        ctx.fillStyle = groupId === 3 ? '#f59e0b' : muted;
        ctx.fillText('• Bước 3a: Thân mềm không phân đốt, có áo tiết vỏ đá vôi (Trai sông, Ốc sên, Mực) → Thân mềm', 32, cy + 102);
        ctx.fillStyle = groupId === 4 ? '#10b981' : muted;
        ctx.fillText('• Bước 3b: Có bộ xương ngoài bằng kitin và các chân phân đốt (Tôm, Nhện, Châu chấu) → Chân khớp', 32, cy + 126);

        return {
          metrics: [
            { label: 'Hệ thống phân loại', value: '5 Giới Sinh vật (Whittaker)' },
            { label: 'Thứ tự bậc phân loại', value: 'Loài → Chi → Họ → Bộ → Lớp → Ngành → Giới' },
            { label: 'Quy tắc tên khoa học', value: 'Tên Chi (viết hoa) + Tên loài (in nghiêng)' }
          ],
          statusNote: 'Khóa lưỡng phân luôn chia một tập hợp sinh vật thành 2 nhánh đối lập dựa trên 1 đặc điểm hình thái dễ quan sát.'
        };
      }

      const phyla = [
        { id: 1, title: '1. Ruột khoang', sub: 'Thủy tức, Sứa · Tỏa tròn', x: w * 0.16, col: '#38bdf8' },
        { id: 2, title: '2. Giun (Đốt/Dẹp/Tròn)', sub: 'Giun đất · Hô hấp qua da', x: w * 0.39, col: '#f472b6' },
        { id: 3, title: '3. Thân mềm', sub: 'Trai, Ốc, Mực · Vỏ đá vôi', x: w * 0.62, col: '#f59e0b' },
        { id: 4, title: '4. Chân khớp', sub: 'Tôm, Châu chấu · Vỏ kitin', x: w * 0.85, col: '#10b981' }
      ];

      phyla.forEach((p) => {
        const isSel = p.id === groupId;
        const sc = isSel ? 1.12 : 0.9;
        ctx.save();
        ctx.translate(p.x, cy - 10);
        ctx.scale(sc, sc);
        if (isSel) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.strokeRect(-62, -66, 124, 128);
        }

        if (p.id === 1) {
          // Hydra with swaying tentacles
          ctx.fillStyle = '#0ea5e9';
          ctx.beginPath();
          ctx.roundRect(-14, -18, 28, 64, 10);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3.5;
          for (let i = -2; i <= 2; i++) {
            const sway = Math.sin(t * 3 + i) * 8;
            ctx.beginPath();
            ctx.moveTo(i * 4, -18);
            ctx.quadraticCurveTo(i * 14 + sway, -44, i * 18 + sway, -56);
            ctx.stroke();
          }
        } else if (p.id === 2) {
          // Segmented earthworm with clitellum
          for (let s = 0; s < 8; s++) {
            const sx = -42 + s * 12;
            const sy = Math.sin(t * 4 + s * 0.7) * 5;
            ctx.fillStyle = s === 3 || s === 4 ? '#fda4af' : '#ec4899';
            ctx.beginPath();
            ctx.arc(sx, sy, s === 3 || s === 4 ? 13 : 10, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.id === 3) {
          // Spiral mollusk shell + soft muscular foot
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.ellipse(0, 22, 42, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(-4, -8, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef3c7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(-4, -8, 16, 0, Math.PI * 1.6);
          ctx.stroke();
        } else {
          // Arthropod grasshopper/shrimp with jointed legs & exoskeleton
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.ellipse(-26, -6, 16, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, -4, 20, 14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(28, 0, 22, 10, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 3;
          [-18, 0, 14].forEach((lx, idx) => {
            const kick = idx === 2 ? Math.sin(t * 4) * 5 : 0;
            ctx.beginPath();
            ctx.moveTo(lx, 6);
            ctx.lineTo(lx - 8, 28 + kick);
            ctx.lineTo(lx + 8, 42);
            ctx.stroke();
          });
        }
        ctx.restore();

        ctx.fillStyle = fg;
        ctx.font = 'bold 11.5px sans-serif';
        ctx.fillText(p.title, p.x - 52, cy + 76);
        ctx.fillStyle = muted;
        ctx.font = '10px sans-serif';
        ctx.fillText(p.sub, p.x - 56, cy + 93);
      });

      const active = phyla[groupId - 1];
      return {
        metrics: [
          { label: 'Ngành đang chọn', value: active.title },
          { label: 'Đặc trưng cơ bản', value: active.sub },
          { label: 'Độ ẩm môi trường', value: envMoisture, unit: '%' }
        ],
        statusNote:
          groupId === 1
            ? 'Ruột khoang có đối xứng tỏa tròn, tế bào gai tự vệ (Thủy tức, Sứa, Hải quỳ, San hô).'
            : groupId === 2
            ? 'Giun đất có cơ thể phân đốt, di chuyển bằng hệ cơ thành cơ thể và vòng tơ, giúp làm tơi xốp đất.'
            : groupId === 3
            ? 'Thân mềm có thân không phân đốt, khoang áo và thường có vỏ đá vôi bảo vệ (Trai, Ốc, Mực).'
            : 'Chân khớp chiếm ~80% số loài động vật nhờ bộ xương ngoài kitin và các phần phụ phân đốt linh hoạt.'
      };
    }

    case 'human_skeleton_senses_2d': {
      const mode = Math.max(1, Math.min(3, Math.round(params.organMode ?? 1)));
      const intensity = params.stimulusLevel ?? 65;
      const lensBias = params.lensCorrection ?? 0;

      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      const titles = [
        '1. Hệ Vận Động: Đòn bẩy Xương – Khớp – Cơ Nhị Đầu / Tam Đầu Đối Kháng',
        '2. Cơ Quan Thị Giác: Điều Tiết Thủy Tinh Thể, Cận Thị & Viễn Thị',
        '3. Cơ Quan Thính Giác & Cung Phản Xạ: Màng Nhĩ → Xương Con → Ốc Tai'
      ];
      ctx.fillText(titles[mode - 1], 18, 28);

      if (mode === 1) {
        // Upper arm + rotating forearm lever
        const sx = cx - 95;
        const sy = cy - 46;
        const ex = sx;
        const ey = cy + 44;
        const flexAng = 0.25 + (intensity / 100) * 1.35; // radians upward from horizontal
        const len = 140;
        const hx = ex + Math.cos(-flexAng) * len;
        const hy = ey + Math.sin(-flexAng) * len;

        // Humerus bone
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Forearm radius/ulna bone
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        // Joint capsule
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, ey, 11, 0, Math.PI * 2);
        ctx.fill();

        // Biceps muscle belly (thickens when flexing!)
        const bicepsThick = 14 + (intensity / 100) * 15;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(sx + 16, (sy + ey) / 2, bicepsThick, 38, 0, 0, Math.PI * 2);
        ctx.fill();
        // Triceps muscle (relaxes when flexing)
        const tricepsThick = 24 - (intensity / 100) * 10;
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.ellipse(sx - 16, (sy + ey) / 2, tricepsThick, 38, 0, 0, Math.PI * 2);
        ctx.fill();

        // Load weight in hand
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(hx, hy, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        ctx.fillText(`Cơ nhị đầu: ${intensity >= 50 ? 'CO rút ngắn' : 'Giãn'}`, sx + 48, cy - 22);
        ctx.fillText(`Cơ tam đầu: ${intensity >= 50 ? 'GIÃN đối kháng' : 'Co duỗi tay'}`, sx + 48, cy + 2);
        ctx.fillText('Khớp khuỷu là khớp động (sụn trơn + dịch khớp)', sx + 48, cy + 64);

        return {
          metrics: [
            { label: 'Lực co cơ nhị đầu', value: intensity, unit: '%' },
            { label: 'Góc gấp khuỷu tay', value: round((flexAng * 180) / Math.PI, 0), unit: '°' },
            { label: 'Loại đòn bẩy sinh học', value: 'Đòn bẩy loại 3 (Linh hoạt tốc độ)' }
          ],
          statusNote: 'Cơ nhị đầu co thì cơ tam đầu giãn (cặp cơ đối kháng) kéo xương cẳng tay quay quanh điểm tựa khớp khuỷu.'
        };
      }

      if (mode === 2) {
        // Eyeball cross-section + incoming parallel rays + corrective lens
        const ex = cx + 45;
        const ey = cy + 4;
        const eyeR = 72;

        // Eyeball outer sclera + retina back arc
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(ex, ey, eyeR - 4, -Math.PI * 0.38, Math.PI * 0.38);
        ctx.stroke();

        // Crystalline lens inside front of eye
        const lx = ex - 44;
        ctx.fillStyle = 'rgba(56,189,248,0.6)';
        ctx.beginPath();
        ctx.ellipse(lx, ey, 11, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Optional glasses lens at cx - 105
        const gx = ex - 110;
        if (Math.abs(lensBias) >= 1) {
          ctx.strokeStyle = lensBias < 0 ? '#38bdf8' : '#10b981';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(gx, ey - 38);
          ctx.quadraticCurveTo(gx + (lensBias < 0 ? 10 : -12), ey, gx, ey + 38);
          ctx.stroke();
        }

        // Focal point calculation: stimulusLevel acts as refraction error (50 = normal, >60 = myopia in front of retina, <40 = hyperopia behind)
        const baseError = (intensity - 50) * 1.1; // + means focus too short (myopia)
        const netError = baseError + lensBias * 14;
        const focusX = ex + eyeR - 4 - netError;

        // Light rays
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2.2;
        [-24, 24].forEach((ry) => {
          ctx.beginPath();
          ctx.moveTo(cx - 210, ey + ry);
          ctx.lineTo(lx, ey + ry);
          ctx.lineTo(focusX, ey);
          ctx.stroke();
        });

        ctx.fillStyle = Math.abs(netError) <= 8 ? '#22c55e' : '#ef4444';
        ctx.beginPath();
        ctx.arc(focusX, ey, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fg;
        ctx.font = '12px sans-serif';
        const defectText =
          Math.abs(netError) <= 8
            ? 'Ảnh hội tụ ĐÚNG trên Võng mạc (Điểm vàng) → Nhìn rõ!'
            : netError > 8
            ? 'CẬN THỊ: Ảnh hội tụ TRƯỚC võng mạc (Cần kính phân kì -)'
            : 'VIỄN THỊ: Ảnh hội tụ SAU võng mạc (Cần kính hội tụ +)';
        ctx.fillText(defectText, 24, h - 28);

        return {
          metrics: [
            { label: 'Trạng thái khúc xạ', value: Math.abs(netError) <= 8 ? 'Chuẩn (Chính thị)' : netError > 8 ? 'Cận thị' : 'Viễn thị' },
            { label: 'Kính điều chỉnh', value: lensBias === 0 ? 'Không đeo kính' : lensBias < 0 ? 'Thấu kính phân kì (-)' : 'Thấu kính hội tụ (+)' },
            { label: 'Vị trí điểm ảnh', value: round(-netError, 1), unit: 'mm so với võng mạc' }
          ],
          statusNote: 'Người cận thị đeo kính phân kì để đẩy ảnh lùi ra đúng võng mạc; người viễn thị đeo kính hội tụ để kéo ảnh về võng mạc.'
        };
      }

      // Mode 3: Ear pathway & Acoustic waves
      const waveAmp = 6 + (intensity / 100) * 20;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 3; i++) {
        const rx = cx - 180 + ((t * 95 + i * 32) % 90);
        ctx.beginPath();
        ctx.arc(rx - 20, cy, 18 + i * 8, -0.7, 0.7);
        ctx.stroke();
      }
      // Ear canal + Eardrum
      const drumX = cx - 65;
      ctx.strokeStyle = muted;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 170, cy - 26);
      ctx.lineTo(drumX, cy - 18);
      ctx.moveTo(cx - 170, cy + 26);
      ctx.lineTo(drumX, cy + 18);
      ctx.stroke();

      const vib = Math.sin(t * 24) * (waveAmp * 0.25);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(drumX + vib, cy - 20);
      ctx.lineTo(drumX - vib, cy + 20);
      ctx.stroke();

      // Ossicles chain (Malleus - Incus - Stapes)
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(drumX + vib, cy);
      ctx.lineTo(drumX + 36, cy - 18 + vib * 0.8);
      ctx.lineTo(drumX + 68, cy - 6);
      ctx.lineTo(drumX + 95, cy + vib * 0.5);
      ctx.stroke();

      // Spiral Cochlea
      const cochX = cx + 82;
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4.5; a += 0.2) {
        const r = 46 - a * 3;
        const px = cochX + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = fg;
      ctx.font = '12px sans-serif';
      ctx.fillText('Màng nhĩ', drumX - 24, cy + 44);
      ctx.fillText('Chuỗi xương tai (Búa-Đe-Bàn đạp)', drumX + 10, cy - 36);
      ctx.fillText('Ốc tai (Tế bào thụ cảm âm thanh → Dây thần kinh VIII)', cochX - 75, cy + 72);

      return {
        metrics: [
          { label: 'Cường độ âm thanh', value: round(35 + (intensity / 100) * 65, 0), unit: 'dB' },
          { label: 'Mức an toàn thính giác', value: intensity > 80 ? 'Nguy cơ hại tế bào lông ốc tai!' : 'An toàn (< 85 dB)' },
          { label: 'Đường truyền âm', value: 'Vành tai → Màng nhĩ → Xương tai → Ốc tai' }
        ],
        statusNote: 'Sóng âm làm rung màng nhĩ và chuỗi xương tai khuếch đại dao động truyền vào dịch ốc tai, tạo xung thần kinh lên não.'
      };
    }

    case 'digestion_enzymes_2d':
    default: {
      // digestion_enzymes_2d
      const zone = Math.max(1, Math.min(3, Math.round(params.organZone ?? 2)));
      const fatPct = params.mealFat ?? 45;
      const chew = params.chewingTime ?? 65;

      const zoneNames = [
        '1. Khoang Miệng (pH ≈ 7 · Enzym Amylase cắt Tinh bột)',
        '2. Dạ dày (Acid HCl pH 2 + Enzym Pepsin cắt Protein)',
        '3. Ruột non (Dịch mật + Tụy · Hấp thụ qua Vi nhung mao)'
      ];
      ctx.fillStyle = fg;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(zoneNames[zone - 1], 18, 28);

      // Digestive tract schematic on left
      const tx = w * 0.25;
      // Esophagus
      ctx.strokeStyle = zone === 1 ? '#f59e0b' : '#94a3b8';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(tx, 64);
      ctx.lineTo(tx, cy - 34);
      ctx.stroke();
      // J-shaped stomach
      ctx.fillStyle = zone === 2 ? '#fb7185' : 'rgba(244,63,94,0.45)';
      ctx.beginPath();
      ctx.ellipse(tx + 12, cy + 4, 34, 44, -0.35, 0, Math.PI * 2);
      ctx.fill();
      // Coiled small intestine
      ctx.strokeStyle = zone === 3 ? '#10b981' : '#34d399';
      ctx.lineWidth = 10;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const yLoop = cy + 56 + i * 16;
        ctx.moveTo(tx - 38, yLoop);
        ctx.lineTo(tx + 38, yLoop);
      }
      ctx.stroke();

      // Right: Enzyme Zoom Reactor Vessel + Thermal Probe (37°C physiological optimum)
      const px = w * 0.68;
      const py = cy + 4;
      const vesselX = w * 0.44;
      const vesselY = 54;
      const vesselW = Math.max(190, w * 0.44);
      const vesselH = Math.max(120, benchY - vesselY - 8);
      drawStudioGlassVessel(ctx, vesselX, vesselY, vesselW, vesselH, {
        fillFraction: 0.72,
        liquidColor: zone === 2 ? 'rgba(244, 63, 94, 0.14)' : zone === 1 ? 'rgba(250, 204, 21, 0.12)' : 'rgba(16, 185, 129, 0.14)',
        liquidTopColor: zone === 2 ? 'rgba(251, 113, 133, 0.32)' : 'rgba(52, 211, 153, 0.3)',
        maxMl: 60,
        perfMode,
        dark,
        rimGlowColor: '#38bdf8'
      });
      drawStudioThermometerProbe(ctx, vesselX + vesselW + 18, vesselY + 8, vesselH - 16, 37, dark, 0, 80);

      const enzRate = chew / 100;
      if (zone === 1) {
        // Starch chain split into maltose pairs
        const gap = 8 + Math.abs(Math.sin(t * 2.5 * enzRate)) * 22;
        for (let i = 0; i < 6; i++) {
          const bx = px - 105 + i * 32 + (i >= 2 ? gap : 0) + (i >= 4 ? gap : 0);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(bx, py, 12, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Tinh bột → Đường đôi Maltose (Vị ngọt khi nhai kĩ)', w * 0.48, py + 58);
      } else if (zone === 2) {
        // Protein helix being cleaved by HCl + Pepsin
        for (let i = 0; i < 5; i++) {
          const sx = px - 90 + i * 44;
          const sy = py + Math.sin(t * 4 + i) * 10;
          ctx.fillStyle = '#fb7185';
          ctx.beginPath();
          ctx.roundRect(sx - 14, sy - 10, 28, 20, 8);
          ctx.fill();
        }
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Protein dài → Chuỗi Peptit ngắn (nhờ Pepsin + HCl)', w * 0.48, py + 58);
      } else {
        // Villi micro-folds absorbing glucose/amino acids/fatty acids into blood
        for (let i = 0; i < 5; i++) {
          const vx0 = w * 0.49 + i * 44;
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.roundRect(vx0, py + 12, 26, 62, 13);
          ctx.fill();
        }
        const nDots = Math.round(4 + (fatPct / 100) * 6);
        for (let d = 0; d < nDots; d++) {
          const dy = py - 52 + ((t * 55 + d * 24) % 95);
          const dx = w * 0.51 + ((d * 31) % 180);
          ctx.fillStyle = d % 2 === 0 ? '#38bdf8' : '#facc15';
          ctx.beginPath();
          ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = fg;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Lông ruột & Vi nhung mao hấp thụ vào mạch máu', w * 0.48, py - 74);
      }

      return {
        metrics: [
          { label: 'Vị trí ống tiêu hóa', value: zone === 1 ? 'Khoang miệng' : zone === 2 ? 'Dạ dày' : 'Ruột non' },
          { label: 'Môi trường pH', value: zone === 1 ? '7.0 (Trung tính)' : zone === 2 ? '2.0 (Acid HCl)' : '8.0 (Kiềm nhẹ)' },
          { label: 'Hiệu suất enzym', value: round(50 + enzRate * 48, 0), unit: '%' }
        ],
        statusNote: 'Tiêu hóa gồm biến đổi cơ học (nhai, co bóp) và biến đổi hóa học nhờ enzym cắt thức ăn thành chất đơn giản hấp thụ được.'
      };
    }
  }
}
