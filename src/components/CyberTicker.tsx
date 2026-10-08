import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  TrendingUp, 
  Eye, 
  Box, 
  Server, 
  ShieldCheck, 
  Workflow, 
  FileText, 
  Radio, 
  ExternalLink,
  X,
  Cpu
} from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';

export interface PartnerProject {
  id: string;
  name: string;
  tagline: string;
  category: string;
  metric: string;
  uptime: string;
  latency: string;
  tech: string[];
  icon: React.ComponentType<{ className?: string }>;
  verifiedDate: string;
  summary: string;
}

const PARTNERS: PartnerProject[] = [
  {
    id: 'nexora',
    name: 'NEXORA GLOBAL',
    tagline: 'Autonomous AI Sales & Conversion Engine',
    category: 'AI / LLM AGENTS',
    metric: '70% Manual Ops Automated',
    uptime: '99.98%',
    latency: '24ms',
    tech: ['Gemini 2.5', 'FastAPI', 'Redis', 'Python'],
    icon: Terminal,
    verifiedDate: 'Q3 2026',
    summary: 'Flagship client deployment automating lead ingestion, CRM auto-sync, and personalized multi-agent conversational pipelines.'
  },
  {
    id: 'quantfx',
    name: 'QUANTUM FX LABS',
    tagline: 'Algorithmic Forex Arbitrage Terminal',
    category: 'QUANT TRADING',
    metric: '78.4% Net Win Rate',
    uptime: '99.99%',
    latency: '< 8ms',
    tech: ['MetaTrader 5', 'C++', 'WebSockets', 'React'],
    icon: TrendingUp,
    verifiedDate: 'Q2 2026',
    summary: 'Real-time orderbook microstructure execution terminal featuring trailing stops and dynamic volatility-weighted risk models.'
  },
  {
    id: 'synapse',
    name: 'SYNAPSE VISION UK',
    tagline: 'Neural OCR & Invoice Intelligence',
    category: 'COMPUTER VISION',
    metric: '99.4% Parsing Precision',
    uptime: '99.95%',
    latency: '45ms',
    tech: ['Multi-Modal AI', 'Docker', 'PostgreSQL', 'Python'],
    icon: Eye,
    verifiedDate: 'Q1 2026',
    summary: 'Zero-shot document understanding parsing thousands of financial statements and PDFs into standardized schemas in under 500ms.'
  },
  {
    id: 'vive',
    name: 'VIVE REALITY CORP',
    tagline: '60 FPS Spatial WebGL Metaverse Core',
    category: '3D & VIVE VR',
    metric: '60 FPS Shader Precision',
    uptime: '100%',
    latency: '12ms',
    tech: ['Three.js', 'WebGL 2.0', 'GLSL Shaders', 'WebXR'],
    icon: Box,
    verifiedDate: 'Q4 2025',
    summary: 'Cutting-edge spatial WebXR interactive laboratory supporting custom Vive motion controllers and reactive GPU particle mechanics.'
  },
  {
    id: 'kolaghat',
    name: 'KOLAGHAT MAINFRAME',
    tagline: 'Bengal Distributed Edge Cluster',
    category: 'CORE INFRA',
    metric: '1.2M Synthetic Tokens / min',
    uptime: '99.99%',
    latency: '16ms',
    tech: ['Kubernetes', 'Node.js', 'Linux Kernel', 'Nginx'],
    icon: Server,
    verifiedDate: 'ACTIVE',
    summary: 'The central high-throughput server architecture powering Apurba Bera’s personal neural sandbox and autonomous workflow engines.'
  },
  {
    id: 'hyperion',
    name: 'HYPERION CAPITAL',
    tagline: 'High-Frequency Depth Heatmap Engine',
    category: 'INSTITUTIONAL QUANT',
    metric: 'Sharpe Ratio 3.12',
    uptime: '99.98%',
    latency: '5ms',
    tech: ['WebSockets', 'Canvas 2D', 'FastAPI', 'Rust'],
    icon: ShieldCheck,
    verifiedDate: 'Q2 2026',
    summary: 'Institutional-grade liquidity block visualizer detecting hidden iceberg orders across major currency pairs in real time.'
  },
  {
    id: 'aether',
    name: 'AETHER AUTOMATION',
    tagline: 'Self-Healing DevOps Incident Bot',
    category: 'AUTONOMOUS AGENTS',
    metric: '0 Unresolved Incidents',
    uptime: '100%',
    latency: '32ms',
    tech: ['AI Agents', 'Telegram Bot API', 'Docker', 'Prometheus'],
    icon: Workflow,
    verifiedDate: 'Q3 2026',
    summary: 'Autonomous cloud watchdog that monitors crash logs, triggers rollbacks, patches deployment config, and reports audit trails.'
  },
  {
    id: 'cyberdyne',
    name: 'CYBERDYNE LOGISTICS',
    tagline: 'Multi-Modal Logistics Router',
    category: 'GEO & ROUTING',
    metric: '35% Fuel Optimization',
    uptime: '99.96%',
    latency: '38ms',
    tech: ['Graph Algorithms', 'TypeScript', 'Tailwind', 'REST'],
    icon: FileText,
    verifiedDate: 'Q1 2026',
    summary: 'Dynamic real-time dispatch and geo-routing algorithmic system processing multi-stop freight routes across eastern trade corridors.'
  },
];

const DUPLICATED_PARTNERS = [...PARTNERS, ...PARTNERS];

