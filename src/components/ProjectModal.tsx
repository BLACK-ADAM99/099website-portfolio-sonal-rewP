import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  Sparkles,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Code2,
} from 'lucide-react';
import { ALL_PROJECTS, type ProjectItem } from '../data/projectsData';
import { CyberImagePreloader } from './CyberImagePreloader';
import { cyberSound } from '../utils/cyberSound';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectProject,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showSeoCardPreview, setShowSeoCardPreview] = useState(false);

  if (!project) return null;

  const currentIndex = ALL_PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIndex >= 0
      ? ALL_PROJECTS[(currentIndex - 1 + ALL_PROJECTS.length) % ALL_PROJECTS.length]
      : null;
  const nextProject =
    currentIndex >= 0
      ? ALL_PROJECTS[(currentIndex + 1) % ALL_PROJECTS.length]
      : null;

  const baseOrigin =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://ais-pre-ve5rembvuyowk6rev7t6ps-687178731361.asia-east1.run.app/';

  const projectShareUrl = `${baseOrigin}${project.seo.canonicalQuery}`;
  const encodedUrl = encodeURIComponent(projectShareUrl);
  const encodedTitle = encodeURIComponent(project.seo.twitterTitle);

  const handleCopyShareLink = async () => {
    cyberSound.playClick();
    try {
      await navigator.clipboard?.writeText(projectShareUrl);
      setCopiedUrl(true);
      cyberSound.playSuccess();
      setTimeout(() => setCopiedUrl(false), 2200);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2200);
    }
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={() => {
          cyberSound.playClick();
          onClose();
        }}
      >
        <motion.article
          key={project.id}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl rounded-2xl bg-[#09041a] border border-fuchsia-500/50 p-5 sm:p-7 shadow-[0_0_50px_rgba(217,70,239,0.28)] text-slate-100 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Navigation & Close Bar */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[210px] sm:max-w-[320px] text-slate-300">
                {project.seo.canonicalQuery}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-300">
                OG + TWITTER INDEXED
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {onSelectProject && prevProject && nextProject && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      cyberSound.playClick();
                      onSelectProject(prevProject);
                    }}
                    className="p-1.5 rounded-lg border border-purple-500/35 text-slate-300 hover:text-white hover:border-cyan-400/60 hover:bg-purple-900/35 transition-colors cursor-pointer"
                    title={`Previous: ${prevProject.title}`}
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      cyberSound.playClick();
                      onSelectProject(nextProject);
                    }}
                    className="p-1.5 rounded-lg border border-purple-500/35 text-slate-300 hover:text-white hover:border-cyan-400/60 hover:bg-purple-900/35 transition-colors cursor-pointer"
                    title={`Next: ${nextProject.title}`}
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  cyberSound.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-fuchsia-400" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="space-y-4">
            {/* Image Preview powered by CyberImagePreloader */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/40 bg-black/70 group">
              <CyberImagePreloader
                cacheKey={project.id}
                alt={project.seo.imageAlt}
                imageLoader={project.imageLoader}
                src={project.image}
                priority={true}
                containerClassName="relative w-full h-full overflow-hidden bg-[#070414]"
                imgClassName="w-full h-full object-cover filter contrast-[1.08]"
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-[#09041a]/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/85 border border-fuchsia-500/60 text-[10px] font-mono text-fuchsia-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{project.category}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-mono text-fuchsia-400 uppercase tracking-wider">
                  0{currentIndex + 1}. Individual Project Case Study
                </span>
                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    setShowSeoCardPreview((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg bg-cyan-950/45 border border-cyan-500/40 hover:border-cyan-400 transition-colors cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showSeoCardPreview ? 'Hide OG / Twitter Meta' : 'Inspect OG & Twitter Meta'}</span>
                </button>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-tech text-white uppercase tracking-wide">
                {project.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {project.fullDesc || project.description}
            </p>

            {/* Key Engineering Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-2.5 rounded-xl bg-[#0e0728]/90 border border-purple-500/30"
                  >
                    <div className="text-[10px] font-mono text-slate-400">{m.label}</div>
                    <div className="text-xs sm:text-sm font-bold font-mono text-cyan-300 mt-0.5 tabular-nums">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Collapsible Live Open Graph & Twitter Meta Inspector */}
            {showSeoCardPreview && (
              <div className="p-3.5 rounded-xl bg-[#060312] border border-cyan-500/40 space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-cyan-300 font-semibold border-b border-cyan-900/50 pb-1.5">
                  <span>ACTIVE OPEN GRAPH &amp; TWITTER CARD META TAGS</span>
                  <span className="text-[10px] text-emerald-400">summary_large_image</span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div>
                    <span className="text-fuchsia-400">og:title:</span> {project.seo.ogTitle}
                  </div>
                  <div>
                    <span className="text-fuchsia-400">og:description:</span>{' '}
                    {project.seo.ogDescription}
                  </div>
                  <div>
                    <span className="text-cyan-400">twitter:title:</span> {project.seo.twitterTitle}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[10px] text-slate-400">
                    <span>
                      <strong className="text-cyan-300">{project.seo.primaryMetricLabel}:</strong>{' '}
                      {project.seo.primaryMetricValue}
                    </span>
                    <span>
                      <strong className="text-cyan-300">{project.seo.secondaryMetricLabel}:</strong>{' '}
                      {project.seo.secondaryMetricValue}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tech Stack Metadata */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-purple-200">
              {project.tags.map((tag, i) => (
                <React.Fragment key={tag}>
                  {i > 0 && (
                    <span aria-hidden="true" className="text-purple-500/60">
                      ·
                    </span>
                  )}
                  <span>{tag}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Social Sharing & Direct URL Bar */}
            <div className="pt-3 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Share:</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-slate-200 transition-colors cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-purple-950/60 hover:bg-cyan-950/70 border border-purple-500/40 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-200 transition-colors"
                >
                  X / Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberSound.playClick()}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-purple-950/60 hover:bg-cyan-950/70 border border-purple-500/40 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-200 transition-colors"
                >
                  LinkedIn
                </a>
              </div>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    cyberSound.playClick();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-purple-900/40 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <a
                  href="#contact"
                  onClick={() => {
                    cyberSound.playClick();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#d91993] to-[#ec26a6] hover:from-[#c21481] hover:to-[#db1b96] text-white shadow-[0_0_20px_rgba(236,38,166,0.45)] transition-all font-mono"
                >
                  <span>Inquire Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </AnimatePresence>
  );
};
