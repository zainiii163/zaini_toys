import type { ImageAsset, VideoAsset } from './product';

export interface Review {
  _id: string;
  product: string;
  user: string;
  order: string;
  rating: number;
  title: string;
  comment: string;
  images: ImageAsset[];
  videos: VideoAsset[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportedBy: string[];
  isApproved: boolean;
  isFeatured: boolean;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export type CouponType =
  | 'percentage'
  | 'fixed'
  | 'free_shipping'
  | 'buy_x_get_y';

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;

  applicableTo: 'all' | 'products' | 'categories' | 'brands';
  products?: string[];
  categories?: string[];
  brands?: string[];

  buyQuantity?: number;
  getQuantity?: number;

  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;

  startDate: string;
  endDate: string;
  isActive: boolean;

  firstOrderOnly: boolean;
  birthdayCoupon: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: ImageAsset;
  mobileImage?: ImageAsset;
  link?: string;
  linkType: 'product' | 'category' | 'brand' | 'custom';
  position: 'hero' | 'mid' | 'sidebar' | 'footer';
  sortOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashSaleProduct {
  product: string;
  salePrice: number;
  stockLimit: number;
  soldCount: number;
}

export interface FlashSale {
  _id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  products: FlashSaleProduct[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: ImageAsset;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}
