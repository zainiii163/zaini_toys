import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const cartItemSchema = z.object({
  product: objectId,
  variant: objectId.optional(),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1).max(50),
});

export const createOrderSchema = z.object({
  shippingAddress: addressSchemaForOrder(),
  shippingMethod: z.enum(['standard', 'express', 'same_day']).default('standard'),
  paymentMethod: z.enum(['cod', 'card', 'jazzcash', 'easypaisa', 'raast']),
  couponCode: z.string().optional(),

  isGift: z.boolean().default(false),
  giftMessage: z.string().max(500).optional(),
  giftWrapping: z.boolean().default(false),
  recipientName: z.string().optional(),
  recipientAddress: addressSchemaForOrder().optional(),

  customerNotes: z.string().max(1000).optional(),

  isGuestOrder: z.boolean().default(false),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  guestName: z.string().optional(),

  loyaltyPointsToRedeem: z.number().int().min(0).optional(),

  placeOrderToken: z.string().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(2).max(500),
});

export const returnOrderSchema = z.object({
  reason: z
    .enum(['damaged', 'wrong_product', 'missing_item', 'not_needed', 'other'])
    .default('other'),
  description: z.string().max(1000).optional(),
  orderItemIds: z.array(objectId).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'processing',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'returned',
    'refund_requested',
    'refunded',
    'failed',
  ]),
  note: z.string().max(500).optional(),
  trackingNumber: z.string().optional(),
  courierService: z.string().optional(),
});

function addressSchemaForOrder() {
  return z.object({
    label: z.string().default('Home'),
    fullName: z.string().min(2),
    phone: z.string().min(10),
    address: z.string().min(5),
    city: z.string().min(1),
    area: z.string().optional(),
    postalCode: z.string().optional(),
  });
}
