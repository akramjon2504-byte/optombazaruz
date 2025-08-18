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
      processing: "Jarayon..."
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
      processing: "Обработка..."
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
      toast({
        title: "Muvaffaqiyat",
        description: "Mahsulot savatdan olib tashlandi",
      });
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
    },
    onError: () => {
      toast({
        title: "Xato",
        description: "Buyurtma yaratishda xatolik yuz berdi",
        variant: "destructive"
      });
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

  const handlePaymentSuccess = () => {
    // Clear cart and show success
    queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    setShowPayment(false);
    toast({
      title: "Muvaffaqiyat!",
      description: "Buyurtmangiz qabul qilindi",
    });
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
                        
                        <span className="w-12 text-center font-medium" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        
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
                      {calculateTotal().toLocaleString()} {t.sum}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => checkoutMutation.mutate()}
                    disabled={checkoutMutation.isPending}
                    data-testid="button-checkout"
                  >
                    {checkoutMutation.isPending ? t.processing : t.checkout}
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