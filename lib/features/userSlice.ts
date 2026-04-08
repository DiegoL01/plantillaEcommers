import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User, LoginCredentials, RegisterCredentials } from '../types'

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
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      if (credentials.email === 'demo@luxe.com' && credentials.password === 'demo123') {
        const user: User = {
          id: 1,
          email: credentials.email,
          firstName: 'Usuario',
          lastName: 'Demo',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('luxe-user', JSON.stringify(user))
        }
        return user
      }
      
      if (credentials.email && credentials.password.length >= 6) {
        const user: User = {
          id: Date.now(),
          email: credentials.email,
          firstName: credentials.email.split('@')[0],
          lastName: '',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('luxe-user', JSON.stringify(user))
        }
        return user
      }
      
      return rejectWithValue('Credenciales inválidas')
    } catch (error) {
      return rejectWithValue('Error al iniciar sesión')
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      if (!credentials.email || !credentials.password || !credentials.firstName) {
        return rejectWithValue('Todos los campos son requeridos')
      }
      
      if (credentials.password.length < 6) {
        return rejectWithValue('La contraseña debe tener al menos 6 caracteres')
      }
      
      const user: User = {
        id: Date.now(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName || '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('luxe-user', JSON.stringify(user))
      }
      return user
    } catch (error) {
      return rejectWithValue('Error al registrarse')
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { initializeUser, logout, clearError, updateProfile } = userSlice.actions
export default userSlice.reducer
