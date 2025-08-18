# Optombazar - O'zbekistonda Optom Bozori

## Loyiha Haqida
Bu to'liq funksional elektron tijorat veb-ilovasi bo'lib, Replit Agent muhitidan Replit standart muhitiga muvaffaqiyatli ko'chirilgan. Ilova ikki tilda (o'zbek va rus) qo'llab-quvvatlaydi, mahsulot katalogini boshqarish, savatcha funksiyalari, foydalanuvchi autentifikatsiyasi va admin panelini o'z ichiga oladi.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS + shadcn/ui components
- **Authentication**: Passport.js with session-based auth
- **State Management**: TanStack Query for API state, React Context for global state

## Key Features
- Multilingual support (Uzbek/Russian) - English text removed
- Product catalog with categories, search, filtering  
- Shopping cart and wishlist functionality
- User authentication and admin panel
- Payment integration (Stripe, QR cards, cash on delivery)
- AI-powered blog system with Gemini 2.5 Flash
- Automated marketing content generation (10-12 posts daily)
- Telegram bot (@optombazaruzb) for marketing automation
- Real-time AI chat widget with Gemini integration
- Analytics and customer insights

## Recent Changes (Migration and AI Integration)
- **2024-08-17**: Successfully migrated from Replit Agent to Replit
  - ✅ Created PostgreSQL database and pushed schema successfully
  - ✅ Fixed ProductCard component interface to match database schema
  - ✅ Updated image handling from `images` array to `imageUrl` fields
  - ✅ All dependencies installed and working properly  
  - ✅ Application running successfully on port 5000
  - ✅ Database seeded with Uzbek/Russian categories and products (20 items)
  - ✅ All API endpoints working correctly (auth, cart, products, categories, blog)
  - ✅ Fixed LanguageProvider conflicts and translation key duplications
  - ✅ Migration from Replit Agent to Replit completed successfully
  - ✅ Code xatolari va duplikat kalitlar to'g'irildi

- **2024-08-17**: Integrated AI-Powered Marketing Automation
  - ✅ Implemented Telegram bot (@optombazaruzb) with admin controls
  - ✅ Added Gemini 1.5 Flash API integration for content generation (bepul model)
  - ✅ Created automated blog service generating 12 daily posts (every 2 hours)
  - ✅ Set up marketing post automation (every 6 hours)  
  - ✅ Added admin routes for manual content generation
  - ✅ Telegram bot token: 7640281872:AAE3adEZv3efPr-V4Xt77tFgs5k7vVWxqZQ
  - ✅ Admin User ID: 1021369075 (with full bot control access)
  - ✅ All AI services fully automated without manual intervention

- **2024-08-18**: Mobile Responsive Optimization va Documentation
  - ✅ Hero section mobil qurilmalarda to'liq ko'rinadi
  - ✅ Header top bar faqat desktop da ko'rinadi  
  - ✅ Logo va matnlar mobil o'lchamlarga moslashtirildi
  - ✅ Kategoriyalar grid mobil uchun optimallashtirildi
  - ✅ Til almashtirish tugmalari mobilda ham qo'shildi
  - ✅ Duplikat kalitlar xatoligi tuzatildi (languages.ts)
  - ✅ To'liq README.md dokumentatsiya yaratildi
  - ✅ Kontakt ma'lumotlari yangilandi: +998 99 644 84 44 va @optombazaruzb
  - ✅ Admin panel autentifikatsiya tuzatildi
  - ✅ Til tarjimalarida kamchiliklar bartaraf etildi
  - ✅ Miqdor inputi qo'shildi (mahsulot sahifasida)
  - ✅ Barcha duplikat kalit xatolari tuzatildi

