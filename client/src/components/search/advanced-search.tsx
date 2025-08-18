import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  isHit: boolean;
  isPromo: boolean;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
  sortOrder: 'asc' | 'desc';
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: '',
  minPrice: 0,
  maxPrice: 10000000,
  inStock: true,
  isHit: false,
  isPromo: false,
  sortBy: 'name',
  sortOrder: 'asc'
};

export default function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch products for suggestions
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  // Generate search suggestions
  useEffect(() => {
    if (filters.query.length > 1 && products) {
      const searchTerm = filters.query.toLowerCase();
      const productSuggestions = products
        .filter((product: any) => {
          const name = language === 'uz' ? product.nameUz : product.nameRu;
          return name.toLowerCase().includes(searchTerm);
        })
        .slice(0, 5)
        .map((product: any) => language === 'uz' ? product.nameUz : product.nameRu);
      
      setSuggestions([...new Set(productSuggestions)]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [filters.query, products, language]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [filters, onSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className={cn("w-full", className)} ref={searchRef}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="pl-10 pr-4 py-3 text-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 dark:bg-gray-800 dark:border-gray-600">
                <CardContent className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                      onClick={() => {
                        handleFilterChange('query', suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          <Button
            variant={showFilters ? "default" : "outline"}
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 dark:border-gray-600"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {t('filter')}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                !
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mt-4 dark:bg-gray-800 dark:border-gray-600">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg dark:text-white">{t('advancedFilters')}</CardTitle>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="dark:border-gray-600">
                    <X className="h-3 w-3 mr-1" />
                    {t('clearFilters')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-200">
                {t('category')}
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder={t('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allCategories')}</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {language === 'uz' ? category.nameUz : category.nameRu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block dark:text-gray-200">
                {t('priceRange')}: {filters.minPrice.toLocaleString()} - {filters.maxPrice.toLocaleString()} so'm
              </label>
              <div className="px-3">
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => {
                    handleFilterChange('minPrice', min);
                    handleFilterChange('maxPrice', max);
                  }}
                  max={10000000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
              </div>
            </div>

            <Separator className="dark:bg-gray-600" />

            {/* Quick Filters */}
            <div>
              <label className="text-sm font-medium mb-3 block dark:text-gray-200">
                {t('quickFilters')}
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.inStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('inStock', !filters.inStock)}
                  className="dark:border-gray-600"
                >
                  {t('inStock')}
                </Button>
                <Button
                  variant={filters.isHit ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('isHit', !filters.isHit)}
                  className="dark:border-gray-600"
                >
                  {t('hitProducts')}
                </Button>
                <Button
                  variant={filters.isPromo ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange('isPromo', !filters.isPromo)}
                  className="dark:border-gray-600"
                >
                  {t('promotions')}
                </Button>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-200">
                {t('sortBy')}
              </label>
              <div className="flex gap-2">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="flex-1 dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t('name')}</SelectItem>
                    <SelectItem value="price">{t('price')}</SelectItem>
                    <SelectItem value="rating">{t('rating')}</SelectItem>
                    <SelectItem value="newest">{t('newest')}</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger className="w-32 dark:bg-gray-700 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">{t('ascending')}</SelectItem>
                    <SelectItem value="desc">{t('descending')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}