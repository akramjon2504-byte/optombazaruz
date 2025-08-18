import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building, Truck, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PaymentOptionsProps {
  orderId: string;
  totalAmount: string;
  onPaymentSuccess: () => void;
}

export function PaymentOptions({ orderId, totalAmount, onPaymentSuccess }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("qr_card");
  const [qrCardNumber, setQrCardNumber] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    bankName: "",
    accountHolder: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      let endpoint = "";
      let payload: any = { orderId };

      switch (paymentMethod) {
        case "qr_card":
          if (!qrCardNumber.trim()) {
            toast({
              title: "Xato",
              description: "QR kart raqamini kiriting",
              variant: "destructive"
            });
            setIsProcessing(false);
            return;
          }
          endpoint = "/api/payment/qr-card";
          payload = { ...payload, qrCardNumber };
          break;

        case "bank_transfer":
          if (!bankDetails.accountNumber || !bankDetails.bankName) {
            toast({
              title: "Xato", 
              description: "Bank ma'lumotlarini to'liq kiriting",
              variant: "destructive"
            });
            setIsProcessing(false);
            return;
          }
          endpoint = "/api/payment/bank-transfer";
          payload = { ...payload, bankDetails };
          break;

        case "cash_delivery":
          endpoint = "/api/payment/cash-delivery";
          break;
      }

      const response = await apiRequest(endpoint, "POST", payload);
      
      if (response.success) {
        toast({
          title: "Muvaffaqiyat!",
          description: response.message,
        });
        onPaymentSuccess();
      } else {
        toast({
          title: "Xato",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Xato",
        description: "To'lov jarayonida xatolik yuz berdi",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          To'lov usulini tanlang
        </CardTitle>
        <CardDescription>
          Jami summa: <strong>{totalAmount} so'm</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* QR Card Payment */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qr_card" id="qr_card" />
            <Label htmlFor="qr_card" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Kart orqali to'lash
            </Label>
          </div>
          
          {paymentMethod === "qr_card" && (
            <Card className="ml-6">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* QR Code Image */}
                  <div className="text-center">
                    <img 
                      src="/attached_assets/image_1755517749327.png" 
                      alt="QR kod to'lov uchun"
                      className="mx-auto max-w-sm rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      QR kodni skanerlang yoki karta raqamini kiriting
                    </p>
                  </div>
                  
                  {/* Card Information */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">To'lov ma'lumotlari:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Karta raqami:</span>
                        <span className="font-mono font-semibold">5614 6822 1912 1078</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Karta egasi:</span>
                        <span className="font-semibold">Akram Farmonov</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bank:</span>
                        <span>Humo / UzCard</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qrCard">Sizning QR kart raqamingiz (to'lov tasdig'i uchun)</Label>
                    <Input
                      id="qrCard"
                      data-testid="input-qr-card-number"
                      placeholder="9860 **** **** ****"
                    value={qrCardNumber}
                    onChange={(e) => setQrCardNumber(e.target.value)}
                    maxLength={19}
                  />
                    <p className="text-xs text-muted-foreground">
                      Kartaga pul tashlash chekini telegram orqali adminga yuboring
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Bank Transfer */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank_transfer" id="bank_transfer" />
            <Label htmlFor="bank_transfer" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Bank o'tkazmasi
            </Label>
          </div>

          {paymentMethod === "bank_transfer" && (
            <Card className="ml-6">
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Hisob raqami</Label>
                  <Input
                    id="accountNumber"
                    data-testid="input-account-number"
                    placeholder="20208000000000000001"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank nomi</Label>
                  <Input
                    id="bankName"
                    data-testid="input-bank-name"
                    placeholder="Uzcard, Humo, yoki boshqa bank"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({
                      ...bankDetails,
                      bankName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Hisob egasi</Label>
                  <Input
                    id="accountHolder"
                    data-testid="input-account-holder"
                    placeholder="To'liq isim"
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({
                      ...bankDetails,
                      accountHolder: e.target.value
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Cash on Delivery */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash_delivery" id="cash_delivery" />
            <Label htmlFor="cash_delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Yetkazishda to'lash (naqd pul)
            </Label>
          </div>

          {paymentMethod === "cash_delivery" && (
            <Card className="ml-6">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Buyurtmangiz yetkazilganda kuryer orqali naqd pul bilan to'lang. 
                  Qo'shimcha yetkazish haqi: <strong>15,000 so'm</strong>
                </p>
              </CardContent>
            </Card>
          )}
        </RadioGroup>

        <Button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className="w-full"
          size="lg"
          data-testid="button-process-payment"
        >
          {isProcessing ? "Jarayon..." : "To'lovni amalga oshirish"}
        </Button>
      </CardContent>
    </Card>
  );
}