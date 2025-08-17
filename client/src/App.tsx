import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import Blog from "@/pages/blog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={Blog} />
      <Route path="/promotions" component={() => <Catalog filters={{ isPromo: true }} />} />
      <Route path="/contact" component={NotFound} />
      <Route path="/cart" component={NotFound} />
      <Route path="/delivery" component={NotFound} />
      <Route path="/payment" component={NotFound} />
      <Route path="/returns" component={NotFound} />
      <Route path="/help" component={NotFound} />
      <Route path="/privacy" component={NotFound} />
      <Route path="/terms" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
