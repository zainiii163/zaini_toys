export interface ImageAsset {
  url: string
  publicId: string
  alt?: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDescription: string
  price: number
  salePrice?: number
  images: (ImageAsset & { isPrimary?: boolean })[]
  brand?: { _id: string; name: string; slug: string }
  category?: { _id: string; name: string; slug: string }
  ageRange: { min: number; max: number }
  averageRating: number
  totalReviews: number
  availableStock: number
  hasVariants: boolean
  variants?: ProductVariant[]
  material?: string[]
  educationalBenefits?: string[]
  safetyWarnings?: string[]
  isFeatured: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  isTrending: boolean
}

export interface ProductVariant {
  _id: string
  name: string
  sku: string
  price: number
  salePrice?: number
  stock: number
  attributes: { name: string; value: string }[]
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string
  children?: Category[]
}

export interface Pagination {
  page: number
  pages: number
  total: number
  limit: number
}

export interface ApiListResponse<T> {
  success: boolean
  data: T[]
  pagination: Pagination
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface CartItem {
  _id: string
  product: string | Product
  variant?: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  orderNumber: string
  items: { product: string | Product; name: string; quantity: number; price: number }[]
  totalAmount: number
  shippingCost: number
  taxAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: Address
  shippingMethod?: string
  courierService?: string
  trackingNumber?: string
  createdAt: string
  statusHistory?: { status: string; timestamp: string; note?: string }[]
  estimatedDelivery?: string
}

export interface Cart {
  _id: string
  items: CartItem[]
  savedForLater: CartItem[]
  couponCode?: string
  couponDiscount: number
  totalItems: number
  totalAmount: number
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: ImageAsset
  addresses: Address[]
  loyaltyPoints: number
  loyaltyTier: string
  wishlist: string[]
}

export interface Address {
  _id?: string
  label: string
  fullName: string
  phone: string
  address: string
  city: string
  area: string
  postalCode: string
  isDefault?: boolean
}

export interface ErrorResponse {
  success: boolean
  error: string
  stack?: string
}
