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

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform products to match frontend expected format
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: parseFloat(product.price.toString()),
      description: product.description,
      category: product.category.name,
      image: product.image,
      rating: product.rating,
      stock: product.stock,
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const token = getAuthToken(request)
    if (!verifyAdminRole(token)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin role required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, price, description, image, categoryId, stock } = body

    if (!title || !price || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const product = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        description,
        image: image || 'https://via.placeholder.com/300x300?text=Product',
        categoryId,
        stock: stock || 0,
        ratingRate: 0,
        ratingCount: 0,
      },
      include: {
        category: true,
      },
    })

    const formattedProduct = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price.toString()),
      description: product.description,
      category: product.category.name,
      image: product.image,
      stock: product.stock,
    }

    return NextResponse.json(formattedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
