import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import ChatWidget from "@/components/ai/chat-widget";
import MarketingBanner from "@/components/telegram/marketing-banner";
import DiscountTimer from "@/components/promo/discount-timer";
import { useLanguage } from "@/lib/language-context";
import { useQuery } from "@tanstack/react-query";
import { Bot, Truck, Award, Headphones } from "lucide-react";

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
  icon: string;
}

interface BlogPost {
  id: string;
  titleUz: string;
  titleRu: string;
  excerpt: string;
  slug: string;
  imageUrl: string;
  isAiGenerated: boolean;
  createdAt: string;
}

export default function Home() {
  const { language, t } = useLanguage();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog?limit=3"],
  });

  const getCategoryProductCount = (slug: string) => {
    const counts: Record<string, number> = {
      "polietilenovye-pakety": 500,
      "odnorazovaya-posuda": 300,
      "tovary-dlya-doma-dlya-magazinov-kafe-restoranov-barov": 250,
      "elektronika": 150,
      "odejda": 200,
      "bytovaya-himiya": 100,
      "kantstovary-dlya-shkoly-i-ofisa-vse-dlya-ucheby-i-raboty": 180,
      "tovary-dlya-prazdnikov": 80
    };
    return counts[slug] || 50;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6" data-testid="text-hero-title">
                {t("heroTitle")}
              </h2>
              <p className="text-xl mb-8 text-blue-100" data-testid="text-hero-subtitle">
                {t("heroSubtitle")}
              </p>
              <div className="flex space-x-4">
                <Link href="/catalog">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-gray-100"
                    data-testid="button-view-catalog"
                  >
                    {t("viewCatalog")}
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary"
                  data-testid="button-ai-assistant"
                >
                  {t("aiAssistant")}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/20 rounded-xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/30 h-20 rounded-lg flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/30 h-20 rounded-lg flex items-center justify-center">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/30 h-20 rounded-lg flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/30 h-20 rounded-lg flex items-center justify-center">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-10" data-testid="text-main-categories">
            {t("mainCategories")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const categoryName = language === "uz" ? category.nameUz : category.nameRu;
              const productCount = getCategoryProductCount(category.slug);
              const colors = [
                "bg-blue-50 text-blue-600 group-hover:bg-primary group-hover:text-white",
                "bg-green-50 text-green-600 group-hover:bg-secondary group-hover:text-white", 
                "bg-orange-50 text-orange-600 group-hover:bg-accent group-hover:text-white",
                "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
                "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
                "bg-gray-50 text-gray-600 group-hover:bg-gray-600 group-hover:text-white"
              ];

              return (
                <Link key={category.id} href={`/catalog?category=${category.slug}`}>
                  <div className="text-center hover-lift cursor-pointer group" data-testid={`category-${category.slug}`}>
                    <div className={`rounded-full p-6 mb-4 transition-all ${colors[index % colors.length]}`}>
                      <i className={`${category.icon} text-3xl`}></i>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{categoryName}</h4>
                    <p className="text-sm text-gray-500">{productCount}+ {t("products")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="py-12 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-bold mb-4" data-testid="text-flash-sale">
              {t("flashSale")}
            </h3>
            <p className="text-xl">{t("limitedOffer")}</p>
          </div>
          
          <DiscountTimer />
          
          <ProductGrid 
            filters={{ isPromo: true }} 
            limit={3}
            className="text-gray-900"
          />
        </div>
      </section>

      {/* Hit Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-bold" data-testid="text-hit-products">
              🏆 {t("hitProducts")}
            </h3>
            <Link href="/catalog?isHit=true">
              <span className="text-primary hover:underline font-semibold cursor-pointer" data-testid="link-view-all-hits">
                {t("viewAll")} →
              </span>
            </Link>
          </div>
          
          <ProductGrid filters={{ isHit: true }} limit={4} />
        </div>
      </section>

      {/* AI Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4" data-testid="text-ai-blog">
              📝 AI {t("blog")}
            </h3>
            <p className="text-xl text-gray-600">
              Gemini AI tomonidan yaratilgan foydali maqolalar
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const title = language === "uz" ? post.titleUz : post.titleRu;
              
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover-lift cursor-pointer" data-testid={`blog-post-${post.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          AI {t("blog")} • {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <img
                        src={post.imageUrl}
                        alt={title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        data-testid={`img-blog-${post.id}`}
                      />
                      
                      <h4 className="font-bold text-xl mb-3" data-testid={`text-blog-title-${post.id}`}>
                        {title}
                      </h4>
                      
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      
                      <span className="text-primary hover:underline font-semibold">
                        Batafsil o'qish →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4" data-testid="text-why-optombazar">
              {t("whyOptomBazar")}
            </h3>
            <p className="text-xl text-blue-100">{t("ourAdvantages")}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">{t("aiHelper")}</h4>
              <p className="text-blue-100">{t("aiHelperDesc")}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">{t("fastDelivery")}</h4>
              <p className="text-blue-100">{t("fastDeliveryDesc")}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">{t("qualityGuarantee")}</h4>
              <p className="text-blue-100">{t("qualityGuaranteeDesc")}</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">{t("support24")}</h4>
              <p className="text-blue-100">{t("support24Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <MarketingBanner />
    </div>
  );
}
