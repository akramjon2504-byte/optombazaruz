import { useQuery } from "@tanstack/react-query";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

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
}

export default function ProductGrid({ filters, limit, className }: ProductGridProps) {
  const { t } = useLanguage();

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
  });

  const displayProducts = limit ? products.slice(0, limit) : products;

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`} data-testid="product-grid">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
