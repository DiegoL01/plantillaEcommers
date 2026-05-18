'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  DollarSign,
  type LucideIcon,
  ReceiptText,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppSelector } from '@/lib/hooks'
import { formatPrice } from '@/lib/utils'

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users'

interface SalesData {
  totalOrders: number
  totalUsers: number
  lowStockCount: number
  totalRevenue: number
  ordersByStatus: Array<{ status: string; _count: number }>
  topProducts: Array<{
    productId: number
    productTitle: string
    quantity: number
    revenue: number
  }>
  lowStockProducts: Array<{
    id: number
    title: string
    category: string
    stock: number
  }>
}

interface AdminProduct {
  id: number
  title: string
  price: number
  category: string
  image: string
  stock: number
  RatingRate: number
  RatingCount: number
}

interface AdminOrder {
  id: number
  orderNumber: string
  total: number
  status: string
  createdAt: string
  customer: {
    email: string
    firstName: string
    lastName?: string
  }
  items: Array<{
    id: number
    quantity: number
    price: number
    product: {
      title: string
    }
  }>
}

interface AdminUser {
  id: number
  email: string
  firstName: string
  lastName?: string
  role: 'ADMIN' | 'CUSTOMER'
  createdAt: string
  orderCount: number
  totalSpent: number
}

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Productos' },
  { id: 'orders', label: 'Pedidos' },
  { id: 'users', label: 'Usuarios' },
]

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  }

  return labels[status] || status
}

export default function AdminDashboard() {
  const router = useRouter()
  const user = useAppSelector((state) => state.user.currentUser)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [sales, setSales] = useState<SalesData | null>(null)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'ADMIN') {
      router.push('/account')
      return
    }

    const loadAdminData = async () => {
      try {
        setLoading(true)
        setError(null)

        const headers = getAuthHeaders()
        const [salesResponse, productsResponse, ordersResponse, usersResponse] =
          await Promise.all([
            fetch('/api/admin/sales', { headers }),
            fetch('/api/products'),
            fetch('/api/admin/orders', { headers }),
            fetch('/api/admin/users', { headers }),
          ])

        if (!salesResponse.ok || !productsResponse.ok || !ordersResponse.ok || !usersResponse.ok) {
          throw new Error('No se pudo cargar la información administrativa')
        }

        const [salesData, productsData, ordersData, usersData] = await Promise.all([
          salesResponse.json(),
          productsResponse.json(),
          ordersResponse.json(),
          usersResponse.json(),
        ])

        setSales(salesData)
        setProducts(productsData)
        setOrders(ordersData)
        setUsers(usersData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando el dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [router, user])

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders])

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Administración</h1>
            <p className="text-sm text-muted-foreground">
              Ventas, pedidos, stock, productos y usuarios.
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button>Nuevo producto</Button>
          </Link>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && sales && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <MetricCard icon={DollarSign} label="Ventas" value={formatPrice(sales.totalRevenue)} />
                  <MetricCard icon={ReceiptText} label="Pedidos" value={sales.totalOrders.toString()} />
                  <MetricCard icon={Users} label="Usuarios" value={sales.totalUsers.toString()} />
                  <MetricCard icon={AlertTriangle} label="Stock bajo" value={sales.lowStockCount.toString()} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Pedidos recientes</h2>
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{statusLabel(order.status)}</Badge>
                            <p className="mt-1 text-sm font-semibold">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      ))}
                      {recentOrders.length === 0 && (
                        <p className="text-sm text-muted-foreground">No hay pedidos todavía.</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Stock bajo</h2>
                    <div className="space-y-3">
                      {sales.lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                            {product.stock} unidades
                          </Badge>
                        </div>
                      ))}
                      {sales.lowStockProducts.length === 0 && (
                        <p className="text-sm text-muted-foreground">No hay productos con stock bajo.</p>
                      )}
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Productos más vendidos</h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {sales.topProducts.map((product) => (
                      <div key={product.productId} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <p className="font-medium">{product.productTitle}</p>
                          <p className="text-sm text-muted-foreground">{product.quantity} unidades vendidas</p>
                        </div>
                        <p className="font-semibold">{formatPrice(product.revenue)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'products' && (
              <Card className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50 text-left">
                      <tr>
                        <th className="p-4">Producto</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Precio</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b last:border-0">
                          <td className="p-4 font-medium">{product.title}</td>
                          <td className="p-4">{product.category}</td>
                          <td className="p-4">{formatPrice(product.price)}</td>
                          <td className="p-4">
                            <Badge variant={product.stock <= 10 ? 'destructive' : 'secondary'}>
                              {product.stock}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="outline" size="sm">Editar</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <p className="font-semibold">{order.orderNumber}</p>
                          <Badge variant="outline">{statusLabel(order.status)}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {order.customer.firstName} {order.customer.lastName || ''} · {order.customer.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                    </div>
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="rounded-md border p-3 text-sm">
                          <p className="font-medium">{item.product.title}</p>
                          <p className="text-muted-foreground">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <Card className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50 text-left">
                      <tr>
                        <th className="p-4">Usuario</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Pedidos</th>
                        <th className="p-4">Gastado</th>
                        <th className="p-4">Alta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((customer) => (
                        <tr key={customer.id} className="border-b last:border-0">
                          <td className="p-4">
                            <p className="font-medium">{customer.firstName} {customer.lastName || ''}</p>
                            <p className="text-muted-foreground">{customer.email}</p>
                          </td>
                          <td className="p-4">
                            <Badge variant={customer.role === 'ADMIN' ? 'default' : 'secondary'}>{customer.role}</Badge>
                          </td>
                          <td className="p-4">{customer.orderCount}</td>
                          <td className="p-4">{formatPrice(customer.totalSpent)}</td>
                          <td className="p-4">{new Date(customer.createdAt).toLocaleDateString('es-ES')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  )
}
