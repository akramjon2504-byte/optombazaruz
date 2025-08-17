import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
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
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const productName = language === "uz" ? product.nameUz : product.nameRu;
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className={cn("hover-lift overflow-hidden cursor-pointer", className)} data-testid={`card-product-${product.id}`}>
        <div className="relative">
          <img
            src={product.images[0] || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={productName}
            className="w-full h-48 object-cover"
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.isHit && (
              <Badge variant="secondary" className="bg-secondary text-white">
                Hit
              </Badge>
            )}
            {product.discountPercent > 0 && (
              <Badge variant="destructive" className="bg-discount text-white">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>
          
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 left-2 text-gray-400 hover:text-red-500 transition-colors"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-red-500 text-red-500")} />
          </button>
        </div>
        
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-gray-900 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {productName}
          </h4>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(parseFloat(product.rating)) 
                      ? "fill-current" 
                      : "fill-none"
                  )}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 text-sm" data-testid={`text-reviews-${product.id}`}>
              ({product.reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                {price.toLocaleString()} сум
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through block">
                  {originalPrice.toLocaleString()} сум
                </span>
              )}
            </div>
          </div>
          
          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-full"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? "Qolmadi" : t("addToCart")}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
