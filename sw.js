---
layout: null
sitemap: false
---
// Service Worker - stale-while-revalidate with bounded runtime caches
const CACHE_VERSION = 'v2';
const STATIC_CACHE = 'velkris-static-' + CACHE_VERSION;
const PAGE_CACHE = 'velkris-pages-' + CACHE_VERSION;
const ASSET_CACHE = 'velkris-assets-' + CACHE_VERSION;
const OFFLINE_URL = '/';
const MAX_PAGE_ENTRIES = 60;
const MAX_ASSET_ENTRIES = 160;
const PRECACHE_URLS = [
  '/',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/about/',
  '/projects/',
  '/tags/',
  '/search/',
  '/search.json'
];

function limitCacheEntries(cacheName, maxEntries) {
  return caches.open(cacheName).then(function (cache) {
    return cache.keys().then(function (keys) {
      if (keys.length <= maxEntries) return Promise.resolve();
      var deletions = keys.slice(0, keys.length - maxEntries).map(function (key) {
        return cache.delete(key);
      });
      return Promise.all(deletions);
    });
  });
}

function putIfCacheable(cacheName, request, response, maxEntries) {
  if (!response || !response.ok || response.type === 'opaque') return Promise.resolve();
  return caches.open(cacheName).then(function (cache) {
    return cache.put(request, response.clone()).then(function () {
      return limitCacheEntries(cacheName, maxEntries);
    });
  });
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key !== STATIC_CACHE && key !== PAGE_CACHE && key !== ASSET_CACHE;
          })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

function staleWhileRevalidate(event, request, cacheName, maxEntries) {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return cache.match(request).then(function (cached) {
        var networkFetch = fetch(request)
          .then(function (response) {
            event.waitUntil(putIfCacheable(cacheName, request, response, maxEntries));
            return response;
          })
          .catch(function () {
            return cached || caches.match(OFFLINE_URL);
          });

        return cached || networkFetch;
      });
    })
  );
}

self.addEventListener('fetch', function (event) {
  var request = event.request;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  var destination = request.destination;
  var acceptsHtml = (request.headers.get('accept') || '').indexOf('text/html') !== -1;
  var isPage = request.mode === 'navigate' || acceptsHtml;
  var isAsset =
    destination === 'style' ||
    destination === 'script' ||
    destination === 'image' ||
    destination === 'font';

  if (isPage) {
    staleWhileRevalidate(event, request, PAGE_CACHE, MAX_PAGE_ENTRIES);
    return;
  }

  if (isAsset) {
    staleWhileRevalidate(event, request, ASSET_CACHE, MAX_ASSET_ENTRIES);
    return;
  }

  staleWhileRevalidate(event, request, STATIC_CACHE, MAX_ASSET_ENTRIES);
});
