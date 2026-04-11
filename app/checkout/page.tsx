'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, Check, Package } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../lib/hooks'
import { clearCart } from '../../lib/features/cartSlice'
import { useToast } from '../../hooks/useToast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { EmptyState } from '../../components/ui/empty-state'
import { formatPrice } from '../../lib/utils'
import type { CheckoutFormData } from '../../lib/types'

export default function Checkout() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()
  
  const { items, total, itemCount } = useAppSelector((state) => state.cart)
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'España',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })
  
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout')
    }
  }, [isAuthenticated, router])

  const shipping = total >= 50 ? 0 : 4.99
  const tax = total * 0.21
  const finalTotal = total + shipping + tax

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Nombre requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido requerido'
    if (!formData.email.trim()) newErrors.email = 'Email requerido'
    if (!formData.address.trim()) newErrors.address = 'Dirección requerida'
    if (!formData.city.trim()) newErrors.city = 'Ciudad requerida'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Código postal requerido'
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta requerido'
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Fecha de expiración requerida'
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV requerido'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showError('Por favor, completa todos los campos requeridos')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate order number
    const order = `LUXE-${Date.now().toString(36).toUpperCase()}`
    setOrderNumber(order)
    
    dispatch(clearCart())
    setOrderComplete(true)
    showSuccess('Pedido realizado con éxito')
    setIsProcessing(false)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="Tu carrito está vacío"
          description="No hay artículos para realizar el pedido."
          action={
            <Link href="/">
              <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Volver a Comprar
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold">¡Pedido Confirmado!</h1>
            <p className="text-muted-foreground">Tu pedido ha sido realizado exitosamente.</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Número de pedido</p>
            <p className="font-mono font-bold text-lg">{orderNumber}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Recibirás un email de confirmación con los detalles de tu pedido.
          </p>
          <Link href="/">
            <Button className="w-full">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-serif text-3xl font-bold">Finalizar Compra</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
            {/* Información Personal */}
            <section className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                Información Personal
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="your name"
                />
                <Input
                  label="Apellido"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="your last name"
                />
              </div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="your@email.com"
              />
            </section>

            {/* Dirección de Envío */}
            <section className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                Dirección de Envío
              </h2>
              <Input
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="123 Main St"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Ciudad"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="Madrid"
                />
                <Input
                  label="Código Postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  placeholder="28001"
                />
              </div>
            </section>

            {/* Información de Pago */}
            <section className="space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                Información de Pago
              </h2>
              <Input
                label="Número de Tarjeta"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Fecha de Expiración"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  error={errors.expiryDate}
                  placeholder="MM/YY"
                />
                <Input
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  error={errors.cvv}
                  placeholder="123"
                />
              </div>
            </section>

            <Button type="submit" size="lg" disabled={isProcessing} className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              {isProcessing ? 'Procesando...' : 'Completar Pedido'}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-4">
              <h2 className="font-semibold text-lg">Resumen del Pedido</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
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

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-accent">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
