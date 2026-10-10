import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  Download,
  Github,
  Code2,
  Layers,
  Globe,
  Share2,
  Cpu,
  MessageCircle,
  Sparkles,
  Zap,
  Activity,
  Radio,
  Check,
} from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { CyberTextReveal } from './CyberTextReveal';
import { CyberCountUp } from './CyberCountUp';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, SECTION_REVEAL } from '../utils/cyberMotion';
import heroCyberDevImg from '../assets/images/hero_cyber_dev_1790514540845.jpg';

interface HeroProps {
  onViewWork: () => void;
  onDownloadCv: () => void;
}

export const Hero: React.FC<HeroProps> = React.memo(({ onViewWork, onDownloadCv }) => {
  const waveBaseHeights = [42, 74, 38, 88, 56, 78, 48, 94, 64, 40, 80, 54];

  const roles = [
    'AI BUSINESS ENHANCER & LLM ARCHITECT',
    'FULL-STACK & VIVE VR SOFTWARE ENGINEER',
    'ALGORITHMIC FOREX & QUANT TRADER',
    'CLASS 11 TECH PRODIGY & BILLIONAIRE VISIONARY',
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const roleTimer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => {
      clearInterval(roleTimer);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, [roles.length]);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Section-wide normalized mouse coordinates (-0.5 to +0.5) for multi-layer 3D Hero parallax
  const sectionMouseX = useMotionValue(0);
  const sectionMouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 180, mass: 0.65 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [11, -11]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-11, 11]), springConfig);

  const parallaxSpringConfig = { damping: 28, stiffness: 135, mass: 0.55 };
  const smoothSecX = useSpring(sectionMouseX, parallaxSpringConfig);
  const smoothSecY = useSpring(sectionMouseY, parallaxSpringConfig);

  // 1. Hero Background Parallax Layers (Deep, Mid & Foreground 3D Planes)
  const bgDeepX = useTransform(smoothSecX, [-0.5, 0.5], [-28, 28]);
  const bgDeepY = useTransform(smoothSecY, [-0.5, 0.5], [-20, 20]);
  const bgMidX = useTransform(smoothSecX, [-0.5, 0.5], [22, -22]);
  const bgMidY = useTransform(smoothSecY, [-0.5, 0.5], [16, -16]);
  const bgForeX = useTransform(smoothSecX, [-0.5, 0.5], [40, -40]);
  const bgForeY = useTransform(smoothSecY, [-0.5, 0.5], [28, -28]);

  // 2. Hero Content Parallax Layers (Staggered Z-Depth Planes)
  const barParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [-14, 14]);
  const barParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [-10, 10]);
  const leftContentX = useTransform(smoothSecX, [-0.5, 0.5], [-18, 18]);
  const leftContentY = useTransform(smoothSecY, [-0.5, 0.5], [-12, 12]);
  const leftRotateX = useTransform(smoothSecY, [-0.5, 0.5], [3, -3]);
  const leftRotateY = useTransform(smoothSecX, [-0.5, 0.5], [-3.5, 3.5]);
  const headlineParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [-10, 10]);
  const headlineParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [-7, 7]);

  // 3. Right Portrait & Orbiting HUD Satellite Cards Parallax
  const portraitParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [20, -20]);
  const portraitParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [14, -14]);
  const sat1ParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [36, -36]);
  const sat1ParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [24, -24]);
  const sat2ParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [-28, 28]);
  const sat2ParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [22, -22]);
  const hudTopParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [42, -42]);
  const hudTopParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [-24, 24]);
  const hudBotParallaxX = useTransform(smoothSecX, [-0.5, 0.5], [-32, 32]);
  const hudBotParallaxY = useTransform(smoothSecY, [-0.5, 0.5], [-20, 20]);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const yNorm = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    sectionMouseX.set(xNorm);
    sectionMouseY.set(yNorm);
  };

  const handleSectionMouseLeave = () => {
    sectionMouseX.set(0);
    sectionMouseY.set(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    mouseX.set(xPct - 0.5);
    mouseY.set(yPct - 0.5);
    cardRef.current.style.setProperty('--spot-x', `${xPct * 100}%`);
    cardRef.current.style.setProperty('--spot-y', `${yPct * 100}%`);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--spot-x', '50%');
      cardRef.current.style.setProperty('--spot-y', '50%');
    }
  };

  const skills = [
    { name: 'AI & LLM ENGINES', level: 96 },
    { name: 'FULL-STACK DEV', level: 94 },
    { name: 'FOREX TRADING', level: 92 },
    { name: 'PYTHON & BACKEND', level: 95 },
    { name: 'REACT & NEXT.JS', level: 93 },
    { name: 'VIVE & GAME DEV', level: 88 },
  ];

  const heroQuickMetrics = [
    { label: 'AI PRECISION', val: 99, suffix: '.8%', hex: '#22d3ee' },
    { label: 'SYSTEMS BUILT', val: 45, suffix: '+', hex: '#e879f9' },
    { label: 'LATENCY', val: 120, suffix: 'FPS', hex: '#34d399' },
  ];

  const arrivalBar = getTopLevelArrival(0, 0.05);
  const arrivalBadge = getTopLevelArrival(1, 0.05);
  const arrivalBrand = getTopLevelArrival(2, 0.05);
  const arrivalHeading = getTopLevelArrival(3, 0.05);
  const arrivalSub = getTopLevelArrival(4, 0.05);
  const arrivalCta = getTopLevelArrival(5, 0.05);
  const arrivalStatus = getTopLevelArrival(6, 0.05);

  return (
    <motion.section
      ref={sectionRef}
      id="home"
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="relative pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden perspective-[1200px]"
    >
      {/* Multi-Layer Mouse-Tracked 3D Background Planes inside section#home */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Layer 1: Deep 3D Perspective Orbital Rings & Cyber Grid Plane */}
        <motion.div
          style={{ x: bgDeepX, y: bgDeepY }}
          className="absolute inset-0 transform-gpu"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-cyan-500/15 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[920px] rounded-full border border-dashed border-fuchsia-500/12 pointer-events-none" />
        </motion.div>

        {/* Layer 2: Mid-Depth HUD Corner Brackets & Horizon Laser */}
        <motion.div
          style={{ x: bgMidX, y: bgMidY }}
          className="absolute inset-0 transform-gpu"
        >
          <div className="hidden lg:block absolute top-3 left-6 w-12 h-12 border-t border-l border-cyan-400/55 rounded-tl-xl" />
          <div className="hidden lg:block absolute top-3 right-6 w-12 h-12 border-t border-r border-fuchsia-400/55 rounded-tr-xl" />
          <div className="hidden lg:block absolute bottom-6 left-6 w-10 h-10 border-b border-l border-purple-400/40 rounded-bl-xl" />
          <div className="hidden lg:block absolute bottom-6 right-6 w-10 h-10 border-b border-r border-cyan-400/40 rounded-br-xl" />
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent" />
        </motion.div>

        {/* Layer 3: Foreground 3D Depth-of-Field Quantum Reticles */}
        <motion.div
          style={{ x: bgForeX, y: bgForeY }}
          className="absolute inset-0 transform-gpu"
        >
          <div className="hidden md:block absolute top-[18%] left-[46%] w-2 h-2 rounded-full bg-cyan-400/50 shadow-[0_0_12px_#06b6d4]" />
          <div className="hidden md:block absolute bottom-[22%] left-[42%] w-1.5 h-1.5 rounded-full bg-fuchsia-400/50 shadow-[0_0_10px_#d946ef]" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Far Left Cyber Bar & Hero Left Content */}
          <div className="lg:col-span-6 flex gap-4 xl:gap-8 items-start">
            {/* Leftmost Vertical Cyber Widget with Mouse-Tracked 3D Parallax */}
            <motion.div
              initial={arrivalBar.initial}
              whileInView={arrivalBar.whileInView}
              viewport={{ once: true, amount: 0.12 }}
              transition={arrivalBar.transition}
              style={{ x: barParallaxX, y: barParallaxY }}
              className="hidden sm:block shrink-0 transform-gpu"
            >
              <motion.div
                whileHover={{ y: -3, borderColor: 'rgba(34,211,238,0.65)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-4 py-5 px-2.5 rounded-2xl bg-[#09061a]/65 backdrop-blur-md border border-purple-500/45 shadow-[0_0_30px_rgba(168,85,247,0.22)] relative overflow-hidden"
              >
                {/* Top & Vertical Laser Streams */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-laser-y opacity-80" />

                <span className="text-[10px] font-mono text-cyan-300 font-bold select-none">
                  01
                </span>
                <div className="w-[1px] h-4 bg-gradient-to-b from-cyan-400/50 to-purple-500/35" />
                <div className="flex flex-col gap-3 text-slate-400">
                  <motion.a
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.08 }}
                    whileHover={{ scale: 1.28, rotate: 8, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    href={APURBA_SOCIAL_LINKS.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="p-1.5 hover:bg-emerald-950/55 rounded-lg transition-colors shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                    title={`WhatsApp: ${APURBA_SOCIAL_LINKS.whatsappDisplay}`}
                    aria-label="WhatsApp"
                  >
                    <WhatsAppLogo className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.13 }}
                    whileHover={{ scale: 1.28, rotate: -8, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    href={APURBA_SOCIAL_LINKS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="p-1.5 hover:bg-pink-950/55 rounded-lg transition-colors shadow-[0_0_12px_rgba(236,72,153,0.2)]"
                    title={`Instagram: ${APURBA_SOCIAL_LINKS.instagramHandle}`}
                    aria-label="Instagram"
                  >
                    <InstagramLogo className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.18 }}
                    whileHover={{ scale: 1.28, rotate: 8, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    href={APURBA_SOCIAL_LINKS.emailUrl}
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="p-1.5 hover:bg-purple-900/55 rounded-lg transition-colors shadow-[0_0_12px_rgba(217,70,239,0.2)]"
                    title={`Email: ${APURBA_SOCIAL_LINKS.emailAddress}`}
                    aria-label="Email"
                  >
                    <GmailLogo className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.23 }}
                    whileHover={{ scale: 1.28, rotate: -8, y: -2, color: '#f472b6' }}
                    whileTap={{ scale: 0.9 }}
                    href="#projects"
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="p-1.5 hover:bg-purple-900/40 rounded-lg transition-colors"
                    aria-label="Code"
                  >
                    <Code2 className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.28 }}
                    whileHover={{ scale: 1.28, rotate: 8, y: -2, color: '#34d399' }}
                    whileTap={{ scale: 0.9 }}
                    href="#services"
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="p-1.5 hover:bg-purple-900/40 rounded-lg transition-colors"
                    aria-label="Layers"
                  >
                    <Layers className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.33 }}
                    whileHover={{ scale: 1.28, rotate: -8, y: -2, color: '#38bdf8' }}
                    whileTap={{ scale: 0.9 }}
                    href="#contact"
                    onMouseEnter={() => cyberSound.playHover()}
                    onClick={() => cyberSound.playClick()}
                    className="p-1.5 hover:bg-purple-900/40 rounded-lg transition-colors"
                    aria-label="Globe"
                  >
                    <Globe className="w-4 h-4" />
                  </motion.a>
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: -14, scale: 0.75 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.38 }}
                    whileHover={{ scale: 1.28, rotate: 10, y: -2, color: '#f472b6' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      cyberSound.playSuccess();
                      navigator.clipboard?.writeText(window.location.href);
                      setLinkCopied(true);
                      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
                      copyTimerRef.current = setTimeout(() => setLinkCopied(false), 2000);
                    }}
                    onMouseEnter={() => cyberSound.playHover()}
                    className="relative p-1.5 hover:bg-purple-900/40 rounded-lg transition-colors cursor-pointer"
                    title={linkCopied ? 'Link Copied!' : 'Copy portfolio link'}
                    aria-label="Share portfolio link"
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                <div className="w-[1px] h-4 bg-gradient-to-b from-purple-500/35 to-fuchsia-400/50" />
                <span className="text-[10px] font-mono text-fuchsia-400 font-bold select-none inline-block">
                  S
                </span>
              </motion.div>
            </motion.div>

            {/* Main Left Text Details with Mouse-Tracked 3D Tilt & Parallax */}
            <motion.div
              style={{
                x: leftContentX,
                y: leftContentY,
                rotateX: leftRotateX,
                rotateY: leftRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="space-y-6 pt-2 flex-1 transform-gpu"
            >
              {/* Cycling Animated Subtitle Badge with 3D Flip Transition & Holographic Sweep */}
              <motion.div
                initial={arrivalBadge.initial}
                whileInView={arrivalBadge.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={arrivalBadge.transition}
              >
                <motion.div
                  whileHover={{ scale: 1.025, y: -2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/60 bg-gradient-to-r from-purple-950/65 via-fuchsia-950/50 to-purple-950/65 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.35)] relative overflow-hidden"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-400 shadow-[0_0_8px_#ec4899]" />
                  </span>

                  <div className="h-4 overflow-hidden relative min-w-[240px] sm:min-w-[285px] perspective-[400px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={roleIndex}
                        initial={{ y: 16, rotateX: -55, scale: 0.92, opacity: 0 }}
                        animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
                        exit={{ y: -16, rotateX: 55, scale: 0.92, opacity: 0 }}
                        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                        className="block text-fuchsia-300 font-chakra font-bold tracking-wider"
                      >
                        {roles[roleIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                </motion.div>
              </motion.div>

              {/* Brand Identity with Elastic Pop Character Reveal, Animated Brackets & Laser Underline */}
              <motion.div
                initial={arrivalBrand.initial}
                whileInView={arrivalBrand.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={arrivalBrand.transition}
                className="space-y-1.5"
              >
                <div className="hero-shadow-aura-brand text-2xl sm:text-3xl font-orbitron font-black tracking-widest text-white select-none inline-flex items-center gap-2 relative pb-1">
                  <span className="text-cyan-300 drop-shadow-[0_0_14px_#06b6d4] inline-block">
                    &lt;
                  </span>
                  <CyberTextReveal
                    text="APURBA"
                    mode="chars"
                    effect="elasticPop"
                    staggerDelay={0.048}
                    className="tracking-[0.25em]"
                  />
                  <span className="text-fuchsia-300 drop-shadow-[0_0_14px_#d946ef] inline-block">
                    / &gt;
                  </span>
                  {/* Dual-Chromatic Laser Underline */}
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-transparent shadow-[0_0_10px_#22d3ee]" />
                </div>
                <p className="hero-shadow-aura-subbrand text-[11px] sm:text-xs font-luxury text-cyan-300 tracking-[0.22em] font-bold uppercase">
                  <CyberTextReveal
                    text="PRODIGY. ARCHITECT. BILLIONAIRE BLUEPRINT."
                    mode="words"
                    effect="cyberSlide"
                    staggerDelay={0.075}
                    initialDelay={0.1}
                  />
                </p>
              </motion.div>

              {/* Big Headline with Dual-Mode 3D Interactive Character Reveal, Parallax & Shadow Glow Aura */}
              <motion.div
                initial={arrivalHeading.initial}
                whileInView={arrivalHeading.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={arrivalHeading.transition}
                style={{ x: headlineParallaxX, y: headlineParallaxY }}
              >
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight font-display uppercase leading-[1.08]">
                  <span className="hero-shadow-aura-title-white block text-white">
                    <CyberTextReveal
                      text="I CODE REALITY"
                      mode="chars"
                      effect="flip3d"
                      staggerDelay={0.024}
                      initialDelay={0.04}
                      interactiveHover={true}
                      charClassName="hover:text-cyan-300 transition-colors duration-150 cursor-default"
                    />
                  </span>
                  <span className="hero-shadow-aura-title-pink block text-[#ff38b8] mt-1.5 font-editorial italic tracking-wide">
                    <CyberTextReveal
                      text="YOU IMAGINE."
                      mode="chars"
                      effect="waveRise"
                      staggerDelay={0.026}
                      initialDelay={0.2}
                      interactiveHover={true}
                      charClassName="hover:text-white transition-colors duration-150 cursor-default"
                    />
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle with Word-by-Word 3D Reveal & Interactive Word Hover */}
              <motion.p
                initial={arrivalSub.initial}
                whileInView={arrivalSub.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={arrivalSub.transition}
                className="hero-shadow-aura-bio text-white text-sm sm:text-base max-w-lg leading-relaxed font-normal"
              >
                <CyberTextReveal
                  text="Class 11 tech prodigy & AI Engineer from Kolaghat, West Bengal. Transforming ideas into high-yield AI business enhancers, full-stack systems & algorithmic trading models with billionaire vision."
                  mode="words"
                  effect="flip3d"
                  staggerDelay={0.013}
                  initialDelay={0.1}
                  interactiveHover={true}
                  charClassName="hover:text-cyan-200 transition-colors duration-150"
                  className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.98)]"
                />
              </motion.p>

              {/* CTA Buttons with Magnetic Pull, Continuous Shimmer & Pulse Ring */}
              <motion.div
                initial={arrivalCta.initial}
                whileInView={arrivalCta.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={arrivalCta.transition}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <MagneticButton
                  onClick={() => {
                    cyberSound.playClick();
                    onViewWork();
                  }}
                  onMouseEnter={() => cyberSound.playHover()}
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-orbitron font-bold tracking-wider text-white uppercase rounded-xl bg-gradient-to-r from-[#d91993] via-[#ec26a6] to-[#a855f7] hover:from-[#c21481] hover:to-[#db1b96] transition-all shadow-[0_0_32px_rgba(236,38,166,0.55)] hover:shadow-[0_0_45px_rgba(236,38,166,0.85)] overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">VIEW WORK</span>
                  <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="absolute inset-0 w-full h-full bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </MagneticButton>

                <MagneticButton
                  onClick={() => {
                    cyberSound.playClick();
                    onDownloadCv();
                  }}
                  onMouseEnter={() => cyberSound.playHover()}
                  className="group relative inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-chakra font-semibold tracking-wider text-slate-100 uppercase rounded-xl border border-purple-500/50 bg-[#12082b]/65 backdrop-blur-md hover:bg-purple-950/70 hover:border-cyan-400/80 transition-all shadow-[0_0_18px_rgba(147,51,234,0.25)] hover:shadow-[0_0_32px_rgba(6,182,212,0.45)] cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10">DOWNLOAD CV</span>
                  <Download className="relative z-10 w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </MagneticButton>
              </motion.div>

              {/* Freelance Availability Status + Live Animated Quantum Telemetry Strip */}
              <motion.div
                initial={arrivalStatus.initial}
                whileInView={arrivalStatus.whileInView}
                viewport={{ once: true, amount: 0.15 }}
                transition={arrivalStatus.transition}
                className="space-y-3"
              >
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0b051e]/65 backdrop-blur-md border border-purple-500/40 text-xs font-mono text-slate-200 shadow-[0_0_20px_rgba(168,85,247,0.18)] relative overflow-hidden"
                >
                  <span className="text-fuchsia-400 font-semibold animate-pulse">//</span>
                  <span>AVAILABLE FOR AI CONTRACTS &amp; VENTURES</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow ml-1" />
                </motion.div>

                {/* Live Animated 3-Pill Micro Telemetry Strip */}
                <div className="grid grid-cols-3 gap-2.5 max-w-md pt-0.5">
                  {heroQuickMetrics.map((m, mIdx) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 14, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 19,
                        delay: 0.22 + mIdx * 0.06,
                      }}
                      whileHover={{ y: -3, scale: 1.04 }}
                      style={{ borderColor: `${m.hex}45` }}
                      className="px-3 py-2 rounded-xl bg-[#080518]/60 backdrop-blur-md border flex flex-col justify-between relative overflow-hidden group"
                    >
                      <div
                        style={{ backgroundColor: m.hex }}
                        className="absolute top-0 inset-x-3 h-[1px] opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                        {m.label}
                      </span>
                      <span
                        style={{ color: m.hex }}
                        className="text-sm sm:text-base font-orbitron font-black tracking-wide mt-0.5"
                      >
                        <CyberCountUp value={m.val} suffix={m.suffix} durationMs={1100 + mIdx * 150} />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Hero Visual & Cyber HUD Cards */}
          <motion.div
            initial={{ opacity: 0, x: 42, y: 34, scale: 0.9, rotateX: 10, rotateY: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ type: 'spring', stiffness: 115, damping: 20, mass: 0.72, delay: 0.05 }}
            className="lg:col-span-6 relative flex justify-center items-center mt-6 lg:mt-0 perspective-[1100px]"
          >
            {/* Developer Portrait Container with Interactive 3D Mouse Tilt & Depth Parallax */}
            <motion.div
              style={{ x: portraitParallaxX, y: portraitParallaxY }}
              className="w-full max-w-[420px] sm:max-w-[460px] transform-gpu"
            >
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-purple-500/60 bg-[#0c0624]/80 shadow-[0_0_65px_rgba(147,51,234,0.42)] group cursor-pointer"
              >
                {/* Dual Counter-Rotating Neon Portal Rings behind portrait */}
                <div className="absolute top-[6%] right-[6%] w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-fuchsia-500/80 border-dashed animate-spin-slow shadow-[0_0_50px_rgba(236,38,166,0.6)] pointer-events-none z-0" />
                <div className="absolute top-[10%] right-[10%] w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-cyan-400/70 border-dotted animate-spin-reverse-slow shadow-[0_0_40px_rgba(6,182,212,0.5)] pointer-events-none z-0" />

                {/* Dynamic Cursor Spotlight Beam on Card */}
                <div
                  style={{
                    background:
                      'radial-gradient(circle 230px at var(--spot-x, 50%) var(--spot-y, 50%), rgba(217, 70, 239, 0.28), transparent 72%)',
                  }}
                  className="absolute inset-0 pointer-events-none z-20"
                />

                {/* Top-Left Live Holographic AR Telemetry Tag inside Portrait */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#05030e]/75 backdrop-blur-md border border-cyan-400/45 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-200">
                    NEURAL_CORE // v9.4
                  </span>
                </div>

                {/* Animated Corner HUD Reticles */}
                <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 z-20 pointer-events-none group-hover:scale-125 transition-transform" />
                <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-fuchsia-400/80 z-20 pointer-events-none group-hover:scale-125 transition-transform" />
                <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-fuchsia-400/80 z-20 pointer-events-none group-hover:scale-125 transition-transform" />
                <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 z-20 pointer-events-none group-hover:scale-125 transition-transform" />

                {/* Hero Image */}
                <img
                  src={heroCyberDevImg}
                  alt="Apurba Bera - Cyberpunk creative coder portrait with AR HUD glasses"
                  fetchPriority="high"
                  decoding="async"
                  className="relative z-10 w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.98] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Scanning Holographic Laser Beam sweeping up & down */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] z-20 pointer-events-none animate-scanline" />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#05030e] via-transparent to-transparent opacity-85" />
              </motion.div>
            </motion.div>

            {/* Satellite Chip 1 (Top-Left) with Independent 3D Parallax */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -22, scale: 0.86 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ type: 'spring', stiffness: 135, damping: 20, delay: 0.12 }}
              whileHover={{ scale: 1.08, y: -4 }}
              style={{ x: sat1ParallaxX, y: sat1ParallaxY }}
              className="animate-float-smooth absolute -top-4 -left-2 sm:-left-6 z-30 px-3.5 py-1.5 rounded-xl bg-[#0a041f]/75 border border-fuchsia-500/65 shadow-[0_0_22px_rgba(217,70,239,0.38)] backdrop-blur-md hidden sm:flex items-center gap-2 overflow-hidden transform-gpu"
            >
              <Cpu className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
              <span className="text-[9.5px] font-mono font-bold text-fuchsia-200">
                AI ENGINE: 99.8% PRECISION
              </span>
            </motion.div>

            {/* Satellite Chip 2 (Bottom-Left) with Independent 3D Parallax */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 22, scale: 0.86 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ type: 'spring', stiffness: 135, damping: 20, delay: 0.18 }}
              whileHover={{ scale: 1.08, y: -4 }}
              style={{ x: sat2ParallaxX, y: sat2ParallaxY }}
              className="animate-float-reverse absolute bottom-20 -left-4 sm:-left-8 z-30 px-3.5 py-1.5 rounded-xl bg-[#080218]/75 border border-emerald-500/65 shadow-[0_0_22px_rgba(16,185,129,0.38)] backdrop-blur-md hidden sm:flex items-center gap-2 overflow-hidden transform-gpu"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[9.5px] font-mono font-bold text-emerald-200">
                FOREX QUANT: ACTIVE 24/7
              </span>
            </motion.div>

            {/* Top Right HUD: SYSTEM STATUS with Independent 3D Parallax */}
            <motion.div
              initial={{ opacity: 0, x: 32, y: -20, scale: 0.88 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ type: 'spring', stiffness: 125, damping: 20, delay: 0.14 }}
              whileHover={{ scale: 1.05, y: -4 }}
              style={{ x: hudTopParallaxX, y: hudTopParallaxY }}
              className="absolute -top-3 right-0 sm:-right-4 z-20 w-44 sm:w-52 p-3.5 rounded-2xl bg-[#0b0621]/75 backdrop-blur-md border border-cyan-500/65 shadow-[0_0_32px_rgba(6,182,212,0.38)] font-mono overflow-hidden transform-gpu"
            >
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5 mb-2">
                <span className="text-[10px] tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                  SYSTEM STATUS
                </span>
                <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE &bull;
                </span>
              </div>
              <div className="h-7 flex items-end justify-between gap-1 pt-1 px-1">
                {waveBaseHeights.map((h, i) => {
                  const barHexes = [
                    '#06b6d4', '#22d3ee', '#38bdf8', '#818cf8', '#a855f7', '#d946ef',
                    '#f472b6', '#fb7185', '#f59e0b', '#84cc16', '#10b981', '#2dd4bf',
                  ];
                  const barHex = barHexes[i % barHexes.length];
                  return (
                    <div
                      key={i}
                      style={{
                        height: `${h}%`,
                        backgroundColor: barHex,
                        boxShadow: `0 0 8px ${barHex}`,
                        animationDelay: `${i * 110}ms`,
                      }}
                      className="w-1.5 rounded-xs animate-pulse"
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Bottom Right HUD: SKILLS with Independent 3D Parallax */}
            <motion.div
              initial={{ opacity: 0, x: 32, y: 24, scale: 0.88 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ type: 'spring', stiffness: 125, damping: 20, delay: 0.2 }}
              whileHover={{ scale: 1.04, y: -4 }}
              style={{ x: hudBotParallaxX, y: hudBotParallaxY }}
              className="absolute -bottom-6 right-0 sm:right-2 z-20 w-52 sm:w-60 p-3.5 sm:p-4 rounded-2xl bg-[#0d0725]/78 backdrop-blur-md border border-purple-500/60 shadow-[0_0_38px_rgba(168,85,247,0.34)] font-mono overflow-hidden transform-gpu"
            >
              <div className="flex items-center justify-between border-b border-purple-500/30 pb-1.5 mb-2.5">
                <span className="text-[11px] font-bold tracking-widest text-purple-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-fuchsia-400 animate-pulse" />
                  SKILLS
                </span>
                <span className="text-[9px] text-cyan-400/90 animate-pulse">METRICS // LIVE</span>
              </div>

              <div className="space-y-2">
                {skills.map((skill, sIdx) => {
                  const skillColors = [
                    { from: '#06b6d4', to: '#38bdf8' },
                    { from: '#d946ef', to: '#f472b6' },
                    { from: '#10b981', to: '#4ade80' },
                    { from: '#f59e0b', to: '#facc15' },
                    { from: '#6366f1', to: '#a855f7' },
                    { from: '#f43f5e', to: '#fb923c' },
                  ];
                  const pair = skillColors[sIdx % skillColors.length];
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.12 + sIdx * 0.05 }}
                      whileHover={{ x: 3 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-300">
                        <span className="text-purple-100">&gt; {skill.name}</span>
                        <span style={{ color: pair.to }} className="font-semibold">
                          <CyberCountUp value={skill.level} suffix="%" durationMs={1150 + sIdx * 100} />
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-purple-950/85 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: skill.level / 100 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.0, delay: 0.12 + sIdx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            transformOrigin: '0% 50%',
                            background: `linear-gradient(90deg, ${pair.from}, ${pair.to})`,
                            boxShadow: `0 0 10px ${pair.to}`,
                          }}
                           className="w-full h-full rounded-full relative overflow-hidden"
                        >
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});
