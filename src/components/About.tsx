import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, FolderCheck, Users2, Award, Sparkles, Binary, Zap } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { CyberTextReveal } from './CyberTextReveal';
import { CyberTiltCard } from './CyberTiltCard';
import { CyberCountUp } from './CyberCountUp';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';
import aboutHologramImg from '../assets/images/about_hologram_face_1790514555224.jpg';

interface AboutProps {
  onMoreAboutMe: () => void;
}

const STATS_DATA = [
  {
    icon: Clock,
    numericValue: 11,
    suffix: 'th',
    label: 'CLASS PRODIGY & INNOVATOR',
    color: 'text-fuchsia-400',
    sub: 'Kolaghat High School',
    barColor: 'from-fuchsia-500 to-purple-400',
  },
  {
    icon: FolderCheck,
    numericValue: 50,
    suffix: '+',
    label: 'AI & FULL-STACK PROJECTS',
    color: 'text-cyan-400',
    sub: 'Production Grade Code',
    barColor: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Users2,
    numericValue: 100,
    suffix: '+',
    label: 'PROFITABLE FOREX TRADES',
    color: 'text-emerald-400',
    sub: 'Disciplined Risk Ratio',
    barColor: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Award,
    numericValue: 100,
    suffix: '%',
    label: 'BILLIONAIRE MINDSET',
    color: 'text-amber-400',
    sub: 'Generational Ambition',
    barColor: 'from-amber-400 to-orange-500',
  },
];

