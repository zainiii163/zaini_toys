import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../lib/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  bootstrapDone: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  bootstrapDone: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
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
