import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Send, Check, Radio, ShieldCheck, ExternalLink, Copy } from 'lucide-react';
import { DetailedWorldMap } from './DetailedWorldMap';
import { MagneticButton } from './MagneticButton';
import { CyberTextReveal } from './CyberTextReveal';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<'email' | 'whatsapp' | null>(null);

  const handleCopy = (text: string, field: 'email' | 'whatsapp', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cyberSound.playClick();
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cyberSound.playClick();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      cyberSound.playSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    }, 650);
  };

  const arrivalLeft = getTopLevelArrival(0, 0.07);
  const arrivalCenter = getTopLevelArrival(1, 0.07);
  const arrivalRight = getTopLevelArrival(2, 0.07);

  return (
    <motion.section
      id="contact"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-12 md:py-20 relative perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Staggered Character-by-Character Reveal */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="mb-10 flex flex-wrap items-center justify-between gap-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber-wide text-white uppercase flex items-center gap-2">
            <CyberTextReveal text="LET'S WORK TOGETHER" mode="chars" staggerDelay={0.028} />
            <span className="text-fuchsia-500 animate-pulse font-mono">_</span>
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 backdrop-blur-md border border-purple-500/40 text-xs font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            <span>ENCRYPTED_UPLINK: ONLINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </motion.div>

        {/* 3-Section Layout with Complex 3D Arrival */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Info: Official Brand Social & Contact Cards */}
          <motion.div
            initial={arrivalLeft.initial}
            whileInView={arrivalLeft.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={arrivalLeft.transition}
            className="lg:col-span-3 space-y-3.5"
          >
            {/* 1. WhatsApp Official Card */}
            <motion.a
              whileHover={{ scale: 1.025, x: 4 }}
              href={`${APURBA_SOCIAL_LINKS.whatsappUrl}?text=${encodeURIComponent(
                'Hi Apurba, I visited your portfolio and would like to connect!'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => cyberSound.playHover()}
              onClick={() => cyberSound.playClick()}
              className="flex items-center justify-between gap-3 group cursor-pointer p-3 rounded-xl bg-[#0c0722]/40 backdrop-blur-md border border-emerald-500/35 hover:border-emerald-400/80 hover:bg-[#081f1c]/60 shadow-[0_0_18px_rgba(16,185,129,0.12)] hover:shadow-[0_0_28px_rgba(16,185,129,0.32)] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,211,102,0.45)] transition-all shrink-0">
                  <WhatsAppLogo className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                    WHATSAPP DIRECT
                  </span>
                  <span className="text-xs font-mono text-white group-hover:text-emerald-200 transition-colors block truncate">
                    {APURBA_SOCIAL_LINKS.whatsappDisplay}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleCopy(APURBA_SOCIAL_LINKS.whatsappNumber, 'whatsapp', e)}
                title="Copy WhatsApp Number"
                className="p-1.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors shrink-0"
              >
                {copiedField === 'whatsapp' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </motion.a>

            {/* 2. Instagram Official Card */}
            <motion.a
              whileHover={{ scale: 1.025, x: 4 }}
              href={APURBA_SOCIAL_LINKS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => cyberSound.playHover()}
              onClick={() => cyberSound.playClick()}
              className="flex items-center justify-between gap-3 group cursor-pointer p-3 rounded-xl bg-[#0c0722]/40 backdrop-blur-md border border-pink-500/35 hover:border-pink-400/80 hover:bg-[#1f0924]/60 shadow-[0_0_18px_rgba(236,72,153,0.12)] hover:shadow-[0_0_28px_rgba(236,72,153,0.32)] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-pink-950/70 border border-pink-500/50 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.45)] transition-all shrink-0">
                  <InstagramLogo className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold">
                    INSTAGRAM OFFICIAL
                  </span>
                  <span className="text-xs font-mono text-white group-hover:text-pink-200 transition-colors block truncate">
                    {APURBA_SOCIAL_LINKS.instagramHandle}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </motion.a>

            {/* 3. Email Direct Card */}
            <motion.a
              whileHover={{ scale: 1.025, x: 4 }}
              href={APURBA_SOCIAL_LINKS.emailUrl}
              onMouseEnter={() => cyberSound.playHover()}
              onClick={() => cyberSound.playClick()}
              className="flex items-center justify-between gap-3 group cursor-pointer p-3 rounded-xl bg-[#0c0722]/40 backdrop-blur-md border border-purple-900/40 hover:border-fuchsia-500/65 hover:bg-[#12082f]/60 shadow-[0_0_15px_rgba(147,51,234,0.08)] hover:shadow-[0_0_25px_rgba(217,70,239,0.28)] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center group-hover:border-fuchsia-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all shrink-0">
                  <GmailLogo className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono tracking-widest text-fuchsia-400 uppercase font-bold">
                    EMAIL DIRECT
                  </span>
                  <span className="text-xs font-mono text-purple-100 group-hover:text-fuchsia-200 transition-colors block truncate">
                    {APURBA_SOCIAL_LINKS.emailAddress}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => handleCopy(APURBA_SOCIAL_LINKS.emailAddress, 'email', e)}
                title="Copy Email Address"
                className="p-1.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-800/60 transition-colors shrink-0"
              >
                {copiedField === 'email' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </motion.a>

            {/* 4. Location */}
            <motion.div
              whileHover={{ scale: 1.025, x: 4 }}
              className="flex items-center gap-3.5 group cursor-pointer p-3 rounded-xl bg-[#0c0722]/40 backdrop-blur-md border border-purple-900/40 hover:border-cyan-500/50 hover:bg-[#0c102f]/60 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  LOCATION // 22.4329° N, 87.8599° E
                </span>
                <span className="text-xs font-mono text-slate-200 block">
                  Kolaghat, Purba Medinipur, West Bengal
                </span>
                <span className="text-[10.5px] font-mono text-cyan-300 block">
                  22° 25&apos; 58&quot; N, 87° 51&apos; 35&quot; E
                </span>
                <span className="text-[11px] font-mono text-purple-400">
                  West Bengal, India 🇮🇳
                </span>
              </div>
            </motion.div>

            {/* Quick Response Badge */}
            <div className="p-3 rounded-xl bg-[#09031d]/40 backdrop-blur-md border border-purple-900/50 text-[11px] font-mono text-slate-300 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Typical Response: <strong className="text-emerald-400">&lt; 12 Hours</strong>
              </span>
            </div>
          </motion.div>

          {/* Center: Contact Form */}
          <motion.div
            initial={arrivalCenter.initial}
            whileInView={arrivalCenter.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={arrivalCenter.transition}
            className="lg:col-span-4"
          >
            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0722]/85 backdrop-blur-md border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-xs shadow-inner"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0722]/85 backdrop-blur-md border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-xs shadow-inner"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0722]/85 backdrop-blur-md border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-xs shadow-inner"
              />

              <textarea
                rows={4}
                required
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0722]/85 backdrop-blur-md border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all text-xs resize-none shadow-inner"
              />

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <MagneticButton
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => cyberSound.playHover()}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase rounded-md bg-gradient-to-r from-[#d91993] to-[#ec26a6] hover:from-[#c21481] hover:to-[#db1b96] transition-all shadow-[0_0_25px_rgba(236,38,166,0.5)] hover:shadow-[0_0_35px_rgba(236,38,166,0.75)] disabled:opacity-70 cursor-pointer overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                  {submitted ? (
                    <>
                      <span className="relative z-10">TRANSMITTED!</span>
                      <Check className="relative z-10 w-3.5 h-3.5 text-white" />
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">
                        {loading ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                      </span>
                      <Send className="relative z-10 w-3.5 h-3.5 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </MagneticButton>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`${APURBA_SOCIAL_LINKS.whatsappUrl}?text=${encodeURIComponent(
                    formData.message
                      ? `Hi Apurba, ${formData.message} (From: ${formData.name})`
                      : 'Hi Apurba, I want to discuss an AI/Full-Stack project with you!'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => cyberSound.playHover()}
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold tracking-wider text-emerald-300 uppercase rounded-md border border-emerald-500/50 bg-emerald-950/40 backdrop-blur-md hover:bg-emerald-900/60 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
                >
                  <WhatsAppLogo className="w-4 h-4" />
                  <span>WHATSAPP</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={APURBA_SOCIAL_LINKS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => cyberSound.playHover()}
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold tracking-wider text-pink-300 uppercase rounded-md border border-pink-500/50 bg-pink-950/40 backdrop-blur-md hover:bg-pink-900/60 hover:text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.25)] cursor-pointer"
                >
                  <InstagramLogo className="w-4 h-4" />
                  <span>INSTAGRAM</span>
                </motion.a>
              </div>
            </form>
          </motion.div>

          {/* Right: 100,000x Detailed Real World Map Component */}
          <motion.div
            initial={arrivalRight.initial}
            whileInView={arrivalRight.whileInView}
            viewport={{ once: true, amount: 0.12 }}
            transition={arrivalRight.transition}
            className="lg:col-span-5"
          >
            <DetailedWorldMap />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

