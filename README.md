# OptomBazar - Uzbekistan Wholesale Marketplace

OptomBazar.uz ning zamonaviy React/Node.js versiyasi - O'zbekiston optom bozori uchun e-commerce platforma.

## Asosiy Xususiyatlar

- **Zamonaviy Stack**: React 18 + TypeScript + Express.js + PostgreSQL
- **Ko'p Tilli Qo'llab-quvvatlash**: O'zbek va Rus tillari
- **AI Chat Assistant**: Google Gemini AI integratsiyasi
- **Telegram Marketing**: @optombazaruzb kanali orqali avtomatik reklama
- **Admin Panel**: Blog yozuvlari va statistikalarni boshqarish
- **QR Card To'lovlari**: Zamonaviy to'lov tizimlari

## Texnik Ma'lumotlar

### Frontend
- React 18 + TypeScript
- shadcn/ui komponentlari
- Tailwind CSS
- TanStack Query
- Wouter routing

### Backend
- Express.js + TypeScript
- Drizzle ORM
- PostgreSQL ma'lumotlar bazasi
- Session-based authentication
- Google OAuth integratsiyasi

### AI Xizmatlari
- Google Gemini AI (chat + blog generation)
- Telegram Bot API (marketing)

## Development

```bash
npm install
npm run dev
```

## Render.com ga Deploy Qilish

1. GitHub repository yarating
2. Render.com da Web Service yarating
3. Environment variables qo'shing:
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `GOOGLE_OAUTH_CLIENT_ID`
   - `GOOGLE_OAUTH_CLIENT_SECRET`

4. OAuth Callback URL ni yangilang:
   ```
   https://your-app.onrender.com/api/callback
   ```

## OAuth Callback URL O'zgartirish

Render.com ga deploy qilganingizda, Google OAuth sozlamalarida callback URL ni yangilashingiz kerak:

1. [Google Cloud Console](https://console.cloud.google.com/) ga kiring
2. OAuth 2.0 Client IDs bo'limiga o'ting
3. Callback URL ni yangilang:
   - Development: `https://replit-domen.replit.dev/api/callback`
   - Production: `https://your-app.onrender.com/api/callback`

## Environment Variables

### Majburiy
- `DATABASE_URL` - PostgreSQL ma'lumotlar bazasi URL
- `SESSION_SECRET` - Session shifrlash kaliti

### Ixtiyoriy (AI/Marketing uchun)
- `GEMINI_API_KEY` - Google Gemini AI
- `TELEGRAM_BOT_TOKEN` - Telegram bot
- `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth

## Loyiha Strukturasi

```
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Umumiy turlar va schemalar
├── render.yaml      # Render deployment config
└── package.json.render  # Production dependencies
```