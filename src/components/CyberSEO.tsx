import React, { useEffect } from 'react';
import ogPreviewImg from '../assets/images/og_preview_image_1790953568323.jpg';
import type { ProjectItem } from '../data/projectsData';
import { preloadProjectThumbnail, getCachedProjectThumbnail } from './CyberImagePreloader';

interface CyberSEOProps {
  activeSection: string;
  selectedProject?: ProjectItem | null;
}

const SECTION_SEO_MAP: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string;
  }
> = {
  home: {
    title: 'Apurba Bera - AI Engineer, Developer & Trader Portfolio',
    description:
      'Official portfolio of Apurba Bera - Class 11 tech prodigy, AI Engineer, Full-Stack Developer, Forex Trader, and AI Business Enhancer from Kolaghat, West Bengal.',
    keywords:
      'Apurba Bera, The Architect of the Void, AI Engineer, Full-Stack Developer, Forex Trader, Kolaghat, West Bengal, AI Automation, MT5 Algorithmic Trading',
  },
  about: {
    title: 'About Apurba Bera — Prodigy from Kolaghat, West Bengal',
    description:
      'Learn about Apurba Bera: Class 11 tech prodigy combining high-APM gaming discipline, full-stack systems engineering, and algorithmic market models.',
    keywords:
      'Apurba Bera background, Class 11 coder, Kolaghat prodigy, Purba Medinipur, AI developer India, competitive gamer coder',
  },
  services: {
    title: 'AI & Algo Services — Apurba Bera | Autonomous Agents & WebGL',
    description:
      'High-impact engineering services: Autonomous AI business enhancers, algorithmic Forex trading bots, spatial Vive WebGL coding, and full-stack software.',
    keywords:
      'AI services, LLM business automation, MetaTrader 5 bot, WebGL development, Three.js VR, high performance web systems',
  },
  arsenal: {
    title: 'Technical Arsenal & 16-Node Stack — Apurba Bera',
    description:
      'Explore Apurba Bera’s 16-node technical stack: Python, React 19, TypeScript, Gemini & OpenAI LLMs, FastAPI, Three.js WebGL, and MetaTrader 5 Quant.',
    keywords:
      'Apurba Bera tech stack, AI engineer skills, React 19 TypeScript developer, Python FastAPI, Three.js WebGL, MQL5 Forex Quant',
  },
  projects: {
    title: 'Engineering Projects — Apurba Bera | AI, Quant & WebGL',
    description:
      'Explore production-grade client deployments and experiments: Autonomous AI CRM pipelines, Forex microstructure terminals, and 3D WebGL metaverses.',
    keywords:
      'Apurba Bera projects, AI Business Enhancer, Algo-FX Forex Terminal, Vive Cyber Gaming Lab, Neural OCR Intelligence, Quant Orderbook',
  },
  'quantum-lab': {
    title: 'Cyber Quantum Lab — Live AI & Quant Simulations | Apurba Bera',
    description:
      'Interactive benchmark laboratory by Apurba Bera featuring 8 live neural, algorithmic trading, and spatial computing simulation engines.',
    keywords:
      'Cyber Quantum Lab, interactive AI simulation, algorithmic trading benchmark, Apurba Bera R&D lab',
  },
  process: {
    title: 'Architectural Blueprint & Process — Apurba Bera',
    description:
      'The tactical roadmap: From structural discovery and neural agent architecture to zero-latency deployment and algorithmic compounding.',
    keywords:
      'software engineering process, AI architecture design, deployment lifecycle, high frequency quant systems',
  },
  testimonials: {
    title: 'Client Endorsements & Protocols — Apurba Bera',
    description:
      'Verified testimonials from founders, quantitative traders, and engineering executives collaborating with Apurba Bera.',
    keywords:
      'client reviews, software testimonials, AI agency endorsements, Apurba Bera recommendations',
  },
  contact: {
    title: 'Connect with Apurba Bera — Kolaghat, West Bengal, India',
    description:
      'Initiate an engineering uplink with Apurba Bera for autonomous AI integrations, algorithmic trading models, or high-performance software development.',
    keywords:
      'hire AI engineer, contact Apurba Bera, Kolaghat developer, WhatsApp developer, email Apurba Bera',
  },
};

