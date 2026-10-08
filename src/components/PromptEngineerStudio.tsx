import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  Code2, 
  Zap,
  Wand2
} from 'lucide-react';
import { PRACTICAL_AI_WORKFLOW_STEPS } from '../data/productionChecklistData';
import { MagneticButton } from './MagneticButton';
import { cyberSound } from '../utils/cyberSound';

export const PromptEngineerStudio: React.FC = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(1);
  
  // Prompt Generator State
  const [appType, setAppType] = useState('SaaS Multi-Tenant Dashboard');
  const [dbChoice, setDbChoice] = useState('PostgreSQL + Prisma / Drizzle');
  const [authChoice, setAuthChoice] = useState('OAuth + HttpOnly Secure Cookies');
  const [cacheChoice, setCacheChoice] = useState('Redis Cache + Cloudflare CDN');
  const [generatedPromptCopied, setGeneratedPromptCopied] = useState(false);

  const betterPromptText = `Design a production architecture for this application. Start with assumptions and missing requirements. Then define the system architecture, data model, API contracts, authentication, authorization, security controls, caching, rate limiting, storage, testing, observability, deployment and rollback. Implement in small reviewed steps.`;

  const handleCopyBetterPrompt = () => {
    cyberSound.playClick();
    navigator.clipboard.writeText(betterPromptText);
    setCopiedPrompt(true);
    cyberSound.playSuccess();
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const dynamicGeneratedPrompt = `I am building a production-ready ${appType}.

Follow the BrainPlexus 20-Point Production Engineering Standard:

1. ARCHITECTURE & USER FLOWS:
   - Identify critical user journeys, persistent vs transient states, and failure points.
   - Separate code into: Route → Controller → Service → Data Access → Database.

2. DATA & PERSISTENCE:
   - Database: ${dbChoice}.
   - Define exact schemas, foreign keys, compound indexes, and reversible migrations.

3. AUTHENTICATION & ACCESS CONTROL:
   - Strategy: ${authChoice}.
   - Strictly separate Authentication ("Who are you?") from Authorization ("What are you allowed to do?").
   - Backend RBAC/ABAC enforcement on every single mutation endpoint.

4. PERFORMANCE & EDGE:
   - ${cacheChoice}.
   - Explicit cache key formats, TTLs, invalidation triggers, and rate limiting (HTTP 429).

5. RESILIENCE, OBSERVABILITY & CI/CD:
   - Defensive error handling (no stack trace leakage, standardized JSON error envelopes).
   - Automated testing suite (Unit, API integration, and E2E smoke tests).
   - Structured JSON logging with request correlation IDs and health check routes.

DO NOT generate the entire codebase at once. First output the architecture assumptions and data models. Await my review before generating subsequent layers.`;

  const handleCopyDynamicPrompt = () => {
    cyberSound.playClick();
    navigator.clipboard.writeText(dynamicGeneratedPrompt);
    setGeneratedPromptCopied(true);
    cyberSound.playSuccess();
    setTimeout(() => setGeneratedPromptCopied(false), 2500);
  };

  return (
    <section id="prompt-studio" className="py-12 relative">
      <div className="rounded-2xl bg-gradient-to-b from-[#0e072b] to-[#070318] border border-fuchsia-500/40 p-5 sm:p-8 shadow-[0_0_45px_rgba(217,70,239,0.18)] relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(217,70,239,0.09)_0%,transparent_70%)] pointer-events-none blur-3xl" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-purple-900/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/40 text-[10px] font-mono text-fuchsia-300 mb-2">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
              <span>PAGE 08 &bull; SECTION 19</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-tech text-white uppercase tracking-wider flex items-center gap-2">
              <span>HOW TO PROMPT AI LIKE AN ENGINEER</span>
              <span className="text-fuchsia-400 font-mono">_</span>
            </h2>
            <p className="text-xs font-mono text-purple-300 mt-1">
              Stop generating fragile prototypes. Command AI with senior engineering specifications and phased contracts.
            </p>
          </div>
        </div>

        {/* Weak vs Better Prompt Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          
          {/* Weak Prompt Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-red-950/20 border border-red-500/40 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-red-400 font-mono text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>WEAK PROMPT (AMATEUR)</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-red-950/80 text-[10px] text-red-300">
                  HIGH FAILURE RATE
                </span>
              </div>
              <div className="p-4 rounded-lg bg-black/60 border border-red-900/50 font-mono text-sm text-red-200 italic mb-4">
                &ldquo;Build me a production website.&rdquo;
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p className="text-red-300 font-bold">// Why this fails in production:</p>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                  <li>AI hallucinates assumptions without asking for critical constraints</li>
                  <li>Generates UI and mocks data instead of persistent database contracts</li>
                  <li>Omits authentication boundaries, rate limiting, and defensive timeouts</li>
                  <li>Spits out an unmaintainable monolithic single-file block of code</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-red-900/40 text-[11px] font-mono text-red-400">
              Outcome: Looks pretty for 2 minutes, breaks instantly under real user traffic.
            </div>
          </div>

          {/* Better Prompt Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-emerald-400 font-mono text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BETTER PROMPT (SENIOR ENGINEER)</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[10px] text-emerald-300 font-bold">
                  RECOMMENDED
                </span>
              </div>
              <div className="p-4 rounded-lg bg-black/70 border border-emerald-800/60 font-mono text-xs text-emerald-200 leading-relaxed mb-4 relative group">
                &ldquo;{betterPromptText}&rdquo;
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                <p className="text-emerald-300 font-bold">// Why this guarantees success:</p>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                  <li>Forces AI to document assumptions before generating single lines of code</li>
                  <li>Demands explicit layering: API contracts, authentication, database migrations</li>
                  <li>Enforces small, independently reviewable steps (avoiding context token exhaustion)</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-emerald-900/40 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400">Exact formula from BrainPlexus Guide</span>
              <button
                onClick={handleCopyBetterPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/60 text-emerald-200 text-xs font-mono transition-all cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-300" />
                    <span>COPY PROMPT</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* 10-Step Practical AI Workflow (Page 8) */}
        <div className="mb-10 p-5 sm:p-7 rounded-xl bg-[#09041a] border border-purple-900/60 shadow-inner">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm sm:text-base font-bold font-tech text-white uppercase tracking-wider">
                A PRACTICAL AI WORKFLOW &bull; 10 SEQUENTIAL STEPS
              </h3>
            </div>
            <span className="text-[11px] font-mono text-purple-400 hidden sm:inline">
              EXECUTE IN ORDER
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PRACTICAL_AI_WORKFLOW_STEPS.map((s) => {
              const isSelected = selectedWorkflowStep === s.step;
              return (
                <motion.div
                  key={s.step}
                  whileHover={{ scale: 1.03, y: -2 }}
                  onClick={() => {
                    cyberSound.playClick();
                    setSelectedWorkflowStep(s.step);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/90 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                      : 'bg-[#060212]/80 border-purple-950 hover:border-purple-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className={`font-bold ${isSelected ? 'text-fuchsia-300' : 'text-slate-400'}`}>
                      STEP {s.step < 10 ? `0${s.step}` : s.step}
                    </span>
                    {isSelected && <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                  </div>
                  <p className="text-xs font-mono text-slate-300 leading-snug">
                    {s.action}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Interactive Production Prompt Generator Wizard */}
        <div className="p-5 sm:p-7 rounded-xl bg-gradient-to-r from-[#0d0728] to-[#070318] border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold font-tech text-white uppercase tracking-wider">
              INTERACTIVE PRODUCTION PROMPT GENERATOR
            </h3>
          </div>
          <p className="text-xs font-mono text-slate-300 mb-6">
            Configure your application specifications below to generate a production-ready engineering prompt tailored to your project.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-xs font-mono">
            {/* App Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400">APPLICATION TYPE</label>
              <select
                value={appType}
                onChange={(e) => setAppType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#070215] border border-purple-700/60 text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="SaaS Multi-Tenant Dashboard">SaaS Multi-Tenant Dashboard</option>
                <option value="E-Commerce & Checkout Engine">E-Commerce &amp; Checkout Engine</option>
                <option value="Real-Time Algorithmic Trading Platform">Real-Time Algorithmic Trading Platform</option>
                <option value="AI Autonomous Agent Workflow Suite">AI Autonomous Agent Workflow Suite</option>
                <option value="Collaborative Cloud Canvas / Tool">Collaborative Cloud Canvas / Tool</option>
              </select>
            </div>

            {/* DB Choice */}
            <div className="space-y-1.5">
              <label className="text-slate-400">DATABASE &amp; ORM</label>
              <select
                value={dbChoice}
                onChange={(e) => setDbChoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#070215] border border-purple-700/60 text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="PostgreSQL + Prisma / Drizzle ORM">PostgreSQL + Prisma / Drizzle</option>
                <option value="Cloud SQL + PostgreSQL + Migrations">Cloud SQL + PostgreSQL</option>
                <option value="Supabase / Firebase Firestore + Rules">Supabase / Firestore + Rules</option>
                <option value="MySQL 8.0 + ACID Transactions">MySQL 8.0 + ACID Transactions</option>
              </select>
            </div>

            {/* Auth Strategy */}
            <div className="space-y-1.5">
              <label className="text-slate-400">AUTH &amp; PERMISSIONS</label>
              <select
                value={authChoice}
                onChange={(e) => setAuthChoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#070215] border border-purple-700/60 text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="OAuth 2.0 + HttpOnly Secure Cookies + RBAC">OAuth 2.0 + Secure Cookies + RBAC</option>
                <option value="Argon2id Passwords + JWT Session Lifetimes">Argon2id + JWT Lifetimes</option>
                <option value="Firebase Authentication + Role Custom Claims">Firebase Auth + Custom Claims</option>
                <option value="Multi-Factor Auth (MFA) + Brute Force Protection">MFA + Brute Force Shield</option>
              </select>
            </div>

            {/* Caching / Edge */}
            <div className="space-y-1.5">
              <label className="text-slate-400">CACHE &amp; RATE LIMITING</label>
              <select
                value={cacheChoice}
                onChange={(e) => setCacheChoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#070215] border border-purple-700/60 text-cyan-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="Redis In-Memory Cache + Cloudflare Edge CDN">Redis Cache + Cloudflare CDN</option>
                <option value="Upstash Serverless Redis + Sliding Window Limits">Upstash Redis + Sliding Window</option>
                <option value="Fastly Edge Caching + Token Bucket Throttling">Fastly CDN + Token Bucket</option>
              </select>
            </div>
          </div>

          {/* Generated Output Preview */}
          <div className="p-4 rounded-xl bg-black/80 border border-cyan-800/50 font-mono text-xs text-slate-300 space-y-2 relative overflow-x-auto max-h-56">
            <pre className="whitespace-pre-wrap">{dynamicGeneratedPrompt}</pre>
          </div>

          <div className="mt-4 flex justify-end">
            <MagneticButton
              onClick={handleCopyDynamicPrompt}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              {generatedPromptCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>COPIED PRODUCTION PROMPT!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>COPY CUSTOM ENGINEERING PROMPT</span>
                </>
              )}
            </MagneticButton>
          </div>
        </div>

      </div>
    </section>
  );
};
