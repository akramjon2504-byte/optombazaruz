import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Help() {
  const { language } = useLanguage();

  const content = {
    uz: {
      title: "Yordam",
      description: "Tez-tez so'raladigan savollar va yordam",
      faq: "FAQ",
      contact: "Aloqa",
      needHelp: "Yordamga muhtojmisiz?",
      callUs: "Qo'ng'iroq qiling",
      writeUs: "Yozing"
    },
    ru: {
      title: "Помощь",
      description: "Часто задаваемые вопросы и помощь",
      faq: "FAQ",
      contact: "Контакты",
      needHelp: "Нужна помощь?",
      callUs: "Позвонить",
      writeUs: "Написать"
    }
  };

  const t = content[language];

  const faqs = [
    {
      question: language === 'uz' ? "Qanday buyurtma berish mumkin?" : "Как сделать заказ?",
      answer: language === 'uz' 
        ? "Mahsulotni tanlang, savatga qo'shing va to'lov sahifasiga o'ting. Barcha kerakli ma'lumotlarni to'ldiring va buyurtmani tasdiqlang."
        : "Выберите товар, добавьте в корзину и перейдите к оплате. Заполните необходимую информацию и подтвердите заказ."
    },
    {
      question: language === 'uz' ? "Yetkazish qancha vaqt oladi?" : "Сколько времени занимает доставка?",
      answer: language === 'uz'
        ? "Toshkent bo'ylab 1-2 kun, viloyatlarga 3-5 kun. Bepul yetkazish 1,000,000 so'mdan yuqori buyurtmalar uchun."
        : "По Ташкенту 1-2 дня, по регионам 3-5 дней. Бесплатная доставка для заказов свыше 1 000 000 сум."
    },
    {
      question: language === 'uz' ? "Qanday to'lov usullari mavjud?" : "Какие способы оплаты доступны?",
      answer: language === 'uz'
        ? "Naqd to'lov, kartalar (Visa, Mastercard, Humo, UzCard), bank o'tkazmalari va yetkazishda to'lov."
        : "Наличные, карты (Visa, Mastercard, Humo, UzCard), банковские переводы и оплата при доставке."
    },
    {
      question: language === 'uz' ? "Mahsulotni qaytarish mumkinmi?" : "Можно ли вернуть товар?",
      answer: language === 'uz'
        ? "Ha, 14 kun ichida sifatsiz mahsulotlarni qaytarish mumkin. Mahsulot asl holatida va qadoqda bo'lishi kerak."
        : "Да, в течение 14 дней можно вернуть некачественный товар. Товар должен быть в оригинальном состоянии и упаковке."
    },
    {
      question: language === 'uz' ? "Optom narxlar qanday aniqlanadi?" : "Как определяются оптовые цены?",
      answer: language === 'uz'
        ? "Optom narxlar miqdorga qarab belgilanadi. Ko'proq miqdorda olinganda narx arzonroq bo'ladi."
        : "Оптовые цены определяются в зависимости от количества. Чем больше объём, тем ниже цена."
    },
    {
      question: language === 'uz' ? "Sertifikatlar va kafolatlar bormi?" : "Есть ли сертификаты и гарантии?",
      answer: language === 'uz'
        ? "Barcha mahsulotlar sertifikatga ega va kafolat bilan ta'minlanadi. Kafolat muddati mahsulotga qarab belgilanadi."
        : "Все товары имеют сертификаты и обеспечены гарантией. Срок гарантии устанавливается в зависимости от товара."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t.faq}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t.needHelp}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' 
                    ? "Savolingiz javobini topa olmadingizmi? Biz bilan bog'laning!"
                    : "Не нашли ответ на свой вопрос? Свяжитесь с нами!"
                  }
                </p>

                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <a href="tel:+998901234567">
                      <Phone className="h-4 w-4 mr-2" />
                      {t.callUs}: +998 90 123 45 67
                    </a>
                  </Button>

                  <Button className="w-full justify-start" variant="outline" asChild>
                    <a href="mailto:info@optombazar.uz">
                      <Mail className="h-4 w-4 mr-2" />
                      {t.writeUs}: info@optombazar.uz
                    </a>
                  </Button>

                  <Button className="w-full" asChild>
                    <a href="/contact">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {language === 'uz' ? "Xabar yuborish" : "Отправить сообщение"}
                    </a>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">
                    {language === 'uz' ? "Ish vaqti" : "Время работы"}
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Dushanba - Juma: 09:00 - 18:00</p>
                    <p>Shanba: 09:00 - 15:00</p>
                    <p>Yakshanba: Dam olish</p>
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