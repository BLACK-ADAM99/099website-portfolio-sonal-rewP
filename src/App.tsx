import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { findProjectById, type ProjectItem } from './data/projectsData';
import {
  CyberScrollVideoBackground,
  CustomFrameSource,
} from './components/CyberScrollVideoBackground';
import { CyberCursor } from './components/CyberCursor';
import { SectionConnector } from './components/SectionConnector';
import { ScrollSlideUpReveal } from './components/ScrollSlideUpReveal';
import { CyberScrollProgress } from './components/CyberScrollProgress';
import { CyberGlitchLayer } from './components/CyberGlitchLayer';
import { CyberSEO } from './components/CyberSEO';
import { CyberQuickDock } from './components/CyberQuickDock';
import { CyberParticlePhysicsOverlay } from './components/CyberParticlePhysicsOverlay';

// Progressive Code-Split Below-The-Fold Sections (Pre-warmed immediately after Frame 0 paint)
const CyberChromaticArsenal = lazy(() =>
  import('./components/CyberChromaticArsenal').then((m) => ({ default: m.CyberChromaticArsenal }))
);
const Projects = lazy(() =>
  import('./components/Projects').then((m) => ({ default: m.Projects }))
);
const CyberQuantumLab = lazy(() =>
  import('./components/CyberQuantumLab').then((m) => ({ default: m.CyberQuantumLab }))
);
const Process = lazy(() =>
  import('./components/Process').then((m) => ({ default: m.Process }))
);
const Testimonials = lazy(() =>
  import('./components/Testimonials').then((m) => ({ default: m.Testimonials }))
);
const Contact = lazy(() =>
  import('./components/Contact').then((m) => ({ default: m.Contact }))
);
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer }))
);

const ProjectModal = lazy(() =>
  import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal }))
);
const CvModal = lazy(() =>
  import('./components/CvModal').then((m) => ({ default: m.CvModal }))
);
const AboutModal = lazy(() =>
  import('./components/AboutModal').then((m) => ({ default: m.AboutModal }))
);
const CyberTerminalModal = lazy(() =>
  import('./components/CyberTerminalModal').then((m) => ({ default: m.CyberTerminalModal }))
);

const preloadBelowFoldSections = () => {
  import('./components/CyberChromaticArsenal');
  import('./components/Projects');
  import('./components/CyberQuantumLab');
  import('./components/Process');
  import('./components/Testimonials');
  import('./components/Contact');
  import('./components/Footer');
};

interface CyberSectionSkeletonProps {
  minHeight?: number;
  accentHex?: string;
  cards?: number;
  columns?: string;
}

/**
 * Subtle pulsing cyberpunk skeleton loader that preserves section height
 * during lazy chunk hydration to eliminate Cumulative Layout Shift (CLS).
 */
