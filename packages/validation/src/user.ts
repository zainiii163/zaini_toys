import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1).max(50).default('Home'),
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  address: z.string().min(5).max(300),
  city: z.string().min(1).max(100),
  area: z.string().min(1).max(100),
  postalCode: z.string().min(3).max(20),
  isDefault: z.boolean().default(false),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  avatar: z
    .object({
      url: z.string(),
      publicId: z.string(),
    })
    .optional(),
});

export const childProfileSchema = z.object({
  name: z.string().min(1).max(100),
  dateOfBirth: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).optional(),
  favoriteCategories: z.array(objectIdSafe()).optional(),
  favoriteBrands: z.array(objectIdSafe()).optional(),
});

function objectIdSafe() {
  return z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');
}
