import { useState } from 'react';
import { X, Plus, Star, Check, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isHit: boolean;
  isPromo: boolean;
  specifications?: { [key: string]: string };
}

interface ProductComparisonProps {
  className?: string;
}

export default function ProductComparison({ className }: ProductComparisonProps) {
  const { t, language } = useLanguage();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Get comparison products from localStorage
  useState(() => {
    const savedCompare = localStorage.getItem('optombazar-compare');
    if (savedCompare) {
      setCompareList(JSON.parse(savedCompare));
    }
  });

  // Fetch products for comparison
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  // Fetch detailed product data for comparison
  const comparisonProducts = products?.filter((product: Product) => 
    compareList.includes(product.id)
  ) || [];

  // Add product to comparison
  const addToComparison = (productId: string) => {
    if (compareList.length >= 4) {
      alert(t('maxCompareLimit') || 'Maksimal 4 ta mahsulotni solishtirish mumkin');
      return;
    }

    const newCompareList = [...compareList, productId];
    setCompareList(newCompareList);
    localStorage.setItem('optombazar-compare', JSON.stringify(newCompareList));
  };

  // Remove product from comparison
  const removeFromComparison = (productId: string) => {
    const newCompareList = compareList.filter(id => id !== productId);
    setCompareList(newCompareList);
    localStorage.setItem('optombazar-compare', JSON.stringify(newCompareList));
  };

  // Clear all comparisons
  const clearComparison = () => {
    setCompareList([]);
    localStorage.removeItem('optombazar-compare');
    setShowComparison(false);
  };

  // Get product specifications for comparison
  const getProductSpecs = (product: Product) => {
    const specs = product.specifications || {};
    
    // Add basic product info as specs
    return {
      [t('price')]: `${product.price.toLocaleString()} so'm`,
      [t('inStock')]: product.inStock ? t('yes') : t('no'),
      [t('rating')]: `${product.rating}/5 (${product.reviewCount} ${t('reviews')})`,
      ...specs
    };
  };

  // Get all unique specification keys
  const getAllSpecKeys = () => {
    const allKeys = new Set<string>();
    comparisonProducts.forEach((product: Product) => {
      Object.keys(getProductSpecs(product)).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys);
  };

  if (compareList.length === 0) {
    return (
      <div className={cn("text-center p-8", className)}>
        <Scale className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          {t('noProductsToCompare')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('addProductsToCompare')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Comparison Bar */}
      {compareList.length > 0 && (
        <Card className="sticky top-4 z-10 dark:bg-gray-800 dark:border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Scale className="h-5 w-5 text-primary" />
                <span className="font-medium dark:text-white">
                  {compareList.length} {t('productsSelected')}
                </span>
                <Badge variant="secondary">
                  {4 - compareList.length} {t('moreAllowed')}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {compareList.length >= 2 && (
                  <Button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-2"
                  >
                    <Scale className="h-4 w-4" />
                    {showComparison ? t('hideComparison') : t('compare')}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={clearComparison}
                  size="sm"
                  className="dark:border-gray-600"
                >
                  {t('clearAll')}
                </Button>
              </div>
            </div>

            {/* Quick preview */}
            {!showComparison && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {comparisonProducts.map((product: Product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 min-w-max"
                  >
                    <img
                      src={product.imageUrl}
                      alt={language === 'uz' ? product.nameUz : product.nameRu}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm dark:text-white">
                      {language === 'uz' ? product.nameUz : product.nameRu}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromComparison(product.id)}
                      className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detailed Comparison */}
      {showComparison && comparisonProducts.length >= 2 && (
        <Card className="dark:bg-gray-800 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Scale className="h-5 w-5" />
              {t('productComparison')}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 border-b dark:border-gray-600 dark:text-white">
                      {t('feature')}
                    </th>
                    {comparisonProducts.map((product: Product) => (
                      <th key={product.id} className="text-center p-4 border-b dark:border-gray-600 min-w-[200px]">
                        <div className="space-y-2">
                          <img
                            src={product.imageUrl}
                            alt={language === 'uz' ? product.nameUz : product.nameRu}
                            className="w-16 h-16 object-cover rounded-lg mx-auto"
                          />
                          <h3 className="font-medium text-sm dark:text-white">
                            {language === 'uz' ? product.nameUz : product.nameRu}
                          </h3>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {product.rating}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromComparison(product.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {getAllSpecKeys().map((specKey, index) => (
                    <tr key={specKey} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/30' : ''}>
                      <td className="p-4 font-medium border-b dark:border-gray-600 dark:text-white">
                        {specKey}
                      </td>
                      {comparisonProducts.map((product: Product) => {
                        const specs = getProductSpecs(product);
                        const value = specs[specKey];
                        
                        return (
                          <td key={product.id} className="p-4 text-center border-b dark:border-gray-600">
                            <span className="dark:text-gray-300">
                              {value || '-'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator className="my-6 dark:bg-gray-600" />

            {/* Action buttons */}
            <div className="flex justify-center gap-4">
              {comparisonProducts.map((product: Product) => (
                <div key={product.id} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {product.price.toLocaleString()} so'm
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through mb-2">
                      {product.originalPrice.toLocaleString()} so'm
                    </div>
                  )}
                  <Button className="w-full mb-2">
                    {t('addToCart')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full dark:border-gray-600">
                    {t('viewDetails')}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook to use product comparison
export function useProductComparison() {
  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('optombazar-compare');
    return saved ? JSON.parse(saved) : [];
  });

  const addToComparison = (productId: string) => {
    if (compareList.length >= 4) return false;
    
    const newList = [...compareList, productId];
    setCompareList(newList);
    localStorage.setItem('optombazar-compare', JSON.stringify(newList));
    return true;
  };

  const removeFromComparison = (productId: string) => {
    const newList = compareList.filter(id => id !== productId);
    setCompareList(newList);
    localStorage.setItem('optombazar-compare', JSON.stringify(newList));
  };

  const isInComparison = (productId: string) => {
    return compareList.includes(productId);
  };

  const clearComparison = () => {
    setCompareList([]);
    localStorage.removeItem('optombazar-compare');
  };

  return {
    compareList,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    canAddMore: compareList.length < 4
  };
}