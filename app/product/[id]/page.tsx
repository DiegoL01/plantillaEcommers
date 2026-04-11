'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../../lib/hooks'
import { fetchProductById, fetchProducts, clearCurrentProduct } from '../../../lib/features/productSlice'
import { addToCart } from '../../../lib/features/cartSlice'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { ProductDetailSkeleton } from '../../../components/ui/custom-skeleton'
import { ProductCard } from '../../../components/product/ProductCard'
import { formatPrice, capitalizeFirst } from '../../../lib/utils'

export default function ProductDetail() {
  const params = useParams()
  const id = params.id as string
  const dispatch = useAppDispatch()
  const { showSuccess, showError, showInfo } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const { currentProduct, loading, error, items } = useAppSelector((state) => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)) as any)
      dispatch(fetchProducts() as any)
    }
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (error) {
      showError(error)
    }
  }, [error, showError])

  const handleAddToCart = () => {
    if (currentProduct) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(currentProduct))
      }
      showSuccess(`${quantity} x ${currentProduct.title.slice(0, 30)}... agregado al carrito`)
      setQuantity(1)
    }
  }

  const handleShare = async () => {
    if (navigator.share && currentProduct) {
      try {
        await navigator.share({
          title: currentProduct.title,
          text: currentProduct.description,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      showInfo('Enlace copiado al portapapeles')
    }
  }

  const relatedProducts = items
    .filter(
      (item) =>
        item.category === currentProduct?.category && item.id !== currentProduct?.id
    )
    .slice(0, 4)

  // Generate fake gallery images (in real app these would come from API)
  const galleryImages = currentProduct
    ? [currentProduct.image, currentProduct.image, currentProduct.image, currentProduct.image]
    : []

  if (loading || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a productos
          </Link>
        </div>
      </div>

      {/* Product */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border">
              <img
                src={galleryImages[selectedImage]}
                alt={currentProduct.title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-accent' : 'border-border hover:border-accent/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary">{capitalizeFirst(currentProduct.category)}</Badge>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">{currentProduct.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        //asegurar que obejeto va aqui de la propiedad rating count o rate
                        i < Math.round(currentProduct.rating.count) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(125 reseñas)</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{currentProduct.description}</p>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Precio</p>
              <p className="text-4xl font-bold text-accent">{formatPrice(currentProduct.price)}</p>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Cantidad</p>
              <div className="flex items-center gap-2 w-fit">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" leftIcon={<ShoppingBag className="w-4 h-4" />} onClick={handleAddToCart}>
                Agregar al carrito
              </Button>
              <Button size="lg" variant="outline"  onClick={() => setIsLiked(!isLiked)}>
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
              <Button size="lg" variant="outline"  onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Envío Gratis</p>
                  <p className="text-xs text-muted-foreground">En pedidos superiores a €50</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Garantía de Calidad</p>
                  <p className="text-xs text-muted-foreground">30 días para devoluciones</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Devoluciones Fáciles</p>
                  <p className="text-xs text-muted-foreground">Proceso sin complicaciones</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-serif text-2xl font-bold mb-8">Productos Relacionados</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
