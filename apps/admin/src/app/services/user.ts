import { api } from '../api'

export interface AdminUser {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  isActive: boolean
  isBlocked: boolean
  loyaltyPoints: number
  loyaltyTier: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: { page: number; pages: number; total: number; limit: number }
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<AdminUser>, Record<string, string>>({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['Users'],
    }),
    getUser: builder.query<{ success: boolean; data: AdminUser }, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<{ success: boolean; data: AdminUser }, { id: string; body: Partial<AdminUser> }>({
      query: ({ id, body }) => ({ url: `/admin/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
    toggleBlockUser: builder.mutation<{ success: boolean; data: AdminUser }, string>({
      query: (id) => ({ url: `/admin/users/${id}/block`, method: 'PUT' }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation, useToggleBlockUserMutation } = userApi
