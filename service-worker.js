/* ─────────────────────────────────────────────────────
   thaiimg.com — Service Worker for PWA
   Strategy:
     - HTML pages: network-first (always fresh) → fallback to cache → offline page
     - Static assets (CSS, JS, images, fonts): cache-first → network → cache
     - 3rd-party (CDN libs, Google ads/analytics): network-only (don't cache)
   ───────────────────────────────────────────────────── */

const CACHE_VERSION = 'thaiimg-v1';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const PAGE_CACHE    = `${CACHE_VERSION}-pages`;

// Files to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/thai.css?v=13',
  '/sidebar.js?v=2',
  '/analytics.js?v=1',
  '/icons/logo.png?v=3',
  '/icons/logo-icon.png',
  '/icons/favicon-32.png?v=3',
  '/icons/favicon-192.png?v=3',
  '/icons/favicon-512.png?v=3',
  '/manifest.json'
];

// Install: pre-cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Precache failed (some assets may be missing):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET
  if (req.method !== 'GET') return;

  // Skip cross-origin (CDN, Google services) — let browser handle directly
  if (url.origin !== self.location.origin) return;

  // Skip Google Analytics/AdSense beacons even if same-origin
  if (url.pathname.startsWith('/g/') || url.search.includes('gtag')) return;

  // HTML pages: network-first
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Cache successful response
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => {
          // Network failed → try cache → fallback to home page
          return caches.match(req).then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Only cache successful, basic-typed responses
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const copy = res.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => {
        // Offline + not cached: just fail
        return new Response('', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
