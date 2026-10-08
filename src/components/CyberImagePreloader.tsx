import React, { useState, useEffect, useRef } from 'react';
import type { ProjectItem } from '../data/projectsData';

/**
 * In-memory cache mapping cacheKey (project.id or image src) -> decoded asset URL.
 * Ensures once IntersectionObserver preloads & decodes a thumbnail, re-renders or
 * opening the individual Project Page modal resolves in 0ms without re-fetching.
 */
const PRELOADED_IMAGE_CACHE = new Map<string, string>();
const IN_FLIGHT_PRELOADS = new Map<string, Promise<string>>();

/**
 * Preloads and asynchronously decodes an image off the main thread using `new Image()`
 * and `HTMLImageElement.decode()`.
 */
async function decodeImageBitmap(url: string): Promise<string> {
  if (typeof window === 'undefined') return url;

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.src = url;

    const finalize = () => resolve(url);

    if (typeof img.decode === 'function') {
      img
        .decode()
        .then(finalize)
        .catch(() => {
          // Fallback if browser decode() rejects on already cached or cross-origin image
          finalize();
        });
    } else {
      img.onload = finalize;
      img.onerror = finalize;
    }
  });
}

/**
 * Programmatically resolves, preloads, and decodes a project's thumbnail image.
 * Used by both the IntersectionObserver when a card approaches the viewport
 * and by the SEO/Modal engine when a project page is opened directly via URL.
 */
export async function preloadProjectThumbnail(project: ProjectItem): Promise<string> {
  const cacheKey = project.id;
  const cached = PRELOADED_IMAGE_CACHE.get(cacheKey);
  if (cached) {
    project.image = cached;
    return cached;
  }

  if (project.image && PRELOADED_IMAGE_CACHE.has(project.image)) {
    const resolved = PRELOADED_IMAGE_CACHE.get(project.image)!;
    PRELOADED_IMAGE_CACHE.set(cacheKey, resolved);
    return resolved;
  }

  const existingPromise = IN_FLIGHT_PRELOADS.get(cacheKey);
  if (existingPromise) {
    return existingPromise;
  }

  const preloadPromise = (async () => {
    try {
      let resolvedUrl = project.image || '';
      if (!resolvedUrl && project.imageLoader) {
        const mod = await project.imageLoader();
        resolvedUrl = mod.default;
      }
      if (resolvedUrl) {
        await decodeImageBitmap(resolvedUrl);
        PRELOADED_IMAGE_CACHE.set(cacheKey, resolvedUrl);
        PRELOADED_IMAGE_CACHE.set(resolvedUrl, resolvedUrl);
        project.image = resolvedUrl;
      }
      return resolvedUrl;
    } finally {
      IN_FLIGHT_PRELOADS.delete(cacheKey);
    }
  })();

  IN_FLIGHT_PRELOADS.set(cacheKey, preloadPromise);
  return preloadPromise;
}

export function getCachedProjectThumbnail(projectId: string): string | undefined {
  return PRELOADED_IMAGE_CACHE.get(projectId);
}

interface CyberImagePreloaderProps {
  /** Unique cache identifier (e.g., project.id) */
  cacheKey: string;
  /** Alt text for accessibility and SEO indexing */
  alt: string;
  /** Lazy dynamic import function that resolves only when approaching viewport */
  imageLoader?: () => Promise<{ default: string }>;
  /** Optional direct image URL fallback */
  src?: string;
  /** IntersectionObserver rootMargin to start preloading before entering viewport */
  rootMargin?: string;
  /** Optional className applied to the <img /> element */
  imgClassName?: string;
  /** Optional className applied to the wrapper container */
  containerClassName?: string;
  /** If true, skips IntersectionObserver wait and preloads immediately (e.g., inside open modal) */
  priority?: boolean;
  /** Callback fired once the image is preloaded and decoded */
  onImageLoaded?: (resolvedUrl: string) => void;
}

/**
 * Custom Image Preloader utilizing the `IntersectionObserver` API to lazily import,
 * preload, and GPU-decode project thumbnails only when they approach the viewport.
 */
export const CyberImagePreloader: React.FC<CyberImagePreloaderProps> = React.memo(
  ({
    cacheKey,
    alt,
    imageLoader,
    src,
    rootMargin = '280px 0px',
    imgClassName = 'w-full h-full object-cover object-center',
    containerClassName = 'relative w-full h-full overflow-hidden bg-[#070414]',
    priority = false,
    onImageLoaded,
  }) => {
    const initialCached =
      PRELOADED_IMAGE_CACHE.get(cacheKey) || (src ? PRELOADED_IMAGE_CACHE.get(src) : undefined);

    const [resolvedSrc, setResolvedSrc] = useState<string | null>(initialCached || null);
    const [status, setStatus] = useState<'idle' | 'approaching' | 'loaded' | 'error'>(
      initialCached ? 'loaded' : 'idle'
    );

    const containerRef = useRef<HTMLDivElement | null>(null);
    const hasTriggeredRef = useRef<boolean>(Boolean(initialCached));

    useEffect(() => {
      const alreadyCached =
        PRELOADED_IMAGE_CACHE.get(cacheKey) || (src ? PRELOADED_IMAGE_CACHE.get(src) : undefined);

      if (alreadyCached) {
        hasTriggeredRef.current = true;
        setResolvedSrc(alreadyCached);
        setStatus('loaded');
        onImageLoaded?.(alreadyCached);
        return;
      }

      let isCancelled = false;

      const startPreload = async () => {
        if (hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;
        setStatus('approaching');

        try {
          let targetUrl = src || '';
          if (!targetUrl && imageLoader) {
            const mod = await imageLoader();
            targetUrl = mod.default;
          }

          if (!targetUrl) {
            if (!isCancelled) setStatus('error');
            return;
          }

          await decodeImageBitmap(targetUrl);
          PRELOADED_IMAGE_CACHE.set(cacheKey, targetUrl);
          PRELOADED_IMAGE_CACHE.set(targetUrl, targetUrl);

          if (!isCancelled) {
            setResolvedSrc(targetUrl);
            setStatus('loaded');
            onImageLoaded?.(targetUrl);
          }
        } catch {
          if (!isCancelled) {
            setStatus('error');
          }
        }
      };

      if (priority || typeof IntersectionObserver === 'undefined') {
        startPreload();
        return () => {
          isCancelled = true;
        };
      }

      const node = containerRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              observer.disconnect();
              startPreload();
              break;
            }
          }
        },
        {
          root: null,
          rootMargin,
          threshold: 0.01,
        }
      );

      observer.observe(node);

      return () => {
        isCancelled = true;
        observer.disconnect();
      };
    }, [cacheKey, imageLoader, src, rootMargin, priority, onImageLoaded]);

    return (
      <div ref={containerRef} className={containerClassName}>
        {/* Lightweight Cyber Preloader Skeleton shown before & during viewport approach */}
        {status !== 'loaded' && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-[#0b0620] via-[#120934] to-[#070414] select-none pointer-events-none"
          >
            <div className="w-7 h-7 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin mb-2" />
            <span className="text-[9px] font-mono tracking-widest uppercase text-cyan-300/75">
              {status === 'approaching' ? 'DECODING THUMBNAIL...' : 'STANDBY // IO PRELOADER'}
            </span>
          </div>
        )}

        {/* Decoded Thumbnail Image */}
        {resolvedSrc && (
          <img
            src={resolvedSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`${imgClassName} transition-opacity duration-500 ease-out ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>
    );
  }
);
