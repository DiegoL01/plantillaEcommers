import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, Sun, Moon, LogOut } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { setFilters } from '../../features/products/productSlice'
import { logout } from '../../features/user/userSlice'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'

interface NavbarProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const Navbar = ({ isDarkMode, toggleDarkMode }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showSuccess } = useToast()
  
  const { itemCount } = useAppSelector((state) => state.cart)
  const { isAuthenticated, currentUser } = useAppSelector((state) => state.user)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setFilters({ searchQuery }))
    navigate('/')
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    showSuccess('Sesión cerrada correctamente')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight">LUXE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/?category=electronics"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Electrónica
            </Link>
            <Link
              to="/?category=jewelery"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Joyería
            </Link>
            <Link
              to="/?category=men's clothing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Hombre
            </Link>
            <Link
              to="/?category=women's clothing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Mujer
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{currentUser?.firstName}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar sesión">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex">
                <Button variant="ghost" size="icon" aria-label="Iniciar sesión">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="Carrito de compras">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isMenuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
          )}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/?category=electronics"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            >
              Electrónica
            </Link>
            <Link
              to="/?category=jewelery"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            >
              Joyería
            </Link>
            <Link
              to="/?category=men's clothing"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            >
              Hombre
            </Link>
            <Link
              to="/?category=women's clothing"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
            >
              Mujer
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.firstName}
                    className="w-6 h-6 rounded-full"
                  />
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
