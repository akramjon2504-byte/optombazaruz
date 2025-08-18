# Optombazar.uz - O'zbekiston Optom Bozori Yaratish Prompt

## Asosiy Talablar

**Sayt nomi:** Optombazar - O'zbekistonda Optom Bozori
**Domenlar:** optombazar.uz
**Tillar:** Faqat o'zbek va rus tili (ingliz tili yo'q!)

## Texnik Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + TypeScript  
- **Database:** PostgreSQL + Drizzle ORM
- **Styling:** TailwindCSS + shadcn/ui komponentlar
- **Autentifikatsiya:** Passport.js (session-based) + Google OAuth2
- **State Management:** TanStack Query + React Context

## Database Schema
```sql
-- Users jadvali
users: id, email, password, name, phone, role (user/admin), googleId, createdAt

-- Categories jadvali  
categories: id, nameUz, nameRu, slug, imageUrl, description

-- Products jadvali
products: id, nameUz, nameRu, descriptionUz, descriptionRu, price, categoryId, 
         imageUrl, slug, inStock, minQuantity, createdAt

-- Cart items
cartItems: id, userId, productId, quantity, sessionId

-- Orders
orders: id, userId, totalAmount, status, paymentMethod, shippingAddress, 
        phoneNumber, createdAt

-- Blog posts
blogPosts: id, titleUz, titleRu, contentUz, contentRu, imageUrl, slug, 
           excerpt, published, createdAt

-- Chat messages  
chatMessages: id, userName, userPhone, message, response, createdAt
```

## Asosiy Sahifalar va Komponentlar

