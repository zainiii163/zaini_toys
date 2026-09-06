import { api } from '../api'
import type { Cart, ApiResponse } from '../../lib/types'

export interface AddToCartRequest {
  product: string
  variant?: string
  quantity?: number
}
export interface UpdateCartRequest {
  quantity: number
}
export interface ApplyCouponRequest {
  code: string
}

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<ApiResponse<Cart>, AddToCartRequest>({
      query: (body) => ({ url: '/cart', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<ApiResponse<Cart>, { itemId: string; body: UpdateCartRequest }>({
      query: ({ itemId, body }) => ({ url: `/cart/${itemId}`, method: 'PUT', body }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({ url: `/cart/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation<ApiResponse<Cart>, ApplyCouponRequest>({
      query: (body) => ({ url: '/cart/coupon', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation<ApiResponse<Cart>, void>({
      query: () => ({ url: '/cart/coupon', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    saveForLater: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({ url: `/cart/save-for-later/${itemId}`, method: 'POST' }),
      invalidatesTags: ['Cart'],
    }),
    moveToCart: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({ url: `/cart/move-to-cart/${itemId}`, method: 'POST' }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useSaveForLaterMutation,
  useMoveToCartMutation,
} = cartApi
