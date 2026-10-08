import React from 'react';
import { ArrowUp, Sparkles, ExternalLink, Heart, ShieldCheck, Terminal, Award } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { cyberSound } from '../utils/cyberSound';

export const BrainPlexusFooter: React.FC = () => {
  const scrollToTop = () => {
    cyberSound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-16 pb-12 border-t border-purple-900/50 bg-[#04010d] relative overflow-hidden text-xs font-mono text-slate-400">
      
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Top summary row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-purple-900/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white font-bold font-tech shadow-md">
                BP
              </div>
              <span className="text-base font-bold font-tech text-white uppercase tracking-wider">
                BRAINPLEXUS &bull; PRODUCTION ENGINEERING CHECKLIST
              </span>
            </div>
            <p className="text-purple-300 max-w-xl text-xs font-light leading-relaxed">
              Based on the 9-page guide &ldquo;FROM AI-GENERATED CODE TO PRODUCTION-READY WEBSITE&rdquo; created by{' '}
              <strong className="text-cyan-300">rishabhpratapsingh.dev</strong>.
            </p>
          </div>

          <MagneticButton
            onClick={scrollToTop}
            onMouseEnter={() => cyberSound.playHover()}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-500/40 hover:border-fuchsia-400 text-purple-200 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.25)] cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-fuchsia-400" />
          </MagneticButton>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider font-tech flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>THE ENGINEERING CONTRACT</span>
            </h4>
            <p className="text-slate-300 leading-relaxed font-light">
              AI code generation gives speed; engineering disciplines give uptime, data integrity, user security, and operational resilience.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider font-tech flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-fuchsia-400" />
              <span>CORE 8 READINESS GATES</span>
            </h4>
            <p className="text-slate-300 leading-relaxed font-light">
              Architecture &bull; Security &bull; Data &bull; Performance &bull; Quality &bull; Operations &bull; Delivery &bull; Recovery.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider font-tech flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>CREDITS &amp; ATTRIBUTION</span>
            </h4>
            <p className="text-slate-300 leading-relaxed font-light">
              Content &amp; checklist architecture by <span className="text-white font-bold">rishabhpratapsingh.dev</span>.
              Published by <span className="text-cyan-300 font-bold">BrainPlexus</span>.
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} BrainPlexus &bull; All engineering specifications referenced from official PDF release.
          </div>
          <div className="text-purple-400 flex items-center gap-1">
            <span>Engineering discipline &gt; Monolithic code generation</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
