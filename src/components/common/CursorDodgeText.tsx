import React, { useEffect, useRef } from 'react';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface CursorDodgeTextProps {
  text: string;
  highlightWords?: string[];
  className?: string;
  as?: 'h1' | 'h2' | 'p' | 'div' | 'span';
  radius?: number;
}

export const CursorDodgeText: React.FC<CursorDodgeTextProps> = ({
  text,
  highlightWords = [],
  className = '',
  as: Tag = 'h1',
  radius = 140
}) => {
  const { dodgeEnabled, dodgeIntensity } = useBackgroundTheme();
  const containerRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false, burstAt: 0 });
  const words = text.split(/\s+/).filter(Boolean);
  const highlightSet = new Set(highlightWords.map((w) => w.toLowerCase()));

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!dodgeEnabled || prefersReduced) {
      wordRefs.current.forEach((el) => {
        if (!el) return;
        el.style.setProperty('--dodge-x', '0px');
        el.style.setProperty('--dodge-y', '0px');
        el.style.setProperty('--dodge-rot', '0deg');
      });
      return;
    }

    const strength = dodgeIntensity === 'lively' ? 38 : 20;
    const rotStrength = dodgeIntensity === 'lively' ? 7 : 3.5;

    const states = words.map(() => ({ x: 0, y: 0, rot: 0, vx: 0, vy: 0 }));
    let rafId = 0;

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };

    const handleLeave = () => {
      pointerRef.current.active = false;
    };

    const handleDown = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
      pointerRef.current.burstAt = performance.now();
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerleave', handleLeave);
    window.addEventListener('pointerdown', handleDown, { passive: true });

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const ptr = pointerRef.current;
      const isBurst = ptr.burstAt > 0 && now - ptr.burstAt < 420;
      const effRadius = isBurst ? radius * 1.45 : radius;
      const effStrength = isBurst ? strength * 1.5 : strength;

      let anyMoving = false;

      for (let i = 0; i < words.length; i++) {
        const el = wordRefs.current[i];
        const st = states[i];
        if (!el || !st) continue;

        let targetX = 0;
        let targetY = 0;
        let targetRot = 0;

        if (ptr.active) {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width * 0.5 - st.x;
          const cy = rect.top + rect.height * 0.5 - st.y;
          const dx = cx - ptr.x;
          const dy = cy - ptr.y;
          const dist = Math.hypot(dx, dy);

          if (dist < effRadius) {
            const safeDist = Math.max(dist, 14);
            const falloff = Math.pow(1 - dist / effRadius, 1.4);
            targetX = (dx / safeDist) * effStrength * falloff;
            targetY = (dy / safeDist) * effStrength * falloff;
            targetRot = Math.max(
              -rotStrength,
              Math.min(rotStrength, ((dx / safeDist) * (dy >= 0 ? 1 : -1)) * rotStrength * falloff)
            );
          }
        }

        // Smooth critically damped spring toward target
        const stiffness = 0.22;
        const damping = 0.72;
        st.vx = (st.vx + (targetX - st.x) * stiffness) * damping;
        st.vy = (st.vy + (targetY - st.y) * stiffness) * damping;
        st.x += st.vx;
        st.y += st.vy;
        st.rot += (targetRot - st.rot) * 0.22;

        if (
          Math.abs(st.x) > 0.05 ||
          Math.abs(st.y) > 0.05 ||
          Math.abs(st.vx) > 0.02 ||
          Math.abs(st.vy) > 0.02
        ) {
          anyMoving = true;
          el.style.setProperty('--dodge-x', `${st.x.toFixed(1)}px`);
          el.style.setProperty('--dodge-y', `${st.y.toFixed(1)}px`);
          el.style.setProperty('--dodge-rot', `${st.rot.toFixed(2)}deg`);
        } else if (el.style.getPropertyValue('--dodge-x') !== '0px') {
          el.style.setProperty('--dodge-x', '0px');
          el.style.setProperty('--dodge-y', '0px');
          el.style.setProperty('--dodge-rot', '0deg');
        }
      }

      if (!ptr.active && !anyMoving && !isBurst) {
        // Keep light idle loop running only while pointer is active or settling
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('pointerdown', handleDown);
    };
  }, [dodgeEnabled, dodgeIntensity, radius, text]);

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      className={className}
      aria-label={text}
    >
      {words.map((word, idx) => {
        const clean = word.replace(/[.,:;!?()–—]/g, '').toLowerCase();
        const isHighlighted = highlightSet.has(clean);
        return (
          <React.Fragment key={`${word}-${idx}`}>
            <span
              ref={(el) => {
                wordRefs.current[idx] = el;
              }}
              className={`cursor-dodge-token select-none ${
                isHighlighted ? 'text-accent-gradient' : ''
              }`}
            >
              {word}
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};
