import {
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Review, type InsertReview,
  type BlogPost, type InsertBlogPost, type ChatMessage, type InsertChatMessage,
  type PromoTimer, type InsertPromoTimer
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      { nameUz: "Polietilen paketlar", nameRu: "Полиэтиленовые пакеты", slug: "polietilen-paketlar", icon: "fas fa-shopping-bag" },
      { nameUz: "Bir martalik idishlar", nameRu: "Одноразовая посуда", slug: "bir-martalik-idishlar", icon: "fas fa-utensils" },
      { nameUz: "Uy buyumlari", nameRu: "Товары для дома", slug: "uy-buyumlari", icon: "fas fa-home" },
      { nameUz: "Elektronika", nameRu: "Электроника", slug: "elektronika", icon: "fas fa-laptop" },
      { nameUz: "Kiyim-kechak", nameRu: "Одежда", slug: "kiyim-kechak", icon: "fas fa-tshirt" },
      { nameUz: "Kimyoviy vositalar", nameRu: "Бытовая химия", slug: "kimyoviy-vositalar", icon: "fas fa-spray-can" }
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

    // Seed products
    const products = [
      {
        nameUz: "Polietilen paketlar to'plami", nameRu: "Полиэтиленовые пакеты набор",
        slug: "polietilen-paketlar-toplami", price: "850.00", originalPrice: "900.00",
        descriptionUz: "Yuqori sifatli polietilen paketlar", descriptionRu: "Высококачественные полиэтиленовые пакеты",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "polietilen-paketlar")?.id!,
        images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400"],
        isHit: false, isPromo: true, discountPercent: 6, stock: 100, rating: "4.2", reviewCount: 15
      },
      {
        nameUz: "Bir martalik idishlar to'plami", nameRu: "Одноразовая посуда набор",
        slug: "bir-martalik-idishlar-toplami", price: "7500.00", originalPrice: "9200.00",
        descriptionUz: "Ekologik toza bir martalik idishlar", descriptionRu: "Экологически чистая одноразовая посуда",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "bir-martalik-idishlar")?.id!,
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"],
        isHit: false, isPromo: true, discountPercent: 18, stock: 50, rating: "4.8", reviewCount: 23
      },
      {
        nameUz: "Hojatxona qog'ozi Elma Lux Premium", nameRu: "Туалетная бумага Elma Lux Premium",
        slug: "hojatxona-qogozi-elma-lux", price: "28500.00",
        descriptionUz: "3 qatlamli yumshoq hojatxona qog'ozi", descriptionRu: "3-х слойная мягкая туалетная бумага",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "uy-buyumlari")?.id!,
        images: ["https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400"],
        isHit: true, isPromo: false, discountPercent: 0, stock: 200, rating: "4.1", reviewCount: 56
      },
      {
        nameUz: "Plastik stakanlar 200ml DKplast", nameRu: "Пластиковые стаканы 200мл DKplast",
        slug: "plastik-stakanlar-200ml", price: "80.00",
        descriptionUz: "Shaffof plastik stakanlar", descriptionRu: "Прозрачные пластиковые стаканы",
        categoryId: Array.from(this.categories.values()).find(c => c.slug === "bir-martalik-idishlar")?.id!,
        images: ["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400"],
        isHit: true, isPromo: false, discountPercent: 0, stock: 1000, rating: "4.3", reviewCount: 70
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

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      phone: insertUser.phone || null,
      isAdmin: false,
      createdAt: new Date()
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
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
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
}

export const storage = new MemStorage();
