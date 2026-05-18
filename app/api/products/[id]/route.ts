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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product id' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform product to match frontend expected format
    const formattedProduct = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price.toString()),
      description: product.description,
      categoryId: product.categoryId,
      category: product.category.name,
      image: product.image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop`,
      RatingRate: product.ratingRate,
      RatingCount: product.ratingCount,
      stock: product.stock,
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthToken(request)
    if (!verifyAdminRole(token)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin role required' },
        { status: 401 }
      )
    }

    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product id' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, price, description, image, categoryId, stock } = body

    // Verify product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Verify category exists if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(description && { description }),
        ...(image && { image }),
        ...(categoryId && { categoryId }),
        ...(stock !== undefined && { stock }),
      },
      include: {
        category: true,
      },
    })

    const formattedProduct = {
      id: updatedProduct.id,
      title: updatedProduct.title,
      price: parseFloat(updatedProduct.price.toString()),
      description: updatedProduct.description,
      categoryId: updatedProduct.categoryId,
      category: updatedProduct.category.name,
      image: updatedProduct.image,
      RatingRate: updatedProduct.ratingRate,
      RatingCount: updatedProduct.ratingCount,
      stock: updatedProduct.stock,
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthToken(request)
    if (!verifyAdminRole(token)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin role required' },
        { status: 401 }
      )
    }

    const { id: rawId } = await params
    const id = parseInt(rawId)

    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product id' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
