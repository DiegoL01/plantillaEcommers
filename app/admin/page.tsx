'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppSelector } from '@/lib/hooks'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  stock: number
}

interface SalesData {
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Array<{ status: string; _count: number }>
  topProducts: Array<{
    productId: number
    productTitle: string
    quantity: number
    revenue: number
  }>
  dailyRevenue: Array<{ date: string; revenue: number }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const user = useAppSelector((state) => state.user.currentUser)
  const [products, setProducts] = useState<Product[]>([])
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview')

  useEffect(() => {
    // Verify admin access
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, salesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/sales', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
          },
        }),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (salesRes.ok) {
        const salesDataResponse = await salesRes.json()
        setSalesData(salesDataResponse)
      }
    } catch (err) {
      setError('Error loading dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
        alert('Producto eliminado exitosamente')
      } else {
        alert('Error al eliminar el producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold text-red-600">
          Acceso denegado. Solo administradores.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Panel de Administrador</h1>
          <p className="text-gray-600">Bienvenido, {user.firstName}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'products'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Productos
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && salesData && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">
                  Total de Pedidos
                </h3>
                <p className="text-3xl font-bold">{salesData.totalOrders}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-gray-600 text-sm font-semibold mb-2">
                  Ingresos Totales
                </h3>
                <p className="text-3xl font-bold">
                  ${salesData.totalRevenue.toFixed(2)}
                </p>
              </Card>
            </div>

            {/* Orders by Status */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Pedidos por Estado</h2>
              <div className="space-y-2">
                {salesData.ordersByStatus.map((status) => (
                  <div key={status.status} className="flex justify-between items-center">
                    <span className="text-gray-600">{status.status}</span>
                    <span className="font-semibold">{status._count}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Products */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Top 10 Productos Más Vendidos</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-left">Cantidades Vendidas</th>
                      <th className="px-4 py-2 text-left">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.topProducts.map((product) => (
                      <tr key={product.productId} className="border-t">
                        <td className="px-4 py-3">{product.productTitle}</td>
                        <td className="px-4 py-3">{product.quantity}</td>
                        <td className="px-4 py-3">${product.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestionar Productos</h2>
              <Link href="/admin/products/new">
                <Button>+ Nuevo Producto</Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Título</th>
                    <th className="px-4 py-2 text-left">Categoría</th>
                    <th className="px-4 py-2 text-left">Precio</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{product.title}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
