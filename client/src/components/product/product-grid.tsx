import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import ProductCard from "./product-card";
import ProductSkeleton from "./product-skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string;
  originalPrice?: string | null;
  slug: string;
  images: string[];
  isHit: boolean;
  isPromo: boolean;
  discountPercent: number;
  rating: string;
  reviewCount: number;
  stock: number;
}

interface ProductGridProps {
  filters?: {
    categoryId?: string;
    isHit?: boolean;
    isPromo?: boolean;
    search?: string;
  };
  limit?: number;
  className?: string;
  enableLazyLoading?: boolean;
}

export default function ProductGrid({ 
  filters, 
  limit, 
  className, 
  enableLazyLoading = true 
}: ProductGridProps) {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(enableLazyLoading ? 8 : undefined);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Build query parameters string
  let queryString = "/api/products";
  if (filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    if (params.toString()) {
      queryString += `?${params.toString()}`;
    }
  }
  
  const queryKey = [queryString];

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableLazyLoading || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [enableLazyLoading]);

  // Load more products when intersection is detected
  useEffect(() => {
    if (isIntersecting && visibleCount && visibleCount < products.length) {
      setTimeout(() => {
        setVisibleCount(prev => (prev ? Math.min(prev + 8, products.length) : 8));
      }, 300);
    }
  }, [isIntersecting, visibleCount, products.length]);

  const displayProducts = limit 
    ? products.slice(0, limit) 
    : enableLazyLoading && visibleCount 
      ? products.slice(0, visibleCount)
      : products;

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className} stagger-children`}>
        {Array.from({ length: 8 }, (_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("error")}: {error instanceof Error ? error.message : "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <Alert className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("noResults")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className} stagger-children`} data-testid="product-grid">
        {displayProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="animate-fadeInUp"
            style={{ animationDelay: `${(index % 8) * 0.1}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Lazy loading trigger and loading indicator */}
      {enableLazyLoading && products.length > (visibleCount || 0) && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductSkeleton key={`loading-${i}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
