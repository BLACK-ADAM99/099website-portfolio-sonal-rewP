import React from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Sparkles,
  Layers,
  Code2,
  Database,
  ShieldCheck,
  Terminal,
  Globe,
  Zap,
  GitBranch,
  Activity,
  Box,
  Cloud,
  Gauge,
  Binary,
  Radio,
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

interface ArsenalCoreItem {
  id: string;
  code: string;
  title: string;
  domain: 'AI & NEURAL' | 'FRONTEND & 3D' | 'BACKEND & CLOUD' | 'SECURITY & EDGE';
  mastery: number;
  latencyMs: number;
  stack: string[];
  summary: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  colorIndex: number;
}

const ARSENAL_16_CORES: ArsenalCoreItem[] = [
  {
    id: 'core-01',
    code: 'CORE_01',
    title: 'WebGL2 & 4K Shader Pipelines',
    domain: 'FRONTEND & 3D',
    mastery: 99,
    latencyMs: 1.4,
    stack: ['WebGL2', 'GLSL', 'Texture Atlas', '60FPS Lock'],
    summary: 'Hardware-accelerated 4K texture-atlas frame buffering and custom GLSL fragment shaders.',
    icon: Box,
    colorIndex: 0, // Electric Cyan (#06b6d4)
  },
  {
    id: 'core-02',
    code: 'CORE_02',
    title: 'Autonomous LLM Agent Systems',
    domain: 'AI & NEURAL',
    mastery: 98,
    latencyMs: 12.5,
    stack: ['Gemini SDK', 'RAG', 'Function Calling', 'Tool Use'],
    summary: 'Multi-step reasoning agents with structured JSON schemas and deterministic tool execution.',
    icon: Sparkles,
    colorIndex: 1, // Neon Fuchsia (#d946ef)
  },
  {
    id: 'core-03',
    code: 'CORE_03',
    title: 'React 19 & Concurrent UI',
    domain: 'FRONTEND & 3D',
    mastery: 99,
    latencyMs: 0.8,
    stack: ['React 19', 'TypeScript', 'Suspense', 'Framer Motion'],
    summary: 'Zero-jank concurrent component architectures with spring-physics 3D micro-interactions.',
    icon: Code2,
    colorIndex: 2, // Quantum Violet (#8b5cf6)
  },
  {
    id: 'core-04',
    code: 'CORE_04',
    title: 'High-Throughput Node & Bun APIs',
    domain: 'BACKEND & CLOUD',
    mastery: 97,
    latencyMs: 3.2,
    stack: ['Node.js', 'Express', 'WebSockets', 'Worker Threads'],
    summary: 'Low-latency event-driven backend gateways engineered for 50k+ concurrent connections.',
    icon: Terminal,
    colorIndex: 3, // Cyber Emerald (#10b981)
  },
  {
    id: 'core-05',
    code: 'CORE_05',
    title: 'Vector Embeddings & Semantic Search',
    domain: 'AI & NEURAL',
    mastery: 96,
    latencyMs: 8.4,
    stack: ['pgvector', 'HNSW Index', 'Hybrid Search', 'Reranking'],
    summary: 'Sub-10ms dense + sparse hybrid semantic retrieval across millions of neural embeddings.',
    icon: Binary,
    colorIndex: 4, // Solar Amber (#f59e0b)
  },
  {
    id: 'core-06',
    code: 'CORE_06',
    title: 'Zero-Trust Auth & RBAC Security',
    domain: 'SECURITY & EDGE',
    mastery: 98,
    latencyMs: 1.9,
    stack: ['OAuth 2.1', 'JWT / JWK', 'Zod Guard', 'CSP / CORS'],
    summary: 'Strict authentication vs. authorization separation with cryptographic token verification.',
    icon: ShieldCheck,
    colorIndex: 5, // Crimson Laser (#f43f5e)
  },
  {
    id: 'core-07',
    code: 'CORE_07',
    title: 'Distributed PostgreSQL & Drizzle',
    domain: 'BACKEND & CLOUD',
    mastery: 97,
    latencyMs: 2.6,
    stack: ['PostgreSQL', 'Drizzle ORM', 'Read Replicas', 'ACID'],
    summary: 'Type-safe relational schemas with compound indexing and zero-downtime migrations.',
    icon: Database,
    colorIndex: 6, // Cobalt Sapphire (#3b82f6)
  },
  {
    id: 'core-08',
    code: 'CORE_08',
    title: '120Hz GPU Physics & Lenis Scroll',
    domain: 'FRONTEND & 3D',
    mastery: 99,
    latencyMs: 0.6,
    stack: ['Lenis Smooth', 'Transform3D', 'IntersectionObserver', 'RAF'],
    summary: 'Sub-pixel momentum scroll synchronization locked 1:1 with 4K video timelines.',
    icon: Gauge,
    colorIndex: 7, // Acid Lime (#84cc16)
  },
  {
    id: 'core-09',
    code: 'CORE_09',
    title: 'Real-Time Streaming & WebRTC',
    domain: 'BACKEND & CLOUD',
    mastery: 95,
    latencyMs: 4.1,
    stack: ['SSE Streams', 'WebSockets', 'WebRTC', 'Pub/Sub'],
    summary: 'Bi-directional token streaming and collaborative state synchronization with auto-reconnect.',
    icon: Radio,
    colorIndex: 8, // Plasma Orange (#f97316)
  },
  {
    id: 'core-10',
    code: 'CORE_10',
    title: 'Global Edge CDN & Redis Caching',
    domain: 'SECURITY & EDGE',
    mastery: 98,
    latencyMs: 1.1,
    stack: ['Cloudflare Edge', 'Redis Cluster', 'Stale-While-Revalidate', 'TTL'],
    summary: 'Multi-tier edge caching with instant cache-tag purge and stampede protection.',
    icon: Globe,
    colorIndex: 9, // Bioluminescent Teal (#14b8a6)
  },
  {
    id: 'core-11',
    code: 'CORE_11',
    title: 'Generative UI & Multimodal Vision',
    domain: 'AI & NEURAL',
    mastery: 97,
    latencyMs: 14.2,
    stack: ['Vision AI', 'Audio Synthesis', 'Dynamic AST', 'Canvas 4K'],
    summary: 'Real-time multimodal image, audio, and interactive UI synthesis directly in the browser.',
    icon: Cpu,
    colorIndex: 10, // Magenta Pulse (#ec4899)
  },
  {
    id: 'core-12',
    code: 'CORE_12',
    title: 'Cloud-Native Docker & CI/CD',
    domain: 'BACKEND & CLOUD',
    mastery: 96,
    latencyMs: 2.3,
    stack: ['Docker', 'Cloud Run', 'GitHub Actions', 'Blue/Green'],
    summary: 'Automated container builds, canary rollouts, and instant zero-downtime rollbacks.',
    icon: Cloud,
    colorIndex: 11, // Indigo Starlight (#6366f1)
  },
  {
    id: 'core-13',
    code: 'CORE_13',
    title: 'Design Systems & Tailwind v4',
    domain: 'FRONTEND & 3D',
    mastery: 99,
    latencyMs: 0.5,
    stack: ['Tailwind v4', 'CSS Variables', 'WCAG AAA', 'Bento Grids'],
    summary: 'Bespoke cyber-glass design tokens with 16-color harmonic palettes and responsive fluid grids.',
    icon: Layers,
    colorIndex: 12, // Supernova Gold (#eab308)
  },
  {
    id: 'core-14',
    code: 'CORE_14',
    title: 'OpenTelemetry & Live Observability',
    domain: 'SECURITY & EDGE',
    mastery: 96,
    latencyMs: 1.5,
    stack: ['OpenTelemetry', 'Structured Logs', 'Trace IDs', 'SLO Alerts'],
    summary: 'End-to-end distributed request tracing, P99 latency histograms, and anomaly detection.',
    icon: Activity,
    colorIndex: 13, // Arctic Sky (#0ea5e9)
  },
  {
    id: 'core-15',
    code: 'CORE_15',
    title: 'Prompt Engineering & Eval Harnesses',
    domain: 'AI & NEURAL',
    mastery: 99,
    latencyMs: 6.8,
    stack: ['System Prompts', 'Few-Shot AST', 'Deterministic Eval', 'Guardrails'],
    summary: 'Production-grade prompt contracts with automated regression benchmarks and hallucination guards.',
    icon: Zap,
    colorIndex: 14, // Ultraviolet Core (#a855f7)
  },
  {
    id: 'core-16',
    code: 'CORE_16',
    title: 'Rate Limiting & DDoS Resilience',
    domain: 'SECURITY & EDGE',
    mastery: 97,
    latencyMs: 0.9,
    stack: ['Token Bucket', 'Sliding Window', 'WAF Rules', 'Circuit Breaker'],
    summary: 'Adaptive edge rate limiting, graceful degradation, and automated circuit-breaker recovery.',
    icon: GitBranch,
    colorIndex: 15, // Scarlet Ruby (#ef4444)
  },
];

