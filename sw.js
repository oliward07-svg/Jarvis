const CACHE = 'jarvis-v2';
const PRECACHE = [
  './',
  './index.html',
  './health.html',
  './water.html',
  './steps.html',
  './gym.html',
  './topbar.js',
  './manifest.json',
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: always try to fetch fresh, fall back to cache when offline
self.addEventListener('fetch', evt => {
  if (!evt.request.url.startsWith(self.location.origin)) return;
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    fetch(evt.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(evt.request, clone));
        return response;
      })
      .catch(() => caches.match(evt.request))
  );
});
