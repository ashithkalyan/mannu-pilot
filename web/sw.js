const C = 'mannu-v1', A = ['./', 'app.mjs', 'manifest.json', 'icon-192.png', '../engine/engine.mjs', '../engine/norms.mjs', '../engine/i18n.mjs', '../engine/intent.mjs'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(A.map((u) => new URL(u, self.location)))).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => { const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.pathname.startsWith('/api/')) return; e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request))); });
