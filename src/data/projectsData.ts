export interface ProjectSeoMeta {
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  ogType: 'article' | 'website';
  imageAlt: string;
  canonicalQuery: string;
  canonicalHash: string;
  keywords: string[];
  publishedTime: string;
  modifiedTime: string;
  section: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  /**
   * Lazy dynamic asset loader invoked only when IntersectionObserver
   * detects the project thumbnail approaching the viewport or when the
   * project page is opened directly.
   */
  imageLoader: () => Promise<{ default: string }>;
  /**
   * Optional resolved URL populated once the custom Image Preloader finishes
   * fetching and decoding the asset.
   */
  image?: string;
  tags: string[];
  link?: string;
  fullDesc: string;
  metrics: ProjectMetric[];
  seo: ProjectSeoMeta;
}

export const FLAGSHIP_PROJECTS: ProjectItem[] = [
  {
    id: 'ai-business-enhancer',
    title: 'AI BUSINESS ENHANCER',
    category: 'AI & LLM',
    description:
      'Autonomous AI suite automating customer intelligence, workflows and revenue pipelines.',
    imageLoader: () => import('../assets/images/proj_neon_ecommerce_1790514581825.jpg'),
    tags: ['AI AGENTS', 'LLM', 'PYTHON', 'FASTAPI'],
    fullDesc:
      'A flagship AI system engineered by Apurba Bera designed to transform traditional workflows into autonomous profit engines. Features intelligent multi-agent orchestration, real-time bidirectional CRM synchronization, and automated conversational funnels.',
    metrics: [
      { label: 'Task Automation', value: '100% Autonomous' },
      { label: 'Inference Latency', value: '< 42ms Edge' },
      { label: 'Core Stack', value: 'Python · FastAPI · LLM' },
    ],
    seo: {
      ogTitle: 'AI Business Enhancer — Autonomous Multi-Agent CRM Suite | Apurba Bera',
      ogDescription:
        'Explore AI Business Enhancer by Apurba Bera: an autonomous multi-agent LLM architecture automating enterprise customer intelligence, CRM sync, and revenue pipelines.',
      twitterTitle: 'AI Business Enhancer — Multi-Agent LLM & CRM Automation by Apurba Bera',
      twitterDescription:
        'Autonomous AI suite engineered with Python, FastAPI, and multi-agent LLM orchestration to turn enterprise workflows into self-driving profit engines.',
      ogType: 'article',
      imageAlt: 'AI Business Enhancer — Autonomous Multi-Agent LLM Architecture Preview by Apurba Bera',
      canonicalQuery: '?project=ai-business-enhancer',
      canonicalHash: '#project-ai-business-enhancer',
      keywords: [
        'AI Business Enhancer',
        'Apurba Bera AI Project',
        'Autonomous AI Agents',
        'LLM Workflow Automation',
        'Python FastAPI CRM Sync',
        'Conversational Revenue Funnel',
      ],
      publishedTime: '2026-02-15T09:00:00+05:30',
      modifiedTime: '2026-10-08T00:00:00+05:30',
      section: 'Artificial Intelligence & Autonomous Agents',
      primaryMetricLabel: 'Automation Efficiency',
      primaryMetricValue: '100% Multi-Agent Dispatch',
      secondaryMetricLabel: 'Tech Stack',
      secondaryMetricValue: 'Python · FastAPI · LLM',
    },
  },
  {
    id: 'algo-fx-terminal',
    title: 'ALGO-FX FOREX TERMINAL',
    category: 'FOREX ALGO',
    description:
      'Algorithmic currency trading analytics dashboard with live technical indicators and risk models.',
    imageLoader: () => import('../assets/images/proj_cyberpunk_street_1790514566729.jpg'),
    tags: ['FOREX', 'ALGO TRADING', 'REACT', 'METATRADER'],
    fullDesc:
      'Advanced quantitative trading interface combining technical chart indicators, automated trailing stop strategies, real-time economic calendar alerts, and precision risk-to-reward calculation for major Forex pairs.',
    metrics: [
      { label: 'Verified Win Rate', value: '78.4% MT5 Live' },
      { label: 'Risk-to-Reward', value: '1:2.5 to 1:3.5' },
      { label: 'Execution Engine', value: 'React 19 · MQL5' },
    ],
    seo: {
      ogTitle: 'Algo-FX Forex Terminal — Quantitative Trading & MT5 Risk Engine | Apurba Bera',
      ogDescription:
        'Discover Algo-FX Forex Terminal by Apurba Bera: algorithmic currency trading dashboard featuring live MT5 indicators, trailing stops, and precision risk models.',
      twitterTitle: 'Algo-FX Forex Terminal — Quantitative MT5 Trading Analytics by Apurba Bera',
      twitterDescription:
        'Real-time quantitative Forex terminal combining institutional liquidity telemetry, automated trailing stops, and 1:3.5 risk-to-reward execution.',
      ogType: 'article',
      imageAlt: 'Algo-FX Forex Terminal — Quantitative Currency Trading Dashboard Preview by Apurba Bera',
      canonicalQuery: '?project=algo-fx-terminal',
      canonicalHash: '#project-algo-fx-terminal',
      keywords: [
        'Algo-FX Forex Terminal',
        'Apurba Bera Forex Trader',
        'MetaTrader 5 Algorithmic Trading',
        'Quantitative Risk Management',
        'Forex Liquidity Dashboard',
        'MQL5 React Trading Terminal',
      ],
      publishedTime: '2026-03-10T09:00:00+05:30',
      modifiedTime: '2026-10-08T00:00:00+05:30',
      section: 'Quantitative Finance & Algorithmic Trading',
      primaryMetricLabel: 'Live MT5 Win Rate',
      primaryMetricValue: '78.4% Verified Profit',
      secondaryMetricLabel: 'Execution Stack',
      secondaryMetricValue: 'React 19 · MQL5 · Quant',
    },
  },
  {
    id: 'vive-gaming-universe',
    title: 'VIVE CYBER GAMING LAB',
    category: 'VIVE & 3D',
    description:
      'Immersive 3D interactive web game environment with Vive VR integration and fast mechanics.',
    imageLoader: () => import('../assets/images/proj_generative_lab_1790514593877.jpg'),
    tags: ['VIVE VR', 'THREE.JS', 'WEBGL', 'GAMING'],
    fullDesc:
      'Futuristic gaming and spatial interactive coding sandbox built with custom WebGL shaders, Vive motion controller support, dynamic audio telemetry, and 60fps competitive mechanics.',
    metrics: [
      { label: 'Frame Pacing', value: '60 FPS Locked' },
      { label: 'Shader Pipeline', value: 'Custom GLSL 3D' },
      { label: 'Spatial Input', value: 'WebXR · HTC Vive' },
    ],
    seo: {
      ogTitle: 'Vive Cyber Gaming Lab — 60FPS WebGL & HTC Vive VR Spatial Sandbox | Apurba Bera',
      ogDescription:
        'Experience Vive Cyber Gaming Lab by Apurba Bera: an immersive 3D WebGL and HTC Vive VR interactive spatial environment with custom GLSL shaders and 60fps physics.',
      twitterTitle: 'Vive Cyber Gaming Lab — 3D WebGL & Vive VR Spatial Engine by Apurba Bera',
      twitterDescription:
        'Interactive 3D browser sandbox built with Three.js, custom GLSL shaders, HTC Vive motion controller tracking, and locked 60fps competitive mechanics.',
      ogType: 'article',
      imageAlt: 'Vive Cyber Gaming Lab — 3D WebGL and HTC Vive VR Environment Preview by Apurba Bera',
      canonicalQuery: '?project=vive-gaming-universe',
      canonicalHash: '#project-vive-gaming-universe',
      keywords: [
        'Vive Cyber Gaming Lab',
        'Apurba Bera Vive Coder',
        'Three.js WebGL Developer',
        'HTC Vive WebXR',
        'Custom GLSL Shaders',
        '60FPS Browser Gaming',
      ],
      publishedTime: '2026-04-05T09:00:00+05:30',
      modifiedTime: '2026-10-08T00:00:00+05:30',
      section: '3D Spatial Computing & WebGL Gaming',
      primaryMetricLabel: 'Render Pipeline',
      primaryMetricValue: '60 FPS Locked WebGL',
      secondaryMetricLabel: 'Spatial Stack',
      secondaryMetricValue: 'Three.js · GLSL · Vive VR',
    },
  },
];

