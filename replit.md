# E-Commerce Application - Replit Migration

## Project Overview
This is a full-stack e-commerce web application that was successfully migrated from Replit Agent to the standard Replit environment. The application features multilingual support (Uzbek/Russian), product catalog management, shopping cart functionality, user authentication, and admin features.

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

## User Preferences
- No specific preferences documented yet

## Development Notes
- Uses tsx for TypeScript execution in development
- Drizzle ORM for type-safe database operations
- Replit-specific configurations in vite.config.ts
- All packages managed through npm (avoid manual package.json edits)