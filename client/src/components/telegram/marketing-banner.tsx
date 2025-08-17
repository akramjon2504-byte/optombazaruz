import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Send, X } from "lucide-react";

export default function MarketingBanner() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  const handleJoin = () => {
    // Open Telegram channel
    window.open("https://t.me/optombazar_uz", "_blank");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl max-w-xs">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <Send className="w-6 h-6 mr-2" />
            <span className="font-bold">{t("telegramChannel")}</span>
          </div>
          <p className="text-sm mb-3 text-blue-100">
            {t("latestOffers")}
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={handleJoin}
              variant="secondary"
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100"
              data-testid="button-join-telegram"
            >
              {t("join")}
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-blue-200 hover:text-white hover:bg-blue-700"
              data-testid="button-close-telegram-banner"
            >
              {t("close")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
