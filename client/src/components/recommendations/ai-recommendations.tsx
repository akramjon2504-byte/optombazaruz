import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, TrendingUp, Users } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string;
  originalPrice?: string | null;
  slug: string;
  imageUrl?: string | null;
  imageUrl2?: string | null;
  imageUrl3?: string | null;
  isHit: boolean;
  isPromo: boolean;
  discountPercent: number;
  rating: string;
  reviewCount: number;
  stock: number;
}

interface AIRecommendationsProps {
  userId?: string;
  currentProductId?: string;
  categoryId?: string;
}

export default function AIRecommendations({ 
  userId, 
  currentProductId, 
  categoryId 
}: AIRecommendationsProps) {
  const { language, t } = useLanguage();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendationType, setRecommendationType] = useState<'personalized' | 'similar' | 'trending' | 'collaborative'>('personalized');

  useEffect(() => {
    fetchRecommendations();
  }, [userId, currentProductId, categoryId, recommendationType]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call your AI recommendation API
      // For now, we'll simulate different recommendation types
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock recommendations based on type
      const mockRecommendations: Product[] = [
        {
          id: "rec1",
          nameUz: "AI tavsiya qilingan mahsulot 1",
          nameRu: "AI рекомендованный продукт 1",
          price: "25000",
          originalPrice: "30000",
          slug: "ai-recommended-1",
          imageUrl: "https://via.placeholder.com/300x200",
          isHit: true,
          isPromo: false,
          discountPercent: 17,
          rating: "4.8",
          reviewCount: 156,
          stock: 25
        },
        // Add more mock products...
      ];
      
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case 'personalized':
        return language === 'uz' ? 'Siz uchun tavsiyalar' : 'Рекомендации для вас';
      case 'similar':
        return language === 'uz' ? 'O\'xshash mahsulotlar' : 'Похожие товары';
      case 'trending':
        return language === 'uz' ? 'Ommabop mahsulotlar' : 'Популярные товары';
      case 'collaborative':
        return language === 'uz' ? 'Boshqalar ham sotib olgan' : 'Другие также покупали';
      default:
        return language === 'uz' ? 'Tavsiyalar' : 'Рекомендации';
    }
  };

  const getRecommendationIcon = () => {
    switch (recommendationType) {
      case 'personalized':
        return <Bot className="w-5 h-5" />;
      case 'similar':
        return <Sparkles className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'collaborative':
        return <Users className="w-5 h-5" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 animate-pulse" />
            AI tavsiyalar yuklanmoqda...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getRecommendationIcon()}
            {getRecommendationTitle()}
            <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
              AI
            </span>
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant={recommendationType === 'personalized' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecommendationType('personalized')}
            >
              <Bot className="w-4 h-4 mr-1" />
              Shaxsiy
            </Button>
            <Button
              variant={recommendationType === 'similar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecommendationType('similar')}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              O'xshash
            </Button>
            <Button
              variant={recommendationType === 'trending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecommendationType('trending')}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Trend
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* AI confidence indicator */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bot className="w-4 h-4" />
            <span>
              Bu tavsiyalar sun'iy intellekt tomonidan sizning xarid tarixingiz va afzalliklaringiz asosida yaratilgan
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">AI ishonch darajasi:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-4/5"></div>
            </div>
            <span className="text-xs font-medium text-green-600">85%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}