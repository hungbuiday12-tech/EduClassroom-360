import React, { useEffect, useRef, useState } from 'react';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface XRayRevealBackgroundProps {
  interactive?: boolean;
  isDark?: boolean;
  paused?: boolean;
  className?: string;
  dockClassName?: string;
}

export const XRayRevealBackground: React.FC<XRayRevealBackgroundProps> = ({
  interactive = true,
  isDark = false,
  paused = false,
  className = '',
}) => {
  const {
    xrayTopImage,
    xrayBottomImage,
    xrayShowAura,
    xraySwapped,
    xrayMaskRadius,
    xrayFitMode,
  } = useBackgroundTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 640,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.45 : 360,
    active: false,
  });

  useEffect(() => {
    if (!interactive || paused) return;
    let targetX = pointer.x;
    let targetY = pointer.y;
    let curX = targetX;
    let curY = targetY;
    let raf = 0;

    const step = () => {
      curX += (targetX - curX) * 0.22;
      curY += (targetY - curY) * 0.22;
      if (containerRef.current) {
        containerRef.current.style.setProperty('--xray-x', `${curX.toFixed(1)}px`);
        containerRef.current.style.setProperty('--xray-y', `${curY.toFixed(1)}px`);
      }
      if (Math.abs(targetX - curX) > 0.4 || Math.abs(targetY - curY) > 0.4) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };

    const scheduleStep = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPointer((prev) => (prev.active ? prev : { x: targetX, y: targetY, active: true }));
      scheduleStep();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive, paused]);

  const outerImg = xraySwapped ? xrayBottomImage : xrayTopImage;
  const innerImg = xraySwapped ? xrayTopImage : xrayBottomImage;
  const radius = Math.max(40, Math.min(220, xrayMaskRadius));
  const softEdge = Math.round(radius * 1.45);
  const maskExpr = `radial-gradient(circle ${softEdge}px at var(--xray-x, 50%) var(--xray-y, 45%), rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${Math.round(
    (radius / softEdge) * 65
  )}%, rgba(0,0,0,1) 100%)`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{
        backgroundColor: isDark ? '#040914' : '#f8fafc',
        ['--xray-x' as string]: `${pointer.x}px`,
        ['--xray-y' as string]: `${pointer.y}px`,
      }}
    >
      {/* Hidden/Inner layer */}
      <img
        src={innerImg}
        alt=""
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full ${
          xrayFitMode === 'contain' ? 'object-contain' : 'object-cover'
        } select-none opacity-85`}
      />

      {/* Top outer layer masked around cursor */}
      <img
        src={outerImg}
        alt=""
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full ${
          xrayFitMode === 'contain' ? 'object-contain' : 'object-cover'
        } select-none`}
        style={{
          WebkitMaskImage: maskExpr,
          maskImage: maskExpr,
        }}
      />

      {/* Subtle scanner aura ring around cursor */}
      {xrayShowAura && (
        <div
          className="absolute rounded-full border border-sky-400/70 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            left: 'var(--xray-x, 50%)',
            top: 'var(--xray-y, 45%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
};