### 1. Homepage (/)
- Hero section: "O'zbekistondagi eng yirik optom bozori"
- Kategoriyalar grid (8 ta asosiy kategoriya)
- Mashhur mahsulotlar (carousel)
- Til almashtirish tugmasi (O'zbek/Русский)
- AI chat widget (pastki o'ng burchakda)

### 2. Header Komponenti
```
Logo | Kategoriyalar | Qidiruv | Savatcha | Profil/Kirish
+998 99 644 84 44 | @optombazaruzb | Til: O'z/Ru
```

### 3. Mahsulotlar Sahifasi (/products)
- Kategoriya bo'yicha filtr
- Narx bo'yicha tartiblash
- Grid layout (3-4 mahsulot har qatorda)
- Pagination
- Miqdor inputi (raqam kiritish mumkin)

### 4. Mahsulot Detali (/products/:slug)
- Katta rasm + thumb rasmlar
- Narx, tavsif (o'zbek/rus)
- Miqdor tanlash (input + plus/minus tugmalar)
- "Savatga qo'shish" tugmasi
- Tegishli mahsulotlar

### 5. Savatcha (/cart)
- Mahsulotlar ro'yxati
- Miqdorni o'zgartirish
- Jami narx hisoblash
- "Buyurtma berish" tugmasi

### 6. To'lov Sahifasi (/checkout)
- Yetkazib berish ma'lumotlari forması
- To'lov usullari:
  * QR kod to'lov (Humo/UzCard)
  * Stripe karta to'lovi  
  * Naqd to'lov
- QR kod rasmi: 5614 6822 1912 1078 (Akram Farmonov)

### 7. Autentifikatsiya
- Login/Register formalar
- Google OAuth tugmasi
- Session-based auth
- Admin panel kirish (/admin/login)

### 8. Admin Panel (/admin)
- Dashboard: statistika, grafik
- Mahsulotlar CRUD (yaratish, tahrirlash, o'chirish)
- Kategoriyalar boshqaruvi
- Buyurtmalar ro'yxati va holati
- Blog maqolalari boshqaruvi
- Chat xabarlari tarixi
- AI content generation tugmalari

## AI Integration

### 1. Gemini 1.5 Flash API
- Blog content avtomatik generatsiya (har 2 soatda)
- Marketing content yaratish
- AI chat widget javoblari
- Professional copywriting (markdown belgilarsiz)

### 2. Telegram Bot (@optombazaruzb)
- Kunlik mahsulot namoyishi (9:00, 15:00)
- Haftalik aksiya postlari (dushanba 10:00)
- Real mahsulotlar ma'lumotlaridan foydalanish
- O'zbek tilida marketing content

### 3. AI Chat Widget
- Foydalanuvchi registratsiyasi talab (ism, telefon)
- Chat tarixi admin panelda saqlanadi
- Real-time javoblar Gemini orqali

## Dizayn va UX

### Ranglar (TailwindCSS)
```css
:root {
  --primary: 210 40% 15%;        /* To'q ko'k */
  --secondary: 210 40% 90%;      /* Och ko'k */
  --accent: 25 95% 55%;          /* Orange */
  --background: 0 0% 100%;       /* Oq */
  --foreground: 222.2 84% 4.9%;  /* Qora matn */
}

.dark {
  --primary: 210 40% 90%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

### Mobil Responsive
- Mobile-first dizayn
- Header top bar faqat desktop
- Grid: 1 column (mobil), 3-4 columns (desktop)
- Touch-friendly tugmalar

## API Endpoints

### Frontend API
```
GET /api/products - Mahsulotlar ro'yxati
GET /api/categories - Kategoriyalar
GET /api/cart - Savatcha ma'lumotlari
POST /api/cart/add - Savatga qo'shish
GET /api/blog - Blog maqolalari
POST /api/chat - AI chat so'rovi
POST /api/orders - Buyurtma yaratish
GET /api/auth/user - Foydalanuvchi ma'lumoti
```

### Admin API
```
POST /api/admin/products - Mahsulot yaratish
PUT /api/admin/products/:id - Mahsulot yangilash
DELETE /api/admin/products/:id - Mahsulot o'chirish
POST /api/admin/blog/generate - AI blog yaratish
GET /api/admin/orders - Buyurtmalar ro'yxati
GET /api/admin/chat-messages - Chat tarixi
```

## Environment Variables
```
DATABASE_URL=postgresql://...
GOOGLE_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
TELEGRAM_BOT_TOKEN=your_bot_token
SESSION_SECRET=random_secret_key
```

## Loyiha Tuzilishi
```
/
├── client/
│   ├── src/
│   │   ├── components/ (UI komponentlar)
│   │   ├── pages/ (sahifalar)
│   │   ├── hooks/ (custom hooks)
│   │   ├── lib/ (utilities)
│   │   └── App.tsx
│   └── index.html
├── server/
│   ├── routes.ts (API routes)
│   ├── db.ts (database connection)
│   ├── storage.ts (CRUD operations)
│   └── index.ts (Express server)
├── shared/
│   └── schema.ts (Drizzle models)
└── package.json
```

## Asosiy Kategoriyalar (Database seed)
1. Полиэтиленовые пакеты - Polietilen paketlar
2. Одноразовая посуда - Bir martalik idishlar  
3. Товары для дома - Uy uchun mahsulotlar
4. Электроника - Elektronika
5. Одежда - Kiyim-kechak
6. Бытовая химия - Maishiy kimyo
7. Канцтовары - Kantselyariya buyumlari
8. Товары для праздников - Bayram buyumlari

## Muhim Eslatmalar
- Faqat o'zbek va rus tillarida content
- Narxlar so'mda ko'rsatish
- Telefon: +998 99 644 84 44
- Telegram: @optombazaruzb
- QR to'lov kartasi: 5614 6822 1912 1078
- Professional copywriting (* ** belgilarsiz)
- Session-based authentication
- Mobile-first responsive dizayn

## Ishga Tushirish
```bash
npm run db:push  # Database schema deploy
npm run dev      # Development server start
```

**Eslatma:** Bu prompt bilan AI to'liq funksional Optombazar saytini yarata oladi. Barcha detallar va texnik talablar kiritilgan.