import { api } from '../api'

export interface AdminUser {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: { url: string; publicId: string }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: { user: AdminUser }
  message?: string
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<{ success: boolean; data: { user: AdminUser } }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    updateProfile: builder.mutation<{ success: boolean; data: { user: AdminUser } }, Partial<AdminUser>>({
      query: (body) => ({ url: '/auth/update-profile', method: 'PUT', body }),
      invalidatesTags: ['Auth'],
    }),
    changePassword: builder.mutation<{ success: boolean }, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/change-password', method: 'PUT', body }),
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useLogoutMutation, useUpdateProfileMutation, useChangePasswordMutation } = authApi
