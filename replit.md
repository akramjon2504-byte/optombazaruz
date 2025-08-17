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
- Multilingual support (Uzbek/Russian)
- Product catalog with categories, search, filtering
- Shopping cart and wishlist functionality
- User authentication and admin panel
- Payment integration (Stripe, QR cards, cash on delivery)
- Blog system with AI content generation
- Analytics and customer insights
- Telegram bot integration
- Real-time notifications

## Recent Changes (Migration)
- **2024-08-17**: Successfully migrated from Replit Agent to Replit
  - Created PostgreSQL database and pushed schema
  - Fixed ProductCard component interface to match database schema
  - Updated image handling from `images` array to `imageUrl` fields
  - Verified all dependencies are installed and working
  - Application now running successfully on port 5000

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

### 1-Bosqich: Tilni Tozalash ✓
- [x] Ingliz tilidagi so'zlarni aniqlash va almashtirish
- [x] O'zbek va rus tilidagi tarjimalarni to'liq tekshirish
- [x] UI komponentlarida til sozlamalarini sozlash

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