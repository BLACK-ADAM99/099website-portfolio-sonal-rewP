import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  CINEMA_SERIES_ACTS,
  CinemaSeriesAct,
} from './CyberScrollVideoBackground';

export const CyberScrollProgress: React.FC = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const [activeAct, setActiveAct] = useState<CinemaSeriesAct>(CINEMA_SERIES_ACTS[0]);

  // Ultra smooth spring physics for the scroll progression (100% GPU scaleX, zero React re-renders)
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 30,
    restDelta: 0.0005,
  });

  useEffect(() => {
    const handleFrameEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.cinemaAct) {
        const nextAct = detail.cinemaAct as CinemaSeriesAct;
        setActiveAct((prev) => (prev.actNumber === nextAct.actNumber ? prev : nextAct));
      }
    };
    window.addEventListener('cyber-video-frame', handleFrameEvent, { passive: true });
    return () => window.removeEventListener('cyber-video-frame', handleFrameEvent);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[4px] pointer-events-none select-none bg-black/35"
    >
      {/* Background Track Guide Rail */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-fuchsia-950/30 to-cyan-950/40" />

      {/* 9-Act Cinema Series Chapter Tick Markers */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        {CINEMA_SERIES_ACTS.map((act) => {
          const leftPct = (act.startSec / 9.0) * 100;
          const isReached = activeAct.actNumber >= act.actNumber;
          return (
            <div
              key={act.actNumber}
              style={{
                left: `${leftPct}%`,
                backgroundColor: isReached ? act.accentHex : 'rgba(148, 163, 184, 0.35)',
                boxShadow: isReached ? `0 0 8px ${act.accentHex}` : 'none',
              }}
              className="absolute top-0 w-[2px] h-[5px] rounded-full transition-colors duration-300"
            />
          );
        })}
      </div>

      {/* Primary Animated Neon Gradient Bar */}
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-emerald-400 shadow-[0_0_16px_rgba(217,70,239,0.85),0_0_28px_rgba(6,182,212,0.7)] relative"
      >
        {/* Leading Edge Quantum Photon Bead */}
        <div
          style={{
            borderColor: activeAct.accentHex,
            boxShadow: `0 0 12px ${activeAct.accentHex}, 0 0 22px #ec4899, 0 0 28px #ffffff`,
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white border flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
        </div>

        {/* Ambient Underglow Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300 blur-[2px] opacity-80" />
      </motion.div>
    </div>
  );
});
