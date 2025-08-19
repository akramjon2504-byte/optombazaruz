import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import AdvancedSearch from "@/components/search/advanced-search";
import AIRecommendations from "@/components/recommendations/ai-recommendations";
import ChatWidget from "@/components/ai/chat-widget";
import MarketingBanner from "@/components/telegram/marketing-banner";
import DiscountTimer from "@/components/promo/discount-timer";
import InstallPrompt from "@/components/pwa/install-prompt";
import OfflineBanner from "@/components/pwa/offline-banner";
import PushNotifications from "@/components/pwa/push-notifications";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Bot, Truck, Award, Headphones, Search, ChevronDown } from "lucide-react";

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
  const [searchFilters, setSearchFilters] = useState({});

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog?limit=3"],
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

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

      {/* Modern Hero Section - Hidden on mobile */}
      <section className="hero-gradient text-white py-16 md:py-24 relative overflow-hidden hidden md:block">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="float-element absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="float-element absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="float-element absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="text-center md:text-left stagger-children">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100" data-testid="text-hero-title">
                {t("heroTitle")}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed font-light" data-testid="text-hero-subtitle">
                {t("heroSubtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/catalog">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl"
                    data-testid="button-view-catalog"
                  >
                    {t("viewCatalogBtn")}
                  </Button>
                </Link>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 px-8 py-4 rounded-full font-semibold backdrop-blur-sm"
                  data-testid="button-ai-assistant"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  {t("aiAssistantBtn")}
                </Button>
              </div>
            </div>
            
            <div className="relative mt-8 md:mt-0 animate-scaleIn">
              <div className="card-gradient rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 h-24 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer group">
                    <Bot className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 h-24 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer group">
                    <Truck className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 h-24 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer group">
                    <Award className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 h-24 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer group">
                    <Headphones className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Stats display */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="text-white">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-blue-200">Mahsulotlar</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-blue-200">Qo'llab-quvvatlash</div>
                  </div>
                  <div className="text-white">
                    <div className="text-2xl font-bold">AI</div>
                    <div className="text-sm text-blue-200">Yordamchi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Section */}
      <section className="md:hidden bg-gradient-to-br from-primary/10 to-secondary/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {t("heroTitle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
            {t("heroSubtitle")}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/catalog">
              <Button size="sm" className="px-6 py-2 rounded-full font-semibold">
                {t("viewCatalogBtn")}
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="px-6 py-2 rounded-full font-semibold">
              <Bot className="w-4 h-4 mr-2" />
              AI Yordam
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Search Section */}
      <section className="md:hidden py-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 py-3 text-base"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Advanced Search Section - Desktop */}
      <section className="hidden md:block py-8 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <AdvancedSearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-8 md:py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h3 className="text-xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-gray-900 dark:text-white" data-testid="text-main-categories">
            {t("mainCategories")}
          </h3>
          {/* Mobile: Single column layout */}
          <div className="md:hidden space-y-3">
            {(categories as Category[]).map((category: Category, index: number) => {
              const categoryName = language === "uz" ? category.nameUz : category.nameRu;
              const productCount = getCategoryProductCount(category.slug);
              const colors = [
                "bg-blue-50 text-blue-600 border-blue-200",
                "bg-green-50 text-green-600 border-green-200", 
                "bg-orange-50 text-orange-600 border-orange-200",
                "bg-purple-50 text-purple-600 border-purple-200",
                "bg-pink-50 text-pink-600 border-pink-200",
                "bg-gray-50 text-gray-600 border-gray-200"
              ];
              
              return (
                <Link key={category.id} href={`/catalog?category=${category.slug}`}>
                  <div className={`flex items-center p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${colors[index % colors.length]} dark:bg-gray-800 dark:border-gray-700 dark:text-white`} data-testid={`category-${category.slug}`}>
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/80 flex items-center justify-center mr-4">
                      {index === 0 && <div className="text-2xl">🛍️</div>}
                      {index === 1 && <div className="text-2xl">🍽️</div>}
                      {index === 2 && <div className="text-2xl">🏠</div>}
                      {index === 3 && <div className="text-2xl">📱</div>}
                      {index === 4 && <div className="text-2xl">👕</div>}
                      {index === 5 && <div className="text-2xl">🧴</div>}
                      {index === 6 && <div className="text-2xl">📝</div>}
                      {index === 7 && <div className="text-2xl">🎉</div>}
                      {index > 7 && <div className="text-2xl">📦</div>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base leading-tight mb-1">{categoryName}</h4>
                      <p className="text-sm opacity-75">{productCount}+ {t("products")}</p>
                    </div>
                    <div className="text-gray-400">
                      <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Desktop: Grid layout */}
          <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {(categories as Category[]).map((category: Category, index: number) => {
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
                    <div className={`rounded-full p-4 md:p-6 mb-3 md:mb-4 transition-all ${colors[index % colors.length]}`}>
                      {/* Category icons */}
                      {index === 0 && <div className="text-2xl md:text-3xl">🛍️</div>}
                      {index === 1 && <div className="text-2xl md:text-3xl">🍽️</div>}
                      {index === 2 && <div className="text-2xl md:text-3xl">🏠</div>}
                      {index === 3 && <div className="text-2xl md:text-3xl">📱</div>}
                      {index === 4 && <div className="text-2xl md:text-3xl">👕</div>}
                      {index === 5 && <div className="text-2xl md:text-3xl">🧴</div>}
                      {index === 6 && <div className="text-2xl md:text-3xl">📝</div>}
                      {index === 7 && <div className="text-2xl md:text-3xl">🎉</div>}
                      {index > 7 && <div className="text-2xl md:text-3xl">📦</div>}
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm md:text-base leading-tight">{categoryName}</h4>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{productCount}+ {t("products")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Section - Hidden on mobile */}
      <section className="py-12 bg-gradient-to-r from-red-500 to-red-600 text-white hidden md:block">
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

      {/* Hit Products - Hidden on mobile */}
      <section className="py-16 bg-gray-50 hidden md:block">
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

      {/* AI Recommendations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AIRecommendations />
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
              {language === "uz" ? "AI tomonidan yaratilgan foydali maqolalar" : "Полезные статьи, созданные ИИ"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {(blogPosts as BlogPost[]).map((post: BlogPost) => {
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
                        {t("readMore")} →
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
      <InstallPrompt />
      <PushNotifications />
      <OfflineBanner className="fixed top-0 left-0 right-0 z-40" />
    </div>
  );
}
