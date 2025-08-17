import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    nameUz: string;
    nameRu: string;
    price: string;
    images: string[];
  };
}

export function useCart() {
  const queryClient = useQueryClient();

  const cartQuery = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      return await apiRequest("/api/cart", "POST", { productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return await apiRequest(`/api/cart/${id}`, "PUT", { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/cart/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const cartTotal = cartQuery.data?.reduce(
    (total, item) => total + parseFloat(item.product.price) * item.quantity,
    0
  ) || 0;

  const cartCount = cartQuery.data?.reduce((count, item) => count + item.quantity, 0) || 0;

  return {
    cartItems: cartQuery.data || [],
    cartTotal: cartTotal.toFixed(2),
    cartCount,
    isLoading: cartQuery.isLoading,
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateCartItemMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
  };
}
