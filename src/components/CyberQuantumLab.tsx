import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Cpu,
  ShieldCheck,
  Database,
  Sparkles,
  Zap,
  Layers,
  CheckCircle2,
  Server,
  Terminal,
} from 'lucide-react';
import { CyberTextReveal } from './CyberTextReveal';
import { CyberTiltCard } from './CyberTiltCard';
import { CyberCountUp } from './CyberCountUp';
import { cyberSound } from '../utils/cyberSound';
import {
  CHROMATIC_16_PALETTE,
  getUltraLevelArrival,
  HEADER_ARRIVAL,
  SECTION_REVEAL,
} from '../utils/cyberMotion';

interface PipelineStage {
  id: string;
  step: string;
  name: string;
  role: string;
  throughputRps: number;
  p99Ms: number;
  colorIdx: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  specs: string[];
  guarantee: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'edge-cdn',
    step: 'STAGE_01',
    name: 'Global Anycast Edge',
    role: 'TLS 1.3 & DDoS Shield',
    throughputRps: 145000,
    p99Ms: 1.2,
    colorIdx: 0, // Electric Cyan
    icon: Globe,
    specs: ['Brotli-11 Compression', 'HTTP/3 QUIC Multiplexing', 'Edge Rate Limiting'],
    guarantee: 'Sub-2ms global POP routing with zero origin leak.',
  },
  {
    id: 'webgl-atlas',
    step: 'STAGE_02',
    name: 'WebGL 4K Texture Atlas',
    role: '60-Frame Predictive GPU Buffer',
    throughputRps: 60,
    p99Ms: 0.4,
    colorIdx: 1, // Neon Fuchsia
    icon: Layers,
    specs: ['gl.texSubImage2D Paging', '60-Frame Lookahead Queue', 'GLSL Sub-Frame Blend'],
    guarantee: 'Locked 60FPS 4K UHD scroll synchronization with zero dropped frames.',
  },
  {
    id: 'api-gateway',
    step: 'STAGE_03',
    name: 'Type-Safe API Gateway',
    role: 'Schema & Contract Boundary',
    throughputRps: 52000,
    p99Ms: 2.8,
    colorIdx: 3, // Cyber Emerald
    icon: Terminal,
    specs: ['Strict Zod Payload Validation', 'Correlation ID Injection', 'Idempotency Keys'],
    guarantee: '100% deterministic request/response envelopes.',
  },
  {
    id: 'zero-trust',
    step: 'STAGE_04',
    name: 'Zero-Trust Auth Engine',
    role: 'RBAC & Cryptographic Guard',
    throughputRps: 64000,
    p99Ms: 1.6,
    colorIdx: 4, // Solar Amber
    icon: ShieldCheck,
    specs: ['EdDSA / RS256 Token Verify', 'Fine-Grained RBAC Scopes', 'HttpOnly Secure Sessions'],
    guarantee: 'Every mutation verified at the service boundary.',
  },
  {
    id: 'neural-router',
    step: 'STAGE_05',
    name: 'AI LLM Orchestrator',
    role: 'Multi-Model Stream Router',
    throughputRps: 18500,
    p99Ms: 11.4,
    colorIdx: 14, // Ultraviolet Core
    icon: Sparkles,
    specs: ['Semantic Prompt Caching', 'Token Stream Backpressure', 'Structured Output AST'],
    guarantee: 'Resilient multi-model fallback with deterministic schema output.',
  },
  {
    id: 'redis-mesh',
    step: 'STAGE_06',
    name: 'In-Memory Redis Mesh',
    role: 'Sub-Millisecond State Cache',
    throughputRps: 210000,
    p99Ms: 0.5,
    colorIdx: 5, // Crimson Laser
    icon: Zap,
    specs: ['Stale-While-Revalidate', 'Lua Atomic Locks', 'Pub/Sub Event Fanout'],
    guarantee: '99.4% cache hit ratio across high-concurrency reads.',
  },
  {
    id: 'vector-db',
    step: 'STAGE_07',
    name: 'PostgreSQL + pgvector',
    role: 'ACID & HNSW Hybrid Store',
    throughputRps: 38000,
    p99Ms: 3.4,
    colorIdx: 6, // Cobalt Sapphire
    icon: Database,
    specs: ['HNSW Cosine Indexing', 'Serializable Transactions', 'Zero-Downtime Migrations'],
    guarantee: 'Strict ACID durability combined with high-recall vector search.',
  },
  {
    id: 'telemetry-core',
    step: 'STAGE_08',
    name: 'Quantum Telemetry Core',
    role: 'OpenTelemetry & Auto-Scale',
    throughputRps: 95000,
    p99Ms: 1.1,
    colorIdx: 7, // Acid Lime
    icon: Server,
    specs: ['Distributed Flamegraphs', 'Automated Canary Rollback', 'Real-Time SLO Alerts'],
    guarantee: '99.99% production uptime with self-healing container replicas.',
  },
];

