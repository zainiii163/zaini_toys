import type { PaymentMethod, PaymentStatus } from './order';

export interface PaymentSession {
  _id: string;
  order: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  gatewayTransactionId?: string;
  gatewayUrl?: string;
  qrCode?: string;
  qrImage?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
