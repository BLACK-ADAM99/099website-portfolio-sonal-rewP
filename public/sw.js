/* ============================================================================
 * APURBA BERA PORTFOLIO — OFFLINE-FIRST SERVICE WORKER (/sw.js)
 * Provides offline caching for app shell, Google Fonts, images, and SEO docs
 * ============================================================================ */

const CACHE_VERSION = 'apurba-cyber-pwa-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const FONTS_CACHE = `${CACHE_VERSION}-fonts`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/og-preview.jpg',
  '/llms.txt',
  '/llms-full.txt',
  '/apurba-bera-knowledge-graph.json',
  '/sitemap.xml',
  '/robots.txt',
  '/ai.txt',
  '/humans.txt',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, FONTS_CACHE].includes(key))
            .map((oldKey) => caches.delete(oldKey))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip browser extension or non-http requests
  if (!url.protocol.startsWith('http')) return;

  // 1. CacheFirst for Google Fonts stylesheets & font binaries
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(FONTS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response && (response.status === 200 || response.type === 'opaque')) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 2. NetworkFirst with Offline Cache Fallback for HTML Navigation requests
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage =
            (await caches.match(request)) ||
            (await caches.match('/index.html')) ||
            (await caches.match('/'));
          return cachedPage || Response.error();
        })
    );
    return;
  }

  // 3. Network-First for Vite dev source modules so HMR/code edits are never stale
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/src/') ||
      url.pathname.startsWith('/@') ||
      url.pathname.startsWith('/node_modules/'))
  ) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = (await cache.match(request)) || (await caches.match(request));
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 4. Stale-While-Revalidate for same-origin production assets, images & SEO/AI documents
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = (await cache.match(request)) || (await caches.match(request));
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached || Response.error());

        return cached || networkPromise;
      })
    );
  }
});
