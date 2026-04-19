import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

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
      category: product.category.name,
      image: product.image || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop`,
      rating: {
        rate: parseFloat(product.ratingRate.toString()) || 4.5,
        count: product.ratingCount || 0,
      },
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
