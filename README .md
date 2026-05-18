

# Luxe Ecommerce

Plataforma de comercio electrónico premium desarrollada con tecnologías modernas del ecosistema React y Next.js.  
Ofrece una experiencia completa de compra, gestión administrativa y autenticación segura, lista para escalar en producción.

---

## Características principales

### Catálogo y búsqueda
- Listado de productos con imagen, precio, descripción, categoría, valoración y stock.
- Página principal con todos los productos.
- Filtros por categoría, rango de precio (mínimo/máximo) y ordenamiento.
- Búsqueda de productos desde la interfaz.
- Página de detalle de producto en ruta dinámica `/product/[id]`.
- Productos relacionados por categoría en la vista de detalle.

### Carrito y proceso de compra
- Carrito de compras manejado con **Redux Toolkit**.
- Agregar productos desde las tarjetas y desde la página de detalle.
- Checkout autenticado (requiere inicio de sesión).
- Creación de pedidos reales en la base de datos (tabla `Order`).
- Descuento automático del stock al confirmar un pedido.
- Integración parcial con Stripe (SDK configurado, pago en preparación).

### Usuarios y autenticación
- Registro e inicio de sesión con validación.
- Roles de usuario: `ADMIN` y `CUSTOMER`.
- Usuario administrador creado mediante seed.
- Historial de pedidos del cliente en `/account`.
- Perfil de usuario con información básica.

### Panel de administración
- Dashboard con métricas: total de ventas, pedidos, usuarios y productos con bajo stock.
- Gestión completa de productos (crear, editar, eliminar).
- Vista administrativa de todos los pedidos.
- Vista de usuarios registrados con cantidad de pedidos y total gastado.
- Acceso exclusivo para administradores mediante token Bearer.

### Tema y estética
- Soporte para **tema claro/oscuro**.
- Componentes UI reutilizables construidos con Tailwind CSS.
- Iconografía con `lucide-react`.

---

## Stack tecnológico

| Tecnología                | Uso                               |
|---------------------------|-----------------------------------|
| Next.js 16 (App Router)   | Framework de React y routing      |
| React 19                  | Biblioteca de interfaces          |
| TypeScript                | Tipado estático                   |
| Tailwind CSS              | Estilos utilitarios               |
| Redux Toolkit             | Estado global del carrito         |
| Prisma ORM 7              | Modelado y consultas a la BD      |
| PostgreSQL / Supabase     | Base de datos relacional          |
| bcryptjs                  | Hash de contraseñas               |
| jsonwebtoken / jwt-decode | Autenticación y manejo de JWT     |
| lucide-react              | Iconos                            |
| Stripe SDK                | (Preparación) Integración de pagos|

---

## Estructura del proyecto
luxe-ecommerce/
├── app/ # Router de Next.js (App Router)
│ ├── api/ # Endpoints internos (REST API)
│ ├── (auth)/ # Rutas de login y registro
│ ├── cart/ # Página del carrito
│ ├── checkout/ # Página de checkout
│ ├── product/[id]/ # Página de detalle de producto
│ ├── account/ # Historial y perfil del cliente
│ └── admin/ # Panel de administración
├── components/ # Componentes reutilizables de la UI
│ └── ui/ # Componentes base (botones, inputs, modales)
├── lib/ # Lógica compartida y configuración
│ ├── features/ # Slices de Redux (carrito)
│ ├── prisma.ts # Instancia del cliente Prisma
│ └── auth.ts # Funciones de autenticación (JWT)
├── prisma/ # Esquema de Prisma, migraciones y seed
├── types/ # Definiciones de tipos e interfaces TypeScript
├── hooks/ # Hooks personalizados
└── .env.example # Plantilla de variables de entorno

*********

---

## Modelo de datos

### Enums
- `UserRole`: `ADMIN`, `CUSTOMER`
- `OrderStatus`: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### Tablas principales

- **Category**  
  `id`, `name`, `slug`, productos asociados

- **Product**  
  `id`, `name`, `description`, `price`, `image`, `categoryId`, `stock`, `rating`  
  (se relaciona con `Category`)

- **User**  
  `id`, `name`, `email`, `password` (hash), `role`, `createdAt`

- **Order**  
  `id`, `userId`, `status`, `total`, `createdAt`  
  (relación uno a muchos con `OrderItem`)

- **OrderItem**  
  `id`, `orderId`, `productId`, `quantity`, `price`

Las relaciones están modeladas en el esquema de Prisma (`prisma/schema.prisma`).

---

## Endpoints API

Todas las rutas están bajo `/api`. Las que requieren autenticación incluyen el encabezado `Authorization: Bearer <token>`.

