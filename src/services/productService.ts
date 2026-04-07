import axios from 'axios'
import type { Product } from '../types'

const API_BASE_URL = 'https://fakestoreapi.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products')
    return response.data
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/products/categories')
    return response.data
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/category/${category}`)
    return response.data
  },

  async searchProducts(query: string, products: Product[]): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase()
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    )
  },
}
