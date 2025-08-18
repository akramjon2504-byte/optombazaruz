import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  password: text("password"), // For admin login
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
  authProvider: text("auth_provider").default("email"), // email, google, replit
  preferredLanguage: text("preferred_language").default("uz"), // uz, ru
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  parentId: varchar("parent_id"),
  isActive: boolean("is_active").default(true)
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameUz: text("name_uz").notNull(),
  nameRu: text("name_ru").notNull(),
  descriptionUz: text("description_uz").notNull(),
  descriptionRu: text("description_ru").notNull(),
  slug: text("slug").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  categoryId: varchar("category_id").notNull(),
  imageUrl: text("image_url"),
  imageUrl2: text("image_url_2"),
  imageUrl3: text("image_url_3"),
  isHit: boolean("is_hit").default(false),
  isPromo: boolean("is_promo").default(false),
  discountPercent: integer("discount_percent").default(0),
  stock: integer("stock").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});

export const wishlistItems = pgTable("wishlist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  productId: varchar("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  userId: varchar("user_id"),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleUz: text("title_uz").notNull(),
  titleRu: text("title_ru").notNull(),
  contentUz: text("content_uz").notNull(),
  contentRu: text("content_ru").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  isAiGenerated: boolean("is_ai_generated").default(false),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  userId: varchar("user_id"),
  userName: text("user_name"),
  userPhone: text("user_phone"),
  message: text("message").notNull(),
  response: text("response"),
  isFromUser: boolean("is_from_user").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const promoTimers = pgTable("promo_timers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true)
});

// Orders and payments
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  paymentMethod: text("payment_method").notNull(), // qr_card, cash_delivery, bank_transfer
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json("shipping_address").notNull(),
  customerInfo: json("customer_info").notNull(),
  items: json("items").notNull(), // Array of order items
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  paymentMethod: text("payment_method").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  transactionId: text("transaction_id"),
  qrCardNumber: text("qr_card_number"), // For QR card payments
  bankDetails: json("bank_details"), // For bank transfer details
  metadata: json("metadata"), // Additional payment data
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at")
});

// Analytics tables
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  eventType: text("event_type").notNull(), // page_view, product_view, add_to_cart, purchase, etc.
  eventData: json("event_data"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow()
});

export const customerInsights = pgTable("customer_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  sessionId: text("session_id"),
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }).default("0"),
  favoriteCategories: text("favorite_categories").array(),
  lastOrderDate: timestamp("last_order_date"),
  customerSegment: text("customer_segment"), // new, regular, vip, inactive
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas  
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  publishedAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});

export const insertPromoTimerSchema = createInsertSchema(promoTimers).omit({
  id: true
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  processedAt: true
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type PromoTimer = typeof promoTimers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type CustomerInsight = typeof customerInsights.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertPromoTimer = z.infer<typeof insertPromoTimerSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true
});

export const insertCustomerInsightSchema = createInsertSchema(customerInsights).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type InsertCustomerInsight = z.infer<typeof insertCustomerInsightSchema>;
