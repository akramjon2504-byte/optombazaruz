import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/ai/chat-widget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { Bot, ArrowLeft, Calendar, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  titleUz: string;
  titleRu: string;
  contentUz: string;
  contentRu: string;
  excerpt: string;
  slug: string;
  imageUrl: string;
  isAiGenerated: boolean;
  publishedAt: string;
  createdAt: string;
}

export default function Blog() {
  const [, params] = useRoute("/blog/:slug");
  const { language, t } = useLanguage();
  const isDetailPage = !!params?.slug;

  const { data: blogPosts = [], isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    enabled: !isDetailPage,
  });

  const { data: blogPost, isLoading: isLoadingPost } = useQuery<BlogPost>({
    queryKey: ["/api/blog", params?.slug],
    enabled: isDetailPage && !!params?.slug,
  });

  if (isDetailPage) {
    if (isLoadingPost) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (!blogPost) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Maqola topilmadi</h1>
              <Link href="/blog">
                <Button>Blogga qaytish</Button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    const title = language === "uz" ? blogPost.titleUz : blogPost.titleRu;
    const content = language === "uz" ? blogPost.contentUz : blogPost.contentRu;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <Link href="/blog">
            <Button variant="outline" className="mb-6" data-testid="button-back-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Blogga qaytish
            </Button>
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              {blogPost.isAiGenerated && (
                <Badge variant="secondary" className="mb-4 bg-primary text-white">
                  <Bot className="w-4 h-4 mr-1" />
                  AI Generated
                </Badge>
              )}
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-blog-title">
                {title}
              </h1>
              
              <div className="flex items-center space-x-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {Math.ceil(content.length / 1000)} daqiqa o'qish
                </div>
              </div>

              {blogPost.imageUrl && (
                <img
                  src={blogPost.imageUrl}
                  alt={title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md mb-6"
                  data-testid="img-blog-featured"
                />
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="prose prose-lg max-w-none" data-testid="text-blog-content">
                {content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Tags/Categories */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-4">Ushbu maqola sizga yoqdimi?</h3>
              <p className="text-gray-600 mb-4">
                OptomBazar.uz blogida biznes va savdo haqida ko'proq foydali maqolalar o'qing!
              </p>
              <Link href="/blog">
                <Button>Ko'proq maqolalar</Button>
              </Link>
            </div>
          </article>
        </div>

        <Footer />
        <ChatWidget />
      </div>
    );
  }

  // Blog listing page
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-blog-header">
            📝 AI {t("blog")}
          </h1>
          <p className="text-xl text-gray-600">
            Gemini AI tomonidan yaratilgan foydali maqolalar va maslahatlar
          </p>
        </div>

        {/* Loading state */}
        {isLoadingPosts && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Blog posts */}
        {!isLoadingPosts && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const title = language === "uz" ? post.titleUz : post.titleRu;
              
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover-lift cursor-pointer h-full" data-testid={`card-blog-${post.id}`}>
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={post.imageUrl}
                          alt={title}
                          className="w-full h-48 object-cover"
                          data-testid={`img-blog-${post.id}`}
                        />
                        
                        {post.isAiGenerated && (
                          <Badge className="absolute top-2 right-2 bg-primary text-white">
                            <Bot className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center mb-3 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </div>
                        
                        <h3 className="font-bold text-xl mb-3 line-clamp-2" data-testid={`text-blog-title-${post.id}`}>
                          {title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-primary hover:underline font-semibold">
                            Batafsil o'qish →
                          </span>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {Math.ceil((post.contentUz || post.contentRu).length / 1000)} daq
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoadingPosts && blogPosts.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Hozircha maqolalar yo'q
            </h3>
            <p className="text-gray-500">
              Tez orada AI tomonidan yangi maqolalar yaratiladi!
            </p>
          </div>
        )}

        {/* AI Blog Info */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
          <Bot className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">AI Blog haqida</h3>
          <p className="text-lg text-blue-100 mb-6">
            Bizning blogdagi barcha maqolalar Gemini AI tomonidan yaratiladi. 
            Bu maqolalar optom savdo, biznes strategiyalari va mahsulot ma'lumotlari haqida 
            foydali maslahatlar beradi.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Yangi kontentlar</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">AI</div>
              <div className="text-blue-200">Powered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Foydali</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
