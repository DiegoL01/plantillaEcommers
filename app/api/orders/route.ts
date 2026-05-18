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

function createOrderNumber() {
  return `NOVA-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`
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

export async function POST(request: Request) {
  try {
    const token = getAuthToken(request)
    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, total, firstName, lastName, email, address, city, postalCode, country } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must include items' }, { status: 400 })
    }

    if (!firstName || !lastName || !email || !address || !city || !postalCode || !country) {
      return NextResponse.json({ error: 'Missing shipping information' }, { status: 400 })
    }

    const productIds = items.map((item) => Number(item.id))
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, stock: true },
    })
    const productsById = new Map(products.map((product) => [product.id, product]))

    for (const item of items) {
      const product = productsById.get(Number(item.id))
      const quantity = Number(item.quantity)

      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ error: 'Invalid order item' }, { status: 400 })
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${item.id}` },
          { status: 409 }
        )
      }
    }

    const orderTotal = typeof total === 'number'
      ? total
      : items.reduce((sum, item) => {
          const product = productsById.get(Number(item.id))
          return sum + Number(product?.price || 0) * Number(item.quantity)
        }, 0)

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          userId,
          total: orderTotal,
          firstName,
          lastName,
          email,
          address,
          city,
          postalCode,
          country,
          items: {
            create: items.map((item) => {
              const product = productsById.get(Number(item.id))

              return {
                productId: Number(item.id),
                quantity: Number(item.quantity),
                price: product?.price || 0,
              }
            }),
          },
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
      })

      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: Number(item.id) },
            data: { stock: { decrement: Number(item.quantity) } },
          })
        )
      )

      return createdOrder
    })

    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        total: parseFloat(order.total.toString()),
        status: order.status,
        createdAt: order.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
