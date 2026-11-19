const CACHE_NAME = 'saif-cyber-shell-v1';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const asset of APP_SHELL) {
      try { await cache.add(asset); }
      catch (error) { console.warn('Could not cache app asset:', asset, error); }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('saif-cyber-shell-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Keep authentication, Supabase APIs, and all cross-origin requests network-only.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && /\.(html|css|js|png|webmanifest)$/.test(url.pathname)) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || new Response(
          'أنت غير متصل بالإنترنت. افتح التطبيق عند عودة الاتصال.',
          {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}}
        );
      }
      throw error;
    }
  })());
});
