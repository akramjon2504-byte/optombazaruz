# OptomBazar - O'zbekistonda Optom Savdo Platformasi

## Loyiha Haqida

OptomBazar.uz - bu zamonaviy optom savdo elektron tijorat platformasi bo'lib, O'zbekiston bozoriga mo'ljallangan. Loyiha React, TypeScript, Express.js va PostgreSQL texnologiyalari asosida qurilgan.

## ✨ Asosiy Xususiyatlar

### 🛒 E-tijorat Funksiyalari
- Mahsulotlar katalogi (20+ mahsulot, 8 kategoriya)
- Qidiruv va filtrlash tizimi
- Savatcha va buyurtma berish
- Foydalanuvchi autentifikatsiyasi
- Sevimli mahsulotlar ro'yxati

### 🌐 Ko'p Tilli Qo'llab-quvvatlash
- O'zbek tili (asosiy)
- Rus tili
- Til almashtirish imkoniyati

### 🤖 AI Integratsiya
- Gemini 1.5 Flash API orqali kontent yaratish
- Avtomatik blog postlari (kuniga 12 ta)
- AI chat widget
- Marketing kontent generatsiyasi

### 📱 Telegram Bot
- @optombazaruzb bot integratsiyasi
- Avtomatik marketing postlar
- Admin boshqaruv paneli

### 📊 Admin Panel
- Mahsulotlarni boshqarish
- Kategoriyalarni boshqarish
- Buyurtmalarni kuzatish
- Foydalanuvchilar boshqaruvi

## 🏗️ Texnik Arxitektura

### Frontend
- **React 18** + TypeScript
- **Vite** - build tool
- **TailwindCSS** + shadcn/ui komponentlari
- **TanStack Query** - server state boshqaruvi
- **Wouter** - routing
- **Framer Motion** - animatsiyalar

### Backend
- **Express.js** + TypeScript
- **Passport.js** - autentifikatsiya
- **Session-based auth** - xavfsizlik

### Ma'lumotlar Bazasi
- **PostgreSQL** - asosiy ma'lumotlar bazasi
- **Drizzle ORM** - ma'lumotlar bazasi boshqaruvi
- Xavfsiz migratsiyalar

### AI va Integratsiyalar
- **Google Gemini 1.5 Flash** - AI kontent yaratish
- **Telegram Bot API** - marketing avtomatizatsiyasi
- **Node-telegram-bot-api** - bot kutubxonasi

## 📦 O'rnatish va Ishga Tushirish

### Talablar
- Node.js 20+
- PostgreSQL 14+
- npm yoki yarn

### Mahalliy Rivojlantirish

1. **Repositoriyani klonlang:**
```bash
git clone <repository-url>
cd optombazar
```

2. **Bog'liqliklarni o'rnating:**
```bash
npm install
```

3. **Environment o'zgaruvchilarini sozlang:**
```bash
# .env fayli yarating va quyidagi qiymatlarni qo'shing:
DATABASE_URL=postgresql://username:password@localhost:5432/optombazar
GOOGLE_API_KEY=your_google_api_key
```

4. **Ma'lumotlar bazasini sozlang:**
```bash
npm run db:push
```

5. **Loyihani ishga tushiring:**
```bash
npm run dev
```

Loyiha http://localhost:5000 da ochiladi.

## 🚀 Production Deploy (Render)

### Avtomatik Deploy
1. Repository ni GitHub ga push qiling
2. Render.com da yangi Web Service yarating
3. GitHub repository ni bog'lang
4. Quyidagi sozlamalarni kiriting:

### Environment Variables
```
DATABASE_URL=your_postgresql_connection_string
GOOGLE_API_KEY=your_google_api_key
NODE_ENV=production
```

### Build Settings
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Node Version:** 20

### Database
- Render PostgreSQL add-on qo'shing
- DATABASE_URL avtomatik o'rnatiladi

## 📁 Fayl Tuzilishi

```
optombazar/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/    # UI komponentlari
│   │   ├── pages/         # Sahifalar
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Backend (Express)
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   └── storage.ts        # Ma'lumotlar bazasi
├── shared/               # Umumiy tiplar
└── README.md            # Bu fayl
```

## 🔧 Development Scriptlari

```bash
# Loyihani ishga tushirish (development)
npm run dev

# Production uchun build qilish
npm run build

# Production serverni ishga tushirish
npm run start

# TypeScript tekshirish
npm run check

# Ma'lumotlar bazasi migratsiyasi
npm run db:push
```

## ✅ Bajarilgan Ishlar

### Replit Agent dan Replit Migratsiya
- [x] PostgreSQL ma'lumotlar bazasi yaratildi
- [x] Barcha dependencies o'rnatildi
- [x] TypeScript xatolari tuzatildi
- [x] Database schema deploy qilindi
- [x] Server 5000 portda ishlamoqda

### AI va Automation
- [x] Gemini 1.5 Flash API integratsiyasi
- [x] Telegram bot (@optombazaruzb) konfiguratsiyasi
- [x] Avtomatik blog generation (12 posts/day)
- [x] Marketing posts automation (har 6 soatda)

### UI va UX
- [x] Mobil responsive dizayn
- [x] O'zbek/Rus tillari qo'llab-quvvatlash
- [x] Admin panel autentifikatsiya
- [x] Mahsulot katalogi va savatcha

## 📋 Keyingi Bosqichlar

### 2-Bosqich: Mahsulot Katalogi Kengaytirish
- [ ] Optombazar.uz dan mahsulotlar import
- [ ] Mahsulot rasmlari optimizatsiya
- [ ] Kategoriyalar tuzilishini yaxshilash
- [ ] Narxlarni so'm valyutasida ko'rsatish

### 3-Bosqich: To'lov va Yetkazib Berish
- [ ] Click/Payme to'lov tizimlari
- [ ] Naqd to'lov opsiyasi
- [ ] Yetkazib berish kalkulatori
- [ ] SMS bildirishnomalar

### 4-Bosqich: Marketing va SEO
- [ ] SEO optimizatsiya
- [ ] Google Analytics integratsiyasi
- [ ] Meta tags va Open Graph
- [ ] Sitemap yaratish

### 5-Bosqich: Analytics va Hisobotlar
- [ ] Sotuvlar statistikasi
- [ ] Foydalanuvchilar analytics
- [ ] Admin dashboard
- [ ] Excel/PDF export

## 🛠️ Texnik Xususiyatlar

### Xavfsizlik
- Session-based authentication
- CSRF himoya
- SQL injection himoya (Drizzle ORM)
- Environment variables xavfsizligi

### Performance
- Lazy loading komponentlari
- Image optimization
- Database indexing
- CDN tayyor struktura

### Monitoring
- Error logging
- API response vaqti
- Database performance
- Telegram bot monitoring

## 📞 Kontakt Ma'lumotlari

- **Telefon:** +998 99 644 84 44
- **Telegram:** @optombazaruzb
- **Website:** OptomBazar.uz

## 📝 License

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

---

**OptomBazar.uz** - O'zbekiston optom savdo sohasining raqamli kelajagi!