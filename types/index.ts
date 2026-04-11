export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName?: string
}

export interface ProductFilters {
  category: string
  priceRange: [number, number]
  searchQuery: string
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'rating'
}

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  postalCode: string
  country: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}