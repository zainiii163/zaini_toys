import type { ProductItem } from './common';

export interface CartItem {
  _id: string;
  product: string;
  variant?: string;
  quantity: number;
  price: number;
  addedAt: string;
  productDetails?: ProductItem;
}

export interface Cart {
  _id: string;
  user?: string;
  sessionId: string;
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  totalItems: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  product: string;
  addedAt: string;
  priceWhenAdded: number;
}

export interface Wishlist {
  _id: string;
  user: string;
  name: string;
  products: WishlistItem[];
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}