export const CyberQuantumLab: React.FC = React.memo(() => {
  const [selectedStageId, setSelectedStageId] = useState<string>(PIPELINE_STAGES[1].id);

  const activeStage =
    PIPELINE_STAGES.find((s) => s.id === selectedStageId) || PIPELINE_STAGES[0];
  const activeColor = CHROMATIC_16_PALETTE[activeStage.colorIdx % CHROMATIC_16_PALETTE.length];

  return (
    <motion.section
      id="quantum-lab"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative perspective-[1200px]"
    >
      {/* Section Header */}
      <motion.div
        initial={HEADER_ARRIVAL.initial}
        whileInView={HEADER_ARRIVAL.whileInView}
        viewport={{ once: true, amount: 0.2 }}
        transition={HEADER_ARRIVAL.transition}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090418]/90 border border-fuchsia-400/40 text-[10px] font-mono tracking-widest uppercase text-fuchsia-300 mb-4 shadow-[0_0_24px_rgba(217,70,239,0.25)]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTERACTIVE SYSTEM PIPELINE // 28-CHANNEL TELEMETRY SANDBOX</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold font-cyber-wide tracking-wider uppercase text-white hero-shadow-aura-title-white">
            <CyberTextReveal
              text="QUANTUM ARCHITECTURE LAB"
              mode="chars"
              effect="neonUnfold"
              staggerDelay={0.024}
            />
          </h2>
        </div>
      </motion.div>

      {/* 8-Stage Interactive Pipeline Nodes with Ultra-Level 3D Arrival */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PIPELINE_STAGES.map((stage, idx) => {
          const color = CHROMATIC_16_PALETTE[stage.colorIdx % CHROMATIC_16_PALETTE.length];
          const isSelected = stage.id === selectedStageId;
          const arrival = getUltraLevelArrival(idx + 3, 0.05);
          const StageIcon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              initial={arrival.initial}
              whileInView={arrival.whileInView}
              viewport={{ once: true, amount: 0.12 }}
              transition={arrival.transition}
              className="h-full"
            >
              <CyberTiltCard
                tiltMax={8}
                glowColor={`rgba(${color.rgb}, 0.24)`}
                className="h-full rounded-2xl bg-transparent"
              >
                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedStageId(stage.id);
                  }}
                  onMouseEnter={() => cyberSound.playHover()}
                  style={{
                    background: isSelected
                      ? `linear-gradient(145deg, rgba(7, 11, 20, 0.34) 0%, rgba(${color.rgb}, 0.15) 100%)`
                      : `linear-gradient(145deg, rgba(7, 11, 20, 0.24) 0%, rgba(${color.rgb}, 0.07) 100%)`,
                    borderColor: isSelected ? color.hex : `rgba(${color.rgb}, 0.42)`,
                    boxShadow: isSelected
                      ? `0 0 28px rgba(${color.rgb}, 0.38)`
                      : `0 8px 24px -10px rgba(${color.rgb}, 0.2)`,
                  }}
                  className="w-full h-full text-left p-4 rounded-2xl bg-[#070b14]/25 hover:bg-[#070b14]/38 border backdrop-blur-[4px] transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-2.5 relative z-10">
                    <span
                      style={{ color: color.hex }}
                      className="text-[10px] font-mono font-bold tracking-widest"
                    >
                      {stage.step}
                    </span>
                    <span
                      style={{
                        backgroundColor: `rgba(${color.rgb}, 0.14)`,
                        borderColor: `rgba(${color.rgb}, 0.45)`,
                        color: color.hex,
                      }}
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-bold border"
                    >
                      {stage.p99Ms}ms P99
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2 relative z-10">
                    <div
                      style={{
                        backgroundColor: `rgba(${color.rgb}, 0.15)`,
                        borderColor: `rgba(${color.rgb}, 0.5)`,
                      }}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                    >
                      <StageIcon className="w-4 h-4" style={{ color: color.hex }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold font-chakra text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                        {stage.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-300">
                        {stage.role}
                      </div>
                    </div>
                  </div>
                </button>
              </CyberTiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Live Selected Stage Inspector + 28-Color Equalizer Wave */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: `linear-gradient(145deg, rgba(7, 11, 20, 0.28) 0%, rgba(${activeColor.rgb}, 0.08) 100%)`,
            borderColor: `rgba(${activeColor.rgb}, 0.5)`,
            boxShadow: `0 16px 48px -12px rgba(${activeColor.rgb}, 0.28)`,
          }}
          className="p-6 sm:p-8 rounded-2xl bg-[#070b14]/28 border backdrop-blur-[4px] relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  style={{
                    backgroundColor: `rgba(${activeColor.rgb}, 0.16)`,
                    borderColor: activeColor.hex,
                    color: activeColor.hex,
                  }}
                  className="px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-widest"
                >
                  {activeStage.step} // {activeColor.name}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PRODUCTION VERIFIED</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-orbitron text-white uppercase tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                {activeStage.name} — {activeStage.role}
              </h3>

              <p className="text-sm text-slate-200 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                {activeStage.guarantee}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {activeStage.specs.map((spec, sIdx) => {
                  const specColor =
                    CHROMATIC_16_PALETTE[(activeStage.colorIdx + sIdx * 3) % CHROMATIC_16_PALETTE.length];
                  return (
                    <div
                      key={spec}
                      style={{ borderColor: `rgba(${specColor.rgb}, 0.4)` }}
                      className="p-3 rounded-xl bg-[#050811]/32 backdrop-blur-[2px] border flex items-center gap-2"
                    >
                      <span
                        style={{ backgroundColor: specColor.hex, boxShadow: `0 0 8px ${specColor.hex}` }}
                        className="w-2 h-2 rounded-full shrink-0"
                      />
                      <span className="text-xs font-mono text-slate-200">{spec}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live 16-Color Frequency Spectrum & Telemetry Counters */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#050811]/28 border border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#0b1120]/38 border border-white/10">
                  <div className="text-[10px] font-mono text-slate-300 uppercase">
                    PEAK THROUGHPUT
                  </div>
                  <div
                    style={{ color: activeColor.hex }}
                    className="text-xl sm:text-2xl font-bold font-tech mt-0.5"
                  >
                    <CyberCountUp
                      value={activeStage.throughputRps}
                      suffix={activeStage.id === 'webgl-atlas' ? ' FPS' : ' RPS'}
                      durationMs={1100}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0b1120]/38 border border-white/10">
                  <div className="text-[10px] font-mono text-slate-300 uppercase">
                    P99 LATENCY BUDGET
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-tech text-emerald-400 mt-0.5">
                    <CyberCountUp
                      value={activeStage.p99Ms}
                      decimals={1}
                      suffix=" ms"
                      durationMs={1100}
                    />
                  </div>
                </div>
              </div>

              {/* 28-Bar Multi-Color Live Spectrum Visualizer */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-2">
                  <span>28-COLOR CHROMATIC HARMONIC SPECTRUM</span>
                  <span className="text-cyan-300">LOCKED 60FPS</span>
                </div>
                <div className="h-16 flex items-end gap-1 px-2 py-2 rounded-lg bg-[#050811]/38 border border-white/10">
                  {CHROMATIC_16_PALETTE.map((barColor, bIdx) => {
                    const baseHeight = 28 + ((bIdx * 19 + activeStage.colorIdx * 11) % 68);
                    return (
                      <div
                        key={barColor.id}
                        style={{
                          transform: `scaleY(${baseHeight / 100})`,
                          transformOrigin: '50% 100%',
                          backgroundColor: barColor.hex,
                        }}
                        title={barColor.name}
                        className="flex-1 h-full rounded-t-sm transition-transform duration-500 ease-out"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
});
