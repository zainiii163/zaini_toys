import { api } from '../api'

export interface Coupon {
  _id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expiresAt: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const couponApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<PaginatedResponse<Coupon>, Record<string, string>>({
      query: (params) => ({ url: '/coupons', params }),
      providesTags: ['Coupons'],
    }),
    createCoupon: builder.mutation<{ success: boolean; data: Coupon }, Partial<Coupon>>({
      query: (body) => ({ url: '/coupons', method: 'POST', body }),
      invalidatesTags: ['Coupons'],
    }),
    updateCoupon: builder.mutation<{ success: boolean; data: Coupon }, { id: string; body: Partial<Coupon> }>({
      query: ({ id, body }) => ({ url: `/coupons/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Coupons'],
    }),
    deleteCoupon: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/coupons/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupons'],
    }),
  }),
})

export const { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } = couponApi
