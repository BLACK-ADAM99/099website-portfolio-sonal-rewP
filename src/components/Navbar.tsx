import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, Zap } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { PWAInstallButton, OfflineIndicator } from './PWAInstallPrompt';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';
import { cyberSound } from '../utils/cyberSound';

interface NavbarProps {
  onConnectClick: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onConnectClick, activeSection = 'home' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '#home', id: 'home' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'SERVICES', href: '#services', id: 'services' },
    { label: 'ARSENAL', href: '#arsenal', id: 'arsenal' },
    { label: 'PROJECTS', href: '#projects', id: 'projects' },
    { label: 'LAB', href: '#quantum-lab', id: 'quantum-lab' },
    { label: 'PROCESS', href: '#process', id: 'process' },
    { label: 'TESTIMONIALS', href: '#testimonials', id: 'testimonials' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 130, damping: 22 }}
      className="sticky top-0 z-40 w-full bg-[#05030e]/30 backdrop-blur-md border-b border-purple-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.38)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between bg-transparent">
        {/* Brand Logo with Animated Brackets */}
        <a
          href="#home"
          onMouseEnter={() => cyberSound.playHover()}
          onClick={() => cyberSound.playClick()}
          className="flex items-center gap-1.5 text-xl sm:text-2xl font-black tracking-wider font-orbitron text-white group cursor-pointer drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
        >
          <span className="text-purple-400 group-hover:text-fuchsia-400 group-hover:-translate-x-1 transition-all inline-block">
            &lt;
          </span>
          <span className="tracking-widest bg-gradient-to-r from-white via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent group-hover:brightness-125 transition-all">
            APURBA
          </span>
          <span className="text-fuchsia-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all inline-block">
            /&gt;
          </span>
        </a>

        {/* Desktop Nav Links with Active Gliding Indicator */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[13px] font-chakra font-semibold tracking-wider text-slate-200">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => cyberSound.playHover()}
                onClick={() => cyberSound.playClick()}
                className={`relative px-3.5 py-1.5 rounded-md transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] ${
                  isActive
                    ? 'text-fuchsia-300 font-semibold bg-white/[0.04]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-400 to-cyan-400 rounded-full shadow-[0_0_8px_#ec4899]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action: Official Social Logos + Ultra Animated Magnetic Connect Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Social Brand Logos (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <a
              href={APURBA_SOCIAL_LINKS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => cyberSound.playHover()}
              onClick={() => cyberSound.playClick()}
              title={`WhatsApp: ${APURBA_SOCIAL_LINKS.whatsappDisplay}`}
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full bg-emerald-950/45 backdrop-blur-sm border border-emerald-400/70 hover:border-white hover:bg-emerald-900/65 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_14px_rgba(16,185,129,0.38)]"
            >
              <WhatsAppLogo className="w-[18px] h-[18px] drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            </a>
            <a
              href={APURBA_SOCIAL_LINKS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => cyberSound.playHover()}
              onClick={() => cyberSound.playClick()}
              title={`Instagram: ${APURBA_SOCIAL_LINKS.instagramHandle}`}
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-pink-950/45 backdrop-blur-sm border border-pink-400/70 hover:border-white hover:bg-pink-900/65 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_14px_rgba(236,72,153,0.38)]"
            >
              <InstagramLogo className="w-[18px] h-[18px] drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            </a>
            <a
              href={APURBA_SOCIAL_LINKS.emailUrl}
              onMouseEnter={() => cyberSound.playHover()}
              onClick={() => cyberSound.playClick()}
              title={`Email: ${APURBA_SOCIAL_LINKS.emailAddress}`}
              aria-label="Email"
              className="w-9 h-9 rounded-full bg-purple-950/45 backdrop-blur-sm border border-fuchsia-400/70 hover:border-white hover:bg-purple-900/65 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_14px_rgba(217,70,239,0.38)]"
            >
              <GmailLogo className="w-[18px] h-[18px] drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            </a>
          </div>

          <div className="hidden md:block">
            <PWAInstallButton compact />
          </div>

          <MagneticButton
            onClick={() => {
              cyberSound.playClick();
              onConnectClick();
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-semibold tracking-wider text-fuchsia-300 uppercase rounded-full border border-fuchsia-500/60 bg-gradient-to-r from-purple-950/40 via-fuchsia-950/30 to-purple-950/40 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] whitespace-nowrap overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            <span className="relative z-10 font-bold">LET&apos;S CONNECT</span>
            <Sparkles className="relative z-10 w-3.5 h-3.5 text-fuchsia-400 group-hover:rotate-45 transition-transform duration-300" />
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-purple-900/30 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-fuchsia-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <OfflineIndicator />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#090518]/95 backdrop-blur-xl border-b border-purple-900/40 px-6 py-6 space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    cyberSound.playClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-semibold tracking-wider text-slate-300 hover:text-fuchsia-400 py-1 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <Zap className="w-3 h-3 text-purple-500 opacity-60" />
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-purple-900/30 space-y-3">
              <div className="flex justify-center">
                <PWAInstallButton />
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <a
                  href={APURBA_SOCIAL_LINKS.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-bold"
                >
                  <WhatsAppLogo className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={APURBA_SOCIAL_LINKS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-pink-950/50 border border-pink-500/40 text-pink-300 font-bold"
                >
                  <InstagramLogo className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={APURBA_SOCIAL_LINKS.emailUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-950/50 border border-purple-500/40 text-purple-200 font-bold"
                >
                  <GmailLogo className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onConnectClick();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider text-fuchsia-200 uppercase rounded-full border border-fuchsia-500/60 bg-fuchsia-950/40 hover:bg-fuchsia-900/60 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)]"
              >
                <span>LET&apos;S CONNECT</span>
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
