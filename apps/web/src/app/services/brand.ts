import { api } from '../api'

export interface Brand {
  _id: string
  name: string
  slug: string
  logo: { url: string; publicId: string }
  description: string
  country: string
  productCount: number
}

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<{ success: boolean; data: Brand[] }, void>({
      query: () => ({ url: '/brands', params: { limit: 100 } }),
      providesTags: ['Brands'],
    }),
  }),
})

export const { useGetBrandsQuery } = brandApi