export const CyberChromaticArsenal: React.FC = React.memo(() => {
  return (
    <motion.section
      id="arsenal"
      initial={SECTION_REVEAL.initial}
      whileInView={SECTION_REVEAL.whileInView}
      viewport={SECTION_REVEAL.viewport}
      transition={SECTION_REVEAL.transition}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative perspective-[1200px]"
    >
      {/* Ambient 16-Color Chromatic Aura (Zero-Blur GPU Radial Gradient) */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12)_0%,rgba(217,70,239,0.08)_45%,transparent_75%)] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={HEADER_ARRIVAL.initial}
        whileInView={HEADER_ARRIVAL.whileInView}
        viewport={{ once: true, amount: 0.2 }}
        transition={HEADER_ARRIVAL.transition}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090418]/90 border border-cyan-400/40 text-[10px] font-mono tracking-widest uppercase text-cyan-300 mb-4 shadow-[0_0_24px_rgba(6,182,212,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-spin-slow" />
          <span>28-COLOR HYPER-REALISTIC SPECTRUM // 16 NEURAL CORES</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold font-cyber-wide tracking-wider uppercase text-white mb-3 hero-shadow-aura-title-white">
          <CyberTextReveal
            text="CHROMATIC TECH ARSENAL"
            mode="chars"
            effect="elasticPop"
            staggerDelay={0.025}
          />
        </h2>

        <p className="text-slate-200 text-sm sm:text-base font-editorial italic leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          Engineered with <span className="text-cyan-300 font-semibold">28 distinct chromatic frequency channels</span> and multi-axis 3D spring arrival physics.
        </p>
      </motion.div>

      {/* 16-Card Ultra-Level 3D Arrival Grid with Dual-Chromatic 28-Color Pairing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ARSENAL_16_CORES.map((item, idx) => {
            const color = CHROMATIC_16_PALETTE[item.colorIndex % CHROMATIC_16_PALETTE.length];
            const accentColor = CHROMATIC_16_PALETTE[(item.colorIndex + 12) % CHROMATIC_16_PALETTE.length];
            const arrival = getUltraLevelArrival(idx, 0.045);
            const IconComponent = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={arrival.initial}
                whileInView={arrival.whileInView}
                viewport={{ once: true, amount: 0.1 }}
                transition={arrival.transition}
                className="h-full"
              >
                <CyberTiltCard
                  tiltMax={8}
                  glowColor={`rgba(${color.rgb}, 0.24)`}
                  className="h-full rounded-2xl bg-transparent"
                >
                  <div
                    onMouseEnter={() => cyberSound.playHover()}
                    style={{
                      background: `linear-gradient(145deg, rgba(7, 11, 20, 0.24) 0%, rgba(${color.rgb}, 0.07) 55%, rgba(7, 11, 20, 0.28) 100%)`,
                      borderColor: `rgba(${color.rgb}, 0.45)`,
                      boxShadow: `0 10px 30px -12px rgba(${color.rgb}, 0.24), inset 0 1px 0 0 rgba(${accentColor.rgb}, 0.22)`,
                    }}
                    className="h-full p-5 rounded-2xl bg-[#070b14]/25 hover:bg-[#070b14]/38 border backdrop-blur-[4px] flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
                  >
                    {/* Top Dual-Chromatic Energy Bar */}
                    <div
                      style={{
                        background: `linear-gradient(90deg, transparent, ${color.hex}, ${accentColor.hex}, transparent)`,
                      }}
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-85 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Ambient Corner Glow Orb */}
                    <div
                      style={{
                        background: `radial-gradient(circle, rgba(${accentColor.rgb}, 0.16) 0%, transparent 70%)`,
                      }}
                      className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-500"
                    />

                    <div className="bg-transparent relative z-10">
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              backgroundColor: `rgba(${color.rgb}, 0.14)`,
                              borderColor: `rgba(${color.rgb}, 0.55)`,
                              boxShadow: `0 0 18px rgba(${color.rgb}, 0.32)`,
                            }}
                            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                          >
                            <IconComponent
                              className="w-4 h-4"
                              style={{ color: color.hex }}
                            />
                          </div>
                          <div>
                            <div className="text-[10px] font-mono font-bold tracking-widest text-slate-300">
                              {item.code}
                            </div>
                            <div
                              style={{ color: color.hex }}
                              className="text-[9px] font-mono font-semibold uppercase tracking-wider"
                            >
                              {color.name}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            borderColor: `rgba(${accentColor.rgb}, 0.5)`,
                            backgroundColor: `rgba(${accentColor.rgb}, 0.12)`,
                            color: accentColor.hex,
                          }}
                          className="px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold"
                        >
                          <CyberCountUp value={item.mastery} suffix="%" durationMs={1300} />
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <h3 className="text-base font-bold font-tech text-white tracking-wide mb-1.5 group-hover:text-cyan-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-200/95 leading-relaxed mb-4 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                        {item.summary}
                      </p>
                    </div>

                    <div className="bg-transparent relative z-10">
                      {/* Animated Dual-Chromatic Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mb-1">
                          <span>EXECUTION LATENCY</span>
                          <span style={{ color: color.hex }} className="font-bold">
                            <CyberCountUp
                              value={item.latencyMs}
                              decimals={1}
                              suffix="ms"
                              durationMs={1200}
                            />
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-950/45 overflow-hidden p-[1px]">
                          <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: item.mastery / 100 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.0, delay: 0.08 + idx * 0.025, ease: 'easeOut' }}
                            style={{
                              transformOrigin: '0% 50%',
                              background: `linear-gradient(90deg, ${color.hex}, ${accentColor.hex})`,
                              boxShadow: `0 0 12px ${color.hex}`,
                            }}
                            className="w-full h-full rounded-full"
                          />
                        </div>
                      </div>

                      {/* Stack Badges with Multi-Color Accents */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                        {item.stack.map((tag, tIdx) => {
                          const tagColor = CHROMATIC_16_PALETTE[(item.colorIndex + tIdx * 5) % CHROMATIC_16_PALETTE.length];
                          return (
                            <span
                              key={tag}
                              style={{
                                borderColor: `rgba(${tagColor.rgb}, 0.4)`,
                                color: tagColor.hex,
                              }}
                              className="px-2 py-0.5 rounded bg-[#050811]/35 border text-[10px] font-mono"
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CyberTiltCard>
              </motion.div>
            );
          })}
      </div>
    </motion.section>
  );
});
