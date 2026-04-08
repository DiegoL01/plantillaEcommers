import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 }
  }
  try {
    const savedCart = localStorage.getItem('luxe-cart')
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  return { items: [], total: 0, itemCount: 0 }
}

const saveCartToStorage = (state: CartState) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('luxe-cart', JSON.stringify(state))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart: (state) => {
      const loaded = loadCartFromStorage()
      state.items = loaded.items
      state.total = loaded.total
      state.itemCount = loaded.itemCount
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        })
      }
      
      const { total, itemCount } = calculateTotals(state.items)
      state.total = total
      state.itemCount = itemCount
      saveCartToStorage(state)
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      const { total, itemCount } = calculateTotals(state.items)
      state.total = total
      state.itemCount = itemCount
      saveCartToStorage(state)
    },
    
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
      const { total, itemCount } = calculateTotals(state.items)
      state.total = total
      state.itemCount = itemCount
      saveCartToStorage(state)
    },
    
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.itemCount = 0
      saveCartToStorage(state)
    },
  },
})

export const { initializeCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
