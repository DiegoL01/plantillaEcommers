'use server'

import { stripe } from '@/lib/stripe'

export interface CartItemForCheckout {
  id: number
  title: string
  price: number
  quantity: number
  image: string
}

export interface CheckoutSessionResult {
  clientSecret: string | null
  error?: string
}

export async function createCheckoutSession(
  items: CartItemForCheckout[]
): Promise<CheckoutSessionResult> {
  try {
    if (!items || items.length === 0) {
      return { clientSecret: null, error: 'No hay items en el carrito' }
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          description: `Producto ID: ${item.id}`,
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }))

    // Create Checkout Session with embedded mode
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['ES', 'FR', 'DE', 'IT', 'PT', 'US', 'GB', 'MX', 'AR', 'CO'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    })

    return { clientSecret: session.client_secret }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return {
      clientSecret: null,
      error: error instanceof Error ? error.message : 'Error al crear la sesión de pago',
    }
  }
}

export async function getCheckoutSessionStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return {
      status: session.status,
      customerEmail: session.customer_details?.email,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error)
    return null
  }
}
