import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export type UltraRevealMode =
  | 'ultraSlideUp'
  | 'prismUnfold3D'
  | 'quantumPortalZoom'
  | 'orbitalSweepLeft'
  | 'orbitalSweepRight'
  | 'helixRise'
  | 'elasticHyperPop'
  | 'vortexAscend'
  | 'cyberBladeMatrix'
  | 'tesseractFold3D'
  | 'supernovaIgnition'
  | 'gravityWaveAscend';

interface ScrollSlideUpRevealProps {
  children: React.ReactNode;
  variant?: 'section' | 'connector';
  mode?: UltraRevealMode;
  accentHex?: string;
  cinemaActLabel?: string;
  delayMs?: number;
  offsetY?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  initiallyVisible?: boolean;
  className?: string;
}

const getInitialTransformForMode = (mode: UltraRevealMode, offsetY: number, isConnector: boolean) => {
  switch (mode) {
    case 'orbitalSweepLeft':
    case 'cyberBladeMatrix':
      return {
        opacity: 0,
        x: -16,
        y: offsetY * 0.55,
        scale: 0.97,
      };
    case 'orbitalSweepRight':
    case 'tesseractFold3D':
      return {
        opacity: 0,
        x: 16,
        y: offsetY * 0.55,
        scale: 0.97,
      };
    default:
      return {
        opacity: 0,
        x: 0,
        y: offsetY * 0.55,
        scale: isConnector ? 0.98 : 0.97,
      };
  }
};

/**
 * Ultra-Level IntersectionObserver-based Scroll Arrival Wrapper
 * Triggers multi-axis 3D spring arrival + anamorphic cinema lens flare sweep when entering the viewport.
 */
export const ScrollSlideUpReveal: React.FC<ScrollSlideUpRevealProps> = ({
  children,
  variant = 'section',
  mode = 'ultraSlideUp',
  accentHex = '#06b6d4',
  cinemaActLabel,
  delayMs = 0,
  offsetY = variant === 'connector' ? 28 : 36,
  threshold = variant === 'connector' ? 0.08 : 0.04,
  rootMargin = '0px 0px 4% 0px',
  once = true,
  initiallyVisible = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  useEffect(() => {
    if (initiallyVisible && once) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, initiallyVisible]);

  const isConnector = variant === 'connector';
  const hiddenState = getInitialTransformForMode(mode, offsetY, isConnector);

  return (
    <motion.div
      ref={containerRef}
      data-scroll-reveal={variant}
      data-reveal-mode={mode}
      data-cinema-act={cinemaActLabel || undefined}
      data-io-visible={isVisible ? 'true' : 'false'}
      initial={false}
      animate={
        isVisible
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }
          : hiddenState
      }
      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
        delay: delayMs / 1000,
      }}
      className={`relative transform-gpu io-slide-up-target ${isVisible ? 'io-slide-up-visible' : 'io-slide-up-hidden'} ${className}`}
    >
      {/* Ultra-Smooth Cinema Arrival Horizon Sweep (Pure transform/opacity, zero blur filter) */}
      {isVisible && variant === 'section' && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: 1.15, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delayMs / 1000 }}
          style={{
            background: `linear-gradient(90deg, transparent, ${accentHex}, #ffffff, ${accentHex}, transparent)`,
          }}
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl h-[2px] z-30 rounded-full transform-gpu"
        />
      )}
      {children}
    </motion.div>
  );
};
