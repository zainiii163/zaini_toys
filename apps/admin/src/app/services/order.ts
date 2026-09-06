import { api } from '../api'

export interface Order {
  _id: string
  orderNumber: string
  customerInfo: { name: string; email: string; phone: string }
  items: { _id: string; productName: string; productImage: string; quantity: number; price: number }[]
  subtotal: number
  discount: number
  shippingCost: number
  tax: number
  total: number
  status: string
  paymentMethod: string
  paymentStatus: string
  shippingAddress: { fullName: string; phone: string; address: string; city: string; area: string }
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order>, Record<string, string>>({
      query: (params) => ({ url: '/orders/admin/all', params }),
      providesTags: ['Orders'],
    }),
    getOrderByNumber: builder.query<{ success: boolean; data: Order }, string>({
      query: (orderNumber) => `/orders/${orderNumber}`,
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation<{ success: boolean; data: Order }, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/orders/admin/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const { useGetOrdersQuery, useGetOrderByNumberQuery, useUpdateOrderStatusMutation } = orderApi