export const SECONDARY_PROJECTS: ProjectItem[] = [
  {
    id: 'neural-invoice-ocr',
    title: 'NEURAL OCR INTELLIGENCE',
    category: 'COMPUTER VISION',
    description:
      'Multi-modal invoice & document extraction pipeline with automated ERP synchronization.',
    imageLoader: () => import('../assets/images/hero_cyber_dev_1790514540845.jpg'),
    tags: ['GEMINI VISION', 'FASTAPI', 'OCR', 'DOCKER'],
    fullDesc:
      'Zero-shot structured data extractor converting complex financial receipts and PDFs into standardized JSON payloads in under 450ms with 99.4% field precision and automated ERP webhook synchronization.',
    metrics: [
      { label: 'Extraction Speed', value: '< 450ms / Doc' },
      { label: 'Field Precision', value: '99.4% Zero-Shot' },
      { label: 'Deployment', value: 'FastAPI · Docker' },
    ],
    seo: {
      ogTitle: 'Neural OCR Intelligence — Sub-450ms Multi-Modal Document AI | Apurba Bera',
      ogDescription:
        'Neural OCR Intelligence by Apurba Bera: zero-shot multi-modal invoice and financial PDF extraction pipeline achieving 99.4% field accuracy in under 450ms.',
      twitterTitle: 'Neural OCR Intelligence — 99.4% Precision Vision AI Pipeline by Apurba Bera',
      twitterDescription:
        'Convert complex financial invoices and PDFs into validated JSON payloads in under 450ms with Gemini Vision, FastAPI, and automated ERP webhooks.',
      ogType: 'article',
      imageAlt: 'Neural OCR Intelligence — Multi-Modal Vision Document Extraction Pipeline by Apurba Bera',
      canonicalQuery: '?project=neural-invoice-ocr',
      canonicalHash: '#project-neural-invoice-ocr',
      keywords: [
        'Neural OCR Intelligence',
        'Multi-Modal Document AI',
        'Invoice OCR FastAPI',
        'Gemini Vision Pipeline',
        'Apurba Bera Computer Vision',
      ],
      publishedTime: '2026-05-12T09:00:00+05:30',
      modifiedTime: '2026-10-08T00:00:00+05:30',
      section: 'Computer Vision & Document AI',
      primaryMetricLabel: 'Field Accuracy',
      primaryMetricValue: '99.4% in < 450ms',
      secondaryMetricLabel: 'Vision Stack',
      secondaryMetricValue: 'Vision LLM · FastAPI · Docker',
    },
  },
  {
    id: 'quant-depth-heatmap',
    title: 'QUANT ORDERBOOK VISUALIZER',
    category: 'QUANT & WEBSOCKETS',
    description:
      'Realtime institutional Forex orderbook depth heatmaps with liquidity pocket detection.',
    imageLoader: () => import('../assets/images/about_hologram_face_1790514555224.jpg'),
    tags: ['WEBSOCKETS', 'CANVAS 2D', 'FOREX', 'HIGH-FREQ'],
    fullDesc:
      'High-frequency market microstructure visualizer processing thousands of tick updates per second over low-latency WebSockets to reveal hidden institutional liquidity blocks and spread shifts.',
    metrics: [
      { label: 'Tick Throughput', value: '10,000+ Ticks/s' },
      { label: 'Render Engine', value: '60 FPS Canvas 2D' },
      { label: 'Stream Protocol', value: 'Binary WebSockets' },
    ],
    seo: {
      ogTitle: 'Quant Orderbook Visualizer — Real-Time Institutional Liquidity Heatmap | Apurba Bera',
      ogDescription:
        'Quant Orderbook Visualizer by Apurba Bera: high-frequency Forex market microstructure heatmap processing thousands of WebSocket ticks per second at 60fps.',
      twitterTitle: 'Quant Orderbook Visualizer — High-Frequency Forex Heatmap by Apurba Bera',
      twitterDescription:
        'Real-time Canvas 2D orderflow visualizer detecting institutional liquidity pockets, iceberg orders, and sub-second spread shifts over WebSockets.',
      ogType: 'article',
      imageAlt: 'Quant Orderbook Visualizer — Institutional Forex Liquidity Depth Heatmap by Apurba Bera',
      canonicalQuery: '?project=quant-depth-heatmap',
      canonicalHash: '#project-quant-depth-heatmap',
      keywords: [
        'Quant Orderbook Visualizer',
        'Forex Liquidity Heatmap',
        'Market Microstructure Canvas 2D',
        'High-Frequency WebSockets',
        'Apurba Bera Quant Project',
      ],
      publishedTime: '2026-06-20T09:00:00+05:30',
      modifiedTime: '2026-10-08T00:00:00+05:30',
      section: 'Market Microstructure & Orderflow Analytics',
      primaryMetricLabel: 'Stream Throughput',
      primaryMetricValue: '10k+ Ticks/sec @ 60FPS',
      secondaryMetricLabel: 'Telemetry Stack',
      secondaryMetricValue: 'WebSockets · Canvas 2D',
    },
  },
  {
    id: 'autonomous-devops-agent',
    title: 'AUTONOMOUS DEVOPS RUNNER',
    category: 'AUTONOMOUS AGENTS',
    description:
      'Self-monitoring agent resolving server incidents and auto-triaging deployment failures.',
    imageLoader: () => import('../assets/images/cyber_world_map_detailed_1790519133621.jpg'),
    tags: ['AI AGENT', 'KUBERNETES', 'CI/CD', 'AUTOMATION'],
    fullDesc:
      'Autonomous background engine that scans production log streams, isolates root-cause stack traces, generates verified patch diffs, runs regression test suites, and dispatches Telegram audit traces.',
    metrics: [
      { label: 'MTTR Reduction', value: '-84% Incident Time' },
      { label: 'Cluster Uptime', value: '99.99% Self-Heal' },
      { label: 'Orchestration', value: 'K8s · CI/CD · AI' },
    ],
    seo: {
      ogTitle: 'Autonomous DevOps Runner — Self-Healing Kubernetes & CI/CD AI Agent | Apurba Bera',
      ogDescription:
        'Autonomous DevOps Runner by Apurba Bera: self-healing infrastructure AI agent that triages Kubernetes logs, generates patch diffs, and validates CI/CD pipelines.',
      twitterTitle: 'Autonomous DevOps Runner — Self-Healing K8s & CI/CD Agent by Apurba Bera',
      twitterDescription:
        'Zero-downtime DevOps AI agent that monitors cluster telemetry, auto-generates regression-tested patch diffs, and dispatches instant audit traces.',
      ogType: 'article',
      imageAlt: 'Autonomous DevOps Runner — Self-Healing Kubernetes & CI/CD Agent by Apurba Bera',
      canonicalQuery: '?project=autonomous-devops-agent',
      canonicalHash: '#project-autonomous-devops-agent',
      keywords: [
        'Autonomous DevOps Runner',
        'Self-Healing Kubernetes AI',
        'Automated CI/CD Triage Agent',
        'DevOps LLM Automation',
        'Apurba Bera Infrastructure AI',
      ],
      publishedTime: '2026-07-18T09:00:00+05:30',
      modifiedTime: '2026-10-08T00:00:00+05:30',
      section: 'Autonomous DevOps & Cloud Infrastructure',
      primaryMetricLabel: 'Incident Resolution',
      primaryMetricValue: '-84% MTTR · 99.99% SLA',
      secondaryMetricLabel: 'Infra Stack',
      secondaryMetricValue: 'Kubernetes · CI/CD · AI Agent',
    },
  },
];

export const ALL_PROJECTS: ProjectItem[] = [...FLAGSHIP_PROJECTS, ...SECONDARY_PROJECTS];

export function findProjectById(projectId: string | null | undefined): ProjectItem | null {
  if (!projectId) return null;
  const normalized = projectId.trim().toLowerCase().replace(/^#?project-/, '');
  return ALL_PROJECTS.find((p) => p.id.toLowerCase() === normalized) || null;
}
