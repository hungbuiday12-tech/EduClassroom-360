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

interface Creature {
  kind: Exclude<BackgroundCreatureTheme, 'galaxy'>;
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
  primaryLight: string;
  secondaryLight: string;
  spine: SpineNode[];
  segDist: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
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
  className = '',
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
      lastMouseMoveAt: 0,
    };

    const darkStarColors = [
      'rgba(255, 255, 255, ',
      'rgba(199, 210, 254, ',
      'rgba(224, 231, 255, ',
      'rgba(253, 230, 138, ',
      'rgba(244, 114, 182, ',
      'rgba(167, 139, 250, ',
    ];

    const lightStarColors = [
      'rgba(99, 102, 241, ',
      'rgba(2, 132, 199, ',
      'rgba(147, 51, 234, ',
      'rgba(217, 119, 6, ',
      'rgba(219, 39, 119, ',
      'rgba(13, 148, 136, ',
    ];

    const starCount = Math.min(Math.floor((width * height) / 6800), 180);
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
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
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
          active: true,
        });
      }
    };

    const shootingStarTimer = setInterval(() => {
      if (Math.random() < 0.7) {
        spawnShootingStar();
      }
    }, 3800);

    // Build animated creatures for selected theme
    const creatures: Creature[] = [];
    const ripples: Ripple[] = [];

    const createCreature = (
      kind: Exclude<BackgroundCreatureTheme, 'galaxy'>,
      idx: number
    ): Creature => {
      const x = Math.random() * Math.max(width - 120, 100) + 60;
      const y = Math.random() * Math.max(height - 120, 100) + 60;
      const angle = Math.random() * Math.PI * 2;
      let segCount = 1;
      let segDist = 10;
      let baseSpeed = 1.6;
      let size = 14;

      const palettes = {
        koi: [
          { pd: '#fb923c', sd: '#fef3c7', pl: '#ea580c', sl: '#fed7aa' },
          { pd: '#f43f5e', sd: '#fecdd3', pl: '#e11d48', sl: '#ffe4e6' },
          { pd: '#38bdf8', sd: '#e0f2fe', pl: '#0284c7', sl: '#bae6fd' },
          { pd: '#facc15', sd: '#fef9c3', pl: '#d97706', sl: '#fde68a' },
          { pd: '#a78bfa', sd: '#ede9fe', pl: '#7c3aed', sl: '#ddd6fe' },
          { pd: '#2dd4bf', sd: '#ccfbf1', pl: '#0d9488', sl: '#99f6e4' },
        ],
        dragon: [
          { pd: '#38bdf8', sd: '#f59e0b', pl: '#1d4ed8', sl: '#d97706' },
          { pd: '#c084fc', sd: '#fde047', pl: '#7e22ce', sl: '#ea580c' },
        ],
        birds: [
          { pd: '#e0f2fe', sd: '#93c5fd', pl: '#1e3a8a', sl: '#3b82f6' },
          { pd: '#fde68a', sd: '#f59e0b', pl: '#0f766e', sl: '#14b8a6' },
          { pd: '#f8fafc', sd: '#c4b5fd', pl: '#312e81', sl: '#6366f1' },
        ],
        butterflies: [
          { pd: '#f472b6', sd: '#fbcfe8', pl: '#db2777', sl: '#f9a8d4' },
          { pd: '#38bdf8', sd: '#bae6fd', pl: '#0284c7', sl: '#7dd3fc' },
          { pd: '#a78bfa', sd: '#ddd6fe', pl: '#7c3aed', sl: '#c4b5fd' },
          { pd: '#fbbf24', sd: '#fef08a', pl: '#d97706', sl: '#fcd34d' },
        ],
      };

      if (kind === 'koi') {
        segCount = 11;
        segDist = width < 640 ? 7.5 : 9.5;
        baseSpeed = 1.45 + Math.random() * 0.55;
        size = width < 640 ? 11 + (idx % 3) * 1.5 : 14 + (idx % 3) * 2;
      } else if (kind === 'dragon') {
        segCount = 20;
        segDist = width < 640 ? 10 : 13;
        baseSpeed = 2.05 + idx * 0.25;
        size = width < 640 ? 15 : 19;
      } else if (kind === 'birds') {
        segCount = 2;
        segDist = 10;
        baseSpeed = 2.1 + Math.random() * 0.8;
        size = width < 640 ? 11 + (idx % 3) * 2 : 14 + (idx % 3) * 2.5;
      } else {
        segCount = 2;
        segDist = 8;
        baseSpeed = 1.5 + Math.random() * 0.6;
        size = width < 640 ? 10 + (idx % 3) * 1.5 : 12 + (idx % 3) * 2;
      }

      const palList = palettes[kind];
      const pal = palList[idx % palList.length];

      const spine: SpineNode[] = [];
      for (let s = 0; s < segCount; s++) {
        spine.push({
          x: x - Math.cos(angle) * segDist * s,
          y: y - Math.sin(angle) * segDist * s,
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
        orbitRadius: 55 + (idx % 4) * 24,
        primaryDark: pal.pd,
        secondaryDark: pal.sd,
        primaryLight: pal.pl,
        secondaryLight: pal.sl,
        spine,
        segDist,
      };
    };

    if (creatureTheme !== 'galaxy') {
      const countMap: Record<Exclude<BackgroundCreatureTheme, 'galaxy'>, number> = {
        koi: width < 640 ? 5 : 7,
        dragon: width < 640 ? 2 : 2,
        birds: width < 640 ? 6 : 9,
        butterflies: width < 640 ? 7 : 10,
      };
      const count = countMap[creatureTheme];
      for (let i = 0; i < count; i++) {
        creatures.push(createCreature(creatureTheme, i));
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      // Only mouse/trackpad pointers activate cursor-follow mode; mobile touch keeps free-bounce roam
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.lastMouseMoveAt = performance.now();
      }
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const drawKoi = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const spine = c.spine;
      const n = spine.length;

      // Subtle glow around head
      ctx.save();
      const glow = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, c.size * 2.4);
      glow.addColorStop(0, darkMode ? `${primary}33` : `${primary}24`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Pectoral fins behind body
      const head = spine[0];
      const neck = spine[1] || head;
      const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);
      const finWave = Math.sin(nowSec * 6 + c.phase) * 0.25;

      for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(neck.x, neck.y);
        ctx.rotate(headAngle + side * (0.95 + finWave));
        ctx.fillStyle = secondary;
        ctx.globalAlpha = darkMode ? 0.65 : 0.72;
        ctx.beginPath();
        ctx.ellipse(c.size * 0.55, 0, c.size * 0.62, c.size * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Caudal (tail) fan fin
      const tailTip = spine[n - 1];
      const preTail = spine[n - 2] || tailTip;
      const tailAngle = Math.atan2(tailTip.y - preTail.y, tailTip.x - preTail.x);
      const tailSwing = Math.sin(nowSec * 7 + c.phase) * 0.28;
      ctx.save();
      ctx.translate(tailTip.x, tailTip.y);
      ctx.rotate(tailAngle + tailSwing);
      ctx.fillStyle = secondary;
      ctx.globalAlpha = darkMode ? 0.72 : 0.78;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(c.size * 0.85, -c.size * 0.65, c.size * 1.15, -c.size * 0.28);
      ctx.quadraticCurveTo(c.size * 0.65, 0, c.size * 1.15, c.size * 0.28);
      ctx.quadraticCurveTo(c.size * 0.85, c.size * 0.65, 0, 0);
      ctx.fill();
      ctx.restore();

      // Tapered segmented body
      for (let i = n - 1; i >= 0; i--) {
        const p = spine[i];
        const ratio = 1 - i / n;
        const r = c.size * (i === 0 ? 0.48 : 0.54 * Math.pow(ratio, 0.72) + 0.08);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 1 ? secondary : primary;
        ctx.globalAlpha = darkMode ? 0.85 : 0.88;
        ctx.fill();
      }

      // Koi eyes
      const eyeOffset = c.size * 0.26;
      for (const side of [-1, 1]) {
        const ex = head.x + Math.cos(headAngle + side * 1.1) * eyeOffset;
        const ey = head.y + Math.sin(headAngle + side * 1.1) * eyeOffset;
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(1.5, c.size * 0.1), 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
        ctx.globalAlpha = 0.95;
        ctx.fill();
      }

      ctx.restore();
    };

    const drawDragon = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const accent = darkMode ? c.secondaryDark : c.secondaryLight;
      const spine = c.spine;
      const n = spine.length;

      ctx.save();
      // Cosmic aura around dragon head
      const glow = ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, c.size * 3.5);
      glow.addColorStop(0, darkMode ? `${primary}44` : `${primary}28`);
      glow.addColorStop(0.5, darkMode ? `${accent}22` : `${accent}15`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Dragon legs/fins at segments 4 and 11
      for (const segIdx of [4, 11]) {
        const node = spine[segIdx];
        const prev = spine[segIdx - 1];
        if (!node || !prev) continue;
        const segAng = Math.atan2(prev.y - node.y, prev.x - node.x);
        const legWave = Math.sin(nowSec * 5 + segIdx + c.phase) * 0.3;
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(segAng + side * (1.25 + legWave));
          ctx.strokeStyle = accent;
          ctx.lineWidth = 2.2;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(c.size * 0.55, side * c.size * 0.2, c.size * 0.95, 0);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Dorsal spine glow & scales from tail -> head
      for (let i = n - 1; i >= 1; i--) {
        const p = spine[i];
        const tRatio = 1 - i / n;
        const r = c.size * (0.16 + 0.36 * Math.sin(tRatio * Math.PI * 0.85));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? primary : accent;
        ctx.globalAlpha = darkMode ? 0.78 : 0.82;
        ctx.fill();

        // Dorsal fin spikes
        if (i % 2 === 0 && i < n - 2) {
          const prev = spine[i - 1];
          const ang = Math.atan2(prev.y - p.y, prev.x - p.x);
          const spikeX = p.x + Math.cos(ang + Math.PI / 2) * (r * 1.45);
          const spikeY = p.y + Math.sin(ang + Math.PI / 2) * (r * 1.45);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(spikeX, spikeY);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = 0.7;
          ctx.stroke();
        }
      }

      // Dragon Head + Horns + Whiskers
      const head = spine[0];
      const neck = spine[1] || head;
      const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(headAngle);

      // Horns sweeping backward
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = 0.92;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.1, side * c.size * 0.25);
        ctx.quadraticCurveTo(-c.size * 0.7, side * c.size * 0.75, -c.size * 1.15, side * c.size * 0.48);
        ctx.stroke();

        // Flowing whiskers forward-outward
        const whiskerWave = Math.sin(nowSec * 6 + c.phase + side) * 3;
        ctx.beginPath();
        ctx.moveTo(c.size * 0.55, side * c.size * 0.18);
        ctx.quadraticCurveTo(c.size * 0.8, side * (c.size * 0.8 + whiskerWave), c.size * 0.15, side * (c.size * 1.2 + whiskerWave));
        ctx.strokeStyle = darkMode ? '#fef08a' : accent;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      // Snout diamond head
      ctx.fillStyle = primary;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.moveTo(c.size * 0.85, 0);
      ctx.lineTo(c.size * 0.15, -c.size * 0.45);
      ctx.lineTo(-c.size * 0.35, -c.size * 0.25);
      ctx.lineTo(-c.size * 0.35, c.size * 0.25);
      ctx.lineTo(c.size * 0.15, c.size * 0.45);
      ctx.closePath();
      ctx.fill();

      // Glowing eyes
      ctx.fillStyle = darkMode ? '#fef08a' : '#ffffff';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(c.size * 0.22, side * c.size * 0.22, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    };

    const drawBird = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const flap = Math.sin(nowSec * 7.5 + c.phase);
      const wingSpread = c.size * (0.95 + flap * 0.42);
      const wingSweep = -c.size * 0.42 + flap * c.size * 0.28;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      // Soft halo in dark mode
      if (darkMode) {
        ctx.shadowColor = primary;
        ctx.shadowBlur = 10;
      }

      // Streamlined body + forked tail
      ctx.fillStyle = primary;
      ctx.globalAlpha = darkMode ? 0.9 : 0.85;
      ctx.beginPath();
      ctx.moveTo(c.size * 0.65, 0);
      ctx.quadraticCurveTo(0, -c.size * 0.18, -c.size * 0.72, -c.size * 0.16);
      ctx.lineTo(-c.size * 0.45, 0);
      ctx.lineTo(-c.size * 0.72, c.size * 0.16);
      ctx.quadraticCurveTo(0, c.size * 0.18, c.size * 0.65, 0);
      ctx.fill();

      // Flapping graceful wings
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(c.size * 0.18, 0);
        ctx.quadraticCurveTo(
          c.size * 0.05,
          side * wingSpread * 0.55,
          wingSweep,
          side * wingSpread
        );
        ctx.quadraticCurveTo(
          -c.size * 0.28,
          side * wingSpread * 0.35,
          -c.size * 0.22,
          0
        );
        ctx.closePath();
        ctx.fillStyle = side === 1 ? primary : secondary;
        ctx.globalAlpha = darkMode ? 0.85 : 0.82;
        ctx.fill();
      }

      ctx.restore();
    };

    const drawButterfly = (c: Creature, darkMode: boolean, nowSec: number) => {
      const primary = darkMode ? c.primaryDark : c.primaryLight;
      const secondary = darkMode ? c.secondaryDark : c.secondaryLight;
      const flapScale = 0.32 + 0.68 * Math.abs(Math.cos(nowSec * 8.5 + c.phase));

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      if (darkMode) {
        ctx.shadowColor = primary;
        ctx.shadowBlur = 12;
      }

      // Wings
      for (const side of [-1, 1]) {
        ctx.save();
        ctx.scale(1, side * flapScale);

        // Forewing
        ctx.beginPath();
        ctx.moveTo(c.size * 0.15, 0);
        ctx.bezierCurveTo(
          c.size * 0.85,
          c.size * 0.65,
          c.size * 0.15,
          c.size * 1.25,
          -c.size * 0.2,
          c.size * 0.55
        );
        ctx.closePath();
        ctx.fillStyle = primary;
        ctx.globalAlpha = darkMode ? 0.82 : 0.78;
        ctx.fill();

        // Hindwing
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.05, 0);
        ctx.bezierCurveTo(
          -c.size * 0.25,
          c.size * 0.9,
          -c.size * 0.85,
          c.size * 0.75,
          -c.size * 0.45,
          0
        );
        ctx.closePath();
        ctx.fillStyle = secondary;
        ctx.globalAlpha = darkMode ? 0.75 : 0.72;
        ctx.fill();

        ctx.restore();
      }

      // Body & antennae
      ctx.strokeStyle = darkMode ? '#f8fafc' : '#1e293b';
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(-c.size * 0.4, 0);
      ctx.lineTo(c.size * 0.45, 0);
      ctx.stroke();

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

      const nebula3X = width * 0.5 + Math.sin(nowSec * 0.6) * 40;
      const nebula3Y = height * 0.5 + Math.cos(nowSec * 0.6) * 30;
      const grad3 = ctx.createRadialGradient(nebula3X, nebula3Y, 10, nebula3X, nebula3Y, width * 0.35);
      if (darkMode) {
        grad3.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
        grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        grad3.addColorStop(0, 'rgba(129, 140, 248, 0.26)');
        grad3.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = grad3;
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

      // RIPPLES (Koi water rings)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 0.65;
        rp.alpha -= 0.009;
        if (rp.alpha <= 0 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = rp.alpha;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // INTERACTIVE CREATURES (Follow laptop mouse OR freely roam & bounce on mobile/idle)
      const isMouseFollowing =
        interactive && mouse.lastMouseMoveAt > 0 && nowMs - mouse.lastMouseMoveAt < 4500;
      const margin = 36;

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];

        if (isMouseFollowing) {
          // Steer smoothly toward mouse cursor with gentle tangential swirl once close
          const dx = mouse.targetX - c.x;
          const dy = mouse.targetY - c.y;
          const dist = Math.hypot(dx, dy);

          let desiredAngle = Math.atan2(dy, dx);
          if (dist < c.orbitRadius) {
            desiredAngle += c.orbitSign * (Math.PI * 0.48);
          }

          const diff = normalizeAngle(desiredAngle - c.angle);
          const maxTurn = c.kind === 'dragon' ? 0.055 : 0.075;
          c.angle = normalizeAngle(c.angle + Math.max(-maxTurn, Math.min(maxTurn, diff)));

          const boost = dist > 160 ? 1.35 : dist > 60 ? 1.12 : 0.96;
          c.speed += (c.baseSpeed * boost - c.speed) * 0.08;
        } else {
          // Autonomous organic swimming/flying + reflective bounce on screen edges
          c.wanderTimer -= 1;
          if (c.wanderTimer <= 0) {
            c.turnNoise = (Math.random() - 0.5) * 0.045;
            c.wanderTimer = 50 + Math.random() * 110;
          }
          c.angle = normalizeAngle(
            c.angle + c.turnNoise + Math.sin(nowSec * 1.4 + c.phase) * 0.015
          );
          c.speed += (c.baseSpeed - c.speed) * 0.05;
        }

        let vx = Math.cos(c.angle) * c.speed;
        let vy = Math.sin(c.angle) * c.speed;
        c.x += vx;
        c.y += vy;

        // Reflective edge bounce (essential on mobile/touch & idle screens)
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
          if (c.kind === 'koi' && ripples.length < 10) {
            ripples.push({
              x: c.x,
              y: c.y,
              radius: 6,
              maxRadius: 34,
              alpha: 0.45,
              color: darkMode ? c.primaryDark : c.primaryLight,
            });
          }
        }

        // Update articulated spine chain (Koi & Dragon)
        c.spine[0].x = c.x;
        c.spine[0].y = c.y;
        const wiggleAmp = c.kind === 'dragon' ? 0.14 : 0.11;
        for (let s = 1; s < c.spine.length; s++) {
          const prev = c.spine[s - 1];
          const curr = c.spine[s];
          const segAngle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
          const sway = Math.sin(nowSec * 6.5 - s * 0.55 + c.phase) * wiggleAmp;
          const finalAng = segAngle + sway * 0.08;
          curr.x = prev.x + Math.cos(finalAng) * c.segDist;
          curr.y = prev.y + Math.sin(finalAng) * c.segDist;
        }

        if (c.kind === 'koi') {
          if (Math.random() < 0.012 && ripples.length < 12) {
            ripples.push({
              x: c.x,
              y: c.y,
              radius: 5,
              maxRadius: 28,
              alpha: 0.35,
              color: darkMode ? c.primaryDark : c.primaryLight,
            });
          }
          drawKoi(c, darkMode, nowSec);
        } else if (c.kind === 'dragon') {
          drawDragon(c, darkMode, nowSec);
        } else if (c.kind === 'birds') {
          drawBird(c, darkMode, nowSec);
        } else {
          drawButterfly(c, darkMode, nowSec);
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
