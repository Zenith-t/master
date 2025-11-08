// Service Worker with notification click + optional push
const CACHE_NAME = "healthcare-plus-v2";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/","/offline.html","/manifest.json","/icon-192.png","/icon-512.png"])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match(OFFLINE_URL)))
  );
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification?.data?.url || "/";
  event.notification?.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { try { await c.navigate(url); await c.focus(); return; } catch {} }
    await self.clients.openWindow(url);
  })());
});

// Optional Web Push payload: { title, body, url }
self.addEventListener("push", (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "New update";
    const body = data.body || "";
    const url = data.url || "/";
    event.waitUntil(
      self.registration.showNotification(title, {
        body, icon: "/icon-192.png", badge: "/icon-192.png", data: { url }, tag: "new-listing"
      })
    );
  } catch {}
});
