import { useState } from "react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    nameUz: string;
    nameRu: string;
    price: string;
    imageUrl?: string;
    slug: string;
  };
}

export default function WishlistDropdown() {
  const { language, t } = useLanguage();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    // Mock data - replace with actual wishlist data
    {
      id: "1",
      productId: "prod1",
      product: {
        nameUz: "Polietilen paket",
        nameRu: "Полиэтиленовый пакет",
        price: "15000",
        imageUrl: "https://via.placeholder.com/80x80",
        slug: "polietilen-paket"
      }
    }
  ]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistItems.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {wishlistItems.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Sevimlilar</h3>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Sevimli mahsulotlar yo'q</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto">
              {wishlistItems.map((item) => {
                const productName = language === "uz" ? item.product.nameUz : item.product.nameRu;
                const price = parseFloat(item.product.price);
                
                return (
                  <DropdownMenuItem key={item.id} className="p-0">
                    <div className="flex items-center gap-3 p-3 w-full">
                      <img
                        src={item.product.imageUrl || "https://via.placeholder.com/60x60"}
                        alt={productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.slug}`}>
                          <h4 className="font-medium text-sm line-clamp-2 hover:text-primary cursor-pointer">
                            {productName}
                          </h4>
                        </Link>
                        <p className="text-primary font-semibold text-sm">
                          {price.toLocaleString()} сум
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                        >
                          <ShoppingCart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="p-3">
              <Link href="/wishlist">
                <Button className="w-full" size="sm">
                  Barcha sevimlilarni ko'rish
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}