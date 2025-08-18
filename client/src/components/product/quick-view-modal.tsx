import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

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
  descriptionUz?: string;
  descriptionRu?: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { language, t } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const productName = language === "uz" ? product.nameUz : product.nameRu;
  const description = language === "uz" ? product.descriptionUz : product.descriptionRu;
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;

  const images = [
    product.imageUrl,
    product.imageUrl2,
    product.imageUrl3
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{productName}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage] || "https://via.placeholder.com/400x400"}
                alt={productName}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.isHit && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    {t("hit")}
                  </Badge>
                )}
                {product.discountPercent > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                    -{product.discountPercent}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-primary" : "border-gray-200"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(parseFloat(product.rating))
                        ? "fill-current"
                        : "fill-none"
                    )}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount} sharh)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {price.toLocaleString()} сум
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xl text-gray-500 line-through">
                    {originalPrice.toLocaleString()} сум
                  </span>
                )}
              </div>
              {product.discountPercent > 0 && (
                <div className="text-green-600 font-medium">
                  {(originalPrice! - price).toLocaleString()} сум тежаш
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            {description && (
              <div>
                <h4 className="font-semibold mb-2">Tavsif</h4>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="font-medium">Holat:</span>
              {product.stock > 0 ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Mavjud ({product.stock} dona)
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Mavjud emas
                </Badge>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Miqdor:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isAddingToCart ? "Qo'shilmoqda..." : "Savatga qo'shish"}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleToggleWishlist}
                className="px-4"
              >
                <Heart className={cn(
                  "w-4 h-4",
                  isWishlisted && "fill-red-500 text-red-500"
                )} />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Bepul yetkazib berish 100,000 сум dan ortiq</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Sifat kafolati</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4" />
                <span>14 kun ichida qaytarish</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}