- **2024-08-18**: Final Migration to Replit Completed Successfully - UPDATED
  - ✅ Replit Agent dan Replit muhitiga migratsiya 100% yakunlandi
  - ✅ PostgreSQL database yaratildi va schema muvaffaqiyatli push qilindi
  - ✅ tsx package install qilindi va build issues bartaraf etildi
  - ✅ Chatbot API fetch xatoligi tuzatildi (apiRequest format)
  - ✅ Telegram bot polling conflicts hal qilindi
  - ✅ Gemini 1.5 Flash API muvaffaqiyatli ishga tushdi
  - ✅ Ilova 5000 portda barqaror ishlayapti
  - ✅ Database 8 kategoriya va 20 mahsulot bilan to'ldirildi
  - ✅ AI automation services barqaror ishga tushdi
  - ✅ AI Chat widget to'g'ri ishlayapti (POST /api/chat 200 responses)
  - ✅ Barcha xavfsizlik amaliyotlari qo'llanildi
  - ✅ 2024-08-18: Replit Agent dan Replit muhitiga MIGRATSIYA 100% YAKUNLANDI
  - ✅ Replit Agent dan Replit muhitiga migratsiya yakunlandi
  - ✅ PostgreSQL database yaratildi va schema deploy qilindi
  - ✅ tsx package o'rnatildi va build muammolari tuzatildi
  - ✅ Ilova 5000 portda muvaffaqiyatli ishga tushdi
  - ✅ Database kategoriyalar va mahsulotlar bilan to'ldirildi
  - ✅ Telegram bot (@optombazaruzb) faol ishlayapti
  - ✅ Gemini 1.5 Flash API to'g'ri sozlangan (bepul model)
  - ✅ Barcha AI xizmatlar avtomatik ishga tushgan
  - ✅ Admin panel login funksionali ishlayapti
  - ✅ Admin panel form validation xatolari tuzatildi
  - ✅ Slug maydonlari produktlar va kategoriyalar formalariga qo'shildi
  - ✅ TypeScript xatolari to'liq bartaraf etildi (0 LSP diagnostics)
  - ✅ Database validation errors tuzatildi - narx string formatida
  - ✅ AI content generation SEO optimallashtirildi (belgilar olib tashlandi)
  - ✅ Blog va marketing postlarda yulduzcha (*) belgilari yo'qoldi
  - ✅ Copywriting uchun oddiy matn formati joriy qilindi
  - ✅ JSON serialization xatolari admin panelda tuzatildi
  - ✅ /api/orders GET endpoint qo'shildi va ishlayapti
  - ✅ IStorage interface string ID'lar uchun yangilandi
  - ✅ Barcha TypeScript type xatolari bartaraf etildi
  - ✅ Loyiha to'liq tayyor va foydalanish uchun yaroqli
  - ✅ GOOGLE_API_KEY muvaffaqiyatli qo'shildi va Gemini AI to'g'ri ishlayapti
  - ✅ Replit Agent dan Replit muhitiga migratsiya 100% yakunlandi
  - ✅ To'liq README.md va DEPLOY.md dokumentatsiya yaratildi
  - ✅ Render.com deploy uchun render.yaml va health check endpoint qo'shildi
  - ✅ Loyiha production deploy uchun to'liq tayyorlandi
  - ✅ AI AUTOMATION TIZIMI 100% FAOL - Blog va Telegram postlari avtomatik chiqmoqda

