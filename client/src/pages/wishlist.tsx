import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WishlistItem {
  id: string;
  productId: string;
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
}

export default function Wishlist() {
  const { language, t } = useLanguage();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    // Mock data - replace with actual wishlist data
    {
      id: "1",
      productId: "prod1",
      product: {
        id: "prod1",
        nameUz: "Polietilen paket maykasimon",
        nameRu: "Полиэтиленовый пакет-майка",
        price: "15000",
        originalPrice: "20000",
        slug: "polietilen-paket",
        imageUrl: "https://via.placeholder.com/300x200",
        isHit: true,
        isPromo: false,
        discountPercent: 25,
        rating: "4.5",
        reviewCount: 123,
        stock: 50
      }
    }
  ]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            Sevimli mahsulotlar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Siz tanlab qo'ygan mahsulotlar ro'yxati
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">Sevimli mahsulotlar yo'q</h3>
              <p className="text-gray-600 mb-6">
                Mahsulot kartochkalarida yurak belgisini bosib, sevimli mahsulotlaringizni qo'shing
              </p>
              <Link href="/catalog">
                <Button className="inline-flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Katalogga o'tish
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Actions bar */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {wishlistItems.length} ta mahsulot
              </div>
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hammasini o'chirish
              </Button>
            </div>

            {/* Wishlist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative group">
                  <ProductCard product={item.product} />
                  
                  {/* Remove button overlay */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Sizga yoqishi mumkin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* This would be populated with recommended products */}
                <div className="text-center text-gray-500 py-8 col-span-full">
                  Tavsiya etiladigan mahsulotlar yuklanmoqda...
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}