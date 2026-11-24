import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  amount?: number;
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.56,
  amount = 0.12,
  distance = 32
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialTransform =
    direction === 'up'
      ? { y: distance, x: 0, scale: 0.985 }
      : direction === 'down'
      ? { y: -distance, x: 0, scale: 0.985 }
      : direction === 'left'
      ? { x: distance, y: 0, scale: 0.99 }
      : direction === 'right'
      ? { x: -distance, y: 0, scale: 0.99 }
      : { x: 0, y: 14, scale: 0.95 };

  return (
    <motion.div
      initial={{ opacity: 0, ...initialTransform }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin: '0px 0px -36px 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export const ScrollProgressBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className={`fixed top-0 left-0 right-0 h-[3px] z-[90] bg-gradient-to-r from-sky-500 via-teal-400 to-amber-400 pointer-events-none ${className}`}
    />
  );
};
