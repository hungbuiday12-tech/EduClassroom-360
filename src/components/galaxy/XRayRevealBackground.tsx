import React, { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeftRight, Sparkles, Upload, X } from 'lucide-react';
import { useBackgroundTheme } from '../../context/BackgroundContext';
import { useLanguage } from '../../context/LanguageContext';
import { XRayConfigPanel } from '../common/XRayConfigPanel';

interface XRayRevealBackgroundProps {
  interactive?: boolean;
  isDark?: boolean;
  paused?: boolean;
  className?: string;
  dockClassName?: string;
}

const TRAIL_COUNT = 7;

/**
 * Generates a smooth closed Catmull-Rom / quadratic-midpoint SVG path
 * for an organic liquid blob around (cx, cy) with harmonic edge ripples
 * and slight directional stretch along velocity (vx, vy).
 */
function buildOrganicBlobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  t: number,
  angleRad: number,
  scaleFactor = 1,
  wobbleAmp = 0.065
): string {
  const ptsCount = 12;
  const pts: Array<{ x: number; y: number }> = [];
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  for (let i = 0; i < ptsCount; i++) {
    const theta = (i / ptsCount) * Math.PI * 2;
    const harmonic =
      1 +
      wobbleAmp * Math.sin(theta * 3 + t * 2.4) +
      wobbleAmp * 0.6 * Math.cos(theta * 2 - t * 1.9) +
      wobbleAmp * 0.35 * Math.sin(theta * 5 + t * 3.1);

    const lx = Math.cos(theta) * rx * scaleFactor * harmonic;
    const ly = Math.sin(theta) * ry * scaleFactor * harmonic;

    // Rotate local stretched coordinates by motion angle
    const gx = cx + lx * cosA - ly * sinA;
    const gy = cy + lx * sinA + ly * cosA;
    pts.push({ x: gx, y: gy });
  }

  let d = '';
  for (let i = 0; i < ptsCount; i++) {
    const curr = pts[i];
    const next = pts[(i + 1) % ptsCount];
    const mx = (curr.x + next.x) * 0.5;
    const my = (curr.y + next.y) * 0.5;
    if (i === 0) {
      const prev = pts[ptsCount - 1];
      const startX = (prev.x + curr.x) * 0.5;
      const startY = (prev.y + curr.y) * 0.5;
      d += `M ${startX.toFixed(1)} ${startY.toFixed(1)} `;
    }
    d += `Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)} `;
  }
  return `${d}Z`;
}

