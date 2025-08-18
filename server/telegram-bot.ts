import TelegramBot from 'node-telegram-bot-api';
import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

const TELEGRAM_TOKEN = '7640281872:AAE3adEZv3efPr-V4Xt77tFgs5k7vVWxqZQ';
const TELEGRAM_CHANNEL_ID = '@optombazaruzb';
const ADMIN_USER_ID = 1021369075;

// Initialize Telegram Bot (disable polling to prevent conflicts)
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

interface MarketingPost {
  title: string;
  content: string;
  imagePrompt?: string;
}

export class TelegramMarketingBot {
  private bot: TelegramBot;
  private ai: GoogleGenAI;

  constructor() {
    this.bot = bot;
    this.ai = ai;
    this.setupCommands();
  }

  private setupCommands() {
    // Commands are disabled to prevent polling conflicts
    // Bot is only used for scheduled posts, not interactive commands
    console.log('✅ Telegram bot commands configured (polling disabled)');
  }

  async generateProductShowcase(): Promise<MarketingPost> {
    try {
      // Import storage and get real products
      const { storage } = await import('./storage');
      const products = await storage.getProducts({});
      
      if (products.length === 0) {
        throw new Error('Mahsulotlar topilmadi');
      }
      
      // Select 3-5 random products for showcase
      const shuffled = products.sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0, Math.min(5, products.length));
      
      // Get product details for prompt
      const productInfo = selectedProducts.map(p => ({
        name: p.nameUz,
        price: p.price,
        category: p.categoryId,
        isHit: p.isHit,
        isPromo: p.isPromo,
        discount: p.discountPercent || 0
      }));

      const prompt = `
Quyidagi real mahsulotlar uchun OptomBazar.uz Telegram kanali uchun marketing post yarating:

MAHSULOTLAR:
${productInfo.map(p => `- ${p.name} (${p.price} so'm${p.isPromo ? ', ' + p.discount + '% CHEGIRMA' : ''})`).join('\n')}

MUHIM TALABLAR:
- Matnda formatlovchi belgilar ishlatmang (* ** __ - va boshqalar)
- Faqat oddiy matn, emoji va hashtag ishlating
- O'zbek tilida professional yozing
- Marketing va copywriting uchun optimallashtirilgan bo'lsin
- Real mahsulot nomlarini aynan ishlating
- Narxlarni ko'rsating
- Qiziqarli va jalb qiluvchi bo'lsin
- Call-to-action qo'shing

Format:
🛒 [Diqqat tortuvchi sarlavha]

[Mahsulotlar haqida qisqacha tavsif va narxlar]

📞 Buyurtma: +998 99 644 84 44
🌐 Sayt: https://optombazar.uz
📱 Telegram: @optombazaruzb

#optombazar #uzbekistan #wholesale #optomnarx
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      const content = response.text || "Mahsulotlar namoyishi";

      return {
        title: "Kunlik mahsulotlar namoyishi",
        content,
        imagePrompt: 'Uzbekistan wholesale market products showcase'
      };
    } catch (error) {
      console.error('Product showcase generation error:', error);
      throw error;
    }
  }

