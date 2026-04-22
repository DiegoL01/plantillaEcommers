# 🚀 Guía Rápida - Sistema de Roles y Admin

## ⚡ 3 Pasos para Activar Admin

### Paso 1: Ejecutar Migration Prisma

```bash
cd /home/diego/Escritorio/plantillaEcommers
pnpm prisma migrate dev --name add_user_roles
```

**Qué hace:** Agrega el campo `role` a tabla Users y crea la estructura necesaria.

---

### Paso 2: Seedear Base de Datos

```bash
pnpm prisma db seed
```

**Qué crea:**
- ✅ **Admin User:** `admin@luxe.com` / `admin12345`
- ✅ **Test Customer:** `test@example.com` / `test12345`
- ✅ **4 Categorías** (Electronics, Clothing, Jewelry, Books)
- ✅ **12 Productos** con stock aleatorio
- ✅ Todas las contraseñas encriptadas con bcryptjs

---

### Paso 3: Iniciar aplicación

```bash
pnpm dev
```

Abre: http://localhost:3000

---

## 🔐 Acceso a Dashboards

### Admin Dashboard
**URL:** http://localhost:3000/admin

1. Ir a `/login`
2. Ingresar: `admin@luxe.com` / `admin12345`
3. Se abre automáticamente `/admin`

**Funciones Admin:**
- 📊 Ver estadísticas de ventas
- 📦 Gestionar productos (crear, editar, eliminar)
- 📈 Ver top 10 productos más vendidos
- 📊 Ver ingresos diarios

### User Dashboard
**URL:** http://localhost:3000/user

1. Ir a `/login`
2. Registrarse con nuevo email (o usar `test@example.com` / `test12345`)
3. Se abre automáticamente `/user`

**Funciones Usuario:**
- 📋 Ver historial de compras
- 👤 Ver información de perfil
- 🛒 Acceder al carrito (desde home
- 🚪 Cerrar sesión

---

## 📁 Archivos Nuevos Agregados

```
app/
├── admin/                          # Dashboard administrador
│   ├── page.tsx                    # Main admin dashboard
│   └── products/[id]/page.tsx      # Crear/Editar productos
├── user/                           # Dashboard usuario/cliente
│   └── page.tsx                    # Historial de compras y perfil
└── api/
    ├── auth/
    │   ├── login/route.ts          # Login endpoint
    │   └── register/route.ts       # Register endpoint
    ├── admin/
    │   └── sales/route.ts          # Sales statistics
    └── orders/route.ts             # User orders

lib/
├── auth.ts                         # Auth helper functions
└── features/userSlice.ts           # Updated Redux user store

types/
└── index.ts                        # Added UserRole type

ADMIN_SETUP.md                      # Documentación completa
```

---

## 🔑 Variables de Entorno

Crear archivo `.env.local`:

```env
# Base de datos (debe estar ya configurada)
DATABASE_URL=postgresql://...

# JWT Secret (cambiar en producción)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🎯 Casos de Uso

### Crear Producto (Admin)
1. `/admin` → Pestaña "Productos" → "+ Nuevo Producto"
2. Llenar formulario
3. Hacer click en "Crear Producto"

### Editar Producto (Admin)
1. `/admin` → Pestaña "Productos" → Botón "Editar"
2. Modificar campos
3. Hacer click en "Actualizar Producto"

### Eliminar Producto (Admin)
1. `/admin` → Pestaña "Productos" → Botón "Eliminar"
2. Confirmar en alerta

### Ver Compras (Cliente)
1. `/user` → Pestaña "Mis Pedidos"
2. Ver lista de todos los pedidos
3. Click para expandir detalles

---

## ✅ Checklist Post-Setup

- [ ] Migration ejecutada (`prisma migrate dev`)
- [ ] Seed completado (`prisma db seed`)
- [ ] Servidor iniciado (`pnpm dev`)
- [ ] Login funciona con admin
- [ ] Dashboard admin carga
- [ ] Dashboard usuario carga
- [ ] Crear producto funciona
- [ ] Editar producto funciona
- [ ] Eliminar producto funciona

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
**Solución:** Verificar que la BD PostgreSQL está corriendo

### Error: "Unauthorized - Admin role required"
**Solución:** Token inválido o usuario no es admin. Vuelve a login

### Error: "Migration already exists"
**Solución:** La migration ya fue aplicada. Continúa al paso 2

### Página en blanco después de login
**Solución:** 
1. Abre console (F12)
2. Verifica que el token está en localStorage: `localStorage.getItem('auth-token')`
3. Verifica el rol del usuario: `JSON.parse(localStorage.getItem('luxe-user')).role`

---

## 📚 Documentación Completa

Ver `ADMIN_SETUP.md` para:
- Endpoints API detallados
- Arquitectura de seguridad
- Variantes de autenticación
- Mejoras futuras sugeridas
- Preguntas frecuentes

---

## 🎨 Flujos Implementados

### Admin Flow
```
/login (admin@luxe.com)
    ↓
/admin (Redirect automático)
    ├─→ Resumen (Estadísticas)
    └─→ Productos (CRUD)
```

### Customer Flow
```
/login (Registrarse o login)
    ↓
/user (Redirect automático)
    ├─→ Mis Pedidos (Historial)
    └─→ Mi Perfil (Info + Logout)
```

---

## 🔒 Seguridad Implementada

✅ Contraseñas encriptadas con bcryptjs  
✅ JWT Tokens con expiración de 7 días  
✅ Validación de token en cada request  
✅ Validación de rol en endpoints  
✅ Headers de seguridad en API calls  
✅ LocalStorage para token persistencia  

---

## 📞 Próximos Pasos (Opcional)

1. **Middleware de Next.js** - Para proteger rutas automáticamente
2. **Gráficos** - Charts.js para estadísticas visuales
3. **Notificaciones** - Toast notifications para acciones admin
4. **Editar perfil** - Permitir usuarios cambiar contraseña
5. **Roles adicionales** - Moderador, Soporte, etc.

---

**¡Listo para usar! 🚀**

Cualquier pregunta, revisa `ADMIN_SETUP.md` o los archivos de código comentados.
