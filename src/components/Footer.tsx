import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Github, ArrowUpRight, Check, ArrowUp, Sparkles, Clock } from 'lucide-react';
import { CyberTextReveal } from './CyberTextReveal';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const clockSpanRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      if (!clockSpanRef.current) return;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      clockSpanRef.current.textContent = `${timeStr} IST`;
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    cyberSound.playClick();
    setSubscribed(true);
    cyberSound.playSuccess();
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Arsenal', href: '#arsenal' },
    { label: 'Projects', href: '#projects' },
    { label: 'Quantum Lab', href: '#quantum-lab' },
    { label: 'Process', href: '#process' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks: {
    label: string;
    sublabel: string;
    href: string;
    external?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      label: 'WhatsApp',
      sublabel: APURBA_SOCIAL_LINKS.whatsappDisplay,
      href: APURBA_SOCIAL_LINKS.whatsappUrl,
      external: true,
      icon: WhatsAppLogo,
      color: 'hover:text-emerald-400',
    },
    {
      label: 'Instagram',
      sublabel: APURBA_SOCIAL_LINKS.instagramHandle,
      href: APURBA_SOCIAL_LINKS.instagramUrl,
      external: true,
      icon: InstagramLogo,
      color: 'hover:text-pink-400',
    },
    {
      label: 'Email Direct',
      sublabel: APURBA_SOCIAL_LINKS.emailAddress,
      href: APURBA_SOCIAL_LINKS.emailUrl,
      external: false,
      icon: GmailLogo,
      color: 'hover:text-fuchsia-400',
    },
    {
      label: 'GitHub',
      sublabel: 'Open Source',
      href: 'https://github.com',
      external: true,
      icon: Github,
      color: 'hover:text-cyan-400',
    },
  ];

  const col1Arrival = getTopLevelArrival(0, 0.07);
  const col2Arrival = getTopLevelArrival(1, 0.07);
  const col3Arrival = getTopLevelArrival(2, 0.07);
  const col4Arrival = getTopLevelArrival(3, 0.07);

  return (
    <motion.footer
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="pt-16 pb-28 border-t border-purple-900/40 bg-[#05030e]/45 backdrop-blur-md relative overflow-hidden z-10 perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Decorative Cyber Line with Live Mainframe Status & Live Kolaghat Clock */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-purple-900/30 pb-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a051d] border border-purple-500/30 font-mono text-[10px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-purple-400 font-bold">CYBER MAINFRAME:</span>
              <span>OPERATIONAL // 99.99% UPTIME</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a051d] border border-cyan-500/30 font-mono text-[10px] text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
              <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>
                KOLAGHAT_TIME: <strong ref={clockSpanRef} className="text-white">--:--:-- IST</strong>
              </span>
            </div>
          </div>

          <a
            href="#home"
            onMouseEnter={() => cyberSound.playHover()}
            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/50 border border-purple-500/40 hover:border-fuchsia-400 font-mono text-[10px] text-purple-300 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-fuchsia-400 group-hover:-translate-y-1 transition-transform" />
          </a>
        </motion.div>

        {/* 4 Columns with Staggered Complex 3D Arrival */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Col 1: Brand & Copyright */}
          <motion.div
            initial={col1Arrival.initial}
            whileInView={col1Arrival.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={col1Arrival.transition}
            className="lg:col-span-4 space-y-4"
          >
            <a
              href="#home"
              onClick={() => cyberSound.playClick()}
              onMouseEnter={() => cyberSound.playHover()}
              className="inline-flex items-center gap-1.5 text-xl font-black tracking-wider font-orbitron text-white group"
            >
              <span className="text-purple-400 group-hover:text-fuchsia-400 transition-colors">&lt;</span>
              <CyberTextReveal
                text="APURBA"
                mode="chars"
                staggerDelay={0.04}
                className="tracking-widest bg-gradient-to-r from-white to-fuchsia-300 bg-clip-text text-transparent"
              />
              <span className="text-fuchsia-500 group-hover:text-purple-400 transition-colors">/&gt;</span>
            </a>
            <p className="text-xs font-mono text-slate-400">
              &copy; 2026 Apurba Bera. All rights reserved.
            </p>
            <p className="text-[11px] font-luxury text-purple-300/95 flex items-center gap-1 tracking-wider">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Kolaghat, Purba Medinipur, West Bengal &bull; Billionaire Mindset</span>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={APURBA_SOCIAL_LINKS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => cyberSound.playHover()}
                onClick={() => cyberSound.playClick()}
                title={`WhatsApp: ${APURBA_SOCIAL_LINKS.whatsappDisplay}`}
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/45 hover:border-emerald-400 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              >
                <WhatsAppLogo className="w-4 h-4" />
              </a>
              <a
                href={APURBA_SOCIAL_LINKS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => cyberSound.playHover()}
                onClick={() => cyberSound.playClick()}
                title={`Instagram: ${APURBA_SOCIAL_LINKS.instagramHandle}`}
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-pink-950/60 border border-pink-500/45 hover:border-pink-400 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(236,72,153,0.2)]"
              >
                <InstagramLogo className="w-4 h-4" />
              </a>
              <a
                href={APURBA_SOCIAL_LINKS.emailUrl}
                onMouseEnter={() => cyberSound.playHover()}
                onClick={() => cyberSound.playClick()}
                title={`Email: ${APURBA_SOCIAL_LINKS.emailAddress}`}
                aria-label="Email"
                className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/45 hover:border-fuchsia-400 flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(217,70,239,0.2)]"
              >
                <GmailLogo className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Col 2: Navigation */}
          <motion.div
            initial={col2Arrival.initial}
            whileInView={col2Arrival.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={col2Arrival.transition}
            className="lg:col-span-3 space-y-3"
          >
            <h4 className="text-[11px] font-bold font-mono tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <span className="text-fuchsia-400">//</span>
              <CyberTextReveal text="NAVIGATION" mode="chars" staggerDelay={0.03} />
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="hover:text-fuchsia-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3: Follow Me */}
          <motion.div
            initial={col3Arrival.initial}
            whileInView={col3Arrival.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={col3Arrival.transition}
            className="lg:col-span-2 space-y-3"
          >
            <h4 className="text-[11px] font-bold font-mono tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <span className="text-cyan-400">//</span>
              <CyberTextReveal text="NETWORK" mode="chars" staggerDelay={0.03} />
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <motion.a
                      whileHover={{ x: 3 }}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onMouseEnter={() => cyberSound.playHover()}
                      onClick={() => cyberSound.playClick()}
                      className={`flex items-center gap-2.5 transition-colors ${item.color}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <div className="min-w-0">
                        <span className="block font-medium text-slate-200 leading-tight">{item.label}</span>
                        <span className="block text-[10px] font-mono text-slate-400 truncate">{item.sublabel}</span>
                      </div>
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Col 4: Subscribe */}
          <motion.div
            initial={col4Arrival.initial}
            whileInView={col4Arrival.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={col4Arrival.transition}
            className="lg:col-span-3 space-y-3"
          >
            <h4 className="text-[11px] font-bold font-mono tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
              <span className="text-emerald-400">//</span>
              <CyberTextReveal text="TELEMETRY" mode="chars" staggerDelay={0.03} />
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Receive updates on AI model updates and algorithmic architectures.
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-11 py-2 rounded-lg bg-[#0c0722]/80 border border-purple-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-fuchsia-500 font-mono transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 w-8 h-8 rounded-md bg-purple-900/60 hover:bg-fuchsia-600 text-purple-200 hover:text-white flex items-center justify-center transition-all border border-purple-500/30 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                >
                  {subscribed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                </motion.button>
              </div>
              {subscribed && (
                <p className="text-[11px] font-mono text-emerald-400 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Subscribed to telemetry updates!</span>
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};
