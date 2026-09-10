import { api } from '../api'

export interface NewsletterSubscriber {
  _id: string
  email: string
  name?: string
  isSubscribed: boolean
  source?: string
  subscribedAt?: string
  unsubscribedAt?: string
}

export interface NewsletterStats {
  totalSubscribers: number
  activeSubscribers: number
  unsubscribedSubscribers: number
  thisWeek: number
}

export const newsletterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNewsletters: builder.query<{ data: NewsletterSubscriber[]; pagination: any }, { limit?: number }>({
      query: (params) => ({ url: '/newsletter', params }),
      providesTags: ['Newsletters'],
    }),
    updateNewsletterStatus: builder.mutation<{ success: boolean }, { id: string; body: { isSubscribed: boolean } }>({
      query: ({ id, body }) => ({ url: `/newsletter/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Newsletters'],
    }),
    getNewsletterStats: builder.query<NewsletterStats, void>({
      query: () => ({ url: '/newsletter/admin/stats' }),
      providesTags: ['Newsletters'],
    }),
  }),
})

export const {
  useGetNewslettersQuery,
  useUpdateNewsletterStatusMutation,
  useGetNewsletterStatsQuery,
} = newsletterApi
