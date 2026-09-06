import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createReviewSchema = z.object({
  product: objectId,
  order: objectId.optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2).max(200),
  comment: z.string().min(2).max(2000),
  images: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
  videos: z.array(z.object({ url: z.string(), publicId: z.string() })).optional(),
});

export const adminReplySchema = z.object({
  reply: z.string().min(1).max(1000),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  description: z.string().max(500),
  type: z.enum(['percentage', 'fixed', 'free_shipping', 'buy_x_get_y']),
  value: z.number().nonnegative(),
  minimumOrder: z.number().min(0).default(0),
  maximumDiscount: z.number().positive().optional(),

  applicableTo: z.enum(['all', 'products', 'categories', 'brands']).default('all'),
  products: z.array(objectId).optional(),
  categories: z.array(objectId).optional(),
  brands: z.array(objectId).optional(),

  buyQuantity: z.number().int().positive().optional(),
  getQuantity: z.number().int().positive().optional(),

  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().default(1),

  startDate: z.string().min(1),
  endDate: z.string().min(1),
  isActive: z.boolean().default(true),

  firstOrderOnly: z.boolean().default(false),
  birthdayCoupon: z.boolean().default(false),
});

export const createBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional(),
  link: z.string().optional(),
  linkType: z.enum(['product', 'category', 'brand', 'custom']).default('custom'),
  position: z.enum(['hero', 'mid', 'sidebar', 'footer']).default('hero'),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createFlashSaleSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  products: z
    .array(
      z.object({
        product: objectId,
        salePrice: z.number().positive(),
        stockLimit: z.number().int().positive(),
      }),
    )
    .min(1),
  isActive: z.boolean().default(true),
});
