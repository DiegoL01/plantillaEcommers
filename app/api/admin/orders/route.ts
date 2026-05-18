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

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: parseFloat(order.total.toString()),
        status: order.status,
        createdAt: order.createdAt,
        customer: order.user,
        shipping: {
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          address: order.address,
          city: order.city,
          postalCode: order.postalCode,
          country: order.country,
        },
        items: order.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
        })),
      }))
    )
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
