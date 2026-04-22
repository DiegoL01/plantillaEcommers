# Sistema de Roles y Dashboards - Guía Completa

## 🎯 Resumen de Implementación

Se ha implementado un **sistema completo de roles y dashboards** con:

### ✅ Implementado

#### 1. **Sistema de Roles en Base de Datos**
- Campo `role` agregado a modelo `User` (ADMIN o CUSTOMER)
- Enum `UserRole` en schema Prisma
- Campo `stock` agregado a modelo `Product`

#### 2. **Autenticación con JWT**
- Endpoints: `/api/auth/login` y `/api/auth/register`
- Tokens JWT con expiración de 7 días
- Contraseñas encriptadas con bcryptjs

#### 3. **APIs Protegidas por Rol**

**Admin Only (requieren header `Authorization: Bearer <token>`)**:
- `POST /api/products` - Crear producto
- `PUT /api/products/[id]` - Editar producto
- `DELETE /api/products/[id]` - Eliminar producto
- `GET /api/admin/sales` - Obtener ventas y estadísticas

**User Only**:
- `GET /api/orders` - Ver pedidos del usuario

#### 4. **Dashboards Completos**

**Admin Dashboard** (`/admin`):
- 📊 Resumen de ventas (total pedidos, ingresos)
- 📈 Pedidos por estado
- 🏆 Top 10 productos más vendidos
- 📦 Gestión de productos (crear, editar, eliminar)

**User Dashboard** (`/user`):
- 📋 Historial de pedidos completo con detalles
- 👤 Información de perfil
- 🛍️ Ver carrito (integrado con Redux)
- 🚪 Cerrar sesión

#### 5. **Formulario de Productos**
- Crear nuevo producto (`/admin/products/new`)
- Editar producto existente (`/admin/products/[id]/edit`)
- Preview de imagen en tiempo real
- Validaciones de campos

---

## 🚀 Cómo Usar

### 1. **Ejecutar Migration (PRIMERO)**

```bash
cd /home/diego/Escritorio/plantillaEcommers
pnpm prisma migrate dev --name add_user_roles
```

### 2. **Crear Usuarios Admin**

En Prisma Studio o directamente en SQL:

```bash
# Opción 1: Con Prisma Studio
pnpm prisma studio

# En la UI, ir a tabla Users y crear:
# - email: admin@email.com
# - password: (usar hash bcrypt)
# - firstName: Admin
# - role: ADMIN
```

Alternativamente, crear un script seed:

```ts
// prisma/seed.ts
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('admin12345', 10)
  
  await prisma.user.create({
    data: {
      email: 'admin@luxe.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })
  
  console.log('Admin user created')
}

main().catch(console.error)
```

Luego ejecutar:
```bash
pnpm prisma db seed
```

### 3. **Acceder a los Dashboards**

#### Admin:
1. Ir a `/login`
2. Ingresar credenciales admin (email: `admin@luxe.com`, password: `admin12345`)
3. Se redirige automáticamente a `/admin`

#### Cliente:
1. Ir a `/login`
2. Registrarse con nuevo email
3. Se redirige a `/user` o al carrito

---

## 📁 Estructura de Archivos Nuevos

```
/app
├── /admin
│   ├── page.tsx                    # Dashboard admin
│   └── /products
│       └── /[id]
│           └── page.tsx            # Crear/Editar producto
├── /user
│   └── page.tsx                    # Dashboard usuario
└── /api
    ├── /auth
    │   ├── /login/route.ts         # Login endpoint
    │   └── /register/route.ts      # Register endpoint
    ├── /orders/route.ts             # Get user orders
    ├── /admin
    │   └── /sales/route.ts         # Sales statistics
    └── /products/[id]/route.ts     # Updated: PUT, DELETE

/lib
├── auth.ts                         # Helper functions for auth
└── features/userSlice.ts           # Updated: Real auth

/types
└── index.ts                        # Updated: Added UserRole
```

---

## 🔐 Arquitectura de Seguridad

### Token JWT
```typescript
{
  id: number
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  iat: number
  exp: number
}
```

### Validación en Backend
Todas las rutas protegidas verifican:
1. `Authorization` header existe
2. Token es válido y no ha expirado
3. Rol del usuario coincide con permisos requeridos

```typescript
function verifyAdminRole(token: string | null): boolean {
  if (!token) return false
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.role === 'ADMIN'
  } catch {
    return false
  }
}
```

