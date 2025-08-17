import { useRoute } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/ai/chat-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/language-context";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingCart, Star, Truck, Shield, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
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
  categoryId: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const { language, t } = useLanguage();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products/slug", params?.slug],
    enabled: !!params?.slug,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/products", product?.id, "reviews"],
    enabled: !!product?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Mahsulot topilmadi</h1>
            <Link href="/catalog">
              <Button>Katalogga qaytish</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productName = language === "uz" ? product.nameUz : product.nameRu;
  const productDescription = language === "uz" ? product.descriptionUz : product.descriptionRu;
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/">
            <span className="hover:text-primary cursor-pointer">Bosh sahifa</span>
          </Link>
          <span>/</span>
          <Link href="/catalog">
            <span className="hover:text-primary cursor-pointer">Katalog</span>
          </Link>
          <span>/</span>
          <span className="text-gray-900">{productName}</span>
        </div>

        {/* Back button */}
        <Link href="/catalog">
          <Button variant="outline" className="mb-6" data-testid="button-back-catalog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Katalogga qaytish
          </Button>
        </Link>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="mb-4">
              <img
                src={product.images[selectedImageIndex] || "https://via.placeholder.com/400x400?text=No+Image"}
                alt={productName}
                className="w-full h-96 object-cover rounded-lg shadow-md"
                data-testid="img-product-main"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 border-2 rounded-lg overflow-hidden ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                    data-testid={`button-image-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${productName} ${index + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex space-x-2 mb-4">
              {product.isHit && (
                <Badge variant="secondary" className="bg-secondary text-white">Hit</Badge>
              )}
              {product.discountPercent > 0 && (
                <Badge variant="destructive" className="bg-discount text-white">
                  -{product.discountPercent}%
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="outline" className="text-gray-500">Qolmadi</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-product-name">
              {productName}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(parseFloat(product.rating)) ? 'fill-current' : 'fill-none'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600" data-testid="text-product-rating">
                {product.rating} ({product.reviewCount} {t("reviews")})
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-primary" data-testid="text-product-price">
                  {price.toLocaleString()} сум
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xl text-gray-500 line-through">
                    {originalPrice.toLocaleString()} сум
                  </span>
                )}
              </div>
              {originalPrice && originalPrice > price && (
                <span className="text-green-600 font-semibold">
                  Tejash: {(originalPrice - price).toLocaleString()} сум
                </span>
              )}
            </div>

            {/* Description */}
            {productDescription && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Tavsif</h3>
                <p className="text-gray-600" data-testid="text-product-description">
                  {productDescription}
                </p>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Miqdor:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-decrease-quantity"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border rounded text-center min-w-[50px]" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    data-testid="button-increase-quantity"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  (Omborda: {product.stock} dona)
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  className="flex-1"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? "Qolmadi" : t("addToCart")}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={isWishlisted ? "text-red-500" : ""}
                  data-testid="button-toggle-wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Truck className="w-8 h-8 text-primary" />
                <span className="text-sm">Bepul yetkazib berish</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Shield className="w-8 h-8 text-primary" />
                <span className="text-sm">Sifat kafolati</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Clock className="w-8 h-8 text-primary" />
                <span className="text-sm">24/7 qo'llab-quvvatlash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6">Sharhlar ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Hozircha sharhlar yo'q. Birinchi bo'lib sharh qoldiring!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-current' : 'fill-none'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
