# OptomBazar.uz - O'zbekistonning Eng Yirik Optom Bozori

![OptomBazar Logo](https://optombazar.uz/favicon.ico)

## 📋 Loyiha Haqida

OptomBazar.uz - O'zbekistonda eng katta va ishonchli optom savdo platformasi. Bu loyiha to'liq funksional elektron tijorat veb-ilovasi bo'lib, ikki tilda (o'zbek va rus) qo'llab-quvvatlaydi.

## 🚀 Asosiy Xususiyatlar

### 💼 E-tijorat Funksiyalari
- ✅ Ko'p tilli qo'llab-quvvatlash (O'zbek/Rus)
- ✅ Mahsulot katalogi va kategoriyalar
- ✅ Qidiruv va filtr tizimi
- ✅ Savatcha va buyurtma berish
- ✅ Foydalanuvchi autentifikatsiyasi
- ✅ Admin panel va boshqaruv tizimi

### 🤖 AI-Powered Funksiyalar
- ✅ Telegram bot (@optombazaruzb) marketing avtomatizatsiyasi
- ✅ Gemini 2.5 Flash API orqali kontent generatsiyasi
- ✅ Avtomatik blog postlari (kuniga 12 ta)
- ✅ AI chat widget mijozlar uchun
- ✅ Marketing postlari avtomatizatsiyasi

### 📱 Mobil Responsive
- ✅ To'liq mobil optimizatsiya
- ✅ Adaptive dizayn
- ✅ Touch-friendly interfeys

## 🛠 Texnik Arxitektura

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query + React Context
- **Routing**: Wouter

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js (session-based)

### AI va Bot Integration
- **AI Model**: Google Gemini 2.5 Flash
- **Telegram Bot**: @optombazaruzb
- **Content Generation**: Avtomatik blog va marketing postlari

## 📦 O'rnatish va Ishga Tushirish

### Talablar
- Node.js 18+
- PostgreSQL database
- Telegram Bot Token (ixtiyoriy)
- Gemini API Key (ixtiyoriy)

### Loyihani Ishga Tushirish

1. **Dependencies o'rnatish:**
```bash
npm install
```

2. **Database sozlash:**
```bash
npm run db:push
```

3. **Serverni ishga tushirish:**
```bash
npm run dev
```

Loyiha http://localhost:5000 da ochiladi.

## 🗂 Katalog Tuzilishi

```
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/    # UI komponentlar
│   │   ├── pages/         # Sahifalar
│   │   ├── contexts/      # React Context
│   │   └── hooks/         # Custom hooks
├── server/                # Backend (Express)
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database layer
│   └── index.ts          # Server entry point
├── shared/               # Umumiy kod
│   ├── schema.ts         # Database schema
│   └── languages.ts      # Til sozlamalari
└── README.md            # Bu fayl
```

## 📊 Ma'lumotlar Bazasi

### Asosiy Jadvallar
- `users` - Foydalanuvchilar
- `categories` - Mahsulot kategoriyalari
- `products` - Mahsulotlar
- `cart_items` - Savatcha elementlari
- `orders` - Buyurtmalar
- `blog_posts` - Blog postlari

## 🌐 API Endpoints

### Autentifikatsiya
- `POST /api/auth/login` - Kirish
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `GET /api/auth/user` - Foydalanuvchi ma'lumotlari

### Mahsulotlar
- `GET /api/products` - Barcha mahsulotlar
- `GET /api/products/:id` - Bitta mahsulot
- `POST /api/products` - Yangi mahsulot (admin)

### Kategoriyalar
- `GET /api/categories` - Barcha kategoriyalar
- `POST /api/categories` - Yangi kategoriya (admin)

### Savatcha
- `GET /api/cart` - Savatcha
- `POST /api/cart` - Savatga qo'shish
- `DELETE /api/cart/:id` - Savatdan o'chirish

## 🎨 Dizayn Tizimi

### Ranglar
- **Primary**: Ko'k (`#2563eb`)
- **Secondary**: Kulrang
- **Accent**: Yashil (`#16a34a`)
- **Warning**: Sariq
- **Error**: Qizil

### Shriftlar
- **Asosiy**: Inter, system fonts
- **O'lchamlar**: 12px dan 48px gacha

## 🔧 Konfiguratsiya

### Muhit O'zgaruvchilari
```env
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your_gemini_key
TELEGRAM_BOT_TOKEN=your_bot_token
NODE_ENV=development
```

## 📈 Performance va Optimizatsiya

- ✅ Code splitting
- ✅ Image lazy loading
- ✅ API response caching
- ✅ Database indexes
- ✅ CSS optimization

## 🔒 Xavfsizlik

- ✅ Session-based authentication
- ✅ CSRF himoyasi
- ✅ Input validation
- ✅ SQL injection himoyasi
- ✅ Rate limiting

## 📱 Kontakt Ma'lumotlari

- **Telefon**: +998 99 644 84 44
- **Telegram**: [@optombazaruzb](https://t.me/optombazaruzb)
- **Telegram Bot**: [@optombazaruzb](https://t.me/optombazaruzbot)
- **Veb-sayt**: [optombazar.uz](https://optombazar.uz)

## 🤝 Qo'llab-quvvatlash

Texnik yordam va savol-javoblar uchun:
- Telegram: [@optombazaruzb](https://t.me/optombazaruzb)
- 24/7 qo'llab-quvvatlash

## 📄 Litsenziya

© 2024 OptomBazar.uz. Barcha huquqlar himoyalangan.

---

**OptomBazar.uz** - O'zbekistonning eng ishonchli optom savdo platformasi! 🛍️