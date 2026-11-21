import React, { useEffect, useRef } from 'react';
import {
  useBackgroundTheme,
  BackgroundCreatureTheme,
  PerformanceMode
} from '../../context/BackgroundContext';

interface GalaxyBackgroundProps {
  interactive?: boolean;
  intensity?: 'subtle' | 'vibrant';
  isDark?: boolean;
  className?: string;
  paused?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleDir: number;
  colorDark: string;
  colorLight: string;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

interface SpineNode {
  x: number;
  y: number;
}

type ConcreteCreatureKind = Exclude<BackgroundCreatureTheme, 'galaxy' | 'all'>;

interface Creature {
  kind: ConcreteCreatureKind;
  x: number;
  y: number;
  angle: number;
  speed: number;
  baseSpeed: number;
  size: number;
  phase: number;
  turnNoise: number;
  wanderTimer: number;
  orbitSign: number;
  orbitRadius: number;
  primaryDark: string;
  secondaryDark: string;
  accentDark: string;
  primaryLight: string;
  secondaryLight: string;
  accentLight: string;
  spine: SpineNode[];
  segDist: number;
  trail: { x: number; y: number }[];
  animPhase: number;
  panicAngle: number;
  panicJitterTimer: number;
  panicSpeedFactor: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  growSpeed?: number;
  fadeSpeed?: number;
  lineWidth?: number;
}

interface FloatingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

function normalizeAngle(a: number): number {
  let res = a;
  while (res > Math.PI) res -= Math.PI * 2;
  while (res < -Math.PI) res += Math.PI * 2;
  return res;
}

const TARGET_FRAME_MS: Record<PerformanceMode, number> = {
  smooth: 44, // ~22 FPS ambient background pacing -> major laptop CPU/GPU savings
  balanced: 32, // ~31 FPS smooth without starving UI scroll
  ultra: 16 // capped 60 FPS
};

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  interactive = true,
  intensity = 'vibrant',
  isDark,
  className = '',
  paused = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { creatureTheme, perfMode, bgStyle, activePalette } = useBackgroundTheme();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const syncPausedStateRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    syncPausedStateRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resolveDarkMode = () =>
      typeof isDark === 'boolean'
        ? isDark
        : document.documentElement.classList.contains('dark');

    const [pR_d, pG_d, pB_d] = activePalette.particleRgbDark;
    const [pR_l, pG_l, pB_l] = activePalette.particleRgbLight;

    // Dedicated Interactive Molecular Particle Lattice ('molecules')
    if (bgStyle === 'molecules') {
      let darkMode = resolveDarkMode();
      let lastTick = performance.now();
      const targetMs = TARGET_FRAME_MS[perfMode];
      const low = perfMode === 'smooth';
      const molCount = low
        ? Math.min(34, Math.max(20, Math.floor((width * height) / 36000)))
        : perfMode === 'balanced'
        ? Math.min(52, Math.max(28, Math.floor((width * height) / 24000)))
        : Math.min(72, Math.max(36, Math.floor((width * height) / 17000)));

      const atoms = Array.from({ length: molCount }, (_, i) => {
        const radius = 3.2 + (i % 4) * 1.45;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.72,
          vy: (Math.random() - 0.5) * 0.72,
          r: radius,
          electrons: (i % 3) + 1,
          orbitPhase: Math.random() * Math.PI * 2,
          orbitSpeed: (0.018 + (i % 4) * 0.007) * (i % 2 === 0 ? 1 : -1),
          pulse: Math.random() * Math.PI * 2,
          variant: i % 3
        };
      });

      const shocks: Array<{ x: number; y: number; r: number; maxR: number; a: number }> = [];
      const ptr = { x: -9999, y: -9999, active: false };

