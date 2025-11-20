
const CACHE_NAME = 'career-health-v6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json?v=2.0',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // 1. Network First
        const networkResponse = await fetch(event.request);
        
        // Check if we got a valid response
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }
        
        throw new Error('Network response was not ok');
      } catch (error) {
        // 2. Cache Fallback
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }

        // 3. Navigation Fallback (The Critical Fix for SPA/PWA 404s)
        // If the user navigates to ANY URL and it fails (offline or 404), show index.html
        if (event.request.mode === 'navigate') {
          const index = await cache.match('./index.html');
          return index || cache.match('./');
        }

        // Return a simple error response if absolutely nothing works
        return new Response('OFFLINE', { status: 503, statusText: 'Service Unavailable' });
      }
    })()
  );
});
