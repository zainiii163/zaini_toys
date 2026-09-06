import { api } from '../api'

export interface SupportTicket {
  _id: string
  ticketNumber: string
  user: { _id: string; name: string; email: string }
  subject: string
  message: string
  category: string
  priority: string
  status: string
  assignedTo?: { _id: string; name: string }
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
    getTickets: builder.query<PaginatedResponse<SupportTicket>, Record<string, string>>({
      query: (params) => ({ url: '/support/admin/all', params }),
      providesTags: ['Support'],
    }),
    updateTicketStatus: builder.mutation<{ success: boolean; data: SupportTicket }, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/support/admin/${id}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Support'],
    }),
    replyToTicket: builder.mutation<{ success: boolean; data: SupportTicket }, { id: string; message: string }>({
      query: ({ id, message }) => ({ url: `/support/admin/${id}/reply`, method: 'POST', body: { message } }),
      invalidatesTags: ['Support'],
    }),
    assignTicket: builder.mutation<{ success: boolean; data: SupportTicket }, { id: string; assignedTo: string }>({
      query: ({ id, assignedTo }) => ({ url: `/support/admin/${id}/assign`, method: 'PUT', body: { assignedTo } }),
      invalidatesTags: ['Support'],
    }),
  }),
})

export const { useGetTicketsQuery, useUpdateTicketStatusMutation, useReplyToTicketMutation, useAssignTicketMutation } = supportApi
