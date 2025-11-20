
const CACHE_NAME = 'career-health-v3'; // Increment version to force update
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force waiting service worker to become active immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
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
  // Claim clients immediately so the first load is controlled
  self.clients.claim();
});

// Fetch event - Robust SPA Strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like Google Fonts/Tailwind) for complex logic, 
  // just use simple cache-first or network-first for them.
  if (!event.request.url.startsWith(self.location.origin) && !ASSETS_TO_CACHE.some(url => event.request.url.includes(url))) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Network First strategy
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // If network fails (Offline), try the cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // SPA Navigation Fallback:
        // If it's a navigation request (HTML) and network failed + not in cache,
        // return the main index.html (App Shell).
        if (event.request.mode === 'navigate') {
          const indexCache = await caches.match('./index.html');
          if (indexCache) return indexCache;
        }

        // If nothing works, throw the error
        throw error;
      }
    })()
  );
});
