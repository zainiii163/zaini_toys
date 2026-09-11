import { api } from '../api'
import type { ApiListResponse, ApiResponse } from '../../lib/types'

export interface OrderItem {
  _id: string
  product: string
  productName: string
  productImage: string
  variantName?: string
  sku: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  _id: string
  orderNumber: string
  customer: string
  customerInfo: { name: string; email: string; phone: string }
  isGuestOrder: boolean
  items: OrderItem[]
  subtotal: number
  discount: number
  couponCode?: string
  couponDiscount: number
  shippingCost: number
  tax: number
  total: number
  loyaltyPointsEarned: number
  shippingAddress: {
    label: string
    fullName: string
    phone: string
    address: string
    city: string
    area: string
    postalCode?: string
  }
  shippingMethod: 'standard' | 'express' | 'same_day'
  paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'raast'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
  status: string
  trackingNumber?: string
  courierService?: string
  isGift: boolean
  giftMessage?: string
  statusHistory?: { status: string; timestamp: string; note?: string }[]
  estimatedDelivery?: string
  createdAt: string
}

export interface CreateOrderRequest {
  shippingAddress: {
    label?: string
    fullName: string
    phone: string
    address: string
    city: string
    area?: string
    postalCode?: string
  }
  shippingMethod?: 'standard' | 'express' | 'same_day'
  paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa' | 'raast'
  couponCode?: string
  isGift?: boolean
  giftMessage?: string
  giftWrapping?: boolean
  customerNotes?: string
  loyaltyPointsToRedeem?: number
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<ApiListResponse<Order>, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: '/orders', params: params || {} }),
      providesTags: ['Orders'],
    }),
    getOrderByNumber: builder.query<ApiResponse<Order>, string>({
      query: (orderNumber) => `/orders/${orderNumber}`,
      providesTags: ['Orders'],
    }),
    publicTrackOrder: builder.query<ApiResponse<Order>, string>({
      query: (orderNumber) => `/orders/public/${orderNumber}/track`,
    }),
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders', 'Cart', 'Products'],
    }),
    cancelOrder: builder.mutation<ApiResponse<Order>, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/orders/${id}/cancel`, method: 'PUT', body: { reason } }),
      invalidatesTags: ['Orders', 'Products'],
    }),
    reorder: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({ url: `/orders/${id}/reorder`, method: 'POST' }),
      invalidatesTags: ['Cart', 'Orders'],
    }),
  }),
})

export const {
  useGetMyOrdersQuery,
  useGetOrderByNumberQuery,
  usePublicTrackOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useReorderMutation,
} = orderApi
