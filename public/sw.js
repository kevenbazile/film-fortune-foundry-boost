
const CACHE_NAME = 'scenevox-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/how-it-works',
  '/auth'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Only cache successful requests
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const notificationData = event.data.json();
    
    const options = {
      body: notificationData.body || 'New notification from SceneVox',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png'
    };

    event.waitUntil(
      self.registration.showNotification(
        notificationData.title || 'SceneVox Notification', 
        options
      )
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
