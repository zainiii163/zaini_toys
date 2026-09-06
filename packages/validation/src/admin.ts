import { z } from 'zod';

export const createStaffSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10).max(15),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  role: z
    .enum(['customer', 'admin', 'manager', 'inventory_manager', 'order_manager', 'support', 'marketing', 'content'])
    .default('customer'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  role: z
    .enum(['customer', 'admin', 'manager', 'inventory_manager', 'order_manager', 'support', 'marketing', 'content'])
    .optional(),
  isActive: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  loyaltyPoints: z.number().int().min(0).optional(),
  totalSpent: z.number().min(0).optional(),
});
