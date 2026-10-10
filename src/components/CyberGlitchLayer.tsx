import React, { useState, useEffect, useRef } from 'react';
import { cyberSound } from '../utils/cyberSound';

interface CyberGlitchLayerProps {
  triggerKey?: string | number;
}

const SECTION_ACCENT_RGB: Record<string, string> = {
  home: '6, 182, 212',
  about: '217, 70, 239',
  services: '139, 92, 246',
  arsenal: '16, 185, 129',
  projects: '245, 158, 11',
  'quantum-lab': '236, 72, 153',
  process: '244, 63, 94',
  testimonials: '59, 130, 246',
  contact: '132, 204, 22',
};

/**
 * Global Cinematic 'Lens-Shift' (`backdrop-filter: blur()`) & Glitch Transition Layer
 * Triggers a subtle optical rack-focus (`backdrop-filter: blur()`) transition whenever
 * scrolling between different sections, plus on-demand terminal glitch bursts.
 */
export const CyberGlitchLayer: React.FC<CyberGlitchLayerProps> = ({ triggerKey }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [isLensShifting, setIsLensShifting] = useState(false);
  const [lensBlurPx, setLensBlurPx] = useState(0);
  const prevTriggerKeyRef = useRef<string | number | undefined>(triggerKey);
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lensTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireGlitch = React.useCallback((playAudio: boolean = true) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
    }

    setIsGlitching(true);

    if (playAudio) {
      cyberSound.playGlitch();
    }

    glitchTimeoutRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, 180);
  }, []);

  // Trigger subtle cinematic 'lens-shift' backdrop-filter: blur() transition on section change
  useEffect(() => {
    if (triggerKey === undefined) return;
    if (prevTriggerKeyRef.current === undefined) {
      prevTriggerKeyRef.current = triggerKey;
      return;
    }

    if (prevTriggerKeyRef.current !== triggerKey) {
      prevTriggerKeyRef.current = triggerKey;

      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return;
      }

      if (lensTimeoutRef.current) {
        clearTimeout(lensTimeoutRef.current);
      }

      // Scale subtle rack-focus blur by current scroll velocity (2.5px -> 4.5px)
      const scrollVel = Math.abs(window.__lenisScrollState?.velocity || 0);
      const targetBlur = Math.min(4.5, Math.max(2.4, 2.4 + scrollVel * 0.12));

      setLensBlurPx(Number(targetBlur.toFixed(2)));
      setIsLensShifting(true);

      lensTimeoutRef.current = setTimeout(() => {
        setIsLensShifting(false);
        setLensBlurPx(0);
      }, 360);
    }
  }, [triggerKey]);

  // Global custom event listener so terminal commands can trigger glitch on demand
  useEffect(() => {
    const handleCustomGlitch = (e: Event) => {
      const customEvent = e as CustomEvent<{ sound?: boolean }>;
      const sound = customEvent.detail?.sound ?? true;
      fireGlitch(sound);
    };

    window.addEventListener('trigger-cyber-glitch', handleCustomGlitch);
    return () => {
      window.removeEventListener('trigger-cyber-glitch', handleCustomGlitch);
      if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
      if (lensTimeoutRef.current) clearTimeout(lensTimeoutRef.current);
    };
  }, [fireGlitch]);

  const accentRgb = SECTION_ACCENT_RGB[String(triggerKey || 'home')] || '6, 182, 212';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
      aria-hidden="true"
      data-cinema-lens-shift={isLensShifting ? 'active' : 'idle'}
    >
      {/* Subtle Scroll-Triggered Cinematic 'Lens-Shift' Rack-Focus Backdrop Blur Layer */}
      <div
        style={{
          backdropFilter: isLensShifting
            ? `blur(${lensBlurPx}px) saturate(1.16)`
            : 'blur(0px) saturate(1)',
          WebkitBackdropFilter: isLensShifting
            ? `blur(${lensBlurPx}px) saturate(1.16)`
            : 'blur(0px) saturate(1)',
          opacity: isLensShifting ? 1 : 0,
          background: `radial-gradient(circle at 50% 50%, rgba(${accentRgb}, 0.015) 35%, rgba(5, 3, 14, 0.12) 100%)`,
          transition:
            'backdrop-filter 340ms cubic-bezier(0.22, 1, 0.36, 1), -webkit-backdrop-filter 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Top & Bottom Anamorphic Lens-Shift Chromatic Refraction Lines during Section Rack-Focus */}
        <div
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.45), rgba(255, 255, 255, 0.65), rgba(${accentRgb}, 0.45), transparent)`,
            transform: isLensShifting ? 'scaleX(1)' : 'scaleX(0.2)',
            transition: 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute top-0 inset-x-0 h-[1.5px] opacity-75"
        />
        <div
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.35), transparent)`,
            transform: isLensShifting ? 'scaleX(1)' : 'scaleX(0.2)',
            transition: 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute bottom-0 inset-x-0 h-[1px] opacity-60"
        />
      </div>

      {/* On-Demand Horizontal Digital Scanline Burst */}
      {isGlitching && (
        <div
          className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-glitch-scanline"
          style={{ willChange: 'transform, opacity' }}
        />
      )}
    </div>
  );
};
