// Language constants and translations for OptomBazar

export type Language = 'uz' | 'ru';

export const LANGUAGES: Record<Language, { name: string; flag: string }> = {
  uz: { name: "O'zbekcha", flag: "🇺🇿" },
  ru: { name: "Русский", flag: "🇷🇺" }
};

export const translations = {
  // Navigation
  home: { uz: "Bosh sahifa", ru: "Главная" },
  catalog: { uz: "Katalog", ru: "Каталог" },
  about: { uz: "Biz haqimizda", ru: "О нас" },
  contact: { uz: "Aloqa", ru: "Контакты" },
  cart: { uz: "Savatcha", ru: "Корзина" },
  wishlist: { uz: "Sevimlilar", ru: "Избранное" },
  profile: { uz: "Profil", ru: "Профиль" },
  blog: { uz: "Blog", ru: "Блог" },
  
  // Auth
  login: { uz: "Kirish", ru: "Войти" },
  register: { uz: "Ro'yxatdan o'tish", ru: "Регистрация" },
  logout: { uz: "Chiqish", ru: "Выйти" },
  email: { uz: "Elektron pochta", ru: "Email" },
  password: { uz: "Parol", ru: "Пароль" },
  confirmPassword: { uz: "Parolni tasdiqlang", ru: "Подтвердите пароль" },
  firstName: { uz: "Ism", ru: "Имя" },
  lastName: { uz: "Familiya", ru: "Фамилия" },
  phone: { uz: "Telefon", ru: "Телефон" },
  phoneNumber: { uz: "+998 99 644 84 44", ru: "+998 99 644 84 44" },
  telegramChannel: { uz: "@optombazaruzb", ru: "@optombazaruzb" },
  telegramBot: { uz: "OptomBazar.uz Bot", ru: "OptomBazar.uz Bot" },
  
  // Admin
  adminPanel: { uz: "Admin panel", ru: "Админ панель" },
  dashboard: { uz: "Boshqaruv paneli", ru: "Панель управления" },
  users: { uz: "Foydalanuvchilar", ru: "Пользователи" },
  products: { uz: "Mahsulotlar", ru: "Товары" },
  categories: { uz: "Kategoriyalar", ru: "Категории" },
  orders: { uz: "Buyurtmalar", ru: "Заказы" },
  analytics: { uz: "Tahlil", ru: "Аналитика" },
  marketing: { uz: "Marketing", ru: "Маркетинг" },
  
  // Products
  addToCart: { uz: "Savatga qo'shish", ru: "В корзину" },
  addToWishlist: { uz: "Sevimlilarga qo'shish", ru: "В избранное" },
  price: { uz: "Narx", ru: "Цена" },
  discount: { uz: "Chegirma", ru: "Скидка" },
  inStock: { uz: "Mavjud", ru: "В наличии" },
  outOfStock: { uz: "Qolmagan", ru: "Нет в наличии" },
  reviews: { uz: "Sharhlar", ru: "Отзывы" },
  
  // Common
  search: { uz: "Qidirish", ru: "Поиск" },
  filter: { uz: "Filtr", ru: "Фильтр" },
  sort: { uz: "Saralash", ru: "Сортировка" },
  save: { uz: "Saqlash", ru: "Сохранить" },
  cancel: { uz: "Bekor qilish", ru: "Отмена" },
  delete: { uz: "O'chirish", ru: "Удалить" },
  edit: { uz: "Tahrirlash", ru: "Редактировать" },
  view: { uz: "Ko'rish", ru: "Посмотреть" },
  loading: { uz: "Yuklanmoqda...", ru: "Загрузка..." },
  error: { uz: "Xatolik", ru: "Ошибка" },
  success: { uz: "Muvaffaqiyat", ru: "Успешно" },
  
  // Messages
  welcomeMessage: { 
    uz: "OptomBazar.uz - O'zbekistonning yetakchi optom savdo platformasi", 
    ru: "OptomBazar.uz - ведущая оптовая торговая платформа Узбекистана" 
  },
  loginSuccess: { uz: "Muvaffaqiyatli kirildi", ru: "Успешно вошли" },
  loginError: { uz: "Kirish xatoligi", ru: "Ошибка входа" },
  registrationSuccess: { uz: "Ro'yxatdan o'tildi", ru: "Регистрация завершена" },
  
  // Marketing
  newProducts: { uz: "Yangi mahsulotlar", ru: "Новые товары" },
  hotDeals: { uz: "Issiq takliflar", ru: "Горячие предложения" },
  promotions: { uz: "Aksiyalar", ru: "Акции" },
  hitProducts: { uz: "Xit mahsulotlar", ru: "Хиты продаж" },
  productsCount: { uz: "mahsulot", ru: "товаров" },
  
  // Hero section
  heroTitle: { 
    uz: "O'zbekistonning eng yirik optom bozori", 
    ru: "Крупнейший оптовый рынок Узбекистана" 
  },
  heroSubtitle: { 
    uz: "Bizda 10,000+ dan ortiq mahsulot va ishonchli ta'minotchilar mavjud", 
    ru: "У нас более 10,000 товаров и надежные поставщики" 
  },
  freeShipping: { uz: "Bepul yetkazib berish", ru: "Бесплатная доставка" },
  wholesale: { uz: "Optom narxlar", ru: "Оптовые цены" },
  
  // Hero buttons
  viewCatalogBtn: { uz: "Katalogni ko'rish", ru: "Смотреть каталог" },
  aiAssistantBtn: { uz: "AI Yordamchi", ru: "AI Помощник" },

  
  // Features
  wholesalePrices: { uz: "Optom Narxlar", ru: "Оптовые Цены" },
  fastDelivery: { uz: "Tezkor Yetkazib Berish", ru: "Быстрая Доставка" },
  qualityGuarantee: { uz: "Sifat Kafolati", ru: "Гарантия Качества" },
  support247: { uz: "24/7 Qo'llab-quvvatlash", ru: "24/7 Поддержка" },
  
  // Categories
  popularCategories: { uz: "Mashhur Kategoriyalar", ru: "Популярные Категории" },
  viewAll: { uz: "Barchasini ko'rish", ru: "Смотреть все" },
  totalProducts: { uz: "jami mahsulot", ru: "всего товаров" },
  
  // Latest News
  latestNews: { uz: "So'nggi Yangiliklar", ru: "Последние Новости" },
  readMore: { uz: "Batafsil", ru: "Подробнее" },
  generatedByAI: { uz: "AI tomonidan yaratilgan", ru: "Создано с помощью ИИ" },
  
  // Company Info
  companyFeatures: { uz: "Kompaniya Imkoniyatlari", ru: "Возможности Компании" },
  
  // Header & Navigation
  searchPlaceholder: { uz: "Mahsulotlarni qidirish...", ru: "Поиск товаров..." },
  
  // Product Card & Actions
  hit: { uz: "Хит", ru: "Хит" },
  outOfStockMessage: { uz: "Qolmadi", ru: "Нет в наличии" },
  
  // Common UI elements
  loadMore: { uz: "Ko'proq yuklash", ru: "Загрузить больше" },
  showAll: { uz: "Barchasini ko'rsatish", ru: "Показать все" },
  closeMenu: { uz: "Menyuni yopish", ru: "Закрыть меню" },
  
  // Footer sections
  aboutDesc: { uz: "OptomBazar - O'zbekistonning yetakchi optom savdo platformasi", ru: "OptomBazar - ведущая оптовая торговая платформа Узбекистана" },
  forCustomers: { uz: "Mijozlar uchun", ru: "Для клиентов" },
  delivery: { uz: "Yetkazib berish", ru: "Доставка" },
  payment: { uz: "To'lov", ru: "Оплата" },
  returns: { uz: "Qaytarish", ru: "Возврат" },
  help: { uz: "Yordam", ru: "Помощь" },
  aiHelperDesc: { uz: "AI yordamchi", ru: "ИИ помощник" },
  fastDeliveryDesc: { uz: "Tez yetkazib berish", ru: "Быстрая доставка" },
  qualityGuaranteeDesc: { uz: "Sifat kafolati", ru: "Гарантия качества" },
  support24Desc: { uz: "24/7 qo'llab-quvvatlash", ru: "Круглосуточная поддержка" },
  
  // Contact info
  contactInfo: { uz: "Aloqa", ru: "Контакты" },
  openHours: { uz: "24/7 ochiq", ru: "24/7 открыто" },
  address: { uz: "Toshkent sh., O'zbekiston", ru: "г. Ташкент, Узбекистан" },
  
  // Telegram
  latestOffers: { uz: "Eng so'nggi takliflar", ru: "Последние предложения" },
  join: { uz: "Qo'shilish", ru: "Присоединиться" },
  close: { uz: "Yopish", ru: "Закрыть" },
  
  // Legal
  privacyPolicy: { uz: "Maxfiylik siyosati", ru: "Политика конфиденциальности" },
  termsOfUse: { uz: "Foydalanish shartlari", ru: "Условия использования" },
  allRights: { uz: "© 2024 OptomBazar.uz. Barcha huquqlar himoyalangan.", ru: "© 2024 OptomBazar.uz. Все права защищены." },
  
  // Home page sections
  mainCategories: { uz: "Asosiy Kategoriyalar", ru: "Основные Категории" },
  flashSale: { uz: "Tezkor Savdo", ru: "Быстрая Распродажа" },
  limitedOffer: { uz: "Cheklangan taklif - Ulgurish uchun shoshiling!", ru: "Ограниченное предложение - Спешите успеть!" },
  
  // Company features section
  companyFeaturesTitle: { uz: "Nega bizni tanlashadi?", ru: "Почему выбирают нас?" },
  freeConsultation: { uz: "Bepul maslahat", ru: "Бесплатные консультации" },
  guaranteedQuality: { uz: "Kafolatlangan sifat", ru: "Гарантированное качество" },
  onlineSupport: { uz: "Onlayn qo'llab-quvvatlash", ru: "Онлайн поддержка" },
  
  // Chat widget
  chatGreeting: { uz: "Salom! AI yordamchi sifatida sizga qanday yordam bera olaman?", ru: "Привет! Как ИИ помощник, чем могу вам помочь?" },
  chatPlaceholder: { uz: "Xabar yozing...", ru: "Напишите сообщение..." },
  sendMessage: { uz: "Xabar yuborish", ru: "Отправить сообщение" },
  closeChat: { uz: "Chatni yopish", ru: "Закрыть чат" },
  openChat: { uz: "Chatni ochish", ru: "Открыть чат" },
  
  // Error messages
  noResults: { uz: "Hech qanday mahsulot topilmadi", ru: "Ничего не найдено" },
  
  // Additional home page sections
  whyOptomBazar: { uz: "Nega OptomBazar?", ru: "Почему OptomBazar?" },
  ourAdvantages: { uz: "Bizning afzalliklarimiz", ru: "Наши преимущества" },
  aiHelper: { uz: "AI Yordamchi", ru: "ИИ Помощник" },
  
  // Additional missing translations
  ourServices: { uz: "Bizning xizmatlarimiz", ru: "Наши услуги" },
  customerReviews: { uz: "Mijozlar fikrlari", ru: "Отзывы клиентов" },
  technicalError: { uz: "Kechirasiz, texnik xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.", ru: "Извините, произошла техническая ошибка. Пожалуйста, попробуйте позже." },
  support24: { uz: "24/7 qo'llab-quvvatlash", ru: "24/7 поддержка" },
  

  
  // Timer translations
  days: { uz: "kun", ru: "дней" },
  hours: { uz: "soat", ru: "часов" },
  minutes: { uz: "daqiqa", ru: "минут" },
  seconds: { uz: "soniya", ru: "секунд" },
};

export function getTranslation(key: keyof typeof translations, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.uz || key;
}

// Language detection from browser
export function detectLanguage(): Language {
  if (typeof navigator === 'undefined') return 'uz';
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ru')) return 'ru';
  return 'uz';
}

// Format currency based on language
export function formatCurrency(amount: number, lang: Language): string {
  if (lang === 'ru') {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' сум';
  }
  
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' so\'m';
}