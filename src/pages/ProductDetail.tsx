import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { fetchProductById, fetchProducts, clearCurrentProduct } from '../features/products/productSlice'
import { addToCart } from '../features/cart/cartSlice'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProductDetailSkeleton } from '../components/ui/Skeleton'
import { ProductCard } from '../components/product/ProductCard'
import { formatPrice, capitalizeFirst } from '../lib/utils'

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { showSuccess, showError, showInfo } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const { currentProduct, loading, error, items } = useAppSelector((state) => state.products)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)))
      dispatch(fetchProducts())
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
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to={`/?category=${currentProduct.category}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {capitalizeFirst(currentProduct.category)}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground truncate max-w-[200px]">
              {currentProduct.title}
            </span>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-card rounded-2xl border border-border overflow-hidden">
              <img
                src={galleryImages[selectedImage]}
                alt={currentProduct.title}
                className="w-full h-full object-contain p-8"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <Badge variant="secondary">
              {capitalizeFirst(currentProduct.category)}
            </Badge>

            {/* Title */}
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              {currentProduct.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(currentProduct.rating.rate)
                        ? 'fill-warning text-warning'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{currentProduct.rating.rate}</span>
              <span className="text-sm text-muted-foreground">
                ({currentProduct.rating.count} reseñas)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(currentProduct.price)}
              </p>
              <p className="text-sm text-muted-foreground">
                IVA incluido. Envío calculado al finalizar la compra.
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cantidad</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-input rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: {formatPrice(currentProduct.price * quantity)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="w-5 h-5" />}
              >
                Agregar al Carrito
              </Button>
              <Button
                size="lg"
                variant={isLiked ? 'secondary' : 'outline'}
                onClick={() => setIsLiked(!isLiked)}
                aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-accent' : ''}`} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
                aria-label="Compartir producto"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Envío Gratis</p>
                  <p className="text-xs text-muted-foreground">En pedidos +€50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Garantía</p>
                  <p className="text-xs text-muted-foreground">2 años</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Devoluciones</p>
                  <p className="text-xs text-muted-foreground">30 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold">Productos Relacionados</h2>
              <Link to={`/?category=${currentProduct.category}`}>
                <Button variant="ghost" rightIcon={<ArrowLeft className="w-4 h-4 rotate-180" />}>
                  Ver más
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
