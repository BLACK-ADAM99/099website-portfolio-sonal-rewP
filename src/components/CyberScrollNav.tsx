import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cyberSound } from '../utils/cyberSound';

interface SectionTarget {
  id: string;
  label: string;
}

interface CyberScrollNavProps {
  onScrollTo: (id: string) => void;
  activeSection: string;
}

const SECTIONS: SectionTarget[] = [
  { id: 'home', label: '01 // HERO' },
  { id: 'about', label: '02 // BIO' },
  { id: 'services', label: '03 // SERVICES' },
  { id: 'quant', label: '04 // ALGO QUANT' },
  { id: 'projects', label: '05 // BUILDS' },
  { id: 'arsenal', label: '06 // ARSENAL' },
  { id: 'process', label: '07 // PIPELINE' },
  { id: 'testimonials', label: '08 // REVIEWS' },
  { id: 'contact', label: '09 // UPLINK' },
];

export const CyberScrollNav: React.FC<CyberScrollNavProps> = React.memo(({ onScrollTo, activeSection }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const pctSpanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0 && pctSpanRef.current) {
        const current = Math.min(100, Math.max(0, Math.round((window.scrollY / totalScroll) * 100)));
        pctSpanRef.current.textContent = `${current.toString().padStart(3, '0')}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-2.5 pointer-events-none select-none"
    >
      {/* Scroll Progress Readout (Direct DOM update — 0 React re-renders) */}
      <div className="px-2 py-0.5 rounded bg-[#0a051d]/85 border border-purple-500/40 text-[9px] font-mono text-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] mb-0.5">
        <span ref={pctSpanRef}>000%</span>
      </div>

      {/* Vertical Navigation Nodes Track */}
      <div className="relative py-2.5 px-1.5 rounded-full bg-[#0a051d]/75 border border-purple-900/50 backdrop-blur-md shadow-[0_0_20px_rgba(147,51,234,0.2)] flex flex-col items-center gap-2.5 pointer-events-auto">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const isHovered = hoveredSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              aria-label={`Jump to ${sec.label}`}
              className="relative flex items-center justify-center cursor-pointer group p-0.5"
              onMouseEnter={() => {
                setHoveredSection(sec.id);
                cyberSound.playHover();
              }}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => {
                cyberSound.playClick();
                onScrollTo(sec.id);
              }}
            >
              {/* Floating Section Label on Left */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 6, scale: 0.95 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-7 px-2.5 py-1 rounded bg-[#0c0624]/95 border border-fuchsia-500/70 text-[9.5px] font-mono text-fuchsia-300 font-bold whitespace-nowrap shadow-[0_0_15px_rgba(217,70,239,0.4)] pointer-events-none"
                  >
                    {sec.label}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicator Dot */}
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-fuchsia-400 shadow-[0_0_12px_#ec4899] ring-2 ring-fuchsia-500/50 scale-125'
                    : 'w-1.5 h-1.5 bg-purple-700/60 hover:bg-cyan-400 hover:scale-150'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
});
