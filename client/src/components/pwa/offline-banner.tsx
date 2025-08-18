import { usePWA } from '@/hooks/use-pwa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineBannerProps {
  className?: string;
}

export default function OfflineBanner({ className }: OfflineBannerProps) {
  const { isOffline } = usePWA();
  const { t } = useLanguage();

  if (!isOffline) {
    return null;
  }

  return (
    <Alert className={cn("border-amber-200 bg-amber-50 text-amber-800", className)}>
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{t('offlineMode')}</span>
        <div className="text-xs flex items-center gap-1 opacity-75">
          <Wifi className="h-3 w-3" />
          {t('willSyncWhenOnline')}
        </div>
      </AlertDescription>
    </Alert>
  );
}