// Service Worker for index.html (admin app)
// Minimal SW — just for installability, no aggressive caching
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(n => Promise.all(n.map(c => caches.delete(c))))]));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