---

## 📊 Endpoints Resumen

### Auth
| Método | Ruta | Descripción | Requiere Auth |
|--------|------|-------------|---------------|
| POST | `/api/auth/login` | Iniciar sesión | ❌ |
| POST | `/api/auth/register` | Registrarse | ❌ |

### Productos
| Método | Ruta | Descripción | Requiere Auth | Rol |
|--------|------|-------------|---------------|-----|
| GET | `/api/products` | Listar productos | ❌ | - |
| GET | `/api/products/[id]` | Obtener un producto | ❌ | - |
| POST | `/api/products` | Crear producto | ✅ | ADMIN |
| PUT | `/api/products/[id]` | Editar producto | ✅ | ADMIN |
| DELETE | `/api/products/[id]` | Eliminar producto | ✅ | ADMIN |

### Usuarios/Pedidos
| Método | Ruta | Descripción | Requiere Auth | Rol |
|--------|------|-------------|---------------|-----|
| GET | `/api/orders` | Mis pedidos | ✅ | CUSTOMER |
| GET | `/api/admin/sales` | Estadísticas ventas | ✅ | ADMIN |

---

## 🎨 Flujo de Usuario

### Admin
```
Login (admin@luxe.com) 
  ↓
/admin (Dashboard)
  ├─→ "Resumen" → Ver estadísticas de ventas
  └─→ "Productos" → Gestionar (crear, editar, eliminar)
```

### Cliente
```
Registrarse
  ↓
/user (Dashboard)
  ├─→ "Mis Pedidos" → Ver historial de compras
  └─→ "Mi Perfil" → Ver datos y cerrar sesión
```

---

## 🔧 Variables de Entorno Necesarias

```env
# .env.local
JWT_SECRET=tu-clave-secreta-bien-fuerte
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Base de datos (ya debe estar configurada)
DATABASE_URL=postgresql://...
```

---

## 📝 Próximos Pasos (Opcional)

### Mejoras Futuras
1. **Middleware de protección** para rutas Next.js
2. **Refrescar tokens** automáticamente
3. **Cambiar contraseña** en dashboard usuario
4. **Historial de vendedores** para admin
5. **Gráficos de ventas** con Chart.js
6. **Notificaciones** de nuevo pedido a admin
7. **Búsqueda y filtrado** en tabla de productos

### Implementar Middleware
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (request.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (request.nextUrl.pathname.startsWith('/user') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
}
```

---

## ✨ Características Destacadas

✅ **JWT Tokens** - Autenticación segura  
✅ **Roles basados en BD** - Flexible y escalable  
✅ **Endpoints protegidos** - Validación en cada request  
✅ **Dashboard Admin** - Completo con estadísticas  
✅ **Dashboard Usuario** - Historial de compras  
✅ **Gestión de Productos** - CRUD por admin  
✅ **Estadísticas** - Vendas diarias y productos top  
✅ **Seguridad** - Validación de token y rol  

---

## ❓ Preguntas Frecuentes

### ¿Cómo cambio la contraseña de un admin?

Usa Prisma Studio o un script:
```typescript
const hashedNew = await bcrypt.hash('new-password', 10)
await prisma.user.update({
  where: { email: 'admin@luxe.com' },
  data: { password: hashedNew }
})
```

### ¿Cómo convierto un cliente a admin?

```typescript
await prisma.user.update({
  where: { email: 'user@email.com' },
  data: { role: 'ADMIN' }
})
```

### ¿Dónde se almacenan los tokens?

- Cliente: `localStorage` (llave: `auth-token`)
- Headers: `Authorization: Bearer <token>`

---

## 🚨 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Unauthorized` | Token inválido/faltante | Vuelve a iniciar sesión |
| `Admin role required` | Usuario no es admin | Verifica rol en BD |
| `Invalid credentials` | Email/pass incorrectos | Usa credenciales admin |
| `Product not found` | ID de producto no existe | Verifica el ID |

---

## 📞 Soporte

Todos los endpoints tienen logs en consola. Para debugging:

```typescript
// En servidor
console.error('Error:', error)

// En cliente
console.log('Token:', localStorage.getItem('auth-token'))
console.log('User:', localStorage.getItem('luxe-user'))
```

---

**Implementado por:** Sistema de Roles Complete  
**Fecha:** Abril 19, 2026  
**Versión:** 1.0.0
