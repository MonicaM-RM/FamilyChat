const CACHE_NAME = 'familychat-v4';

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

// Fetch - Dejar pasar todo sin interceptar (evita problemas de cache)
self.addEventListener('fetch', (event) => {
  // No hacer nada, dejar que el navegador maneje todo normalmente
  return;
});

// Manejar notificaciones desde la página
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = event.data;
    
    self.registration.showNotification(title, {
      body: body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: tag,
      renotify: true,
      vibrate: [200, 100, 200]
    });
  }
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('./index.html');
        }
      })
  );
});
