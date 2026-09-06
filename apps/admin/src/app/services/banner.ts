import { api } from '../api'

export interface Banner {
  _id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  isActive: boolean
  position: string
  createdAt: string
}

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<{ success: boolean; data: Banner[] }, void>({
      query: () => '/banners',
      providesTags: ['Banners'],
    }),
    createBanner: builder.mutation<{ success: boolean; data: Banner }, Partial<Banner>>({
      query: (body) => ({ url: '/banners', method: 'POST', body }),
      invalidatesTags: ['Banners'],
    }),
    updateBanner: builder.mutation<{ success: boolean; data: Banner }, { id: string; body: Partial<Banner> }>({
      query: ({ id, body }) => ({ url: `/banners/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Banners'],
    }),
    deleteBanner: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/banners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Banners'],
    }),
  }),
})

export const { useGetBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation } = bannerApi
