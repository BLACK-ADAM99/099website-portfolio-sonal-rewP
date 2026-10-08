import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Sparkles,
  Zap,
  Layers,
  Activity,
  Cpu,
  Terminal,
  GitBranch,
  BarChart3,
  Play,
  Check,
  Code2,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { CyberTextReveal } from './CyberTextReveal';
import { CyberTiltCard } from './CyberTiltCard';
import { CyberCountUp } from './CyberCountUp';
import { CyberImagePreloader, preloadProjectThumbnail } from './CyberImagePreloader';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';
import {
  FLAGSHIP_PROJECTS,
  SECONDARY_PROJECTS,
  ALL_PROJECTS,
  findProjectById,
  type ProjectItem,
} from '../data/projectsData';

export { FLAGSHIP_PROJECTS, SECONDARY_PROJECTS, ALL_PROJECTS, findProjectById };
export type { ProjectItem };

interface ProjectsProps {
  onSelectProject: (project: ProjectItem) => void;
  onViewAllProjects: () => void;
}

export const Projects: React.FC<ProjectsProps> = React.memo(({ onSelectProject }) => {
  const [showSecondaryLab, setShowSecondaryLab] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkCompleted, setBenchmarkCompleted] = useState(false);

  const handleRunBenchmark = () => {
    cyberSound.playClick();
    setIsBenchmarking(true);
    setBenchmarkCompleted(false);

    setTimeout(() => {
      setIsBenchmarking(false);
      setBenchmarkCompleted(true);
      cyberSound.playSuccess();
      setTimeout(() => setBenchmarkCompleted(false), 5000);
    }, 1800);
  };

  return (
    <motion.section
      id="projects"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-12 md:py-20 relative perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row with Staggered Character-by-Character Title Reveal */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
              <Layers className="w-3.5 h-3.5 animate-spin-slow" />
              <span>FLAGSHIP ARTIFACTS // BUILD REPO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber-wide text-white uppercase flex items-center gap-2">
              <CyberTextReveal text="FEATURED PROJECTS" mode="chars" effect="flip3d" staggerDelay={0.03} />
              <span className="text-fuchsia-500 animate-pulse font-mono">_</span>
            </h2>
          </div>

          <MagneticButton
            onClick={() => {
              cyberSound.playClick();
              setShowSecondaryLab(!showSecondaryLab);
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/45 hover:border-cyan-400 bg-cyan-950/25 hover:bg-cyan-950/55 rounded-xl transition-all shadow-[0_0_18px_rgba(6,182,212,0.18)] group cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span>{showSecondaryLab ? 'HIDE EXPERIMENTAL LAB' : 'EXPLORE EXPERIMENTAL LAB'}</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-900/65 text-[9px] text-cyan-200 font-bold border border-cyan-500/35">
              +3 BUILDS
            </span>
          </MagneticButton>
        </motion.div>

        {/* Projects Grid with Complex 3D Arrival & Pure GPU Group-Hover States */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLAGSHIP_PROJECTS.map((project, idx) => {
            const isSelectedElement = idx === 2;
            const arrival = getTopLevelArrival(idx, 0.08);

            return (
              <motion.div
                key={project.id}
                initial={arrival.initial}
                whileInView={arrival.whileInView}
                viewport={{ once: true, amount: 0.12 }}
                transition={arrival.transition}
                className="flex"
              >
                <CyberTiltCard
                  tiltMax={7}
                  glowColor={isSelectedElement ? 'rgba(6, 182, 212, 0.28)' : 'rgba(217, 70, 239, 0.26)'}
                  onClick={() => {
                    cyberSound.playClick();
                    preloadProjectThumbnail(project).finally(() => {
                      onSelectProject(project);
                    });
                  }}
                  onMouseEnter={() => {
                    cyberSound.playHover();
                    preloadProjectThumbnail(project);
                  }}
                  className={`w-full cursor-pointer rounded-2xl flex flex-col justify-between backdrop-blur-md transition-colors duration-200 ${
                    isSelectedElement
                      ? 'border-2 border-cyan-400/80 bg-gradient-to-b from-[#0c0828]/45 to-[#120938]/45 shadow-[0_0_40px_rgba(6,182,212,0.35),0_0_60px_rgba(217,70,239,0.2)]'
                      : 'border border-purple-500/35 bg-[#0c0722]/38 hover:border-fuchsia-500/90 hover:bg-[#130932]/55 shadow-[0_0_24px_rgba(147,51,234,0.12)] hover:shadow-[0_0_42px_rgba(217,70,239,0.38)]'
                  }`}
                >
                  {isSelectedElement && (
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-pulse z-20 pointer-events-none" />
                  )}

                  <div className="p-3 relative z-10">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60">
                      <CyberImagePreloader
                        cacheKey={project.id}
                        alt={project.seo.imageAlt || project.title}
                        imageLoader={project.imageLoader}
                        src={project.image}
                        rootMargin="320px 0px"
                        containerClassName="relative w-full h-full overflow-hidden bg-[#070414]"
                        imgClassName="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 filter contrast-[1.08]"
                        onImageLoaded={(resolvedUrl) => {
                          project.image = resolvedUrl;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0722] via-transparent to-transparent opacity-60 group-hover:opacity-15 transition-opacity pointer-events-none" />

                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/85 border border-fuchsia-500/70 text-[9px] font-mono text-fuchsia-300 flex items-center gap-1 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-spin-slow" />
                        <span>{project.category}</span>
                      </div>

                      {isSelectedElement && (
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/80 text-[8.5px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          <span>LIVE XR ENGINE // 60 FPS</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex flex-col justify-between flex-grow relative z-10">
                    <div>
                      <h3 className="text-base font-bold font-tech text-white mb-2 tracking-wide group-hover:text-fuchsia-300 transition-colors uppercase flex items-center justify-between">
                        <span>{project.title}</span>
                        {isSelectedElement ? (
                          <span className="flex items-center gap-1 text-[9px] font-mono text-cyan-400 border border-cyan-500/40 px-1.5 py-0.5 rounded bg-cyan-950/60">
                            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                            <span>ULTRA 3D</span>
                          </span>
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-light mb-5">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-purple-900/35">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider text-purple-200 bg-purple-950/55 border border-purple-500/35 group-hover:border-purple-400/60 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2 shadow-[0_0_15px_rgba(217,70,239,0.3)] ${
                          isSelectedElement
                            ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60 group-hover:bg-cyan-500 group-hover:text-black'
                            : 'border-purple-500/35 text-slate-300 group-hover:text-white group-hover:border-fuchsia-400 group-hover:bg-fuchsia-600/50'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CyberTiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* System Telemetry & Live Code Repository Card with Animated Count-Up Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22, delay: 0.08 }}
          className="mt-8 rounded-2xl bg-gradient-to-r from-[#0a0520]/92 via-[#0d072b]/92 to-[#09041a]/92 border border-purple-500/45 p-5 sm:p-7 shadow-[0_0_38px_rgba(147,51,234,0.18)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle,rgba(217,70,239,0.08)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-purple-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/75 border border-purple-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.32)] shrink-0">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold font-tech text-white uppercase tracking-wider">
                    <CyberTextReveal
                      text="SYSTEM TELEMETRY & LIVE CODE REPOSITORY"
                      mode="words"
                      effect="cyberSlide"
                      staggerDelay={0.04}
                    />
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE PIPELINE
                  </span>
                </div>
                <p className="text-xs font-mono text-purple-300">
                  Real-time engineering metrics from Kolaghat Mainframe deployment pipelines
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MagneticButton
                onClick={handleRunBenchmark}
                disabled={isBenchmarking}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600/30 to-fuchsia-600/30 hover:from-cyan-600/50 hover:to-fuchsia-600/50 border border-cyan-400/60 text-cyan-200 hover:text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {isBenchmarking ? (
                  <>
                    <Activity className="w-4 h-4 text-cyan-300 animate-spin" />
                    <span>RUNNING DIAGNOSTICS...</span>
                  </>
                ) : benchmarkCompleted ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">BENCHMARK 100% PASSED</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-125 transition-transform" />
                    <span>TRIGGER QUANTUM BENCHMARK</span>
                  </>
                )}
              </MagneticButton>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#09041a]/90 border border-purple-900/60 hover:border-cyan-500/55 hover:-translate-y-1 transition-all shadow-inner group">
              <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                <span>// AUTONOMOUS AI</span>
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold font-tech text-white group-hover:text-cyan-300 transition-colors">
                <CyberCountUp value={24} suffix="+ ENGINES" durationMs={1200} />
              </div>
              <div className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5">
                <span className="text-emerald-400 font-bold">↑ 100%</span> Automated task dispatch
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09041a]/90 border border-purple-900/60 hover:border-emerald-500/55 hover:-translate-y-1 transition-all shadow-inner group">
              <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                <span>// FOREX ALGO WIN RATE</span>
                <BarChart3 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold font-tech text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <CyberCountUp value={78.4} decimals={1} suffix="% PROFIT" durationMs={1250} />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                100+ Live Recorded Trades (MT5)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09041a]/90 border border-purple-900/60 hover:border-fuchsia-500/55 hover:-translate-y-1 transition-all shadow-inner group">
              <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                <span>// VIVE 3D GRAPHICS</span>
                <Zap className="w-3 h-3 text-fuchsia-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold font-tech text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors">
                <CyberCountUp value={60} suffix=" FPS LOCKED" durationMs={1200} />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                WebGL Shader Pipeline 0 Stutter
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#09041a]/90 border border-purple-900/60 hover:border-cyan-500/55 hover:-translate-y-1 transition-all shadow-inner group">
              <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                <span>// API INFERENCE SPEED</span>
                <Radio className="w-3 h-3 text-cyan-400" />
              </div>
              <div className="text-lg sm:text-xl font-bold font-tech text-cyan-300 group-hover:text-white transition-colors">
                <CyberCountUp value={42} prefix="< " suffix="ms LATENCY" durationMs={1300} />
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                Edge Caching &amp; Vector Embeddings
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showSecondaryLab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden pt-6 mt-6 border-t border-purple-900/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-fuchsia-300 font-bold">
                    <Terminal className="w-4 h-4 text-fuchsia-400" />
                    <span>EXPERIMENTAL PROTOCOLS &amp; DEEP TECH REPOSITORIES</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    STAGING // READY FOR CLIENT REVIEW
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SECONDARY_PROJECTS.map((item, sIdx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 18, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 150, damping: 20, delay: sIdx * 0.06 }}
                      onClick={() => {
                        cyberSound.playClick();
                        preloadProjectThumbnail(item).finally(() => {
                          onSelectProject(item);
                        });
                      }}
                      onMouseEnter={() => {
                        cyberSound.playHover();
                        preloadProjectThumbnail(item);
                      }}
                      className="p-4 rounded-xl bg-[#0e072b]/95 border border-purple-500/35 hover:border-fuchsia-500/75 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(217,70,239,0.32)] transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3 border border-purple-500/30 bg-black/60">
                          <CyberImagePreloader
                            cacheKey={item.id}
                            alt={item.seo.imageAlt || item.title}
                            imageLoader={item.imageLoader}
                            src={item.image}
                            rootMargin="240px 0px"
                            containerClassName="relative w-full h-full overflow-hidden bg-[#070414]"
                            imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[1.06]"
                            onImageLoaded={(resolvedUrl) => {
                              item.image = resolvedUrl;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0e072b] via-transparent to-transparent opacity-65 pointer-events-none" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 font-bold">
                            {item.category}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h4 className="text-sm font-bold font-tech text-white uppercase mb-1.5 group-hover:text-fuchsia-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-purple-900/30">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-mono text-purple-300 bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-800/40"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>STACK: REACT 19 // TYPESCRIPT // PYTHON FASTAPI // THREE.JS // MT5 ALGO</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">● 100% PRODUCTION READY</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberSound.playClick()}
                className="text-cyan-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>OPEN SOURCE GITHUB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
});
