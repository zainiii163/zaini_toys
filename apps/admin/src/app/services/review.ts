import { api } from '../api'

export interface Review {
  _id: string
  product: { _id: string; name: string; slug: string }
  user: { _id: string; name: string; email: string }
  rating: number
  title: string
  comment: string
  isVerifiedPurchase: boolean
  isApproved: boolean
  isFeatured: boolean
  adminReply?: string
  helpfulCount: number
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<PaginatedResponse<Review>, Record<string, string>>({
      query: (params) => ({ url: '/reviews/admin/all', params }),
      providesTags: ['Reviews'],
    }),
    approveReview: builder.mutation<{ success: boolean; data: Review }, string>({
      query: (id) => ({ url: `/reviews/admin/${id}/approve`, method: 'PUT' }),
      invalidatesTags: ['Reviews'],
    }),
    rejectReview: builder.mutation<{ success: boolean; data: Review }, string>({
      query: (id) => ({ url: `/reviews/admin/${id}/reject`, method: 'PUT' }),
      invalidatesTags: ['Reviews'],
    }),
    featureReview: builder.mutation<{ success: boolean; data: Review }, { id: string; isFeatured: boolean }>({
      query: ({ id, isFeatured }) => ({ url: `/reviews/admin/${id}/feature`, method: 'PUT', body: { isFeatured } }),
      invalidatesTags: ['Reviews'],
    }),
    replyToReview: builder.mutation<{ success: boolean; data: Review }, { id: string; reply: string }>({
      query: ({ id, reply }) => ({ url: `/reviews/admin/${id}/reply`, method: 'PUT', body: { reply } }),
      invalidatesTags: ['Reviews'],
    }),
  }),
})

export const { useGetReviewsQuery, useApproveReviewMutation, useRejectReviewMutation, useFeatureReviewMutation, useReplyToReviewMutation } = reviewApi
