self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('finance-app').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/balanco.html',
                '/dre.html',
                '/liquidez.html',
                '/estrutura.html',
                '/style.css',
                '/app.js',
                '/manifest.json',
                '/icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
