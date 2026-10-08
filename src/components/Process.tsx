import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, FileText, Palette, Code, CheckCircle, GitCommit } from 'lucide-react';
import { CyberTextReveal } from './CyberTextReveal';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';

export const Process: React.FC = React.memo(() => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      icon: Compass,
      title: 'DISCOVER',
      hasDot: true,
      description: 'Understanding your goals, market position and technical requirements.',
      color: 'text-cyan-400',
      border: 'border-cyan-500/55',
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.45)]',
    },
    {
      icon: FileText,
      title: 'PLAN',
      hasDot: false,
      description: 'Architecture blueprinting, AI agent structure and quantitative flow.',
      color: 'text-purple-400',
      border: 'border-purple-500/55',
      glow: 'shadow-[0_0_24px_rgba(168,85,247,0.45)]',
    },
    {
      icon: Palette,
      title: 'DESIGN',
      hasDot: false,
      description: 'Crafting high-fidelity UI/UX aesthetics, wireframes and spatial 3D models.',
      color: 'text-fuchsia-400',
      border: 'border-fuchsia-500/55',
      glow: 'shadow-[0_0_24px_rgba(236,72,153,0.45)]',
    },
    {
      icon: Code,
      title: 'DEVELOP',
      hasDot: false,
      description: 'Bringing algorithms to life with pristine, scalable, production code.',
      color: 'text-emerald-400',
      border: 'border-emerald-500/55',
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.45)]',
    },
    {
      icon: CheckCircle,
      title: 'DELIVER',
      hasDot: false,
      description: 'Automated testing, latency optimization and global deployment.',
      color: 'text-amber-400',
      border: 'border-amber-500/55',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.45)]',
    },
  ];

  return (
    <motion.section
      id="process"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-12 md:py-20 relative perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Cyber-Slide Character Reveal */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="mb-14 flex items-center justify-between"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber-wide text-white uppercase flex items-center gap-2">
            <CyberTextReveal text="MY PROCESS" mode="chars" effect="cyberSlide" staggerDelay={0.036} />
            <span className="text-fuchsia-500 animate-pulse font-mono">_</span>
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-purple-200 bg-purple-950/65 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-purple-500/45 shadow-[0_0_15px_rgba(168,85,247,0.24)]">
            <GitCommit className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>EXECUTION_PIPELINE: STREAMING</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </motion.div>

        {/* Process Pipeline Container with Traveling Laser & Shared Layout Halo */}
        <div className="relative">
          {/* Connecting line (Desktop) with Traveling Laser Packet */}
          <div className="hidden lg:block absolute top-8 left-12 right-12 h-[2px] bg-gradient-to-r from-purple-800/40 via-fuchsia-500/55 to-purple-800/40 overflow-hidden -z-0">
            <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#06b6d4] animate-laser-x" />
          </div>

          {/* 5 Step Nodes with Staggered 3D Arrival & Shared Layout Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              const arrival = getTopLevelArrival(idx, 0.08);

              return (
                <motion.div
                  key={idx}
                  initial={arrival.initial}
                  whileInView={arrival.whileInView}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={arrival.transition}
                  whileHover={{ scale: 1.055, y: -6 }}
                  onMouseEnter={() => {
                    setActiveStep(idx);
                    cyberSound.playHover();
                  }}
                  onClick={() => {
                    setActiveStep(idx);
                    cyberSound.playClick();
                  }}
                  className="relative flex flex-col items-center text-center group cursor-pointer p-4 rounded-2xl transition-colors"
                >
                  {/* GPU Highlight Card */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-[#12082e]/38 border border-fuchsia-500/50 shadow-[0_0_32px_rgba(217,70,239,0.24)] -z-10 backdrop-blur-md transition-all duration-300 ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  />

                  {/* Circular Node Icon */}
                  <div className="relative mb-5">
                    <div className="absolute -inset-1 rounded-2xl bg-fuchsia-500/10 animate-pulse-subtle pointer-events-none" />

                    <div
                      className={`absolute -inset-2.5 rounded-2xl border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.5)] pointer-events-none transition-all duration-300 ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                    />

                    <motion.div
                      animate={isSelected ? { rotateY: [0, 14, -14, 0], scale: 1.08 } : { rotateY: 0, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-14 h-14 rounded-2xl bg-[#0c0722]/45 backdrop-blur-md border-2 ${step.border} flex items-center justify-center ${step.color} group-hover:border-fuchsia-400 ${isSelected ? step.glow : ''} transition-colors duration-300 relative z-10`}
                    >
                      <Icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </motion.div>

                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-950 border border-purple-400/75 flex items-center justify-center text-[10px] font-mono text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.4)] z-20">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold font-chakra tracking-wider text-white uppercase mb-2 flex items-center gap-1 group-hover:text-fuchsia-300 transition-colors">
                    <span>{step.title}</span>
                    {step.hasDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                    )}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-light max-w-[205px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
});
