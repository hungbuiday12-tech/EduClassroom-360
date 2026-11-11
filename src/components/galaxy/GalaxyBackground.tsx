import React, { useEffect, useRef } from 'react';

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

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  interactive = true,
  intensity = 'vibrant',
  isDark,
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

    // Dark Mode cosmic star palette
    const darkStarColors = [
      'rgba(255, 255, 255, ',
      'rgba(199, 210, 254, ', // soft indigo
      'rgba(224, 231, 255, ', // ice blue
      'rgba(253, 230, 138, ', // cosmic gold
      'rgba(244, 114, 182, ', // nebula pink
      'rgba(167, 139, 250, ', // astral violet
    ];

    // Light Mode prismatic crystalline stardust palette
    const lightStarColors = [
      'rgba(99, 102, 241, ',  // royal indigo
      'rgba(2, 132, 199, ',   // ocean blue
      'rgba(147, 51, 234, ',  // amethyst
      'rgba(217, 119, 6, ',   // amber gold
      'rgba(219, 39, 119, ',  // rose quartz
      'rgba(13, 148, 136, ',  // teal aurora
    ];

    // Generate stars
    const starCount = Math.min(Math.floor((width * height) / 6500), 190);
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

    // Shooting stars
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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Determine if current theme is dark
      const darkMode =
        typeof isDark === 'boolean'
          ? isDark
          : document.documentElement.classList.contains('dark');

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const offsetX = (mouse.x - width / 2) * 0.025;
      const offsetY = (mouse.y - height / 2) * 0.025;

      ctx.clearRect(0, 0, width, height);

      // BASE GRADIENT
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (darkMode) {
        bgGrad.addColorStop(0, '#030712');   // deep slate-950
        bgGrad.addColorStop(0.4, '#090d1f'); // cosmic indigo
        bgGrad.addColorStop(0.8, '#0b0f2a'); // astral violet
        bgGrad.addColorStop(1, '#020617');
      } else {
        // Rich Celestial Daylight Aurora Sky in Light Mode (distinct, vibrant, never plain white)
        bgGrad.addColorStop(0, '#e0e7ff');   // crystalline indigo-100
        bgGrad.addColorStop(0.35, '#c7d2fe'); // rich periwinkle
        bgGrad.addColorStop(0.7, '#ddd6fe'); // lavender astral twilight
        bgGrad.addColorStop(1, '#fbcfe8');   // vibrant cosmic rose aurora
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
        // Vivid daylight aurora glow
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

      // Central floating cosmic shimmer
      const nebula3X = width * 0.5 + Math.sin(Date.now() * 0.0006) * 40;
      const nebula3Y = height * 0.5 + Math.cos(Date.now() * 0.0006) * 30;
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

        const colorPrefix = darkMode ? s.colorDark : s.colorLight;
        const alphaMultiplier = darkMode ? 1 : 1.4;
        const finalAlpha = Math.max(0.4, Math.min(s.alpha * alphaMultiplier, 1));

        ctx.beginPath();
        ctx.arc(renderX, renderY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colorPrefix}${finalAlpha})`;
        ctx.fill();

        // Extra halo flare for larger stardust
        if (s.size > 1.5 && s.alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${colorPrefix}${finalAlpha * 0.35})`;
          ctx.fill();
        }
      }

      // SHOOTING STARS (Comets in Dark / Prismatic Meteors in Light)
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
          // Prismatic comet tail in light mode
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
        ctx.fillStyle = darkMode
          ? `rgba(255, 255, 255, ${ss.alpha})`
          : `rgba(99, 102, 241, ${ss.alpha * 0.9})`;
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
  }, [interactive, intensity, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ display: 'block' }}
    />
  );
};
