import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePWA } from '@/hooks/use-pwa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, BellOff, X } from 'lucide-react';

interface PushNotificationsProps {
  className?: string;
}

export default function PushNotifications({ className }: PushNotificationsProps) {
  const { isSupported } = usePWA();
  const { t } = useLanguage();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if notifications are default and user hasn't dismissed
      const dismissed = localStorage.getItem('push-notifications-dismissed');
      if (Notification.permission === 'default' && !dismissed) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert(t('notificationsNotSupported') || 'Bildirishnomalar qo\'llab-quvvatlanmaydi');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeUser();
        setShowPrompt(false);
        
        // Show test notification with smaller font
        new Notification('OptomBazar', {
          body: t('notificationsEnabled') || 'Bildirishnomalar yoqildi! Aksiyalardan birinchi bo\'lib xabardor bo\'ling.',
          icon: '/icons/icon-192x192.svg',
          badge: '/icons/icon-72x72.svg',
          tag: 'optombazar-notification'
        });
      }
    } catch (error) {
      console.error('Push notification permission failed:', error);
    }
  };

  const subscribeUser = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Already subscribed to push notifications');
        return;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertVapidKey(getVapidPublicKey())
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      console.log('✅ Push subscription successful');
    } catch (error) {
      console.error('❌ Push subscription failed:', error);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('push-notifications-dismissed', Date.now().toString());
  };

  if (!isSupported || !showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <div className={`fixed bottom-20 left-4 right-4 z-40 animate-in slide-in-from-bottom-full duration-500 ${className}`}>
      <Card className="border-orange-200 bg-orange-50/95 backdrop-blur-lg shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-orange-900">
                  {t('enableNotifications') || 'Bildirishnomalarni yoqish'}
                </CardTitle>
                <CardDescription className="text-sm text-orange-700">
                  {t('notificationsDescription') || 'Aksiyalar va yangiliklar haqida birinchi bo\'lib bilib oling'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissPrompt}
              className="h-8 w-8 p-0 text-orange-400 hover:text-orange-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={requestNotificationPermission}
              size="sm"
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              <Bell className="h-4 w-4 mr-2" />
              {t('enable') || 'Yoqish'}
            </Button>
            <Button
              variant="outline"
              onClick={dismissPrompt}
              size="sm"
              className="border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              {t('later') || 'Keyinroq'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getVapidPublicKey(): string {
  // This should be your VAPID public key
  // For demo purposes, using a placeholder
  return 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NcvQcp7oNa2TQ';
}

function convertVapidKey(vapidKey: string): Uint8Array {
  const padding = '='.repeat((4 - vapidKey.length % 4) % 4);
  const base64 = (vapidKey + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    
  const rawData = window.atob(base64);
  return new Uint8Array(Array.from(rawData).map(char => char.charCodeAt(0)));
}