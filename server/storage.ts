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
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserCount(): Promise<number>;
  getAllUsers(): Promise<User[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  getAllCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Products
  getProducts(filters?: { categoryId?: string; isHit?: boolean; isPromo?: boolean; search?: string }): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

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
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  // Chat
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  getAllChatMessages(): Promise<ChatMessage[]>;
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

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values({
      id: randomUUID(),
      ...user,
    }).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
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

  async getUserCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result[0]?.count || 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Categories  
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values({
      id: randomUUID(),
      ...category,
    }).returning();
    return newCategory;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProducts(filters?: { categoryId?: string; isHit?: boolean; isPromo?: boolean; search?: string }): Promise<Product[]> {
    const conditions = [eq(products.isActive, true)];
    
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.isHit !== undefined) {
      conditions.push(eq(products.isHit, filters.isHit));
    }
    
    if (filters?.isPromo !== undefined) {
      conditions.push(eq(products.isPromo, filters.isPromo));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(products.nameUz, `%${filters.search}%`),
          like(products.nameRu, `%${filters.search}%`),
          like(products.descriptionUz, `%${filters.search}%`),
          like(products.descriptionRu, `%${filters.search}%`)
        )!
      );
    }
    
    return await db.select().from(products).where(and(...conditions));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values({
      id: randomUUID(),
      ...product,
    }).returning();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Cart
  async getCartItems(sessionId?: string, userId?: string): Promise<(CartItem & { product: Product })[]> {
    const conditions = [];
    if (sessionId) conditions.push(eq(cartItems.sessionId, sessionId));
    if (userId) conditions.push(eq(cartItems.userId, userId));
    
    if (conditions.length === 0) return [];
    
    const items = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(or(...conditions));
    
    return items.map(item => ({
      ...item.cart_items,
      product: item.products!
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists, if so update quantity
    const existingItems = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.productId, item.productId),
          item.sessionId ? eq(cartItems.sessionId, item.sessionId) : sql`TRUE`,
          item.userId ? eq(cartItems.userId, item.userId) : sql`TRUE`
        )
      );
    
    if (existingItems.length > 0) {
      const existing = existingItems[0];
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }
    
    const [newItem] = await db.insert(cartItems).values({
      id: randomUUID(),
      ...item,
    }).returning();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeFromCart(id);
      return undefined;
    }
    
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(sessionId?: string, userId?: string): Promise<void> {
    const conditions = [];
    if (sessionId) conditions.push(eq(cartItems.sessionId, sessionId));
    if (userId) conditions.push(eq(cartItems.userId, userId));
    
    if (conditions.length > 0) {
      await db.delete(cartItems).where(or(...conditions));
    }
  }

  // Wishlist  
  async getWishlistItems(sessionId?: string, userId?: string): Promise<(WishlistItem & { product: Product })[]> {
    const conditions = [];
    if (sessionId) conditions.push(eq(wishlistItems.sessionId, sessionId));
    if (userId) conditions.push(eq(wishlistItems.userId, userId));
    
    if (conditions.length === 0) return [];
    
    const items = await db
      .select()
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .where(or(...conditions));
    
    return items.map(item => ({
      ...item.wishlist_items,
      product: item.products!
    }));
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const [newItem] = await db.insert(wishlistItems).values({
      id: randomUUID(),
      ...item,
    }).returning();
    return newItem;
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

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values({
      id: randomUUID(),
      ...review,
    }).returning();
    return newReview;
  }

  // Blog
  async getBlogPosts(limit: number = 10): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values({
      id: randomUUID(),
      ...post,
    }).returning();
    return newPost;
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Chat
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  async getAllChatMessages(): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.createdAt));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values({
      id: randomUUID(),
      ...message,
    }).returning();
    return newMessage;
  }

  // Promo timers
  async getActivePromoTimer(): Promise<PromoTimer | undefined> {
    const [timer] = await db
      .select()
      .from(promoTimers)
      .where(and(eq(promoTimers.isActive, true), sql`${promoTimers.endDate} > NOW()`))
      .orderBy(desc(promoTimers.endDate))
      .limit(1);
    return timer;
  }

  async createPromoTimer(timer: InsertPromoTimer): Promise<PromoTimer> {
    const [newTimer] = await db.insert(promoTimers).values({
      id: randomUUID(),
      ...timer,
    }).returning();
    return newTimer;
  }

  // Orders and Payments
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values({
      id: randomUUID(),
      orderNumber: `OB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...order,
    }).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId?: string, sessionId?: string): Promise<Order[]> {
    const conditions = [];
    if (userId) conditions.push(eq(orders.userId, userId));
    if (sessionId) conditions.push(eq(orders.sessionId, sessionId));
    
    if (conditions.length === 0) return [];
    
    return await db
      .select()
      .from(orders)
      .where(or(...conditions))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values({
      id: randomUUID(),
      ...payment,
    }).returning();
    return newPayment;
  }

  async updatePaymentStatus(orderId: string, status: string, metadata?: any): Promise<void> {
    await db
      .update(payments)
      .set({ 
        status, 
        metadata,
        processedAt: new Date() 
      })
      .where(eq(payments.orderId, orderId));
  }

  // Analytics
  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [newEvent] = await db.insert(analyticsEvents).values({
      id: randomUUID(),
      ...event,
    }).returning();
    return newEvent;
  }

  async updateCustomerInsights(userId?: string, sessionId?: string): Promise<void> {
    if (!userId && !sessionId) return;
    
    // Calculate insights based on user orders
    const userOrders = await this.getUserOrders(userId, sessionId);
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    const insightData = {
      userId,
      sessionId,
      totalOrders,
      totalSpent: totalSpent.toString(),
      averageOrderValue: averageOrderValue.toString(),
      favoriteCategories: [], // TODO: Calculate from order items
      lastOrderDate: userOrders[0]?.createdAt,
      customerSegment: this.determineCustomerSegment(totalOrders, totalSpent),
      updatedAt: new Date()
    };

    // Upsert customer insights
    await db.insert(customerInsights).values({
      id: randomUUID(),
      ...insightData,
    }).onConflictDoUpdate({
      target: userId ? customerInsights.userId : customerInsights.sessionId,
      set: insightData
    });
  }

  private determineCustomerSegment(totalOrders: number, totalSpent: number): string {
    if (totalOrders === 0) return 'new';
    if (totalOrders >= 10 && totalSpent >= 10000) return 'vip';
    if (totalOrders >= 5 || totalSpent >= 5000) return 'regular';
    return 'new';
  }
}

export const storage: IStorage = new DatabaseStorage();