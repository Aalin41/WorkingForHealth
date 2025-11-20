
const CACHE_NAME = 'career-health-v5'; // Updated to v5
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
  self.skipWaiting();
});

// Activate event
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

// Fetch event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      try {
        // 1. Network First
        const networkResponse = await fetch(event.request);

        // 404 Handling for Navigation
        if (networkResponse.status === 404 && event.request.mode === 'navigate') {
           throw new Error('404 Navigation Fallback');
        }

        if (networkResponse.ok && event.request.url.startsWith(self.location.origin)) {
             cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;

      } catch (error) {
        // 2. Cache / Fallback Strategy
        
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 3. SPA Navigation Fallback (Crucial for start_url: ./index.html)
        if (event.request.mode === 'navigate') {
          const index = await cache.match('./index.html');
          if (index) return index;
          
          const root = await cache.match('./');
          if (root) return root;
        }

        throw error;
      }
    })()
  );
});
