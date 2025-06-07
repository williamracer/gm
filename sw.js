const CACHE_NAME = 'fugitive-chase-v1';
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'game.js',
    'world-map.svg',
    // Adicione outros assets
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});