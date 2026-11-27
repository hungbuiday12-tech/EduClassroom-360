import { PhysicsSimType } from '../../types';
import type { Extra2DOverlays, Extra2DTelemetryPayload } from './physics2DExtraRenderer';
import { renderMiddleSchool2DPhysicsSim } from './physics2DMiddleSchoolRenderer';

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
  ctx.shadowColor = color;
  ctx.shadowBlur = 5;
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
    ctx.shadowBlur = 0;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, x2 + 6, y2 + 4);
  }
  ctx.restore();
}

export function renderBatch2Extra2DPhysicsSim(
  simType: PhysicsSimType,
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  isDark: boolean,
  p: Record<string, number>,
  ov: Extra2DOverlays,
  pushTelemetry: (payload: Extra2DTelemetryPayload) => void
): boolean {
  const txt = isDark ? '#e2e8f0' : '#0f172a';
  const mut = isDark ? '#94a3b8' : '#475569';

  switch (simType) {
    // 1. ARCHIMEDES BUOYANCY
    case 'archimedes_buoyancy': {
      const rhoObj = p.densityObj ?? 750;
      const rhoFluid = p.densityFluid ?? 1000;
      const volL = p.volumeL ?? 4.0;
      const volM3 = volL * 0.001;
      const g = 9.81;
      const weightP = rhoObj * volM3 * g;
      const maxBuoy = rhoFluid * volM3 * g;
      const subRatio = Math.min(1, rhoObj / Math.max(100, rhoFluid));
      const actualFa = rhoObj >= rhoFluid ? maxBuoy : weightP;
      const status = rhoObj < rhoFluid ? 'NỔI CÂN BẰNG' : rhoObj === rhoFluid ? 'LƠ LỬNG' : 'CHÌM XUỐNG ĐÁY';

      pushTelemetry({
        metric1Label: 'Trọng lượng vật (P)',
        metric1Val: `${weightP.toFixed(1)} N`,
        metric2Label: 'Lực đẩy Ác-si-mét (F_A)',
        metric2Val: `${actualFa.toFixed(1)} N`,
        metric3Label: 'Phần chìm V_chìm / V',
        metric3Val: `${(subRatio * 100).toFixed(0)}% · ${status}`,
        note: `ρ_vật = ${rhoObj} kg/m³ so với ρ_lỏng = ${rhoFluid} kg/m³ → ${status}.`
      });

      const tankX = w * 0.28;
      const tankW = w * 0.44;
      const tankTop = h * 0.18;
      const tankBot = h * 0.86;
      const risePx = subRatio * volL * 3.5;
      const waterSurface = h * 0.48 - risePx;

      // Liquid
      ctx.fillStyle = isDark ? 'rgba(14,165,233,0.28)' : 'rgba(56,189,248,0.34)';
      ctx.fillRect(tankX, waterSurface, tankW, tankBot - waterSurface);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = tankX; x <= tankX + tankW; x += 6) {
        const wy = waterSurface + Math.sin(x * 0.08 + t * 3.2) * 2.5;
        if (x === tankX) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();

      // Beaker frame
      ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tankX, tankTop);
      ctx.lineTo(tankX, tankBot);
      ctx.lineTo(tankX + tankW, tankBot);
      ctx.lineTo(tankX + tankW, tankTop);
      ctx.stroke();

      // Scale ticks on beaker
      ctx.font = '10px monospace';
      ctx.fillStyle = mut;
      ctx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const ly = tankBot - i * ((tankBot - tankTop) * 0.16);
        ctx.beginPath();
        ctx.moveTo(tankX, ly);
        ctx.lineTo(tankX + 10, ly);
        ctx.stroke();
        ctx.fillText(`${(i * 2).toFixed(0)}L`, tankX - 6, ly + 3);
      }

      // Block position
      const blockSize = 54 + volL * 3;
      const floatBob = Math.sin(t * 2.4) * 4;
      let blockTopY = waterSurface - blockSize * (1 - subRatio) + floatBob;
      if (rhoObj > rhoFluid) {
        blockTopY = tankBot - blockSize - 3;
      }
      const bx = w * 0.5 - blockSize / 2;

      ctx.fillStyle = rhoObj < 950 ? '#d97706' : rhoObj < 1500 ? '#38bdf8' : '#64748b';
      ctx.fillRect(bx, blockTopY, blockSize, blockSize);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(bx, blockTopY, blockSize, blockSize);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${rhoObj} kg/m³`, w * 0.5, blockTopY + blockSize / 2 + 4);

      if (ov.showVectors) {
        const cx = w * 0.5;
        const cy = blockTopY + blockSize / 2;
        drawVec(ctx, cx - 10, cy, cx - 10, cy + Math.min(72, weightP * 1.1), '#ef4444', `P = ${weightP.toFixed(0)}N`);
        drawVec(ctx, cx + 10, cy, cx + 10, cy - Math.min(72, actualFa * 1.1), '#10b981', `F_A = ${actualFa.toFixed(0)}N`);
      }
      return true;
    }

    // 2. HORIZONTAL SPRING OSCILLATOR WITH FRICTION
    case 'spring_oscillation_horizontal': {
      const k = p.kSpring ?? 40;
      const m = p.mass ?? 1.0;
      const mu = p.mu ?? 0.08;
      const omega = Math.sqrt(k / m);
      const decay = mu * 1.15;
      const ampPx = 115 * Math.exp(-decay * Math.min(t, 28));
      const xRel = ampPx * Math.cos(omega * t);
      const vRel = -ampPx * 0.01 * omega * Math.sin(omega * t);
      const activeOsc = ampPx > 3.5;

      pushTelemetry({
        metric1Label: 'Chu kì dao động (T)',
        metric1Val: `${((2 * Math.PI) / omega).toFixed(2)} s`,
        metric2Label: 'Biên độ còn lại (A)',
        metric2Val: `${(ampPx * 0.1).toFixed(2)} cm`,
        metric3Label: 'Trạng thái tắt dần',
        metric3Val: mu === 0 ? 'Bảo toàn cơ năng' : activeOsc ? `Giảm e^(-${decay.toFixed(2)}t)` : 'Đã dừng hẳn',
        note: `Độ giảm biên độ sau mỗi chu kì ΔA = 4μmg/k = ${((4 * mu * m * 9.8) / k * 100).toFixed(2)} cm.`
      });

      const floorY = h * 0.64;
      const wallX = w * 0.14;
      const eqX = w * 0.54;
      const bx = eqX + xRel;

      // Wall & Floor
      ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.fillRect(wallX - 18, h * 0.25, 18, floorY - h * 0.25);
      ctx.fillRect(wallX - 18, floorY, w * 0.74, 8);

      // Spring coils
      const springY = floorY - 24;
      const springLen = Math.max(40, bx - 24 - wallX);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(wallX, springY);
      const coils = 16;
      for (let i = 1; i < coils; i++) {
        const sx = wallX + (i / coils) * springLen;
        const sy = springY + (i % 2 === 0 ? -12 : 12);
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(bx - 24, springY);
      ctx.stroke();

      // Mass block
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bx - 24, floorY - 48, 48, 48);
      ctx.strokeStyle = txt;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(bx - 24, floorY - 48, 48, 48);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${m.toFixed(1)}kg`, bx, floorY - 20);

      // Equilibrium line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = mut;
      ctx.beginPath();
      ctx.moveTo(eqX, h * 0.24);
      ctx.lineTo(eqX, floorY + 22);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = mut;
      ctx.fillText('VTCB O', eqX, floorY + 36);

      if (ov.showVectors && activeOsc) {
        drawVec(ctx, bx, floorY - 58, bx + Math.sign(vRel) * Math.min(58, Math.abs(vRel) * 30), floorY - 58, '#10b981', 'v');
        if (mu > 0 && Math.abs(vRel) > 0.05) {
          drawVec(ctx, bx, floorY - 4, bx - Math.sign(vRel) * (20 + mu * 90), floorY - 4, '#ef4444', 'F_ms');
        }
      }

      // Realtime waveform strip top
      if (ov.showRealtimeChart) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = 0; px <= 180; px += 3) {
          const dtBack = px * 0.04;
          const tt = Math.max(0, t - dtBack);
          const yy = h * 0.2 + 26 * Math.exp(-decay * Math.min(tt, 28)) * Math.cos(omega * tt);
          const xx = w * 0.88 - px;
          if (px === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }
      return true;
    }

    // 3. BANKED CURVE / CENTRIFUGE
    case 'centrifuge_banked_curve': {
      const v = p.speedMs ?? 18;
      const r = p.radiusM ?? 45;
      const deg = p.bankDeg ?? 18;
      const rad = (deg * Math.PI) / 180;
      const g = 9.81;
      const idealV = Math.sqrt(r * g * Math.tan(rad));
      const aC = (v * v) / r;
      const fNeed = 1200 * aC;
      const fBank = 1200 * g * Math.tan(rad);
      const slipMargin = Math.abs(v - idealV);

      pushTelemetry({
        metric1Label: 'Gia tốc hướng tâm (a_ht)',
        metric1Val: `${aC.toFixed(2)} m/s²`,
        metric2Label: 'Vận tốc không ma sát (v_lí_tưởng)',
        metric2Val: `${idealV.toFixed(1)} m/s`,
        metric3Label: 'Trạng thái bám cua',
        metric3Val: deg === 0 && v > 21 ? 'Nguy cơ trượt ngoài!' : slipMargin < 3.5 ? 'Ôm cua cân bằng' : v > idealV ? 'Cần ma sát giữ vào tâm' : 'Cần ma sát kéo ra ngoài',
        note: `Góc nghiêng θ=${deg}° giúp thành phần phản lực N·sinθ hỗ trợ tạo lực hướng tâm.`
      });

      const cx = w * 0.5;
      const cy = h * 0.58;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);

      // Banked road surface
      ctx.fillStyle = isDark ? '#1e293b' : '#94a3b8';
      ctx.fillRect(-170, 0, 340, 18);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-170, 0, 340, 18);

      // Car block slightly vibrating by speed
      const bob = Math.sin(t * v * 0.35) * 1.2;
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(-38, -28 + bob, 76, 26);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-22, -44 + bob, 44, 16);
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-22, -2 + bob, 8, 0, Math.PI * 2);
      ctx.arc(22, -2 + bob, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Angle arc
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx - 140, cy);
      ctx.lineTo(cx + 150, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`θ = ${deg}° · R = ${r} m`, cx + 70, cy + 28);

      if (ov.showVectors) {
        drawVec(ctx, cx, cy - 25, cx, cy + 52, '#ef4444', 'P');
        drawVec(ctx, cx, cy - 25, cx - Math.sin(rad) * 65, cy - 25 - Math.cos(rad) * 65, '#10b981', 'N');
        drawVec(ctx, cx, cy - 25, cx - Math.min(85, fNeed * 0.004), cy - 25, '#a855f7', `F_ht (${(fBank > fNeed ? 'N hỗ trợ' : 'tổng')})`);
      }
      return true;
    }

    // 4. PLANETARY ESCAPE VELOCITY
    case 'planetary_escape_velocity': {
      const v0 = p.launchV ?? 8.2;
      const alt = p.altitudeKm ?? 600;
      const mFactor = p.massIndex ?? 1.0;
      const rFactor = 1 + alt / 6371;
      const v1 = 7.91 * Math.sqrt(mFactor / rFactor);
      const v2 = v1 * Math.SQRT2;
      const ecc = Math.max(0, (v0 * v0) / (v1 * v1) - 1);
      const modeLabel =
        v0 < v1 * 0.96
          ? 'Rơi chạm khí quyển'
          : v0 < v1 * 1.05
            ? 'Quỹ đạo Tròn (Cấp I)'
            : v0 < v2
              ? 'Quỹ đạo Elip kín'
              : 'Thoát li Parabol/Hyperbol (Cấp II)';

      pushTelemetry({
        metric1Label: 'Vận tốc vũ trụ cấp I (v₁)',
        metric1Val: `${v1.toFixed(2)} km/s`,
        metric2Label: 'Vận tốc thoát li (v₂)',
        metric2Val: `${v2.toFixed(2)} km/s`,
        metric3Label: 'Dạng quỹ đạo',
        metric3Val: modeLabel,
        note: `Tại độ cao ${alt} km: v phóng = ${v0.toFixed(1)} km/s → ${modeLabel}.`
      });

      const cx = w * 0.45;
      const cy = h * 0.52;
      const earthR = 46;

      // Space backdrop stars subtle
      ctx.fillStyle = isDark ? '#334155' : '#cbd5e1';
      for (let i = 0; i < 16; i++) {
        ctx.fillRect(((i * 97) % (w - 20)) + 10, ((i * 53) % (h - 20)) + 10, 2, 2);
      }

      // Planet
      const grad = ctx.createRadialGradient(cx - 12, cy - 12, 8, cx, cy, earthR);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
      ctx.fill();

      // Orbit path preview
      const periR = earthR + 18 + (alt / 2000) * 28;
      ctx.strokeStyle = v0 >= v2 ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      if (v0 < v2) {
        const apoR = v0 < v1 ? periR * 0.72 : periR / Math.max(0.24, 1 - ecc * 0.65);
        const a = (periR + apoR) / 2;
        const cOff = a - periR;
        const b = Math.sqrt(Math.max(100, a * a - cOff * cOff));
        ctx.ellipse(cx + cOff, cy, a, b, 0, 0, Math.PI * 2);
      } else {
        for (let th = -1.6; th <= 1.6; th += 0.08) {
          const rCur = (periR * 1.4) / Math.max(0.18, 1 + 1.05 * Math.cos(th));
          const sx = cx - rCur * Math.sin(th);
          const sy = cy - rCur * Math.cos(th);
          if (th === -1.6) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Moving satellite
      let satX = cx;
      let satY = cy - periR;
      if (v0 < v2) {
        const apoR = v0 < v1 ? periR * 0.72 : periR / Math.max(0.24, 1 - ecc * 0.65);
        const a = (periR + apoR) / 2;
        const cOff = a - periR;
        const b = Math.sqrt(Math.max(100, a * a - cOff * cOff));
        const ang = t * (1.2 + v0 * 0.08);
        satX = cx + cOff - a * Math.sin(ang);
        satY = cy - b * Math.cos(ang);
      } else {
        const th = ((t * 0.9) % 2.6) - 1.3;
        const rCur = (periR * 1.4) / Math.max(0.18, 1 + 1.05 * Math.cos(th));
        satX = cx - rCur * Math.sin(th);
        satY = cy - rCur * Math.cos(th);
      }

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(satX, satY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`v=${v0.toFixed(1)}km/s`, satX, satY - 12);
      return true;
    }

    // 5. SINGLE SLIT DIFFRACTION
    case 'single_slit_diffraction': {
      const aUm = p.slitWidthUm ?? 40;
      const lamNm = p.wavelengthNm ?? 550;
      const dM = p.screenDistM ?? 1.5;
      const centerW = (2 * (lamNm * 1e-9) * dM) / (aUm * 1e-6) * 1000; // mm

      pushTelemetry({
        metric1Label: 'Bề rộng vân sáng giữa',
        metric1Val: `${centerW.toFixed(2)} mm`,
        metric2Label: 'Góc cực tiểu bậc 1',
        metric2Val: `${((Math.asin(Math.min(1, (lamNm * 1e-3) / aUm)) * 180) / Math.PI).toFixed(2)}°`,
        metric3Label: 'Bước sóng / Khe',
        metric3Val: `${lamNm} nm · a=${aUm} μm`,
        note: 'Khe càng hẹp (a nhỏ) → vân nhiễu xạ trung tâm càng loe rộng theo tỉ lệ λ/a.'
      });

      const hueColor =
        lamNm < 450 ? '#8b5cf6' : lamNm < 495 ? '#3b82f6' : lamNm < 570 ? '#10b981' : lamNm < 600 ? '#eab308' : '#ef4444';
      const slitX = w * 0.25;
      const scrX = w * 0.72;
      const cy = h * 0.5;
      const gapPx = Math.max(8, aUm * 0.45);

      // Incoming wavefronts
      ctx.strokeStyle = hueColor;
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 6; i++) {
        const wx = ((t * 48 + i * 24) % (slitX - 30)) + 20;
        ctx.beginPath();
        ctx.moveTo(wx, cy - 60);
        ctx.lineTo(wx, cy + 60);
        ctx.stroke();
      }

      // Slit wall
      ctx.fillStyle = isDark ? '#475569' : '#334155';
      ctx.fillRect(slitX - 4, 24, 8, cy - gapPx / 2 - 24);
      ctx.fillRect(slitX - 4, cy + gapPx / 2, 8, h - 24 - (cy + gapPx / 2));

      // Diffracted circular wavelets
      for (let r = ((t * 50) % 24) + 12; r < scrX - slitX; r += 24) {
        ctx.strokeStyle = `${hueColor}88`;
        ctx.beginPath();
        ctx.arc(slitX, cy, r, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }

      // Intensity screen & graph I(y)
      ctx.strokeStyle = isDark ? '#64748b' : '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scrX, 24);
      ctx.lineTo(scrX, h - 24);
      ctx.stroke();

      ctx.strokeStyle = hueColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const kScale = (aUm / lamNm) * 1.4;
      for (let py = 30; py <= h - 30; py += 2) {
        const dy = py - cy;
        const beta = Math.max(1e-4, Math.abs(dy * kScale * 0.35));
        const inten = Math.pow(Math.sin(beta) / beta, 2);
        ctx.fillStyle = hueColor;
        ctx.globalAlpha = Math.min(1, inten + 0.05);
        ctx.fillRect(scrX - 4, py, 8, 2);
        ctx.globalAlpha = 1;
        const gx = scrX + 12 + inten * (w * 0.2);
        if (py === 30) ctx.moveTo(gx, py);
        else ctx.lineTo(gx, py);
      }
      ctx.stroke();
      return true;
    }

    // 6. MACH SHOCKWAVE
    case 'mach_shockwave': {
      const mach = p.machNumber ?? 1.45;
      const vSound = p.waveSpeed ?? 340;
      const vSrc = mach * vSound;
      const halfAngleRad = mach > 1 ? Math.asin(1 / mach) : Math.PI / 2;
      const halfAngleDeg = (halfAngleRad * 180) / Math.PI;

      pushTelemetry({
        metric1Label: 'Vận tốc nguồn (v_s)',
        metric1Val: `${vSrc.toFixed(0)} m/s (${mach.toFixed(2)}M)`,
        metric2Label: 'Nửa góc nón Mach (α)',
        metric2Val: mach >= 1 ? `${halfAngleDeg.toFixed(1)}°` : 'Chưa tạo nón (M < 1)',
        metric3Label: 'Chế độ bay',
        metric3Val: mach < 0.98 ? 'Cận âm' : mach <= 1.04 ? 'Tường âm thanh' : 'Siêu thanh',
        note: 'Khi M > 1, các mặt sóng cầu giao thoa tăng cường dọc đường sinh hình nón góc α.'
      });

      const cycle = (t * 0.65) % 4.0;
      const waveSpeedPx = 58;
      const srcSpeedPx = waveSpeedPx * mach;
      const srcX = 75 + cycle * srcSpeedPx * 0.55;
      const cy = h * 0.5;

      // Wavefronts emitted in the past
      const nWaves = 12;
      for (let i = 0; i < nWaves; i++) {
        const age = (i * 0.28 + (t * 0.65) % 0.28);
        const cxW = srcX - age * srcSpeedPx * 0.55;
        const radW = age * waveSpeedPx * 0.55;
        if (radW > 2 && cxW > 10) {
          ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.45)' : 'rgba(2,132,199,0.42)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cxW, cy, radW, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Mach cone tangent lines if M >= 1
      if (mach >= 1) {
        const len = Math.min(w * 0.65, srcX - 20);
        const slope = Math.tan(halfAngleRad);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(srcX, cy);
        ctx.lineTo(srcX - len, cy - len * slope);
        ctx.moveTo(srcX, cy);
        ctx.lineTo(srcX - len, cy + len * slope);
        ctx.stroke();
      }

      // Jet dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(srcX + 12, cy);
      ctx.lineTo(srcX - 8, cy - 6);
      ctx.lineTo(srcX - 8, cy + 6);
      ctx.closePath();
      ctx.fill();
      return true;
    }

    // 7. COUPLED OSCILLATORS 2D
    case 'coupled_oscillators_2d': {
      const kc = p.kCouple ?? 12;
      const len = p.lengthM ?? 1.2;
      const m = p.massKg ?? 1.0;
      const w1 = Math.sqrt(9.81 / len);
      const w2 = Math.sqrt(9.81 / len + (2 * kc) / m);
      const wBeat = (w2 - w1) / 2;
      const wAvg = (w1 + w2) / 2;
      const th1 = 0.42 * Math.cos(wBeat * t) * Math.cos(wAvg * t);
      const th2 = -0.42 * Math.sin(wBeat * t) * Math.sin(wAvg * t);

      pushTelemetry({
        metric1Label: 'Tần số góc ω₁ / ω₂',
        metric1Val: `${w1.toFixed(2)} / ${w2.toFixed(2)} rad/s`,
        metric2Label: 'Chu kì truyền phách (T_tr)',
        metric2Val: `${(Math.PI / Math.max(0.05, w2 - w1)).toFixed(2)} s`,
        metric3Label: 'Biên độ con lắc 1 vs 2',
        metric3Val: `${Math.abs(Math.cos(wBeat * t) * 100).toFixed(0)}% / ${Math.abs(Math.sin(wBeat * t) * 100).toFixed(0)}%`,
        note: 'Năng lượng dao động chuyển toàn phần từ Con lắc 1 sang Con lắc 2 và đảo lại.'
      });

      const beamY = h * 0.16;
      const x1Base = w * 0.36;
      const x2Base = w * 0.64;
      const ropePx = h * 0.56;
      const b1x = x1Base + Math.sin(th1) * ropePx;
      const b1y = beamY + Math.cos(th1) * ropePx;
      const b2x = x2Base + Math.sin(th2) * ropePx;
      const b2y = beamY + Math.cos(th2) * ropePx;

      // Support beam
      ctx.fillStyle = isDark ? '#475569' : '#334155';
      ctx.fillRect(w * 0.2, beamY - 8, w * 0.6, 8);

      // Rods
      ctx.strokeStyle = txt;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1Base, beamY);
      ctx.lineTo(b1x, b1y);
      ctx.moveTo(x2Base, beamY);
      ctx.lineTo(b2x, b2y);
      ctx.stroke();

      // Coupling spring halfway
      const s1x = (x1Base + b1x) / 2;
      const s1y = (beamY + b1y) / 2;
      const s2x = (x2Base + b2x) / 2;
      const s2y = (beamY + b2y) / 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s1x, s1y);
      for (let i = 1; i < 10; i++) {
        const fx = s1x + ((s2x - s1x) * i) / 10;
        const fy = s1y + ((s2y - s1y) * i) / 10 + (i % 2 === 0 ? -7 : 7);
        ctx.lineTo(fx, fy);
      }
      ctx.lineTo(s2x, s2y);
      ctx.stroke();

      // Bobs
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(b1x, b1y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(b2x, b2y, 18, 0, Math.PI * 2);
      ctx.fill();
      return true;
    }

    // 8. HALL EFFECT
    case 'hall_effect': {
      const I = p.currentI ?? 4.0;
      const B = p.magneticB ?? 1.2;
      const dMm = p.thicknessMm ?? 2.0;
      const uhMv = (I * B) / (dMm * 0.16);

      pushTelemetry({
        metric1Label: 'Hiệu điện thế Hall (U_H)',
        metric1Val: `${uhMv.toFixed(2)} mV`,
        metric2Label: 'Từ trường vuông góc B',
        metric2Val: `${B.toFixed(2)} T`,
        metric3Label: 'Cường độ dòng (I)',
        metric3Val: `${I.toFixed(1)} A · d=${dMm} mm`,
        note: 'Hạt tải điện bị lực Lorentz kéo lệch về một cạnh bản dẫn tạo điện trường Hall cân bằng.'
      });

      const bx = w * 0.22;
      const bw = w * 0.56;
      const by = h * 0.34;
      const bh = h * 0.34;

      // Plate
      ctx.fillStyle = isDark ? 'rgba(30,41,59,0.9)' : 'rgba(203,213,225,0.8)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, bh);

      // B dots
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      for (let i = 0; i < 4; i++) {
        ctx.fillText('⊗ B', bx + (bw * (i + 0.5)) / 4, by - 12);
      }

      // Conventional current I arrow (+) -> (-) left-to-right; electrons drift right-to-left and deflect UP to (-) plate
      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx + 18, by + bh * 0.5);
      ctx.lineTo(bx + bw - 18, by + bh * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + bw - 12, by + bh * 0.5);
      ctx.lineTo(bx + bw - 22, by + bh * 0.5 - 5);
      ctx.lineTo(bx + bw - 22, by + bh * 0.5 + 5);
      ctx.closePath();
      ctx.fill();
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Chiều I →', bx + 8, by + bh * 0.5 - 8);

      // Electrons (e-) drift right -> left (opposite to I) and curve UP toward (−) plate by Lorentz force
      for (let i = 0; i < 16; i++) {
        const px = bx + bw - ((i * 38 + t * Math.abs(I) * 26) % bw);
        const driftNorm = (bx + bw - px) / bw;
        const curve = Math.min(bh * 0.36, driftNorm * (Math.abs(I) * Math.abs(B) * 5.2));
        const py = by + bh * 0.5 - curve + ((i % 3) - 1) * 12;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(px, Math.max(by + 18, Math.min(by + bh - 16, py)), 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top/bottom polarity signs
      ctx.textAlign = 'center';
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('− − − Tích tụ âm (e⁻)', w * 0.5, by + 15);
      ctx.fillStyle = '#10b981';
      ctx.fillText('+ + + Tích tụ dương (U_H)', w * 0.5, by + bh - 8);
      return true;
    }

    // 9. CYCLOTRON ACCELERATOR
    case 'cyclotron_accelerator': {
      const B = p.magneticB ?? 1.5;
      const U = p.gapVoltageKv ?? 40;
      const q = p.chargeQ ?? 1;
      const fMHz = 15.2 * B * q;
      const maxE = (B * B * U * 0.18 * q).toFixed(1);

      pushTelemetry({
        metric1Label: 'Tần số cộng hưởng (f_c)',
        metric1Val: `${fMHz.toFixed(1)} MHz`,
        metric2Label: 'Năng lượng cực đại',
        metric2Val: `${maxE} MeV`,
        metric3Label: 'Điện áp khe chữ D',
        metric3Val: `${U} kV · q=${q}e`,
        note: 'Mỗi nửa vòng qua khe hẹp, hạt nhận thêm năng lượng ΔW = qU khiến bán kính quỹ đạo xoắn lớn dần.'
      });

      const cx = w * 0.5;
      const cy = h * 0.52;
      const maxR = Math.min(w, h) * 0.37;

      // Two Dees
      ctx.fillStyle = isDark ? 'rgba(30,64,175,0.28)' : 'rgba(59,130,246,0.18)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx - 10, cy, maxR, Math.PI / 2, (3 * Math.PI) / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + 10, cy, maxR, -Math.PI / 2, Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spiral track
      const omegaVis = 2.4 + B * 0.9;
      const cyc = (t * omegaVis) % 16;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const maxAngle = 15.5;
      for (let a = 0; a <= maxAngle; a += 0.15) {
        const rr = 12 + (a / maxAngle) * (maxR - 18);
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Accelerated particle
      const pr = 12 + (cyc / 16) * (maxR - 18);
      const px = cx + Math.cos(cyc) * pr;
      const py = cy + Math.sin(cyc) * pr;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(px, py, 6.5, 0, Math.PI * 2);
      ctx.fill();
      return true;
    }

    // 10. ELECTROMAGNET CRANE
    case 'electromagnet_crane': {
      const I = p.currentI ?? 5.0;
      const N = p.turnsN ?? 300;
      const hasCore = Math.round(p.ironCore ?? 1) === 1;
      const bMt = I * (N / 100) * (hasCore ? 18 : 1.2);
      const liftKg = Math.round(bMt * bMt * 0.045);

      pushTelemetry({
        metric1Label: 'Cảm ứng từ cực nam châm (B)',
        metric1Val: `${bMt.toFixed(1)} mT`,
        metric2Label: 'Tải trọng nâng tối đa',
        metric2Val: `${liftKg} kg`,
        metric3Label: 'Cấu hình lõi từ',
        metric3Val: hasCore ? 'Có lõi Sắt non' : 'Không lõi sắt',
        note: 'Lõi sắt non khuếch đại độ từ thẩm hàng chục lần giúp tạo lực hút công nghiệp cực lớn.'
      });

      const cx = w * 0.5;
      const magY = h * 0.25;
      const lifted = liftKg >= 65 && I > 0.2;
      const loadY = lifted ? magY + 116 : h * 0.78;

      // Magnet core
      ctx.fillStyle = hasCore ? '#64748b' : 'transparent';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.fillRect(cx - 32, magY, 64, 92);
      ctx.strokeRect(cx - 32, magY, 64, 92);

      // Coils
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.2;
      const visCoils = Math.min(12, Math.max(4, Math.round(N / 50)));
      for (let i = 0; i < visCoils; i++) {
        const y = magY + 10 + (i * 72) / visCoils;
        ctx.beginPath();
        ctx.moveTo(cx - 40, y);
        ctx.lineTo(cx + 40, y + 4);
        ctx.stroke();
      }

      // Field lines glow when I > 0
      if (I > 0) {
        ctx.strokeStyle = hasCore ? 'rgba(56,189,248,0.55)' : 'rgba(56,189,248,0.25)';
        ctx.lineWidth = 1.6;
        for (let k = 1; k <= 3; k++) {
          ctx.beginPath();
          ctx.ellipse(cx - 52 - k * 14, magY + 46, 18 + k * 12, 54 + k * 12, 0, -Math.PI / 2, Math.PI / 2, true);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(cx + 52 + k * 14, magY + 46, 18 + k * 12, 54 + k * 12, 0, -Math.PI / 2, Math.PI / 2, false);
          ctx.stroke();
        }
      }

      // Iron block load
      ctx.fillStyle = lifted ? '#10b981' : '#ef4444';
      ctx.fillRect(cx - 46, loadY, 92, 42);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(lifted ? 'ĐÃ HÚT NÂNG!' : 'CHƯA ĐỦ LỰC', cx, loadY + 25);
      return true;
    }

    // 11. DIODE RECTIFIER
    case 'diode_rectifier': {
      const u0 = p.acPeakV ?? 12;
      const bridge = Math.round(p.bridgeMode ?? 1) === 1;
      const cap = p.filterCapUf ?? 120;
      const ripple = Math.max(0.1, (u0 * (bridge ? 0.35 : 0.7)) / (1 + cap * 0.035));
      const uDc = Math.max(0, (bridge ? u0 * 0.92 : u0 * 0.45) - ripple * 0.5 + (cap > 0 ? u0 * 0.08 : 0));

      pushTelemetry({
        metric1Label: 'Chế độ chỉnh lưu',
        metric1Val: bridge ? 'Cầu 4 Điốt (2 bán kì)' : '1 Điốt (Nửa chu kì)',
        metric2Label: 'Điện áp DC trung bình',
        metric2Val: `${uDc.toFixed(2)} V`,
        metric3Label: 'Độ gợn sóng ΔU',
        metric3Val: `${ripple.toFixed(2)} V (C=${cap}μF)`,
        note: 'Cầu 4 điốt tận dụng cả 2 nửa chu kì AC; tụ điện C phóng nạp làm phẳng điện áp ra DC.'
      });

      const gx = w * 0.1;
      const gw = w * 0.8;
      const midY = h * 0.54;
      const ampPx = (u0 / 24) * 95;

      // Axes
      ctx.strokeStyle = mut;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(gx, midY);
      ctx.lineTo(gx + gw, midY);
      ctx.stroke();

      // AC Input dashed
      ctx.strokeStyle = 'rgba(148,163,184,0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i <= gw; i += 3) {
        const ph = (i / gw) * Math.PI * 6 - t * 3.0;
        const y = midY - Math.sin(ph) * ampPx;
        if (i === 0) ctx.moveTo(gx + i, y);
        else ctx.lineTo(gx + i, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Rectified + Filtered output
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      const capFactor = Math.min(0.92, cap / 320);
      for (let i = 0; i <= gw; i += 2) {
        const ph = (i / gw) * Math.PI * 6 - t * 3.0;
        const raw = bridge ? Math.abs(Math.sin(ph)) : Math.max(0, Math.sin(ph));
        const smoothed = raw * (1 - capFactor) + capFactor * (0.88 + 0.12 * raw);
        const y = midY - smoothed * ampPx;
        if (i === 0) ctx.moveTo(gx + i, y);
        else ctx.lineTo(gx + i, y);
      }
      ctx.stroke();

      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Nét đứt: AC vào · Xanh: Điện áp DC sau Điốt + Tụ lọc C', gx, 28);
      return true;
    }

    // 12. TELESCOPE & MICROSCOPE (2 LENSES)
    case 'telescope_microscope': {
      const f1 = p.f1Cm ?? 10;
      const f2 = p.f2Cm ?? 4;
      const d1 = p.objDistCm ?? 14;
      const k1 = -f1 / (d1 - f1 || 0.2);
      const d1p = (d1 * f1) / (d1 - f1 || 0.2);

      pushTelemetry({
        metric1Label: 'Độ phóng đại vật kính |k₁|',
        metric1Val: `${Math.abs(k1).toFixed(2)}×`,
        metric2Label: 'Vị trí ảnh trung gian d₁\'',
        metric2Val: `${d1p.toFixed(1)} cm`,
        metric3Label: 'Bội giác ước lượng G',
        metric3Val: `${(Math.abs(k1) * (25 / f2)).toFixed(1)}×`,
        note: 'Vật kính L₁ tạo ảnh thật trung gian nằm trong tiêu cự thị kính L₂ để mắt quan sát ảnh ảo phóng đại.'
      });

      const axY = h * 0.54;
      const l1X = w * 0.42;
      const l2X = w * 0.74;
      const objX = Math.max(36, l1X - d1 * 6.5);
      const objH = 38;

      // Optical axis
      ctx.strokeStyle = mut;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(20, axY);
      ctx.lineTo(w - 20, axY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw 2 lenses
      [
        { x: l1X, hLens: 92, label: `L₁ (f₁=${f1}cm)` },
        { x: l2X, hLens: 112, label: `L₂ (f₂=${f2}cm)` }
      ].forEach((ln) => {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ln.x, axY - ln.hLens);
        ctx.lineTo(ln.x, axY + ln.hLens);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ln.label, ln.x, axY + ln.hLens + 16);
      });

      // Object arrow
      drawVec(ctx, objX, axY, objX, axY - objH, '#10b981', 'AB');

      // Intermediate image
      const img1X = Math.min(l2X - 18, Math.max(l1X + 45, l1X + d1p * 4.2));
      const img1H = Math.max(-95, Math.min(95, k1 * objH));
      drawVec(ctx, img1X, axY, img1X, axY - img1H, '#f59e0b', "A₁B₁");

      // Principal rays
      ctx.strokeStyle = 'rgba(245,158,11,0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(objX, axY - objH);
      ctx.lineTo(l1X, axY - objH);
      ctx.lineTo(img1X, axY - img1H);
      ctx.lineTo(l2X, axY - img1H * 1.15);
      ctx.lineTo(w - 24, axY - img1H * 1.55);
      ctx.moveTo(objX, axY - objH);
      ctx.lineTo(l1X, axY);
      ctx.lineTo(img1X, axY - img1H);
      ctx.stroke();
      return true;
    }

    // 13. THIN FILM INTERFERENCE
    case 'thin_film_interference': {
      const dNm = p.thicknessNm ?? 260;
      const nFilm = p.filmIndexN ?? 1.38;
      const lam = p.wavelengthNm ?? 550;
      const phaseDiff = (4 * Math.PI * nFilm * dNm) / lam + Math.PI;
      const reflIntensity = Math.pow(Math.cos(phaseDiff / 2), 2) * 100;

      pushTelemetry({
        metric1Label: 'Cường độ phản xạ tương đối',
        metric1Val: `${reflIntensity.toFixed(1)}%`,
        metric2Label: 'Quang lộ hiệu dụng (2nd)',
        metric2Val: `${(2 * nFilm * dNm).toFixed(0)} nm`,
        metric3Label: 'Trạng thái giao thoa',
        metric3Val: reflIntensity > 70 ? 'Tăng cường sáng rực' : reflIntensity < 25 ? 'Triệt tiêu chống lóa!' : 'Trung gian',
        note: `Hai tia phản xạ mặt trên & mặt dưới giao thoa: hiệu pha ${((phaseDiff % (2 * Math.PI)) / Math.PI).toFixed(2)}π.`
      });

      const fTop = h * 0.42;
      const fThick = Math.max(24, (dNm / 700) * 110);
      const tint = lam < 470 ? '#818cf8' : lam < 560 ? '#34d399' : '#fbbf24';

      // Film layer
      ctx.fillStyle = isDark ? 'rgba(56,189,248,0.22)' : 'rgba(56,189,248,0.28)';
      ctx.fillRect(w * 0.14, fTop, w * 0.72, fThick);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(w * 0.14, fTop, w * 0.72, fThick);

      // Incident & reflected rays
      const hit1X = w * 0.36;
      const hit2X = hit1X + fThick * 0.45;
      const exitX = hit2X + fThick * 0.45;

      ctx.strokeStyle = tint;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(hit1X - 95, fTop - 85);
      ctx.lineTo(hit1X, fTop);
      ctx.lineTo(hit1X + 95, fTop - 85); // Ray 1
      ctx.moveTo(hit1X, fTop);
      ctx.lineTo(hit2X, fTop + fThick);
      ctx.lineTo(exitX, fTop);
      ctx.lineTo(exitX + 95, fTop - 85); // Ray 2
      ctx.stroke();

      // Interference patch swatch
      ctx.fillStyle = tint;
      ctx.globalAlpha = 0.25 + (reflIntensity / 100) * 0.75;
      ctx.fillRect(w * 0.76, fTop - 70, 56, 46);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = txt;
      ctx.strokeRect(w * 0.76, fTop - 70, 56, 46);
      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`I=${reflIntensity.toFixed(0)}%`, w * 0.76 + 28, fTop - 43);
      return true;
    }

    // 14. COMPTON SCATTERING
    case 'compton_scattering': {
      const theta = p.scatterAngleDeg ?? 90;
      const lam0 = p.incidentPm ?? 40;
      const thRad = (theta * Math.PI) / 180;
      const dLam = 2.426 * (1 - Math.cos(thRad));
      const lamOut = lam0 + dLam;

      pushTelemetry({
        metric1Label: 'Độ dịch bước sóng (Δλ)',
        metric1Val: `+${dLam.toFixed(2)} pm`,
        metric2Label: 'Bước sóng tán xạ (λ\')',
        metric2Val: `${lamOut.toFixed(2)} pm`,
        metric3Label: 'Năng lượng electron giật lùi',
        metric3Val: `${(((1240 / lam0 - 1240 / lamOut) * 1000)).toFixed(1)} keV`,
        note: 'Bước sóng tăng sau va chạm chứng tỏ Photon mang xung lượng p = h/λ như hạt.'
      });

      const cx = w * 0.48;
      const cy = h * 0.5;
      const cyc = (t * 0.9) % 2.6;

      // Target electron
      if (cyc < 1.2) {
        const px = 40 + (cyc / 1.2) * (cx - 40);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = Math.max(30, px - 55); x <= px; x += 3) {
          const y = cy + Math.sin(x * 0.35 - t * 12) * 8;
          if (x === Math.max(30, px - 55)) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const dt = cyc - 1.2;
        const phDist = dt * 135;
        const elDist = dt * (45 + theta * 0.6);
        const phX = cx + Math.cos(thRad) * phDist;
        const phY = cy - Math.sin(thRad) * phDist;
        const elAng = -thRad * 0.42;
        const elX = cx + Math.cos(elAng) * elDist;
        const elY = cy - Math.sin(elAng) * elDist;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(phX, phY);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(elX, elY, 8, 0, Math.PI * 2);
        ctx.fill();
        drawVec(ctx, cx, cy, elX, elY, '#10b981', 'e⁻');
      }
      return true;
    }

    // 15. FIBER OPTIC TIR
    case 'fiber_optic_tir': {
      const n1 = p.nCore ?? 1.52;
      const n2 = Math.min(n1 - 0.02, p.nClad ?? 1.36);
      const launchDeg = p.launchAngleDeg ?? p.incidenceDeg ?? 22;
      const iCrit = (Math.asin(n2 / n1) * 180) / Math.PI;
      const iWall = 90 - launchDeg;
      const isTir = iWall >= iCrit;

      pushTelemetry({
        metric1Label: 'Góc giới hạn (i_gh)',
        metric1Val: `${iCrit.toFixed(1)}°`,
        metric2Label: 'Góc tới thành lõi',
        metric2Val: `${iWall.toFixed(1)}°`,
        metric3Label: 'Trạng thái dẫn sáng',
        metric3Val: isTir ? 'Phản xạ toàn phần 100%' : 'Bị khúc xạ thất thoát!',
        note: `Điều kiện dẫn sáng trong lõi cáp quang: góc tới thành ống ${iWall.toFixed(1)}° ≥ ${iCrit.toFixed(1)}°.`
      });

      const topY = h * 0.34;
      const botY = h * 0.66;
      const midY = h * 0.5;
      const xStart = w * 0.1;
      const xEnd = w * 0.9;

      // Cladding & core
      ctx.fillStyle = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(203,213,225,0.5)';
      ctx.fillRect(xStart, topY - 22, xEnd - xStart, botY - topY + 44);
      ctx.fillStyle = isDark ? 'rgba(14,165,233,0.18)' : 'rgba(56,189,248,0.22)';
      ctx.fillRect(xStart, topY, xEnd - xStart, botY - topY);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(xStart, topY, xEnd - xStart, botY - topY);

      // Zigzag path
      const slope = Math.tan((launchDeg * Math.PI) / 180);
      ctx.strokeStyle = isTir ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      let cx = xStart;
      let cy = midY;
      let dir = -1;
      ctx.moveTo(cx, cy);
      for (let bounce = 0; bounce < 10 && cx < xEnd; bounce++) {
        const targetY = dir < 0 ? topY : botY;
        const stepX = Math.abs(targetY - cy) / Math.max(0.12, slope);
        const nx = Math.min(xEnd, cx + stepX);
        const ny = cy + dir * (nx - cx) * slope;
        ctx.lineTo(nx, ny);
        if (!isTir && nx < xEnd) {
          ctx.lineTo(nx + 40, ny + dir * 48);
          break;
        }
        cx = nx;
        cy = ny;
        dir *= -1;
      }
      ctx.stroke();
      return true;
    }

    // 16. CARNOT CYCLE P-V
    case 'carnot_cycle_pv': {
      const th = p.tempHotK ?? 800;
      const tc = Math.min(th - 50, p.tempColdK ?? 300);
      const eff = (1 - tc / th) * 100;

      pushTelemetry({
        metric1Label: 'Hiệu suất Carnot (H)',
        metric1Val: `${eff.toFixed(1)}%`,
        metric2Label: 'Nhiệt độ nguồn nóng / lạnh',
        metric2Val: `${th} K / ${tc} K`,
        metric3Label: 'Công sinh ra trên chu trình',
        metric3Val: `${((th - tc) * 0.012).toFixed(2)} kJ/chu kì`,
        note: 'Chu trình thuận chiều kim đồng hồ: Giãn đẳng nhiệt (nóng) → Giãn đoạn nhiệt → Nén đẳng nhiệt (lạnh) → Nén đoạn nhiệt.'
      });

      const ox = w * 0.18;
      const oy = h * 0.8;
      const gw = w * 0.66;
      const gh = h * 0.58;

      ctx.strokeStyle = mut;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ox, oy - gh);
      ctx.lineTo(ox, oy);
      ctx.lineTo(ox + gw, oy);
      ctx.stroke();

      // Carnot loop points normalized
      const A = { x: ox + gw * 0.16, y: oy - gh * 0.85 };
      const B = { x: ox + gw * 0.48, y: oy - gh * 0.52 };
      const C = { x: ox + gw * 0.84, y: oy - gh * (0.16 + 0.15 * (tc / 420)) };
      const D = { x: ox + gw * 0.44, y: oy - gh * (0.34 + 0.18 * (tc / 420)) };

      ctx.fillStyle = 'rgba(245,158,11,0.16)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo((A.x + B.x) * 0.48, (A.y + B.y) * 0.56, B.x, B.y);
      ctx.quadraticCurveTo((B.x + C.x) * 0.5, (B.y + C.y) * 0.54, C.x, C.y);
      ctx.quadraticCurveTo((C.x + D.x) * 0.5, (C.y + D.y) * 0.52, D.x, D.y);
      ctx.quadraticCurveTo((D.x + A.x) * 0.5, (D.y + A.y) * 0.46, A.x, A.y);
      ctx.fill();
      ctx.stroke();

      // Operating state dot moving along cycle
      const s = (t * 0.7) % 4;
      const pts = [A, B, C, D];
      const p0 = pts[Math.floor(s)];
      const p1 = pts[(Math.floor(s) + 1) % 4];
      const frac = s - Math.floor(s);
      const dx = p0.x + (p1.x - p0.x) * frac;
      const dy = p0.y + (p1.y - p0.y) * frac;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(dx, dy, 6.5, 0, Math.PI * 2);
      ctx.fill();
      return true;
    }

    // 17. THERMAL CONDUCTION BAR (FOURIER)
    case 'thermal_conduction_bar': {
      const t1 = p.tempLeftC ?? 100;
      const t2 = p.tempRightC ?? 20;
      const kCond = p.conductivity ?? 380;
      const flux = (kCond * 0.002 * (t1 - t2)) / 0.5;

      pushTelemetry({
        metric1Label: 'Công suất dòng nhiệt (Φ)',
        metric1Val: `${flux.toFixed(1)} W`,
        metric2Label: 'Chênh lệch nhiệt độ ΔT',
        metric2Val: `${(t1 - t2).toFixed(0)} °C`,
        metric3Label: 'Độ dẫn nhiệt vật liệu λ',
        metric3Val: `${kCond} W/(m·K)`,
        note: 'Khi ổn định nhiệt, nhiệt độ dọc thanh giảm tuyến tính từ đầu nóng sang đầu lạnh.'
      });

      const bx = w * 0.18;
      const bw = w * 0.64;
      const by = h * 0.42;
      const bh = 46;

      const grad = ctx.createLinearGradient(bx, by, bx + bw, by);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#3b82f6');
      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = txt;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(bx, by, bw, bh);

      // Heat flow particles
      const flowN = 8;
      for (let i = 0; i < flowN; i++) {
        const px = bx + ((i * (bw / flowN) + t * (kCond * 0.25)) % bw);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(px, by + bh / 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = txt;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`T₁ = ${t1}°C`, bx, by - 12);
      ctx.fillText(`T₂ = ${t2}°C`, bx + bw, by - 12);
      return true;
    }

    // 18. BINDING ENERGY CURVE
    case 'binding_energy_curve': {
      const A = p.massNumberA ?? 56;
      const boost = p.fusionBoost ?? 1.0;
      const calcBep = (aVal: number) => {
        if (aVal <= 4) return 1.1 + aVal * 1.48;
        if (aVal < 56) return 8.8 - 1.9 * Math.pow((56 - aVal) / 52, 1.8);
        return Math.max(6.8, 8.8 - 1.3 * ((aVal - 56) / 182));
      };
      const bep = calcBep(A);
      const region = A < 25 ? 'Vùng Nhiệt Hạch (Tổng hợp)' : A <= 85 ? 'Vùng Bền Vững Cực Đại' : 'Vùng Phân Hạch';

      pushTelemetry({
        metric1Label: 'Năng lượng liên kết riêng (W_lkr)',
        metric1Val: `${bep.toFixed(2)} MeV/nuclôn`,
        metric2Label: 'Tổng năng lượng liên kết',
        metric2Val: `${(bep * A).toFixed(0)} MeV`,
        metric3Label: 'Phân vùng hạt nhân',
        metric3Val: region,
        note: `Hạt nhân A=${A}: càng gần ⁵⁶Fe (8.8 MeV/nuclôn) hạt nhân càng bền vững.`
      });

      const gx = w * 0.14;
      const gy = h * 0.82;
      const gw = w * 0.74;
      const gh = h * 0.62;

      ctx.strokeStyle = mut;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(gx, gy - gh);
      ctx.lineTo(gx, gy);
      ctx.lineTo(gx + gw, gy);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      for (let aCur = 2; aCur <= 238; aCur += 2) {
        const px = gx + ((aCur - 2) / 236) * gw;
        const val = calcBep(aCur) * Math.min(1.15, boost);
        const py = gy - (val / 10.0) * gh;
        if (aCur === 2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Active nucleus marker
      const mx = gx + ((A - 2) / 236) * gw;
      const my = gy - (bep * Math.min(1.15, boost) / 10.0) * gh;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(mx, my, 7 + Math.sin(t * 4) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`A=${A} (${bep.toFixed(2)} MeV/nu)`, Math.min(w - 135, mx + 10), Math.max(30, my - 8));
      return true;
    }

    // 19. ELECTRIC POWER & KWH METER (P = UI, A = UIt, H = R/(R+r))
    case 'electric_power_meter': {
      const emf = p.emfV ?? 220;
      const rLoad = p.loadR ?? 110;
      const rInt = p.internalR ?? 0;
      const curI = emf / Math.max(1, rLoad + rInt);
      const uOut = curI * rLoad;
      const pLoad = uOut * curI;
      const eff = (rLoad / Math.max(1, rLoad + rInt)) * 100;
      const energyKwh = (pLoad * t * 0.25) / 1000;

      pushTelemetry({
        metric1Label: 'Cường độ & Hiệu điện thế',
        metric1Val: `I = ${curI.toFixed(2)} A · U = ${uOut.toFixed(1)} V`,
        metric2Label: 'Công suất tải P = UI',
        metric2Val: `${pLoad.toFixed(1)} W`,
        metric3Label: 'Điện năng & Hiệu suất',
        metric3Val: `${energyKwh.toFixed(3)} kWh · H = ${eff.toFixed(0)}%`,
        note: `1 kWh = 3,6·10⁶ J. ${rInt > 0 ? `Khi R = r = ${rInt}Ω công suất mạch ngoài đạt cực đại E²/(4r)!` : 'Công tơ quay nhanh tỉ lệ thuận với công suất tiêu thụ P = U·I.'}`
      });

      const cx = w * 0.14;
      const cy = h * 0.2;
      const cw = w * 0.72;
      const ch = h * 0.6;

      // Circuit loop
      ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, cy, cw, ch);

      // Moving charge dots along circuit clockwise (+ to -)
      const perim = 2 * (cw + ch);
      const chargeSpeed = 30 + Math.min(180, curI * 18);
      for (let i = 0; i < 16; i++) {
        const d = ((i / 16) * perim + t * chargeSpeed) % perim;
        let px = cx;
        let py = cy;
        if (d < cw) {
          px = cx + d;
          py = cy;
        } else if (d < cw + ch) {
          px = cx + cw;
          py = cy + (d - cw);
        } else if (d < 2 * cw + ch) {
          px = cx + cw - (d - cw - ch);
          py = cy + ch;
        } else {
          px = cx;
          py = cy + ch - (d - 2 * cw - ch);
        }
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // DC / AC Source box on left branch
      ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
      ctx.fillRect(cx - 28, cy + ch * 0.3, 56, ch * 0.4);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 28, cy + ch * 0.3, 56, ch * 0.4);
      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`E=${emf}V`, cx, cy + ch * 0.48);
      ctx.fillStyle = mut;
      ctx.font = '10px monospace';
      ctx.fillText(`r=${rInt}Ω`, cx, cy + ch * 0.62);

      // kWh meter box on top branch
      const mx = cx + cw * 0.36;
      const my = cy - 42;
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = isDark ? '#64748b' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(mx, my, 128, 76, 8);
      ctx.fill();
      ctx.stroke();

      // Digital kWh window
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(mx + 14, my + 10, 100, 22);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`${energyKwh.toFixed(3)} kWh`, mx + 64, my + 25);

      // Spinning aluminum meter disc
      const discX = mx + 64;
      const discY = my + 52;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(discX - 42, discY - 4, 84, 8);
      const stripeX = discX + Math.sin(t * Math.min(18, 1.5 + pLoad * 0.015)) * 36;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(stripeX - 4, discY - 5, 8, 10);
      ctx.fillStyle = txt;
      ctx.font = '10px sans-serif';
      ctx.fillText('Công tơ kWh', mx + 64, my + 70);

      // Load lamp / resistor on right branch
      const lx = cx + cw;
      const ly = cy + ch * 0.5;
      const glow = Math.min(1, pLoad / 800);
      const radGlow = 26 + glow * 44;
      const grad = ctx.createRadialGradient(lx, ly, 4, lx, ly, radGlow);
      grad.addColorStop(0, `rgba(253, 224, 71, ${0.4 + glow * 0.55})`);
      grad.addColorStop(0.6, `rgba(251, 146, 60, ${0.15 + glow * 0.35})`);
      grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, radGlow, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isDark ? '#1e293b' : '#fef9c3';
      ctx.strokeStyle = glow > 0.3 ? '#facc15' : '#94a3b8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(lx, ly, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Filament inside lamp
      ctx.strokeStyle = glow > 0.2 ? '#f59e0b' : '#64748b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(lx - 10, ly + 8);
      ctx.lineTo(lx - 5, ly - 6);
      ctx.lineTo(lx, ly + 4);
      ctx.lineTo(lx + 5, ly - 6);
      ctx.lineTo(lx + 10, ly + 8);
      ctx.stroke();

      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Tải R = ${rLoad}Ω`, lx, ly + 42);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`P = ${pLoad.toFixed(0)} W`, lx, ly + 56);

      // Efficiency meter at bottom
      ctx.fillStyle = mut;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Hiệu suất nguồn H = U/E = ${eff.toFixed(1)}% · Ampe kế A = ${curI.toFixed(2)} A`, cx + cw * 0.5, cy + ch + 22);
      return true;
    }

    // 20. DC MOTOR & ELECTROMAGNETIC COUPLE 2D
    case 'dc_motor_2d': {
      const curI = p.currentI ?? 4.0;
      const B = p.magneticB ?? 0.8;
      const turns = p.coilTurns ?? 40;
      const omega = 0.8 + curI * B * 0.32;
      const theta = t * omega;
      const maxTorque = turns * B * curI * 0.015;
      const instTorque = Math.abs(Math.cos(theta)) * maxTorque;
      const fSingle = B * curI * 0.25;

      pushTelemetry({
        metric1Label: 'Lực điện từ F = B·I·l',
        metric1Val: `${fSingle.toFixed(2)} N`,
        metric2Label: 'Mômen ngẫu lực cực đại',
        metric2Val: `${maxTorque.toFixed(2)} N·m`,
        metric3Label: 'Mômen tức thời & Tốc độ',
        metric3Val: `${instTorque.toFixed(2)} N·m · ${(omega * 9.55).toFixed(0)} rpm`,
        note: 'Cổ góp bán khuyên đảo chiều dòng điện mỗi 180° giúp khung dây quay liên tục cùng một chiều!'
      });

      const cx = w * 0.5;
      const cy = h * 0.46;

      // Magnetic poles N (left) and S (right)
      const magW = 54;
      const magH = 126;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(cx - 175, cy - magH / 2, magW, magH, 8);
      ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(cx + 175 - magW, cy - magH / 2, magW, magH, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('N', cx - 175 + magW / 2, cy + 7);
      ctx.fillText('S', cx + 175 - magW / 2, cy + 7);

      // Horizontal magnetic field B lines (N -> S)
      ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.35)' : 'rgba(2,132,199,0.28)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 4]);
      for (let dy = -44; dy <= 44; dy += 22) {
        ctx.beginPath();
        ctx.moveTo(cx - 116, cy + dy);
        ctx.lineTo(cx + 116, cy + dy);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`B = ${B.toFixed(1)} T →`, cx, cy - 72);

      // Rotating rectangular coil projection (seen along rotation axis with 3D perspective width)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const halfSpan = 82 * cosT;
      const zTilt = 26 * sinT;

      const ax = cx - halfSpan;
      const ay = cy - 42 - zTilt * 0.35;
      const bx = cx + halfSpan;
      const by = cy - 42 + zTilt * 0.35;
      const cxPt = cx + halfSpan;
      const cyPt = cy + 48 + zTilt * 0.35;
      const dx = cx - halfSpan;
      const dy = cy + 48 - zTilt * 0.35;

      // Coil frame
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ax, ay + 6);
      ctx.lineTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cxPt, cyPt);
      ctx.lineTo(dx, dy);
      ctx.stroke();

      // Lorentz force couple vectors F1 (left side) and F2 (right side)
      const dirSign = cosT >= 0 ? 1 : -1;
      const fLen = 30 + curI * B * 2.5;
      drawVec(ctx, ax, cy, ax, cy - dirSign * fLen, '#10b981', 'F₁');
      drawVec(ctx, bx, cy, bx, cy + dirSign * fLen, '#ec4899', 'F₂');

      // Split-ring commutator + carbon brushes below coil
      const comY = cy + 88;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, comY, 16, theta + 0.25, theta + Math.PI - 0.25);
      ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, comY, 16, theta + Math.PI + 0.25, theta + 2 * Math.PI - 0.25);
      ctx.stroke();

      // Carbon brushes
      ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
      ctx.fillRect(cx - 26, comY - 5, 10, 10);
      ctx.fillRect(cx + 16, comY - 5, 10, 10);
      ctx.fillStyle = mut;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Cổ góp bán khuyên · I = ${curI.toFixed(1)} A · N = ${turns} vòng`, cx, comY + 34);
      return true;
    }

    // 21. ELECTROLYSIS & FARADAY'S LAW
    case 'electrolysis_faraday': {
      const curI = p.currentI ?? 4.0;
      const durMin = p.durationMin ?? 16;
      const A = p.molarMass ?? 64;
      const nVal = A >= 100 ? 1 : A <= 30 ? 3 : 2; // Cu=64(2), Ag=108(1), Al=27(3)
      const tSec = durMin * 60;
      const mGram = (1 / 96500) * (A / nVal) * curI * tSec;
      const prog = Math.min(1, (t % 12) / 12);

      pushTelemetry({
        metric1Label: 'Đương lượng điện hóa k = A/(Fn)',
        metric1Val: `${((A / nVal) / 96500 * 1000).toFixed(3)} mg/C`,
        metric2Label: 'Khối lượng bám Catôt m',
        metric2Val: `${mGram.toFixed(2)} g`,
        metric3Label: 'Điện lượng Q = I·t',
        metric3Val: `${(curI * tSec).toFixed(0)} C (${durMin} ph)`,
        note: `Ion dương (M^${nVal}+) tiến về Catôt (−) nhận electron kết tủa thành kim loại óng ánh.`
      });

      const bx = w * 0.22;
      const bw = w * 0.56;
      const by = h * 0.28;
      const bh = h * 0.56;

      // Electrolyte liquid
      ctx.fillStyle = A >= 100 ? 'rgba(148, 163, 184, 0.25)' : 'rgba(14, 165, 233, 0.28)';
      ctx.fillRect(bx, by + 26, bw, bh - 26);

      // Glass vat
      ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by);
      ctx.stroke();

      // Anode (+) left - eroding
      const erode = prog * 5;
      const anodeX = bx + bw * 0.22;
      ctx.fillStyle = '#d97706';
      ctx.fillRect(anodeX + erode * 0.4, by - 16, Math.max(12, 22 - erode), bh - 8);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Anôt (+)', anodeX + 10, by - 24);

      // Cathode (-) right - plating thicker over time
      const catX = bx + bw * 0.72;
      const coat = 2 + prog * 10 * Math.min(1.5, mGram / 4 + 0.3);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(catX, by - 16, 20, bh - 8);
      ctx.fillStyle = A >= 100 ? '#e2e8f0' : '#f59e0b';
      ctx.fillRect(catX - coat * 0.4, by + 26, 20 + coat * 0.8, bh - 50);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Catôt (−)', catX + 10, by - 24);

      // Battery bridge on top
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(anodeX + 10, by - 16);
      ctx.lineTo(anodeX + 10, by - 52);
      ctx.lineTo(catX + 10, by - 52);
      ctx.lineTo(catX + 10, by - 16);
      ctx.stroke();
      ctx.fillStyle = isDark ? '#0f172a' : '#f1f5f9';
      ctx.fillRect(w * 0.5 - 48, by - 66, 96, 26);
      ctx.strokeRect(w * 0.5 - 48, by - 66, 96, 26);
      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Nguồn DC · ${curI}A`, w * 0.5, by - 49);

      // Cations moving left -> right (Anode -> Cathode), Anions right -> left
      for (let i = 0; i < 10; i++) {
        const speed = 28 + curI * 10;
        const frac = ((i * 0.1 + t * speed * 0.004) % 1);
        const ix = anodeX + 24 + frac * (catX - anodeX - 32);
        const iy = by + 48 + ((i * 37) % Math.max(40, bh - 80));
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(ix, iy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('+', ix, iy + 3);
      }
      for (let i = 0; i < 8; i++) {
        const speed = 22 + curI * 8;
        const frac = ((i * 0.125 + t * speed * 0.004) % 1);
        const ax = catX - 10 - frac * (catX - anodeX - 34);
        const ay = by + 62 + ((i * 43) % Math.max(40, bh - 95));
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.arc(ax, ay, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('−', ax, ay + 3);
      }

      ctx.fillStyle = txt;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`m bám Catôt = ${mGram.toFixed(2)} g (Đang tăng dần ${(prog * 100).toFixed(0)}%)`, w * 0.5, by + bh + 24);
      return true;
    }

    // 22. HUMAN EYE OPTICS & VISION CORRECTION 2D
    case 'eye_optics_2d': {
      const defect = Math.round(p.eyeDefect ?? 1); // 0: Normal, 1: Myopia, 2: Hyperopia
      const useGlass = (p.useGlass ?? 0) >= 0.5;
      const objDist = p.objDistCm ?? 60;

      const defectName = defect === 0 ? 'Mắt thường (Chính thị)' : defect === 1 ? 'Mắt Cận thị (Hội tụ trước)' : 'Mắt Viễn thị (Hội tụ sau)';
      const statusText =
        defect === 0
          ? 'Ảnh hiện rõ nét trên võng mạc'
          : useGlass
          ? defect === 1
            ? 'Đã đeo Kính Phân kì → Hội tụ ĐÚNG võng mạc!'
            : 'Đã đeo Kính Hội tụ → Hội tụ ĐÚNG võng mạc!'
          : defect === 1
          ? 'Ảnh hội tụ TRƯỚC võng mạc (Nhìn xa mờ)'
          : 'Ảnh hội tụ SAU võng mạc (Nhìn gần mờ)';

      pushTelemetry({
        metric1Label: 'Trạng thái mắt',
        metric1Val: defectName,
        metric2Label: 'Kính sửa tật',
        metric2Val: useGlass ? (defect === 1 ? 'Phân kì (-)' : defect === 2 ? 'Hội tụ (+)' : 'Không cần') : 'Chưa đeo kính',
        metric3Label: 'Kết quả ảnh',
        metric3Val: statusText,
        note: 'Mắt cận có tiêu cự thủy tinh thể quá ngắn (hội tụ trước võng mạc) → sửa bằng thấu kính phân kì!'
      });

      const eyeCx = w * 0.72;
      const eyeCy = h * 0.5;
      const eyeR = Math.min(w, h) * 0.24;
      const lensX = eyeCx - eyeR * 0.78;
      const retinaX = eyeCx + eyeR * 0.94;
      const glassX = lensX - 58;

      // Optical axis
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.4)' : 'rgba(71,85,105,0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(30, eyeCy);
      ctx.lineTo(w - 20, eyeCy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Eyeball shell
      ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(224, 242, 254, 0.45)';
      ctx.strokeStyle = isDark ? '#94a3b8' : '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(eyeCx, eyeCy, eyeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Retina arc (glowing amber on back wall)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(eyeCx, eyeCy, eyeR - 3, -0.55, 0.55);
      ctx.stroke();

      // Crystalline lens inside front of eye
      ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(lensX, eyeCy, 11, eyeR * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Corrective eyeglass if enabled
      if (useGlass && defect !== 0) {
        ctx.strokeStyle = defect === 1 ? '#ec4899' : '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (defect === 1) {
          // Concave diverging lens silhouette
          ctx.moveTo(glassX - 7, eyeCy - 46);
          ctx.quadraticCurveTo(glassX + 2, eyeCy, glassX - 7, eyeCy + 46);
          ctx.lineTo(glassX + 7, eyeCy + 46);
          ctx.quadraticCurveTo(glassX - 2, eyeCy, glassX + 7, eyeCy - 46);
          ctx.closePath();
        } else {
          // Convex converging lens silhouette
          ctx.ellipse(glassX, eyeCy, 7, 46, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
      }

      // Compute ray focus X
      let focusX = retinaX;
      if (!useGlass) {
        if (defect === 1) focusX = eyeCx + eyeR * 0.28; // before retina
        if (defect === 2) focusX = retinaX + eyeR * 0.45; // behind retina
      }

      const srcX = Math.max(40, glassX - Math.min(180, objDist * 0.9));
      const raySpreadY = 34;

      // Incoming rays (from distant/near object)
      const inShift = useGlass && defect === 1 ? 8 : useGlass && defect === 2 ? -6 : 0;
      [-1, 1].forEach((sgn) => {
        const yIn = sgn * raySpreadY * 0.72;
        const yAtGlass = eyeCy + yIn;
        const yAtLens = eyeCy + yIn + sgn * inShift;

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(srcX, eyeCy + yIn * 0.45);
        if (useGlass && defect !== 0) {
          ctx.lineTo(glassX, yAtGlass);
        }
        ctx.lineTo(lensX, yAtLens);
        ctx.lineTo(focusX, eyeCy);
        // Continue lightly if focused before retina
        if (focusX < retinaX) {
          const slope = (eyeCy - yAtLens) / Math.max(10, focusX - lensX);
          ctx.lineTo(retinaX, eyeCy + slope * (retinaX - focusX));
        }
        ctx.stroke();
      });

      // Focal point dot
      ctx.fillStyle = Math.abs(focusX - retinaX) < 3 ? '#10b981' : '#ef4444';
      ctx.beginPath();
      ctx.arc(focusX, eyeCy, 5 + Math.sin(t * 4) * 1.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = txt;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Thủy tinh thể', lensX, eyeCy - eyeR * 0.56);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('Võng mạc', retinaX + 26, eyeCy - 18);
      ctx.fillStyle = Math.abs(focusX - retinaX) < 3 ? '#10b981' : '#ef4444';
      ctx.fillText(statusText, w * 0.5, h * 0.88);
      return true;
    }

    // 23. POWER PLANT (HYDRO / THERMAL) & NATIONAL GRID
    case 'power_plant_generator': {
      const isHydro = (p.hydroMode ?? 1) >= 0.5;
      const head = p.headOrSteam ?? 60;
      const loadMw = p.loadMw ?? 120;
      const rpm = 300 + head * 12;
      const pGen = Math.min(260, (head / 60) * 130);
      const uGridKv = 220;

      pushTelemetry({
        metric1Label: 'Nguồn năng lượng',
        metric1Val: isHydro ? `Thủy điện (H = ${head} m)` : `Nhiệt điện (P_hơi = ${head} atm)`,
        metric2Label: 'Tốc độ Tuabin & Công suất',
        metric2Val: `${rpm.toFixed(0)} rpm · ${pGen.toFixed(0)} MW`,
        metric3Label: 'Truyền tải cao áp',
        metric3Val: `${uGridKv} kV · Tải ${loadMw} MW`,
        note: 'Thế năng nước (hoặc hơi áp suất cao) quay tuabin → máy phát xoay chiều → biến áp nâng áp truyền tải.'
      });

      // Penstock / Boiler on left
      const bx = w * 0.08;
      const by = h * 0.25;
      if (isHydro) {
        // Dam reservoir
        ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
        ctx.fillRect(bx, by, 76, h * 0.55);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.strokeRect(bx, by, 76, h * 0.55);
        // Penstock pipe to turbine
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(bx + 76, by + 30);
        ctx.lineTo(w * 0.34, h * 0.6);
        ctx.stroke();
        // Water pulses inside pipe
        for (let i = 0; i < 5; i++) {
          const prog = ((i * 0.2 + t * 0.8) % 1);
          const wx = bx + 76 + prog * (w * 0.34 - (bx + 76));
          const wy = by + 30 + prog * (h * 0.6 - (by + 30));
          ctx.fillStyle = '#bae6fd';
          ctx.beginPath();
          ctx.arc(wx, wy, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Thermal furnace / boiler
        ctx.fillStyle = isDark ? '#334155' : '#475569';
        ctx.fillRect(bx, by + 20, 78, h * 0.48);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.72)';
        ctx.fillRect(bx + 12, by + h * 0.34, 54, 24 + Math.sin(t * 9) * 4);
        // Steam jet pipe
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(bx + 78, by + 38);
        ctx.lineTo(w * 0.34, h * 0.6);
        ctx.stroke();
        for (let i = 0; i < 6; i++) {
          const prog = ((i * 0.16 + t * 1.1) % 1);
          const sx = bx + 78 + prog * (w * 0.34 - (bx + 78));
          const sy = by + 38 + prog * (h * 0.6 - (by + 38));
          ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spinning Turbine + Generator at center-left
      const tx = w * 0.38;
      const ty = h * 0.6;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(t * (1.8 + head * 0.04));
      for (let b = 0; b < 6; b++) {
        ctx.rotate(Math.PI / 3);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-4, -30, 8, 28);
      }
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Generator housing connected to turbine shaft
      const gx = w * 0.56;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(tx + 14, ty);
      ctx.lineTo(gx - 28, ty);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(gx - 30, ty - 28, 60, 56, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MÁY PHÁT', gx, ty + 4);

      // Step-up transformer & High voltage line to city pylon
      const px = w * 0.78;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(gx + 30, ty - 10);
      ctx.lineTo(px, h * 0.34);
      ctx.lineTo(w * 0.92, h * 0.34);
      ctx.stroke();

      // Power packet pulses along wire
      const packX = gx + 30 + ((t * 95) % (w * 0.92 - (gx + 30)));
      const packY = packX < px ? ty - 10 + ((packX - (gx + 30)) / (px - (gx + 30))) * (h * 0.34 - (ty - 10)) : h * 0.34;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(packX, packY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Transmission Tower
      ctx.strokeStyle = isDark ? '#94a3b8' : '#475569';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(px - 16, h * 0.78);
      ctx.lineTo(px, h * 0.32);
      ctx.lineTo(px + 16, h * 0.78);
      ctx.moveTo(px - 22, h * 0.42);
      ctx.lineTo(px + 22, h * 0.42);
      ctx.stroke();

      ctx.fillStyle = txt;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(isHydro ? 'Thủy điện' : 'Nhiệt điện', bx + 38, by - 10);
      ctx.fillText('Tuabin', tx, ty + 46);
      ctx.fillText('Biến áp & Lưới 220kV', px, h * 0.86);
      return true;
    }

    // 24. FRESNEL ROTATING PHASORS (TỔNG HỢP DAO ĐỘNG ĐIỀU HÒA)
    case 'fresnel_phasor_2d': {
      const a1 = p.amp1 ?? 5;
      const a2 = p.amp2 ?? 4;
      const dPhiDeg = p.deltaPhiDeg ?? 60;
      const freq = p.freqHz ?? 1.0;
      const omega = 2 * Math.PI * freq;
      const phi1 = -0.35;
      const phi2 = phi1 + (dPhiDeg * Math.PI) / 180;
      const aSum = Math.sqrt(a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(phi2 - phi1));
      const rx = a1 * Math.cos(phi1) + a2 * Math.cos(phi2);
      const ry = a1 * Math.sin(phi1) + a2 * Math.sin(phi2);
      const phiSum = Math.atan2(ry, rx);

      const ang1 = omega * t + phi1;
      const ang2 = omega * t + phi2;
      const angSum = omega * t + phiSum;

      pushTelemetry({
        metric1Label: 'Biên độ tổng hợp A',
        metric1Val: `${aSum.toFixed(2)} cm`,
        metric2Label: 'Pha ban đầu φ',
        metric2Val: `${((phiSum * 180) / Math.PI).toFixed(1)}°`,
        metric3Label: 'Li độ tức thời x = x₁ + x₂',
        metric3Val: `${(aSum * Math.cos(angSum)).toFixed(2)} cm`,
        note: `A² = A₁² + A₂² + 2A₁A₂·cos(${dPhiDeg}°) ⇒ ${(aSum * aSum).toFixed(1)} cm².`
      });

      const ocx = w * 0.25;
      const ocy = h * 0.5;
      const scalePx = Math.min(w * 0.19, h * 0.36) / 10;

      // Phasor x-axis & outer circle
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.35)' : 'rgba(71,85,105,0.3)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(ocx - 10 * scalePx, ocy);
      ctx.lineTo(ocx + 10 * scalePx, ocy);
      ctx.moveTo(ocx, ocy - 10 * scalePx);
      ctx.lineTo(ocx, ocy + 10 * scalePx);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
      ctx.beginPath();
      ctx.arc(ocx, ocy, aSum * scalePx, 0, Math.PI * 2);
      ctx.stroke();

      const p1x = ocx + a1 * scalePx * Math.cos(ang1);
      const p1y = ocy - a1 * scalePx * Math.sin(ang1);
      const p2x = ocx + a2 * scalePx * Math.cos(ang2);
      const p2y = ocy - a2 * scalePx * Math.sin(ang2);
      const psx = ocx + aSum * scalePx * Math.cos(angSum);
      const psy = ocy - aSum * scalePx * Math.sin(angSum);

      // Parallelogram dashed guide lines
      ctx.strokeStyle = mut;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(psx, psy);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawVec(ctx, ocx, ocy, p1x, p1y, '#38bdf8', 'A₁');
      drawVec(ctx, ocx, ocy, p2x, p2y, '#10b981', 'A₂');
      drawVec(ctx, ocx, ocy, psx, psy, '#f59e0b', 'A');

      // Right-hand synchronized waveform x1(t), x2(t), x(t)
      const gx = w * 0.5;
      const gw = w * 0.44;
      ctx.strokeStyle = mut;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(gx, ocy);
      ctx.lineTo(gx + gw, ocy);
      ctx.moveTo(gx, ocy - 10 * scalePx);
      ctx.lineTo(gx, ocy + 10 * scalePx);
      ctx.stroke();

      const drawWave = (amp: number, ph0: number, col: string, lw: number) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (let px = 0; px <= gw; px += 4) {
          const dt = (px / gw) * 2.2;
          const val = amp * Math.cos(omega * (t - dt) + ph0);
          const py = ocy - val * scalePx;
          if (px === 0) ctx.moveTo(gx + px, py);
          else ctx.lineTo(gx + px, py);
        }
        ctx.stroke();
      };
      drawWave(a1, phi1, 'rgba(56,189,248,0.65)', 1.6);
      drawWave(a2, phi2, 'rgba(16,185,129,0.65)', 1.6);
      drawWave(aSum, phiSum, '#f59e0b', 2.8);

      ctx.fillStyle = txt;
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Đồ thị x(t) = x₁ + x₂ · A = ${aSum.toFixed(2)} cm`, gx + 8, ocy - 10 * scalePx + 14);
      return true;
    }

    default:
      return renderMiddleSchool2DPhysicsSim(simType, ctx, w, h, t, isDark, p, ov, pushTelemetry);
  }
}