const CyberSectionSkeleton: React.FC<CyberSectionSkeletonProps> = ({
  minHeight = 520,
  accentHex = '#06b6d4',
  cards = 4,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}) => (
  <div
    aria-hidden="true"
    style={{ minHeight: `${minHeight}px` }}
    className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center relative select-none pointer-events-none"
  >
    {/* Subtle Pulsing Header Skeleton */}
    <div className="mb-10 space-y-3">
      <div
        style={{ borderColor: `${accentHex}40`, backgroundColor: 'rgba(7, 11, 20, 0.22)' }}
        className="h-5 w-44 rounded-full border animate-pulse"
      />
      <div
        style={{
          background: `linear-gradient(90deg, ${accentHex}30, rgba(217, 70, 239, 0.22), transparent)`,
        }}
        className="h-8 w-72 sm:w-96 rounded-lg animate-pulse"
      />
    </div>

    {/* Subtle Pulsing Semi-Transparent Cyberpunk Card Grid */}
    <div className={`grid ${columns} gap-5`}>
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          style={{
            borderColor: `${accentHex}33`,
            boxShadow: `0 8px 24px -12px ${accentHex}22`,
          }}
          className="h-48 rounded-2xl bg-[#070b14]/22 border backdrop-blur-[2px] p-5 flex flex-col justify-between relative overflow-hidden animate-pulse"
        >
          <div
            style={{
              background: `linear-gradient(90deg, transparent, ${accentHex}66, transparent)`,
            }}
            className="absolute top-0 left-0 right-0 h-[1.5px]"
          />
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10" />
            <div className="w-14 h-4 rounded bg-white/5" />
          </div>
          <div className="space-y-2">
            <div className="w-3/4 h-4 rounded bg-white/10" />
            <div className="w-full h-3 rounded bg-white/5" />
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              style={{ backgroundColor: `${accentHex}55` }}
              className="w-2/3 h-full rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const IDB_NAME = 'ApurbaPortfolio4KVideoDB';
const IDB_STORE = 'videoStore';
const IDB_KEY = 'customBgSourceRecord';

interface StoredSourceRecord {
  type: 'video' | 'zip';
  blob: Blob;
}

const saveSourceToIDB = (record: StoredSourceRecord): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(record, IDB_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
};

const loadSourceFromIDB = (): Promise<StoredSourceRecord | null> => {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, 'readonly');
        const getReq = tx.objectStore(IDB_STORE).get(IDB_KEY);
        getReq.onsuccess = () => {
          const res = getReq.result;
          if (res && typeof res === 'object' && 'blob' in res && 'type' in res) {
            resolve(res as StoredSourceRecord);
          } else if (res instanceof Blob) {
            resolve({
              type: res.type.includes('zip') ? 'zip' : 'video',
              blob: res,
            });
          } else {
            resolve(null);
          }
        };
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isCvOpen, setIsCvOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [customSource, setCustomSource] = useState<CustomFrameSource | null>(null);
  const [isSmoothBooted, setIsSmoothBooted] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Staged Smooth Boot Engine: Paint Hero on Frame 0, then pre-warm below-the-fold chunks during browser idle time
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsSmoothBooted(true);
    });
    let idleId: number | null = null;
    let timerId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(() => preloadBelowFoldSections(), { timeout: 1400 });
    } else {
      timerId = window.setTimeout(() => preloadBelowFoldSections(), 650);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (idleId !== null && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  // Deep-link individual project pages via ?project=<id> or #project-<id> for social sharing & SEO indexing
  const handleSelectProject = useCallback((project: ProjectItem | null) => {
    setSelectedProject(project);
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      if (project) {
        url.searchParams.set('project', project.id);
        url.hash = 'projects';
      } else {
        url.searchParams.delete('project');
        if (url.hash.startsWith('#project-')) {
          url.hash = 'projects';
        }
      }
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Ignore history replace errors in restricted environments
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncProjectFromLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const queryProj = params.get('project');
      const hashProj = window.location.hash.startsWith('#project-')
        ? window.location.hash.replace(/^#project-/, '')
        : null;
      const matched = findProjectById(queryProj || hashProj);
      if (matched) {
        setSelectedProject(matched);
      }
    };
    syncProjectFromLocation();
    window.addEventListener('popstate', syncProjectFromLocation);
    window.addEventListener('hashchange', syncProjectFromLocation);
    return () => {
      window.removeEventListener('popstate', syncProjectFromLocation);
      window.removeEventListener('hashchange', syncProjectFromLocation);
    };
  }, []);

  // Restore persisted custom 4K ZIP frame archive or video from IndexedDB
  useEffect(() => {
    loadSourceFromIDB().then((rec) => {
      if (rec) {
        setCustomSource({
          type: rec.type,
          blob: rec.blob,
        });
      }
    });
  }, []);

  const handleUploadSourceFiles = useCallback((fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const first = files[0];
    const lowerName = first.name.toLowerCase();

    if (lowerName.endsWith('.zip') || first.type.includes('zip')) {
      setCustomSource({ type: 'zip', blob: first });
      saveSourceToIDB({ type: 'zip', blob: first });
      return;
    }

    if (first.type.startsWith('video/') || lowerName.endsWith('.mp4') || lowerName.endsWith('.webm')) {
      setCustomSource({ type: 'video', blob: first });
      saveSourceToIDB({ type: 'video', blob: first });
      return;
    }

    const imageFiles = files.filter(
      (f) =>
        f.type.startsWith('image/') ||
        /\.(jpe?g|png|webp)$/i.test(f.name)
    );
    if (imageFiles.length > 0) {
      setCustomSource({ type: 'images', files: imageFiles });
    }
  }, []);

  // Support dragging and dropping a .zip of JPG frames, multiple .jpg files, or a 4K video anywhere onto the window
  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
      }
    };
    const onDrop = (e: DragEvent) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        e.preventDefault();
        handleUploadSourceFiles(files);
      }
    };
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [handleUploadSourceFiles]);

  // Initialize Lenis Momentum Smooth Scrolling Engine + Navigation & Slide-Up IntersectionObservers
  useEffect(() => {
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      lerp: isTouchDevice ? 0.095 : 0.115,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: isTouchDevice,
      syncTouchLerp: 0.085,
      touchInertiaExponent: 1.65,
      wheelMultiplier: 1.0,
      touchMultiplier: isTouchDevice ? 1.08 : 1.0,
      autoResize: true,
      overscroll: true,
      allowNestedScroll: true,
      infinite: false,
      prevent: (node: HTMLElement) =>
        node.hasAttribute('data-lenis-prevent') ||
        node.tagName === 'TEXTAREA' ||
        node.tagName === 'SELECT',
    });
    lenisRef.current = lenis;

    const getMaxScrollLimit = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    // Publish sub-pixel Lenis scroll state so the 4K 60/120FPS video background moves in zero-lag 1:1 lockstep
    window.__lenisScrollState = {
      scroll: window.scrollY,
      limit: getMaxScrollLimit(),
      velocity: 0,
      isSmooth: Boolean((lenis as unknown as { isSmooth?: boolean }).isSmooth) || isTouchDevice,
    };

    lenis.on('scroll', (e: { scroll: number; limit: number; velocity: number }) => {
      window.__lenisScrollState = {
        scroll: e.scroll,
        limit: Math.max(1, e.limit),
        velocity: e.velocity,
        isSmooth: Boolean((lenis as unknown as { isSmooth?: boolean }).isSmooth) || isTouchDevice,
      };
    });

    // Native passive scroll listener fallback when smooth mode is inactive
    const handleNativeScroll = () => {
      if (!(lenis as unknown as { isSmooth?: boolean }).isSmooth && !isTouchDevice) {
        window.__lenisScrollState = {
          scroll: window.scrollY,
          limit: getMaxScrollLimit(),
          velocity: lenis.velocity || 0,
          isSmooth: false,
        };
      }
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // 1. Active Navigation Section IntersectionObserver
    const sectionIds = [
      'home',
      'about',
      'services',
      'arsenal',
      'projects',
      'quantum-lab',
      'process',
      'testimonials',
      'contact',
    ];
    const observedElements = new Set<Element>();
    const navObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-32% 0px -55% 0px', threshold: 0 }
    );

    const observeAllSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !observedElements.has(el)) {
          observedElements.add(el);
          navObserver.observe(el);
        }
      });
    };
    observeAllSections();
    const reobserveTimer = window.setTimeout(observeAllSections, 260);

    // Keep Lenis scroll limits & section observers synchronized as lazy below-the-fold chunks mount
    const bodyResizeObserver = new ResizeObserver(() => {
      lenis.resize();
      observeAllSections();
      if (window.__lenisScrollState) {
        window.__lenisScrollState.limit = Math.max(1, lenis.limit || getMaxScrollLimit());
      }
    });
    bodyResizeObserver.observe(document.body);

    // Smooth anchor link clicks interceptor with silky glide (even when triggered from inside a closing modal)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            document.documentElement.style.overflow = '';
            lenis.start();
            lenis.scrollTo(targetElement, {
              offset: -75,
              duration: 1.15,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.clearTimeout(reobserveTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleNativeScroll);
      bodyResizeObserver.disconnect();
      navObserver.disconnect();
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  const isAnyModalOpen = isCvOpen || isAboutOpen || isTerminalOpen || !!selectedProject;

  // Pause Lenis scrolling when any modal is open to prevent background bleed-through
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isAnyModalOpen) {
      lenisRef.current.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenisRef.current.start();
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Keyboard shortcuts: Escape to close modals, Ctrl+K or Cmd+K to toggle Cyber CLI Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCvOpen(false);
        setIsAboutOpen(false);
        setIsTerminalOpen(false);
        handleSelectProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectProject]);

  const scrollToSection = useCallback((id: string) => {
    const elem = document.getElementById(id);
    if (elem && lenisRef.current) {
      lenisRef.current.scrollTo(elem, {
        offset: -80,
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToContact = useCallback(() => scrollToSection('contact'), [scrollToSection]);
  const scrollToProjects = useCallback(() => scrollToSection('projects'), [scrollToSection]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 relative selection:bg-fuchsia-500/30 selection:text-fuchsia-200 overflow-x-clip">
      {/* Dynamic SEO & Meta Engine */}
      <CyberSEO activeSection={activeSection} selectedProject={selectedProject} />

      {/* Global High-Performance CSS Filter-Based Glitch Layer */}
      <CyberGlitchLayer triggerKey={activeSection} />

      {/* Animated Top Viewport Neon-Gradient Scroll Progress Bar */}
      <CyberScrollProgress />

      {/* Custom Cyber Neon Cursor (Mounted smoothly after Frame 0 paint) */}
      {isSmoothBooted && <CyberCursor />}

      {/* 4K Ultra-HD (3840x2160) 60FPS Scroll-Synchronized Background Animation */}
      <CyberScrollVideoBackground customSource={customSource} />

      {/* Interactive Cursor-Reactive Star Physics Effect layered over current content */}
      {isSmoothBooted && <CyberParticlePhysicsOverlay />}

      {/* Smooth Cinema Boot Veil (Glides away in 320ms on GPU compositor without blocking clicks) */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[70] pointer-events-none bg-[#05030e] transition-opacity duration-300 ease-out ${
          isSmoothBooted ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Navigation */}
      <Navbar activeSection={activeSection} onConnectClick={scrollToContact} />

      {/* Main Content Sections & SectionConnectors with Ultra-Level 3D Arrival Modes & 16-Color Chromatic Sweeps */}
      <main className="relative z-10">
        <ScrollSlideUpReveal
          variant="section"
          mode="quantumPortalZoom"
          accentHex="#06b6d4"
          offsetY={36}
          threshold={0.05}
          initiallyVisible={true}
        >
          <Hero
            onViewWork={scrollToProjects}
            onDownloadCv={() => setIsCvOpen(true)}
          />
        </ScrollSlideUpReveal>

        {/* Interconnect 1 */}
        <SectionConnector
          nodeId="NODE_01"
          label="NEURAL ARCHITECTURE & ROOTS"
          tag="GENESIS"
        />

        <ScrollSlideUpReveal
          variant="section"
          mode="prismUnfold3D"
          accentHex="#d946ef"
          offsetY={48}
          threshold={0.08}
        >
          <About
            onMoreAboutMe={() => setIsAboutOpen(true)}
          />
        </ScrollSlideUpReveal>

        {/* Interconnect 2 */}
        <SectionConnector
          nodeId="NODE_02"
          label="CAPABILITIES MATRIX"
          tag="PROTOCOLS"
        />

        <ScrollSlideUpReveal
          variant="section"
          mode="orbitalSweepLeft"
          accentHex="#8b5cf6"
          offsetY={48}
          threshold={0.08}
        >
          <Services />
        </ScrollSlideUpReveal>

        {/* Interconnect 3 */}
        <SectionConnector
          nodeId="NODE_03"
          label="16-CORE CHROMATIC ARSENAL"
          tag="SPECTRUM"
        />

        <Suspense
          fallback={
            <CyberSectionSkeleton
              minHeight={760}
              accentHex="#10b981"
              cards={8}
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
          }
        >
          <ScrollSlideUpReveal
            variant="section"
            mode="cyberBladeMatrix"
            accentHex="#10b981"
            offsetY={52}
            threshold={0.07}
          >
            <CyberChromaticArsenal />
          </ScrollSlideUpReveal>
        </Suspense>

        {/* Interconnect 4 */}
        <SectionConnector
          nodeId="NODE_04"
          label="ARTIFACTS & REPOSITORY"
          tag="DEPLOYED"
        />

        <Suspense
          fallback={
            <CyberSectionSkeleton
              minHeight={640}
              accentHex="#f59e0b"
              cards={3}
              columns="grid-cols-1 md:grid-cols-3"
            />
          }
        >
          <ScrollSlideUpReveal
            variant="section"
            mode="tesseractFold3D"
            accentHex="#f59e0b"
            offsetY={48}
            threshold={0.08}
          >
            <Projects
              onSelectProject={handleSelectProject}
              onViewAllProjects={scrollToProjects}
            />
          </ScrollSlideUpReveal>
        </Suspense>

        {/* Interconnect 5 */}
        <SectionConnector
          nodeId="NODE_05"
          label="QUANTUM ARCHITECTURE LAB"
          tag="SANDBOX"
        />

        <Suspense
          fallback={
            <CyberSectionSkeleton
              minHeight={620}
              accentHex="#ec4899"
              cards={4}
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
          }
        >
          <ScrollSlideUpReveal
            variant="section"
            mode="supernovaIgnition"
            accentHex="#ec4899"
            offsetY={52}
            threshold={0.07}
          >
            <CyberQuantumLab />
          </ScrollSlideUpReveal>
        </Suspense>

        {/* Interconnect 6 */}
        <SectionConnector
          nodeId="NODE_06"
          label="EXECUTION PIPELINE"
          tag="WORKFLOW"
        />

        <Suspense
          fallback={
            <CyberSectionSkeleton
              minHeight={380}
              accentHex="#f43f5e"
              cards={5}
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
            />
          }
        >
          <ScrollSlideUpReveal
            variant="section"
            mode="vortexAscend"
            accentHex="#f43f5e"
            offsetY={48}
            threshold={0.08}
          >
            <Process />
          </ScrollSlideUpReveal>
        </Suspense>

        {/* Interconnect 7 */}
        <SectionConnector
          nodeId="NODE_07"
          label="VERIFIED TELEMETRY"
          tag="SIGNALS"
        />

        <Suspense
          fallback={
            <CyberSectionSkeleton
              minHeight={460}
              accentHex="#3b82f6"
              cards={3}
              columns="grid-cols-1 md:grid-cols-3"
            />
          }
        >
          <ScrollSlideUpReveal
            variant="section"
            mode="gravityWaveAscend"
            accentHex="#3b82f6"
            offsetY={48}
            threshold={0.08}
          >
            <Testimonials />
          </ScrollSlideUpReveal>
        </Suspense>

        {/* Interconnect 8 */}
        <SectionConnector
          nodeId="NODE_08"
          label="QUANTUM TRANSMISSION"
          tag="UPLINK"
        />

        <Suspense
          fallback={
            <CyberSectionSkeleton
              minHeight={540}
              accentHex="#84cc16"
              cards={3}
              columns="grid-cols-1 lg:grid-cols-3"
            />
          }
        >
          <ScrollSlideUpReveal
            variant="section"
            mode="helixRise"
            accentHex="#84cc16"
            offsetY={48}
            threshold={0.08}
          >
            <Contact />
          </ScrollSlideUpReveal>
        </Suspense>
      </main>

      {/* Footer wrapped in IntersectionObserver Slide-Up Reveal */}
      <Suspense
        fallback={
          <CyberSectionSkeleton
            minHeight={260}
            accentHex="#06b6d4"
            cards={1}
            columns="grid-cols-1"
          />
        }
      >
        <ScrollSlideUpReveal
          variant="section"
          mode="quantumPortalZoom"
          accentHex="#06b6d4"
          offsetY={40}
          threshold={0.06}
        >
          <Footer />
        </ScrollSlideUpReveal>
      </Suspense>

      {/* Quick-Access Horizontal Dock with Keyboard Shortcuts (Keys 1-7) */}
      <CyberQuickDock
        activeSection={activeSection}
        onScrollTo={scrollToSection}
        isModalOpen={isAnyModalOpen}
      />

      {/* Lazy-Loaded Interactive Modals (Deferred until user interaction for fast initial load) */}
      <Suspense fallback={null}>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => handleSelectProject(null)}
            onSelectProject={handleSelectProject}
          />
        )}

        {isCvOpen && (
          <CvModal
            isOpen={isCvOpen}
            onClose={() => setIsCvOpen(false)}
          />
        )}

        {isAboutOpen && (
          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        )}

        {isTerminalOpen && (
          <CyberTerminalModal
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}
