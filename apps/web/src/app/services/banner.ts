import { api } from '../api'
import type { ApiResponse } from '../../lib/types'

export interface Banner {
  _id: string
  title: string
  subtitle?: string
  image: { url: string; publicId: string }
  mobileImage?: { url: string; publicId: string }
  link?: string
  linkType: 'product' | 'category' | 'brand' | 'custom'
  position: 'hero' | 'mid' | 'sidebar' | 'footer'
  sortOrder: number
}

export interface FlashSaleItem {
  product: any
  flashSaleId: string
  salePrice: number
  stockLimit: number
  soldCount: number
}

export const bannerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<ApiResponse<Banner[]>, { position?: string } | void>({
      query: (params) => ({ url: '/banners', params: params || {} }),
      providesTags: ['Banners'],
    }),
    getFlashSale: builder.query<ApiResponse<any>, void>({
      query: () => '/flash-sales/active',
      providesTags: ['FlashSales'],
    }),
    getFlashSaleProducts: builder.query<ApiResponse<FlashSaleItem[]>, void>({
      query: () => '/flash-sales/products',
      providesTags: ['FlashSales'],
    }),
  }),
})

export const { useGetBannersQuery, useGetFlashSaleQuery, useGetFlashSaleProductsQuery } = bannerApi
