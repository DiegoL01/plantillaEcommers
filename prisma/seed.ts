import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Starting database seed...')

  // Limpiar datos anteriores (comentar si quieres mantener datos)
  console.log('🗑️  Cleaning existing data...')
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.user.deleteMany({})

  // Crear categorías
  console.log('📁 Creating categories...')
  const electronics = await prisma.category.create({
    data: { name: 'electronics' },
  })

  const clothing = await prisma.category.create({
    data: { name: "women's clothing" },
  })

  const jewelery = await prisma.category.create({
    data: { name: 'jewelery' },
  })

  const books = await prisma.category.create({
    data: { name: 'books' },
  })

  // Crear productos
  console.log('📦 Creating products...')
  const products = [
    {
      title: 'Wireless Headphones Pro',
      price: 299.99,
      description:
        'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      rating: { rate: 4.8, count: 256 },
      categoryId: electronics.id,
    },
    {
      title: 'Smart Watch Ultra',
      price: 499.99,
      description:
        'Feature-rich smartwatch with ECG monitoring, blood oxygen tracking, and 7-day battery life.',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      rating: { rate: 4.6, count: 189 },
      categoryId: electronics.id,
    },
    {
      title: '4K HDR Camera',
      price: 899.99,
      description:
        'Professional 4K camera with HDR support, optical image stabilization, and advanced autofocus system.',
      image:
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
      rating: { rate: 4.7, count: 142 },
      categoryId: electronics.id,
    },
    {
      title: 'Premium Leather Jacket',
      price: 599.99,
      description:
        'High-quality leather jacket with classic design, perfect for any occasion and weather.',
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
      rating: { rate: 4.9, count: 312 },
      categoryId: clothing.id,
    },
    {
      title: 'Evening Dress Collection',
      price: 349.99,
      description:
        'Elegant evening dress made from premium fabric, perfect for special occasions.',
      image:
        'https://images.unsplash.com/photo-1595777712802-51d24609991f?w=500&h=500&fit=crop',
      rating: { rate: 4.5, count: 203 },
      categoryId: clothing.id,
    },
    {
      title: 'Designer Sunglasses',
      price: 199.99,
      description:
        'Stylish designer sunglasses with UV protection and premium lens quality.',
      image:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
      rating: { rate: 4.4, count: 156 },
      categoryId: clothing.id,
    },
    {
      title: '18K Gold Necklace',
      price: 1299.99,
      description:
        'Exquisite 18K gold necklace with premium craftsmanship and elegant design.',
      image:
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
      rating: { rate: 4.9, count: 428 },
      categoryId: jewelery.id,
    },
    {
      title: 'Diamond Ring',
      price: 2499.99,
      description:
        'Beautiful diamond ring with premium certification and elegant white gold band.',
      image:
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
      rating: { rate: 5.0, count: 189 },
      categoryId: jewelery.id,
    },
    {
      title: 'Pearl Earrings',
      price: 449.99,
      description:
        'Elegant pearl earrings with 14K gold backing, perfect for both casual and formal wear.',
      image:
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
      rating: { rate: 4.7, count: 267 },
      categoryId: jewelery.id,
    },
    {
      title: 'JavaScript: The Good Parts',
      price: 39.99,
      description:
        'Essential guide to JavaScript programming by Douglas Crockford.',
      image:
        'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
      rating: { rate: 4.6, count: 512 },
      categoryId: books.id,
    },
    {
      title: 'React Complete Guide',
      price: 49.99,
      description:
        'Comprehensive guide to React framework covering all modern practices.',
      image:
        'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
      rating: { rate: 4.8, count: 634 },
      categoryId: books.id,
    },
    {
      title: 'Web Design Essentials',
      price: 44.99,
      description:
        'Complete guide to modern web design principles and best practices.',
      image:
        'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
      rating: { rate: 4.5, count: 389 },
      categoryId: books.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  // Crear usuario de prueba
  console.log('👤 Creating test user...')
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed_password_demo', // En producción, usar bcryptjs
      firstName: 'Test',
      lastName: 'User',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log(`   - 4 categories`)
  console.log(`   - 12 products`)
  console.log(`   - 1 test user`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