export const About: React.FC<AboutProps> = React.memo(({ onMoreAboutMe }) => {
  const arrivalBio = getTopLevelArrival(0, 0.08);
  const arrivalHolo = getTopLevelArrival(2, 0.1);

  return (
    <motion.section
      id="about"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-12 md:py-20 relative perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Staggered Wave-Rise Character Reveal */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="mb-10 flex flex-wrap items-center justify-between gap-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber-wide text-white uppercase flex items-center gap-2">
            <CyberTextReveal text="ABOUT ME" mode="chars" effect="waveRise" staggerDelay={0.036} />
            <span className="text-fuchsia-500 animate-pulse font-mono">_</span>
          </h2>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/75 border border-purple-500/45 text-[11px] font-mono text-purple-200 shadow-[0_0_16px_rgba(168,85,247,0.25)]">
            <Binary className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>BIO_KERNEL: VERIFIED_PRODIGY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </motion.div>

        {/* 3-Column Bento Grid with Interactive 3D Tilt & Complex Arrival */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Column 1: Bio Card with 3D Spring Tilt */}
          <motion.div
            initial={arrivalBio.initial}
            whileInView={arrivalBio.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={arrivalBio.transition}
            className="md:col-span-4 flex"
          >
            <CyberTiltCard
              tiltMax={6}
              glowColor="rgba(217, 70, 239, 0.24)"
              className="w-full rounded-2xl bg-[#0a061e]/38 border border-purple-500/40 backdrop-blur-md p-7 flex flex-col justify-between shadow-[0_0_32px_rgba(147,51,234,0.2)] hover:border-fuchsia-500/75 hover:bg-[#11092e]/55 transition-colors duration-200"
            >
              {/* Arrival Scan-Line Sweep */}
              <motion.div
                initial={{ x: '-120%', opacity: 0.9 }}
                whileInView={{ x: '220%', opacity: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.95, ease: 'easeOut' }}
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12 pointer-events-none"
              />

              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                <div className="absolute transform rotate-45 bg-fuchsia-500/35 w-20 h-2 -top-1 -right-4 shadow-[0_0_10px_#ec4899] animate-pulse" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-luxury font-bold tracking-widest text-fuchsia-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>ROOT: WEST BENGAL &bull; INDIA</span>
                </div>
                <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed font-light">
                  I&apos;m <span className="text-white font-editorial italic font-bold text-base">Apurba Bera</span>, a Class 11 student and tech prodigy from{' '}
                  <span className="text-fuchsia-400 font-signature italic font-semibold text-base">Kolaghat, Purba Medinipur, West Bengal</span>.
                </p>
                <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed font-light">
                  As a passionate Gamer, Forex Trader, Full-Stack &amp; Vive Coder, I engineer AI Business Enhancers with a relentless ambition to scale generational tech and achieve billionaire status.
                </p>
              </div>

              <div className="pt-8 relative z-10">
                <MagneticButton
                  onClick={() => {
                    cyberSound.playClick();
                    onMoreAboutMe();
                  }}
                  onMouseEnter={() => cyberSound.playHover()}
                  className="group/btn relative inline-flex items-center gap-2.5 px-4.5 py-2.5 text-xs font-semibold tracking-wider text-purple-200 uppercase rounded-lg border border-purple-500/45 bg-purple-950/60 hover:bg-purple-900/75 hover:border-fuchsia-400 hover:text-white transition-all shadow-[0_0_18px_rgba(168,85,247,0.28)] overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">MORE ABOUT ME</span>
                  <ArrowRight className="relative z-10 w-3.5 h-3.5 text-fuchsia-400 group-hover/btn:translate-x-1.5 transition-transform" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                </MagneticButton>
              </div>
            </CyberTiltCard>
          </motion.div>

          {/* Column 2: Stats Grid with Animated Count-Up & Pure GPU Group-Hover States */}
          <div className="md:col-span-4 flex flex-col justify-between gap-4">
            {STATS_DATA.map((stat, idx) => {
              const Icon = stat.icon;
              const arrival = getTopLevelArrival(idx + 1, 0.065);

              return (
                <motion.div
                  key={stat.label}
                  initial={arrival.initial}
                  whileInView={arrival.whileInView}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={arrival.transition}
                  onMouseEnter={() => cyberSound.playHover()}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-purple-500/35 bg-[#0a061e]/38 backdrop-blur-md hover:border-fuchsia-500/75 hover:bg-[#140b33]/55 hover:translate-x-1.5 transition-all duration-200 cursor-default shadow-[0_0_18px_rgba(147,51,234,0.1)] hover:shadow-[0_0_28px_rgba(217,70,239,0.34)] relative overflow-hidden"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-purple-950/65 border border-purple-500/35 text-fuchsia-400 group-hover:bg-fuchsia-600/35 group-hover:border-fuchsia-400 group-hover:text-white group-hover:scale-108 group-hover:shadow-[0_0_18px_rgba(217,70,239,0.55)] transition-all duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl font-bold font-orbitron text-white tracking-tight flex items-center gap-1.5">
                      <CyberCountUp
                        value={stat.numericValue}
                        suffix={stat.suffix}
                        durationMs={1150 + idx * 120}
                      />
                      <Zap className="w-3.5 h-3.5 text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[11px] font-mono tracking-wider text-slate-200 uppercase truncate">
                      {stat.label}
                    </div>
                    <div className="text-[9.5px] font-mono text-purple-400/85">// {stat.sub}</div>
                  </div>

                  {/* Bottom Subtle Animated Progress Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, delay: 0.15 + idx * 0.08, ease: 'easeOut' }}
                    style={{ transformOrigin: '0% 50%' }}
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.barColor} opacity-75`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Column 3: Holographic 3D Bust Visual with 3D Spring Tilt */}
          <motion.div
            initial={arrivalHolo.initial}
            whileInView={arrivalHolo.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={arrivalHolo.transition}
            className="md:col-span-4 flex"
          >
            <CyberTiltCard
              tiltMax={6.5}
              glowColor="rgba(6, 182, 212, 0.25)"
              className="w-full rounded-2xl bg-[#09051b]/90 border border-purple-500/45 p-2 overflow-hidden flex items-center justify-center shadow-[0_0_42px_rgba(168,85,247,0.28)]"
            >
              <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-black/60 flex items-center justify-center">
                <img
                  src={aboutHologramImg}
                  alt="Apurba Bera - 3D Holographic digital head bust wireframe"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center filter contrast-125 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] pointer-events-none animate-scanline z-10" />

                <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/10 via-transparent to-black/45 pointer-events-none" />

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/85 border border-cyan-500/50 text-[9px] font-mono text-cyan-300 flex items-center gap-1.5 z-20 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>AI_NEURAL_LINK: ACTIVE</span>
                </div>
              </div>
            </CyberTiltCard>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});
