import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Home, Heart, User, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const { cartItems } = useCart();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Bosh sahifa",
      labelRu: "Главная",
      active: location === "/"
    },
    {
      href: "/catalog",
      icon: Search,
      label: "Katalog",
      labelRu: "Каталог",
      active: location.startsWith("/catalog")
    },
    {
      href: "/cart",
      icon: ShoppingCart,
      label: "Savat",
      labelRu: "Корзина",
      active: location === "/cart",
      badge: cartItems?.length || 0
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: "Saralangan",
      labelRu: "Избранное",
      active: location === "/wishlist"
    },
    {
      href: "/profile",
      icon: User,
      label: "Kabinet",
      labelRu: "Кабинет",
      active: location.startsWith("/profile")
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-pb md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center px-3 py-2 relative transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}>
                <div className="relative">
                  <Icon className={cn(
                    "w-6 h-6 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  
                  {/* Badge for cart */}
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </div>
                
                <span className={cn(
                  "text-xs mt-1 font-medium transition-all duration-200",
                  isActive && "text-primary scale-105"
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}