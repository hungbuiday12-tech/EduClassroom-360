import { PerformanceMode } from '../../context/BackgroundContext';

export type StudioSubjectTheme = 'physics' | 'chemistry' | 'biology';

export interface Studio2DDragState {
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  isHovering?: boolean;
}

export const ZERO_STUDIO_DRAG: Studio2DDragState = {
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
  isHovering: false
};

export interface StudioBackdropOptions {
  subject: StudioSubjectTheme;
  showGrid?: boolean;
  compact?: boolean;
  benchLabel?: string;
  rulerUnit?: string;
}

export interface StudioLightOptions {
  subject: StudioSubjectTheme;
  benchY?: number;
  accentColor?: string;
  intensityScale?: number;
}

const SUBJECT_PALETTE: Record<
  StudioSubjectTheme,
  {
    accentHex: string;
    accentRgb: string;
    secondaryRgb: string;
    darkTop: string;
    darkMid: string;
    darkBot: string;
    lightTop: string;
    lightBot: string;
    defaultBenchLabel: string;
  }
> = {
  physics: {
    accentHex: '#38bdf8',
    accentRgb: '56, 189, 248',
    secondaryRgb: '14, 165, 233',
    darkTop: '#050b16',
    darkMid: '#091529',
    darkBot: '#060d1b',
    lightTop: '#f8fbff',
    lightBot: '#ebf2fa',
    defaultBenchLabel: 'BÀN THÍ NGHIỆM VẬT LÍ · HỆ QUY CHIẾU 2D'
  },
  chemistry: {
    accentHex: '#10b981',
    accentRgb: '16, 185, 129',
    secondaryRgb: '56, 189, 248',
    darkTop: '#050e18',
    darkMid: '#081927',
    darkBot: '#050e17',
    lightTop: '#f6fcf9',
    lightBot: '#eaf5f1',
    defaultBenchLabel: 'MẶT BÀN THÍ NGHIỆM ĐKC (1 BAR · 25°C)'
  },
  biology: {
    accentHex: '#14b8a6',
    accentRgb: '20, 184, 166',
    secondaryRgb: '52, 211, 153',
    darkTop: '#050e16',
    darkMid: '#081b24',
    darkBot: '#040c14',
    lightTop: '#f6fbfb',
    lightBot: '#e8f4f3',
    defaultBenchLabel: 'BÀN KÍNH SINH HỌC · QUAN SÁT VI MÔ'
  }
};

export function getStudioDpr(perfMode: PerformanceMode = 'balanced'): number {
  const raw = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const cap = perfMode === 'ultra' ? 2.5 : perfMode === 'balanced' ? 2.0 : 1.5;
  return Math.max(1, Math.min(raw, cap));
}

export function applyStudioCrispContext(ctx: CanvasRenderingContext2D): void {
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) {
    ctx.imageSmoothingQuality = 'high';
  }
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function getStudioBenchY(h: number, compact = false): number {
  return Math.round(h - (compact ? 26 : 36));
}

/**
 * Draws a crisp, calibrated scientific studio lab backdrop with high-contrast grid,
 * luminous optical bench horizon bar, metallic desk trim, and precision metric ruler.
 */
