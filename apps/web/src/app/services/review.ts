import { api } from '../api'
import type { ApiListResponse, ApiResponse } from '../../lib/types'

export interface Review {
  _id: string
  product: string
  user: { _id: string; name: string; avatar?: { url: string } }
  rating: number
  title: string
  comment: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  images?: { url: string; publicId: string }[]
  createdAt: string
}

export interface ReviewSummary {
  total: number
  average: number
  counts: { 1: number; 2: number; 3: number; 4: number; 5: number }
  verifiedPurchase: number
}

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ApiListResponse<Review>, { productId: string; page?: number; sort?: string }>({
      query: ({ productId, ...params }) => ({ url: `/reviews/product/${productId}`, params }),
      providesTags: ['Reviews'],
    }),
    getReviewSummary: builder.query<ApiResponse<ReviewSummary>, string>({
      query: (productId) => `/reviews/product/${productId}/summary`,
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation<ApiResponse<Review>, any>({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: ['Reviews', 'ProductDetail'],
    }),
    markHelpful: builder.mutation<ApiResponse<{ helpfulCount: number }>, string>({
      query: (id) => ({ url: `/reviews/${id}/helpful`, method: 'POST' }),
      invalidatesTags: ['Reviews'],
    }),
  }),
})

export const {
  useGetProductReviewsQuery,
  useGetReviewSummaryQuery,
  useCreateReviewMutation,
  useMarkHelpfulMutation,
} = reviewApi
