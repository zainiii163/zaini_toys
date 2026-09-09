import { api } from '../api'
import type { User, Address, ApiResponse } from '../../lib/types'

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<ApiResponse<{ user: User }>, Partial<User>>({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    getAddresses: builder.query<ApiResponse<{ addresses: Address[] }>, void>({
      query: () => '/users/addresses',
      providesTags: ['User'],
    }),
    addAddress: builder.mutation<ApiResponse<{ addresses: Address[] }>, Address>({
      query: (body) => ({ url: '/users/addresses', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation<ApiResponse<{ addresses: Address[] }>, { id: string; body: Partial<Address> }>({
      query: ({ id, body }) => ({ url: `/users/addresses/${id}`, method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation<ApiResponse<{ addresses: Address[] }>, string>({
      query: (id) => ({ url: `/users/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = userApi
