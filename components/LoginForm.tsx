'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../lib/hooks'
import { loginUser, registerUser, clearError } from '../lib/features/userSlice'
import { useToast } from '../hooks/useToast'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ErrorAlert } from './ErrorAlert'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import { validators, getErrorMessage } from '../lib/validationHelpers'

type AuthMode = 'login' | 'register'

interface FormError {
  message?: string
  details?: string[]
}

export function LoginForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const { showSuccess, showError } = useToast()

  const { isAuthenticated, loading, error } = useAppSelector((state) => state.user)

  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [dismissedError, setDismissedError] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, FormError>>({})

  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (isAuthenticated) {
      showSuccess(mode === 'login' ? '✅ Sesión iniciada correctamente' : '✅ Cuenta creada exitosamente')
      router.push(redirect)
    }
  }, [isAuthenticated, router, redirect, mode, showSuccess])

  useEffect(() => {
    if (error && !dismissedError) {
      setDismissedError(false)
    }
  }, [error, dismissedError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando empieza a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: {} }))
    }
  }

  const validate = (): boolean => {
    const errors: Record<string, FormError> = {}

    // Validar nombre (solo en registro)
    if (mode === 'register') {
      const nameValidation = validators.name(formData.firstName, 'Nombre')
      if (!nameValidation.valid) {
        errors.firstName = { message: nameValidation.error }
      }
    }

    // Validar email
    const emailValidation = validators.email(formData.email)
    if (!emailValidation.valid) {
      errors.email = { message: emailValidation.error }
    }

    // Validar contraseña
    const minLength = mode === 'login' ? 6 : 8
    const passwordValidation = validators.password(formData.password, minLength)
    if (!passwordValidation.valid) {
      errors.password = {
        message: passwordValidation.error,
        details: passwordValidation.details
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDismissedError(false)

    if (!validate()) return

    if (mode === 'login') {
      dispatch(loginUser({ email: formData.email, password: formData.password }) as any)
    } else {
      dispatch(registerUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }) as any)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setFormErrors({})
    setDismissedError(false)
    dispatch(clearError())
  }

  const serverErrorInfo = error ? getErrorMessage(error) : null

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">NovaCart</h1>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
          </p>
        </div>

        {/* Server Error Alert */}
        {serverErrorInfo && !dismissedError && (
          <ErrorAlert
            message={serverErrorInfo.message}
            type="error"
            details={serverErrorInfo.details}
            onClose={() => {
              setDismissedError(true)
              dispatch(clearError())
            }}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <Input
                  label="Nombre"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={formErrors.firstName?.message}
                  placeholder="John"
                />
                {formErrors.firstName?.details && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.firstName.details[0]}</p>
                )}
              </div>

              {/* Apellido */}
              <Input
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email?.message}
              placeholder="your@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
            {formErrors.email?.details && (
              <p className="text-xs text-red-600 mt-1">{formErrors.email.details[0]}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password?.message}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Mostrar detalles de error en login */}
            {formErrors.password?.details && mode === 'login' && (
              <p className="text-xs text-red-600 mt-1">{formErrors.password.details[0]}</p>
            )}

            {/* Mostrar detalles de validación en registro */}
            {formErrors.password?.message && mode === 'register' && (
              <div className="mt-2">
                <PasswordStrengthMeter password={formData.password} />
              </div>
            )}

            {/* Mostrar medidor de contraseña mientras se escribe en registro */}
            {mode === 'register' && formData.password && !formErrors.password?.message && (
              <div className="mt-2">
                <PasswordStrengthMeter password={formData.password} />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {loading
              ? mode === 'login'
                ? 'Iniciando sesión...'
                : 'Creando cuenta...'
              : mode === 'login'
                ? 'Iniciar Sesión'
                : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button onClick={toggleMode} className="text-accent hover:underline font-medium">
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
          <p className="font-medium mb-2">Demo Credentials</p>
          <p className="text-xs">
            <strong>ADMIN:</strong> admin@luxe.com / admin12345
          </p>
          <p className="text-xs">
            <strong>USER:</strong> test@example.com / test12345
          </p>
        </div>
      </div>
    </div>
  )
}
