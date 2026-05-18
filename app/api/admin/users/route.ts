import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  id: number
  email: string
  role: 'ADMIN' | 'CUSTOMER'
}

function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

function verifyAdminRole(token: string | null): boolean {
  if (!token) return false
  try {
    return jwtDecode<DecodedToken>(token).role === 'ADMIN'
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  try {
    if (!verifyAdminRole(getAuthToken(request))) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin role required' },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
        orders: {
          select: {
            total: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(
      users.map((user) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        orderCount: user._count.orders,
        totalSpent: user.orders.reduce(
          (sum, order) => sum + parseFloat(order.total.toString()),
          0
        ),
      }))
    )
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
