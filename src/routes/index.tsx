import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Home } from '../pages/Home'
import { ProductDetail } from '../pages/ProductDetail'
import { Cart } from '../pages/Cart'
import { Checkout } from '../pages/Checkout'
import { Login } from '../pages/Login'

interface AppRoutesProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const AppRoutes = ({ isDarkMode, toggleDarkMode }: AppRoutesProps) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<MainLayout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
    </Routes>
  )
}