const SERVICES_SCHEMA_LIST = [
  {
    id: 'service-ai-business-enhancement',
    name: 'AI Business Enhancement & Autonomous LLM Agents',
    serviceType: 'Artificial Intelligence & Enterprise Workflow Automation',
    category: 'AGENTS / LLM',
    description:
      'Deploying autonomous AI agents, LLM integrations, and workflow automation to supercharge business growth (96% Mastery).',
    ratingValue: '5.0',
    ratingCount: '14',
  },
  {
    id: 'service-fullstack-development',
    name: 'Full-Stack Web Engineering (React 19, TypeScript & Python)',
    serviceType: 'Full-Stack Web & API Architecture',
    category: 'PYTHON / REACT',
    description:
      'Custom responsive 60fps web apps and robust backend APIs with clean, scalable, modern code (94% Mastery).',
    ratingValue: '5.0',
    ratingCount: '12',
  },
  {
    id: 'service-forex-algo-trading',
    name: 'Forex & Quantitative Algorithmic Trading',
    serviceType: 'Quantitative Financial Analytics & MT5 Execution',
    category: 'QUANT / METRICS',
    description:
      'Algorithmic market analysis, quantitative MetaTrader 5 indicators, and disciplined risk-reward strategies (92% Mastery).',
    ratingValue: '4.9',
    ratingCount: '10',
  },
  {
    id: 'service-vive-immersive-coding',
    name: 'Vive & Immersive 3D Spatial Coding',
    serviceType: '3D WebGL, Three.js & VR Web Engineering',
    category: 'VIVE / THREE.JS',
    description:
      'Interactive 3D environments, HTC Vive VR/AR web experiences, and 60fps spatial computing (88% Mastery).',
    ratingValue: '5.0',
    ratingCount: '8',
  },
  {
    id: 'service-gaming-tech-systems',
    name: 'Gaming & High-APM Tech Systems',
    serviceType: 'Interactive Game Logic & Low-Latency Systems',
    category: 'HIGH APM / LOGIC',
    description:
      'High-performance gaming logic, competitive mechanics, and futuristic cybernetic digital products (95% Mastery).',
    ratingValue: '5.0',
    ratingCount: '9',
  },
];

const PROJECTS_SCHEMA_LIST = [
  {
    id: 'ai-business-enhancer',
    name: 'AI Business Enhancer',
    category: 'BusinessApplication',
    subCategory: 'AI & LLM Multi-Agent Orchestration',
    description:
      'A flagship AI system engineered by Apurba Bera designed to transform traditional workflows into autonomous profit engines with CRM sync and conversational funnels.',
    keywords: 'AI AGENTS, LLM, PYTHON, FASTAPI',
    operatingSystem: 'Web, Cloud, Linux, macOS, Windows',
    ratingValue: '5.0',
    ratingCount: '19',
  },
  {
    id: 'algo-fx-terminal',
    name: 'Algo-FX Forex Terminal',
    category: 'FinanceApplication',
    subCategory: 'Forex Algorithmic Trading Terminal',
    description:
      'Advanced quantitative trading interface combining technical chart indicators, automated trailing stop strategies, real-time economic calendar alerts, and precision risk-to-reward calculation.',
    keywords: 'FOREX, ALGO TRADING, REACT, METATRADER',
    operatingSystem: 'Web, MetaTrader 5, Windows, macOS',
    ratingValue: '5.0',
    ratingCount: '16',
  },
  {
    id: 'vive-gaming-universe',
    name: 'Vive Cyber Gaming Lab',
    category: 'GameApplication',
    subCategory: 'Vive VR & 3D WebGL Spatial Sandbox',
    description:
      'Futuristic gaming and spatial interactive coding sandbox built with custom WebGL shaders, Vive motion controller support, dynamic audio telemetry, and 60fps competitive mechanics.',
    keywords: 'VIVE VR, THREE.JS, WEBGL, GAMING',
    operatingSystem: 'WebGL, WebXR, HTC Vive',
    ratingValue: '5.0',
    ratingCount: '14',
  },
  {
    id: 'neural-invoice-ocr',
    name: 'Neural OCR Intelligence',
    category: 'BusinessApplication',
    subCategory: 'Computer Vision & Document AI',
    description:
      'Zero-shot structured data extractor converting complex financial receipts and PDFs into standardized JSON payloads in under 450ms with 99.4% field precision.',
    keywords: 'GEMINI VISION, FASTAPI, OCR, DOCKER',
    operatingSystem: 'Cloud, Docker, Linux, Web',
    ratingValue: '5.0',
    ratingCount: '11',
  },
  {
    id: 'quant-depth-heatmap',
    name: 'Quant Orderbook Visualizer',
    category: 'FinanceApplication',
    subCategory: 'Quant & High-Frequency WebSockets',
    description:
      'High-frequency market microstructure visualizer processing thousands of tick updates per second to reveal hidden institutional liquidity blocks and spread shifts.',
    keywords: 'WEBSOCKETS, CANVAS 2D, FOREX, HIGH-FREQ',
    operatingSystem: 'Web, Cloud',
    ratingValue: '4.9',
    ratingCount: '10',
  },
  {
    id: 'autonomous-devops-agent',
    name: 'Autonomous DevOps Runner',
    category: 'DeveloperApplication',
    subCategory: 'Autonomous Kubernetes & CI/CD Agent',
    description:
      'Autonomous background engine that scans log streams, generates patch diffs, runs test suites, and notifies engineering leads on Telegram with full audit traces.',
    keywords: 'AI AGENT, KUBERNETES, CI/CD, AUTOMATION',
    operatingSystem: 'Linux, Kubernetes, Docker, Cloud',
    ratingValue: '5.0',
    ratingCount: '12',
  },
];

