import React, { useEffect, useRef } from 'react';
import { useBackgroundTheme, BackgroundCreatureTheme } from '../../context/BackgroundContext';

interface GalaxyBackgroundProps {
  interactive?: boolean;
  intensity?: 'subtle' | 'vibrant';
  isDark?: boolean;
  className?: string;
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

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  interactive = true,
  intensity = 'vibrant',
  isDark,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { creatureTheme } = useBackgroundTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      lastMouseMoveAt: 0
    };
    let panicUntilMs = 0;

    const darkStarColors = [
      'rgba(255, 255, 255, ',
      'rgba(199, 210, 254, ',
      'rgba(224, 231, 255, ',
      'rgba(253, 230, 138, ',
      'rgba(244, 114, 182, ',
      'rgba(167, 139, 250, '
    ];

    const lightStarColors = [
      'rgba(99, 102, 241, ',
      'rgba(2, 132, 199, ',
      'rgba(147, 51, 234, ',
      'rgba(217, 119, 6, ',
      'rgba(219, 39, 119, ',
      'rgba(13, 148, 136, '
    ];

    const starCount = Math.min(Math.floor((width * height) / 7200), 170);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const size = Math.random() < 0.75 ? Math.random() * 1.6 + 0.6 : Math.random() * 2.8 + 1.2;
      const colorDark = darkStarColors[Math.floor(Math.random() * darkStarColors.length)];
      const colorLight = lightStarColors[Math.floor(Math.random() * lightStarColors.length)];
      const baseAlpha = Math.random() * 0.6 + 0.35;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        colorDark,
        colorLight,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16
      });
    }

    const shootingStars: ShootingStar[] = [];
    const spawnShootingStar = () => {
      if (shootingStars.filter((s) => s.active).length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.45),
          length: Math.random() * 90 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          alpha: 1,
          active: true
        });
      }
    };

    const shootingStarTimer = setInterval(() => {
      if (Math.random() < 0.65) {
        spawnShootingStar();
      }
    }, 3800);

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
        segCount = 12;
        segDist = width < 640 ? 7.5 : 9.2;
        baseSpeed = 1.45 + Math.random() * 0.55;
        size = width < 640 ? 12 + (idx % 3) * 1.5 : 15 + (idx % 3) * 2;
      } else if (kind === 'dragon') {
        segCount = 22;
        segDist = width < 640 ? 10 : 12.5;
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
        segCount = 7;
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

    if (creatureTheme !== 'galaxy') {
      if (creatureTheme === 'all') {
        const isSmall = width < 640;
        const mix: Array<{ kind: ConcreteCreatureKind; count: number }> = [
          { kind: 'koi', count: isSmall ? 2 : 3 },
          { kind: 'jellyfish', count: isSmall ? 2 : 3 },
          { kind: 'turtles', count: isSmall ? 1 : 2 },
          { kind: 'butterflies', count: isSmall ? 2 : 3 },
          { kind: 'birds', count: isSmall ? 2 : 3 },
          { kind: 'fireflies', count: isSmall ? 4 : 6 }
        ];
        mix.forEach((group) => {
          for (let i = 0; i < group.count; i++) {
            creatures.push(createCreature(group.kind, i));
          }
        });
      } else {
        const countMap: Record<ConcreteCreatureKind, number> = {
          koi: width < 640 ? 5 : 7,
          dragon: 2,
          birds: width < 640 ? 6 : 9,
          butterflies: width < 640 ? 7 : 10,
          jellyfish: width < 640 ? 5 : 7,
          turtles: width < 640 ? 4 : 6,
          fireflies: width < 640 ? 10 : 16
        };
        const count = countMap[creatureTheme];
        for (let i = 0; i < count; i++) {
          creatures.push(createCreature(creatureTheme, i));
        }
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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
      const darkNow =
        typeof isDark === 'boolean'
          ? isDark
          : document.documentElement.classList.contains('dark');

      // Gentle multi-ring water ripple on the canvas at click/tap coordinates
      const ripplePalette = darkNow
        ? ['rgba(125, 211, 252, 0.9)', 'rgba(56, 189, 248, 0.75)', 'rgba(165, 180, 252, 0.65)']
        : ['rgba(2, 132, 199, 0.75)', 'rgba(14, 165, 233, 0.6)', 'rgba(99, 102, 241, 0.5)'];

      for (let ring = 0; ring < 3; ring++) {
        if (ripples.length >= 28) ripples.shift();
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 6 + ring * 8,
          maxRadius: 86 + ring * 38,
          alpha: 0.48 - ring * 0.1,
          color: ripplePalette[ring % ripplePalette.length],
          growSpeed: 1.45 - ring * 0.18,
          fadeSpeed: 0.0085 - ring * 0.001,
          lineWidth: 2.0 - ring * 0.4
        });
      }

      // Trigger 2-second panic scatter, then automatically resume mouse following
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

        if (particles.length < 64) {
          particles.push({
            x: c.x,
            y: c.y,
            vx: (Math.random() - 0.5) * 1.8,
            vy: (Math.random() - 0.5) * 1.8,
            radius: Math.random() * 2 + 1.2,
            alpha: 0.68,
            decay: 0.016,
            color: darkNow ? c.accentDark : c.accentLight
          });
        }
      }
    };
    window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });

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
      // Ambient bioluminescent halo
      const glow = ctx.createRadialGradient(head.x, head.y, 2, head.x, head.y, c.size * 2.6);
      glow.addColorStop(0, darkMode ? `${primary}3d` : `${primary}26`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, c.size * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Pectoral & ventral translucent fins
      const finWave = Math.sin(nowSec * 6.5 + c.phase) * 0.28;
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(neck.x, neck.y);
        ctx.rotate(headAngle + side * (0.9 + finWave));
        const finGrad = ctx.createLinearGradient(0, 0, c.size * 0.9, 0);
        finGrad.addColorStop(0, secondary);
        finGrad.addColorStop(1, `${primary}20`);
        ctx.fillStyle = finGrad;
        ctx.globalAlpha = darkMode ? 0.72 : 0.8;
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
      const tailGrad = ctx.createLinearGradient(0, 0, c.size * 1.35, 0);
      tailGrad.addColorStop(0, secondary);
      tailGrad.addColorStop(0.65, primary);
      tailGrad.addColorStop(1, `${primary}15`);
      ctx.fillStyle = tailGrad;
      ctx.globalAlpha = darkMode ? 0.78 : 0.84;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(c.size * 0.9, -c.size * 0.75, c.size * 1.35, -c.size * 0.34);
      ctx.quadraticCurveTo(c.size * 0.72, 0, c.size * 1.35, c.size * 0.34);
      ctx.quadraticCurveTo(c.size * 0.9, c.size * 0.75, 0, 0);
      ctx.fill();
      ctx.restore();

      // Tapered segmented body with radial specular gradient + Kohaku spots
      for (let i = n - 1; i >= 0; i--) {
        const p = spine[i];
        const ratio = 1 - i / n;
        const r = c.size * (i === 0 ? 0.48 : 0.56 * Math.pow(ratio, 0.72) + 0.08);
        const segGrad = ctx.createRadialGradient(p.x - r * 0.25, p.y - r * 0.25, r * 0.1, p.x, p.y, r);
        const baseColor = i % 4 === 1 || i % 4 === 2 ? secondary : primary;
        const spotColor = i === 2 || i === 5 ? accent : baseColor;
        segGrad.addColorStop(0, '#ffffffcc');
        segGrad.addColorStop(0.35, spotColor);
        segGrad.addColorStop(1, primary);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = segGrad;
        ctx.globalAlpha = darkMode ? 0.9 : 0.92;
        ctx.fill();
      }

      // Dorsal fin ribbon along spine 2..7
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
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.72;
      ctx.stroke();

      // Whiskers & expressive eyes
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
      const glow = ctx.createRadialGradient(head.x, head.y, 4, head.x, head.y, c.size * 3.8);
      glow.addColorStop(0, darkMode ? `${primary}48` : `${primary}2b`);
      glow.addColorStop(0.5, darkMode ? `${accent}24` : `${accent}16`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, c.size * 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Floating Dragon Pearl ahead of snout
      const pearlDist = c.size * 1.85;
      const pearlX = head.x + Math.cos(headAngle) * pearlDist + Math.cos(nowSec * 3.5 + c.phase) * 3;
      const pearlY = head.y + Math.sin(headAngle) * pearlDist + Math.sin(nowSec * 3.5 + c.phase) * 3;
      const pearlGrad = ctx.createRadialGradient(pearlX, pearlY, 1, pearlX, pearlY, c.size * 0.65);
      pearlGrad.addColorStop(0, '#ffffff');
      pearlGrad.addColorStop(0.4, accent);
      pearlGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = pearlGrad;
      ctx.beginPath();
      ctx.arc(pearlX, pearlY, c.size * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Articulated dragon legs/claws
      for (const segIdx of [4, 12]) {
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
        const scGrad = ctx.createRadialGradient(p.x - r * 0.2, p.y - r * 0.2, r * 0.1, p.x, p.y, r);
        scGrad.addColorStop(0, glowHue);
        scGrad.addColorStop(0.45, i % 2 === 0 ? primary : accent);
        scGrad.addColorStop(1, primary);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = scGrad;
        ctx.globalAlpha = darkMode ? 0.85 : 0.88;
        ctx.fill();

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

      // Dragon Head + Horns + Flowing Whiskers
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
        ctx.shadowColor = primary;
        ctx.shadowBlur = 11;
      }

      // Slipstream tail ribbon
      ctx.strokeStyle = `${accent}66`;
      ctx.lineWidth = 1.3;
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
      const bodyGrad = ctx.createLinearGradient(-c.size * 0.8, 0, c.size * 0.7, 0);
      bodyGrad.addColorStop(0, secondary);
      bodyGrad.addColorStop(0.5, primary);
      bodyGrad.addColorStop(1, accent);
      ctx.fillStyle = bodyGrad;
      ctx.globalAlpha = darkMode ? 0.92 : 0.88;
      ctx.beginPath();
      ctx.moveTo(c.size * 0.7, 0);
      ctx.quadraticCurveTo(0, -c.size * 0.2, -c.size * 0.85, -c.size * 0.22);
      ctx.lineTo(-c.size * 0.48, 0);
      ctx.lineTo(-c.size * 0.85, c.size * 0.22);
      ctx.quadraticCurveTo(0, c.size * 0.2, c.size * 0.7, 0);
      ctx.fill();

      // Articulated feathered wings
      for (const side of [-1, 1]) {
        const wGrad = ctx.createLinearGradient(0, 0, wingSweep, side * wingSpread);
        wGrad.addColorStop(0, primary);
        wGrad.addColorStop(0.7, secondary);
        wGrad.addColorStop(1, accent);
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
        ctx.fillStyle = wGrad;
        ctx.globalAlpha = darkMode ? 0.88 : 0.84;
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
        ctx.shadowColor = primary;
        ctx.shadowBlur = 12;
      }

      for (const side of [-1, 1]) {
        ctx.save();
        ctx.scale(1, side * flapScale);

        const fwGrad = ctx.createRadialGradient(c.size * 0.2, c.size * 0.4, 1, c.size * 0.15, c.size * 0.55, c.size * 0.9);
        fwGrad.addColorStop(0, accent);
        fwGrad.addColorStop(0.55, primary);
        fwGrad.addColorStop(1, secondary);

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
        ctx.fillStyle = fwGrad;
        ctx.globalAlpha = darkMode ? 0.88 : 0.82;
        ctx.fill();

        // Eye-spot on forewing
        ctx.beginPath();
        ctx.arc(c.size * 0.25, c.size * 0.72, c.size * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffffaa';
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

      // Slender thorax + curved antennae
      ctx.strokeStyle = darkMode ? '#f8fafc' : '#1e293b';
      ctx.lineWidth = 1.6;
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
      // Bioluminescent outer aura
      const aura = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, c.size * 2.4);
      aura.addColorStop(0, darkMode ? `${primary}44` : `${primary}28`);
      aura.addColorStop(0.55, darkMode ? `${secondary}22` : `${secondary}15`);
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // 6 flowing bioluminescent tentacles trailing along spine
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
        ctx.lineWidth = tIdx === 2 ? 1.9 : 1.25;
        ctx.globalAlpha = darkMode ? 0.65 : 0.62;
        ctx.stroke();
      }

      // Translucent Umbrella Bell oriented along heading
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      const bellGrad = ctx.createRadialGradient(bellH * 0.2, 0, 2, 0, 0, bellW);
      bellGrad.addColorStop(0, '#ffffffcc');
      bellGrad.addColorStop(0.45, primary);
      bellGrad.addColorStop(1, secondary);

      ctx.fillStyle = bellGrad;
      ctx.globalAlpha = darkMode ? 0.84 : 0.78;
      ctx.beginPath();
      ctx.moveTo(-bellH * 0.15, -bellW);
      ctx.bezierCurveTo(bellH * 1.15, -bellW * 0.9, bellH * 1.15, bellW * 0.9, -bellH * 0.15, bellW);
      ctx.quadraticCurveTo(-bellH * 0.35, 0, -bellH * 0.15, -bellW);
      ctx.fill();

      // Inner glowing nucleus
      ctx.beginPath();
      ctx.ellipse(bellH * 0.18, 0, bellH * 0.28, bellW * 0.42, 0, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = darkMode ? 0.65 : 0.5;
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

      // Water glow
      const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, c.size * 2.0);
      halo.addColorStop(0, darkMode ? `${primary}28` : `${primary}1c`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, c.size * 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Front & rear articulated flippers
      ctx.fillStyle = accent;
      ctx.globalAlpha = darkMode ? 0.86 : 0.88;
      for (const side of [-1, 1]) {
        // Front flipper
        ctx.save();
        ctx.translate(c.size * 0.25, side * c.size * 0.42);
        ctx.rotate(side * (0.45 + paddle * 0.38));
        ctx.beginPath();
        ctx.ellipse(0, side * c.size * 0.36, c.size * 0.2, c.size * 0.52, -side * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Rear flipper
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
      ctx.fillStyle = accent;
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.ellipse(c.size * 0.78, 0, c.size * 0.28, c.size * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();

      // Eyes
      ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(c.size * 0.88, side * c.size * 0.11, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Carapace Shell with radial shading & hexagonal scutes
      const shellGrad = ctx.createRadialGradient(-c.size * 0.1, -c.size * 0.1, 2, 0, 0, c.size * 0.75);
      shellGrad.addColorStop(0, secondary);
      shellGrad.addColorStop(0.6, primary);
      shellGrad.addColorStop(1, darkMode ? '#064e3b' : '#065f46');

      ctx.beginPath();
      ctx.ellipse(0, 0, c.size * 0.68, c.size * 0.54, 0, 0, Math.PI * 2);
      ctx.fillStyle = shellGrad;
      ctx.globalAlpha = 0.95;
      ctx.fill();
      ctx.strokeStyle = secondary;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Inner scute hexagon lines
      ctx.strokeStyle = darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.55)';
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
      // Luminous ribbon trail
      if (c.trail.length > 2) {
        for (let i = 1; i < c.trail.length; i++) {
          const prev = c.trail[i - 1];
          const curr = c.trail[i];
          const frac = i / c.trail.length;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = secondary;
          ctx.lineWidth = Math.max(0.8, c.size * 0.45 * frac);
          ctx.globalAlpha = frac * 0.45 * pulse;
          ctx.stroke();
        }
      }

      // Soft star-halo
      const rHalo = c.size * (2.8 + pulse * 1.4);
      const glow = ctx.createRadialGradient(c.x, c.y, 1, c.x, c.y, rHalo);
      glow.addColorStop(0, '#ffffff');
      glow.addColorStop(0.25, primary);
      glow.addColorStop(0.6, darkMode ? `${secondary}55` : `${secondary}33`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.6 + 0.4 * pulse;
      ctx.beginPath();
      ctx.arc(c.x, c.y, rHalo, 0, Math.PI * 2);
      ctx.fill();

      // Tiny bright core
      ctx.beginPath();
      ctx.arc(c.x, c.y, Math.max(1.8, c.size * 0.38), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.95;
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      const nowMs = performance.now();
      const nowSec = nowMs * 0.001;
      const darkMode =
        typeof isDark === 'boolean'
          ? isDark
          : document.documentElement.classList.contains('dark');

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
      const offsetX = (mouse.x - width / 2) * 0.025;
      const offsetY = (mouse.y - height / 2) * 0.025;

      ctx.clearRect(0, 0, width, height);

      // BASE GRADIENT
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (darkMode) {
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(0.4, '#090d1f');
        bgGrad.addColorStop(0.8, '#0b0f2a');
        bgGrad.addColorStop(1, '#020617');
      } else {
        bgGrad.addColorStop(0, '#e0e7ff');
        bgGrad.addColorStop(0.35, '#c7d2fe');
        bgGrad.addColorStop(0.7, '#ddd6fe');
        bgGrad.addColorStop(1, '#fbcfe8');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // CELESTIAL NEBULA CLOUDS
      const nebula1X = width * 0.25 - offsetX * 0.5;
      const nebula1Y = height * 0.35 - offsetY * 0.5;
      const grad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 15, nebula1X, nebula1Y, width * 0.45);
      if (darkMode) {
        grad1.addColorStop(0, intensity === 'vibrant' ? 'rgba(79, 70, 229, 0.20)' : 'rgba(79, 70, 229, 0.08)');
        grad1.addColorStop(0.5, 'rgba(124, 58, 237, 0.09)');
        grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad1.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
        grad1.addColorStop(0.5, 'rgba(168, 85, 247, 0.22)');
        grad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const nebula2X = width * 0.75 + offsetX * 0.6;
      const nebula2Y = height * 0.65 + offsetY * 0.6;
      const grad2 = ctx.createRadialGradient(nebula2X, nebula2Y, 20, nebula2X, nebula2Y, width * 0.4);
      if (darkMode) {
        grad2.addColorStop(0, intensity === 'vibrant' ? 'rgba(236, 72, 153, 0.13)' : 'rgba(236, 72, 153, 0.05)');
        grad2.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad2.addColorStop(0, 'rgba(236, 72, 153, 0.30)');
        grad2.addColorStop(0.5, 'rgba(14, 165, 233, 0.24)');
        grad2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // STARS & CRYSTAL PARTICLES
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha > s.baseAlpha + 0.3 || s.alpha >= 1) s.twinkleDir = -1;
        else if (s.alpha < s.baseAlpha - 0.3 || s.alpha <= 0.1) s.twinkleDir = 1;

        const renderX = s.x - offsetX * (s.size * 0.3);
        const renderY = s.y - offsetY * (s.size * 0.3);
        const colorPrefix = darkMode ? s.colorDark : s.colorLight;
        const alphaMultiplier = darkMode ? 1 : 1.4;
        const finalAlpha = Math.max(0.4, Math.min(s.alpha * alphaMultiplier, 1));

        ctx.beginPath();
        ctx.arc(renderX, renderY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colorPrefix}${finalAlpha})`;
        ctx.fill();

        if (s.size > 1.5 && s.alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${colorPrefix}${finalAlpha * 0.35})`;
          ctx.fill();
        }
      }

      // SHOOTING STARS
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) continue;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.015;
        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          ss.active = false;
          shootingStars.splice(i, 1);
          continue;
        }
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;
        const ssGrad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        if (darkMode) {
          ssGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          ssGrad.addColorStop(0.7, `rgba(199, 210, 254, ${ss.alpha * 0.6})`);
          ssGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);
        } else {
          ssGrad.addColorStop(0, 'rgba(99, 102, 241, 0)');
          ssGrad.addColorStop(0.6, `rgba(147, 51, 234, ${ss.alpha * 0.5})`);
          ssGrad.addColorStop(1, `rgba(79, 70, 229, ${ss.alpha * 0.85})`);
        }
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = ssGrad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? `rgba(255, 255, 255, ${ss.alpha})` : `rgba(99, 102, 241, ${ss.alpha * 0.9})`;
        ctx.fill();
      }

      // AMBIENT BUBBLES & POLLEN SPARKLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= pt.decay;
        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.fill();
        ctx.restore();
      }

      // RIPPLES (Water rings on touch/click & aquatic creatures)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const grow = rp.growSpeed ?? 0.68;
        const fade = rp.fadeSpeed ?? 0.009;
        rp.radius += grow;
        if (rp.growSpeed) {
          rp.growSpeed = Math.max(0.55, rp.growSpeed * 0.985);
        }
        rp.alpha -= fade;
        if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = rp.alpha;
        ctx.lineWidth = rp.lineWidth ?? 1.25;
        ctx.stroke();
        ctx.restore();
      }

      // INTERACTIVE CREATURES
      const isPanicking = interactive && nowMs < panicUntilMs;
      const isMouseFollowing =
        !isPanicking &&
        interactive &&
        mouse.lastMouseMoveAt > 0 &&
        nowMs - mouse.lastMouseMoveAt < 5500;
      const margin = 38;

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        c.animPhase += isPanicking ? 0.038 : 0.0166;
        const creatureTime = c.animPhase;

        if (isPanicking) {
          c.panicJitterTimer -= 1;
          if (c.panicJitterTimer <= 0) {
            c.panicAngle = normalizeAngle(c.panicAngle + (Math.random() - 0.5) * 1.75);
            c.panicJitterTimer = 7 + Math.random() * 13;
          }
          const diff = normalizeAngle(c.panicAngle - c.angle);
          c.angle = normalizeAngle(c.angle + Math.max(-0.24, Math.min(0.24, diff)));
          c.speed += (c.baseSpeed * c.panicSpeedFactor - c.speed) * 0.16;
        } else if (isMouseFollowing) {
          const dx = mouse.targetX - c.x;
          const dy = mouse.targetY - c.y;
          const dist = Math.hypot(dx, dy);

          let desiredAngle = Math.atan2(dy, dx);
          if (dist < c.orbitRadius) {
            desiredAngle += c.orbitSign * (Math.PI * 0.48);
          }

          const diff = normalizeAngle(desiredAngle - c.angle);
          const maxTurn = c.kind === 'dragon' || c.kind === 'turtles' ? 0.068 : 0.092;
          c.angle = normalizeAngle(c.angle + Math.max(-maxTurn, Math.min(maxTurn, diff)));

          const boost = dist > 160 ? 1.35 : dist > 60 ? 1.14 : 0.96;
          c.speed += (c.baseSpeed * boost - c.speed) * 0.08;
        } else {
          c.wanderTimer -= 1;
          if (c.wanderTimer <= 0) {
            c.turnNoise = (Math.random() - 0.5) * 0.048;
            c.wanderTimer = 50 + Math.random() * 110;
          }
          c.angle = normalizeAngle(
            c.angle + c.turnNoise + Math.sin(nowSec * 1.4 + c.phase) * 0.016
          );
          c.speed += (c.baseSpeed - c.speed) * 0.05;
        }

        // Jellyfish gentle thrust pulse
        const speedMultiplier =
          c.kind === 'jellyfish'
            ? 0.72 + 0.52 * Math.max(0, Math.sin(creatureTime * 3.4 + c.phase))
            : 1;

        let vx = Math.cos(c.angle) * c.speed * speedMultiplier;
        let vy = Math.sin(c.angle) * c.speed * speedMultiplier;
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
          if ((c.kind === 'koi' || c.kind === 'turtles') && ripples.length < 22) {
            ripples.push({
              x: c.x,
              y: c.y,
              radius: 6,
              maxRadius: 34,
              alpha: 0.45,
              color: darkMode ? c.primaryDark : c.primaryLight
            });
          }
        }

        // Update firefly ribbon trail
        if (c.kind === 'fireflies') {
          c.trail.push({ x: c.x, y: c.y });
          if (c.trail.length > 14) c.trail.shift();
        }

        // Update articulated spine chain
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
          const finalAng = segAngle + sway * 0.08;
          curr.x = prev.x + Math.cos(finalAng) * c.segDist;
          curr.y = prev.y + Math.sin(finalAng) * c.segDist;
        }

        // Ambient sparkles / bubbles
        if (particles.length < 56 && Math.random() < (isPanicking ? 0.09 : 0.025)) {
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
          if (Math.random() < (isPanicking ? 0.05 : 0.014) && ripples.length < 24) {
            ripples.push({
              x: c.x,
              y: c.y,
              radius: 5,
              maxRadius: 28,
              alpha: 0.35,
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

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(shootingStarTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [interactive, intensity, isDark, creatureTheme]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ display: 'block' }}
    />
  );
};
