import type { Address } from './user';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refund_requested'
  | 'refunded'
  | 'failed';

export type PaymentMethod = 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'raast';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';

export type ShippingMethod = 'standard' | 'express' | 'same_day';

export interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  variant?: string;
  variantName?: string;
  sku: string;
  quantity: number;
  price: number;
  salePrice?: number;
  total: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface GiftDetails {
  isGift: boolean;
  giftMessage?: string;
  giftWrapping: boolean;
  recipientName?: string;
  recipientAddress?: Address;
}

export interface Order {
  _id: string;
  orderNumber: string;

  customer: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  isGuestOrder: boolean;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingCost: number;
  tax: number;
  total: number;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed: number;

  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  estimatedDelivery: string;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentDetails?: Record<string, unknown>;

  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];

  trackingNumber?: string;
  courierService?: string;
  deliveredAt?: string;

  returnReason?: string;
  returnImages?: { url: string; publicId: string }[];
  refundAmount?: number;
  refundDate?: string;
  refundTransactionId?: string;

  isGift: boolean;
  giftMessage?: string;
  giftWrapping: boolean;
  recipientName?: string;
  recipientAddress?: Address;

  cancelReason?: string;
  cancelledAt?: string;

  customerNotes?: string;
  adminNotes?: string;

  riskScore: number;
  ipAddress: string;
  userAgent: string;

  createdAt: string;
  updatedAt: string;
}
