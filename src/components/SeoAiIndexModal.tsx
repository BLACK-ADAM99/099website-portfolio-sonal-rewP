import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Globe,
  FileCode2,
  Bot,
  CheckCircle2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Layers,
  Cpu,
} from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';

interface SeoAiIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SeoDocumentItem {
  id: string;
  filename: string;
  path: string;
  badge: string;
  targetEngines: string;
  purposeEn: string;
  purposeBn: string;
  previewSnippet: string;
}

const SEO_DOCUMENTS: SeoDocumentItem[] = [
  {
    id: 'llms-txt',
    filename: 'llms.txt',
    path: '/llms.txt',
    badge: 'AI SEARCH PRIMARY',
    targetEngines: 'ChatGPT Search, Perplexity AI, Claude, Gemini, Copilot',
    purposeEn:
      'Official llmstxt.org standard file providing a concise, high-signal summary of Apurba Bera’s identity, skills, flagship projects, and contact channels for LLM answer engines.',
    purposeBn:
      'ChatGPT, Perplexity, Gemini ও Claude-এর মতো AI সার্চ ইঞ্জিন যাতে আপনার নাম, দক্ষতা, প্রজেক্ট এবং যোগাযোগের তথ্য সরাসরি বুঝতে ও টপে দেখাতে পারে তার মূল ডকুমেন্ট।',
    previewSnippet: `# Apurba Bera — AI Engineer, Full-Stack Developer, Forex Trader & Vive Coder
> Official portfolio of Apurba Bera ("The Architect of the Void"), Class 11 tech prodigy from Kolaghat, Purba Medinipur, West Bengal, India (22° 25' 58" N, 87° 51' 35" E).
- Core: AI Business Enhancers (96%), Full-Stack React 19/Python (94%), Forex MT5 Algo (92%), Vive VR/WebGL (88%)
- Contact: apurbabera45@gmail.com | WhatsApp: +91 7797304622 | Instagram: @alone_gamer1508`,
  },
  {
    id: 'llms-full-txt',
    filename: 'llms-full.txt',
    path: '/llms-full.txt',
    badge: 'DEEP RAG DOSSIER',
    targetEngines: 'SearchGPT RAG, Perplexity Deep Research, Google AI Overviews',
    purposeEn:
      'Unabridged Markdown knowledge base containing full biography, 6 project case studies, 5 engineering services, mastery metrics, and AEO FAQ answers.',
    purposeBn:
      'AI চ্যাটবট এবং ডিপ রিসার্চ ইঞ্জিনের জন্য আপনার সম্পূর্ণ বায়োগ্রাফি, ৬টি প্রজেক্ট, ৫টি সার্ভিস এবং প্রশ্নোত্তর (FAQ) সম্বলিত বিস্তারিত ডকুমেন্ট।',
    previewSnippet: `# Apurba Bera — Comprehensive AI Search & Knowledge Graph Dossier (llms-full.txt)
## 1. Identity & Entity Profile: Apurba Bera | Kolaghat, West Bengal, India
## 2. Executive Biography — Genesis in Kolaghat to Billionaire Ambition
## 3. Core Engineering Services & Mastery Metrics (AI 96%, Full-Stack 94%, Forex 92%)
## 4. Complete Project Portfolio & 5. Frequently Asked Questions (AEO)`,
  },
  {
    id: 'knowledge-graph',
    filename: 'apurba-bera-knowledge-graph.json',
    path: '/apurba-bera-knowledge-graph.json',
    badge: 'ENTITY GRAPH JSON-LD',
    targetEngines: 'Google Knowledge Graph, Schema.org Validators, AI Agents',
    purposeEn:
      'Machine-readable Schema.org @graph linking Person (Apurba Bera), GeoCoordinates (22.4329, 87.8599), EducationalOrganization, and ProfessionalService.',
    purposeBn:
      'Google Knowledge Panel এবং AI এজেন্টদের কাছে আপনাকে একজন ভেরিফায়েড AI Engineer ও Developer হিসেবে প্রতিষ্ঠিত করার জন্য স্ট্রাকচার্ড JSON-LD ফাইল।',
    previewSnippet: `{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "name": "Apurba Bera", "jobTitle": "AI Engineer, Full-Stack Developer & Quantitative Forex Trader", "address": { "addressLocality": "Kolaghat, Purba Medinipur", "addressRegion": "West Bengal", "addressCountry": "IN" } }
  ]
}`,
  },
  {
    id: 'robots-txt',
    filename: 'robots.txt',
    path: '/robots.txt',
    badge: 'CRAWLER GATEWAY',
    targetEngines: 'Googlebot, Bingbot, OAI-SearchBot, GPTBot, PerplexityBot, ClaudeBot',
    purposeEn:
      'Explicitly welcomes both traditional search crawlers and modern AI search bots with direct pointers to sitemap.xml, llms.txt, and llms-full.txt.',
    purposeBn:
      'Google, Bing এবং সব আধুনিক AI সার্চ বট (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended)-কে ওয়েবসাইট ইনডেক্স করার অনুমতি দেওয়ার ডকুমেন্ট।',
    previewSnippet: `User-agent: *
Allow: /
User-agent: Googlebot
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: ClaudeBot
User-agent: Google-Extended
Sitemap: /sitemap.xml`,
  },
  {
    id: 'sitemap-xml',
    filename: 'sitemap.xml',
    path: '/sitemap.xml',
    badge: 'XML SITEMAP',
    targetEngines: 'Google Search Console, Bing Webmaster Tools, DuckDuckGo',
    purposeEn:
      'Complete XML sitemap indexing the root portfolio, all 9 interactive section anchors (#home through #contact), and all AI knowledge documents.',
    purposeBn:
      'Google Search Console এবং Bing Webmaster Tools-এ জমা দেওয়ার জন্য ওয়েবসাইটের সব সেকশন ও AI ডকুমেন্টের অফিসিয়াল XML Sitemap।',
    previewSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/#home</loc><priority>1.0</priority></url>
  <url><loc>/llms.txt</loc><priority>0.95</priority></url>
  <url><loc>/llms-full.txt</loc><priority>0.95</priority></url>
</urlset>`,
  },
  {
    id: 'ai-txt',
    filename: 'ai.txt',
    path: '/ai.txt',
    badge: 'GEO CITATION POLICY',
    targetEngines: 'Generative AI Engines, Citation Aggregators, Web Agents',
    purposeEn:
      'Defines Generative Engine Optimization (GEO) citation rules, preferred entity attribution, and direct contact verification for AI summaries.',
    purposeBn:
      'AI সার্চ ইঞ্জিন যখন আপনার সম্পর্কে উত্তর দেবে, তখন কীভাবে আপনার নাম, লোকেশন ও যোগাযোগের মাধ্যম রেফারেন্স হিসেবে দেখাবে তার নীতিমালা।',
    previewSnippet: `User-Agent: *
Allow-AI-Search-Indexing: yes
Allow-RAG-Citation: yes
Entity-Name: Apurba Bera ("The Architect of the Void")
Entity-Location: Kolaghat, Purba Medinipur, West Bengal, India`,
  },
];

export const SeoAiIndexModal: React.FC<SeoAiIndexModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'ai-engines' | 'roadmap'>('documents');
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyFile = async (docItem: SeoDocumentItem) => {
    cyberSound.playClick();
    try {
      const res = await fetch(docItem.path);
      const text = res.ok ? await res.text() : docItem.previewSnippet;
      await navigator.clipboard?.writeText(text);
      setCopiedId(docItem.id);
      cyberSound.playSuccess();
      setTimeout(() => setCopiedId(null), 2400);
    } catch {
      await navigator.clipboard?.writeText(docItem.previewSnippet);
      setCopiedId(docItem.id);
      setTimeout(() => setCopiedId(null), 2400);
    }
  };

  const handleDownloadFile = async (docItem: SeoDocumentItem) => {
    cyberSound.playClick();
    try {
      const res = await fetch(docItem.path);
      const text = res.ok ? await res.text() : docItem.previewSnippet;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docItem.filename;
      a.click();
      URL.revokeObjectURL(url);
      cyberSound.playSuccess();
    } catch {
      // Fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => {
            cyberSound.playClick();
            onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-2xl bg-[#070514]/95 border border-cyan-500/45 p-4 sm:p-6 shadow-[0_0_65px_rgba(6,182,212,0.28)] text-slate-100 max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Top Laser Specular Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-fuchsia-500 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-900/45 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/45 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.3)]">
                  <Search className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold font-orbitron text-white uppercase tracking-wider">
                      SEO &amp; AI SEARCH (GEO/AEO) COMMAND CENTER
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[9.5px] font-mono text-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      100% DEPLOYED
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-cyan-300/90">
                    Google Search + ChatGPT Search + Perplexity + Gemini AI Overviews + Claude
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-cyan-950/60 hover:bg-cyan-900/75 border border-cyan-500/45 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                >
                  {lang === 'bn' ? 'EN' : 'বাংলা'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/45 text-purple-200 hover:text-white transition-colors cursor-pointer"
                >
                  ESC ✕
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-3 pb-2 border-b border-purple-900/35 shrink-0">
              <button
                type="button"
                onClick={() => {
                  cyberSound.playClick();
                  setActiveTab('documents');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-purple-950/35 border border-purple-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>1. BUILT AI &amp; SEO DOCUMENTS (6)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cyberSound.playClick();
                  setActiveTab('ai-engines');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'ai-engines'
                    ? 'bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-200 shadow-[0_0_15px_rgba(217,70,239,0.25)]'
                    : 'bg-purple-950/35 border border-purple-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>2. AI SEARCH ARCHITECTURE</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cyberSound.playClick();
                  setActiveTab('roadmap');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'bg-purple-950/35 border border-purple-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>3. TOP #1 RANKING GUIDE</span>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto pr-1.5 mt-4 space-y-4 no-scrollbar">
              {activeTab === 'documents' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/45 via-purple-950/40 to-fuchsia-950/35 border border-cyan-500/35 text-xs text-slate-200 leading-relaxed">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'bn'
                          ? 'ওয়েবসাইটে সংযুক্ত সকল SEO ও AI Search ডকুমেন্ট (লাইভ ও অ্যাক্টিভ)'
                          : 'ALL DEPLOYED SEO & AI SEARCH (GEO/AEO) DOCUMENTS'}
                      </span>
                    </div>
                    <p className="text-slate-300">
                      {lang === 'bn'
                        ? 'আপনার ওয়েবসাইটটি বিশ্লেষণ করে নিচের ৬টি অফিশিয়াল মেশিন-রিডেবল ডকুমেন্ট এবং index.html-এর ভেতরে ৭-স্তরের Schema.org Knowledge Graph তৈরি করা হয়েছে। যেকোনো ফাইল কপি বা ডাউনলোড করতে পারবেন:'
                        : 'Your website has been equipped with 6 dedicated machine-readable ranking files plus a 7-layer Schema.org JSON-LD Knowledge Graph in index.html.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {SEO_DOCUMENTS.map((docItem) => (
                      <div
                        key={docItem.id}
                        className="rounded-xl bg-[#0c0822]/75 border border-purple-500/35 hover:border-cyan-400/65 p-4 flex flex-col justify-between transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                              <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              {docItem.filename}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/45 text-[9px] font-mono text-cyan-300">
                              {docItem.badge}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono text-fuchsia-300/90 mb-2">
                            Targets: {docItem.targetEngines}
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed mb-3">
                            {lang === 'bn' ? docItem.purposeBn : docItem.purposeEn}
                          </p>

                          <pre className="p-2.5 rounded-lg bg-black/70 border border-purple-900/50 text-[10px] font-mono text-cyan-200/90 overflow-x-auto whitespace-pre-wrap mb-3 max-h-24">
                            {docItem.previewSnippet}
                          </pre>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-900/40">
                          <button
                            type="button"
                            onClick={() => handleCopyFile(docItem)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-[10.5px] font-mono text-purple-200 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedId === docItem.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadFile(docItem)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/65 hover:bg-cyan-900/80 border border-cyan-500/45 text-[10.5px] font-mono text-cyan-200 hover:text-white transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>DOWNLOAD</span>
                          </button>

                          <a
                            href={docItem.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => cyberSound.playClick()}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-fuchsia-950/60 hover:bg-fuchsia-900/75 border border-fuchsia-500/45 text-[10.5px] font-mono text-fuchsia-200 hover:text-white transition-colors"
                            title={`Open ${docItem.path}`}
                          >
                            <span>VIEW</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'ai-engines' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      {
                        title: '1. Schema.org 7-Layer Knowledge Graph',
                        icon: Layers,
                        color: 'text-cyan-400',
                        descBn:
                          'index.html-এ Person, ProfilePage, WebSite, ProfessionalService, ItemList (6 Projects), FAQPage এবং BreadcrumbList একসাথে যুক্ত করা হয়েছে, যাতে Google Rich Snippets ও Knowledge Panel দ্রুত তৈরি হয়।',
                        descEn:
                          'Embedded @graph in index.html connecting Person, ProfilePage, ProfessionalService, ItemList of 6 projects, FAQPage, and BreadcrumbList.',
                      },
                      {
                        title: '2. Generative Engine Optimization (GEO)',
                        icon: Bot,
                        color: 'text-fuchsia-400',
                        descBn:
                          'ChatGPT Search (OAI-SearchBot), Perplexity (PerplexityBot), Claude (ClaudeBot) এবং Gemini (Google-Extended) আপনার /llms.txt ও /llms-full.txt পড়ে সরাসরি উত্তর দিতে পারবে।',
                        descEn:
                          'Dedicated /llms.txt and /llms-full.txt endpoints allow ChatGPT Search, Perplexity, Claude, and Gemini to ingest your exact bio, projects, and contact info without JS rendering overhead.',
                      },
                      {
                        title: '3. Zero-JS Crawlable HTML Fallback',
                        icon: Cpu,
                        color: 'text-emerald-400',
                        descBn:
                          'অনেক হালকা AI ক্রলার জাভাস্ক্রিপ্ট রান করে না। তাই index.html-এর ভেতরে সেমান্টিক <noscript> ডসিয়ার দেওয়া হয়েছে যাতে যেকোনো বট প্রথম রিকোয়েস্টেই আপনার সব তথ্য পায়।',
                        descEn:
                          'Lightweight AI scrapers that do not execute React JavaScript immediately read the structured semantic fallback inside index.html.',
                      },
                      {
                        title: '4. Local & Global Geo-Targeting',
                        icon: Globe,
                        color: 'text-amber-400',
                        descBn:
                          'Kolaghat, Purba Medinipur, West Bengal, India (22.4329° N, 87.8599° E) এর সঠিক Geo-meta ট্যাগ এবং কোঅর্ডিনেট যুক্ত করা হয়েছে যাতে লোকাল ও গ্লোবাল সার্চে টপে আসে।',
                        descEn:
                          'Configured ICBM, geo.position, geo.region (IN-WB), and GeoCoordinates for Kolaghat, West Bengal, India alongside Worldwide service coverage.',
                      },
                    ].map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.title}
                          className="p-4 rounded-xl bg-[#0c0822]/75 border border-purple-500/35 space-y-2"
                        >
                          <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                            <Icon className={`w-4 h-4 ${card.color}`} />
                            <span>{card.title}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {lang === 'bn' ? card.descBn : card.descEn}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {lang === 'bn'
                          ? 'ওয়েবসাইটের ভেতরের ১০০% টেকনিক্যাল SEO ও AI Search কাজ সম্পন্ন! এখন টপে র‍্যাঙ্ক করার ৪টি বাহ্যিক ধাপ:'
                          : '100% On-Site Technical SEO & AI Search Architecture Complete! Follow these 4 off-site steps:'}
                      </span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-200 leading-relaxed pt-1">
                      <li>
                        <strong className="text-cyan-300">1. Google Search Console &amp; Bing Webmaster:</strong>{' '}
                        {lang === 'bn'
                          ? 'Google Search Console এবং Bing Webmaster Tools-এ আপনার ওয়েবসাইট ভেরিফাই করে `/sitemap.xml` সাবমিট করুন (ChatGPT Search সরাসরি Bing ইনডেক্স ব্যবহার করে)।'
                          : 'Verify your site on Google Search Console and Bing Webmaster Tools (ChatGPT Search uses Bing’s index) and submit /sitemap.xml.'}
                      </li>
                      <li>
                        <strong className="text-fuchsia-300">2. Custom Domain (.com / .dev / .in):</strong>{' '}
                        {lang === 'bn'
                          ? '`apurbabera.com` বা `apurbabera.dev` নামের একটি কাস্টম ডোমেইন কানেক্ট করলে ব্র্যান্ড অথরিটি কয়েক গুণ দ্রুত বৃদ্ধি পাবে।'
                          : 'Connecting an exact-match domain like apurbabera.com or apurbabera.dev dramatically boosts brand authority.'}
                      </li>
                      <li>
                        <strong className="text-amber-300">3. Entity Backlinks (sameAs Authority):</strong>{' '}
                        {lang === 'bn'
                          ? 'আপনার Instagram (@alone_gamer1508), GitHub, LinkedIn, এবং YouTube প্রোফাইলের বায়োতে এই ওয়েবসাইটের লিঙ্ক দিন। AI সার্চ ইঞ্জিন সোশ্যাল প্রোফাইলের ক্রস-লিঙ্ক থেকে এনটিটি ভেরিফাই করে।'
                          : 'Place your portfolio link in the bio of your Instagram (@alone_gamer1508), GitHub, LinkedIn, and X profiles so AI engines cross-verify your identity.'}
                      </li>
                      <li>
                        <strong className="text-emerald-300">4. Direct Perplexity &amp; ChatGPT Indexing:</strong>{' '}
                        {lang === 'bn'
                          ? 'Perplexity বা ChatGPT-তে আপনার ওয়েবসাইট ও `/llms-full.txt` লিঙ্ক দিয়ে প্রম্পট করলে তাদের লাইভ ক্যাশে আপনার তথ্য দ্রুত যুক্ত হয়ে যাবে।'
                          : 'Because /llms.txt and /llms-full.txt are now live at the root, AI answer engines can parse your full dossier in a single lightweight HTTP request.'}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
