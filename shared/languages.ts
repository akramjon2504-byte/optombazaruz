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
  freeShipping: { uz: "Bepul yetkazib berish", ru: "Бесплатная доставка" },
  wholesale: { uz: "Optom narxlar", ru: "Оптовые цены" },
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