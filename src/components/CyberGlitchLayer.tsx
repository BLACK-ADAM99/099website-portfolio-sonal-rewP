import React, { useState, useEffect, useRef } from 'react';
import { cyberSound } from '../utils/cyberSound';

interface CyberGlitchLayerProps {
  triggerKey?: string | number;
}

export const CyberGlitchLayer: React.FC<CyberGlitchLayerProps> = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireGlitch = React.useCallback((playAudio: boolean = true) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsGlitching(true);

    if (playAudio) {
      cyberSound.playGlitch();
    }

    timeoutRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, 180);
  }, []);

  // Global custom event listener so terminal commands can trigger it on demand
  useEffect(() => {
    const handleCustomGlitch = (e: Event) => {
      const customEvent = e as CustomEvent<{ sound?: boolean }>;
      const sound = customEvent.detail?.sound ?? true;
      fireGlitch(sound);
    };

    window.addEventListener('trigger-cyber-glitch', handleCustomGlitch);
    return () => {
      window.removeEventListener('trigger-cyber-glitch', handleCustomGlitch);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [fireGlitch]);

  if (!isGlitching) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Horizontal Digital Scanline Burst (Pure transform/opacity, zero backdrop-filter) */}
      <div 
        className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-glitch-scanline"
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
};
