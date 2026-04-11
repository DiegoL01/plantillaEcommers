import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
