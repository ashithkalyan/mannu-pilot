const C = 'mannu-gh-v1', A = ['./', 'index.html', 'app.mjs', 'manifest.json', 'icon-192.png', './engine/engine.mjs', './engine/norms.mjs', './engine/i18n.mjs', './engine/intent.mjs', 'mannu-shell.css', 'mannu-shell.mjs', 'mapping.html', 'mapping.mjs', 'live.html', 'live.mjs', 'reports.html', 'reports.mjs', 'community.html', 'community.mjs', 'finance.html', 'finance.mjs', 'mannu-events.mjs', 'offline.html', 'mannu-assistant.js', 'mannu-assistant.css'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(A.map((u) => new URL(u, self.location)))).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.pathname.startsWith('/api/') || u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(C).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
