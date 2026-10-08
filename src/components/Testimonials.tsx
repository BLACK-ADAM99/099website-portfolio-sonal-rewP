import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { CyberTextReveal } from './CyberTextReveal';
import { CyberTiltCard } from './CyberTiltCard';
import { cyberSound } from '../utils/cyberSound';
import { getTopLevelArrival, HEADER_ARRIVAL, SECTION_REVEAL } from '../utils/cyberMotion';
import avatarLiamImg from '../assets/images/avatar_liam_1790514609913.jpg';
import avatarSophiaImg from '../assets/images/avatar_sophia_1790514622294.jpg';
import avatarNoahImg from '../assets/images/avatar_noah_1790514637048.jpg';

const TESTIMONIALS_DATA = [
  {
    quote:
      'Apurba is a rare prodigy. His AI Business Enhancer automated 70% of our manual sales operations and skyrocketed our conversions!',
    author: 'Liam Carter',
    role: 'CEO, Nexora Global',
    avatar: avatarLiamImg,
    rating: 5,
    location: 'San Francisco, USA',
  },
  {
    quote:
      'Apurba’s full-stack and Vive coding execution is mind-blowing for someone in Class 11. He codes with the speed of an elite gamer.',
    author: 'Sophia Bennett',
    role: 'Lead AI Architect',
    avatar: avatarSophiaImg,
    rating: 5,
    location: 'London, UK',
  },
  {
    quote:
      'Working with Apurba on algorithmic Forex setups was a revelation. His discipline and tech vision are unquestionably billionaire-grade.',
    author: 'Noah Mitchell',
    role: 'Managing Partner, QuantFX',
    avatar: avatarNoahImg,
    rating: 5,
    location: 'Singapore',
  },
];

export const Testimonials: React.FC = React.memo(() => {
  return (
    <motion.section
      id="testimonials"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-12 md:py-20 relative perspective-[1200px]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Elastic-Pop Character Reveal */}
        <motion.div
          initial={HEADER_ARRIVAL.initial}
          whileInView={HEADER_ARRIVAL.whileInView}
          viewport={{ once: true, amount: 0.15 }}
          transition={HEADER_ARRIVAL.transition}
          className="mb-10 flex items-center justify-between"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider font-cyber-wide text-white uppercase flex items-center gap-2">
            <CyberTextReveal text="TESTIMONIALS" mode="chars" effect="elasticPop" staggerDelay={0.032} />
            <span className="text-fuchsia-500 animate-pulse font-mono">_</span>
          </h2>
        </motion.div>

        {/* 3 Testimonial Cards with 3D Spring Tilt & Pure GPU Hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item, idx) => {
            const arrival = getTopLevelArrival(idx, 0.08);

            return (
              <motion.div
                key={item.author}
                initial={arrival.initial}
                whileInView={arrival.whileInView}
                viewport={{ once: true, amount: 0.12 }}
                transition={arrival.transition}
                className="flex"
              >
                <CyberTiltCard
                  tiltMax={6.5}
                  glowColor="rgba(217, 70, 239, 0.25)"
                  onMouseEnter={() => cyberSound.playHover()}
                  className="w-full rounded-2xl bg-[#0c0722]/38 border border-purple-500/35 hover:border-fuchsia-500/85 hover:bg-[#130932]/55 p-7 flex flex-col justify-between transition-colors duration-200 backdrop-blur-md shadow-[0_0_24px_rgba(147,51,234,0.1)] hover:shadow-[0_0_38px_rgba(217,70,239,0.35)] cursor-default"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl text-fuchsia-400/90 font-serif leading-none select-none group-hover:text-fuchsia-300 group-hover:scale-115 group-hover:-rotate-6 transition-transform duration-200">
                        “
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:rotate-12 transition-transform"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm sm:text-[15px] text-slate-100 leading-relaxed font-editorial italic mb-8">
                      {item.quote}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-900/35 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={item.avatar}
                          alt={item.author}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/45 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_16px_rgba(217,70,239,0.65)] transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -inset-1 rounded-full border border-dashed border-fuchsia-400/0 group-hover:border-fuchsia-400/80 animate-spin-slow pointer-events-none transition-all" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold font-chakra text-white group-hover:text-fuchsia-300 transition-colors">
                          {item.author}
                        </h4>
                        <p className="text-xs font-signature italic text-fuchsia-300/90">{item.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9.5px] font-mono text-purple-300/85 block">
                        {item.location}
                      </span>
                      <span className="text-[8.5px] font-mono text-emerald-400 font-bold">
                        ● VERIFIED
                      </span>
                    </div>
                  </div>
                </CyberTiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
});
