import TelegramBot from 'node-telegram-bot-api';
import { generateMarketingContent } from './gemini';
import { storage } from '../storage';

class TelegramService {
  private bot?: TelegramBot;
  private channelId = '@optombazaruzb';
  private adminUserId = 1021369075; // Admin user ID
  private isInitialized = false;

  constructor() {
    this.initializeBot();
  }

  private initializeBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN || '7640281872:AAE3adEZv3efPr-V4Xt77tFgs5k7vVWxqZQ';
    
    if (!token || token === 'your_bot_token_here') {
      console.log('Telegram bot token not configured');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: true });
      this.setupCommands();
      this.isInitialized = true;
      console.log('✅ Telegram bot initialized: @optombazaruzb');
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
    }
  }

  private setupCommands() {
    if (!this.bot) return;

    // Admin commands
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `
🛒 OptomBazar.uz - O'zbekistondagi #1 optom platformasi!

🤖 Bu bot sizga quyidagi xizmatlarni taklif etadi:
• Yangi mahsulotlar haqida ma'lumot
• Maxsus chegirmalar va aksiyalar
• Blog yangiliklari
• Savol-javoblar

📱 Saytimiz: https://optombazar.uz
📞 Aloqa: +998 (90) 123-45-67
`;
      this.bot?.sendMessage(chatId, welcomeMessage);
    });

    // Admin panel for content generation
    this.bot.onText(/\/admin/, (msg) => {
      const chatId = msg.chat.id;
      if (msg.from?.id !== this.adminUserId) {
        this.bot?.sendMessage(chatId, '❌ Sizda admin huquqi yo\'q');
        return;
      }

      const adminMenu = `
🔧 Admin Panel - OptomBazar.uz

📝 /generate_blog - Yangi blog post yaratish
📢 /generate_post - Marketing post yaratish
📊 /stats - Statistika ko'rish
🛒 /products - Mahsulotlar ro'yxati
`;
      this.bot?.sendMessage(chatId, adminMenu);
    });

    // Generate blog post command
    this.bot.onText(/\/generate_blog/, async (msg) => {
      const chatId = msg.chat.id;
      if (msg.from?.id !== this.adminUserId) {
        this.bot?.sendMessage(chatId, '❌ Sizda admin huquqi yo\'q');
        return;
      }

      try {
        this.bot?.sendMessage(chatId, '📝 Blog post yaratilmoqda...');
        const { blogService } = await import('./blog');
        const success = await blogService.generateDailyBlog();
        
        if (success) {
          this.bot?.sendMessage(chatId, '✅ Blog post muvaffaqiyatli yaratildi va chop etildi!');
        } else {
          this.bot?.sendMessage(chatId, '❌ Blog post yaratishda xatolik yuz berdi');
        }
      } catch (error) {
        console.error('Manual blog generation error:', error);
        this.bot?.sendMessage(chatId, '❌ Xatolik: Blog post yaratib bo\'lmadi');
      }
    });

    // Generate marketing post command
    this.bot.onText(/\/generate_post/, async (msg) => {
      const chatId = msg.chat.id;
      if (msg.from?.id !== this.adminUserId) {
        this.bot?.sendMessage(chatId, '❌ Sizda admin huquqi yo\'q');
        return;
      }

      try {
        this.bot?.sendMessage(chatId, '📢 Marketing post yaratilmoqda...');
        await this.sendScheduledPost();
        this.bot?.sendMessage(chatId, '✅ Marketing post muvaffaqiyatli yuborildi!');
      } catch (error) {
        console.error('Manual marketing post error:', error);
        this.bot?.sendMessage(chatId, '❌ Xatolik: Marketing post yaratib bo\'lmadi');
      }
    });

    console.log('✅ Telegram bot commands configured');
  }

  async sendScheduledPost() {
    if (!this.isInitialized || !this.bot) {
      console.log('Telegram bot not initialized, skipping scheduled post');
      return;
    }

    try {
      // Get random products for promotion
      const allProducts = await storage.getProducts({});
      const products = allProducts.slice(0, 5);
      const productNames = products.map(p => p.nameUz).slice(0, 3);
      
      // Generate marketing content using Gemini 1.5 Flash
      const content = await generateMarketingContent('telegram', productNames);
      
      // Send to channel
      await this.bot.sendMessage(this.channelId, content, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });
      
      console.log('✅ Scheduled Telegram post sent');
    } catch (error) {
      console.error('Failed to send scheduled post:', error);
    }
  }

  async sendBlogPost(title: string, excerpt: string, slug: string) {
    if (!this.isInitialized || !this.bot) {
      console.log('Telegram bot not initialized, skipping blog post');
      return;
    }

    try {
      const message = `
📖 <b>Yangi blog maqola!</b>

${title}

${excerpt}

👀 To'liq o'qish: https://optombazar.uz/blog/${slug}

#OptomBazar #Blog #Biznes
`;

      await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });
      
      console.log('✅ Blog post sent to Telegram channel');
    } catch (error) {
      console.error('Failed to send blog post to Telegram:', error);
    }
  }

  async sendPromotion(products: Array<{ name: string; price: string; discount?: string }>) {
    if (!this.isInitialized || !this.bot) {
      console.log('Telegram bot not initialized, skipping promotion');
      return;
    }

    try {
      let message = `
🎉 <b>HAFTALIK AKSIYA!</b> 🎉

🛒 Maxsus chegirmalar OptomBazar.uz da:

`;

      products.forEach((product, index) => {
        message += `${index + 1}. <b>${product.name}</b>\n`;
        message += `   💰 ${product.price}`;
        if (product.discount) {
          message += ` (${product.discount} CHEGIRMA!)`;
        }
        message += `\n\n`;
      });

      message += `
📞 Buyurtma berish: +998 (90) 123-45-67
🌐 Sayt: https://optombazar.uz
🚚 Tez yetkazib berish butun O'zbekiston bo'ylab!

#OptomBazar #Aksiya #Chegirma #OptomSavdo
`;

      await this.bot.sendMessage(this.channelId, message, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });
      
      console.log('✅ Weekly promotion sent to Telegram');
    } catch (error) {
      console.error('Failed to send promotion to Telegram:', error);
    }
  }

  startScheduledPosts() {
    if (!this.isInitialized) {
      console.log('Telegram bot not initialized, cannot start scheduled posts');
      return;
    }

    // Send marketing posts every 6 hours
    setInterval(async () => {
      await this.sendScheduledPost();
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('✅ Telegram scheduled marketing posts started (every 6 hours)');
  }
}

export const telegramService = new TelegramService();
export const telegramBot = telegramService;