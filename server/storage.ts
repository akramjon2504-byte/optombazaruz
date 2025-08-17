import {
  type User, type InsertUser, type UpsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Review, type InsertReview,
  type BlogPost, type InsertBlogPost, type ChatMessage, type InsertChatMessage,
  type PromoTimer, type InsertPromoTimer, type Order, type InsertOrder,
  type Payment, type InsertPayment, type AnalyticsEvent, type InsertAnalyticsEvent,
  type CustomerInsight, type InsertCustomerInsight,
  users, categories, products, cartItems, wishlistItems, reviews, blogPosts, 
  chatMessages, promoTimers, orders, payments, analyticsEvents, customerInsights
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, or, sql, like } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { categoryId?: string; isHit?: boolean; isPromo?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;

  // Cart
  getCartItems(sessionId?: string, userId?: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId?: string, userId?: string): Promise<void>;

  // Wishlist
  getWishlistItems(sessionId?: string, userId?: string): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: string): Promise<boolean>;

  // Reviews
  getProductReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Blog
  getBlogPosts(limit?: number): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Chat
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Promo timers
  getActivePromoTimer(): Promise<PromoTimer | undefined>;
  createPromoTimer(timer: InsertPromoTimer): Promise<PromoTimer>;

  // Orders and Payments
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId?: string, sessionId?: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;
  
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(orderId: string, status: string, metadata?: any): Promise<void>;

  // Analytics
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  updateCustomerInsights(userId?: string, sessionId?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private wishlistItems: Map<string, WishlistItem> = new Map();
  private reviews: Map<string, Review> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private promoTimers: Map<string, PromoTimer> = new Map();
  private orders: Map<string, Order> = new Map();
  private payments: Map<string, Payment> = new Map();
  private analyticsEvents: Map<string, AnalyticsEvent> = new Map();
  private customerInsights: Map<string, CustomerInsight> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories - Real OptomBazar.uz categories from sitemap
    const categories = [
      { nameUz: "Polietilen paketlar", nameRu: "Полиэтиленовые пакеты", slug: "polietilenovye-pakety", icon: "fas fa-shopping-bag" },
      { nameUz: "Bir martalik idishlar", nameRu: "Одноразовая посуда", slug: "odnorazovaya-posuda", icon: "fas fa-utensils" },
      { nameUz: "Uy buyumlari, do'konlar, kafe, restoranlar uchun", nameRu: "Товары для дома, магазинов, кафе, ресторанов, баров", slug: "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov", icon: "fas fa-home" },
      { nameUz: "Elektronika", nameRu: "Электроника", slug: "elektronika", icon: "fas fa-laptop" },
      { nameUz: "Kiyim-kechak", nameRu: "Одежда", slug: "odejda", icon: "fas fa-tshirt" },
      { nameUz: "Maishiy kimyo", nameRu: "Бытовая химия", slug: "bytovaya-himiya", icon: "fas fa-spray-can" },
      { nameUz: "Kantselyariya tovarlari", nameRu: "Канцтовары для школы и офиса", slug: "kantstovary-dlya-shkoly-i-ofisa-vse-dlya-ucheby-i-raboty", icon: "fas fa-pen" },
      { nameUz: "Bayram tovarlari", nameRu: "Товары для праздников", slug: "tovary-dlya-prazdnikov", icon: "fas fa-gift" }
    ];

    categories.forEach(cat => {
      const id = randomUUID();
      this.categories.set(id, {
        id,
        ...cat,
        parentId: null,
        isActive: true
      });
    });

    // Seed products - Real OptomBazar.uz products from sitemap
    const products = [
      {
        nameUz: "Polietilen paket-mayka rasmsiz", nameRu: "Полиэтиленовый пакет-майка без рисунка",
        slug: "polietilenovyy-paket-mayka-bez-risunka", price: "850.00", originalPrice: "900.00",
        descriptionUz: "Yuqori sifatli polietilen paket-maykakar, rasmsiz, optom savdo uchun", descriptionRu: "Высококачественные полиэтиленовые пакеты-майка без рисунка для оптовой торговли",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "polietilenovye-pakety")?.id!,
        images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400"],
        isHit: false, isPromo: true, discountPercent: 6, stock: 10000, rating: "4.2", reviewCount: 128
      },
      {
        nameUz: "Fasovka paketlari va rulonlar", nameRu: "Фасовочные пакеты в рулонах", 
        slug: "fasovochnye-pakety-i-rulone", price: "12500.00", originalPrice: "14800.00",
        descriptionUz: "Shaffof fasovka paketlari, rulonlarda", descriptionRu: "Прозрачные фасовочные пакеты в рулонах",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "polietilenovye-pakety")?.id!,
        images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400"],
        isHit: true, isPromo: true, discountPercent: 16, stock: 5000, rating: "4.5", reviewCount: 89
      },
      {
        nameUz: "Plastik bir martalik idishlar", nameRu: "Одноразовая пластиковая посуда",
        slug: "odnorazovaya-plastikovaya-posuda", price: "7500.00", originalPrice: "9200.00",
        descriptionUz: "Ekologik toza bir martalik plastik idishlar to'plami", descriptionRu: "Экологически чистая одноразовая пластиковая посуда",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "odnorazovaya-posuda")?.id!,
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"],
        isHit: false, isPromo: true, discountPercent: 18, stock: 2500, rating: "4.8", reviewCount: 234
      },
      {
        nameUz: "Qog'ozdan bir martalik stakanlar va qopqoqlar", nameRu: "Одноразовые бумажные стаканы крышки и тарелки",
        slug: "odnorazovye-bumajnye-stakany-kryshki-i-tarelki", price: "18500.00",
        descriptionUz: "Qog'ozdan tayyorlangan bir martalik stakanlar, qopqoqlar va tarelkalar", descriptionRu: "Одноразовые бумажные стаканы, крышки и тарелки",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "odnorazovaya-posuda")?.id!,
        images: ["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"],
        isHit: true, isPromo: false, discountPercent: 0, stock: 1500, rating: "4.3", reviewCount: 156
      },
      {
        nameUz: "Tualet qog'ozi", nameRu: "Туалетная бумага",
        slug: "tualetnaya-bumaga", price: "28500.00",
        descriptionUz: "Yumshoq va mustahkam tualet qog'ozi", descriptionRu: "Мягкая и прочная туалетная бумага",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov")?.id!,
        images: ["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400"],
        isHit: true, isPromo: false, discountPercent: 0, stock: 8000, rating: "4.1", reviewCount: 456
      },
      {
        nameUz: "Nam salfetkakar", nameRu: "Влажные салфетки",
        slug: "vlajnye-salfetki", price: "8900.00", originalPrice: "10500.00",
        descriptionUz: "Antibakterial nam salfetkakar", descriptionRu: "Антибактериальные влажные салфетки",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov")?.id!,
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"],
        isHit: false, isPromo: true, discountPercent: 15, stock: 3200, rating: "4.6", reviewCount: 189
      },
      {
        nameUz: "Televizorlar", nameRu: "Телевизоры", 
        slug: "televizory", price: "2850000.00", originalPrice: "3200000.00",
        descriptionUz: "Zamonaviy Smart TV televizorlar", descriptionRu: "Современные Smart TV телевизоры",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "elektronika")?.id!,
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400"],
        isHit: true, isPromo: true, discountPercent: 11, stock: 25, rating: "4.7", reviewCount: 67
      },
      {
        nameUz: "Konditsionerlar", nameRu: "Кондиционеры",
        slug: "konditsionery", price: "4200000.00",
        descriptionUz: "Energiya tejamkor konditsionerlar", descriptionRu: "Энергосберегающие кондиционеры",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "elektronika")?.id!,
        images: ["https://images.unsplash.com/photo-1585254701275-0b2c5b4e5c6f?w=400"],
        isHit: true, isPromo: false, discountPercent: 0, stock: 15, rating: "4.8", reviewCount: 43
      }
    ];

    products.forEach(prod => {
      const id = randomUUID();
      this.products.set(id, {
        id,
        ...prod,
        originalPrice: prod.originalPrice || null,
        descriptionUz: prod.descriptionUz || null,
        descriptionRu: prod.descriptionRu || null,
        isActive: true,
        createdAt: new Date()
      });
    });

    // Seed promo timer
    const promoTimer = {
      id: randomUUID(),
      name: "Flash Sale",
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000),
      isActive: true
    };
    this.promoTimers.set(promoTimer.id, promoTimer);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const id = user.id || randomUUID();
    const existingUser = this.users.get(id);
    const newUser: User = { 
      ...user, 
      id,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      phone: user.phone || null,
      isAdmin: user.isAdmin || false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      phone: insertUser.phone || null,
      isAdmin: insertUser.isAdmin || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = { 
      ...category, 
      id,
      icon: category.icon || null,
      parentId: category.parentId || null,
      isActive: category.isActive || null
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Products
  async getProducts(filters?: { categoryId?: string; isHit?: boolean; isPromo?: boolean; search?: string }): Promise<Product[]> {
    let products = Array.from(this.products.values()).filter(p => p.isActive);

    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.isHit !== undefined) {
      products = products.filter(p => p.isHit === filters.isHit);
    }

    if (filters?.isPromo !== undefined) {
      products = products.filter(p => p.isPromo === filters.isPromo);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.nameUz.toLowerCase().includes(searchTerm) ||
        p.nameRu.toLowerCase().includes(searchTerm)
      );
    }

    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct: Product = { 
      ...product, 
      id,
      isPromo: product.isPromo || null,
      isActive: product.isActive || null,
      isHit: product.isHit || null,
      descriptionUz: product.descriptionUz || null,
      descriptionRu: product.descriptionRu || null,
      images: product.images || null,
      originalPrice: product.originalPrice || null,
      discountPercent: product.discountPercent || null,
      stock: product.stock || null,
      rating: product.rating || null,
      reviewCount: product.reviewCount || null,
      createdAt: new Date()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Cart
  async getCartItems(sessionId?: string, userId?: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => {
      if (userId && item.userId === userId) return true;
      if (sessionId && item.sessionId === sessionId) return true;
      return false;
    });

    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const cartItem: CartItem = { 
      ...item, 
      id,
      sessionId: item.sessionId || null,
      userId: item.userId || null,
      quantity: item.quantity || 1,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId?: string, userId?: string): Promise<void> {
    const itemsToRemove = Array.from(this.cartItems.entries()).filter(([, item]) => {
      if (userId && item.userId === userId) return true;
      if (sessionId && item.sessionId === sessionId) return true;
      return false;
    });

    itemsToRemove.forEach(([id]) => this.cartItems.delete(id));
  }

  // Wishlist
  async getWishlistItems(sessionId?: string, userId?: string): Promise<(WishlistItem & { product: Product })[]> {
    const items = Array.from(this.wishlistItems.values()).filter(item => {
      if (userId && item.userId === userId) return true;
      if (sessionId && item.sessionId === sessionId) return true;
      return false;
    });

    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const id = randomUUID();
    const wishlistItem: WishlistItem = { 
      ...item, 
      id,
      sessionId: item.sessionId || null,
      userId: item.userId || null,
      createdAt: new Date()
    };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  // Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.productId === productId && r.isApproved);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = randomUUID();
    const newReview: Review = { 
      ...review, 
      id,
      userId: review.userId || null,
      comment: review.comment || null,
      isApproved: false,
      createdAt: new Date()
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Blog
  async getBlogPosts(limit?: number): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values())
      .filter(p => p.isPublished)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
    if (limit) {
      posts = posts.slice(0, limit);
    }
    
    return posts;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(p => p.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const newPost: BlogPost = { 
      ...post, 
      id,
      excerpt: post.excerpt || null,
      imageUrl: post.imageUrl || null,
      isAiGenerated: post.isAiGenerated || null,
      isPublished: post.isPublished || null,
      publishedAt: post.isPublished ? new Date() : null,
      createdAt: new Date()
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  // Chat
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = { 
      ...message, 
      id,
      userId: message.userId || null,
      response: message.response || null,
      createdAt: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  // Promo timers
  async getActivePromoTimer(): Promise<PromoTimer | undefined> {
    return Array.from(this.promoTimers.values()).find(t => t.isActive && t.endDate > new Date());
  }

  async createPromoTimer(timer: InsertPromoTimer): Promise<PromoTimer> {
    const id = randomUUID();
    const newTimer: PromoTimer = { 
      ...timer, 
      id,
      isActive: timer.isActive || null
    };
    this.promoTimers.set(id, newTimer);
    return newTimer;
  }

  // Orders and Payments
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `OPT${Date.now()}`;
    const order: Order = {
      ...orderData,
      id,
      orderNumber,
      status: orderData.status || "pending",
      paymentStatus: orderData.paymentStatus || "pending",
      userId: orderData.userId || null,
      sessionId: orderData.sessionId || null,
      notes: orderData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId?: string, sessionId?: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => 
      (userId && order.userId === userId) || 
      (sessionId && order.sessionId === sessionId)
    );
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      this.orders.set(orderId, order);
    }
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...paymentData,
      id,
      status: paymentData.status || "pending",
      transactionId: paymentData.transactionId || null,
      qrCardNumber: paymentData.qrCardNumber || null,
      bankDetails: paymentData.bankDetails || null,
      metadata: paymentData.metadata || null,
      createdAt: new Date(),
      processedAt: null
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePaymentStatus(orderId: string, status: string, metadata?: any): Promise<void> {
    const payment = Array.from(this.payments.values()).find(p => p.orderId === orderId);
    if (payment) {
      payment.status = status;
      payment.processedAt = status === "completed" ? new Date() : null;
      if (metadata) {
        payment.metadata = metadata;
        if (metadata.qrCardNumber) payment.qrCardNumber = metadata.qrCardNumber;
        if (metadata.transactionId) payment.transactionId = metadata.transactionId;
      }
      this.payments.set(payment.id, payment);
    }
  }

  // Analytics
  async createAnalyticsEvent(eventData: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const id = randomUUID();
    const event: AnalyticsEvent = {
      ...eventData,
      id,
      userId: eventData.userId || null,
      sessionId: eventData.sessionId || null,
      eventData: eventData.eventData || null,
      userAgent: eventData.userAgent || null,
      ipAddress: eventData.ipAddress || null,
      referrer: eventData.referrer || null,
      createdAt: new Date()
    };
    this.analyticsEvents.set(id, event);
    return event;
  }

  async updateCustomerInsights(userId?: string, sessionId?: string): Promise<void> {
    // Implementation for updating customer insights based on their activity
    const key = userId || sessionId || 'anonymous';
    const existingInsight = this.customerInsights.get(key);
    
    // This is a simplified implementation - in production you'd calculate based on actual data
    if (existingInsight) {
      existingInsight.updatedAt = new Date();
    }
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    return category;
  }

  // Products
  async getProducts(filters?: { categoryId?: string; isHit?: boolean; isPromo?: boolean; search?: string }): Promise<Product[]> {
    let whereConditions = [eq(products.isActive, true)];
    
    if (filters?.categoryId) {
      whereConditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.isHit !== undefined) {
      whereConditions.push(eq(products.isHit, filters.isHit));
    }
    
    if (filters?.isPromo !== undefined) {
      whereConditions.push(eq(products.isPromo, filters.isPromo));
    }
    
    if (filters?.search) {
      whereConditions.push(
        or(
          like(products.nameUz, `%${filters.search}%`),
          like(products.nameRu, `%${filters.search}%`)
        )!
      );
    }
    
    return await db
      .select()
      .from(products)
      .where(and(...whereConditions))
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  // Cart
  async getCartItems(sessionId?: string, userId?: string): Promise<(CartItem & { product: Product })[]> {
    const whereClause = userId 
      ? eq(cartItems.userId, userId)
      : eq(cartItems.sessionId, sessionId!);
    
    const result = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(whereClause);
    
    return result.map(row => ({
      ...row.cart_items,
      product: row.products!
    }));
  }

  async addToCart(itemData: InsertCartItem): Promise<CartItem> {
    const [item] = await db
      .insert(cartItems)
      .values(itemData)
      .returning();
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(sessionId?: string, userId?: string): Promise<void> {
    const whereClause = userId 
      ? eq(cartItems.userId, userId)
      : eq(cartItems.sessionId, sessionId!);
    
    await db.delete(cartItems).where(whereClause);
  }

  // Wishlist
  async getWishlistItems(sessionId?: string, userId?: string): Promise<(WishlistItem & { product: Product })[]> {
    const whereClause = userId 
      ? eq(wishlistItems.userId, userId)
      : eq(wishlistItems.sessionId, sessionId!);
    
    const result = await db
      .select()
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .where(whereClause);
    
    return result.map(row => ({
      ...row.wishlist_items,
      product: row.products!
    }));
  }

  async addToWishlist(itemData: InsertWishlistItem): Promise<WishlistItem> {
    const [item] = await db
      .insert(wishlistItems)
      .values(itemData)
      .returning();
    return item;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    const result = await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();
    return review;
  }

  // Blog
  async getBlogPosts(limit = 10): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(postData)
      .returning();
    return post;
  }

  // Chat
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return message;
  }

  // Promo timers
  async getActivePromoTimer(): Promise<PromoTimer | undefined> {
    const [timer] = await db
      .select()
      .from(promoTimers)
      .where(and(eq(promoTimers.isActive, true), sql`${promoTimers.endDate} > NOW()`))
      .limit(1);
    return timer || undefined;
  }

  async createPromoTimer(timerData: InsertPromoTimer): Promise<PromoTimer> {
    const [timer] = await db
      .insert(promoTimers)
      .values(timerData)
      .returning();
    return timer;
  }

  // Orders and Payments - Database Implementation
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const orderNumber = `OPT${Date.now()}`;
    const [order] = await db
      .insert(orders)
      .values({
        ...orderData,
        orderNumber
      })
      .returning();
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId?: string, sessionId?: string): Promise<Order[]> {
    let whereConditions = [];
    if (userId) {
      whereConditions.push(eq(orders.userId, userId));
    }
    if (sessionId) {
      whereConditions.push(eq(orders.sessionId, sessionId));
    }
    
    if (whereConditions.length === 0) return [];
    
    return await db
      .select()
      .from(orders)
      .where(or(...whereConditions)!)
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(paymentData)
      .returning();
    return payment;
  }

  async updatePaymentStatus(orderId: string, status: string, metadata?: any): Promise<void> {
    const updateData: any = { status };
    
    if (status === "completed") {
      updateData.processedAt = new Date();
    }
    
    if (metadata) {
      if (metadata.qrCardNumber) updateData.qrCardNumber = metadata.qrCardNumber;
      if (metadata.transactionId) updateData.transactionId = metadata.transactionId;
      updateData.metadata = metadata;
    }

    await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.orderId, orderId));
  }

  // Analytics - Database Implementation
  async createAnalyticsEvent(eventData: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [event] = await db
      .insert(analyticsEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async updateCustomerInsights(userId?: string, sessionId?: string): Promise<void> {
    if (userId) {
      // Update customer insights based on their activity
      const userOrders = await this.getUserOrders(userId);
      const totalSpent = userOrders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      await db
        .insert(customerInsights)
        .values({
          userId,
          totalOrders: userOrders.length,
          totalSpent: totalSpent.toString(),
          averageOrderValue: userOrders.length > 0 ? (totalSpent / userOrders.length).toString() : "0",
          lastOrderDate: userOrders[0]?.createdAt || null
        })
        .onConflictDoUpdate({
          target: customerInsights.userId,
          set: {
            totalOrders: userOrders.length,
            totalSpent: totalSpent.toString(),
            averageOrderValue: userOrders.length > 0 ? (totalSpent / userOrders.length).toString() : "0",
            lastOrderDate: userOrders[0]?.createdAt || null,
            updatedAt: new Date()
          }
        });
    }
  }
}

export const storage = new DatabaseStorage();
