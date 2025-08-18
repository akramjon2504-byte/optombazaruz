import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/use-performance";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
}

interface SearchFilters {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

export default function AdvancedSearch({ onSearch, initialFilters = {} }: AdvancedSearchProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Debounce search for performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters.query || "",
    category: initialFilters.category || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    sortBy: initialFilters.sortBy || "name"
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Real-time search suggestions with debouncing
  useEffect(() => {
    if (debouncedSearchQuery.length > 1) {
      // Simulate API call for suggestions
      const mockSuggestions = [
        "Polietilen paketlar",
        "Plastik idishlar", 
        "Elektron texnika",
        "Kiyim-kechak",
        "Uy jihozlari",
        "Bir martalik idish",
        "Plastik qoplar",
        "Telefon aksessuarlari",
        "Kompyuter texnikasi"
      ].filter(item => 
        item.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSuggestions(mockSuggestions.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const searchFilters = { ...filters, query: searchQuery };
    onSearch(searchFilters);
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Auto-search when filters change
    setTimeout(() => {
      onSearch({ ...newFilters, query: searchQuery });
    }, 500);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name"
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    onSearch(clearedFilters);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setFilters({ ...filters, query: suggestion });
    onSearch({ ...filters, query: suggestion });
    setShowSuggestions(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== "name").length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main search bar */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="search-input pl-10 pr-32 py-4 text-lg rounded-full border-2"
            data-testid="input-search"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
              data-testid="button-filters"
            >
              <Filter className="h-4 w-4 mr-1" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
            <Button 
              onClick={handleSearch}
              className="rounded-full px-6"
              data-testid="button-search"
            >
              Qidirish
            </Button>
          </div>
        </div>

        {/* Search suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
            <CardContent className="p-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                  data-testid={`suggestion-${index}`}
                >
                  <Search className="inline h-4 w-4 mr-2 text-gray-400" />
                  {suggestion}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced filters */}
      {isOpen && (
        <Card className="animate-scaleIn">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Kategoriya</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="select-category"
                >
                  <option value="">Barcha kategoriyalar</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {language === "uz" ? category.nameUz : category.nameRu}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div>
                <label className="block text-sm font-medium mb-2">Min narx</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-full"
                  data-testid="input-min-price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max narx</label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-full"
                  data-testid="input-max-price"
                />
              </div>

              {/* Sort options */}
              <div>
                <label className="block text-sm font-medium mb-2">Saralash</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  data-testid="select-sort"
                >
                  <option value="name">Nom bo'yicha</option>
                  <option value="price_asc">Narx (arzon)</option>
                  <option value="price_desc">Narx (qimmat)</option>
                  <option value="rating">Reyting bo'yicha</option>
                  <option value="newest">Eng yangi</option>
                </select>
              </div>
            </div>

            {/* Active filters display */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {filters.category && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Kategoriya
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFilterChange("category", "")}
                        />
                      </Badge>
                    )}
                    {filters.minPrice && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Min: {filters.minPrice}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFilterChange("minPrice", "")}
                        />
                      </Badge>
                    )}
                    {filters.maxPrice && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Max: {filters.maxPrice}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleFilterChange("maxPrice", "")}
                        />
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    data-testid="button-clear-filters"
                  >
                    Tozalash
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}