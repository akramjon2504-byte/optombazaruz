import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { authService } from "./services/auth";
import { insertUserSchema, insertCategorySchema, insertProductSchema, insertCartItemSchema, insertWishlistItemSchema, insertChatMessageSchema, insertOrderSchema, insertPaymentSchema, insertBlogPostSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateChatResponse } from "./services/gemini";
import { blogService } from "./services/blog";
import { telegramService } from "./services/telegram";
import telegramRoutes from "./routes/telegram";
import { seedDatabase } from "./seedData";
import { PaymentService } from "./services/payment";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration - using memory store for now
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Keep false for development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Seed database with real OptomBazar.uz data
  await seedDatabase();

  // Define middleware functions
  const requireAuth = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  const requireAdmin = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = await storage.getUser(req.user.id);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };

  // Admin routes
  app.get('/api/admin/stats', requireAuth, requireAdmin, async (req, res) => {
    try {
      // Get basic stats
      const stats = {
        totalUsers: await storage.getUserCount(),
        totalOrders: 0,
        monthlySales: 0,
        totalMessages: 0
      };
      res.json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/admin/telegram/send', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { message } = req.body;
      const success = await telegramService.sendToChannel(message);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ message: 'Telegram xabari yuborilmadi' });
      }
    } catch (error) {
      console.error('Telegram send error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/admin/blog/generate', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { topic } = req.body;
      const blogPost = await blogService.generateBlogPost(topic);
      res.json(blogPost);
    } catch (error) {
      console.error('Blog generation error:', error);
      res.status(500).json({ message: 'Blog yaratishda xatolik' });
    }
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      if (!validatedData.email || !validatedData.password) {
        return res.status(400).json({ message: 'Email va parol majburiy' });
      }
      const user = await authService.registerUser(validatedData as any);
      
      // Send welcome message to Telegram channel
      try {
        // Welcome message functionality can be added later
      } catch (telegramError) {
        console.log('Telegram message failed, but registration successful:', telegramError);
      }
      
      res.status(201).json(user);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Ro\'yxatdan o\'tishda xatolik' });
    }
  });

  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await authService.adminLogin(username, password);
      
      // Store admin in session
      const session = req.session as any;
      session.userId = admin.id;
      session.isAdmin = admin.isAdmin;
      session.user = admin;
      
      res.json(admin);
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(401).json({ message: error instanceof Error ? error.message : 'Admin kirish xatoligi' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await authService.loginUser({ email, password });
      
      // Store user in session
      const session = req.session as any;
      session.userId = user.id;
      session.isAdmin = user.isAdmin;
      session.user = user;
      
      res.json(user);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ message: error instanceof Error ? error.message : 'Kirish xatoligi' });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout xatoligi' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await authService.getUserById(userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Categories CRUD routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/admin/categories', requireAuth, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      
      // Send notification to Telegram about new category
      try {
        const message = `🎯 Yangi kategoriya qo'shildi!\n\n📂 ${category.nameUz}\n📂 ${category.nameRu}\n\nOptomBazar.uz - eng yaxshi mahsulotlar!`;
        await telegramService.sendToChannel(message);
      } catch (telegramError) {
        console.log('Telegram notification failed:', telegramError);
      }
      
      res.status(201).json(category);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Kategoriya yaratishda xatolik' });
    }
  });

  app.put('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      console.error('Update category error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Kategoriya yangilashda xatolik' });
    }
  });

  app.delete('/api/admin/categories/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({ message: 'Kategoriya o\'chirishda xatolik' });
    }
  });

  // Products CRUD routes
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, isHit, isPromo, search } = req.query;
      const filters = {
        categoryId: categoryId as string,
        isHit: isHit === 'true' ? true : isHit === 'false' ? false : undefined,
        isPromo: isPromo === 'true' ? true : isPromo === 'false' ? false : undefined,
        search: search as string
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/admin/products', requireAuth, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      
      // Send notification to Telegram about new product with Gemini generated marketing
      try {
        const marketingMessage = await generateChatResponse(
          `Yangi mahsulot OptomBazar.uz da qo'shildi: ${product.nameUz}. Bu mahsulot uchun qisqa marketing xabari yoz, faqat o'zbek tilida. Narxi: ${product.price} so'm. Emoji ishlatgin va jozibali qiling.`
        );
        await telegramService.sendToChannel(marketingMessage);
      } catch (error) {
        console.log('Marketing message generation failed:', error);
        // Fallback message
        const fallbackMessage = `🎉 Yangi mahsulot!\n\n${product.nameUz}\n💰 Narx: ${product.price} so'm\n\nOptomBazar.uz - eng yaxshi mahsulotlar!`;
        await telegramService.sendToChannel(fallbackMessage);
      }
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Mahsulot yaratishda xatolik' });
    }
  });

  app.put('/api/admin/products/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Mahsulot yangilashda xatolik' });
    }
  });

  app.delete('/api/admin/products/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Mahsulot o\'chirishda xatolik' });
    }
  });

  // Admin login endpoint
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check credentials
      if (username === 'Akramjon' && password === 'GIsobot201415*') {
        // Set session
        (req.session as any).isAdmin = true;
        (req.session as any).user = { username: 'Akramjon', isAdmin: true };
        (req.session as any).userId = 'admin-user';
        
        console.log('Session set:', req.session);
        
        res.json({ success: true, user: { username: 'Akramjon', isAdmin: true } });
      } else {
        res.status(401).json({ message: 'Noto\'g\'ri username yoki parol' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  });

  // Auto Marketing API endpoint
  app.post('/api/admin/auto-marketing', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { type, topic } = req.body;
      
      let prompt = '';
      
      switch (type) {
        case 'daily':
          prompt = `OptomBazar.uz uchun kunlik aksiya xabari yoz. O'zbek tilida, qisqa va jozibali, emoji bilan. Optom savdo va chegirmalar haqida.`;
          break;
        case 'product':
          prompt = `OptomBazar.uz da ${topic} mahsuloti uchun marketing xabari yoz. O'zbek tilida, mahsulot afzalliklarini ko'rsating, emoji bilan.`;
          break;
        case 'seasonal':
          prompt = `OptomBazar.uz uchun ${topic} mavzusida mavsumiy aksiya xabari yoz. O'zbek tilida, mavsumiy maxsus takliflar haqida.`;
          break;
        case 'custom':
          prompt = `OptomBazar.uz uchun ${topic} haqida marketing xabari yoz. O'zbek tilida, jozibali va emoji bilan.`;
          break;
        default:
          prompt = `OptomBazar.uz uchun yangi aksiya xabari yoz. O'zbek tilida, qisqa va jozibali.`;
      }
      
      // Generate marketing message using Gemini
      const marketingMessage = await generateChatResponse(prompt);
      
      // Send to Telegram channel
      await telegramService.sendToChannel(marketingMessage);
      
      res.json({ 
        success: true, 
        message: marketingMessage,
        description: 'AI marketing xabari yaratildi va yuborildi'
      });
    } catch (error) {
      console.error('Auto marketing error:', error);
      res.status(500).json({ message: 'AI marketing xabarini yaratishda xatolik' });
    }
  });

  // Auto marketing endpoint - Gemini generates and sends marketing messages
  app.post('/api/admin/marketing/auto', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { type, topic } = req.body;
      
      let prompt = '';
      switch (type) {
        case 'daily':
          prompt = `OptomBazar.uz uchun kunlik aksiya haqida marketing xabari yoz. O'zbek tilida, emoji bilan, jozibali qiling.`;
          break;
        case 'product':
          prompt = `OptomBazar.uz dagi ${topic} mahsuloti haqida marketing xabari yoz. O'zbek tilida, emoji bilan, sotuvni oshiruvchi qiling.`;
          break;
        case 'seasonal':
          prompt = `OptomBazar.uz uchun ${topic} mavsumi aksiyasi haqida marketing xabari yoz. O'zbek tilida, emoji bilan, jozibali qiling.`;
          break;
        default:
          prompt = `OptomBazar.uz uchun umumiy marketing xabari yoz: ${topic}. O'zbek tilida, emoji bilan, jozibali qiling.`;
      }
      
      const marketingMessage = await generateChatResponse(prompt);
      const success = await telegramService.sendToChannel(marketingMessage);
      
      if (success) {
        res.json({ success: true, message: marketingMessage });
      } else {
        res.status(400).json({ message: 'Marketing xabari yuborilmadi' });
      }
    } catch (error) {
      console.error('Auto marketing error:', error);
      res.status(500).json({ message: 'Marketing yaratishda xatolik' });
    }
  });

  // Check user auth status
  app.get('/api/auth/user', (req, res) => {
    try {
      const session = req.session as any;
      
      // Log session information
      const sessionInfo = {
        sessionID: req.sessionID,
        hasSession: !!req.session,
        isAdmin: session?.isAdmin,
        hasUser: !!session?.user,
        sessionKeys: Object.keys(session || {}),
        cookieValue: req.headers.cookie
      };
      
      // Debug: send session info for diagnosis
      if (req.query.debug === 'true') {
        return res.json({ debug: sessionInfo });
      }
      
      if (session?.isAdmin && session?.user) {
        res.json(session.user);
      } else {
        res.status(401).json({ 
          message: 'Unauthorized',
          debug: sessionInfo
        });
      }
    } catch (error) {
      console.error('AUTH ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout xatosi' });
      }
      res.json({ success: true });
    });
  });

  // Legacy setupAuth removed - using simple session-based auth

  // QR Card payment endpoint
  app.post('/api/payment/qr-card', async (req, res) => {
    try {
      const { orderId, qrCardNumber } = req.body;
      
      if (!orderId || !qrCardNumber) {
        return res.status(400).json({ message: "Order ID and QR card number required" });
      }

      const success = await PaymentService.processQRCardPayment(orderId, qrCardNumber);
      
      if (success) {
        res.json({ success: true, message: "Payment processed successfully" });
      } else {
        res.status(400).json({ success: false, message: "Payment processing failed" });
      }
    } catch (error) {
      console.error("QR Card payment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Bank transfer payment endpoint
  app.post('/api/payment/bank-transfer', async (req, res) => {
    try {
      const { orderId, bankDetails } = req.body;
      
      if (!orderId || !bankDetails) {
        return res.status(400).json({ message: "Order ID and bank details required" });
      }

      const success = await PaymentService.processBankTransfer(orderId, bankDetails);
      
      if (success) {
        res.json({ success: true, message: "Bank transfer initiated" });
      } else {
        res.status(400).json({ success: false, message: "Bank transfer failed" });
      }
    } catch (error) {
      console.error("Bank transfer error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cash on delivery endpoint
  app.post('/api/payment/cash-delivery', async (req, res) => {
    try {
      const { orderId } = req.body;
      
      if (!orderId) {
        return res.status(400).json({ message: "Order ID required" });
      }

      const success = await PaymentService.processCashOnDelivery(orderId);
      
      if (success) {
        res.json({ success: true, message: "Cash on delivery order confirmed" });
      } else {
        res.status(400).json({ success: false, message: "Order confirmation failed" });
      }
    } catch (error) {
      console.error("Cash on delivery error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, isHit, isPromo, search } = req.query;
      const filters = {
        categoryId: categoryId as string,
        isHit: isHit === 'true' ? true : isHit === 'false' ? false : undefined,
        isPromo: isPromo === 'true' ? true : isPromo === 'false' ? false : undefined,
        search: search as string
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      const updatedItem = await storage.updateCartItem(req.params.id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const removed = await storage.removeFromCart(req.params.id);
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Wishlist
  app.get("/api/wishlist", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const wishlistItems = await storage.getWishlistItems(sessionId);
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const sessionId = req.sessionID;
      const validatedData = insertWishlistItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const wishlistItem = await storage.addToWishlist(validatedData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid wishlist item data" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const removed = await storage.removeFromWishlist(req.params.id);
      if (!removed) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove wishlist item" });
    }
  });

  // Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getProductReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Chat
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ message: "SessionId and message are required" });
      }

      // Store user message
      await storage.createChatMessage({
        sessionId,
        message,
        response: null,
        isFromUser: true
      });

      // Generate AI response
      const response = await generateChatResponse(message);

      // Store AI response
      const aiMessage = await storage.createChatMessage({
        sessionId,
        message: response,
        response: null,
        isFromUser: false
      });

      res.json({ response: aiMessage.message });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Blog
  app.get("/api/blog", async (req, res) => {
    try {
      const { limit } = req.query;
      const posts = await storage.getBlogPosts(limit ? parseInt(limit as string) : undefined);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Promo timer
  app.get("/api/promo-timer", async (req, res) => {
    try {
      const timer = await storage.getActivePromoTimer();
      res.json(timer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promo timer" });
    }
  });

  // Admin routes
  app.post("/api/admin/generate-blog", async (req, res) => {
    try {
      const success = await blogService.generateDailyBlog();
      if (success) {
        res.json({ message: "Blog post generated successfully" });
      } else {
        res.status(500).json({ message: "Failed to generate blog post" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to generate blog post" });
    }
  });

  app.post("/api/admin/send-promo", async (req, res) => {
    try {
      const success = await blogService.generateWeeklyPromo();
      if (success) {
        res.json({ message: "Promotion sent successfully" });
      } else {
        res.status(500).json({ message: "Failed to send promotion" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to send promotion" });
    }
  });

  // Payment Methods
  app.get("/api/payment-methods", (req, res) => {
    res.json(PaymentService.getPaymentMethods());
  });

  app.get("/api/payment/bank-details", async (req, res) => {
    try {
      const bankDetails = await PaymentService.getBankTransferDetails();
      res.json(bankDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bank details" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      orderData.sessionId = req.sessionID;
      
      if (req.user && (req.user as any).claims) {
        orderData.userId = (req.user as any).claims.sub;
      }

      const orderId = await PaymentService.createOrder(orderData);
      res.json({ orderId, message: "Order created successfully" });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const order = await storage.getOrder(req.params.id);
      
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Process QR Card Payment
  app.post("/api/payment/qr-card", async (req, res) => {
    try {
      const { orderId, cardNumber } = req.body;
      
      if (!orderId || !cardNumber) {
        return res.status(400).json({ message: "Order ID and card number are required" });
      }

      const success = await PaymentService.processQRCardPayment(orderId, cardNumber);
      
      if (success) {
        res.json({ message: "Payment processed successfully" });
      } else {
        res.status(400).json({ message: "Payment processing failed" });
      }
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Payment processing failed" 
      });
    }
  });

  // Admin blog management endpoints
  app.get('/api/admin/blog', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const posts = await storage.getBlogPosts(50);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/admin/blog', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const blogPostData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost({
        ...blogPostData,
        slug: blogPostData.titleUz.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '-'),
        isPublished: blogPostData.isPublished
      });
      
      res.status(201).json(blogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.patch('/api/admin/blog/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { isPublished } = req.body;
      
      await storage.updateBlogPost(id, { 
        isPublished
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.post('/api/admin/generate-blog-post', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { topic } = req.body;
      const blogPost = await blogService.generateBlogPost(topic || "E-tijorat va optom savdo");
      res.json(blogPost);
    } catch (error) {
      console.error("Error generating blog post:", error);
      res.status(500).json({ message: "Failed to generate blog post" });
    }
  });

  app.get('/api/admin/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const analytics = {
        totalUsers: 0,
        totalOrders: 0, 
        totalRevenue: 0,
        totalPosts: (await storage.getBlogPosts(1000)).length
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Use telegram routes
  app.use('/api', telegramRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
