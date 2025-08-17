import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Contact() {
  const { language } = useLanguage();

  const content = {
    uz: {
      title: "Aloqa",
      description: "Bizga murojaat qiling",
      name: "Ism",
      email: "Email",
      phone: "Telefon",
      message: "Xabar",
      send: "Yuborish",
      contactInfo: "Aloqa ma'lumotlari",
      workTime: "Ish vaqti",
      address: "Manzil"
    },
    ru: {
      title: "Контакты",
      description: "Свяжитесь с нами",
      name: "Имя",
      email: "Email",
      phone: "Телефон", 
      message: "Сообщение",
      send: "Отправить",
      contactInfo: "Контактная информация",
      workTime: "Время работы",
      address: "Адрес"
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
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.name}</Label>
                <Input id="name" data-testid="input-contact-name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input id="email" type="email" data-testid="input-contact-email" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input id="phone" data-testid="input-contact-phone" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">{t.message}</Label>
                <Textarea id="message" rows={5} data-testid="textarea-contact-message" />
              </div>
              
              <Button className="w-full" data-testid="button-send-message">
                {t.send}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">+998 90 123 45 67</p>
                    <p className="text-sm text-muted-foreground">Asosiy raqam</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">info@optombazar.uz</p>
                    <p className="text-sm text-muted-foreground">Email manzil</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Toshkent, O'zbekiston</p>
                    <p className="text-sm text-muted-foreground">{t.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t.workTime}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Dushanba - Juma</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shanba</span>
                    <span>09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yakshanba</span>
                    <span className="text-muted-foreground">Dam olish</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}