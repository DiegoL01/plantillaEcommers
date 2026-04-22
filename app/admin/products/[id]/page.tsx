'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppSelector } from '@/lib/hooks'

interface Category {
  id: number
  name: string
}

interface ProductFormData {
  title: string
  price: string
  description: string
  image: string
  categoryId: string
  stock: string
}

export default function ProductForm() {
  const router = useRouter()
  const params = useParams()
  const user = useAppSelector((state) => state.user.currentUser)
  const isEditing = params.id !== 'new'
  const productId = isEditing ? params.id : null

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    description: '',
    image: '',
    categoryId: '',
    stock: '',
  })

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchCategories()
    if (isEditing) {
      fetchProduct()
    } else {
      setLoading(false)
    }
  }, [user, router, isEditing, productId])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const product = await response.json()
        setFormData({
          title: product.title,
          price: product.price.toString(),
          description: product.description,
          image: product.image,
          categoryId: product.categoryId?.toString() || '',
          stock: product.stock?.toString() || '0',
        })
      }
    } catch (err) {
      setError('Error loading product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const url = isEditing ? `/api/products/${productId}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          categoryId: parseInt(formData.categoryId),
          stock: parseInt(formData.stock),
        }),
      })

      if (response.ok) {
        router.push('/admin')
        alert(isEditing ? 'Producto actualizado' : 'Producto creado')
      } else {
        const data = await response.json()
        setError(data.error || 'Error guardando producto')
      }
    } catch (err) {
      setError('Error guardando producto')
      console.error(err)
    } finally {
      setSubmitting(false)
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
          Acceso denegado
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Nombre del producto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Precio</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Categoría</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="preview"
                  className="mt-4 max-w-xs h-auto rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x300?text=Error+Loading'
                  }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Descripción detallada del producto"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting
                  ? 'Guardando...'
                  : isEditing
                  ? 'Actualizar Producto'
                  : 'Crear Producto'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