export const CyberTicker: React.FC = React.memo(() => {
  const [activePartner, setActivePartner] = useState<PartnerProject | null>(null);
  const scrambleTimerRef = useRef<number | null>(null);

  // Zero-React-state DOM cipher scramble on hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, partner: PartnerProject) => {
    cyberSound.playHover();
    const labelEl = e.currentTarget.querySelector<HTMLSpanElement>('[data-partner-name]');
    if (!labelEl) return;

    if (scrambleTimerRef.current) {
      window.clearInterval(scrambleTimerRef.current);
    }

    const original = partner.name;
    const cipherChars = '01#%&_<>[]/*$XYZ';
    let iteration = 0;

    scrambleTimerRef.current = window.setInterval(() => {
      labelEl.textContent = original
        .split('')
        .map((_, index) => {
          if (index < iteration) return original[index];
          return cipherChars[Math.floor(Math.random() * cipherChars.length)];
        })
        .join('');

      if (iteration >= original.length) {
        if (scrambleTimerRef.current) window.clearInterval(scrambleTimerRef.current);
        labelEl.textContent = original;
      }
      iteration += 0.6;
    }, 32);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, partner: PartnerProject) => {
    if (scrambleTimerRef.current) {
      window.clearInterval(scrambleTimerRef.current);
      scrambleTimerRef.current = null;
    }
    const labelEl = e.currentTarget.querySelector<HTMLSpanElement>('[data-partner-name]');
    if (labelEl) {
      labelEl.textContent = partner.name;
    }
  };

  React.useEffect(() => {
    return () => {
      if (scrambleTimerRef.current) {
        window.clearInterval(scrambleTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!activePartner) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cyberSound.playClick();
        setActivePartner(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePartner]);

  return (
    <div className="w-full my-8 relative overflow-hidden py-4 select-none">
      {/* Ticker Top HUD Scanline Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider">// ENTERPRISE CLIENTS &amp; ECOSYSTEM PROTOCOLS</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-purple-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>ROTATING TICKER: STREAMING</span>
        </div>
      </div>

      {/* Ticker Track Container with Lateral Dissolve Gradients */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* Animated Marquee Strip */}
        <div className="flex items-center gap-4 w-max py-2 animate-ticker-marquee">
          {DUPLICATED_PARTNERS.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => {
                  cyberSound.playClick();
                  setActivePartner(item);
                }}
                onMouseEnter={(e) => handleMouseEnter(e, item)}
                onMouseLeave={(e) => handleMouseLeave(e, item)}
                className="group relative flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-xl border border-purple-500/25 bg-[#0b0620]/90 hover:border-cyan-400/80 hover:bg-[#140a35] hover:shadow-[0_0_24px_rgba(6,182,212,0.35)] hover:scale-[1.03] cursor-pointer transition-all duration-200 shrink-0"
              >
                {/* Left Client Logo / Protocol Icon */}
                <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:text-white transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Icon className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                </div>

                {/* Partner Name & Tagline */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      data-partner-name
                      className="text-xs font-bold font-mono tracking-wider text-white group-hover:text-cyan-300 transition-colors"
                    >
                      {item.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-800/40 text-[8.5px] font-mono text-purple-300 font-bold">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-[10.5px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="text-emerald-400 font-bold">● {item.metric}</span>
                    <span className="text-purple-600">//</span>
                    <span className="text-cyan-300/80">{item.latency}</span>
                  </div>
                </div>

                {/* Right Inspect Arrow */}
                <div className="w-6 h-6 rounded-full border border-purple-800/50 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-cyan-400 group-hover:bg-cyan-950/60 transition-all shrink-0 ml-1">
                  <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Realistic Client Telemetry Modal Drawer */}
      <AnimatePresence>
        {activePartner && (
          <div
            data-lenis-prevent
            onClick={() => {
              cyberSound.playClick();
              setActivePartner(null);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#0f0729] via-[#0d0624] to-[#080318] border-2 border-cyan-400/80 p-6 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.4),0_0_70px_rgba(217,70,239,0.25)] text-left font-mono"
            >
              {/* Corner HUD Brackets */}
              <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-fuchsia-400 pointer-events-none" />
              <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-fuchsia-400 pointer-events-none" />
              <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => {
                  cyberSound.playClick();
                  setActivePartner(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-slate-300 hover:text-white hover:border-fuchsia-400 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <activePartner.icon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-fuchsia-400 tracking-wider">
                    // CLIENT PROTOCOL VERIFIED [{activePartner.verifiedDate}]
                  </span>
                  <h3 className="text-lg font-bold font-tech text-white uppercase tracking-wide">
                    {activePartner.name}
                  </h3>
                  <p className="text-xs text-slate-400">{activePartner.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-light mb-5 bg-[#09041a] p-3.5 rounded-xl border border-purple-900/50">
                {activePartner.summary}
              </p>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-5 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-[#070314] border border-cyan-500/40">
                  <div className="text-[9.5px] text-slate-400 mb-0.5">// REALTIME LATENCY</div>
                  <div className="text-sm font-bold text-cyan-300">{activePartner.latency}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#070314] border border-emerald-500/40">
                  <div className="text-[9.5px] text-slate-400 mb-0.5">// CLOUD UPTIME</div>
                  <div className="text-sm font-bold text-emerald-400">{activePartner.uptime}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#070314] border border-fuchsia-500/40">
                  <div className="text-[9.5px] text-slate-400 mb-0.5">// KEY RESULT</div>
                  <div className="text-[11px] font-bold text-fuchsia-300 mt-0.5 leading-tight">{activePartner.metric}</div>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="mb-6">
                <div className="text-[10px] text-purple-400 mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>DEPLOYED STACK &amp; ARCHITECTURE</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activePartner.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] bg-purple-950/70 border border-purple-500/40 text-purple-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-purple-900/40">
                <span className="text-[9.5px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  STATUS: HIGH-THROUGHPUT PRODUCTION
                </span>
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    setActivePartner(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400 text-cyan-200 text-xs font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  DISMISS TELEMETRY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
