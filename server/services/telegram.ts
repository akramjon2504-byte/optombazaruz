interface TelegramBot {
  sendMessage(chatId: string, text: string, options?: any): Promise<any>;
}

class TelegramService {
  private bot: TelegramBot | null = null;
  private channelId: string = process.env.TELEGRAM_CHANNEL_ID || "";
  private botToken: string = process.env.TELEGRAM_BOT_TOKEN || "";

  constructor() {
    this.initBot();
  }

  private async initBot() {
    try {
      if (!this.botToken) {
        console.warn("Telegram bot token not configured");
        return;
      }

      // Dynamic import to avoid bundling issues
      const TelegramBot = await import('node-telegram-bot-api');
      this.bot = new TelegramBot.default(this.botToken);
      console.log("Telegram bot initialized");
    } catch (error) {
      console.error("Failed to initialize Telegram bot:", error);
    }
  }

  async sendToChannel(message: string, options?: { 
    parse_mode?: 'HTML' | 'Markdown';
    disable_web_page_preview?: boolean;
  }): Promise<boolean> {
    try {
      if (!this.bot || !this.channelId) {
        console.warn("Telegram not configured properly");
        return false;
      }

      await this.bot.sendMessage(this.channelId, message, options);
      return true;
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
      return false;
    }
  }

  async sendPromotion(products: Array<{name: string; price: string; discount?: string}>) {
    const productList = products.map(p => 
      `• ${p.name} - ${p.price}${p.discount ? ` (${p.discount} chegirma!)` : ''}`
    ).join('\n');

    const message = `🔥 *AKSIYA!* 🔥

Yangi mahsulotlar OptomBazar.uz da:

${productList}

📞 Buyurtma: +998 71 123-45-67
🌐 optombazar.uz
📍 Biz bilan bog'laning!

#OptomBazar #Aksiya #O'zbekiston`;

    return this.sendToChannel(message, { 
      parse_mode: 'Markdown',
      disable_web_page_preview: true 
    });
  }

  async sendBlogPost(title: string, excerpt: string, slug: string) {
    const message = `📝 *Yangi maqola!*

*${title}*

${excerpt}

Batafsil: optombazar.uz/blog/${slug}

#Blog #OptomBazar #Maslahat`;

    return this.sendToChannel(message, { 
      parse_mode: 'Markdown' 
    });
  }

  async sendNewProducts(products: Array<{name: string; category: string; price: string}>) {
    const productList = products.map(p => 
      `• ${p.name} (${p.category}) - ${p.price}`
    ).join('\n');

    const message = `🆕 *Yangi mahsulotlar!*

${productList}

Buyurtma berish: optombazar.uz

#YangiMahsulotlar #OptomBazar`;

    return this.sendToChannel(message, { 
      parse_mode: 'Markdown' 
    });
  }
}

export const telegramService = new TelegramService();
