import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Heart } from 'lucide-react'
import { useAppDispatch } from '../../app/hooks'
import { addToCart } from '../../features/cart/cartSlice'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { formatPrice, truncateText, capitalizeFirst } from '../../lib/utils'
import type { Product } from '../../types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const { showSuccess } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
    showSuccess(`${truncateText(product.title, 30)} agregado al carrito`)
  }

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={product.image}
          alt={product.title}
          className={`w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Category Badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3"
        >
          {capitalizeFirst(product.category)}
        </Badge>

        {/* Like Button */}
        <button
          onClick={handleToggleLike}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
            isLiked
              ? 'bg-accent text-accent-foreground'
              : 'bg-card/80 backdrop-blur-sm hover:bg-card'
          }`}
          aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
          />
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            size="sm"
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-foreground line-clamp-2 min-h-[2.5rem]">
          {truncateText(product.title, 50)}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{product.rating.rate}</span>
          <span className="text-xs text-muted-foreground">
            ({product.rating.count} reseñas)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
