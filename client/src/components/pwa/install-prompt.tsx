import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePWA } from '@/hooks/use-pwa';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, X, Smartphone, Zap, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstallPromptProps {
  className?: string;
}

export default function InstallPrompt({ className }: InstallPromptProps) {
  const { install, showInstallPrompt, dismissInstallPrompt, isInstallable } = usePWA();
  const { t } = useLanguage();
  const [isInstalling, setIsInstalling] = useState(false);

  if (!showInstallPrompt || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      await install();
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className={cn("fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-full duration-500", className)}>
      <Card className="border-primary/20 bg-white/95 backdrop-blur-lg shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {t('installApp')} 
                  <Badge variant="secondary" className="text-xs">PWA</Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  {t('installAppDescription')}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissInstallPrompt}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center text-center p-2">
              <Zap className="h-4 w-4 text-amber-500 mb-1" />
              <span className="text-xs text-gray-600">{t('faster')}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <Wifi className="h-4 w-4 text-blue-500 mb-1" />
              <span className="text-xs text-gray-600">{t('offline')}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <Smartphone className="h-4 w-4 text-green-500 mb-1" />
              <span className="text-xs text-gray-600">{t('appLike')}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isInstalling ? t('installing') : t('install')}
            </Button>
            <Button
              variant="outline"
              onClick={dismissInstallPrompt}
              size="sm"
            >
              {t('later')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}