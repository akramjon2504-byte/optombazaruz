# OptomBazar - Uzbekistan Wholesale Marketplace

## Overview

OptomBazar is a modern e-commerce platform built for the Uzbekistan wholesale market, recreating the original OptomBazar.uz website with enhanced functionality. The application serves as a comprehensive marketplace where businesses can browse and purchase wholesale products across multiple categories including polyethylene bags, disposable tableware, home goods, electronics, clothing, household chemicals, office supplies, and party supplies. The platform features a modern React frontend with shadcn/ui components, an Express.js backend API, and integrates AI-powered chat assistance and marketing automation through Telegram and Google's Gemini AI.

## Recent Changes (January 2025)

✓ Migrated from PHP-based Moguta CMS to modern React/Node.js stack
✓ Imported real product categories and catalog structure from original OptomBazar.uz sitemap
✓ Fixed critical API routing bugs in ProductGrid component 
✓ Integrated authentic Uzbekistan wholesale market data and product listings
✓ Added support for Russian language product names and descriptions matching original site
✓ Enhanced with modern features: AI chat, Telegram marketing, QR card payments

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for consistent theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Language Support**: Built-in internationalization supporting Uzbek and Russian languages

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod schemas integrated with Drizzle for runtime validation
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple

### Database Design
The application uses PostgreSQL with the following core entities:
- **Users**: Authentication and user profile management
- **Categories**: Hierarchical product categorization system
- **Products**: Core product catalog with multilingual content
- **Cart/Wishlist**: Shopping cart and wishlist functionality
- **Reviews**: Product review and rating system
- **Blog**: Content management for AI-generated blog posts
- **Chat**: AI chat conversation history

### AI Integration
- **Chat Assistant**: Google Gemini AI integration for customer support
- **Content Generation**: Automated blog post generation using Gemini
- **Marketing**: AI-powered promotional content creation

### Development Workflow
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Build Process**: Separate builds for client (Vite) and server (esbuild)

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database service via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe PostgreSQL operations with migration support

### AI Services
- **Google Gemini AI**: Natural language processing for chat assistance and content generation via `@google/genai`

### Communication
- **Telegram Bot API**: Marketing automation and customer notifications (dynamically imported)

### UI Framework
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui**: Pre-built component library built on Radix UI

### Development Tools
- **Vite**: Frontend build tool with development server
- **esbuild**: Fast JavaScript bundler for server builds
- **TypeScript**: Type checking and compilation
- **Replit Integration**: Development environment integration with cartographer and error overlay plugins