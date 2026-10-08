import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Search, 
  Award, 
  FileText, 
  Layers, 
  Brain, 
  Terminal, 
  Menu, 
  X,
  CheckCircle2
} from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { cyberSound } from '../utils/cyberSound';

interface BrainPlexusNavbarProps {
  scorePercentage: number;
  completedTasks: number;
  totalTasks: number;
  onOpenAuditReport: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const BrainPlexusNavbar: React.FC<BrainPlexusNavbarProps> = ({
  scorePercentage,
  completedTasks,
  totalTasks,
  onOpenAuditReport,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Checklist', href: '#checklist' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Prompt AI', href: '#prompt-studio' },
    { label: 'Mental Models', href: '#mental-models' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050212]/90 border-b border-purple-900/40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Creator Attribution */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={() => cyberSound.playClick()}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-cyan-400 flex items-center justify-center text-white font-bold font-tech shadow-[0_0_15px_rgba(217,70,239,0.5)]">
              BP
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold font-tech tracking-wider text-white uppercase group-hover:text-fuchsia-300 transition-colors flex items-center gap-1">
                <span>BRAINPLEXUS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="text-[10px] font-mono text-purple-400 leading-tight">
                rishabhpratapsingh.dev
              </div>
            </div>
          </a>
        </div>

        {/* Live Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs relative">
          <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter 20 sections (e.g. auth, cache, test)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0b0520] border border-purple-800/60 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-all"
          />
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-mono text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => cyberSound.playClick()}
              onMouseEnter={() => cyberSound.playHover()}
              className="px-3 py-1.5 rounded-md hover:text-white hover:bg-purple-950/40 transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA: Readiness Score Pill & Report Button */}
        <div className="flex items-center gap-2.5">
          {/* Readiness Score Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a041f] border border-purple-500/40 text-[11px] font-mono shadow-inner">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400 hidden sm:inline">READINESS:</span>
            <span className="font-bold text-cyan-300">{scorePercentage}%</span>
          </div>

          {/* Audit Report Button */}
          <MagneticButton
            onClick={() => {
              cyberSound.playClick();
              onOpenAuditReport();
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(217,70,239,0.35)] cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>AUDIT REPORT</span>
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-purple-900/40"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden px-4 pb-4 pt-2 border-t border-purple-900/40 bg-[#070215] space-y-3"
          >
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter 20 sections..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#0b0520] border border-purple-800/60 text-xs font-mono text-white placeholder-slate-500"
              />
            </div>

            <div className="flex flex-col space-y-1 text-xs font-mono text-slate-300">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    cyberSound.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg hover:bg-purple-950/60 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