export function drawStudioLabBackdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dark: boolean,
  perfMode: PerformanceMode,
  opts: StudioBackdropOptions
): number {
  const pal = SUBJECT_PALETTE[opts.subject];
  const compact = opts.compact ?? h < 310;
  const benchY = getStudioBenchY(h, compact);
  const showGrid = opts.showGrid !== false;

  ctx.save();
  applyStudioCrispContext(ctx);

  // 1. Deep multi-stop studio backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  if (dark) {
    bg.addColorStop(0, pal.darkTop);
    bg.addColorStop(0.62, pal.darkMid);
    bg.addColorStop(1, pal.darkBot);
  } else {
    bg.addColorStop(0, pal.lightTop);
    bg.addColorStop(1, pal.lightBot);
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle ambient dome glow behind apparatus
  if (perfMode !== 'smooth') {
    const dome = ctx.createRadialGradient(w * 0.5, benchY * 0.52, 16, w * 0.5, benchY * 0.55, Math.max(w, h) * 0.62);
    dome.addColorStop(0, dark ? `rgba(${pal.accentRgb}, 0.10)` : `rgba(${pal.accentRgb}, 0.07)`);
    dome.addColorStop(0.55, dark ? `rgba(${pal.secondaryRgb}, 0.04)` : `rgba(${pal.secondaryRgb}, 0.025)`);
    dome.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = dome;
    ctx.fillRect(0, 0, w, benchY);
  }

  // 2. Half-pixel snapped minor & major studio engineering grid
  if (showGrid) {
    const minor = compact ? 24 : 28;
    const major = minor * 4;

    ctx.strokeStyle = dark ? 'rgba(148, 163, 184, 0.07)' : 'rgba(15, 23, 42, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += minor) {
      const px = Math.floor(x) + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, benchY);
    }
    for (let y = 0; y <= benchY; y += minor) {
      const py = Math.floor(y) + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
    }
    ctx.stroke();

    ctx.strokeStyle = dark ? `rgba(${pal.secondaryRgb}, 0.11)` : `rgba(${pal.secondaryRgb}, 0.09)`;
    ctx.beginPath();
    for (let x = 0; x <= w; x += major) {
      const px = Math.floor(x) + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, benchY);
    }
    for (let y = 0; y <= benchY; y += major) {
      const py = Math.floor(y) + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
    }
    ctx.stroke();
  }

  // 3. Bench deck surface & calibrated metric scale strip
  const deckGrad = ctx.createLinearGradient(0, benchY, 0, h);
  if (dark) {
    deckGrad.addColorStop(0, '#0c1729');
    deckGrad.addColorStop(0.65, '#070e1b');
    deckGrad.addColorStop(1, '#040810');
  } else {
    deckGrad.addColorStop(0, '#dce6f2');
    deckGrad.addColorStop(0.7, '#cfdce9');
    deckGrad.addColorStop(1, '#bccddd');
  }
  ctx.fillStyle = deckGrad;
  ctx.fillRect(0, benchY, w, h - benchY);

  // Horizon floor glow strip right above the bench edge
  if (perfMode !== 'smooth') {
    const horizonGlow = ctx.createLinearGradient(0, benchY - 12, 0, benchY + 6);
    horizonGlow.addColorStop(0, 'rgba(0,0,0,0)');
    horizonGlow.addColorStop(0.68, dark ? `rgba(${pal.accentRgb}, 0.20)` : `rgba(${pal.accentRgb}, 0.14)`);
    horizonGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, benchY - 12, w, 18);
  }

  // Crisp luminous horizon bench line
  const railGrad = ctx.createLinearGradient(0, 0, w, 0);
  railGrad.addColorStop(0, `rgba(${pal.accentRgb}, 0.15)`);
  railGrad.addColorStop(0.25, `rgba(${pal.accentRgb}, ${dark ? 0.78 : 0.65})`);
  railGrad.addColorStop(0.5, `rgba(${pal.secondaryRgb}, ${dark ? 0.92 : 0.78})`);
  railGrad.addColorStop(0.75, `rgba(${pal.accentRgb}, ${dark ? 0.78 : 0.65})`);
  railGrad.addColorStop(1, `rgba(${pal.accentRgb}, 0.15)`);
  ctx.strokeStyle = railGrad;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, benchY + 0.5);
  ctx.lineTo(w, benchY + 0.5);
  ctx.stroke();

  // Metric graduation ticks (0, 5, 10, 15, ...)
  const pxPerUnit = compact ? 10 : 12;
  const totalTicks = Math.floor((w - 24) / pxPerUnit);
  ctx.strokeStyle = dark ? 'rgba(125, 211, 252, 0.42)' : 'rgba(15, 23, 42, 0.35)';
  ctx.fillStyle = dark ? 'rgba(125, 211, 252, 0.85)' : 'rgba(15, 23, 42, 0.72)';
  ctx.font = compact ? '600 8.5px ui-monospace, SFMono-Regular, monospace' : '600 9.5px ui-monospace, SFMono-Regular, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 1;

  const startX = 16;
  ctx.beginPath();
  for (let i = 0; i <= totalTicks; i++) {
    const tx = Math.floor(startX + i * pxPerUnit) + 0.5;
    const isMajor = i % 5 === 0;
    const tickH = isMajor ? (compact ? 7 : 9) : compact ? 3.5 : 4.5;
    ctx.moveTo(tx, benchY + 1);
    ctx.lineTo(tx, benchY + 1 + tickH);
  }
  ctx.stroke();

  for (let i = 5; i <= totalTicks; i += 5) {
    const tx = startX + i * pxPerUnit;
    if (tx > w - 28) break;
    ctx.fillText(`${i}`, tx, benchY + (compact ? 9 : 11));
  }

  // Brushed metallic bench front lip (subtle bottom rim like precision lab rail)
  if (!compact) {
    const rimY = h - 7;
    const rimGrad = ctx.createLinearGradient(0, rimY, 0, h);
    if (dark) {
      rimGrad.addColorStop(0, 'rgba(148, 163, 184, 0.25)');
      rimGrad.addColorStop(0.35, 'rgba(226, 232, 240, 0.55)');
      rimGrad.addColorStop(0.75, 'rgba(71, 85, 105, 0.45)');
      rimGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
    } else {
      rimGrad.addColorStop(0, 'rgba(100, 116, 139, 0.3)');
      rimGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
      rimGrad.addColorStop(1, 'rgba(148, 163, 184, 0.5)');
    }
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, rimY, w, 7);

    // Subtle Synapse studio bench specification tag on right side
    const label = opts.benchLabel || pal.defaultBenchLabel;
    ctx.font = '700 9.5px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = dark ? `rgba(${pal.accentRgb}, 0.72)` : 'rgba(15, 23, 42, 0.55)';
    ctx.fillText(label, w - 14, benchY + 11);
  }

  ctx.restore();
  return benchY;
}

