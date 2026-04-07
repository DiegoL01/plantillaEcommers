import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { loginUser, registerUser, clearError } from '../features/user/userSlice'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

type AuthMode = 'login' | 'register'

export const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()
  
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.user)
  
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (isAuthenticated) {
      showSuccess(mode === 'login' ? 'Sesión iniciada' : 'Cuenta creada exitosamente')
      navigate(redirect)
    }
  }, [isAuthenticated, navigate, redirect, mode, showSuccess])

  useEffect(() => {
    if (error) {
      showError(error)
      dispatch(clearError())
    }
  }, [error, showError, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (mode === 'register' && !formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    if (mode === 'login') {
      dispatch(loginUser({ email: formData.email, password: formData.password }))
    } else {
      dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }))
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setFormErrors({})
    dispatch(clearError())
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <span className="font-serif text-3xl font-bold">LUXE</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crear cuenta'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === 'login'
                ? 'Ingresa tus credenciales para continuar'
                : 'Completa el formulario para registrarte'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={formErrors.firstName}
                  placeholder="Juan"
                />
                <Input
                  label="Apellido"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="García"
                />
              </div>
            )}

            <div className="relative">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                placeholder="tu@email.com"
              />
              <Mail className="absolute right-3 top-[38px] w-4 h-4 text-muted-foreground" />
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-sm text-muted-foreground">Recordarme</span>
                </label>
                <Link to="#" className="text-sm text-accent hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
              rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Demo Credentials */}
          {mode === 'login' && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Credenciales de prueba:</p>
              <p className="text-xs text-muted-foreground">Email: demo@luxe.com</p>
              <p className="text-xs text-muted-foreground">Contraseña: demo123</p>
            </div>
          )}

          {/* Toggle Mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-accent font-medium hover:underline"
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:flex-1 relative bg-secondary">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop"
          alt="LUXE Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-foreground">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Descubre el lujo en cada detalle
          </h2>
          <p className="text-muted-foreground text-lg">
            Únete a nuestra comunidad y accede a colecciones exclusivas, ofertas especiales y más.
          </p>
        </div>
      </div>
    </div>
  )
}
