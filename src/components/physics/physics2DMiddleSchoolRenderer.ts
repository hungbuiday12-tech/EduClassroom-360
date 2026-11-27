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

    // 6. HOOKE FORCES & FRICTION 2D (Lớp 6 & Lớp 8: Lực & Biến dạng lò xo, Trọng lượng vs Khối lượng, Ma sát)
    case 'hooke_forces_2d': {
      const massKg = p.massKg ?? 1.5;
      const springK = p.springK ?? 40;
      const surfaceMu = p.surfaceMu ?? 0.25;
      const weightN = massKg * 10;
      const deltaLCm = (weightN / Math.max(10, springK)) * 100;
      const fFriction = surfaceMu * weightN;

      pushTelemetry({
        metric1Label: 'Trọng lượng P = 10·m',
        metric1Val: `${weightN.toFixed(1)} N`,
        metric2Label: 'Độ dãn lò xo Δl = P/k',
        metric2Val: `${deltaLCm.toFixed(1)} cm`,
        metric3Label: 'Lực ma sát trượt F_ms = μP',
        metric3Val: `${fFriction.toFixed(2)} N`,
        note: `Treo ${massKg.toFixed(1)} kg lên lực kế: độ dãn Δl tỉ lệ thuận với trọng lượng P = 10m; lực ma sát phụ thuộc vật liệu bề mặt (μ = ${surfaceMu.toFixed(2)}).`
      });

      // Left: Hanging Spring Scale (Lực kế)
      const sx = w * 0.28;
      const topY = 48;
      ctx.fillStyle = '#475569';
      ctx.fillRect(sx - 44, topY - 10, 88, 12);

      const coils = 9;
      const lenPx = Math.min(130, 42 + deltaLCm * 1.45);
      const stepY = lenPx / coils;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(sx, topY + 2);
      for (let i = 1; i < coils; i++) {
        const dx = i % 2 === 0 ? -12 : 12;
        ctx.lineTo(sx + dx, topY + 2 + i * stepY);
      }
      ctx.lineTo(sx, topY + 2 + lenPx);
      ctx.stroke();

      // Hanging Mass Block + Force Vectors (P down, Fdh up)
      const boxS = 26 + massKg * 8;
      const boxY = topY + 6 + lenPx;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(sx - boxS / 2, boxY, boxS, boxS, 6);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${massKg.toFixed(1)}kg`, sx, boxY + boxS / 2 + 4);

      drawVec(ctx, sx, boxY + boxS, sx, boxY + boxS + 34 + weightN * 0.55, '#ef4444', `P=${weightN.toFixed(0)}N`);
      drawVec(ctx, sx - 16, boxY + 4, sx - 16, boxY - 26 - weightN * 0.45, '#10b981', 'F_đh');

      // Right: Horizontal Pull & Friction Block
      const rx = w * 0.69;
      const floorY = h * 0.68;
      ctx.fillStyle = surfaceMu > 0.35 ? '#92400e' : surfaceMu > 0.15 ? '#64748b' : '#38bdf8';
      ctx.fillRect(rx - 105, floorY, 210, 12);

      const slideX = rx - 22 + Math.sin(t * 1.6) * 26;
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.roundRect(slideX - 26, floorY - 40, 52, 40, 6);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Vật trượt', slideX, floorY - 16);

      drawVec(ctx, slideX + 26, floorY - 20, slideX + 68 + fFriction * 2.2, floorY - 20, '#38bdf8', 'F_kéo');
      drawVec(ctx, slideX - 26, floorY - 12, slideX - 42 - fFriction * 2.2, floorY - 12, '#f43f5e', `F_ms=${fFriction.toFixed(1)}N`);

      ctx.fillStyle = txt;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Lực kế lò xo (Δl = ${deltaLCm.toFixed(1)} cm)`, sx, h - 18);
      ctx.fillText(`Mặt trượt (μ = ${surfaceMu.toFixed(2)})`, rx, h - 18);
      return true;
    }

    // 7. SHADOW & ECLIPSE 2D (Lớp 7 / 2006: Định luật truyền thẳng ánh sáng, Bóng tối – Nửa tối, Nhật – Nguyệt thực)
    case 'shadow_eclipse_2d': {
      const srcRadius = p.sourceSize ?? 18;
      const objDist = p.objectDist ?? 0.46; // 0.3..0.7
      const occR = p.obstacleRadius ?? 28;

      const lx = w * 0.14;
      const ly = h * 0.5;
      const ox = lx + (w * 0.72) * objDist;
      const oy = ly;
      const screenX = w * 0.86;

      // Upper and lower rays for umbra (bóng tối) and penumbra (bóng nửa tối)
      const slopeOuterTop = (oy - occR - (ly + srcRadius)) / (ox - lx);
      const slopeOuterBot = (oy + occR - (ly - srcRadius)) / (ox - lx);
      const slopeInnerTop = (oy - occR - (ly - srcRadius)) / (ox - lx);
      const slopeInnerBot = (oy + occR - (ly + srcRadius)) / (ox - lx);

      const penTopY = (ly + srcRadius) + slopeOuterTop * (screenX - lx);
      const penBotY = (ly - srcRadius) + slopeOuterBot * (screenX - lx);
      const umbTopY = (ly - srcRadius) + slopeInnerTop * (screenX - lx);
      const umbBotY = (ly + srcRadius) + slopeInnerBot * (screenX - lx);
      const hasUmbra = umbBotY > umbTopY;

      pushTelemetry({
        metric1Label: 'Kích thước nguồn sáng',
        metric1Val: srcRadius <= 6 ? 'Nguồn điểm' : `Nguồn rộng (r=${srcRadius}px)`,
        metric2Label: 'Vùng bóng tối (Umbra)',
        metric2Val: hasUmbra ? `${Math.round(umbBotY - umbTopY)} px (Tối đen)` : 'Không còn bóng tối!',
        metric3Label: 'Vùng bóng nửa tối',
        metric3Val: `${Math.max(0, Math.round(penBotY - penTopY - Math.max(0, umbBotY - umbTopY)))} px`,
        note: 'Ánh sáng truyền thẳng: nguồn nhỏ tạo bóng tối rõ nét; nguồn rộng tạo cả vùng bóng tối và bóng nửa tối (giải thích Nhật thực toàn phần/một phần).'
      });

      // Penumbra cone fill
      ctx.fillStyle = isDark ? 'rgba(250, 204, 21, 0.14)' : 'rgba(250, 204, 21, 0.25)';
      ctx.beginPath();
      ctx.moveTo(lx, ly - srcRadius);
      ctx.lineTo(screenX, 24);
      ctx.lineTo(screenX, h - 24);
      ctx.lineTo(lx, ly + srcRadius);
      ctx.closePath();
      ctx.fill();

      // Penumbra shadow wedge behind obstacle
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.beginPath();
      ctx.moveTo(ox, oy - occR);
      ctx.lineTo(screenX, penTopY);
      ctx.lineTo(screenX, penBotY);
      ctx.lineTo(ox, oy + occR);
      ctx.closePath();
      ctx.fill();

      // Umbra shadow wedge
      if (hasUmbra) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
        ctx.beginPath();
        ctx.moveTo(ox, oy - occR);
        ctx.lineTo(screenX, umbTopY);
        ctx.lineTo(screenX, umbBotY);
        ctx.lineTo(ox, oy + occR);
        ctx.closePath();
        ctx.fill();
      }

      // Ray guide lines
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      const rays: [number, number][] = [
        [ly + srcRadius, penTopY],
        [ly - srcRadius, penBotY],
        [ly - srcRadius, umbTopY],
        [ly + srcRadius, umbBotY]
      ];
      rays.forEach(([sy0, ey0]) => {
        ctx.beginPath();
        ctx.moveTo(lx, sy0);
        ctx.lineTo(screenX, ey0);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Light source, Obstacle, Screen
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(lx, ly, Math.max(5, srcRadius), 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(ox, oy, occR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isDark ? '#e2e8f0' : '#334155';
      ctx.fillRect(screenX, 24, 10, h - 48);
      if (hasUmbra) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(screenX, umbTopY, 10, umbBotY - umbTopY);
      }

      ctx.fillStyle = txt;
      ctx.font = 'bold 11.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Nguồn sáng', lx, h - 18);
      ctx.fillText('Vật cản sáng', ox, oy + occR + 20);
      ctx.fillText('Màn chắn (Bóng)', screenX - 18, h - 18);
      return true;
    }

    // 8. MAGNET & COMPASS 2D (Lớp 7 KHTN: Nam châm, Từ phổ, Kim la bàn định hướng N-S)
    case 'magnet_compass_2d': {
      const polarity = p.polarityFlip ?? 1; // +1 (N-S) or -1 (S-N)
      const compassAngleOffset = (p.compassTiltDeg ?? 0) * (Math.PI / 180);
      const strength = p.fieldStrength ?? 1.0;

      const cx = w * 0.5;
      const cy = h * 0.5;

      pushTelemetry({
        metric1Label: 'Cực nam châm (Trái / Phải)',
        metric1Val: polarity >= 0 ? 'Bắc (N - Đỏ) | Nam (S - Xanh)' : 'Nam (S - Xanh) | Bắc (N - Đỏ)',
        metric2Label: 'Quy ước đường sức từ',
        metric2Val: 'Ra Bắc (N) → Vào Nam (S)',
        metric3Label: 'Cảm ứng từ tương đối',
        metric3Val: `${strength.toFixed(1)}×`,
        note: 'Bên ngoài thanh nam châm, đường sức từ đi ra từ cực Bắc (N) và đi vào cực Nam (S); cực Bắc kim la bàn luôn hướng theo chiều đường sức!'
      });

      // Magnetic field arcs above and below bar magnet
      const magW = 160;
      const magH = 42;
      const loops = [42, 78, 114];
      ctx.lineWidth = 2.0;
      loops.forEach((amp, i) => {
        ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${0.85 - i * 0.2})` : `rgba(2, 132, 199, ${0.85 - i * 0.2})`;
        [-1, 1].forEach((side) => {
          ctx.beginPath();
          ctx.moveTo(cx - magW * 0.42, cy);
          ctx.bezierCurveTo(cx - magW * 0.65, cy + side * amp * 1.35, cx + magW * 0.65, cy + side * amp * 1.35, cx + magW * 0.42, cy);
          ctx.stroke();

          // Field direction arrow at crest
          const dir = polarity >= 0 ? 1 : -1;
          const ax = cx;
          const ay = cy + side * amp * 1.01;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(ax + dir * 7, ay);
          ctx.lineTo(ax - dir * 5, ay - 5);
          ctx.lineTo(ax - dir * 5, ay + 5);
          ctx.closePath();
          ctx.fill();
        });
      });

      // Bar magnet (N red, S blue)
      const leftColor = polarity >= 0 ? '#ef4444' : '#2563eb';
      const rightColor = polarity >= 0 ? '#2563eb' : '#ef4444';
      const leftLabel = polarity >= 0 ? 'N' : 'S';
      const rightLabel = polarity >= 0 ? 'S' : 'N';

      ctx.fillStyle = leftColor;
      ctx.fillRect(cx - magW / 2, cy - magH / 2, magW / 2, magH);
      ctx.fillStyle = rightColor;
      ctx.fillRect(cx, cy - magH / 2, magW / 2, magH);
      ctx.strokeStyle = txt;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - magW / 2, cy - magH / 2, magW, magH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(leftLabel, cx - magW / 4, cy + 6);
      ctx.fillText(rightLabel, cx + magW / 4, cy + 6);

      // 4 test compasses around magnet aligning with field direction
      const compassSpots: [number, number, number][] = [
        [cx, cy - 88, polarity >= 0 ? 0 : Math.PI],
        [cx, cy + 88, polarity >= 0 ? 0 : Math.PI],
        [cx - 145, cy, polarity >= 0 ? Math.PI : 0],
        [cx + 145, cy, polarity >= 0 ? Math.PI : 0]
      ];
      compassSpots.forEach(([kx, ky, baseAng], idx) => {
        const ang = baseAng + Math.sin(t * 2 + idx) * 0.04 + compassAngleOffset * 0.25;
        ctx.save();
        ctx.translate(kx, ky);
        ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
        ctx.strokeStyle = mut;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.rotate(ang);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(0, -4.5);
        ctx.lineTo(0, 4.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(0, -4.5);
        ctx.lineTo(0, 4.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
      return true;
    }

    // 9. HEAT TRANSFER 2D (Lớp 8: Dẫn nhiệt – Đối lưu – Bức xạ nhiệt)
    case 'heat_transfer_2d': {
      const transferMode = Math.max(1, Math.min(3, Math.round(p.transferMode ?? 2)));
      const heaterPower = p.heaterPower ?? 75;
      const condMat = p.materialCoeff ?? 1.0;

      const modeName =
        transferMode === 1
          ? 'Dẫn nhiệt qua thanh kim loại (Rắn)'
          : transferMode === 2
          ? 'Đối lưu dòng chất lỏng / khí'
          : 'Bức xạ nhiệt qua chân không / không khí';

      pushTelemetry({
        metric1Label: 'Hình thức truyền nhiệt',
        metric1Val: modeName,
        metric2Label: 'Công suất nguồn nhiệt',
        metric2Val: `${heaterPower}%`,
        metric3Label: 'Môi trường truyền chủ yếu',
        metric3Val: transferMode === 1 ? 'Chất rắn (Kim loại tốt)' : transferMode === 2 ? 'Chất lỏng & Chất khí' : 'Cả chân không (Tia nhiệt)',
        note: 'Dẫn nhiệt xảy ra mạnh nhất ở chất rắn; Đối lưu tạo dòng tuần hoàn nóng lên – lạnh xuống ở lỏng/khí; Bức xạ truyền thẳng dưới dạng tia nhiệt cả trong chân không.'
      });

      if (transferMode === 1) {
        // Conduction bar with wax pins dropping one by one
        const bx = w * 0.2;
        const bw = w * 0.62;
        const by = h * 0.45;
        const grad = ctx.createLinearGradient(bx, by, bx + bw, by);
        grad.addColorStop(0, '#ef4444');
        grad.addColorStop(Math.min(1, 0.25 + (heaterPower / 100) * 0.55), '#f59e0b');
        grad.addColorStop(1, '#64748b');
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, bw, 22);
        ctx.strokeStyle = txt;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(bx, by, bw, 22);

        // Flame under left end
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(bx + 14, by + 44, 10, 18 + Math.sin(t * 8) * 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4 wax pins along bar
        for (let i = 0; i < 4; i++) {
          const px = bx + bw * (0.28 + i * 0.21);
          const threshold = (i + 1) * 24;
          const effHeat = heaterPower * condMat;
          const dropped = effHeat >= threshold;
          ctx.fillStyle = dropped ? '#94a3b8' : '#fde047';
          const pinY = dropped ? by + 68 : by + 22;
          ctx.fillRect(px - 3, pinY, 6, 20);
          ctx.fillStyle = txt;
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(dropped ? 'Rơi!' : `Đinh ${i + 1}`, px, by - 10);
        }
      } else if (transferMode === 2) {
        // Convection beaker with rotating thermal plumes
        const bx = w * 0.34;
        const bw = w * 0.32;
        const by = h * 0.2;
        const bh = h * 0.58;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.24)';
        ctx.fillRect(bx, by + 20, bw, bh - 20);
        ctx.strokeStyle = txt;
        ctx.lineWidth = 2.4;
        ctx.strokeRect(bx, by, bw, bh);

        // Flame bottom center
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(bx + bw / 2, by + bh + 22, 12, 16 + Math.sin(t * 7) * 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rising hot particles (red) in center & sinking cool particles (blue) at sides
        const count = 14;
        for (let i = 0; i < count; i++) {
          const prog = (t * (0.35 + (heaterPower / 100) * 0.6) + i / count) % 1;
          const loopAng = prog * Math.PI * 2;
          const side = i % 2 === 0 ? 1 : -1;
          const px = bx + bw * 0.5 + side * Math.sin(loopAng) * (bw * 0.34);
          const py = by + bh * 0.54 - Math.cos(loopAng) * (bh * 0.34);
          ctx.fillStyle = Math.cos(loopAng) > 0 ? '#38bdf8' : '#ef4444';
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = txt;
        ctx.font = 'bold 11.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nước nóng nhẹ hơn đi lên ↑ · Nước lạnh nặng hơn chìm xuống ↓', w * 0.5, h - 18);
      } else {
        // Radiation lamp heating dark vs silver foil flask across vacuum
        const sx = w * 0.22;
        const cy = h * 0.5;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(sx, cy, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = txt;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Đèn nhiệt (Chân không)', sx, cy + 48);

        // Wavy infrared rays moving rightward
        for (let r = -1; r <= 1; r++) {
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = sx + 32; x <= w * 0.65; x += 6) {
            const ry = cy + r * 36 + Math.sin(x * 0.14 - t * 6) * 5;
            if (x === sx + 32) ctx.moveTo(x, ry);
            else ctx.lineTo(x, ry);
          }
          ctx.stroke();
        }

        // Matte black flask (absorbs strongly) vs shiny silver flask
        const fx = w * 0.74;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(fx - 38, cy - 56, 36, 52);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(fx + 14, cy - 56, 36, 52);
        ctx.fillStyle = txt;
        ctx.fillText('Phủ muội đen', fx - 20, cy - 66);
        ctx.fillText('Sáng bóng', fx + 32, cy - 66);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`+${Math.round(heaterPower * 0.55)}°C`, fx - 20, cy + 16);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`+${Math.round(heaterPower * 0.18)}°C`, fx + 32, cy + 16);
      }
      return true;
    }

    default:
      return false;
  }
}
