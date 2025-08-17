import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/use-cart";
import { Search, Heart, ShoppingCart, Phone, Mail, User, UserPlus } from "lucide-react";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { cartCount, cartTotal } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to catalog with search query
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {t("phone")}
            </span>
            <span className="text-gray-600 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {t("email")}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLanguage("uz")}
                className={`px-2 py-1 font-semibold transition-colors ${
                  language === "uz"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                data-testid="button-language-uz"
              >
                UZ
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setLanguage("ru")}
                className={`px-2 py-1 font-semibold transition-colors ${
                  language === "ru"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                data-testid="button-language-ru"
              >
                RU
              </button>
            </div>
            <span className="text-gray-600 flex items-center cursor-pointer hover:text-primary transition-colors">
              <User className="w-4 h-4 mr-1" />
              {t("login")}
            </span>
            <span className="text-gray-600 flex items-center cursor-pointer hover:text-primary transition-colors">
              <UserPlus className="w-4 h-4 mr-1" />
              {t("register")}
            </span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer" data-testid="link-home">
              <div className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-2xl">
                OB
              </div>
              <div className="ml-3">
                <h1 className="font-bold text-2xl text-gray-900">OptomBazar</h1>
                <p className="text-sm text-gray-600">Оптовый рынок Узбекистана</p>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12"
                data-testid="input-search"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                data-testid="button-search"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Cart and actions */}
          <div className="flex items-center space-x-6">
            <button
              className="relative hover:text-primary transition-colors"
              data-testid="button-wishlist"
            >
              <Heart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-discount text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            
            <Link href="/cart">
              <button
                className="relative hover:text-primary transition-colors"
                data-testid="button-cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">{t("cart")}:</p>
              <p className="font-bold text-lg" data-testid="text-cart-total">
                {parseFloat(cartTotal).toLocaleString()} сум
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