/**
 * Tiered Animated Incoming Studio Light ("animation ánh sáng hắt vào theo từng cấp đồ họa")
 * Driven by continuous wall-clock phase (`performance.now() * 0.001`) so lighting
 * glides smoothly even when simulation physics is paused.
 */
export function drawStudioIncomingLight(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  animTimeSec: number | undefined,
  dark: boolean,
  perfMode: PerformanceMode,
  opts: StudioLightOptions
): void {
  const pal = SUBJECT_PALETTE[opts.subject];
  const compact = h < 310;
  const benchY = opts.benchY ?? getStudioBenchY(h, compact);
  const nowSec = animTimeSec ?? (typeof performance !== 'undefined' ? performance.now() * 0.001 : 0);
  const scale = opts.intensityScale ?? 1;

  ctx.save();

  // Tier 1: SMOOTH — Ultra-lightweight static ambient top-left sheen (max FPS)
  if (perfMode === 'smooth') {
    const sheen = ctx.createLinearGradient(0, 0, w * 0.65, h * 0.75);
    sheen.addColorStop(0, dark ? `rgba(${pal.accentRgb}, ${0.06 * scale})` : `rgba(255,255,255, ${0.14 * scale})`);
    sheen.addColorStop(0.5, 'rgba(0,0,0,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, benchY);
    ctx.restore();
    return;
  }

  // Blend mode tailored for dark studio vs daylight lab
  ctx.globalCompositeOperation = dark ? 'screen' : 'soft-light';

  // Tier 2 & 3: BALANCED & ULTRA — Sweeping angled studio key light shaft
  const sweepA = Math.sin(nowSec * 0.55) * (w * 0.09);
  const pulseA = 0.85 + 0.15 * Math.sin(nowSec * 1.15);
  const beamTopX = w * 0.14 + sweepA * 0.45;
  const beamWidthTop = perfMode === 'ultra' ? w * 0.22 : w * 0.17;
  const beamBotX = w * 0.44 + sweepA * 1.15;
  const beamWidthBot = perfMode === 'ultra' ? w * 0.42 : w * 0.32;

  const coneAlpha = (perfMode === 'ultra' ? (dark ? 0.15 : 0.22) : dark ? 0.09 : 0.14) * pulseA * scale;
  const coneGrad = ctx.createLinearGradient(beamTopX, 0, beamBotX + beamWidthBot * 0.35, benchY);
  coneGrad.addColorStop(0, `rgba(240, 249, 255, ${coneAlpha * 1.2})`);
  coneGrad.addColorStop(0.45, `rgba(${pal.accentRgb}, ${coneAlpha * 0.85})`);
  coneGrad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(beamTopX - beamWidthTop * 0.5, 0);
  ctx.lineTo(beamTopX + beamWidthTop * 0.5, 0);
  ctx.lineTo(beamBotX + beamWidthBot * 0.55, benchY);
  ctx.lineTo(beamBotX - beamWidthBot * 0.45, benchY);
  ctx.closePath();
  ctx.fill();

  // Animated specular glint sweeping along the horizon bench rail
  const railCenter = w * (0.5 + 0.34 * Math.sin(nowSec * 0.48));
  const railSpan = perfMode === 'ultra' ? w * 0.26 : w * 0.18;
  const railGlint = ctx.createLinearGradient(railCenter - railSpan, benchY, railCenter + railSpan, benchY);
  railGlint.addColorStop(0, 'rgba(0,0,0,0)');
  railGlint.addColorStop(0.5, `rgba(224, 242, 254, ${(perfMode === 'ultra' ? 0.58 : 0.34) * scale})`);
  railGlint.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = railGlint;
  ctx.lineWidth = perfMode === 'ultra' ? 2.4 : 1.6;
  ctx.beginPath();
  ctx.moveTo(Math.max(0, railCenter - railSpan), benchY + 0.5);
  ctx.lineTo(Math.min(w, railCenter + railSpan), benchY + 0.5);
  ctx.stroke();

  // Tier 3 ONLY: ULTRA — Secondary counter-rim beam + caustic floor pool + drifting dust motes
  if (perfMode === 'ultra') {
    const sweepB = Math.cos(nowSec * 0.42) * (w * 0.08);
    const rxTop = w * 0.84 + sweepB * 0.4;
    const rxBot = w * 0.62 + sweepB;
    const secAlpha = (dark ? 0.095 : 0.13) * (0.88 + 0.12 * Math.cos(nowSec * 0.9)) * scale;

    const rimBeam = ctx.createLinearGradient(rxTop, 0, rxBot, benchY);
    rimBeam.addColorStop(0, `rgba(${pal.secondaryRgb}, ${secAlpha * 1.15})`);
    rimBeam.addColorStop(0.55, `rgba(${pal.accentRgb}, ${secAlpha * 0.55})`);
    rimBeam.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = rimBeam;
    ctx.beginPath();
    ctx.moveTo(rxTop - w * 0.07, 0);
    ctx.lineTo(rxTop + w * 0.07, 0);
    ctx.lineTo(rxBot + w * 0.16, benchY);
    ctx.lineTo(rxBot - w * 0.14, benchY);
    ctx.closePath();
    ctx.fill();

    // Caustic pool glow on the lab floor under the primary beam
    const poolGrad = ctx.createRadialGradient(
      beamBotX,
      benchY,
      4,
      beamBotX,
      benchY,
      beamWidthBot * 0.65
    );
    poolGrad.addColorStop(0, `rgba(224, 242, 254, ${0.26 * scale})`);
    poolGrad.addColorStop(0.45, `rgba(${pal.accentRgb}, ${0.14 * scale})`);
    poolGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = poolGrad;
    ctx.beginPath();
    ctx.ellipse(beamBotX, benchY, beamWidthBot * 0.65, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Illuminated micro dust motes drifting softly inside the incoming light cones
    const moteCount = compact ? 8 : 14;
    for (let i = 0; i < moteCount; i++) {
      const seed = i * 1.6180339;
      const u = (nowSec * (0.045 + (i % 4) * 0.012) + seed) % 1;
      const mx = beamTopX + (beamBotX - beamTopX) * u + Math.sin(nowSec * 0.9 + i * 2.1) * (w * 0.085);
      const my = 12 + u * Math.max(40, benchY - 24);
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(nowSec * 1.7 + i * 1.3));
      const mr = 1.1 + (i % 3) * 0.55;
      ctx.fillStyle = `rgba(224, 242, 254, ${0.42 * tw * scale})`;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Draws a crisp floor alignment target & coordinate badge when a 2D model has been
 * dragged or is actively being dragged on the simulation floor.
 */
export function drawStudioFloorReticle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  drag: Studio2DDragState,
  dark: boolean,
  subject: StudioSubjectTheme
): void {
  const moved = Math.abs(drag.offsetX) > 1 || Math.abs(drag.offsetY) > 1;
  if (!drag.isDragging && !moved) return;

  const pal = SUBJECT_PALETTE[subject];
  const compact = h < 310;
  const benchY = getStudioBenchY(h, compact);
  const anchorX = w * 0.5 + drag.offsetX;
  const floorShadowY = Math.min(benchY - 2, benchY - 4 + drag.offsetY * 0.12);

  ctx.save();
  // Soft contact shadow ellipse projected onto bench surface
  const shadowGrad = ctx.createRadialGradient(anchorX, benchY + 1, 2, anchorX, benchY + 1, 72);
  shadowGrad.addColorStop(0, dark ? 'rgba(0,0,0,0.48)' : 'rgba(15,23,42,0.22)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(anchorX, benchY + 1, 72, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  if (drag.isDragging) {
    // Drop-guide crosshair from model center to bench floor
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = `rgba(${pal.accentRgb}, 0.65)`;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(anchorX, Math.max(24, h * 0.5 + drag.offsetY));
    ctx.lineTo(anchorX, benchY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Target floor ellipse
    ctx.strokeStyle = pal.accentHex;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(anchorX, floorShadowY + 3, 30, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Compact coordinate readout chip
  const dxCm = Math.round(drag.offsetX / 12);
  const dyCm = Math.round(-drag.offsetY / 12);
  const chipText = drag.isDragging
    ? `Kéo sàn: Δx ${dxCm >= 0 ? '+' : ''}${dxCm} · Δy ${dyCm >= 0 ? '+' : ''}${dyCm}`
    : `Vị trí lệch (${dxCm >= 0 ? '+' : ''}${dxCm}, ${dyCm >= 0 ? '+' : ''}${dyCm}) · Nhấp đúp đặt lại`;
  ctx.font = '600 10px ui-monospace, SFMono-Regular, monospace';
  const tw = ctx.measureText(chipText).width + 18;
  const bx = 12;
  const by = compact ? 8 : 10;

  ctx.fillStyle = dark ? 'rgba(7, 15, 29, 0.86)' : 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = drag.isDragging ? pal.accentHex : `rgba(${pal.accentRgb}, 0.45)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, tw, 22, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = dark ? '#e0f2fe' : '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(chipText, bx + 9, by + 11.5);
  ctx.restore();
}

/**
 * Brushed multi-stop laboratory retort stand & adjustable clamp arm (like reference studio look).
 */
export function drawStudioStandAndClamp(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  benchY: number,
  rodHeight: number,
  clampY: number,
  clampReachX: number,
  dark: boolean,
  label?: string
): void {
  ctx.save();

  // Weighted base plate
  const baseW = 78;
  const baseH = 12;
  const baseGrad = ctx.createLinearGradient(baseX - baseW / 2, benchY - baseH, baseX + baseW / 2, benchY);
  baseGrad.addColorStop(0, '#1e293b');
  baseGrad.addColorStop(0.5, '#334155');
  baseGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.roundRect(baseX - baseW / 2, benchY - baseH, baseW, baseH, [4, 4, 1, 1]);
  ctx.fill();
  ctx.strokeStyle = dark ? 'rgba(148,163,184,0.4)' : 'rgba(15,23,42,0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Brushed stainless steel vertical rod
  const rodW = 8;
  const rodTop = benchY - rodHeight;
  const rodGrad = ctx.createLinearGradient(baseX - rodW / 2, 0, baseX + rodW / 2, 0);
  rodGrad.addColorStop(0, '#475569');
  rodGrad.addColorStop(0.35, '#cbd5e1');
  rodGrad.addColorStop(0.65, '#64748b');
  rodGrad.addColorStop(1, '#334155');
  ctx.fillStyle = rodGrad;
  ctx.fillRect(baseX - rodW / 2, rodTop, rodW, rodHeight - baseH);

  // Clamp arm + collar + thumbscrew
  const dir = clampReachX >= baseX ? 1 : -1;
  const armLen = Math.abs(clampReachX - baseX);
  ctx.fillStyle = '#475569';
  ctx.fillRect(Math.min(baseX, clampReachX), clampY - 3, armLen, 6);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(Math.min(baseX, clampReachX), clampY - 3, armLen, 1.5);

  // Bosshead block on rod
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(baseX - 7, clampY - 7, 14, 14, 2);
  ctx.fill();
  ctx.stroke();

  // Thumbscrew
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(baseX - dir * 13, clampY - 2.5, 6, 5, 1.5);
  ctx.fill();

  if (label) {
    ctx.fillStyle = dark ? 'rgba(148,163,184,0.75)' : 'rgba(51,65,85,0.85)';
    ctx.font = '600 9.5px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, (baseX + clampReachX) * 0.5, clampY - 12);
  }

  ctx.restore();
}

export interface StudioGlassVesselOptions {
  fillFraction?: number;
  liquidColor?: string;
  liquidTopColor?: string;
  maxMl?: number;
  perfMode?: PerformanceMode;
  dark?: boolean;
  roundBottom?: boolean;
  rimGlowColor?: string;
}

/**
 * High-craft glassware renderer with Fresnel sky-blue rim glow, curved rim & meniscus,
 * white volumetric graduation ticks, and vertical glass specular streaks.
 */
export function drawStudioGlassVessel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vw: number,
  vh: number,
  opts: StudioGlassVesselOptions = {}
): void {
  const {
    fillFraction = 0.55,
    liquidColor = 'rgba(56, 189, 248, 0.45)',
    liquidTopColor = 'rgba(125, 211, 252, 0.72)',
    maxMl = 50,
    perfMode = 'balanced',
    dark = true,
    roundBottom = false,
    rimGlowColor = '#38bdf8'
  } = opts;

  ctx.save();
  const rBot = roundBottom ? vw * 0.48 : 8;

  // Clip path for vessel interior
  const traceVessel = () => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + vh - rBot);
    if (roundBottom) {
      ctx.arc(x + vw * 0.5, y + vh - rBot, vw * 0.5, Math.PI, 0, true);
    } else {
      ctx.quadraticCurveTo(x, y + vh, x + rBot, y + vh);
      ctx.lineTo(x + vw - rBot, y + vh);
      ctx.quadraticCurveTo(x + vw, y + vh, x + vw, y + vh - rBot);
    }
    ctx.lineTo(x + vw, y);
  };

  // Subtle dark glass cavity backing
  traceVessel();
  ctx.closePath();
  ctx.fillStyle = dark ? 'rgba(14, 165, 233, 0.08)' : 'rgba(224, 242, 254, 0.42)';
  ctx.fill();

  // Liquid column clipped to vessel silhouette
  const clampedFill = Math.max(0, Math.min(0.95, fillFraction));
  if (clampedFill > 0.01) {
    ctx.save();
    traceVessel();
    ctx.closePath();
    ctx.clip();

    const liqH = vh * clampedFill;
    const liqY = y + vh - liqH;
    const liqGrad = ctx.createLinearGradient(x, liqY, x + vw, y + vh);
    liqGrad.addColorStop(0, liquidTopColor);
    liqGrad.addColorStop(0.5, liquidColor);
    liqGrad.addColorStop(1, liquidColor);
    ctx.fillStyle = liqGrad;
    ctx.fillRect(x - 2, liqY, vw + 4, liqH + 4);

    // Curved liquid meniscus ellipse
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.72)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(x + vw * 0.5, liqY, vw * 0.48, Math.max(3, vw * 0.08), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  // Internal vertical glass specular streak (left + subtle right)
  if (perfMode !== 'smooth') {
    const streak = ctx.createLinearGradient(x, y, x + vw, y);
    streak.addColorStop(0, 'rgba(255,255,255,0)');
    streak.addColorStop(0.11, 'rgba(255,255,255,0.42)');
    streak.addColorStop(0.19, 'rgba(255,255,255,0.06)');
    streak.addColorStop(0.84, 'rgba(255,255,255,0)');
    streak.addColorStop(0.92, 'rgba(255,255,255,0.18)');
    streak.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = streak;
    ctx.fillRect(x + 2, y + 4, vw - 4, vh - rBot * 0.6);
  }

  // Crisp Fresnel glass outline
  traceVessel();
  if (perfMode === 'ultra') {
    ctx.shadowColor = rimGlowColor;
    ctx.shadowBlur = 10;
  }
  ctx.strokeStyle = rimGlowColor;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Top flared rim lip ellipse
  ctx.strokeStyle = dark ? '#e0f2fe' : '#0284c7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x + vw * 0.5, y, vw * 0.54, Math.max(3.5, vw * 0.095), 0, 0, Math.PI * 2);
  ctx.stroke();

  // White volumetric graduation markings (clean ml ticks)
  if (maxMl > 0 && vh >= 64) {
    const tickCount = 4;
    ctx.strokeStyle = dark ? 'rgba(241, 245, 249, 0.72)' : 'rgba(15, 23, 42, 0.58)';
    ctx.fillStyle = dark ? 'rgba(241, 245, 249, 0.85)' : 'rgba(15, 23, 42, 0.78)';
    ctx.font = '600 9.5px ui-monospace, SFMono-Regular, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 1.2;
    for (let i = 1; i <= tickCount; i++) {
      const ty = y + vh - (i / (tickCount + 0.6)) * vh;
      const isMajor = i % 2 === 0;
      const len = isMajor ? Math.min(16, vw * 0.28) : Math.min(9, vw * 0.16);
      ctx.beginPath();
      ctx.moveTo(x + 4, ty);
      ctx.lineTo(x + 4 + len, ty);
      ctx.stroke();
      if (isMajor) {
        const mlVal = Math.round((i / tickCount) * maxMl);
        ctx.fillText(`${mlVal}ml`, x + 6 + len, ty);
      }
    }
  }

  ctx.restore();
}

/**
 * Precision thermometer / mercury probe with calibrated ticks and glowing bulb.
 */
export function drawStudioThermometerProbe(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  height: number,
  tempC: number,
  dark: boolean,
  minC = 0,
  maxC = 100
): void {
  ctx.save();
  const tubeW = 10;
  const bulbR = 8;
  const bulbY = topY + height - bulbR;

  // Outer glass stem
  ctx.fillStyle = dark ? 'rgba(148, 163, 184, 0.22)' : 'rgba(226, 232, 240, 0.85)';
  ctx.strokeStyle = dark ? 'rgba(226, 232, 240, 0.55)' : 'rgba(51, 65, 85, 0.5)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(x - tubeW / 2, topY, tubeW, height - bulbR, 5);
  ctx.fill();
  ctx.stroke();

  // Temperature ticks & labels
  const frac = Math.max(0.05, Math.min(1, (tempC - minC) / Math.max(1, maxC - minC)));
  const stemH = height - bulbR - 14;
  const colH = stemH * frac;
  const colTop = bulbY - colH;

  // Mercury / spirit column
  const colColor = tempC >= 60 ? '#ef4444' : tempC <= 15 ? '#0ea5e9' : '#f43f5e';
  ctx.fillStyle = colColor;
  ctx.fillRect(x - 2.4, colTop, 4.8, colH + 3);

  // Bulb
  ctx.beginPath();
  ctx.arc(x, bulbY, bulbR, 0, Math.PI * 2);
  ctx.fillStyle = colColor;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Scale ticks on right edge
  ctx.strokeStyle = dark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(51, 65, 85, 0.6)';
  ctx.fillStyle = dark ? 'rgba(148, 163, 184, 0.85)' : 'rgba(51, 65, 85, 0.85)';
  ctx.font = '600 8.5px ui-monospace, SFMono-Regular, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 5; i++) {
    const ty = bulbY - 6 - (i / 5) * (stemH - 4);
    ctx.beginPath();
    ctx.moveTo(x + tubeW / 2, ty);
    ctx.lineTo(x + tubeW / 2 + 4, ty);
    ctx.stroke();
    if (i % 2 === 0 || i === 5) {
      const val = Math.round(minC + (i / 5) * (maxC - minC));
      ctx.fillText(`${val}°`, x + tubeW / 2 + 6, ty);
    }
  }

  ctx.restore();
}

/**
 * Brushed metal lab probe/sensor (e.g. pH, conductivity, radiation/flux probe) with cable.
 */
export function drawStudioSensorProbe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  benchY: number,
  label: string,
  tipColor: string,
  dark: boolean
): void {
  ctx.save();
  const pw = 18;
  const ph = 46;

  // Curved sensor cable down to bench
  ctx.strokeStyle = dark ? '#334155' : '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + ph);
  ctx.bezierCurveTo(x, benchY + 8, x + 28, benchY + 12, x + 52, benchY);
  ctx.stroke();

  // Glowing ceramic/LED sensor tip
  ctx.fillStyle = tipColor;
  ctx.beginPath();
  ctx.roundRect(x - 6, y - 6, 12, 10, [4, 4, 1, 1]);
  ctx.fill();

  // Brushed metallic cylinder barrel
  const metal = ctx.createLinearGradient(x - pw / 2, 0, x + pw / 2, 0);
  metal.addColorStop(0, '#64748b');
  metal.addColorStop(0.32, '#f1f5f9');
  metal.addColorStop(0.7, '#94a3b8');
  metal.addColorStop(1, '#334155');
  ctx.fillStyle = metal;
  ctx.beginPath();
  ctx.roundRect(x - pw / 2, y, pw, ph * 0.58, 3);
  ctx.fill();

  // Ribbed dark grip handle
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x - pw / 2 + 1, y + ph * 0.56, pw - 2, ph * 0.44, [1, 1, 4, 4]);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  for (let r = 0; r < 3; r++) {
    const ry = y + ph * 0.65 + r * 5;
    ctx.beginPath();
    ctx.moveTo(x - pw / 2 + 3, ry);
    ctx.lineTo(x + pw / 2 - 3, ry);
    ctx.stroke();
  }

  // Crisp label tag above probe
  if (label) {
    ctx.font = '700 9.5px ui-monospace, SFMono-Regular, monospace';
    const tw = ctx.measureText(label).width + 14;
    ctx.fillStyle = dark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = dark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - tw / 2, y - 28, tw, 18, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = dark ? '#7dd3fc' : '#0369a1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y - 19);
  }

  ctx.restore();
}
