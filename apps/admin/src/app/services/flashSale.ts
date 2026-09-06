import { api } from '../api'

export interface FlashSale {
  _id: string
  name: string
  products: { product: string; salePrice: number }[]
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export const flashSaleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFlashSales: builder.query<{ success: boolean; data: FlashSale[] }, void>({
      query: () => '/flash-sales',
      providesTags: ['FlashSales'],
    }),
    createFlashSale: builder.mutation<{ success: boolean; data: FlashSale }, Partial<FlashSale>>({
      query: (body) => ({ url: '/flash-sales', method: 'POST', body }),
      invalidatesTags: ['FlashSales'],
    }),
    updateFlashSale: builder.mutation<{ success: boolean; data: FlashSale }, { id: string; body: Partial<FlashSale> }>({
      query: ({ id, body }) => ({ url: `/flash-sales/${id}`, method: 'PUT', body }),
      invalidatesTags: ['FlashSales'],
    }),
    deleteFlashSale: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/flash-sales/${id}`, method: 'DELETE' }),
      invalidatesTags: ['FlashSales'],
    }),
  }),
})

export const { useGetFlashSalesQuery, useCreateFlashSaleMutation, useUpdateFlashSaleMutation, useDeleteFlashSaleMutation } = flashSaleApi
