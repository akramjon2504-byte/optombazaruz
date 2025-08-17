import { db } from "./db";
import { categories, products } from "@shared/schema";
import { randomUUID } from "crypto";

// Real OptomBazar.uz categories extracted from sitemap
export const categoriesData = [
  {
    nameUz: "Polietilen paketlar",
    nameRu: "Полиэтиленовые пакеты", 
    slug: "polietilenovye-pakety",
    icon: "🛍️"
  },
  {
    nameUz: "Bir martalik idishlar",
    nameRu: "Одноразовая посуда",
    slug: "odnorazovaya-posuda", 
    icon: "🍽️"
  },
  {
    nameUz: "Uy buyumlari", 
    nameRu: "Товары для дома, магазинов, кафе, ресторанов, баров",
    slug: "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov",
    icon: "🏠"
  },
  {
    nameUz: "Elektronika",
    nameRu: "Электроника", 
    slug: "elektronika",
    icon: "📱"
  },
  {
    nameUz: "Kiyim-kechak",
    nameRu: "Одежда",
    slug: "odejda", 
    icon: "👕"
  },
  {
    nameUz: "Maishiy kimyo",
    nameRu: "Бытовая химия",
    slug: "bytovaya-himiya",
    icon: "🧴"
  },
  {
    nameUz: "Kantselyariya",
    nameRu: "Канцтовары для школы и офиса",
    slug: "kantstovary-dlya-shkoly-i-ofisa-vse-dlya-ucheby-i-raboty",
    icon: "📝"
  },
  {
    nameUz: "Bayram tovarlari", 
    nameRu: "Товары для праздников",
    slug: "tovary-dlya-prazdnikov",
    icon: "🎉"
  }
];

