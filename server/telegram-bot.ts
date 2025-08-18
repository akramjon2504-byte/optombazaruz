import TelegramBot from 'node-telegram-bot-api';
import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

const TELEGRAM_TOKEN = '7640281872:AAE3adEZv3efPr-V4Xt77tFgs5k7vVWxqZQ';
const TELEGRAM_CHANNEL_ID = '@optombazaruzb';
const ADMIN_USER_ID = 1021369075;

// Initialize Telegram Bot (ensure only one instance)
let bot: TelegramBot;
try {
  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
} catch (error) {
  console.log('Bot instance already exists, reusing...');
  bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
}

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
    // Admin commands
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `
🤖 OptomBazar Marketing Bot

Admin buyruqlari:
/post - Marketing post yaratish
/blog - Blog maqola yaratish
/stats - Kanal statistikasi
/help - Yordam
      `;
      this.bot.sendMessage(chatId, welcomeMessage);
    });

    this.bot.onText(/\/post/, async (msg) => {
      if (msg.from?.id !== ADMIN_USER_ID) {
        this.bot.sendMessage(msg.chat.id, "❌ Ruxsat yo'q");
        return;
      }
      await this.createMarketingPost();
    });

    this.bot.onText(/\/blog/, async (msg) => {
      if (msg.from?.id !== ADMIN_USER_ID) {
        this.bot.sendMessage(msg.chat.id, "❌ Ruxsat yo'q");
        return;
      }
      await this.createBlogPost();
    });
  }

  async generateMarketingContent(): Promise<MarketingPost> {
    try {
      const prompt = `
O'zbekiston optom bozori uchun marketing post yarating. Post quyidagi talablarga mos bo'lsin:

MUHIM: Matnda formatlovchi belgilar ishlatmang (* ** __ - va boshqalar)
Faqat oddiy matn, emoji va hashtag ishlatishingiz mumkin.

1. O'zbek tilida bo'lsin
2. Optom savdo haqida bo'lsin
3. Qiziqarli va jalb qiluvchi bo'lsin
4. Emoji ishlatilsin (lekin yulduzcha belgilarsiz)
5. Call-to-action bo'lsin
6. OptomBazar.uz saytini targ'ib qilsin
7. SEO va copywriting uchun optimallashtirilgan bo'lsin

Format:
- Sarlavha (qisqa va diqqatni tortuvchi)
- Kontent (200-300 so'z, oddiy matn)
- Hashtag (#optombazar #uzbekistan #wholesale)
      `;

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });

      const text = response.text || "";

      // Parse the response
      const lines = text.split('\n');
      const title = lines.find((line: string) => line.includes('Sarlavha:') || line.startsWith('**'))?.replace(/[*#]/g, '').replace('Sarlavha:', '').trim() || 'Marketing Post';
      const content = text;

      return {
        title,
        content,
        imagePrompt: 'Professional wholesale market image with Uzbek business theme'
      };
    } catch (error) {
      console.error('Marketing content generation error:', error);
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

  async createMarketingPost(): Promise<void> {
    try {
      const post = await this.generateMarketingContent();
      
      // Send to Telegram channel
      await this.bot.sendMessage(TELEGRAM_CHANNEL_ID, post.content, {
        parse_mode: 'HTML'
      });

      console.log('Marketing post sent to Telegram channel');
    } catch (error) {
      console.error('Failed to create marketing post:', error);
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

  // Schedule daily posts
  startScheduledPosts(): void {
    // Marketing post every 6 hours
    setInterval(async () => {
      try {
        await this.createMarketingPost();
      } catch (error) {
        console.error('Scheduled marketing post failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Blog post daily at 10 AM
    const now = new Date();
    const tomorrow10AM = new Date(now);
    tomorrow10AM.setDate(now.getDate() + 1);
    tomorrow10AM.setHours(10, 0, 0, 0);

    const timeUntil10AM = tomorrow10AM.getTime() - now.getTime();

    setTimeout(() => {
      this.createBlogPost();
      // Then repeat every 24 hours
      setInterval(() => {
        this.createBlogPost();
      }, 24 * 60 * 60 * 1000);
    }, timeUntil10AM);

    console.log('Telegram scheduled posts started');
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