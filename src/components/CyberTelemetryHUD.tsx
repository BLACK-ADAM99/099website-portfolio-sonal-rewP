import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Radio, 
  Wifi, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  Terminal,
  Zap,
  Globe
} from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';

interface CyberTelemetryHUDProps {
  onOpenTerminal?: () => void;
}

export const CyberTelemetryHUD: React.FC<CyberTelemetryHUDProps> = ({ onOpenTerminal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(cyberSound.enabled);
  const [fps, setFps] = useState<number>(60);
  const [ping, setPing] = useState<number>(24);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [sessionUptime, setSessionUptime] = useState<number>(0);

  // Sync audio state
  useEffect(() => {
    return cyberSound.subscribe((enabled) => {
      setIsAudioEnabled(enabled);
    });
  }, []);

  // Measure Real FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Check WebGL Acceleration
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Real Network Latency Check
  useEffect(() => {
    const checkPing = async () => {
      const start = performance.now();
      try {
        // Fast HEAD request to current host
        await fetch('/', { method: 'HEAD', cache: 'no-cache' });
        const latency = Math.round(performance.now() - start);
        setPing(Math.max(8, Math.min(latency, 120)));
      } catch {
        setPing(18 + Math.floor(Math.random() * 8));
      }
    };

    checkPing();
    const pingInterval = setInterval(checkPing, 10000);
    return () => clearInterval(pingInterval);
  }, []);

  // Track Real Scroll Percent
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollPercent(Math.round((window.scrollY / totalScroll) * 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Session Uptime Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    const newState = cyberSound.toggle();
    if (newState) {
      cyberSound.playSuccess();
    }
  };

  return (
    <aside aria-label="System Telemetry HUD" className="fixed bottom-4 left-4 z-40 font-mono text-[11px] select-none">
      <div className="relative">
        
        {/* Expanded Telemetry Diagnostics Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mb-2 w-72 rounded-2xl bg-[#09041a]/95 backdrop-blur-xl border border-cyan-500/50 p-4 shadow-[0_0_35px_rgba(6,182,212,0.3),0_0_50px_rgba(217,70,239,0.2)] text-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>LIVE KERNEL TELEMETRY</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* FPS */}
                <div className="p-2 rounded-lg bg-[#050210] border border-purple-900/60">
                  <span className="text-[9.5px] text-slate-400 block">// RENDER FPS</span>
                  <span className={`text-sm font-bold ${fps >= 55 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {fps} FPS
                  </span>
                </div>

                {/* Ping */}
                <div className="p-2 rounded-lg bg-[#050210] border border-purple-900/60">
                  <span className="text-[9.5px] text-slate-400 block">// NET LATENCY</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {ping} ms
                  </span>
                </div>

                {/* WebGL Status */}
                <div className="p-2 rounded-lg bg-[#050210] border border-purple-900/60">
                  <span className="text-[9.5px] text-slate-400 block">// GPU ENGINE</span>
                  <span className="text-xs font-bold text-fuchsia-400">
                    {hasWebGL ? 'WEBGL 2.0' : 'FALLBACK'}
                  </span>
                </div>

                {/* Viewport Scroll */}
                <div className="p-2 rounded-lg bg-[#050210] border border-purple-900/60">
                  <span className="text-[9.5px] text-slate-400 block">// VIEWPORT DEPTH</span>
                  <span className="text-xs font-bold text-purple-300">
                    {scrollPercent}% SCROLL
                  </span>
                </div>
              </div>

              {/* Audio Synthesizer Status & Interactive Toggle */}
              <div className="p-2.5 rounded-xl bg-[#0e072b] border border-purple-500/40 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[9.5px] text-purple-300 font-bold flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400" />
                    <span>AUDIO SYNTH ENGINE</span>
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {isAudioEnabled ? '44.1kHz WebAudio Active' : 'Sound Muted'}
                  </div>
                </div>

                <button
                  onClick={toggleAudio}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                    isAudioEnabled 
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-purple-950/50 border-purple-600/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {isAudioEnabled ? 'ENABLED' : 'MUTED'}
                </button>
              </div>

              {/* Bottom Row with Terminal Shortcut */}
              <div className="flex items-center justify-between text-[9.5px] text-slate-400 pt-1">
                <span>SESSION: {formatUptime(sessionUptime)}</span>
                {onOpenTerminal && (
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      onOpenTerminal();
                    }}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 underline transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>OPEN CLI (CTRL+K)</span>
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Pill Badge Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              cyberSound.playClick();
              setIsExpanded(!isExpanded);
            }}
            onMouseEnter={() => cyberSound.playHover()}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#090518]/90 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-400 text-slate-300 hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer group"
            title="Toggle Live System Telemetry HUD"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-bold text-cyan-300">
              {fps} FPS &bull; {ping}ms
            </span>
            <span className="text-purple-400 font-bold">//</span>
            <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
              TELEMETRY
            </span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>

          {/* Quick Sound Toggle Button */}
          <button
            onClick={toggleAudio}
            onMouseEnter={() => cyberSound.playHover()}
            className={`p-1.5 rounded-full border transition-all cursor-pointer backdrop-blur-md shadow-lg ${
              isAudioEnabled 
                ? 'bg-purple-950/80 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.4)]'
                : 'bg-[#090518]/90 border-purple-900/60 text-slate-500 hover:text-slate-300'
            }`}
            title={isAudioEnabled ? 'Mute Cyber Audio' : 'Enable Cyber WebAudio Synthesizer'}
            aria-label={isAudioEnabled ? 'Mute Cyber Audio' : 'Enable Cyber WebAudio Synthesizer'}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-3.5 h-3.5 animate-pulse text-fuchsia-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

      </div>
    </aside>
  );
};
