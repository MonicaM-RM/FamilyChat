const CACHE_NAME = 'familychat-v5';

// Install - Activar inmediatamente
self.addEventListener('install', (event) => {
  console.log('SW: Instalando...');
  self.skipWaiting();
});

// Activate - Tomar control inmediatamente
self.addEventListener('activate', (event) => {
  console.log('SW: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Dejar pasar todo sin interceptar
self.addEventListener('fetch', (event) => {
  return;
});
