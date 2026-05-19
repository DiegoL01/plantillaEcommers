// Mapear errores del servidor a mensajes amigables para el usuario
export const errorMessages: Record<string, { message: string; details?: string[] }> = {
  'Contraseña incorrecta. Intenta de nuevo o usa recuperación de contraseña.': {
    message: '❌ Contraseña incorrecta',
    details: [
      'La contraseña que proporcionaste es incorrecta',
      'Verifica que tengas la contraseña correcta',
      'Si olvidaste tu contraseña, ponte en contacto con soporte'
    ]
  },
  'Email no encontrado. Intenta registrarte si no tienes cuenta.': {
    message: '❌ Email no registrado',
    details: [
      'Este email no está registrado en nuestro sistema',
      'Verifica que hayas escrito tu email correctamente',
      'Si no tienes cuenta, regístrate usando el botón de registro'
    ]
  },
  'Este email ya está registrado. Intenta iniciar sesión.': {
    message: '⚠️ Email ya registrado',
    details: [
      'Este email ya está asociado con una cuenta',
      'Intenta iniciar sesión en su lugar',
      'Si olvidaste tu contraseña, contacta al soporte'
    ]
  },
  'Email, password and firstName are required': {
    message: 'Campos incompletos',
    details: ['Por favor completa: Email, Contraseña y Nombre']
  },
  'Email inválido': {
    message: 'Email inválido',
    details: ['Por favor proporciona un email válido (ej: usuario@example.com)']
  },
  'El nombre debe tener al menos 2 caracteres': {
    message: 'Nombre inválido',
    details: ['El nombre debe tener al menos 2 caracteres']
  },
  'Error al iniciar sesión. Intenta nuevamente.': {
    message: '🔴 Error en el servidor',
    details: ['Algo salió mal al iniciar sesión', 'Intenta nuevamente en unos momentos']
  },
  'Error al crear la cuenta. Intenta nuevamente.': {
    message: '🔴 Error en el servidor',
    details: ['Algo salió mal al crear tu cuenta', 'Intenta nuevamente en unos momentos']
  },
  'Error connecting to server': {
    message: '🌐 Error de conexión',
    details: ['No pudimos conectar con el servidor', 'Verifica tu conexión a internet']
  }
}

export function getErrorMessage(error: string | any): { message: string; details?: string[] } {
  // Manejar objetos de error con detalles
  if (typeof error === 'object' && error?.error) {
    const errorMsg = error.error
    if (errorMessages[errorMsg]) {
      return {
        ...errorMessages[errorMsg],
        details: [...(errorMessages[errorMsg].details || []), ...(error.details || [])]
      }
    }
    return { message: '❌ ' + errorMsg }
  }

  // Manejar strings de error
  if (errorMessages[error]) {
    return errorMessages[error]
  }

  return {
    message: '❌ ' + error,
    details: ['Algo no salió como esperado', 'Intenta nuevamente']
  }
}

// Validadores personalizados
export const validators = {
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) return { valid: false, error: 'El email es requerido' }
    if (!emailRegex.test(email)) return { valid: false, error: 'Email inválido (ej: user@example.com)' }
    return { valid: true }
  },

  password: (password: string, minLength = 6) => {
    const errors: string[] = []
    
    if (!password) return { valid: false, error: 'La contraseña es requerida' }
    if (password.length < minLength) {
      errors.push(`Debe tener al menos ${minLength} caracteres`)
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener letras minúsculas')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener números')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener letras mayúsculas')
    }

    if (errors.length > 0) {
      return { 
        valid: false, 
        error: 'Contraseña débil',
        details: errors 
      }
    }

    return { valid: true }
  },

  name: (name: string, fieldName = 'Nombre') => {
    if (!name.trim()) return { valid: false, error: `${fieldName} es requerido` }
    if (name.length < 2) return { valid: false, error: `${fieldName} debe tener al menos 2 caracteres` }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return { valid: false, error: `${fieldName} contiene caracteres inválidos` }
    }
    return { valid: true }
  }
}
