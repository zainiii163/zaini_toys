import { api } from '../api'

export interface Brand {
  _id: string
  name: string
  slug: string
  logo?: string
  isActive: boolean
  createdAt: string
}

export const brandApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<{ success: boolean; data: Brand[] }, void>({
      query: () => '/brands',
      providesTags: ['Brands'],
    }),
    createBrand: builder.mutation<{ success: boolean; data: Brand }, { name: string }>({
      query: (body) => ({ url: '/brands', method: 'POST', body }),
      invalidatesTags: ['Brands'],
    }),
    updateBrand: builder.mutation<{ success: boolean; data: Brand }, { id: string; body: Partial<Brand> }>({
      query: ({ id, body }) => ({ url: `/brands/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Brands'],
    }),
    deleteBrand: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/brands/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Brands'],
    }),
  }),
})

export const { useGetBrandsQuery, useCreateBrandMutation, useUpdateBrandMutation, useDeleteBrandMutation } = brandApi
