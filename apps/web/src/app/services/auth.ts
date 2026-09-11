import { api } from '../api'
import type { User, ApiResponse } from '../../lib/types'
import { setUser } from '../../store/authSlice'

export interface LoginRequest {
  email: string
  password: string
}
export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
  referralCode?: string
}
export interface AuthResponse {
  success: boolean
  data: { user: User }
  message?: string
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    sendOtp: builder.mutation<ApiResponse<null>, { phone: string; purpose: string }>({
      query: (body) => ({ url: '/auth/send-otp', method: 'POST', body }),
    }),
    verifyOtp: builder.mutation<AuthResponse | ApiResponse<null>, { phone: string; otp: string; purpose: string }>({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body }),
    }),
    forgotPassword: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<ApiResponse<null>, { token: string; password: string }>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),
    getMe: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data.data.user))
        } catch {
          dispatch(setUser(null))
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi
