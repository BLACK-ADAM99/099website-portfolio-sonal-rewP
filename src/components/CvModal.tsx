import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  FileText, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Check, 
  Copy, 
  ExternalLink,
  Cpu, 
  Code2, 
  TrendingUp, 
  Box, 
  Gamepad2, 
  Sparkles, 
  Printer, 
  Phone,
  ShieldCheck,
  Award
} from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'contact'>('overview');

  if (!isOpen) return null;

  const email = 'apurbabera45@gmail.com';
  const phone = '+91 7797304622';
  const whatsappUrl = `https://wa.me/917797304622?text=${encodeURIComponent('Hi Apurba, I reviewed your CV and would like to connect with you!')}`;

  const handleCopyEmail = () => {
    cyberSound.playClick();
    navigator.clipboard?.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleDownload = () => {
    cyberSound.playClick();
    const cvContent = `===================================================================
APURBA BERA - CURRICULUM VITAE & PROFESSIONAL DOSSIER
AI Engineer | Full-Stack Developer | Forex Trader | Vive Coder
===================================================================

[CONTACT & TELEMETRY]
Email:       ${email}
WhatsApp:    ${phone}
Instagram:   ${APURBA_SOCIAL_LINKS.instagramHandle} (${APURBA_SOCIAL_LINKS.instagramUrl})
Location:    Kolaghat, Purba Medinipur, West Bengal, India (22.4329° N, 87.8599° E)
Status:      Class 11 Tech Prodigy | Available for AI Contracts & Ventures
Mindset:     Generational Entrepreneur & Future Billionaire Visionary

-------------------------------------------------------------------
1. EXECUTIVE SUMMARY
-------------------------------------------------------------------
Class 11 prodigy and innovative multi-disciplinary software engineer
from Kolaghat, West Bengal. Combines deep computer science, autonomous
AI agent engineering, full-stack web architectures, and quantitative
financial market trading with a billionaire-tier execution speed.

-------------------------------------------------------------------
2. IN-DEPTH SKILL BREAKDOWN
-------------------------------------------------------------------

* A. ARTIFICIAL INTELLIGENCE & LLM BUSINESS ENHANCERS (Level: 96%)
  - Architecture: Autonomous LLM multi-agent pipelines, AI task orchestration,
    and conversational lead-generation funnels.
  - Business Automation: Eliminating manual workflows, automated CRM data sync,
    and AI-powered client conversion bots.
  - Stack: Python, OpenAI API, Gemini SDK, FastAPI, LangChain, Web Scraping,
    Prompt Engineering, Vector Embeddings.

* B. FULL-STACK WEB ENGINEERING (Level: 94%)
  - Frontend: Responsive, accessible, 60fps web apps with cyberpunk and modern
    minimal UI/UX, micro-interactions, and mobile responsiveness.
  - Backend: RESTful & GraphQL microservice APIs, relational schemas, secure auth,
    and serverless cloud deployment.
  - Stack: React 19, TypeScript, Next.js, Node.js, Express, Tailwind CSS,
    PostgreSQL, Vite.

* C. FOREX & QUANTITATIVE ALGORITHMIC TRADING (Level: 92%)
  - Strategy: Price Action mechanics, order block liquidity zones, Fibonacci
    extensions, and multi-timeframe correlation (EUR/USD, GBP/USD, XAU/USD).
  - Risk Management: Strict 1:2 to 1:3.5 risk-to-reward ratios, automated
    trailing stops, and disciplined emotional trading psychology.
  - Tools: MetaTrader 5, Quantitative chart analytics, Custom trailing scripts.

* D. VIVE & 3D SPATIAL COMPUTING (Level: 88%)
  - Immersive Tech: Interactive 3D spatial scenes, HTC Vive controller input
    pipelines, WebVR/WebXR integrations.
  - Graphics: WebGL shaders, Three.js geometry, performant particles, and
    60fps competitive mechanics.
  - Stack: Three.js, WebGL, GLSL, Canvas API.

* E. COMPETITIVE GAMING & HIGH-APM COGNITION (Level: 95%)
  - High Actions-Per-Minute (APM), ultra-fast tactical cognitive decision-making,
    pressure-tested strategic composure, and game logic engineering.

-------------------------------------------------------------------
3. KEY HIGHLIGHTED PROJECTS
-------------------------------------------------------------------
1. AI Business Enhancer:
   Autonomous agent suite that automates customer communication, pipeline
   qualification, and CRM synchronization.
2. Algo-FX Forex Terminal:
   Advanced quantitative market dashboard with technical indicators, live
   economic data feeds, and risk calculators.
3. Vive Cyber Gaming Lab:
   Spatial 3D browser game playground with hardware VR controller support
   and shader effects.

-------------------------------------------------------------------
4. DIRECT CONTACT INFORMATION
-------------------------------------------------------------------
- WhatsApp Direct: https://wa.me/917797304622
- Instagram:       ${APURBA_SOCIAL_LINKS.instagramUrl}
- Email Direct:    mailto:apurbabera45@gmail.com
- Base Location:   Kolaghat, Purba Medinipur, West Bengal, India (22.4329° N, 87.8599° E)

===================================================================
Generated by Apurba Bera Portfolio Mainframe // Verified Dossier
===================================================================`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Apurba_Bera_Comprehensive_CV.txt';
    a.click();
    URL.revokeObjectURL(url);
    cyberSound.playSuccess();
  };

  const detailedSkills = [
    {
      category: 'AI & LLM Business Enhancers',
      level: '96%',
      icon: Cpu,
      color: 'text-fuchsia-400',
      badge: 'FLAGSHIP',
      borderColor: 'border-fuchsia-500/40',
      bgColor: 'bg-fuchsia-950/20',
      description: 'Building autonomous multi-agent pipelines and LLM systems that automate operational workflows, qualify leads, and scale business profits.',
      stack: ['Python', 'Gemini & OpenAI API', 'FastAPI', 'LangChain', 'Agent Workflows', 'Prompt Optimization'],
    },
    {
      category: 'Full-Stack Web Engineering',
      level: '94%',
      icon: Code2,
      color: 'text-cyan-400',
      badge: 'PRODUCTION',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/20',
      description: 'Engineering responsive, ultra-smooth web applications with clean architecture, modern typography, mobile optimization, and scalable backend APIs.',
      stack: ['React 19', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'REST APIs'],
    },
    {
      category: 'Forex & Algorithmic Trading',
      level: '92%',
      icon: TrendingUp,
      color: 'text-emerald-400',
      badge: 'PROFITABLE',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/20',
      description: 'Disciplined price action trading on major currency pairs with strict 1:2+ risk-to-reward ratios, quantitative analysis, and automated trailing algorithms.',
      stack: ['MetaTrader 5', 'Price Action', 'Risk Models', 'Order Blocks', 'Chart Profiling', 'Algo Indicators'],
    },
    {
      category: 'Vive & 3D Spatial Computing',
      level: '88%',
      icon: Box,
      color: 'text-purple-400',
      badge: 'IMMERSIVE',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-950/20',
      description: 'Creating interactive 3D browser experiences, Vive VR motion controller inputs, spatial canvas simulations, and custom WebGL shaders.',
      stack: ['Three.js', 'WebGL', 'Vive VR/XR', 'GLSL Shaders', 'Canvas Physics', 'Game Loops'],
    },
    {
      category: 'Competitive Gaming & Strategy',
      level: '95%',
      icon: Gamepad2,
      color: 'text-amber-400',
      badge: 'HIGH APM',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/20',
      description: 'Elite hand-eye coordination, lightning-fast APM decision making under pressure, and strategic competitive mindset translating directly into coding excellence.',
      stack: ['High APM', 'Rapid Problem Solving', 'Tactical Focus', 'Pressure Resilience'],
    },
  ];

  return (
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-3xl my-6 rounded-2xl bg-[#09041a] border border-fuchsia-500/50 p-5 sm:p-8 shadow-[0_0_60px_rgba(217,70,239,0.3)] text-slate-100 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-purple-900/50 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-fuchsia-500/50 flex items-center justify-center text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-tech text-white uppercase tracking-wider">
                  APURBA BERA // CURRICULUM VITAE
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  VERIFIED
                </span>
              </div>
              <p className="text-xs font-mono text-purple-300">
                Class 11 Tech Prodigy &bull; AI Engineer &bull; Full-Stack &bull; Forex Trader
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-fuchsia-400" />
          </button>
        </div>

        {/* Tab Controls with Gliding Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-4 border-b border-purple-900/40 pb-2.5 font-mono text-xs relative">
          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveTab('overview');
            }}
            className={`relative px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'overview' && (
              <motion.div
                layoutId="cv-active-tab-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-600/35 to-purple-600/35 border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.35)] -z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Award className="relative z-10 w-3.5 h-3.5 text-fuchsia-400" />
            <span className="relative z-10">OVERVIEW &amp; BIO</span>
          </button>

          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveTab('skills');
            }}
            className={`relative px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'skills'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'skills' && (
              <motion.div
                layoutId="cv-active-tab-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-600/35 to-purple-600/35 border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.35)] -z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Cpu className="relative z-10 w-3.5 h-3.5 text-cyan-400" />
            <span className="relative z-10">SKILLS IN-DEPTH</span>
          </button>

          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveTab('contact');
            }}
            className={`relative px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contact'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeTab === 'contact' && (
              <motion.div
                layoutId="cv-active-tab-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-600/35 to-purple-600/35 border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.35)] -z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Phone className="relative z-10 w-3.5 h-3.5 text-emerald-400" />
            <span className="relative z-10">CONTACT &amp; WHATSAPP</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-300">
          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW & BIO */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview-tab"
                initial={{ opacity: 0, x: -10, filter: 'blur(3px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 10, filter: 'blur(3px)' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
              {/* Executive Bio Card */}
              <div className="p-4 rounded-xl bg-[#0e0728]/90 border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-fuchsia-400">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    EXECUTIVE PROFILE
                  </span>
                  <span className="text-purple-300">KOLAGHAT, WEST BENGAL</span>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-light">
                  Apurba Bera is a Class 11 tech prodigy from Kolaghat, Purba Medinipur, West Bengal, India. Driven by a billionaire mindset, Apurba operates across cutting-edge frontiers: creating high-converting AI Business Enhancers, architecting resilient full-stack applications, coding Vive VR 3D environments, and executing profitable algorithmic Forex trades.
                </p>
              </div>

              {/* Quick Highlight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#0c0622] border border-purple-900/50 space-y-1">
                  <div className="text-slate-400 text-[10px]">// EDUCATION</div>
                  <div className="text-white font-bold">Class 11 Student Prodigy</div>
                  <div className="text-purple-300 text-[11px]">Kolaghat, Purba Medinipur, WB</div>
                </div>

                <div className="p-3 rounded-lg bg-[#0c0622] border border-purple-900/50 space-y-1">
                  <div className="text-slate-400 text-[10px]">// CORE SPECIALTY</div>
                  <div className="text-fuchsia-300 font-bold">AI Business Enhancers &amp; LLM</div>
                  <div className="text-cyan-300 text-[11px]">Autonomous Lead &amp; Task Engines</div>
                </div>

                <div className="p-3 rounded-lg bg-[#0c0622] border border-purple-900/50 space-y-1">
                  <div className="text-slate-400 text-[10px]">// FINANCIAL MARKET</div>
                  <div className="text-emerald-400 font-bold">Forex &amp; Quant Trading</div>
                  <div className="text-slate-300 text-[11px]">100+ Profitable Recorded Trades</div>
                </div>

                <div className="p-3 rounded-lg bg-[#0c0622] border border-purple-900/50 space-y-1">
                  <div className="text-slate-400 text-[10px]">// VISION &amp; GOAL</div>
                  <div className="text-amber-300 font-bold">Billionaire Tech Founder</div>
                  <div className="text-slate-300 text-[11px]">Building Generational Ventures</div>
                </div>
              </div>

              {/* Quick Contact Ribbon */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-fuchsia-950/30 to-purple-950/40 border border-fuchsia-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-200">
                  <WhatsAppLogo className="w-4 h-4" />
                  <span>WhatsApp: <strong className="text-white">{phone}</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600/30 border border-emerald-500/60 text-emerald-300 hover:text-white hover:bg-emerald-600/50 transition-all font-bold text-[11px]"
                  >
                    <WhatsAppLogo className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={APURBA_SOCIAL_LINKS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-pink-600/30 border border-pink-500/60 text-pink-300 hover:text-white hover:bg-pink-600/50 transition-all font-bold text-[11px]"
                  >
                    <InstagramLogo className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DETAILED SKILL BREAKDOWN */}
          {activeTab === 'skills' && (
            <motion.div 
              key="skills-tab"
              initial={{ opacity: 0, x: -10, filter: 'blur(3px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 10, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3.5"
            >
              <div className="text-xs font-mono text-purple-300 mb-1 flex items-center justify-between">
                <span>// COMPREHENSIVE TECHNICAL CAPABILITY MATRIX</span>
                <span className="text-fuchsia-400 font-bold">5 CORE DOMAINS</span>
              </div>

              {detailedSkills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border ${skill.borderColor} ${skill.bgColor} space-y-2.5 transition-all hover:brightness-110`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-white">
                          <Icon className={`w-4 h-4 ${skill.color}`} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold font-tech text-white uppercase tracking-wider">
                            {skill.category}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            Proficiency: <strong className={skill.color}>{skill.level}</strong>
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${skill.borderColor} ${skill.color} bg-black/40`}>
                        {skill.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {skill.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {skill.stack.map((item, i) => (
                        <span 
                          key={i}
                          className="px-2 py-0.5 rounded bg-black/60 border border-purple-800/50 text-[10px] font-mono text-purple-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* TAB 3: CONTACT & WHATSAPP */}
          {activeTab === 'contact' && (
            <motion.div 
              key="contact-tab"
              initial={{ opacity: 0, x: -10, filter: 'blur(3px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 10, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-[#0d0724] border border-purple-500/40 space-y-3">
                <div className="text-xs font-mono text-fuchsia-400 font-bold flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>DIRECT DIRECTORY &amp; INSTANT REACH</span>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Have an AI automation project, full-stack build, or quant trading consultation in mind? Reach out directly via WhatsApp or email for instant transmission.
                </p>

                {/* WhatsApp Direct Card */}
                <div className="p-3.5 rounded-lg bg-emerald-950/25 border border-emerald-500/40 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-900/50 border border-emerald-400/50 flex items-center justify-center">
                      <WhatsAppLogo className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">WHATSAPP OFFICIAL</div>
                      <div className="text-sm font-mono text-white font-bold">{phone}</div>
                    </div>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <span>OPEN CHAT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Instagram Official Card */}
                <div className="p-3.5 rounded-lg bg-pink-950/25 border border-pink-500/40 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-pink-900/50 border border-pink-400/50 flex items-center justify-center">
                      <InstagramLogo className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-pink-400 uppercase font-bold">INSTAGRAM OFFICIAL</div>
                      <div className="text-sm font-mono text-white font-bold">{APURBA_SOCIAL_LINKS.instagramHandle}</div>
                    </div>
                  </div>

                  <a
                    href={APURBA_SOCIAL_LINKS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => cyberSound.playClick()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  >
                    <span>OPEN PROFILE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Email Direct Card */}
                <div className="p-3.5 rounded-lg bg-purple-950/25 border border-purple-500/40 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-400/50 flex items-center justify-center">
                      <GmailLogo className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-purple-400 uppercase font-bold">EMAIL INBOX</div>
                      <div className="text-sm font-mono text-white font-bold">{email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-mono text-xs transition-all border border-purple-600/40"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                    </button>

                    <a
                      href={`mailto:${email}`}
                      onClick={() => cyberSound.playClick()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(217,70,239,0.3)]"
                    >
                      <span>Mail Me</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Physical Location Card */}
                <div className="p-3 rounded-lg bg-[#0b051e] border border-purple-900/50 flex items-center gap-3 text-xs font-mono">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-300">
                    Location: <strong className="text-white">Kolaghat, Purba Medinipur, West Bengal, India 🇮🇳</strong>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

        </div>

        {/* Modal Bottom Action Bar */}
        <div className="mt-4 pt-3.5 border-t border-purple-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            // DOSSIER ID: APURBA_BERA_2026_V3
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                cyberSound.playClick();
                window.print();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 border border-purple-700/50 text-purple-200 text-xs font-mono font-semibold transition-all"
              title="Print CV or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-purple-400" />
              <span>PRINT / PDF</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#d91993] to-[#ec26a6] hover:from-[#c21481] hover:to-[#db1b96] text-white shadow-[0_0_20px_rgba(236,38,166,0.45)] transition-all font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD DOSSIER (.TXT)</span>
            </motion.button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
