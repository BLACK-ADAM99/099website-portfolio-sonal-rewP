import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Code2, Cpu, TrendingUp, Gamepad2, Rocket, Globe2, BookOpen } from 'lucide-react';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';
import { cyberSound } from '../utils/cyberSound';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const storyTimeline = [
    {
      era: 'GENESIS & ROOTS',
      eraBn: 'শৈশব ও সূচনা',
      title: 'The Spark in Kolaghat',
      titleBn: 'কোলাঘাটের শৈশব ও কোডের বিস্ময়',
      icon: Globe2,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-950/30',
      descBn: 'পশ্চিমবঙ্গের পূর্ব মেদিনীপুরের রূপনারায়ণ নদীর তীরের কোলাঘাটে অপূর্ব বেরার বেড়ে ওঠা। সাধারণ খেলনার চেয়ে কম্পিউটারের স্ক্রিন, কী-বোর্ডের শব্দ এবং স্ক্রিনের পেছনের লজিক তাকে ছোটবেলা থেকেই মন্ত্রমুগ্ধ করতো। কৌতুহল ছিল একটাই—কীভাবে কয়েক লাইন কোড দিয়ে পুরো একটা ডিজিটাল পৃথিবী নিয়ন্ত্রণ করা যায়।',
      descEn: 'Growing up in Kolaghat, Purba Medinipur along the banks of the Rupnarayan River, young Apurba was fascinated not just by toys, but by the glowing phosphors of computers and logical circuits. The curiosity was singular: how a few lines of code can bend digital reality.',
    },
    {
      era: 'REFLEX TO LOGIC',
      eraBn: 'গেমিং থেকে ডেভেলপার',
      title: 'High-APM Gamer & Vive Coder',
      titleBn: 'কম্পিটিটিভ গেমার ও ভিভ (Vive) কোডিং',
      icon: Gamepad2,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/30',
      descBn: 'গেমিং ছিল কেবল বিনোদন নয়—তা ছিল ক্ষিপ্র সিদ্ধান্ত গ্রহণ, হাই-এপিএম (Actions Per Minute) এবং কৌশলগত ধৈর্যের পাঠশালা। সেখান থেকেই গেমের ভেতরের মেকানিক্স বোঝার তাগিদ। পরবর্তীতে পাইথন, জাভাস্ক্রিপ্ট এবং ফুল-স্ট্যাক ওয়েব পেরিয়ে Vive VR ও থ্রিডি ইন্টারঅ্যাক্টিভ কোডিংয়ে দক্ষতা অর্জন।',
      descEn: 'Competitive gaming taught him high-APM reflexes, composure under pressure, and systemic thinking. He translated that obsession from playing into building—mastering Python, JavaScript, Full-Stack ecosystems, and Vive VR / WebGL interactive environments.',
    },
    {
      era: 'MACRO HORIZONS',
      eraBn: 'মার্কেট ও ডিসিপ্লিন',
      title: 'The Quantitative Forex Trader',
      titleBn: 'কোয়ান্টিটেটিভ ফরেক্স ট্রেডার',
      icon: TrendingUp,
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/30',
      descBn: 'অর্থনৈতিক স্বাধীনতা ও বৈশ্বিক ফিনান্সিয়াল মার্কেটের শক্তির প্রতি গভীর অনুরাগ। অপ্রয়োজনীয় জুয়া নয়—বরং গভীর টেকনিক্যাল অ্যানালিসিস, সাপ্লাই-ডিমান্ড জোন, মাল্টি-টাইমফ্রেম মার্কেট স্ট্রাকচার এবং অ্যালগরিদমিক রিস্ক-টু-রিওয়ার্ড ক্যালকুলেশন দিয়ে ফরেক্স মার্কেটে নিজের ট্রেডিং সিস্টেম তৈরি করেন।',
      descEn: 'Driven by market psychology and economic architecture, Apurba mastered technical chart structures, order blocks, and risk-to-reward ratios. He trades global currencies (EUR/USD, GBP/USD, Gold) with algorithmic discipline.',
    },
    {
      era: 'CURRENT MILESTONE',
      eraBn: 'বর্তমান পর্যায় (ক্লাস ১১)',
      title: 'Class 11 Prodigy & AI Business Enhancers',
      titleBn: 'একাদশ শ্রেণির ছাত্র ও এআই বিজনেস এনহ্যান্সার',
      icon: Cpu,
      color: 'text-fuchsia-400',
      border: 'border-fuchsia-500/40',
      bg: 'bg-fuchsia-950/30',
      descBn: 'বর্তমানে একাদশ শ্রেণিতে (Class 11) পড়ার পাশাপাশি তিনি সমসাময়িক এআই মডেল (LLMs, Autonomous Agents) ব্যবহার করে তৈরি করছেন ‘AI Business Enhancers’—যা যেকোনো ব্যবসায়ের ম্যানুয়াল ওয়ার্কফ্লো অটোমেট করে এবং রেভিনিউ বহু গুণ বৃদ্ধি করে। বয়সের সীমারেখাকে ছাপিয়ে তিনি ক্লায়েন্ট ও ইন্ডাস্ট্রিতে নিজের অবস্থান তৈরি করেছেন।',
      descEn: 'Balancing his Class 11 academic life with elite software engineering, Apurba builds custom AI Business Enhancers—autonomous pipelines that automate lead conversions and operational workflows for modern enterprises.',
    },
    {
      era: 'DESTINY & HORIZON',
      eraBn: 'ভবিষ্যতের রূপরেখা',
      title: 'The Relentless Billionaire Vision',
      titleBn: 'বিলিয়নিয়ার মিশন ও বৈশ্বিক প্রতিষ্ঠান',
      icon: Rocket,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/30',
      descBn: 'কোলাঘাট থেকে শুরু হওয়া এই যাত্রার শেষ কোনো সাধারণ ৯-টু-৫ চাকরি নয়। অপূর্ব বেরার চূড়ান্ত লক্ষ্য হলো এআই, ফিনান্সিয়াল ক্যাপিটাল এবং স্প্যাশিয়াল টেকনোলজিকে একত্রিত করে আগামী দিনে নিজস্ব বিলিয়ন-ডলার স্কেলের প্রযুক্তি সাম্রাজ্য প্রতিষ্ঠা করা। কঠোর অধ্যবসায় এবং বিলিয়নিয়ার মাইন্ডসেটই তার দৈনিক চালিকাশক্তি।',
      descEn: 'No ordinary path. The endgame is clear: merging deep AI systems, quantitative market compounding, and spatial computing to build a multi-billion-dollar enterprise that changes industries globally.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl"
          onClick={() => {
            cyberSound.playClick();
            onClose();
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl rounded-2xl bg-[#090518] border border-fuchsia-500/50 p-5 sm:p-7 shadow-[0_0_60px_rgba(217,70,239,0.32)] text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-purple-900/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-fuchsia-400 shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-tech text-white uppercase tracking-wider">
                    THE APURBA STORY
                  </h3>
                  <p className="text-xs font-mono text-purple-300">
                    A Journey from Kolaghat to Billionaire Ambition
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                  title="Switch Language (English / বাংলা)"
                >
                  {lang === 'en' ? 'বাংলা' : 'EN'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  aria-label="Close modal"
                >
                  <span className="hidden sm:inline text-[10px] text-slate-400">ESC</span>
                  <span className="text-sm font-bold text-fuchsia-400">✕</span>
                </button>
              </div>
            </div>

            {/* Scrollable Story Timeline Body */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto pr-2 mt-4 space-y-4 no-scrollbar">
              
              {/* Quick Highlight Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-fuchsia-950/30 border border-purple-500/30 text-xs font-mono text-slate-300 leading-relaxed">
                <div className="flex items-center gap-2 text-fuchsia-300 font-bold mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সংক্ষিপ্ত সারসংক্ষেপ' : 'EXECUTIVE SUMMARY'}</span>
                </div>
                {lang === 'bn' ? (
                  <p>
                    কোলাঘাটের সাধারণ এক কিশোর কীভাবে নিজের একাগ্রতা, কোডিং প্যাশন, ফরেক্সের গভীর জ্ঞান এবং এআই প্রযুক্তির সাহায্যে নিজেকে গড়ে তুলেছে—এটি তারই বাস্তব ও সত্য কাহিনি।
                  </p>
                ) : (
                  <p>
                    How a disciplined teenager from Kolaghat evolved from curiosity to building real-world AI Business Enhancers, quantitative trading models, and an uncompromising billionaire mindset.
                  </p>
                )}
              </div>

              {/* Timeline Nodes */}
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-[2px] before:bg-gradient-to-b before:from-purple-500 before:via-fuchsia-500 before:to-amber-500 pl-8">
                {storyTimeline.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="relative group">
                      {/* Left Circle Node */}
                      <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full bg-[#090518] border-2 ${item.border} flex items-center justify-center ${item.color} shadow-[0_0_12px_rgba(217,70,239,0.25)] group-hover:scale-110 transition-transform`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      {/* Card Content */}
                      <div className={`p-4 rounded-xl ${item.bg} border ${item.border} space-y-1.5 transition-all group-hover:border-opacity-80`}>
                        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                          <span>{lang === 'bn' ? item.eraBn : item.era}</span>
                          <span className={item.color}>CHAPTER 0{idx + 1}</span>
                        </div>

                        <h4 className="text-sm font-bold font-tech text-white tracking-wide">
                          {lang === 'bn' ? item.titleBn : item.title}
                        </h4>

                        <p className="text-xs text-slate-300 leading-relaxed font-light">
                          {lang === 'bn' ? item.descBn : item.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quote Card */}
              <div className="p-4 rounded-xl bg-[#060310] border border-fuchsia-500/30 text-center space-y-1">
                <p className="text-xs italic text-slate-300 font-serif">
                  &ldquo;{lang === 'bn' ? 'স্বপ্ন যদি বড় না হয়, তবে জেগে থাকার কোনো মানে নেই। কোলাঘাট থেকে শুরু, লক্ষ্য বিশ্বজয়।' : 'If the vision isn\'t astronomical, there\'s no point in waking up early. From Kolaghat to the world.'}&rdquo;
                </p>
                <p className="text-[11px] font-mono font-bold text-fuchsia-400 uppercase">
                  — Apurba Bera
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`${APURBA_SOCIAL_LINKS.whatsappUrl}?text=Hi%20Apurba,%20I%20read%20your%20story%20and%20want%20to%20connect!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-300 hover:text-white transition-colors"
                >
                  <WhatsAppLogo className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
                </a>
                <a
                  href={APURBA_SOCIAL_LINKS.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/60 border border-pink-500/40 text-xs font-mono text-pink-300 hover:text-white transition-colors"
                >
                  <InstagramLogo className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href={APURBA_SOCIAL_LINKS.emailUrl}
                  onClick={() => cyberSound.playClick()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-xs font-mono text-purple-200 hover:text-white transition-colors"
                >
                  <GmailLogo className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>

              <button
                onClick={() => {
                  cyberSound.playClick();
                  onClose();
                }}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-purple-900/50 hover:bg-purple-800 text-white transition-colors"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close Story'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
