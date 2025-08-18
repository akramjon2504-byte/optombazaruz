import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Check, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  price: string;
  originalPrice?: string | null;
  imageUrl?: string | null;
  rating: string;
  reviewCount: number;
  stock: number;
  features: Record<string, string>;
}

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

export default function ProductComparison({ 
  products, 
  onRemoveProduct, 
  onClearAll 
}: ProductComparisonProps) {
  const { language, t } = useLanguage();

  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Taqqoslash uchun mahsulotlar yo'q</h3>
          <p className="text-gray-600">Mahsulotlarni taqqoslash uchun kartochkalardan "Taqqoslash" tugmasini bosing</p>
        </CardContent>
      </Card>
    );
  }

  const allFeatures = new Set<string>();
  products.forEach(product => {
    Object.keys(product.features || {}).forEach(feature => allFeatures.add(feature));
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mahsulotlar taqqoslash</h2>
        <Button variant="outline" onClick={onClearAll}>
          Hammasini tozalash
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-w-max">
          {products.map((product) => {
            const productName = language === "uz" ? product.nameUz : product.nameRu;
            const price = parseFloat(product.price);
            const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;

            return (
              <Card key={product.id} className="relative min-w-80">
                <CardHeader className="pb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/200x150"}
                    alt={productName}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  
                  <CardTitle className="text-lg leading-tight pr-8">
                    {productName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price */}
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {price.toLocaleString()} сум
                    </div>
                    {originalPrice && originalPrice > price && (
                      <div className="text-sm text-gray-500 line-through">
                        {originalPrice.toLocaleString()} сум
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(parseFloat(product.rating))
                              ? "fill-current"
                              : "fill-none"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Stock status */}
                  <div>
                    {product.stock > 0 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Mavjud ({product.stock} dona)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <Minus className="w-3 h-3 mr-1" />
                        Mavjud emas
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Xususiyatlari:</h4>
                    {Array.from(allFeatures).map(feature => (
                      <div key={feature} className="flex justify-between text-sm">
                        <span className="text-gray-600">{feature}:</span>
                        <span className="font-medium">
                          {product.features?.[feature] || "-"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full">
                    Xarid qilish
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}