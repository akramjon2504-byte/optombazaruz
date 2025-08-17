import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/gemini";
import { blogService } from "./services/blog";
import { telegramService } from "./services/telegram";
import { insertProductSchema, insertCartItemSchema, insertWishlistItemSchema, insertChatMessageSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);

  return httpServer;
}
