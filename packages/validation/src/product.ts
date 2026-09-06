import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  sku: z.string().min(1).max(50),
  barcode: z.string().optional(),
  description: z.string().min(10).max(5000),
  shortDescription: z.string().min(2).max(500),

  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),

  brand: objectId,
  category: objectId,
  subcategory: objectId.optional(),

  ageRange: z.object({
    min: z.number().min(0).max(18),
    max: z.number().min(0).max(18),
  }),
  recommendedAge: z.number().min(0).max(18),
  gender: z.enum(['unisex', 'male', 'female']).default('unisex'),

  material: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  size: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),

  educationalBenefits: z.array(z.string()).optional(),
  skillDevelopment: z.array(z.string()).optional(),

  safetyWarnings: z.array(z.string()).optional(),
  chokingHazardWarning: z.boolean().default(false),
  batteryRequired: z.boolean().default(false),
  batteryType: z.string().optional(),
  certificationInfo: z.string().optional(),

  manufacturer: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  warranty: z.string().optional(),
  whatsIncluded: z.array(z.string()).optional(),
  assemblyRequired: z.boolean().default(false),
  assemblyInfo: z.string().optional(),

  stock: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).default(5),

  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  name: z.string().min(1).max(100),
  sku: z.string().min(1).max(50),
  barcode: z.string().optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  stock: z.number().min(0).default(0),
  attributes: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  ageMin: z.coerce.number().min(0).optional(),
  ageMax: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.string().optional(),
  availability: z.enum(['in_stock', 'out_of_stock']).optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  skill: z.string().optional(),
  featured: z.string().optional(),
  newArrival: z.string().optional(),
  bestSeller: z.string().optional(),
  trending: z.string().optional(),
  onSale: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  parent: objectId.optional(),
  ageGroups: z.array(z.string()).optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  icon: z.string().optional(),
});

export const createBrandSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  website: z.string().url().optional(),
  country: z.string().optional(),
  isActive: z.boolean().default(true),
});
