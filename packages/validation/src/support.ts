import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createTicketSchema = z.object({
  subject: z.string().min(3).max(200),
  message: z.string().min(3).max(3000),
  category: z.enum(['order', 'refund', 'product', 'shipping', 'other']).default('other'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  order: objectId.optional(),
});

export const addTicketMessageSchema = z.object({
  message: z.string().min(1).max(3000),
  attachments: z
    .array(z.object({ url: z.string(), publicId: z.string() }))
    .optional(),
});
