import { storage } from "../storage";
import { randomUUID } from "crypto";
import type { InsertOrder, InsertPayment } from "@shared/schema";

export interface PaymentMethod {
  id: string;
  name: string;
  nameUz: string;
  nameRu: string;
  description: string;
  isActive: boolean;
  processingFee?: number;
}

// Uzbekistan payment methods
export const paymentMethods: PaymentMethod[] = [
  {
    id: "qr_card",
    name: "QR Card",
    nameUz: "QR Karta",
    nameRu: "QR Карта",
    description: "Pay with Uzbekistan QR cards (Humo, Uzcard)",
    isActive: true,
    processingFee: 0
  },
  {
    id: "cash_delivery",
    name: "Cash on Delivery",
    nameUz: "Yetkazib berishda naqd pul",
    nameRu: "Наличными при доставке",
    description: "Pay cash when your order is delivered",
    isActive: true,
    processingFee: 0
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    nameUz: "Bank o'tkazmasi",
    nameRu: "Банковский перевод",
    description: "Direct bank transfer to our account",
    isActive: true,
    processingFee: 0
  }
];

export interface OrderData {
  userId?: string;
  sessionId: string;
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    region: string;
    city: string;
    address: string;
    postalCode?: string;
  };
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  notes?: string;
}

export class PaymentService {
  static generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `OPT${year}${month}${day}${random}`;
  }

  static calculateTotal(items: OrderData['items']): number {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }

  static async createOrder(orderData: OrderData): Promise<string> {
    const orderNumber = this.generateOrderNumber();
    const totalAmount = this.calculateTotal(orderData.items);

    const order: InsertOrder = {
      userId: orderData.userId,
      sessionId: orderData.sessionId,
      paymentMethod: orderData.paymentMethod,
      totalAmount: totalAmount.toString(),
      shippingAddress: orderData.shippingAddress,
      customerInfo: orderData.customerInfo,
      items: orderData.items,
      notes: orderData.notes || null
    };

    const createdOrder = await storage.createOrder(order);
    
    // Create initial payment record
    const payment: InsertPayment = {
      orderId: createdOrder.id,
      paymentMethod: orderData.paymentMethod,
      amount: totalAmount.toString()
    };

    await storage.createPayment(payment);
    
    return createdOrder.id;
  }

  static async processQRCardPayment(orderId: string, cardNumber: string): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with Uzbekistan payment gateways
      // like UzCard, Humo, or Click
      
      // Simulate QR card validation
      if (!this.validateQRCardNumber(cardNumber)) {
        throw new Error("Invalid QR card number");
      }

      // Update payment status
      await storage.updatePaymentStatus(orderId, "completed", {
        qrCardNumber: cardNumber,
        transactionId: `TXN_${randomUUID()}`,
        processedAt: new Date()
      });

      await storage.updateOrderStatus(orderId, "confirmed");
      
      return true;
    } catch (error) {
      await storage.updatePaymentStatus(orderId, "failed");
      throw error;
    }
  }

  static validateQRCardNumber(cardNumber: string): boolean {
    // Basic validation for Uzbekistan card numbers
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    
    // UzCard: starts with 8600, 16 digits
    // Humo: starts with 9860, 16 digits
    const uzCardPattern = /^8600\d{12}$/;
    const humoPattern = /^9860\d{12}$/;
    
    return uzCardPattern.test(cleanNumber) || humoPattern.test(cleanNumber);
  }

  static async getBankTransferDetails() {
    return {
      bankName: "Xalq Bank",
      accountNumber: "20214000600123456789",
      accountName: "OptomBazar LLC",
      swift: "POPLUZ22",
      inn: "123456789",
      mfo: "00445"
    };
  }

  static getPaymentMethods(): PaymentMethod[] {
    return paymentMethods.filter(method => method.isActive);
  }
}