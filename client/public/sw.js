// Optombazar Service Worker - PWA Offline Support
const CACHE_NAME = 'optombazar-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline mode
const CACHE_ASSETS = [
  '/',
  '/catalog',
  '/cart',
  '/blog',
  '/contact',
  '/help',
  OFFLINE_URL,
  '/manifest.json',
  // Add critical CSS and JS files that Vite generates
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/categories',
  '/api/products',
  '/api/blog'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('🔧 Optombazar SW: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🔧 Optombazar SW: Caching assets...');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('✅ Optombazar SW: Assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error('❌ Optombazar SW: Cache failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('🚀 Optombazar SW: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Optombazar SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Optombazar SW: Activated successfully');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    handleFetchRequest(event.request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. Try network first for API calls (fresh data preferred)
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request);
    }
    
    // 2. Try network first for navigation requests
    if (request.mode === 'navigate') {
      return await handleNavigationRequest(request);
    }
    
    // 3. Cache first for static assets
    return await handleStaticAssetRequest(request);
    
  } catch (error) {
    console.error('❌ Optombazar SW: Fetch failed:', error);
    return await handleOfflineResponse(request);
  }
}

// Handle API requests - network first, cache fallback
async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests for API data
    if (networkResponse.ok && shouldCacheApiResponse(request.url)) {
      cache.put(request, networkResponse.clone());
      console.log('📡 Optombazar SW: API cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed - try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('📱 Optombazar SW: API from cache:', request.url);
      return cachedResponse;
    }
    
    // No cache available - return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Internet aloqasi yo\'q', 
        offline: true,
        message: 'Ma\'lumotlarni olish uchun internetga ulaning'
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }
    );
  }
}

// Handle navigation requests - network first
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful navigation responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed - try cache, then offline page
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return cache.match(OFFLINE_URL) || new Response('Offline');
  }
}

// Handle static assets - cache first
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Serve from cache, update in background
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    }).catch(() => {
      // Network update failed, but we have cache
    });
    
    return cachedResponse;
  }
  
  // Not in cache - try network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return await handleOfflineResponse(request);
  }
}

// Handle offline responses
async function handleOfflineResponse(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try to find any cached version
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await cache.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // Generic offline response
  return new Response('Sahifa offline rejimida mavjud emas', {
    status: 503,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

// Check if API response should be cached
function shouldCacheApiResponse(url) {
  return API_CACHE_PATTERNS.some(pattern => url.includes(pattern));
}

// Push notification event
self.addEventListener('push', event => {
  console.log('🔔 Optombazar SW: Push received:', event);
  
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Yangi xabar',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      image: data.image,
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'open',
          title: 'Ochish',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Yopish'
        }
      ],
      requireInteraction: true,
      silent: false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Optombazar', options)
    );
  } catch (error) {
    console.error('❌ Optombazar SW: Push notification failed:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('🔔 Optombazar SW: Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'close') return;
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (let client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync event
self.addEventListener('sync', event => {
  console.log('🔄 Optombazar SW: Background sync:', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }
  
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOrderData());
  }
});

// Sync cart data when online
async function syncCartData() {
  try {
    // Get pending cart operations from IndexedDB
    // Send to server when online
    console.log('🛒 Optombazar SW: Syncing cart data...');
  } catch (error) {
    console.error('❌ Optombazar SW: Cart sync failed:', error);
  }
}

// Sync order data when online
async function syncOrderData() {
  try {
    // Get pending orders from IndexedDB
    // Send to server when online
    console.log('📦 Optombazar SW: Syncing order data...');
  } catch (error) {
    console.error('❌ Optombazar SW: Order sync failed:', error);
  }
}