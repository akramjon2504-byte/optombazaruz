import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface PromoTimer {
  id: string;
  name: string;
  endDate: string;
  isActive: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function DiscountTimer() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const { data: timer } = useQuery<PromoTimer>({
    queryKey: ["/api/promo-timer"],
  });

  useEffect(() => {
    if (!timer?.endDate) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(timer.endDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (!timer || !timer.isActive) {
    return null;
  }

  return (
    <div className="flex justify-center mb-10">
      <Card className="bg-white/20 backdrop-blur-sm timer-glow">
        <CardContent className="p-6">
          <div className="flex space-x-6 text-center text-white" data-testid="discount-timer">
            <div>
              <div className="text-3xl font-bold" data-testid="timer-days">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm">{t("days")}</div>
            </div>
            <div className="text-3xl font-bold">:</div>
            <div>
              <div className="text-3xl font-bold" data-testid="timer-hours">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm">{t("hours")}</div>
            </div>
            <div className="text-3xl font-bold">:</div>
            <div>
              <div className="text-3xl font-bold" data-testid="timer-minutes">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm">{t("minutes")}</div>
            </div>
            <div className="text-3xl font-bold">:</div>
            <div>
              <div className="text-3xl font-bold" data-testid="timer-seconds">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm">{t("seconds")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
