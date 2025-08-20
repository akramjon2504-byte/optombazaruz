import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifications } from "@/lib/toast-helpers";

interface ProductCardProps {
  product: {
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
    notifications.cartItemAdded(productName);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isWishlisted) {
      notifications.wishlistItemAdded(productName);
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className={cn("product-card group cursor-pointer border-0 shadow-md hover:shadow-2xl", className)} data-testid={`card-product-${product.id}`}>
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={product.imageUrl || "https://via.placeholder.com/300x200?text=Rasm+yo'q"}
            alt={productName}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
            {product.isHit && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                {t("hit")}
              </Badge>
            )}
            {product.discountPercent > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                -{product.discountPercent}%
              </Badge>
            )}
          </div>
          
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-lg"
            data-testid={`button-wishlist-${product.id}`}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")} />
          </button>
          
          {/* Quick view overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-medium transform scale-90 group-hover:scale-100 transition-transform duration-300">
              Tez ko'rish
            </div>
          </div>
        </div>
        
        <CardContent className="p-5 space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors duration-300" data-testid={`text-product-name-${product.id}`}>
            {productName}
          </h4>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    i < Math.floor(parseFloat(product.rating)) 
                      ? "fill-current text-yellow-500" 
                      : "fill-none text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium" data-testid={`text-reviews-${product.id}`}>
              {product.rating} ({product.reviewCount})
            </span>
          </div>
          
          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                {price.toLocaleString()} сум
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-lg text-gray-500 line-through">
                  {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                {(originalPrice! - price).toLocaleString()} сум тежаш
              </div>
            )}
          </div>
          
          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
            className="w-full group-hover:bg-primary group-hover:scale-105 transition-all duration-300 font-semibold py-3 shadow-lg hover:shadow-xl"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className={cn(
              "w-4 h-4 mr-2 transition-transform duration-300",
              isAddingToCart && "animate-spin"
            )} />
            {isAddingToCart 
              ? "Qo'shilmoqda..." 
              : product.stock === 0 
                ? t("outOfStockMessage") 
                : t("addToCart")
            }
          </Button>
          
          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 10 && (
            <div className="text-center text-orange-500 text-xs font-medium">
              Faqat {product.stock} dona qoldi!
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
