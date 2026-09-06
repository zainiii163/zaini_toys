import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { logout } from '../store/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || '/api/v1',
  credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  // If not a 401, return directly
  if (!result.error || (result.error as any)?.status !== 401) {
    return result
  }

  // Attempt silent refresh using the refresh cookie
  const refreshResult = await rawBaseQuery(
    { url: '/auth/refresh-token', method: 'POST' },
    api,
    extraOptions,
  )

  if (refreshResult.data) {
    // Retry the original request after successful refresh
    result = await rawBaseQuery(args, api, extraOptions)
  } else {
    api.dispatch(logout())
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth', 'Products', 'ProductDetail', 'Categories', 'Cart', 'Wishlist', 'Orders', 'User', 'FlashSales', 'Banners', 'Reviews', 'Brands',
  ],
  endpoints: () => ({}),
})
