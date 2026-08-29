// Service Worker for meal-summary PWA
// Minimal SW — just enough for installability, no aggressive caching

const CACHE_NAME = 'meal-summary-v2';

// Install — skip waiting for immediate activation
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activate — claim all clients immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((names) => {
        return Promise.all(names.map(n => caches.delete(n)));
      })
    ])
  );
});

// Fetch — only handle same-origin GET requests, pass everything else through
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip cross-origin (Firebase, Google Fonts, CDNs) — let browser handle
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // For same-origin requests, just fetch from network (no caching of data)
  // This ensures deleted records never come back from cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
