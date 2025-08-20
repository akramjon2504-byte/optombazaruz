import { toast } from "@/hooks/use-toast";
import { getTranslation } from "@shared/languages";
import type { Language } from "@shared/languages";

// Get current language from localStorage or default to 'uz'
function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'uz';
  }
  return 'uz';
}

// Notification helper functions with language support
export const notifications = {
  cartItemAdded: (productName?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('cartItemAdded', lang);
    const description = productName ? `${productName}` : undefined;
    
    toast({
      title,
      description,
      variant: "success" as any,
      duration: 3000,
    });
  },

  wishlistItemAdded: (productName?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('wishlistItemAdded', lang);
    const description = productName ? `${productName}` : undefined;
    
    toast({
      title,
      description,
      variant: "success" as any,
      duration: 3000,
    });
  },

  orderCreated: (orderNumber?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('orderCreated', lang);
    const description = orderNumber ? `#${orderNumber}` : undefined;
    
    toast({
      title,
      description,
      variant: "success" as any,
      duration: 4000,
    });
  },

  paymentProcessed: () => {
    const lang = getCurrentLanguage();
    const title = getTranslation('paymentProcessed', lang);
    
    toast({
      title,
      variant: "success" as any,
      duration: 3000,
    });
  },

  errorOccurred: (message?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('errorOccurred', lang);
    
    toast({
      title,
      description: message,
      variant: "destructive",
      duration: 4000,
    });
  },

  operationSuccessful: (message?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('operationSuccessful', lang);
    
    toast({
      title,
      description: message,
      variant: "success" as any,
      duration: 3000,
    });
  },

  newProductAdded: (productName?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('newProductAdded', lang);
    const checkItOut = getTranslation('checkItOut', lang);
    
    toast({
      title,
      description: productName ? `${productName} - ${checkItOut}` : checkItOut,
      variant: "info" as any,
      duration: 5000,
    });
  },

  newBlogPostAdded: (postTitle?: string) => {
    const lang = getCurrentLanguage();
    const title = getTranslation('newBlogPostAdded', lang);
    const checkItOut = getTranslation('checkItOut', lang);
    
    toast({
      title,
      description: postTitle ? `${postTitle} - ${checkItOut}` : checkItOut,
      variant: "info" as any,
      duration: 5000,
    });
  },

  // Custom notification with language support
  custom: (titleKey: keyof typeof import('@shared/languages').translations, description?: string, variant: 'default' | 'destructive' | 'success' | 'warning' | 'info' = 'default') => {
    const lang = getCurrentLanguage();
    const title = getTranslation(titleKey, lang);
    
    toast({
      title,
      description,
      variant: variant as any,
      duration: 3000,
    });
  }
};