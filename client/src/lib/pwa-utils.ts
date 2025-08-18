// PWA Utility Functions for Optombazar

export interface PWAInstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWADisplayMode {
  isStandalone: boolean;
  isMinimalUI: boolean;
  isBrowser: boolean;
  isFullscreen: boolean;
}

export interface PWANetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType: string;
  downlink: number;
}

// Check if PWA is installed
export function isPWAInstalled(): boolean {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check iOS standalone mode
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  // Check if launched from home screen
  const isLaunchedFromHomeScreen = document.referrer === '' || document.referrer.includes('android-app://');
  
  return isStandalone || isIOSStandalone || isLaunchedFromHomeScreen;
}

// Get PWA display mode
export function getPWADisplayMode(): PWADisplayMode {
  return {
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isMinimalUI: window.matchMedia('(display-mode: minimal-ui)').matches,
    isBrowser: window.matchMedia('(display-mode: browser)').matches,
    isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches
  };
}

// Get network status
export function getNetworkStatus(): PWANetworkStatus {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    isOnline: navigator.onLine,
    isSlowConnection: connection ? connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' : false,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0
  };
}

// Register for push notifications
export async function registerPushNotifications(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    console.log('Push messaging is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey())
    });

    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

// Show local notification
export function showLocalNotification(title: string, options: NotificationOptions = {}): void {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-72x72.svg',
      ...options
    });
  }
}

// Cache management
export async function clearPWACache(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('✅ PWA cache cleared');
  }
}

export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) return 0;
  
  let totalSize = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Background sync
export function requestBackgroundSync(tag: string): void {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(registration => {
      return (registration as any).sync.register(tag);
    }).catch(error => {
      console.error('Background sync registration failed:', error);
    });
  }
}

// Share API
export async function shareContent(data: ShareData): Promise<boolean> {
  if ('share' in navigator) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.log('Share failed:', error);
      return false;
    }
  }
  
  // Fallback to clipboard
  if ('clipboard' in navigator && data.url) {
    try {
      await navigator.clipboard.writeText(data.url);
      return true;
    } catch (error) {
      console.log('Clipboard write failed:', error);
      return false;
    }
  }
  
  return false;
}

// App shortcuts
export function addAppShortcut(shortcut: any): void {
  // This would typically be handled by the manifest.json
  console.log('App shortcut:', shortcut);
}

// Helper functions
function getVapidPublicKey(): string {
  // This should be your actual VAPID public key from environment
  return import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NcvQcp7oNa2TQGUgfJxm2R2UU_mC5I4l-FKUl7s-6V7xD0KZv4z_g2Q';
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Performance monitoring
export function measurePWAPerformance(): void {
  if ('performance' in window && 'getEntriesByType' in performance) {
    // Measure key metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      networkType: (navigator as any).connection?.effectiveType || 'unknown'
    };
    
    console.log('📊 Optombazar PWA Performance:', metrics);
  }
}