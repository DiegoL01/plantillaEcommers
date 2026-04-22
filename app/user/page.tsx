'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppSelector } from '@/lib/hooks'

interface OrderItem {
  id: number
  product: {
    title: string
    price: number
    image: string
  }
  quantity: number
  price: number
}

interface Order {
  id: number
  orderNumber: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

export default function UserDashboard() {
  const router = useRouter()
  const user = useAppSelector((state) => state.user.currentUser)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')

  useEffect(() => {
    // Verify user is logged in
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role === 'ADMIN') {
      router.push('/admin')
      return
    }

    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })

      if (response.ok) {
        const ordersData = await response.json()
        setOrders(ordersData)
      } else if (response.status === 404) {
        setOrders([])
      }
    } catch (err) {
      setError('Error loading orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">
          Por favor inicia sesión
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mi Cuenta</h1>
          <p className="text-gray-600">Bienvenido, {user.firstName}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Mis Pedidos
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Mi Perfil
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mis Pedidos</h2>
              <Link href="/">
                <Button>Continuar Comprando</Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">
                  No tienes pedidos aún
                </p>
                <Link href="/">
                  <Button>Explorar Productos</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Número de Pedido</p>
                        <p className="font-semibold">{order.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Estado</p>
                        <p className="font-semibold capitalize">{order.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Fecha</p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t pt-4 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 pb-3 border-b last:border-b-0"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{item.product.title}</p>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-end">
                      <div className="text-right">
                        <p className="text-gray-600 mb-1">Total del Pedido</p>
                        <p className="text-2xl font-bold">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Información de Perfil</h2>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Nombre
                  </label>
                  <p className="text-lg">{user.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Apellido
                  </label>
                  <p className="text-lg">{user.lastName || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Email
                  </label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Tipo de Cuenta
                  </label>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button variant="secondary" className="w-full">
                  Editar Perfil
                </Button>
              </div>
            </Card>

            <div className="mt-8">
              <Button
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem('auth-token')
                  localStorage.removeItem('luxe-user')
                  router.push('/login')
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
