import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "" });

if (!process.env.GOOGLE_API_KEY) {
  console.warn('⚠️ GOOGLE_API_KEY not found. AI features will be disabled.');
} else {
  console.log('✅ Gemini API initialized successfully');
}

export async function generateChatResponse(message: string, context?: string): Promise<string> {
  try {
    const systemPrompt = `Siz OptomBazar.uz optom savdo platformasining AI yordamchisisiz. 
    Sizning vazifangiz mijozlarga mahsulotlar, narxlar, yetkazib berish va xizmatlar haqida yordam berish.
    Har doim do'stona va professional javob bering. 
    Agar mahsulot haqida aniq ma'lumot bo'lmasa, umumiy ma'lumot bering.
    Javoblarni qisqa va aniq qiling.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: context ? `Kontekst: ${context}\n\nSavol: ${message}` : message,
    });

    return response.text || "Kechirasiz, men hozir javob bera olmayman. Keyinroq urinib ko'ring.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Texnik xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.";
  }
}

export interface BlogPostContent {
  titleUz: string;
  titleRu: string;
  contentUz: string;
  contentRu: string;
  excerpt: string;
  slug: string;
}

export async function generateBlogPost(topic: string, category?: string): Promise<BlogPostContent> {
  try {
    const prompt = `Optom savdo sohasida "${topic}" mavzusida professional blog maqolasi yarating.
    ${category ? `Kategoriya: ${category}` : ""}
    
    MUHIM TALABLAR:
    - Hech qanday markdown belgilar ishlatmang (* ** __ - va hokazo)
    - Faqat oddiy matn formatida yozing
    - Professional copywriting uslubida
    - Jurnalistik va akademik yozuv tarzida
    - Paragraflar orasida faqat bo'sh qator qoldiring
    
    Maqola professional, foydali va SEO optimallashtirilgan bo'lishi kerak.
    O'zbek va rus tillarida yozing.
    
    JSON formatida qaytaring:
    {
      "titleUz": "O'zbek tilidagi sarlavha",
      "titleRu": "Русский заголовок", 
      "contentUz": "O'zbek tilidagi to'liq matn (kamida 500 so'z) - faqat oddiy matn",
      "contentRu": "Полный текст на русском (минимум 500 слов) - только обычный текст",
      "excerpt": "Qisqa tavsif (150 belgigacha)",
      "slug": "url-uchun-slug"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            titleUz: { type: "string" },
            titleRu: { type: "string" },
            contentUz: { type: "string" },
            contentRu: { type: "string" },
            excerpt: { type: "string" },
            slug: { type: "string" }
          },
          required: ["titleUz", "titleRu", "contentUz", "contentRu", "excerpt", "slug"]
        }
      },
      contents: prompt,
    });

    const content = JSON.parse(response.text || "{}");
    return content;
  } catch (error) {
    console.error("Blog generation error:", error);
    throw new Error("Blog maqolasi yaratishda xatolik yuz berdi");
  }
}

export async function generateProductDescription(productName: string, category: string): Promise<{ uz: string; ru: string }> {
  try {
    const prompt = `"${productName}" mahsuloti uchun (${category} kategoriyasida) marketing tavsifi yarating.
    O'zbek va rus tillarida yozing. Professional va sotuvga yo'naltirilgan bo'lsin.
    
    JSON formatda qaytaring:
    {
      "uz": "O'zbek tilidagi tavsif",
      "ru": "Описание на русском"
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            uz: { type: "string" },
            ru: { type: "string" }
          },
          required: ["uz", "ru"]
        }
      },
      contents: prompt,
    });

    return JSON.parse(response.text || '{"uz": "", "ru": ""}');
  } catch (error) {
    console.error("Product description generation error:", error);
    return { uz: "", ru: "" };
  }
}

export async function generateMarketingContent(type: 'telegram' | 'social', products?: string[]): Promise<string> {
  try {
    const productList = products?.join(", ") || "yangi mahsulotlar";
    const prompt = `OptomBazar.uz uchun ${type} marketing kontenti yarating.
    Mahsulotlar: ${productList}
    
    MUHIM TALABLAR:
    - Hech qanday markdown yoki formatlovchi belgilar ishlatmang (* ** __ - # va boshqalar)
    - Professional copywriting va marketing uslubida
    - Faqat oddiy matn, emoji va hashtag
    - Jurnalistik va professional yozuv tarzida
    - Akademik darajadagi marketing matn
    
    Kontent professional, qiziqarli va harakatga undovchi bo'lsin.
    SEO va copywriting standartlari bo'yicha optimallashtirilgan.
    O'zbek va rus tillarini professional tarzda aralashtiring.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return response.text || "Yangi mahsulotlar OptomBazar.uz da! 🛒";
  } catch (error) {
    console.error("Marketing content generation error:", error);
    return "OptomBazar.uz - O'zbekistonning #1 optom platformasi! 🏆";
  }
}
