// ════════════════════════════════════════════════════
//  Mexico-Lingo Service Worker
//  — Offline caching
//  — Auto-update detection on startup
// ════════════════════════════════════════════════════

const CACHE_NAME   = 'mexicolingo-v1.3.0';
const APP_VERSION  = '1.3.0';

const ASSETS = [
  './index.html',
  './questions.js',
  './path.js',
  './app.js',
  './manifest.json',
  './version.json',
];

// ── Skip caching on localhost (dev mode) ──
const IS_LOCAL = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// ── Install: cache all assets ──
self.addEventListener('install', event => {
  self.skipWaiting(); // always activate immediately
  if (IS_LOCAL) return; // don't cache in dev
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ── Activate: delete old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first on localhost, cache-first in production ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // On localhost always fetch fresh from network — never serve stale cache
  if (IS_LOCAL) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// ── Message: version check request from app ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    checkForUpdate(event.source);
  }
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function checkForUpdate(client) {
  try {
    // Fetch version.json fresh from server (bypass cache)
    const res = await fetch('./version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const serverVersion = data.version;

    if (serverVersion !== APP_VERSION) {
      // New version on server — tell the app
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: serverVersion,
        notes: data.notes || '',
        current: APP_VERSION,
      });
    } else {
      client.postMessage({ type: 'UP_TO_DATE', version: APP_VERSION });
    }
  } catch (e) {
    // offline / server unreachable — no problem
  }
}
