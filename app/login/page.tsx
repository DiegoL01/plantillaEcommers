import { Suspense } from 'react'
import { LoginForm } from '@/components/LoginForm'

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-pulse">
        <div className="h-8 bg-muted rounded mb-4 w-40 mx-auto"></div>
        <div className="h-4 bg-muted rounded mb-8 w-32 mx-auto"></div>
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