| Método | Ruta                     | Descripción                      | Auth requerida | Rol        |
|--------|--------------------------|----------------------------------|----------------|------------|
| POST   | `/api/auth/login`        | Iniciar sesión                   | No             | -          |
| POST   | `/api/auth/register`     | Registrar nuevo usuario          | No             | -          |
| GET    | `/api/products`          | Listar productos (con filtros)   | No             | -          |
| GET    | `/api/products/[id]`     | Obtener un producto              | No             | -          |
| POST   | `/api/products`          | Crear producto                   | Sí (admin)     | ADMIN      |
| PUT    | `/api/products/[id]`     | Actualizar producto              | Sí (admin)     | ADMIN      |
| DELETE | `/api/products/[id]`     | Eliminar producto                | Sí (admin)     | ADMIN      |
| GET    | `/api/categories`        | Listar categorías                | No             | -          |
| GET    | `/api/orders`            | Obtener pedidos del usuario      | Sí (cliente)   | CUSTOMER   |
| POST   | `/api/orders`            | Crear un nuevo pedido            | Sí (cliente)   | CUSTOMER   |
| GET    | `/api/admin/sales`       | Métricas de ventas               | Sí (admin)     | ADMIN      |
| GET    | `/api/admin/orders`      | Todos los pedidos (admin)        | Sí (admin)     | ADMIN      |
| GET    | `/api/admin/users`       | Lista de usuarios con estadísticas| Sí (admin)     | ADMIN      |

---

## Rutas principales del frontend

| Ruta                  | Descripción                                |
|-----------------------|--------------------------------------------|
| `/`                   | Página principal (listado de productos)    |
| `/login`              | Inicio de sesión                           |
| `/cart`               | Carrito de compras                         |
| `/checkout`           | Finalizar compra (requiere autenticación)  |
| `/product/[id]`       | Detalle de producto                        |
| `/account`            | Perfil e historial de pedidos del cliente  |
| `/admin`              | Dashboard del administrador                |
| `/admin/products/new` | Crear nuevo producto                       |
| `/admin/products/[id]`| Editar producto existente                  |

---

## Instalación y configuración

### Prerrequisitos

- Node.js >= 20
- pnpm (se recomienda instalarlo globalmente)
- Cuenta en [Supabase](https://supabase.com) (o instancia PostgreSQL)
- Stripe (opcional, para futura integración de pagos)

### Pasos

1. **Clonar el repositorio**
   ```bash 
   git clone https://github.com/DiegoL01/plantillaEcommers.git  
   cd luxe-ecommerce 
   ```
2.  Instalar dependencias
   ```bash
     pnpm install
   ```
3.Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores reales.     
    ```
    cp .env.example .env 
    Ejemp de env :
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&uselibpqcompat=true&sslmode=require"
    DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"
    JWT_SECRET="your-secret"
    STRIPE_SECRET_KEY="your-stripe-secret"
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-public-key"
    ```

4.Generar el cliente de Prisma
```bash
pnpm prisma:migrate
```
5.Ejecutar migraciones
```
pnpm prisma:migrate
```
6.Poblar la base de datos (seed)
```bash
npx tsx --env-file=.env prisma/seed.ts
```
⚠️ El seed elimina los datos existentes e inserta categorías, productos, un usuario administrador y un cliente de prueba.
7.Iniciar servidor de desarrollo
```bash
pnpm run dev
```
La aplicación estará disponible en http://localhost:3000.

## Scripts disponibles

Definidos en `package.json`:

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia Next.js en modo desarrollo |
| `pnpm build` | Compila la aplicación para producción |
| `pnpm start` | Inicia la versión compilada |
| `pnpm lint` | Ejecuta el linter (ESLint) |
| `pnpm prisma:migrate` | Aplica nuevas migraciones de Prisma |
| `pnpm prisma:studio` | Abre Prisma Studio en el navegador |
| `pnpm prisma:generate` | Genera el cliente de Prisma |
| `pnpm prisma:reset` | Resetea la base de datos (borra y recrea) |

## Usuarios de prueba

Tras ejecutar el seed, puedes usar estas credenciales para iniciar sesión:

| Rol | Correo electrónico | Contraseña |
|-----|--------------------|------------|
| Administrador | `admin@luxe.com` | `admin12345` |
| Cliente de prueba | `test@example.com` | `test12345` |
## Notas técnicas

### Conexión a Supabase

- `DATABASE_URL` se usa como conexión principal a través del pooler de Supabase (puerto 6543).
- `DIRECT_URL` establece una conexión directa (puerto 5432), necesaria para migraciones y seed.
- Si encuentras errores de SSL o compatibilidad, asegúrate de que `DATABASE_URL` incluya `pgbouncer=true&uselibpqcompat=true`.

### Seed de base de datos

El script `prisma/seed.ts` vacía las tablas existentes (`deleteMany`) antes de insertar los datos de ejemplo. Ejecútalo solo en entornos de desarrollo o staging.

### Seguridad

- No subas credenciales reales al repositorio. El archivo `.env` está listado en `.gitignore`.
- Las rutas administrativas verifican el token JWT y el rol `ADMIN` antes de procesar cualquier solicitud.

### Stripe

La integración con Stripe está parcialmente implementada. Las claves en el `.env` permiten preparar la lógica de cobro, aunque el flujo de pago no esta completo.

### Prisma y TypeScript

El cliente de Prisma se genera desde `prisma/schema.prisma`. Cada cambio en el esquema requiere generar de nuevo el cliente y, si corresponde, crear una migración.