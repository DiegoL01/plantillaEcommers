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
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.role === 'ADMIN'
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  try {
    const token = getAuthToken(request)
    if (!verifyAdminRole(token)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin role required' },
        { status: 401 }
      )
    }

    // Get total sales
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    })

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    })

    // Get top products by sales
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    })

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { title: true, id: true },
        })
        return {
          productId: item.productId,
          productTitle: product?.title || 'Unknown',
          quantity: item._sum.quantity || 0,
          revenue: parseFloat((item._sum.price || 0).toString()),
        }
      })
    )

    // Get daily revenue for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyRevenue = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    })

    // Group by date
    const groupedByDate: Record<string, number> = {}
    dailyRevenue.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      groupedByDate[date] = (groupedByDate[date] || 0) + parseFloat(order.total.toString())
    })

    // Format for chart
    const chartData = Object.entries(groupedByDate).map(([date, revenue]) => ({
      date,
      revenue,
    }))

    return NextResponse.json({
      totalOrders,
      totalRevenue: parseFloat((totalRevenue._sum.total || 0).toString()),
      ordersByStatus,
      topProducts: topProductsWithDetails,
      dailyRevenue: chartData,
    })
  } catch (error) {
    console.error('Error fetching sales data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}
