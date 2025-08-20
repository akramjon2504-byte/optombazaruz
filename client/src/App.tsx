import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebSocketNotifications } from "@/hooks/useWebSocketNotifications";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import Blog from "@/pages/blog";
import Contact from "@/pages/contact";
import Cart from "@/pages/cart";
import Wishlist from "@/pages/wishlist";
import AdminPanel from "@/pages/AdminPanel";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminLogin from "@/pages/admin-login";
import Delivery from "@/pages/delivery";
import Help from "@/pages/help";

function AuthRouter() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  
  // Initialize WebSocket notifications
  useWebSocketNotifications();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/catalog" component={() => <Catalog />} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={Blog} />
      <Route path="/promotions">
        <Catalog filters={{ isPromo: true }} />
      </Route>
      <Route path="/contact" component={Contact} />
      <Route path="/cart" component={Cart} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/delivery" component={Delivery} />
      <Route path="/help" component={Help} />
      
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Protected admin route */}
      <Route path="/admin">
        {isAuthenticated && isAdmin ? <AdminPanel /> : <AdminLogin />}
      </Route>
      
      {/* Placeholder routes */}
      <Route path="/payment" component={NotFound} />
      <Route path="/returns" component={NotFound} />
      <Route path="/privacy" component={NotFound} />
      <Route path="/terms" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <AuthRouter />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
