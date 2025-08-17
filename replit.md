# OptomBazar.uz - E-commerce Platform

## Project Overview
OptomBazar.uz is a full-stack e-commerce platform for wholesale and retail commerce in Uzbekistan. The application supports both Uzbek and Russian languages and includes comprehensive features for product catalog, cart management, user authentication, admin panel, and payment processing.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: Session-based with support for Google OAuth
- **Payment**: Stripe integration
- **Communication**: Telegram bot integration
- **State Management**: TanStack Query (React Query v5)
- **Routing**: Wouter for client-side routing

## Key Features
- Multi-language support (Uzbek/Russian)
- Product catalog with categories, search, and filtering
- Shopping cart and wishlist functionality
- User authentication (email/password and Google OAuth)
- Admin panel for product and order management
- Payment processing with Stripe
- Telegram bot for customer communication
- Blog system with AI content generation
- Analytics and customer insights

## Project Structure
```
/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   └── contexts/     # React contexts
├── server/               # Express backend
│   ├── routes.ts         # API routes
│   ├── db.ts            # Database connection
│   ├── storage.ts       # Data access layer
│   └── services/        # Business logic services
├── shared/               # Shared types and schemas
│   ├── schema.ts        # Database schema and types
│   └── languages.ts     # Language definitions
└── migrations/           # Database migrations
```

## Database Schema
The application uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `categories` - Product categories with multilingual names
- `products` - Product catalog with pricing and inventory
- `cart_items` - Shopping cart items
- `orders` - Customer orders and order items
- `reviews` - Product reviews and ratings
- `blog_posts` - Blog content
- `analytics_events` - User interaction tracking

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe API key for payments
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `OPENAI_API_KEY` - OpenAI API key for content generation

## User Preferences
- Architecture: Modern full-stack JavaScript with TypeScript
- Database: PostgreSQL with Drizzle ORM
- UI Framework: React with shadcn/ui components
- Styling: Tailwind CSS with responsive design
- Code Style: TypeScript with strict type checking
- Security: Session-based authentication with proper CSRF protection

## Recent Changes
- **Migration Completed**: Successfully migrated from Replit Agent to standard Replit environment  
- **Database Setup**: PostgreSQL database provisioned, tables created, and sample data seeded
- **Dependencies**: All required packages installed and configured
- **Build System**: Vite configuration working with proper aliases
- **Server**: Express server running on port 5000 with both API and static file serving
- **Errors Fixed**: All TypeScript errors resolved, authentication working properly
- **Admin Login**: Fixed admin credentials (Username: Akramjon, Password: GIsobot201415*)

## Deployment
The application is configured to run on Replit with:
- Single port deployment (port 5000) serving both frontend and backend
- Automatic database migrations on startup
- Environment variable configuration
- Production build optimization

## Next Steps
- Application is ready for use and development
- All core features are functional
- Database is seeded with sample data
- Ready for deployment to production