const toAbsoluteUrl = (rawUrl: string): string => {
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  if (typeof window !== 'undefined') {
    try {
      return new URL(rawUrl, window.location.origin).href;
    } catch {
      return `${window.location.origin}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
    }
  }
  return `https://ais-pre-ve5rembvuyowk6rev7t6ps-687178731361.asia-east1.run.app${
    rawUrl.startsWith('/') ? '' : '/'
  }${rawUrl}`;
};

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const removeMetaTag = (attr: 'name' | 'property', key: string) => {
  if (typeof document === 'undefined') return;
  const el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

const setCanonicalLink = (url: string) => {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

const setDynamicSchemaJsonLd = (schemaPayload: Record<string, unknown>) => {
  if (typeof document === 'undefined') return;
  const scriptId = 'cyber-dynamic-schema-jsonld';
  let scriptEl = document.head.querySelector(`#${scriptId}`) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(schemaPayload);
};

export const CyberSEO: React.FC<CyberSEOProps> = ({ activeSection, selectedProject }) => {
  useEffect(() => {
    const baseOrigin =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://ais-pre-ve5rembvuyowk6rev7t6ps-687178731361.asia-east1.run.app/';

    let isCancelled = false;

    if (selectedProject) {
      const { seo } = selectedProject;
      const projCanonicalUrl = `${baseOrigin}${seo.canonicalQuery}`;
      const cachedThumb =
        getCachedProjectThumbnail(selectedProject.id) || selectedProject.image || ogPreviewImg;
      const absoluteProjectImg = toAbsoluteUrl(cachedThumb);

      const applyProjectSeoTags = (absImageUrl: string) => {
        if (isCancelled) return;

        // 1. Document Title & Core Indexing Meta
        document.title = seo.ogTitle;
        setCanonicalLink(projCanonicalUrl);
        setMetaTag('name', 'description', seo.ogDescription);
        setMetaTag('name', 'keywords', seo.keywords.join(', '));

        // 2. Open Graph (Facebook, LinkedIn, Discord, Slack, WhatsApp, iMessage)
        setMetaTag('property', 'og:type', seo.ogType);
        setMetaTag('property', 'og:site_name', 'Apurba Bera Portfolio');
        setMetaTag('property', 'og:locale', 'en_US');
        setMetaTag('property', 'og:title', seo.ogTitle);
        setMetaTag('property', 'og:description', seo.ogDescription);
        setMetaTag('property', 'og:url', projCanonicalUrl);
        setMetaTag('property', 'og:image', absImageUrl);
        setMetaTag('property', 'og:image:secure_url', absImageUrl);
        setMetaTag('property', 'og:image:alt', seo.imageAlt);
        setMetaTag('property', 'og:image:width', '1200');
        setMetaTag('property', 'og:image:height', '630');

        // Article / Case-Study Open Graph precision tags
        setMetaTag('property', 'article:author', 'Apurba Bera');
        setMetaTag('property', 'article:section', seo.section);
        setMetaTag('property', 'article:published_time', seo.publishedTime);
        setMetaTag('property', 'article:modified_time', seo.modifiedTime);
        setMetaTag('property', 'article:tag', selectedProject.tags.join(', '));

        // 3. Twitter / X Card Meta Tags (summary_large_image + enhanced data labels)
        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:site', '@alone_gamer1508');
        setMetaTag('name', 'twitter:creator', '@alone_gamer1508');
        setMetaTag('name', 'twitter:url', projCanonicalUrl);
        setMetaTag('name', 'twitter:title', seo.twitterTitle);
        setMetaTag('name', 'twitter:description', seo.twitterDescription);
        setMetaTag('name', 'twitter:image', absImageUrl);
        setMetaTag('name', 'twitter:image:alt', seo.imageAlt);
        setMetaTag('name', 'twitter:label1', seo.primaryMetricLabel);
        setMetaTag('name', 'twitter:data1', seo.primaryMetricValue);
        setMetaTag('name', 'twitter:label2', seo.secondaryMetricLabel);
        setMetaTag('name', 'twitter:data2', seo.secondaryMetricValue);

        // 4. Individual Project Page JSON-LD Structured Data + BreadcrumbList
        setDynamicSchemaJsonLd({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': ['SoftwareApplication', 'CreativeWork'],
              '@id': `${baseOrigin}${seo.canonicalHash}`,
              name: selectedProject.title,
              headline: seo.ogTitle,
              applicationCategory: 'BusinessApplication',
              applicationSubCategory: selectedProject.category,
              operatingSystem: 'Web, Cloud, Desktop, Mobile',
              description: selectedProject.fullDesc,
              keywords: seo.keywords.join(', '),
              image: absImageUrl,
              url: projCanonicalUrl,
              datePublished: seo.publishedTime,
              dateModified: seo.modifiedTime,
              author: {
                '@type': 'Person',
                name: 'Apurba Bera',
                url: baseOrigin,
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/OnlineOnly',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                bestRating: '5',
                ratingCount: '18',
              },
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `${baseOrigin}${seo.canonicalHash}-breadcrumb`,
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Apurba Bera Portfolio',
                  item: baseOrigin,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Featured Projects',
                  item: `${baseOrigin}#projects`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: selectedProject.title,
                  item: projCanonicalUrl,
                },
              ],
            },
          ],
        });
      };

      applyProjectSeoTags(absoluteProjectImg);

      // Ensure if the project thumbnail was not yet preloaded by IntersectionObserver,
      // we resolve it now and update og:image & twitter:image with the exact project asset.
      if (!getCachedProjectThumbnail(selectedProject.id) && !selectedProject.image) {
        preloadProjectThumbnail(selectedProject).then((resolvedUrl) => {
          if (resolvedUrl && !isCancelled) {
            applyProjectSeoTags(toAbsoluteUrl(resolvedUrl));
          }
        });
      }

      return () => {
        isCancelled = true;
      };
    }

    // Clean up project-only article/twitter-data tags when returning to portfolio sections
    removeMetaTag('property', 'article:author');
    removeMetaTag('property', 'article:section');
    removeMetaTag('property', 'article:published_time');
    removeMetaTag('property', 'article:modified_time');
    removeMetaTag('property', 'article:tag');
    removeMetaTag('name', 'twitter:label1');
    removeMetaTag('name', 'twitter:data1');
    removeMetaTag('name', 'twitter:label2');
    removeMetaTag('name', 'twitter:data2');

    const currentMeta = SECTION_SEO_MAP[activeSection] || SECTION_SEO_MAP.home;
    const sectionUrl =
      activeSection && activeSection !== 'home'
        ? `${baseOrigin}#${activeSection}`
        : baseOrigin;
    const defaultOgImage = toAbsoluteUrl('/og-preview.jpg') || toAbsoluteUrl(ogPreviewImg);

    document.title = currentMeta.title;
    setCanonicalLink(baseOrigin);
    setMetaTag('name', 'description', currentMeta.description);
    setMetaTag('name', 'keywords', currentMeta.keywords);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', 'Apurba Bera Portfolio');
    setMetaTag('property', 'og:title', currentMeta.title);
    setMetaTag('property', 'og:description', currentMeta.description);
    setMetaTag('property', 'og:url', sectionUrl);
    setMetaTag('property', 'og:image', defaultOgImage);
    setMetaTag('property', 'og:image:secure_url', defaultOgImage);
    setMetaTag(
      'property',
      'og:image:alt',
      'Apurba Bera - Cyber-Quant AI Engineer & Developer Portfolio Preview'
    );
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@alone_gamer1508');
    setMetaTag('name', 'twitter:creator', '@alone_gamer1508');
    setMetaTag('name', 'twitter:url', sectionUrl);
    setMetaTag('name', 'twitter:title', currentMeta.title);
    setMetaTag('name', 'twitter:description', currentMeta.description);
    setMetaTag('name', 'twitter:image', defaultOgImage);
    setMetaTag('name', 'twitter:image:alt', 'Apurba Bera - Portfolio Preview');

    if (activeSection === 'services') {
      setDynamicSchemaJsonLd({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${baseOrigin}#services-schema-view`,
        name: 'Apurba Bera Engineering & Quantitative Services',
        description: currentMeta.description,
        url: `${baseOrigin}#services`,
        numberOfItems: SERVICES_SCHEMA_LIST.length,
        itemListElement: SERVICES_SCHEMA_LIST.map((svc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Service',
            '@id': `${baseOrigin}#${svc.id}`,
            name: svc.name,
            serviceType: svc.serviceType,
            category: svc.category,
            description: svc.description,
            url: `${baseOrigin}#services`,
            provider: {
              '@type': 'Person',
              name: 'Apurba Bera',
              email: 'apurbabera45@gmail.com',
              telephone: '+91-7797304622',
            },
            areaServed: 'Worldwide',
            offers: {
              '@type': 'Offer',
              url: `${baseOrigin}#contact`,
              availability: 'https://schema.org/InStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: svc.ratingValue,
              bestRating: '5',
              ratingCount: svc.ratingCount,
            },
          },
        })),
      });
    } else if (activeSection === 'projects') {
      setDynamicSchemaJsonLd({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${baseOrigin}#projects-schema-view`,
        name: currentMeta.title,
        description: currentMeta.description,
        url: `${baseOrigin}#projects`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: PROJECTS_SCHEMA_LIST.length,
          itemListElement: PROJECTS_SCHEMA_LIST.map((proj, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': ['SoftwareApplication', 'CreativeWork'],
              '@id': `${baseOrigin}#project-${proj.id}`,
              name: proj.name,
              applicationCategory: proj.category,
              applicationSubCategory: proj.subCategory,
              operatingSystem: proj.operatingSystem,
              description: proj.description,
              keywords: proj.keywords,
              url: `${baseOrigin}?project=${proj.id}`,
              author: {
                '@type': 'Person',
                name: 'Apurba Bera',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/OnlineOnly',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: proj.ratingValue,
                bestRating: '5',
                ratingCount: proj.ratingCount,
              },
            },
          })),
        },
      });
    } else {
      setDynamicSchemaJsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': sectionUrl,
        name: currentMeta.title,
        description: currentMeta.description,
        url: sectionUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Apurba Bera Portfolio',
          url: baseOrigin,
        },
        about: {
          '@type': 'Person',
          name: 'Apurba Bera',
          jobTitle: 'AI Engineer, Full-Stack Developer & Quantitative Forex Trader',
        },
      });
    }
  }, [activeSection, selectedProject]);

  return null;
};
