import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface CyberTiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number;
  glowColor?: string;
  showCorners?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CyberTiltCard: React.FC<CyberTiltCardProps> = ({
  children,
  className = '',
  tiltMax = 6.5,
  glowColor = 'rgba(217, 70, 239, 0.22)',
  showCorners = true,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springConfig = { stiffness: 230, damping: 24, mass: 0.4 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [tiltMax, -tiltMax]), springConfig);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-tiltMax, tiltMax]), springConfig);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
      ref.current.style.willChange = 'transform';
    }
    onMouseEnter?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el) return;
      const rect = rectRef.current || (rectRef.current = el.getBoundingClientRect());
      const xPct = (clientX - rect.left) / Math.max(1, rect.width);
      const yPct = (clientY - rect.top) / Math.max(1, rect.height);
      mx.set(xPct - 0.5);
      my.set(yPct - 0.5);
      el.style.setProperty('--spot-x', `${Math.round(xPct * 100)}%`);
      el.style.setProperty('--spot-y', `${Math.round(yPct * 100)}%`);
    });
  };

  const handleLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    mx.set(0);
    my.set(0);
    if (ref.current) {
      ref.current.style.willChange = 'auto';
    }
    onMouseLeave?.();
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
      }}
      whileHover={{ y: -6, scale: 1.018 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      className={`group relative overflow-hidden cyber-glass-card backdrop-blur-[4px] ${className}`}
    >
      {/* Dynamic Cursor-Following Radial Spotlight */}
      <div
        style={{
          background: `radial-gradient(circle 240px at var(--spot-x, 50%) var(--spot-y, 50%), ${glowColor}, transparent 74%)`,
        }}
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
      />

      {/* Holographic Diagonal Sheen Sweep on Hover */}
      <div
        style={{
          background:
            'linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.06) 48%, rgba(6, 182, 212, 0.1) 52%, transparent 70%)',
        }}
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none z-0"
      />

      {/* Top Specular Glass Edge Highlight */}
      <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Animated Cyber Corner Brackets on Hover */}
      {showCorners && (
        <>
          <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/0 group-hover:border-cyan-400/90 group-hover:w-3.5 group-hover:h-3.5 transition-all duration-300 pointer-events-none z-20" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-fuchsia-400/0 group-hover:border-fuchsia-400/90 group-hover:w-3.5 group-hover:h-3.5 transition-all duration-300 pointer-events-none z-20" />
          <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-fuchsia-400/0 group-hover:border-fuchsia-400/90 group-hover:w-3.5 group-hover:h-3.5 transition-all duration-300 pointer-events-none z-20" />
          <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/0 group-hover:border-cyan-400/90 group-hover:w-3.5 group-hover:h-3.5 transition-all duration-300 pointer-events-none z-20" />
        </>
      )}

      {children}
    </motion.div>
  );
};
