import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  method: z.enum(['cod', 'card', 'jazzcash', 'easypaisa', 'raast']),
  redirectUrls: z
    .object({
      successUrl: z.string().url().optional(),
      cancelUrl: z.string().url().optional(),
    })
    .optional(),
});
