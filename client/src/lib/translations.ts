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

  // Auth extended
  success: Translation;
  loginSuccess: Translation;
  firstName: Translation;
  lastName: Translation;
  confirmPassword: Translation;
  password: Translation;
  
  // Admin panel
  dashboard: Translation;
  users: Translation;
  orders: Translation;
  analytics: Translation;
  settings: Translation;
  totalUsers: Translation;
  totalOrders: Translation;
  monthlySales: Translation;
  totalMessages: Translation;

  // PWA
  installApp: Translation;
  installAppDescription: Translation;
  faster: Translation;
  offline: Translation;
  appLike: Translation;
  installing: Translation;
  install: Translation;
  later: Translation;
  offlineMode: Translation;
  willSyncWhenOnline: Translation;
  enableNotifications: Translation;
  notificationsDescription: Translation;
  notificationsEnabled: Translation;
  notificationsNotSupported: Translation;
  enable: Translation;
  
  // Advanced Search
  filter: Translation;
  advancedFilters: Translation;
  clearFilters: Translation;
  category: Translation;
  selectCategory: Translation;
  allCategories: Translation;
  priceRange: Translation;
  quickFilters: Translation;
  inStock: Translation;
  sortBy: Translation;
  name: Translation;
  price: Translation;
  newest: Translation;
  ascending: Translation;
  descending: Translation;
  
  // Reviews
  addReview: Translation;
  writeReview: Translation;
  reviewTitle: Translation;
  reviewTitlePlaceholder: Translation;
  reviewComment: Translation;
  reviewCommentPlaceholder: Translation;
  submitting: Translation;
  submitReview: Translation;
  cancel: Translation;
  noReviews: Translation;
  beFirstToReview: Translation;
  verified: Translation;
  helpful: Translation;
  optional: Translation;
  
  // Comparison
  maxCompareLimit: Translation;
  noProductsToCompare: Translation;
  addProductsToCompare: Translation;
  productsSelected: Translation;
  moreAllowed: Translation;
  hideComparison: Translation;
  compare: Translation;
  clearAll: Translation;
  productComparison: Translation;
  feature: Translation;
  viewDetails: Translation;
  yes: Translation;
  no: Translation;
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
  tryAgain: { uz: "Qayta urinish", ru: "Попробовать снова" },

  // Auth extended
  success: { uz: "Muvaffaqiyat", ru: "Успешно" },
  loginSuccess: { uz: "Muvaffaqiyatli kirildi", ru: "Успешно вошли" },
  firstName: { uz: "Ism", ru: "Имя" },
  lastName: { uz: "Familiya", ru: "Фамилия" },
  confirmPassword: { uz: "Parolni tasdiqlang", ru: "Подтвердите пароль" },
  password: { uz: "Parol", ru: "Пароль" },
  
  // Admin panel
  dashboard: { uz: "Boshqaruv paneli", ru: "Панель управления" },
  users: { uz: "Foydalanuvchilar", ru: "Пользователи" },
  orders: { uz: "Buyurtmalar", ru: "Заказы" },
  analytics: { uz: "Tahlil", ru: "Аналитика" },
  settings: { uz: "Sozlamalar", ru: "Настройки" },
  totalUsers: { uz: "Jami foydalanuvchilar", ru: "Всего пользователей" },
  totalOrders: { uz: "Jami buyurtmalar", ru: "Всего заказов" },
  monthlySales: { uz: "Oylik savdo", ru: "Месячные продажи" },
  totalMessages: { uz: "Jami xabarlar", ru: "Всего сообщений" },

  // PWA
  installApp: { uz: "Ilovani o'rnatish", ru: "Установить приложение" },
  installAppDescription: { uz: "Telefonda app kabi ishlatish uchun", ru: "Для использования как приложение на телефоне" },
  faster: { uz: "Tezroq", ru: "Быстрее" },
  offline: { uz: "Offline", ru: "Оффлайн" },
  appLike: { uz: "App kabi", ru: "Как приложение" },
  installing: { uz: "O'rnatilmoqda...", ru: "Устанавливается..." },
  install: { uz: "O'rnatish", ru: "Установить" },
  later: { uz: "Keyinroq", ru: "Позже" },
  offlineMode: { uz: "Internet aloqasi yo'q - offline rejimda ishlayapti", ru: "Нет интернета - работает в оффлайн режиме" },
  willSyncWhenOnline: { uz: "Internet qaytganda sinxronlashadi", ru: "Синхронизируется при подключении к интернету" },
  enableNotifications: { uz: "Bildirishnomalarni yoqing", ru: "Включить уведомления" },
  notificationsDescription: { uz: "Aksiyalar va yangiliklar haqida birinchi bo'lib bilib oling", ru: "Узнавайте первыми об акциях и новостях" },
  notificationsEnabled: { uz: "Bildirishnomalar yoqildi! Aksiyalardan birinchi bo'lib xabardor bo'ling.", ru: "Уведомления включены! Будьте первыми в курсе акций." },
  notificationsNotSupported: { uz: "Bildirishnomalar qo'llab-quvvatlanmaydi", ru: "Уведомления не поддерживаются" },
  enable: { uz: "Yoqish", ru: "Включить" },
  
  // Advanced Search
  filter: { uz: "Filtr", ru: "Фильтр" },
  advancedFilters: { uz: "Kengaytirilgan filtrlar", ru: "Расширенные фильтры" },
  clearFilters: { uz: "Filtrlarni tozalash", ru: "Очистить фильтры" },
  category: { uz: "Kategoriya", ru: "Категория" },
  selectCategory: { uz: "Kategoriyani tanlang", ru: "Выберите категорию" },
  allCategories: { uz: "Barcha kategoriyalar", ru: "Все категории" },
  priceRange: { uz: "Narx diapazoni", ru: "Диапазон цен" },
  quickFilters: { uz: "Tez filtrlar", ru: "Быстрые фильтры" },
  inStock: { uz: "Mavjud", ru: "В наличии" },
  sortBy: { uz: "Saralash", ru: "Сортировка" },
  name: { uz: "Nomi", ru: "Название" },
  price: { uz: "Narxi", ru: "Цена" },
  newest: { uz: "Eng yangi", ru: "Новинки" },
  ascending: { uz: "O'sish bo'yicha", ru: "По возрастанию" },
  descending: { uz: "Kamayish bo'yicha", ru: "По убыванию" },
  
  // Reviews
  addReview: { uz: "Sharh qo'shish", ru: "Добавить отзыв" },
  writeReview: { uz: "Sharh yozish", ru: "Написать отзыв" },
  reviewTitle: { uz: "Sharh sarlavhasi", ru: "Заголовок отзыва" },
  reviewTitlePlaceholder: { uz: "Mahsulot haqida qisqacha fikringiz", ru: "Краткое мнение о товаре" },
  reviewComment: { uz: "Batafsil sharh", ru: "Подробный отзыв" },
  reviewCommentPlaceholder: { uz: "Mahsulot haqida batafsil yozing...", ru: "Напишите подробно о товаре..." },
  submitting: { uz: "Yuborilmoqda...", ru: "Отправляется..." },
  submitReview: { uz: "Sharh yuborish", ru: "Отправить отзыв" },
  cancel: { uz: "Bekor qilish", ru: "Отмена" },
  noReviews: { uz: "Hali sharhlar yo'q", ru: "Пока нет отзывов" },
  beFirstToReview: { uz: "Birinchi sharh qoldirishchi bo'ling!", ru: "Будьте первым, кто оставит отзыв!" },
  verified: { uz: "Tasdiqlangan", ru: "Подтвержден" },
  helpful: { uz: "Foydali", ru: "Полезно" },
  optional: { uz: "ixtiyoriy", ru: "необязательно" },
  
  // Comparison
  maxCompareLimit: { uz: "Maksimal 4 ta mahsulotni solishtirish mumkin", ru: "Можно сравнивать максимум 4 товара" },
  noProductsToCompare: { uz: "Solishtirish uchun mahsulotlar yo'q", ru: "Нет товаров для сравнения" },
  addProductsToCompare: { uz: "Solishtirish uchun mahsulotlar qo'shing", ru: "Добавьте товары для сравнения" },
  productsSelected: { uz: "mahsulot tanlandi", ru: "товаров выбрано" },
  moreAllowed: { uz: "yana qo'shish mumkin", ru: "еще можно добавить" },
  hideComparison: { uz: "Solishtirishni yashirish", ru: "Скрыть сравнение" },
  compare: { uz: "Solishtirish", ru: "Сравнить" },
  clearAll: { uz: "Hammasini tozalash", ru: "Очистить все" },
  productComparison: { uz: "Mahsulotlarni solishtirish", ru: "Сравнение товаров" },
  feature: { uz: "Xususiyat", ru: "Характеристика" },
  viewDetails: { uz: "Batafsil ko'rish", ru: "Подробнее" },
  yes: { uz: "Ha", ru: "Да" },
  no: { uz: "Yo'q", ru: "Нет" }
};
