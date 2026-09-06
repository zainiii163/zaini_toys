export interface ImageAsset {
  url: string;
  publicId: string;
  alt?: string;
}

export interface ProductImage extends ImageAsset {
  isPrimary?: boolean;
}

export interface VideoAsset {
  url: string;
  publicId: string;
  title?: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: ImageAsset[];
  attributes: { name: string; value: string }[];
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string;
  shortDescription: string;

  price: number;
  salePrice?: number;
  costPrice?: number;
  profitMargin?: number;

  images: ProductImage[];
  videos: VideoAsset[];
  model360?: ImageAsset;

  brand: string;
  category: string;
  subcategory?: string;
  ageRange: { min: number; max: number };
  recommendedAge: number;
  gender: 'unisex' | 'male' | 'female';

  material: string[];
  color: string[];
  size: string;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };

  educationalBenefits: string[];
  skillDevelopment: string[];
  safetyWarnings: string[];
  chokingHazardWarning: boolean;
  batteryRequired: boolean;
  batteryType?: string;
  certificationInfo?: string;

  manufacturer: string;
  countryOfOrigin: string;
  warranty?: string;
  whatsIncluded: string[];
  assemblyRequired: boolean;
  assemblyInfo?: string;

  stock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;

  hasVariants: boolean;
  variants: ProductVariant[];

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  viewCount: number;

  seller?: string;
  commission?: number;

  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: ImageAsset;
  icon?: string;
  parent?: string;
  level: number;
  ageGroups: string[];
  sortOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: ImageAsset;
  description: string;
  website?: string;
  country: string;
  isActive: boolean;
  productCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}
