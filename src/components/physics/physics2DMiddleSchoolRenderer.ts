import { PhysicsSimType } from '../../types';
import type { Extra2DOverlays, Extra2DTelemetryPayload } from './physics2DExtraRenderer';

function drawVec(
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
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8.5 * Math.cos(angle - 0.35), y2 - 8.5 * Math.sin(angle - 0.35));
  ctx.lineTo(x2 - 8.5 * Math.cos(angle + 0.35), y2 - 8.5 * Math.sin(angle + 0.35));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, x2 + 6, y2 + 4);
  }
  ctx.restore();
}

export function renderMiddleSchool2DPhysicsSim(
  simType: PhysicsSimType,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isDark: boolean,
  p: Record<string, number>,
  _ov: Extra2DOverlays,
  pushTelemetry: (payload: Extra2DTelemetryPayload) => void
): boolean {
  const txt = isDark ? '#e2e8f0' : '#0f172a';
  const mut = isDark ? '#94a3b8' : '#475569';

  switch (simType) {
    // 1. MEASUREMENT TOOLS 2D (Thước, Bình chia độ, Lực kế, Nhiệt kế)
    case 'measurement_tools_2d': {
      const toolMode = Math.max(1, Math.min(4, Math.round(p.toolMode ?? 1)));
      const val = p.sampleVal ?? 12.5;
      const eyeTilt = p.eyeTiltDeg ?? 0;
      const parallaxErr = Math.sin((eyeTilt * Math.PI) / 180) * 1.4;
      const apparentVal = Math.max(0, val + parallaxErr);

      if (toolMode === 1) {
        // Ruler + Pencil + Eye Parallax
        pushTelemetry({
          metric1Label: 'Chiều dài thực của vật',
          metric1Val: `${val.toFixed(1)} cm`,
          metric2Label: 'Số đọc theo hướng mắt',
          metric2Val: `${apparentVal.toFixed(1)} cm`,
          metric3Label: 'ĐCNN thước',
          metric3Val: '0.5 cm (GHĐ 30 cm)',
          note: Math.abs(eyeTilt) < 2 ? 'Mắt nhìn vuông góc với vạch chia: Kết quả đọc chính xác!' : `Mắt nhìn lệch ${eyeTilt}° gây sai số thị sai ${parallaxErr > 0 ? '+' : ''}${parallaxErr.toFixed(1)} cm!`
        });

        const rx = w * 0.1;
        const rw = w * 0.8;
        const ry = h * 0.56;
        const maxCm = 30;
        const pxPerCm = rw / maxCm;
        const clamped = Math.min(maxCm, Math.max(2, val));

        // Ruler body
        ctx.fillStyle = isDark ? '#1e293b' : '#fef3c7';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.fillRect(rx, ry, rw, 46);
        ctx.strokeRect(rx, ry, rw, 46);

        for (let cm = 0; cm <= maxCm; cm += 0.5) {
          const x = rx + cm * pxPerCm;
          const isInt = Math.abs(cm - Math.round(cm)) < 0.01;
          const isFive = isInt && cm % 5 === 0;
          const tickH = isFive ? 18 : isInt ? 12 : 7;
          ctx.strokeStyle = isDark ? '#e2e8f0' : '#0f172a';
          ctx.lineWidth = isFive ? 1.8 : 1;
          ctx.beginPath();
          ctx.moveTo(x, ry);
          ctx.lineTo(x, ry + tickH);
          ctx.stroke();
          if (isFive) {
            ctx.fillStyle = txt;
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(String(cm), x, ry + 34);
          }
        }

        // Pencil/block aligned at 0 cm
        const endX = rx + clamped * pxPerCm;
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(rx, ry - 34, endX - rx, 26);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(endX - 10, ry - 34);
        ctx.lineTo(endX, ry - 21);
        ctx.lineTo(endX - 10, ry - 8);
        ctx.closePath();
        ctx.fill();

        // Eye & sight line showing parallax
        const eyeX = endX + Math.tan((eyeTilt * Math.PI) / 180) * 65;
        const eyeY = ry - 95;
        ctx.strokeStyle = Math.abs(eyeTilt) < 2 ? '#10b981' : '#ef4444';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeY);
        ctx.lineTo(rx + Math.min(maxCm, apparentVal) * pxPerCm, ry);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = Math.abs(eyeTilt) < 2 ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = txt;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Mắt (${eyeTilt}°)`, eyeX, eyeY - 15);
      } else if (toolMode === 2) {
        // Graduated Cylinder V2 - V1
        const v1 = 25;
        const vStone = Math.min(35, Math.max(2, val));
        const v2 = v1 + vStone;
        const readV2 = Math.max(v1, v2 + parallaxErr * 1.5);
        pushTelemetry({
          metric1Label: 'Mực nước ban đầu V₁',
          metric1Val: `${v1.toFixed(1)} mL`,
          metric2Label: 'Mực nước sau khi thả V₂',
          metric2Val: `${readV2.toFixed(1)} mL`,
          metric3Label: 'Thể tích vật V = V₂ − V₁',
          metric3Val: `${(readV2 - v1).toFixed(1)} cm³`,
          note: 'Đặt mắt ngang với đáy mặt khum lõm của nước trong bình chia độ để tránh sai số.'
        });

        const cx = w * 0.45;
        const botY = h * 0.84;
        const cylW = 92;
        const cylH = h * 0.62;
        const topY = botY - cylH;
        const maxMl = 70;

        // Water fill
        const fillH = Math.min(cylH - 8, (v2 / maxMl) * cylH);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.45)';
        ctx.fillRect(cx - cylW / 2 + 2, botY - fillH, cylW - 4, fillH);

        // V1 dashed level
        const yV1 = botY - (v1 / maxMl) * cylH;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(cx - cylW / 2 - 20, yV1);
        ctx.lineTo(cx + cylW / 2 + 30, yV1);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`V₁ = ${v1} mL`, cx + cylW / 2 + 34, yV1 + 4);

        // Submerged pebble
        const stoneR = Math.min(26, 8 + Math.sqrt(vStone) * 2.8);
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(cx, botY - stoneR + 4, stoneR * 1.15, stoneR * 0.85, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Cylinder outline + ticks
        ctx.strokeStyle = txt;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - cylW / 2, topY);
        ctx.lineTo(cx - cylW / 2, botY);
        ctx.lineTo(cx + cylW / 2, botY);
        ctx.lineTo(cx + cylW / 2, topY);
        ctx.stroke();

        for (let ml = 10; ml <= 60; ml += 10) {
          const y = botY - (ml / maxMl) * cylH;
          ctx.beginPath();
          ctx.moveTo(cx - cylW / 2, y);
          ctx.lineTo(cx - cylW / 2 + 16, y);
          ctx.stroke();
          ctx.fillStyle = mut;
          ctx.textAlign = 'right';
          ctx.fillText(`${ml}`, cx - cylW / 2 - 6, y + 4);
        }

        // V2 label
        const yV2 = botY - fillH;
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText(`V₂ = ${readV2.toFixed(1)} mL`, cx + cylW / 2 + 34, yV2 + 4);
      } else if (toolMode === 3) {
        // Spring Dynamometer (Lực kế)
        const fNewton = Math.min(50, Math.max(2, val));
        const massKg = fNewton / 10;
        pushTelemetry({
          metric1Label: 'Số chỉ Lực kế P',
          metric1Val: `${fNewton.toFixed(1)} N`,
          metric2Label: 'Khối lượng tương ứng m',
          metric2Val: `${massKg.toFixed(2)} kg`,
          metric3Label: 'Công thức liên hệ',
          metric3Val: 'P = 10 · m',
          note: 'Số chỉ lực kế tỉ lệ thuận với độ dãn lò xo theo định luật Hooke: Trọng lượng 100 g ≈ 1 N.'
        });

        const cx = w * 0.48;
        const topY = 26;
        const bodyW = 68;
        const bodyH = 148;
        const extPx = (fNewton / 50) * 76;

        ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.fillRect(cx - bodyW / 2, topY, bodyW, bodyH);
        ctx.strokeRect(cx - bodyW / 2, topY, bodyW, bodyH);

        // Scale markings
        for (let n = 0; n <= 50; n += 10) {
          const y = topY + 24 + (n / 50) * 90;
          ctx.strokeStyle = txt;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cx + 6, y);
          ctx.lineTo(cx + 22, y);
          ctx.stroke();
          ctx.fillStyle = txt;
          ctx.font = '10px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`${n}N`, cx + 25, y + 3);
        }

        // Spring coils inside
        const springEnd = topY + 24 + extPx * 1.15;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const coils = 9;
        for (let i = 0; i <= coils; i++) {
          const y = topY + 12 + ((springEnd - (topY + 12)) * i) / coils;
          const x = cx - 10 + (i % 2 === 0 ? -7 : 7);
          if (i === 0) ctx.moveTo(cx - 10, topY + 12);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Pointer needle + Hanging weight block
        const hookY = topY + bodyH + 22 + extPx * 0.45;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 24, topY + 24 + (fNewton / 50) * 90);
        ctx.lineTo(cx + 18, topY + 24 + (fNewton / 50) * 90);
        ctx.stroke();

        ctx.strokeStyle = mut;
        ctx.beginPath();
        ctx.moveTo(cx, topY + bodyH);
        ctx.lineTo(cx, hookY);
        ctx.stroke();

        const boxS = 26 + massKg * 4;
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(cx - boxS / 2, hookY, boxS, boxS);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${massKg.toFixed(1)}kg`, cx, hookY + boxS / 2 + 4);
      } else {
        // Liquid Thermometer (°C <-> °F)
        const cDeg = Math.min(100, Math.max(0, val));
        const fDeg = 1.8 * cDeg + 32;
        const kDeg = cDeg + 273.15;
        pushTelemetry({
          metric1Label: 'Nhiệt độ Celsius (°C)',
          metric1Val: `${cDeg.toFixed(1)} °C`,
          metric2Label: 'Nhiệt độ Fahrenheit (°F)',
          metric2Val: `${fDeg.toFixed(1)} °F`,
          metric3Label: 'Nhiệt độ Kelvin (K)',
          metric3Val: `${kDeg.toFixed(1)} K`,
          note: 'Nhiệt kế chất lỏng hoạt động dựa trên sự dãn nở vì nhiệt của thủy ngân hoặc rượu pha màu.'
        });

        const cx = w * 0.45;
        const bulbY = h * 0.78;
        const stemTop = h * 0.14;
        const stemH = bulbY - stemTop;

        ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = mut;
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 12, stemTop, 24, stemH);
        ctx.strokeRect(cx - 12, stemTop, 24, stemH);

        const colH = (cDeg / 100) * (stemH - 12);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 6, bulbY - colH, 12, colH);
        ctx.beginPath();
        ctx.arc(cx, bulbY + 12, 22, 0, Math.PI * 2);
        ctx.fill();

        for (let d = 0; d <= 100; d += 20) {
          const y = bulbY - (d / 100) * (stemH - 12);
          ctx.strokeStyle = txt;
          ctx.beginPath();
          ctx.moveTo(cx + 12, y);
          ctx.lineTo(cx + 24, y);
          ctx.stroke();
          ctx.fillStyle = txt;
          ctx.font = 'bold 10.5px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`${d}°C (${(1.8 * d + 32).toFixed(0)}°F)`, cx + 28, y + 4);
        }
      }
      return true;
    }

    // 2. THERMAL EXPANSION 2D (Băng kép + Rắn Lỏng Khí)
    case 'thermal_expansion_2d': {
      const heating = Math.round(p.bimetallic ?? 1) === 1;
      const tempC = heating ? p.tempC ?? 65 : 20;
      const mode = Math.max(1, Math.min(3, Math.round(p.matterMode ?? 1)));
      const dT = Math.max(0, tempC - 20);

      pushTelemetry({
        metric1Label: 'Nhiệt độ khối thí nghiệm',
        metric1Val: `${tempC.toFixed(0)} °C`,
        metric2Label: 'Độ nở tương đối Rắn : Lỏng : Khí',
        metric2Val: '1 : 20 : 180',
        metric3Label: mode === 1 ? 'Trạng thái băng kép' : 'Tốc độ dãn nở',
        metric3Val: mode === 1 ? (dT > 40 ? 'Cong chạm tiếp điểm!' : 'Thẳng / Cong nhẹ') : dT > 50 ? 'Dãn nở mạnh' : 'Ổn định',
        note: 'Chất khí nở vì nhiệt nhiều nhất, chất lỏng nở nhiều hơn chất rắn. Băng kép đồng-thép luôn cong về phía kim loại nở ít hơn (thép).'
      });

      if (mode === 1) {
        // Bimetallic strip curving upward/downward as temp rises
        const anchorX = w * 0.22;
        const anchorY = h * 0.52;
        const len = w * 0.48;
        const bend = (dT / 120) * 68;
        const segs = 20;

        // Top layer: Brass (Copper) expands MORE -> convex outer curve
        // Bottom layer: Steel expands LESS -> concave inner curve
        ctx.lineCap = 'butt';
        for (let i = 0; i < segs; i++) {
          const u1 = i / segs;
          const u2 = (i + 1) / segs;
          const x1 = anchorX + u1 * len;
          const y1 = anchorY + u1 * u1 * bend;
          const x2 = anchorX + u2 * len;
          const y2 = anchorY + u2 * u2 * bend;
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(x1, y1 - 4);
          ctx.lineTo(x2, y2 - 4);
          ctx.stroke();

          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(x1, y1 + 4);
          ctx.lineTo(x2, y2 + 4);
          ctx.stroke();
        }

        // Fixed clamp + electric contact
        ctx.fillStyle = '#334155';
        ctx.fillRect(anchorX - 24, anchorY - 26, 26, 52);

        const tipX = anchorX + len;
        const tipY = anchorY + bend;
        const contactY = anchorY + 42;
        const touched = tipY + 6 >= contactY;
        ctx.fillStyle = touched ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(tipX, contactY + 8, 8, 0, Math.PI * 2);
        ctx.fill();

        if (heating) {
          const flameY = anchorY + 65 + Math.sin(t * 14) * 3;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.ellipse(anchorX + len * 0.45, flameY, 16, 26, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = txt;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Trên: Đồng (nở nhiều) · Dưới: Thép (nở ít) → Cong về phía Thép', anchorX, 28);
        ctx.fillText(touched ? 'TIẾP ĐIỂM ĐÓNG (Ngắt mạch bàn là)' : 'Đang gia nhiệt...', tipX - 95, contactY + 34);
      } else {
        // Side-by-side expansion comparison: Solid bar, Liquid column, Gas balloon
        const cols = [
          { title: 'Chất RẮN (Thanh đồng)', frac: 0.22 + (dT / 120) * 0.08, col: '#f59e0b' },
          { title: 'Chất LỎNG (Cột rượu)', frac: 0.22 + (dT / 120) * 0.32, col: '#0ea5e9' },
          { title: 'Chất KHÍ (Bóng khí)', frac: 0.22 + (dT / 120) * 0.68, col: '#10b981' }
        ];
        const baseBot = h * 0.82;
        const maxH = h * 0.58;
        cols.forEach((c, idx) => {
          const bx = w * (0.2 + idx * 0.3);
          const barH = c.frac * maxH;
          ctx.fillStyle = c.col;
          ctx.fillRect(bx - 28, baseBot - barH, 56, barH);
          ctx.strokeStyle = txt;
          ctx.strokeRect(bx - 28, baseBot - maxH, 56, maxH);
          ctx.fillStyle = txt;
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(c.title, bx, baseBot + 20);
          ctx.fillText(`+${((c.frac - 0.22) * 100).toFixed(0)}%`, bx, baseBot - barH - 8);
        });
      }
      return true;
    }

    // 3. PLANE MIRROR 2D (Phản xạ ánh sáng i' = i & Ảnh ảo đối xứng)
    case 'plane_mirror_2d': {
      const iDeg = p.incidenceDeg ?? 40;
      const dist = p.objDistCm ?? 35;
      const mTilt = p.mirrorAngleDeg ?? 0;
      const mRad = (mTilt * Math.PI) / 180;
      const iRad = (iDeg * Math.PI) / 180;

      pushTelemetry({
        metric1Label: 'Góc tới i / Góc phản xạ i\'',
        metric1Val: `${iDeg.toFixed(0)}° / ${iDeg.toFixed(0)}°`,
        metric2Label: 'Khoảng cách Vật – Gương / Ảnh – Gương',
        metric2Val: `${dist.toFixed(0)} cm / ${dist.toFixed(0)} cm`,
        metric3Label: 'Khoảng cách Vật ↔ Ảnh ảo',
        metric3Val: `${(dist * 2).toFixed(0)} cm`,
        note: 'Ảnh tạo bởi gương phẳng là ảnh ảo, cùng kích thước với vật và đối xứng qua mặt phẳng gương.'
      });

      const mx = w * 0.54;
      const my = h * 0.66;
      const mirHalf = 140;

      // Mirror plane (slightly tilted by mirrorAngleDeg)
      const dxM = Math.sin(mRad) * mirHalf;
      const dyM = Math.cos(mRad) * mirHalf;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(mx - dxM, my - dyM * 0.2 - mirHalf * 0.9);
      ctx.lineTo(mx + dxM, my + mirHalf * 0.35);
      ctx.stroke();

      // Simpler crystal-clear upright mirror + normal at reflection point O
      const ox = w * 0.52;
      const oy = h * 0.56;
      ctx.fillStyle = isDark ? 'rgba(56,189,248,0.12)' : 'rgba(56,189,248,0.18)';
      ctx.fillRect(ox - 160, oy, 320, 12);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox - 160, oy);
      ctx.lineTo(ox + 160, oy);
      ctx.stroke();
      for (let hx = -150; hx <= 150; hx += 16) {
        ctx.strokeStyle = mut;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ox + hx, oy);
        ctx.lineTo(ox + hx - 8, oy + 10);
        ctx.stroke();
      }

      // Normal N perpendicular to mirror
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy - 135);
      ctx.lineTo(ox, oy + 100);
      ctx.stroke();
      ctx.setLineDash([]);

      // Incident & Reflected rays at O
      const rayLen = 135;
      const sx = ox - Math.sin(iRad + mRad * 0.5) * rayLen;
      const sy = oy - Math.cos(iRad + mRad * 0.5) * rayLen;
      const rx = ox + Math.sin(iRad - mRad * 0.5) * rayLen;
      const ry = oy - Math.cos(iRad - mRad * 0.5) * rayLen;

      drawVec(ctx, sx, sy, ox, oy, '#f59e0b', `Tia tới S (i=${iDeg}°)`);
      drawVec(ctx, ox, oy, rx, ry, '#10b981', `Tia phản xạ R (i'=${iDeg}°)`);

      // Virtual ray extension behind mirror
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox - Math.sin(iRad - mRad * 0.5) * 90, oy + Math.cos(iRad - mRad * 0.5) * 90);
      ctx.stroke();
      ctx.setLineDash([]);

      // Real candle/arrow at left & Virtual image below mirror
      const dPx = (dist / 60) * 85;
      const objX = ox - 110;
      drawVec(ctx, objX, oy, objX, oy - dPx, '#38bdf8', 'Vật AB');
      ctx.save();
      ctx.setLineDash([3, 3]);
      drawVec(ctx, objX, oy, objX, oy + dPx, '#a855f7', "Ảnh ảo A'B'");
      ctx.restore();
      return true;
    }

    // 4. SIMPLE MACHINES 2D (Đòn bẩy, Ròng rọc động, Mặt phẳng nghiêng)
    case 'simple_machines_2d': {
      const mType = Math.max(1, Math.min(3, Math.round(p.machineType ?? 1)));
      const weightN = p.loadWeightN ?? 60;
      const ratio = p.armRatio ?? 2.0;

      if (mType === 1) {
        const fPull = weightN / ratio;
        pushTelemetry({
          metric1Label: 'Trọng lượng cần nâng P',
          metric1Val: `${weightN.toFixed(0)} N`,
          metric2Label: 'Lực kéo cân bằng F₁ = P/k',
          metric2Val: `${fPull.toFixed(1)} N`,
          metric3Label: 'Moment cân bằng',
          metric3Val: `F₁·d₁ = F₂·d₂ (${(weightN * 1).toFixed(0)} N·m)`,
          note: `Cánh tay đòn lực lớn gấp ${ratio.toFixed(2)}× cánh tay đòn tải giúp giảm lực kéo đi ${ratio.toFixed(2)} lần!`
        });

        const fulX = w * 0.36;
        const fulY = h * 0.62;
        const d2Px = 75;
        const d1Px = Math.min(w * 0.55, d2Px * ratio);
        const tilt = Math.sin(t * 1.4) * 0.05;

        // Fulcrum triangle
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(fulX, fulY);
        ctx.lineTo(fulX - 18, fulY + 38);
        ctx.lineTo(fulX + 18, fulY + 38);
        ctx.closePath();
        ctx.fill();

        // Lever bar
        const lx1 = fulX - d2Px * Math.cos(tilt);
        const ly1 = fulY - d2Px * Math.sin(tilt);
        const lx2 = fulX + d1Px * Math.cos(tilt);
        const ly2 = fulY + d1Px * Math.sin(tilt);
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();

        // Load P on left, Force F1 on right
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(lx1 - 22, ly1 + 6, 44, 34);
        drawVec(ctx, lx1, ly1 + 40, lx1, ly1 + 92, '#ef4444', `P=${weightN}N`);
        drawVec(ctx, lx2, ly2, lx2, ly2 + 30 + (fPull / weightN) * 60, '#10b981', `F₁=${fPull.toFixed(1)}N`);
        ctx.fillStyle = txt;
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`d₂ = 1m`, (lx1 + fulX) / 2 - 16, fulY - 14);
        ctx.fillText(`d₁ = ${ratio.toFixed(2)}m`, (lx2 + fulX) / 2 - 20, fulY - 14);
      } else if (mType === 2) {
        const fPull = weightN / 2;
        pushTelemetry({
          metric1Label: 'Trọng lượng vật nặng P',
          metric1Val: `${weightN.toFixed(0)} N`,
          metric2Label: 'Lực kéo qua Ròng rọc động',
          metric2Val: `${fPull.toFixed(1)} N (P/2)`,
          metric3Label: 'Định luật bảo toàn Công',
          metric3Val: 'Lợi 2× lực, thiệt 2× đường đi',
          note: 'Hai nhánh dây cùng nâng ròng rọc động nên lực kéo chỉ bằng một nửa trọng lượng P!'
        });

        const cx = w * 0.45;
        const ceilY = 30;
        const wheelY = h * 0.5 + Math.sin(t * 1.5) * 14;
        const r = 28;

        ctx.strokeStyle = mut;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 100, ceilY);
        ctx.lineTo(cx + 120, ceilY);
        ctx.stroke();

        // Left fixed rope, right pulled upward
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx - r, ceilY);
        ctx.lineTo(cx - r, wheelY);
        ctx.arc(cx, wheelY, r, Math.PI, 0, true);
        ctx.lineTo(cx + r, ceilY + 25);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, wheelY, r, 0, Math.PI * 2);
        ctx.fill();

        // Load below movable pulley
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 24, wheelY + r + 14, 48, 36);
        drawVec(ctx, cx, wheelY + r + 50, cx, wheelY + r + 95, '#ef4444', `P=${weightN}N`);
        drawVec(ctx, cx + r, ceilY + 55, cx + r, ceilY + 8, '#10b981', `F=${fPull.toFixed(1)}N`);
      } else {
        const fPull = weightN / ratio;
        pushTelemetry({
          metric1Label: 'Chiều dài / Chiều cao (l/h)',
          metric1Val: `${ratio.toFixed(2)}×`,
          metric2Label: 'Lực kéo trên MPN (F = P·h/l)',
          metric2Val: `${fPull.toFixed(1)} N`,
          metric3Label: 'Công nâng vật A = P·h = F·l',
          metric3Val: `${(weightN * 1).toFixed(0)} J`,
          note: 'Mặt phẳng nghiêng càng thoai thoải (l lớn hơn h nhiều lần) thì lực kéo càng nhỏ, nhưng phải kéo quãng đường dài hơn.'
        });

        const bx = w * 0.16;
        const by = h * 0.8;
        const run = Math.min(w * 0.65, 130 * ratio * 0.72);
        const rise = 125;

        ctx.fillStyle = isDark ? 'rgba(56,189,248,0.18)' : 'rgba(56,189,248,0.28)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + run, by);
        ctx.lineTo(bx + run, by - rise);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const u = 0.35 + 0.25 * Math.sin(t * 1.4);
        const px = bx + run * u;
        const py = by - rise * u;
        const ang = Math.atan2(rise, run);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-ang);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-20, -26, 40, 26);
        ctx.restore();
        drawVec(ctx, px, py - 14, px + Math.cos(ang) * 70, py - 14 - Math.sin(ang) * 70, '#10b981', `F=${fPull.toFixed(1)}N`);
      }
      return true;
    }

    // 5. FLUID PRESSURE 2D (p = d*h, Máy ép thủy lực, p = F/S)
    case 'fluid_pressure_2d': {
      const mode = Math.max(1, Math.min(3, Math.round(p.labMode ?? 1)));
      const depthOrForce = p.depthM ?? 3.5;
      const ratio = p.areaRatio ?? 6;

      if (mode === 1) {
        // 3 spouts at different depths
        const dWater = 10000; // N/m3
        const pMax = dWater * depthOrForce;
        pushTelemetry({
          metric1Label: 'Độ sâu cột nước h',
          metric1Val: `${depthOrForce.toFixed(1)} m`,
          metric2Label: 'Áp suất tại đáy p = d·h',
          metric2Val: `${(pMax / 1000).toFixed(1)} kPa`,
          metric3Label: 'Quy luật cột nước',
          metric3Val: 'Sâu hơn → Phun xa hơn',
          note: 'Trong cùng chất lỏng đứng yên, độ sâu h càng lớn thì áp suất chất lỏng p = d·h càng lớn!'
        });

        const tx = w * 0.16;
        const ty = h * 0.18;
        const tw = 96;
        const th = h * 0.65;
        const fillH = Math.min(th - 8, (depthOrForce / 6.0) * (th - 16) + 28);
        const topWater = ty + th - fillH;

        ctx.fillStyle = 'rgba(14, 165, 233, 0.42)';
        ctx.fillRect(tx, topWater, tw, fillH);
        ctx.strokeStyle = txt;
        ctx.lineWidth = 2.4;
        ctx.strokeRect(tx, ty, tw, th);

        [0.28, 0.56, 0.85].forEach((f, idx) => {
          const hy = ty + th * f;
          const head = Math.max(0, hy - topWater);
          if (head > 6) {
            const reach = Math.sqrt(head) * 18;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.moveTo(tx + tw, hy);
            ctx.quadraticCurveTo(tx + tw + reach * 0.6, hy + 8, tx + tw + reach, ty + th + 6);
            ctx.stroke();
          }
          ctx.fillStyle = txt;
          ctx.font = 'bold 10.5px monospace';
          ctx.fillText(`Lỗ ${idx + 1}`, tx - 38, hy + 4);
        });
      } else if (mode === 2) {
        // Hydraulic press F2/F1 = S2/S1
        const f1 = depthOrForce * 10;
        const f2 = f1 * ratio;
        pushTelemetry({
          metric1Label: 'Lực ấn pít-tông nhỏ f₁',
          metric1Val: `${f1.toFixed(0)} N`,
          metric2Label: 'Tỉ số tiết diện S₂ / S₁',
          metric2Val: `${ratio}×`,
          metric3Label: 'Lực nâng pít-tông lớn F₂',
          metric3Val: `${f2.toFixed(0)} N`,
          note: 'Áp suất truyền nguyên vẹn theo mọi hướng trong chất lỏng (Nguyên lý Pascal): F₂ = f₁ · (S₂/S₁).'
        });

        const yBase = h * 0.8;
        const lx = w * 0.25;
        const rx = w * 0.68;
        const press = Math.sin(t * 2.2) * 14;
        // U-tube fluid
        ctx.fillStyle = 'rgba(14, 165, 233, 0.45)';
        ctx.fillRect(lx - 20, h * 0.42 + press, 40, yBase - (h * 0.42 + press));
        ctx.fillRect(lx - 20, yBase - 32, rx - lx + 40, 32);
        const bigW = Math.min(130, 34 + ratio * 8);
        ctx.fillRect(rx - bigW / 2, h * 0.46 - press * 0.35, bigW, yBase - (h * 0.46 - press * 0.35));

        // Pistons + Force arrows
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(lx - 20, h * 0.38 + press, 40, 14);
        ctx.fillRect(rx - bigW / 2, h * 0.42 - press * 0.35, bigW, 16);

        drawVec(ctx, lx, h * 0.16 + press, lx, h * 0.37 + press, '#f59e0b', `f₁=${f1.toFixed(0)}N`);
        drawVec(ctx, rx, h * 0.41 - press * 0.35, rx, h * 0.14 - press * 0.35, '#10b981', `F₂=${f2.toFixed(0)}N`);
      } else {
        // Solid Pressure p = F / S comparison (wide flat vs sharp nail tip)
        const forceN = depthOrForce * 20;
        const sWide = 0.04; // m2
        const sSharp = sWide / ratio;
        pushTelemetry({
          metric1Label: 'Áp lực tác dụng F',
          metric1Val: `${forceN.toFixed(0)} N`,
          metric2Label: 'Áp suất mặt rộng p₁',
          metric2Val: `${(forceN / sWide / 1000).toFixed(1)} kPa`,
          metric3Label: 'Áp suất mũi nhọn p₂',
          metric3Val: `${(forceN / sSharp / 1000).toFixed(1)} kPa (Gấp ${ratio}×!)`,
          note: 'Cùng một áp lực F, diện tích bị ép S càng nhỏ thì áp suất p = F/S càng lớn (lún sâu hơn).'
        });

        const foamY = h * 0.64;
        // Soft foam pad left & right
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(w * 0.15, foamY, 130, 52);
        ctx.fillRect(w * 0.58, foamY + Math.min(28, ratio * 2.5), 130, 52 - Math.min(28, ratio * 2.5));

        // Wide block vs Sharp block
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(w * 0.15 + 20, foamY - 50, 90, 50);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(w * 0.58 + 52, foamY - 50 + Math.min(28, ratio * 2.5), 26, 50);

        ctx.fillStyle = txt;
        ctx.font = 'bold 11.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`S lớn → Lún ít`, w * 0.15 + 65, h - 18);
        ctx.fillText(`S nhỏ (${ratio}×) → Lún sâu!`, w * 0.58 + 65, h - 18);
      }
      return true;
    }

    default:
      return false;
  }
}
