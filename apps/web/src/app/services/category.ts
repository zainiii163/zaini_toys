import { api } from '../api'
import type { Category, ApiResponse } from '../../lib/types'

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryTree: builder.query<ApiResponse<Category[]>, void>({
      query: () => '/categories/tree',
      providesTags: ['Categories'],
    }),
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),
  }),
})

export const { useGetCategoryTreeQuery, useGetCategoriesQuery } = categoryApi
