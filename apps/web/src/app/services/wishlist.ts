import { api } from '../api'
import type { Product, ApiResponse } from '../../lib/types'

export interface WishlistItem {
  _id: string
  product: Product
  addedAt: string
  priceWhenAdded: number
}

export interface Wishlist {
  _id: string
  user: string
  name: string
  products: WishlistItem[]
  isPublic: boolean
  shareToken?: string
}

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlists: builder.query<ApiResponse<Wishlist[]>, void>({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    createWishlist: builder.mutation<ApiResponse<Wishlist>, { name?: string }>({
      query: (body) => ({ url: '/wishlist', method: 'POST', body }),
      invalidatesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation<ApiResponse<Wishlist>, { wishlistId: string; product: string }>({
      query: ({ wishlistId, product }) => ({ url: `/wishlist/${wishlistId}/items`, method: 'POST', body: { product } }),
      invalidatesTags: ['Wishlist'],
    }),
    removeWishlistItem: builder.mutation<ApiResponse<Wishlist>, { wishlistId: string; itemId: string }>({
      query: ({ wishlistId, itemId }) => ({ url: `/wishlist/${wishlistId}/items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    deleteWishlist: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/wishlist/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    shareWishlist: builder.mutation<ApiResponse<{ shareToken: string; shareUrl: string }>, string>({
      query: (id) => ({ url: `/wishlist/${id}/share`, method: 'POST' }),
      invalidatesTags: ['Wishlist'],
    }),
    moveAllToCart: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({ url: `/wishlist/${id}/move-to-cart`, method: 'POST' }),
      invalidatesTags: ['Wishlist', 'Cart'],
    }),
  }),
})

export const {
  useGetWishlistsQuery,
  useCreateWishlistMutation,
  useAddToWishlistMutation,
  useRemoveWishlistItemMutation,
  useDeleteWishlistMutation,
  useShareWishlistMutation,
  useMoveAllToCartMutation,
} = wishlistApi
