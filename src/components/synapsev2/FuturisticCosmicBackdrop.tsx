import React, { useEffect, useRef } from 'react';

interface StarNode {
  x: number;
  y: number;
  z: number;
  size: number;
  hue: number;
  phase: number;
}

interface QuantumNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

interface WarpComet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number;
  maxLife: number;
  color: string;
}

export const FuturisticCosmicBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pointer = { x: width * 0.5, y: height * 0.35, tx: width * 0.5, ty: height * 0.35 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize);

    // 1. Parallax Starfield
    const starCount = 135;
    const stars: StarNode[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.25 + Math.random() * 1.15,
      size: 0.7 + Math.random() * 1.9,
      hue: Math.random() < 0.6 ? 195 : Math.random() < 0.82 ? 255 : 42,
      phase: Math.random() * Math.PI * 2
    }));

    // 2. Quantum Neural Constellation Nodes
    const nodePalette = ['#38bdf8', '#818cf8', '#22d3ee', '#c084fc', '#fbbf24'];
    const nodeCount = 42;
    const nodes: QuantumNode[] = Array.from({ length: nodeCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      vx: (Math.random() - 0.5) * 26,
      vy: (Math.random() - 0.5) * 18,
      r: 1.5 + Math.random() * 2.1,
      color: nodePalette[idx % nodePalette.length]
    }));

    // 3. Occasional Quantum Warp Comets
    const comets: WarpComet[] = [];
    let cometCooldown = 0.8;

    let rafId = 0;
    let lastTs = performance.now();
    let elapsed = 0;

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (!prefersReducedMotion) {
        elapsed += dt;
      }

      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4.5);
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4.5);
      const pxNorm = (pointer.x / Math.max(1, width) - 0.5) * 2;
      const pyNorm = (pointer.y / Math.max(1, height) - 0.5) * 2;

      ctx.clearRect(0, 0, width, height);

      // A. Volumetric Nebula Atmospheric Glows
      const coreX = width * 0.5 + pxNorm * 28;
      const coreY = height * 0.24 + pyNorm * 18;

      const neb1 = ctx.createRadialGradient(
        width * 0.18 + pxNorm * 18,
        height * 0.22,
        10,
        width * 0.18 + pxNorm * 18,
        height * 0.22,
        Math.max(width, height) * 0.45
      );
      neb1.addColorStop(0, 'rgba(6, 182, 212, 0.26)');
      neb1.addColorStop(0.5, 'rgba(59, 130, 246, 0.10)');
      neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(
        width * 0.84 - pxNorm * 22,
        height * 0.34,
        10,
        width * 0.84 - pxNorm * 22,
        height * 0.34,
        Math.max(width, height) * 0.46
      );
      neb2.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
      neb2.addColorStop(0.5, 'rgba(236, 72, 153, 0.09)');
      neb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // B. Infinite Perspective Futuristic Synth-Horizon Floor Grid
      const horizonY = height * 0.52;
      const vanishX = width * 0.5 + pxNorm * 35;

      ctx.save();
      const gridFade = ctx.createLinearGradient(0, horizonY, 0, height);
      gridFade.addColorStop(0, 'rgba(56, 189, 248, 0.04)');
      gridFade.addColorStop(0.35, 'rgba(56, 189, 248, 0.20)');
      gridFade.addColorStop(1, 'rgba(129, 140, 248, 0.32)');
      ctx.strokeStyle = gridFade;
      ctx.lineWidth = 1;

      const radialLines = 18;
      for (let i = -radialLines; i <= radialLines; i++) {
        const spread = (i / radialLines) * width * 1.45;
        ctx.beginPath();
        ctx.moveTo(vanishX + spread * 0.06, horizonY);
        ctx.lineTo(vanishX + spread, height + 20);
        ctx.stroke();
      }

      const horizSteps = 14;
      const scrollPhase = (elapsed * 0.42) % 1;
      for (let i = 0; i < horizSteps; i++) {
        const t = (i + scrollPhase) / horizSteps;
        const p = Math.pow(t, 2.25);
        const y = horizonY + p * (height - horizonY + 12);
        ctx.globalAlpha = 0.08 + p * 0.26;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Horizon Atmospheric Glow Band
      const horizBand = ctx.createLinearGradient(0, horizonY - 45, 0, horizonY + 70);
      horizBand.addColorStop(0, 'rgba(56, 189, 248, 0)');
      horizBand.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
      horizBand.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = horizBand;
      ctx.fillRect(0, horizonY - 45, width, 115);

      // C. Colossal Rotating Orbital Dyson Astrolabe Rings in Deep Space
      ctx.save();
      ctx.translate(coreX, coreY);
      const baseR = Math.min(width, height) * 0.36;

      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const rx = baseR * (0.72 + rIdx * 0.24);
        const ry = rx * (0.28 + rIdx * 0.08);
        const tilt =
          (rIdx === 0 ? -0.22 : rIdx === 1 ? 0.19 : -0.07) +
          Math.sin(elapsed * 0.25 + rIdx) * 0.05;

        ctx.save();
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle =
          rIdx === 0
            ? 'rgba(56, 189, 248, 0.26)'
            : rIdx === 1
            ? 'rgba(168, 85, 247, 0.22)'
            : 'rgba(251, 191, 36, 0.16)';
        ctx.lineWidth = rIdx === 1 ? 1.8 : 1.25;
        ctx.setLineDash(rIdx === 1 ? [14, 10] : [6, 12]);
        ctx.lineDashOffset = -elapsed * (18 + rIdx * 10) * (rIdx % 2 === 0 ? 1 : -1);
        ctx.stroke();

        // Orbiting telemetry node along each mega-ring
        const theta = elapsed * (0.35 - rIdx * 0.08) * (rIdx % 2 === 0 ? 1 : -1) + rIdx * 2.1;
        const nx = Math.cos(theta) * rx;
        const ny = Math.sin(theta) * ry;
        ctx.setLineDash([]);
        ctx.fillStyle = rIdx === 2 ? '#fbbf24' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // D. Twinkling Parallax Starfield
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = 0.45 + 0.55 * Math.sin(elapsed * 2.4 + s.phase);
        const sx = (s.x - pxNorm * 16 * s.z + width) % width;
        const sy = (s.y - pyNorm * 10 * s.z + height) % height;
        ctx.fillStyle = `hsla(${s.hue}, 92%, 78%, ${0.35 + twinkle * 0.55})`;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size * (0.8 + twinkle * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }

      // E. Interactive Quantum Neural Constellation Mesh
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReducedMotion) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height * 0.92) n.vy *= -1;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 24500) {
            const alpha = (1 - Math.sqrt(d2) / 156) * 0.24;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Subtle interactive tether to mouse pointer
        const mdx = a.x - pointer.x;
        const mdy = a.y - pointer.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 32000) {
          const alpha = (1 - Math.sqrt(md2) / 178) * 0.38;
          ctx.strokeStyle = `rgba(192, 132, 252, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.fillStyle = a.color;
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // F. Quantum Warp Comets streaking through the sky
      if (!prefersReducedMotion) {
        cometCooldown -= dt;
        if (cometCooldown <= 0 && comets.length < 3) {
          cometCooldown = 1.6 + Math.random() * 2.4;
          const fromLeft = Math.random() < 0.5;
          comets.push({
            x: fromLeft ? -40 : width + 40,
            y: Math.random() * height * 0.45,
            vx: (fromLeft ? 1 : -1) * (420 + Math.random() * 280),
            vy: 90 + Math.random() * 110,
            len: 95 + Math.random() * 85,
            life: 0,
            maxLife: 1.4 + Math.random() * 0.8,
            color: Math.random() < 0.65 ? '#38bdf8' : '#c084fc'
          });
        }

        for (let i = comets.length - 1; i >= 0; i--) {
          const c = comets[i];
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.life += dt;
          const fade = Math.sin(Math.min(1, c.life / c.maxLife) * Math.PI);
          const mag = Math.hypot(c.vx, c.vy) || 1;
          const tx = c.x - (c.vx / mag) * c.len;
          const ty = c.y - (c.vy / mag) * c.len;

          const grad = ctx.createLinearGradient(tx, ty, c.x, c.y);
          grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          grad.addColorStop(1, c.color);
          ctx.save();
          ctx.globalAlpha = Math.max(0, fade * 0.75);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
          ctx.restore();

          if (c.life >= c.maxLife) {
            comets.splice(i, 1);
          }
        }
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 85% 55% at 50% 0%, rgba(14, 116, 144, 0.34) 0%, transparent 65%), radial-gradient(circle at 12% 35%, rgba(79, 70, 229, 0.30) 0%, transparent 50%), radial-gradient(circle at 88% 28%, rgba(168, 85, 247, 0.28) 0%, transparent 52%), linear-gradient(180deg, #06102d 0%, #091338 45%, #060d26 100%)'
      }}
    >
      {/* Animated Floating Aurora Blobs */}
      <div className="synapse-aurora-blob-a absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="synapse-aurora-blob-b absolute top-1/4 -right-24 w-[36rem] h-[36rem] rounded-full bg-violet-600/20 blur-3xl" />
      <div className="synapse-aurora-blob-c absolute -bottom-32 left-1/3 w-[38rem] h-[26rem] rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Live 60FPS Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Horizon Scanline Sheen */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(186,230,253,0.4) 0px, rgba(186,230,253,0.4) 1px, transparent 1px, transparent 4px)'
        }}
      />
    </div>
  );
};
