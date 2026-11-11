import React, { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
  interactive?: boolean;
  intensity?: 'subtle' | 'vibrant';
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
  color: string;
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

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  interactive = true,
  intensity = 'vibrant',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for subtle gravitational parallax
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    // Color palette for cosmic stars
    const starColors = [
      'rgba(255, 255, 255, ',
      'rgba(199, 210, 254, ', // soft indigo/blue
      'rgba(224, 231, 255, ', // ice blue
      'rgba(253, 230, 138, ', // cosmic gold
      'rgba(244, 114, 182, ', // nebula pink
      'rgba(167, 139, 250, ', // astral violet
    ];

    // Generate stars
    const starCount = Math.min(Math.floor((width * height) / 7000), 180);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const size = Math.random() < 0.8 ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 1.2;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const baseAlpha = Math.random() * 0.7 + 0.3;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    const spawnShootingStar = () => {
      if (shootingStars.filter((s) => s.active).length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg
          alpha: 1,
          active: true,
        });
      }
    };

    // Interval for shooting stars
    const shootingStarTimer = setInterval(() => {
      if (Math.random() < 0.7) {
        spawnShootingStar();
      }
    }, 4000);

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const offsetX = (mouse.x - width / 2) * 0.03;
      const offsetY = (mouse.y - height / 2) * 0.03;

      // Deep Space Cosmic Background
      ctx.clearRect(0, 0, width, height);

      // Base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030712'); // slate-950 deep
      bgGrad.addColorStop(0.4, '#090d1f'); // cosmic indigo midnight
      bgGrad.addColorStop(0.8, '#0b0f2a'); // astral deep violet
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Cosmic Nebula Clouds (Soft floating radial glows)
      const nebula1X = width * 0.25 - offsetX * 0.5;
      const nebula1Y = height * 0.35 - offsetY * 0.5;
      const grad1 = ctx.createRadialGradient(nebula1X, nebula1Y, 10, nebula1X, nebula1Y, width * 0.45);
      grad1.addColorStop(0, intensity === 'vibrant' ? 'rgba(79, 70, 229, 0.18)' : 'rgba(79, 70, 229, 0.08)');
      grad1.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const nebula2X = width * 0.75 + offsetX * 0.6;
      const nebula2Y = height * 0.65 + offsetY * 0.6;
      const grad2 = ctx.createRadialGradient(nebula2X, nebula2Y, 20, nebula2X, nebula2Y, width * 0.4);
      grad2.addColorStop(0, intensity === 'vibrant' ? 'rgba(236, 72, 153, 0.12)' : 'rgba(236, 72, 153, 0.05)');
      grad2.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Distant Starlight field
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Drift
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Twinkle
        s.alpha += s.twinkleSpeed * s.twinkleDir;
        if (s.alpha > s.baseAlpha + 0.3 || s.alpha >= 1) {
          s.twinkleDir = -1;
        } else if (s.alpha < s.baseAlpha - 0.3 || s.alpha <= 0.1) {
          s.twinkleDir = 1;
        }

        // Parallax offset
        const renderX = s.x - offsetX * (s.size * 0.3);
        const renderY = s.y - offsetY * (s.size * 0.3);

        ctx.beginPath();
        ctx.arc(renderX, renderY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${Math.max(0.1, Math.min(s.alpha, 1))})`;
        ctx.fill();

        // Extra flare for larger bright stars
        if (s.size > 1.8 && s.alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${s.alpha * 0.18})`;
          ctx.fill();
        }
      }

      // Render Shooting Stars
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
        ssGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        ssGrad.addColorStop(0.7, `rgba(199, 210, 254, ${ss.alpha * 0.6})`);
        ssGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = ssGrad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Glowing head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(shootingStarTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ display: 'block' }}
    />
  );
};
