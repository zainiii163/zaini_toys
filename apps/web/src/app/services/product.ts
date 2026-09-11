import { api } from '../api'
import type { Product, ApiListResponse, ApiResponse } from '../../lib/types'

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
  brand?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  ageMin?: number
  ageMax?: number
  rating?: number
  sort?: string
  availability?: string
  featured?: string
  newArrival?: string
  bestSeller?: string
  trending?: string
  onSale?: string
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiListResponse<Product>, ProductQuery | void>({
      query: (params) => ({ url: '/products', params: params || {} }),
      providesTags: ['Products'],
    }),
    getFeaturedProducts: builder.query<ApiListResponse<Product>, void>({
      query: () => '/products/featured',
      providesTags: ['Products'],
    }),
    getNewArrivals: builder.query<ApiListResponse<Product>, void>({
      query: () => '/products/new-arrivals',
      providesTags: ['Products'],
    }),
    getBestSellers: builder.query<ApiListResponse<Product>, void>({
      query: () => '/products/best-sellers',
      providesTags: ['Products'],
    }),
    getTrending: builder.query<ApiListResponse<Product>, void>({
      query: () => '/products/trending',
      providesTags: ['Products'],
    }),
    getProductBySlug: builder.query<ApiResponse<Product>, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: ['ProductDetail'],
    }),
    getRelatedProducts: builder.query<ApiResponse<Product[]>, string>({
      query: (id) => `/products/${id}/related`,
      providesTags: ['Products'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetBestSellersQuery,
  useGetTrendingQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
} = productApi
