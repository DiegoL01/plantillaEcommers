# 🚀 Configuración Completada - Próximos Pasos

## ✅ Lo que se ha completado

1. **Prisma instalado** ✓
2. **Schema.prisma creado** ✓ (Modelos: Category, Product, User, Order, OrderItem)
3. **Cliente Prisma configurado** ✓
4. **Rutas API creadas** ✓
   - `GET /api/products` - Lista todas los productos
   - `GET /api/products/[id]` - Obtiene un producto específico
   - `GET /api/categories` - Lista todas las categorías
5. **ProductSlice actualizado** ✓ - Usa las APIs locales
6. **Variables de entorno configuradas** ✓

## 📋 Pasos a ejecutar AHORA

### Paso 1: Ejecutar las migraciones

```bash
pnpm prisma:migrate
```

Este comando:
- Crea las tablas en tu base de datos Supabase
- Genera el cliente Prisma
- Crea un archivo de migración

### Paso 2: Agregar datos de prueba

Crea el archivo `prisma/seed.ts` con datos de ejemplo (ver abajo)

Luego ejecuta:
```bash
npx ts-node --require tsconfig-paths/register prisma/seed.ts
```

O agrega a package.json:
```json
"prisma": {
  "seed": "ts-node --require tsconfig-paths/register prisma/seed.ts"
}
```

Y ejecuta:
```bash
pnpm prisma db seed
```

### Paso 3: Ver los datos (opcional)

```bash
pnpm prisma:studio
```

## 📝 Datos que necesitas en Supabase

Para que el ecommerce funcione, debes tener:

### 1. **Categories (Mínimo 4)**
```sql
- electronics
- women's clothing
- jewelery  
- books
```

### 2. **Products (Mínimo 10 ejemplos)**
Cada producto necesita:
```
{
  title: "Nombre del producto",
  price: 99.99,
  description: "Descripción del producto",
  image: "https://url-de-imagen.com/image.jpg",
  rating: { rate: 4.5, count: 128 },
  categoryId: 1  // ID de la categoría
}
```

## 🌱 Archivo seed.ts de ejemplo

Crea `prisma/seed.ts` con este contenido:

```typescript
import { prisma } from '../lib/prisma'

async function main() {
  // Limpiar datos anteriores (opcional)
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})

  // Crear categorías
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
  const products = [
    {
      title: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      rating: { rate: 4.5, count: 128 },
      categoryId: electronics.id,
    },
    {
      title: 'Smart Watch',
      price: 249.99,
      description: 'Feature-rich smartwatch with heart rate monitor',
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      rating: { rate: 4.2, count: 95 },
      categoryId: electronics.id,
    },
    {
      title: 'Premium Jacket',
      price: 199.99,
      description: 'Stylish and comfortable premium quality jacket',
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
      rating: { rate: 4.8, count: 156 },
      categoryId: clothing.id,
    },
    {
      title: 'Gold Necklace',
      price: 299.99,
      description: '18K gold elegant necklace',
      image:
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
      rating: { rate: 4.9, count: 203 },
      categoryId: jewelery.id,
    },
    {
      title: 'JavaScript Guide',
      price: 49.99,
      description: 'Complete guide to JavaScript programming',
      image:
        'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
      rating: { rate: 4.6, count: 87 },
      categoryId: books.id,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Database seeded with categories and products!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## ⚙️ Configuración de credenciales

Las credenciales están en `.env.local`:
```
DATABASE_URL=postgresql://postgres:ecomers/2004@db.wnapujsomylbekzvjaub.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://wnapujsomylbekzvjaub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xUocfNpC648x09_8jlIG2A_Off9fQLC
```

⚠️ **IMPORTANTE**: Cambiar la contraseña `ecomers/2004` en Supabase después de hacer pruebas.

## 🧪 Probar la conexión

```bash
npx prisma db execute --stdin < /dev/null
```

O simplemente ejecuta:
```bash
pnpm prisma:studio
```

Si se abre correctamente, la conexión está OK.

## 🔄 Desarrollo

Mientras desarrollas:
```bash
pnpm run dev
```

Las APIs estarán disponibles en:
- http://localhost:3000/api/products
- http://localhost:3000/api/categories
- http://localhost:3000/api/products/[id]

## 📚 Referencias

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Ejecuta `pnpm prisma:migrate` como siguiente paso** 🚀
