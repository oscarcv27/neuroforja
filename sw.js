/**
 * NEUROFORJA 2.0 — Service Worker para Modo Offline en Móviles y Tablets (sw.js)
 */

const CACHE_NAME = 'neuroforja-v2-mobile-cache';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './icon.svg',
  './manifest.webmanifest',
  './js/core.js',
  './js/fx.js',
  './js/principles.js',
  './js/art.js',
  './js/fun.js',
  './js/games.js',
  './js/flow.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
