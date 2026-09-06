import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { logout } from '../store/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || '/api/v1',
  credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)
  if (!result.error || (result.error as any)?.status !== 401) {
    return result
  }
  const refreshResult = await rawBaseQuery(
    { url: '/auth/refresh-token', method: 'POST' },
    api,
    extraOptions,
  )
  if (refreshResult.data) {
    result = await rawBaseQuery(args, api, extraOptions)
  } else {
    api.dispatch(logout())
  }
  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Products', 'Categories', 'Orders', 'Users', 'Coupons', 'Banners', 'FlashSales', 'Settings', 'Brands', 'Reviews', 'Support'],
  endpoints: () => ({}),
})
