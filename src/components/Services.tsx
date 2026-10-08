import React from 'react';
import { motion } from 'motion/react';
import { Box, Layout, Gauge, Code2, Terminal, Cpu, Sparkles, Activity } from 'lucide-react';
import { CyberTicker } from './CyberTicker';
import { CyberTextReveal } from './CyberTextReveal';
import { CyberTiltCard } from './CyberTiltCard';
import { CyberCountUp } from './CyberCountUp';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';

interface ServiceCardItem {
  icon: React.ComponentType<{ className?: string }>;
  customIcon?: string;
  title: string;
  description: string;
  tag: string;
  proficiency: number;
  badge: string;
}

const SERVICES_DATA: ServiceCardItem[] = [
  {
    icon: Terminal,
    customIcon: 'AI',
    title: 'AI BUSINESS ENHANCEMENT',
    description: 'Deploying autonomous AI agents, LLM integrations and automation to supercharge business growth.',
    tag: 'AGENTS / LLM',
    proficiency: 96,
    badge: 'PROD_READY',
  },
  {
    icon: Code2,
    customIcon: '</>',
    title: 'FULL-STACK DEVELOPMENT',
    description: 'Custom responsive web apps, robust backend APIs with clean, scalable and modern code.',
    tag: 'PYTHON / REACT',
    proficiency: 94,
    badge: 'REACT 19',
  },
  {
    icon: Gauge,
    customIcon: 'FX',
    title: 'FOREX & ALGO TRADING',
    description: 'Algorithmic market analysis, quantitative indicators and disciplined risk-reward strategies.',
    tag: 'QUANT / METRICS',
    proficiency: 92,
    badge: 'MT5_ALGO',
  },
  {
    icon: Box,
    title: 'VIVE & IMMERSIVE CODING',
    description: 'Interactive 3D environments, Vive VR/AR web experiences and spatial computing.',
    tag: 'VIVE / THREE.JS',
    proficiency: 88,
    badge: '60_FPS',
  },
  {
    icon: Layout,
    title: 'GAMING & TECH SYSTEMS',
    description: 'High-performance gaming logic, competitive mechanics and futuristic digital products.',
    tag: 'HIGH APM / LOGIC',
    proficiency: 95,
    badge: 'ULTRA_FAST',
  },
];

export const Services: React.FC = React.memo(() => {
  return (
    <motion.section
      id="services"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-12 md:py-20 relative perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading with Neon-Unfold Character Reveal */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/75 border border-purple-500/45 text-[10px] font-mono text-purple-200 mb-2.5 shadow-[0_0_16px_rgba(168,85,247,0.24)]">
            <Cpu className="w-3.5 h-3.5 text-fuchsia-400 animate-spin-slow" />
            <span>CAPABILITIES MATRIX // VER. 3.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber-wide text-white uppercase flex items-center justify-center gap-2">
            <CyberTextReveal text="SERVICES" mode="chars" effect="neonUnfold" staggerDelay={0.038} />
            <span className="text-fuchsia-500 animate-pulse font-mono">_</span>
          </h2>
        </motion.div>

        {/* 5-Card Connected Grid with 3D Spring Tilt & Pure GPU Group-Hover States */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-5">
          {SERVICES_DATA.map((svc, idx) => {
            const Icon = svc.icon;
            const arrival = getTopLevelArrival(idx, 0.065);

            return (
              <motion.div
                key={svc.title}
                initial={arrival.initial}
                whileInView={arrival.whileInView}
                viewport={{ once: true, amount: 0.12 }}
                transition={arrival.transition}
                className="flex"
              >
                <CyberTiltCard
                  tiltMax={7}
                  glowColor="rgba(217, 70, 239, 0.28)"
                  onMouseEnter={() => cyberSound.playHover()}
                  className="w-full rounded-2xl bg-[#0a061e]/38 border border-purple-500/35 hover:border-fuchsia-500/90 hover:bg-[#150a36]/55 backdrop-blur-md p-6 flex flex-col justify-between text-center transition-colors duration-200 shadow-[0_0_24px_rgba(147,51,234,0.12)] hover:shadow-[0_0_38px_rgba(217,70,239,0.38)] cursor-pointer"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

                  {/* Top Badge & Tag Row */}
                  <div className="flex items-center justify-between text-[9px] font-mono tracking-wider text-purple-400/90 mb-3 relative z-10">
                    <span className="px-1.5 py-0.5 rounded bg-purple-950/75 border border-purple-800/45 text-purple-200 font-bold">
                      {svc.badge}
                    </span>
                    <div className="flex items-center gap-1">
                      <span>{svc.tag}</span>
                      <Sparkles className="w-2.5 h-2.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Top Icon with GPU Transform on Hover */}
                  <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-purple-950/55 border border-purple-500/45 flex items-center justify-center text-fuchsia-400 group-hover:border-fuchsia-400 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(217,70,239,0.5)] transition-all duration-200 relative z-10">
                    {svc.customIcon ? (
                      <span className="font-mono text-base font-bold tracking-tighter text-fuchsia-400">
                        {svc.customIcon}
                      </span>
                    ) : (
                      <Icon className="w-5 h-5 text-fuchsia-400" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold tracking-wider font-chakra text-white mb-2 uppercase group-hover:text-fuchsia-300 transition-colors relative z-10">
                    {svc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-light mb-4 relative z-10">
                    {svc.description}
                  </p>

                  {/* Animated Proficiency Gauge (GPU scaleX instead of layout-thrashing width) */}
                  <div className="relative z-10 mt-auto pt-3 border-t border-purple-900/35">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-cyan-400" />
                        MASTERY
                      </span>
                      <span className="text-cyan-300 font-bold">
                        <CyberCountUp value={svc.proficiency} suffix="%" durationMs={1150 + idx * 100} />
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-purple-950/85 border border-purple-900/50 overflow-hidden">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: svc.proficiency / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: '0% 50%' }}
                        className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_10px_#ec4899]"
                      />
                    </div>
                  </div>

                  {/* Bottom Neon Accent Bar */}
                  <div className="h-0.5 w-6 group-hover:w-24 mx-auto mt-3 bg-purple-800/40 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-fuchsia-400 group-hover:to-cyan-400 group-hover:shadow-[0_0_12px_#ec4899] transition-all duration-300 rounded-full relative z-10" />
                </CyberTiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Real-Time Horizontally Auto-Scrolling Glitch Ticker */}
        <CyberTicker />
      </div>
    </motion.section>
  );
});
