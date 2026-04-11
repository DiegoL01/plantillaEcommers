'use client'

import Link from 'next/link'
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../lib/hooks'
import { removeFromCart, updateQuantity, clearCart } from '../../lib/features/cartSlice'
import { useToast } from '../../hooks/useToast'
import { Button } from '../../components/ui/button'
import { EmptyState } from '../../components/ui/empty-state'
import { formatPrice } from '../../lib/utils'

export default function Cart() {
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
            <Link href="/">
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
                <Link href={`/product/${item.id}`} className="shrink-0">
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
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{formatPrice(item.price)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveItem(item.id, item.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-4">
              <h2 className="font-semibold text-lg">Resumen del Pedido</h2>

              <div className="space-y-2 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium">{shipping > 0 ? formatPrice(shipping) : 'Gratis'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-accent">{formatPrice(finalTotal)}</span>
              </div>

              <Link href={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}>
                <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Proceder al pago
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  Seguir Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
