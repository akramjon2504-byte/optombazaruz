import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import ChatWidget from "@/components/ai/chat-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X } from "lucide-react";

interface CatalogProps {
  filters?: {
    isHit?: boolean;
    isPromo?: boolean;
    categoryId?: string;
  };
}

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
}

export default function Catalog({ filters: propFilters }: CatalogProps) {
  const { language, t } = useLanguage();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const filters: Record<string, any> = {};

    if (urlParams.get('search')) {
      setSearchQuery(urlParams.get('search') || '');
      filters.search = urlParams.get('search');
    }

    if (urlParams.get('category')) {
      const categorySlug = urlParams.get('category');
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.id);
        filters.categoryId = category.id;
      }
    }

    if (urlParams.get('isHit') === 'true') {
      filters.isHit = true;
    }

    if (urlParams.get('isPromo') === 'true') {
      filters.isPromo = true;
    }

    // Merge with prop filters
    if (propFilters) {
      Object.assign(filters, propFilters);
    }

    setActiveFilters(filters);
  }, [location, categories, propFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveFilters(prev => ({ ...prev, search: searchQuery.trim() }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setActiveFilters(prev => ({ ...prev, categoryId }));
    } else {
      const { categoryId: _, ...rest } = activeFilters;
      setActiveFilters(rest);
    }
  };

  const removeFilter = (key: string) => {
    const { [key]: _, ...rest } = activeFilters;
    setActiveFilters(rest);
    
    if (key === 'categoryId') {
      setSelectedCategory('');
    }
    if (key === 'search') {
      setSearchQuery('');
    }
  };

  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case 'search':
        return `Qidiruv: "${value}"`;
      case 'categoryId':
        const category = categories.find(c => c.id === value);
        return category ? (language === 'uz' ? category.nameUz : category.nameRu) : '';
      case 'isHit':
        return 'Hit mahsulotlar';
      case 'isPromo':
        return 'Aksiyalar';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="font-bold text-xl mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtrlar
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Qidirish</label>
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                    data-testid="input-catalog-search"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1 h-8"
                    data-testid="button-catalog-search"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Kategoriya</label>
                <Select value={selectedCategory || 'all'} onValueChange={(value) => handleCategoryChange(value === 'all' ? '' : value)}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {language === 'uz' ? category.nameUz : category.nameRu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Saralash</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Eng yangi</SelectItem>
                    <SelectItem value="price-low">Narx: past dan yuqori</SelectItem>
                    <SelectItem value="price-high">Narx: yuqori dan past</SelectItem>
                    <SelectItem value="rating">Reyting bo'yicha</SelectItem>
                    <SelectItem value="popular">Mashhur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filters */}
              <div className="space-y-3">
                <Button
                  variant={activeFilters.isHit ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    if (activeFilters.isHit) {
                      removeFilter('isHit');
                    } else {
                      setActiveFilters(prev => ({ ...prev, isHit: true }));
                    }
                  }}
                  data-testid="button-filter-hit"
                >
                  🏆 Hit mahsulotlar
                </Button>
                
                <Button
                  variant={activeFilters.isPromo ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    if (activeFilters.isPromo) {
                      removeFilter('isPromo');
                    } else {
                      setActiveFilters(prev => ({ ...prev, isPromo: true }));
                    }
                  }}
                  data-testid="button-filter-promo"
                >
                  🔥 Aksiyalar
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Active Filters */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 mr-2">Faol filtrlar:</span>
                  {Object.entries(activeFilters).map(([key, value]) => (
                    <Badge
                      key={key}
                      variant="secondary"
                      className="flex items-center gap-1"
                      data-testid={`badge-filter-${key}`}
                    >
                      {getFilterLabel(key, value)}
                      <button
                        onClick={() => removeFilter(key)}
                        className="ml-1 hover:text-red-500"
                        data-testid={`button-remove-filter-${key}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold" data-testid="text-catalog-title">
                Mahsulotlar katalogi
              </h1>
            </div>

            {/* Products Grid */}
            <ProductGrid filters={activeFilters} />
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
