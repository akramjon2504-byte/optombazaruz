import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PaymentOptions } from "@/components/PaymentOptions";
import { notifications } from "@/lib/toast-helpers";

interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    nameUz: string;
    nameRu: string;
    price: number;
    imageUrl: string | null;
  };
  quantity: number;
  sessionId: string;
}

export default function Cart() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState("");

  const content = {
    uz: {
      title: "Savat",
      empty: "Savatingiz bo'sh",
      emptyDescription: "Mahsulotlarni qo'shib xarid qilishni boshlang",
      continueShopping: "Xaridni davom ettirish",
      quantity: "Miqdori",
      price: "Narxi",
      total: "Jami",
      sum: "so'm",
      removeItem: "O'chirish",
      updateQuantity: "Miqdorni yangilash",
      checkout: "To'lovga o'tish",
      processing: "Jarayon...",
      minOrderAmount: "Minimal buyurtma miqdori",
      minOrderRequired: "Optom xarid uchun minimal 500,000 so'm buyurtma kerak",
      currentAmount: "Joriy miqdor",
      addMore: "Yana qo'shing",
      toReachMinimum: "minimal miqdorga yetish uchun"
    },
    ru: {
      title: "Корзина", 
      empty: "Ваша корзина пуста",
      emptyDescription: "Добавьте товары, чтобы начать покупки",
      continueShopping: "Продолжить покупки",
      quantity: "Количество",
      price: "Цена", 
      total: "Итого",
      sum: "сум",
      removeItem: "Удалить",
      updateQuantity: "Обновить количество",
      checkout: "Оформить заказ",
      processing: "Обработка...",
      minOrderAmount: "Минимальная сумма заказа",
      minOrderRequired: "Для оптовой покупки требуется минимум 500,000 сум",
      currentAmount: "Текущая сумма",
      addMore: "Добавьте еще",
      toReachMinimum: "до минимальной суммы"
    }
  };

  const t = content[language];

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => apiRequest(`/api/cart/${itemId}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      notifications.operationSuccessful(t.removeItem);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      apiRequest(`/api/cart/${itemId}`, "PUT", { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/orders", "POST", {
      items: cartItems.map((item: CartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      paymentMethod: "cash_delivery", // Default to cash on delivery
      totalAmount: calculateTotal(),
      shippingAddress: {
        fullName: "Mijoz",
        phone: "+998",
        address: "Yetkazish manzili",
        city: "Toshkent"
      },
      customerInfo: {
        name: "Mijoz",
        phone: "+998",
        email: "mijoz@example.com"
      }
    }),
    onSuccess: (data: any) => {
      setOrderId(data.orderId);
      setShowPayment(true);
      notifications.orderCreated(data.orderId);
    },
    onError: (error: any) => {
      // Handle minimum order amount error specifically
      if (error.response?.data?.error === 'MINIMUM_ORDER_NOT_REACHED') {
        const errorData = error.response.data;
        const message = language === 'uz' ? errorData.messageUz : errorData.messageRu;
        notifications.errorOccurred(message);
      } else {
        notifications.errorOccurred(language === 'uz' ? 'Buyurtma yaratishda xatolik yuz berdi' : 'Ошибка при создании заказа');
      }
    }
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemMutation.mutate(itemId);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: CartItem) => 
      total + (parseFloat(item.product.price.toString()) * item.quantity), 0
    );
  };

  // Wholesale minimum order amount (500,000 som)
  const MINIMUM_ORDER_AMOUNT = 500000;
  const currentTotal = calculateTotal();
  const remainingAmount = Math.max(0, MINIMUM_ORDER_AMOUNT - currentTotal);
  const canCheckout = currentTotal >= MINIMUM_ORDER_AMOUNT;

  // Debug logging
  console.log('Cart Debug:', {
    cartItemsLength: cartItems.length,
    currentTotal,
    MINIMUM_ORDER_AMOUNT,
    remainingAmount,
    canCheckout,
    shouldShowWarning: !canCheckout && cartItems.length > 0
  });

  const handlePaymentSuccess = () => {
    // Clear cart and show success
    queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    setShowPayment(false);
    notifications.paymentProcessed();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PaymentOptions 
          orderId={orderId}
          totalAmount={calculateTotal().toLocaleString()}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t.empty}</h2>
              <p className="text-muted-foreground mb-6">{t.emptyDescription}</p>
              <Button onClick={() => window.location.href = "/catalog"}>
                {t.continueShopping}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: CartItem) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.product.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={language === 'uz' ? item.product.nameUz : item.product.nameRu}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {language === 'uz' ? item.product.nameUz : item.product.nameRu}
                        </h3>
                        <p className="text-lg font-bold">
                          {parseFloat(item.product.price.toString()).toLocaleString()} {t.sum}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
                            handleQuantityChange(item.id, newQuantity);
                          }}
                          className="w-16 text-center"
                          data-testid={`input-quantity-${item.id}`}
                        />
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveItem(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t.total}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item: CartItem) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {language === 'uz' ? item.product.nameUz : item.product.nameRu}</span>
                        <span>{(parseFloat(item.product.price.toString()) * item.quantity).toLocaleString()} {t.sum}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t.total}:</span>
                    <span data-testid="text-total-amount">
                      {currentTotal.toLocaleString()} {t.sum}
                    </span>
                  </div>

                  {/* Minimum Order Warning */}
                  {!canCheckout && cartItems.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">
                          {t.minOrderAmount}:
                        </span>
                        <span className="font-bold text-yellow-800 dark:text-yellow-200">
                          {MINIMUM_ORDER_AMOUNT.toLocaleString()} {t.sum}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-700 dark:text-yellow-300">
                          {t.currentAmount}:
                        </span>
                        <span className="font-medium text-yellow-700 dark:text-yellow-300">
                          {currentTotal.toLocaleString()} {t.sum}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-700 dark:text-yellow-300">
                          {t.addMore}:
                        </span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {remainingAmount.toLocaleString()} {t.sum}
                        </span>
                      </div>
                      
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 text-center">
                        {t.minOrderRequired}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (currentTotal / MINIMUM_ORDER_AMOUNT) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center text-yellow-600 dark:text-yellow-400">
                        {Math.round((currentTotal / MINIMUM_ORDER_AMOUNT) * 100)}% {t.toReachMinimum}
                      </p>
                    </div>
                  )}

                  {/* Success indicator when minimum is reached */}
                  {canCheckout && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                      <p className="text-sm text-green-700 dark:text-green-300 text-center font-medium">
                        ✅ {language === 'uz' ? 'Minimal miqdor bajarildi!' : 'Минимальная сумма достигнута!'}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => checkoutMutation.mutate()}
                    disabled={checkoutMutation.isPending || !canCheckout}
                    data-testid="button-checkout"
                    variant={canCheckout ? "default" : "secondary"}
                  >
                    {checkoutMutation.isPending ? t.processing : 
                     canCheckout ? t.checkout : 
                     (language === 'uz' ? `Yana ${remainingAmount.toLocaleString()} ${t.sum} qo'shing` : 
                      `Добавьте еще ${remainingAmount.toLocaleString()} ${t.sum}`)}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}