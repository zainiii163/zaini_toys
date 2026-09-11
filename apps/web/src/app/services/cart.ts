import { api } from '../api'
import type { Cart, ApiResponse } from '../../lib/types'
import { getOrCreateSessionId } from '../../lib/guestSession'

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

const sessionParams = (): { sessionId: string } => ({ sessionId: getOrCreateSessionId() })

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => ({ url: '/cart', params: sessionParams() }),
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<ApiResponse<Cart>, AddToCartRequest>({
      query: (body) => ({ url: '/cart', method: 'POST', body, params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<ApiResponse<Cart>, { itemId: string; body: UpdateCartRequest }>({
      query: ({ itemId, body }) => ({ url: `/cart/${itemId}`, method: 'PUT', body, params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({ url: `/cart/${itemId}`, method: 'DELETE', params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/cart', method: 'DELETE', params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation<ApiResponse<Cart>, ApplyCouponRequest>({
      query: (body) => ({ url: '/cart/coupon', method: 'POST', body, params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation<ApiResponse<Cart>, void>({
      query: () => ({ url: '/cart/coupon', method: 'DELETE', params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    saveForLater: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({ url: `/cart/save-for-later/${itemId}`, method: 'POST', params: sessionParams() }),
      invalidatesTags: ['Cart'],
    }),
    moveToCart: builder.mutation<ApiResponse<Cart>, string>({
      query: (itemId) => ({ url: `/cart/move-to-cart/${itemId}`, method: 'POST', params: sessionParams() }),
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
