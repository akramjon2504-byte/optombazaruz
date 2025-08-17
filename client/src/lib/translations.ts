export interface Translation {
  uz: string;
  ru: string;
}

export interface Translations {
  // Header
  phone: Translation;
  email: Translation;
  login: Translation;
  register: Translation;
  search: Translation;
  searchPlaceholder: Translation;
  cart: Translation;
  cartTotal: Translation;

  // Navigation  
  categories: Translation;
  promotions: Translation;
  hitProducts: Translation;
  newProducts: Translation;
  blog: Translation;
  contact: Translation;

  // Hero
  heroTitle: Translation;
  heroSubtitle: Translation;
  viewCatalog: Translation;
  aiAssistant: Translation;

  // Categories
  mainCategories: Translation;
  products: Translation;

  // Products
  addToCart: Translation;
  viewAll: Translation;
  rating: Translation;
  reviews: Translation;
  priceFrom: Translation;

  // Promo
  flashSale: Translation;
  limitedOffer: Translation;
  days: Translation;
  hours: Translation;
  minutes: Translation;
  seconds: Translation;

  // Features
  whyOptomBazar: Translation;
  ourAdvantages: Translation;
  aiHelper: Translation;
  aiHelperDesc: Translation;
  fastDelivery: Translation;
  fastDeliveryDesc: Translation;
  qualityGuarantee: Translation;
  qualityGuaranteeDesc: Translation;
  support24: Translation;
  support24Desc: Translation;

  // Footer
  aboutCompany: Translation;
  aboutDesc: Translation;
  forCustomers: Translation;
  delivery: Translation;
  payment: Translation;
  returns: Translation;
  help: Translation;
  allRights: Translation;
  privacyPolicy: Translation;
  termsOfUse: Translation;

  // Chat
  chatTitle: Translation;
  chatPlaceholder: Translation;
  chatGreeting: Translation;

  // Telegram
  telegramChannel: Translation;
  latestOffers: Translation;
  join: Translation;
  close: Translation;

  // Common
  loading: Translation;
  error: Translation;
  noResults: Translation;
  tryAgain: Translation;
}

