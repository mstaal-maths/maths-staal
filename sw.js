/* Ancienne adresse : ce service worker se désinstalle et laisse passer vers la nouvelle adresse */
self.addEventListener("install", e=>self.skipWaiting());
self.addEventListener("activate", e=>{ e.waitUntil(self.registration.unregister().then(()=>self.clients.matchAll()).then(cs=>cs.forEach(c=>c.navigate(c.url)))); });
