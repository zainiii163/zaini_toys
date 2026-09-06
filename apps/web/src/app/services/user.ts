import { api } from '../api'
import type { User, Address, ApiResponse } from '../../lib/types'

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    getAddresses: builder.query<ApiResponse<Address[]>, void>({
      query: () => '/users/addresses',
      providesTags: ['User'],
    }),
    addAddress: builder.mutation<ApiResponse<any>, Address>({
      query: (body) => ({ url: '/users/addresses', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation<ApiResponse<any>, { id: string; body: Partial<Address> }>({
      query: ({ id, body }) => ({ url: `/users/addresses/${id}`, method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation<ApiResponse<null>, string>({
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
