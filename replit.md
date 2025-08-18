# Optombazar - O'zbekistonda Optom Bozori

## Overview
Optombazar is a full-featured e-commerce web application designed for the Uzbek market, supporting both Uzbek and Russian languages. It aims to be a leading online wholesale marketplace in Uzbekistan. Key capabilities include a comprehensive product catalog, shopping cart functionality, robust user authentication, an administrative panel, diverse payment integrations, and advanced AI-powered marketing and customer engagement tools. The project vision is to establish a dominant online presence for wholesale trade, leveraging AI for efficiency and market outreach.

## User Preferences
- Sayt faqat o'zbek va rus tillarida bo'lishi kerak
- Ingliz tilidagi so'zlarni olib tashlash kerak
- Optombazar.uz saytiga mos keluvchi dizayn va funksiyalar

## System Architecture
The application is built with a modern web stack, ensuring scalability, performance, and maintainability.

### Technical Stack
-   **Frontend**: React 18 with TypeScript and Vite for a fast and efficient development experience.
-   **Backend**: Express.js with TypeScript, providing a robust and flexible API layer.
-   **Database**: PostgreSQL, managed with Drizzle ORM for type-safe and efficient database interactions.
-   **Styling**: TailwindCSS for utility-first CSS, complemented by shadcn/ui components for a consistent and accessible UI.
-   **Authentication**: Passport.js with session-based authentication for secure user management, including Google OAuth2 integration.
-   **State Management**: TanStack Query for server state management (API calls) and React Context for global UI state.

### Core Features & Design Patterns
-   **Multilingual Support**: Comprehensive support for Uzbek and Russian languages across the entire application, including UI, content, and data.
-   **Product Management**: Features a detailed product catalog with categories, search, and filtering capabilities.
-   **E-commerce Functionality**: Includes shopping cart, wishlist, and a complete order and payments system.
-   **Admin Panel**: A dedicated administrative interface for managing products, orders, users, and content.
-   **AI-Powered Content Generation**: Integration of Gemini 1.5 Flash API for automated generation of blog posts (daily) and marketing content (daily, specifically for Telegram), emphasizing professional, markdown-free copywriting.
-   **AI Chat Widget**: A real-time AI-powered chat widget with Gemini integration, requiring user registration (name, phone number) and storing chat history in the admin panel.
-   **Marketing Automation**: Automated Telegram bot (@optombazaruzb) for marketing campaigns, including daily product showcases and weekly promotions, utilizing real product data.
-   **Mobile Responsiveness**: UI/UX is optimized for mobile devices, ensuring a seamless experience across various screen sizes.
-   **Payment Integration**: Supports multiple payment methods including Stripe, QR card payments (Humo/UzCard), and cash on delivery.
-   **Robust Error Handling**: Focus on eliminating TypeScript errors, duplicate keys, and ensuring data validation.

## External Dependencies
-   **PostgreSQL**: Primary database for storing application data.
-   **Gemini 1.5 Flash API**: Utilized for AI-powered content generation (blog posts, marketing content) and the AI chat widget.
-   **Telegram Bot API**: For the @optombazaruzb marketing automation bot.
-   **Passport.js**: For session-based authentication.
-   **Google OAuth2**: For user authentication via Google accounts.
-   **Stripe**: For payment processing.
-   **Humo/UzCard**: Integrated for local QR-based payment systems.