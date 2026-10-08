import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CyberTextReveal } from './CyberTextReveal';

interface SectionConnectorProps {
  nodeId: string;
  label: string;
  tag: string;
  videoPhase?: string;
}

const NODE_TIMECODE_MAP: Record<
  string,
  {
    actTransition: string;
    phase: string;
    targetFrame: number;
    primaryHex: string;
    secondaryHex: string;
  }
> = {
  NODE_01: {
    actTransition: 'ACT I → ACT II',
    phase: '00:01.20s // FRAME 072/540 // 3D CODE CHAMBER',
    targetFrame: 72,
    primaryHex: '#06b6d4', // Electric Cyan
    secondaryHex: '#d946ef', // Neon Fuchsia
  },
  NODE_02: {
    actTransition: 'ACT II → ACT III',
    phase: '00:02.40s // FRAME 144/540 // 6-STREAM CONVERGENCE',
    targetFrame: 144,
    primaryHex: '#d946ef', // Neon Fuchsia
    secondaryHex: '#8b5cf6', // Quantum Violet
  },
  NODE_03: {
    actTransition: 'ACT III → ACT IV',
    phase: '00:03.60s // FRAME 216/540 // 28-CORE CHROMATIC PRISM',
    targetFrame: 216,
    primaryHex: '#10b981', // Cyber Emerald
    secondaryHex: '#06b6d4', // Electric Cyan
  },
  NODE_04: {
    actTransition: 'ACT IV → ACT V',
    phase: '00:04.60s // FRAME 276/540 // 32-PIN CHIP IGNITION',
    targetFrame: 276,
    primaryHex: '#f59e0b', // Solar Amber
    secondaryHex: '#f97316', // Plasma Orange
  },
  NODE_05: {
    actTransition: 'ACT V → ACT VI',
    phase: '00:05.70s // FRAME 342/540 // QUANTUM PIPELINE LAB',
    targetFrame: 342,
    primaryHex: '#8b5cf6', // Quantum Violet
    secondaryHex: '#ec4899', // Magenta Pulse
  },
  NODE_06: {
    actTransition: 'ACT VI → ACT VII',
    phase: '00:06.80s // FRAME 408/540 // 40-NODE PCB TOPOLOGY',
    targetFrame: 408,
    primaryHex: '#f43f5e', // Crimson Laser
    secondaryHex: '#eab308', // Supernova Gold
  },
  NODE_07: {
    actTransition: 'ACT VII → ACT VIII',
    phase: '00:07.80s // FRAME 468/540 // TRIANGULATED NEURAL MESH',
    targetFrame: 468,
    primaryHex: '#3b82f6', // Cobalt Sapphire
    secondaryHex: '#14b8a6', // Bioluminescent Teal
  },
  NODE_08: {
    actTransition: 'ACT VIII → ACT IX',
    phase: '00:08.60s // FRAME 516/540 // SINGULARITY SUPERNOVA',
    targetFrame: 516,
    primaryHex: '#84cc16', // Acid Lime
    secondaryHex: '#06b6d4', // Electric Cyan
  },
};

