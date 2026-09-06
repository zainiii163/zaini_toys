import { api } from '../api'

export interface Product {
  _id: string
  name: string
  slug: string
  sku: string
  description: string
  shortDescription?: string
  price: number
  salePrice?: number
  images: { url: string; publicId: string; alt?: string }[]
  brand?: { _id: string; name: string }
  category?: { _id: string; name: string }
  ageRange: { min: number; max: number }
  averageRating: number
  totalReviews: number
  availableStock: number
  isFeatured: boolean
  isNewArrival: boolean
  isBestSeller: boolean
  isTrending: boolean
  isActive: boolean
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, Record<string, string>>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Products'],
    }),
    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      query: (id) => `/products/id/${id}`,
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<{ success: boolean; data: Product }, FormData>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<{ success: boolean; data: Product }, { id: string; body: FormData }>({
      query: ({ id, body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const { useGetProductsQuery, useGetProductQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi
