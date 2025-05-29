
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('finance-app-v2').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './style.css',
                './manifest.json',
                './balanco.html',
                './dre.html',
                './liquidez.html',
                './estrutura.html',
                './app.js',
                './icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
