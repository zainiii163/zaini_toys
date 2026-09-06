export type ProductItem = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number;
  images: { url: string; publicId: string; isPrimary?: boolean }[];
  averageRating: number;
  totalReviews: number;
  availableStock: number;
  brand?: { _id: string; name: string; slug: string };
  category?: { _id: string; name: string; slug: string };
  isGiftEligible?: boolean;
};

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  ageMin?: number;
  ageMax?: number;
  rating?: number;
  sort?: string;
  availability?: string;
  color?: string;
  material?: string;
  skill?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  onSale?: boolean;
}