export const translations: Translations = {
  phone: { uz: "+998 71 123-45-67", ru: "+998 71 123-45-67" },
  email: { uz: "info@optombazar.uz", ru: "info@optombazar.uz" },
  login: { uz: "Kirish", ru: "Вход" },
  register: { uz: "Ro'yxatdan o'tish", ru: "Регистрация" },
  search: { uz: "Qidirish", ru: "Поиск" },
  searchPlaceholder: { uz: "Mahsulot qidirish...", ru: "Поиск товаров..." },
  cart: { uz: "Savat", ru: "Корзина" },
  cartTotal: { uz: "Savat:", ru: "Корзина:" },

  categories: { uz: "Kategoriyalar", ru: "Категории" },
  promotions: { uz: "Aksiyalar", ru: "Акции" },
  hitProducts: { uz: "Hit mahsulotlar", ru: "Хит товары" },
  newProducts: { uz: "Yangi mahsulotlar", ru: "Новые товары" },
  blog: { uz: "Blog", ru: "Блог" },
  contact: { uz: "Aloqa", ru: "Контакты" },

  heroTitle: { uz: "O'zbekiston optom bozori", ru: "Оптовый рынок Узбекистана" },
  heroSubtitle: { uz: "Eng yaxshi mahsulotlarni eng qulay narxlarda! AI yordamchisi bilan 24/7 xizmat.", ru: "Лучшие товары по самым выгодным ценам! Сервис 24/7 с помощником AI." },
  viewCatalog: { uz: "Katalogni ko'rish", ru: "Смотреть каталог" },
  aiAssistant: { uz: "AI yordamchi", ru: "AI помощник" },

  mainCategories: { uz: "Asosiy kategoriyalar", ru: "Основные категории" },
  products: { uz: "mahsulot", ru: "товаров" },

  addToCart: { uz: "Savatga qo'shish", ru: "В корзину" },
  viewAll: { uz: "Barchasini ko'rish", ru: "Смотреть все" },
  rating: { uz: "Reyting", ru: "Рейтинг" },
  reviews: { uz: "sharh", ru: "отзывов" },
  priceFrom: { uz: "dan", ru: "от" },

  flashSale: { uz: "🔥 Chegirmalar", ru: "🔥 Скидки" },
  limitedOffer: { uz: "Vaqt cheklangan takliflar!", ru: "Предложения ограничены по времени!" },
  days: { uz: "Kun", ru: "Дни" },
  hours: { uz: "Soat", ru: "Часы" },
  minutes: { uz: "Daqiqa", ru: "Минуты" },
  seconds: { uz: "Soniya", ru: "Секунды" },

  whyOptomBazar: { uz: "Nima uchun OptomBazar?", ru: "Почему OptomBazar?" },
  ourAdvantages: { uz: "Bizning afzalliklarimiz", ru: "Наши преимущества" },
  aiHelper: { uz: "AI Yordamchi", ru: "AI Помощник" },
  aiHelperDesc: { uz: "24/7 Gemini AI chatbot sizga yordam beradi", ru: "24/7 Gemini AI чатбот поможет вам" },
  fastDelivery: { uz: "Tez yetkazib berish", ru: "Быстрая доставка" },
  fastDeliveryDesc: { uz: "O'zbekiston bo'ylab 1-2 kun ichida", ru: "По Узбекистану за 1-2 дня" },
  qualityGuarantee: { uz: "Sifat kafolati", ru: "Гарантия качества" },
  qualityGuaranteeDesc: { uz: "Barcha mahsulotlar sifat sertifikatiga ega", ru: "Все товары имеют сертификат качества" },
  support24: { uz: "24/7 Qo'llab-quvvatlash", ru: "24/7 Поддержка" },
  support24Desc: { uz: "Har doim sizning xizmatingizdamiz", ru: "Всегда к вашим услугам" },

  aboutCompany: { uz: "Kompaniya haqida", ru: "О компании" },
  aboutDesc: { uz: "O'zbekistonning eng yirik optom savdo platformasi. AI texnologiyalari bilan ta'minlangan.", ru: "Крупнейшая оптовая торговая платформа Узбекистана с AI технологиями." },
  forCustomers: { uz: "Mijozlar uchun", ru: "Для клиентов" },
  delivery: { uz: "Yetkazib berish", ru: "Доставка" },
  payment: { uz: "To'lov", ru: "Оплата" },
  returns: { uz: "Qaytarish", ru: "Возврат" },
  help: { uz: "Yordam", ru: "Помощь" },
  allRights: { uz: "© 2024 OptomBazar.uz. Barcha huquqlar himoyalangan.", ru: "© 2024 OptomBazar.uz. Все права защищены." },
  privacyPolicy: { uz: "Maxfiylik siyosati", ru: "Политика конфиденциальности" },
  termsOfUse: { uz: "Foydalanish shartlari", ru: "Условия использования" },

  chatTitle: { uz: "Gemini AI Yordamchi", ru: "Gemini AI Помощник" },
  chatPlaceholder: { uz: "Savolingizni yozing...", ru: "Напишите ваш вопрос..." },
  chatGreeting: { uz: "Salom! Men Gemini AI yordamchiman. Sizga qanday yordam bera olaman?", ru: "Привет! Я помощник Gemini AI. Как я могу вам помочь?" },

  telegramChannel: { uz: "Telegram kanalimiz", ru: "Наш Telegram канал" },
  latestOffers: { uz: "Eng so'nggi aksiyalar va yangiliklar", ru: "Последние акции и новости" },
  join: { uz: "Qo'shilish", ru: "Присоединиться" },
  close: { uz: "Yopish", ru: "Закрыть" },

  loading: { uz: "Yuklanmoqda...", ru: "Загрузка..." },
  error: { uz: "Xatolik yuz berdi", ru: "Произошла ошибка" },
  noResults: { uz: "Natija topilmadi", ru: "Результаты не найдены" },
  tryAgain: { uz: "Qayta urinish", ru: "Попробовать снова" }
};
