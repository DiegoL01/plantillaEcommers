import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Lock, Check, Package } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { clearCart } from '../features/cart/cartSlice'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'
import { formatPrice } from '../lib/utils'
import type { CheckoutFormData } from '../types'

export const Checkout = () => {
  const navigate = useNavigate()
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

  if (!isAuthenticated) {
    navigate('/login?redirect=/checkout')
    return null
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="Tu carrito está vacío"
          description="Agrega productos a tu carrito antes de proceder al pago"
          action={
            <Link to="/">
              <Button>Ir a la Tienda</Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
          <p className="text-muted-foreground mb-2">
            Gracias por tu compra. Hemos enviado los detalles a tu correo electrónico.
          </p>
          <p className="text-lg font-medium mb-8">
            Número de pedido: <span className="text-accent">{orderNumber}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button>Seguir Comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Completa tu pedido de forma segura</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg mb-4">Información de Envío</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="Juan"
                  />
                  <Input
                    label="Apellido"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="García"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="juan@email.com"
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Dirección"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="Calle Principal 123"
                    className="sm:col-span-2"
                  />
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
              </div>

              {/* Payment Info */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="font-semibold text-lg">Información de Pago</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Número de Tarjeta"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    error={errors.cardNumber}
                    placeholder="4242 4242 4242 4242"
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Fecha de Expiración"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    error={errors.expiryDate}
                    placeholder="MM/AA"
                  />
                  <Input
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleChange}
                    error={errors.cvv}
                    placeholder="123"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Tu información está protegida con encriptación SSL</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Resumen del Pedido</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                        <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{shipping === 0 ? <span className="text-success">Gratis</span> : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IVA (21%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  isLoading={isProcessing}
                  leftIcon={!isProcessing ? <Lock className="w-4 h-4" /> : undefined}
                >
                  {isProcessing ? 'Procesando...' : `Pagar ${formatPrice(finalTotal)}`}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
