import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Navigation() {
  const { t } = useLanguage();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-3">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded transition-colors"
            data-testid="button-categories"
          >
            {isCategoriesOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span>{t("categories")}</span>
          </button>
          
          <Link href="/promotions">
            <span className="hover:text-blue-200 transition-colors cursor-pointer" data-testid="link-promotions">
              {t("promotions")}
            </span>
          </Link>
          
          <Link href="/catalog?isHit=true">
            <span className="hover:text-blue-200 transition-colors cursor-pointer" data-testid="link-hit-products">
              {t("hitProducts")}
            </span>
          </Link>
          
          <Link href="/catalog?newest=true">
            <span className="hover:text-blue-200 transition-colors cursor-pointer" data-testid="link-new-products">
              {t("newProducts")}
            </span>
          </Link>
          
          <Link href="/blog">
            <span className="hover:text-blue-200 transition-colors cursor-pointer" data-testid="link-blog">
              {t("blog")}
            </span>
          </Link>
          
          <Link href="/contact">
            <span className="hover:text-blue-200 transition-colors cursor-pointer" data-testid="link-contact">
              {t("contact")}
            </span>
          </Link>
        </div>

        {/* Categories dropdown */}
        {isCategoriesOpen && (
          <div className="absolute left-0 right-0 bg-white text-gray-900 shadow-lg z-40 border-t">
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Link href="/catalog?category=polietilen-paketlar">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded cursor-pointer" data-testid="link-category-bags">
                    <i className="fas fa-shopping-bag text-primary text-xl"></i>
                    <div>
                      <div className="font-semibold">Polietilen paketlar</div>
                      <div className="text-sm text-gray-500">500+ mahsulot</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/catalog?category=bir-martalik-idishlar">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded cursor-pointer" data-testid="link-category-dishes">
                    <i className="fas fa-utensils text-secondary text-xl"></i>
                    <div>
                      <div className="font-semibold">Bir martalik idishlar</div>
                      <div className="text-sm text-gray-500">300+ mahsulot</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/catalog?category=uy-buyumlari">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded cursor-pointer" data-testid="link-category-home">
                    <i className="fas fa-home text-accent text-xl"></i>
                    <div>
                      <div className="font-semibold">Uy buyumlari</div>
                      <div className="text-sm text-gray-500">250+ mahsulot</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/catalog?category=elektronika">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded cursor-pointer" data-testid="link-category-electronics">
                    <i className="fas fa-laptop text-purple-600 text-xl"></i>
                    <div>
                      <div className="font-semibold">Elektronika</div>
                      <div className="text-sm text-gray-500">150+ mahsulot</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/catalog?category=kiyim-kechak">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded cursor-pointer" data-testid="link-category-clothing">
                    <i className="fas fa-tshirt text-pink-600 text-xl"></i>
                    <div>
                      <div className="font-semibold">Kiyim-kechak</div>
                      <div className="text-sm text-gray-500">200+ mahsulot</div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/catalog?category=kimyoviy-vositalar">
                  <div className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded cursor-pointer" data-testid="link-category-chemicals">
                    <i className="fas fa-spray-can text-gray-600 text-xl"></i>
                    <div>
                      <div className="font-semibold">Kimyoviy vositalar</div>
                      <div className="text-sm text-gray-500">100+ mahsulot</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
