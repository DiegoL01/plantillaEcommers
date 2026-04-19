import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { Product, ProductFilters } from '../../types'

interface ProductState {
  items: Product[]
  filteredItems: Product[]
  currentProduct: Product | null
  categories: string[]
  loading: boolean
  error: string | null
  filters: ProductFilters
}

const initialState: ProductState = {
  items: [],
  filteredItems: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 1000],
    searchQuery: '',
    sortBy: 'default',
  },
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const products = await response.json()
      return products as Product[]
    } catch (error) {
      return rejectWithValue('Error al cargar los productos')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const product = await response.json()
      return product as Product
    } catch (error) {
      return rejectWithValue('Error al cargar el producto')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const categories = await response.json()
      return categories as string[]
    } catch (error) {
      return rejectWithValue('Error al cargar las categorías')
    }
  }
)

const applyFilters = (items: Product[], filters: ProductFilters): Product[] => {
  let result = [...items]

  if (filters.category) {
    result = result.filter((item) => item.category === filters.category)
  }

  result = result.filter(
    (item) =>
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
  )

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    )
  }

  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.RatingRate || 0 - a.RatingRate || 0)
      break
    default:
      break
  }

  return result
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredItems = applyFilters(state.items, state.filters)
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.filteredItems = state.items
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = applyFilters(action.payload, state.filters)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  },
})

export const { setFilters, clearFilters, clearCurrentProduct } = productSlice.actions
export default productSlice.reducer
