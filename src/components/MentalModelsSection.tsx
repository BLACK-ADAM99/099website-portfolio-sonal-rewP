import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  MessageSquare, 
  Award, 
  Layers, 
  ShieldCheck, 
  Zap,
  Bookmark
} from 'lucide-react';
import { MENTAL_MODELS } from '../data/productionChecklistData';
import { MagneticButton } from './MagneticButton';
import { cyberSound } from '../utils/cyberSound';

export const MentalModelsSection: React.FC = () => {
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const interviewAnswer = `AI-assisted development can dramatically speed up implementation, but production readiness requires architecture, security, reliable data handling, testing, deployment, observability and operational planning. The engineer is responsible for validating all of those pieces.`;

  const handleCopy = () => {
    cyberSound.playClick();
    navigator.clipboard.writeText(interviewAnswer);
    setCopiedAnswer(true);
    cyberSound.playSuccess();
    setTimeout(() => setCopiedAnswer(false), 2500);
  };

  const handleSpeak = () => {
    cyberSound.playClick();
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(interviewAnswer);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const categories = ['All', 'Client', 'Server', 'Data', 'Identity', 'Defense', 'Speed', 'Quality', 'Operations'];

  const filteredModels = filterCategory === 'All'
    ? MENTAL_MODELS
    : MENTAL_MODELS.filter(m => m.category === filterCategory);

  return (
    <section id="mental-models" className="py-12 relative">
      <div className="rounded-2xl bg-gradient-to-b from-[#0a041f] via-[#0d0626] to-[#060214] border border-purple-500/40 p-5 sm:p-8 shadow-[0_0_45px_rgba(168,85,247,0.18)] relative overflow-hidden">
        
        {/* Ambient Lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,70,239,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-900/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[10px] font-mono text-cyan-300 mb-2">
              <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>PAGE 09 &bull; SECTION 20</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-tech text-white uppercase tracking-wider flex items-center gap-2">
              <span>FINAL MENTAL MODEL &bull; INTERVIEW SUMMARY</span>
              <span className="text-fuchsia-400 font-mono">_</span>
            </h2>
            <p className="text-xs font-mono text-purple-300 mt-1">
              Internalize the 12 core engineering concerns and master the interview-ready explanation.
            </p>
          </div>
        </div>

        {/* THE BIG TAKEAWAY Banner */}
        <div className="mb-10 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-purple-950/60 via-fuchsia-950/40 to-purple-950/60 border-2 border-fuchsia-500/70 shadow-[0_0_35px_rgba(217,70,239,0.3)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-600/30 border border-fuchsia-400 flex items-center justify-center text-fuchsia-300 shrink-0 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-fuchsia-300 font-bold uppercase tracking-widest mb-1">
                // THE BIG TAKEAWAY
              </div>
              <p className="text-base sm:text-lg font-bold font-tech text-white uppercase tracking-wide">
                &ldquo;AI can generate the code. You still need engineering to make the product production-ready.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Interview-Ready Answer Card */}
        <div className="mb-10 p-6 sm:p-7 rounded-2xl bg-[#09031c] border border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.2)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold font-tech text-cyan-300 uppercase tracking-wider">
                INTERVIEW-READY ANSWER (MEMORIZE &amp; ARTICULATE)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-all cursor-pointer"
                title="Play Audio Speech"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-cyan-200' : ''}`} />
                <span>{isSpeaking ? 'STOP AUDIO' : 'LISTEN'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-xs font-mono transition-all cursor-pointer"
              >
                {copiedAnswer ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-purple-300" />
                    <span>COPY ANSWER</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/70 border border-cyan-900/60 font-mono text-sm sm:text-base text-white leading-relaxed italic">
            &ldquo;{interviewAnswer}&rdquo;
          </div>
        </div>

        {/* 12 Core Engineering Concerns Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h3 className="text-sm font-bold font-tech text-white uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-fuchsia-400" />
              <span>THE 12 CORE ENGINEERING CONCERNS (TABLE)</span>
            </h3>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    filterCategory === cat
                      ? 'bg-fuchsia-600/40 text-white font-bold border border-fuchsia-500/70'
                      : 'text-slate-400 hover:text-slate-200 bg-purple-950/30 border border-purple-900/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredModels.map((item, idx) => (
              <motion.div
                key={item.concern}
                whileHover={{ scale: 1.025, y: -2 }}
                className="p-4 rounded-xl bg-[#09031c]/90 border border-purple-900/60 hover:border-fuchsia-500/60 transition-all flex flex-col justify-between space-y-2 group shadow-inner"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-400 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-800/40 text-purple-300">
                      {item.category}
                    </span>
                    <span>0{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold font-tech text-white group-hover:text-fuchsia-300 transition-colors uppercase">
                    {item.concern}
                  </h4>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-purple-950 text-xs font-mono text-cyan-200 leading-relaxed">
                  <span className="text-purple-400 font-bold block mb-0.5">// REMEMBER THIS:</span>
                  {item.rememberThis}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
