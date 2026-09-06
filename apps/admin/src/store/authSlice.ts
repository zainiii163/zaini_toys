import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AdminUser {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: { url: string; publicId: string }
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  bootstrapDone: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  bootstrapDone: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AdminUser | null>) => {
      state.user = action.payload
      state.isAuthenticated = action.payload !== null
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setBootstrapDone: (state) => {
      state.bootstrapDone = true
    },
  },
})

export const { setUser, logout, setBootstrapDone } = authSlice.actions
export default authSlice.reducer