      const onResizeMol = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        molBgW = 0;
        if (pausedRef.current || document.hidden || prefersReducedMotion) {
          drawMoleculesFrame(performance.now(), true);
        }
      };
      const onPtrMoveMol = (e: PointerEvent) => {
        if (!interactive) return;
        ptr.x = e.clientX;
        ptr.y = e.clientY;
        ptr.active = true;
      };
      const onPtrLeaveMol = () => {
        ptr.active = false;
      };
      const onPtrDownMol = (e: PointerEvent) => {
        if (!interactive) return;
        shocks.push({ x: e.clientX, y: e.clientY, r: 8, maxR: 220, a: 0.65 });
        for (const a of atoms) {
          const dx = a.x - e.clientX;
          const dy = a.y - e.clientY;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 240) {
            const push = ((240 - dist) / 240) * 5.2;
            a.vx += (dx / dist) * push;
            a.vy += (dy / dist) * push;
          }
        }
      };
      const classObs = new MutationObserver(() => {
        darkMode = resolveDarkMode();
        molBgDark = null;
        if (pausedRef.current || document.hidden || prefersReducedMotion) {
          drawMoleculesFrame(performance.now(), true);
        }
      });
      classObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('resize', onResizeMol);
      window.addEventListener('pointermove', onPtrMoveMol, { passive: true });
      window.addEventListener('pointerleave', onPtrLeaveMol);
      window.addEventListener('pointerdown', onPtrDownMol, { passive: true, capture: true });

      let lastMolScrollMs = 0;
      const onScrollMol = () => {
        lastMolScrollMs = performance.now();
      };
      window.addEventListener('scroll', onScrollMol, { passive: true });

      let molBgCanvas: HTMLCanvasElement | null = document.createElement('canvas');
      let molBgDark: boolean | null = null;
      let molBgW = 0;
      let molBgH = 0;
      const rebuildMolBg = (dm: boolean) => {
        if (!molBgCanvas) return;
        molBgCanvas.width = Math.max(64, Math.floor(width * 0.5));
        molBgCanvas.height = Math.max(64, Math.floor(height * 0.5));
        const mctx = molBgCanvas.getContext('2d', { alpha: false });
        if (!mctx) return;
        const g = mctx.createLinearGradient(0, 0, molBgCanvas.width, molBgCanvas.height);
        if (dm) {
          g.addColorStop(0, '#040814');
          g.addColorStop(0.5, '#091224');
          g.addColorStop(1, '#040916');
        } else {
          g.addColorStop(0, '#f8fbff');
          g.addColorStop(0.5, '#eef5fd');
          g.addColorStop(1, '#f4f9ff');
        }
        mctx.fillStyle = g;
        mctx.fillRect(0, 0, molBgCanvas.width, molBgCanvas.height);
        molBgDark = dm;
        molBgW = width;
        molBgH = height;
      };

      let molPaintedOnce = false;
      let molSlowStreak = 0;
      let molExtraThrottleMs = 0;

      const drawMoleculesFrame = (now: number, freezeMotion: boolean) => {
        const tStart = performance.now();
        const dt = freezeMotion ? 0 : Math.min(48, Math.max(0, now - lastTick)) / 16.667;
        lastTick = now;
        molPaintedOnce = true;
        const t = now * 0.001;

        const [rA, gA, bA] = darkMode ? [pR_d, pG_d, pB_d] : [pR_l, pG_l, pB_l];
        if (!molBgCanvas || molBgDark !== darkMode || molBgW !== width || molBgH !== height) {
          rebuildMolBg(darkMode);
        }
        if (molBgCanvas) {
          ctx.drawImage(molBgCanvas, 0, 0, width, height);
        }

        // Soft cursor magnetic field aura (skipped in smooth/low-spec mode to save GPU fill)
        if (!low && molExtraThrottleMs === 0 && ptr.active) {
          const halo = ctx.createRadialGradient(ptr.x, ptr.y, 4, ptr.x, ptr.y, 190);
          halo.addColorStop(0, `rgba(${rA},${gA},${bA},${darkMode ? 0.14 : 0.1})`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.fillRect(ptr.x - 190, ptr.y - 190, 380, 380);
        }

        const bondDist = width < 640 ? 125 : 168;
        const repelRadius = 170;

        for (let i = 0; i < atoms.length; i++) {
          const a = atoms[i];
          if (ptr.active) {
            const dx = a.x - ptr.x;
            const dy = a.y - ptr.y;
            const d = Math.hypot(dx, dy);
            if (d > 1 && d < repelRadius) {
              const force = ((repelRadius - d) / repelRadius) * 0.55 * dt;
              a.vx += (dx / d) * force;
              a.vy += (dy / d) * force;
            }
          }

          // Gentle Brownian drift + damping back to steady speed
          a.vx *= Math.pow(0.985, dt);
          a.vy *= Math.pow(0.985, dt);
          const speed = Math.hypot(a.vx, a.vy);
          if (speed < 0.25) {
            a.vx += Math.cos(t * 0.9 + a.pulse) * 0.015 * dt;
            a.vy += Math.sin(t * 0.8 + a.pulse) * 0.015 * dt;
          } else if (speed > 4.8) {
            a.vx = (a.vx / speed) * 4.8;
            a.vy = (a.vy / speed) * 4.8;
          }

          a.x += a.vx * dt;
          a.y += a.vy * dt;
          if (a.x < 16) {
            a.x = 16;
            a.vx = Math.abs(a.vx);
          } else if (a.x > width - 16) {
            a.x = width - 16;
            a.vx = -Math.abs(a.vx);
          }
          if (a.y < 16) {
            a.y = 16;
            a.vy = Math.abs(a.vy);
          } else if (a.y > height - 16) {
            a.y = height - 16;
            a.vy = -Math.abs(a.vy);
          }
          a.orbitPhase += a.orbitSpeed * dt;
        }

        // Covalent bonds
        for (let i = 0; i < atoms.length; i++) {
          const a = atoms[i];
          for (let j = i + 1; j < atoms.length; j++) {
            const b = atoms[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            if (dist < bondDist) {
              const frac = 1 - dist / bondDist;
              const alpha = frac * (darkMode ? 0.42 : 0.26);
              ctx.strokeStyle = `rgba(${rA},${gA},${bA},${alpha.toFixed(3)})`;
              ctx.lineWidth = 0.7 + frac * 1.4;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();

              // Double-bond parallel shimmer on close pairs
              if (!low && frac > 0.62 && (i + j) % 3 === 0) {
                const nx = (-dy / (dist || 1)) * 3.5;
                const ny = (dx / (dist || 1)) * 3.5;
                ctx.beginPath();
                ctx.moveTo(a.x + nx, a.y + ny);
                ctx.lineTo(b.x + nx, b.y + ny);
                ctx.strokeStyle = `rgba(${rA},${gA},${bA},${(alpha * 0.5).toFixed(3)})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }
        }

        // Draw atomic nuclei + electron orbitals
        for (const a of atoms) {
          const glow = 0.75 + 0.25 * Math.sin(t * 2.1 + a.pulse);
          const shellR = a.r * 2.5;
          if (!low) {
            ctx.strokeStyle = `rgba(${rA},${gA},${bA},${darkMode ? 0.22 : 0.16})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.ellipse(a.x, a.y, shellR, shellR * 0.46, a.orbitPhase * 0.35, 0, Math.PI * 2);
            ctx.stroke();

            for (let e = 0; e < a.electrons; e++) {
              const ang = a.orbitPhase + (e * Math.PI * 2) / a.electrons;
              const ex = a.x + Math.cos(ang) * shellR;
              const ey = a.y + Math.sin(ang) * shellR * 0.46;
              const rot = a.orbitPhase * 0.35;
              const rx = a.x + (ex - a.x) * Math.cos(rot) - (ey - a.y) * Math.sin(rot);
              const ry = a.y + (ex - a.x) * Math.sin(rot) + (ey - a.y) * Math.cos(rot);
              ctx.fillStyle = darkMode ? '#ffffff' : activePalette.primary;
              ctx.beginPath();
              ctx.arc(rx, ry, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Nucleus core
          ctx.fillStyle = `rgba(${rA},${gA},${bA},${(glow * (darkMode ? 0.88 : 0.72)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)';
          ctx.beginPath();
          ctx.arc(a.x - a.r * 0.25, a.y - a.r * 0.25, a.r * 0.34, 0, Math.PI * 2);
          ctx.fill();
        }

        // Excitation shockwaves
        for (let i = shocks.length - 1; i >= 0; i--) {
          const s = shocks[i];
          s.r += 3.6 * dt;
          s.a -= 0.018 * dt;
          if (s.a <= 0 || s.r >= s.maxR) {
            shocks.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = `rgba(${rA},${gA},${bA},${s.a.toFixed(3)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (!freezeMotion) {
          const molFrameCost = performance.now() - tStart;
          if (molFrameCost > 26) {
            molSlowStreak++;
            if (molSlowStreak >= 4) {
              molExtraThrottleMs = 90;
            }
          } else {
            molSlowStreak = 0;
          }
        }
      };

      const renderMolecules = (now: number) => {
        animationFrameId = 0;
        if (document.hidden || pausedRef.current) {
          drawMoleculesFrame(now, true);
          return;
        }
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(renderMolecules);
        }
        if (perfMode !== 'ultra' && now - lastMolScrollMs < 130 && molPaintedOnce) {
          return;
        }
        const effTargetMs = Math.max(targetMs, molExtraThrottleMs);
        if (effTargetMs > 0 && now - lastTick < effTargetMs && molPaintedOnce) return;
        drawMoleculesFrame(now, false);
      };

      const syncMolLoop = () => {
        if (!pausedRef.current && !document.hidden && !prefersReducedMotion) {
          lastTick = performance.now();
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(renderMolecules);
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
          }
          drawMoleculesFrame(performance.now(), true);
        }
      };
      syncPausedStateRef.current = syncMolLoop;
      window.addEventListener('visibilitychange', syncMolLoop);

      drawMoleculesFrame(performance.now(), pausedRef.current || document.hidden);
      if (!prefersReducedMotion && !pausedRef.current && !document.hidden) {
        animationFrameId = requestAnimationFrame(renderMolecules);
      }

      return () => {
        syncPausedStateRef.current = () => {};
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('visibilitychange', syncMolLoop);
        window.removeEventListener('scroll', onScrollMol);
        window.removeEventListener('resize', onResizeMol);
        window.removeEventListener('pointermove', onPtrMoveMol);
        window.removeEventListener('pointerleave', onPtrLeaveMol);
        window.removeEventListener('pointerdown', onPtrDownMol, { capture: true });
        classObs.disconnect();
        molBgCanvas = null;
      };
    }

    // Dynamic animated modes for White Breeze (Ultra Low-Lag), Minimal Ambient Drift, Studio Dot Wave, and Live Blueprint STEM
    if (
      bgStyle === 'white_breeze' ||
      bgStyle === 'minimal_solid' ||
      bgStyle === 'studio_grid' ||
      bgStyle === 'blueprint_tech'
    ) {
      let darkMode = resolveDarkMode();
      let lastTick = performance.now();
      let isScrolling = false;
      let scrollTimeout = 0;
      const targetMs =
        bgStyle === 'white_breeze'
          ? perfMode === 'ultra'
            ? 24
            : perfMode === 'balanced'
            ? 34
            : 52
          : perfMode === 'smooth'
          ? 48
          : perfMode === 'balanced'
          ? 28
          : 0;

      const nodes = Array.from(
        { length: bgStyle === 'white_breeze' ? 10 : bgStyle === 'minimal_solid' ? 12 : perfMode === 'smooth' ? 16 : 24 },
        (_, idx) => ({
          x: ((idx * 193) % 997) / 997,
          y: ((idx * 389) % 991) / 991,
          vx: (((idx % 5) - 2) || 1) * 0.00014,
          vy: (((idx % 7) - 3) || -1) * 0.00012,
          r: 1.4 + (idx % 3) * 0.85,
          phase: idx * 0.7
        })
      );

      let dynBgCanvas: HTMLCanvasElement | null = document.createElement('canvas');
      let dynBgDark: boolean | null = null;
      let dynBgStyle: string | null = null;
      let dynBgW = 0;
      let dynBgH = 0;
      const rebuildDynBg = (dm: boolean) => {
        if (!dynBgCanvas) return;
        const cw = Math.max(64, Math.floor(width * 0.5));
        const ch = Math.max(64, Math.floor(height * 0.5));
        dynBgCanvas.width = cw;
        dynBgCanvas.height = ch;
        const dctx = dynBgCanvas.getContext('2d', { alpha: false });
        if (!dctx) return;
        const grad = dctx.createLinearGradient(0, 0, cw, ch);
        if (bgStyle === 'studio_grid') {
          if (dm) {
            grad.addColorStop(0, '#070d19');
            grad.addColorStop(1, '#0c1629');
          } else {
            grad.addColorStop(0, '#f8fafc');
            grad.addColorStop(1, '#eef4fb');
          }
        } else {
          if (dm) {
            grad.addColorStop(0, '#040a17');
            grad.addColorStop(0.55, '#08152b');
            grad.addColorStop(1, '#040914');
          } else {
            grad.addColorStop(0, '#f4f8fd');
            grad.addColorStop(0.55, '#ebf3fc');
            grad.addColorStop(1, '#f7fbff');
          }
        }
        dctx.fillStyle = grad;
        dctx.fillRect(0, 0, cw, ch);
        dynBgDark = dm;
        dynBgStyle = bgStyle;
        dynBgW = width;
        dynBgH = height;
      };

      // Preallocated dot bucket arrays for batch-drawing studio_grid without GC or 2000+ fillStyle switches
      const gridBuckets: [number[], number[], number[]] = [[], [], []];

      const onResizeDyn = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        dynBgW = 0;
        if (pausedRef.current || document.hidden || prefersReducedMotion) {
          drawDynamicFrame(performance.now(), true);
        }
      };
      const onScrollDyn = () => {
        isScrolling = true;
        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          isScrolling = false;
        }, 120);
      };
      const classObs = new MutationObserver(() => {
        darkMode = resolveDarkMode();
        dynBgDark = null;
        if (pausedRef.current || document.hidden || prefersReducedMotion) {
          drawDynamicFrame(performance.now(), true);
        }
      });
      classObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('resize', onResizeDyn);
      window.addEventListener('scroll', onScrollDyn, { passive: true });

      let paintedWhiteOnce = false;
      let dynSlowStreak = 0;
      let dynExtraThrottleMs = 0;

      const drawDynamicFrame = (now: number, freezeMotion: boolean) => {
        const tStart = performance.now();
        const dt = freezeMotion ? 0 : Math.min(48, Math.max(8, now - lastTick)) / 16.667;
        lastTick = now;
        const t = now * 0.001;
        paintedWhiteOnce = true;

        if (bgStyle === 'white_breeze') {
          // Pure crisp white background with ultra-light geometric animation (~0.3ms/frame, zero heavy blur/loops)
          ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
          ctx.fillRect(0, 0, width, height);

          // Soft hairline horizon tint at bottom 22%
          ctx.fillStyle = darkMode ? 'rgba(30, 41, 59, 0.35)' : 'rgba(241, 245, 249, 0.55)';
          ctx.fillRect(0, height * 0.78, width, height * 0.22);

          // Two minimalist slow-breathing geometric orbital arcs
          const r1 = Math.min(width, height) * (0.28 + 0.015 * Math.sin(t * 0.45));
          const r2 = Math.min(width, height) * (0.18 + 0.012 * Math.cos(t * 0.55));
          ctx.lineWidth = 1.1;

          ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.14)' : 'rgba(2, 132, 199, 0.08)';
          ctx.beginPath();
          ctx.arc(width * 0.82, height * 0.22, r1, t * 0.14, t * 0.14 + Math.PI * 1.45);
          ctx.stroke();

          ctx.strokeStyle = darkMode ? 'rgba(148, 163, 184, 0.14)' : 'rgba(100, 116, 139, 0.1)';
          ctx.beginPath();
          ctx.arc(width * 0.16, height * 0.76, r2, -t * 0.18, -t * 0.18 + Math.PI * 1.35);
          ctx.stroke();

          // One gentle lightweight sine ribbon
          ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.16)' : 'rgba(14, 165, 233, 0.11)';
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          const stepX = 48;
          for (let x = 0; x <= width + stepX; x += stepX) {
            const y = height * 0.66 + Math.sin(x * 0.0055 + t * 0.75) * 24;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Gentle floating motes (batched circles)
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.x = (n.x + n.vx * dt + 1) % 1;
            n.y = (n.y + n.vy * dt + 1) % 1;
            const alpha = 0.16 + 0.12 * Math.sin(t * 1.2 + n.phase);
            ctx.fillStyle =
              i % 2 === 0
                ? `rgba(${darkMode ? '56, 189, 248' : '2, 132, 199'}, ${alpha.toFixed(2)})`
                : `rgba(${darkMode ? '148, 163, 184' : '100, 116, 139'}, ${(alpha * 0.85).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(n.x * width, n.y * height, n.r, 0, Math.PI * 2);
            ctx.fill();
          }
          return;
        }

        if (bgStyle === 'minimal_solid') {
          ctx.fillStyle = darkMode ? '#080d18' : '#f7faff';
          ctx.fillRect(0, 0, width, height);

          if (perfMode !== 'smooth' && dynExtraThrottleMs === 0) {
            // Drifting dual ambient glow pools
            const g1x = width * (0.28 + 0.12 * Math.sin(t * 0.28));
            const g1y = height * (0.32 + 0.1 * Math.cos(t * 0.22));
            const g1 = ctx.createRadialGradient(g1x, g1y, 10, g1x, g1y, width * 0.42);
            g1.addColorStop(0, darkMode ? 'rgba(14, 165, 233, 0.11)' : 'rgba(56, 189, 248, 0.12)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, width, height);

            const g2x = width * (0.72 + 0.11 * Math.cos(t * 0.24));
            const g2y = height * (0.68 + 0.09 * Math.sin(t * 0.31));
            const g2 = ctx.createRadialGradient(g2x, g2y, 10, g2x, g2y, width * 0.38);
            g2.addColorStop(0, darkMode ? 'rgba(20, 184, 166, 0.09)' : 'rgba(37, 99, 235, 0.08)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, width, height);
          }

          for (const n of nodes) {
            n.x = (n.x + n.vx * dt + 1) % 1;
            n.y = (n.y + n.vy * dt + 1) % 1;
            const pulse = 0.35 + 0.35 * Math.sin(t * 1.4 + n.phase);
            ctx.fillStyle = darkMode
              ? `rgba(125, 211, 252, ${(pulse * 0.45).toFixed(2)})`
              : `rgba(2, 132, 199, ${(pulse * 0.3).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(n.x * width, n.y * height, n.r, 0, Math.PI * 2);
            ctx.fill();
          }
          return;
        }

        if (!dynBgCanvas || dynBgDark !== darkMode || dynBgStyle !== bgStyle || dynBgW !== width || dynBgH !== height) {
          rebuildDynBg(darkMode);
        }
        if (dynBgCanvas) {
          ctx.drawImage(dynBgCanvas, 0, 0, width, height);
        }

        if (bgStyle === 'studio_grid') {
          // Harmonic wave dot matrix — quantized into 3 fill passes (only 3 canvas fill calls instead of 2000+)
          const gap = perfMode === 'smooth' || dynExtraThrottleMs > 0 ? 54 : perfMode === 'balanced' ? 40 : 32;
          const waveSpeed = t * 1.6;
          gridBuckets[0].length = 0;
          gridBuckets[1].length = 0;
          gridBuckets[2].length = 0;
          for (let x = gap * 0.5; x < width; x += gap) {
            for (let y = gap * 0.5; y < height; y += gap) {
              const w = Math.sin(x * 0.011 + y * 0.009 - waveSpeed) * 0.5 + 0.5;
              const bucketIdx = w < 0.34 ? 0 : w < 0.68 ? 1 : 2;
              gridBuckets[bucketIdx].push(x, y);
            }
          }
          const alphas = darkMode ? [0.12, 0.22, 0.33] : [0.14, 0.22, 0.32];
          const sizes = [1.2, 1.7, 2.2];
          for (let b = 0; b < 3; b++) {
            const pts = gridBuckets[b];
            if (pts.length === 0) continue;
            const sz = sizes[b];
            const half = sz * 0.5;
            ctx.fillStyle = darkMode
              ? `rgba(56, 189, 248, ${alphas[b]})`
              : `rgba(2, 132, 199, ${alphas[b]})`;
            ctx.beginPath();
            for (let k = 0; k < pts.length; k += 2) {
              ctx.rect(pts[k] - half, pts[k + 1] - half, sz, sz);
            }
            ctx.fill();
          }

          // Floating gentle constellation vertices
          ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.12)' : 'rgba(37, 99, 235, 0.09)';
          ctx.lineWidth = 1;
          for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x = (a.x + a.vx * dt + 1) % 1;
            a.y = (a.y + a.vy * dt + 1) % 1;
            const ax = a.x * width;
            const ay = a.y * height;
            ctx.fillStyle = darkMode ? 'rgba(45, 212, 191, 0.45)' : 'rgba(2, 132, 199, 0.35)';
            ctx.beginPath();
            ctx.arc(ax, ay, a.r, 0, Math.PI * 2);
            ctx.fill();
            const b = nodes[(i + 1) % nodes.length];
            const dist = Math.hypot(ax - b.x * width, ay - b.y * height);
            if (dist < 220) {
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(b.x * width, b.y * height);
              ctx.stroke();
            }
          }
        } else {
          // blueprint_tech — live panning STEM Oxy coordinate blueprint + calibration sweep
          const minor = perfMode === 'smooth' ? 48 : 36;
          const major = minor * 4;
          const panX = (t * 10) % minor;
          const panY = (t * 6) % minor;

          ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.065)' : 'rgba(2, 132, 199, 0.07)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let x = panX; x < width; x += minor) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
          }
          for (let y = panY; y < height; y += minor) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
          }
          ctx.stroke();

          // Sweeping calibration laser line (single lightweight translucent band in smooth mode)
          const sweepY = ((t * 48) % (height + 160)) - 80;
          if (perfMode === 'smooth' || dynExtraThrottleMs > 0) {
            ctx.fillStyle = darkMode ? 'rgba(56, 189, 248, 0.07)' : 'rgba(2, 132, 199, 0.06)';
            ctx.fillRect(0, sweepY - 12, width, 24);
          } else {
            const sweepGrad = ctx.createLinearGradient(0, sweepY - 35, 0, sweepY + 35);
            sweepGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
            sweepGrad.addColorStop(0.5, darkMode ? 'rgba(56, 189, 248, 0.14)' : 'rgba(2, 132, 199, 0.11)');
            sweepGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = sweepGrad;
            ctx.fillRect(0, sweepY - 35, width, 70);
          }

          const panMajorX = (t * 10) % major;
          const panMajorY = (t * 6) % major;
          ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.18)' : 'rgba(37, 99, 235, 0.14)';
          ctx.beginPath();
          for (let x = panMajorX; x < width; x += major) {
            for (let y = panMajorY; y < height; y += major) {
              ctx.moveTo(x - 4, y);
              ctx.lineTo(x + 4, y);
              ctx.moveTo(x, y - 4);
              ctx.lineTo(x, y + 4);
            }
          }
          ctx.stroke();

          // Moving sine guide curve
          ctx.strokeStyle = darkMode ? 'rgba(45, 212, 191, 0.18)' : 'rgba(13, 148, 136, 0.15)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let x = 0; x <= width; x += 32) {
            const y = height * 0.5 + Math.sin(x * 0.008 + t * 0.9) * 44;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          for (const n of nodes) {
            n.x = (n.x + n.vx * dt + 1) % 1;
            n.y = (n.y + n.vy * dt + 1) % 1;
            ctx.fillStyle = darkMode ? 'rgba(56, 189, 248, 0.48)' : 'rgba(2, 132, 199, 0.35)';
            ctx.beginPath();
            ctx.arc(n.x * width, n.y * height, n.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (!freezeMotion) {
          const dynCost = performance.now() - tStart;
          if (dynCost > 26) {
            dynSlowStreak++;
            if (dynSlowStreak >= 4) {
              dynExtraThrottleMs = 95;
            }
          } else {
            dynSlowStreak = 0;
          }
        }
      };

      const renderDynamicPreset = (now: number) => {
        animationFrameId = 0;
        if (document.hidden || pausedRef.current) {
          drawDynamicFrame(now, true);
          return;
        }
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(renderDynamicPreset);
        }
        if (isScrolling && paintedWhiteOnce) {
          lastTick = now;
          return;
        }
        const effTargetMs = Math.max(targetMs, dynExtraThrottleMs);
        if (effTargetMs > 0 && now - lastTick < effTargetMs && paintedWhiteOnce) return;
        drawDynamicFrame(now, false);
      };

      const syncDynLoop = () => {
        if (!pausedRef.current && !document.hidden && !prefersReducedMotion) {
          lastTick = performance.now();
          if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(renderDynamicPreset);
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
          }
          drawDynamicFrame(performance.now(), true);
        }
      };
      syncPausedStateRef.current = syncDynLoop;
      window.addEventListener('visibilitychange', syncDynLoop);

      drawDynamicFrame(performance.now(), pausedRef.current || document.hidden);
      if (!prefersReducedMotion && !pausedRef.current && !document.hidden) {
        animationFrameId = requestAnimationFrame(renderDynamicPreset);
      }

      return () => {
        syncPausedStateRef.current = () => {};
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('visibilitychange', syncDynLoop);
        window.clearTimeout(scrollTimeout);
        window.removeEventListener('resize', onResizeDyn);
        window.removeEventListener('scroll', onScrollDyn);
        classObs.disconnect();
        dynBgCanvas = null;
      };
    }

    const effectiveCreatureTheme: BackgroundCreatureTheme =
      bgStyle === 'aurora_clean'
        ? 'galaxy'
        : bgStyle === 'constellations' && creatureTheme === 'all'
        ? 'galaxy'
        : creatureTheme;

    const isLowPower = perfMode === 'smooth';
    const isBalanced = perfMode === 'balanced';

    // Pre-baked offscreen background + atmospheric gradient canvas (regenerated ONLY on resize/theme/style change)
    let bgCacheCanvas: HTMLCanvasElement | null = document.createElement('canvas');
    let bgCacheDark: boolean | null = null;
    let bgCacheW = 0;
    let bgCacheH = 0;

    const rebuildBgCache = (darkMode: boolean) => {
      if (!bgCacheCanvas) return;
      const cacheScale = 0.5;
      const cw = Math.max(64, Math.floor(width * cacheScale));
      const ch = Math.max(64, Math.floor(height * cacheScale));
      bgCacheCanvas.width = cw;
      bgCacheCanvas.height = ch;
      const bctx = bgCacheCanvas.getContext('2d', { alpha: false });
      if (!bctx) return;

      const bgGrad = bctx.createLinearGradient(0, 0, cw, ch);
      if (bgStyle === 'ecosystem') {
        if (darkMode) {
          bgGrad.addColorStop(0, '#031512');
          bgGrad.addColorStop(0.45, '#062823');
          bgGrad.addColorStop(0.8, '#083335');
          bgGrad.addColorStop(1, '#031018');
        } else {
          bgGrad.addColorStop(0, '#f2fbf7');
          bgGrad.addColorStop(0.42, '#e3f7ee');
          bgGrad.addColorStop(0.78, '#dcf4f6');
          bgGrad.addColorStop(1, '#edf9f5');
        }
      } else if (bgStyle === 'ocean') {
        if (darkMode) {
          bgGrad.addColorStop(0, '#04233b');
          bgGrad.addColorStop(0.45, '#03172b');
          bgGrad.addColorStop(0.85, '#020d1c');
          bgGrad.addColorStop(1, '#010712');
        } else {
          bgGrad.addColorStop(0, '#e0f7fe');
          bgGrad.addColorStop(0.42, '#cff0fc');
          bgGrad.addColorStop(0.78, '#dff6f8');
          bgGrad.addColorStop(1, '#eefafc');
        }
      } else if (bgStyle === 'sky') {
        if (darkMode) {
          bgGrad.addColorStop(0, '#060c24');
          bgGrad.addColorStop(0.45, '#0e1f47');
          bgGrad.addColorStop(0.8, '#132d52');
          bgGrad.addColorStop(1, '#091529');
        } else {
          bgGrad.addColorStop(0, '#cfeafe');
          bgGrad.addColorStop(0.45, '#e2f2ff');
          bgGrad.addColorStop(0.82, '#f2f8ff');
          bgGrad.addColorStop(1, '#fafdff');
        }
      } else if (bgStyle === 'constellations') {
        if (darkMode) {
          bgGrad.addColorStop(0, '#020510');
          bgGrad.addColorStop(0.5, '#070e26');
          bgGrad.addColorStop(1, '#030714');
        } else {
          bgGrad.addColorStop(0, '#f3f7ff');
          bgGrad.addColorStop(0.5, '#e9f0fc');
          bgGrad.addColorStop(1, '#f7f9ff');
        }
      } else if (darkMode) {
        bgGrad.addColorStop(0, '#040914');
        bgGrad.addColorStop(0.42, '#071122');
        bgGrad.addColorStop(0.78, '#0b182e');
        bgGrad.addColorStop(1, '#030712');
      } else {
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.38, '#f0f7ff');
        bgGrad.addColorStop(0.72, '#e6f1fc');
        bgGrad.addColorStop(1, '#eef5fb');
      }
      bctx.fillStyle = bgGrad;
      bctx.fillRect(0, 0, cw, ch);

      const [rA, gA, bA] = darkMode ? [pR_d, pG_d, pB_d] : [pR_l, pG_l, pB_l];

      // Primary Atmospheric Glow tinted with active color palette
      const n1x = cw * 0.25;
      const n1y = ch * 0.32;
      const grad1 = bctx.createRadialGradient(n1x, n1y, 8, n1x, n1y, cw * 0.48);
      grad1.addColorStop(0, `rgba(${rA},${gA},${bA},${darkMode ? (intensity === 'vibrant' ? 0.22 : 0.1) : 0.15})`);
      grad1.addColorStop(0.55, `rgba(${rA},${gA},${bA},${darkMode ? 0.08 : 0.06})`);
      grad1.addColorStop(1, 'rgba(0,0,0,0)');
      bctx.fillStyle = grad1;
      bctx.fillRect(0, 0, cw, ch);

      // Secondary Glow Pool
      const n2x = cw * 0.78;
      const n2y = ch * 0.68;
      const grad2 = bctx.createRadialGradient(n2x, n2y, 10, n2x, n2y, cw * 0.45);
      if (bgStyle === 'ecosystem') {
        grad2.addColorStop(0, darkMode ? 'rgba(16, 185, 129, 0.18)' : 'rgba(52, 211, 153, 0.14)');
      } else if (bgStyle === 'ocean') {
        grad2.addColorStop(0, darkMode ? 'rgba(45, 212, 191, 0.16)' : 'rgba(6, 182, 212, 0.14)');
      } else if (bgStyle === 'sky') {
        grad2.addColorStop(0, darkMode ? 'rgba(56, 189, 248, 0.16)' : 'rgba(251, 191, 36, 0.12)');
      } else {
        grad2.addColorStop(0, `rgba(${rA},${gA},${bA},${darkMode ? 0.14 : 0.11})`);
      }
      grad2.addColorStop(1, 'rgba(0,0,0,0)');
      bctx.fillStyle = grad2;
      bctx.fillRect(0, 0, cw, ch);

      // Subtle blueprint grid ONLY for cosmic_galaxy/aurora_clean so ecosystem/ocean/sky/constellations feel crisp & organic
      if (bgStyle === 'cosmic_galaxy' || bgStyle === 'aurora_clean') {
        const minorStep = 36;
        const majorStep = minorStep * 4;
        bctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.045)' : 'rgba(2, 132, 199, 0.055)';
        bctx.lineWidth = 1;
        bctx.beginPath();
        for (let gx = 0; gx < cw; gx += minorStep) {
          bctx.moveTo(gx, 0);
          bctx.lineTo(gx, ch);
        }
        for (let gy = 0; gy < ch; gy += minorStep) {
          bctx.moveTo(0, gy);
          bctx.lineTo(cw, gy);
        }
        bctx.stroke();

        bctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.10)' : 'rgba(37, 99, 235, 0.095)';
        bctx.beginPath();
        for (let gx = 0; gx < cw; gx += majorStep) {
          for (let gy = 0; gy < ch; gy += majorStep) {
            bctx.moveTo(gx - 4, gy);
            bctx.lineTo(gx + 4, gy);
            bctx.moveTo(gx, gy - 4);
            bctx.lineTo(gx, gy + 4);
          }
        }
        bctx.stroke();
      }

      bgCacheDark = darkMode;
      bgCacheW = width;
      bgCacheH = height;
    };

    // Pre-baked soft radial glow sprite cache (replaces 150+ createRadialGradient & shadowBlur calls per frame!)
    const glowSpriteCache = new Map<string, HTMLCanvasElement>();
    const getGlowSprite = (hexColor: string, whiteCore = false): HTMLCanvasElement => {
      const key = `${hexColor}_${whiteCore ? 'w' : 'n'}`;
      const existing = glowSpriteCache.get(key);
      if (existing) return existing;

      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const gctx = c.getContext('2d');
      if (gctx) {
        const g = gctx.createRadialGradient(32, 32, 1, 32, 32, 32);
        if (whiteCore) {
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.28, `${hexColor}d0`);
          g.addColorStop(0.65, `${hexColor}44`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          g.addColorStop(0, `${hexColor}66`);
          g.addColorStop(0.5, `${hexColor}24`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
        }
        gctx.fillStyle = g;
        gctx.fillRect(0, 0, 64, 64);
      }
      glowSpriteCache.set(key, c);
      return c;
    };

    const stampGlow = (
      x: number,
      y: number,
      radius: number,
      hexColor: string,
      alpha = 1,
      whiteCore = false
    ) => {
      const sprite = getGlowSprite(hexColor, whiteCore);
      const prevAlpha = ctx.globalAlpha;
      ctx.globalAlpha = prevAlpha * alpha;
      ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
      ctx.globalAlpha = prevAlpha;
    };

    // Track dark mode efficiently without polling DOM classList every frame
    let currentDarkMode =
      typeof isDark === 'boolean'
        ? isDark
        : document.documentElement.classList.contains('dark');

    const classObserver =
      typeof isDark === 'boolean'
        ? null
        : new MutationObserver(() => {
            currentDarkMode = document.documentElement.classList.contains('dark');
            bgCacheDark = null;
            if (pausedRef.current || document.hidden || prefersReducedMotion) {
              drawMainFrame(performance.now(), true);
            }
          });
    if (classObserver) {
      classObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      lastMouseMoveAt: 0
    };
    let panicUntilMs = 0;

    const darkStarColors = [
      '#f8fafc',
      '#bae6fd',
      '#93c5fd',
      '#fde68a',
      '#6ee7b7',
      '#cbd5e1'
    ];

    const lightStarColors = [
      '#1d4ed8',
      '#0284c7',
      '#0f766e',
      '#b45309',
      '#0369a1',
      '#475569'
    ];

    const maxStars = isLowPower ? 85 : isBalanced ? 125 : 165;
    const starDivisor = isLowPower ? 12500 : isBalanced ? 9500 : 7400;
    const starCount = Math.min(Math.floor((width * height) / starDivisor), maxStars);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const size = Math.random() < 0.75 ? Math.random() * 1.5 + 0.65 : Math.random() * 2.5 + 1.2;
      const colorDark = darkStarColors[Math.floor(Math.random() * darkStarColors.length)];
      const colorLight = lightStarColors[Math.floor(Math.random() * lightStarColors.length)];
      const baseAlpha = Math.random() * 0.55 + 0.35;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.018 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        colorDark,
        colorLight,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16
      });
    }

    const shootingStars: ShootingStar[] = [];
    const spawnShootingStar = () => {
      if (document.hidden) return;
      if (shootingStars.filter((s) => s.active).length < (isLowPower ? 1 : 2)) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.45),
          length: Math.random() * 85 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          alpha: 1,
          active: true
        });
      }
    };

    const shootingStarTimer = setInterval(() => {
      if (Math.random() < 0.6) {
        spawnShootingStar();
      }
    }, 4200);

    const creatures: Creature[] = [];
    const ripples: Ripple[] = [];
    const particles: FloatingParticle[] = [];

    const palettes: Record<
      ConcreteCreatureKind,
      Array<{ pd: string; sd: string; ad: string; pl: string; sl: string; al: string }>
    > = {
      koi: [
        { pd: '#fb923c', sd: '#fff7ed', ad: '#ef4444', pl: '#ea580c', sl: '#ffedd5', al: '#dc2626' },
        { pd: '#f43f5e', sd: '#ffe4e6', ad: '#fbbf24', pl: '#e11d48', sl: '#fff1f2', al: '#d97706' },
        { pd: '#38bdf8', sd: '#f0f9ff', ad: '#818cf8', pl: '#0284c7', sl: '#e0f2fe', al: '#4f46e5' },
        { pd: '#facc15', sd: '#fefce8', ad: '#fb923c', pl: '#d97706', sl: '#fef9c3', al: '#ea580c' },
        { pd: '#2dd4bf', sd: '#f0fdfa', ad: '#38bdf8', pl: '#0d9488', sl: '#ccfbf1', al: '#0284c7' }
      ],
      dragon: [
        { pd: '#38bdf8', sd: '#fbbf24', ad: '#e0f2fe', pl: '#1d4ed8', sl: '#d97706', al: '#fef08a' },
        { pd: '#c084fc', sd: '#fde047', ad: '#f472b6', pl: '#7e22ce', sl: '#ea580c', al: '#fbcfe8' }
      ],
      birds: [
        { pd: '#f8fafc', sd: '#93c5fd', ad: '#38bdf8', pl: '#1e3a8a', sl: '#3b82f6', al: '#60a5fa' },
        { pd: '#fde68a', sd: '#fb923c', ad: '#f43f5e', pl: '#b45309', sl: '#f59e0b', al: '#e11d48' },
        { pd: '#e0e7ff', sd: '#c084fc', ad: '#f472b6', pl: '#312e81', sl: '#6366f1', al: '#818cf8' }
      ],
      butterflies: [
        { pd: '#f472b6', sd: '#fbcfe8', ad: '#fde047', pl: '#db2777', sl: '#f9a8d4', al: '#f59e0b' },
        { pd: '#38bdf8', sd: '#bae6fd', ad: '#a78bfa', pl: '#0284c7', sl: '#7dd3fc', al: '#6366f1' },
        { pd: '#a78bfa', sd: '#ddd6fe', ad: '#38bdf8', pl: '#7c3aed', sl: '#c4b5fd', al: '#0ea5e9' },
        { pd: '#fbbf24', sd: '#fef08a', ad: '#fb7185', pl: '#d97706', sl: '#fde047', al: '#ea580c' }
      ],
      jellyfish: [
        { pd: '#38bdf8', sd: '#c084fc', ad: '#f0abfc', pl: '#0284c7', sl: '#7c3aed', al: '#38bdf8' },
        { pd: '#f472b6', sd: '#818cf8', ad: '#bae6fd', pl: '#db2777', sl: '#4f46e5', al: '#a5b4fc' },
        { pd: '#2dd4bf', sd: '#38bdf8', ad: '#fde68a', pl: '#0d9488', sl: '#0284c7', al: '#5eead4' }
      ],
      turtles: [
        { pd: '#10b981', sd: '#fbbf24', ad: '#6ee7b7', pl: '#047857', sl: '#d97706', al: '#34d399' },
        { pd: '#06b6d4', sd: '#a7f3d0', ad: '#38bdf8', pl: '#0e7490', sl: '#10b981', al: '#22d3ee' },
        { pd: '#14b8a6', sd: '#fde68a', ad: '#99f6e4', pl: '#0f766e', sl: '#f59e0b', al: '#2dd4bf' }
      ],
      fireflies: [
        { pd: '#fde047', sd: '#86efac', ad: '#fef9c3', pl: '#eab308', sl: '#22c55e', al: '#facc15' },
        { pd: '#67e8f9', sd: '#fde047', ad: '#cffafe', pl: '#06b6d4', sl: '#f59e0b', al: '#38bdf8' },
        { pd: '#f9a8d4', sd: '#fde68a', ad: '#fce7f3', pl: '#ec4899', sl: '#f59e0b', al: '#f472b6' }
      ]
    };

    const createCreature = (kind: ConcreteCreatureKind, idx: number): Creature => {
      const x = Math.random() * Math.max(width - 140, 100) + 70;
      const y = Math.random() * Math.max(height - 140, 100) + 70;
      const angle = Math.random() * Math.PI * 2;
      let segCount = 2;
      let segDist = 10;
      let baseSpeed = 1.5;
      let size = 14;

      if (kind === 'koi') {
        segCount = isLowPower ? 9 : 11;
        segDist = width < 640 ? 8.5 : 10;
        baseSpeed = 1.45 + Math.random() * 0.55;
        size = width < 640 ? 12 + (idx % 3) * 1.5 : 15 + (idx % 3) * 2;
      } else if (kind === 'dragon') {
        segCount = isLowPower ? 15 : 20;
        segDist = width < 640 ? 11 : 13;
        baseSpeed = 1.95 + idx * 0.22;
        size = width < 640 ? 15 : 19;
      } else if (kind === 'birds') {
        segCount = 2;
        segDist = 10;
        baseSpeed = 2.0 + Math.random() * 0.75;
        size = width < 640 ? 12 + (idx % 3) * 2 : 15 + (idx % 3) * 2.5;
      } else if (kind === 'butterflies') {
        segCount = 2;
        segDist = 8;
        baseSpeed = 1.4 + Math.random() * 0.6;
        size = width < 640 ? 11 + (idx % 3) * 1.5 : 13 + (idx % 3) * 2;
      } else if (kind === 'jellyfish') {
        segCount = 6;
        segDist = 7;
        baseSpeed = 0.85 + Math.random() * 0.45;
        size = width < 640 ? 14 + (idx % 2) * 3 : 18 + (idx % 3) * 3;
      } else if (kind === 'turtles') {
        segCount = 3;
        segDist = 10;
        baseSpeed = 1.05 + Math.random() * 0.4;
        size = width < 640 ? 14 + (idx % 2) * 2.5 : 18 + (idx % 3) * 2.5;
      } else if (kind === 'fireflies') {
        segCount = 2;
        segDist = 6;
        baseSpeed = 1.65 + Math.random() * 0.75;
        size = width < 640 ? 5.5 + (idx % 3) : 6.5 + (idx % 3);
      }

      const palList = palettes[kind];
      const pal = palList[idx % palList.length];

      const spine: SpineNode[] = [];
      for (let s = 0; s < segCount; s++) {
        spine.push({
          x: x - Math.cos(angle) * segDist * s,
          y: y - Math.sin(angle) * segDist * s
        });
      }

      return {
        kind,
        x,
        y,
        angle,
        speed: baseSpeed,
        baseSpeed,
        size,
        phase: Math.random() * Math.PI * 2,
        turnNoise: (Math.random() - 0.5) * 0.04,
        wanderTimer: Math.random() * 140 + 60,
        orbitSign: idx % 2 === 0 ? 1 : -1,
        orbitRadius: 60 + (idx % 4) * 24,
        primaryDark: pal.pd,
        secondaryDark: pal.sd,
        accentDark: pal.ad,
        primaryLight: pal.pl,
        secondaryLight: pal.sl,
        accentLight: pal.al,
        spine,
        segDist,
        trail: [],
        animPhase: Math.random() * Math.PI * 2,
        panicAngle: angle,
        panicJitterTimer: 10,
        panicSpeedFactor: 3.0
      };
    };

    // Scene-specific ambient props (clouds, ocean bubbles, botanical leaves, constellation maps)
    const skyClouds = Array.from({ length: isLowPower ? 5 : 9 }, (_, i) => ({
      x: (i / 9) * width * 1.15,
      y: height * (0.1 + ((i * 37) % 62) / 100),
      scale: 0.75 + (i % 3) * 0.35,
      speed: 0.18 + (i % 4) * 0.08,
      alpha: 0.28 + (i % 3) * 0.09
    }));

    const oceanBubbles = Array.from({ length: isLowPower ? 18 : 34 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 4.2,
      vy: -(0.35 + Math.random() * 0.75),
      sway: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.4
    }));

    const ecoLeaves = Array.from({ length: isLowPower ? 12 : 22 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.3) * 0.35,
      vy: 0.16 + Math.random() * 0.25,
      size: 4 + (i % 4) * 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      tint: i % 3
    }));

    // Curated astronomical constellations mapped cleanly to normalized [0..1] viewport regions
    const constellationCatalog: Array<{
      name: string;
      ox: number;
      oy: number;
      scale: number;
      stars: Array<[number, number, number]>;
      edges: Array<[number, number]>;
    }> = [
      {
        name: 'Orion',
        ox: 0.18,
        oy: 0.34,
        scale: 0.15,
        stars: [
          [-0.45, -0.75, 2.8],
          [0.35, -0.72, 2.4],
          [-0.22, -0.05, 2.5],
          [0.02, -0.02, 2.5],
          [0.24, 0.02, 2.5],
          [-0.38, 0.76, 2.6],
          [0.44, 0.72, 2.9]
        ],
        edges: [
          [0, 2],
          [1, 4],
          [0, 1],
          [2, 3],
          [3, 4],
          [2, 5],
          [4, 6],
          [5, 6]
        ]
      },
      {
        name: 'Cassiopeia',
        ox: 0.52,
        oy: 0.18,
        scale: 0.14,
        stars: [
          [-0.75, -0.22, 2.5],
          [-0.35, 0.32, 2.7],
          [0.02, -0.08, 2.4],
          [0.38, 0.36, 2.6],
          [0.76, -0.24, 2.5]
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4]
        ]
      },
      {
        name: 'Ursa Major',
        ox: 0.8,
        oy: 0.32,
        scale: 0.16,
        stars: [
          [-0.78, -0.35, 2.4],
          [-0.44, -0.22, 2.3],
          [-0.14, -0.04, 2.5],
          [0.18, 0.04, 2.5],
          [0.14, 0.42, 2.4],
          [0.56, 0.44, 2.7],
          [0.64, 0.04, 2.8]
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 3]
        ]
      },
      {
        name: 'Cygnus',
        ox: 0.74,
        oy: 0.76,
        scale: 0.14,
        stars: [
          [0, -0.68, 2.9],
          [0, -0.1, 2.6],
          [0, 0.65, 2.5],
          [-0.68, -0.08, 2.4],
          [0.68, -0.05, 2.4]
        ],
        edges: [
          [0, 1],
          [1, 2],
          [3, 1],
          [1, 4]
        ]
      },
      {
        name: 'Lyra',
        ox: 0.25,
        oy: 0.76,
        scale: 0.12,
        stars: [
          [-0.36, -0.58, 3.0],
          [0.16, -0.4, 2.2],
          [0.32, 0.18, 2.3],
          [-0.12, 0.44, 2.4],
          [-0.24, -0.04, 2.2]
        ],
        edges: [
          [0, 1],
          [1, 4],
          [4, 0],
          [1, 2],
          [2, 3],
          [3, 4]
        ]
      }
    ];

    if (effectiveCreatureTheme !== 'galaxy') {
      if (effectiveCreatureTheme === 'all') {
        const isSmall = width < 640;
        let mix: Array<{ kind: ConcreteCreatureKind; count: number }>;
        if (bgStyle === 'ocean') {
          mix = [
            { kind: 'jellyfish', count: isLowPower ? 3 : isSmall ? 4 : 5 },
            { kind: 'turtles', count: isLowPower ? 2 : isSmall ? 2 : 3 },
            { kind: 'koi', count: isLowPower ? 2 : isSmall ? 2 : 3 }
          ];
        } else if (bgStyle === 'sky') {
          mix = [
            { kind: 'birds', count: isLowPower ? 4 : isSmall ? 5 : 7 },
            { kind: 'butterflies', count: isLowPower ? 2 : isSmall ? 3 : 4 }
          ];
        } else if (bgStyle === 'ecosystem') {
          mix = [
            { kind: 'koi', count: isLowPower ? 2 : isSmall ? 2 : 3 },
            { kind: 'butterflies', count: isLowPower ? 2 : isSmall ? 3 : 4 },
            { kind: 'birds', count: isLowPower ? 2 : isSmall ? 2 : 3 },
            { kind: 'fireflies', count: isLowPower ? 3 : isSmall ? 4 : 6 },
            { kind: 'turtles', count: isLowPower ? 1 : 2 }
          ];
        } else {
          mix = isLowPower
            ? [
                { kind: 'koi', count: isSmall ? 1 : 2 },
                { kind: 'jellyfish', count: isSmall ? 1 : 2 },
                { kind: 'turtles', count: 1 },
                { kind: 'butterflies', count: isSmall ? 1 : 2 },
                { kind: 'birds', count: isSmall ? 1 : 2 },
                { kind: 'fireflies', count: isSmall ? 2 : 3 }
              ]
            : isBalanced
            ? [
                { kind: 'koi', count: isSmall ? 2 : 2 },
                { kind: 'jellyfish', count: isSmall ? 1 : 2 },
                { kind: 'turtles', count: isSmall ? 1 : 2 },
                { kind: 'butterflies', count: isSmall ? 2 : 2 },
                { kind: 'birds', count: isSmall ? 1 : 2 },
                { kind: 'fireflies', count: isSmall ? 3 : 4 }
              ]
            : [
                { kind: 'koi', count: isSmall ? 2 : 3 },
                { kind: 'jellyfish', count: isSmall ? 2 : 3 },
                { kind: 'turtles', count: isSmall ? 1 : 2 },
                { kind: 'butterflies', count: isSmall ? 2 : 3 },
                { kind: 'birds', count: isSmall ? 2 : 3 },
                { kind: 'fireflies', count: isSmall ? 4 : 6 }
              ];
        }
        mix.forEach((group) => {
          for (let i = 0; i < group.count; i++) {
            creatures.push(createCreature(group.kind, i));
          }
        });
      } else {
        const countMap: Record<ConcreteCreatureKind, number> = {
          koi: isLowPower ? 4 : width < 640 ? 5 : 7,
          dragon: isLowPower ? 1 : 2,
          birds: isLowPower ? 5 : width < 640 ? 6 : 9,
          butterflies: isLowPower ? 5 : width < 640 ? 7 : 10,
          jellyfish: isLowPower ? 4 : width < 640 ? 5 : 7,
          turtles: isLowPower ? 3 : width < 640 ? 4 : 6,
          fireflies: isLowPower ? 8 : width < 640 ? 10 : 16
        };
        const count = countMap[effectiveCreatureTheme];
        for (let i = 0; i < count; i++) {
          creatures.push(createCreature(effectiveCreatureTheme, i));
        }
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      bgCacheW = 0; // force bg cache rebuild
      if (pausedRef.current || document.hidden || prefersReducedMotion) {
        drawMainFrame(performance.now(), true);
      }
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        const now = performance.now();
        mouse.lastMouseMoveAt = Math.max(now, panicUntilMs);
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handlePointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, textarea, select')) return;

      const now = performance.now();
      const darkNow = currentDarkMode;

      const ripplePalette = darkNow
        ? ['rgba(125, 211, 252, 0.85)', 'rgba(56, 189, 248, 0.7)', 'rgba(165, 180, 252, 0.6)']
        : ['rgba(2, 132, 199, 0.7)', 'rgba(14, 165, 233, 0.55)', 'rgba(99, 102, 241, 0.45)'];

      const maxRipples = isLowPower ? 14 : 24;
      const ringCount = isLowPower ? 2 : 3;
      for (let ring = 0; ring < ringCount; ring++) {
        if (ripples.length >= maxRipples) ripples.shift();
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 6 + ring * 8,
          maxRadius: 86 + ring * 36,
          alpha: 0.48 - ring * 0.11,
          color: ripplePalette[ring % ripplePalette.length],
          growSpeed: 1.45 - ring * 0.18,
          fadeSpeed: 0.009 - ring * 0.001,
          lineWidth: 2.0 - ring * 0.4
        });
      }

      panicUntilMs = now + 2000;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.lastMouseMoveAt = panicUntilMs;

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        const awayAngle = Math.atan2(c.y - e.clientY, c.x - e.clientX);
        const randomSpread = (Math.random() - 0.5) * Math.PI * 1.15;
        c.panicAngle = normalizeAngle(awayAngle + randomSpread);
        c.panicSpeedFactor = 2.65 + Math.random() * 1.35;
        c.panicJitterTimer = 6 + Math.random() * 12;

        if (particles.length < (isLowPower ? 28 : 56)) {
          particles.push({
            x: c.x,
            y: c.y,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8,
            radius: Math.random() * 2 + 1.2,
            alpha: 0.68,
            decay: 0.018,
            color: darkNow ? c.accentDark : c.accentLight
          });
        }
      }
    };
    window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });

    // Optimized Creature Renderers (Zero per-frame radial gradients & zero shadowBlur)
    const drawKoi = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const accent = darkMode ? c.accentDark : c.accentLight;
      const spine = c.spine;
      const n = spine.length;
      const head = spine[0];
      const neck = spine[1] || head;
      const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

      ctx.save();
      stampGlow(head.x, head.y, c.size * 2.3, primary, darkMode ? 0.55 : 0.32);

      // Pectoral & ventral translucent fins (flat fill instead of linearGradient)
      const finWave = Math.sin(nowSec * 6.5 + c.phase) * 0.28;
      ctx.fillStyle = secondary;
      ctx.globalAlpha = darkMode ? 0.58 : 0.66;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(neck.x, neck.y);
        ctx.rotate(headAngle + side * (0.9 + finWave));
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(c.size * 0.45, -side * c.size * 0.3, c.size * 0.95, 0);
        ctx.quadraticCurveTo(c.size * 0.4, side * c.size * 0.25, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      // Caudal (tail) dual-lobe translucent fan fin
      const tailTip = spine[n - 1];
      const preTail = spine[n - 2] || tailTip;
      const tailAngle = Math.atan2(tailTip.y - preTail.y, tailTip.x - preTail.x);
      const tailSwing = Math.sin(nowSec * 7.5 + c.phase) * 0.3;
      ctx.save();
      ctx.translate(tailTip.x, tailTip.y);
      ctx.rotate(tailAngle + tailSwing);
      ctx.fillStyle = primary;
      ctx.globalAlpha = darkMode ? 0.68 : 0.74;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(c.size * 0.9, -c.size * 0.75, c.size * 1.35, -c.size * 0.34);
      ctx.quadraticCurveTo(c.size * 0.72, 0, c.size * 1.35, c.size * 0.34);
      ctx.quadraticCurveTo(c.size * 0.9, c.size * 0.75, 0, 0);
      ctx.fill();
      ctx.restore();

      // Tapered segmented body with Kohaku spots + crisp dorsal highlight
      ctx.globalAlpha = darkMode ? 0.92 : 0.94;
      for (let i = n - 1; i >= 0; i--) {
        const p = spine[i];
        const ratio = 1 - i / n;
        const r = c.size * (i === 0 ? 0.48 : 0.56 * Math.pow(ratio, 0.72) + 0.08);
        const baseColor = i % 4 === 1 || i % 4 === 2 ? secondary : primary;
        const spotColor = i === 2 || i === 5 ? accent : baseColor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = spotColor;
        ctx.fill();
      }

      // Dorsal fin ribbon
      ctx.beginPath();
      for (let i = 2; i <= Math.min(7, n - 2); i++) {
        const pt = spine[i];
        const sway = Math.sin(nowSec * 7 - i * 0.6 + c.phase) * 2.2;
        const px = pt.x + Math.cos(headAngle + Math.PI / 2) * sway;
        const py = pt.y + Math.sin(headAngle + Math.PI / 2) * sway;
        if (i === 2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 2.1;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.72;
      ctx.stroke();

      // Expressive eyes
      const eyeOffset = c.size * 0.28;
      for (const side of [-1, 1]) {
        const ex = head.x + Math.cos(headAngle + side * 1.1) * eyeOffset;
        const ey = head.y + Math.sin(headAngle + side * 1.1) * eyeOffset;
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(1.7, c.size * 0.11), 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
        ctx.globalAlpha = 0.96;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(0.8, c.size * 0.05), 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? '#fef08a' : '#0f172a';
        ctx.fill();
      }

      ctx.restore();
    };

    const drawDragon = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const accent = darkMode ? c.secondaryDark : c.secondaryLight;
      const glowHue = darkMode ? c.accentDark : c.accentLight;
      const spine = c.spine;
      const n = spine.length;
      const head = spine[0];
      const neck = spine[1] || head;
      const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

      ctx.save();
      stampGlow(head.x, head.y, c.size * 3.4, primary, darkMode ? 0.65 : 0.35);

      // Floating Dragon Pearl ahead of snout
      const pearlDist = c.size * 1.85;
      const pearlX = head.x + Math.cos(headAngle) * pearlDist + Math.cos(nowSec * 3.5 + c.phase) * 3;
      const pearlY = head.y + Math.sin(headAngle) * pearlDist + Math.sin(nowSec * 3.5 + c.phase) * 3;
      stampGlow(pearlX, pearlY, c.size * 0.72, accent, 0.95, true);

      // Articulated dragon legs/claws
      for (const segIdx of [4, Math.min(12, n - 2)]) {
        const node = spine[segIdx];
        const prev = spine[segIdx - 1];
        if (!node || !prev) continue;
        const segAng = Math.atan2(prev.y - node.y, prev.x - node.x);
        const legWave = Math.sin(nowSec * 5 + segIdx + c.phase) * 0.32;
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(segAng + side * (1.25 + legWave));
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2.4;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(c.size * 0.55, side * c.size * 0.2, c.size * 0.98, 0);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Iridescent scales + dorsal flame spikes
      for (let i = n - 1; i >= 1; i--) {
        const p = spine[i];
        const tRatio = 1 - i / n;
        const r = c.size * (0.14 + 0.38 * Math.sin(tRatio * Math.PI * 0.88));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? primary : accent;
        ctx.globalAlpha = darkMode ? 0.86 : 0.9;
        ctx.fill();

        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(p.x - r * 0.22, p.y - r * 0.22, r * 0.42, 0, Math.PI * 2);
          ctx.fillStyle = glowHue;
          ctx.globalAlpha = 0.5;
          ctx.fill();
        }

        if (i % 2 === 0 && i < n - 2) {
          const prev = spine[i - 1];
          const ang = Math.atan2(prev.y - p.y, prev.x - p.x);
          const spikeX = p.x + Math.cos(ang + Math.PI / 2) * (r * 1.55);
          const spikeY = p.y + Math.sin(ang + Math.PI / 2) * (r * 1.55);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(spikeX, spikeY);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.7;
          ctx.globalAlpha = 0.78;
          ctx.stroke();
        }
      }

      // Dragon Head + Horns + Whiskers
      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(headAngle);

      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.95;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.1, side * c.size * 0.25);
        ctx.quadraticCurveTo(-c.size * 0.75, side * c.size * 0.8, -c.size * 1.25, side * c.size * 0.5);
        ctx.stroke();

        const whiskerWave = Math.sin(nowSec * 6 + c.phase + side) * 3.5;
        ctx.beginPath();
        ctx.moveTo(c.size * 0.55, side * c.size * 0.18);
        ctx.quadraticCurveTo(
          c.size * 0.85,
          side * (c.size * 0.85 + whiskerWave),
          c.size * 0.15,
          side * (c.size * 1.28 + whiskerWave)
        );
        ctx.strokeStyle = darkMode ? '#fef08a' : accent;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(c.size * 0.9, 0);
      ctx.lineTo(c.size * 0.18, -c.size * 0.48);
      ctx.lineTo(-c.size * 0.36, -c.size * 0.26);
      ctx.lineTo(-c.size * 0.36, c.size * 0.26);
      ctx.lineTo(c.size * 0.18, c.size * 0.48);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = darkMode ? '#fef08a' : '#ffffff';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(c.size * 0.24, side * c.size * 0.22, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    };

    const drawBird = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const accent = darkMode ? c.accentDark : c.accentLight;
      const flap = Math.sin(nowSec * 7.5 + c.phase);
      const wingSpread = c.size * (1.02 + flap * 0.45);
      const wingSweep = -c.size * 0.45 + flap * c.size * 0.3;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      if (darkMode) {
        stampGlow(0, 0, c.size * 1.5, primary, 0.35);
      }

      // Slipstream tail ribbon
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.42;
      ctx.beginPath();
      ctx.moveTo(-c.size * 0.65, 0);
      ctx.quadraticCurveTo(
        -c.size * 1.4,
        Math.sin(nowSec * 9 + c.phase) * 4,
        -c.size * 2.1,
        Math.cos(nowSec * 8 + c.phase) * 5
      );
      ctx.stroke();

      // Body + forked swallow/phoenix tail
      ctx.fillStyle = primary;
      ctx.globalAlpha = darkMode ? 0.92 : 0.88;
      ctx.beginPath();
      ctx.moveTo(c.size * 0.7, 0);
      ctx.quadraticCurveTo(0, -c.size * 0.2, -c.size * 0.85, -c.size * 0.22);
      ctx.lineTo(-c.size * 0.48, 0);
      ctx.lineTo(-c.size * 0.85, c.size * 0.22);
      ctx.quadraticCurveTo(0, c.size * 0.2, c.size * 0.7, 0);
      ctx.fill();

      // Articulated feathered wings
      ctx.fillStyle = secondary;
      ctx.globalAlpha = darkMode ? 0.88 : 0.84;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(c.size * 0.22, 0);
        ctx.quadraticCurveTo(
          c.size * 0.08,
          side * wingSpread * 0.58,
          wingSweep,
          side * wingSpread
        );
        ctx.quadraticCurveTo(-c.size * 0.26, side * wingSpread * 0.36, -c.size * 0.24, 0);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    };

    const drawButterfly = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const accent = darkMode ? c.accentDark : c.accentLight;
      const flapScale = 0.28 + 0.72 * Math.abs(Math.cos(nowSec * 8.5 + c.phase));

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      if (darkMode) {
        stampGlow(0, 0, c.size * 1.5, primary, 0.38);
      }

      for (const side of [-1, 1]) {
        ctx.save();
        ctx.scale(1, side * flapScale);

        // Forewing
        ctx.beginPath();
        ctx.moveTo(c.size * 0.18, 0);
        ctx.bezierCurveTo(
          c.size * 0.92,
          c.size * 0.68,
          c.size * 0.18,
          c.size * 1.32,
          -c.size * 0.22,
          c.size * 0.56
        );
        ctx.closePath();
        ctx.fillStyle = primary;
        ctx.globalAlpha = darkMode ? 0.88 : 0.82;
        ctx.fill();

        // Eye-spot on forewing
        ctx.beginPath();
        ctx.arc(c.size * 0.25, c.size * 0.72, c.size * 0.16, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();

        // Hindwing
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.05, 0);
        ctx.bezierCurveTo(
          -c.size * 0.28,
          c.size * 0.94,
          -c.size * 0.9,
          c.size * 0.78,
          -c.size * 0.48,
          0
        );
        ctx.closePath();
        ctx.fillStyle = secondary;
        ctx.globalAlpha = darkMode ? 0.78 : 0.76;
        ctx.fill();

        ctx.restore();
      }

      // Thorax + antennae
      ctx.strokeStyle = darkMode ? '#f8fafc' : '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(-c.size * 0.42, 0);
      ctx.lineTo(c.size * 0.48, 0);
      ctx.stroke();

      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(c.size * 0.45, 0);
        ctx.quadraticCurveTo(c.size * 0.65, side * c.size * 0.22, c.size * 0.78, side * c.size * 0.34);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawJellyfish = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const accent = darkMode ? c.accentDark : c.accentLight;
      const pulse = Math.sin(nowSec * 3.4 + c.phase);
      const bellW = c.size * (0.95 - pulse * 0.16);
      const bellH = c.size * (0.72 + pulse * 0.14);

      ctx.save();
      stampGlow(c.x, c.y, c.size * 2.2, primary, darkMode ? 0.62 : 0.34);

      // Tentacles trailing along spine
      const tailAnchor = c.spine[c.spine.length - 1] || { x: c.x, y: c.y };
      const backAng = Math.atan2(tailAnchor.y - c.y, tailAnchor.x - c.x);

      for (let tIdx = 0; tIdx < 5; tIdx++) {
        const latOffset = (tIdx - 2) * (bellW * 0.28);
        const perpX = Math.cos(c.angle + Math.PI / 2) * latOffset;
        const perpY = Math.sin(c.angle + Math.PI / 2) * latOffset;

        ctx.beginPath();
        ctx.moveTo(c.x + perpX, c.y + perpY);
        const tLen = c.size * (1.8 + (tIdx % 2) * 0.55);
        for (let step = 1; step <= 4; step++) {
          const frac = step / 4;
          const wave = Math.sin(nowSec * 4.5 - step * 1.1 + tIdx + c.phase) * (c.size * 0.28);
          const wx =
            c.x +
            perpX +
            Math.cos(backAng) * tLen * frac +
            Math.cos(c.angle + Math.PI / 2) * wave;
          const wy =
            c.y +
            perpY +
            Math.sin(backAng) * tLen * frac +
            Math.sin(c.angle + Math.PI / 2) * wave;
          ctx.lineTo(wx, wy);
        }
        ctx.strokeStyle = tIdx % 2 === 0 ? secondary : accent;
        ctx.lineWidth = tIdx === 2 ? 1.85 : 1.2;
        ctx.globalAlpha = darkMode ? 0.65 : 0.62;
        ctx.stroke();
      }

      // Translucent Umbrella Bell
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      ctx.fillStyle = primary;
      ctx.globalAlpha = darkMode ? 0.78 : 0.72;
      ctx.beginPath();
      ctx.moveTo(-bellH * 0.15, -bellW);
      ctx.bezierCurveTo(bellH * 1.15, -bellW * 0.9, bellH * 1.15, bellW * 0.9, -bellH * 0.15, bellW);
      ctx.quadraticCurveTo(-bellH * 0.35, 0, -bellH * 0.15, -bellW);
      ctx.fill();

      // Inner glowing nucleus
      ctx.beginPath();
      ctx.ellipse(bellH * 0.18, 0, bellH * 0.28, bellW * 0.42, 0, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = darkMode ? 0.68 : 0.54;
      ctx.fill();

      ctx.restore();
      ctx.restore();
    };

    const drawTurtle = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const accent = darkMode ? c.accentDark : c.accentLight;
      const paddle = Math.sin(nowSec * 3.8 + c.phase);

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      stampGlow(0, 0, c.size * 1.8, primary, darkMode ? 0.42 : 0.26);

      // Flippers
      ctx.fillStyle = accent;
      ctx.globalAlpha = darkMode ? 0.86 : 0.88;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(c.size * 0.25, side * c.size * 0.42);
        ctx.rotate(side * (0.45 + paddle * 0.38));
        ctx.beginPath();
        ctx.ellipse(0, side * c.size * 0.36, c.size * 0.2, c.size * 0.52, -side * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(-c.size * 0.52, side * c.size * 0.3);
        ctx.rotate(-side * (0.3 + paddle * 0.18));
        ctx.beginPath();
        ctx.ellipse(0, side * c.size * 0.22, c.size * 0.15, c.size * 0.3, side * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Tail
      ctx.beginPath();
      ctx.moveTo(-c.size * 0.68, -c.size * 0.08);
      ctx.lineTo(-c.size * 0.96, 0);
      ctx.lineTo(-c.size * 0.68, c.size * 0.08);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(c.size * 0.78, 0, c.size * 0.28, c.size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(c.size * 0.88, side * c.size * 0.11, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Carapace Shell
      ctx.beginPath();
      ctx.ellipse(0, 0, c.size * 0.68, c.size * 0.54, 0, 0, Math.PI * 2);
      ctx.fillStyle = primary;
      ctx.globalAlpha = 0.95;
      ctx.fill();
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner highlight scute
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, c.size * 0.34, c.size * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawFirefly = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const pulse = 0.55 + 0.45 * Math.sin(nowSec * 5.2 + c.phase);

      ctx.save();
      if (c.trail.length > 2) {
        ctx.strokeStyle = secondary;
        for (let i = 1; i < c.trail.length; i++) {
          const prev = c.trail[i - 1];
          const curr = c.trail[i];
          const frac = i / c.trail.length;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.lineWidth = Math.max(0.8, c.size * 0.45 * frac);
          ctx.globalAlpha = frac * 0.42 * pulse;
          ctx.stroke();
        }
      }

      const rHalo = c.size * (2.6 + pulse * 1.2);
      stampGlow(c.x, c.y, rHalo, primary, 0.55 + 0.35 * pulse, true);

      ctx.beginPath();
      ctx.arc(c.x, c.y, Math.max(1.8, c.size * 0.36), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.95;
      ctx.fill();

      ctx.restore();
    };

    let lastScrollMs = 0;
    const handleScroll = () => {
      lastScrollMs = performance.now();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastRenderMs = performance.now();
    let lastSimMs = lastRenderMs;
    const minFrameMs = TARGET_FRAME_MS[perfMode];
    let slowFrameStreak = 0;
    let adaptiveLowPower = false;
    let adaptiveThrottleMs = 0;
    let mainPaintedOnce = false;
    // Preallocated scratch coordinates for constellation rendering (zero per-frame GC)
    const constellationPtsScratch: Array<{ x: number; y: number; mag: number }> = [];

    const drawMainFrame = (nowMs: number, freezeMotion: boolean) => {
      const frameStartMs = performance.now();
      lastRenderMs = nowMs;
      mainPaintedOnce = true;

      // Normalize simulation step relative to 60 FPS (16.667ms) so pacing changes never alter motion speed
      const dtMs = freezeMotion ? 0 : Math.min(nowMs - lastSimMs, 64);
      lastSimMs = nowMs;
      const dtScale = freezeMotion ? 0 : Math.max(0.25, dtMs / 16.6667);

      const nowSec = nowMs * 0.001;
      const darkMode = currentDarkMode;
      const lowPowerFrame = isLowPower || adaptiveLowPower;

      mouse.x += (mouse.targetX - mouse.x) * Math.min(1, 0.06 * dtScale);
      mouse.y += (mouse.targetY - mouse.y) * Math.min(1, 0.06 * dtScale);
      const offsetX = (mouse.x - width / 2) * 0.025;
      const offsetY = (mouse.y - height / 2) * 0.025;

      // 1. Draw pre-baked background + nebula layer in one GPU blit
      if (!bgCacheCanvas || bgCacheDark !== darkMode || bgCacheW !== width || bgCacheH !== height) {
        rebuildBgCache(darkMode);
      }
      if (bgCacheCanvas) {
        ctx.drawImage(bgCacheCanvas, 0, 0, width, height);
      }

      // 1b. Scene-specific Atmospheric Overlays (Ecosystem, Ocean, Sky, Constellations, Cosmic)
      const [rP, gP, bP] = darkMode ? [pR_d, pG_d, pB_d] : [pR_l, pG_l, pB_l];
      if (bgStyle === 'ecosystem') {
        // Gentle drifting botanical leaves / petals reacting softly to cursor
        for (const lf of ecoLeaves) {
          if (interactive && mouse.lastMouseMoveAt > 0) {
            const dx = lf.x - mouse.targetX;
            const dy = lf.y - mouse.targetY;
            const d = Math.hypot(dx, dy);
            if (d > 1 && d < 120) {
              lf.x += (dx / d) * 1.4 * dtScale;
              lf.y += (dy / d) * 1.4 * dtScale;
            }
          }
          lf.x += (lf.vx + Math.sin(nowSec * 0.7 + lf.rot) * 0.18) * dtScale;
          lf.y += lf.vy * dtScale;
          lf.rot += lf.rotSpeed * dtScale;
          if (lf.y > height + 20) {
            lf.y = -18;
            lf.x = Math.random() * width;
          }
          if (lf.x < -20) lf.x = width + 18;
          else if (lf.x > width + 20) lf.x = -18;

          ctx.save();
          ctx.translate(lf.x, lf.y);
          ctx.rotate(lf.rot);
          ctx.fillStyle =
            lf.tint === 0
              ? darkMode
                ? 'rgba(52, 211, 153, 0.34)'
                : 'rgba(16, 185, 129, 0.28)'
              : lf.tint === 1
              ? darkMode
                ? 'rgba(45, 212, 191, 0.3)'
                : 'rgba(13, 148, 136, 0.22)'
              : darkMode
              ? 'rgba(253, 224, 71, 0.28)'
              : 'rgba(245, 158, 11, 0.24)';
          ctx.beginPath();
          ctx.ellipse(0, 0, lf.size * 1.35, lf.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (bgStyle === 'ocean') {
        // Volumetric light shafts ("god rays") from ocean surface
        ctx.save();
        for (let ray = 0; ray < (isLowPower ? 3 : 5); ray++) {
          const rx = width * (0.14 + ray * 0.2) + Math.sin(nowSec * 0.35 + ray) * 45;
          const rw = width * 0.08 + ray * 12;
          const beam = ctx.createLinearGradient(rx, 0, rx + rw * 0.7, height * 0.88);
          beam.addColorStop(0, darkMode ? 'rgba(56, 189, 248, 0.11)' : 'rgba(255, 255, 255, 0.34)');
          beam.addColorStop(0.55, darkMode ? 'rgba(45, 212, 191, 0.04)' : 'rgba(186, 230, 253, 0.12)');
          beam.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = beam;
          ctx.beginPath();
          ctx.moveTo(rx - rw * 0.35, 0);
          ctx.lineTo(rx + rw * 0.45, 0);
          ctx.lineTo(rx + rw * 1.55, height);
          ctx.lineTo(rx + rw * 0.25, height);
          ctx.closePath();
          ctx.fill();
        }

        // Gentle sine ocean current ribbons
        ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.1)';
        ctx.lineWidth = 1.4;
        for (let band = 0; band < 3; band++) {
          const baseY = height * (0.28 + band * 0.24);
          ctx.beginPath();
          for (let x = 0; x <= width; x += 28) {
            const wy = baseY + Math.sin(x * 0.006 + nowSec * (0.65 + band * 0.18) + band) * 22;
            if (x === 0) ctx.moveTo(x, wy);
            else ctx.lineTo(x, wy);
          }
          ctx.stroke();
        }

        // Rising bubbles (dodging cursor subtly)
        for (const b of oceanBubbles) {
          if (interactive && mouse.lastMouseMoveAt > 0) {
            const dx = b.x - mouse.targetX;
            const dy = b.y - mouse.targetY;
            const d = Math.hypot(dx, dy);
            if (d > 1 && d < 110) {
              b.x += (dx / d) * 1.5 * dtScale;
            }
          }
          b.y += b.vy * dtScale;
          b.x += Math.sin(nowSec * 1.8 + b.sway) * 0.35 * dtScale;
          if (b.y < -16) {
            b.y = height + 16;
            b.x = Math.random() * width;
          }
          ctx.globalAlpha = b.alpha;
          ctx.strokeStyle = darkMode ? '#bae6fd' : '#0284c7';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (bgStyle === 'sky') {
        ctx.save();
        if (darkMode) {
          // Flowing twilight aurora curtains
          for (let a = 0; a < 2; a++) {
            const aurGrad = ctx.createLinearGradient(0, height * 0.12, width, height * 0.45);
            aurGrad.addColorStop(0, `rgba(${rP},${gP},${bP},0.0)`);
            aurGrad.addColorStop(0.5, a === 0 ? 'rgba(56, 189, 248, 0.13)' : 'rgba(52, 211, 153, 0.1)');
            aurGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = aurGrad;
            ctx.beginPath();
            const topY = height * (0.16 + a * 0.11);
            ctx.moveTo(0, topY);
            for (let x = 0; x <= width; x += 36) {
              ctx.lineTo(x, topY + Math.sin(x * 0.004 + nowSec * 0.4 + a) * 34);
            }
            ctx.lineTo(width, topY + 120);
            ctx.lineTo(0, topY + 120);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Warm diffused sun halo in upper-right sky
          const sunX = width * 0.84 - offsetX * 0.5;
          const sunY = height * 0.16 - offsetY * 0.5;
          const sun = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, width * 0.28);
          sun.addColorStop(0, 'rgba(254, 249, 195, 0.72)');
          sun.addColorStop(0.35, 'rgba(253, 224, 71, 0.22)');
          sun.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = sun;
          ctx.fillRect(0, 0, width, height);
        }

        // Parallax drifting cloud clusters
        for (const cl of skyClouds) {
          cl.x += cl.speed * dtScale;
          if (cl.x > width + 220) cl.x = -220;
          const cx = cl.x - offsetX * 0.6;
          const cy = cl.y - offsetY * 0.4;
          ctx.fillStyle = darkMode
            ? `rgba(148, 163, 184, ${(cl.alpha * 0.25).toFixed(2)})`
            : `rgba(255, 255, 255, ${cl.alpha.toFixed(2)})`;
          const s = cl.scale * 46;
          ctx.beginPath();
          ctx.ellipse(cx, cy, s * 1.45, s * 0.62, 0, 0, Math.PI * 2);
          ctx.ellipse(cx - s * 0.75, cy + s * 0.12, s * 0.95, s * 0.48, 0, 0, Math.PI * 2);
          ctx.ellipse(cx + s * 0.82, cy + s * 0.1, s * 1.05, s * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (bgStyle === 'constellations') {
        ctx.save();
        const minDim = Math.min(width, height);
        const starPtsStart = 0;
        let starTotal = 0;

        for (const con of constellationCatalog) {
          const cx = con.ox * width - offsetX * 0.65;
          const cy = con.oy * height - offsetY * 0.65;
          const sc = minDim * con.scale;
          const baseIdx = starTotal;
          for (let si = 0; si < con.stars.length; si++) {
            const [sx, sy, mag] = con.stars[si];
            const px = cx + sx * sc;
            const py = cy + sy * sc;
            if (!constellationPtsScratch[starTotal]) {
              constellationPtsScratch[starTotal] = { x: px, y: py, mag };
            } else {
              constellationPtsScratch[starTotal].x = px;
              constellationPtsScratch[starTotal].y = py;
              constellationPtsScratch[starTotal].mag = mag;
            }
            starTotal++;
          }

          // Constellation skeleton lines
          ctx.strokeStyle = darkMode
            ? `rgba(${rP},${gP},${bP},0.34)`
            : `rgba(${rP},${gP},${bP},0.28)`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          for (const [a, b] of con.edges) {
            const pa = constellationPtsScratch[baseIdx + a];
            const pb = constellationPtsScratch[baseIdx + b];
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
          }
          ctx.stroke();

          // Constellation stars with crisp glow
          for (let si = 0; si < con.stars.length; si++) {
            const p = constellationPtsScratch[baseIdx + si];
            const tw = 0.75 + 0.25 * Math.sin(nowSec * 2.2 + si * 1.3);
            stampGlow(p.x, p.y, p.mag * 3.8, darkMode ? activePalette.primaryLight : activePalette.primary, tw * 0.55, true);
            ctx.fillStyle = darkMode ? '#ffffff' : activePalette.primary;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.mag, 0, Math.PI * 2);
            ctx.fill();
          }

          // Subtle astronomical label
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillStyle = darkMode
            ? `rgba(${rP},${gP},${bP},0.48)`
            : `rgba(${rP},${gP},${bP},0.55)`;
          ctx.fillText(con.name.toUpperCase(), cx - 18, cy + sc * 0.92);
        }

        // Dynamic filament links from cursor to nearby constellation stars
        if (interactive && mouse.lastMouseMoveAt > 0) {
          const linkRadius = 195;
          for (let i = starPtsStart; i < starTotal; i++) {
            const sp = constellationPtsScratch[i];
            const d = Math.hypot(sp.x - mouse.targetX, sp.y - mouse.targetY);
            if (d < linkRadius) {
              const frac = 1 - d / linkRadius;
              ctx.strokeStyle = `rgba(${rP},${gP},${bP},${(frac * 0.52).toFixed(3)})`;
              ctx.lineWidth = 0.8 + frac * 0.9;
              ctx.beginPath();
              ctx.moveTo(sp.x, sp.y);
              ctx.lineTo(mouse.targetX, mouse.targetY);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      } else if (!isLowPower) {
        // Subtle Rotating Scientific Astrolabe / Orbital Telemetry Arcs for cosmic_galaxy & aurora_clean
        ctx.save();
        const astroX = width * 0.86 - offsetX * 0.45;
        const astroY = height * 0.24 - offsetY * 0.45;
        const baseR = Math.min(width, height) * 0.19;
        ctx.strokeStyle = darkMode ? 'rgba(56, 189, 248, 0.09)' : 'rgba(2, 132, 199, 0.085)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(astroX, astroY, baseR, nowSec * 0.08, nowSec * 0.08 + Math.PI * 1.45);
        ctx.stroke();

        ctx.setLineDash([4, 10]);
        ctx.strokeStyle = darkMode ? 'rgba(16, 185, 129, 0.09)' : 'rgba(13, 148, 136, 0.08)';
        ctx.beginPath();
        ctx.arc(astroX, astroY, baseR * 0.72, -nowSec * 0.11, -nowSec * 0.11 + Math.PI * 1.65);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // 2. STARS & CRYSTAL PARTICLES (No template string allocations!)
      const alphaMultiplier = darkMode ? 1 : 0.85;
      const savedAlpha = ctx.globalAlpha;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx * dtScale;
        s.y += s.vy * dtScale;
        if (s.x < 0) s.x = width;
        else if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        else if (s.y > height) s.y = 0;

        s.alpha += s.twinkleSpeed * s.twinkleDir * dtScale;
        if (s.alpha > s.baseAlpha + 0.3 || s.alpha >= 1) s.twinkleDir = -1;
        else if (s.alpha < s.baseAlpha - 0.3 || s.alpha <= 0.1) s.twinkleDir = 1;

        const renderX = s.x - offsetX * (s.size * 0.3);
        const renderY = s.y - offsetY * (s.size * 0.3);
        const col = darkMode ? s.colorDark : s.colorLight;
        const finalAlpha = Math.max(0.28, Math.min(s.alpha * alphaMultiplier, 0.95));

        ctx.globalAlpha = finalAlpha;
        ctx.fillStyle = col;
        if (s.size <= 1.35) {
          const d = s.size * 1.8;
          ctx.fillRect(renderX - s.size, renderY - s.size, d, d);
        } else {
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.size, 0, Math.PI * 2);
          ctx.fill();
          if (s.alpha > 0.45 && !lowPowerFrame) {
            stampGlow(renderX, renderY, s.size * 2.5, col, 0.32);
          }
        }
      }
      ctx.globalAlpha = savedAlpha;

      // 3. SHOOTING STARS
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) continue;
        ss.x += Math.cos(ss.angle) * ss.speed * dtScale;
        ss.y += Math.sin(ss.angle) * ss.speed * dtScale;
        ss.alpha -= 0.015 * dtScale;
        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          ss.active = false;
          shootingStars.splice(i, 1);
          continue;
        }
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ss.alpha);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = darkMode ? '#7dd3fc' : '#0284c7';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? '#ffffff' : '#1d4ed8';
        ctx.fill();
        ctx.restore();
      }

      // 4. AMBIENT BUBBLES & POLLEN SPARKLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx * dtScale;
        pt.y += pt.vy * dtScale;
        pt.alpha -= pt.decay * dtScale;
        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = savedAlpha;

      // 5. RIPPLES
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const grow = rp.growSpeed ?? 0.68;
        const fade = rp.fadeSpeed ?? 0.009;
        rp.radius += grow * dtScale;
        if (rp.growSpeed) {
          rp.growSpeed = Math.max(0.55, rp.growSpeed * Math.pow(0.985, dtScale));
        }
        rp.alpha -= fade * dtScale;
        if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = rp.alpha;
        ctx.strokeStyle = rp.color;
        ctx.lineWidth = rp.lineWidth ?? 1.25;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = savedAlpha;

      // 6. INTERACTIVE CREATURES
      const isPanicking = interactive && nowMs < panicUntilMs;
      const isMouseFollowing =
        !isPanicking &&
        interactive &&
        mouse.lastMouseMoveAt > 0 &&
        nowMs - mouse.lastMouseMoveAt < 5500;
      const margin = 38;

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        c.animPhase += (isPanicking ? 0.038 : 0.0166) * dtScale;
        const creatureTime = c.animPhase;

        if (isPanicking) {
          c.panicJitterTimer -= dtScale;
          if (c.panicJitterTimer <= 0) {
            c.panicAngle = normalizeAngle(c.panicAngle + (Math.random() - 0.5) * 1.75);
            c.panicJitterTimer = 7 + Math.random() * 13;
          }
          const diff = normalizeAngle(c.panicAngle - c.angle);
          c.angle = normalizeAngle(c.angle + Math.max(-0.24, Math.min(0.24, diff)) * dtScale);
          c.speed += (c.baseSpeed * c.panicSpeedFactor - c.speed) * Math.min(1, 0.16 * dtScale);
        } else if (isMouseFollowing) {
          const dx = mouse.targetX - c.x;
          const dy = mouse.targetY - c.y;
          const dist = Math.hypot(dx, dy);

          let desiredAngle = Math.atan2(dy, dx);
          if (dist < c.orbitRadius) {
            desiredAngle += c.orbitSign * (Math.PI * 0.48);
          }

          const diff = normalizeAngle(desiredAngle - c.angle);
          const maxTurn = (c.kind === 'dragon' || c.kind === 'turtles' ? 0.068 : 0.092) * dtScale;
          c.angle = normalizeAngle(c.angle + Math.max(-maxTurn, Math.min(maxTurn, diff)));

          const boost = dist > 160 ? 1.35 : dist > 60 ? 1.14 : 0.96;
          c.speed += (c.baseSpeed * boost - c.speed) * Math.min(1, 0.08 * dtScale);
        } else {
          c.wanderTimer -= dtScale;
          if (c.wanderTimer <= 0) {
            c.turnNoise = (Math.random() - 0.5) * 0.048;
            c.wanderTimer = 50 + Math.random() * 110;
          }
          c.angle = normalizeAngle(
            c.angle + (c.turnNoise + Math.sin(nowSec * 1.4 + c.phase) * 0.016) * dtScale
          );
          c.speed += (c.baseSpeed - c.speed) * Math.min(1, 0.05 * dtScale);
        }

        const speedMultiplier =
          c.kind === 'jellyfish'
            ? 0.72 + 0.52 * Math.max(0, Math.sin(creatureTime * 3.4 + c.phase))
            : 1;

        let vx = Math.cos(c.angle) * c.speed * speedMultiplier * dtScale;
        let vy = Math.sin(c.angle) * c.speed * speedMultiplier * dtScale;
        c.x += vx;
        c.y += vy;

        let bounced = false;
        if (c.x < margin) {
          c.x = margin;
          vx = Math.abs(vx);
          bounced = true;
        } else if (c.x > width - margin) {
          c.x = width - margin;
          vx = -Math.abs(vx);
          bounced = true;
        }
        if (c.y < margin) {
          c.y = margin;
          vy = Math.abs(vy);
          bounced = true;
        } else if (c.y > height - margin) {
          c.y = height - margin;
          vy = -Math.abs(vy);
          bounced = true;
        }
        if (bounced) {
          c.angle = Math.atan2(vy, vx);
          if (isPanicking) {
            c.panicAngle = normalizeAngle(c.angle + (Math.random() - 0.5) * 0.9);
          }
          if ((c.kind === 'koi' || c.kind === 'turtles') && ripples.length < 18) {
            ripples.push({
              x: c.x,
              y: c.y,
              radius: 6,
              maxRadius: 34,
              alpha: 0.42,
              color: darkMode ? c.primaryDark : c.primaryLight
            });
          }
        }

        if (c.kind === 'fireflies') {
          c.trail.push({ x: c.x, y: c.y });
          if (c.trail.length > (isLowPower ? 10 : 14)) c.trail.shift();
        }

        c.spine[0].x = c.x;
        c.spine[0].y = c.y;
        const wiggleAmp =
          (c.kind === 'dragon' ? 0.14 : c.kind === 'koi' ? 0.11 : 0.05) *
          (isPanicking ? 1.55 : 1);
        for (let s = 1; s < c.spine.length; s++) {
          const prev = c.spine[s - 1];
          const curr = c.spine[s];
          const segAngle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
          const sway = Math.sin(creatureTime * 6.5 - s * 0.55 + c.phase) * wiggleAmp;
          const finalAng = segAngle + sway * 0.08 * dtScale;
          curr.x = prev.x + Math.cos(finalAng) * c.segDist;
          curr.y = prev.y + Math.sin(finalAng) * c.segDist;
        }

        if (!freezeMotion && particles.length < (isLowPower ? 24 : 50) && Math.random() < (isPanicking ? 0.08 : 0.02)) {
          const tail = c.spine[c.spine.length - 1] || { x: c.x, y: c.y };
          particles.push({
            x: tail.x + (Math.random() - 0.5) * 8,
            y: tail.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.45,
            vy: -0.25 - Math.random() * 0.4,
            radius: Math.random() * 1.8 + 0.8,
            alpha: 0.55,
            decay: 0.008,
            color: darkMode ? c.accentDark : c.accentLight
          });
        }

        if (c.kind === 'koi') {
          if (!freezeMotion && Math.random() < (isPanicking ? 0.04 : 0.012) && ripples.length < 18) {
            ripples.push({
              x: c.x,
              y: c.y,
              radius: 5,
              maxRadius: 28,
              alpha: 0.34,
              color: darkMode ? c.primaryDark : c.primaryLight
            });
          }
          drawKoi(c, darkMode, creatureTime);
        } else if (c.kind === 'dragon') {
          drawDragon(c, darkMode, creatureTime);
        } else if (c.kind === 'birds') {
          drawBird(c, darkMode, creatureTime);
        } else if (c.kind === 'butterflies') {
          drawButterfly(c, darkMode, creatureTime);
        } else if (c.kind === 'jellyfish') {
          drawJellyfish(c, darkMode, creatureTime);
        } else if (c.kind === 'turtles') {
          drawTurtle(c, darkMode, creatureTime);
        } else {
          drawFirefly(c, darkMode, creatureTime);
        }
      }

      if (!freezeMotion) {
        const frameElapsed = performance.now() - frameStartMs;
        if (frameElapsed > 30) {
          slowFrameStreak++;
          if (slowFrameStreak >= 4) {
            adaptiveLowPower = true;
            adaptiveThrottleMs = Math.max(minFrameMs, 85);
          }
        } else {
          slowFrameStreak = 0;
        }
      }
    };

    const render = (nowMs: number) => {
      animationFrameId = 0;
      if (document.hidden || pausedRef.current) {
        drawMainFrame(nowMs, true);
        return;
      }
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
      if (perfMode !== 'ultra' && nowMs - lastScrollMs < 130 && mainPaintedOnce) {
        return;
      }
      const effectiveMinMs = Math.max(minFrameMs, adaptiveThrottleMs);
      if (effectiveMinMs > 0 && nowMs - lastRenderMs < effectiveMinMs && mainPaintedOnce) {
        return;
      }
      drawMainFrame(nowMs, false);
    };

    const syncMainLoop = () => {
      if (!pausedRef.current && !document.hidden && !prefersReducedMotion) {
        const now = performance.now();
        lastRenderMs = now;
        lastSimMs = now;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
        drawMainFrame(performance.now(), true);
      }
    };
    syncPausedStateRef.current = syncMainLoop;
    window.addEventListener('visibilitychange', syncMainLoop);

    drawMainFrame(performance.now(), pausedRef.current || document.hidden);
    if (!prefersReducedMotion && !pausedRef.current && !document.hidden) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      syncPausedStateRef.current = () => {};
      cancelAnimationFrame(animationFrameId);
      clearInterval(shootingStarTimer);
      window.removeEventListener('visibilitychange', syncMainLoop);
      classObserver?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      glowSpriteCache.clear();
      bgCacheCanvas = null;
    };
  }, [interactive, intensity, isDark, creatureTheme, perfMode, bgStyle, activePalette.id]);

  const effectiveDarkFallback =
    typeof isDark === 'boolean'
      ? isDark
      : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        display: 'block',
        backgroundColor: effectiveDarkFallback ? '#040914' : '#f8fafc',
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    />
  );
};
