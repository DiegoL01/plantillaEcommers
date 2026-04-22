import { jwtDecode } from 'jwt-decode'

export interface DecodedToken {
  id: number
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  iat: number
  exp: number
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth-token')
}

export function getUserRole(): 'ADMIN' | 'CUSTOMER' | null {
  if (typeof window === 'undefined') return null
  try {
    const token = getAuthToken()
    if (!token) return null
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.role
  } catch {
    return null
  }
}

export function isAdmin(): boolean {
  return getUserRole() === 'ADMIN'
}

export function isTokenExpired(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const token = getAuthToken()
    if (!token) return true
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
