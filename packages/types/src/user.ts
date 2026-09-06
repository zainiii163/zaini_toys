export type Role =
  | 'customer'
  | 'admin'
  | 'manager'
  | 'inventory_manager'
  | 'order_manager'
  | 'support'
  | 'marketing'
  | 'content';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'vip';

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  isDefault: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface ChildProfile {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  interests: string[];
  favoriteCategories: string[];
  favoriteBrands: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: { url: string; publicId: string };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  addresses: Address[];
  wishlist: string[];
  childProfiles: ChildProfile[];
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  referralCode: string;
  referredBy?: string;
  totalSpent: number;
  orderCount: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Omit<User, 'wishlist' | 'loyaltyPoints'>;