// Real OptomBazar.uz products extracted from sitemap with realistic prices
export const productsData = [
  // Полиэтиленовые пакеты
  {
    nameUz: "Polietilen paket-mayka rasmsiz",
    nameRu: "Полиэтиленовый пакет-майка без рисунка",
    slug: "polietilenovyy-paket-mayka-bez-risunka",
    descriptionUz: "Yuqori sifatli polietilen paket-maykakar, rasmsiz, optom savdo uchun. Turli o'lchamlarda mavjud.",
    descriptionRu: "Высококачественные полиэтиленовые пакеты-майка без рисунка для оптовой торговли. Доступны различные размеры.",
    categorySlug: "polietilenovye-pakety",
    price: "0.85",
    originalPrice: "1.20", 
    images: ["/api/placeholder/400/300?text=Пакет-майка"],
    isHit: true,
    isPromo: true,
    discountPercent: 29,
    stock: 50000,
    rating: "4.5",
    reviewCount: 342
  },
  {
    nameUz: "Fasovka paketlari va rulonlar", 
    nameRu: "Фасовочные пакеты в рулонах",
    slug: "fasovochnye-pakety-i-rulone",
    descriptionUz: "Shaffof fasovka paketlari, rulonlarda taqdim etiladi. Oziq-ovqat mahsulotlari uchun ideal.",
    descriptionRu: "Прозрачные фасовочные пакеты в рулонах. Идеально подходят для упаковки пищевых продуктов.",
    categorySlug: "polietilenovye-pakety", 
    price: "125.50",
    originalPrice: "148.00",
    images: ["/api/placeholder/400/300?text=Фасовочные+пакеты"],
    isHit: false,
    isPromo: true,
    discountPercent: 15,
    stock: 8500,
    rating: "4.3",
    reviewCount: 128
  },
  {
    nameUz: "Zip-lock paketlar (struna bilan)",
    nameRu: "Полиэтиленовый пакет с замком zip-lock (струна)",
    slug: "polietilenovyy-paket-s-zamkom-zip-lock-struna", 
    descriptionUz: "Qayta foydalanish mumkin bo'lgan zip-lock paketlar. Maxsus struna bilan.",
    descriptionRu: "Многоразовые пакеты с замком zip-lock. С удобной застежкой-струной.",
    categorySlug: "polietilenovye-pakety",
    price: "2.45",
    originalPrice: "3.20",
    images: ["/api/placeholder/400/300?text=Zip-lock+пакеты"],
    isHit: true,
    isPromo: false, 
    discountPercent: 23,
    stock: 12000,
    rating: "4.7",
    reviewCount: 267
  },
  {
    nameUz: "Kesilgan tutqichli paketlar",
    nameRu: "Пакеты с вырубной ручкой",
    slug: "pakety-s-vyrubnoy-ruchkoy",
    descriptionUz: "Qaychi bilan kesilgan tutqichli paketlar. Kiyim do'konlari uchun ideal.",
    descriptionRu: "Пакеты с вырубной ручкой. Идеальны для магазинов одежды.",
    categorySlug: "polietilenovye-pakety",
    price: "1.15", 
    originalPrice: "1.45",
    images: ["/api/placeholder/400/300?text=Пакеты+с+ручкой"],
    isHit: false,
    isPromo: true,
    discountPercent: 21,
    stock: 25000,
    rating: "4.2",
    reviewCount: 89
  },
  {
    nameUz: "Axlat paketlari",
    nameRu: "Мусорные пакеты", 
    slug: "musornye-pakety",
    descriptionUz: "Mustahkam axlat paketlari. Turli hajmlarda. Uy va ofis uchun.",
    descriptionRu: "Прочные мусорные пакеты. Различных объемов. Для дома и офиса.",
    categorySlug: "polietilenovye-pakety",
    price: "45.60",
    originalPrice: "52.00",
    images: ["/api/placeholder/400/300?text=Мусорные+пакеты"],
    isHit: true,
    isPromo: true,
    discountPercent: 12,
    stock: 5500,
    rating: "4.4",
    reviewCount: 156
  },

  // Одноразовая посуда
  {
    nameUz: "Bir martalik plastik idishlar",
    nameRu: "Одноразовая пластиковая посуда",
    slug: "odnorazovaya-plastikovaya-posuda",
    descriptionUz: "Ekologik toza bir martalik plastik idishlar to'plami. Restoran va kafe uchun.",
    descriptionRu: "Экологически чистая одноразовая пластиковая посуда. Для ресторанов и кафе.",
    categorySlug: "odnorazovaya-posuda",
    price: "75.40", 
    originalPrice: "89.50",
    images: ["/api/placeholder/400/300?text=Пластиковая+посуда"],
    isHit: false,
    isPromo: true,
    discountPercent: 16,
    stock: 3200,
    rating: "4.6",
    reviewCount: 234
  },
  {
    nameUz: "Qog'oz stakanlar va qopqoqlar",
    nameRu: "Одноразовые бумажные стаканы крышки и тарелки",
    slug: "odnorazovye-bumajnye-stakany-kryshki-i-tarelki",
    descriptionUz: "Qog'ozdan tayyorlangan bir martalik stakanlar, qopqoqlar va tarelkalar. Kofeshoplar uchun ideal.",
    descriptionRu: "Одноразовые бумажные стаканы, крышки и тарелки. Идеально для кофеен.",
    categorySlug: "odnorazovaya-posuda",
    price: "185.75",
    originalPrice: "220.00", 
    images: ["/api/placeholder/400/300?text=Бумажные+стаканы"],
    isHit: true,
    isPromo: false,
    discountPercent: 16,
    stock: 1850,
    rating: "4.8",
    reviewCount: 378
  },
  {
    nameUz: "Mevalar uchun konteynerlar",
    nameRu: "Контейнеры и тара для ягод, блистерная упаковка для пищевых продуктов", 
    slug: "konteynery-i-tara-dlya-yagod-blisternaya-upakovka-dlya-pischevyh-produktov",
    descriptionUz: "Shaffof konteynerlar mevalar va rezavorlar uchun. Blister qadoqlash.",
    descriptionRu: "Прозрачные контейнеры для ягод и фруктов. Блистерная упаковка.",
    categorySlug: "odnorazovaya-posuda",
    price: "12.35",
    originalPrice: "15.80",
    images: ["/api/placeholder/400/300?text=Контейнеры+для+ягод"],
    isHit: false,
    isPromo: true,
    discountPercent: 22,
    stock: 8900,
    rating: "4.5",
    reviewCount: 167
  },

  // Товары для дома
  {
    nameUz: "Qo'lqop",
    nameRu: "Перчатки", 
    slug: "perchatki",
    descriptionUz: "Tibbiy va uy xo'jaligi uchun qo'lqoplar. Lateks va nitril materiallardan.",
    descriptionRu: "Перчатки для медицинских и хозяйственных целей. Из латекса и нитрила.",
    categorySlug: "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov",
    price: "28.90",
    originalPrice: "35.50",
    images: ["/api/placeholder/400/300?text=Перчатки"],
    isHit: true,
    isPromo: true,
    discountPercent: 19,
    stock: 4500,
    rating: "4.4",
    reviewCount: 298
  },
  {
    nameUz: "Nam va quruq salfetka, hojatxona qog'ozi",
    nameRu: "Влажные и сухие салфетки, туалетная бумага",
    slug: "vlajnye-i-suhie-salfetki-tualetnaya-bumaga",
    descriptionUz: "Yumshoq salfetka va hojatxona qog'ozlari. Premium sifat.",
    descriptionRu: "Мягкие салфетки и туалетная бумага. Премиум качество.",
    categorySlug: "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov", 
    price: "67.20",
    originalPrice: "82.50",
    images: ["/api/placeholder/400/300?text=Салфетки+и+бумага"],
    isHit: false,
    isPromo: true,
    discountPercent: 19,
    stock: 2100,
    rating: "4.3",
    reviewCount: 156
  },

  // Электроника
  {
    nameUz: "Uy uchun maishiy texnika",
    nameRu: "Бытовая техника для дома",
    slug: "bytovaya-tehnika-dlya-doma",
    descriptionUz: "Zamonaviy uy texnikasi. Televizorlar, konditsionerlar, changyutgichlar.",
    descriptionRu: "Современная бытовая техника. Телевизоры, кондиционеры, пылесосы.",
    categorySlug: "elektronika",
    price: "2450.00",
    originalPrice: "2890.00", 
    images: ["/api/placeholder/400/300?text=Бытовая+техника"],
    isHit: true,
    isPromo: false,
    discountPercent: 15,
    stock: 120,
    rating: "4.7",
    reviewCount: 89
  },
  {
    nameUz: "Oshxona texnikasi",
    nameRu: "Бытовая техника для кухни",
    slug: "bytovaya-tehnika-dlya-kuhni", 
    descriptionUz: "Oshxona uchun texnika. Muzlatgichlar, plitalar, mikroto'lqinli pechlar.",
    descriptionRu: "Техника для кухни. Холодильники, плиты, микроволновые печи.",
    categorySlug: "elektronika",
    price: "1890.50",
    originalPrice: "2200.00",
    images: ["/api/placeholder/400/300?text=Кухонная+техника"],
    isHit: false,
    isPromo: true,
    discountPercent: 14,
    stock: 85,
    rating: "4.6",
    reviewCount: 145
  },

  // Одежда
  {
    nameUz: "Bolalar kiyimi",
    nameRu: "Детская одежда",
    slug: "detskaya-odejda",
    descriptionUz: "Yumshoq va xavfsiz bolalar kiyimlari. Barcha yoshlar uchun.",
    descriptionRu: "Мягкая и безопасная детская одежда. Для всех возрастов.", 
    categorySlug: "odejda",
    price: "125.80",
    originalPrice: "156.00",
    images: ["/api/placeholder/400/300?text=Детская+одежда"],
    isHit: true,
    isPromo: true,
    discountPercent: 19,
    stock: 890,
    rating: "4.8",
    reviewCount: 267
  },
  {
    nameUz: "Ayollar kiyimi",
    nameRu: "Женская одежда",
    slug: "jenskaya-odejda",
    descriptionUz: "Zamonaviy ayollar kiyimi. Turli uslub va o'lchamlarda.",
    descriptionRu: "Современная женская одежда. Различных стилей и размеров.",
    categorySlug: "odejda",
    price: "245.60", 
    originalPrice: "289.50",
    images: ["/api/placeholder/400/300?text=Женская+одежда"],
    isHit: false,
    isPromo: true,
    discountPercent: 15,
    stock: 650,
    rating: "4.5",
    reviewCount: 198
  },
  {
    nameUz: "Erkaklar kiyimi",
    nameRu: "Мужская одежда",
    slug: "mujskaya-odejda",
    descriptionUz: "Sifatli erkaklar kiyimi. Rasmiy va kundalik uslublar.",
    descriptionRu: "Качественная мужская одежда. Официальные и повседневные стили.",
    categorySlug: "odejda",
    price: "189.40",
    originalPrice: "225.00",
    images: ["/api/placeholder/400/300?text=Мужская+одежда"],
    isHit: true,
    isPromo: false, 
    discountPercent: 16,
    stock: 420,
    rating: "4.4",
    reviewCount: 134
  },

  // Бытовая химия
  {
    nameUz: "Kir yuvish vositalar",
    nameRu: "Средства для стирки",
    slug: "sredstva-dlya-stirki",
    descriptionUz: "Kuchli va samarali kir yuvish kukuni va suyuqliklari.",
    descriptionRu: "Мощные и эффективные стиральные порошки и жидкости.",
    categorySlug: "bytovaya-himiya",
    price: "45.30",
    originalPrice: "54.80",
    images: ["/api/placeholder/400/300?text=Средства+для+стирки"],
    isHit: false,
    isPromo: true,
    discountPercent: 17,
    stock: 1200,
    rating: "4.6",
    reviewCount: 289
  },
  {
    nameUz: "Havo yangilovchi va aromatizatorlar", 
    nameRu: "Освежители и ароматизаторы воздуха",
    slug: "osvejiteli-i-aromatizatory-vozduha",
    descriptionUz: "Uy va ofis uchun havo yangilovchi vositalar. Turli hidlar.",
    descriptionRu: "Освежители воздуха для дома и офиса. Различные ароматы.",
    categorySlug: "bytovaya-himiya", 
    price: "23.70",
    originalPrice: "28.50",
    images: ["/api/placeholder/400/300?text=Освежители+воздуха"],
    isHit: true,
    isPromo: true,
    discountPercent: 17,
    stock: 2100,
    rating: "4.3",
    reviewCount: 167
  },

  // Канцтовары
  {
    nameUz: "Bo'yoq kitoblar",
    nameRu: "Раскраски развивайте фантазию и творчество", 
    slug: "raskraski-razvivayte-fantaziyu-i-tvorchestvo",
    descriptionUz: "Bolalar uchun bo'yoq kitoblari. Ijodkorlikni rivojlantiradi.",
    descriptionRu: "Раскраски для детей. Развивают творческие способности.",
    categorySlug: "kantstovary-dlya-shkoly-i-ofisa-vse-dlya-ucheby-i-raboty",
    price: "12.40",
    originalPrice: "16.20",
    images: ["/api/placeholder/400/300?text=Раскраски"],
    isHit: false,
    isPromo: true,
    discountPercent: 23,
    stock: 850,
    rating: "4.7",
    reviewCount: 112
  },
  {
    nameUz: "Rangli qalam va flomaster to'plamlari",
    nameRu: "Карандаши флoмастеры краски кисти всё для яркого творчества",
    slug: "karandashi-flomastery-kraski-kisti-vsyo-dlya-yarkogo-tvorchestva",
    descriptionUz: "To'liq ijodiy to'plam. Qalamlar, flomaster, bo'yoqlar va cho'tkalar.",
    descriptionRu: "Полный творческий набор. Карандаши, фломастеры, краски и кисти.",
    categorySlug: "kantstovary-dlya-shkoly-i-ofisa-vse-dlya-ucheby-i-raboty",
    price: "89.60",
    originalPrice: "112.50", 
    images: ["/api/placeholder/400/300?text=Творческий+набор"],
    isHit: true,
    isPromo: false,
    discountPercent: 20,
    stock: 340,
    rating: "4.9",
    reviewCount: 278
  },

  // Товары для праздников
  {
    nameUz: "Bayram bezaklari",
    nameRu: "Оформление праздника",
    slug: "oformlenie-prazdnika",
    descriptionUz: "Bayramlar uchun bezak buyumlari. Sharlar, bantlar, dekoratsiyalar.",
    descriptionRu: "Украшения для праздников. Шары, ленты, декорации.",
    categorySlug: "tovary-dlya-prazdnikov",
    price: "34.80",
    originalPrice: "42.50",
    images: ["/api/placeholder/400/300?text=Праздничные+украшения"], 
    isHit: true,
    isPromo: true,
    discountPercent: 18,
    stock: 760,
    rating: "4.5",
    reviewCount: 189
  },
  {
    nameUz: "Yangi yil tovarlari",
    nameRu: "Новогодние товары",
    slug: "novogodnie-tovary",
    descriptionUz: "Yangi yil uchun maxsus tovarlar. Yelka bezaklari, sovg'alar.",
    descriptionRu: "Специальные товары для Нового года. Елочные украшения, подарки.",
    categorySlug: "tovary-dlya-prazdnikov",
    price: "156.90",
    originalPrice: "189.00",
    images: ["/api/placeholder/400/300?text=Новогодние+товары"],
    isHit: false,
    isPromo: true, 
    discountPercent: 17,
    stock: 320,
    rating: "4.8",
    reviewCount: 234
  }
];

