
const CACHE_NAME = 'career-health-offline-v7';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json?v=2.0',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// 1. 安裝 Service Worker 並立即快取所有核心檔案
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching app shell');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // 強制讓新版 SW 接管
});

// 2. 啟動時清理舊快取
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // 立即控制所有頁面
});

// 3. 攔截請求：採取「快取優先」策略，解決 404 問題
self.addEventListener('fetch', (event) => {
  // 忽略非 GET 請求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // A. 針對導航請求 (HTML 頁面)，優先回傳 index.html
      // 這是讓 PWA 像 Native App 一樣運作的關鍵
      if (event.request.mode === 'navigate') {
        const cachedIndex = await cache.match('./index.html');
        if (cachedIndex) {
          return cachedIndex;
        }
        // 如果快取也沒有 (第一次)，才去網路抓
        try {
          return await fetch(event.request);
        } catch (error) {
          // 真的沒網路時的最後一道防線
          return new Response('App Offline', { status: 503 });
        }
      }

      // B. 針對資源請求 (JS, CSS, Images)
      // 先看快取有沒有
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // 沒快取才去網路抓，抓完順便存起來
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // 網路失敗，回傳 404 或空白
        return new Response(null, { status: 404 });
      }
    })()
  );
});
