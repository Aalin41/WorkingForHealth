
const CACHE_NAME = 'career-health-v4'; // Updated to v4
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
      // We intentionally cache './' and 'index.html' separately to cover bases
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
  // Basic check to avoid caching weird chrome-extension requests or non-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      try {
        // 1. Network First
        const networkResponse = await fetch(event.request);

        // CRITICAL FIX: 
        // If the server returns 404 (or any 4xx/5xx), treat it as a failure for navigation requests.
        // Fetch only rejects on network error, not on 404. We must handle this manually.
        if (networkResponse.status === 404 && event.request.mode === 'navigate') {
           throw new Error('404 Navigation Fallback');
        }

        // If network is good, update cache (optional for assets, but good for freshness)
        // We only clone if it's a valid response
        if (networkResponse.ok && event.request.url.startsWith(self.location.origin)) {
             cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;

      } catch (error) {
        // 2. Cache / Fallback Strategy
        
        // First, try to find the exact match in cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 3. SPA Navigation Fallback
        // If it's a navigation request (user changing pages or opening app) and network failed/404'd
        if (event.request.mode === 'navigate') {
          // Try to serve the main index.html
          const index = await cache.match('./index.html');
          if (index) return index;
          
          // Last ditch effort: try root
          const root = await cache.match('./');
          if (root) return root;
        }

        // If nothing works, let the error propagate (standard browser offline page)
        throw error;
      }
    })()
  );
});
