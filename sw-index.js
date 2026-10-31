// Service Worker — PWA installable
const CACHE_NAME = 'canteen-v1';
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([
      '/',
      '/index.html',
      '/icons/icon-192x192.png',
      '/icons/icon-512x512.png'
    ]).catch(() => {}))
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(names => Promise.all(names.map(n => { if(n !== CACHE_NAME) return caches.delete(n); })))
    ])
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
