import { Suspense } from 'react'
import { CheckoutForm } from '@/components/CheckoutForm'

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-muted rounded w-40 animate-pulse"></div>
                <div className="h-10 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutForm />
    </Suspense>
  )
}