export async function seedDatabase() {
  try {
    console.log("Ma'lumotlar bazasini to'ldirish boshlandi...");
    
    // First, seed categories
    const categoryIds = new Map<string, string>();
    
    for (const categoryData of categoriesData) {
      const categoryId = randomUUID();
      await db.insert(categories).values({
        id: categoryId,
        ...categoryData,
        parentId: null,
        isActive: true
      }).onConflictDoNothing();
      
      categoryIds.set(categoryData.slug, categoryId);
      console.log(`Kategoriya qo'shildi: ${categoryData.nameRu}`);
    }
    
    // Then, seed products
    for (const productData of productsData) {
      const categoryId = categoryIds.get(productData.categorySlug);
      if (!categoryId) {
        console.warn(`Kategoriya topilmadi: ${productData.categorySlug}`);
        continue;
      }
      
      await db.insert(products).values({
        id: randomUUID(),
        nameUz: productData.nameUz,
        nameRu: productData.nameRu,
        slug: productData.slug,
        descriptionUz: productData.descriptionUz,
        descriptionRu: productData.descriptionRu,
        categoryId,
        price: productData.price,
        originalPrice: productData.originalPrice,
        images: productData.images,
        isHit: productData.isHit,
        isPromo: productData.isPromo,
        discountPercent: productData.discountPercent,
        stock: productData.stock,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        isActive: true
      }).onConflictDoNothing();
      
      console.log(`Mahsulot qo'shildi: ${productData.nameRu}`);
    }
    
    console.log("Ma'lumotlar bazasi muvaffaqiyatli to'ldirildi!");
  } catch (error) {
    console.error("Ma'lumotlar bazasini to'ldirishda xatolik:", error);
  }
}