import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: [],
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      state.toasts.push({
        ...action.payload,
        id,
        duration: action.payload.duration || 3000,
      })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
    clearAllToasts: (state) => {
      state.toasts = []
    },
  },
})

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions
export default toastSlice.reducer
