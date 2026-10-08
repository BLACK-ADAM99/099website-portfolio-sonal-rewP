import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  onMouseEnter,
  className = '',
  type = 'button',
  disabled = false,
  strength = 0.25,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 240, mass: 0.35 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
      ref.current.style.willChange = 'transform';
    }
    onMouseEnter?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;
      const rect = rectRef.current || (rectRef.current = el.getBoundingClientRect());
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((clientX - centerX) * strength);
      y.set((clientY - centerY) * strength);
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    x.set(0);
    y.set(0);
    if (ref.current) {
      ref.current.style.willChange = 'auto';
    }
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};