  async generatePromotionPost(): Promise<MarketingPost> {
    try {
      const { storage } = await import('./storage');
      const products = await storage.getProducts({ isPromo: true });
      
      // If no promo products, get hit products
      const selectedProducts = products.length > 0 
        ? products.slice(0, 4) 
        : (await storage.getProducts({ isHit: true })).slice(0, 4);
      
      if (selectedProducts.length === 0) {
        throw new Error('Aksiya mahsulotlari topilmadi');
      }

      const productDetails = selectedProducts.map(p => ({
        name: p.nameUz,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discountPercent || 0
      }));

      const prompt = `
OptomBazar.uz uchun haftalik AKSIYA posti yarating:

AKSIYA MAHSULOTLARI:
${productDetails.map(p => `- ${p.name} - ${p.price} so'm${p.originalPrice ? ' (eski narx: ' + p.originalPrice + ' so\'m)' : ''}${p.discount > 0 ? ' - ' + p.discount + '% chegirma!' : ''}`).join('\n')}

TALABLAR:
- O'zbek tilida professional aksiya e'loni
- Formatlovchi belgilar ishlatmang
- Real mahsulot va narxlarni ishlating
- Chegirma foizlarini ta'kidlang
- Shoshilinch his yarating
- Call-to-action qo'shing
- Emoji ishlating

Format:
🎉 HAFTALIK AKSIYA! 🎉

[Aksiya tavsifi va mahsulotlar ro'yxati]

⏰ Aksiya muddati cheklangan!
📞 Buyurtma: +998 99 644 84 44
🌐 optombazar.uz

#aksiya #chegirma #optombazar #wholesale
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      return {
        title: "Haftalik aksiya",
        content: response.text || "Haftalik aksiya",
        imagePrompt: 'Promotion sale banner for Uzbek wholesale market'
      };
    } catch (error) {
      console.error('Promotion post generation error:', error);
      throw error;
    }
  }

  async generateBlogPost(): Promise<MarketingPost> {
    try {
      const topics = [
        "Optom savdo strategiyalari",
        "Kichik biznes uchun optom xaridlar",
        "Optom bozorida muvaffaqiyat sirlari",
        "Sifatli mahsulot tanlash yo'llari",
        "Optom narxlar va tejash usullari",
        "Yetkazib berish xizmatlari haqida",
        "Yangi mahsulotlar va trendlar",
        "Mijozlar bilan ishlash san'ati"
      ];

      const randomTopic = topics[Math.floor(Math.random() * topics.length)];

      const prompt = `
"${randomTopic}" mavzusida o'zbek tilida blog maqola yozing. Maqola quyidagi talablarga javob bersin:

1. O'zbek tilida professional yozilsin
2. 800-1200 so'z hajmida bo'lsin
3. Praktik maslahatlar bersin
4. OptomBazar.uz platformasini taklif etsin
5. SEO uchun optimallashtirılgan bo'lsin
6. Qiziqarli va foydali bo'lsin

Format:
Sarlavha: [Qiziqarli sarlavha]

Kirish: [Mavzu haqida qisqacha]

Asosiy qism: [Batafsil ma'lumot va maslahatlar]

Xulosa: [Asosiy fikrlar va takliflar]

Hashteglar: #optombazar #biznes #uzbekistan
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const title = text.match(/Sarlavha:\s*(.+)/)?.[1] || randomTopic;

      return {
        title: title.trim(),
        content: text,
        imagePrompt: `Professional business image related to ${randomTopic}`
      };
    } catch (error) {
      console.error('Blog post generation error:', error);
      throw error;
    }
  }

  async createDailyShowcase(): Promise<void> {
    try {
      const showcase = await this.generateProductShowcase();
      
      // Send to Telegram channel
      await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, showcase.content, {
        parse_mode: 'HTML'
      });

      console.log('✅ Kunlik mahsulotlar namoyishi yuborildi');
    } catch (error) {
      console.error('Failed to create daily showcase:', error);
    }
  }

  async createPromotionPost(): Promise<void> {
    try {
      const promotion = await this.generatePromotionPost();
      
      // Send to Telegram channel
      await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, promotion.content, {
        parse_mode: 'HTML'
      });

      console.log('✅ Haftalik aksiya posti yuborildi');
    } catch (error) {
      console.error('Failed to create promotion post:', error);
    }
  }

  async createBlogPost(): Promise<void> {
    try {
      const blogPost = await this.generateBlogPost();
      
      // Here you would save to database and optionally post to channel
      console.log('Blog post created:', blogPost.title);
      
      // Optionally send summary to channel
      const summary = `📝 Yangi blog maqola: ${blogPost.title}

Batafsil o'qish: https://optombazar.uz/blog

#blog #optombazar #uzbekistan`;

      await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, summary);
    } catch (error) {
      console.error('Failed to create blog post:', error);
    }
  }

  // Schedule daily posts and promotions
  startScheduledPosts(): void {
    // Daily product showcase at 9:00 AM
    const scheduleDaily = (hour: number, callback: () => Promise<void>) => {
      const now = new Date();
      const scheduled = new Date(now);
      scheduled.setHours(hour, 0, 0, 0);
      
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }
      
      const timeUntil = scheduled.getTime() - now.getTime();
      
      setTimeout(() => {
        callback();
        setInterval(callback, 24 * 60 * 60 * 1000); // Every 24 hours
      }, timeUntil);
    };

    // Daily product showcase at 9:00 AM
    scheduleDaily(9, async () => {
      try {
        await this.createDailyShowcase();
      } catch (error) {
        console.error('Daily showcase failed:', error);
      }
    });

    // Afternoon showcase at 3:00 PM
    scheduleDaily(15, async () => {
      try {
        await this.createDailyShowcase();
      } catch (error) {
        console.error('Afternoon showcase failed:', error);
      }
    });

    // Weekly promotion every Monday at 10:00 AM
    const scheduleWeekly = () => {
      const now = new Date();
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
      nextMonday.setHours(10, 0, 0, 0);
      
      if (nextMonday <= now) {
        nextMonday.setDate(nextMonday.getDate() + 7);
      }
      
      const timeUntil = nextMonday.getTime() - now.getTime();
      
      setTimeout(() => {
        this.createPromotionPost();
        setInterval(() => {
          this.createPromotionPost();
        }, 7 * 24 * 60 * 60 * 1000); // Every 7 days
      }, timeUntil);
    };

    scheduleWeekly();

    console.log('Telegram scheduled posts started');
    console.log('📅 Kunlik mahsulot namoyishi: har kuni 9:00 va 15:00 da');
    console.log('📅 Haftalik aksiya: har dushanba 10:00 da');
  }

  async sendToChannel(message: string): Promise<void> {
    try {
      await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, message, {
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error('Failed to send message to channel:', error);
    }
  }
}

export const telegramBot = new TelegramMarketingBot();