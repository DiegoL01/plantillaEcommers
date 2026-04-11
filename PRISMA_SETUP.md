# Configuración de Prisma con Supabase

## ✅ Lo que ya está hecho

1. **Instalado Prisma** - `@prisma/client` y `prisma` CLI
2. **Creado schema.prisma** - Con modelos de:
   - `Category` - Categorías de productos
   - `Product` - Productos con detalles
   - `User` - Usuarios del sistema
   - `Order` - Órdenes de compra
   - `OrderItem` - Items en las órdenes

3. **Creado cliente Prisma** - En `/lib/prisma.ts`
4. **Creadas rutas API**:
   - `GET /api/products` - Obtiene todos los productos
   - `GET /api/categories` - Obtiene todas las categorías
5. **Actualizado productSlice** - Usa las APIs locales en vez de fakestoreapi

## 🚀 Próximos pasos

### 1. Ejecutar las migraciones de Prisma

```bash
pnpm prisma migrate dev --name init
```

Este comando:
- Crea las tablas en Supabase
- Genera el cliente Prisma
- Crea archivo de migración

### 2. Agregar datos de prueba (seed)

Crea el archivo `prisma/seed.ts`:

```typescript
import { prisma } from '../lib/prisma'

async function main() {
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
  await prisma.product.create({
    data: {
      title: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://via.placeholder.com/300',
      rating: { rate: 4.5, count: 128 },
      categoryId: electronics.id,
    },
  })

  // Crear más productos según necesites
  console.log('✅ Database seeded!')
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

Luego ejecuta:
```bash
pnpm prisma db seed
```

### 3. Ver los datos en Prisma Studio (opcional)

```bash
pnpm prisma studio
```

Esto abre una interfaz en http://localhost:5555 para administrar los datos.

## 📊 Estructura de datos esperada

### Categories (Tabla: categories)
- `id` - Integer (PK)
- `name` - String (único)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Products (Tabla: products)
- `id` - Integer (PK)
- `title` - String
- `price` - Decimal(10,2)
- `description` - Text
- `image` - String (URL)
- `rating` - JSON { rate: Float, count: Int }
- `categoryId` - Integer (FK → categories)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Users (Tabla: users)
- `id` - Integer (PK)
- `email` - String (único)
- `password` - String (hasheada)
- `firstName` - String
- `lastName` - String (nullable)
- `avatar` - String (nullable, URL)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### Orders (Tabla: orders)
- `id` - Integer (PK)
- `orderNumber` - String (único)
- `userId` - Integer (FK → users)
- `total` - Decimal(10,2)
- `status` - Enum (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Shipping info: firstName, lastName, email, address, city, postalCode, country
- `createdAt` - DateTime
- `updatedAt` - DateTime

## 🔧 Script package.json

Agrega estos scripts al `package.json`:

```json
{
  "scripts": {
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:generate": "prisma generate",
    "prisma:reset": "prisma migrate reset"
  }
}
```

## ⚠️ Datos que ya proporcione

Tu conexión a Supabase está configurada en `.env.local`:
- `DATABASE_URL` - Cadena de conexión PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL` - URL del proyecto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clave pública

## ❓ Preguntas frecuentes

**P: ¿Qué contraseña usaste para Supabase?**
R: `ecomers/2004` (cambiar en producción)

**P: ¿Cómo creo más rutas API?**
R: Sigue el patrón en `/app/api/products/route.ts` y `/app/api/categories/route.ts`

**P: ¿Cómo agrego autenticación?**
R: Necesitaremos crear rutas de registro/login que hasheen contraseñas con `bcryptjs`
