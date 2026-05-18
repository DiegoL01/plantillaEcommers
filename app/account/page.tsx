'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, MapPin, PackageCheck, ReceiptText, User, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { logout } from '@/lib/features/userSlice'
import { formatPrice } from '@/lib/utils'

type AccountTab = 'orders' | 'profile'

interface CustomerOrder {
  id: number
  orderNumber: string
  items: Array<{
    id: number
    product: {
      id: number
      title: string
      image: string
    }
    quantity: number
    price: number
  }>
  total: number
  status: string
  createdAt: string
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

export default function AccountPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentUser: user } = useAppSelector((state) => state.user)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [activeTab, setActiveTab] = useState<AccountTab>('orders')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role === 'ADMIN') {
      router.push('/admin')
      return
    }

    const loadOrders = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
          },
        })

        if (!response.ok) {
          throw new Error('No se pudo cargar tu historial de compras')
        }

        setOrders(await response.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando pedidos')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [router, user])

  const orderStats = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
    const totalItems = orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    )

    return {
      totalSpent,
      totalItems,
      totalOrders: orders.length,
    }
  }, [orders])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  if (!user || user.role === 'ADMIN') {
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
            <h1 className="text-3xl font-bold">Mi cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Historial de compras, datos de perfil y resumen de actividad.
            </p>
          </div>
          <Link href="/">
            <Button>Seguir comprando</Button>
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <SummaryCard icon={ReceiptText} label="Pedidos" value={orderStats.totalOrders.toString()} />
          <SummaryCard icon={PackageCheck} label="Artículos comprados" value={orderStats.totalItems.toString()} />
          <SummaryCard icon={CreditCard} label="Total gastado" value={formatPrice(orderStats.totalSpent)} />
        </div>

        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            Compras
          </Button>
          <Button
            variant={activeTab === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveTab('profile')}
          >
            Perfil
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="h-40 animate-pulse rounded-md bg-muted" />
              ))
            ) : orders.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-lg font-semibold">Todavía no tienes compras</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cuando completes tu primer pedido aparecerá aquí.
                </p>
                <Link href="/" className="mt-4 inline-flex">
                  <Button>Explorar productos</Button>
                </Link>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{order.orderNumber}</p>
                        <Badge variant="outline">{statusLabel(order.status)}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                    <p className="text-xl font-bold">{formatPrice(order.total)}</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-md border p-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{item.product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.quantity * item.price)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Datos personales</h2>
              </div>
              <div className="space-y-4 text-sm">
                <ProfileRow label="Nombre" value={user.firstName} />
                <ProfileRow label="Apellido" value={user.lastName || 'No especificado'} />
                <ProfileRow label="Email" value={user.email} />
                <ProfileRow label="Tipo de cuenta" value={user.role} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Acciones</h2>
              </div>
              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Ir al checkout
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleLogout} className="w-full justify-start">
                  Cerrar sesión
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
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

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