export const XRayRevealBackground: React.FC<XRayRevealBackgroundProps> = ({
  interactive = true,
  isDark,
  paused = false,
  className = '',
  dockClassName = 'bottom-4 left-4'
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const {
    perfMode,
    xrayTopImage,
    xrayBottomImage,
    xraySwapped,
    setXraySwapped,
    xrayMaskRadius,
    xrayFitMode
  } = useBackgroundTheme();

  const rawId = useId();
  const maskId = `synapse-xray-mask-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  const stageParallaxRef = useRef<HTMLDivElement | null>(null);
  const topoParallaxRef = useRef<SVGSVGElement | null>(null);
  const blobOuterRef = useRef<SVGPathElement | null>(null);
  const blobMidRef = useRef<SVGPathElement | null>(null);
  const blobCoreRef = useRef<SVGPathElement | null>(null);
  const trailOuterRefs = useRef<(SVGCircleElement | null)[]>([]);
  const trailCoreRefs = useRef<(SVGCircleElement | null)[]>([]);

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const radiusRef = useRef(xrayMaskRadius);
  radiusRef.current = xrayMaskRadius;

  const topSrc = xraySwapped ? xrayBottomImage : xrayTopImage;
  const bottomSrc = xraySwapped ? xrayTopImage : xrayBottomImage;

  const effectiveDark =
    typeof isDark === 'boolean'
      ? isDark
      : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const mountedAt = performance.now();

    const initX = vw * 0.5;
    const initY = vh * 0.44;

    const state = {
      tx: initX,
      ty: initY,
      cx: initX,
      cy: initY,
      vx: 0,
      vy: 0,
      px: 0,
      py: 0,
      clickRipple: 0,
      lastPointerAt: 0,
      lastRenderAt: 0,
      trail: Array.from({ length: TRAIL_COUNT }, () => ({ x: initX, y: initY, r: 0 }))
    };

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      if (state.lastPointerAt === 0) {
        state.tx = vw * 0.5;
        state.ty = vh * 0.44;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive || pausedRef.current) return;
      state.tx = e.clientX;
      state.ty = e.clientY;
      state.lastPointerAt = performance.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!interactive || pausedRef.current || e.touches.length === 0) return;
      state.tx = e.touches[0].clientX;
      state.ty = e.touches[0].clientY;
      state.lastPointerAt = performance.now();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive || pausedRef.current) return;
      state.tx = e.clientX;
      state.ty = e.clientY;
      state.lastPointerAt = performance.now();
      state.clickRipple = 1;
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true, capture: true });

    const targetFrameMs = perfMode === 'smooth' ? 38 : perfMode === 'balanced' ? 20 : 16;

    const paintFrame = (now: number, freeze: boolean) => {
      const t = now * 0.001;
      const elapsedSinceMount = now - mountedAt;
      const idleDuration = state.lastPointerAt === 0 ? 99999 : now - state.lastPointerAt;

      let goalX = state.tx;
      let goalY = state.ty;

      // Rin-Layheang style opening sweep & gentle organic resting float
      if (!freeze && !prefersReducedMotion) {
        if (state.lastPointerAt === 0 && elapsedSinceMount < 2400) {
          const p = Math.min(1, elapsedSinceMount / 2400);
          const ease = 1 - Math.pow(1 - p, 3);
          const startX = vw * 0.43;
          const startY = vh * 0.28;
          const arcX = Math.sin(p * Math.PI) * Math.min(55, vw * 0.05);
          const arcY = Math.sin(p * Math.PI * 1.4) * 26;
          goalX = startX + (vw * 0.5 - startX) * ease + arcX;
          goalY = startY + (vh * 0.44 - startY) * ease + arcY;
        } else if (idleDuration > 3200) {
          const anchorX = state.lastPointerAt === 0 ? vw * 0.5 : state.tx;
          const anchorY = state.lastPointerAt === 0 ? vh * 0.44 : state.ty;
          const swayX = Math.min(36, vw * 0.032) * Math.sin(t * 0.85);
          const swayY = Math.min(24, vh * 0.028) * Math.cos(t * 1.05);
          goalX = Math.max(32, Math.min(vw - 32, anchorX + swayX));
          goalY = Math.max(32, Math.min(vh - 32, anchorY + swayY));
        }
      }

      const prevX = state.cx;
      const prevY = state.cy;
      const lerp = freeze ? 1 : perfMode === 'smooth' ? 0.34 : 0.21;
      state.cx += (goalX - state.cx) * lerp;
      state.cy += (goalY - state.cy) * lerp;
      state.vx = state.cx - prevX;
      state.vy = state.cy - prevY;
      state.clickRipple *= 0.88;

      // Smooth micro-parallax depth shift (matching rinlayheang.me subtle stage tilt)
      const normX = vw > 0 ? (state.cx / vw - 0.5) * 2 : 0;
      const normY = vh > 0 ? (state.cy / vh - 0.5) * 2 : 0;
      const targetPx = perfMode === 'smooth' || prefersReducedMotion ? 0 : -normX * 7;
      const targetPy = perfMode === 'smooth' || prefersReducedMotion ? 0 : -normY * 5;
      state.px += (targetPx - state.px) * 0.1;
      state.py += (targetPy - state.py) * 0.1;

      if (stageParallaxRef.current) {
        const s = perfMode === 'smooth' || prefersReducedMotion ? 1 : 1.018;
        stageParallaxRef.current.style.transform = `translate3d(${state.px.toFixed(
          2
        )}px, ${state.py.toFixed(2)}px, 0) scale(${s})`;
      }
      if (topoParallaxRef.current) {
        const txTopo = (-state.px * 1.6).toFixed(2);
        const tyTopo = (-state.py * 1.6).toFixed(2);
        topoParallaxRef.current.style.transform = `translate3d(${txTopo}px, ${tyTopo}px, 0) scale(1.03)`;
      }

      // Compact mask dimensions + subtle velocity elongation
      const speed = Math.hypot(state.vx, state.vy);
      const baseR = radiusRef.current * (vw < 640 ? 0.78 : 1);
      const stretch = perfMode === 'smooth' ? 0 : Math.min(18, speed * 0.55);
      const clickBoost = state.clickRipple * 18;
      const rx = baseR + stretch + clickBoost;
      const ry = Math.max(28, baseR - stretch * 0.25 + clickBoost);
      const motionAngle = speed > 0.35 ? Math.atan2(state.vy, state.vx) : t * 0.35;
      const wobble = perfMode === 'smooth' || prefersReducedMotion ? 0 : 0.068;

      // Compensate mask coordinates for the stageParallaxRef transform so cursor stays exact
      const maskX = state.cx - state.px;
      const maskY = state.cy - state.py;

      if (blobOuterRef.current && blobMidRef.current && blobCoreRef.current) {
        if (perfMode === 'smooth' || prefersReducedMotion) {
          const circlePath = (r: number) =>
            `M ${(maskX - r).toFixed(1)} ${maskY.toFixed(1)} a ${r.toFixed(1)} ${r.toFixed(
              1
            )} 0 1 0 ${(r * 2).toFixed(1)} 0 a ${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${-(
              r * 2
            ).toFixed(1)} 0`;
          blobOuterRef.current.setAttribute('d', circlePath(rx * 1.18));
          blobMidRef.current.setAttribute('d', circlePath(rx * 1.06));
          blobCoreRef.current.setAttribute('d', circlePath(rx * 0.92));
        } else {
          blobOuterRef.current.setAttribute(
            'd',
            buildOrganicBlobPath(maskX, maskY, rx, ry, t, motionAngle, 1.19, wobble)
          );
          blobMidRef.current.setAttribute(
            'd',
            buildOrganicBlobPath(maskX, maskY, rx, ry, t + 0.5, motionAngle, 1.07, wobble * 0.85)
          );
          blobCoreRef.current.setAttribute(
            'd',
            buildOrganicBlobPath(maskX, maskY, rx, ry, t + 1.1, motionAngle, 0.92, wobble * 0.7)
          );
        }
      }

      // Liquid brush inertia trail (shrinks cleanly back into cursor when resting)
      const useTrail = perfMode !== 'smooth' && !prefersReducedMotion;
      let leadX = maskX;
      let leadY = maskY;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const node = state.trail[i];
        const followRate = 0.42 - i * 0.032;
        node.x += (leadX - node.x) * followRate;
        node.y += (leadY - node.y) * followRate;
        const distFromLead = Math.hypot(leadX - node.x, leadY - node.y);
        const targetR =
          useTrail && distFromLead > 2
            ? Math.min(baseR * (0.64 - i * 0.065), distFromLead * 1.15 + baseR * 0.25)
            : 0;
        node.r += (targetR - node.r) * 0.25;
        leadX = node.x;
        leadY = node.y;

        const outerEl = trailOuterRefs.current[i];
        const coreEl = trailCoreRefs.current[i];
        if (outerEl && coreEl) {
          if (node.r < 2) {
            outerEl.setAttribute('r', '0');
            coreEl.setAttribute('r', '0');
          } else {
            outerEl.setAttribute('cx', node.x.toFixed(1));
            outerEl.setAttribute('cy', node.y.toFixed(1));
            outerEl.setAttribute('r', (node.r * 1.18).toFixed(1));
            coreEl.setAttribute('cx', node.x.toFixed(1));
            coreEl.setAttribute('cy', node.y.toFixed(1));
            coreEl.setAttribute('r', (node.r * 0.86).toFixed(1));
          }
        }
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      if (!document.hidden && !pausedRef.current && !prefersReducedMotion) {
        rafId = requestAnimationFrame(tick);
      }
      if (now - state.lastRenderAt < targetFrameMs && state.lastRenderAt !== 0) {
        return;
      }
      state.lastRenderAt = now;
      paintFrame(now, false);
    };

    paintFrame(performance.now(), prefersReducedMotion || pausedRef.current);

    if (!prefersReducedMotion && !pausedRef.current && !document.hidden) {
      rafId = requestAnimationFrame(tick);
    }

    const onVisibility = () => {
      if (!document.hidden && !pausedRef.current && !prefersReducedMotion && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };
    window.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
    };
  }, [interactive, perfMode, paused, xrayMaskRadius]);

  const svgPreserveAspect = xrayFitMode === 'contain' ? 'xMidYMax meet' : 'xMidYMid slice';

  return (
    <>
      {/* Full-viewport Dual-Layer X-Ray Reveal Stage */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${
          effectiveDark ? 'bg-[#080d18]' : 'bg-[#eaedf1]'
        } ${className}`}
      >
        {/* Parallax Topographic Contour Lines Backdrop */}
        <svg
          ref={topoParallaxRef}
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
          style={{
            opacity: entered ? 1 : 0,
            willChange: 'transform'
          }}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <g
            stroke={effectiveDark ? 'rgba(148, 163, 184, 0.13)' : 'rgba(15, 23, 42, 0.07)'}
            strokeWidth="1.2"
          >
            <path d="M-120 190 C 160 80, 380 280, 690 140 C 980 10, 1210 210, 1560 95" />
            <path d="M-100 280 C 210 165, 420 350, 740 230 C 1020 120, 1240 310, 1560 195" />
            <path d="M-80 390 C 240 285, 480 465, 810 345 C 1070 250, 1290 420, 1560 325" />
            <path d="M-90 520 C 220 425, 460 610, 790 490 C 1080 385, 1300 545, 1560 460" />
            <path d="M-110 660 C 190 580, 440 740, 770 640 C 1050 555, 1290 695, 1560 620" />
            <path d="M-60 795 C 250 715, 510 865, 840 770 C 1110 690, 1340 825, 1560 760" />
            <path d="M180 -40 C 280 120, 190 250, 340 330 C 480 405, 560 220, 460 70 C 390 -35, 220 -80, 180 -40 Z" />
            <path d="M1060 540 C 960 640, 1020 820, 1180 860 C 1340 900, 1460 720, 1360 590 C 1270 475, 1135 465, 1060 540 Z" />
          </g>
        </svg>

        {/* Smoothly Animated Stacked Dual-Layer Stage (Entrance + Micro-Parallax) */}
        <div
          ref={stageParallaxRef}
          className="absolute inset-0 w-full h-full transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translate3d(0,0,0) scale(1.018)' : 'translate3d(0,10px,0) scale(1.05)',
            willChange: 'transform'
          }}
        >
          {/* Unified SVG dual-layer stack guarantees 1:1 subpixel alignment across all viewports */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
                {/* Trailing liquid droplets */}
                {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
                  <g key={i}>
                    <circle
                      ref={(el) => {
                        trailOuterRefs.current[i] = el;
                      }}
                      cx="0"
                      cy="0"
                      r="0"
                      fill="#000000"
                      fillOpacity={Math.max(0.1, 0.28 - i * 0.028)}
                    />
                    <circle
                      ref={(el) => {
                        trailCoreRefs.current[i] = el;
                      }}
                      cx="0"
                      cy="0"
                      r="0"
                      fill="#000000"
                      fillOpacity={Math.max(0.35, 0.9 - i * 0.08)}
                    />
                  </g>
                ))}
                {/* Main organic liquid cursor blob (3 feathered layers, zero blur shader lag) */}
                <path ref={blobOuterRef} d="" fill="#000000" fillOpacity="0.24" />
                <path ref={blobMidRef} d="" fill="#000000" fillOpacity="0.52" />
                <path ref={blobCoreRef} d="" fill="#000000" fillOpacity="1" />
              </mask>
            </defs>

            {/* Bottom Layer: Silver-Leaf (Dát Bạc) Variant */}
            <image
              href={bottomSrc}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio={svgPreserveAspect}
              style={{
                filter: effectiveDark ? 'brightness(0.86) contrast(1.08)' : undefined
              }}
            />

            {/* Top Layer: Real Image Masked by Organic Liquid SVG Mask + Trailing Brush Wake */}
            <image
              href={topSrc}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio={svgPreserveAspect}
              mask={`url(#${maskId})`}
              style={{
                filter: effectiveDark ? 'brightness(0.78) contrast(1.04)' : undefined
              }}
            />
          </svg>
        </div>

        {/* Contrast Safety Veil in Dark Mode so UI remains crisp */}
        {effectiveDark && (
          <div className="absolute inset-0 bg-slate-950/35 pointer-events-none" />
        )}
      </div>

      {/* Floating Corner Interactive X-Ray Control Dock (Hidden during 3D Labs) */}
      {!paused && (
        <div className={`fixed z-[35] pointer-events-auto ${dockClassName}`}>
          {isConfigOpen && (
            <div className="mb-2 w-[310px] sm:w-[370px] max-w-[calc(100vw-1.5rem)] rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-2xl p-3.5 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>
                    {isEn ? 'X-Ray Dual-Layer Images' : 'Tùy Chỉnh 2 Lớp Ảnh X-Ray'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="p-1 rounded-[4px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  aria-label={isEn ? 'Close' : 'Đóng'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <XRayConfigPanel compact />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 rounded-[4px] border border-slate-300/85 dark:border-slate-700/85 bg-white/88 dark:bg-slate-950/85 backdrop-blur-md shadow-lg p-1.5">
            <button
              type="button"
              onClick={() => setXraySwapped(!xraySwapped)}
              className="min-h-[34px] px-2.5 py-1 rounded-[4px] border border-slate-300/80 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-sky-400 text-slate-800 dark:text-slate-100 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title={isEn ? 'Switch top and bottom layers' : 'Đảo vị trí 2 lớp ảnh trên / dưới'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="hidden sm:inline">
                {isEn ? 'Switch portrait' : 'Đảo lớp'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfigOpen((v) => !v)}
              className={`min-h-[34px] px-2.5 py-1 rounded-[4px] border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                isConfigOpen
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent'
                  : 'bg-white dark:bg-slate-900 border-slate-300/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sky-400'
              }`}
              title={
                isEn
                  ? 'Upload custom Top & Bottom X-Ray images'
                  : 'Tải lên 2 ảnh riêng cho hiệu ứng X-Ray'
              }
            >
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Upload Photos' : 'Tải ảnh'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
