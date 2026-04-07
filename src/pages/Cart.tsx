import { Link } from 'react-router-dom'
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { formatPrice } from '../lib/utils'

export const Cart = () => {
  const dispatch = useAppDispatch()
  const { showSuccess, showInfo } = useToast()
  
  const { items, total, itemCount } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.user)

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id: number, title: string) => {
    dispatch(removeFromCart(id))
    showInfo(`${title.slice(0, 30)}... eliminado del carrito`)
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    showSuccess('Carrito vaciado')
  }

  const shipping = total >= 50 ? 0 : 4.99
  const tax = total * 0.21
  const finalTotal = total + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="w-16 h-16" />}
          title="Tu carrito está vacío"
          description="Parece que aún no has agregado ningún producto. Descubre nuestra colección y encuentra algo que te encante."
          action={
            <Link to="/">
              <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Seguir Comprando
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold">Tu Carrito</h1>
              <p className="text-muted-foreground mt-1">
                {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
            <Button variant="ghost" onClick={handleClearCart} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Vaciar Carrito
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border"
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {item.category}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    {formatPrice(item.price)}
                  </p>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-input rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-muted transition-colors"
                        aria-label="Disminuir cantidad"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.title)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Resumen del Pedido</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} artículos)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success">Gratis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                    Añade {formatPrice(50 - total)} más para envío gratis
                  </p>
                )}

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}>
                  <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Proceder al Pago
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="w-full" size="lg">
                    Seguir Comprando
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Pago 100% seguro. Aceptamos todas las tarjetas principales.
                </p>
                <div className="flex justify-center gap-2 mt-3">
                  <img src="https://img.icons8.com/color/32/visa.png" alt="Visa" className="h-6" />
                  <img src="https://img.icons8.com/color/32/mastercard.png" alt="Mastercard" className="h-6" />
                  <img src="https://img.icons8.com/color/32/paypal.png" alt="PayPal" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
