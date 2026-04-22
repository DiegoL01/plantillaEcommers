import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User, LoginCredentials, RegisterCredentials } from '../../types'

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null
  try {
    const savedUser = localStorage.getItem('luxe-user')
    if (savedUser) {
      return JSON.parse(savedUser)
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error)
  }
  return null
}

const initialState: UserState = {
  currentUser: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || 'Login failed')
      }

      const data = await response.json()
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        avatar: data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        role: data.user.role,
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('luxe-user', JSON.stringify(user))
        localStorage.setItem('auth-token', data.token)
      }

      return user
    } catch (error) {
      return rejectWithValue('Error connecting to server')
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || 'Registration failed')
      }

      const data = await response.json()
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        avatar: data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        role: data.user.role,
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('luxe-user', JSON.stringify(user))
        localStorage.setItem('auth-token', data.token)
      }

      return user
    } catch (error) {
      return rejectWithValue('Error connecting to server')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initializeUser: (state) => {
      const savedUser = loadUserFromStorage()
      state.currentUser = savedUser
      state.isAuthenticated = !!savedUser
    },
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('luxe-user')
        localStorage.removeItem('auth-token')
      }
    },
    clearError: (state) => {
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
        if (typeof window !== 'undefined') {
          localStorage.setItem('luxe-user', JSON.stringify(state.currentUser))
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { initializeUser, logout, clearError, updateProfile } = userSlice.actions
export default userSlice.reducer
