import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cyberSound } from '../utils/cyberSound';

interface DockSection {
  id: string;
  key: string;
  nodeCode: string;
  name: string;
  shortLabel: string;
  accentHex: string;
  secondaryHex: string;
  iconColor: string;
  badgeBorder: string;
  badgeBg: string;
  activeGlow: string;
  renderIcon: (className?: string, isActive?: boolean) => React.ReactNode;
}

interface CyberQuickDockProps {
  activeSection: string;
  onScrollTo: (id: string) => void;
  isModalOpen?: boolean;
}

const DOCK_SECTIONS: DockSection[] = [
  {
    id: 'home',
    key: '1',
    nodeCode: 'SYS.01',
    name: 'Hero Mainframe',
    shortLabel: 'HERO',
    accentHex: '#22d3ee',
    secondaryHex: '#38bdf8',
    iconColor: 'text-cyan-300',
    badgeBorder: 'border-cyan-400/50',
    badgeBg: 'bg-cyan-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(34,211,238,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14.5C15 13.9477 14.5523 13.5 14 13.5H10C9.44772 13.5 9 13.9477 9 14.5V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.2" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'about',
    key: '2',
    nodeCode: 'SYS.02',
    name: 'Bio & Neural Roots',
    shortLabel: 'BIO',
    accentHex: '#e879f9',
    secondaryHex: '#c084fc',
    iconColor: 'text-fuchsia-300',
    badgeBorder: 'border-fuchsia-400/50',
    badgeBg: 'bg-fuchsia-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(232,121,249,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <circle
          cx="12"
          cy="8"
          r="4"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.85"
        />
        <path
          d="M4.5 20.2C4.5 16.4 7.85 13.8 12 13.8C16.15 13.8 19.5 16.4 19.5 20.2"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'services',
    key: '3',
    nodeCode: 'SYS.03',
    name: 'Capabilities Matrix',
    shortLabel: 'SERVICES',
    accentHex: '#a78bfa',
    secondaryHex: '#818cf8',
    iconColor: 'text-violet-300',
    badgeBorder: 'border-violet-400/50',
    badgeBg: 'bg-violet-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(167,139,250,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          rx="2.2"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.85"
        />
        <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" fill="currentColor" />
        <path
          d="M9 2.5V6M15 2.5V6M9 18V21.5M15 18V21.5M2.5 9H6M2.5 15H6M18 9H21.5M18 15H21.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'arsenal',
    key: '4',
    nodeCode: 'SYS.04',
    name: '16-Core Chromatic Arsenal',
    shortLabel: 'ARSENAL',
    accentHex: '#34d399',
    secondaryHex: '#10b981',
    iconColor: 'text-emerald-300',
    badgeBorder: 'border-emerald-400/50',
    badgeBg: 'bg-emerald-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(52,211,153,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M12 3L21 7.8L12 12.6L3 7.8L12 3Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinejoin="round"
        />
        <path
          d="M3 12.4L12 17.2L21 12.4"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 16.8L12 21.4L21 16.8"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'projects',
    key: '5',
    nodeCode: 'SYS.05',
    name: 'Engineered Builds',
    shortLabel: 'PROJECTS',
    accentHex: '#fbbf24',
    secondaryHex: '#f59e0b',
    iconColor: 'text-amber-300',
    badgeBorder: 'border-amber-400/50',
    badgeBg: 'bg-amber-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(251,191,36,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M7.5 8L3 12L7.5 16M16.5 8L21 12L16.5 16"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.8 5L10.2 19"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'quantum-lab',
    key: '6',
    nodeCode: 'SYS.06',
    name: 'Quantum Pipeline Lab',
    shortLabel: 'LAB',
    accentHex: '#f472b6',
    secondaryHex: '#ec4899',
    iconColor: 'text-pink-300',
    badgeBorder: 'border-pink-400/50',
    badgeBg: 'bg-pink-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(244,114,182,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M9 3H15M10 3V8.8L4.6 17.6C3.8 18.9 4.75 20.6 6.3 20.6H17.7C19.25 20.6 20.2 18.9 19.4 17.6L14 8.8V3"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7.2 15H16.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="11" cy="17.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'process',
    key: '7',
    nodeCode: 'SYS.07',
    name: 'Execution Pipeline',
    shortLabel: 'PROCESS',
    accentHex: '#fb7185',
    secondaryHex: '#f43f5e',
    iconColor: 'text-rose-300',
    badgeBorder: 'border-rose-400/50',
    badgeBg: 'bg-rose-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(251,113,133,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <rect
          x="3"
          y="3.5"
          width="6.5"
          height="6.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.85"
        />
        <rect
          x="14.5"
          y="14"
          width="6.5"
          height="6.5"
          rx="1.5"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.85"
        />
        <path
          d="M9.5 6.8H15.5C16.88 6.8 18 7.92 18 9.3V14M14.5 17.2H8.5C7.12 17.2 6 16.08 6 14.7V10"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'testimonials',
    key: '8',
    nodeCode: 'SYS.08',
    name: 'Client Signals',
    shortLabel: 'REVIEWS',
    accentHex: '#38bdf8',
    secondaryHex: '#06b6d4',
    iconColor: 'text-sky-300',
    badgeBorder: 'border-sky-400/50',
    badgeBg: 'bg-sky-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(56,189,248,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path
          d="M20 15.5C20 16.6 19.1 17.5 18 17.5H8L4 21V5.5C4 4.4 4.9 3.5 6 3.5H18C19.1 3.5 20 4.4 20 5.5V15.5Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.2H15.5M8.5 12.8H13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'contact',
    key: '9',
    nodeCode: 'SYS.09',
    name: 'Quantum Uplink',
    shortLabel: 'CONTACT',
    accentHex: '#a3e635',
    secondaryHex: '#22c55e',
    iconColor: 'text-lime-300',
    badgeBorder: 'border-lime-400/50',
    badgeBg: 'bg-lime-950/55',
    activeGlow: 'shadow-[0_0_16px_rgba(163,230,53,0.65)]',
    renderIcon: (className = 'w-3.5 h-3.5 sm:w-4 sm:h-4') => (
      <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        <path
          d="M8.1 8.1C5.95 10.25 5.95 13.75 8.1 15.9M15.9 8.1C18.05 10.25 18.05 13.75 15.9 15.9"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinecap="round"
        />
        <path
          d="M5.1 5.1C1.3 8.9 1.3 15.1 5.1 18.9M18.9 5.1C22.7 8.9 22.7 15.1 18.9 18.9"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export const CyberQuickDock: React.FC<CyberQuickDockProps> = React.memo(({
  activeSection,
  onScrollTo,
  isModalOpen = false,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [justJumpedKey, setJustJumpedKey] = useState<string | null>(null);

  const activeIndex = Math.max(
    0,
    DOCK_SECTIONS.findIndex((s) => s.id === activeSection)
  );
  const currentAccent = DOCK_SECTIONS[activeIndex]?.accentHex || '#22d3ee';
  const currentSecondary = DOCK_SECTIONS[activeIndex]?.secondaryHex || '#e879f9';

  // Global Keyboard Listener for Numbers 1 through 9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        isModalOpen ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      const key = e.key;
      const match = DOCK_SECTIONS.find(
        (s) => s.key === key || `Numpad${s.key}` === e.code
      );

      if (match) {
        e.preventDefault();
        cyberSound.playClick();
        onScrollTo(match.id);
        setJustJumpedKey(match.key);
        setTimeout(() => setJustJumpedKey(null), 650);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScrollTo, isModalOpen]);

  return (
    <motion.nav
      aria-label="Quick-access section dock"
      initial={{ opacity: 0, y: 42, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 135,
        damping: 20,
        mass: 0.75,
        delay: 0.08,
      }}
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-auto max-w-[99vw]"
    >
      {/* Selected Element: Realistic 3D Semi-Transparent Holographic Command Dock Chassis */}
      <div
        style={{
          boxShadow: `0 18px 46px -8px rgba(0,0,0,0.88), 0 0 28px -4px ${currentAccent}40, inset 0 1px 0 0 rgba(255,255,255,0.22), inset 0 -1px 0 0 ${currentSecondary}35`,
        }}
        className="relative flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl sm:rounded-full bg-[#050816]/75 backdrop-blur-md border border-cyan-400/40 overflow-visible max-w-[98vw] transition-shadow duration-500"
      >
        {/* Holographic Ambient Gradient & GPU Progress Laser Rail */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-full overflow-hidden pointer-events-none">
          <div
            style={{
              background: `radial-gradient(120% 100% at ${(activeIndex / 8) * 100}% 50%, ${currentAccent}24 0%, ${currentSecondary}12 45%, transparent 80%)`,
            }}
            className="absolute inset-0 transition-opacity duration-500"
          />
          {/* Top Specular Glass Rim */}
          <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          {/* Bottom Synchronized Section Progress Laser Rail (GPU scaleX, zero layout reflow) */}
          <div className="absolute bottom-0 inset-x-5 h-[1.5px] bg-slate-800/70 overflow-hidden rounded-full">
            <div
              style={{
                transform: `scaleX(${(activeIndex + 1) / DOCK_SECTIONS.length})`,
                transformOrigin: '0% 50%',
                background: `linear-gradient(90deg, ${currentAccent}, ${currentSecondary})`,
              }}
              className="w-full h-full rounded-full transition-transform duration-300 ease-out"
            />
          </div>
        </div>

        {/* Left Live Quantum Telemetry Node Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5 pl-1.5 pr-2 mr-0.5 border-r border-white/10 text-[10px] font-mono tracking-wider text-slate-300/90">
          <span className="relative flex h-2 w-2">
            <span
              style={{ backgroundColor: currentAccent }}
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            />
            <span
              style={{ backgroundColor: currentAccent }}
              className="relative inline-flex rounded-full h-2 w-2"
            />
          </span>
          <span className="font-bold text-white/90">
            0{activeIndex + 1}
            <span className="text-slate-500">/09</span>
          </span>
        </div>

        {/* Section Indicators / Jump Items */}
        {DOCK_SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          const isHovered = hoveredIdx === idx;
          const isJustJumped = justJumpedKey === sec.key;

          return (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 18,
                delay: 0.08 + idx * 0.025,
              }}
              className="relative"
            >
              <motion.button
                type="button"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                onClick={() => {
                  cyberSound.playClick();
                  onScrollTo(sec.id);
                  setJustJumpedKey(sec.key);
                  setTimeout(() => setJustJumpedKey(null), 650);
                }}
                onMouseEnter={() => {
                  setHoveredIdx(idx);
                  cyberSound.playHover();
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative group flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl sm:rounded-full transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
                aria-label={`Jump to ${sec.name} (Shortcut: ${sec.key})`}
                aria-keyshortcuts={sec.key}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active High-Contrast Luminous Glass Capsule Backdrop */}
                {isActive && (
                  <motion.div
                    layoutId="quick-dock-active-pill"
                    style={{
                      borderColor: `${sec.accentHex}99`,
                      boxShadow: `0 0 18px -2px ${sec.accentHex}55, inset 0 0 10px ${sec.secondaryHex}33`,
                    }}
                    className="absolute inset-0 rounded-xl sm:rounded-full bg-[#09132c]/85 border overflow-hidden"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}

                {/* Just Jumped Sonic Ripple Ring */}
                {isJustJumped && (
                  <span
                    style={{ borderColor: sec.accentHex }}
                    className="absolute inset-0 rounded-xl sm:rounded-full border-2 animate-ping pointer-events-none"
                  />
                )}

                {/* Restored Compact Original-Size Icon Socket (w-6 h-6 sm:w-7 sm:h-7 with w-3.5 h-3.5 sm:w-4 sm:h-4 icon) */}
                <div
                  style={
                    isActive
                      ? {
                          borderColor: sec.accentHex,
                          boxShadow: `0 0 12px ${sec.accentHex}80, inset 0 0 8px ${sec.accentHex}40`,
                        }
                      : undefined
                  }
                  className={`relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-full flex items-center justify-center border transition-all duration-200 ${
                    isActive
                      ? 'bg-[#071126]/90 text-white'
                      : `${sec.badgeBg} ${sec.badgeBorder} group-hover:border-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.18)]`
                  }`}
                >
                  {(isActive || isHovered) && (
                    <span
                      style={{
                        borderColor: `${sec.accentHex}88 transparent ${sec.secondaryHex}88 transparent`,
                      }}
                      className="absolute -inset-[2px] rounded-lg sm:rounded-full border border-dashed pointer-events-none"
                    />
                  )}

                  <span className="flex items-center justify-center">
                    {sec.renderIcon(
                      `w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                        isActive
                          ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]'
                          : `${sec.iconColor} group-hover:text-white group-hover:scale-105`
                      }`,
                      isActive
                    )}
                  </span>
                </div>

                {/* Compact Crisp Key & Short Label Stack */}
                <div className="relative z-10 flex items-center gap-1 pr-0.5 leading-none">
                  <kbd
                    aria-hidden="true"
                    style={
                      isActive
                        ? {
                            backgroundColor: sec.accentHex,
                            boxShadow: `0 0 8px ${sec.accentHex}`,
                          }
                        : undefined
                    }
                    className={`min-w-[14px] h-[14px] px-1 rounded font-mono text-[9px] font-black flex items-center justify-center border leading-none transition-all duration-200 ${
                      isActive
                        ? 'border-white text-slate-950'
                        : 'bg-[#091024]/90 border-cyan-400/45 text-cyan-200/90 group-hover:border-cyan-300 group-hover:text-white'
                    }`}
                  >
                    {sec.key}
                  </kbd>
                  <span
                    className={`text-[10px] font-mono font-bold tracking-wider hidden lg:inline transition-colors duration-200 ${
                      isActive
                        ? 'text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {sec.shortLabel}
                  </span>
                </div>
              </motion.button>

              {/* Realistic Holographic Floating HUD Tooltip on Hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: -44, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                    style={{
                      borderColor: `${sec.accentHex}99`,
                      boxShadow: `0 10px 28px -4px rgba(0,0,0,0.9), 0 0 18px ${sec.accentHex}55`,
                    }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-3 py-1.5 rounded-xl bg-[#05091a]/90 backdrop-blur-xl border text-white font-mono text-[11px] font-bold whitespace-nowrap pointer-events-none z-50 flex items-center gap-2"
                  >
                    <span
                      style={{ backgroundColor: sec.accentHex }}
                      className="px-1.5 py-0.5 rounded text-slate-950 font-black text-[9px] leading-none"
                    >
                      KEY {sec.key}
                    </span>
                    <span className="text-slate-400 text-[9px]">{sec.nodeCode}</span>
                    <span className="text-white tracking-wide">{sec.name}</span>
                    <span style={{ color: sec.accentHex }} className="font-black">
                      ↵
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
});


