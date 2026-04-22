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

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.id
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const token = getAuthToken(request)
    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
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

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          ...item.product,
        },
        quantity: item.quantity,
        price: parseFloat(item.price.toString()),
      })),
      total: parseFloat(order.total.toString()),
      status: order.status,
      createdAt: order.createdAt,
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
