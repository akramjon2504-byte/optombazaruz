import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Package, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Delivery() {
  const { language } = useLanguage();

  const content = {
    uz: {
      title: "Yetkazish va to'lov",
      description: "Buyurtmangizni tez va xavfsiz yetkazamiz",
      deliveryOptions: "Yetkazish variantlari",
      paymentMethods: "To'lov usullari",
      workingTime: "Ish vaqti",
      freeDelivery: "Bepul yetkazish",
      paidDelivery: "Pullik yetkazish",
      selfPickup: "O'zingiz olib ketish",
      cashOnDelivery: "Yetkazishda to'lov",
      cardPayment: "Karta orqali to'lov",
      bankTransfer: "Bank o'tkazmasi"
    },
    ru: {
      title: "Доставка и оплата",
      description: "Доставим ваш заказ быстро и безопасно",
      deliveryOptions: "Варианты доставки",
      paymentMethods: "Способы оплаты",
      workingTime: "Время работы",
      freeDelivery: "Бесплатная доставка",
      paidDelivery: "Платная доставка",
      selfPickup: "Самовывоз",
      cashOnDelivery: "Оплата при доставке",
      cardPayment: "Оплата картой",
      bankTransfer: "Банковский перевод"
    }
  };

  const t = content[language];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t.deliveryOptions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-600">{t.freeDelivery}</h3>
                  <p className="text-sm text-muted-foreground">
                    1,000,000 so'mdan yuqori buyurtmalar uchun
                  </p>
                  <Badge variant="secondary" className="mt-1">2-3 kun</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-600">{t.paidDelivery}</h3>
                  <p className="text-sm text-muted-foreground">
                    Toshkent bo'ylab - 50,000 so'm
                  </p>
                  <Badge variant="secondary" className="mt-1">1-2 kun</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-600">{t.selfPickup}</h3>
                  <p className="text-sm text-muted-foreground">
                    Bizning ofisimizdan bepul
                  </p>
                  <Badge variant="secondary" className="mt-1">Darhol</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t.paymentMethods}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t.cashOnDelivery}</h3>
                <p className="text-sm text-muted-foreground">
                  Mahsulotni olgandan so'ng to'lang
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t.cardPayment}</h3>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard, Humo, UzCard
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t.bankTransfer}</h3>
                <p className="text-sm text-muted-foreground">
                  Bank hisobiga o'tkazma
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Working Hours */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t.workingTime}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Buyurtmalarni qabul qilish</h3>
                <p className="text-sm">Dushanba - Yakshanba: 24/7</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Yetkazish vaqti</h3>
                <p className="text-sm">Dushanba - Shanba: 09:00 - 20:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}