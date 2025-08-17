import { storage } from "../storage";
import { generateBlogPost, generateMarketingContent } from "./gemini";
import { telegramService } from "./telegram";
import { randomUUID } from "crypto";

class BlogService {
  private topics = [
    { uz: "Optom savdo strategiyalari", ru: "Стратегии оптовой торговли", category: "business" },
    { uz: "Qadoqlash texnologiyalari", ru: "Технологии упаковки", category: "packaging" },
    { uz: "Restoran biznesida tejamkorlik", ru: "Экономия в ресторанном бизнесе", category: "restaurant" },
    { uz: "Ekologik qadoqlash yechimlari", ru: "Экологические решения упаковки", category: "eco" },
    { uz: "Kichik biznes uchun maslahatlar", ru: "Советы для малого бизнеса", category: "smallbiz" },
    { uz: "Mahsulot sifatini nazorat qilish", ru: "Контроль качества продукции", category: "quality" },
    { uz: "Mijozlar bilan ishlash", ru: "Работа с клиентами", category: "customers" },
    { uz: "Logistika va yetkazib berish", ru: "Логистика и доставка", category: "logistics" }
  ];

  async generateBlogPost(topic: string): Promise<any> {
    try {
      // Generate content using Gemini
      const content = await generateBlogPost(topic, "business");
      
      // Create blog post
      return await storage.createBlogPost({
        titleUz: content.titleUz,
        titleRu: content.titleRu,
        contentUz: content.contentUz,
        contentRu: content.contentRu,
        slug: content.slug,
        excerpt: content.excerpt,
        imageUrl: this.getTopicImage("business"),
        isAiGenerated: true,
        isPublished: true
      });
    } catch (error) {
      console.error("Failed to generate blog post:", error);
      throw error;
    }
  }

  async generateDailyBlog(): Promise<boolean> {
    try {
      // Select random topic
      const topic = this.topics[Math.floor(Math.random() * this.topics.length)];
      
      console.log(`Generating blog post for topic: ${topic.uz}`);
      
      // Generate content using Gemini
      const content = await generateBlogPost(topic.uz, topic.category);
      
      // Create blog post
      const blogPost = await storage.createBlogPost({
        titleUz: content.titleUz,
        titleRu: content.titleRu,
        contentUz: content.contentUz,
        contentRu: content.contentRu,
        slug: content.slug,
        excerpt: content.excerpt,
        imageUrl: this.getTopicImage(topic.category),
        isAiGenerated: true,
        isPublished: true
      });

      console.log(`Blog post created: ${blogPost.titleUz}`);

      // Send to Telegram channel
      await telegramService.sendBlogPost(
        blogPost.titleUz,
        blogPost.excerpt || "",
        blogPost.slug
      );

      return true;
    } catch (error) {
      console.error("Failed to generate daily blog:", error);
      return false;
    }
  }

  async generateWeeklyPromo(): Promise<boolean> {
    try {
      // Get promotional products
      const promoProducts = await storage.getProducts({ isPromo: true });
      
      if (promoProducts.length === 0) {
        console.log("No promotional products found");
        return false;
      }

      // Select random products for promotion
      const selectedProducts = promoProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(p => ({
          name: p.nameUz,
          price: `${p.price} сум`,
          discount: (p.discountPercent && p.discountPercent > 0) ? `${p.discountPercent}%` : undefined
        }));

      await telegramService.sendPromotion(selectedProducts);
      console.log("Weekly promotion sent to Telegram");

      return true;
    } catch (error) {
      console.error("Failed to generate weekly promo:", error);
      return false;
    }
  }

  private getTopicImage(category: string): string {
    const images: Record<string, string> = {
      business: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
      packaging: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400", 
      restaurant: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
      eco: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
      smallbiz: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400",
      quality: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
      customers: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      logistics: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400"
    };
    
    return images[category] || images.business;
  }

  startScheduledBlogGeneration() {
    // Generate blog posts every 2 hours (12 posts per day)
    setInterval(async () => {
      try {
        await this.generateDailyBlog();
        console.log('✅ Scheduled blog post generated');
      } catch (error) {
        console.error('Failed to generate scheduled blog post:', error);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours

    console.log('✅ Blog generation scheduled (every 2 hours, 12 posts daily)');
  }
}

export const blogService = new BlogService();
