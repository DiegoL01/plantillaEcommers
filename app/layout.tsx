import type { Metadata } from 'next'
import './globals.css'
import { StoreProvider } from '../components/providers/StoreProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { LayoutClient } from '@/components/layout/LayoutClient'

export const metadata: Metadata = {
  title: 'NovaCart - Ecommerce Online',
  description: 'Compra productos seleccionados en NovaCart con catálogo actualizado, carrito, pedidos y panel de administración.',
  generator: 'next.js',
  keywords: ['ecommerce', 'compras online', 'productos premium', 'tienda online'],
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <StoreProvider>
            <LayoutClient>{children}</LayoutClient>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
