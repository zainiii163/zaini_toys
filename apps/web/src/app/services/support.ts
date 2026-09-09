import { api } from '../api'

export interface SupportTicket {
  _id: string
  ticketNumber: string
  user: string
  order?: string
  subject: string
  message: string
  category: string
  priority: string
  status: string
  messages: { sender: { name: string }; message: string; createdAt: string }[]
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const supportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyTickets: builder.query<PaginatedResponse<SupportTicket>, Record<string, string>>({
      query: (params) => ({ url: '/support', params }),
      providesTags: ['Support'],
    }),
    getTicket: builder.query<{ success: boolean; data: SupportTicket }, string>({
      query: (id) => `/support/${id}`,
      providesTags: ['Support'],
    }),
    createTicket: builder.mutation<{ success: boolean; data: SupportTicket }, { subject: string; message: string; category: string; priority?: string; order?: string }>({
      query: (body) => ({ url: '/support', method: 'POST', body }),
      invalidatesTags: ['Support'],
    }),
    addTicketMessage: builder.mutation<{ success: boolean; data: SupportTicket }, { id: string; message: string }>({
      query: ({ id, message }) => ({ url: `/support/${id}/messages`, method: 'POST', body: { message } }),
      invalidatesTags: ['Support'],
    }),
  }),
})

export const { useGetMyTicketsQuery, useGetTicketQuery, useCreateTicketMutation, useAddTicketMessageMutation } = supportApi