export const SectionConnector: React.FC<SectionConnectorProps> = ({
  nodeId,
  label,
  tag,
  videoPhase,
}) => {
  const nodeMeta = NODE_TIMECODE_MAP[nodeId] || {
    actTransition: 'CINEMA SERIES',
    phase: '4K 60FPS SYNC',
    targetFrame: 270,
    primaryHex: '#06b6d4',
    secondaryHex: '#d946ef',
  };
  const phaseReadout = videoPhase || nodeMeta.phase;
  const connectorRef = useRef<HTMLDivElement | null>(null);
  const [inViewport, setInViewport] = useState(false);
  const [isFrameAligned, setIsFrameAligned] = useState(false);

  // Dedicated IntersectionObserver triggering a smooth slide-up entrance when entering the viewport
  useEffect(() => {
    const el = connectorRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInViewport(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -5% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Listen to live 60FPS background video frame telemetry to highlight when this connector's frame is active
  useEffect(() => {
    const handleVideoFrame = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.currentFrame === 'number') {
        const nextAligned = Math.abs(detail.currentFrame - nodeMeta.targetFrame) <= 38;
        setIsFrameAligned((prev) => (prev === nextAligned ? prev : nextAligned));
      }
    };
    window.addEventListener('cyber-video-frame', handleVideoFrame, { passive: true });
    return () => window.removeEventListener('cyber-video-frame', handleVideoFrame);
  }, [nodeMeta.targetFrame]);

  return (
    <motion.div
      ref={connectorRef}
      data-scroll-reveal="connector"
      data-node-id={nodeId}
      data-io-visible={inViewport ? 'true' : 'false'}
      initial={false}
      animate={
        inViewport
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 24, scale: 0.96 }
      }
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative py-10 sm:py-14 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none transform-gpu io-slide-up-target ${
        inViewport ? 'io-slide-up-visible' : 'io-slide-up-hidden'
      }`}
    >
      {/* Top Vertical Conduit with Unsheathe Slide-Up & Counter-Propagating Laser Sparks */}
      <motion.div
        initial={false}
        animate={inViewport ? { scaleY: 1, opacity: 1 } : { scaleY: 0.2, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '50% 100%' }}
        className="relative w-[2px] h-14 sm:h-20 bg-gradient-to-b from-cyan-500/15 via-cyan-400/55 to-fuchsia-500/45 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#06b6d4] animate-laser-y" />
        <div
          className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-transparent via-fuchsia-400 to-transparent shadow-[0_0_12px_#ec4899] animate-laser-y opacity-80"
          style={{ animationDirection: 'reverse', animationDuration: '4.5s' }}
        />
      </motion.div>

      {/* Horizontal Expanding Laser Wings + Central Cyber-Glass Interconnect Node */}
      <div className="relative flex items-center justify-center w-full max-w-4xl px-4 my-1.5">
        <motion.div
          initial={false}
          animate={inViewport ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '100% 50%' }}
          className="hidden sm:block flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/35 to-cyan-400/75 mr-3"
        />

        <motion.div
          initial={false}
          animate={
            inViewport
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 16, scale: 0.94 }
          }
          transition={{ duration: 0.42, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className={`relative flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 px-4 py-1.5 rounded-full bg-[#060a14]/90 border backdrop-blur-sm transition-colors duration-300 group ${
            isFrameAligned
              ? 'border-cyan-300/80 shadow-[0_0_32px_rgba(6,182,212,0.42)]'
              : 'border-cyan-400/45 shadow-[0_0_24px_rgba(6,182,212,0.24)]'
          }`}
        >
          {/* Arrival Shockwave Pulse Ring when entering viewport */}
          {inViewport && (
            <motion.span
              initial={{ opacity: 0.75, scale: 0.85 }}
              animate={{ opacity: 0, scale: 1.55 }}
              transition={{ duration: 0.95, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-cyan-400/60 pointer-events-none"
            />
          )}

          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/15 via-white/10 to-fuchsia-500/15 blur-md pointer-events-none" />

          <div className="absolute -inset-1 rounded-full border border-dashed border-cyan-400/35 animate-spin-slow pointer-events-none" />

          <div className="relative flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#06b6d4] relative z-10" />
            <span className="absolute w-3 h-3 rounded-full bg-cyan-400/40 animate-ping" />
          </div>

          <span
            style={{
              borderColor: `${nodeMeta.primaryHex}66`,
              color: nodeMeta.primaryHex,
            }}
            className="relative z-10 px-2 py-0.5 rounded-full bg-slate-950/80 border text-[9px] font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            {nodeMeta.actTransition}
          </span>

          <span className="relative z-10 text-[10px] font-mono font-bold tracking-widest text-cyan-300">
            {nodeId}
          </span>

          <span className="relative z-10 text-[10px] font-mono text-slate-400/70">//</span>

          <span className="relative z-10 text-[10px] font-mono tracking-wider text-white font-semibold uppercase">
            <CyberTextReveal
              text={label}
              mode="words"
              effect="cyberSlide"
              staggerDelay={0.045}
              interactiveHover={false}
            />
          </span>

          <span className="relative z-10 hidden md:inline-block px-2 py-0.5 rounded bg-cyan-950/65 border border-cyan-500/40 text-[9px] font-mono text-cyan-200 font-bold">
            {phaseReadout}
          </span>

          <span className="relative z-10 hidden sm:inline-block px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-[9px] font-mono text-fuchsia-300 font-bold">
            {tag}
          </span>

          <div className="relative flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#ec4899] relative z-10" />
            <span className="absolute w-3 h-3 rounded-full bg-fuchsia-400/40 animate-ping" />
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={inViewport ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '0% 50%' }}
          className="hidden sm:block flex-1 h-[1px] bg-gradient-to-l from-transparent via-fuchsia-500/35 to-fuchsia-400/75 ml-3"
        />
      </div>

      {/* Bottom Vertical Conduit into Next Section */}
      <motion.div
        initial={false}
        animate={inViewport ? { scaleY: 1, opacity: 1 } : { scaleY: 0.2, opacity: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '50% 0%' }}
        className="relative w-[2px] h-14 sm:h-20 bg-gradient-to-b from-fuchsia-500/45 via-cyan-400/50 to-transparent overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_15px_#ffffff] animate-laser-y" />
      </motion.div>
    </motion.div>
  );
};
