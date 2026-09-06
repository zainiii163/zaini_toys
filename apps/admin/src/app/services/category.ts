import { api } from '../api'

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  parent?: string
  isActive: boolean
  createdAt: string
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<{ success: boolean; data: Category[] }, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<{ success: boolean; data: Category }, { name: string; description?: string; parent?: string }>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<{ success: boolean; data: Category }, { id: string; body: Partial<Category> }>({
      query: ({ id, body }) => ({ url: `/categories/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApi
