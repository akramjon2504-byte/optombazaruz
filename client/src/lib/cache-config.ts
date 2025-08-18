// Advanced caching configuration for performance optimization
export const cacheConfig = {
  // Product queries cache for 5 minutes
  products: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Categories rarely change, cache for 30 minutes
  categories: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  },
  
  // Blog posts cache for 10 minutes
  blog: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // User data cache for 1 minute (frequent updates)
  user: {
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Cart data needs fresh data
  cart: {
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 2 * 60 * 1000, // 2 minutes
  }
};

// Cache invalidation strategies
export const cacheKeys = {
  products: (filters?: Record<string, any>) => 
    filters ? ['products', filters] : ['products'],
  categories: () => ['categories'],
  blog: (limit?: number) => 
    limit ? ['blog', { limit }] : ['blog'],
  user: () => ['user'],
  cart: () => ['cart'],
  productDetails: (slug: string) => ['product', slug],
};

// Prefetch strategies for better performance
export const prefetchStrategies = {
  // Prefetch popular categories on home page load
  homePagePrefetch: [
    { queryKey: cacheKeys.categories(), staleTime: cacheConfig.categories.staleTime },
    { queryKey: cacheKeys.products({ isHit: true }), staleTime: cacheConfig.products.staleTime },
    { queryKey: cacheKeys.products({ isPromo: true }), staleTime: cacheConfig.products.staleTime },
  ],
  
  // Prefetch related products when viewing a product
  productPagePrefetch: (categoryId: string) => [
    { queryKey: cacheKeys.products({ categoryId }), staleTime: cacheConfig.products.staleTime },
  ],
};