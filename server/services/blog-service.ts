import { GoogleGenAI } from '@google/genai';
import { storage } from '../storage';
import type { BlogPost, InsertBlogPost } from '../../shared/schema';
import { nanoid } from 'nanoid';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface GeneratedBlogPost {
  titleUz: string;
  titleRu: string;
  contentUz: string;
  contentRu: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
}

export class BlogService {
  private topics = {
    uz: [
      "Optom savdo strategiyalari",
      "Kichik biznes uchun optom xaridlar", 
      "Optom bozorida muvaffaqiyat sirlari",
      "Sifatli mahsulot tanlash yo'llari",
      "Optom narxlar va tejash usullari",
      "Yetkazib berish xizmatlari",
      "Yangi mahsulotlar va trendlar",
      "Mijozlar bilan ishlash",
      "Biznes rivojlantirish",
      "Marketing strategiyalari",
      "Moliyaviy boshqaruv",
      "Raqobat tahlili"
    ],
    ru: [
      "Стратегии оптовой торговли",
      "Оптовые закупки для малого бизнеса",
      "Секреты успеха на оптовом рынке", 
      "Способы выбора качественной продукции",
      "Оптовые цены и методы экономии",
      "Услуги доставки",
      "Новые продукты и тренды",
      "Работа с клиентами",
      "Развитие бизнеса",
      "Маркетинговые стратегии",
      "Финансовое управление",
      "Анализ конкурентов"
    ]
  };

  async generateBlogPost(): Promise<GeneratedBlogPost> {
    try {
      // Random topic selection
      const randomIndex = Math.floor(Math.random() * this.topics.uz.length);
      const topicUz = this.topics.uz[randomIndex];
      const topicRu = this.topics.ru[randomIndex];

      // Generate Uzbek content
      const uzPrompt = `
"${topicUz}" mavzusida professional blog maqola yozing. Maqola:

JUDA MUHIM TALABLAR:
- Hech qanday markdown yoki HTML belgilar ishlatmang (* ** __ - # va boshqalar)
- Professional copywriting va jurnalistik uslubda yozing
- Faqat oddiy matn formatida, paragraflar orasida bo'sh qator
- Akademik darajadagi professional matn
- Hech qanday belgilar bilan ajratuvchi qismlar yo'q

Maqola talablari:
1. O'zbek tilida professional yozuv
2. 1000-1500 so'z hajmida
3. Amaliy maslahatlar va tajriba
4. OptomBazar.uz platformasini tavsiya etish
5. SEO optimallashtirilgan kontent
6. Jurnalistik va copywriting standartlari
7. Faqat oddiy matn - hech qanday formatlovchi element yo'q

Struktura:
- Professional sarlavha
- Qisqa tavsif (150 so'z)
- Asosiy kontent (oddiy matn paragraflar)
- Professional xulosa

Format: JSON
{
  "title": "Professional sarlavha",
  "excerpt": "Qisqa professional tavsif", 
  "content": "To'liq professional kontent - faqat oddiy matn"
}
      `;

      const uzResult = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: uzPrompt,
      });
      const uzText = uzResult.text || "";

      // Generate Russian content  
      const ruPrompt = `
Напишите профессиональную статью для блога на тему "${topicRu}". Требования к статье:

КРИТИЧЕСКИ ВАЖНО:
- Никаких markdown или HTML символов (* ** __ - # и другие)
- Профессиональный копирайтинг и журналистский стиль
- Только обычный текст, пустые строки между абзацами
- Академический уровень профессионального текста
- Никаких разделительных элементов с символами

Требования к статье:
1. Профессиональный русский язык
2. Объем 1000-1500 слов
3. Практические советы и опыт
4. Рекомендации платформы OptomBazar.uz
5. SEO оптимизированный контент
6. Стандарты журналистики и копирайтинга
7. Только обычный текст - никаких форматирующих элементов

Структура:
- Профессиональный заголовок
- Краткое описание (150 слов)
- Основной контент (обычный текст параграфы)
- Профессиональное заключение

Формат: JSON
{
  "title": "Профессиональный заголовок",
  "excerpt": "Краткое профессиональное описание",
  "content": "Полный профессиональный контент - только обычный текст"
}
      `;

      const ruResult = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: ruPrompt,
      });
      const ruText = ruResult.text || "";

      // Parse responses
      const uzData = this.parseJSONResponse(uzText);
      const ruData = this.parseJSONResponse(ruText);

      // Generate slug
      const slug = this.generateSlug(uzData.title || topicUz);

      return {
        titleUz: uzData.title || topicUz,
        titleRu: ruData.title || topicRu,
        contentUz: uzData.content || uzText,
        contentRu: ruData.content || ruText,
        excerpt: uzData.excerpt || uzText.substring(0, 150),
        slug,
        category: 'business',
        tags: ['optom', 'biznes', 'maslahat', 'uzbekistan']
      };

    } catch (error) {
      console.error('Blog generation error:', error);
      throw error;
    }
  }

  private parseJSONResponse(text: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.error('JSON parse error:', error);
      return {};
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  async createAndSaveBlogPost(): Promise<BlogPost> {
    try {
      const generated = await this.generateBlogPost();
      
      const blogPost: InsertBlogPost = {
        titleUz: generated.titleUz,
        titleRu: generated.titleRu,
        contentUz: generated.contentUz,
        contentRu: generated.contentRu,
        excerpt: generated.excerpt,
        slug: generated.slug,
        imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`, // Placeholder image
        isPublished: true
      };

      const savedPost = await storage.createBlogPost(blogPost);
      console.log(`Blog post created: ${generated.titleUz}`);
      
      return savedPost;
    } catch (error) {
      console.error('Failed to create blog post:', error);
      throw error;
    }
  }

  // Schedule daily blog creation (10-12 posts per day)
  startScheduledBlogGeneration(): void {
    // Generate blog posts every 2 hours (12 posts per day)
    setInterval(async () => {
      try {
        await this.createAndSaveBlogPost();
      } catch (error) {
        console.error('Scheduled blog generation failed:', error);
      }
    }, 2 * 60 * 60 * 1000); // Every 2 hours

    console.log('Scheduled blog generation started - 12 posts per day');
  }
}

export const blogService = new BlogService();