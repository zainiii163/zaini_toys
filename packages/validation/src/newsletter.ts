import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().email('Invalid email address').max(200),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
});

export const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address').max(200),
});