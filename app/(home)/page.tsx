'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Truck, Shield, CreditCard } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../lib/hooks'
import { fetchProducts } from '../../lib/features/productSlice'
import { useToast } from '../../hooks/useToast'
import { ProductCard } from '../../components/product/ProductCard'
import { ProductFiltersWrapper } from '@/components/product/ProductFiltersWrapper' 
import { ProductCardSkeleton } from '../../components/ui/custom-skeleton'
import { EmptyState } from '../../components/ui/empty-state'
import { Button } from '../../components/ui/button'
import { Package } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En pedidos superiores a €50',
  },
  {
    icon: Shield,
    title: 'Garantía de Calidad',
    description: '30 días para devoluciones',
  },
  {
    icon: CreditCard,
    title: 'Pago Seguro',
    description: 'Transacciones 100% seguras',
  },
  {
    icon: Sparkles,
    title: 'Productos Premium',
    description: 'Selección de alta calidad',
  },
]

export default function Home() {
  const dispatch = useAppDispatch()
  const { showError } = useToast()
  
  const { filteredItems, loading, error } = useAppSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts() as any)
  }, [dispatch])

  useEffect(() => {
    if (error) {
      showError(error)
    }
  }, [error, showError])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Nueva Colección 2024
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Descubre el lujo en cada detalle
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Explora nuestra exclusiva selección de productos premium. Calidad excepcional que habla por sí misma.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/?category=women's clothing">
                  <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explorar Colección
                  </Button>
                </Link>
                <Link href="/?category=jewelery">
                  <Button variant="outline" size="lg">
                    Ver Joyería
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop"
                  alt="Colección de moda"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border border-border">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Productos Premium</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-card rounded-xl border border-border hover:border-accent transition-colors"
              >
                <feature.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-48 shrink-0">
              <ProductFiltersWrapper />
            </aside>

            <main className="flex-1">
              <div className="mb-6">
                <h2 className="font-serif text-3xl font-bold">Productos</h2>
                <p className="text-muted-foreground mt-1">
                  {loading ? 'Cargando...' : `${filteredItems.length} productos encontrados`}
                </p>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Package className="w-16 h-16" />}
                  title="No hay productos"
                  description="Prueba con otros filtros"
                />
              )}
            </main>
          </div>
        </div>
      </section>
               {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Únete a nuestra comunidad
            </h2>
            <p className="text-primary-foreground/80">
              Suscríbete para recibir ofertas exclusivas, nuevos lanzamientos y contenido especial.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 h-12 px-4 rounded-lg bg-primary-foreground text-primary placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Suscribirse
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
