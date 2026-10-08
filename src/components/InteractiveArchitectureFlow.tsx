import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Globe, 
  Layout, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Cloud, 
  ArrowRight, 
  Layers, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Sparkles,
  Zap
} from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';

interface FlowNode {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  responsibilities: string[];
  failureModes: string[];
  productionRules: string[];
  gradient: string;
}

export const InteractiveArchitectureFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'backend' | 'cicd'>('system');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('api');

  const systemNodes: FlowNode[] = [
    {
      id: 'user',
      name: 'User / Client',
      category: 'Client Device',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      responsibilities: [
        'Initiates HTTP/WebSocket requests from browsers or mobile apps',
        'Executes client-side UI rendering and local validation',
        'Maintains user session cookies / access tokens',
      ],
      failureModes: [
        'Network dropouts, flaky mobile connections, slow cellular latency',
        'Stale cached frontend code after new deployments',
      ],
      productionRules: [
        'Client-side validation improves UX, but is NEVER the security boundary',
        'Provide clear offline, retry, and connection failure states',
      ],
    },
    {
      id: 'cdn',
      name: 'CDN / Edge LB',
      category: 'Network Edge',
      icon: Globe,
      gradient: 'from-cyan-500 to-teal-500',
      responsibilities: [
        'Geographically distributed edge caching of static assets (JS, CSS, Media)',
        'SSL/TLS termination and DDoS mitigation',
        'Global load balancing across backend server clusters',
      ],
      failureModes: [
        'Serving stale cached assets after sudden critical bug fixes',
        'Origin server overwhelm on simultaneous cache misses (cache stampede)',
      ],
      productionRules: [
        'A CDN does NOT replace backend scaling or database optimization',
        'Configure immutable Cache-Control with hashed filenames and instant purge APIs',
      ],
    },
    {
      id: 'frontend',
      name: 'Frontend App',
      category: 'Presentation Layer',
      icon: Layout,
      gradient: 'from-teal-500 to-emerald-500',
      responsibilities: [
        'Responsive layout across mobile, tablet, and desktop',
        'Semantic HTML, keyboard navigation, and high-contrast accessibility',
        'Explicit Loading, Empty, and Error state rendering',
      ],
      failureModes: [
        'JavaScript runtime exceptions crashing entire user viewports',
        'Bloated bundle sizes causing 5s+ Time to Interactive on low-end devices',
      ],
      productionRules: [
        'Implement Global React Error Boundaries with recovery buttons',
        'Optimize code splitting and tree-shake unused dependencies',
      ],
    },
    {
      id: 'api',
      name: 'API Gateway',
      category: 'API Boundary',
      icon: Terminal,
      gradient: 'from-fuchsia-500 to-pink-500',
      responsibilities: [
        'Input schema validation (e.g. Zod / Pydantic) on every incoming body/query',
        'IP & client token rate limiting (HTTP 429)',
        'CORS policy enforcement and request correlation ID generation',
      ],
      failureModes: [
        'Unvalidated payloads injecting malicious inputs or crashing handlers',
        'Spikes in brute-force traffic overwhelming downstream microservices',
      ],
      productionRules: [
        'A generated API is only a starting point. Define contracts: request shape, response shape, error format',
        'Standardize HTTP status codes and never expose internal error stack traces',
      ],
    },
    {
      id: 'auth',
      name: 'Authentication',
      category: 'Identity & Access',
      icon: ShieldCheck,
      gradient: 'from-purple-500 to-violet-500',
      responsibilities: [
        'Authentication: "Who are you?" (Password hashing, JWTs, OAuth, Sessions)',
        'Authorization: "What are you allowed to do?" (RBAC / ABAC permission checks)',
        'Token expiration, refresh mechanics, and logout invalidation',
      ],
      failureModes: [
        'Frontend hidden buttons being called directly via unauthorized curl/API requests',
        'Weak hashing exposing customer credentials during database breach',
      ],
      productionRules: [
        'Hiding an admin button in the frontend is not authorization. The backend must enforce permissions on every protected operation',
        'Use Argon2id / bcrypt and store sessions in HttpOnly, Secure, SameSite cookies',
      ],
    },
    {
      id: 'business',
      name: 'Business Logic',
      category: 'Core Service',
      icon: Cpu,
      gradient: 'from-violet-500 to-indigo-500',
      responsibilities: [
        'Executes application business domain rules and business workflows',
        'Coordinates database reads/writes and transaction lifecycles',
        'Dispatches asynchronous background jobs to workers',
      ],
      failureModes: [
        'Long-running operations blocking the HTTP event loop',
        'Non-idempotent operations double-charging customers or duplicating orders',
      ],
      productionRules: [
        'Separate into clean layers: Route → Controller → Service → Data Access',
        'Offload slow operations (emails, PDFs, video encoding) to async queues',
      ],
    },
    {
      id: 'data',
      name: 'DB / Cache / Storage',
      category: 'Persistence Tier',
      icon: Database,
      gradient: 'from-amber-500 to-orange-500',
      responsibilities: [
        'PostgreSQL / MySQL relational persistence with strict ACID transactions',
        'Redis in-memory caching with explicit TTL and invalidation triggers',
        'Object storage (S3 / GCS) for user-uploaded media and documents',
      ],
      failureModes: [
        'Missing database indexes causing full table scans and connection pool starvation',
        'Database migration failures locking tables in production',
      ],
      productionRules: [
        'Review schema, indexes, constraints, transactions, migrations, and backups',
        'Never put production secrets into Git; automate daily backup restoration drills',
      ],
    },
    {
      id: 'external',
      name: 'External Services',
      category: 'Third-Party APIs',
      icon: Cloud,
      gradient: 'from-rose-500 to-red-500',
      responsibilities: [
        'Payment gateways (Stripe, PayPal)',
        'Transactional emails (Resend, SendGrid)',
        'AI LLM APIs (Gemini, Claude, OpenAI) & Webhooks',
      ],
      failureModes: [
        'Third-party API downtime hanging user requests indefinitely',
        'Rate limit exhaustion on external API keys',
      ],
      productionRules: [
        'Enforce strict HTTP timeouts (e.g. 5000ms) on every external network call',
        'Design graceful degradation: cache fallback, circuit breakers, and queue retries',
      ],
    },
  ];

  const backendLayers = [
    {
      step: '01',
      layer: 'Route',
      description: 'Matches the HTTP endpoint, path parameters, and HTTP method (GET, POST, PUT, DELETE).',
      example: 'app.post("/api/v1/orders", authenticate, orderController.createOrder);',
    },
    {
      step: '02',
      layer: 'Controller',
      description: 'Parses input, validates request body against schema, and formats the HTTP response.',
      example: 'const validated = OrderSchema.parse(req.body); return res.status(201).json(result);',
    },
    {
      step: '03',
      layer: 'Service',
      description: 'Pure business logic: calculation, discounts, order fulfillment, stock checks, and events.',
      example: 'async function processOrder(customerId, items) { /* calculates tax, verifies stock */ }',
    },
    {
      step: '04',
      layer: 'Data Access',
      description: 'Repository / ORM layer handling SQL queries, transaction locks, and schema mappings.',
      example: 'await db.transaction(async (tx) => { await tx.insert(orders).values(...); });',
    },
    {
      step: '05',
      layer: 'Database',
      description: 'PostgreSQL / Cloud SQL relational instance with indexes, foreign keys, and WAL backups.',
      example: 'CREATE INDEX idx_orders_customer_id ON orders(customer_id, created_at DESC);',
    },
  ];

  const cicdPipelineSteps = [
    { step: '01', title: 'Git Push', desc: 'Developer commits code to feature branch or PR.', icon: GitBranch },
    { step: '02', title: 'Lint & Typecheck', desc: 'Validates ESLint, Prettier, and TypeScript types.', icon: Terminal },
    { step: '03', title: 'Automated Tests', desc: 'Executes Unit, Integration, and Contract test suites.', icon: CheckCircle2 },
    { step: '04', title: 'Docker Build', desc: 'Builds immutable container image with tagged SHA.', icon: Layers },
    { step: '05', title: 'Security Checks', desc: 'Scans dependencies (npm audit, Snyk) & checks secret leaks.', icon: ShieldCheck },
    { step: '06', title: 'Staging Deploy', desc: 'Deploys to identical staging environment for smoke tests.', icon: Globe },
    { step: '07', title: 'Promotion to Prod', desc: 'Zero-downtime rolling update with automated rollback ready.', icon: Zap },
  ];

  const activeNode = systemNodes.find((n) => n.id === selectedNodeId) || systemNodes[3];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#0c0828] to-[#08041c] border border-purple-500/30 p-5 sm:p-8 shadow-[0_0_40px_rgba(147,51,234,0.15)] relative overflow-hidden">
      
      {/* Background Neon Grid Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,70,239,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      {/* Header and View Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-purple-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[10px] font-mono text-cyan-300 mb-2">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
            <span>INTERACTIVE ARCHITECTURE VISUALIZER</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-tech text-white uppercase tracking-wider">
            Production Engineering System Blueprints
          </h3>
          <p className="text-xs font-mono text-purple-300">
            Interactive blueprints mapping typical production flows, backend layering, and CI/CD pipelines
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-xl bg-[#050212] border border-purple-800/60 text-xs font-mono self-start lg:self-auto">
          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveTab('system');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-fuchsia-600/40 text-white font-bold border border-fuchsia-500/70 shadow-[0_0_12px_rgba(217,70,239,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveTab('backend');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'backend'
                ? 'bg-fuchsia-600/40 text-white font-bold border border-fuchsia-500/70 shadow-[0_0_12px_rgba(217,70,239,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Backend Layering
          </button>
          <button
            onClick={() => {
              cyberSound.playClick();
              setActiveTab('cicd');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cicd'
                ? 'bg-fuchsia-600/40 text-white font-bold border border-fuchsia-500/70 shadow-[0_0_12px_rgba(217,70,239,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CI/CD Pipeline
          </button>
        </div>
      </div>

      {/* Tab 1: System Flow Interactive Diagram */}
      {activeTab === 'system' && (
        <div className="pt-6 space-y-6">
          <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="text-purple-400">// CLICK ANY COMPONENT NODE TO INSPECT RESPONSIBILITIES &amp; FAILURE PATHS:</span>
            <span className="text-[10px] text-cyan-400 hidden sm:inline">PDF PAGE 02 &bull; 01 SYSTEM ARCHITECTURE</span>
          </div>

          {/* Horizontal scrollable pipeline nodes */}
          <div className="overflow-x-auto pb-3 no-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 min-w-[760px] py-2">
              {systemNodes.map((node, i) => {
                const Icon = node.icon;
                const isSelected = node.id === selectedNodeId;

                return (
                  <React.Fragment key={node.id}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        cyberSound.playClick();
                        setSelectedNodeId(node.id);
                      }}
                      onMouseEnter={() => cyberSound.playHover()}
                      className={`relative flex-1 min-w-[95px] p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-950/90 to-fuchsia-950/80 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.5)]'
                          : 'bg-[#0b0520]/80 border-purple-900/60 hover:border-purple-500/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${node.gradient} flex items-center justify-center text-white shadow-sm`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[9px] font-mono text-purple-400">0{i + 1}</span>
                      </div>
                      <div className="text-xs font-bold font-tech text-white uppercase tracking-wide truncate">
                        {node.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        {node.category}
                      </div>

                      {isSelected && (
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-fuchsia-500 rotate-45" />
                      )}
                    </motion.button>

                    {i < systemNodes.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-purple-500/60 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node Deep-Dive Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-5 sm:p-6 rounded-xl bg-[#09031c] border border-fuchsia-500/40 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {/* Col 1: Responsibilities */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Key Responsibilities</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  {activeNode.responsibilities.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">&bull;</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Failure Modes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Failure Modes &amp; Risks</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  {activeNode.failureModes.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Production Engineering Rules */}
              <div className="space-y-3 md:border-l md:border-purple-900/50 md:pl-5">
                <div className="flex items-center gap-2 text-xs font-mono text-fuchsia-300 font-bold uppercase">
                  <ShieldCheck className="w-4 h-4 text-fuchsia-400" />
                  <span>Engineering Hardening</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300 font-mono">
                  {activeNode.productionRules.map((rule, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Tab 2: Backend Layering (Route -> Controller -> Service -> Data Access -> DB) */}
      {activeTab === 'backend' && (
        <div className="pt-6 space-y-5">
          <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="text-fuchsia-400">// PREFERRED 5-LAYER BACKEND ARCHITECTURE (PAGE 02 &bull; 03 BACKEND &amp; API DESIGN):</span>
            <span className="text-[10px] text-cyan-400 font-mono">STRICT SEPARATION OF CONCERNS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {backendLayers.map((b) => (
              <motion.div
                key={b.layer}
                whileHover={{ scale: 1.03, y: -3 }}
                className="p-4 rounded-xl bg-[#09031c] border border-purple-900/70 hover:border-fuchsia-500/60 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-1">
                    <span>STEP {b.step}</span>
                    <Layers className="w-3.5 h-3.5 text-fuchsia-400" />
                  </div>
                  <h4 className="text-sm font-bold font-tech text-white uppercase tracking-wider">
                    {b.layer}
                  </h4>
                  <p className="text-xs text-slate-300 font-light mt-1.5 leading-relaxed">
                    {b.description}
                  </p>
                </div>
                <div className="p-2 rounded bg-black/60 border border-purple-950 text-[10px] font-mono text-cyan-300 overflow-x-auto">
                  <code>{b.example}</code>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-3 text-xs font-mono text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Rule from PDF:</strong> A generated API is only a starting point. Define contracts: request shape, response shape, error format, authorization rules and expected failure behavior.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: CI/CD Pipeline (Page 7) */}
      {activeTab === 'cicd' && (
        <div className="pt-6 space-y-5">
          <div className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="text-cyan-400">// REPEATABLE DEPLOYMENT PIPELINE (PAGE 07 &bull; 16 CI/CD):</span>
            <span className="text-[10px] text-emerald-400 font-mono">AUTOMATED ZERO-DOWNTIME RELEASES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {cicdPipelineSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="p-3.5 rounded-xl bg-[#09031c] border border-cyan-900/40 hover:border-cyan-400/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                      <span>{s.step}</span>
                      <Icon className="w-4 h-4 text-cyan-300" />
                    </div>
                    <h5 className="text-xs font-bold font-tech text-white uppercase mb-1">
                      {s.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {s.desc}
                    </p>
                  </div>
                  {idx < cicdPipelineSteps.length - 1 && (
                    <div className="hidden lg:block pt-3 text-center text-cyan-500 font-mono text-xs">
                      ↓
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-center gap-3 text-xs font-mono text-cyan-200">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Rule from PDF:</strong> A repeatable pipeline reduces manual deployment mistakes. Include rollback or redeployment procedures. Production should not depend on a developer laptop.
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