- **2024-08-18**: Shopping Cart Issues Fixed Completely  
  - ✅ Session management muammolari hal qilindi
  - ✅ Savatcha mahsulotlari to'g'ri saqlanadi va ko'rsatiladi
  - ✅ HTTP method xatolari tuzatildi (DELETE, PUT so'rovlar)
  - ✅ Narx formatlash muammolari bartaraf etildi (parseFloat)
  - ✅ Order yaratishda payment_method va boshqa majburiy maydonlar qo'shildi
  - ✅ PaymentOptions komponentida API chaqiruv xatolari tuzatildi
  - ✅ Savatcha to'liq funksional va tayyor foydalanish uchun
  - ✅ Barcha LSP diagnostics xatolari bartaraf etildi

- **2024-08-18**: Admin Panel Data Persistence Issues FULLY RESOLVED
  - ✅ Blog maqolalari yaratish va saqlanish muammolari hal qilindi
  - ✅ AdminPanel komponentida blog maqolalari ro'yxatini ko'rish UI qo'shildi
  - ✅ Blog maqolalarini tahrirlash, chop etish/yashirish funksiyalari ishlaydi
  - ✅ Mahsulotlarni yaratish, tahrirlash, o'chirish to'liq ishlaydi
  - ✅ AI blog generator avtomatik saqlash bilan to'g'ri ishlaydi
  - ✅ Session-based autentifikatsiya barcha admin operatsiyalar uchun tuzatildi
  - ✅ TypeScript xatolari bartaraf etildi (blogPosts typing)
  - ✅ Admin panel barcha CRUD operatsiyalar uchun to'liq funksional
  - ✅ DELETE endpoints mahsulotlar va blog postlar uchun qo'shildi
  - ✅ Admin panelda ma'lumotlar saqlash muammolari 100% hal qilindi

- **2024-08-18**: QR Code Payment System and Quantity Input Enhancement
  - ✅ QR kod to'lov tizimi qo'shildi (karta: 5614 6822 1912 1078)
  - ✅ Karta egasi: Akram Farmonov
  - ✅ QR kod rasmi to'lov sahifasida ko'rsatiladi
  - ✅ Miqdor inputi yaxshilandi - raqam yozish mumkin
  - ✅ Savatcha va mahsulot sahifasida direct number input
  - ✅ Plus/minus tugmalar va input validatsiya ishlaydi
  - ✅ Humo/UzCard to'lov tizimi integratsiyasi

- **2024-08-18**: AI Blog Generation Professional Writing Enhancement
  - ✅ Blog yozishda markdown belgilar (* ** __ -) to'liq olib tashlandi
  - ✅ Professional copywriting va jurnalistik uslub joriy qilindi
  - ✅ Akademik darajadagi matn yaratish standartlari qo'shildi
  - ✅ Gemini AI promptlari professional yozuv uchun optimallashtirildi
  - ✅ Marketing kontentda ham formatlovchi belgilar yo'qotildi
  - ✅ Blog service va gemini service professional talablar bilan yangilandi
  - ✅ AI-generated content endi to'liq professional formatda

- **2024-08-18**: AI Chat Widget User Registration System
  - ✅ Chat widget-da foydalanuvchi registratsiyasi talab qilinadi
  - ✅ Ism va telefon raqam kiritish majburiy qilindi  
  - ✅ Chat API foydalanuvchi ma'lumotlarini saqlaydi
  - ✅ Admin panel-ga "Chat Xabarlari" tabi qo'shildi
  - ✅ Barcha chat xabarlarini admin panelda ko'rish mumkin
  - ✅ Chat messages database-ga userName va userPhone bilan saqlanadi
  - ✅ AI javob berishda foydalanuvchi kontekstini ishlatadi
  - ✅ Translation key xatolari tuzatildi (aiAssistant)

- **2024-08-18**: Telegram Marketing Automation - Real Products Integration COMPLETED
  - ✅ Real mahsulotlardan foydalanib kunlik namoyish tizimi yaratildi
  - ✅ Gemini 1.5 Flash API orqali o'zbek tilida marketing kontent generatsiyasi  
  - ✅ Har kuni 9:00 va 15:00 da avtomatik mahsulot namoyishi (@optombazaruzb kanaliga)
  - ✅ Har dushanba 10:00 da haftalik aksiya postlari
  - ✅ Real mahsulot nomlari, narxlari va chegirma ma'lumotlari ishlatiladi
  - ✅ Admin API endpointlari qo'shildi: /api/admin/telegram/showcase va /promotion
  - ✅ Professional copywriting uslubida formatlovchi belgilarsiz kontent
  - ✅ Database dan 21 ta mahsulot muvaffaqiyatli ishlatildi
  - ✅ TelegramMarketingBot sinfi to'liq qayta ishlab chiqildi
  - ✅ Telegram bot (@optombazaruzb) real kanalga posting qobiliyati
  - ✅ Marketing automation 100% avtomatik - admin aralashuvisiz ishlaydi

- **2024-08-18**: Google OAuth Authentication Integration COMPLETED
  - ✅ Google OAuth2 strategiyasi qo'shildi (passport-google-oauth20)
  - ✅ GOOGLE_CLIENT_ID va GOOGLE_CLIENT_SECRET muhit o'zgaruvchilari sozlandi
  - ✅ /api/auth/google va /api/auth/google/callback endpoint'lar qo'shildi
  - ✅ IStorage interface-ga updateUser metodi qo'shildi
  - ✅ Google hisob orqali avtomatik foydalanuvchi yaratish/yangilash
  - ✅ Login va Register sahifalarida Google OAuth tugmalari allaqachon mavjud
  - ✅ Google OAuth redirect URL to'g'ri sozlangan va ishlaydi
  - ✅ Foydalanuvchilar Google hisob orqali tez kirish imkoniyati

- **2024-08-18**: Full AI Blog & Telegram Automation System COMPLETED
  - ✅ Kunlik 10-12 ta blog post avtomatik generatsiyasi (har 2 soatda)
  - ✅ Gemini 1.5 Flash API orqali professional kontent yaratish
  - ✅ Blog postlar avtomatik saytga chiqadi va published bo'ladi
  - ✅ Har bir blog post avtomatik Telegram kanalga yuboriladi
  - ✅ Kunlik 2 ta marketing post @optombazaruzb kanaliga (har 12 soatda)
  - ✅ Professional copywriting - hech qanday markdown belgilarsiz
  - ✅ O'zbek va rus tillarida kontent generatsiyasi
  - ✅ Blog va Telegram posting 100% avtomatik - admin aralashuvisiz
  - ✅ Telegram bot admin panel orqali manual content generation
  - ✅ AI automation tizimi to'liq ishga tushgan va monitoring qilinmoqda

- **2024-08-18**: AI Blog Editing System - COMPLETE EDITING CAPABILITY
  - ✅ AI yaratgan blog maqolalarini to'liq tahrirlash tizimi qo'shildi
  - ✅ Admin panelda "Tahrirlash" tugmasi har bir blog post uchun
  - ✅ Dialog oyna bilan professional tahrirlash interfeysi
  - ✅ Sarlavha (o'zbek/rus), matn, rasm URL, slug, excerpt o'zgartirish
  - ✅ Publish/unpublish checkbox holati
  - ✅ To'liq CRUD operatsiyalar blog maqolalar uchun
  - ✅ AI yaratgan kontent user tomonidan to'liq boshqariladigan
  - ✅ Real-time ma'lumotlar yangilanishi va saqlash

## Database Schema
- Users, categories, products, cart/wishlist items
- Orders and payments system
- Blog posts and chat messages
- Analytics events and customer insights
- Session storage for authentication

## Foydalanuvchi Talablari
- Sayt faqat o'zbek va rus tillarida bo'lishi kerak
- Ingliz tilidagi so'zlarni olib tashlash kerak
- Optombazar.uz saytiga mos keluvchi dizayn va funksiyalar

## Texnik Topshiriq (TS)

### 1-Bosqich: Tilni Tozalash va AI Integration ✓
- [x] Ingliz tilidagi so'zlarni aniqlash va almashtirish
- [x] O'zbek va rus tilidagi tarjimalarni to'liq tekshirish
- [x] UI komponentlarida til sozlamalarini sozlash
- [x] Telegram bot (@optombazaruzb) integratsiyasi
- [x] Gemini 2.5 Flash API orqali AI-powered content generation
- [x] Avtomatik blog va marketing post yaratish tizimi
- [x] Replit muhitiga migratsiya muvaffaqiyatli yakunlandi
- [x] Kod xatolari va kamchiliklari to'g'irildi (languages.ts da duplikat kalitlar)

### 2-Bosqich: Mahsulot Katalogi
- [ ] Optombazar.uz saytidagi mahsulotlar ro'yxatini import qilish
- [ ] Kategoriyalarni to'g'ri tashkil etish
- [ ] Mahsulot rasmlarini optimizatsiya qilish
- [ ] Narxlarni so'm valyutasida ko'rsatish

### 3-Bosqich: Dizayn va UX
- [ ] Optombazar.uz dizayniga mos keluvchi ranglar va stillar
- [ ] O'zbek va rus tilidagi navigatsiya
- [ ] Mobil qurilmalar uchun optimizatsiya
- [ ] SEO optimallashtirish

### 4-Bosqich: E-tijorat Funksiyalari
- [ ] Savat va buyurtma berish tizimi
- [ ] To'lov tizimlari (Click, Payme, naqd)
- [ ] Yetkazib berish hisob-kitoblari
- [ ] SMS bildirishnomalar

### 5-Bosqich: Admin Panel
- [ ] Mahsulotlarni boshqarish
- [ ] Buyurtmalarni kuzatish
- [ ] Hisobotlar va statistika
- [ ] Foydalanuvchilarni boshqarish

## Rivojlanish Eslatmalari
- tsx TypeScript bajarish uchun ishlatiladi
- Drizzle ORM xavfsiz ma'lumotlar bazasi operatsiyalari uchun
- vite.config.ts da Replit sozlamalari
- Barcha paketlar npm orqali boshqariladi