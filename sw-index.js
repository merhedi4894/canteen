// Service Worker for index.html (admin app)
// Minimal SW — just for installability, no aggressive caching

self.addEventListener('install', (event) => {
  console.log('[SW-index] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW-index] Activated');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((names) => Promise.all(names.map(n => caches.delete(n))))
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Skip cross-origin (Firebase, Google Fonts, CDNs)
  if (url.origin !== self.location.origin) return;
  // Network-first for same-origin — no caching of data
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
