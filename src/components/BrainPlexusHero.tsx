import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowDown, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Layers, 
  Zap, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { KEY_QUESTIONS_OVERVIEW } from '../data/productionChecklistData';
import { MagneticButton } from './MagneticButton';
import { cyberSound } from '../utils/cyberSound';

interface BrainPlexusHeroProps {
  scorePercentage: number;
  completedTasks: number;
  totalTasks: number;
  onStartAudit: () => void;
  onViewArchitecture: () => void;
}

export const BrainPlexusHero: React.FC<BrainPlexusHeroProps> = ({
  scorePercentage,
  completedTasks,
  totalTasks,
  onStartAudit,
  onViewArchitecture,
}) => {
  return (
    <section id="top" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/50 text-xs font-mono text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-white">BRAINPLEXUS</span>
            <span className="text-purple-400">&bull;</span>
            <span>Created by rishabhpratapsingh.dev</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>20 PRODUCTION VERIFICATION PILLARS</span>
          </div>
        </motion.div>

        {/* Main Title & Tagline from Page 1 */}
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold font-tech text-white uppercase tracking-tight leading-tight"
          >
            FROM AI-GENERATED CODE{' '}
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent block">
              TO PRODUCTION-READY WEBSITE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl font-mono text-fuchsia-300 font-semibold"
          >
            A practical engineering checklist for developers using AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-3xl"
          >
            AI can generate your frontend in minutes. Production-ready software requires much more: architecture, backend logic, data, security, testing, deployment, observability and recovery.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-4 pt-8"
        >
          <MagneticButton
            onClick={() => {
              cyberSound.playClick();
              onStartAudit();
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="group relative inline-flex items-center gap-2 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold tracking-wider text-white uppercase rounded-xl bg-gradient-to-r from-[#d91993] to-[#ec26a6] hover:from-[#c21481] hover:to-[#db1b96] transition-all shadow-[0_0_30px_rgba(236,38,166,0.5)] cursor-pointer overflow-hidden"
          >
            <span className="relative z-10">START PRODUCTION AUDIT</span>
            <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </MagneticButton>

          <MagneticButton
            onClick={() => {
              cyberSound.playClick();
              onViewArchitecture();
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider text-cyan-300 uppercase rounded-xl border border-cyan-500/40 bg-[#09051e] hover:bg-cyan-950/40 hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] cursor-pointer"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>VIEW SYSTEM ARCHITECTURE</span>
          </MagneticButton>

          <a
            href="#prompt-studio"
            onClick={() => cyberSound.playClick()}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <span>HOW TO PROMPT AI</span>
            <span className="text-purple-500 font-bold">&rarr;</span>
          </a>
        </motion.div>

        {/* The Core Message Callout Box (Straight from Page 1 of PDF) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-purple-950/70 via-fuchsia-950/40 to-purple-950/70 border-2 border-fuchsia-500/60 shadow-[0_0_35px_rgba(217,70,239,0.25)] relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-600/30 border border-fuchsia-400 flex items-center justify-center text-fuchsia-300 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold font-tech text-fuchsia-300 uppercase tracking-widest mb-1.5">
                // THE CORE MESSAGE
              </h2>
              <p className="text-sm sm:text-base font-mono text-white leading-relaxed font-semibold">
                &ldquo;Generating code is not the same as engineering a production system. Use AI to accelerate implementation, while you remain responsible for the design, trade-offs and verification.&rdquo;
              </p>
            </div>
          </div>
        </motion.div>

        {/* 7 Key Questions Matrix (Page 1) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 rounded-2xl bg-[#09041a] border border-purple-900/60 p-5 sm:p-7 shadow-inner"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-900/50">
            <h3 className="text-xs sm:text-sm font-bold font-tech text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>THE 7 FUNDAMENTAL PRODUCTION AREAS &bull; KEY QUESTIONS</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              PAGE 01 OVERVIEW MATRIX
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {KEY_QUESTIONS_OVERVIEW.map((item, idx) => (
              <div
                key={item.area}
                className="p-3.5 rounded-xl bg-[#060212] border border-purple-950 hover:border-purple-800 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
                    <span className="font-bold">// {item.area.toUpperCase()}</span>
                    <span>0{idx + 1}</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 font-light mt-1">
                    {item.question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
