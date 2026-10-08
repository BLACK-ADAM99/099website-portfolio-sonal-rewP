import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal as TerminalIcon, CornerDownLeft, Sparkles } from 'lucide-react';
import { useCyberTheme, CyberTheme } from '../context/ThemeContext';
import {
  APURBA_SOCIAL_LINKS,
  WhatsAppLogo,
  InstagramLogo,
  GmailLogo,
} from './SocialBrandIcons';
import { cyberSound } from '../utils/cyberSound';

interface CyberTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  command?: string;
  response: string | React.ReactNode;
  isError?: boolean;
}

export const CyberTerminalModal: React.FC<CyberTerminalModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, themeConfig } = useCyberTheme();
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      response: (
        <div className="space-y-1 text-slate-300">
          <p className="text-fuchsia-400 font-bold">
            [APURBA_BERA_CYBER_CLI v4.2.0 - INITIALIZED]
          </p>
          <p className="text-slate-400 text-xs">
            Welcome to Apurba Bera&apos;s interactive developer console. Type <span className="text-cyan-300 font-bold">&apos;help&apos;</span> or tap the quick chips below to query the system.
          </p>
        </div>
      ),
    },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    cyberSound.playClick();

    if (!trimmed) return;

    if (trimmed === 'clear') {
      setLogs([]);
      setInput('');
      return;
    }

    let responseNode: React.ReactNode;
    let isError = false;

    switch (trimmed) {
      case 'help':
        responseNode = (
          <div className="space-y-1 text-xs">
            <p className="text-fuchsia-300 font-bold">Available Commands:</p>
            <ul className="grid grid-cols-2 gap-1 text-slate-300">
              <li><strong className="text-cyan-400">about</strong> - Apurba&apos;s background</li>
              <li><strong className="text-cyan-400">skills</strong> - Engineering &amp; AI stack</li>
              <li><strong className="text-cyan-400">trading</strong> - Forex models &amp; algo metrics</li>
              <li><strong className="text-cyan-400">partners</strong> - Active client ecosystems &amp; ticker</li>
              <li><strong className="text-cyan-400">gaming</strong> - APM &amp; competitive gaming</li>
              <li><strong className="text-cyan-400">billionaire</strong> - The generational roadmap</li>
              <li><strong className="text-cyan-400">glitch</strong> - Trigger audio/visual glitch</li>
              <li><strong className="text-cyan-400">contact</strong> - Reach out on WhatsApp / Email</li>
              <li><strong className="text-cyan-400">clear</strong> - Reset terminal window</li>
            </ul>
          </div>
        );
        break;

      case 'partners':
      case 'ticker':
      case 'clients':
        responseNode = (
          <div className="text-xs space-y-1.5 text-cyan-300">
            <p className="font-bold text-white">// ROTATING ENTERPRISE CLIENT PROTOCOLS:</p>
            <p>&bull; <strong className="text-fuchsia-300">Nexora Global:</strong> Autonomous AI Suite &bull; 70% Ops Auto</p>
            <p>&bull; <strong className="text-emerald-300">Quantum FX Labs:</strong> MT5 Forex Arbitrage &bull; 78.4% Win Rate</p>
            <p>&bull; <strong className="text-cyan-300">Synapse Vision UK:</strong> Neural Invoice OCR &bull; 99.4% Precision</p>
            <p>&bull; <strong className="text-amber-300">Vive Reality Corp:</strong> Spatial WebGL Metaverse &bull; 60 FPS Locked</p>
            <p>&bull; <strong className="text-purple-300">Kolaghat Mainframe:</strong> Bengal Distributed Edge Node &bull; 99.99%</p>
          </div>
        );
        break;

      case 'glitch':
        cyberSound.playGlitch();
        responseNode = (
          <div className="text-xs font-mono text-cyan-300 drop-shadow-[2px_0_#ec4899,-2px_0_#06b6d4]">
            [CHROMATIC ABERRATION BUFFER INITIALIZED // QUANTUM GLITCH AUDIO FIRED]
          </div>
        );
        break;

      case 'theme':
      case 'theme cyber':
      case 'theme quant':
      case 'theme gold':
      case 'theme stealth':
        {
          const targetTheme = trimmed.replace('theme', '').trim() as CyberTheme;
          if (['cyber', 'quant', 'gold', 'stealth'].includes(targetTheme)) {
            setTheme(targetTheme);
            responseNode = (
              <p className="text-xs text-emerald-400 font-bold">
                [SUCCESS] SYSTEM MATRIX RECONFIGURED TO &apos;{targetTheme.toUpperCase()}&apos;
              </p>
            );
          } else {
            responseNode = (
              <div className="text-xs space-y-1">
                <p className="text-cyan-300 font-bold">Active Theme: {themeConfig.name}</p>
                <p className="text-slate-300">Usage: <span className="text-fuchsia-400">theme cyber</span> | <span className="text-emerald-400">theme quant</span> | <span className="text-amber-400">theme gold</span> | <span className="text-slate-200">theme stealth</span></p>
              </div>
            );
          }
        }
        break;

      case 'about':
        responseNode = (
          <p className="text-xs text-slate-200 leading-relaxed">
            <span className="text-fuchsia-400 font-bold">Apurba Bera</span> is a Class 11 tech prodigy from Kolaghat, Purba Medinipur, West Bengal. Operating at the cutting edge of AI Engineering, full-stack systems, algorithmic Forex trading, and Vive/VR coding.
          </p>
        );
        break;

      case 'skills':
        responseNode = (
          <div className="text-xs space-y-1 text-slate-200">
            <p><strong className="text-purple-400">AI:</strong> Autonomous Agents, LLM Fine-tuning, Python, LangChain, API Pipelines</p>
            <p><strong className="text-purple-400">Dev:</strong> React, Next.js, Node.js, Express, TypeScript, Tailwind, REST APIs</p>
            <p><strong className="text-purple-400">Interactive:</strong> Vive VR coding, Three.js, WebGL, Shader programming</p>
            <p><strong className="text-purple-400">Markets:</strong> Multi-timeframe Forex technicals, MT5, Algo Risk Management</p>
          </div>
        );
        break;

      case 'trading':
        responseNode = (
          <div className="text-xs space-y-1 text-emerald-300">
            <p className="font-bold text-white">Forex Trading Framework:</p>
            <p>&bull; Pairs: EUR/USD, GBP/USD, USD/JPY, Gold (XAU/USD)</p>
            <p>&bull; Strategy: Systematic liquidity sweeps, supply/demand order blocks &amp; tight 1:3 RR ratios</p>
            <p>&bull; Execution: Automated indicators &amp; high discipline</p>
          </div>
        );
        break;

      case 'gaming':
        responseNode = (
          <div className="text-xs space-y-1 text-cyan-300">
            <p className="font-bold text-white">Gamer &amp; Vive Coder Protocol:</p>
            <p>&bull; High APM, spatial awareness, and rapid tactical decision-making.</p>
            <p>&bull; Translates gaming mechanics into high-speed creative code and 60fps web apps.</p>
          </div>
        );
        break;

      case 'billionaire':
        responseNode = (
          <div className="text-xs space-y-1 text-amber-300">
            <p className="font-bold text-white">The Billionaire Blueprint:</p>
            <p>&bull; Phase 1: High-yield AI Business Enhancers &amp; automated agency software.</p>
            <p>&bull; Phase 2: Compounding quantitative trading capital in global macro markets.</p>
            <p>&bull; Phase 3: Founding generational AI and spatial computing enterprises.</p>
          </div>
        );
        break;

      case 'contact':
      case 'social':
        responseNode = (
          <div className="text-xs space-y-1.5">
            <p className="text-slate-200 flex items-center gap-2">
              <WhatsAppLogo className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp:</span>
              <a
                href={APURBA_SOCIAL_LINKS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline font-bold"
              >
                {APURBA_SOCIAL_LINKS.whatsappDisplay}
              </a>
            </p>
            <p className="text-slate-200 flex items-center gap-2">
              <InstagramLogo className="w-3.5 h-3.5 shrink-0" />
              <span>Instagram:</span>
              <a
                href={APURBA_SOCIAL_LINKS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 underline font-bold"
              >
                {APURBA_SOCIAL_LINKS.instagramHandle}
              </a>
            </p>
            <p className="text-slate-200 flex items-center gap-2">
              <GmailLogo className="w-3.5 h-3.5 shrink-0" />
              <span>Email:</span>
              <a href={APURBA_SOCIAL_LINKS.emailUrl} className="text-fuchsia-400 underline font-bold">
                {APURBA_SOCIAL_LINKS.emailAddress}
              </a>
            </p>
            <p className="text-slate-400">Location: Kolaghat, Purba Medinipur, West Bengal, India (22.4329° N, 87.8599° E)</p>
          </div>
        );
        break;

      default:
        isError = true;
        responseNode = (
          <p className="text-xs text-rose-400">
            Command not recognized: &apos;{trimmed}&apos;. Type <span className="text-cyan-300 underline">&apos;help&apos;</span> for list.
          </p>
        );
        break;
    }

    setLogs((prev) => [...prev, { command: cmd, response: responseNode, isError }]);
    setInput('');
  };

  const quickCommands = ['help', 'about', 'skills', 'trading', 'partners', 'glitch', 'billionaire', 'contact', 'clear'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#090518] border border-cyan-500/40 p-5 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 flex flex-col h-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 mb-3 shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white tracking-wider">APURBA_CLI_SHELL</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
            aria-label="Close terminal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Command Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-fuchsia-400" /> QUICK:
          </span>
          {quickCommands.map((q) => (
            <button
              key={q}
              onClick={() => handleCommand(q)}
              className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 transition-all shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Logs Output Area */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto space-y-3 font-mono pr-2 mt-2 select-text">
          {logs.map((log, i) => (
            <div key={i} className="space-y-1">
              {log.command && (
                <div className="flex items-center gap-2 text-xs text-purple-400">
                  <span className="text-cyan-400">apurba@kolaghat:~$</span>
                  <span className="text-white font-bold">{log.command}</span>
                </div>
              )}
              <div className="pl-4">{log.response}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
          }}
          className="mt-3 pt-3 border-t border-purple-900/40 flex items-center gap-2 shrink-0 font-mono"
        >
          <span className="text-cyan-400 text-xs font-bold">apurba@kolaghat:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command ('help', 'trading', 'skills')..."
            className="flex-1 bg-transparent text-white text-xs placeholder-slate-600 focus:outline-none"
          />
          <button
            type="submit"
            className="p-1.5 rounded-lg bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-900/50"
            aria-label="Execute command"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
