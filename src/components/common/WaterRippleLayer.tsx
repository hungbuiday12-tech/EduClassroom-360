import React, { useEffect, useState } from 'react';
import { useAudio } from '../../context/AudioContext';

interface WaterRippleItem {
  id: number;
  boxTop: number;
  boxLeft: number;
  boxWidth: number;
  boxHeight: number;
  borderRadius: string;
  originX: number;
  originY: number;
  diameter: number;
}

let rippleCounter = 0;

export const WaterRippleLayer: React.FC = () => {
  const [ripples, setRipples] = useState<WaterRippleItem[]>([]);
  const { playClick } = useAudio();

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button:not(:disabled), [role="button"]:not([aria-disabled="true"]), [data-ripple="true"], a[href]'
      ) as HTMLElement | null;

      if (!interactiveEl) return;

      playClick();

      const rect = interactiveEl.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return;

      const computedStyle = window.getComputedStyle(interactiveEl);
      const borderRadius = computedStyle.borderRadius || '12px';

      const originX = e.clientX - rect.left;
      const originY = e.clientY - rect.top;
      const maxDistX = Math.max(originX, rect.width - originX);
      const maxDistY = Math.max(originY, rect.height - originY);
      const diameter = Math.max(Math.hypot(maxDistX, maxDistY) * 2.15, 72);

      const id = ++rippleCounter;
      const nextRipple: WaterRippleItem = {
        id,
        boxTop: rect.top,
        boxLeft: rect.left,
        boxWidth: rect.width,
        boxHeight: rect.height,
        borderRadius,
        originX,
        originY,
        diameter
      };

      setRipples((prev) => [...prev.slice(-10), nextRipple]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id));
      }, 920);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true, capture: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [playClick]);

  if (ripples.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[140] overflow-hidden"
    >
      {ripples.map((r) => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            top: `${r.boxTop}px`,
            left: `${r.boxLeft}px`,
            width: `${r.boxWidth}px`,
            height: `${r.boxHeight}px`,
            borderRadius: r.borderRadius,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          {/* Gentle radial water surface shimmer */}
          <span
            className="water-ripple-fill"
            style={{
              position: 'absolute',
              left: `${r.originX}px`,
              top: `${r.originY}px`,
              width: `${r.diameter}px`,
              height: `${r.diameter}px`,
              borderRadius: '9999px',
              background:
                'radial-gradient(circle, rgba(125, 211, 252, 0.38) 0%, rgba(56, 189, 248, 0.2) 38%, rgba(129, 140, 248, 0.08) 68%, rgba(255, 255, 255, 0) 100%)'
            }}
          />
          {/* Primary water wave crest */}
          <span
            className="water-ripple-ring-primary"
            style={{
              position: 'absolute',
              left: `${r.originX}px`,
              top: `${r.originY}px`,
              width: `${r.diameter * 0.92}px`,
              height: `${r.diameter * 0.92}px`,
              borderRadius: '9999px',
              border: '1.5px solid rgba(125, 211, 252, 0.62)',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.25) inset'
            }}
          />
          {/* Secondary trailing water ring */}
          <span
            className="water-ripple-ring-secondary"
            style={{
              position: 'absolute',
              left: `${r.originX}px`,
              top: `${r.originY}px`,
              width: `${r.diameter * 0.72}px`,
              height: `${r.diameter * 0.72}px`,
              borderRadius: '9999px',
              border: '1px solid rgba(186, 230, 253, 0.5)',
              opacity: 0
            }}
          />
        </div>
      ))}
    </div>
  );
};
