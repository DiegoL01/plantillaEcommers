import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json()

    // Validar campos requeridos
    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Email, password and firstName are required' },
        { status: 400 }
      )
    }

    // Validar longitud del nombre
    if (firstName.length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar fuerza de contraseña
    const passwordErrors: string[] = []
    if (password.length < 8) passwordErrors.push('Debe tener al menos 8 caracteres')
    if (!/[a-z]/.test(password)) passwordErrors.push('Debe contener letras minúsculas')
    if (!/[A-Z]/.test(password)) passwordErrors.push('Debe contener letras mayúsculas')
    if (!/[0-9]/.test(password)) passwordErrors.push('Debe contener números')

    if (passwordErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Contraseña débil',
          details: passwordErrors
        },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado. Intenta iniciar sesión.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName || null,
        role: 'CUSTOMER',
      },
    })

    // Generar token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering:', error)
    return NextResponse.json(
      { error: 'Error al crear la cuenta. Intenta nuevamente.' },
      { status: 500 }
    )
  }
}
