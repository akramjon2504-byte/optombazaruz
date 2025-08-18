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

MUHIM: Matnda hech qanday belgilar ishlatmang (* ** __ - va boshqalar)
Oddiy matn formatida yozing, faqat paragraf ajratish uchun bo'sh qator qoldiring.

1. O'zbek tilida yozilsin
2. 1000-1500 so'z hajmida bo'lsin
3. Praktik maslahatlar bersin
4. OptomBazar.uz ni taklif etsin
5. SEO va copywriting uchun optimallashtirilgan bo'lsin
6. Qiziqarli va foydali bo'lsin
7. Hech qanday formatlovchi belgilar ishlatmang

Struktura:
- Qiziqarli sarlavha
- Qisqa excerpt (150 so'z)
- Batafsil kontent (asosiy qism, oddiy matn)
- Xulosa

Format: JSON
{
  "title": "Sarlavha",
  "excerpt": "Qisqa tavsif", 
  "content": "Batafsil kontent - faqat oddiy matn"
}
      `;

      const uzResult = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: uzPrompt,
      });
      const uzText = uzResult.text || "";

      // Generate Russian content  
      const ruPrompt = `
Напишите профессиональную статью для блога на тему "${topicRu}". Статья должна:

ВАЖНО: Не используйте никаких символов форматирования (* ** __ - и другие)
Пишите в формате простого текста, оставляя только пустые строки для разделения абзацев.

1. Быть на русском языке
2. Объемом 1000-1500 слов
3. Содержать практические советы
4. Рекомендовать OptomBazar.uz
5. Быть SEO и копирайтинг оптимизированной
6. Быть интересной и полезной
7. Не использовать никаких символов форматирования

Структура:
- Интересный заголовок
- Краткое описание (150 слов)
- Подробный контент (основная часть, простой текст)
- Заключение

Формат: JSON
{
  "title": "Заголовок",
  "excerpt": "Краткое описание",
  "content": "Подробный контент - только простой текст"
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
        id: nanoid(),
        titleUz: generated.titleUz,
        titleRu: generated.titleRu,
        contentUz: generated.contentUz,
        contentRu: generated.contentRu,
        excerpt: generated.excerpt,
        slug: generated.slug,
        imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`, // Placeholder image
        category: generated.category,
        tags: generated.tags,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
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